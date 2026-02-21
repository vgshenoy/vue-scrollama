import { openBlock, createElementBlock, renderSlot } from "vue";
function selectAll(selector, parent = document) {
  if (typeof selector === "string") {
    return Array.from(parent.querySelectorAll(selector));
  } else if (selector instanceof Element) {
    return [selector];
  } else if (selector instanceof NodeList) {
    return Array.from(selector);
  } else if (selector instanceof Array) {
    return selector;
  }
  return [];
}
function getOffsetId(id) {
  return `scrollama__debug-offset--${id}`;
}
function setupOffset({ id, offsetVal, stepClass }) {
  const el = document.createElement("div");
  el.id = getOffsetId(id);
  el.className = "scrollama__debug-offset";
  el.style.position = "fixed";
  el.style.left = "0";
  el.style.width = "100%";
  el.style.height = "0";
  el.style.borderTop = "2px dashed black";
  el.style.zIndex = "9999";
  const p = document.createElement("p");
  p.innerHTML = `".${stepClass}" trigger: <span>${offsetVal}</span>`;
  p.style.fontSize = "12px";
  p.style.fontFamily = "monospace";
  p.style.color = "black";
  p.style.margin = "0";
  p.style.padding = "6px";
  el.appendChild(p);
  document.body.appendChild(el);
}
function setup({ id, offsetVal, stepEl }) {
  const stepClass = stepEl[0].className;
  setupOffset({ id, offsetVal, stepClass });
}
function update({ id, offsetMargin, offsetVal, format }) {
  const post = format === "pixels" ? "px" : "";
  const idVal = getOffsetId(id);
  const el = document.getElementById(idVal);
  el.style.top = `${offsetMargin}px`;
  el.querySelector("span").innerText = `${offsetVal}${post}`;
}
function notifyStep({ id, index, state }) {
  const prefix = `scrollama__debug-step--${id}-${index}`;
  const elA = document.getElementById(`${prefix}_above`);
  const elB = document.getElementById(`${prefix}_below`);
  const display = state === "enter" ? "block" : "none";
  if (elA) elA.style.display = display;
  if (elB) elB.style.display = display;
}
function scrollama() {
  const OBSERVER_NAMES = [
    "stepAbove",
    "stepBelow",
    "stepProgress",
    "viewportAbove",
    "viewportBelow"
  ];
  let cb = {};
  let io = {};
  let id = null;
  let stepEl = [];
  let stepOffsetHeight = [];
  let stepOffsetTop = [];
  let stepStates = [];
  let offsetVal = 0;
  let offsetMargin = 0;
  let viewH = 0;
  let pageH = 0;
  let previousYOffset = 0;
  let progressThreshold = 0;
  let isReady = false;
  let isEnabled = false;
  let isDebug = false;
  let progressMode = false;
  let preserveOrder = false;
  let triggerOnce = false;
  let direction = "down";
  let format = "percent";
  const exclude = [];
  function err(msg) {
    console.error(`scrollama error: ${msg}`);
  }
  function reset() {
    cb = {
      stepEnter: () => {
      },
      stepExit: () => {
      },
      stepProgress: () => {
      }
    };
    io = {};
  }
  function generateInstanceID() {
    const a = "abcdefghijklmnopqrstuv";
    const l = a.length;
    const t = Date.now();
    const r = [0, 0, 0].map((d) => a[Math.floor(Math.random() * l)]).join("");
    return `${r}${t}`;
  }
  function getOffsetTop(el) {
    const { top } = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const clientTop = document.body.clientTop || 0;
    return top + scrollTop - clientTop;
  }
  function getPageHeight() {
    const { body } = document;
    const html = document.documentElement;
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }
  function getIndex(element) {
    return +element.getAttribute("data-scrollama-index");
  }
  function updateDirection() {
    if (window.pageYOffset > previousYOffset) direction = "down";
    else if (window.pageYOffset < previousYOffset) direction = "up";
    previousYOffset = window.pageYOffset;
  }
  function disconnectObserver(name) {
    if (io[name]) io[name].forEach((d) => d.disconnect());
  }
  function handleResize() {
    viewH = window.innerHeight;
    pageH = getPageHeight();
    const mult = format === "pixels" ? 1 : viewH;
    offsetMargin = offsetVal * mult;
    if (isReady) {
      stepOffsetHeight = stepEl.map((el) => el.getBoundingClientRect().height);
      stepOffsetTop = stepEl.map(getOffsetTop);
      if (isEnabled) updateIO();
    }
    if (isDebug) update({ id, offsetMargin, offsetVal, format });
  }
  function handleEnable(enable) {
    if (enable && !isEnabled) {
      if (isReady) {
        updateIO();
      } else {
        err("scrollama error: enable() called before scroller was ready");
        isEnabled = false;
        return;
      }
    }
    if (!enable && isEnabled) {
      OBSERVER_NAMES.forEach(disconnectObserver);
    }
    isEnabled = enable;
  }
  function createThreshold(height) {
    const count = Math.ceil(height / progressThreshold);
    const t = [];
    const ratio = 1 / count;
    for (let i = 0; i < count; i += 1) {
      t.push(i * ratio);
    }
    return t;
  }
  function notifyStepProgress(element, progress) {
    const index = getIndex(element);
    if (progress !== void 0) stepStates[index].progress = progress;
    const resp = { element, index, progress: stepStates[index].progress };
    if (stepStates[index].state === "enter") cb.stepProgress(resp);
  }
  function notifyOthers(index, location) {
    if (location === "above") {
      for (let i = 0; i < index; i += 1) {
        const ss = stepStates[i];
        if (ss.state !== "enter" && ss.direction !== "down") {
          notifyStepEnter(stepEl[i], "down", false);
          notifyStepExit(stepEl[i], "down");
        } else if (ss.state === "enter") notifyStepExit(stepEl[i], "down");
      }
    } else if (location === "below") {
      for (let i = stepStates.length - 1; i > index; i -= 1) {
        const ss = stepStates[i];
        if (ss.state === "enter") {
          notifyStepExit(stepEl[i], "up");
        }
        if (ss.direction === "down") {
          notifyStepEnter(stepEl[i], "up", false);
          notifyStepExit(stepEl[i], "up");
        }
      }
    }
  }
  function notifyStepEnter(element, dir, check = true) {
    const index = getIndex(element);
    const resp = { element, index, direction: dir };
    stepStates[index].direction = dir;
    stepStates[index].state = "enter";
    if (preserveOrder && check && dir === "down") notifyOthers(index, "above");
    if (preserveOrder && check && dir === "up") notifyOthers(index, "below");
    if (cb.stepEnter && !exclude[index]) {
      cb.stepEnter(resp, stepStates);
      if (isDebug) notifyStep({ id, index, state: "enter" });
      if (triggerOnce) exclude[index] = true;
    }
    if (progressMode) notifyStepProgress(element);
  }
  function notifyStepExit(element, dir) {
    const index = getIndex(element);
    const resp = { element, index, direction: dir };
    if (progressMode) {
      if (dir === "down" && stepStates[index].progress < 1)
        notifyStepProgress(element, 1);
      else if (dir === "up" && stepStates[index].progress > 0)
        notifyStepProgress(element, 0);
    }
    stepStates[index].direction = dir;
    stepStates[index].state = "exit";
    cb.stepExit(resp, stepStates);
    if (isDebug) notifyStep({ id, index, state: "exit" });
  }
  function intersectStepAbove([entry]) {
    updateDirection();
    const { isIntersecting, boundingClientRect, target } = entry;
    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;
    const index = getIndex(target);
    const ss = stepStates[index];
    if (isIntersecting && topAdjusted <= 0 && bottomAdjusted >= 0 && direction === "down" && ss.state !== "enter")
      notifyStepEnter(target, direction);
    if (!isIntersecting && topAdjusted > 0 && direction === "up" && ss.state === "enter")
      notifyStepExit(target, direction);
  }
  function intersectStepBelow([entry]) {
    updateDirection();
    const { isIntersecting, boundingClientRect, target } = entry;
    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;
    const index = getIndex(target);
    const ss = stepStates[index];
    if (isIntersecting && topAdjusted <= 0 && bottomAdjusted >= 0 && direction === "up" && ss.state !== "enter")
      notifyStepEnter(target, direction);
    if (!isIntersecting && bottomAdjusted < 0 && direction === "down" && ss.state === "enter")
      notifyStepExit(target, direction);
  }
  function intersectViewportAbove([entry]) {
    updateDirection();
    const { isIntersecting, target } = entry;
    const index = getIndex(target);
    const ss = stepStates[index];
    if (isIntersecting && direction === "down" && ss.direction !== "down" && ss.state !== "enter") {
      notifyStepEnter(target, "down");
      notifyStepExit(target, "down");
    }
  }
  function intersectViewportBelow([entry]) {
    updateDirection();
    const { isIntersecting, target } = entry;
    const index = getIndex(target);
    const ss = stepStates[index];
    if (isIntersecting && direction === "up" && ss.direction === "down" && ss.state !== "enter") {
      notifyStepEnter(target, "up");
      notifyStepExit(target, "up");
    }
  }
  function intersectStepProgress([entry]) {
    updateDirection();
    const {
      isIntersecting,
      intersectionRatio,
      boundingClientRect,
      target
    } = entry;
    const { bottom } = boundingClientRect;
    const bottomAdjusted = bottom - offsetMargin;
    if (isIntersecting && bottomAdjusted >= 0) {
      notifyStepProgress(target, +intersectionRatio);
    }
  }
  function updateViewportAboveIO() {
    io.viewportAbove = stepEl.map((el, i) => {
      const marginTop = pageH - stepOffsetTop[i];
      const marginBottom = offsetMargin - viewH - stepOffsetHeight[i];
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectViewportAbove, options);
      obs.observe(el);
      return obs;
    });
  }
  function updateViewportBelowIO() {
    io.viewportBelow = stepEl.map((el, i) => {
      const marginTop = -offsetMargin - stepOffsetHeight[i];
      const marginBottom = offsetMargin - viewH + stepOffsetHeight[i] + pageH;
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectViewportBelow, options);
      obs.observe(el);
      return obs;
    });
  }
  function updateStepAboveIO() {
    io.stepAbove = stepEl.map((el, i) => {
      const marginTop = -offsetMargin + stepOffsetHeight[i];
      const marginBottom = offsetMargin - viewH;
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectStepAbove, options);
      obs.observe(el);
      return obs;
    });
  }
  function updateStepBelowIO() {
    io.stepBelow = stepEl.map((el, i) => {
      const marginTop = -offsetMargin;
      const marginBottom = offsetMargin - viewH + stepOffsetHeight[i];
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const options = { rootMargin };
      const obs = new IntersectionObserver(intersectStepBelow, options);
      obs.observe(el);
      return obs;
    });
  }
  function updateStepProgressIO() {
    io.stepProgress = stepEl.map((el, i) => {
      const marginTop = stepOffsetHeight[i] - offsetMargin;
      const marginBottom = -viewH + offsetMargin;
      const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
      const threshold = createThreshold(stepOffsetHeight[i]);
      const options = { rootMargin, threshold };
      const obs = new IntersectionObserver(intersectStepProgress, options);
      obs.observe(el);
      return obs;
    });
  }
  function updateIO() {
    OBSERVER_NAMES.forEach(disconnectObserver);
    updateViewportAboveIO();
    updateViewportBelowIO();
    updateStepAboveIO();
    updateStepBelowIO();
    if (progressMode) updateStepProgressIO();
  }
  function indexSteps() {
    stepEl.forEach((el, i) => el.setAttribute("data-scrollama-index", i));
  }
  function setupStates() {
    stepStates = stepEl.map(() => ({
      direction: null,
      state: null,
      progress: 0
    }));
  }
  function addDebug() {
    if (isDebug) setup({ id, stepEl, offsetVal });
  }
  function isYScrollable(element) {
    const style = window.getComputedStyle(element);
    return (style.overflowY === "scroll" || style.overflowY === "auto") && element.scrollHeight > element.clientHeight;
  }
  function anyScrollableParent(element) {
    if (element && element.nodeType === 1) {
      return isYScrollable(element) ? element : anyScrollableParent(element.parentNode);
    }
    return false;
  }
  const S = {};
  S.setup = ({
    step,
    parent,
    offset = 0.5,
    progress = false,
    threshold = 4,
    debug = false,
    order = true,
    once = false
  }) => {
    reset();
    id = generateInstanceID();
    stepEl = selectAll(step, parent);
    if (!stepEl.length) {
      err("no step elements");
      return S;
    }
    const scrollableParent = stepEl.reduce(
      (foundScrollable, s) => foundScrollable || anyScrollableParent(s.parentNode),
      false
    );
    if (scrollableParent) {
      console.error(
        "scrollama error: step elements cannot be children of a scrollable element. Remove any css on the parent element with overflow: scroll; or overflow: auto; on elements with fixed height.",
        scrollableParent
      );
    }
    isDebug = debug;
    progressMode = progress;
    preserveOrder = order;
    triggerOnce = once;
    S.offsetTrigger(offset);
    progressThreshold = Math.max(1, +threshold);
    isReady = true;
    addDebug();
    indexSteps();
    setupStates();
    handleResize();
    S.enable();
    return S;
  };
  S.resize = () => {
    handleResize();
    return S;
  };
  S.enable = () => {
    handleEnable(true);
    return S;
  };
  S.disable = () => {
    handleEnable(false);
    return S;
  };
  S.destroy = () => {
    handleEnable(false);
    reset();
  };
  S.offsetTrigger = (x) => {
    if (x === null) return offsetVal;
    if (typeof x === "number") {
      format = "percent";
      if (x > 1) err("offset value is greater than 1. Fallback to 1.");
      if (x < 0) err("offset value is lower than 0. Fallback to 0.");
      offsetVal = Math.min(Math.max(0, x), 1);
    } else if (typeof x === "string" && x.indexOf("px") > 0) {
      const v = +x.replace("px", "");
      if (!isNaN(v)) {
        format = "pixels";
        offsetVal = v;
      } else {
        err("offset value must be in 'px' format. Fallback to 0.5.");
        offsetVal = 0.5;
      }
    } else {
      err("offset value does not include 'px'. Fallback to 0.5.");
      offsetVal = 0.5;
    }
    return S;
  };
  S.onStepEnter = (f) => {
    if (typeof f === "function") cb.stepEnter = f;
    else err("onStepEnter requires a function");
    return S;
  };
  S.onStepExit = (f) => {
    if (typeof f === "function") cb.stepExit = f;
    else err("onStepExit requires a function");
    return S;
  };
  S.onStepProgress = (f) => {
    if (typeof f === "function") cb.stepProgress = f;
    else err("onStepProgress requires a function");
    return S;
  };
  return S;
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
  name: "Scrollama",
  inheritAttrs: false,
  emits: ["step-progress", "step-enter", "step-exit"],
  data() {
    return {
      scroller: null
    };
  },
  computed: {
    opts() {
      const listenerProps = this.$ && this.$.vnode && this.$.vnode.props ? this.$.vnode.props : {};
      const hasProgressListener = Object.prototype.hasOwnProperty.call(
        listenerProps,
        "onStepProgress"
      );
      return Object.assign({}, {
        step: Array.from(this.$el.children),
        progress: hasProgressListener
      }, this.$attrs);
    }
  },
  mounted() {
    this.scroller = scrollama();
    this.setup();
  },
  beforeUnmount() {
    if (this.scroller) {
      this.scroller.destroy();
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    setup() {
      if (!this.scroller) {
        return;
      }
      this.scroller.destroy();
      this.scroller.setup(this.opts).onStepProgress((resp) => {
        this.$emit("step-progress", resp);
      }).onStepEnter((resp) => {
        this.$emit("step-enter", resp);
      }).onStepExit((resp) => {
        this.$emit("step-exit", resp);
      });
      window.addEventListener("resize", this.handleResize);
    },
    handleResize() {
      if (this.scroller) {
        this.scroller.resize();
      }
    }
  }
};
const _hoisted_1 = { class: "scrollama__steps" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
const Scrollama = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  Scrollama as default
};
