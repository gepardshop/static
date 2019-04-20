(function(w, p) {
    "object" === typeof exports ? p(exports) : "function" === typeof define && define.amd ? define(["exports"], p) : p(w)
})(this,
function(w) {
    function p(a) {
        this._targetElement = a;
        this._options = {
            nextLabel: "下一步",
            prevLabel: "上一步",
            skipLabel: "跳步",
            doneLabel: "完成",
            tooltipPosition: "bottom",
            tooltipClass: "",
            highlightClass: "",
            exitOnEsc: !0,
            exitOnOverlayClick: !0,
            showStepNumbers: !0,
            keyboardNavigation: !0,
            showButtons: !0,
            showBullets: !0,
            showProgress: !1,
            scrollToElement: !0,
            overlayOpacity: 0.8,
            positionPrecedence: ["bottom", "top", "right", "left"],
            disableInteraction: !1
        }
    }
    function J(a) {
        var b = [],
        c = this;
        if (this._options.steps) {
            for (var d = [], e = 0, d = this._options.steps.length; e < d; e++) {
                var f = A(this._options.steps[e]);
                f.step = b.length + 1;
                "string" === typeof f.element && (f.element = document.querySelector(f.element));
                if ("undefined" === typeof f.element || null == f.element) {
                    var h = document.querySelector(".introjsFloatingElement");
                    null == h && (h = document.createElement("div"), h.className = "introjsFloatingElement", document.body.appendChild(h));
                    f.element = h;
                    f.position = "floating"
                }
                null != f.element && b.push(f)
            }
        } else {
            d = a.querySelectorAll("*[data-intro]");
            if (1 > d.length) {
                return ! 1
            }
            e = 0;
            for (f = d.length; e < f; e++) {
                var h = d[e],
                k = parseInt(h.getAttribute("data-step"), 10);
                0 < k && (b[k - 1] = {
                    element: h,
                    intro: h.getAttribute("data-intro"),
                    step: parseInt(h.getAttribute("data-step"), 10),
                    tooltipClass: h.getAttribute("data-tooltipClass"),
                    highlightClass: h.getAttribute("data-highlightClass"),
                    position: h.getAttribute("data-position") || this._options.tooltipPosition
                })
            }
            e = k = 0;
            for (f = d.length; e < f; e++) {
                if (h = d[e], null == h.getAttribute("data-step")) {
                    for (;
                    "undefined" != typeof b[k];) {
                        k++
                    }
                    b[k] = {
                        element: h,
                        intro: h.getAttribute("data-intro"),
                        step: k + 1,
                        tooltipClass: h.getAttribute("data-tooltipClass"),
                        highlightClass: h.getAttribute("data-highlightClass"),
                        position: h.getAttribute("data-position") || this._options.tooltipPosition
                    }
                }
            }
        }
        e = [];
        for (d = 0; d < b.length; d++) {
            b[d] && e.push(b[d])
        }
        b = e;
        b.sort(function(a, b) {
            return a.step - b.step
        });
        c._introItems = b;
        K.call(c, a) && (x.call(c), a.querySelector(".introjs-skipbutton"), a.querySelector(".introjs-nextbutton"), c._onKeyDown = function(b) {
            if (27 === b.keyCode && !0 == c._options.exitOnEsc) {
                y.call(c, a),
                void 0 != c._introExitCallback && c._introExitCallback.call(c)
            } else {
                if (37 === b.keyCode) {
                    C.call(c)
                } else {
                    if (39 === b.keyCode) {
                        x.call(c)
                    } else {
                        if (13 === b.keyCode) {
                            var d = b.target || b.srcElement;
                            d && 0 < d.className.indexOf("introjs-prevbutton") ? C.call(c) : d && 0 < d.className.indexOf("introjs-skipbutton") ? y.call(c, a) : x.call(c);
                            b.preventDefault ? b.preventDefault() : b.returnValue = !1
                        }
                    }
                }
            }
        },
        c._onResize = function(a) {
            t.call(c, document.querySelector(".introjs-helperLayer"));
            t.call(c, document.querySelector(".introjs-tooltipReferenceLayer"))
        },
        window.addEventListener ? (this._options.keyboardNavigation && window.addEventListener("keydown", c._onKeyDown, !0), window.addEventListener("resize", c._onResize, !0)) : document.attachEvent && (this._options.keyboardNavigation && document.attachEvent("onkeydown", c._onKeyDown), document.attachEvent("onresize", c._onResize)));
        return ! 1
    }
    function A(a) {
        if (null == a || "object" != typeof a || "undefined" != typeof a.nodeType) {
            return a
        }
        var b = {},
        c;
        for (c in a) {
            b[c] = A(a[c])
        }
        return b
    }
    function x() {
        this._direction = "forward";
        "undefined" === typeof this._currentStep ? this._currentStep = 0 : ++this._currentStep;
        if (this._introItems.length <= this._currentStep) {
            "function" === typeof this._introCompleteCallback && this._introCompleteCallback.call(this),
            y.call(this, this._targetElement)
        } else {
            var a = this._introItems[this._currentStep];
            "undefined" !== typeof this._introBeforeChangeCallback && this._introBeforeChangeCallback.call(this, a.element);
            G.call(this, a)
        }
    }
    function C() {
        this._direction = "backward";
        if (0 === this._currentStep) {
            return ! 1
        }
        var a = this._introItems[--this._currentStep];
        "undefined" !== typeof this._introBeforeChangeCallback && this._introBeforeChangeCallback.call(this, a.element);
        G.call(this, a)
    }
    function y(a) {
        var b = a.querySelector(".introjs-overlay");
        if (null != b) {
            b.style.opacity = 0;
            setTimeout(function() {
                b.parentNode && b.parentNode.removeChild(b)
            },
            500);
            var c = a.querySelector(".introjs-helperLayer");
            c && c.parentNode.removeChild(c); (c = a.querySelector(".introjs-tooltipReferenceLayer")) && c.parentNode.removeChild(c); (a = a.querySelector(".introjs-disableInteraction")) && a.parentNode.removeChild(a); (a = document.querySelector(".introjsFloatingElement")) && a.parentNode.removeChild(a);
            if (a = document.querySelector(".introjs-showElement")) {
                a.className = a.className.replace(/introjs-[a-zA-Z]+/g, "").replace(/^\s+|\s+$/g, "")
            }
            if ((a = document.querySelectorAll(".introjs-fixParent")) && 0 < a.length) {
                for (c = a.length - 1; 0 <= c; c--) {
                    a[c].className = a[c].className.replace(/introjs-fixParent/g, "").replace(/^\s+|\s+$/g, "")
                }
            }
            window.removeEventListener ? window.removeEventListener("keydown", this._onKeyDown, !0) : document.detachEvent && document.detachEvent("onkeydown", this._onKeyDown);
            this._currentStep = void 0
        }
    }
    function H(a, b, c, d) {
        var e = "";
        b.style.top = null;
        b.style.right = null;
        b.style.bottom = null;
        b.style.left = null;
        b.style.marginLeft = null;
        b.style.marginTop = null;
        c.style.display = "inherit";
        "undefined" != typeof d && null != d && (d.style.top = null, d.style.left = null);
        if (this._introItems[this._currentStep]) {
            e = this._introItems[this._currentStep];
            e = "string" === typeof e.tooltipClass ? e.tooltipClass: this._options.tooltipClass;
            b.className = ("introjs-tooltip " + e).replace(/^\s+|\s+$/g, "");
            currentTooltipPosition = this._introItems[this._currentStep].position;
            if (("auto" == currentTooltipPosition || "auto" == this._options.tooltipPosition) && "floating" != currentTooltipPosition) {
                var e = currentTooltipPosition,
                f = this._options.positionPrecedence.slice(),
                h = F(),
                p = k(b).height + 10,
                s = k(b).width + 20,
                l = k(a),
                m = "floating";
                l.left + s > h.width || 0 > l.left + l.width / 2 - s ? (q(f, "bottom"), q(f, "top")) : (l.height + l.top + p > h.height && q(f, "bottom"), 0 > l.top - p && q(f, "top"));
                l.width + l.left + s > h.width && q(f, "right");
                0 > l.left - s && q(f, "left");
                0 < f.length && (m = f[0]);
                e && "auto" != e && -1 < f.indexOf(e) && (m = e);
                currentTooltipPosition = m
            }
            e = k(a);
            f = k(b).height;
            h = F();
            switch (currentTooltipPosition) {
            case "top":
                b.style.left = "15px";
                b.style.top = "-" + (f + 10) + "px";
                c.className = "introjs-arrow bottom";
                break;
            case "right":
                b.style.left = k(a).width + 20 + "px";
                e.top + f > h.height && (c.className = "introjs-arrow left-bottom", b.style.top = "-" + (f - e.height - 20) + "px");
                c.className = "introjs-arrow left";
                break;
            case "left":
                !0 == this._options.showStepNumbers && (b.style.top = "15px");
                e.top + f > h.height ? (b.style.top = "-" + (f - e.height - 20) + "px", c.className = "introjs-arrow right-bottom") : c.className = "introjs-arrow right";
                b.style.right = e.width + 20 + "px";
                break;
            case "floating":
                c.style.display = "none";
                a = k(b);
                b.style.left = "50%";
                b.style.top = "50%";
                b.style.marginLeft = "-" + a.width / 2 + "px";
                b.style.marginTop = "-" + a.height / 2 + "px";
                "undefined" != typeof d && null != d && (d.style.left = "-" + (a.width / 2 + 18) + "px", d.style.top = "-" + (a.height / 2 + 18) + "px");
                break;
            case "bottom-right-aligned":
                c.className = "introjs-arrow top-right";
                b.style.right = "0px";
                b.style.bottom = "-" + (k(b).height + 10) + "px";
                break;
            case "bottom-middle-aligned":
                d = k(a);
                a = k(b);
                c.className = "introjs-arrow top-middle";
                b.style.left = d.width / 2 - a.width / 2 + "px";
                b.style.bottom = "-" + (a.height + 10) + "px";
                break;
            default:
                b.style.bottom = "-" + (k(b).height + 10) + "px",
                b.style.left = k(a).width / 2 - k(b).width / 2 + "px",
                c.className = "introjs-arrow top"
            }
        }
    }
    function q(a, b) { - 1 < a.indexOf(b) && a.splice(a.indexOf(b), 1)
    }
    function t(a) {
        if (a && this._introItems[this._currentStep]) {
            var b = this._introItems[this._currentStep],
            c = k(b.element),
            d = 10;
            "floating" == b.position && (d = 0);
            a.setAttribute("style", "width: " + (c.width + d) + "px; height:" + (c.height + d) + "px; top:" + (c.top - 5) + "px;left: " + (c.left - 5) + "px;")
        }
    }
    function L() {
        var a = document.querySelector(".introjs-disableInteraction");
        null === a && (a = document.createElement("div"), a.className = "introjs-disableInteraction", this._targetElement.appendChild(a));
        t.call(this, a)
    }
    function G(a) {
        "undefined" !== typeof this._introChangeCallback && this._introChangeCallback.call(this, a.element);
        var b = this,
        c = document.querySelector(".introjs-helperLayer"),
        d = document.querySelector(".introjs-tooltipReferenceLayer"),
        e = "introjs-helperLayer";
        k(a.element);
        "string" === typeof a.highlightClass && (e += " " + a.highlightClass);
        "string" === typeof this._options.highlightClass && (e += " " + this._options.highlightClass);
        if (null != c) {
            var f = d.querySelector(".introjs-helperNumberLayer"),
            h = d.querySelector(".introjs-tooltiptext"),
            p = d.querySelector(".introjs-arrow"),
            s = d.querySelector(".introjs-tooltip"),
            l = d.querySelector(".introjs-skipbutton"),
            m = d.querySelector(".introjs-prevbutton"),
            r = d.querySelector(".introjs-nextbutton");
            c.className = e;
            s.style.opacity = 0;
            s.style.display = "none";
            if (null != f) {
                var g = this._introItems[0 <= a.step - 2 ? a.step - 2 : 0];
                if (null != g && "forward" == this._direction && "floating" == g.position || "backward" == this._direction && "floating" == a.position) {
                    f.style.opacity = 0
                }
            }
            t.call(b, c);
            t.call(b, d);
            if ((g = document.querySelectorAll(".introjs-fixParent")) && 0 < g.length) {
                for (e = g.length - 1; 0 <= e; e--) {
                    g[e].className = g[e].className.replace(/introjs-fixParent/g, "").replace(/^\s+|\s+$/g, "")
                }
            }
            g = document.querySelector(".introjs-showElement");
            g.className = g.className.replace(/introjs-[a-zA-Z]+/g, "").replace(/^\s+|\s+$/g, "");
            b._lastShowElementTimer && clearTimeout(b._lastShowElementTimer);
            b._lastShowElementTimer = setTimeout(function() {
                null != f && (f.innerHTML = a.step);
                h.innerHTML = a.intro;
                s.style.display = "block";
                H.call(b, a.element, s, p, f);
                d.querySelector(".introjs-bullets li > a.active").className = "";
                d.querySelector('.introjs-bullets li > a[data-stepnumber="' + a.step + '"]').className = "active";
                d.querySelector(".introjs-progress .introjs-progressbar").setAttribute("style", "width:" + I.call(b) + "%;");
                s.style.opacity = 1;
                f && (f.style.opacity = 1); - 1 === r.tabIndex ? l.focus() : r.focus()
            },
            350)
        } else {
            var q = document.createElement("div"),
            m = document.createElement("div"),
            c = document.createElement("div"),
            n = document.createElement("div"),
            w = document.createElement("div"),
            D = document.createElement("div"),
            E = document.createElement("div"),
            u = document.createElement("div");
            q.className = e;
            m.className = "introjs-tooltipReferenceLayer";
            t.call(b, q);
            t.call(b, m);
            this._targetElement.appendChild(q);
            this._targetElement.appendChild(m);
            c.className = "introjs-arrow";
            w.className = "introjs-tooltiptext";
            w.innerHTML = a.intro;
            D.className = "introjs-bullets"; ! 1 === this._options.showBullets && (D.style.display = "none");
            for (var q = document.createElement("ul"), e = 0, B = this._introItems.length; e < B; e++) {
                var A = document.createElement("li"),
                z = document.createElement("a");
                z.onclick = function() {
                    b.goToStep(this.getAttribute("data-stepnumber"))
                };
                e === a.step - 1 && (z.className = "active");
                z.href = "javascript:void(0);";
                z.innerHTML = "&nbsp;";
                z.setAttribute("data-stepnumber", this._introItems[e].step);
                A.appendChild(z);
                q.appendChild(A)
            }
            D.appendChild(q);
            E.className = "introjs-progress"; ! 1 === this._options.showProgress && (E.style.display = "none");
            e = document.createElement("div");
            e.className = "introjs-progressbar";
            e.setAttribute("style", "width:" + I.call(this) + "%;");
            E.appendChild(e);
            u.className = "introjs-tooltipbuttons"; ! 1 === this._options.showButtons && (u.style.display = "none");
            n.className = "introjs-tooltip";
            n.appendChild(w);
            n.appendChild(D);
            n.appendChild(E); ! 0 == this._options.showStepNumbers && (g = document.createElement("span"), g.className = "introjs-helperNumberLayer", g.innerHTML = a.step, m.appendChild(g));
            n.appendChild(c);
            m.appendChild(n);
            r = document.createElement("a");
            r.onclick = function() {
                b._introItems.length - 1 != b._currentStep && x.call(b)
            };
            r.href = "javascript:void(0);";
            r.innerHTML = this._options.nextLabel;
            m = document.createElement("a");
            m.onclick = function() {
                0 != b._currentStep && C.call(b)
            };
            m.href = "javascript:void(0);";
            m.innerHTML = this._options.prevLabel;
            l = document.createElement("a");
            l.className = "introjs-button introjs-skipbutton";
            l.href = "javascript:void(0);";
            l.innerHTML = this._options.skipLabel;
            l.onclick = function() {
                b._introItems.length - 1 == b._currentStep && "function" === typeof b._introCompleteCallback && b._introCompleteCallback.call(b);
                b._introItems.length - 1 != b._currentStep && "function" === typeof b._introExitCallback && b._introExitCallback.call(b);
                y.call(b, b._targetElement)
            };
            u.appendChild(l);
            1 < this._introItems.length && (u.appendChild(m), u.appendChild(r));
            n.appendChild(u);
            H.call(b, a.element, n, c, g)
        } ! 0 === this._options.disableInteraction && L.call(b);
        m.removeAttribute("tabIndex");
        r.removeAttribute("tabIndex");
        0 == this._currentStep && 1 < this._introItems.length ? (m.className = "introjs-button introjs-prevbutton introjs-disabled", m.tabIndex = "-1", r.className = "introjs-button introjs-nextbutton", l.innerHTML = this._options.skipLabel) : this._introItems.length - 1 == this._currentStep || 1 == this._introItems.length ? (l.innerHTML = this._options.doneLabel, m.className = "introjs-button introjs-prevbutton", r.className = "introjs-button introjs-nextbutton introjs-disabled", r.tabIndex = "-1") : (m.className = "introjs-button introjs-prevbutton", r.className = "introjs-button introjs-nextbutton", l.innerHTML = this._options.skipLabel);
        r.focus();
        a.element.className += " introjs-showElement";
        g = v(a.element, "position");
        "absolute" !== g && "relative" !== g && (a.element.className += " introjs-relativePosition");
        for (g = a.element.parentNode; null != g && "body" !== g.tagName.toLowerCase();) {
            c = v(g, "z-index");
            n = parseFloat(v(g, "opacity"));
            u = v(g, "transform") || v(g, "-webkit-transform") || v(g, "-moz-transform") || v(g, "-ms-transform") || v(g, "-o-transform");
            if (/[0-9]+/.test(c) || 1 > n || "none" !== u) {
                g.className += " introjs-fixParent"
            }
            g = g.parentNode
        }
        M(a.element) || !0 !== this._options.scrollToElement || (n = a.element.getBoundingClientRect(), g = F().height, c = n.bottom - (n.bottom - n.top), n = n.bottom - g, 0 > c || a.element.clientHeight > g ? window.scrollBy(0, c - 30) : window.scrollBy(0, n + 100));
        "undefined" !== typeof this._introAfterChangeCallback && this._introAfterChangeCallback.call(this, a.element)
    }
    function v(a, b) {
        var c = "";
        a.currentStyle ? c = a.currentStyle[b] : document.defaultView && document.defaultView.getComputedStyle && (c = document.defaultView.getComputedStyle(a, null).getPropertyValue(b));
        return c && c.toLowerCase ? c.toLowerCase() : c
    }
    function F() {
        if (void 0 != window.innerWidth) {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
        var a = document.documentElement;
        return {
            width: a.clientWidth,
            height: a.clientHeight
        }
    }
    function M(a) {
        a = a.getBoundingClientRect();
        return 0 <= a.top && 0 <= a.left && a.bottom + 80 <= window.innerHeight && a.right <= window.innerWidth
    }
    function K(a) {
        var b = document.createElement("div"),
        c = "",
        d = this;
        b.className = "introjs-overlay";
        if ("body" === a.tagName.toLowerCase()) {
            c += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;",
            b.setAttribute("style", c)
        } else {
            var e = k(a);
            e && (c += "width: " + e.width + "px; height:" + e.height + "px; top:" + e.top + "px;left: " + e.left + "px;", b.setAttribute("style", c))
        }
        a.appendChild(b);
        b.onclick = function() { ! 0 == d._options.exitOnOverlayClick && (y.call(d, a), void 0 != d._introExitCallback && d._introExitCallback.call(d))
        };
        setTimeout(function() {
            c += "opacity: " + d._options.overlayOpacity.toString() + ";";
            b.setAttribute("style", c)
        },
        10);
        return ! 0
    }
    function k(a) {
        var b = {};
        b.width = a.offsetWidth;
        b.height = a.offsetHeight;
        for (var c = 0,
        d = 0; a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop);) {
            c += a.offsetLeft,
            d += a.offsetTop,
            a = a.offsetParent
        }
        b.top = d;
        b.left = c;
        return b
    }
    function I() {
        return 100 * (parseInt(this._currentStep + 1, 10) / this._introItems.length)
    }
    var B = function(a) {
        if ("object" === typeof a) {
            return new p(a)
        }
        if ("string" === typeof a) {
            if (a = document.querySelector(a)) {
                return new p(a)
            }
            throw Error("There is no element with given selector.")
        }
        return new p(document.body)
    };
    B.version = "1.0.0";
    B.fn = p.prototype = {
        clone: function() {
            return new p(this)
        },
        setOption: function(a, b) {
            this._options[a] = b;
            return this
        },
        setOptions: function(a) {
            var b = this._options,
            c = {},
            d;
            for (d in b) {
                c[d] = b[d]
            }
            for (d in a) {
                c[d] = a[d]
            }
            this._options = c;
            return this
        },
        start: function() {
            J.call(this, this._targetElement);
            return this
        },
        goToStep: function(a) {
            this._currentStep = a - 2;
            "undefined" !== typeof this._introItems && x.call(this);
            return this
        },
        nextStep: function() {
            x.call(this);
            return this
        },
        previousStep: function() {
            C.call(this);
            return this
        },
        exit: function() {
            y.call(this, this._targetElement);
            return this
        },
        refresh: function() {
            t.call(this, document.querySelector(".introjs-helperLayer"));
            t.call(this, document.querySelector(".introjs-tooltipReferenceLayer"));
            return this
        },
        onbeforechange: function(a) {
            if ("function" === typeof a) {
                this._introBeforeChangeCallback = a
            } else {
                throw Error("Provided callback for onbeforechange was not a function")
            }
            return this
        },
        onchange: function(a) {
            if ("function" === typeof a) {
                this._introChangeCallback = a
            } else {
                throw Error("Provided callback for onchange was not a function.")
            }
            return this
        },
        onafterchange: function(a) {
            if ("function" === typeof a) {
                this._introAfterChangeCallback = a
            } else {
                throw Error("Provided callback for onafterchange was not a function")
            }
            return this
        },
        oncomplete: function(a) {
            if ("function" === typeof a) {
                this._introCompleteCallback = a
            } else {
                throw Error("Provided callback for oncomplete was not a function.")
            }
            return this
        },
        onexit: function(a) {
            if ("function" === typeof a) {
                this._introExitCallback = a
            } else {
                throw Error("Provided callback for onexit was not a function.")
            }
            return this
        }
    };
    return w.introJs = B
});

