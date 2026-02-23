/**
 * SSR-safe composable for scrollama scroll-driven interactions.
 *
 * All DOM and window access is deferred to `onMounted`, so calling this
 * during server render is safe (it simply no-ops until the client lifecycle).
 *
 * @param {UseScrollamaOptions} options
 * @returns {UseScrollamaControls}
 */
export function useScrollama(options: UseScrollamaOptions): UseScrollamaControls;
export type ScrollamaCallbackPayload = {
    element: HTMLElement;
    index: number;
    direction: "up" | "down";
};
export type ScrollamaProgressPayload = {
    element: HTMLElement;
    index: number;
    direction: "up" | "down";
    progress: number;
};
export type ElementRef = import("vue").Ref<HTMLElement | null>;
export type UseScrollamaOptions = {
    /**
     * - Step container element or Vue ref
     */
    container: HTMLElement | ElementRef;
    /**
     * - CSS selector to match steps inside container
     */
    stepSelector?: string;
    /**
     * - Trigger offset (0-1)
     */
    offset?: number;
    /**
     * - Enable step-progress tracking
     */
    progress?: boolean;
    /**
     * - Only trigger once per step
     */
    once?: boolean;
    /**
     * - IntersectionObserver threshold
     */
    threshold?: number;
    /**
     * - Show debug overlay
     */
    debug?: boolean;
    /**
     * - Scroll container for non-window scrolling
     */
    parent?: string | HTMLElement;
    onStepEnter?: (payload: ScrollamaCallbackPayload) => void;
    onStepExit?: (payload: ScrollamaCallbackPayload) => void;
    onStepProgress?: (payload: ScrollamaProgressPayload) => void;
};
export type UseScrollamaControls = {
    /**
     * - Triggers scrollama.resize when ready
     */
    resize: () => boolean;
    /**
     * - Tears down observers/listeners and destroys the scroller
     */
    destroy: () => void;
    /**
     * - Recreates step wiring from current container state
     */
    rebuild: () => boolean;
    /**
     * - Reactive readiness flag
     */
    isReady: import("vue").DeepReadonly<import("vue").Ref<boolean>>;
};
