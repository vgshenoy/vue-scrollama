import { openBlock as V, createElementBlock as W, renderSlot as X, onMounted as Z, onBeforeUnmount as ee } from "vue";
function te(e, s = document) {
  return typeof e == "string" ? Array.from(s.querySelectorAll(e)) : e instanceof Element ? [e] : e instanceof NodeList ? Array.from(e) : e instanceof Array ? e : [];
}
function se(e) {
  const s = document.createElement("div");
  s.className = `scrollama__debug-step ${e}`, s.style.position = "fixed", s.style.left = "0", s.style.width = "100%", s.style.zIndex = "9999", s.style.borderTop = "2px solid black", s.style.borderBottom = "2px solid black";
  const r = document.createElement("p");
  return r.style.position = "absolute", r.style.left = "0", r.style.height = "1px", r.style.width = "100%", r.style.borderTop = "1px dashed black", s.appendChild(r), document.body.appendChild(s), s;
}
function re({ id: e, step: s, marginTop: r }) {
  const { index: c, height: a } = s, u = `scrollama__debug-step--${e}-${c}`;
  let p = document.querySelector(`.${u}`);
  p || (p = se(u)), p.style.top = `${r * -1}px`, p.style.height = `${a}px`, p.querySelector("p").style.top = `${a / 2}px`;
}
function ne() {
  const e = "abcdefghijklmnopqrstuvwxyz", s = Date.now(), r = [];
  for (let c = 0; c < 6; c += 1) {
    const a = e[Math.floor(Math.random() * e.length)];
    r.push(a);
  }
  return `${r.join("")}${s}`;
}
function w(e) {
  console.error(`scrollama error: ${e}`);
}
function y(e) {
  return +e.getAttribute("data-scrollama-index");
}
function oe(e, s) {
  const r = Math.ceil(e / s), c = [], a = 1 / r;
  for (let u = 0; u < r + 1; u += 1)
    c.push(u * a);
  return c;
}
function T(e) {
  if (typeof e == "string" && e.indexOf("px") > 0) {
    const s = +e.replace("px", "");
    return isNaN(s) ? (err("offset value must be in 'px' format. Fallback to 0.5."), { format: "percent", value: 0.5 }) : { format: "pixels", value: s };
  } else if (typeof e == "number" || !isNaN(+e))
    return e > 1 && err("offset value is greater than 1. Fallback to 1."), e < 0 && err("offset value is lower than 0. Fallback to 0."), { format: "percent", value: Math.min(Math.max(0, e), 1) };
  return null;
}
function ie(e) {
  e.forEach(
    (s) => s.node.setAttribute("data-scrollama-index", s.index)
  );
}
function ce(e) {
  const { top: s } = e.getBoundingClientRect(), r = window.pageYOffset, c = document.body.clientTop || 0;
  return s + r - c;
}
let b, $, d;
function j(e) {
  const s = e ? e.scrollTop : window.pageYOffset;
  b !== s && (b = s, b > $ ? d = "down" : b < $ && (d = "up"), $ = b);
}
function le(e) {
  b = 0, $ = 0, document.addEventListener("scroll", () => j(e));
}
function H() {
  let e = {}, s = ne(), r = [], c, a, u, p = 0, O = !1, z = !1, M = !1, R = !1, P = [];
  function A() {
    e = {
      stepEnter: () => {
      },
      stepExit: () => {
      },
      stepProgress: () => {
      }
    }, P = [];
  }
  function S(t) {
    t && !O && k(), !t && O && q(), O = t;
  }
  function _(t, o) {
    const n = y(t), i = r[n];
    o !== void 0 && (i.progress = o);
    const f = { element: t, index: n, progress: o, direction: d };
    i.state === "enter" && e.stepProgress(f);
  }
  function Y(t, o = !0) {
    const n = y(t), i = r[n], f = { element: t, index: n, direction: d };
    i.direction = d, i.state = "enter", P[n] || e.stepEnter(f), R && (P[n] = !0);
  }
  function C(t, o = !0) {
    const n = y(t), i = r[n];
    if (!i.state) return !1;
    const f = { element: t, index: n, direction: d };
    z && (d === "down" && i.progress < 1 ? _(t, 1) : d === "up" && i.progress > 0 && _(t, 0)), i.direction = d, i.state = "exit", e.stepExit(f);
  }
  function F([t]) {
    const o = y(t.target), n = r[o], i = t.target.offsetHeight;
    i !== n.height && (n.height = i, L(n), I(n), B(n));
  }
  function D([t]) {
    j(a);
    const { isIntersecting: o, target: n } = t;
    o ? Y(n) : C(n);
  }
  function U([t]) {
    const o = y(t.target), n = r[o], { isIntersecting: i, intersectionRatio: f, target: h } = t;
    i && n.state === "enter" && _(h, f);
  }
  function L({ observers: t }) {
    Object.keys(t).map((o) => {
      t[o].disconnect();
    });
  }
  function q() {
    r.forEach(L);
  }
  function B(t) {
    const o = new ResizeObserver(F);
    o.observe(t.node), t.observers.resize = o;
  }
  function K() {
    r.forEach(B);
  }
  function I(t) {
    const o = window.innerHeight, n = t.offset || c, i = n.format === "pixels" ? 1 : o, f = n.value * i, h = t.height / 2 - f, v = t.height / 2 - (o - f), m = { rootMargin: `${h}px 0px ${v}px 0px`, threshold: 0.5, root: u }, N = new IntersectionObserver(D, m);
    N.observe(t.node), t.observers.step = N, M && re({ id: s, step: t, marginTop: h });
  }
  function G() {
    r.forEach(I);
  }
  function J(t) {
    const o = window.innerHeight, n = t.offset || c, i = n.format === "pixels" ? 1 : o, f = n.value * i, h = -f + t.height, v = f - o, x = `${h}px 0px ${v}px 0px`, E = oe(t.height, p), g = { rootMargin: x, threshold: E }, m = new IntersectionObserver(U, g);
    m.observe(t.node), t.observers.progress = m;
  }
  function Q() {
    r.forEach(J);
  }
  function k() {
    q(), K(), G(), z && Q();
  }
  const l = {};
  return l.setup = ({
    step: t,
    parent: o,
    offset: n = 0.5,
    threshold: i = 4,
    progress: f = !1,
    once: h = !1,
    debug: v = !1,
    container: x = void 0,
    root: E = null
  }) => (le(x), r = te(t, o).map((g, m) => ({
    index: m,
    direction: void 0,
    height: g.offsetHeight,
    node: g,
    observers: {},
    offset: T(g.dataset.offset),
    top: ce(g),
    progress: 0,
    state: void 0
  })), r.length ? (z = f, R = h, M = v, p = Math.max(1, +i), c = T(n), a = x, u = E, A(), ie(r), S(!0), l) : (w("no step elements"), l)), l.enable = () => (S(!0), l), l.disable = () => (S(!1), l), l.destroy = () => (S(!1), A(), l), l.resize = () => (k(), l), l.offset = (t) => t == null ? c.value : (c = T(t), k(), l), l.onStepEnter = (t) => (typeof t == "function" ? e.stepEnter = t : w("onStepEnter requires a function"), l), l.onStepExit = (t) => (typeof t == "function" ? e.stepExit = t : w("onStepExit requires a function"), l), l.onStepProgress = (t) => (typeof t == "function" ? e.stepProgress = t : w("onStepProgress requires a function"), l), l;
}
const fe = (e, s) => {
  const r = e.__vccOpts || e;
  for (const [c, a] of s)
    r[c] = a;
  return r;
}, ae = {
  name: "Scrollama",
  inheritAttrs: !1,
  emits: ["step-progress", "step-enter", "step-exit"],
  data() {
    return {
      scroller: null
    };
  },
  computed: {
    opts() {
      const e = this.$ && this.$.vnode && this.$.vnode.props ? this.$.vnode.props : {}, s = Object.prototype.hasOwnProperty.call(
        e,
        "onStepProgress"
      );
      return Object.assign({}, {
        step: Array.from(this.$el.children),
        progress: s
      }, this.$attrs);
    }
  },
  mounted() {
    this.scroller = H(), this.setup();
  },
  beforeUnmount() {
    this.scroller && this.scroller.destroy(), window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    setup() {
      this.scroller && (this.scroller.destroy(), this.scroller.setup(this.opts).onStepProgress((e) => {
        this.$emit("step-progress", e);
      }).onStepEnter((e) => {
        this.$emit("step-enter", e);
      }).onStepExit((e) => {
        this.$emit("step-exit", e);
      }), window.removeEventListener("resize", this.handleResize), window.addEventListener("resize", this.handleResize));
    },
    handleResize() {
      this.scroller && this.scroller.resize();
    }
  }
}, ue = { class: "scrollama__steps" };
function pe(e, s, r, c, a, u) {
  return V(), W("div", ue, [
    X(e.$slots, "default")
  ]);
}
const he = /* @__PURE__ */ fe(ae, [["render", pe]]);
function ge(e) {
  let s = null, r = null;
  Z(() => {
    s = H();
    const c = (
      /** @type {Record<string, unknown>} */
      {}
    ), a = ["onStepEnter", "onStepExit", "onStepProgress"];
    for (const [u, p] of Object.entries(e))
      a.includes(u) || (c[u] = p);
    s.setup(
      /** @type {any} */
      c
    ), e.onStepEnter && s.onStepEnter(e.onStepEnter), e.onStepExit && s.onStepExit(e.onStepExit), e.onStepProgress && s.onStepProgress(
      /** @type {any} */
      e.onStepProgress
    ), r = () => {
      s && s.resize();
    }, window.addEventListener("resize", r);
  }), ee(() => {
    s && (s.destroy(), s = null), r && (window.removeEventListener("resize", r), r = null);
  });
}
export {
  he as default,
  ge as useScrollama
};