function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
};
function addcss() {
    addStyleString(".introjs-helperLayer,.introjs-overlay{-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out}.introjs-overlay{position:absolute;box-sizing:content-box;z-index:999999;background-color:transparent;opacity:0;background:-moz-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,rgba(0,0,0,.4)),color-stop(100%,rgba(0,0,0,.9)));background:-webkit-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-o-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-ms-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr='#66000000', endColorstr='#e6000000', GradientType=1)\9;-ms-filter:\"alpha(opacity=50)\9;filter:alpha(opacity=50);transition:all .3s ease-out}.introjs-fixParent{z-index:auto!important;opacity:1!important;-webkit-transform:none!important;-moz-transform:none!important;-ms-transform:none!important;-o-transform:none!important;transform:none!important}.introjs-showElement,tr.introjs-showElement>td,tr.introjs-showElement>th{z-index:9999999!important}.introjs-disableInteraction{z-index:99999999!important;position:absolute;background-color:#fff;opacity:0;filter:alpha(opacity=0)}.introjs-helperLayer,.introjs-tooltipReferenceLayer{box-sizing:content-box;background-color:transparent}.introjs-relativePosition,tr.introjs-showElement>td,tr.introjs-showElement>th{position:relative}.introjs-helperLayer{position:absolute;z-index:9999998;border:1px solid #777;border:1px solid rgba(0,0,0,.5);border-radius:4px;box-shadow:0 2px 15px rgba(0,0,0,.4);transition:all .3s ease-out}.introjs-tooltipReferenceLayer{position:absolute;visibility:hidden;z-index:10000000;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out}.introjs-helperLayer *,.introjs-helperLayer :after,.introjs-helperLayer :before{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;-ms-box-sizing:content-box;-o-box-sizing:content-box;box-sizing:content-box}.introjs-bullets ul,.introjs-bullets ul li,.introjs-bullets ul li a,.introjs-hint,.introjs-progress,.introjs-progressbar,.introjs-skipbutton,.introjs-tooltip{box-sizing:content-box}.introjs-helperNumberLayer{box-sizing:content-box;position:absolute;visibility:visible;top:-16px;left:-16px;z-index:9999999999!important;padding:2px;font-family:Arial,verdana,tahoma;font-size:13px;font-weight:700;color:#fff;text-align:center;text-shadow:1px 1px 1px rgba(0,0,0,.3);background:#ff3019;background:-webkit-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#ff3019),color-stop(100%,#cf0404));background:-moz-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-ms-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-o-linear-gradient(top,#ff3019 0,#cf0404 100%);background:linear-gradient(to bottom,#ff3019 0,#cf0404 100%);width:20px;height:20px;line-height:20px;border:3px solid #fff;border-radius:50%;filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff3019', endColorstr='#cf0404', GradientType=0)\9;filter:\"progid:DXImageTransform.Microsoft.Shadow(direction=135, strength=2, color=ff0000)\9;box-shadow:0 2px 5px rgba(0,0,0,.4)}.introjs-arrow{border:5px solid #fff;content:'';position:absolute}.introjs-arrow.top,.introjs-arrow.top-middle,.introjs-arrow.top-right{top:-10px;border-color:transparent transparent #fff}.introjs-arrow.top-right{right:10px}.introjs-arrow.top-middle{left:50%;margin-left:-5px}.introjs-arrow.left,.introjs-arrow.right{top:10px}.introjs-arrow.right,.introjs-arrow.right-bottom{right:-10px;border-color:transparent transparent transparent #fff}.introjs-arrow.right-bottom{bottom:10px}.introjs-arrow.bottom{bottom:-10px;border-color:#fff transparent transparent}.introjs-arrow.left,.introjs-arrow.left-bottom{left:-10px;border-color:transparent #fff transparent transparent}.introjs-arrow.left-bottom{bottom:10px}.introjs-tooltip{font-size:18px;position:absolute;visibility:visible;padding:10px;background-color:#fff;min-width:200px;max-width:300px;border-radius:3px;box-shadow:0 1px 10px rgba(0,0,0,.4);-webkit-transition:opacity .1s ease-out;-moz-transition:opacity .1s ease-out;-ms-transition:opacity .1s ease-out;-o-transition:opacity .1s ease-out;transition:opacity .1s ease-out}.introjs-tooltipbuttons{text-align:right;white-space:nowrap}.introjs-bullets,.introjs-button{text-align:center}.introjs-button{color:#020101;background-color:#fff;display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid #ccc;border-radius:4px}.introjs-button:hover{border-color:#bcbcbc;text-decoration:none;box-shadow:0 1px 1px #e3e3e3}.introjs-button:active,.introjs-button:focus{background-image:-webkit-gradient(linear,0 0,0 100%,from(#ececec),to(#f4f4f4));background-image:-moz-linear-gradient(#ececec,#f4f4f4);background-image:-o-linear-gradient(#ececec,#f4f4f4);background-image:linear-gradient(#ececec,#f4f4f4);text-decoration:none}.introjs-button::-moz-focus-inner{padding:0;border:0}.introjs-skipbutton{margin-right:5px;color:#7a7a7a}.introjs-nextbutton:hover,.introjs-prevbutton:hover,.introjs-skipbutton:hover{text-decoration:none}.introjs-prevbutton{-webkit-border-radius:.2em 0 0 .2em;-moz-border-radius:.2em 0 0 .2em;border-radius:.2em 0 0 .2em}.introjs-prevbutton.introjs-fullbutton{border:1px solid #d4d4d4;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em}.introjs-nextbutton{-webkit-border-radius:0 .2em .2em 0;-moz-border-radius:0 .2em .2em 0;border-radius:0 .2em .2em 0;border-left:0}.introjs-nextbutton.introjs-fullbutton{-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em}.introjs-disabled,.introjs-disabled:focus,.introjs-disabled:hover{color:#9a9a9a;border-color:#d4d4d4;box-shadow:none;cursor:default;background-color:#f4f4f4;background-image:none;text-decoration:none}.introjs-hidden{display:none}.introjs-bullets ul{clear:both;margin:15px auto 0;padding:0;display:inline-block}.introjs-bullets ul li{list-style:none;float:left;margin:0 2px}.introjs-bullets ul li a{display:block;width:6px;height:6px;background:#ccc;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;text-decoration:none;cursor:pointer}.introjs-bullets ul li a.active,.introjs-bullets ul li a:hover{background:#999}.introjs-progress{overflow:hidden;height:10px;margin:10px 0 5px;border-radius:4px;background-color:#ecf0f1}.introjs-progressbar{float:left;width:0;height:100%;font-size:10px;line-height:10px;text-align:center;background-color:#08c}.introjsFloatingElement{position:absolute;height:0;width:0;left:50%;top:50%}.introjs-fixedTooltip{position:fixed}.introjs-hint{position:absolute;background:0 0;width:20px;height:15px;cursor:pointer}.introjs-hint:focus{border:0;outline:0}.introjs-hidehint{display:none}.introjs-fixedhint{position:fixed}.introjs-hint-dot,.introjs-hint-pulse{box-sizing:content-box;position:absolute}.introjs-hint:hover>.introjs-hint-pulse{border:5px solid rgba(60,60,60,.57)}.introjs-hint-pulse{width:10px;height:10px;border:5px solid rgba(60,60,60,.27);-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;background-color:rgba(136,136,136,.24);z-index:10;-webkit-transition:all .2s ease-out;-moz-transition:all .2s ease-out;-ms-transition:all .2s ease-out;-o-transition:all .2s ease-out;transition:all .2s ease-out}.introjs-hint-no-anim .introjs-hint-dot{-webkit-animation:none;-moz-animation:none;animation:none}.introjs-hint-dot{border:10px solid rgba(146,146,146,.36);background:0 0;-webkit-border-radius:60px;-moz-border-radius:60px;border-radius:60px;height:50px;width:50px;-webkit-animation:introjspulse 3s ease-out;-moz-animation:introjspulse 3s ease-out;animation:introjspulse 3s ease-out;-webkit-animation-iteration-count:infinite;-moz-animation-iteration-count:infinite;animation-iteration-count:infinite;top:-25px;left:-25px;z-index:1;opacity:0}");
	addStyleString(".zenme-btn,.zenme-btn:hover{z-index:99999;text-decoration:none}@-moz-keyframes introjspulse{0%{-moz-transform:scale(0);opacity:0}25%{-moz-transform:scale(0);opacity:.1}50%{-moz-transform:scale(.1);opacity:.3}75%{-moz-transform:scale(.5);opacity:.5}100%{-moz-transform:scale(1);opacity:0}}@-webkit-keyframes introjspulse{0%{-webkit-transform:scale(0);opacity:0}25%{-webkit-transform:scale(0);opacity:.1}50%{-webkit-transform:scale(.1);opacity:.3}75%{-webkit-transform:scale(.5);opacity:.5}100%{-webkit-transform:scale(1);opacity:0}}.zenme-btn{background:#e06400;background-image:-webkit-linear-gradient(top,#e06400,#faa869);background-image:-moz-linear-gradient(top,#e06400,#faa869);background-image:-ms-linear-gradient(top,#e06400,#faa869);background-image:-o-linear-gradient(top,#e06400,#faa869);background-image:linear-gradient(to bottom,#e06400,#faa869);-webkit-border-radius:12px 12px 0 0;-moz-border-radius:12px 12px 0 0;border-radius:12px 12px 0 0;font-family:Arial;color:#fff;font-size:20px;padding:10px 20px 5px;position:fixed;bottom:0;right:5em}.zenme-btn:hover{color:#e06400;background:#ffddc3;background-image:-webkit-linear-gradient(top,#ffddc3,#ffddc3);background-image:-moz-linear-gradient(top,#ffddc3,#ffddc3);background-image:-ms-linear-gradient(top,#ffddc3,#ffddc3);background-image:-o-linear-gradient(top,#ffddc3,#ffddc3);background-image:linear-gradient(to bottom,#ffddc3,#ffddc3)}");
};
function GetQueryString(name) {
    var url = window.location.href;
    if (url.indexOf("?") != -1) {
        var str = url.split("?")[1];
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var ssss = strs[i].split("=");
            if (ssss[0] == name) {
                return ssss[1];
            }
        }
    }
    return null;
};
function isUrl(args) {
    var url = window.location.href;
    for (var i = 0; i < args.length; i++) {
        if (url.indexOf(args[i]) > -1) {
            return true;
        }
    }
    return false;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
};
function getRefer() {
    var ref = '';
    if (document.referrer.length > 0) {
        ref = document.referrer;
    }
    try {
        if (ref.length == 0 && opener.location.href.length > 0) {
            ref = opener.location.href;
        }
    } catch(e) {}
    return ref;
};
function isReferUrl(args) {
    var ref = '';
    if (document.referrer.length > 0) {
        ref = document.referrer;
    }
    try {
        if (ref.length == 0 && opener.location.href.length > 0) {
            ref = opener.location.href;
        }
    } catch(e) {}
    for (var i = 0; i < args.length; i++) {
        if (ref.indexOf(args[i]) > -1) {
            return true;
        }
    }
    return false;
};
function cut(str) {
    if (str.indexOf("?") > -1) {
        str = str.substring(0, str.indexOf("?"));
    }
    return str;
};
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
};
function change() {
    uengagermultipage = GetQueryString("multipage");
    if (uengagermultipage == null) {
        uengagermultipage = 0;
    }
};
var B_QQ = "qq";
var B_WECHART = "wechart";
var B_IE = "ie";
var B_FIREFOX = "firefox";
var B_OPERA = "opera";
var B_CHROME = "chrome";
var B_SAFARI = "safari";
var B_UC = "uc";
var B_OTHER = "unknown";
var OS_WIN = "windows";
var OS_WINPHONE = "windosphone";
var OS_MAC = "mac";
var OS_IPHONE = "iphone";
var OS_IPAD = "ipad";
var OS_LINUX = "linux";
var OS_UNIX = "unix";
var OS_ANDROID = "android";
function getBrowser() {
    var name = navigator.userAgent.toLowerCase();
    var agent = navigator.userAgent;
    if (agent.indexOf("MicroMessenger") > -1) {
        return B_WECHART
    }
    if (agent.indexOf("UCBrowser") > -1) {
        return B_UC
    }
    if (agent.indexOf("MQQBrowser") > -1 || agent.indexOf("QQ") > -1) {
        return B_QQ
    }
    if (agent.indexOf("MSIE") > -1 || agent.indexOf("msie") > -1 || name.indexOf("rv:11") > -1) {
        return B_IE
    }
    if (agent.indexOf("Opera") > -1 || agent.indexOf("OPR") > -1) {
        return B_OPERA
    }
    if (agent.indexOf("Firefox") > -1) {
        return B_FIREFOX
    }
    if (agent.indexOf("Chrome") > -1) {
        return B_CHROME
    }
    if (agent.indexOf("Safari") > -1) {
        return B_SAFARI
    }
    return B_OTHER
}
function isBrowser(args) {
    var browser = getBrowser();
    for (var i = 0; i < args.length; i++) {
        if (browser == args[i]) {
            return true
        }
    }
    return false
};
cookiekey = "u_p_c_idt01";
cokkievalue = null;
url = window.location.href;
ref = getRefer();
url = cut(url);
ref = cut(ref);
dataid = null;
stepnumber = 0;
var guideId = "807";
uengagermultipage = 0;
change();
function startIntro_noback() {
    var intro = introJs();
    intro.setOptions({
        disableInteraction: false,
        showProgress: true,
        showBullets: false,
        showButton: false,
        overlayOpacity: 0,
        doneLabel: '完成',
        steps: [{
            element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(2) > a'),
            intro: '这里是UI',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(3) > a'),
            intro: '这里是画图',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(4) > a'),
            intro: '没有背景，不遮挡主要内容',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(5) > a'),
            intro: '谢谢查看，现在去添加引导吧',
            position: 'auto'
        }]
    });
    intro.start();
};

