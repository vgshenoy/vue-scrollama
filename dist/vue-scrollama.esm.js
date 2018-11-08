var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var scrollama = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () {
// DOM helper functions

// private
function selectionToArray(selection) {
  var len = selection.length;
  var result = [];
  for (var i = 0; i < len; i += 1) {
    result.push(selection[i]);
  }
  return result;
}

// public
function select(selector) {
  if (selector instanceof Element) { return selector; }
  else if (typeof selector === 'string')
    { return document.querySelector(selector); }
  return null;
}

function selectAll(selector, parent) {
  if ( parent === void 0 ) { parent = document; }

  if (typeof selector === 'string') {
    return selectionToArray(parent.querySelectorAll(selector));
  } else if (selector instanceof Element) {
    return selectionToArray([selector]);
  } else if (selector instanceof NodeList) {
    return selectionToArray(selector);
  } else if (selector instanceof Array) {
    return selector;
  }
  return [];
}

function getStepId(ref) {
  var id = ref.id;
  var i = ref.i;

  return ("scrollama__debug-step--" + id + "-" + i);
}

function getOffsetId(ref) {
  var id = ref.id;

  return ("scrollama__debug-offset--" + id);
}

// SETUP

function setupOffset(ref) {
  var id = ref.id;
  var offsetVal = ref.offsetVal;
  var stepClass = ref.stepClass;

  var el = document.createElement('div');
  el.setAttribute('id', getOffsetId({ id: id }));
  el.setAttribute('class', 'scrollama__debug-offset');

  el.style.position = 'fixed';
  el.style.left = '0';
  el.style.width = '100%';
  el.style.height = '0px';
  el.style.borderTop = '2px dashed black';
  el.style.zIndex = '9999';

  var text = document.createElement('p');
  text.innerText = "\"." + stepClass + "\" trigger: " + offsetVal;
  text.style.fontSize = '12px';
  text.style.fontFamily = 'monospace';
  text.style.color = 'black';
  text.style.margin = '0';
  text.style.padding = '6px';
  el.appendChild(text);
  document.body.appendChild(el);
}

function setup(ref) {
  var id = ref.id;
  var offsetVal = ref.offsetVal;
  var stepEl = ref.stepEl;

  var stepClass = stepEl[0].getAttribute('class');
  setupOffset({ id: id, offsetVal: offsetVal, stepClass: stepClass });
}

// UPDATE
function updateOffset(ref) {
  var id = ref.id;
  var offsetMargin = ref.offsetMargin;
  var offsetVal = ref.offsetVal;

  var idVal = getOffsetId({ id: id });
  var el = document.querySelector(("#" + idVal));
  el.style.top = offsetMargin + "px";
}

function update(ref) {
  var id = ref.id;
  var stepOffsetHeight = ref.stepOffsetHeight;
  var offsetMargin = ref.offsetMargin;
  var offsetVal = ref.offsetVal;

  updateOffset({ id: id, offsetMargin: offsetMargin });
}

function notifyStep(ref) {
  var id = ref.id;
  var index = ref.index;
  var state = ref.state;

  var idVal = getStepId({ id: id, i: index });
  var elA = document.querySelector(("#" + idVal + "_above"));
  var elB = document.querySelector(("#" + idVal + "_below"));
  var display = state === 'enter' ? 'block' : 'none';

  if (elA) { elA.style.display = display; }
  if (elB) { elB.style.display = display; }
}

function scrollama() {
  var ZERO_MOE = 1; // zero with some rounding margin of error
  var callback = {};
  var io = {};

  var containerEl = null;
  var graphicEl = null;
  var stepEl = null;

  var id = null;
  var offsetVal = 0;
  var offsetMargin = 0;
  var vh = 0;
  var ph = 0;
  var stepOffsetHeight = null;
  var stepOffsetTop = null;
  var bboxGraphic = null;

  var isReady = false;
  var isEnabled = false;
  var debugMode = false;
  var progressMode = false;
  var progressThreshold = 0;
  var preserveOrder = false;
  var triggerOnce = false;

  var stepStates = null;
  var containerState = null;
  var previousYOffset = -1;
  var direction = null;

  var exclude = [];

  // HELPERS
  function generateId() {
    var a = 'abcdefghijklmnopqrstuv';
    var l = a.length;
    var t = new Date().getTime();
    var r = [0, 0, 0].map(function (d) { return a[Math.floor(Math.random() * l)]; }).join('');
    return ("" + r + t);
  }

  //www.gomakethings.com/how-to-get-an-elements-distance-from-the-top-of-the-page-with-vanilla-javascript/
  function getOffsetTop(el) {
    // Set our distance placeholder
    var distance = 0;

    // Loop up the DOM
    if (el.offsetParent) {
      do {
        distance += el.offsetTop;
        el = el.offsetParent;
      } while (el);
    }

    // Return our distance
    return distance < 0 ? 0 : distance;
  }

  function getPageHeight() {
    var body = document.body;
    var html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }

  function getIndex(element) {
    return +element.getAttribute('data-scrollama-index');
  }

  function updateDirection() {
    if (window.pageYOffset > previousYOffset) { direction = 'down'; }
    else if (window.pageYOffset < previousYOffset) { direction = 'up'; }
    previousYOffset = window.pageYOffset;
  }

  function handleResize() {
    vh = window.innerHeight;
    ph = getPageHeight();

    bboxGraphic = graphicEl ? graphicEl.getBoundingClientRect() : null;

    offsetMargin = offsetVal * vh;

    stepOffsetHeight = stepEl ? stepEl.map(function (el) { return el.offsetHeight; }) : [];

    stepOffsetTop = stepEl ? stepEl.map(getOffsetTop) : [];

    if (isEnabled && isReady) { updateIO(); }

    if (debugMode)
      { update({ id: id, stepOffsetHeight: stepOffsetHeight, offsetMargin: offsetMargin, offsetVal: offsetVal }); }
  }

  function handleEnable(enable) {
    if (enable && !isEnabled) {
      if (isReady) { updateIO(); }
      isEnabled = true;
    } else if (!enable) {
      if (io.top) { io.top.disconnect(); }
      if (io.bottom) { io.bottom.disconnect(); }
      if (io.stepAbove) { io.stepAbove.forEach(function (d) { return d.disconnect(); }); }
      if (io.stepBelow) { io.stepBelow.forEach(function (d) { return d.disconnect(); }); }
      if (io.stepProgress) { io.stepProgress.forEach(function (d) { return d.disconnect(); }); }
      if (io.viewportAbove) { io.viewportAbove.forEach(function (d) { return d.disconnect(); }); }
      if (io.viewportBelow) { io.viewportBelow.forEach(function (d) { return d.disconnect(); }); }
      isEnabled = false;
    }
  }

  function createThreshold(height) {
    var count = Math.ceil(height / progressThreshold);
    var t = [];
    var ratio = 1 / count;
    for (var i = 0; i < count; i++) {
      t.push(i * ratio);
    }
    return t;
  }

  // NOTIFY CALLBACKS
  function notifyOthers(index, location) {
    if (location === 'above') {
      // check if steps above/below were skipped and should be notified first
      for (var i = 0; i < index; i++) {
        var ss = stepStates[i];
        if (ss.state === 'enter') { notifyStepExit(stepEl[i], 'down'); }
        if (ss.direction === 'up') {
          notifyStepEnter(stepEl[i], 'down', false);
          notifyStepExit(stepEl[i], 'down');
        }
      }
    } else if (location === 'below') {
      for (var i$1 = stepStates.length - 1; i$1 > index; i$1--) {
        var ss$1 = stepStates[i$1];
        if (ss$1.state === 'enter') {
          notifyStepExit(stepEl[i$1], 'up');
        }
        if (ss$1.direction === 'down') {
          notifyStepEnter(stepEl[i$1], 'up', false);
          notifyStepExit(stepEl[i$1], 'up');
        }
      }
    }
  }

  function notifyStepEnter(element, direction, check) {
    if ( check === void 0 ) { check = true; }

    var index = getIndex(element);
    var resp = { element: element, index: index, direction: direction };

    // store most recent trigger
    stepStates[index].direction = direction;
    stepStates[index].state = 'enter';

    if (preserveOrder && check && direction === 'down')
      { notifyOthers(index, 'above'); }

    if (preserveOrder && check && direction === 'up')
      { notifyOthers(index, 'below'); }

    if (
      callback.stepEnter &&
      typeof callback.stepEnter === 'function' &&
      !exclude[index]
    ) {
      callback.stepEnter(resp, stepStates);
      if (debugMode) { notifyStep({ id: id, index: index, state: 'enter' }); }
      if (triggerOnce) { exclude[index] = true; }
    }

    if (progressMode) {
      if (direction === 'down') { notifyStepProgress(element, 0); }
      else { notifyStepProgress(element, 1); }
    }
  }

  function notifyStepExit(element, direction) {
    var index = getIndex(element);
    var resp = { element: element, index: index, direction: direction };

    // store most recent trigger
    stepStates[index].direction = direction;
    stepStates[index].state = 'exit';

    if (progressMode) {
      if (direction === 'down') { notifyStepProgress(element, 1); }
      else { notifyStepProgress(element, 0); }
    }

    if (callback.stepExit && typeof callback.stepExit === 'function') {
      callback.stepExit(resp, stepStates);
      if (debugMode) { notifyStep({ id: id, index: index, state: 'exit' }); }
    }
  }

  function notifyStepProgress(element, progress) {
    var index = getIndex(element);
    var resp = { element: element, index: index, progress: progress };
    if (callback.stepProgress && typeof callback.stepProgress === 'function')
      { callback.stepProgress(resp); }
  }

  function notifyContainerEnter() {
    var resp = { direction: direction };
    containerState.direction = direction;
    containerState.state = 'enter';
    if (
      callback.containerEnter &&
      typeof callback.containerEnter === 'function'
    )
      { callback.containerEnter(resp); }
  }

  function notifyContainerExit() {
    var resp = { direction: direction };
    containerState.direction = direction;
    containerState.state = 'exit';
    if (callback.containerExit && typeof callback.containerExit === 'function')
      { callback.containerExit(resp); }
  }

  // OBSERVER - INTERSECT HANDLING

  // if TOP edge of step crosses threshold,
  // bottom must be > 0 which means it is on "screen" (shifted by offset)
  function intersectStepAbove(entries) {
    updateDirection();
    entries.forEach(function (entry) {
      var isIntersecting = entry.isIntersecting;
      var boundingClientRect = entry.boundingClientRect;
      var target = entry.target;

      // bottom is how far bottom edge of el is from top of viewport
      var bottom = boundingClientRect.bottom;
      var height = boundingClientRect.height;
      var bottomAdjusted = bottom - offsetMargin;
      var index = getIndex(target);
      var ss = stepStates[index];

      if (bottomAdjusted >= -ZERO_MOE) {
        if (isIntersecting && direction === 'down' && ss.state !== 'enter')
          { notifyStepEnter(target, direction); }
        else if (!isIntersecting && direction === 'up' && ss.state === 'enter')
          { notifyStepExit(target, direction); }
        else if (
          !isIntersecting &&
          bottomAdjusted >= height &&
          direction === 'down' &&
          ss.state === 'enter'
        ) {
          notifyStepExit(target, direction);
        }
      }
    });
  }

  function intersectStepBelow(entries) {
    updateDirection();
    entries.forEach(function (entry) {
      var isIntersecting = entry.isIntersecting;
      var boundingClientRect = entry.boundingClientRect;
      var target = entry.target;

      var bottom = boundingClientRect.bottom;
      var height = boundingClientRect.height;
      var bottomAdjusted = bottom - offsetMargin;
      var index = getIndex(target);
      var ss = stepStates[index];

      if (
        bottomAdjusted >= -ZERO_MOE &&
        bottomAdjusted < height &&
        isIntersecting &&
        direction === 'up' &&
        ss.state !== 'enter'
      ) {
        notifyStepEnter(target, direction);
      } else if (
        bottomAdjusted <= ZERO_MOE &&
        !isIntersecting &&
        direction === 'down' &&
        ss.state === 'enter'
      ) {
        notifyStepExit(target, direction);
      }
    });
  }

  /*
	if there is a scroll event where a step never intersects (therefore
	skipping an enter/exit trigger), use this fallback to detect if it is
	in view
	*/
  function intersectViewportAbove(entries) {
    updateDirection();
    entries.forEach(function (entry) {
      var isIntersecting = entry.isIntersecting;
      var target = entry.target;
      var index = getIndex(target);
      var ss = stepStates[index];
      if (
        isIntersecting &&
        direction === 'down' &&
        ss.state !== 'enter' &&
        ss.direction !== 'down'
      ) {
        notifyStepEnter(target, 'down');
        notifyStepExit(target, 'down');
      }
    });
  }

  function intersectViewportBelow(entries) {
    updateDirection();
    entries.forEach(function (entry) {
      var isIntersecting = entry.isIntersecting;
      var target = entry.target;
      var index = getIndex(target);
      var ss = stepStates[index];
      if (
        isIntersecting &&
        direction === 'up' &&
        ss.state !== 'enter' &&
        ss.direction !== 'up'
      ) {
        notifyStepEnter(target, 'up');
        notifyStepExit(target, 'up');
      }
    });
  }

  function intersectStepProgress(entries) {
    updateDirection();
    entries.forEach(
      function (ref) {
        var isIntersecting = ref.isIntersecting;
        var intersectionRatio = ref.intersectionRatio;
        var boundingClientRect = ref.boundingClientRect;
        var target = ref.target;

        var bottom = boundingClientRect.bottom;
        var bottomAdjusted = bottom - offsetMargin;

        if (isIntersecting && bottomAdjusted >= -ZERO_MOE) {
          notifyStepProgress(target, +intersectionRatio.toFixed(3));
        }
      }
    );
  }

  function intersectTop(entries) {
    updateDirection();
    var ref = entries[0];
    var isIntersecting = ref.isIntersecting;
    var boundingClientRect = ref.boundingClientRect;
    var top = boundingClientRect.top;
    var bottom = boundingClientRect.bottom;

    if (bottom > -ZERO_MOE) {
      if (isIntersecting) { notifyContainerEnter(direction); }
      else if (containerState.state === 'enter') { notifyContainerExit(direction); }
    }
  }

  function intersectBottom(entries) {
    updateDirection();
    var ref = entries[0];
    var isIntersecting = ref.isIntersecting;
    var boundingClientRect = ref.boundingClientRect;
    var top = boundingClientRect.top;

    if (top < ZERO_MOE) {
      if (isIntersecting) { notifyContainerEnter(direction); }
      else if (containerState.state === 'enter') { notifyContainerExit(direction); }
    }
  }

  // OBSERVER - CREATION

  function updateTopIO() {
    if (io.top) { io.top.unobserve(containerEl); }

    var options = {
      root: null,
      rootMargin: (vh + "px 0px -" + vh + "px 0px"),
      threshold: 0
    };

    io.top = new IntersectionObserver(intersectTop, options);
    io.top.observe(containerEl);
  }

  function updateBottomIO() {
    if (io.bottom) { io.bottom.unobserve(containerEl); }
    var options = {
      root: null,
      rootMargin: ("-" + (bboxGraphic.height) + "px 0px " + (bboxGraphic.height) + "px 0px"),
      threshold: 0
    };

    io.bottom = new IntersectionObserver(intersectBottom, options);
    io.bottom.observe(containerEl);
  }

  // top edge
  function updateStepAboveIO() {
    if (io.stepAbove) { io.stepAbove.forEach(function (d) { return d.disconnect(); }); }

    io.stepAbove = stepEl.map(function (el, i) {
      var marginTop = stepOffsetHeight[i];
      var marginBottom = -vh + offsetMargin;
      var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";

      var options = {
        root: null,
        rootMargin: rootMargin,
        threshold: 0
      };

      var obs = new IntersectionObserver(intersectStepAbove, options);
      obs.observe(el);
      return obs;
    });
  }

  // bottom edge
  function updateStepBelowIO() {
    if (io.stepBelow) { io.stepBelow.forEach(function (d) { return d.disconnect(); }); }

    io.stepBelow = stepEl.map(function (el, i) {
      var marginTop = -offsetMargin;
      var marginBottom = ph - vh + stepOffsetHeight[i] + offsetMargin;
      var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";

      var options = {
        root: null,
        rootMargin: rootMargin,
        threshold: 0
      };

      var obs = new IntersectionObserver(intersectStepBelow, options);
      obs.observe(el);
      return obs;
    });
  }

  // jump into viewport
  function updateViewportAboveIO() {
    if (io.viewportAbove) { io.viewportAbove.forEach(function (d) { return d.disconnect(); }); }
    io.viewportAbove = stepEl.map(function (el, i) {
      var marginTop = stepOffsetTop[i];
      var marginBottom = -(vh - offsetMargin + stepOffsetHeight[i]);
      var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
      var options = {
        root: null,
        rootMargin: rootMargin,
        threshold: 0
      };

      var obs = new IntersectionObserver(intersectViewportAbove, options);
      obs.observe(el);
      return obs;
    });
  }

  function updateViewportBelowIO() {
    if (io.viewportBelow) { io.viewportBelow.forEach(function (d) { return d.disconnect(); }); }
    io.viewportBelow = stepEl.map(function (el, i) {
      var marginTop = -(offsetMargin + stepOffsetHeight[i]);
      var marginBottom =
        ph - stepOffsetTop[i] - stepOffsetHeight[i] - offsetMargin;
      var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";
      var options = {
        root: null,
        rootMargin: rootMargin,
        threshold: 0
      };

      var obs = new IntersectionObserver(intersectViewportBelow, options);
      obs.observe(el);
      return obs;
    });
  }

  // progress progress tracker
  function updateStepProgressIO() {
    if (io.stepProgress) { io.stepProgress.forEach(function (d) { return d.disconnect(); }); }

    io.stepProgress = stepEl.map(function (el, i) {
      var marginTop = stepOffsetHeight[i] - offsetMargin;
      var marginBottom = -vh + offsetMargin;
      var rootMargin = marginTop + "px 0px " + marginBottom + "px 0px";

      var threshold = createThreshold(stepOffsetHeight[i]);
      var options = {
        root: null,
        rootMargin: rootMargin,
        threshold: threshold
      };

      var obs = new IntersectionObserver(intersectStepProgress, options);
      obs.observe(el);
      return obs;
    });
  }

  function updateIO() {
    updateViewportAboveIO();
    updateViewportBelowIO();
    updateStepAboveIO();
    updateStepBelowIO();

    if (progressMode) { updateStepProgressIO(); }

    if (containerEl && graphicEl) {
      updateTopIO();
      updateBottomIO();
    }
  }

  // SETUP FUNCTIONS

  function indexSteps() {
    stepEl.forEach(function (el, i) { return el.setAttribute('data-scrollama-index', i); });
  }

  function setupStates() {
    stepStates = stepEl.map(function () { return ({
      direction: null,
      state: null
    }); });

    containerState = { direction: null, state: null };
  }

  function addDebug() {
    if (debugMode) { setup({ id: id, stepEl: stepEl, offsetVal: offsetVal }); }
  }

  var S = {};

  S.setup = function (ref) {
    var container = ref.container;
    var graphic = ref.graphic;
    var step = ref.step;
    var offset = ref.offset; if ( offset === void 0 ) { offset = 0.5; }
    var progress = ref.progress; if ( progress === void 0 ) { progress = false; }
    var threshold = ref.threshold; if ( threshold === void 0 ) { threshold = 4; }
    var debug = ref.debug; if ( debug === void 0 ) { debug = false; }
    var order = ref.order; if ( order === void 0 ) { order = true; }
    var once = ref.once; if ( once === void 0 ) { once = false; }

    id = generateId();
    // elements
    stepEl = selectAll(step);
    containerEl = container ? select(container) : null;
    graphicEl = graphic ? select(graphic) : null;

    // error if no step selected
    if (!stepEl.length) {
      console.error('scrollama error: no step elements');
      return S;
    }

    // options
    debugMode = debug;
    progressMode = progress;
    preserveOrder = order;
    triggerOnce = once;

    S.offsetTrigger(offset);
    progressThreshold = Math.max(1, +threshold);

    isReady = true;

    // customize
    addDebug();
    indexSteps();
    setupStates();
    handleResize();
    handleEnable(true);
    return S;
  };

  S.resize = function () {
    handleResize();
    return S;
  };

  S.enable = function () {
    handleEnable(true);
    return S;
  };

  S.disable = function () {
    handleEnable(false);
    return S;
  };

  S.destroy = function () {
    handleEnable(false);
    Object.keys(callback).forEach(function (c) { return (callback[c] = null); });
    Object.keys(io).forEach(function (i) { return (io[i] = null); });
  };

  S.offsetTrigger = function(x) {
    if (x && !isNaN(x)) {
      offsetVal = Math.min(Math.max(0, x), 1);
      return S;
    }
    return offsetVal;
  };

  S.onStepEnter = function (cb) {
    callback.stepEnter = cb;
    return S;
  };

  S.onStepExit = function (cb) {
    callback.stepExit = cb;
    return S;
  };

  S.onStepProgress = function (cb) {
    callback.stepProgress = cb;
    return S;
  };

  S.onContainerEnter = function (cb) {
    callback.containerEnter = cb;
    return S;
  };

  S.onContainerExit = function (cb) {
    callback.containerExit = cb;
    return S;
  };

  return S;
}

return scrollama;

})));
});

