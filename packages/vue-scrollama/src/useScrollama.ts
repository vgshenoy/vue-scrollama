import { onBeforeUnmount, onMounted, readonly, ref } from 'vue';
import scrollama from 'scrollama';

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

function resolveContainerElement(maybeRef: unknown): HTMLElement | null {
  if (
    maybeRef &&
    typeof maybeRef === 'object' &&
    'value' in maybeRef &&
    (maybeRef as { value: unknown }).value instanceof HTMLElement
  ) {
    return (maybeRef as { value: HTMLElement }).value;
  }
  return maybeRef instanceof HTMLElement ? maybeRef : null;
}

function resolveStepElements(container: HTMLElement, selector?: string): HTMLElement[] {
  if (selector) {
    return Array.from(container.querySelectorAll(selector)).filter(
      (node): node is HTMLElement => node instanceof HTMLElement
    );
  }
  return Array.from(container.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );
}

export function useScrollama(options: UseScrollamaOptions): UseScrollamaControls {
  let scroller: ReturnType<typeof scrollama> | null = null;
  const isReady = ref(false);

  let handleResize: (() => void) | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const warn = (message: string): void => {
    if ((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV) {
      console.warn(`[vue-scrollama] ${message}`);
    }
  };

  const resize = (): boolean => {
    if (!scroller || !isReady.value) return false;
    scroller.resize();
    return true;
  };

  const destroy = (): void => {
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

  const setupScroller = (): boolean => {
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

    const setupOpts: ScrollamaSetupOptions & { step: HTMLElement[] } = {
      step: stepElements,
    };

    if (options.offset !== undefined) setupOpts.offset = options.offset;
    if (options.progress !== undefined) setupOpts.progress = options.progress;
    if (options.once !== undefined) setupOpts.once = options.once;
    if (options.threshold !== undefined) setupOpts.threshold = options.threshold;
    if (options.debug !== undefined) setupOpts.debug = options.debug;
    if (options.root !== undefined) setupOpts.root = options.root;

    if (options.onStepProgress && !setupOpts.progress) {
      if (options.progress === false) {
        warn('`onStepProgress` provided with `progress: false`; auto-enabling `progress`.');
      }
      setupOpts.progress = true;
    }

    // scrollama types are stricter than runtime: offset/threshold use literal unions,
    // root is undeclared, and ProgressCallbackResponse omits direction.
    scroller.setup(setupOpts as any);

    if (options.onStepEnter) scroller.onStepEnter(options.onStepEnter as any);
    if (options.onStepExit) scroller.onStepExit(options.onStepExit as any);
    if (options.onStepProgress) scroller.onStepProgress(options.onStepProgress as any);

    isReady.value = true;
    return true;
  };

  const rebuild = (): boolean => {
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