function startIntro_single() {
    var intro = introJs();
    intro.setOptions({
        disableInteraction: false,
        showProgress: true,
        showBullets: false,
        showButton: false,
        overlayOpacity: 0.7,
        doneLabel: '完成',
		skipLabel: '跳出',
        steps: [{
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(1) > div > h1'),
            intro: '现在进入操作面板，看几个关键指标',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2)'),
            intro: '每天访问人数，是第一指标，超过8000是不错的表现',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1)'),
            intro: '用户反馈每天都不一样，要重点关注',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(1)'),
            intro: '进一步了解用户<div style="width:100%;text-align:center;"><img style="height:150px;" src="demo.jpg"/></div>',
            position: 'top'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2)'),
            intro: '超过３万的用户总数是不错的表现！',
            position: 'auto'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div > div > footer > p'),
            intro: '第一节培训就到这里，现在去查看跨页引导',
            position: 'auto'
        }]
    });
    intro.start();
};
function startIntro() {
    var intro = introJs();
    if (uengagermultipage == 0) {
        intro.setOptions({
            disableInteraction: false,
            showProgress: true,
            showBullets: false,
            showButton: false,
            overlayOpacity: 0.9,
            doneLabel: '下一页',
			skipLabel: '跳出',
            steps: [{
                element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(2) > a'),
                intro: '从 UI 到 Form 这三个模块是新上的三个功能模块',
                position: 'right'
            },
            {
                element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(3) > a'),
                intro: '图表模版在不断增加中，每周六上新',
                position: 'right'
            },
            {
                element: document.querySelector('html > body > div:nth-child(1) > nav:nth-child(2) > div > ul > li:nth-child(6) > a'),
                intro: '从这里进入本节重点',
                position: 'right'
            }]
        }).oncomplete(function() {
            window.location.href = mainurl+'form.html?multipage=1';
        });
    } else {
        switch (uengagermultipage) {
        case '1':
            intro.setOptions({
                disableInteraction:
                false,
                showProgress: true,
                showBullets: false,
                showButton: false,
                overlayOpacity: 0.9,
                doneLabel: '下一页',
				skipLabel: '跳出',
                steps: [{
                    element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > form > div:nth-child(1) > input'),
                    intro: '标题要包括关键词，切记！',
                    position: 'auto'
                },
                {
                    element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > form > div:nth-child(5) > textarea'),
                    intro: '内容不宜太长，不要超过３０字',
                    position: 'auto'
                },
                {
                    element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > form > button:nth-child(12)'),
                    intro: '从开始填写到提交尽量不要超过10分钟',
                    position: 'auto'
                },
                {
                    element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(1) > div > h1'),
                    intro: '本节培训即将结束，去下一页看一个视频就OK了！',
                    position: 'auto'
                }]
            }).oncomplete(function() {
                window.location.href =mainurl+'tab-panel.html?multipage=2';
            });
            break;
        case '2':
            intro.setOptions({
                disableInteraction:false,
                showProgress: true,
                showBullets: false,
                showButton: false,
                overlayOpacity: 0.9,
                doneLabel: '完成',
                steps: [{
                    element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1)'),
                    intro: '查看优浮视频学习更多内容<iframe width="300" height="170" id="external-frame" src="https://player.youku.com/embed/XMzQ3ODIxMDkzMg==" frameborder="0" "allowfullscreen"=""></iframe>',
                    position: 'right'
                }]
            });
            break;
        default:
            break;
        }
    }
    intro.start();
};
function startIntro_hint() {
    var intro = introJs();
    intro.setOptions({
		disableInteraction:false,
		showProgress: false,
		showBullets: false,
		showButton: false,
		overlayOpacity: 0.9,
		doneLabel: 'OK',
		showStepNumbers: false,
		steps: [{
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(10) > div '),
            intro: '这是云豹框架蜗壳引导系统对其产品做交付培训引导的案例演示。',
            position: 'top'
        }]
    });
    intro.start();
};
function startIntro_phone() {
    var intro = introJs();
    intro.setOptions({
		disableInteraction:false,
		showProgress: false,
		showBullets: false,
		showButton: false,
		overlayOpacity: 0.5,
		doneLabel: '完成',
		showStepNumbers: false,
		steps: [{
            element: document.querySelector('html > body > div:nth-child(1) > div > div > div:nth-child(10) > div '),
            intro: '这是客户使用优浮对其产品做交付培训引导的案例演示。',
            position: 'top'
        },{
            element: document.querySelector('html > body > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div > h1'),
            intro: '现在进入操作面板，看几个关键指标',
            position: 'bottom'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1)'),
            intro: '每天访问人数，是第一指标，超过8000是不错的表现',
            position: 'bottom'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1)'),
            intro: '用户反馈每天都不一样，要重点关注',
            position: 'bottom'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(1)'),
            intro: '超过３万的用户总数是不错的表现！',
            position: 'bottom'
        },
        {
            element: document.querySelector('html > body > div:nth-child(1) > div:nth-child(3) > div > footer > p'),
            intro: '第一节培训就到这里，完整实景演示，<strong style="color:#2cabe3">请在电脑端观看</strong>',
            position: 'top'
        }]
    });
    intro.start();
};
function ajax() {
    var ajaxData = {
        type: arguments[0].type || "GET",
        url: arguments[0].url || "",
        async: arguments[0].async || "true",
        data: arguments[0].data || null,
        dataType: arguments[0].dataType || "text",
        contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
        beforeSend: arguments[0].beforeSend ||
        function() {},
        success: arguments[0].success ||
        function() {},
        error: arguments[0].error ||
        function() {}
    };
    ajaxData.beforeSend();
    var xhr = createxmlHttpRequest();
    xhr.responseType = ajaxData.dataType;
    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);
    xhr.send(convertData(ajaxData.data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                ajaxData.success(xhr.response);
            } else {
                ajaxData.error();
            }
        }
    };
}
function createxmlHttpRequest() {
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
}
function convertData(data) {
    if (typeof data === 'object') {
        var convertResult = "";
        for (var c in data) {
            convertResult += c + "=" + data[c] + "&";
        }
        convertResult = convertResult.substring(0, convertResult.length - 1);
        return convertResult;
    } else {
        return data;
    }
}
var startguide = 0;
function getstartguide() {
    return 0;
}
if (getstartguide() == 0 || getstartguide() == 2) {
    if (uengagermultipage == 0) {
		var url = window.location.href;
		if(window.location.href.indexOf("Walk/WalkIndex/Index") > -1){
			if (document.documentElement.clientWidth > 768) {
				document.write("\n<a style='border-top-left-radius:0' id='morepage' class=\"zenme-btn\" href=\"javascript:void(0);\">跨页引导</a>\n");
				document.write("\n<a style='border-top-right-radius:0;right:220px;' id='single' class=\"zenme-btn\" href=\"javascript:void(0);\">单页引导</a>\n");
			}
		}
    }
}
var mainurl = "https://www.uengager.com/onboarding/";
//var mainurl = "http://127.0.0.1/demo/";
window.onload = function() {
    addcss();
    if (uengagermultipage > 0) {
        startIntro();
    } else if (getstartguide() == 1) {
        startIntro();
    }
	if (document.documentElement.clientWidth <= 768) {
		startIntro_phone();
	}else{
		if(window.location.href.indexOf("Walk/WalkIndex/Index") > -1){
			startIntro_hint();
		}
	}
};
document.body.onclick = function(ev) {
    var target = ev.target;
    var classname = target.className;
	
	if(target.id=="morepage"){
		uengagermultipage = 0;
        startIntro();
	}
	if(target.id=="single"){
		uengagermultipage = 0;
        startIntro_single();
	}
	if(target.id=="noback"){
		uengagermultipage = 0;
        startIntro_noback();
	}
};
