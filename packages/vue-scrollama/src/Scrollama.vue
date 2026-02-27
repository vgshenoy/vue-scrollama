<template>
  <div
    ref="root"
    class="scrollama__steps"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import {
  useScrollama,
  type ScrollamaCallbackPayload,
  type ScrollamaSetupOptions,
  type ScrollamaProgressPayload,
} from './useScrollama';

defineOptions({
  name: 'Scrollama',
  inheritAttrs: false,
});

interface ScrollamaProps extends ScrollamaSetupOptions {
  stepSelector?: string;
}

const props = defineProps<ScrollamaProps>();

const emit = defineEmits<{
  'step-enter': [payload: ScrollamaCallbackPayload];
  'step-exit': [payload: ScrollamaCallbackPayload];
  'step-progress': [payload: ScrollamaProgressPayload];
}>();

const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const stepProgressListener = getCurrentInstance()?.vnode.props?.onStepProgress;
const hasProgressListener = !!stepProgressListener;
let stepMutationObserver: MutationObserver | null = null;

const { rebuild } = useScrollama({
  container: root,
  ...props,
  progress: hasProgressListener || props.progress,
  onStepEnter: (resp: ScrollamaCallbackPayload) => emit('step-enter', resp),
  onStepExit: (resp: ScrollamaCallbackPayload) => emit('step-exit', resp),
  onStepProgress:
    hasProgressListener || props.progress
      ? (resp: ScrollamaProgressPayload) => emit('step-progress', resp)
      : undefined,
});

onMounted(() => {
  if (!root.value || typeof MutationObserver === 'undefined') return;

  stepMutationObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.type === 'childList')) {
      rebuild();
    }
  });
  stepMutationObserver.observe(root.value, { childList: true });
});

onBeforeUnmount(() => {
  if (stepMutationObserver) {
    stepMutationObserver.disconnect();
    stepMutationObserver = null;
  }
});
</script>