function getInternetExplorerVersion() {
	var ua = window.navigator.userAgent;

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	// other browser
	return -1;
}

var isIE = void 0;

function initCompat() {
	if (!initCompat.init) {
		initCompat.init = true;
		isIE = getInternetExplorerVersion() !== -1;
	}
}

var ResizeObserver = { render: function render() {
		var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "resize-observer", attrs: { "tabindex": "-1" } });
	}, staticRenderFns: [], _scopeId: 'data-v-b329ee4c',
	name: 'resize-observer',

	methods: {
		notify: function notify() {
			this.$emit('notify');
		},
		addResizeHandlers: function addResizeHandlers() {
			this._resizeObject.contentDocument.defaultView.addEventListener('resize', this.notify);
			if (this._w !== this.$el.offsetWidth || this._h !== this.$el.offsetHeight) {
				this.notify();
			}
		},
		removeResizeHandlers: function removeResizeHandlers() {
			if (this._resizeObject && this._resizeObject.onload) {
				if (!isIE && this._resizeObject.contentDocument) {
					this._resizeObject.contentDocument.defaultView.removeEventListener('resize', this.notify);
				}
				delete this._resizeObject.onload;
			}
		}
	},

	mounted: function mounted() {
		var _this = this;

		initCompat();
		this.$nextTick(function () {
			_this._w = _this.$el.offsetWidth;
			_this._h = _this.$el.offsetHeight;
		});
		var object = document.createElement('object');
		this._resizeObject = object;
		object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
		object.setAttribute('aria-hidden', 'true');
		object.setAttribute('tabindex', -1);
		object.onload = this.addResizeHandlers;
		object.type = 'text/html';
		if (isIE) {
			this.$el.appendChild(object);
		}
		object.data = 'about:blank';
		if (!isIE) {
			this.$el.appendChild(object);
		}
	},
	beforeDestroy: function beforeDestroy() {
		this.removeResizeHandlers();
	}
};

