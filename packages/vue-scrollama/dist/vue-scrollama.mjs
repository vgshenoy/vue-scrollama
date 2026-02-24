import { ref as C, onMounted as W, onBeforeUnmount as X, readonly as Z, getCurrentInstance as ee, openBlock as te, createElementBlock as ne, renderSlot as re } from "vue";
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
  const { index: o, height: c } = n, a = `scrollama__debug-step--${e}-${o}`;
  let p = document.querySelector(`.${a}`);
  p || (p = se(a)), p.style.top = `${r * -1}px`, p.style.height = `${c}px`, p.querySelector("p").style.top = `${c / 2}px`;
}
function ce() {
  const e = "abcdefghijklmnopqrstuvwxyz", n = Date.now(), r = [];
  for (let o = 0; o < 6; o += 1) {
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
  const r = Math.ceil(e / n), o = [], c = 1 / r;
  for (let a = 0; a < r + 1; a += 1)
    o.push(a * c);
  return o;
}
function L(e) {
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
  const { top: n } = e.getBoundingClientRect(), r = window.pageYOffset, o = document.body.clientTop || 0;
  return n + r - o;
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
  let e = {}, n = ce(), r = [], o, c, a, p = 0, g = !1, d = !1, v = !1, O = !1, E = [];
  function w() {
    e = {
      stepEnter: () => {
      },
      stepExit: () => {
      },
      stepProgress: () => {
      }
    }, E = [];
  }
  function S(t) {
    t && !g && A(), !t && g && N(), g = t;
  }
  function M(t, i) {
    const s = $(t), l = r[s];
    i !== void 0 && (l.progress = i);
    const u = { element: t, index: s, progress: i, direction: h };
    l.state === "enter" && e.stepProgress(u);
  }
  function Y(t, i = !0) {
    const s = $(t), l = r[s], u = { element: t, index: s, direction: h };
    l.direction = h, l.state = "enter", E[s] || e.stepEnter(u), O && (E[s] = !0);
  }
  function F(t, i = !0) {
    const s = $(t), l = r[s];
    if (!l.state) return !1;
    const u = { element: t, index: s, direction: h };
    d && (h === "down" && l.progress < 1 ? M(t, 1) : h === "up" && l.progress > 0 && M(t, 0)), l.direction = h, l.state = "exit", e.stepExit(u);
  }
  function D([t]) {
    const i = $(t.target), s = r[i], l = t.target.offsetHeight;
    l !== s.height && (s.height = l, I(s), H(s), q(s));
  }
  function K([t]) {
    R(c);
    const { isIntersecting: i, target: s } = t;
    i ? Y(s) : F(s);
  }
  function U([t]) {
    const i = $(t.target), s = r[i], { isIntersecting: l, intersectionRatio: u, target: m } = t;
    l && s.state === "enter" && M(m, u);
  }
  function I({ observers: t }) {
    Object.keys(t).map((i) => {
      t[i].disconnect();
    });
  }
  function N() {
    r.forEach(I);
  }
  function q(t) {
    const i = new ResizeObserver(D);
    i.observe(t.node), t.observers.resize = i;
  }
  function G() {
    r.forEach(q);
  }
  function H(t) {
    const i = window.innerHeight, s = t.offset || o, l = s.format === "pixels" ? 1 : i, u = s.value * l, m = t.height / 2 - u, P = t.height / 2 - (i - u), x = { rootMargin: `${m}px 0px ${P}px 0px`, threshold: 0.5, root: a }, B = new IntersectionObserver(K, x);
    B.observe(t.node), t.observers.step = B, v && ie({ id: n, step: t, marginTop: m });
  }
  function J() {
    r.forEach(H);
  }
  function Q(t) {
    const i = window.innerHeight, s = t.offset || o, l = s.format === "pixels" ? 1 : i, u = s.value * l, m = -u + t.height, P = u - i, _ = `${m}px 0px ${P}px 0px`, T = le(t.height, p), b = { rootMargin: _, threshold: T }, x = new IntersectionObserver(U, b);
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
    offset: s = 0.5,
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
    offset: L(b.dataset.offset),
    top: ae(b),
    progress: 0,
    state: void 0
  })), r.length ? (d = u, O = m, v = P, p = Math.max(1, +l), o = L(s), c = _, a = T, w(), fe(r), S(!0), f) : (z("no step elements"), f)), f.enable = () => (S(!0), f), f.disable = () => (S(!1), f), f.destroy = () => (S(!1), w(), f), f.resize = () => (A(), f), f.offset = (t) => t == null ? o.value : (o = L(t), A(), f), f.onStepEnter = (t) => (typeof t == "function" ? e.stepEnter = t : z("onStepEnter requires a function"), f), f.onStepExit = (t) => (typeof t == "function" ? e.stepExit = t : z("onStepExit requires a function"), f), f.onStepProgress = (t) => (typeof t == "function" ? e.stepProgress = t : z("onStepProgress requires a function"), f), f;
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
  return e && typeof e == "object" && "value" in e && e.value instanceof HTMLElement ? e.value : e instanceof HTMLElement ? e : null;
}
function ge(e, n) {
  return n ? Array.from(e.querySelectorAll(n)).filter(
    (r) => r instanceof HTMLElement
  ) : Array.from(e.children).filter(
    (r) => r instanceof HTMLElement
  );
}
function he(e) {
  let n = null;
  const r = C(!1);
  let o = null, c = null;
  const a = () => !n || !r.value ? !1 : (n.resize(), !0), p = () => {
    r.value = !1, c && (c.disconnect(), c = null), o && (window.removeEventListener("resize", o), window.removeEventListener("orientationchange", o), o = null), n && n.destroy();
  }, g = () => {
    if (!n) return !1;
    const v = j(e.container);
    if (!v)
      return !1;
    const O = ge(v, e.stepSelector);
    O.length === 0 && e.stepSelector;
    const E = { step: O };
    for (const [w, S] of Object.entries(e))
      de.has(w) || (E[w] = S);
    return n.setup(E), e.onStepEnter && n.onStepEnter(e.onStepEnter), e.onStepExit && n.onStepExit(e.onStepExit), e.onStepProgress && n.onStepProgress(e.onStepProgress), r.value = !0, !0;
  }, d = () => n ? (n.destroy(), r.value = !1, g()) : !1;
  return W(() => {
    n = pe(), g(), o = () => {
      a();
    }, window.addEventListener("resize", o), window.addEventListener("orientationchange", o, { passive: !0 });
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
const ve = {
  name: "Scrollama",
  inheritAttrs: !1,
  emits: ["step-progress", "step-enter", "step-exit"],
  setup(e, { emit: n, attrs: r }) {
    var g;
    const o = C(null), c = ee(), a = ((g = c == null ? void 0 : c.vnode) == null ? void 0 : g.props) ?? {}, p = Object.prototype.hasOwnProperty.call(
      a,
      "onStepProgress"
    );
    return he({
      container: o,
      ...r,
      progress: p,
      onStepEnter: (d) => n("step-enter", d),
      onStepExit: (d) => n("step-exit", d),
      onStepProgress: (d) => n("step-progress", d)
    }), { root: o };
  }
}, me = (e, n) => {
  const r = e.__vccOpts || e;
  for (const [o, c] of n)
    r[o] = c;
  return r;
}, be = {
  ref: "root",
  class: "scrollama__steps"
};
function Ee(e, n, r, o, c, a) {
  return te(), ne("div", be, [
    re(e.$slots, "default")
  ], 512);
}
const xe = /* @__PURE__ */ me(ve, [["render", Ee]]);
export {
  xe as default,
  he as useScrollama
};
