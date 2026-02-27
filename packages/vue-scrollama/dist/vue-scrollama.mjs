import { ref as j, onMounted as R, onBeforeUnmount as Y, readonly as Z, defineComponent as ee, useAttrs as te, getCurrentInstance as re, openBlock as ne, createElementBlock as se, mergeProps as oe, unref as ie, renderSlot as le } from "vue";
function ce(e, r = document) {
  return typeof e == "string" ? Array.from(r.querySelectorAll(e)) : e instanceof Element ? [e] : e instanceof NodeList ? Array.from(e) : e instanceof Array ? e : [];
}
function fe(e) {
  const r = document.createElement("div");
  r.className = `scrollama__debug-step ${e}`, r.style.position = "fixed", r.style.left = "0", r.style.width = "100%", r.style.zIndex = "9999", r.style.borderTop = "2px solid black", r.style.borderBottom = "2px solid black";
  const n = document.createElement("p");
  return n.style.position = "absolute", n.style.left = "0", n.style.height = "1px", n.style.width = "100%", n.style.borderTop = "1px dashed black", r.appendChild(n), document.body.appendChild(r), r;
}
function ae({ id: e, step: r, marginTop: n }) {
  const { index: o, height: a } = r, f = `scrollama__debug-step--${e}-${o}`;
  let d = document.querySelector(`.${f}`);
  d || (d = fe(f)), d.style.top = `${n * -1}px`, d.style.height = `${a}px`, d.querySelector("p").style.top = `${a / 2}px`;
}
function ue() {
  const e = "abcdefghijklmnopqrstuvwxyz", r = Date.now(), n = [];
  for (let o = 0; o < 6; o += 1) {
    const a = e[Math.floor(Math.random() * e.length)];
    n.push(a);
  }
  return `${n.join("")}${r}`;
}
function $(e) {
  console.error(`scrollama error: ${e}`);
}
function T(e) {
  return +e.getAttribute("data-scrollama-index");
}
function pe(e, r) {
  const n = Math.ceil(e / r), o = [], a = 1 / n;
  for (let f = 0; f < n + 1; f += 1)
    o.push(f * a);
  return o;
}
function _(e) {
  if (typeof e == "string" && e.indexOf("px") > 0) {
    const r = +e.replace("px", "");
    return isNaN(r) ? (err("offset value must be in 'px' format. Fallback to 0.5."), { format: "percent", value: 0.5 }) : { format: "pixels", value: r };
  } else if (typeof e == "number" || !isNaN(+e))
    return e > 1 && err("offset value is greater than 1. Fallback to 1."), e < 0 && err("offset value is lower than 0. Fallback to 0."), { format: "percent", value: Math.min(Math.max(0, e), 1) };
  return null;
}
function de(e) {
  e.forEach(
    (r) => r.node.setAttribute("data-scrollama-index", r.index)
  );
}
function ge(e) {
  const { top: r } = e.getBoundingClientRect(), n = window.pageYOffset, o = document.body.clientTop || 0;
  return r + n - o;
}
let O, L, b;
function F(e) {
  const r = e ? e.scrollTop : window.pageYOffset;
  O !== r && (O = r, O > L ? b = "down" : O < L && (b = "up"), L = O);
}
function he(e) {
  O = 0, L = 0, document.addEventListener("scroll", () => F(e));
}
function ve() {
  let e = {}, r = ue(), n = [], o, a, f, d = 0, m = !1, h = !1, v = !1, E = !1, u = [];
  function g() {
    e = {
      stepEnter: () => {
      },
      stepExit: () => {
      },
      stepProgress: () => {
      }
    }, u = [];
  }
  function x(t) {
    t && !m && A(), !t && m && q(), m = t;
  }
  function k(t, i) {
    const s = T(t), l = n[s];
    i !== void 0 && (l.progress = i);
    const p = { element: t, index: s, progress: i, direction: b };
    l.state === "enter" && e.stepProgress(p);
  }
  function D(t, i = !0) {
    const s = T(t), l = n[s], p = { element: t, index: s, direction: b };
    l.direction = b, l.state = "enter", u[s] || e.stepEnter(p), E && (u[s] = !0);
  }
  function U(t, i = !0) {
    const s = T(t), l = n[s];
    if (!l.state) return !1;
    const p = { element: t, index: s, direction: b };
    h && (b === "down" && l.progress < 1 ? k(t, 1) : b === "up" && l.progress > 0 && k(t, 0)), l.direction = b, l.state = "exit", e.stepExit(p);
  }
  function G([t]) {
    const i = T(t.target), s = n[i], l = t.target.offsetHeight;
    l !== s.height && (s.height = l, B(s), I(s), H(s));
  }
  function J([t]) {
    F(a);
    const { isIntersecting: i, target: s } = t;
    i ? D(s) : U(s);
  }
  function K([t]) {
    const i = T(t.target), s = n[i], { isIntersecting: l, intersectionRatio: p, target: S } = t;
    l && s.state === "enter" && k(S, p);
  }
  function B({ observers: t }) {
    Object.keys(t).map((i) => {
      t[i].disconnect();
    });
  }
  function q() {
    n.forEach(B);
  }
  function H(t) {
    const i = new ResizeObserver(G);
    i.observe(t.node), t.observers.resize = i;
  }
  function Q() {
    n.forEach(H);
  }
  function I(t) {
    const i = window.innerHeight, s = t.offset || o, l = s.format === "pixels" ? 1 : i, p = s.value * l, S = t.height / 2 - p, P = t.height / 2 - (i - p), w = { rootMargin: `${S}px 0px ${P}px 0px`, threshold: 0.5, root: f }, N = new IntersectionObserver(J, w);
    N.observe(t.node), t.observers.step = N, v && ae({ id: r, step: t, marginTop: S });
  }
  function V() {
    n.forEach(I);
  }
  function W(t) {
    const i = window.innerHeight, s = t.offset || o, l = s.format === "pixels" ? 1 : i, p = s.value * l, S = -p + t.height, P = p - i, M = `${S}px 0px ${P}px 0px`, z = pe(t.height, d), y = { rootMargin: M, threshold: z }, w = new IntersectionObserver(K, y);
    w.observe(t.node), t.observers.progress = w;
  }
  function X() {
    n.forEach(W);
  }
  function A() {
    q(), Q(), V(), h && X();
  }
  const c = {};
  return c.setup = ({
    step: t,
    parent: i,
    offset: s = 0.5,
    threshold: l = 4,
    progress: p = !1,
    once: S = !1,
    debug: P = !1,
    container: M = void 0,
    root: z = null
  }) => (he(M), n = ce(t, i).map((y, w) => ({
    index: w,
    direction: void 0,
    height: y.offsetHeight,
    node: y,
    observers: {},
    offset: _(y.dataset.offset),
    top: ge(y),
    progress: 0,
    state: void 0
  })), n.length ? (h = p, E = S, v = P, d = Math.max(1, +l), o = _(s), a = M, f = z, g(), de(n), x(!0), c) : ($("no step elements"), c)), c.enable = () => (x(!0), c), c.disable = () => (x(!1), c), c.destroy = () => (x(!1), g(), c), c.resize = () => (A(), c), c.offset = (t) => t == null ? o.value : (o = _(t), A(), c), c.onStepEnter = (t) => (typeof t == "function" ? e.stepEnter = t : $("onStepEnter requires a function"), c), c.onStepExit = (t) => (typeof t == "function" ? e.stepExit = t : $("onStepExit requires a function"), c), c.onStepProgress = (t) => (typeof t == "function" ? e.stepProgress = t : $("onStepProgress requires a function"), c), c;
}
function C(e) {
  return e && typeof e == "object" && "value" in e && e.value instanceof HTMLElement ? e.value : e instanceof HTMLElement ? e : null;
}
function me(e, r) {
  return r ? Array.from(e.querySelectorAll(r)).filter(
    (n) => n instanceof HTMLElement
  ) : Array.from(e.children).filter(
    (n) => n instanceof HTMLElement
  );
}
function be(e) {
  let r = null;
  const n = j(!1);
  let o = null, a = null;
  const f = () => !r || !n.value ? !1 : (r.resize(), !0), d = () => {
    n.value = !1, a && (a.disconnect(), a = null), o && (window.removeEventListener("resize", o), window.removeEventListener("orientationchange", o), o = null), r && r.destroy();
  }, m = () => {
    if (!r) return !1;
    const v = C(e.container);
    if (!v)
      return !1;
    const E = me(v, e.stepSelector);
    E.length === 0 && e.stepSelector;
    const u = {
      step: E
    };
    return e.offset !== void 0 && (u.offset = e.offset), e.progress !== void 0 && (u.progress = e.progress), e.once !== void 0 && (u.once = e.once), e.threshold !== void 0 && (u.threshold = e.threshold), e.debug !== void 0 && (u.debug = e.debug), e.root !== void 0 && (u.root = e.root), e.onStepProgress && !u.progress && (e.progress, u.progress = !0), r.setup(u), e.onStepEnter && r.onStepEnter(e.onStepEnter), e.onStepExit && r.onStepExit(e.onStepExit), e.onStepProgress && r.onStepProgress(e.onStepProgress), n.value = !0, !0;
  }, h = () => r ? (r.destroy(), n.value = !1, m()) : !1;
  return R(() => {
    r = ve(), m(), o = () => {
      f();
    }, window.addEventListener("resize", o), window.addEventListener("orientationchange", o, { passive: !0 });
    const v = C(e.container);
    v && typeof ResizeObserver < "u" && (a = new ResizeObserver(() => {
      f();
    }), a.observe(v));
  }), Y(() => {
    d(), r = null;
  }), {
    resize: f,
    destroy: d,
    rebuild: h,
    isReady: Z(n)
  };
}
const Se = /* @__PURE__ */ ee({
  name: "Scrollama",
  inheritAttrs: !1,
  __name: "Scrollama",
  props: {
    stepSelector: {},
    offset: {},
    progress: { type: Boolean },
    once: { type: Boolean },
    threshold: {},
    debug: { type: Boolean },
    root: {}
  },
  emits: ["step-enter", "step-exit", "step-progress"],
  setup(e, { emit: r }) {
    var E, u;
    const n = e, o = r, a = te(), f = j(null), m = !!((u = (E = re()) == null ? void 0 : E.vnode.props) == null ? void 0 : u.onStepProgress);
    let h = null;
    const { rebuild: v } = be({
      container: f,
      ...n,
      progress: m || n.progress,
      onStepEnter: (g) => o("step-enter", g),
      onStepExit: (g) => o("step-exit", g),
      onStepProgress: m || n.progress ? (g) => o("step-progress", g) : void 0
    });
    return R(() => {
      !f.value || typeof MutationObserver > "u" || (h = new MutationObserver((g) => {
        g.some((x) => x.type === "childList") && v();
      }), h.observe(f.value, { childList: !0 }));
    }), Y(() => {
      h && (h.disconnect(), h = null);
    }), (g, x) => (ne(), se("div", oe({
      ref_key: "root",
      ref: f,
      class: "scrollama__steps"
    }, ie(a)), [
      le(g.$slots, "default")
    ], 16));
  }
});
export {
  Se as default,
  be as useScrollama
};
