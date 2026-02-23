import { ref as C, onMounted as W, onBeforeUnmount as X, readonly as Z, openBlock as ee, createElementBlock as te, renderSlot as ne, getCurrentInstance as re } from "vue";
function oe(e, n = document) {
  return typeof e == "string" ? Array.from(n.querySelectorAll(e)) : e instanceof Element ? [e] : e instanceof NodeList ? Array.from(e) : e instanceof Array ? e : [];
}
function se(e) {
  const n = document.createElement("div");
  n.className = `scrollama__debug-step ${e}`, n.style.position = "fixed", n.style.left = "0", n.style.width = "100%", n.style.zIndex = "9999", n.style.borderTop = "2px solid black", n.style.borderBottom = "2px solid black";
  const r = document.createElement("p");
  return r.style.position = "absolute", r.style.left = "0", r.style.height = "1px", r.style.width = "100%", r.style.borderTop = "1px dashed black", n.appendChild(r), document.body.appendChild(n), n;
}
function ie({ id: e, step: n, marginTop: r }) {
  const { index: s, height: c } = n, a = `scrollama__debug-step--${e}-${s}`;
  let p = document.querySelector(`.${a}`);
  p || (p = se(a)), p.style.top = `${r * -1}px`, p.style.height = `${c}px`, p.querySelector("p").style.top = `${c / 2}px`;
}
function ce() {
  const e = "abcdefghijklmnopqrstuvwxyz", n = Date.now(), r = [];
  for (let s = 0; s < 6; s += 1) {
    const c = e[Math.floor(Math.random() * e.length)];
    r.push(c);
  }
  return `${r.join("")}${n}`;
}
function z(e) {
  console.error(`scrollama error: ${e}`);
}
function $(e) {
  return +e.getAttribute("data-scrollama-index");
}
function le(e, n) {
  const r = Math.ceil(e / n), s = [], c = 1 / r;
  for (let a = 0; a < r + 1; a += 1)
    s.push(a * c);
  return s;
}
function I(e) {
  if (typeof e == "string" && e.indexOf("px") > 0) {
    const n = +e.replace("px", "");
    return isNaN(n) ? (err("offset value must be in 'px' format. Fallback to 0.5."), { format: "percent", value: 0.5 }) : { format: "pixels", value: n };
  } else if (typeof e == "number" || !isNaN(+e))
    return e > 1 && err("offset value is greater than 1. Fallback to 1."), e < 0 && err("offset value is lower than 0. Fallback to 0."), { format: "percent", value: Math.min(Math.max(0, e), 1) };
  return null;
}
function fe(e) {
  e.forEach(
    (n) => n.node.setAttribute("data-scrollama-index", n.index)
  );
}
function ae(e) {
  const { top: n } = e.getBoundingClientRect(), r = window.pageYOffset, s = document.body.clientTop || 0;
  return n + r - s;
}
let y, k, h;
function R(e) {
  const n = e ? e.scrollTop : window.pageYOffset;
  y !== n && (y = n, y > k ? h = "down" : y < k && (h = "up"), k = y);
}
function ue(e) {
  y = 0, k = 0, document.addEventListener("scroll", () => R(e));
}
function pe() {
  let e = {}, n = ce(), r = [], s, c, a, p = 0, g = !1, d = !1, v = !1, O = !1, S = [];
  function w() {
    e = {
      stepEnter: () => {
      },
      stepExit: () => {
      },
      stepProgress: () => {
      }
    }, S = [];
  }
  function E(t) {
    t && !g && A(), !t && g && N(), g = t;
  }
  function M(t, i) {
    const o = $(t), l = r[o];
    i !== void 0 && (l.progress = i);
    const u = { element: t, index: o, progress: i, direction: h };
    l.state === "enter" && e.stepProgress(u);
  }
  function Y(t, i = !0) {
    const o = $(t), l = r[o], u = { element: t, index: o, direction: h };
    l.direction = h, l.state = "enter", S[o] || e.stepEnter(u), O && (S[o] = !0);
  }
  function F(t, i = !0) {
    const o = $(t), l = r[o];
    if (!l.state) return !1;
    const u = { element: t, index: o, direction: h };
    d && (h === "down" && l.progress < 1 ? M(t, 1) : h === "up" && l.progress > 0 && M(t, 0)), l.direction = h, l.state = "exit", e.stepExit(u);
  }
  function D([t]) {
    const i = $(t.target), o = r[i], l = t.target.offsetHeight;
    l !== o.height && (o.height = l, L(o), H(o), q(o));
  }
  function K([t]) {
    R(c);
    const { isIntersecting: i, target: o } = t;
    i ? Y(o) : F(o);
  }
  function U([t]) {
    const i = $(t.target), o = r[i], { isIntersecting: l, intersectionRatio: u, target: m } = t;
    l && o.state === "enter" && M(m, u);
  }
  function L({ observers: t }) {
    Object.keys(t).map((i) => {
      t[i].disconnect();
    });
  }
  function N() {
    r.forEach(L);
  }
  function q(t) {
    const i = new ResizeObserver(D);
    i.observe(t.node), t.observers.resize = i;
  }
  function G() {
    r.forEach(q);
  }
  function H(t) {
    const i = window.innerHeight, o = t.offset || s, l = o.format === "pixels" ? 1 : i, u = o.value * l, m = t.height / 2 - u, P = t.height / 2 - (i - u), x = { rootMargin: `${m}px 0px ${P}px 0px`, threshold: 0.5, root: a }, B = new IntersectionObserver(K, x);
    B.observe(t.node), t.observers.step = B, v && ie({ id: n, step: t, marginTop: m });
  }
  function J() {
    r.forEach(H);
  }
  function Q(t) {
    const i = window.innerHeight, o = t.offset || s, l = o.format === "pixels" ? 1 : i, u = o.value * l, m = -u + t.height, P = u - i, _ = `${m}px 0px ${P}px 0px`, T = le(t.height, p), b = { rootMargin: _, threshold: T }, x = new IntersectionObserver(U, b);
    x.observe(t.node), t.observers.progress = x;
  }
  function V() {
    r.forEach(Q);
  }
  function A() {
    N(), G(), J(), d && V();
  }
  const f = {};
  return f.setup = ({
    step: t,
    parent: i,
    offset: o = 0.5,
    threshold: l = 4,
    progress: u = !1,
    once: m = !1,
    debug: P = !1,
    container: _ = void 0,
    root: T = null
  }) => (ue(_), r = oe(t, i).map((b, x) => ({
    index: x,
    direction: void 0,
    height: b.offsetHeight,
    node: b,
    observers: {},
    offset: I(b.dataset.offset),
    top: ae(b),
    progress: 0,
    state: void 0
  })), r.length ? (d = u, O = m, v = P, p = Math.max(1, +l), s = I(o), c = _, a = T, w(), fe(r), E(!0), f) : (z("no step elements"), f)), f.enable = () => (E(!0), f), f.disable = () => (E(!1), f), f.destroy = () => (E(!1), w(), f), f.resize = () => (A(), f), f.offset = (t) => t == null ? s.value : (s = I(t), A(), f), f.onStepEnter = (t) => (typeof t == "function" ? e.stepEnter = t : z("onStepEnter requires a function"), f), f.onStepExit = (t) => (typeof t == "function" ? e.stepExit = t : z("onStepExit requires a function"), f), f.onStepProgress = (t) => (typeof t == "function" ? e.stepProgress = t : z("onStepProgress requires a function"), f), f;
}
const de = /* @__PURE__ */ new Set([
  "container",
  "stepSelector",
  "step",
  "onStepEnter",
  "onStepExit",
  "onStepProgress"
]);
function j(e) {
  return e && typeof e == "object" && "value" in e ? e.value instanceof HTMLElement ? e.value : null : e instanceof HTMLElement ? e : null;
}
function ge(e, n) {
  return n ? Array.from(e.querySelectorAll(n)).filter(
    (r) => r instanceof HTMLElement
  ) : Array.from(e.children).filter((r) => r instanceof HTMLElement);
}
function he(e) {
  let n = null;
  const r = C(!1);
  let s = null, c = null;
  const a = () => !n || !r.value ? !1 : (n.resize(), !0), p = () => {
    r.value = !1, c && (c.disconnect(), c = null), s && (window.removeEventListener("resize", s), s = null), n && n.destroy();
  }, g = () => {
    if (!n) return !1;
    const v = j(e.container);
    if (!v)
      return !1;
    const O = ge(v, e.stepSelector);
    O.length === 0 && e.stepSelector;
    const S = (
      /** @type {Record<string, unknown>} */
      { step: O }
    );
    for (const [w, E] of Object.entries(e))
      de.has(w) || (S[w] = E);
    return n.setup(
      /** @type {any} */
      S
    ), e.onStepEnter && n.onStepEnter(e.onStepEnter), e.onStepExit && n.onStepExit(e.onStepExit), e.onStepProgress && n.onStepProgress(
      /** @type {any} */
      e.onStepProgress
    ), r.value = !0, !0;
  }, d = () => n ? (n.destroy(), r.value = !1, g()) : !1;
  return W(() => {
    n = pe(), g(), s = () => {
      a();
    }, window.addEventListener("resize", s);
    const v = j(e.container);
    v && typeof ResizeObserver < "u" && (c = new ResizeObserver(() => {
      a();
    }), c.observe(v));
  }), X(() => {
    p(), n = null;
  }), {
    resize: a,
    destroy: p,
    rebuild: d,
    isReady: Z(r)
  };
}
const ve = (e, n) => {
  const r = e.__vccOpts || e;
  for (const [s, c] of n)
    r[s] = c;
  return r;
}, me = {
  name: "Scrollama",
  inheritAttrs: !1,
  emits: ["step-progress", "step-enter", "step-exit"],
  setup(e, { emit: n, attrs: r }) {
    var g;
    const s = C(null), c = re(), a = ((g = c == null ? void 0 : c.vnode) == null ? void 0 : g.props) ?? {}, p = Object.prototype.hasOwnProperty.call(
      a,
      "onStepProgress"
    );
    return he({
      container: s,
      ...r,
      progress: p,
      onStepEnter: (d) => n("step-enter", d),
      onStepExit: (d) => n("step-exit", d),
      onStepProgress: (d) => n("step-progress", d)
    }), { root: s };
  }
}, be = {
  ref: "root",
  class: "scrollama__steps"
};
function Se(e, n, r, s, c, a) {
  return ee(), te("div", be, [
    ne(e.$slots, "default")
  ], 512);
}
const xe = /* @__PURE__ */ ve(me, [["render", Se]]);
export {
  xe as default,
  he as useScrollama
};
