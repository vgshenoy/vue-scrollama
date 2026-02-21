import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useScrollama } from '../src/useScrollama.js';

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

/**
 * Helper to create a wrapper component that calls useScrollama.
 * @param {Parameters<typeof useScrollama>[0]} options
 */
function createHost(options) {
  return defineComponent({
    setup() {
      useScrollama(options);
      return () => h('div', { class: 'steps' }, [h('div', 'Step 1')]);
    },
  });
}

describe('useScrollama composable', () => {
  /** @type {ReturnType<typeof vi.spyOn>} */
  let addSpy;
  /** @type {ReturnType<typeof vi.spyOn>} */
  let removeSpy;

  beforeEach(() => {
    callbacks = {};
    mockScroller = null;
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('calls scrollama setup with forwarded options on mount', () => {
    const wrapper = mount(createHost({ step: '.step', offset: 0.5 }));

    expect(mockScroller.setup).toHaveBeenCalledWith({ step: '.step', offset: 0.5 });

    wrapper.unmount();
  });

  it('wires onStepEnter callback', () => {
    const onStepEnter = vi.fn();
    const wrapper = mount(createHost({ step: '.step', onStepEnter }));

    expect(mockScroller.onStepEnter).toHaveBeenCalled();

    const payload = { element: document.createElement('div'), index: 0, direction: 'down' };
    callbacks.stepEnter(payload);
    expect(onStepEnter).toHaveBeenCalledWith(payload);

    wrapper.unmount();
  });

  it('wires onStepExit callback', () => {
    const onStepExit = vi.fn();
    const wrapper = mount(createHost({ step: '.step', onStepExit }));

    expect(mockScroller.onStepExit).toHaveBeenCalled();

    const payload = { element: document.createElement('div'), index: 1, direction: 'up' };
    callbacks.stepExit(payload);
    expect(onStepExit).toHaveBeenCalledWith(payload);

    wrapper.unmount();
  });

  it('wires onStepProgress callback only when provided', () => {
    const wrapper = mount(createHost({ step: '.step' }));

    // No onStepProgress provided, so it should not be wired
    expect(mockScroller.onStepProgress).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('wires onStepProgress callback when provided', () => {
    const onStepProgress = vi.fn();
    const wrapper = mount(createHost({ step: '.step', onStepProgress }));

    expect(mockScroller.onStepProgress).toHaveBeenCalled();

    const payload = { element: document.createElement('div'), index: 0, direction: 'down', progress: 0.5 };
    callbacks.stepProgress(payload);
    expect(onStepProgress).toHaveBeenCalledWith(payload);

    wrapper.unmount();
  });

  it('does not call scrollama before mount (SSR-safe)', () => {
    // Just creating the component definition should not invoke scrollama
    const Host = createHost({ step: '.step' });

    // scrollama() is only called when mounted
    expect(mockScroller).toBeNull();

    const wrapper = mount(Host);
    expect(mockScroller).not.toBeNull();

    wrapper.unmount();
  });

  it('calls destroy and removes resize listener on unmount', () => {
    const wrapper = mount(createHost({ step: '.step' }));

    removeSpy.mockClear();
    wrapper.unmount();

    expect(mockScroller.destroy).toHaveBeenCalled();

    const resizeRemoves = removeSpy.mock.calls.filter(
      ([event]) => event === 'resize'
    );
    expect(resizeRemoves).toHaveLength(1);
  });

  it('does not pass callback options to scrollama.setup()', () => {
    const wrapper = mount(createHost({
      step: '.step',
      offset: 0.3,
      onStepEnter: vi.fn(),
      onStepExit: vi.fn(),
      onStepProgress: vi.fn(),
    }));

    const setupArg = mockScroller.setup.mock.calls[0][0];
    expect(setupArg).toEqual({ step: '.step', offset: 0.3 });
    expect(setupArg).not.toHaveProperty('onStepEnter');
    expect(setupArg).not.toHaveProperty('onStepExit');
    expect(setupArg).not.toHaveProperty('onStepProgress');

    wrapper.unmount();
  });
});
