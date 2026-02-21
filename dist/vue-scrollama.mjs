import { openBlock as ge, createElementBlock as me, renderSlot as he } from "vue";
function be(r, l = document) {
  return typeof r == "string" ? Array.from(l.querySelectorAll(r)) : r instanceof Element ? [r] : r instanceof NodeList ? Array.from(r) : r instanceof Array ? r : [];
}
function J(r) {
  return `scrollama__debug-offset--${r}`;
}
function we({ id: r, offsetVal: l, stepClass: f }) {
  const i = document.createElement("div");
  i.id = J(r), i.className = "scrollama__debug-offset", i.style.position = "fixed", i.style.left = "0", i.style.width = "100%", i.style.height = "0", i.style.borderTop = "2px dashed black", i.style.zIndex = "9999";
  const s = document.createElement("p");
  s.innerHTML = `".${f}" trigger: <span>${l}</span>`, s.style.fontSize = "12px", s.style.fontFamily = "monospace", s.style.color = "black", s.style.margin = "0", s.style.padding = "6px", i.appendChild(s), document.body.appendChild(i);
}
function xe({ id: r, offsetVal: l, stepEl: f }) {
  const i = f[0].className;
  we({ id: r, offsetVal: l, stepClass: i });
}
function ye({ id: r, offsetMargin: l, offsetVal: f, format: i }) {
  const s = i === "pixels" ? "px" : "", m = J(r), x = document.getElementById(m);
  x.style.top = `${l}px`, x.querySelector("span").innerText = `${f}${s}`;
}
function G({ id: r, index: l, state: f }) {
  const i = `scrollama__debug-step--${r}-${l}`, s = document.getElementById(`${i}_above`), m = document.getElementById(`${i}_below`), x = f === "enter" ? "block" : "none";
  s && (s.style.display = x), m && (m.style.display = x);
}
function ve() {
  const r = [
    "stepAbove",
    "stepBelow",
    "stepProgress",
    "viewportAbove",
    "viewportBelow"
  ];
  let l = {}, f = {}, i = null, s = [], m = [], x = [], u = [], y = 0, g = 0, $ = 0, R = 0, H = 0, C = 0, k = !1, I = !1, B = !1, M = !1, z = !1, N = !1, h = "down", P = "percent";
  const Y = [];
  function b(e) {
    console.error(`scrollama error: ${e}`);
  }
  function V() {
    l = {
      stepEnter: () => {
      },
      stepExit: () => {
      },
      stepProgress: () => {
      }
    }, f = {};
  }
  function K() {
    const e = "abcdefghijklmnopqrstuv", t = e.length, o = Date.now();
    return `${[0, 0, 0].map((c) => e[Math.floor(Math.random() * t)]).join("")}${o}`;
  }
  function Q(e) {
    const { top: t } = e.getBoundingClientRect(), o = window.pageYOffset, n = document.body.clientTop || 0;
    return t + o - n;
  }
  function W() {
    const { body: e } = document, t = document.documentElement;
    return Math.max(
      e.scrollHeight,
      e.offsetHeight,
      t.clientHeight,
      t.scrollHeight,
      t.offsetHeight
    );
  }
  function E(e) {
    return +e.getAttribute("data-scrollama-index");
  }
  function _() {
    window.pageYOffset > H ? h = "down" : window.pageYOffset < H && (h = "up"), H = window.pageYOffset;
  }
  function q(e) {
    f[e] && f[e].forEach((t) => t.disconnect());
  }
  function D() {
    $ = window.innerHeight, R = W(), g = y * (P === "pixels" ? 1 : $), k && (m = s.map((t) => t.getBoundingClientRect().height), x = s.map(Q), I && L()), B && ye({ id: i, offsetMargin: g, offsetVal: y, format: P });
  }
  function j(e) {
    if (e && !I)
      if (k)
        L();
      else {
        b("scrollama error: enable() called before scroller was ready"), I = !1;
        return;
      }
    !e && I && r.forEach(q), I = e;
  }
  function X(e) {
    const t = Math.ceil(e / C), o = [], n = 1 / t;
    for (let c = 0; c < t; c += 1)
      o.push(c * n);
    return o;
  }
  function T(e, t) {
    const o = E(e);
    t !== void 0 && (u[o].progress = t);
    const n = { element: e, index: o, progress: u[o].progress };
    u[o].state === "enter" && l.stepProgress(n);
  }
  function F(e, t) {
    if (t === "above")
      for (let o = 0; o < e; o += 1) {
        const n = u[o];
        n.state !== "enter" && n.direction !== "down" ? (O(s[o], "down", !1), v(s[o], "down")) : n.state === "enter" && v(s[o], "down");
      }
    else if (t === "below")
      for (let o = u.length - 1; o > e; o -= 1) {
        const n = u[o];
        n.state === "enter" && v(s[o], "up"), n.direction === "down" && (O(s[o], "up", !1), v(s[o], "up"));
      }
  }
  function O(e, t, o = !0) {
    const n = E(e), c = { element: e, index: n, direction: t };
    u[n].direction = t, u[n].state = "enter", z && o && t === "down" && F(n, "above"), z && o && t === "up" && F(n, "below"), l.stepEnter && !Y[n] && (l.stepEnter(c, u), B && G({ id: i, index: n, state: "enter" }), N && (Y[n] = !0)), M && T(e);
  }
  function v(e, t) {
    const o = E(e), n = { element: e, index: o, direction: t };
    M && (t === "down" && u[o].progress < 1 ? T(e, 1) : t === "up" && u[o].progress > 0 && T(e, 0)), u[o].direction = t, u[o].state = "exit", l.stepExit(n, u), B && G({ id: i, index: o, state: "exit" });
  }
  function Z([e]) {
    _();
    const { isIntersecting: t, boundingClientRect: o, target: n } = e, { top: c, bottom: d } = o, a = c - g, w = d - g, A = E(n), S = u[A];
    t && a <= 0 && w >= 0 && h === "down" && S.state !== "enter" && O(n, h), !t && a > 0 && h === "up" && S.state === "enter" && v(n, h);
  }
  function ee([e]) {
    _();
    const { isIntersecting: t, boundingClientRect: o, target: n } = e, { top: c, bottom: d } = o, a = c - g, w = d - g, A = E(n), S = u[A];
    t && a <= 0 && w >= 0 && h === "up" && S.state !== "enter" && O(n, h), !t && w < 0 && h === "down" && S.state === "enter" && v(n, h);
  }
  function te([e]) {
    _();
    const { isIntersecting: t, target: o } = e, n = E(o), c = u[n];
    t && h === "down" && c.direction !== "down" && c.state !== "enter" && (O(o, "down"), v(o, "down"));
  }
  function oe([e]) {
    _();
    const { isIntersecting: t, target: o } = e, n = E(o), c = u[n];
    t && h === "up" && c.direction === "down" && c.state !== "enter" && (O(o, "up"), v(o, "up"));
  }
  function ne([e]) {
    _();
    const {
      isIntersecting: t,
      intersectionRatio: o,
      boundingClientRect: n,
      target: c
    } = e, { bottom: d } = n, a = d - g;
    t && a >= 0 && T(c, +o);
  }
  function se() {
    f.viewportAbove = s.map((e, t) => {
      const o = R - x[t], n = g - $ - m[t], d = { rootMargin: `${o}px 0px ${n}px 0px` }, a = new IntersectionObserver(te, d);
      return a.observe(e), a;
    });
  }
  function re() {
    f.viewportBelow = s.map((e, t) => {
      const o = -g - m[t], n = g - $ + m[t] + R, d = { rootMargin: `${o}px 0px ${n}px 0px` }, a = new IntersectionObserver(oe, d);
      return a.observe(e), a;
    });
  }
  function ie() {
    f.stepAbove = s.map((e, t) => {
      const o = -g + m[t], n = g - $, d = { rootMargin: `${o}px 0px ${n}px 0px` }, a = new IntersectionObserver(Z, d);
      return a.observe(e), a;
    });
  }
  function ce() {
    f.stepBelow = s.map((e, t) => {
      const o = -g, n = g - $ + m[t], d = { rootMargin: `${o}px 0px ${n}px 0px` }, a = new IntersectionObserver(ee, d);
      return a.observe(e), a;
    });
  }
  function le() {
    f.stepProgress = s.map((e, t) => {
      const o = m[t] - g, n = -$ + g, c = `${o}px 0px ${n}px 0px`, d = X(m[t]), a = { rootMargin: c, threshold: d }, w = new IntersectionObserver(ne, a);
      return w.observe(e), w;
    });
  }
  function L() {
    r.forEach(q), se(), re(), ie(), ce(), M && le();
  }
  function ae() {
    s.forEach((e, t) => e.setAttribute("data-scrollama-index", t));
  }
  function pe() {
    u = s.map(() => ({
      direction: null,
      state: null,
      progress: 0
    }));
  }
  function fe() {
    B && xe({ id: i, stepEl: s, offsetVal: y });
  }
  function ue(e) {
    const t = window.getComputedStyle(e);
    return (t.overflowY === "scroll" || t.overflowY === "auto") && e.scrollHeight > e.clientHeight;
  }
  function U(e) {
    return e && e.nodeType === 1 ? ue(e) ? e : U(e.parentNode) : !1;
  }
  const p = {};
  return p.setup = ({
    step: e,
    parent: t,
    offset: o = 0.5,
    progress: n = !1,
    threshold: c = 4,
    debug: d = !1,
    order: a = !0,
    once: w = !1
  }) => {
    if (V(), i = K(), s = be(e, t), !s.length)
      return b("no step elements"), p;
    const A = s.reduce(
      (S, de) => S || U(de.parentNode),
      !1
    );
    return A && console.error(
      "scrollama error: step elements cannot be children of a scrollable element. Remove any css on the parent element with overflow: scroll; or overflow: auto; on elements with fixed height.",
      A
    ), B = d, M = n, z = a, N = w, p.offsetTrigger(o), C = Math.max(1, +c), k = !0, fe(), ae(), pe(), D(), p.enable(), p;
  }, p.resize = () => (D(), p), p.enable = () => (j(!0), p), p.disable = () => (j(!1), p), p.destroy = () => {
    j(!1), V();
  }, p.offsetTrigger = (e) => {
    if (e === null) return y;
    if (typeof e == "number")
      P = "percent", e > 1 && b("offset value is greater than 1. Fallback to 1."), e < 0 && b("offset value is lower than 0. Fallback to 0."), y = Math.min(Math.max(0, e), 1);
    else if (typeof e == "string" && e.indexOf("px") > 0) {
      const t = +e.replace("px", "");
      isNaN(t) ? (b("offset value must be in 'px' format. Fallback to 0.5."), y = 0.5) : (P = "pixels", y = t);
    } else
      b("offset value does not include 'px'. Fallback to 0.5."), y = 0.5;
    return p;
  }, p.onStepEnter = (e) => (typeof e == "function" ? l.stepEnter = e : b("onStepEnter requires a function"), p), p.onStepExit = (e) => (typeof e == "function" ? l.stepExit = e : b("onStepExit requires a function"), p), p.onStepProgress = (e) => (typeof e == "function" ? l.stepProgress = e : b("onStepProgress requires a function"), p), p;
}
const $e = (r, l) => {
  const f = r.__vccOpts || r;
  for (const [i, s] of l)
    f[i] = s;
  return f;
}, Ee = {
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
      const r = this.$ && this.$.vnode && this.$.vnode.props ? this.$.vnode.props : {}, l = Object.prototype.hasOwnProperty.call(
        r,
        "onStepProgress"
      );
      return Object.assign({}, {
        step: Array.from(this.$el.children),
        progress: l
      }, this.$attrs);
    }
  },
  mounted() {
    this.scroller = ve(), this.setup();
  },
  beforeUnmount() {
    this.scroller && this.scroller.destroy(), window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    setup() {
      this.scroller && (this.scroller.destroy(), this.scroller.setup(this.opts).onStepProgress((r) => {
        this.$emit("step-progress", r);
      }).onStepEnter((r) => {
        this.$emit("step-enter", r);
      }).onStepExit((r) => {
        this.$emit("step-exit", r);
      }), window.addEventListener("resize", this.handleResize));
    },
    handleResize() {
      this.scroller && this.scroller.resize();
    }
  }
}, Se = { class: "scrollama__steps" };
function Oe(r, l, f, i, s, m) {
  return ge(), me("div", Se, [
    he(r.$slots, "default")
  ]);
}
const Ie = /* @__PURE__ */ $e(Ee, [["render", Oe]]);
export {
  Ie as default
};
