export interface ScrollamaCallbackPayload {
    element: HTMLElement;
    index: number;
    direction: 'up' | 'down';
}
export interface ScrollamaProgressPayload extends ScrollamaCallbackPayload {
    progress: number;
}
type ElementRef = import('vue').Ref<HTMLElement | null>;
export interface ScrollamaSetupOptions {
    offset?: number;
    progress?: boolean;
    once?: boolean;
    threshold?: number;
    debug?: boolean;
    root?: string | HTMLElement;
}
export interface UseScrollamaOptions extends ScrollamaSetupOptions {
    container: HTMLElement | ElementRef;
    stepSelector?: string;
    onStepEnter?: (payload: ScrollamaCallbackPayload) => void;
    onStepExit?: (payload: ScrollamaCallbackPayload) => void;
    onStepProgress?: (payload: ScrollamaProgressPayload) => void;
}
export interface UseScrollamaControls {
    resize: () => boolean;
    destroy: () => void;
    rebuild: () => boolean;
    isReady: import('vue').DeepReadonly<import('vue').Ref<boolean>>;
}
export declare function useScrollama(options: UseScrollamaOptions): UseScrollamaControls;
export {};
