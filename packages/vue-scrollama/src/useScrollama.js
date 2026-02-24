import { onMounted, onBeforeUnmount, readonly, ref } from 'vue';
import scrollama from 'scrollama';

/**
 * @typedef {Object} ScrollamaCallbackPayload
 * @property {HTMLElement} element
 * @property {number} index
 * @property {'up' | 'down'} direction
 */

/**
 * @typedef {Object} ScrollamaProgressPayload
 * @property {HTMLElement} element
 * @property {number} index
 * @property {'up' | 'down'} direction
 * @property {number} progress
 */

/**
 * @typedef {import('vue').Ref<HTMLElement | null>} ElementRef
 */

/**
 * @typedef {Object} UseScrollamaOptions
 * @property {HTMLElement | ElementRef} container - Step container element or Vue ref
 * @property {string} [stepSelector] - CSS selector to match steps inside container
 * @property {number} [offset] - Trigger offset (0-1)
 * @property {boolean} [progress] - Enable step-progress tracking
 * @property {boolean} [once] - Only trigger once per step
 * @property {number} [threshold] - IntersectionObserver threshold
 * @property {boolean} [debug] - Show debug overlay
 * @property {string | HTMLElement} [parent] - Scroll container for non-window scrolling
 * @property {(payload: ScrollamaCallbackPayload) => void} [onStepEnter]
 * @property {(payload: ScrollamaCallbackPayload) => void} [onStepExit]
 * @property {(payload: ScrollamaProgressPayload) => void} [onStepProgress]
 */

/**
 * @typedef {Object} UseScrollamaControls
 * @property {() => boolean} resize - Triggers scrollama.resize when ready
 * @property {() => void} destroy - Tears down observers/listeners and destroys the scroller
 * @property {() => boolean} rebuild - Recreates step wiring from current container state
 * @property {import('vue').DeepReadonly<import('vue').Ref<boolean>>} isReady - Reactive readiness flag
 */

const INTERNAL_OPTION_KEYS = new Set([
  'container',
  'stepSelector',
  'step',
  'onStepEnter',
  'onStepExit',
  'onStepProgress',
]);

/**
 * @param {unknown} maybeRef
 * @returns {HTMLElement | null}
 */
function resolveContainerElement(maybeRef) {
  if (maybeRef && typeof maybeRef === 'object' && 'value' in maybeRef) {
    return maybeRef.value instanceof HTMLElement ? maybeRef.value : null;
  }
  return maybeRef instanceof HTMLElement ? maybeRef : null;
}

/**
 * @param {HTMLElement} container
 * @param {string | undefined} selector
 * @returns {HTMLElement[]}
 */
function resolveStepElements(container, selector) {
  if (selector) {
    return Array.from(container.querySelectorAll(selector)).filter(
      (node) => node instanceof HTMLElement
    );
  }
  return Array.from(container.children).filter((node) => node instanceof HTMLElement);
}

/**
 * SSR-safe composable for scrollama scroll-driven interactions.
 *
 * All DOM and window access is deferred to `onMounted`, so calling this
 * during server render is safe (it simply no-ops until the client lifecycle).
 *
 * @param {UseScrollamaOptions} options
 * @returns {UseScrollamaControls}
 */
export function useScrollama(options) {
  let scroller = null;
  const isReady = ref(false);

  /** @type {(() => void) | null} */
  let handleResize = null;
  /** @type {ResizeObserver | null} */
  let resizeObserver = null;

  /**
   * @param {string} message
   */
  const warn = (message) => {
    if (import.meta.env?.DEV) {
      console.warn(`[vue-scrollama] ${message}`);
    }
  };

  const resize = () => {
    if (!scroller || !isReady.value) return false;
    scroller.resize();
    return true;
  };

  const destroy = () => {
    isReady.value = false;

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (handleResize) {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      handleResize = null;
    }
    if (scroller) {
      scroller.destroy();
    }
  };

  const setupScroller = () => {
    if (!scroller) return false;

    const containerEl = resolveContainerElement(options.container);
    if (!containerEl) {
      warn('Expected `container` to resolve to an HTMLElement on mount.');
      return false;
    }

    const stepElements = resolveStepElements(containerEl, options.stepSelector);
    if (stepElements.length === 0 && options.stepSelector) {
      warn('No step elements found in container. Check `stepSelector` or children.');
    }

    const setupOpts = /** @type {Record<string, unknown>} */ ({ step: stepElements });

    for (const [key, value] of Object.entries(options)) {
      if (!INTERNAL_OPTION_KEYS.has(key)) {
        setupOpts[key] = value;
      }
    }

    scroller.setup(/** @type {any} */ (setupOpts));

    if (options.onStepEnter) scroller.onStepEnter(options.onStepEnter);
    if (options.onStepExit) scroller.onStepExit(options.onStepExit);
    if (options.onStepProgress) {
      scroller.onStepProgress(/** @type {any} */ (options.onStepProgress));
    }

    isReady.value = true;
    return true;
  };

  const rebuild = () => {
    if (!scroller) return false;
    scroller.destroy();
    isReady.value = false;
    return setupScroller();
  };

  onMounted(() => {
    scroller = scrollama();
    setupScroller();

    handleResize = () => {
      resize();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize, { passive: true });

    const containerEl = resolveContainerElement(options.container);
    if (containerEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(containerEl);
    }
  });

  onBeforeUnmount(() => {
    destroy();
    scroller = null;
  });

  return {
    resize,
    destroy,
    rebuild,
    isReady: readonly(isReady),
  };
}
