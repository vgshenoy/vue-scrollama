<template>
  <div
    ref="root"
    class="scrollama__steps"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, useAttrs } from 'vue';
import {
  useScrollama,
  type ScrollamaCallbackPayload,
  type ScrollamaProgressPayload,
} from './useScrollama';

defineOptions({
  name: 'Scrollama',
  inheritAttrs: false,
});

const emit = defineEmits(['step-progress', 'step-enter', 'step-exit']);

const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const stepProgressListener = getCurrentInstance()?.vnode.props?.onStepProgress;
const hasProgressListener = !!stepProgressListener;

useScrollama({
  container: root,
  ...attrs,
  progress: hasProgressListener,
  onStepEnter: (resp: ScrollamaCallbackPayload) => emit('step-enter', resp),
  onStepExit: (resp: ScrollamaCallbackPayload) => emit('step-exit', resp),
  onStepProgress: (resp: ScrollamaProgressPayload) => emit('step-progress', resp),
});
</script>