// Install the components
function install(Vue) {
	Vue.component('resize-observer', ResizeObserver);
	/* -- Add more components here -- */
}

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
var plugin = {
	// eslint-disable-next-line no-undef
	version: "0.4.4",
	install: install
};

// Auto-install
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

var stickyfill = createCommonjsModule(function (module) {
(function(window, document) {
    
    /*
     * 1. Check if the browser supports `position: sticky` natively or is too old to run the polyfill.
     *    If either of these is the case set `seppuku` flag. It will be checked later to disable key features
     *    of the polyfill, but the API will remain functional to avoid breaking things.
     */
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var seppuku = false;
    
    var isWindowDefined = typeof window !== 'undefined';
    
    // The polyfill can’t function properly without `window` or `window.getComputedStyle`.
    if (!isWindowDefined || !window.getComputedStyle) { seppuku = true; }
    // Dont’t get in a way if the browser supports `position: sticky` natively.
    else {
            (function () {
                var testNode = document.createElement('div');
    
                if (['', '-webkit-', '-moz-', '-ms-'].some(function (prefix) {
                    try {
                        testNode.style.position = prefix + 'sticky';
                    } catch (e) {}
    
                    return testNode.style.position != '';
                })) { seppuku = true; }
            })();
        }
    
    /*
     * 2. “Global” vars used across the polyfill
     */
    var isInitialized = false;
    
    // Check if Shadow Root constructor exists to make further checks simpler
    var shadowRootExists = typeof ShadowRoot !== 'undefined';
    
    // Last saved scroll position
    var scroll = {
        top: null,
        left: null
    };
    
    // Array of created Sticky instances
    var stickies = [];
    
    /*
     * 3. Utility functions
     */
    function extend(targetObj, sourceObject) {
        for (var key in sourceObject) {
            if (sourceObject.hasOwnProperty(key)) {
                targetObj[key] = sourceObject[key];
            }
        }
    }
    
    function parseNumeric(val) {
        return parseFloat(val) || 0;
    }
    
    function getDocOffsetTop(node) {
        var docOffsetTop = 0;
    
        while (node) {
            docOffsetTop += node.offsetTop;
            node = node.offsetParent;
        }
    
        return docOffsetTop;
    }
    
    /*
     * 4. Sticky class
     */
    
    var Sticky = function () {
        function Sticky(node) {
            _classCallCheck(this, Sticky);
    
            if (!(node instanceof HTMLElement)) { throw new Error('First argument must be HTMLElement'); }
            if (stickies.some(function (sticky) {
                return sticky._node === node;
            })) { throw new Error('Stickyfill is already applied to this node'); }
    
            this._node = node;
            this._stickyMode = null;
            this._active = false;
    
            stickies.push(this);
    
            this.refresh();
        }
    
        _createClass(Sticky, [{
            key: 'refresh',
            value: function refresh() {
                if (seppuku || this._removed) { return; }
                if (this._active) { this._deactivate(); }
    
                var node = this._node;
    
                /*
                 * 1. Save node computed props
                 */
                var nodeComputedStyle = getComputedStyle(node);
                var nodeComputedProps = {
                    position: nodeComputedStyle.position,
                    top: nodeComputedStyle.top,
                    display: nodeComputedStyle.display,
                    marginTop: nodeComputedStyle.marginTop,
                    marginBottom: nodeComputedStyle.marginBottom,
                    marginLeft: nodeComputedStyle.marginLeft,
                    marginRight: nodeComputedStyle.marginRight,
                    cssFloat: nodeComputedStyle.cssFloat
                };
    
                /*
                 * 2. Check if the node can be activated
                 */
                if (isNaN(parseFloat(nodeComputedProps.top)) || nodeComputedProps.display == 'table-cell' || nodeComputedProps.display == 'none') { return; }
    
                this._active = true;
    
                /*
                 * 3. Check if the current node position is `sticky`. If it is, it means that the browser supports sticky positioning,
                 *    but the polyfill was force-enabled. We set the node’s position to `static` before continuing, so that the node
                 *    is in it’s initial position when we gather its params.
                 */
                var originalPosition = node.style.position;
                if (nodeComputedStyle.position == 'sticky' || nodeComputedStyle.position == '-webkit-sticky') { node.style.position = 'static'; }
    
                /*
                 * 4. Get necessary node parameters
                 */
                var referenceNode = node.parentNode;
                var parentNode = shadowRootExists && referenceNode instanceof ShadowRoot ? referenceNode.host : referenceNode;
                var nodeWinOffset = node.getBoundingClientRect();
                var parentWinOffset = parentNode.getBoundingClientRect();
                var parentComputedStyle = getComputedStyle(parentNode);
    
                this._parent = {
                    node: parentNode,
                    styles: {
                        position: parentNode.style.position
                    },
                    offsetHeight: parentNode.offsetHeight
                };
                this._offsetToWindow = {
                    left: nodeWinOffset.left,
                    right: document.documentElement.clientWidth - nodeWinOffset.right
                };
                this._offsetToParent = {
                    top: nodeWinOffset.top - parentWinOffset.top - parseNumeric(parentComputedStyle.borderTopWidth),
                    left: nodeWinOffset.left - parentWinOffset.left - parseNumeric(parentComputedStyle.borderLeftWidth),
                    right: -nodeWinOffset.right + parentWinOffset.right - parseNumeric(parentComputedStyle.borderRightWidth)
                };
                this._styles = {
                    position: originalPosition,
                    top: node.style.top,
                    bottom: node.style.bottom,
                    left: node.style.left,
                    right: node.style.right,
                    width: node.style.width,
                    marginTop: node.style.marginTop,
                    marginLeft: node.style.marginLeft,
                    marginRight: node.style.marginRight
                };
    
                var nodeTopValue = parseNumeric(nodeComputedProps.top);
                this._limits = {
                    start: nodeWinOffset.top + window.pageYOffset - nodeTopValue,
                    end: parentWinOffset.top + window.pageYOffset + parentNode.offsetHeight - parseNumeric(parentComputedStyle.borderBottomWidth) - node.offsetHeight - nodeTopValue - parseNumeric(nodeComputedProps.marginBottom)
                };
    
                /*
                 * 5. Ensure that the node will be positioned relatively to the parent node
                 */
                var parentPosition = parentComputedStyle.position;
    
                if (parentPosition != 'absolute' && parentPosition != 'relative') {
                    parentNode.style.position = 'relative';
                }
    
                /*
                 * 6. Recalc node position.
                 *    It’s important to do this before clone injection to avoid scrolling bug in Chrome.
                 */
                this._recalcPosition();
    
                /*
                 * 7. Create a clone
                 */
                var clone = this._clone = {};
                clone.node = document.createElement('div');
    
                // Apply styles to the clone
                extend(clone.node.style, {
                    width: nodeWinOffset.right - nodeWinOffset.left + 'px',
                    height: nodeWinOffset.bottom - nodeWinOffset.top + 'px',
                    marginTop: nodeComputedProps.marginTop,
                    marginBottom: nodeComputedProps.marginBottom,
                    marginLeft: nodeComputedProps.marginLeft,
                    marginRight: nodeComputedProps.marginRight,
                    cssFloat: nodeComputedProps.cssFloat,
                    padding: 0,
                    border: 0,
                    borderSpacing: 0,
                    fontSize: '1em',
                    position: 'static'
                });
    
                referenceNode.insertBefore(clone.node, node);
                clone.docOffsetTop = getDocOffsetTop(clone.node);
            }
        }, {
            key: '_recalcPosition',
            value: function _recalcPosition() {
                if (!this._active || this._removed) { return; }
    
                var stickyMode = scroll.top <= this._limits.start ? 'start' : scroll.top >= this._limits.end ? 'end' : 'middle';
    
                if (this._stickyMode == stickyMode) { return; }
    
                switch (stickyMode) {
                    case 'start':
                        extend(this._node.style, {
                            position: 'absolute',
                            left: this._offsetToParent.left + 'px',
                            right: this._offsetToParent.right + 'px',
                            top: this._offsetToParent.top + 'px',
                            bottom: 'auto',
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0
                        });
                        break;
    
                    case 'middle':
                        extend(this._node.style, {
                            position: 'fixed',
                            left: this._offsetToWindow.left + 'px',
                            right: this._offsetToWindow.right + 'px',
                            top: this._styles.top,
                            bottom: 'auto',
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0
                        });
                        break;
    
                    case 'end':
                        extend(this._node.style, {
                            position: 'absolute',
                            left: this._offsetToParent.left + 'px',
                            right: this._offsetToParent.right + 'px',
                            top: 'auto',
                            bottom: 0,
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0
                        });
                        break;
                }
    
                this._stickyMode = stickyMode;
            }
        }, {
            key: '_fastCheck',
            value: function _fastCheck() {
                if (!this._active || this._removed) { return; }
    
                if (Math.abs(getDocOffsetTop(this._clone.node) - this._clone.docOffsetTop) > 1 || Math.abs(this._parent.node.offsetHeight - this._parent.offsetHeight) > 1) { this.refresh(); }
            }
        }, {
            key: '_deactivate',
            value: function _deactivate() {
                var _this = this;
    
                if (!this._active || this._removed) { return; }
    
                this._clone.node.parentNode.removeChild(this._clone.node);
                delete this._clone;
    
                extend(this._node.style, this._styles);
                delete this._styles;
    
                // Check whether element’s parent node is used by other stickies.
                // If not, restore parent node’s styles.
                if (!stickies.some(function (sticky) {
                    return sticky !== _this && sticky._parent && sticky._parent.node === _this._parent.node;
                })) {
                    extend(this._parent.node.style, this._parent.styles);
                }
                delete this._parent;
    
                this._stickyMode = null;
                this._active = false;
    
                delete this._offsetToWindow;
                delete this._offsetToParent;
                delete this._limits;
            }
        }, {
            key: 'remove',
            value: function remove() {
                var _this2 = this;
    
                this._deactivate();
    
                stickies.some(function (sticky, index) {
                    if (sticky._node === _this2._node) {
                        stickies.splice(index, 1);
                        return true;
                    }
                });
    
                this._removed = true;
            }
        }]);
    
        return Sticky;
    }();
    
    /*
     * 5. Stickyfill API
     */
    
    
    var Stickyfill = {
        stickies: stickies,
        Sticky: Sticky,
    
        forceSticky: function forceSticky() {
            seppuku = false;
            init();
    
            this.refreshAll();
        },
        addOne: function addOne(node) {
            // Check whether it’s a node
            if (!(node instanceof HTMLElement)) {
                // Maybe it’s a node list of some sort?
                // Take first node from the list then
                if (node.length && node[0]) { node = node[0]; }else { return; }
            }
    
            // Check if Stickyfill is already applied to the node
            // and return existing sticky
            for (var i = 0; i < stickies.length; i++) {
                if (stickies[i]._node === node) { return stickies[i]; }
            }
    
            // Create and return new sticky
            return new Sticky(node);
        },
        add: function add(nodeList) {
            // If it’s a node make an array of one node
            if (nodeList instanceof HTMLElement) { nodeList = [nodeList]; }
            // Check if the argument is an iterable of some sort
            if (!nodeList.length) { return; }
    
            // Add every element as a sticky and return an array of created Sticky instances
            var addedStickies = [];
    
            var _loop = function _loop(i) {
                var node = nodeList[i];
    
                // If it’s not an HTMLElement – create an empty element to preserve 1-to-1
                // correlation with input list
                if (!(node instanceof HTMLElement)) {
                    addedStickies.push(void 0);
                    return 'continue';
                }
    
                // If Stickyfill is already applied to the node
                // add existing sticky
                if (stickies.some(function (sticky) {
                    if (sticky._node === node) {
                        addedStickies.push(sticky);
                        return true;
                    }
                })) { return 'continue'; }
    
                // Create and add new sticky
                addedStickies.push(new Sticky(node));
            };
    
            for (var i = 0; i < nodeList.length; i++) {
                var _ret2 = _loop(i);
    
                if (_ret2 === 'continue') { continue; }
            }
    
            return addedStickies;
        },
        refreshAll: function refreshAll() {
            stickies.forEach(function (sticky) {
                return sticky.refresh();
            });
        },
        removeOne: function removeOne(node) {
            // Check whether it’s a node
            if (!(node instanceof HTMLElement)) {
                // Maybe it’s a node list of some sort?
                // Take first node from the list then
                if (node.length && node[0]) { node = node[0]; }else { return; }
            }
    
            // Remove the stickies bound to the nodes in the list
            stickies.some(function (sticky) {
                if (sticky._node === node) {
                    sticky.remove();
                    return true;
                }
            });
        },
        remove: function remove(nodeList) {
            // If it’s a node make an array of one node
            if (nodeList instanceof HTMLElement) { nodeList = [nodeList]; }
            // Check if the argument is an iterable of some sort
            if (!nodeList.length) { return; }
    
            // Remove the stickies bound to the nodes in the list
    
            var _loop2 = function _loop2(i) {
                var node = nodeList[i];
    
                stickies.some(function (sticky) {
                    if (sticky._node === node) {
                        sticky.remove();
                        return true;
                    }
                });
            };
    
            for (var i = 0; i < nodeList.length; i++) {
                _loop2(i);
            }
        },
        removeAll: function removeAll() {
            while (stickies.length) {
                stickies[0].remove();
            }
        }
    };
    
    /*
     * 6. Setup events (unless the polyfill was disabled)
     */
    function init() {
        if (isInitialized) {
            return;
        }
    
        isInitialized = true;
    
        // Watch for scroll position changes and trigger recalc/refresh if needed
        function checkScroll() {
            if (window.pageXOffset != scroll.left) {
                scroll.top = window.pageYOffset;
                scroll.left = window.pageXOffset;
    
                Stickyfill.refreshAll();
            } else if (window.pageYOffset != scroll.top) {
                scroll.top = window.pageYOffset;
                scroll.left = window.pageXOffset;
    
                // recalc position for all stickies
                stickies.forEach(function (sticky) {
                    return sticky._recalcPosition();
                });
            }
        }
    
        checkScroll();
        window.addEventListener('scroll', checkScroll);
    
        // Watch for window resizes and device orientation changes and trigger refresh
        window.addEventListener('resize', Stickyfill.refreshAll);
        window.addEventListener('orientationchange', Stickyfill.refreshAll);
    
        //Fast dirty check for layout changes every 500ms
        var fastCheckTimer = void 0;
    
        function startFastCheckTimer() {
            fastCheckTimer = setInterval(function () {
                stickies.forEach(function (sticky) {
                    return sticky._fastCheck();
                });
            }, 500);
        }
    
        function stopFastCheckTimer() {
            clearInterval(fastCheckTimer);
        }
    
        var docHiddenKey = void 0;
        var visibilityChangeEventName = void 0;
    
        if ('hidden' in document) {
            docHiddenKey = 'hidden';
            visibilityChangeEventName = 'visibilitychange';
        } else if ('webkitHidden' in document) {
            docHiddenKey = 'webkitHidden';
            visibilityChangeEventName = 'webkitvisibilitychange';
        }
    
        if (visibilityChangeEventName) {
            if (!document[docHiddenKey]) { startFastCheckTimer(); }
    
            document.addEventListener(visibilityChangeEventName, function () {
                if (document[docHiddenKey]) {
                    stopFastCheckTimer();
                } else {
                    startFastCheckTimer();
                }
            });
        } else { startFastCheckTimer(); }
    }
    
    if (!seppuku) { init(); }
    
    /*
     * 7. Expose Stickyfill
     */
    if (module.exports) {
        module.exports = Stickyfill;
    } else if (isWindowDefined) {
        window.Stickyfill = Stickyfill;
    }
    
})(window, document);
});

