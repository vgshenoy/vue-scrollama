<template>
  <div ref="root" class="scrollama__steps">
    <slot />
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import { useScrollama } from './useScrollama.js';

export default {
  name: 'Scrollama',
  inheritAttrs: false,
  emits: ['step-progress', 'step-enter', 'step-exit'],
  setup(_, { emit, attrs }) {
    const root = ref(null);
    const instance = getCurrentInstance();
    const listenerProps = instance?.vnode?.props ?? {};
    const hasProgressListener = Object.prototype.hasOwnProperty.call(
      listenerProps,
      'onStepProgress'
    );

    useScrollama({
      get step() { return Array.from(root.value.children); },
      ...attrs,
      progress: hasProgressListener,
      onStepEnter: (resp) => emit('step-enter', resp),
      onStepExit: (resp) => emit('step-exit', resp),
      onStepProgress: (resp) => emit('step-progress', resp),
    });

    return { root };
  },
};
</script>
