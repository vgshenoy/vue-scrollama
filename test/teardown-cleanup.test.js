import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Scrollama from '../src/Scrollama.vue';

let mockScroller;

vi.mock('scrollama', () => ({
  default: () => {
    mockScroller = {
      setup: vi.fn(() => mockScroller),
      onStepEnter: vi.fn(() => mockScroller),
      onStepExit: vi.fn(() => mockScroller),
      onStepProgress: vi.fn(() => mockScroller),
      destroy: vi.fn(),
      resize: vi.fn(),
    };
    return mockScroller;
  },
}));

describe('teardown and resize cleanup', () => {
  /** @type {ReturnType<typeof vi.spyOn>} */
  let addSpy;
  /** @type {ReturnType<typeof vi.spyOn>} */
  let removeSpy;

  beforeEach(() => {
    mockScroller = null;
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('calls destroy() exactly once on unmount', () => {
    const wrapper = mount(Scrollama);
    // destroy is called once during setup() before re-initializing
    const setupDestroyCalls = mockScroller.destroy.mock.calls.length;

    wrapper.unmount();

    // One additional destroy call during beforeUnmount
    expect(mockScroller.destroy.mock.calls.length).toBe(setupDestroyCalls + 1);
  });

  it('removes window resize listener on unmount', () => {
    const wrapper = mount(Scrollama);
    removeSpy.mockClear();

    wrapper.unmount();

    const resizeRemoves = removeSpy.mock.calls.filter(
      ([event]) => event === 'resize'
    );
    expect(resizeRemoves).toHaveLength(1);
  });

  it('does not leak resize listeners across mount/unmount cycles', () => {
    const wrapper = mount(Scrollama);
    wrapper.unmount();

    // After unmount, the listener added during mount should be removed
    const resizeAdds = addSpy.mock.calls.filter(([event]) => event === 'resize');
    const resizeRemoves = removeSpy.mock.calls.filter(([event]) => event === 'resize');
    expect(resizeAdds.length).toBe(resizeRemoves.length);
  });
});
