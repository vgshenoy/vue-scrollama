import Scrollama from "./Scrollama.vue";

const globalVue =
  typeof globalThis !== 'undefined'
    ? /** @type {{ component?: (name: string, definition: unknown) => void } | undefined} */ (globalThis.Vue)
    : undefined;

if (globalVue && typeof globalVue.component === 'function') {
  globalVue.component('Scrollama', Scrollama);
}

export default Scrollama;
