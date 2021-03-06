/*
 Copyright DHTMLX LTD. http://www.dhtmlx.com
 You allowed to use this component or parts of it under GPL terms
 To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
 */
window.dhtmlx || (dhtmlx = {});
dhtmlx.version = "3.0";
dhtmlx.codebase = "./";
dhtmlx.copy = function (a) {
	var b = dhtmlx.copy._function;
	b.prototype = a;
	return new b
};
dhtmlx.copy._function = function () {};
dhtmlx.extend = function (a, b) {
	for (var c in b) a[c] = b[c];
	b._init && a._init();
	return a
};
dhtmlx.proto_extend = function () {
	for (var a = arguments, b = a[0], c = [], d = a.length - 1; d > 0; d--) {
		if (typeof a[d] == "function") a[d] = a[d].prototype;
		for (var e in a[d]) e == "_init" ? c.push(a[d][e]) : b[e] || (b[e] = a[d][e])
	}
	a[0]._init && c.push(a[0]._init);
	b._init = function () {
		for (var a = 0; a < c.length; a++) c[a].apply(this, arguments)
	};
	b.base = a[1];
	var f = function (a) {
		this._init(a);
		this._parseSettings && this._parseSettings(a, this.defaults)
	};
	f.prototype = b;
	b = a = null;
	return f
};
dhtmlx.bind = function (a, b) {
	return function () {
		return a.apply(b, arguments)
	}
};
dhtmlx.require = function (a) {
	dhtmlx._modules[a] || (dhtmlx.exec(dhtmlx.ajax().sync().get(dhtmlx.codebase + a).responseText), dhtmlx._modules[a] = !0)
};
dhtmlx._modules = {};
dhtmlx.exec = function (a) {
	window.execScript ? window.execScript(a) : window.eval(a)
};
dhtmlx.methodPush = function (a, b) {
	return function () {
		var c = !1;
		return c = a[b].apply(a, arguments)
	}
};
dhtmlx.isNotDefined = function (a) {
	return typeof a == "undefined"
};
dhtmlx.delay = function (a, b, c, d) {
	setTimeout(function () {
		var d = a.apply(b, c);
		a = b = c = null;
		return d
	}, d || 1)
};
dhtmlx.uid = function () {
	if (!this._seed) this._seed = (new Date).valueOf();
	this._seed++;
	return this._seed
};
dhtmlx.toNode = function (a) {
	return typeof a == "string" ? document.getElementById(a) : a
};
dhtmlx.toArray = function (a) {
	return dhtmlx.extend(a || [], dhtmlx.PowerArray)
};
dhtmlx.toFunctor = function (a) {
	return typeof a == "string" ? eval(a) : a
};
dhtmlx._events = {};
dhtmlx.event = function (a, b, c, d) {
	var a = dhtmlx.toNode(a),
		e = dhtmlx.uid();
	dhtmlx._events[e] = [a, b, c];
	d && (c = dhtmlx.bind(c, d));
	a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent && a.attachEvent("on" + b, c);
	return e
};
dhtmlx.eventRemove = function (a) {
	if (a) {
		var b = dhtmlx._events[a];
		b[0].removeEventListener ? b[0].removeEventListener(b[1], b[2], !1) : b[0].detachEvent && b[0].detachEvent("on" + b[1], b[2]);
		delete this._events[a]
	}
};
dhtmlx.EventSystem = {
	_init: function () {
		this._events = {};
		this._handlers = {};
		this._map = {}
	},
	block: function () {
		this._events._block = !0
	},
	unblock: function () {
		this._events._block = !1
	},
	mapEvent: function (a) {
		dhtmlx.extend(this._map, a)
	},
	callEvent: function (a, b) {
		if (this._events._block) return !0;
		var a = a.toLowerCase(),
			c = this._events[a.toLowerCase()],
			d = !0;
		if (c) for (var e = 0; e < c.length; e++) if (c[e].apply(this, b || []) === !1) d = !1;
		this._map[a] && !this._map[a].callEvent(a, b) && (d = !1);
		return d
	},
	attachEvent: function (a, b, c) {
		var a = a.toLowerCase(),
			c = c || dhtmlx.uid(),
			b = dhtmlx.toFunctor(b),
			d = this._events[a] || dhtmlx.toArray();
		d.push(b);
		this._events[a] = d;
		this._handlers[c] = {
			f: b,
			t: a
		};
		return c
	},
	detachEvent: function (a) {
		if (this._handlers[a]) {
			var b = this._handlers[a].t,
				c = this._handlers[a].f,
				d = this._events[b];
			d.remove(c);
			delete this._handlers[a]
		}
	}
};
dhtmlx.PowerArray = {
	removeAt: function (a, b) {
		a >= 0 && this.splice(a, b || 1)
	},
	remove: function (a) {
		this.removeAt(this.find(a))
	},
	insertAt: function (a, b) {
		if (!b && b !== 0) this.push(a);
		else {
			var c = this.splice(b, this.length - b);
			this[b] = a;
			this.push.apply(this, c)
		}
	},
	find: function (a) {
		for (i = 0; i < this.length; i++) if (a == this[i]) return i;
		return -1
	},
	each: function (a, b) {
		for (var c = 0; c < this.length; c++) a.call(b || this, this[c])
	},
	map: function (a, b) {
		for (var c = 0; c < this.length; c++) this[c] = a.call(b || this, this[c]);
		return this
	}
};
dhtmlx.env = {};
if (navigator.userAgent.indexOf("Opera") != -1) dhtmlx._isOpera = !0;
else {
	dhtmlx._isIE = !! document.all;
	dhtmlx._isFF = !document.all;
	dhtmlx._isWebKit = navigator.userAgent.indexOf("KHTML") != -1;
	if (navigator.appVersion.indexOf("MSIE 8.0") != -1 && document.compatMode != "BackCompat") dhtmlx._isIE = 8;
	if (navigator.appVersion.indexOf("MSIE 9.0") != -1 && document.compatMode != "BackCompat") dhtmlx._isIE = 9
}
dhtmlx.env = {};
(function () {
	dhtmlx.env.transform = !1;
	dhtmlx.env.transition = !1;
	for (var a = {
		names: ["transform", "transition"],
		transform: ["transform", "WebkitTransform", "MozTransform", "oTransform", "msTransform"],
		transition: ["transition", "WebkitTransition", "MozTransition", "oTransition"]
	}, b = document.createElement("DIV"), c, d = 0; d < a.names.length; d++) for (; p = a[a.names[d]].pop();) typeof b.style[p] != "undefined" && (dhtmlx.env[a.names[d]] = !0)
})();
dhtmlx.env.transform_prefix = function () {
	var a;
	dhtmlx._isOpera ? a = "-o-" : (a = "", dhtmlx._isFF && (a = "-moz-"), dhtmlx._isWebKit && (a = "-webkit-"));
	return a
}();
dhtmlx.env.svg = function () {
	return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
}();
dhtmlx.zIndex = {
	drag: 1E4
};
dhtmlx.html = {
	create: function (a, b, c) {
		var b = b || {}, d = document.createElement(a),
			e;
		for (e in b) d.setAttribute(e, b[e]);
		if (b.style) d.style.cssText = b.style;
		if (b["class"]) d.className = b["class"];
		if (c) d.innerHTML = c;
		return d
	},
	getValue: function (a) {
		a = dhtmlx.toNode(a);
		return !a ? "" : dhtmlx.isNotDefined(a.value) ? a.innerHTML : a.value
	},
	remove: function (a) {
		if (a instanceof Array) for (var b = 0; b < a.length; b++) this.remove(a[b]);
		else a && a.parentNode && a.parentNode.removeChild(a)
	},
	insertBefore: function (a, b, c) {
		a && (b ? b.parentNode.insertBefore(a,
			b) : c.appendChild(a))
	},
	locate: function (a, b) {
		for (var a = a || event, c = a.target || a.srcElement; c;) {
			if (c.getAttribute) {
				var d = c.getAttribute(b);
				if (d) return d
			}
			c = c.parentNode
		}
		return null
	},
	offset: function (a) {
		if (a.getBoundingClientRect) {
			var b = a.getBoundingClientRect(),
				c = document.body,
				d = document.documentElement,
				e = window.pageYOffset || d.scrollTop || c.scrollTop,
				f = window.pageXOffset || d.scrollLeft || c.scrollLeft,
				h = d.clientTop || c.clientTop || 0,
				g = d.clientLeft || c.clientLeft || 0,
				i = b.top + e - h,
				j = b.left + f - g;
			return {
				y: Math.round(i),
				x: Math.round(j)
			}
		} else {
			for (j = i = 0; a;) i += parseInt(a.offsetTop, 10), j += parseInt(a.offsetLeft, 10), a = a.offsetParent;
			return {
				y: i,
				x: j
			}
		}
	},
	pos: function (a) {
		a = a || event;
		if (a.pageX || a.pageY) return {
			x: a.pageX,
			y: a.pageY
		};
		var b = dhtmlx._isIE && document.compatMode != "BackCompat" ? document.documentElement : document.body;
		return {
			x: a.clientX + b.scrollLeft - b.clientLeft,
			y: a.clientY + b.scrollTop - b.clientTop
		}
	},
	preventEvent: function (a) {
		a && a.preventDefault && a.preventDefault();
		dhtmlx.html.stopEvent(a)
	},
	stopEvent: function (a) {
		(a || event).cancelBubble = !0;
		return !1
	},
	addCss: function (a, b) {
		a.className += " " + b
	},
	removeCss: function (a, b) {
		a.className = a.className.replace(RegExp(b, "g"), "")
	}
};
(function () {
	var a = document.getElementsByTagName("SCRIPT");
	if (a.length) a = (a[a.length - 1].getAttribute("src") || "").split("/"), a.splice(a.length - 1, 1), dhtmlx.codebase = a.slice(0, a.length).join("/") + "/"
})();
if (!dhtmlx.ui) dhtmlx.ui = {};
dhtmlx.Destruction = {
	_init: function () {
		dhtmlx.destructors.push(this)
	},
	destructor: function () {
		this.destructor = function () {};
		this._htmlrows = this._htmlmap = null;
		this._html && document.body.appendChild(this._html);
		this._html = null;
		if (this._obj) this._obj.innerHTML = "", this._obj._htmlmap = null;
		this.data = this._obj = this._dataobj = null;
		this._events = this._handlers = {}
	}
};
dhtmlx.destructors = [];
dhtmlx.event(window, "unload", function () {
	for (var a = 0; a < dhtmlx.destructors.length; a++) dhtmlx.destructors[a].destructor();
	dhtmlx.destructors = [];
	for (var b in dhtmlx._events) {
		var c = dhtmlx._events[b];
		c[0].removeEventListener ? c[0].removeEventListener(c[1], c[2], !1) : c[0].detachEvent && c[0].detachEvent("on" + c[1], c[2]);
		delete dhtmlx._events[b]
	}
});
dhtmlx.math = {};
dhtmlx.math._toHex = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F".split(",");
dhtmlx.math.toHex = function (a, b) {
	a = parseInt(a, 10);
	for (str = ""; a > 0;) str = this._toHex[a % 16] + str, a = Math.floor(a / 16);
	for (; str.length < b;) str = "0" + str;
	return str
};
dhtmlx.math.hexToDec = function (a) {
	return parseInt(a, 16)
};
dhtmlx.math.toRgb = function (a) {
	var b, c, d, e;
	typeof a != "string" ? (b = a[0], c = a[1], d = a[2]) : a.indexOf("rgb") != -1 ? (e = a.substr(a.indexOf("(") + 1, a.lastIndexOf(")") - a.indexOf("(") - 1).split(","), b = e[0], c = e[1], d = e[2]) : (a.substr(0, 1) == "#" && (a = a.substr(1)), b = this.hexToDec(a.substr(0, 2)), c = this.hexToDec(a.substr(2, 2)), d = this.hexToDec(a.substr(4, 2)));
	b = parseInt(b, 10) || 0;
	c = parseInt(c, 10) || 0;
	d = parseInt(d, 10) || 0;
	if (b < 0 || b > 255) b = 0;
	if (c < 0 || c > 255) c = 0;
	if (d < 0 || d > 255) d = 0;
	return [b, c, d]
};
dhtmlx.math.hsvToRgb = function (a, b, c) {
	var d, e, f, h, g, i, j, k;
	d = Math.floor(a / 60) % 6;
	e = a / 60 - d;
	f = c * (1 - b);
	h = c * (1 - e * b);
	g = c * (1 - (1 - e) * b);
	k = j = i = 0;
	switch (d) {
		case 0:
			i = c;
			j = g;
			k = f;
			break;
		case 1:
			i = h;
			j = c;
			k = f;
			break;
		case 2:
			i = f;
			j = c;
			k = g;
			break;
		case 3:
			i = f;
			j = h;
			k = c;
			break;
		case 4:
			i = g;
			j = f;
			k = c;
			break;
		case 5:
			i = c, j = f, k = h
	}
	i = Math.floor(i * 255);
	j = Math.floor(j * 255);
	k = Math.floor(k * 255);
	return [i, j, k]
};
dhtmlx.math.rgbToHsv = function (a, b, c) {
	var d, e, f, h, g, i, j, k;
	d = a / 255;
	e = b / 255;
	f = c / 255;
	h = Math.min(d, e, f);
	g = Math.max(d, e, f);
	j = 0;
	i = g == 0 ? 0 : 1 - h / g;
	k = g;
	g == h ? j = 0 : g == d && e >= f ? j = 60 * (e - f) / (g - h) + 0 : g == d && e < f ? j = 60 * (e - f) / (g - h) + 360 : g == e ? j = 60 * (f - d) / (g - h) + 120 : g == f && (j = 60 * (d - e) / (g - h) + 240);
	return [j, i, k]
};
if (!dhtmlx.presets) dhtmlx.presets = {};
dhtmlx.presets.chart = {
	simple: {
		item: {
			borderColor: "#ffffff",
			color: "#2b7100",
			shadow: !1,
			borderWidth: 2
		},
		line: {
			color: "#8ecf03",
			width: 2
		}
	},
	plot: {
		color: "#1293f8",
		item: {
			borderColor: "#636363",
			borderWidth: 1,
			color: "#ffffff",
			type: "r",
			shadow: !1
		},
		line: {
			color: "#1293f8",
			width: 2
		}
	},
	diamond: {
		color: "#b64040",
		item: {
			borderColor: "#b64040",
			color: "#b64040",
			type: "d",
			radius: 3,
			shadow: !0
		},
		line: {
			color: "#ff9000",
			width: 2
		}
	},
	point: {
		color: "#fe5916",
		disableLines: !0,
		fill: !1,
		disableItems: !1,
		item: {
			color: "#feb916",
			borderColor: "#fe5916",
			radius: 2,
			borderWidth: 1,
			type: "r"
		},
		alpha: 1
	},
	line: {
		line: {
			color: "#3399ff",
			width: 2
		},
		item: {
			color: "#ffffff",
			borderColor: "#3399ff",
			radius: 2,
			borderWidth: 2,
			type: "d"
		},
		fill: !1,
		disableItems: !1,
		disableLines: !1,
		alpha: 1
	},
	area: {
		fill: "#3399ff",
		line: {
			color: "#3399ff",
			width: 1
		},
		disableItems: !0,
		alpha: 0.2,
		disableLines: !1
	},
	round: {
		item: {
			radius: 3,
			borderColor: "#3f83ff",
			borderWidth: 1,
			color: "#3f83ff",
			type: "r",
			shadow: !1,
			alpha: 0.6
		}
	},
	square: {
		item: {
			radius: 3,
			borderColor: "#447900",
			borderWidth: 2,
			color: "#69ba00",
			type: "s",
			shadow: !1,
			alpha: 1
		}
	},
	column: {
		color: "RAINBOW",
		gradient: !1,
		width: 45,
		radius: 0,
		alpha: 1,
		border: !0
	},
	stick: {
		width: 5,
		gradient: !1,
		color: "#67b5c9",
		radius: 2,
		alpha: 1,
		border: !1
	},
	alpha: {
		color: "#b9a8f9",
		width: 70,
		gradient: "falling",
		radius: 0,
		alpha: 0.5,
		border: !0
	}
};
dhtmlx.ui.Map = function (a) {
	this.name = "Map";
	this._id = "map_" + dhtmlx.uid();
	this._key = a;
	this._map = []
};
dhtmlx.ui.Map.prototype = {
	addRect: function (a, b, c) {
		this._createMapArea(a, "RECT", b, c)
	},
	addPoly: function (a, b) {
		this._createMapArea(a, "POLY", b)
	},
	_createMapArea: function (a, b, c, d) {
		var e = "";
		arguments.length == 4 && (e = "userdata='" + d + "'");
		this._map.push("<area " + this._key + "='" + a + "' shape='" + b + "' coords='" + c.join() + "' " + e + "></area>")
	},
	addSector: function (a, b, c, d, e, f, h) {
		var g = [];
		g.push(d);
		g.push(Math.floor(e * h));
		for (var i = b; i < c; i += Math.PI / 18) g.push(Math.floor(d + f * Math.cos(i))), g.push(Math.floor((e + f * Math.sin(i)) *
			h));
		g.push(Math.floor(d + f * Math.cos(c)));
		g.push(Math.floor((e + f * Math.sin(c)) * h));
		g.push(d);
		g.push(Math.floor(e * h));
		return this.addPoly(a, g)
	},
	render: function (a) {
		var b = dhtmlx.html.create("DIV");
		b.style.cssText = "position:absolute; width:100%; height:100%; top:0px; left:0px;";
		a.appendChild(b);
		var c = dhtmlx._isIE ? "" : "src='data:image/gif;base64,R0lGODlhEgASAIAAAP///////yH5BAUUAAEALAAAAAASABIAAAIPjI+py+0Po5y02ouz3pwXADs='";
		b.innerHTML = "<map id='" + this._id + "' name='" + this._id + "'>" + this._map.join("\n") + "</map><img " +
			c + " class='dhx_map_img' usemap='#" + this._id + "'>";
		a._htmlmap = b;
		this._map = []
	}
};
dhtmlx.chart = {};
dhtmlx.chart.scatter = {
	pvt_render_scatter: function (a, b, c, d, e, f) {
		if (!this._settings.xValue) return null;
		var h = this._getLimits(),
			g = this._getLimits("h", "xValue");
		e || (this._drawYAxis(a, b, c, d, h.min, h.max), this._drawHXAxis(a, b, c, d, g.min, g.max));
		for (var h = {
			min: this._settings.yAxis.start,
			max: this._settings.yAxis.end
		}, g = {
			min: this._settings.xAxis.start,
			max: this._settings.xAxis.end
		}, i = this._getScatterParams(a, b, c, d, g, h), j = 0; j < b.length; j++) this._drawScatterItem(a, f, c, d, i, g, h, b[j], e)
	},
	_getScatterParams: function (a,
								 b, c, d, e, f) {
		var h = {};
		h.totalHeight = d.y - c.y;
		h.totalWidth = d.x - c.x;
		this._calcScatterUnit(h, e.min, e.max, h.totalWidth, "X");
		this._calcScatterUnit(h, f.min, f.max, h.totalHeight, "Y");
		return h
	},
	_drawScatterItem: function (a, b, c, d, e, f, h, g, i) {
		var j = this._calculateScatterItemPosition(e, d, c, f, g, "X"),
			k = this._calculateScatterItemPosition(e, c, d, h, g, "Y");
		this._drawItemOfLineChart(a, j, k, g, 1);
		var l = this._settings,
			m = l.eventRadius || Math.floor(l.item.radius + 1);
		b.addRect(g.id, [j - m, k - m, j + m, k + m], i)
	},
	_calculateScatterItemPosition: function (a,
											 b, c, d, e, f) {
		var h = this._settings[f == "X" ? "xValue" : "value"].call(this, e),
			g = a["valueFactor" + f],
			i = (parseFloat(h || 0) - d.min) * g,
			j = a["unit" + f],
			k = c[f.toLowerCase()] - (f == "X" ? -1 : 1) * Math.floor(j * i);
		i < 0 && (k = c[f.toLowerCase()]);
		h > d.max && (k = b[f.toLowerCase()]);
		h < d.min && (k = c[f.toLowerCase()]);
		return k
	},
	_calcScatterUnit: function (a, b, c, d, e) {
		var f = this._getRelativeValue(b, c),
			e = e || "";
		a["relValue" + e] = f[0];
		a["valueFactor" + e] = f[1];
		a["unit" + e] = a["relValue" + e] ? d / a["relValue" + e] : 10
	}
};
dhtmlx.chart.radar = {
	pvt_render_radar: function (a, b, c, d, e, f) {
		this._renderRadarChart(a, b, c, d, e, f)
	},
	_renderRadarChart: function (a, b, c, d, e, f) {
		if (b.length) {
			for (var h = this._getPieParameters(c, d), g = this._settings.radius ? this._settings.radius : h.radius, i = this._settings.x ? this._settings.x : h.x, j = this._settings.y ? this._settings.y : h.y, k = [], l = 0; l < b.length; l++) k.push(1);
			var m = this._getRatios(k, b.length);
			e || this._drawRadarAxises(a, m, i, j, g, b);
			this._drawRadarData(a, m, i, j, g, b, e, f)
		}
	},
	_drawRadarData: function (a, b, c, d, e,
							  f, h, g) {
		var i, j, k, l, m, p, o, n, r, q, u, z, x, y, s, w, v, t, A, B;
		l = this._settings;
		p = l.yAxis.start;
		o = l.yAxis.end;
		B = this._getRelativeValue(p, o);
		A = (x = B[0]) ? e / x : e / 2;
		t = B[1];
		i = j = y = -Math.PI / 2;
		q = [];
		for (m = 0; m < f.length; m++) v ? w = v : (s = l.value(f[m]), w = v || (parseFloat(s || 0) - p) * t), u = Math.floor(A * w), s = l.value(m != f.length - 1 ? f[m + 1] : f[0]), v = (parseFloat(s || 0) - p) * t, z = Math.floor(A * v), i = j, j = m != f.length - 1 ? y + b[m] - 1.0E-4 : y, n = r || this._getPositionByAngle(i, c, d, u), r = this._getPositionByAngle(j, c, d, z), k = l.eventRadius || parseInt(l.item.radius.call(this,
			f[m]), 10) + l.item.borderWidth, g.addRect(f[m].id, [n.x - k, n.y - k, n.x + k, n.y + k], h), q.push(n);
		l.fill && this._fillRadarChart(a, q, f);
		l.disableLines || this._strokeRadarChart(a, q, f);
		l.disableItems || this._drawRadarItemMarkers(a, q, f);
		q = null
	},
	_drawRadarItemMarkers: function (a, b, c) {
		for (var d = 0; d < b.length; d++) this._drawItemOfLineChart(a, b[d].x, b[d].y, c[d])
	},
	_fillRadarChart: function (a, b, c) {
		var d, e;
		a.globalAlpha = this._settings.alpha.call(this, {});
		a.beginPath();
		for (var f = 0; f < b.length; f++) a.fillStyle = this._settings.fill.call(this,
			c[f]), d = b[f], e = b[f + 1] || b[0], f || a.moveTo(d.x, d.y), a.lineTo(e.x, e.y);
		a.fill();
		a.globalAlpha = 1
	},
	_strokeRadarChart: function (a, b, c) {
		for (var d, e, f = 0; f < b.length; f++) d = b[f], e = b[f + 1] || b[0], this._drawLine(a, d.x, d.y, e.x, e.y, this._settings.line.color.call(this, c[f]), this._settings.line.width)
	},
	_drawRadarAxises: function (a, b, c, d, e, f) {
		var h = this._settings.yAxis,
			g = this._settings.xAxis,
			i = h.start,
			j = h.end,
			k = h.step,
			l = {}, m = this._settings.configYAxis;
		if (typeof m.step == "undefined" || typeof m.start == "undefined" || typeof m.end ==
			"undefined") {
			var p = this._getLimits(),
				l = this._calculateScale(p.min, p.max),
				i = l.start,
				j = l.end,
				k = l.step;
			h.end = j;
			h.start = i
		}
		var o = [],
			n, r, q, u = 0,
			z = e * k / (j - i),
			x, y;
		k < 1 && (x = Math.min(this._log10(k), i <= 0 ? 0 : this._log10(i)), y = Math.pow(10, -x));
		var s = [];
		for (n = j; n >= i; n -= k) {
			l.fixNum && (n = parseFloat((new Number(n)).toFixed(l.fixNum)));
			o.push(Math.floor(u * z) + 0.5);
			y && (n = Math.round(n * y) / y);
			var w = d - e + o[o.length - 1];
			this.renderTextAt("middle", "left", c, w, h.template(n.toString()), "dhx_axis_item_y dhx_radar");
			if (b.length < 2) {
				this._drawScaleSector(a,
					"arc", c, d, e - o[o.length - 1], -Math.PI / 2, 3 * Math.PI / 2, n);
				return
			}
			var v = -Math.PI / 2,
				t = v,
				A;
			for (r = 0; r < b.length; r++) n == j && s.push(t), A = v + b[r] - 1.0E-4, this._drawScaleSector(a, m.lineShape || "line", c, d, e - o[o.length - 1], t, A, n, r, f[n]), t = A;
			u++
		}
		for (n = 0; n < s.length; n++) q = this._getPositionByAngle(s[n], c, d, e), this._drawLine(a, c, d, q.x, q.y, g ? g.lineColor.call(this, f[n]) : "#cfcfcf", g && g.lineWidth ? g.lineWidth.call(this, f[n]) : 1), this._drawRadarScaleLabel(a, c, d, e, s[n], g ? g.template.call(this, f[n]) : "&nbsp;")
	},
	_drawScaleSector: function (a,
								b, c, d, e, f, h, g, i) {
		var j, k;
		if (e < 0) return !1;
		j = this._getPositionByAngle(f, c, d, e);
		k = this._getPositionByAngle(h, c, d, e);
		var l = this._settings.yAxis;
		if (l.bg) a.beginPath(), a.moveTo(c, d), b == "arc" ? a.arc(c, d, e, f, h, !1) : (a.lineTo(j.x, j.y), a.lineTo(k.x, k.y)), a.fillStyle = l.bg(g, i), a.moveTo(c, d), a.fill(), a.closePath();
		if (l.lines(g, i)) a.lineWidth = 1, a.beginPath(), b == "arc" ? a.arc(c, d, e, f, h, !1) : (a.moveTo(j.x, j.y), a.lineTo(k.x, k.y)), a.strokeStyle = l.lineColor(g, i), a.stroke()
	},
	_drawRadarScaleLabel: function (a, b, c, d, e, f) {
		var h =
				this.renderText(0, 0, f, "dhx_axis_radar_title", 1),
			g = h.scrollWidth,
			i = h.offsetHeight,
			j = 0.0010,
			k = this._getPositionByAngle(e, b, c, d + 5),
			l = 0,
			m = 0;
		if (e < 0 || e > Math.PI) m = -i;
		e > Math.PI / 2 && (l = -g);
		if (Math.abs(e + Math.PI / 2) < j || Math.abs(e - Math.PI / 2) < j) l = -g / 2;
		else if (Math.abs(e) < j || Math.abs(e - Math.PI) < j) m = -i / 2;
		h.style.top = k.y + m + "px";
		h.style.left = k.x + l + "px";
		h.style.width = g + "px";
		h.style.whiteSpace = "nowrap"
	}
};
dhtmlx.chart.area = {
	pvt_render_area: function (a, b, c, d, e, f) {
		var h = this._calculateParametersOfLineChart(a, b, c, d, e),
			g = this._settings.eventRadius || Math.floor(h.cellWidth / 2);
		if (b.length) {
			a.globalAlpha = this._settings.alpha.call(this, b[0]);
			a.fillStyle = this._settings.color.call(this, b[0]);
			var i = this._getYPointOfLineChart(b[0], c, d, h),
				j = this._settings.offset ? c.x + h.cellWidth * 0.5 : c.x;
			a.beginPath();
			a.moveTo(j, d.y);
			a.lineTo(j, i);
			f.addRect(b[0].id, [j - g, i - g, j + g, i + g], e);
			this._settings.yAxis || this.renderTextAt(!1, !this._settings.offset ? !1 : !0, j, i - this._settings.labelOffset, this._settings.label(b[0]));
			for (var k = 1; k < b.length; k++) {
				var l = j + Math.floor(h.cellWidth * k) - 0.5,
					m = this._getYPointOfLineChart(b[k], c, d, h);
				a.lineTo(l, m);
				f.addRect(b[k].id, [l - g, m - g, l + g, m + g], e);
				this._settings.yAxis || this.renderTextAt(!1, !this._settings.offset && k == b.length - 1 ? "left" : "center", l, m - this._settings.labelOffset, this._settings.label(b[k]))
			}
			a.lineTo(j + Math.floor(h.cellWidth * [b.length - 1]), d.y);
			a.lineTo(j, d.y);
			a.fill()
		}
	}
};
dhtmlx.chart.stackedArea = {
	pvt_render_stackedArea: function (a, b, c, d, e, f) {
		var h = this._calculateParametersOfLineChart(a, b, c, d, e),
			g = this._settings.eventRadius || Math.floor(h.cellWidth / 2),
			i = [];
		if (b.length) {
			a.globalAlpha = this._settings.alpha.call(this, b[0]);
			a.fillStyle = this._settings.color.call(this, b[0]);
			var j = e ? b[0].$startY : d.y,
				k = this._settings.offset ? c.x + h.cellWidth * 0.5 : c.x,
				l = this._getYPointOfLineChart(b[0], c, d, h) - (e ? d.y - j : 0);
			i[0] = l;
			a.beginPath();
			a.moveTo(k, j);
			a.lineTo(k, l);
			f.addRect(b[0].id, [k - g, l - g,
				k + g, l + g
			], e);
			this._settings.yAxis || this.renderTextAt(!1, !0, k, l - this._settings.labelOffset, this._settings.label(b[0]));
			for (var m = 1; m < b.length; m++) {
				var p = k + Math.floor(h.cellWidth * m) - 0.5,
					o = this._getYPointOfLineChart(b[m], c, d, h) - (e ? d.y - b[m].$startY : 0);
				i[m] = o;
				a.lineTo(p, o);
				f.addRect(b[m].id, [p - g, o - g, p + g, o + g], e);
				this._settings.yAxis || this.renderTextAt(!1, !0, p, o - this._settings.labelOffset, this._settings.label(b[m]))
			}
			a.lineTo(k + Math.floor(h.cellWidth * [b.length - 1]), j);
			if (e) for (m = b.length - 1; m >= 0; m--) {
				var p =
						k + Math.floor(h.cellWidth * m) - 0.5,
					n = b[m].$startY;
				a.lineTo(p, n)
			} else a.lineTo(k + Math.floor(h.cellWidth * (length - 1)) - 0.5, j);
			a.lineTo(k, j);
			a.fill();
			for (m = 0; m < b.length; m++) b[m].$startY = i[m]
		}
	}
};
dhtmlx.chart.spline = {
	pvt_render_spline: function (a, b, c, d, e, f) {
		var h, g, i, j, k, l, m, p, o, n, r, q, u, z, x;
		l = this._calculateParametersOfLineChart(a, b, c, d, e);
		g = this._settings;
		j = [];
		if (b.length) {
			n = g.offset ? c.x + l.cellWidth * 0.5 : c.x;
			for (i = 0; i < b.length; i++) o = !i ? n : Math.floor(l.cellWidth * i) - 0.5 + n, u = this._getYPointOfLineChart(b[i], c, d, l), j.push({
				x: o,
				y: u
			});
			p = this._getSplineParameters(j);
			for (i = 0; i < j.length; i++) {
				r = j[i].x;
				z = j[i].y;
				if (i < j.length - 1) {
					q = j[i + 1].x;
					x = j[i + 1].y;
					for (k = r; k < q; k++) this._drawLine(a, k, this._getSplineYPoint(k,
						r, i, p.a, p.b, p.c, p.d), k + 1, this._getSplineYPoint(k + 1, r, i, p.a, p.b, p.c, p.d), g.line.color(b[i]), g.line.width);
					this._drawLine(a, q - 1, this._getSplineYPoint(k, r, i, p.a, p.b, p.c, p.d), q, x, g.line.color(b[i]), g.line.width)
				}
				this._drawItemOfLineChart(a, r, z, b[i], g.label(b[i]));
				m = parseInt(g.item.radius.call(this, b[i - 1]), 10) || 2;
				h = g.eventRadius || m + 1;
				f.addRect(b[i].id, [r - h, z - h, r + h, z + h], e)
			}
		}
	},
	_getSplineParameters: function (a) {
		var b, c, d, e, f, h, g, i, j, k;
		b = [];
		m = [];
		k = a.length;
		for (c = 0; c < k - 1; c++) b[c] = a[c + 1].x - a[c].x, m[c] = (a[c + 1].y -
			a[c].y) / b[c];
		d = [];
		e = [];
		d[0] = 0;
		d[1] = 2 * (b[0] + b[1]);
		e[0] = 0;
		e[1] = 6 * (m[1] - m[0]);
		for (c = 2; c < k - 1; c++) d[c] = 2 * (b[c - 1] + b[c]) - b[c - 1] * b[c - 1] / d[c - 1], e[c] = 6 * (m[c] - m[c - 1]) - b[c - 1] * e[c - 1] / d[c - 1];
		f = [];
		f[k - 1] = f[0] = 0;
		for (c = k - 2; c >= 1; c--) f[c] = (e[c] - b[c] * f[c + 1]) / d[c];
		h = [];
		g = [];
		i = [];
		j = [];
		for (c = 0; c < k - 1; c++) h[c] = a[c].y, g[c] = -b[c] * f[c + 1] / 6 - b[c] * f[c] / 3 + (a[c + 1].y - a[c].y) / b[c], i[c] = f[c] / 2, j[c] = (f[c + 1] - f[c]) / (6 * b[c]);
		return {
			a: h,
			b: g,
			c: i,
			d: j
		}
	},
	_getSplineYPoint: function (a, b, c, d, e, f, h) {
		return d[c] + (a - b) * (e[c] + (a - b) * (f[c] + (a - b) * h[c]))
	}
};
dhtmlx.chart.barH = {
	pvt_render_barH: function (a, b, c, d, e, f) {
		var h, g, i, j, k = d.x - c.x,
			l = !! this._settings.yAxis,
			m = !! this._settings.xAxis,
			p = this._getLimits("h");
		h = p.max;
		g = p.min;
		var o = Math.floor((d.y - c.y) / b.length);
		e || this._drawHScales(a, b, c, d, g, h, o);
		l && (h = parseFloat(this._settings.xAxis.end), g = parseFloat(this._settings.xAxis.start));
		var n = this._getRelativeValue(g, h);
		j = n[0];
		i = n[1];
		var r = j ? k / j : 10;
		if (!l) var q = 10,
			r = j ? (k - q) / j : 10;
		var u = parseInt(this._settings.width, 10);
		u * this._series.length + 4 > o && (u = o / this._series.length -
			4);
		var z = Math.floor((o - u * this._series.length) / 2),
			x = typeof this._settings.radius != "undefined" ? parseInt(this._settings.radius, 10) : Math.round(u / 5),
			y = !1,
			s = this._settings.gradient;
		s && typeof s != "function" ? (y = s, s = !1) : s && (s = a.createLinearGradient(c.x, c.y, d.x, c.y), this._settings.gradient(s));
		var w = 0;
		l || this._drawLine(a, c.x - 0.5, c.y, c.x - 0.5, d.y, "#000000", 1);
		for (var v = 0; v < b.length; v++) {
			var t = parseFloat(this._settings.value(b[v] || 0));
			t > h && (t = h);
			t -= g;
			t *= i;
			var A = c.x,
				B = c.y + z + v * o + (u + 1) * e;
			if (t < 0 && this._settings.origin ==
				"auto" || this._settings.xAxis && t === 0 && !(this._settings.origin != "auto" && this._settings.origin > g)) this.renderTextAt("middle", "right", A + 10, B + u / 2 + z, this._settings.label(b[v]));
			else {
				t < 0 && this._settings.origin != "auto" && this._settings.origin > g && (t = 0);
				l || (t += q / r);
				var C = s || this._settings.color.call(this, b[v]);
				this._settings.border && this._drawBarHBorder(a, A, B, u, g, x, r, t, C);
				a.globalAlpha = this._settings.alpha.call(this, b[v]);
				var D = this._drawBarH(a, c, A, B, u, g, x, r, t, C, s, y);
				y != !1 && this._drawBarHGradient(a, A, B, u, g,
					x, r, t, C, y);
				a.globalAlpha = 1;
				D[3] == B ? (this.renderTextAt("middle", "left", D[0] - 5, D[3] + Math.floor(u / 2), this._settings.label(b[v])), f.addRect(b[v].id, [D[0], D[3], D[2], D[3] + u], e)) : (this.renderTextAt("middle", !1, D[2] + 5, D[1] + Math.floor(u / 2), this._settings.label(b[v])), f.addRect(b[v].id, [D[0], B, D[2], D[3]], e))
			}
		}
	},
	_setBarHPoints: function (a, b, c, d, e, f, h, g, i) {
		var j = 0;
		if (e > f * h) var k = (e - f * h) / e,
			j = -Math.asin(k) + Math.PI / 2;
		a.moveTo(b, c + g);
		var l = b + f * h - e - (e ? 0 : g);
		e < f * h && a.lineTo(l, c + g);
		var m = c + e;
		e && e > 0 && a.arc(l, m, e - g, -Math.PI /
			2 + j, 0, !1);
		var p = c + d - e - (e ? 0 : g),
			o = l + e - (e ? g : 0);
		a.lineTo(o, p);
		var n = l;
		e && e > 0 && a.arc(n, p, e - g, 0, Math.PI / 2 - j, !1);
		var r = c + d - g;
		a.lineTo(b, r);
		i || a.lineTo(b, c + g);
		return [o, r]
	},
	_drawHScales: function (a, b, c, d, e, f, h) {
		var g = this._drawHXAxis(a, b, c, d, e, f);
		this._drawHYAxis(a, b, c, d, h, g)
	},
	_drawHYAxis: function (a, b, c, d, e, f) {
		if (this._settings.yAxis) {
			var h, g = parseInt(f ? f : c.x, 10) - 0.5,
				i = d.y + 0.5,
				j = c.y;
			this._drawLine(a, g, i, g, j, this._settings.yAxis.color, 1);
			for (var k = 0; k < b.length; k++) {
				var l = this._settings.origin != "auto" && this._settings.view ==
					"barH" && parseFloat(this._settings.value(b[k])) < this._settings.origin;
				h = j + e / 2 + k * e;
				this.renderTextAt("middle", l ? !1 : "left", l ? g + 5 : g - 5, h, this._settings.yAxis.template(b[k]), "dhx_axis_item_y", l ? 0 : g - 10);
				this._settings.yAxis.lines.call(this, b[k]) && this._drawLine(a, c.x, h, d.x, h, this._settings.yAxis.lineColor.call(this, b[k]), 1)
			}
			this._drawLine(a, c.x + 0.5, j + 0.5, d.x, j + 0.5, this._settings.yAxis.lineColor.call(this, {}), 1);
			this._setYAxisTitle(c, d)
		}
	},
	_drawHXAxis: function (a, b, c, d, e, f) {
		var h, g = {}, i = this._settings.xAxis;
		if (i) {
			var j = d.y + 0.5,
				k = c.x - 0.5,
				l = d.x - 0.5,
				m = c.x;
			this._drawLine(a, k, j, l, j, i.color, 1);
			i.step && (h = parseFloat(i.step));
			if (typeof this._settings.configXAxis.step == "undefined" || typeof this._settings.configXAxis.start == "undefined" || typeof this._settings.configXAxis.end == "undefined") g = this._calculateScale(e, f), e = g.start, f = g.end, h = g.step, this._settings.xAxis.end = f, this._settings.xAxis.start = e, this._settings.xAxis.step = h;
			if (h !== 0) {
				for (var p = (l - k) * h / (f - e), o = 0, n = e; n <= f; n += h) {
					g.fixNum && (n = parseFloat((new Number(n)).toFixed(g.fixNum)));
					var r = Math.floor(k + o * p) + 0.5;
					!(n == e && this._settings.origin == "auto") && i.lines.call(this, n) && this._drawLine(a, r, j, r, c.y, this._settings.xAxis.lineColor.call(this, n), 1);
					n == this._settings.origin && (m = r + 1);
					this.renderTextAt(!1, !0, r, j + 2, i.template(n.toString()), "dhx_axis_item_x");
					o++
				}
				this.renderTextAt(!0, !1, k, d.y + this._settings.padding.bottom - 3, this._settings.xAxis.title, "dhx_axis_title_x", d.x - c.x);
				i.lines || this._drawLine(a, k, c.y - 0.5, l, c.y - 0.5, this._settings.xAxis.color, 0.2);
				return m
			}
		}
	},
	_correctBarHParams: function (a,
								  b, c, d, e, f, h) {
		var g = this._settings.yAxis,
			i = b;
		g && this._settings.origin != "auto" && this._settings.origin > h && (b += (this._settings.origin - h) * e, i = b, d -= this._settings.origin - h, d < 0 && (d *= -1, a.translate(b, c + f), a.rotate(Math.PI), b = 0.5, c = 0), b += 0.5);
		return {
			value: d,
			x0: b,
			y0: c,
			start: i
		}
	},
	_drawBarH: function (a, b, c, d, e, f, h, g, i, j, k, l) {
		a.save();
		var m = this._correctBarHParams(a, c, d, i, g, e, f);
		a.fillStyle = j;
		a.beginPath();
		var p = this._setBarHPoints(a, m.x0, m.y0, e, h, g, m.value, this._settings.border ? 1 : 0);
		k && !l && a.lineTo(b.x + total_width,
			m.y0 + (this._settings.border ? 1 : 0));
		a.fill();
		a.restore();
		var o = m.y0,
			n = m.y0 != d ? d : p[1],
			r = m.y0 != d ? m.start - p[0] : m.start,
			q = m.y0 != d ? m.start : p[0];
		return [r, o, q, n]
	},
	_drawBarHBorder: function (a, b, c, d, e, f, h, g, i) {
		a.save();
		var j = this._correctBarHParams(a, b, c, g, h, d, e);
		a.beginPath();
		this._setBorderStyles(a, i);
		a.globalAlpha = 0.9;
		this._setBarHPoints(a, j.x0, j.y0, d, f, h, j.value, a.lineWidth / 2, 1);
		a.stroke();
		a.restore()
	},
	_drawBarHGradient: function (a, b, c, d, e, f, h, g, i, j) {
		a.save();
		var k = this._correctBarHParams(a, b, c, g, h, d, e),
			l =
				this._setBarGradient(a, k.x0, k.y0 + d, k.x0 + h * k.value, k.y0, j, i, "x");
		a.fillStyle = l.gradient;
		a.beginPath();
		var m = this._setBarHPoints(a, k.x0, k.y0 + l.offset, d - l.offset * 2, f, h, k.value, l.offset);
		a.fill();
		a.globalAlpha = 1;
		a.restore()
	}
};
dhtmlx.chart.stackedBarH = {
	pvt_render_stackedBarH: function (a, b, c, d, e, f) {
		var h, g, i, j, k = d.x - c.x,
			l = !! this._settings.yAxis,
			m = this._getStackedLimits(b);
		h = m.max;
		g = m.min;
		var p = Math.floor((d.y - c.y) / b.length);
		e || this._drawHScales(a, b, c, d, g, h, p);
		l && (h = parseFloat(this._settings.xAxis.end), g = parseFloat(this._settings.xAxis.start));
		var o = this._getRelativeValue(g, h);
		j = o[0];
		i = o[1];
		var n = j ? k / j : 10;
		if (!l) var r = 10,
			n = j ? (k - r) / j : 10;
		var q = parseInt(this._settings.width, 10);
		q + 4 > p && (q = p - 4);
		var u = Math.floor((p - q) / 2),
			z = 0,
			x = !1,
			y = this._settings.gradient;
		y && (x = !0);
		l || this._drawLine(a, c.x - 0.5, c.y, c.x - 0.5, d.y, "#000000", 1);
		for (var s = 0; s < b.length; s++) {
			if (!e) b[s].$startX = c.x;
			var w = parseFloat(this._settings.value(b[s] || 0));
			w > h && (w = h);
			w -= g;
			w *= i;
			var v = c.x,
				t = c.y + u + s * p;
			e ? v = b[s].$startX : b[s].$startX = v;
			if (w < 0 || this._settings.yAxis && w === 0) this.renderTextAt("middle", !0, v + 10, t + q / 2, this._settings.label(b[s]));
			else {
				l || (w += r / n);
				var A = this._settings.color.call(this, b[s]);
				a.globalAlpha = this._settings.alpha.call(this, b[s]);
				a.fillStyle = this._settings.color.call(this,
					b[s]);
				a.beginPath();
				var B = this._setBarHPoints(a, v, t, q, z, n, w, this._settings.border ? 1 : 0);
				y && !x && a.lineTo(c.x + k, t + (this._settings.border ? 1 : 0));
				a.fill();
				if (x != !1) {
					var C = this._setBarGradient(a, v, t + q, v, t, x, A, "x");
					a.fillStyle = C.gradient;
					a.beginPath();
					B = this._setBarHPoints(a, v, t, q, z, n, w, 0);
					a.fill()
				}
				this._settings.border && this._drawBarHBorder(a, v, t, q, g, z, n, w, A);
				a.globalAlpha = 1;
				this.renderTextAt("middle", !0, b[s].$startX + (B[0] - b[s].$startX) / 2 - 1, t + (B[1] - t) / 2, this._settings.label(b[s]));
				f.addRect(b[s].id, [b[s].$startX,
					t, B[0], B[1]
				], e);
				b[s].$startX = B[0]
			}
		}
	}
};
dhtmlx.chart.stackedBar = {
	pvt_render_stackedBar: function (a, b, c, d, e, f) {
		var h, g, i, j, k = d.y - c.y,
			l = !! this._settings.yAxis,
			m = !! this._settings.xAxis,
			p = this._getStackedLimits(b);
		h = p.max;
		g = p.min;
		var o = Math.floor((d.x - c.x) / b.length);
		e || this._drawScales(a, b, c, d, g, h, o);
		l && (h = parseFloat(this._settings.yAxis.end), g = parseFloat(this._settings.yAxis.start));
		var n = this._getRelativeValue(g, h);
		j = n[0];
		i = n[1];
		var r = j ? k / j : 10,
			q = parseInt(this._settings.width, 10);
		q + 4 > o && (q = o - 4);
		var u = Math.floor((o - q) / 2),
			z = this._settings.gradient ?
				this._settings.gradient : !1;
		m || this._drawLine(a, c.x, d.y + 0.5, d.x, d.y + 0.5, "#000000", 1);
		for (var x = 0; x < b.length; x++) {
			var y = parseFloat(this._settings.value(b[x] || 0));
			if (y) {
				e || (y -= g);
				y *= i;
				var s = c.x + u + x * o,
					w = d.y;
				e ? w = b[x].$startY : b[x].$startY = w;
				if (!(w < c.y + 1)) if (y < 0 || this._settings.yAxis && y === 0) this.renderTextAt(!0, !0, s + Math.floor(q / 2), w, this._settings.label(b[x]));
				else {
					var v = this._settings.color.call(this, b[x]);
					a.globalAlpha = this._settings.alpha.call(this, b[x]);
					a.fillStyle = this._settings.color.call(this, b[x]);
					a.beginPath();
					var t = this._setStakedBarPoints(a, s - (this._settings.border ? 0.5 : 0), w, q + (this._settings.border ? 0.5 : 0), r, y, 0, c.y);
					a.fill();
					if (z) {
						a.save();
						var A = this._setBarGradient(a, s, w, s + q, t[1], z, v, "y");
						a.fillStyle = A.gradient;
						a.beginPath();
						t = this._setStakedBarPoints(a, s + A.offset, w, q - A.offset * 2, r, y, this._settings.border ? 1 : 0, c.y);
						a.fill();
						a.restore()
					}
					this._settings.border && (a.save(), this._setBorderStyles(a, v), a.beginPath(), this._setStakedBarPoints(a, s - 0.5, w, q + 1, r, y, 0, c.y, 1), a.stroke(), a.restore());
					a.globalAlpha =
						1;
					this.renderTextAt(!1, !0, s + Math.floor(q / 2), t[1] + (w - t[1]) / 2 - 7, this._settings.label(b[x]));
					f.addRect(b[x].id, [s, t[1], t[0], b[x].$startY || w], e);
					b[x].$startY = this._settings.border ? t[1] + 1 : t[1]
				}
			} else if (!e || !b[x].$startY) b[x].$startY = d.y
		}
	},
	_setStakedBarPoints: function (a, b, c, d, e, f, h, g, i) {
		a.moveTo(b, c);
		var j = c - e * f + h;
		j < g && (j = g);
		a.lineTo(b, j);
		var k = b + d,
			l = j;
		a.lineTo(k, l);
		var m = b + d;
		a.lineTo(m, c);
		i || a.lineTo(b, c);
		return [m, l - 2 * h]
	}
};
dhtmlx.chart.line = {
	pvt_render_line: function (a, b, c, d, e, f) {
		var h, g, i, j, k, l, m, p, o, n;
		j = this._calculateParametersOfLineChart(a, b, c, d, e);
		g = this._settings;
		if (b.length) {
			o = this._getYPointOfLineChart(b[0], c, d, j);
			l = m = g.offset ? c.x + j.cellWidth * 0.5 : c.x;
			for (i = 1; i <= b.length; i++) {
				p = i == b.length - 1 && !this._settings.offset ? d.x : Math.floor(j.cellWidth * i) - 0.5 + l;
				if (b.length != i) {
					n = this._getYPointOfLineChart(b[i], c, d, j);
					if (!n) continue;
					if (g.line.width && (this._drawLine(a, m, o, p, n, g.line.color.call(this, b[i - 1]), g.line.width), g.line &&
						g.line.shadow)) a.globalAlpha = 0.3, this._drawLine(a, m + 2, o + g.line.width + 8, p + 2, n + g.line.width + 8, "#eeeeee", g.line.width + 3), a.globalAlpha = 1
				}
				this._drawItemOfLineChart(a, m, o, b[i - 1], !! g.offset);
				k = parseInt(g.item.radius.call(this, b[i - 1]), 10) || 2;
				h = g.eventRadius || k + 1;
				f.addRect(b[i - 1].id, [m - h, o - h, m + h, o + h], e);
				o = n;
				m = p
			}
		}
	},
	_drawItemOfLineChart: function (a, b, c, d, e) {
		var f = this._settings.item,
			h = parseInt(f.radius.call(this, d), 10);
		a.save();
		if (f.shadow) {
			a.lineWidth = 1;
			a.strokeStyle = "#bdbdbd";
			a.fillStyle = "#bdbdbd";
			for (var g = [0.1, 0.2, 0.3], i = g.length - 1; i >= 0; i--) a.globalAlpha = g[i], a.strokeStyle = "#d0d0d0", a.beginPath(), this._strokeChartItem(a, b, c + 2 * h / 3, h + i + 1, f.type), a.stroke();
			a.beginPath();
			a.globalAlpha = 0.3;
			a.fillStyle = "#bdbdbd";
			this._strokeChartItem(a, b, c + 2 * h / 3, h + 1, f.type);
			a.fill()
		}
		a.restore();
		a.lineWidth = f.borderWidth;
		a.fillStyle = f.color.call(this, d);
		a.strokeStyle = f.borderColor.call(this, d);
		a.globalAlpha = f.alpha.call(this, d);
		a.beginPath();
		this._strokeChartItem(a, b, c, h + 1, f.type);
		a.fill();
		a.stroke();
		a.globalAlpha = 1;
		e &&
		this.renderTextAt(!1, !0, b, c - h - this._settings.labelOffset, this._settings.label.call(this, d))
	},
	_strokeChartItem: function (a, b, c, d, e) {
		if (e && (e == "square" || e == "s")) d *= Math.sqrt(2) / 2, a.moveTo(b - d - a.lineWidth / 2, c - d), a.lineTo(b + d, c - d), a.lineTo(b + d, c + d), a.lineTo(b - d, c + d), a.lineTo(b - d, c - d);
		else if (e && (e == "diamond" || e == "d")) {
			var f = a.lineWidth > 1 ? a.lineWidth * Math.sqrt(2) / 4 : 0;
			a.moveTo(b, c - d);
			a.lineTo(b + d, c);
			a.lineTo(b, c + d);
			a.lineTo(b - d, c);
			a.lineTo(b + f, c - d - f)
		} else e && (e == "triangle" || e == "t") ? (a.moveTo(b, c - d), a.lineTo(b +
			Math.sqrt(3) * d / 2, c + d / 2), a.lineTo(b - Math.sqrt(3) * d / 2, c + d / 2), a.lineTo(b, c - d)) : a.arc(b, c, d, 0, Math.PI * 2, !0)
	},
	_getYPointOfLineChart: function (a, b, c, d) {
		var e = d.minValue,
			f = d.maxValue,
			h = d.unit,
			g = d.valueFactor,
			i = this._settings.value(a),
			j = (parseFloat(i || 0) - e) * g;
		this._settings.yAxis || (j += d.startValue / h);
		var k = c.y - Math.floor(h * j);
		if (j < 0) k = c.y;
		if (i > f) k = b.y;
		if (i < e) k = c.y;
		return k
	},
	_calculateParametersOfLineChart: function (a, b, c, d, e) {
		var f = {}, h;
		f.totalHeight = d.y - c.y;
		f.cellWidth = Math.round((d.x - c.x) / (!this._settings.offset ?
			b.length - 1 : b.length));
		var g = !! this._settings.yAxis,
			i = this._settings.view.indexOf("stacked") != -1 ? this._getStackedLimits(b) : this._getLimits();
		f.maxValue = i.max;
		f.minValue = i.min;
		e || this._drawScales(a, b, c, d, f.minValue, f.maxValue, f.cellWidth);
		if (g) f.maxValue = parseFloat(this._settings.yAxis.end), f.minValue = parseFloat(this._settings.yAxis.start);
		var j = this._getRelativeValue(f.minValue, f.maxValue);
		h = j[0];
		f.valueFactor = j[1];
		f.unit = h ? f.totalHeight / h : 10;
		f.startValue = 0;
		if (!g && (f.startValue = 10, f.unit != f.totalHeight)) f.unit =
			h ? (f.totalHeight - f.startValue) / h : 10;
		return f
	}
};
dhtmlx.chart.bar = {
	pvt_render_bar: function (a, b, c, d, e, f) {
		var h, g, i, j, k = d.y - c.y,
			l = !! this._settings.yAxis,
			m = !! this._settings.xAxis,
			p = this._getLimits();
		h = p.max;
		g = p.min;
		var o = Math.floor((d.x - c.x) / b.length);
		!e && (this._settings.origin == "auto" || l) && this._drawScales(a, b, c, d, g, h, o);
		l && (h = parseFloat(this._settings.yAxis.end), g = parseFloat(this._settings.yAxis.start));
		var n = this._getRelativeValue(g, h);
		j = n[0];
		i = n[1];
		var r = j ? k / j : j;
		if (!l && !(this._settings.origin != "auto" && m)) var q = 10,
			r = j ? (k - q) / j : q;
		!e && this._settings.origin !=
			"auto" && !l && this._settings.origin > g && this._drawXAxis(a, b, c, d, o, d.y - r * (this._settings.origin - g));
		var u = parseInt(this._settings.width, 10);
		this._series && u * this._series.length + 4 > o && (u = parseInt(o / this._series.length - 4, 10));
		var z = Math.floor((o - u * this._series.length) / 2),
			x = typeof this._settings.radius != "undefined" ? parseInt(this._settings.radius, 10) : Math.round(u / 5),
			y = !1,
			s = this._settings.gradient;
		s && typeof s != "function" ? (y = s, s = !1) : s && (s = a.createLinearGradient(0, d.y, 0, c.y), this._settings.gradient(s));
		m || this._drawLine(a,
			c.x, d.y + 0.5, d.x, d.y + 0.5, "#000000", 1);
		for (var w = 0; w < b.length; w++) {
			var v = parseFloat(this._settings.value(b[w] || 0));
			v > h && (v = h);
			v -= g;
			v *= i;
			var t = c.x + z + w * o + (u + 1) * e,
				A = d.y + 0.5;
			if (v < 0 || this._settings.yAxis && v === 0 && !(this._settings.origin != "auto" && this._settings.origin > g)) this.renderTextAt(!0, !0, t + Math.floor(u / 2), A, this._settings.label(b[w]));
			else {
				!l && !(this._settings.origin != "auto" && m) && (v += q / r);
				var B = s || this._settings.color.call(this, b[w]);
				a.globalAlpha = this._settings.alpha.call(this, b[w]);
				var C = this._drawBar(a,
					c, t, A, u, g, x, r, v, B, s, y);
				y && this._drawBarGradient(a, t, A, u, g, x, r, v, B, y);
				this._settings.border && this._drawBarBorder(a, t, A, u, g, x, r, v, B);
				a.globalAlpha = 1;
				C[0] != t ? this.renderTextAt(!1, !0, t + Math.floor(u / 2), C[1], this._settings.label(b[w])) : this.renderTextAt(!0, !0, t + Math.floor(u / 2), C[3], this._settings.label(b[w]));
				f.addRect(b[w].id, [t, C[3], C[2], C[1]], e)
			}
		}
	},
	_correctBarParams: function (a, b, c, d, e, f, h) {
		var g = this._settings.xAxis,
			i = c;
		g && this._settings.origin != "auto" && this._settings.origin > h && (c -= (this._settings.origin -
			h) * e, i = c, d -= this._settings.origin - h, d < 0 && (d *= -1, a.translate(b + f, c), a.rotate(Math.PI), c = b = 0), c -= 0.5);
		return {
			value: d,
			x0: parseInt(b, 10),
			y0: parseInt(c, 10),
			start: i
		}
	},
	_drawBar: function (a, b, c, d, e, f, h, g, i, j, k, l) {
		a.save();
		a.fillStyle = j;
		var m = this._correctBarParams(a, c, d, i, g, e, f),
			p = this._setBarPoints(a, m.x0, m.y0, e, h, g, m.value, this._settings.border ? 1 : 0);
		k && !l && a.lineTo(m.x0 + (this._settings.border ? 1 : 0), b.y);
		a.fill();
		a.restore();
		var o = m.x0,
			n = m.x0 != c ? c + p[0] : p[0],
			r = m.x0 != c ? m.start - p[1] : d,
			q = m.x0 != c ? m.start : p[1];
		return [o, r, n, q]
	},
	_setBorderStyles: function (a, b) {
		var c, d;
		d = dhtmlx.math.toRgb(b);
		c = dhtmlx.math.rgbToHsv(d[0], d[1], d[2]);
		c[2] /= 2;
		b = "rgb(" + dhtmlx.math.hsvToRgb(c[0], c[1], c[2]) + ")";
		a.strokeStyle = b;
		if (a.globalAlpha == 1) a.globalAlpha = 0.9
	},
	_drawBarBorder: function (a, b, c, d, e, f, h, g, i) {
		var j;
		a.save();
		j = this._correctBarParams(a, b, c, g, h, d, e);
		this._setBorderStyles(a, i);
		this._setBarPoints(a, j.x0, j.y0, d, f, h, j.value, a.lineWidth / 2, 1);
		a.stroke();
		a.restore()
	},
	_drawBarGradient: function (a, b, c, d, e, f, h, g, i, j) {
		a.save();
		var k =
				this._correctBarParams(a, b, c, g, h, d, e),
			l = this._setBarGradient(a, k.x0, k.y0, k.x0 + d, k.y0 - h * k.value + 2, j, i, "y"),
			m = this._settings.border ? 1 : 0;
		a.fillStyle = l.gradient;
		this._setBarPoints(a, k.x0 + l.offset, k.y0, d - l.offset * 2, f, h, k.value, l.offset + m);
		a.fill();
		a.restore()
	},
	_setBarPoints: function (a, b, c, d, e, f, h, g, i) {
		a.beginPath();
		var j = 0;
		if (e > f * h) {
			var k = (e - f * h) / e;
			k <= 1 && k >= -1 && (j = -Math.acos(k) + Math.PI / 2)
		}
		a.moveTo(b + g, c);
		var l = c - Math.floor(f * h) + e + (e ? 0 : g);
		e < f * h && a.lineTo(b + g, l);
		var m = b + e;
		e && e > 0 && a.arc(m, l, e - g, -Math.PI +
			j, -Math.PI / 2, !1);
		var p = b + d - e - (e ? 0 : g),
			o = l - e + (e ? g : 0);
		a.lineTo(p, o);
		e && e > 0 && a.arc(p, l, e - g, -Math.PI / 2, 0 - j, !1);
		var n = b + d - g;
		a.lineTo(n, c);
		i || a.lineTo(b + g, c);
		return [n, o]
	}
};
dhtmlx.chart.pie = {
	pvt_render_pie: function (a, b, c, d, e, f) {
		this._renderPie(a, b, c, d, 1, f)
	},
	_renderPie: function (a, b, c, d, e, f) {
		if (b.length) {
			var h = this._getPieParameters(c, d),
				g = this._settings.radius ? this._settings.radius : h.radius;
			if (!(g < 0)) {
				var i = this._getValues(b),
					j = this._getTotalValue(i),
					k = this._getRatios(i, j),
					l = this._settings.x ? this._settings.x : h.x,
					m = this._settings.y ? this._settings.y : h.y;
				e == 1 && this._settings.shadow && this._addShadow(a, l, m, g);
				m /= e;
				var p = -Math.PI / 2,
					o = [];
				a.scale(1, e);
				if (this._settings.gradient) {
					var n =
							e != 1 ? l + g / 3 : l,
						r = e != 1 ? m + g / 3 : m;
					this._showRadialGradient(a, l, m, g, n, r)
				}
				for (var q = 0; q < b.length; q++) if (i[q]) {
					a.strokeStyle = this._settings.lineColor.call(this, b[q]);
					a.beginPath();
					a.moveTo(l, m);
					o.push(p);
					alpha1 = -Math.PI / 2 + k[q] - 1.0E-4;
					a.arc(l, m, g, p, alpha1, !1);
					a.lineTo(l, m);
					var u = this._settings.color.call(this, b[q]);
					a.fillStyle = u;
					a.fill();
					this._settings.pieInnerText && this._drawSectorLabel(l, m, 5 * g / 6, p, alpha1, e, this._settings.pieInnerText(b[q], j), !0);
					this._settings.label && this._drawSectorLabel(l, m, g + this._settings.labelOffset,
						p, alpha1, e, this._settings.label(b[q]));
					if (e != 1) this._createLowerSector(a, l, m, p, alpha1, g, !0), a.fillStyle = "#000000", a.globalAlpha = 0.2, this._createLowerSector(a, l, m, p, alpha1, g, !1), a.globalAlpha = 1, a.fillStyle = u;
					f.addSector(b[q].id, p, alpha1, l, m, g, e);
					p = alpha1
				}
				a.globalAlpha = 0.8;
				for (var z, q = 0; q < o.length; q++) z = this._getPositionByAngle(o[q], l, m, g), this._drawLine(a, l, m, z.x, z.y, this._settings.lineColor.call(this, b[q]), 2);
				if (e == 1) a.lineWidth = 2, a.strokeStyle = "#ffffff", a.beginPath(), a.arc(l, m, g + 1, 0, 2 * Math.PI, !1),
					a.stroke();
				a.globalAlpha = 1;
				a.scale(1, 1 / e)
			}
		}
	},
	_getValues: function (a) {
		for (var b = [], c = 0; c < a.length; c++) b.push(parseFloat(this._settings.value(a[c]) || 0));
		return b
	},
	_getTotalValue: function (a) {
		for (var b = 0, c = 0; c < a.length; c++) b += a[c];
		return b
	},
	_getRatios: function (a, b) {
		for (var c, d = [], e = 0, b = b || this._getTotalValue(a), f = 0; f < a.length; f++) c = a[f], d[f] = Math.PI * 2 * (b ? (c + e) / b : 1 / data.length), e += c;
		return d
	},
	_getPieParameters: function (a, b) {
		var c = b.x - a.x,
			d = b.y - a.y,
			e = a.x + c / 2,
			f = a.y + d / 2,
			h = Math.min(c / 2, d / 2);
		return {
			x: e,
			y: f,
			radius: h
		}
	},
	_createLowerSector: function (a, b, c, d, e, f, h) {
		a.lineWidth = 1;
		if (d <= 0 && e >= 0 || d >= 0 && e <= Math.PI || Math.abs(d - Math.PI) > 0.0030 && d <= Math.PI && e >= Math.PI) {
			d <= 0 && e >= 0 && (d = 0, h = !1, this._drawSectorLine(a, b, c, f, d, e));
			if (d <= Math.PI && e >= Math.PI) e = Math.PI, h = !1, this._drawSectorLine(a, b, c, f, d, e);
			var g = (this._settings.height || Math.floor(f / 4)) / this._settings.cant;
			a.beginPath();
			a.arc(b, c, f, d, e, !1);
			a.lineTo(b + f * Math.cos(e), c + f * Math.sin(e) + g);
			a.arc(b, c + g, f, e, d, !0);
			a.lineTo(b + f * Math.cos(d), c + f * Math.sin(d));
			a.fill();
			h && a.stroke()
		}
	},
	_drawSectorLine: function (a, b, c, d, e, f) {
		a.beginPath();
		a.arc(b, c, d, e, f, !1);
		a.stroke()
	},
	_addShadow: function (a, b, c, d) {
		a.globalAlpha = 0.5;
		for (var e = "#c4c4c4,#c6c6c6,#cacaca,#dcdcdc,#dddddd,#e0e0e0,#eeeeee,#f5f5f5,#f8f8f8".split(","), f = e.length - 1; f > -1; f--) a.beginPath(), a.fillStyle = e[f], a.arc(b + 1, c + 1, d + f, 0, Math.PI * 2, !0), a.fill();
		a.globalAlpha = 1
	},
	_getGrayGradient: function (a) {
		a.addColorStop(0, "#ffffff");
		a.addColorStop(0.7, "#7a7a7a");
		a.addColorStop(1, "#000000");
		return a
	},
	_showRadialGradient: function (a,
								   b, c, d, e, f) {
		a.beginPath();
		var h;
		typeof this._settings.gradient != "function" ? (h = a.createRadialGradient(e, f, d / 4, b, c, d), h = this._getGrayGradient(h)) : h = this._settings.gradient(h);
		a.fillStyle = h;
		a.arc(b, c, d, 0, Math.PI * 2, !0);
		a.fill();
		a.globalAlpha = 0.7
	},
	_drawSectorLabel: function (a, b, c, d, e, f, h, g) {
		var i = this.renderText(0, 0, h, 0, 1);
		if (i) {
			var j = i.scrollWidth;
			i.style.width = j + "px";
			j > a && (j = a);
			var k = e - d < 0.2 ? 4 : 8;
			g && (k = j / 1.8);
			var l = d + (e - d) / 2;
			c -= (k - 8) / 2;
			var m = -k,
				p = -8,
				o = "right";
			if (l >= Math.PI / 2 && l < Math.PI || l <= 3 * Math.PI / 2 &&
				l >= Math.PI) m = -j - m + 1, o = "left";
			var n = 0;
			!g && f < 1 && l > 0 && l < Math.PI && (n = (this._settings.height || Math.floor(c / 4)) / f);
			var r = (b + Math.floor((c + n) * Math.sin(l))) * f + p,
				q = a + Math.floor((c + k / 2) * Math.cos(l)) + m,
				u = e < Math.PI / 2 + 0.01,
				z = d < Math.PI / 2;
			if (z && u) q = Math.max(q, a + 3), e - d < 0.2 && (q = a);
			else if (!z && !u) q = Math.min(q, a - j);
			else if (!g && (l >= Math.PI / 2 && l < Math.PI || l <= 3 * Math.PI / 2 && l >= Math.PI)) q += j / 3;
			i.style.top = r + "px";
			i.style.left = q + "px";
			i.style.width = j + "px";
			i.style.textAlign = o;
			i.style.whiteSpace = "nowrap"
		}
	}
};
dhtmlx.chart.pie3D = {
	pvt_render_pie3D: function (a, b, c, d, e, f) {
		this._renderPie(a, b, c, d, this._settings.cant, f)
	}
};
dhtmlx.chart.donut = {
	pvt_render_donut: function (a, b, c, d, e, f) {
		if (b.length) {
			this._renderPie(a, b, c, d, 1, f);
			var h = this._settings,
				g = this._getPieParameters(c, d),
				i = h.radius ? h.radius : g.radius,
				j = h.innerRadius && h.innerRadius < i ? h.innerRadius : i / 3,
				k = h.x ? h.x : g.x,
				l = h.y ? h.y : g.y;
			a.fillStyle = "#ffffff";
			a.beginPath();
			a.arc(k, l, j, 0, Math.PI * 2, !0);
			a.fill()
		}
	}
};
dhtmlx.Template = {
	_cache: {},
	empty: function () {
		return ""
	},
	setter: function (a) {
		return dhtmlx.Template.fromHTML(a)
	},
	obj_setter: function (a) {
		var b = dhtmlx.Template.setter(a),
			c = this;
		return function () {
			return b.apply(c, arguments)
		}
	},
	fromHTML: function (a) {
		if (typeof a == "function") return a;
		if (this._cache[a]) return this._cache[a];
		a = (a || "").toString();
		a = a.replace(/[\r\n]+/g, "\\n");
		a = a.replace(/\{obj\.([^}?]+)\?([^:]*):([^}]*)\}/g, '"+(obj.$1?"$2":"$3")+"');
		a = a.replace(/\{common\.([^}\(]*)\}/g, '"+common.$1+"');
		a = a.replace(/\{common\.([^\}\(]*)\(\)\}/g,
			'"+(common.$1?common.$1(obj):"")+"');
		a = a.replace(/\{obj\.([^}]*)\}/g, '"+obj.$1+"');
		a = a.replace(/#([a-z0-9_]+)#/gi, '"+obj.$1+"');
		a = a.replace(/\{obj\}/g, '"+obj+"');
		a = a.replace(/\{-obj/g, "{obj");
		a = a.replace(/\{-common/g, "{common");
		a = 'return "' + a + '";';
		return this._cache[a] = Function("obj", "common", a)
	}
};
dhtmlx.Type = {
	add: function (a, b) {
		if (!a.types && a.prototype.types) a = a.prototype;
		var c = b.name || "default";
		this._template(b);
		this._template(b, "edit");
		this._template(b, "loading");
		a.types[c] = dhtmlx.extend(dhtmlx.extend({}, a.types[c] || this._default), b);
		return c
	},
	_default: {
		css: "default",
		template: function () {
			return ""
		},
		template_edit: function () {
			return ""
		},
		template_loading: function () {
			return "..."
		},
		width: 150,
		height: 80,
		margin: 5,
		padding: 0
	},
	_template: function (a, b) {
		var b = "template" + (b ? "_" + b : ""),
			c = a[b];
		if (c && typeof c == "string") {
			if (c.indexOf("->") != -1) switch (c = c.split("->"), c[0]) {
				case "html":
					c = dhtmlx.html.getValue(c[1]).replace(/\"/g, '\\"');
					break;
				case "http":
					c = (new dhtmlx.ajax).sync().get(c[1], {
						uid: (new Date).valueOf()
					}).responseText
			}
			a[b] = dhtmlx.Template.fromHTML(c)
		}
	}
};
dhtmlx.SingleRender = {
	_init: function () {},
	_toHTML: function (a) {
		return this.type._item_start(a, this.type) + this.type.template(a, this.type) + this.type._item_end
	},
	render: function () {
		if (!this.callEvent || this.callEvent("onBeforeRender", [this.data])) {
			if (this.data) this._dataobj.innerHTML = this._toHTML(this.data);
			this.callEvent && this.callEvent("onAfterRender", [])
		}
	}
};
dhtmlx.ui.Tooltip = function (a) {
	this.name = "Tooltip";
	this.version = "3.0";
	typeof a == "string" && (a = {
		template: a
	});
	dhtmlx.extend(this, dhtmlx.Settings);
	dhtmlx.extend(this, dhtmlx.SingleRender);
	this._parseSettings(a, {
		type: "default",
		dy: 0,
		dx: 20
	});
	this._dataobj = this._obj = document.createElement("DIV");
	this._obj.className = "dhx_tooltip";
	dhtmlx.html.insertBefore(this._obj, document.body.firstChild)
};
dhtmlx.ui.Tooltip.prototype = {
	show: function (a, b) {
		if (!this._disabled) {
			if (this.data != a) this.data = a, this.render(a);
			this._obj.style.top = b.y + this._settings.dy + "px";
			this._obj.style.left = b.x + this._settings.dx + "px";
			this._obj.style.display = "block"
		}
	},
	hide: function () {
		this.data = null;
		this._obj.style.display = "none"
	},
	disable: function () {
		this._disabled = !0
	},
	enable: function () {
		this._disabled = !1
	},
	types: {
		"default": dhtmlx.Template.fromHTML("{obj.id}")
	},
	template_item_start: dhtmlx.Template.empty,
	template_item_end: dhtmlx.Template.empty
};
dhtmlx.AutoTooltip = {
	tooltip_setter: function (a) {
		var b = new dhtmlx.ui.Tooltip(a);
		this.attachEvent("onMouseMove", function (a, d) {
			b.show(this.get(a), dhtmlx.html.pos(d))
		});
		this.attachEvent("onMouseOut", function () {
			b.hide()
		});
		this.attachEvent("onMouseMoving", function () {
			b.hide()
		});
		return b
	}
};
dhtmlx.ajax = function (a, b, c) {
	if (arguments.length !== 0) {
		var d = new dhtmlx.ajax;
		if (c) d.master = c;
		d.get(a, null, b)
	}
	return !this.getXHR ? new dhtmlx.ajax : this
};
dhtmlx.ajax.prototype = {
	getXHR: function () {
		return dhtmlx._isIE ? new ActiveXObject("Microsoft.xmlHTTP") : new XMLHttpRequest
	},
	send: function (a, b, c) {
		var d = this.getXHR();
		typeof c == "function" && (c = [c]);
		if (typeof b == "object") {
			var e = [],
				f;
			for (f in b) {
				var h = b[f];
				if (h === null || h === dhtmlx.undefined) h = "";
				e.push(f + "=" + encodeURIComponent(h))
			}
			b = e.join("&")
		}
		b && !this.post && (a = a + (a.indexOf("?") != -1 ? "&" : "?") + b, b = null);
		d.open(this.post ? "POST" : "GET", a, !this._sync);
		this.post && d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var g = this;
		d.onreadystatechange = function () {
			if (!d.readyState || d.readyState == 4) {
				if (c && g) for (var a = 0; a < c.length; a++) c[a] && c[a].call(g.master || g, d.responseText, d.responseXML, d);
				c = g = g.master = null
			}
		};
		d.send(b || null);
		return d
	},
	get: function (a, b, c) {
		this.post = !1;
		return this.send(a, b, c)
	},
	post: function (a, b, c) {
		this.post = !0;
		return this.send(a, b, c)
	},
	sync: function () {
		this._sync = !0;
		return this
	}
};
dhtmlx.AtomDataLoader = {
	_init: function (a) {
		this.data = {};
		if (a) this._settings.datatype = a.datatype || "json", this._after_init.push(this._load_when_ready)
	},
	_load_when_ready: function () {
		this._ready_for_data = !0;
		this._settings.url && this.url_setter(this._settings.url);
		this._settings.data && this.data_setter(this._settings.data)
	},
	url_setter: function (a) {
		if (!this._ready_for_data) return a;
		this.load(a, this._settings.datatype);
		return a
	},
	data_setter: function (a) {
		if (!this._ready_for_data) return a;
		this.parse(a, this._settings.datatype);
		return !0
	},
	load: function (a, b, c) {
		this.callEvent("onXLS", []);
		typeof b == "string" ? (this.data.driver = dhtmlx.DataDriver[b], b = c) : this.data.driver = dhtmlx.DataDriver.xml;
		dhtmlx.ajax(a, [this._onLoad, b], this)
	},
	parse: function (a, b) {
		this.callEvent("onXLS", []);
		this.data.driver = dhtmlx.DataDriver[b || "xml"];
		this._onLoad(a, null)
	},
	_onLoad: function (a, b) {
		var c = this.data.driver,
			d = c.getRecords(c.toObject(a, b))[0];
		this.data = c ? c.getDetails(d) : a;
		this.callEvent("onXLE", [])
	},
	_check_data_feed: function (a) {
		if (!this._settings.dataFeed ||
			this._ignore_feed || !a) return !0;
		var b = this._settings.dataFeed;
		if (typeof b == "function") return b.call(this, a.id || a, a);
		b = b + (b.indexOf("?") == -1 ? "?" : "&") + "action=get&id=" + encodeURIComponent(a.id || a);
		this.callEvent("onXLS", []);
		dhtmlx.ajax(b, function (a) {
			this._ignore_feed = !0;
			this.setValues(dhtmlx.DataDriver.json.toObject(a)[0]);
			this._ignore_feed = !1;
			this.callEvent("onXLE", [])
		}, this);
		return !1
	}
};
dhtmlx.DataDriver = {};
dhtmlx.DataDriver.json = {
	toObject: function (a) {
		a || (a = "[]");
		return typeof a == "string" ? (eval("dhtmlx.temp=" + a), dhtmlx.temp) : a
	},
	getRecords: function (a) {
		return a && !(a instanceof Array) ? [a] : a
	},
	getDetails: function (a) {
		return a
	},
	getInfo: function (a) {
		return {
			_size: a.total_count || 0,
			_from: a.pos || 0,
			_key: a.dhx_security
		}
	}
};
dhtmlx.DataDriver.json_ext = {
	toObject: function (a) {
		a || (a = "[]");
		if (typeof a == "string") {
			var b;
			eval("temp=" + a);
			dhtmlx.temp = [];
			for (var c = b.header, d = 0; d < b.data.length; d++) {
				for (var e = {}, f = 0; f < c.length; f++) typeof b.data[d][f] != "undefined" && (e[c[f]] = b.data[d][f]);
				dhtmlx.temp.push(e)
			}
			return dhtmlx.temp
		}
		return a
	},
	getRecords: function (a) {
		return a && !(a instanceof Array) ? [a] : a
	},
	getDetails: function (a) {
		return a
	},
	getInfo: function (a) {
		return {
			_size: a.total_count || 0,
			_from: a.pos || 0
		}
	}
};
dhtmlx.DataDriver.html = {
	toObject: function (a) {
		if (typeof a == "string") {
			var b = null;
			a.indexOf("<") == -1 && (b = dhtmlx.toNode(a));
			if (!b) b = document.createElement("DIV"), b.innerHTML = a;
			return b.getElementsByTagName(this.tag)
		}
		return a
	},
	getRecords: function (a) {
		return a.tagName ? a.childNodes : a
	},
	getDetails: function (a) {
		return dhtmlx.DataDriver.xml.tagToObject(a)
	},
	getInfo: function () {
		return {
			_size: 0,
			_from: 0
		}
	},
	tag: "LI"
};
dhtmlx.DataDriver.jsarray = {
	toObject: function (a) {
		return typeof a == "string" ? (eval("dhtmlx.temp=" + a), dhtmlx.temp) : a
	},
	getRecords: function (a) {
		return a
	},
	getDetails: function (a) {
		for (var b = {}, c = 0; c < a.length; c++) b["data" + c] = a[c];
		return b
	},
	getInfo: function () {
		return {
			_size: 0,
			_from: 0
		}
	}
};
dhtmlx.DataDriver.csv = {
	toObject: function (a) {
		return a
	},
	getRecords: function (a) {
		return a.split(this.row)
	},
	getDetails: function (a) {
		for (var a = this.stringToArray(a), b = {}, c = 0; c < a.length; c++) b["data" + c] = a[c];
		return b
	},
	getInfo: function () {
		return {
			_size: 0,
			_from: 0
		}
	},
	stringToArray: function (a) {
		for (var a = a.split(this.cell), b = 0; b < a.length; b++) a[b] = a[b].replace(/^[ \t\n\r]*(\"|)/g, "").replace(/(\"|)[ \t\n\r]*$/g, "");
		return a
	},
	row: "\n",
	cell: ","
};
dhtmlx.DataDriver.xml = {
	toObject: function (a, b) {
		return b && (b = this.checkResponse(a, b)) ? b : typeof a == "string" ? this.fromString(a) : a
	},
	getRecords: function (a) {
		return this.xpath(a, this.records)
	},
	records: "/*/item",
	getDetails: function (a) {
		return this.tagToObject(a, {})
	},
	getInfo: function (a) {
		return {
			_size: a.documentElement.getAttribute("total_count") || 0,
			_from: a.documentElement.getAttribute("pos") || 0,
			_key: a.documentElement.getAttribute("dhx_security")
		}
	},
	xpath: function (a, b) {
		if (window.XPathResult) {
			var c = a;
			if (a.nodeName.indexOf("document") == -1) a = a.ownerDocument;
			for (var d = [], e = a.evaluate(b, c, null, XPathResult.ANY_TYPE, null), f = e.iterateNext(); f;) d.push(f), f = e.iterateNext();
			return d
		} else {
			var h = !0;
			try {
				typeof a.selectNodes == "undefined" && (h = !1)
			} catch (g) {}
			if (h) return a.selectNodes(b);
			else {
				var i = b.split("/").pop();
				return a.getElementsByTagName(i)
			}
		}
	},
	tagToObject: function (a, b) {
		var b = b || {}, c = !1,
			d = a.attributes;
		if (d && d.length) {
			for (var e = 0; e < d.length; e++) b[d[e].name] = d[e].value;
			c = !0
		}
		for (var f = a.childNodes, h = {}, e = 0; e < f.length; e++) if (f[e].nodeType ==
			1) {
			var g = f[e].tagName;
			typeof b[g] != "undefined" ? (b[g] instanceof Array || (b[g] = [b[g]]), b[g].push(this.tagToObject(f[e], {}))) : b[f[e].tagName] = this.tagToObject(f[e], {});
			c = !0
		}
		if (!c) return this.nodeValue(a);
		b.value = this.nodeValue(a);
		return b
	},
	nodeValue: function (a) {
		return a.firstChild ? a.firstChild.data : ""
	},
	fromString: function (a) {
		if (window.DOMParser && !dhtmlx._isIE) return (new DOMParser).parseFromString(a, "text/xml");
		if (window.ActiveXObject) {
			var b = new ActiveXObject("Microsoft.xmlDOM");
			b.loadXML(a);
			return b
		}
	},
	checkResponse: function (a, b) {
		if (b && b.firstChild && b.firstChild.tagName != "parsererror") return b;
		var c = this.fromString(a.replace(/^[\s]+/, ""));
		if (c) return c
	}
};
dhtmlx.DataLoader = {
	_init: function (a) {
		a = a || "";
		this.name = "DataStore";
		this.data = a.datastore || new dhtmlx.DataStore;
		this._readyHandler = this.data.attachEvent("onStoreLoad", dhtmlx.bind(this._call_onready, this))
	},
	load: function (a, b) {
		dhtmlx.AtomDataLoader.load.apply(this, arguments);
		if (!this.data.feed) this.data.feed = function (b, d) {
			if (this._load_count) return this._load_count = [b, d];
			else this._load_count = !0;
			this.load(a + (a.indexOf("?") == -1 ? "?" : "&") + "posStart=" + b + "&count=" + d, function () {
				var a = this._load_count;
				this._load_count = !1;
				typeof a == "object" && this.data.feed.apply(this, a)
			})
		}
	},
	_onLoad: function (a, b) {
		this.data._parse(this.data.driver.toObject(a, b));
		this.callEvent("onXLE", []);
		if (this._readyHandler) this.data.detachEvent(this._readyHandler), this._readyHandler = null
	},
	dataFeed_setter: function (a) {
		this.data.attachEvent("onBeforeFilter", dhtmlx.bind(function (a, c) {
			if (this._settings.dataFeed) {
				var d = {};
				if (a || d) {
					if (typeof a == "function") {
						if (!c) return;
						a(c, d)
					} else d = {
						text: c
					};
					this.clearAll();
					var e = this._settings.dataFeed;
					if (typeof e ==
						"function") return e.call(this, c, d);
					var f = [],
						h;
					for (h in d) f.push("dhx_filter[" + h + "]=" + encodeURIComponent(d[h]));
					this.load(e + (e.indexOf("?") < 0 ? "?" : "&") + f.join("&"), this._settings.datatype);
					return !1
				}
			}
		}, this));
		return a
	},
	_call_onready: function () {
		if (this._settings.ready) {
			var a = dhtmlx.toFunctor(this._settings.ready);
			a && a.call && a.apply(this, arguments)
		}
	}
};
dhtmlx.DataStore = function () {
	this.name = "DataStore";
	dhtmlx.extend(this, dhtmlx.EventSystem);
	this.setDriver("xml");
	this.pull = {};
	this.order = dhtmlx.toArray()
};
dhtmlx.DataStore.prototype = {
	setDriver: function (a) {
		this.driver = dhtmlx.DataDriver[a]
	},
	_parse: function (a) {
		this.callEvent("onParse", [this.driver, a]);
		this._filter_order && this.filter();
		var b = this.driver.getInfo(a);
		if (b._key) dhtmlx.security_key = b._key;
		var c = this.driver.getRecords(a),
			d = (b._from || 0) * 1;
		if (d === 0 && this.order[0]) d = this.order.length;
		for (var e = 0, f = 0; f < c.length; f++) {
			var h = this.driver.getDetails(c[f]),
				g = this.id(h);
			this.pull[g] || (this.order[e + d] = g, e++);
			this.pull[g] = h;
			this.extraParser && this.extraParser(h);
			this._scheme && (this._scheme.$init ? this._scheme.$update(h) : this._scheme.$update && this._scheme.$update(h))
		}
		for (f = 0; f < b._size; f++) this.order[f] || (g = dhtmlx.uid(), h = {
			id: g,
			$template: "loading"
		}, this.pull[g] = h, this.order[f] = g);
		this.callEvent("onStoreLoad", [this.driver, a]);
		this.refresh()
	},
	id: function (a) {
		return a.id || (a.id = dhtmlx.uid())
	},
	changeId: function (a, b) {
		this.pull[b] = this.pull[a];
		this.pull[b].id = b;
		this.order[this.order.find(a)] = b;
		this._filter_order && (this._filter_order[this._filter_order.find(a)] = b);
		this.callEvent("onIdChange", [a, b]);
		this._render_change_id && this._render_change_id(a, b)
	},
	get: function (a) {
		return this.item(a)
	},
	set: function (a, b) {
		return this.update(a, b)
	},
	item: function (a) {
		return this.pull[a]
	},
	update: function (a, b) {
		this._scheme && this._scheme.$update && this._scheme.$update(b);
		if (this.callEvent("onBeforeUpdate", [a, b]) === !1) return !1;
		this.pull[a] = b;
		this.refresh(a)
	},
	refresh: function (a) {
		this._skip_refresh || (a ? this.callEvent("onStoreUpdated", [a, this.pull[a], "update"]) : this.callEvent("onStoreUpdated", [null, null, null]))
	},
	silent: function (a) {
		this._skip_refresh = !0;
		a.call(this);
		this._skip_refresh = !1
	},
	getRange: function (a, b) {
		a = a ? this.indexById(a) : this.startOffset || 0;
		b ? b = this.indexById(b) : (b = Math.min(this.endOffset || Infinity, this.dataCount() - 1), b < 0 && (b = 0));
		if (a > b) var c = b,
			b = a, a = c;
		return this.getIndexRange(a, b)
	},
	getIndexRange: function (a, b) {
		for (var b = Math.min(b || Infinity, this.dataCount() - 1), c = dhtmlx.toArray(), d = a || 0; d <= b; d++) c.push(this.item(this.order[d]));
		return c
	},
	dataCount: function () {
		return this.order.length
	},
	exists: function (a) {
		return !!this.pull[a]
	},
	move: function (a, b) {
		if (!(a < 0 || b < 0)) {
			var c = this.idByIndex(a),
				d = this.item(c);
			this.order.removeAt(a);
			this.order.insertAt(c, Math.min(this.order.length, b));
			this.callEvent("onStoreUpdated", [c, d, "move"])
		}
	},
	scheme: function (a) {
		this._scheme = a
	},
	sync: function (a, b, c) {
		typeof b != "function" && (c = b, b = null);
		if (dhtmlx.debug_bind) this.debug_sync_master = a;
		var d = a;
		if (a.name != "DataStore") a = a.data;
		var e = dhtmlx.bind(function (d, e, g) {
			if (g != "update" || b) d = null;
			if (!d) this.order = dhtmlx.toArray([].concat(a.order)),
				this._filter_order = null, this.pull = a.pull, b && this.silent(b), this._on_sync && this._on_sync();
			c ? c = !1 : this.refresh(d)
		}, this);
		a.attachEvent("onStoreUpdated", e);
		this.feed = function (a, b) {
			d.loadNext(b, a)
		};
		e()
	},
	add: function (a, b) {
		if (this._scheme) {
			var a = a || {}, c;
			for (c in this._scheme) a[c] = a[c] || this._scheme[c];
			this._scheme && (this._scheme.$init ? this._scheme.$update(a) : this._scheme.$update && this._scheme.$update(a))
		}
		var d = this.id(a),
			e = this.dataCount();
		if (dhtmlx.isNotDefined(b) || b < 0) b = e;
		b > e && (b = Math.min(this.order.length,
			b));
		if (this.callEvent("onBeforeAdd", [d, a, b]) === !1) return !1;
		if (this.exists(d)) return null;
		this.pull[d] = a;
		this.order.insertAt(d, b);
		if (this._filter_order) {
			var f = this._filter_order.length;
			!b && this.order.length && (f = 0);
			this._filter_order.insertAt(d, f)
		}
		this.callEvent("onafterAdd", [d, b]);
		this.callEvent("onStoreUpdated", [d, a, "add"]);
		return d
	},
	remove: function (a) {
		if (a instanceof Array) for (var b = 0; b < a.length; b++) this.remove(a[b]);
		else {
			if (this.callEvent("onBeforeDelete", [a]) === !1) return !1;
			if (!this.exists(a)) return null;
			var c = this.item(a);
			this.order.remove(a);
			this._filter_order && this._filter_order.remove(a);
			delete this.pull[a];
			this.callEvent("onafterdelete", [a]);
			this.callEvent("onStoreUpdated", [a, c, "delete"])
		}
	},
	clearAll: function () {
		this.pull = {};
		this.order = dhtmlx.toArray();
		this._filter_order = this.feed = null;
		this.callEvent("onClearAll", []);
		this.refresh()
	},
	idByIndex: function (a) {
		return this.order[a]
	},
	indexById: function (a) {
		var b = this.order.find(a);
		return b
	},
	next: function (a, b) {
		return this.order[this.indexById(a) + (b || 1)]
	},
	first: function () {
		return this.order[0]
	},
	last: function () {
		return this.order[this.order.length - 1]
	},
	previous: function (a, b) {
		return this.order[this.indexById(a) - (b || 1)]
	},
	sort: function (a, b, c) {
		var d = a;
		typeof a == "function" ? d = {
			as: a,
			dir: b
		} : typeof a == "string" && (d = {
			by: a,
			dir: b,
			as: c
		});
		var e = [d.by, d.dir, d.as];
		if (this.callEvent("onbeforesort", e)) {
			if (this.order.length) {
				var f = dhtmlx.sort.create(d),
					h = this.getRange(this.first(), this.last());
				h.sort(f);
				this.order = h.map(function (a) {
					return this.id(a)
				}, this)
			}
			this.refresh();
			this.callEvent("onaftersort", e)
		}
	},
	filter: function (a, b) {
		if (this.callEvent("onBeforeFilter", [a, b])) {
			if (this._filter_order) this.order = this._filter_order, delete this._filter_order;
			if (this.order.length) {
				if (a) {
					var c = a,
						b = b || "";
					typeof a == "string" && (a = dhtmlx.Template.fromHTML(a), b = b.toString().toLowerCase(), c = function (b, c) {
						return a(b).toLowerCase().indexOf(c) != -1
					});
					for (var d = dhtmlx.toArray(), e = 0; e < this.order.length; e++) {
						var f = this.order[e];
						c(this.item(f), b) && d.push(f)
					}
					this._filter_order = this.order;
					this.order =
						d
				}
				this.refresh();
				this.callEvent("onAfterFilter", [])
			}
		}
	},
	each: function (a, b) {
		for (var c = 0; c < this.order.length; c++) a.call(b || this, this.item(this.order[c]))
	},
	provideApi: function (a, b) {
		this.debug_bind_master = a;
		b && this.mapEvent({
			onbeforesort: a,
			onaftersort: a,
			onbeforeadd: a,
			onafteradd: a,
			onbeforedelete: a,
			onafterdelete: a,
			onbeforeupdate: a
		});
		for (var c = "get,set,sort,add,remove,exists,idByIndex,indexById,item,update,refresh,dataCount,filter,next,previous,clearAll,first,last,serialize".split(","), d = 0; d < c.length; d++) a[c[d]] =
			dhtmlx.methodPush(this, c[d])
	},
	serialize: function () {
		for (var a = this.order, b = [], c = 0; c < a.length; c++) b.push(this.pull[a[c]]);
		return b
	}
};
dhtmlx.sort = {
	create: function (a) {
		return dhtmlx.sort.dir(a.dir, dhtmlx.sort.by(a.by, a.as))
	},
	as: {
		"int": function (a, b) {
			a *= 1;
			b *= 1;
			return a > b ? 1 : a < b ? -1 : 0
		},
		string_strict: function (a, b) {
			a = a.toString();
			b = b.toString();
			return a > b ? 1 : a < b ? -1 : 0
		},
		string: function (a, b) {
			a = a.toString().toLowerCase();
			b = b.toString().toLowerCase();
			return a > b ? 1 : a < b ? -1 : 0
		}
	},
	by: function (a, b) {
		if (!a) return b;
		typeof b != "function" && (b = dhtmlx.sort.as[b || "string"]);
		a = dhtmlx.Template.fromHTML(a);
		return function (c, d) {
			return b(a(c), a(d))
		}
	},
	dir: function (a,
				   b) {
		return a == "asc" ? b : function (a, d) {
			return b(a, d) * -1
		}
	}
};
dhtmlx.Group = {
	_init: function () {
		this.data.attachEvent("onStoreLoad", dhtmlx.bind(function () {
			this._settings.group && this.group(this._settings.group, !1)
		}, this));
		this.attachEvent("onBeforeRender", dhtmlx.bind(function (a) {
			this._settings.sort && (a.block(), a.sort(this._settings.sort), a.unblock())
		}, this));
		this.attachEvent("onBeforeSort", dhtmlx.bind(function () {
			this._settings.sort = null
		}, this))
	},
	_init_group_data_event: function (a, b) {
		a.attachEvent("onClearAll", dhtmlx.bind(function () {
			this.ungroup(!1);
			this.block();
			this.clearAll();
			this.unblock()
		}, b))
	},
	sum: function (a, b) {
		var a = dhtmlx.Template.setter(a),
			b = b || this.data,
			c = 0;
		b.each(function (b) {
			c += a(b) * 1
		});
		return c
	},
	min: function (a, b) {
		var a = dhtmlx.Template.setter(a),
			b = b || this.data,
			c = Infinity;
		b.each(function (b) {
			a(b) * 1 < c && (c = a(b) * 1)
		});
		return c * 1
	},
	max: function (a, b) {
		var a = dhtmlx.Template.setter(a),
			b = b || this.data,
			c = -Infinity;
		b.each(function (b) {
			a(b) * 1 > c && (c = a(b) * 1)
		});
		return c
	},
	_split_data_by: function (a) {
		var b = function (a, b) {
			a = dhtmlx.Template.setter(a);
			return a(b[0])
		}, c = dhtmlx.Template.setter(a.by);
		a.map[c] || (a.map[c] = [c, b]);
		var d = {}, e = [];
		this.data.each(function (a) {
			var b = c(a);
			d[b] || (e.push({
				id: b
			}), d[b] = dhtmlx.toArray());
			d[b].push(a)
		});
		for (var f in a.map) {
			var h = a.map[f][1] || b;
			typeof h != "function" && (h = this[h]);
			for (var g = 0; g < e.length; g++) e[g][f] = h.call(this, a.map[f][0], d[e[g].id])
		}
		this._not_grouped_data = this.data;
		this.data = new dhtmlx.DataStore;
		this.data.provideApi(this, !0);
		this._init_group_data_event(this.data, this);
		this.parse(e, "json")
	},
	group: function (a, b) {
		this.ungroup(!1);
		this._split_data_by(a);
		b !== !1 && this.render()
	},
	ungroup: function (a) {
		if (this._not_grouped_data) this.data = this._not_grouped_data, this.data.provideApi(this, !0);
		a !== !1 && this.render()
	},
	group_setter: function (a) {
		return a
	},
	sort_setter: function (a) {
		typeof a != "object" && (a = {
			by: a
		});
		this._mergeSettings(a, {
			as: "string",
			dir: "asc"
		});
		return a
	}
};
dhtmlx.KeyEvents = {
	_init: function () {
		dhtmlx.event(this._obj, "keypress", this._onKeyPress, this)
	},
	_onKeyPress: function (a) {
		var a = a || event,
			b = a.which || a.keyCode;
		this.callEvent(this._edit_id ? "onEditKeyPress" : "onKeyPress", [b, a.ctrlKey, a.shiftKey, a])
	}
};
dhtmlx.MouseEvents = {
	_init: function () {
		this.on_click && (dhtmlx.event(this._obj, "click", this._onClick, this), dhtmlx.event(this._obj, "contextmenu", this._onContext, this));
		this.on_dblclick && dhtmlx.event(this._obj, "dblclick", this._onDblClick, this);
		this.on_mouse_move && (dhtmlx.event(this._obj, "mousemove", this._onMouse, this), dhtmlx.event(this._obj, dhtmlx._isIE ? "mouseleave" : "mouseout", this._onMouse, this))
	},
	_onClick: function (a) {
		return this._mouseEvent(a, this.on_click, "ItemClick")
	},
	_onDblClick: function (a) {
		return this._mouseEvent(a,
			this.on_dblclick, "ItemDblClick")
	},
	_onContext: function (a) {
		var b = dhtmlx.html.locate(a, this._id);
		if (b && !this.callEvent("onBeforeContextMenu", [b, a])) return dhtmlx.html.preventEvent(a)
	},
	_onMouse: function (a) {
		dhtmlx._isIE && (a = document.createEventObject(event));
		this._mouse_move_timer && window.clearTimeout(this._mouse_move_timer);
		this.callEvent("onMouseMoving", [a]);
		this._mouse_move_timer = window.setTimeout(dhtmlx.bind(function () {
			a.type == "mousemove" ? this._onMouseMove(a) : this._onMouseOut(a)
		}, this), 500)
	},
	_onMouseMove: function (a) {
		this._mouseEvent(a,
			this.on_mouse_move, "MouseMove") || this.callEvent("onMouseOut", [a || event])
	},
	_onMouseOut: function (a) {
		this.callEvent("onMouseOut", [a || event])
	},
	_mouseEvent: function (a, b, c) {
		for (var a = a || event, d = a.target || a.srcElement, e = "", f = null, h = !1; d && d.parentNode;) {
			if (!h && d.getAttribute && (f = d.getAttribute(this._id))) {
				d.getAttribute("userdata") && this.callEvent("onLocateData", [f, d]);
				if (!this.callEvent("on" + c, [f, a, d])) return;
				h = !0
			}
			if (e = d.className) if (e = e.split(" "), e = e[0] || e[1], b[e]) return b[e].call(this, a, f, d);
			d = d.parentNode
		}
		return h
	}
};
dhtmlx.Settings = {
	_init: function () {
		this._settings = this.config = {}
	},
	define: function (a, b) {
		return typeof a == "object" ? this._parseSeetingColl(a) : this._define(a, b)
	},
	_define: function (a, b) {
		var c = this[a + "_setter"];
		return this._settings[a] = c ? c.call(this, b) : b
	},
	_parseSeetingColl: function (a) {
		if (a) for (var b in a) this._define(b, a[b])
	},
	_parseSettings: function (a, b) {
		var c = dhtmlx.extend({}, b);
		typeof a == "object" && !a.tagName && dhtmlx.extend(c, a);
		this._parseSeetingColl(c)
	},
	_mergeSettings: function (a, b) {
		for (var c in b) switch (typeof a[c]) {
			case "object":
				a[c] =
					this._mergeSettings(a[c] || {}, b[c]);
				break;
			case "undefined":
				a[c] = b[c]
		}
		return a
	},
	_parseContainer: function (a, b, c) {
		if (typeof a == "object" && !a.tagName) a = a.container;
		this._obj = dhtmlx.toNode(a);
		if (!this._obj && c) this._obj = c(a);
		this._obj.className += " " + b;
		this._obj.onselectstart = function () {
			return !1
		};
		this._dataobj = this._obj
	},
	_set_type: function (a) {
		if (typeof a == "object") return this.type_setter(a);
		this.type = dhtmlx.extend({}, this.types[a]);
		this.customize()
	},
	customize: function (a) {
		a && dhtmlx.extend(this.type, a);
		this.type._item_start =
			dhtmlx.Template.fromHTML(this.template_item_start(this.type));
		this.type._item_end = this.template_item_end(this.type);
		this.render()
	},
	type_setter: function (a) {
		this._set_type(typeof a == "object" ? dhtmlx.Type.add(this, a) : a);
		return a
	},
	template_setter: function (a) {
		return this.type_setter({
			template: a
		})
	},
	css_setter: function (a) {
		this._obj.className += " " + a;
		return a
	}
};
dhtmlx.compat = function (a, b) {
	if (dhtmlx.compat[a]) dhtmlx.compat[a](b)
};
(function () {
	if (!window.dhtmlxError) {
		var a = function () {};
		window.dhtmlxError = {
			catchError: a,
			throwError: a
		};
		window.convertStringToBoolean = function (a) {
			return !!a
		};
		window.dhtmlxEventable = function (a) {
			dhtmlx.extend(a, dhtmlx.EventSystem)
		};
		var b = {
			getXMLTopNode: function () {},
			doXPath: function (a) {
				return dhtmlx.DataDriver.xml.xpath(this.xml, a)
			},
			xmlDoc: {
				responseXML: !0
			}
		};
		dhtmlx.compat.dataProcessor = function (a) {
			var d = "_sendData",
				e = "_in_progress",
				f = "_tMode",
				h = "_waitMode";
			a[d] = function (a, c) {
				if (a) {
					c && (this[e][c] = (new Date).valueOf());
					if (!this.callEvent("onBeforeDataSending", c ? [c, this.getState(c)] : [])) return !1;
					var d = this,
						k = this.serverProcessor;
					this[f] != "POST" ? dhtmlx.ajax().get(k + (k.indexOf("?") != -1 ? "&" : "?") + this.serialize(a, c), "", function (a, c) {
						b.xml = dhtmlx.DataDriver.xml.checkResponse(a, c);
						d.afterUpdate(d, null, null, null, b)
					}) : dhtmlx.ajax().post(k, this.serialize(a, c), function (a, c) {
						b.xml = dhtmlx.DataDriver.xml.checkResponse(a, c);
						d.afterUpdate(d, null, null, null, b)
					});
					this[h]++
				}
			}
		}
	}
})();
if (!dhtmlx.attaches) dhtmlx.attaches = {};
dhtmlx.attaches.attachAbstract = function (a, b) {
	var c = document.createElement("DIV");
	c.id = "CustomObject_" + dhtmlx.uid();
	c.style.width = "100%";
	c.style.height = "100%";
	c.cmp = "grid";
	document.body.appendChild(c);
	this.attachObject(c.id);
	b.container = c.id;
	var d = this.vs[this.av];
	d.grid = new window[a](b);
	d.gridId = c.id;
	d.gridObj = c;
	d.grid.setSizes = function () {
		this.resize ? this.resize() : this.render()
	};
	var e = "_viewRestore";
	return this.vs[this[e]()].grid
};
dhtmlx.attaches.attachDataView = function (a) {
	return this.attachAbstract("dhtmlXDataView", a)
};
dhtmlx.attaches.attachChart = function (a) {
	return this.attachAbstract("dhtmlXChart", a)
};
dhtmlx.compat.layout = function () {};
dhtmlx.DataDriver.dhtmlxgrid = {
	_grid_getter: "_get_cell_value",
	toObject: function (a) {
		return this._grid = a
	},
	getRecords: function (a) {
		return a.rowsBuffer
	},
	getDetails: function (a) {
		for (var b = {}, c = 0; c < this._grid.getColumnsNum(); c++) b["data" + c] = this._grid[this._grid_getter](a, c);
		return b
	},
	getInfo: function () {
		return {
			_size: 0,
			_from: 0
		}
	}
};
dhtmlx.Canvas = {
	_init: function () {
		this._canvas_labels = []
	},
	_prepareCanvas: function (a) {
		this._canvas = dhtmlx.html.create("canvas", {
			width: a.offsetWidth,
			height: a.offsetHeight
		});
		a.appendChild(this._canvas);
		!this._canvas.getContext && dhtmlx._isIE && (dhtmlx.require("thirdparty/excanvas/excanvas.js"), G_vmlCanvasManager.init_(document), G_vmlCanvasManager.initElement(this._canvas));
		return this._canvas
	},
	getCanvas: function (a) {
		return (this._canvas || this._prepareCanvas(this._obj)).getContext(a || "2d")
	},
	_resizeCanvas: function () {
		this._canvas &&
		(this._canvas.setAttribute("width", this._canvas.parentNode.offsetWidth), this._canvas.setAttribute("height", this._canvas.parentNode.offsetHeight))
	},
	renderText: function (a, b, c, d, e) {
		if (c) {
			var f = dhtmlx.html.create("DIV", {
				"class": "dhx_canvas_text" + (d ? " " + d : ""),
				style: "left:" + a + "px; top:" + b + "px;"
			}, c);
			this._obj.appendChild(f);
			this._canvas_labels.push(f);
			if (e) f.style.width = e + "px";
			return f
		}
	},
	renderTextAt: function (a, b, c, d, e, f, h) {
		var g = this.renderText.call(this, c, d, e, f, h);
		if (g) {
			if (a) g.style.top = a == "middle" ? parseInt(d -
				g.offsetHeight / 2, 10) + "px" : d - g.offsetHeight + "px";
			if (b) g.style.left = b == "left" ? c - g.offsetWidth + "px" : parseInt(c - g.offsetWidth / 2, 10) + "px"
		}
		return g
	},
	clearCanvas: function () {
		for (var a = 0; a < this._canvas_labels.length; a++) this._obj.removeChild(this._canvas_labels[a]);
		this._canvas_labels = [];
		if (this._obj._htmlmap) this._obj._htmlmap.parentNode.removeChild(this._obj._htmlmap), this._obj._htmlmap = null;
		this.getCanvas().clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight)
	}
};
dhtmlXChart = function (a) {
	this.name = "Chart";
	this.version = "3.0";
	dhtmlx.extend(this, dhtmlx.Settings);
	this._parseContainer(a, "dhx_chart");
	dhtmlx.extend(this, dhtmlx.AtomDataLoader);
	dhtmlx.extend(this, dhtmlx.DataLoader);
	this.data.provideApi(this, !0);
	dhtmlx.extend(this, dhtmlx.EventSystem);
	dhtmlx.extend(this, dhtmlx.MouseEvents);
	dhtmlx.extend(this, dhtmlx.Destruction);
	dhtmlx.extend(this, dhtmlx.Canvas);
	dhtmlx.extend(this, dhtmlx.Group);
	dhtmlx.extend(this, dhtmlx.AutoTooltip);
	for (var b in dhtmlx.chart) dhtmlx.extend(this,
		dhtmlx.chart[b]);
	a.preset && this.definePreset(a);
	this._parseSettings(a, this.defaults);
	this._series = [this._settings];
	this.data.attachEvent("onStoreUpdated", dhtmlx.bind(function () {
		this.render()
	}, this));
	this.attachEvent("onLocateData", this._switchSerie)
};
dhtmlXChart.prototype = {
	_id: "dhx_area_id",
	on_click: {},
	on_dblclick: {},
	on_mouse_move: {},
	bind: function () {
		dhx.BaseBind.legacyBind.apply(this, arguments)
	},
	sync: function () {
		dhx.BaseBind.legacySync.apply(this, arguments)
	},
	resize: function () {
		this._resizeCanvas();
		this.render()
	},
	view_setter: function (a) {
		if (typeof this._settings.offset == "undefined") this._settings.offset = !(a == "area" || a == "stackedArea");
		a == "radar" && !this._settings.yAxis && this.define("yAxis", {});
		a == "scatter" && (this._settings.yAxis || this.define("yAxis", {}), this._settings.xAxis || this.define("xAxis", {}));
		return a
	},
	render: function () {
		if (this.callEvent("onBeforeRender", [this.data])) {
			this.clearCanvas();
			this._settings.legend && this._drawLegend(this.getCanvas(), this.data.getRange(), this._obj.offsetWidth);
			for (var a = this._getChartBounds(this._obj.offsetWidth, this._obj.offsetHeight), b = new dhtmlx.ui.Map(this._id), c = this._settings, d = 0; d < this._series.length; d++) this._settings = this._series[d], this["pvt_render_" + this._settings.view](this.getCanvas(), this.data.getRange(),
				a.start, a.end, d, b);
			b.render(this._obj);
			this._settings = c
		}
	},
	value_setter: dhtmlx.Template.obj_setter,
	xValue_setter: dhtmlx.Template.obj_setter,
	yValue_setter: function (a) {
		this.define("value", a)
	},
	alpha_setter: dhtmlx.Template.obj_setter,
	label_setter: dhtmlx.Template.obj_setter,
	lineColor_setter: dhtmlx.Template.obj_setter,
	pieInnerText_setter: dhtmlx.Template.obj_setter,
	gradient_setter: function (a) {
		typeof a != "function" && a && a === !0 && (a = "light");
		return a
	},
	colormap: {
		RAINBOW: function (a) {
			var b = Math.floor(this.indexById(a.id) /
				this.dataCount() * 1536);
			b == 1536 && (b -= 1);
			return this._rainbow[Math.floor(b / 256)](b % 256)
		}
	},
	color_setter: function (a) {
		return this.colormap[a] || dhtmlx.Template.obj_setter(a)
	},
	fill_setter: function (a) {
		return !a || a == 0 ? !1 : dhtmlx.Template.obj_setter(a)
	},
	definePreset: function (a) {
		this.define("preset", a.preset);
		delete a.preset
	},
	preset_setter: function (a) {
		var b, c, d;
		this.defaults = dhtmlx.extend({}, this.defaults);
		if (typeof dhtmlx.presets.chart[a] == "object") {
			d = dhtmlx.presets.chart[a];
			for (b in d) if (typeof d[b] == "object") if (!this.defaults[b] ||
				typeof this.defaults[b] != "object") this.defaults[b] = dhtmlx.extend({}, d[b]);
			else for (c in this.defaults[b] = dhtmlx.extend({}, this.defaults[b]), d[b]) this.defaults[b][c] = d[b][c];
			else this.defaults[b] = d[b];
			return a
		}
		return !1
	},
	legend_setter: function (a) {
		if (!a) {
			if (this.legendObj) this.legendObj.innerHTML = "", this.legendObj = null;
			return !1
		}
		typeof a != "object" && (a = {
			template: a
		});
		this._mergeSettings(a, {
			width: 150,
			height: 18,
			layout: "y",
			align: "left",
			valign: "bottom",
			template: "",
			marker: {
				type: "square",
				width: 15,
				height: 15,
				radius: 3
			},
			margin: 4,
			padding: 3
		});
		a.template = dhtmlx.Template.setter(a.template);
		return a
	},
	defaults: {
		color: "RAINBOW",
		alpha: "1",
		label: !1,
		value: "{obj.value}",
		padding: {},
		view: "pie",
		lineColor: "#ffffff",
		cant: 0.5,
		width: 30,
		labelWidth: 100,
		line: {
			width: 2,
			color: "#1293f8"
		},
		item: {
			radius: 3,
			borderColor: "#636363",
			borderWidth: 1,
			color: "#ffffff",
			alpha: 1,
			type: "r",
			shadow: !1
		},
		shadow: !0,
		gradient: !1,
		border: !0,
		labelOffset: 20,
		origin: "auto"
	},
	item_setter: function (a) {
		typeof a != "object" && (a = {
			color: a,
			borderColor: a
		});
		this._mergeSettings(a, dhtmlx.extend({},
			this.defaults.item));
		a.alpha = dhtmlx.Template.setter(a.alpha);
		a.borderColor = dhtmlx.Template.setter(a.borderColor);
		a.color = dhtmlx.Template.setter(a.color);
		a.radius = dhtmlx.Template.setter(a.radius);
		return a
	},
	line_setter: function (a) {
		typeof a != "object" && (a = {
			color: a
		});
		dhtmlx.extend(this.defaults.line, a);
		a = dhtmlx.extend({}, this.defaults.line);
		a.color = dhtmlx.Template.setter(a.color);
		return a
	},
	padding_setter: function (a) {
		typeof a != "object" && (a = {
			left: a,
			right: a,
			top: a,
			bottom: a
		});
		this._mergeSettings(a, {
			left: 50,
			right: 20,
			top: 35,
			bottom: 40
		});
		return a
	},
	xAxis_setter: function (a) {
		if (!a) return !1;
		typeof a != "object" && (a = {
			template: a
		});
		this._mergeSettings(a, {
			title: "",
			color: "#000000",
			lineColor: "#cfcfcf",
			template: "{obj}",
			lines: !0
		});
		var b = ["lineColor", "template", "lines"];
		this._converToTemplate(b, a);
		this._settings.configXAxis = dhtmlx.extend({}, a);
		return a
	},
	yAxis_setter: function (a) {
		this._mergeSettings(a, {
			title: "",
			color: "#000000",
			lineColor: "#cfcfcf",
			template: "{obj}",
			lines: !0,
			bg: "#ffffff"
		});
		var b = ["lineColor", "template", "lines",
			"bg"
		];
		this._converToTemplate(b, a);
		this._settings.configYAxis = dhtmlx.extend({}, a);
		return a
	},
	_converToTemplate: function (a, b) {
		for (var c = 0; c < a.length; c++) b[a[c]] = dhtmlx.Template.setter(b[a[c]])
	},
	_drawScales: function (a, b, c, d, e, f, h) {
		var g = this._drawYAxis(a, b, c, d, e, f);
		this._drawXAxis(a, b, c, d, h, g);
		return g
	},
	_drawXAxis: function (a, b, c, d, e, f) {
		if (this._settings.xAxis) {
			var h = c.x - 0.5,
				g = parseInt(f ? f : d.y, 10) + 0.5,
				i = d.x,
				j, k = !0;
			this._drawLine(a, h, g, i, g, this._settings.xAxis.color, 1);
			for (var l = 0; l < b.length; l++) {
				this._settings.offset === !0 ? j = h + e / 2 + l * e : (j = l == b.length - 1 ? d.x : h + l * e, k = !! l);
				j = parseInt(j, 10) - 0.5;
				var m = this._settings.origin != "auto" && this._settings.view == "bar" && parseFloat(this._settings.value(b[l])) < this._settings.origin;
				this._drawXAxisLabel(j, g, b[l], k, m);
				(this._settings.offset || l) && this._settings.xAxis.lines.call(this, b[l]) && this._drawXAxisLine(a, j, d.y, c.y, b[l])
			}
			this.renderTextAt(!0, !1, h, d.y + this._settings.padding.bottom - 3, this._settings.xAxis.title, "dhx_axis_title_x", d.x - c.x);
			this._settings.xAxis.lines.call(this, {}) && this._settings.offset &&
			this._drawLine(a, i + 0.5, d.y, i + 0.5, c.y + 0.5, this._settings.xAxis.color, 0.2)
		}
	},
	_drawYAxis: function (a, b, c, d, e, f) {
		var h, g = {};
		if (this._settings.yAxis) {
			var i = c.x - 0.5,
				j = d.y,
				k = c.y,
				l = d.y;
			this._settings.yAxis.step && (h = parseFloat(this._settings.yAxis.step));
			if (typeof this._settings.configYAxis.step == "undefined" || typeof this._settings.configYAxis.start == "undefined" || typeof this._settings.configYAxis.end == "undefined") g = this._calculateScale(e, f), e = g.start, f = g.end, h = g.step, this._settings.yAxis.end = f, this._settings.yAxis.start =
				e;
			this._setYAxisTitle(c, d);
			if (h !== 0) {
				if (f == e) return j;
				for (var m = (j - k) * h / (f - e), p = 0, o = e; o <= f; o += h) {
					g.fixNum && (o = parseFloat((new Number(o)).toFixed(g.fixNum)));
					var n = Math.floor(j - p * m) + 0.5;
					!(o == e && this._settings.origin == "auto") && this._settings.yAxis.lines(o) && this._drawLine(a, i, n, d.x, n, this._settings.yAxis.lineColor(o), 1);
					o == this._settings.origin && (l = n);
					var r = o;
					if (h < 1) var q = Math.min(this._log10(h), e <= 0 ? 0 : this._log10(e)),
						u = Math.pow(10, -q), o = r = Math.round(o * u) / u;
					this.renderText(0, n - 5, this._settings.yAxis.template(r.toString()),
						"dhx_axis_item_y", c.x - 5);
					p++
				}
				this._drawLine(a, i, j + 1, i, k, this._settings.yAxis.color, 1);
				return l
			}
		}
	},
	_setYAxisTitle: function (a, b) {
		var c = "dhx_axis_title_y" + (dhtmlx._isIE && dhtmlx._isIE != 9 ? " dhx_ie_filter" : ""),
			d = this.renderTextAt("middle", !1, 0, parseInt((b.y - a.y) / 2 + a.y, 10), this._settings.yAxis.title, c);
		if (d) d.style.left = (dhtmlx.env.transform ? (d.offsetHeight - d.offsetWidth) / 2 : 0) + "px"
	},
	_calculateScale: function (a, b) {
		if (this._settings.origin != "auto" && this._settings.origin < a) a = this._settings.origin;
		var c, d, e;
		c = (b - a) / 8 || 1;
		var f = Math.floor(this._log10(c)),
			h = Math.pow(10, f),
			g = c / h,
			g = g > 5 ? 10 : 5;
		c = parseInt(g, 10) * h;
		if (c > Math.abs(a)) d = a < 0 ? -c : 0;
		else {
			var i = Math.abs(a),
				j = Math.floor(this._log10(i)),
				k = i / Math.pow(10, j);
			d = Math.ceil(k * 10) / 10 * Math.pow(10, j) - c;
			for (i > 1 && c > 0.1 && (d = Math.ceil(d)); a < 0 ? d <= a : d >= a;) d -= c;
			a < 0 && (d = -d - 2 * c)
		}
		for (e = d; e < b;) e += c, e = parseFloat((new Number(e)).toFixed(Math.abs(f)));
		return {
			start: d,
			end: e,
			step: c,
			fixNum: Math.abs(f)
		}
	},
	_getLimits: function (a, b) {
		var c, d, e = arguments.length && a == "h" ? this._settings.configXAxis :
			this._settings.configYAxis;
		if (e && typeof e.end != "undefined" && typeof e.start != "undefined" && e.step) c = parseFloat(e.end), d = parseFloat(e.start);
		else if (c = this.max(this._series[0][b || "value"]), d = e && typeof e.start != "undefined" ? parseFloat(e.start) : this.min(this._series[0][b || "value"]), this._series.length > 1) for (var f = 1; f < this._series.length; f++) {
			var h = this.max(this._series[f][b || "value"]),
				g = this.min(this._series[f][b || "value"]);
			h > c && (c = h);
			g < d && (d = g)
		}
		return {
			max: c,
			min: d
		}
	},
	_log10: function (a) {
		var b = "log";
		return Math.floor(Math[b](a) /
			Math.LN10)
	},
	_drawXAxisLabel: function (a, b, c, d, e) {
		if (this._settings.xAxis) {
			var f = this.renderTextAt(e, d, a, b - (e ? 2 : 0), this._settings.xAxis.template(c));
			f && (f.className += " dhx_axis_item_x")
		}
	},
	_drawXAxisLine: function (a, b, c, d, e) {
		this._settings.xAxis && this._settings.xAxis.lines && this._drawLine(a, b, c, b, d, this._settings.xAxis.lineColor.call(this, e), 1)
	},
	_drawLine: function (a, b, c, d, e, f, h) {
		a.strokeStyle = f;
		a.lineWidth = h;
		a.beginPath();
		a.moveTo(b, c);
		a.lineTo(d, e);
		a.stroke();
		a.lineWidth = 1
	},
	_getRelativeValue: function (a,
								 b) {
		var c, d, e = 1;
		if (b != a) {
			d = b - a;
			if (Math.abs(c) < 1) for (; Math.abs(c) < 1;) e *= 10, d = c * e;
			c = d
		} else c = a;
		return [c, e]
	},
	_rainbow: [function (a) {
		return "#FF" + dhtmlx.math.toHex(a / 2, 2) + "00"
	}, function (a) {
		return "#FF" + dhtmlx.math.toHex(a / 2 + 128, 2) + "00"
	}, function (a) {
		return "#" + dhtmlx.math.toHex(255 - a, 2) + "FF00"
	}, function (a) {
		return "#00FF" + dhtmlx.math.toHex(a, 2)
	}, function (a) {
		return "#00" + dhtmlx.math.toHex(255 - a, 2) + "FF"
	}, function (a) {
		return "#" + dhtmlx.math.toHex(a, 2) + "00FF"
	}
	],
	addSeries: function (a) {
		var b = this._settings;
		this._settings =
			dhtmlx.extend({}, b);
		this._parseSettings(a, {});
		this._series.push(this._settings);
		this._settings = b
	},
	_switchSerie: function (a, b) {
		var c;
		this._active_serie = b.getAttribute("userdata");
		if (this._series[this._active_serie]) {
			for (var d = 0; d < this._series.length; d++)(c = this._series[d].tooltip) && c.disable();
			(c = this._series[this._active_serie].tooltip) && c.enable()
		}
	},
	_drawLegend: function (a, b) {
		var c, d, e, f, h, g, i, j = 0,
			k = 0;
		d = this._settings.legend;
		i = this._settings.legend.layout != "x" ? "width:" + d.width + "px" : "";
		if (this.legendObj) this.legendObj.innerHTML =
			"";
		e = dhtmlx.html.create("DIV", {
			"class": "dhx_chart_legend",
			style: "left:" + j + "px; top:" + k + "px;" + i
		}, "");
		if (d.padding) e.style.padding = d.padding + "px";
		this.legendObj = e;
		this._obj.appendChild(e);
		h = [];
		if (d.values) for (c = 0; c < d.values.length; c++) h.push(this._drawLegendText(e, d.values[c].text));
		else for (c = 0; c < b.length; c++) h.push(this._drawLegendText(e, d.template(b[c])));
		g = e.offsetWidth;
		f = e.offsetHeight;
		g < this._obj.offsetWidth && (d.layout == "x" && d.align == "center" && (j = (this._obj.offsetWidth - g) / 2), d.align == "right" &&
			(j = this._obj.offsetWidth - g), d.margin && d.align != "center" && (j += (d.align == "left" ? 1 : -1) * d.margin));
		f < this._obj.offsetHeight && (d.valign == "middle" && d.align != "center" && d.layout != "x" ? k = (this._obj.offsetHeight - f) / 2 : d.valign == "bottom" && (k = this._obj.offsetHeight - f), d.margin && d.valign != "middle" && (k += (d.valign == "top" ? 1 : -1) * d.margin));
		e.style.left = j + "px";
		e.style.top = k + "px";
		a.save();
		for (c = 0; c < h.length; c++) {
			var l = h[c],
				m = d.values ? d.values[c].color : this._settings.color.call(this, b[c]);
			this._drawLegendMarker(a, l.offsetLeft +
				j, l.offsetTop + k, m, l.offsetHeight)
		}
		a.restore();
		h = null
	},
	_drawLegendText: function (a, b) {
		var c = "";
		this._settings.legend.layout == "x" && (c = "float:left;");
		var d = dhtmlx.html.create("DIV", {
			style: c + "padding-left:" + (10 + this._settings.legend.marker.width) + "px",
			"class": "dhx_chart_legend_item"
		}, b);
		a.appendChild(d);
		return d
	},
	_drawLegendMarker: function (a, b, c, d, e) {
		var f = this._settings.legend.marker;
		a.strokeStyle = a.fillStyle = d;
		a.beginPath();
		if (f.type == "round" || !f.radius) {
			a.lineWidth = f.height;
			a.lineCap = f.type;
			b += a.lineWidth /
				2 + 5;
			c += e / 2;
			a.moveTo(b, c);
			var h = b + f.width - f.height + 1;
			a.lineTo(h, c)
		} else {
			a.lineWidth = 1;
			var g, i;
			b += 5;
			c += e / 2 - f.height / 2;
			g = b + f.width / 2;
			i = c + f.height / 2;
			a.arc(b + f.radius, c + f.radius, f.radius, Math.PI, 3 * Math.PI / 2, !1);
			a.lineTo(b + f.width - f.radius, c);
			a.arc(b + f.width - f.radius, c + f.radius, f.radius, -Math.PI / 2, 0, !1);
			a.lineTo(b + f.width, c + f.height - f.radius);
			a.arc(b + f.width - f.radius, c + f.height - f.radius, f.radius, 0, Math.PI / 2, !1);
			a.lineTo(b + f.radius, c + f.height);
			a.arc(b + f.radius, c + f.height - f.radius, f.radius, Math.PI / 2, Math.PI, !1);
			a.lineTo(b, c + f.radius)
		}
		a.stroke();
		a.fill()
	},
	_getChartBounds: function (a, b) {
		var c, d, e, f;
		c = this._settings.padding.left;
		d = this._settings.padding.top;
		e = a - this._settings.padding.right;
		f = b - this._settings.padding.bottom;
		if (this._settings.legend) {
			var h = this._settings.legend,
				g = this._settings.legend.width,
				i = this._settings.legend.height;
			h.layout == "x" ? h.valign == "center" ? h.align == "right" ? e -= g : h.align == "left" && (c += g) : h.valign == "bottom" ? f -= i : d += i : h.align == "right" ? e -= g : h.align == "left" && (c += g)
		}
		return {
			start: {
				x: c,
				y: d
			},
			end: {
				x: e,
				y: f
			}
		}
	},
	_getStackedLimits: function (a) {
		var b, c, d, e, f;
		if (this._settings.yAxis && typeof this._settings.yAxis.end != "undefined" && typeof this._settings.yAxis.start != "undefined" && this._settings.yAxis.step) d = parseFloat(this._settings.yAxis.end), e = parseFloat(this._settings.yAxis.start);
		else {
			for (b = 0; b < a.length; b++) {
				a[b].$sum = 0;
				a[b].$min = Infinity;
				for (c = 0; c < this._series.length; c++) if (f = parseFloat(this._series[c].value(a[b]) || 0), !isNaN(f) && (a[b].$sum += f, f < a[b].$min)) a[b].$min = f
			}
			d = -Infinity;
			e = Infinity;
			for (b = 0; b < a.length; b++) {
				if (a[b].$sum > d) d = a[b].$sum;
				if (a[b].$min < e) e = a[b].$min
			}
			e > 0 && (e = 0)
		}
		return {
			max: d,
			min: e
		}
	},
	_setBarGradient: function (a, b, c, d, e, f, h, g) {
		var i, j, k, l, m;
		f == "light" ? (i = g == "x" ? a.createLinearGradient(b, c, d, c) : a.createLinearGradient(b, c, b, e), i.addColorStop(0, "#FFFFFF"), i.addColorStop(0.9, h), i.addColorStop(1, h), j = 2) : f == "falling" || f == "rising" ? (i = g == "x" ? a.createLinearGradient(b, c, d, c) : a.createLinearGradient(b, c, b, e), k = dhtmlx.math.toRgb(h), l = dhtmlx.math.rgbToHsv(k[0], k[1], k[2]), l[1] *= 0.5, m = "rgb(" +
			dhtmlx.math.hsvToRgb(l[0], l[1], l[2]) + ")", f == "falling" ? (i.addColorStop(0, m), i.addColorStop(0.7, h), i.addColorStop(1, h)) : f == "rising" && (i.addColorStop(0, h), i.addColorStop(0.3, h), i.addColorStop(1, m)), j = 0) : (a.globalAlpha = 0.37, j = 0, i = g == "x" ? a.createLinearGradient(b, e, b, c) : a.createLinearGradient(b, c, d, c), i.addColorStop(0, "#9d9d9d"), i.addColorStop(0.3, "#e8e8e8"), i.addColorStop(0.45, "#ffffff"), i.addColorStop(0.55, "#ffffff"), i.addColorStop(0.7, "#e8e8e8"), i.addColorStop(1, "#9d9d9d"));
		return {
			gradient: i,
			offset: j
		}
	},
	_getPositionByAngle: function (a, b, c, d) {
		a *= -1;
		b += Math.cos(a) * d;
		c -= Math.sin(a) * d;
		return {
			x: b,
			y: c
		}
	}
};
dhtmlx.compat("layout");
