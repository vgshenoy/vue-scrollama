import { onMounted, onBeforeUnmount } from 'vue';
import scrollama from 'scrollama';

/**
 * @typedef {Object} ScrollamaCallbackPayload
 * @property {HTMLElement} element
 * @property {number} index
 * @property {string} direction
 */

/**
 * @typedef {Object} ScrollamaProgressPayload
 * @property {HTMLElement} element
 * @property {number} index
 * @property {string} direction
 * @property {number} progress
 */

/**
 * @typedef {Object} UseScrollamaOptions
 * @property {string | HTMLElement | HTMLElement[]} step - Step elements selector or elements
 * @property {number} [offset] - Trigger offset (0-1)
 * @property {boolean} [progress] - Enable step-progress tracking
 * @property {boolean} [once] - Only trigger once per step
 * @property {number} [threshold] - IntersectionObserver threshold
 * @property {boolean} [debug] - Show debug overlay
 * @property {(payload: ScrollamaCallbackPayload) => void} [onStepEnter]
 * @property {(payload: ScrollamaCallbackPayload) => void} [onStepExit]
 * @property {(payload: ScrollamaProgressPayload) => void} [onStepProgress]
 */

/**
 * SSR-safe composable for scrollama scroll-driven interactions.
 *
 * All DOM and window access is deferred to `onMounted`, so calling this
 * during server render is safe (it simply no-ops until the client lifecycle).
 *
 * @param {UseScrollamaOptions} options
 */
export function useScrollama(options) {
  let scroller = null;

  /** @type {(() => void) | null} */
  let handleResize = null;

  onMounted(() => {
    scroller = scrollama();

    const setupOpts = /** @type {Record<string, unknown>} */ ({});
    const reservedKeys = ['onStepEnter', 'onStepExit', 'onStepProgress'];

    for (const [key, value] of Object.entries(options)) {
      if (!reservedKeys.includes(key)) {
        setupOpts[key] = value;
      }
    }

    scroller.setup(/** @type {any} */ (setupOpts));

    if (options.onStepEnter) {
      scroller.onStepEnter(options.onStepEnter);
    }
    if (options.onStepExit) {
      scroller.onStepExit(options.onStepExit);
    }
    if (options.onStepProgress) {
      scroller.onStepProgress(/** @type {any} */ (options.onStepProgress));
    }

    handleResize = () => {
      if (scroller) scroller.resize();
    };
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    if (scroller) {
      scroller.destroy();
      scroller = null;
    }
    if (handleResize) {
      window.removeEventListener('resize', handleResize);
      handleResize = null;
    }
  });
}