//


var script = {
  name: 'Scrollama',
  components: {
    ResizeObserver: ResizeObserver
  },
  props: {
    id: {
      type: String,
      validator: function(value) {
        return !/\s/.test(value);
      },
      default: function () {
        return '_' + Math.random().toString(36).substr(2, 9)
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    // polyfill for CSS position sticky
    stickyfill.add(this.$refs['scrollama-graphic']);

    this.scroller = scrollama();

    var opts = Object.assign({}, this.$attrs, {
      step: ("#scrollama-steps-" + (this.id) + ">div"),
      container: ("#scrollama-container-" + (this.id)),
      graphic: ("#scrollama-graphic-" + (this.id)),
    });

    this.scroller.setup(opts);
    
    if(this.$listeners['step-progress']) {
      this.scroller.onStepProgress(function (resp) {
        this$1.$emit('step-progress', resp);
      });
    }

    if(this.$listeners['step-enter']) {
      this.scroller.onStepEnter(function (resp) {
        this$1.$emit('step-enter', resp);
      });
    }

    if(this.$listeners['step-exit']) {
      this.scroller.onStepExit(function (resp) {
        this$1.$emit('step-exit', resp);
      });
    }

    if(this.$listeners['container-enter']) {
      this.scroller.onContainerEnter(function (resp) {
        this$1.$emit('container-enter', resp);
      });
    }

    if(this.$listeners['container-exit']) {
      this.scroller.onContainerExit(function (resp) {
        this$1.$emit('container-exit', resp);
      });
    }

    this.handleResize();
  },
  methods: {
    handleResize: function handleResize () {
      this.scroller.resize();
    }
  }
};

/* script */
            var __vue_script__ = script;
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "scrollama-container",
      class: { "with-graphic": _vm.$slots.graphic },
      attrs: { id: "scrollama-container-" + _vm.id }
    },
    [
      _c(
        "div",
        {
          ref: "scrollama-graphic",
          staticClass: "scrollama-graphic",
          attrs: { id: "scrollama-graphic-" + _vm.id }
        },
        [_vm._t("graphic")],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "scrollama-steps",
          attrs: { id: "scrollama-steps-" + _vm.id }
        },
        [_vm._t("default")],
        2
      ),
      _vm._v(" "),
      _c("resize-observer", { on: { notify: _vm.handleResize } })
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/private/var/www/vue-scrollama/src/Scrollama.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var component = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

// Import vue component

// install function executed by Vue.use()
function install$1(Vue) {
  if (install$1.installed) { return; }
  install$1.installed = true;
  Vue.component('Scrollama', component);
}

// Create module definition for Vue.use()
var plugin$1 = {
  install: install$1,
};

// To auto-install when vue is found
/* global window global */
var GlobalVue$1 = null;
if (typeof window !== 'undefined') {
  GlobalVue$1 = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue$1 = global.Vue;
}
if (GlobalVue$1) {
  GlobalVue$1.use(plugin$1);
}

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default component;
