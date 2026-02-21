import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Scrollama from '../src/Scrollama.vue';

// Capture callbacks registered via scrollama's chainable API
let callbacks;
let mockScroller;

vi.mock('scrollama', () => ({
  default: () => {
    callbacks = {};
    mockScroller = {
      setup: vi.fn(() => mockScroller),
      onStepEnter: vi.fn((cb) => { callbacks.stepEnter = cb; return mockScroller; }),
      onStepExit: vi.fn((cb) => { callbacks.stepExit = cb; return mockScroller; }),
      onStepProgress: vi.fn((cb) => { callbacks.stepProgress = cb; return mockScroller; }),
      destroy: vi.fn(),
      resize: vi.fn(),
    };
    return mockScroller;
  },
}));

describe('emitted event contract', () => {
  beforeEach(() => {
    callbacks = {};
    mockScroller = null;
  });

  it('emits exactly step-enter, step-exit, and step-progress', () => {
    expect(Scrollama.emits).toEqual(['step-progress', 'step-enter', 'step-exit']);
  });

  it('wires callbacks only after mount', () => {
    // Before mount, no callbacks should exist
    expect(callbacks.stepEnter).toBeUndefined();

    const wrapper = mount(Scrollama);

    // After mount, all three callbacks should be registered
    expect(callbacks.stepEnter).toBeTypeOf('function');
    expect(callbacks.stepExit).toBeTypeOf('function');
    expect(callbacks.stepProgress).toBeTypeOf('function');

    wrapper.unmount();
  });

  it('emits step-enter with element, index, direction payload keys', () => {
    const wrapper = mount(Scrollama);

    const payload = { element: document.createElement('div'), index: 0, direction: 'down' };
    callbacks.stepEnter(payload);

    const emitted = wrapper.emitted('step-enter');
    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toHaveProperty('element');
    expect(emitted[0][0]).toHaveProperty('index');
    expect(emitted[0][0]).toHaveProperty('direction');

    wrapper.unmount();
  });

  it('emits step-exit with element, index, direction payload keys', () => {
    const wrapper = mount(Scrollama);

    const payload = { element: document.createElement('div'), index: 1, direction: 'up' };
    callbacks.stepExit(payload);

    const emitted = wrapper.emitted('step-exit');
    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toHaveProperty('element');
    expect(emitted[0][0]).toHaveProperty('index');
    expect(emitted[0][0]).toHaveProperty('direction');

    wrapper.unmount();
  });

  it('emits step-progress with element, index, direction, and progress payload keys', () => {
    const wrapper = mount(Scrollama);

    const payload = { element: document.createElement('div'), index: 0, direction: 'down', progress: 0.5 };
    callbacks.stepProgress(payload);

    const emitted = wrapper.emitted('step-progress');
    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toHaveProperty('element');
    expect(emitted[0][0]).toHaveProperty('index');
    expect(emitted[0][0]).toHaveProperty('direction');
    expect(emitted[0][0]).toHaveProperty('progress');

    wrapper.unmount();
  });

  it('passes payload values through unchanged', () => {
    const wrapper = mount(Scrollama);

    const el = document.createElement('div');
    const payload = { element: el, index: 2, direction: 'down', progress: 0.75 };
    callbacks.stepProgress(payload);

    const emitted = /** @type {any} */ (wrapper.emitted('step-progress')[0][0]);
    expect(emitted.element).toBe(el);
    expect(emitted.index).toBe(2);
    expect(emitted.direction).toBe('down');
    expect(emitted.progress).toBe(0.75);

    wrapper.unmount();
  });
});
