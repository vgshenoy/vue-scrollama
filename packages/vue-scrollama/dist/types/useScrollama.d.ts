import { type DeepReadonly, type Ref } from 'vue';
export interface ScrollamaCallbackPayload {
    element: HTMLElement;
    index: number;
    direction: 'up' | 'down';
}
export interface ScrollamaProgressPayload extends ScrollamaCallbackPayload {
    progress: number;
}
type ElementRef = Ref<HTMLElement | null>;
export interface UseScrollamaOptions {
    container: HTMLElement | ElementRef;
    stepSelector?: string;
    offset?: number;
    progress?: boolean;
    once?: boolean;
    threshold?: number;
    debug?: boolean;
    parent?: string | HTMLElement;
    onStepEnter?: (payload: ScrollamaCallbackPayload) => void;
    onStepExit?: (payload: ScrollamaCallbackPayload) => void;
    onStepProgress?: (payload: ScrollamaProgressPayload) => void;
    [key: string]: unknown;
}
export interface UseScrollamaControls {
    resize: () => boolean;
    destroy: () => void;
    rebuild: () => boolean;
    isReady: DeepReadonly<Ref<boolean>>;
}
export declare function useScrollama(options: UseScrollamaOptions): UseScrollamaControls;
export {};
