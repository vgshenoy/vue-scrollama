import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
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
    const emits = Array.isArray(Scrollama.emits)
      ? Scrollama.emits
      : Object.keys(Scrollama.emits ?? {});
    expect(emits).toEqual(expect.arrayContaining(['step-progress', 'step-enter', 'step-exit']));
    expect(emits).toHaveLength(3);
  });

  it('wires callbacks only after mount', () => {
    // Before mount, no callbacks should exist
    expect(callbacks.stepEnter).toBeUndefined();

    const wrapper = mount(Scrollama);

    // After mount, enter/exit callbacks are always registered.
    // Progress callback is only registered when progress tracking is enabled.
    expect(callbacks.stepEnter).toBeTypeOf('function');
    expect(callbacks.stepExit).toBeTypeOf('function');
    expect(callbacks.stepProgress).toBeUndefined();

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
    const wrapper = mount(Scrollama, {
      attrs: {
        onStepProgress: vi.fn(),
      },
    });

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
    const wrapper = mount(Scrollama, {
      attrs: {
        onStepProgress: vi.fn(),
      },
    });

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

  it('forwards non-scrollama attrs to root element', () => {
    const wrapper = mount(Scrollama, {
      attrs: {
        id: 'story-steps',
        role: 'region',
        'data-track': 'scrollytelling',
      },
    });

    const root = wrapper.get('.scrollama__steps');
    expect(root.attributes('id')).toBe('story-steps');
    expect(root.attributes('role')).toBe('region');
    expect(root.attributes('data-track')).toBe('scrollytelling');

    const setupArg = mockScroller.setup.mock.calls[0][0];
    expect(setupArg).not.toHaveProperty('id');
    expect(setupArg).not.toHaveProperty('role');
    expect(setupArg).not.toHaveProperty('data-track');

    wrapper.unmount();
  });

  it('rebuilds when default slot child count changes', async () => {
    const Host = defineComponent({
      components: { Scrollama },
      setup() {
        const count = ref(1);
        return { count };
      },
      template: `
        <Scrollama>
          <div v-for="n in count" :key="n">Step {{ n }}</div>
        </Scrollama>
      `,
    });

    const wrapper = mount(Host);
    expect(mockScroller.setup).toHaveBeenCalledTimes(1);
    expect(mockScroller.destroy).toHaveBeenCalledTimes(0);

    wrapper.vm.count = 2;
    await nextTick();
    await nextTick();

    expect(mockScroller.destroy).toHaveBeenCalledTimes(1);
    expect(mockScroller.setup).toHaveBeenCalledTimes(2);

    wrapper.unmount();
  });
});
