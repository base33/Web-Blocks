﻿// jQuery HC-Sticky
// =============
// Version: 1.2.43
// Copyright: Some Web Media
// Author: Some Web Guy
// Author URL: http://twitter.com/some_web_guy
// Website: http://someweblog.com/
// Plugin URL: https://github.com/somewebmedia/hc-sticky
// License: Released under the MIT License www.opensource.org/licenses/mit-license.php
// Description: Cross-browser jQuery plugin that makes any element attached to the page and always visible while you scroll.

(function (e, t, n) { "use strict"; var r = function (e) { console.log(e) }; var i = e(t), s = t.document, o = e(s); var u = function () { var e, t = 3, n = s.createElement("div"), r = n.getElementsByTagName("i"); while (n.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", r[0]) { } return t > 4 ? t : e }(); var a = function () { var e = t.pageXOffset !== n ? t.pageXOffset : s.compatMode == "CSS1Compat" ? t.document.documentElement.scrollLeft : t.document.body.scrollLeft, r = t.pageYOffset !== n ? t.pageYOffset : s.compatMode == "CSS1Compat" ? t.document.documentElement.scrollTop : t.document.body.scrollTop; if (typeof a.x == "undefined") { a.x = e; a.y = r } if (typeof a.distanceX == "undefined") { a.distanceX = e; a.distanceY = r } else { a.distanceX = e - a.x; a.distanceY = r - a.y } var i = a.x - e, o = a.y - r; a.direction = i < 0 ? "right" : i > 0 ? "left" : o <= 0 ? "down" : o > 0 ? "up" : "first"; a.x = e; a.y = r }; i.on("scroll", a); e.fn.style = function (n) { if (!n) return null; var r = e(this), i; var o = r.clone().css("display", "none"); o.find("input:radio").attr("name", "copy-" + Math.floor(Math.random() * 100 + 1)); r.after(o); var u = function (e, n) { var i; if (e.currentStyle) { i = e.currentStyle[n.replace(/-\w/g, function (e) { return e.toUpperCase().replace("-", "") })] } else if (t.getComputedStyle) { i = s.defaultView.getComputedStyle(e, null).getPropertyValue(n) } i = /margin/g.test(n) ? parseInt(i) === r[0].offsetLeft ? i : "auto" : i; return i }; if (typeof n == "string") { i = u(o[0], n) } else { i = {}; e.each(n, function (e, t) { i[t] = u(o[0], t) }) } o.remove(); return i || null }; e.fn.extend({ hcSticky: function (r) { if (this.length == 0) return this; this.pluginOptions("hcSticky", { top: 0, bottom: 0, bottomEnd: 0, innerTop: 0, innerSticker: null, className: "sticky", wrapperClassName: "wrapper-sticky", stickTo: null, responsive: true, followScroll: true, offResolutions: null, onStart: e.noop, onStop: e.noop, on: true, fn: null }, r || {}, { reinit: function () { e(this).hcSticky() }, stop: function () { e(this).pluginOptions("hcSticky", { on: false }).each(function () { var t = e(this), n = t.pluginOptions("hcSticky"), r = t.parent("." + n.wrapperClassName); var i = t.offset().top - r.offset().top; t.css({ position: "absolute", top: i, bottom: "auto", left: "auto", right: "auto" }).removeClass(n.className) }) }, off: function () { e(this).pluginOptions("hcSticky", { on: false }).each(function () { var t = e(this), n = t.pluginOptions("hcSticky"), r = t.parent("." + n.wrapperClassName); t.css({ position: "relative", top: "auto", bottom: "auto", left: "auto", right: "auto" }).removeClass(n.className); r.css("height", "auto") }) }, on: function () { e(this).each(function () { e(this).pluginOptions("hcSticky", { on: true, remember: { offsetTop: i.scrollTop() } }).hcSticky() }) }, destroy: function () { var t = e(this), n = t.pluginOptions("hcSticky"), r = t.parent("." + n.wrapperClassName); t.removeData("hcStickyInit").css({ position: r.css("position"), top: r.css("top"), bottom: r.css("bottom"), left: r.css("left"), right: r.css("right") }).removeClass(n.className); i.off("resize", n.fn.resize).off("scroll", n.fn.scroll); t.unwrap() } }); if (r && typeof r.on != "undefined") { if (r.on) { this.hcSticky("on") } else { this.hcSticky("off") } } if (typeof r == "string") return this; return this.each(function () { var r = e(this), s = r.pluginOptions("hcSticky"); var f = function () { var e = r.parent("." + s.wrapperClassName); if (e.length > 0) { e.css({ height: r.outerHeight(true), width: function () { var t = e.style("width"); if (t.indexOf("%") >= 0 || t == "auto") { if (r.css("box-sizing") == "border-box" || r.css("-moz-box-sizing") == "border-box") { r.css("width", e.width()) } else { r.css("width", e.width() - parseInt(r.css("padding-left") - parseInt(r.css("padding-right")))) } return t } else { return r.outerWidth(true) } }() }); return e } else { return false } }() || function () { var t = r.style(["width", "margin-left", "left", "right", "top", "bottom", "float", "display"]); var n = r.css("display"); var i = e("<div>", { "class": s.wrapperClassName }).css({ display: n, height: r.outerHeight(true), width: function () { if (t["width"].indexOf("%") >= 0 || t["width"] == "auto" && n != "inline-block" && n != "inline") { r.css("width", parseFloat(r.css("width"))); return t["width"] } else if (t["width"] == "auto" && (n == "inline-block" || n == "inline")) { return r.width() } else { return t["margin-left"] == "auto" ? r.outerWidth() : r.outerWidth(true) } }(), margin: t["margin-left"] ? "auto" : null, position: function () { var e = r.css("position"); return e == "static" ? "relative" : e }(), "float": t["float"] || null, left: t["left"], right: t["right"], top: t["top"], bottom: t["bottom"], "vertical-align": "top" }); r.wrap(i); if (u === 7) { if (e("head").find("style#hcsticky-iefix").length === 0) { e('<style id="hcsticky-iefix">.' + s.wrapperClassName + " {zoom: 1;}</style>").appendTo("head") } } return r.parent() }(); if (r.data("hcStickyInit")) return; r.data("hcStickyInit", true); var l = s.stickTo && (s.stickTo == "document" || s.stickTo.nodeType && s.stickTo.nodeType == 9 || typeof s.stickTo == "object" && s.stickTo instanceof (typeof HTMLDocument != "undefined" ? HTMLDocument : Document)) ? true : false; var c = s.stickTo ? l ? o : typeof s.stickTo == "string" ? e(s.stickTo) : s.stickTo : f.parent(); r.css({ top: "auto", bottom: "auto", left: "auto", right: "auto" }); i.load(function () { if (r.outerHeight(true) > c.height()) { f.css("height", r.outerHeight(true)); r.hcSticky("reinit") } }); var h = function (e) { if (r.hasClass(s.className)) return; e = e || {}; r.css({ position: "fixed", top: e.top || 0, left: e.left || f.offset().left }).addClass(s.className); s.onStart.apply(r[0]); f.addClass("sticky-active") }, p = function (e) { e = e || {}; e.position = e.position || "absolute"; e.top = e.top || 0; e.left = e.left || 0; if (r.css("position") != "fixed" && parseInt(r.css("top")) == e.top) return; r.css({ position: e.position, top: e.top, left: e.left }).removeClass(s.className); s.onStop.apply(r[0]); f.removeClass("sticky-active") }; var d = function (t) { if (!s.on || !r.is(":visible")) return; if (r.outerHeight(true) >= c.height()) { p(); return } var n = s.innerSticker ? e(s.innerSticker).position().top : s.innerTop ? s.innerTop : 0, o = f.offset().top, u = c.height() - s.bottomEnd + (l ? 0 : o), d = f.offset().top - s.top + n, v = r.outerHeight(true) + s.bottom, m = i.height(), g = i.scrollTop(), y = r.offset().top, b = y - g, w; if (typeof s.remember != "undefined" && s.remember) { var E = y - s.top - n; if (v - n > m && s.followScroll) { if (E < g && g + m <= E + r.height()) { s.remember = false } } else { if (s.remember.offsetTop > E) { if (g <= E) { h({ top: s.top - n }); s.remember = false } } else { if (g >= E) { h({ top: s.top - n }); s.remember = false } } } return } if (g > d) { if (u + s.bottom - (s.followScroll && m < v ? 0 : s.top) <= g + v - n - (v - n > m - (d - n) && s.followScroll ? (w = v - m - n) > 0 ? w : 0 : 0)) { p({ top: u - v + s.bottom - o }) } else if (v - n > m && s.followScroll) { if (b + v <= m) { if (a.direction == "down") { h({ top: m - v }) } else { if (b < 0 && r.css("position") == "fixed") { p({ top: y - (d + s.top - n) - a.distanceY }) } } } else { if (a.direction == "up" && y >= g + s.top - n) { h({ top: s.top - n }) } else if (a.direction == "down" && y + v > m && r.css("position") == "fixed") { p({ top: y - (d + s.top - n) - a.distanceY }) } } } else { h({ top: s.top - n }) } } else { p() } }; var v = false, m = false; var g = function () { b(); y(); if (!s.on) return; var e = function () { if (r.css("position") == "fixed") { r.css("left", f.offset().left) } else { r.css("left", 0) } }; if (s.responsive) { if (!m) { m = r.clone().attr("style", "").css({ visibility: "hidden", height: 0, overflow: "hidden", paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }); f.after(m) } var t = f.style("width"); var n = m.style("width"); if (n == "auto" && t != "auto") { n = parseInt(r.css("width")) } if (n != t) { f.width(n) } if (v) { clearTimeout(v) } v = setTimeout(function () { v = false; m.remove(); m = false }, 250) } e(); if (r.outerWidth(true) != f.width()) { var i = r.css("box-sizing") == "border-box" || r.css("-moz-box-sizing") == "border-box" ? f.width() : f.width() - parseInt(r.css("padding-left")) - parseInt(r.css("padding-right")); i = i - parseInt(r.css("margin-left")) - parseInt(r.css("margin-right")); r.css("width", i) } }; r.pluginOptions("hcSticky", { fn: { scroll: d, resize: g } }); var y = function () { if (s.offResolutions) { if (!e.isArray(s.offResolutions)) { s.offResolutions = [s.offResolutions] } var t = true; e.each(s.offResolutions, function (e, n) { if (n < 0) { if (i.width() < n * -1) { t = false; r.hcSticky("off") } } else { if (i.width() > n) { t = false; r.hcSticky("off") } } }); if (t && !s.on) { r.hcSticky("on") } } }; y(); i.on("resize", g); var b = function () { var r = false; if (e._data(t, "events").scroll != n) { e.each(e._data(t, "events").scroll, function (e, t) { if (t.handler == s.fn.scroll) { r = true } }) } if (!r) { s.fn.scroll(true); i.on("scroll", s.fn.scroll) } }; b() }) } }) })(jQuery, this); (function (e, t) { "use strict"; e.fn.extend({ pluginOptions: function (n, r, i, s) { if (!this.data(n)) this.data(n, {}); if (n && typeof r == "undefined") return this.data(n).options; i = i || r || {}; if (typeof i == "object" || i === t) { return this.each(function () { var t = e(this); if (!t.data(n).options) { t.data(n, { options: e.extend(r, i || {}) }); if (s) { t.data(n).commands = s } } else { t.data(n, e.extend(t.data(n), { options: e.extend(t.data(n).options, i || {}) })) } }) } else if (typeof i == "string") { return this.each(function () { e(this).data(n).commands[i].call(this) }) } else { return this } } }) })(jQuery)