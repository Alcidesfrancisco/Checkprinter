function Component(a, b) {
    if (a == undefined) {
        return
    }
    this.baseclass = b;
    this.elem = a;
    this.enabled = !this.elem.attr("disabled")
}
Component.prototype.setEnabled = function(a) {
    this.elem.attr("disabled", !a);
    if (this.elem.attr("disabled")) {
        this.elem.removeClass(this.baseclass + "-enabled").addClass(this.baseclass + "-disabled");
        this.enabled = false
    } else {
        this.elem.removeClass(this.baseclass + "-disabled").addClass(this.baseclass + "-enabled");
        this.enabled = true
    }
};
Clickable.prototype = new Component();
Clickable.prototype.constructor = Clickable;

function Clickable(b, c) {
    Component.call(this, b, c);
    if (b == undefined) {
        return
    }
    var a = this;
    this.elem.mousedown({
        source: a
    }, this.mDown).mouseup({
        source: a
    }, this.mUp).mouseout({
        source: a
    }, this.mOut).mouseover({
        source: a
    }, this.mOver);
    $("body").mouseup({
        source: a
    }, this.mUp);
    if (!this.elem.hasClass(c + "-up") && !this.elem.hasClass(c + "-down")) {
        this.elem.addClass(c + "-up")
    }
    this.setEnabled(a.enabled)
}
Clickable.prototype.doClick = function(a) {
    console.error("NOT GOOD: CALLED BACK TO TOPLEVEL CLICKABLE...")
};
Clickable.prototype.mOver = function(a) {
    var b = a.data.source;
    if (b.isDown) {
        b.elem.removeClass(b.baseclass + "-up").addClass(b.baseclass + "-down")
    }
};
Clickable.prototype.mOut = function(a) {
    var b = a.data.source;
    b.elem.removeClass(b.baseclass + "-down").addClass(b.baseclass + "-up")
};
Clickable.prototype.mDown = function(a) {
    var b = a.data.source;
    b.elem.removeClass(b.baseclass + "-up").addClass(b.baseclass + "-down");
    b.isDown = true
};
Clickable.prototype.mUp = function(b) {
    var c = b.data.source;
    var a = c.elem;
    a.removeClass(c.baseclass + "-down").addClass(c.baseclass + "-up");
    if (c.isDown && areCoordsInElement(a, b.pageX, b.pageY)) {
        c.doClick.call(c, b)
    }
    c.isDown = false
};
Clickable.prototype.LEFTBUTTON = 1;
Clickable.prototype.MIDDLEBUTTON = 2;
Clickable.prototype.RIGHTBUTTON = 3;
Clickable.prototype.ENTERBUTTON = 13;
Clickable.prototype.ALLBUTTONS = -1;

function areCoordsInElement(b, a, c) {
    if (b == undefined || b.offset() == undefined) {
        return false
    }
    return (a >= b.offset().left && a <= (b.offset().left + b.outerWidth()) && c >= b.offset().top && c <= (b.offset().top + b.outerHeight()))
}
ProgressBar.prototype = new Component();
ProgressBar.prototype.constructor = ProgressBar;

function ProgressBar(b, c) {
    Component.call(this, b, c);
    if (b == undefined) {
        return
    }
    var a = this;
    this.showPercent = false;
    this.currentValue = 0;
    this.status = "ok";
    this.deviceId = $(b).data("deviceid");
    if (this.deviceId) {
        $(b).on("STATUS_UPDATE-" + a.deviceId, function(e, d) {
            a.updateStatus(d)
        })
    }
}
ProgressBar.prototype.setShowPercent = function(a) {
    this.showPercent = a
};
ProgressBar.prototype.setValue = function(a) {
    if (a < 0) {
        a = 0
    }
    if (a > 100) {
        a = 100
    }
    this.currentValue = a;
    this.elem.find(".dataText").text(a);
    this.renderBar()
};
ProgressBar.prototype.renderBar = function() {
    var a = this.elem.find("." + this.baseclass + "-inner");
    var b = this.elem.find("." + this.baseclass + "-slider");
    var e = this.elem.find("." + this.baseclass + "-shadow");
    var c = Number(a.css("width").replace("px", ""));
    var d = c * (this.currentValue / 100);
    if (d >= 0) {
        b.animate({
            width: d
        }, 1000, function() {
            if (d == c) {
                b.css("width", d)
            }
        })
    }
    if (this.showPercent) {
        this.elem.find("." + this.baseclass + "-inner ." + this.baseclass + "-text").html(this.currentValue + "%")
    }
    a.attr("title", this.currentValue + "%")
};
ProgressBar.prototype.updateStatus = function(c) {
    curIcon = this.elem.find(".status_icon");
    if (curIcon !== undefined) {
        curIcon.remove()
    }
    if (c.status == "error" || c.status == "warning") {
        var b = $('<div class="status_icon">&nbsp;</div>');
        b.addClass(c.status);
        this.elem.append(b)
    }
    var a = c.level;
    if ((c.status == "error") && (c["enum"] > 8)) {
        a = -1
    }
    this.setValue(a)
};
ProgressBar.prototype.init = function(c, b) {
    var a = new ProgressBar(c, b);
    var d = $(c).find("." + b);
    $(d).ready(function() {
        a.setValue(parseFloat($(c).find(" .dataText").text()))
    })
};
Dropdown.prototype = new Component();
Dropdown.prototype.constructor = Dropdown;
var dropdowns = [];

function Dropdown(a, c, b) {
    Component.call(this, a, c);
    if (a == undefined) {
        return
    }
    this.transition = (b == undefined ? "default" : b);
    this.isToggled = false;
    this.elem.toggle(false);
    this.showHandlers = new Array();
    this.hideHandlers = new Array();
    dropdowns.push(this)
}
Dropdown.prototype.toggleDropdown = function(a) {
    this.isToggled = !this.isToggled;
    if (this.isToggled) {
        this.onShow()
    } else {
        this.onHide()
    }
    if (this.transition == "fade") {
        this.elem.fadeToggle()
    } else {
        if (this.transition == "slide") {
            this.elem.slideToggle()
        } else {
            this.elem.toggle()
        }
    }
};
Dropdown.prototype.showDropdown = function(a) {
    if (!this.isToggled) {
        this.isToggled = true;
        this.onShow();
        if (this.transition == "fade") {
            this.elem.fadeIn()
        } else {
            if (this.transition == "slide") {
                this.elem.slideDown()
            } else {
                this.elem.show()
            }
        }
    }
};
Dropdown.prototype.hideDropdown = function(a) {
    if (this.isToggled) {
        this.isToggled = false;
        this.onHide();
        if (this.transition == "fade") {
            this.elem.fadeOut()
        } else {
            if (this.transition == "slide") {
                this.elem.slideUp()
            } else {
                this.elem.hide()
            }
        }
        document.getElementById("visible_setting_VCCBUNDLE").value = stored_translations.TXT_NO_FILE_SELECTED.text;
        $("#VccImportFileInput").find("form")[0].reset();
        $("#import_VCCBUNDLE").attr("disabled", "disabled")
    }
};
Dropdown.prototype.onShow = function() {
    closeAllDropdowns(this);
    var b = this.showHandlers.length;
    for (var a = 0; a < b; a++) {
        this.showHandlers[a]()
    }
};
Dropdown.prototype.onHide = function() {
    var b = this.hideHandlers.length;
    for (var a = 0; a < b; a++) {
        this.hideHandlers[a]()
    }
};
Dropdown.prototype.addShowHandler = function(a) {
    this.showHandlers.push(a)
};
Dropdown.prototype.addHideHandler = function(a) {
    this.hideHandlers.push(a)
};
Dropdown.prototype.removeAllShowHandlers = function() {
    this.showHandlers = new Array()
};
Dropdown.prototype.removeAllHideHandlers = function() {
    this.hideHandlers = new Array()
};
Dropdown.prototype.init = function(d, b) {
    var c = formatID(d);
    var a = new Dropdown($(c), b)
};

function closeAllDropdowns(a) {
    $.each(dropdowns, function(b, c) {
        if (c != a) {
            c.hideDropdown()
        }
    })
}

function initPanel(a) {
    a.panel()
}(function(c) {
    var a = {
        init: function(d) {
            return this.each(function() {
                var g = c(this).data("panel");
                if (g) {
                    return
                }
                var f = c(this);
                var k = f.find(".panel-header");
                var e = f.find(".panel-contents");
                var h = f.parent().attr("id");
                f.data("panel", {
                    header: k,
                    content: e,
                    id: h
                });
                if (f.data("toggleable")) {
                    k.click(function(m, l) {
                        if (l === undefined) {
                            l = true
                        }
                        a.toggle.apply(f, [l])
                    })
                }
                e.hide();
                if (f.data("open")) {
                    a.open.apply(f)
                }
                if (f.data("close")) {
                    a.close.apply(f)
                }
                f.controlNode()
            })
        },
        open: function(d) {
            return this.each(function() {
                var e = c(this).data("panel");
                if (!e) {
                    return
                }
                if (d) {
                    e.content.animate({
                        height: "show"
                    }, "fast")
                } else {
                    e.content.show()
                }
                e.header.addClass("panel-header-toggled");
                b(e.id, true)
            })
        },
        close: function(d) {
            return this.each(function() {
                var e = c(this).data("panel");
                if (!e) {
                    return
                }
                if (d) {
                    e.content.animate({
                        height: "hide"
                    }, "fast")
                } else {
                    e.content.hide()
                }
                e.header.removeClass("panel-header-toggled");
                b(e.id, false)
            })
        },
        toggle: function(d) {
            return this.each(function() {
                var e = c(this).data("panel");
                if (!e) {
                    return
                }
                if (e.content.is(":visible")) {
                    a.close.apply(c(this), [d])
                } else {
                    a.open.apply(c(this), [d])
                }
            })
        }
    };

    function b(f, e) {
        var d = open_panels.indexOf(f);
        if (d != -1 && !e) {
            open_panels.splice(d, 1)
        } else {
            if (d == -1 && e) {
                if (f != "maincontent") {
                    open_panels.push(f)
                }
            }
        }
    }
    c.fn.panel = function(d) {
        if (a[d]) {
            return a[d].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof d === "object" || !d) {
                return a.init.apply(this, arguments)
            } else {
                c.error("Method " + d + " does not exist on jQuery.panel")
            }
        }
    }
})(jQuery);

function initPage(c) {
    var d = c.attr("id");
    if (d == "Applications") {
        var b = $(c).children(".page-contents").children("ul");
        var a = $(b).children("li");
        a.sort(function(f, e) {
            if (f.id == "LaunchApps") {
                return -1
            }
            if (e.id == "LaunchApps") {
                return 1
            }
            if (f.id == "InstalledApps" && e.id != "LaunchApps") {
                return -1
            }
            if (e.id == "InstalledApps" && f.id != "LaunchApps") {
                return 1
            }
            if (f.id == "eSFSettings" && e.id != "LaunchApps" && e.id != "InstalledApps") {
                return -1
            }
            if (e.id == "eSFSettings" && f.id != "LaunchApps" && f.id != "InstalledApps") {
                return 1
            }
            return $(f).text().toUpperCase().localeCompare($(e).text().toUpperCase())
        });
        $.each(a, function(e, f) {
            b.append(f)
        })
    }
}

function initTextInput(a) {
    var b = a.find("input");
    a.settingNode(b);
    initCommonTextInput(a, b)
}

function initTextArea(a) {
    var b = a.find("textarea");
    a.settingNode(b);
    stripExtraChars(a);
    initCommonTextInput(a, b)
}

function stripExtraChars(a) {
    var c = getSettingData(a);
    var d = a.find("textarea");
    var b = getNodeValue(a);
    if ((d !== undefined) && b != "" && b != c.val) {
        if ((c.val.indexOf("\r\n") == -1) && b.indexOf("\r\n") != -1) {
            d.val(b.replace("\r\n", ""))
        }
    }
}

function initCommonTextInput(elem, field) {
    calculateMaxDescWidth(elem);
    var data = getSettingData(elem);
    if (data.disabled) {
        field.disable()
    }
    var watermark = elem.data("watermark");
    if (watermark) {
        field.watermark(getRawTranslation(watermark))
    }
    elem.keyup(function() {
        var checkNodeFunc = "checkNode" + elem.attr("data-setting-type");
        if (eval("typeof " + checkNodeFunc) == typeof(Function)) {
            eval(checkNodeFunc + "(elem)")
        } else {
            checkIfNodeChanged(elem);
            checkIfNodeRequired(elem);
            updateButtonRow(elem)
        }
    });
    elem.focusin(function() {
        markTextValid(elem);
        var inputType = $(field).attr("type");
        if (inputType == "password") {
            $(field).val("");
            checkIfNodeChanged(elem);
            checkIfNodeRequired(elem);
            updateButtonRow(elem)
        }
    });
    elem.focusout(function() {
        var checkNodeFunc = "checkNode" + elem.attr("data-setting-type");
        if (eval("typeof " + checkNodeFunc) == typeof(Function)) {
            eval(checkNodeFunc + "(elem)")
        } else {
            checkTextInput(elem);
            updateButtonRow(elem)
        }
    });
    checkIfNodeChanged(elem)
}

function setTextInput(a, b) {
    a.find("input").val(b);
    checkTextInput(a);
    checkIfNodeChanged(a)
}

function getTextInput(b) {
    var a = (b.find("input")).attr("type");
    if (a == "password") {
        return b.find("input").val()
    } else {
        return b.find("input").val().trim()
    }
}

function checkTextInput(e) {
    var f = getSettingData(e);
    var d = true;
    if (f.fctVal == getNodeValue(e)) {
        d = true
    } else {
        if (f.regex && f.regex != "") {
            var c = new RegExp(f.regex);
            var g = getNodeValue(e);
            if (!c.test(g)) {
                d = false
            }
        }
        if (f.minlen && f.minlen > 0) {
            var b = getTextInput(e).length;
            var a = f.minlen;
            if (b && a > b) {
                d = false
            }
        }
    }
    if (d) {
        if (checkIfNodeRequired(e)) {
            markTextValid(e)
        }
    } else {
        markTextInvalid(e)
    }
    return d
}

function setTextArea(a, b) {
    a.find("textarea").val(b);
    checkTextArea(a);
    checkIfNodeChanged(a)
}

function getTextArea(a) {
    return a.find("textarea").val()
}

function checkTextArea(a) {
    return checkTextInput(a)
}

function markTextValid(c) {
    var a = c.find("input,textarea");
    var b = c.find(".invalid-message");
    setNodeState(c.find(".setting-node-input"), undefined, true);
    b.hide();
    updateButtonRow(c)
}

function markTextInvalid(c) {
    var a = c.find("input,textarea");
    var b = c.find(".invalid-message");
    if (c.find(".setting-node-input").find("invalid").length == 0) {
        setNodeState(c.find(".setting-node-input"), undefined, false)
    }
    b.show();
    updateButtonRow(c)
}

function initTextDisplay(b) {
    var c = b.find(".setting-node-textdisplay");
    var a = c.text();
    a = a.replace(/\r\n|\r|\n/g, "<br/>");
    c.html(a)
}

function setTextDisplay(a, b) {}

function getTextDisplay(a) {
    return stored_settings[a.data("setting")].val
}

function initNumericInput(c) {
    if (!$(c.parent()).is("td")) {
        calculateMaxDescWidth(c)
    }
    var h = c.find("input");
    c.settingNode(h);
    var n = c.data("setting");
    var b = getSetting(n, "decimalpoints");
    var g = getSetting(n, "fctVal");
    var f = getSetting(n, "val");
    if (h.val() === undefined) {
        var m = applyDecimalPointConversion(f, n);
        c.find(".setting-node-textdisplay").html(m)
    } else {
        h.val(applyDecimalPointConversion(mapRealToWidgetValue(c, h.val()), n))
    }
    var a = Number(getSetting(n, "start"));
    var d = Number(getSetting(n, "end"));
    var l = Number(getSetting(n, "step"));
    var e = function(s) {
        if (a != d) {
            var u = getNumericInput(c);
            var q = new RegExp("^-?[0-9]*\\.?[0-9]*$");
            var o = (u > d || u < a) && u != g;
            var r = !q.test(h.val());
            var p = !testIncrement(u, l);
            var t = false;
            if (s.altKey) {
                h.attr("value", u + "-");
                t = true;
                console.warn("Numeric Input error: We don't support alt+key combination in this numeric input.")
            }
            if (o || r || p || t) {
                setNodeState(h, undefined, false)
            } else {
                setNodeState(h, undefined, true)
            }
        }
        checkIfNodeChanged(c);
        checkIfNodeRequired(c);
        updateButtonRow(c)
    };
    var k = function(o) {
        var p = Number(h.val()).toFixed(b);
        if (!h.hasClass("invalid")) {
            h.attr("value", p)
        }
    };
    h.keyup(e);
    h.change(k)
}

function testIncrement(c, b) {
    if (b == undefined || isNaN(b)) {
        return true
    } else {
        var a = (c / b).toFixed(2) % 1;
        return a == 0
    }
}

function applyDecimalPointConversion(b, d) {
    var a = getSetting(d);
    if (a.decimalpoints > 0) {
        var c = Math.pow(10, a.decimalpoints);
        return (b / c).toFixed(a.decimalpoints)
    }
    return b
}

function setNumericInput(b, c) {
    var a = applyDecimalPointConversion(mapRealToWidgetValue(b, c), b.attr("data-setting"));
    b.find("input").val(a);
    b.find("input").trigger("keyup")
}

function getNumericInput(a) {
    var c = Number(a.find("input").val());
    var d = a.data("setting");
    var b = stored_settings[d].decimalpoints;
    if (b) {
        c = Math.round(c * Math.pow(10, b))
    }
    return c
}

function focusNumericInput(a) {
    var b = a.find("input");
    b.focus();
    b.select()
}

function initDropdownSetting(b) {
    var c = b.find("select.setting-node-input-dropdown");
    b.settingNode(c);
    if (b.parent().attr("id") == "ShortcutType") {
        var d = parseInt($.address.queryParams().tableEditId);
        var a = b.find("select");
        if ((d >= 0) && !isNaN(d)) {
            a.attr("disabled", "disabled")
        } else {
            setDropdownSetting(b, undefined);
            b.addClass("setting-changed");
            a.change(function() {
                loadEditPageFromType(a)
            })
        }
    }
}

function setDropdownSetting(b, d) {
    var a = b.find("select");
    if (d !== undefined) {
        var e = mapRealToWidgetValue(b, d);
        a.val(e);
        a.trigger("change")
    } else {
        var c = getShortcutTypeValue(b);
        if (c !== undefined) {
            a.val(c)
        } else {
            a.val(1)
        }
    }
}

function getDropdownSetting(c) {
    settingId = c.attr("data-setting");
    setting = getSetting(settingId);
    var d = getShortcutTypeValue(c);
    if (d !== undefined) {
        return d
    }
    if (setting.vallist.length == 1) {
        return setting.val
    } else {
        var a = c.find("select").val();
        if (a == null) {
            var b = c.find("option:selected").prop("disabled");
            if (b) {
                a = c.find("option:selected").val()
            }
        }
        return mapWidgetToRealValue(c, a)
    }
}

function markDropdownSetting(b, c) {
    var a = b.find("select");
    a.removeClass("conflict").removeClass("invalid");
    if (c == "conflict") {
        a.addClass("conflict")
    } else {
        if (c == "invalid") {
            a.addClass("invalid")
        }
    }
}

function initCheckbox(b) {
    var c = b.find("input.setting-node-input-checkbox");
    var a = getSetting(b.attr("data-setting")).val;
    if (mapRealToWidgetValue(b, a) == 1) {
        c.attr("checked", 1)
    } else {
        c.removeAttr("checked")
    }
    b.settingNode(c);
    calculateMaxDescWidth(b)
}

function setCheckbox(b, c) {
    var d = mapRealToWidgetValue(b, c);
    var a = b.find("input");
    if (d == "1") {
        a.attr("checked", 1)
    } else {
        a.removeAttr("checked")
    }
    a.trigger("change")
}

function getCheckbox(a) {
    return mapWidgetToRealValue(a, (a.find("input").is(":checked") ? "1" : "0"))
}

function markCheckbox(b, c) {
    var a = b.find("input");
    a.removeClass("conflict").removeClass("invalid");
    if (c == "conflict") {
        a.addClass("conflict")
    } else {
        if (c == "invalid") {
            a.addClass("invalid")
        }
    }
}

function initSlider(f) {
    var a = f.find(".slider");
    var k = f.attr("data-setting");
    var d = parseInt(a.attr("data-value"));
    var g = parseInt(a.attr("data-min"));
    var h = parseInt(a.attr("data-max"));
    var e = parseInt(a.attr("data-step"));
    var c = getValueMap(f);
    a.slider({
        value: mapRealToWidgetValue(f, d, c),
        min: g,
        max: h,
        step: e,
        slide: function(l, m) {
            f.find(".slider-value").text(mapRealToWidgetValue(f, m.value, c));
            a.attr("data-value", mapRealToWidgetValue(f, m.value, c))
        },
        change: function(l, m) {
            checkIfNodeChanged(f);
            updateButtonRow(f)
        }
    });
    f.find(".slider-value").text(mapRealToWidgetValue(f, d, c));
    a.attr("data-value", mapRealToWidgetValue(f, d, c));
    var b = a.attr("tabindex");
    a.removeAttr("tabindex");
    a.find("a").attr("tabindex", b);
    f.settingNode(a)
}

function setSlider(b, c) {
    var a = b.find(".slider");
    var d = getValueMap(b);
    a.slider("value", mapRealToWidgetValue(b, c, d));
    b.find(".slider-value").text(mapRealToWidgetValue(b, c, d));
    a.trigger("slidechange")
}

function getSlider(a) {
    return a.find(".slider").slider("value")
}

function focusSlider(a) {
    a.find(".ui-slider-handle").focus()
}

function initRangeSlider(c) {
    var a = c.find(".slider");
    var h = getNodeName(c);
    var f = undefined;
    var d = undefined;
    var g = undefined;
    var b = undefined;
    var k = undefined;
    f = getSetting(c.attr("data-setting"));
    if (f == undefined) {
        f = getNodeData(h)
    }
    if (f == undefined) {
        console.error("RangeSlider Error: No data source found");
        return
    }
    d = parseInt(f.start);
    g = parseInt(f.end);
    b = parseInt(f.step);
    k = f.values.slice(0);
    if (k == undefined) {
        k = [d, g]
    }
    if (isNaN(d) || isNaN(g) || isNaN(b)) {
        console.error("RangeSlider Error: min, max, or step is not defined");
        return
    }
    a.slider({
        range: true,
        values: k,
        min: d,
        max: g,
        step: b,
        slide: function(l, m) {
            return e(m)
        },
        change: function(l, m) {
            checkIfNodeChanged(c);
            updateButtonRow(c);
            e(m)
        }
    });

    function e(n) {
        if (h == "UsageThresholds") {
            var l = false;
            var m = n.values.slice(0);
            if (m[0] == m[1]) {
                if (n.handle.nextSibling == null) {
                    m[1] = m[0] + 2
                } else {
                    m[0] = m[1] - 2
                }
                setNodeValue(c, m)
            } else {
                if (m[0] == d) {
                    m[0] += 2;
                    setNodeValue(c, m)
                } else {
                    if (m[1] == g) {
                        m[1] -= 1;
                        setNodeValue(c, m)
                    } else {
                        l = true
                    }
                }
            }
            updateValueHolders(c);
            return l
        }
        return true
    }
    $(a.find(".ui-slider-range")[0]).remove();
    updateValueHolders(c)
}

function updateValueHolders(f) {
    if (getNodeName(f) == "UsageThresholds") {
        var e = f.find(".slider");
        var d = e.slider("option", "min");
        var a = e.slider("option", "max");
        var c = getNodeValue(f);
        var b = f.parent().find(".tier-values");
        $(b.find("#tier1_value")).find("#value_holder").html(d + "% - " + (c[0] - 1) + "%");
        $(b.find("#tier2_value")).find("#value_holder").html(c[0] + "% - " + (c[1] - 1) + "%");
        $(b.find("#tier3_value")).find("#value_holder").html(c[1] + "% - " + a + "%")
    }
}

function setRangeSlider(c, a) {
    var b = c.find(".slider");
    b.slider("values", 0, a[0]);
    b.slider("values", 1, a[1]);
    b.trigger("slidechange")
}

function getRangeSlider(a) {
    return a.find(".slider").slider("values")
}

function focusRangeSlider(a) {
    a.find(".ui-slider-handle").focus()
}

function updateFileUpload() {
    var f = $(this).attr("accept");
    var s = $(this).attr("maxfilesize");
    var q = $(this).attr("maxfilesizeunit");
    if (this.files[0] == undefined) {
        return
    }
    if (s != "" && s != undefined) {
        var e = this.files[0].size;
        if (q == "MB") {
            s = s * 1024 * 1024
        } else {
            if (q == undefined) {
                e = e / 1024
            }
        }
        if (e > s) {
            displayResultPopup($(this), 0, getRawTranslation("TXT_MAXIMUM_FILE_SIZE_EXCEEDED"));
            this.form.reset();
            var a = "#" + $(this).attr("for");
            $(a).val("");
            return
        }
    }
    if ((f != "") && (f != undefined)) {
        var h = false;
        var t = this.files[0].type;
        var p = this.files[0].name;
        var k = p.substring(p.lastIndexOf("."));
        var d = k.toLowerCase();
        var n = f.split(",");
        for (var r = 0; r < n.length; r++) {
            var m = n[r];
            if ((t != "") && (m.search("/") >= 0)) {
                if (m == t) {
                    h = true;
                    break
                }
            } else {
                var u = m.search(d);
                if (u >= 0) {
                    h = true;
                    break
                }
            }
        }
        if (!h) {
            var c = new Dropdown($(this).closest(".optionsList"), "dropdown", "slide");
            c.hideDropdown();
            $(this).val("");
            showModalErrorMessage(getRawTranslation("TXT_PRINTER_INVALID_FILE_FORMAT"));
            return
        }
        if (d == ".csv") {
            $(this).parent("form").attr("action", $(this).parent("form").attr("csv-handler"))
        } else {
            if (d == ".ucf") {
                $(this).parent("form").attr("action", $(this).parent("form").attr("ucf-handler"))
            } else {
                $(this).parent("form").attr("action", $(this).parent("form").attr("vcc-handler"))
            }
        }
    }
    var v = "#" + $(this).attr("for");
    var l = $(this).val();
    var o = l.lastIndexOf("\\");
    var g = l.lastIndexOf("/");
    var b = Math.max(o, g) + 1;
    var p = l.slice(b);
    $(v).val(p);
    checkIfFileUploadChanged($(this));
    updateButtonRow($(v))
}

function showModalErrorMessage(a) {
    $(".popup-modal-container").popup({
        messageText: a,
        buttonOneId: "TXT_OK",
        icon: "/images/Error_Icon_68x68.png",
        showCloseButton: false
    })
}

function checkIfFileUploadChanged(c) {
    var e = ($(c).attr("id").split("_"))[1];
    var d = getNodeValue(c.parents("[data-setting-type]"));
    var b = (d != "");
    if (e == "VCCBUNDLE") {
        var a = $("#import_VCCBUNDLE");
        if (b) {
            a.removeAttr("disabled")
        } else {
            a.attr("disabled", "disabled")
        }
        return
    }
    if (b && !c.hasClass("setting-changed")) {
        c.addClass("setting-changed");
        updateExternalCallbackList(c.parent().attr("data-callback"), c.attr("data-setting"), 1)
    } else {
        if (!b && c.hasClass("setting-changed")) {
            c.removeClass("setting-changed");
            updateExternalCallbackList(c.parent().attr("data-callback"), c.attr("data-setting"), 0)
        }
    }
}

function initFileUploadSetting(b) {
    var c = b.attr("data-setting");
    if (c == "") {
        return
    }
    var a = b.find("#setting_" + c);
    a.click(updateFileUpload);
    a.change(updateFileUpload);
    b.find("#browseUPLOAD_FW").click(function() {
        a.trigger("click")
    })
}

function getFileInput(a) {
    return a.find(".fakefile input").val()
}

function setFileInput(a, b) {
    a.find(".hidden-file-input").each(function() {
        this.form.reset();
        $(this).removeClass("setting-changed");
        this.upload = a.find(".hidden-file-input").first();
        this.upload.removeClass("setting-changed");
        var c = "#" + this.upload.attr("for");
        $(c).val("")
    })
}

function initSpinnerSetting(b) {
    var c = b.find(".left");
    var a = b.find(".right");
    c.click(function() {
        if ($(":animated").length) {
            return
        }
        var f = $(this).siblings(".spinnerText");
        var d = f.find(".optionText[selected]");
        var e = d.prev();
        d.hide();
        d.removeAttr("selected");
        if (e.length == 0) {
            e = f.find(".optionText").last()
        }
        e.show();
        e.attr("selected", "1");
        updateSpinner(b)
    });
    a.click(function() {
        if ($(":animated").length) {
            return
        }
        var f = $(this).siblings(".spinnerText");
        var e = f.find(".optionText[selected]");
        var d = e.next();
        e.hide();
        e.removeAttr("selected");
        if (d.length == 0) {
            d = f.find(".optionText").first()
        }
        d.show();
        d.attr("selected", "1");
        updateSpinner(b)
    })
}

function updateSpinner(a) {
    checkIfNodeChanged(a);
    updateButtonRow(a)
}

function setSpinnerSetting(a, b) {}

function getSpinnerSetting(a) {
    return a.find(".optionText[selected]").attr("data-value")
}

function initListSetting(a) {
    a.find(".radioOption").click(function() {
        $(".radioOption[selected]").removeAttr("selected");
        $(this).attr("selected", 1)
    })
}

function setListSetting(a, b) {}

function getListSetting(a) {
    return $(".radioOption[selected]").attr("data-value")
}(function(b) {
    var a = {
        init: function(c) {
            var g = this;
            var l = (c.showCloseButton !== undefined) ? c.showCloseButton : true;
            var e = b("<div></div>").addClass("popup-overlay");
            this.append(e);
            var k = b("<div></div>").addClass("popup");
            if (c.messageText === undefined) {
                k.attr("style", "visibility: hidden")
            }
            k.append(b("<div class='setting-saved-message'><div class='setting-saved-spinner'></div><div class='setting-saved-message-text'></div></div>"));
            if (l) {
                k.append(b("<div></div>").addClass("popup-close").click(function() {
                    g.popup("hide");
                    g.popup("buttonPressed", -1)
                }))
            }
            if (c.icon !== undefined) {
                k.append(b("<div></div>").addClass("popup-icon").append(b("<img src='" + c.icon + "' />")))
            }
            var h = (c.messageText) ? c.messageText : "";
            k.append(b("<div></div>").addClass("popup-text").html(h));
            var d = "popup-1";
            if (c.buttonTwoId != undefined) {
                if (c.buttonThreeId != undefined) {
                    d = "popup-3"
                } else {
                    d = "popup-2"
                }
            } else {
                if (c.buttonTwoText != undefined) {
                    d = "popup-2"
                }
            }
            if (c.buttonOneId != undefined) {
                var f = b("<div></div>").addClass("popup-buttonrow");
                f.append(b("<button></button>").addClass("squared popup-button popup1 " + d).text(getRawTranslation(c.buttonOneId)).click(function() {
                    g.popup("buttonPressed", 1)
                }));
                if (c.buttonTwoId != undefined) {
                    f.append(b("<button></button>").addClass("squared popup-button popup2 " + d).text(getRawTranslation(c.buttonTwoId)).click(function() {
                        g.popup("buttonPressed", 2)
                    }));
                    if (c.buttonThreeId != undefined) {
                        f.append(b("<button></button>").addClass("squared popup-button popup3 " + d).text(getRawTranslation(c.buttonThreeId)).click(function() {
                            g.popup("buttonPressed", 3)
                        }))
                    }
                }
                k.append(f)
            } else {
                if (c.buttonOneText != undefined) {
                    var f = b("<div></div>").addClass("popup-buttonrow");
                    f.append(b("<button></button>").addClass("squared popup-button popup1 " + d).text(c.buttonOneText).click(function() {
                        g.popup("buttonPressed", 1)
                    }));
                    if (c.buttonTwoText != undefined) {
                        f.append(b("<button></button>").addClass("squared popup-button popup2 " + d).text(c.buttonTwoText).click(function() {
                            g.popup("buttonPressed", 2)
                        }))
                    }
                    k.append(f)
                }
            }
            b("body").append(k);
            this.popup("adjustPosition", k);
            this.popup("setFocusOnButton", k);
            this.popup("handleTabNavigation", k);
            this.data("popup", b.extend({
                popupElem: k,
                overlay: e,
                autoHide: true,
                showCloseButton: l
            }, c));
            return this
        },
        handleTabNavigation: function(e) {
            var d = b(e).find("button");
            var f = d.first();
            var c = d.last();
            f.focus();
            c.on("keydown", function(g) {
                if ((g.which === 9 && !g.shiftKey)) {
                    g.preventDefault();
                    f.focus()
                }
            });
            f.on("keydown", function(g) {
                if ((g.which === 9 && g.shiftKey)) {
                    g.preventDefault();
                    c.focus()
                }
            })
        },
        setFocusOnButton: function(c) {
            if (c.find(".popup1") != undefined) {
                c.find(".popup1").focus()
            } else {
                if (c.find(".popup2") != undefined) {
                    c.find(".popup2").focus()
                } else {
                    if (c.find(".popup3") != undefined) {
                        c.find(".popup3").focus()
                    } else {
                        console.log("Popup: setFocusOnButton failed.")
                    }
                }
            }
        },
        adjustPosition: function(d) {
            var c = b(window).height();
            if (c < 200) {
                c = 200
            }
            if (c < (d.outerHeight() + 30)) {
                var e = d.css("padding-top");
                e = e.substring(0, e.indexOf("px"));
                e *= 2;
                d.css("max-height", (c - 32 - e) + "px");
                d.find(".popup-text").css("max-height", (c - 90 - e) + "px")
            }
            centerWithinWindow(d)
        },
        buttonPressed: function(c) {
            if (this.data("popup").autoHide) {
                a.hide.call(this)
            }
            if (c == 1 && this.data("popup").buttonOneCallback != undefined) {
                this.data("popup").buttonOneCallback()
            }
            if (c == 2 && this.data("popup").buttonTwoCallback != undefined) {
                this.data("popup").buttonTwoCallback()
            }
            if (c == 3 && this.data("popup").buttonThreeCallback != undefined) {
                this.data("popup").buttonThreeCallback()
            }
            if (c == -1 && this.data("popup").buttonCloseCallback != undefined) {
                this.data("popup").buttonCloseCallback()
            }
            return this
        },
        hide: function() {
            this.popup("stopSpinner");
            this.data("popup").popupElem.remove();
            this.data("popup").overlay.remove();
            return this
        },
        setText: function(c) {
            this.data("popup").popupElem.find(".popup-text").html(c);
            this.popup("adjustPosition", this.data("popup").popupElem);
            return this
        },
        setDiskEncryptionPopup: function() {
            var c = this.data("popup").popupElem.find(".popup-text");
            c.css("max-width", "570px");
            this.popup("adjustPosition", this.data("popup").popupElem);
            return this
        },
        setPopupSizeLimit: function() {
            var c = this.data("popup").popupElem.find(".popup-text");
            c.css("max-width", "600px");
            c.css("max-height", "500px");
            this.popup("adjustPosition", this.data("popup").popupElem);
            return this
        },
        getParent: function() {
            return this.data("popup").parent
        },
        setTimeout: function(c) {
            this.data("popup").timeout = c;
            return this
        },
        getTimeout: function() {
            return this.data("popup").timeout
        },
        startSpinner: function() {
            if (this.data("popup").spinnerHandle === undefined) {
                this.data("popup").spinnerHandle = startSpinnerBlock(this.data("popup").popupElem)
            }
            return this
        },
        stopSpinner: function() {
            if (this.data("popup").spinnerHandle !== undefined) {
                hideSpinnerBlock(this.data("popup").popupElem, this.data("popup").spinnerHandle);
                this.data("popup").spinnerHandle = undefined
            }
            return this
        }
    };
    b.fn.popup = function(c) {
        if (a[c]) {
            return a[c].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof c === "object" || !c) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + c + " does not exist on jQuery.messagePopup")
            }
        }
    }
})(jQuery);

function resetSettingLink(b) {
    settingId = b.attr("data-setting");
    setting = getSetting(settingId);
    var a;
    if (setting.vallist) {
        for (i in setting.vallist) {
            var c = setting.vallist[i];
            if (c.val == Number(setting.val)) {
                a = c.str;
                break
            }
        }
    } else {
        if (setting.decimalpoints > 0) {
            a = applyDecimalPointConversion(setting.val, settingId)
        } else {
            a = setting.val
        }
    }
    b.find(".settingLinkText span").last().text(a)
}

function getSettingLink(a) {}
Communicator.prototype = new Communicator();
Communicator.prototype.constructor = Communicator;

function Communicator() {
    this.successHandlers = new Array();
    this.errorHandlers = new Array();
    this.completeHandlers = new Array();
    this.async = true
}
Communicator.prototype.setAsync = function(a) {
    this.async = a
};
Communicator.prototype.post = function(a, c, b) {
    this.sendData(a, "POST", b, "json", c)
};
Communicator.prototype.postJson = function(a, c, b) {
    this.sendData(a, "POST", b, "json", c, "application/json; charset=utf-8")
};
Communicator.prototype.sendData = function(b, h, c, a, f, g, e) {
    var d = this;
    if (c == undefined) {
        c = this
    }
    if (g == undefined) {
        g = "application/x-www-form-urlencoded; charset=utf-8"
    }
    if (e == undefined) {
        e = 360000
    }
    if ($.cookies.get("lang") !== null && $.cookies.get("lang").length > 0) {
        f.lang = $.cookies.get("lang")
    }
    $.ajax({
        url: b,
        data: f,
        context: c,
        type: h,
        dataType: a,
        contentType: g,
        async: d.async,
        timeout: e,
        success: function(k) {
            validateExistingSession(k);
            d.callSuccessHandlers(k)
        },
        error: function(k) {
            d.callErrorHandlers(k)
        },
        complete: function(k) {
            d.callCompleteHandlers(k)
        }
    })
};
Communicator.prototype.addSuccessHandler = function(a) {
    this.successHandlers.push(a)
};
Communicator.prototype.addErrorHandler = function(a) {
    this.errorHandlers.push(a)
};
Communicator.prototype.addCompleteHandler = function(a) {
    this.completeHandlers.push(a)
};
Communicator.prototype.clearSuccessHandlers = function() {
    this.successHandlers.length = 0
};
Communicator.prototype.clearErrorHandlers = function() {
    this.errorHandlers.length = 0
};
Communicator.prototype.clearCompleteHandlers = function() {
    this.completeHandlers.length = 0
};
Communicator.prototype.callSuccessHandlers = function(b) {
    for (var a = 0; a < this.successHandlers.length; a++) {
        this.successHandlers[a].call(this, b)
    }
};
Communicator.prototype.callErrorHandlers = function(b) {
    for (var a = 0; a < this.errorHandlers.length; a++) {
        this.errorHandlers[a].call(this, b)
    }
};
Communicator.prototype.callCompleteHandlers = function(b) {
    for (var a = 0; a < this.completeHandlers.length; a++) {
        this.completeHandlers[a].call(this, b)
    }
};

function navigateToUrl(a) {
    if (a !== undefined) {
        if (a.url != undefined && a.url.length > 0) {
            navigate_to(a.url, undefined, {
                force: true
            })
        }
    }
}

function navigate_to(c, b, a) {
    if (b !== undefined) {
        b.preventDefault()
    }
    if (a === undefined) {
        a = {}
    }
    a = $.extend({
        force: false,
        preserve: false,
        params: {}
    }, a);
    if (!a.force && $(".setting-changed").not(":disabled, :hidden, [data-control-disabled]").length > 0) {
        do_change_popup(c, a)
    } else {
        do_nav(c, a)
    }
}

function do_change_popup(b, a) {
    $(".popup-modal-container").popup({
        messageText: getRawTranslation("TXT_POPUP_UNSAVED_CHANGES"),
        buttonOneId: "TXT_REVIEW_CHANGES",
        buttonTwoId: "TXT_DISCARD_CHANGES",
        buttonTwoCallback: function() {
            do_nav(b, a)
        },
        showCloseButton: true
    })
}

function do_nav(b, a) {
    b = correctPath(b);
    if (a.preserve) {
        if (Object.size(a.params) == 0) {
            $.address.path(b)
        } else {
            $.address.autoUpdate(false);
            $.address.path(b);
            $.each(a.params, function(c, d) {
                $.address.parameter(c, d)
            });
            $.address.update();
            $.address.autoUpdate(true)
        }
    } else {
        if (Object.size(a.params) == 0) {
            $.address.value(b)
        } else {
            $.address.autoUpdate(false);
            $.address.value(b);
            $.each(a.params, function(c, d) {
                $.address.parameter(c, d)
            });
            $.address.update();
            $.address.autoUpdate(true)
        }
    }
}

function correctPath(a) {
    if (a.charAt(0) == "#") {
        a = a.slice(1)
    }
    if (a.charAt(0) == "/") {
        a = a.slice(1)
    }
    return a
}(function(a) {
    a.keys = new function(b) {
        this.BACKSPACE = 8;
        this.TAB = 9;
        this.ENTER = 13;
        this.SHIFT = 16;
        this.CONTROL = 17;
        this.CAPS_LOCK = 20;
        this.ESCAPE = 27;
        this.SPACE = 32;
        this.PAGE_UP = 33;
        this.PAGE_DOWN = 34;
        this.END = 35;
        this.HOME = 36;
        this.LEFT = 37;
        this.UP = 38;
        this.RIGHT = 39;
        this.DOWN = 40;
        this.INSERT = 45;
        this.DELETE = 46;
        this.NUMPAD_MULTIPLY = 106;
        this.NUMPAD_ADD = 107;
        this.NUMPAD_ENTER = 108;
        this.NUMPAD_SUBTRACT = 109;
        this.NUMPAD_DECIMAL = 110;
        this.NUMPAD_DIVIDE = 111;
        this.COMMA = 188;
        this.PERIOD = 190
    }
})(jQuery);
(function(b) {
    var a = {
        init: function(e) {
            var g = {
                min: undefined,
                max: undefined
            };
            var e = b.extend(g, e);
            return this.each(function() {
                var h = b(this);
                h.keydown(function(k) {
                    c(k, h)
                })
            });

            function c(m, l) {
                if ((m.which == b.keys.BACKSPACE) || (m.which == b.keys.ENTER) || (m.which == b.keys.RIGHT) || (m.which == b.keys.LEFT) || (m.which == b.keys.DELETE) || (m.which == b.keys.HOME) || (m.which == b.keys.END) || (m.which == b.keys.TAB)) {
                    return
                } else {
                    if ((m.which >= 48 && m.which <= 57) || (m.which >= 96 && m.which <= 105)) {
                        var n = m.keyCode <= 57 ? m.keyCode - 48 : m.keyCode - 96;
                        var o = f(l);
                        var k = d(l);
                        if ((o == 0) && (n == 0)) {
                            m.preventDefault()
                        } else {
                            var h = l.val();
                            h = parseInt(h.substring(0, o) + n + h.substring(k));
                            if ((e.min != undefined) && (h < e.min)) {
                                m.preventDefault()
                            } else {
                                if ((e.max != undefined) && (h > e.max)) {
                                    m.preventDefault()
                                } else {
                                    return
                                }
                            }
                        }
                    } else {
                        m.preventDefault()
                    }
                }
            }

            function f(m) {
                var l = m.get(0);
                var n = 0;
                if ("selectionStart" in l) {
                    n = l.selectionStart
                } else {
                    if ("selection" in document) {
                        l.focus();
                        var h = document.selection.createRange();
                        var k = document.selection.createRange().text.length;
                        h.moveStart("character", -l.value.length);
                        n = h.text.length - k
                    }
                }
                return n
            }

            function d(l) {
                var k = l.get(0);
                var m = 0;
                if ("selectionEnd" in k) {
                    m = k.selectionEnd
                } else {
                    if ("selection" in document) {
                        k.focus();
                        var h = document.selection.createRange();
                        h.moveStart("character", -k.value.length);
                        m = h.text.length
                    }
                }
                return m
            }
        }
    };
    b.fn.numeric = function(c) {
        if (a[c]) {
            return a[c].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof c === "object" || !c) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + c + " does not exist on jQuery.table")
            }
        }
    }
})(jQuery);
RowContainer.prototype = new Component();
RowContainer.prototype.constructor = RowContainer;
RowContainer.superclass = Component.prototype;

function RowContainer(c, d, a, b) {
    Component.call(this, c, d);
    if (c == undefined) {
        return
    }
    this.savedState;
    this.removeElement = a;
    this.changeCallbacks = [];
    this.enableCallbacks = true;
    if (b != undefined) {
        this.removeButtonRight = b
    } else {
        this.removeButtonRight = true
    }
}
RowContainer.prototype.addChangeCallback = function(a, b) {
    this.changeCallbacks.push({
        f: a,
        d: b
    })
};
RowContainer.prototype.clearChangeCallbacks = function() {
    this.changeCallbacks = []
};
RowContainer.prototype.triggerChangeCallbacks = function(a) {
    if (this.enableCallbacks) {
        $.each(this.changeCallbacks, function(b, c) {
            c.f(a, c.d)
        })
    }
};
RowContainer.prototype.addBlankRow = function() {
    var a = this.buildRow();
    this.elem.append(a);
    this.triggerChangeCallbacks(a)
};
RowContainer.prototype.saveState = function() {
    console.error("NOT GOOD: CALLED BACK TO TOPLEVEL ROWCONTAINER.SAVESTATE...")
};
RowContainer.prototype.restoreState = function() {
    console.error("NOT GOOD: CALLED BACK TO TOPLEVEL ROWCONTAINER.RESTORESTATE...")
};
RowContainer.prototype.getTabIndex = function() {
    console.error("NOT GOOD: CALLED BACK TO TOPLEVEL ROWCONTAINER.GETTABINDEX...")
};
RowContainer.prototype.clearAll = function() {
    this.elem.find("." + this.baseclass + "-row").remove();
    this.triggerChangeCallbacks()
};
RowContainer.prototype.buildRow = function(d) {
    var c = this;
    var a = $("<tr></tr>").addClass(this.baseclass + "-row").change(function() {
        c.triggerChangeCallbacks(a)
    });
    var b = $("<td></td>").append($(this.removeElement).addClass(this.baseclass + "-remove-button")).click(function() {
        $(a).trigger("modified");
        $(a).attr("data-deleted", "1");
        c.triggerChangeCallbacks(a);
        a.remove()
    });
    if (this.removeButtonRight) {
        this.populateRow(a);
        a.append(b)
    } else {
        a.append(b);
        this.populateRow(a)
    }
    return a
};
RowContainer.prototype.setEnabled = function(a) {
    RowContainer.superclass.setEnabled.call(this, a)
};

function initListSetting(a) {
    a.find(".radioOption").click(function() {
        $(".radioOption[selected]").removeAttr("selected");
        $(this).attr("selected", 1);
        checkIfNodeChanged(a)
    })
}

function setListSetting(a, b) {}

function getListSetting(a) {
    return $(".radioOption[selected]").attr("data-value")
}

function initStrikethroughList(c) {
    var a = {};
    a.type = "strikethrough";
    c.list(a);
    if (c.data("searchable")) {
        var b = {};
        b.type = "live";
        b.target = c;
        b.selectFunc = function(d) {
            c.list("addRow", c.find("ul.list"), d)
        };
        $(c.find(".liveSearch")).search(b)
    }
}

function resetList(a) {
    a.list("reset")
}

function initCheckboxList(b) {
    var c = b.attr("data-edit");
    var a = {};
    a.type = "checkbox";
    if (b.find("button.showgroupadd").length > 0) {
        b.attr("data-real-root", b.closest(".page").data("node"))
    }
    b.list(a);
    b.find("button.add").click(function(d) {
        navigate_to(c, d, {
            params: {
                tableEditId: "new"
            }
        })
    });
    b.find("button.showgroupadd").click(function() {
        $(".popup-modal-container").modalPopup("display", b.attr("data-edit"), {
            ignoreParams: true
        })
    })
}

function initNetworkSecurityList(b) {
    var a = {};
    a.type = "networksecurity";
    b.list(a)
}

function initSolutionsSecurityList(b) {
    var a = {};
    a.type = "solutionssecurity";
    b.list(a)
}

function getStrikethroughList(a) {
    return getList(a)
}

function getList(b, a) {
    var c = b.list("getData", a);
    return c
}(function(e) {
    var a = {
        init: function(l) {
            var l = e.extend({
                type: "basic"
            }, l);
            openCategories = [];
            var n = this;
            var o = n.attr("data-setting");
            var m = getSetting(o);
            var k = false;
            var h = n.find("li.format").html();
            var g = n.find(".prevPage").length > 0;
            this.data("list", {
                target: n,
                options: l,
                format: h,
                paging: g,
                selected: [],
                deleted: []
            });
            n.find("ul").empty();
            n.bind("refresh", function() {
                a.refresh.call(n)
            });
            a.update.apply(this);
            return this
        },
        getParams: function(h) {
            var o = h.attr("data-setting");
            var p = getSetting(o);
            var r = h.data("list").options;
            var g = p.data.length;
            var n = p.offset;
            var q = p.search;
            var m = e.address.queryParam("selectedItems");
            var k = {
                offset: n,
                length: g,
                selectedItems: m,
                search: q
            };
            var l = e.address.queryParam("tableEditId");
            if (l != "") {
                k.tableEditId = l
            }
            if (h.data("real-root") !== undefined) {
                k.realRoot = h.data("real-root")
            }
            return k
        },
        reload: function(h) {
            var g = h.attr("data-refresh");
            var l = a.getParams(h);
            var k = new ContentHandler();
            k.addSuccessHandler(function() {
                a.update.apply(h)
            });
            k.loadContent(g, l)
        },
        reset: function() {
            this.data("list").selected = [];
            this.data("list").deleted = [];
            a.clearList.apply(this);
            a.update.apply(this);
            clearSettingChanged(this);
            updateButtonRow(this)
        },
        refresh: function() {
            a.clearList.apply(this);
            a.update.apply(this)
        },
        updateData: function(g) {
            a.updateInternal(this, g);
            this.addClass("setting-changed");
            updateButtonRow(this)
        },
        update: function() {
            var h = this.data("setting");
            var g = getSetting(h);
            a.updateInternal(this, g)
        },
        updateInternal: function(h, u) {
            var v = h.data("list").options;
            var k = h.data("columns");
            var l = a.getParams(h);
            h.find("ul").empty();
            if (u.data) {
                a.updatePageButtons(u);
                if (u.headers && u.headers.length > 0) {
                    for (var o = 0; o < u.headers.length; o++) {
                        var p = u.headers[o];
                        var r = e("<div></div>").addClass("listCategory");
                        var n = e('<span class="header"></span>').text(getRawTranslation(p.id));
                        var q = e("<div></div>").addClass("content");
                        r.append('<span class="icon"></span>');
                        r.append('<input type="checkbox"></input>');
                        r.append(n);
                        r.append(q);
                        for (var m = 0; m < u.data.length; m++) {
                            var s = u.data[m];
                            if (s.category == p.category) {
                                a.addRow.call(h, q, s)
                            }
                        }
                        h.find("ul").append(r)
                    }
                    b(h)
                } else {
                    if (u.data.length <= 0) {
                        h.find(".listHolder").find(".pagingContainer").hide()
                    } else {
                        for (var o = 0; o < u.data.length;) {
                            if (k > 1) {
                                var t = e("<div></div>");
                                for (m = 0;
                                    (m < k) && u.data[o]; m++) {
                                    a.addRow.call(h, t, u.data[o]);
                                    o++
                                }
                                t.find("li").css("display", "inline-block");
                                t.find("span").css("width", "160");
                                h.find("ul").append(t)
                            } else {
                                a.addRow.call(h, h.find("ul"), u.data[o]);
                                o++
                            }
                        }
                    }
                }
            }
            var g = h.attr("data-max-items-per-page");
            h.find(".nextPage").unbind("click").click(function() {
                if (e(this).attr("disabled") === undefined) {
                    u.offset += u.data.length;
                    a.reload(h)
                }
            });
            h.find(".prevPage").unbind("click").click(function() {
                if (e(this).attr("disabled") === undefined) {
                    u.data.length = g;
                    u.offset -= u.data.length;
                    a.reload(h)
                }
            });
            a.updateCurPageInfo(h, u);
            if (l.selectedItems) {
                h.addClass("setting-changed")
            }
            updateButtonRow(h);
            return this
        },
        addRow: function(r, E) {
            var B = this;
            var l = this.data("list").options;
            var A = this.data("list").format;
            var q = formatString(A, E);
            var m = e("<li></li>");
            m.attr("data-id", E.id);
            if (E.disabled) {
                m.disable()
            }
            if (l.type == "strikethrough") {
                m.append('<a class="remove"><img src="/images/delete_x_8x7.png" /></a>');
                q = e('<div class="stringList-container-text"></div>').append(q);
                listItem = e("<span></span>").html(q);
                m.append(listItem);
                if (!E.disabled) {
                    m.find(".remove").click(function() {
                        var F = e(this).parent("li");
                        F.hasClass("removed") ? F.removeClass("removed") : F.addClass("removed")
                    })
                }
                B.addClass("setting-changed");
                updateButtonRow(B)
            } else {
                if (l.type == "checkbox") {
                    m.addClass("checkListItem");
                    var C = this.data("setting");
                    var x = getSetting(C);
                    if (x.id == "BOOKMARKS_LIST" || x.id == "FOLDER_CONTENTS_LIST") {
                        var n = B.attr("data-edit");
                        var t = Boolean(B.attr("data-read-only"));
                        var z = Boolean(E.childLevel <= 0);
                        B.parent().find(".list").css("margin", "0px");
                        m.attr("id", "checkListItemColored");
                        if (t == false) {
                            m.append('<input type="checkbox" name="' + E.name + '" childrenCount="' + E.childrenCount + '" ></input>')
                        }
                        m.append('<img class="bookmarkIcon" src=' + E.iconFileName + " />");
                        var g;
                        var u = 5;
                        var k = 16;
                        if (x.id == "FOLDER_CONTENTS_LIST") {
                            var o = parseInt(e.address.queryParams().childLevel);
                            g = (k + u) * (E.childLevel - o)
                        } else {
                            g = (k + u) * E.childLevel
                        }
                        m.find("img").css("padding-left", g + "px");
                        if (E.editUrl != undefined) {
                            n = n.replace("EditBookmark", E.editUrl)
                        }
                        m.find("img").click(function() {
                            if (t || z) {
                                return false
                            }
                            f(n, E.text, E.name, E.childLevel)
                        });
                        listItem = e("<a class='checkListItemClickable'></a>").text(E.text).click(function(F) {
                            if (t || z) {
                                return false
                            }
                            f(n, E.text, E.name, E.childLevel)
                        });
                        if (t || z) {
                            m.find("img").css("cursor", "default");
                            listItem.css("cursor", "default");
                            if (t) {
                                m.css("padding", "0px")
                            }
                        }
                    } else {
                        m.append('<input type="checkbox" ></input>');
                        listItem = e("<span></span>").html(q)
                    }
                    m.append(listItem);
                    var w = (E.checked || E.assigned);
                    var D = B.data("list").deleted.indexOf(E.id) != -1;
                    var h = B.data("list").selected.indexOf(E.id) != -1;
                    if ((w && !D) || h || E.is_all_users_group) {
                        m.find("input").attr("checked", 1)
                    }
                    if (E.disabled) {
                        m.find("input").attr("disabled", 1)
                    }
                    m.find("input").click(function() {
                        var H = B.data("list").selected;
                        var F = B.data("list").deleted;
                        if (x.id == "BOOKMARKS_LIST") {
                            a.checkChildrenRows(this);
                            updateTopButtonRow(B)
                        }
                        if (e(this).is(":checked")) {
                            var G = F.indexOf(E.id);
                            G == -1 ? H.push(E.id) : F.splice(G, 1)
                        } else {
                            var G = H.indexOf(E.id);
                            G == -1 ? F.push(E.id) : H.splice(G, 1)
                        }
                        if (saveAndResetElementsExists(B)) {
                            B.addClass("setting-changed");
                            updateButtonRow(B)
                        }
                    })
                } else {
                    if (l.type == "networksecurity") {
                        m.addClass("networkSecurityListItem");
                        var s = e("<span class='setupName'></span>");
                        var v = e("<span class='permissionLink'></span>");
                        var y = "";
                        if (E.login_type == "LDAP") {
                            var p = "Settings/Security/LdapSetup";
                            if (isThisLdapActiveDirectory(E.id)) {
                                p = "Settings/Security/LdapActiveDirectory"
                            }
                            s.append(e("<a class='link' href='#/" + p + "?tableEditId=" + E.id + "'></a>").html(q).click(function(F) {
                                navigate_to(p, F, {
                                    params: {
                                        tableEditId: E.id
                                    }
                                })
                            }));
                            v.append(e("<a class='link' href='#/Settings/Security/ManageLdapGroup?tableEditId=" + E.id + "'></a>").html(getStoredTranslation("TXT_MANAGE_GROUPS_PERMISSIONS")).click(function(F) {
                                navigate_to(p + "/ManageLdapGroup", F, {
                                    params: {
                                        tableEditId: E.id
                                    }
                                })
                            }));
                            y = getRawTranslation("TXT_LDAP")
                        } else {
                            if (E.login_type == "Kerberos") {
                                s.append(e("<a class='link' href='#/Settings/Security/KerberosSetup?tableEditId=new'></a>").text(getRawTranslation("TXT_KERBEROS")).click(function(F) {
                                    navigate_to("Settings/Security/KerberosSetup", F, {
                                        params: {
                                            tableEditId: "new"
                                        }
                                    })
                                }));
                                v.append(e("<a class='link' href='#/Settings/Security/ManageKerberosGroup'></a>").html(getStoredTranslation("TXT_MANAGE_PERMISSIONS")).click(function(F) {
                                    navigate_to("Settings/Security/ManageKerberosGroup", F, {})
                                }));
                                y = getRawTranslation("TXT_KERBEROS");
                                e("#KerberosSetup").remove()
                            } else {
                                console.warn("HEY!  I don't know what sort of network setup " + E.login_type + " is supposed to be!")
                            }
                        }
                        m.append(s);
                        m.append(v);
                        m.append(e("<br />"));
                        m.append(e("<span class='setupType'></span>").text(getRawTranslation("TXT_NETWORK_ACCOUNTS") + "(" + E.login_type + ")"));
                        if (E.webDefault) {
                            c(m)
                        }
                        if (E.panelDefault) {
                            d(m)
                        }
                    } else {
                        if (l.type == "solutionssecurity") {
                            m.addClass("solutionsSecurityListItem");
                            var s = e("<span class='setupName'></span>");
                            var v = e("<span class='permissionLink'></span>");
                            var y = "";
                            s.append(q);
                            v.append(e("<a class='link' href='#/Settings/Security/ManageSolutionsGroup?tableEditId=" + E.id + "'></a>").html(getStoredTranslation("TXT_MANAGE_PERMISSIONS")).click(function(F) {
                                navigate_to("Settings/Security/ManageSolutionsGroup", F, {
                                    params: {
                                        tableEditId: E.id
                                    }
                                })
                            }));
                            m.append(s);
                            m.append(v);
                            m.append(e("<br />"));
                            m.append(e("<span class='setupType'></span>").text(getRawTranslation("TXT_SOLUTIONS_ACCOUNTS")));
                            if (E.webDefault) {
                                c(m)
                            }
                            if (E.panelDefault) {
                                d(m)
                            }
                        }
                    }
                }
            }
            r.append(m)
        },
        updateCurPageInfo: function(p, n) {
            var h = n.offset + n.data.length;
            var l = p.find(".prevPage");
            var g = p.find(".nextPage");
            g.attr("disabled", (h >= n.total));
            l.attr("disabled", (n.offset <= 0));
            var m = p.attr("data-max-items-per-page");
            var o = (n.offset / m) + 1;
            var k = Math.ceil(n.total / m);
            p.find(".pageCount").text(o + "/" + k)
        },
        getData: function(g) {
            var k = this.data("list");
            if (k.options.type == "strikethrough") {
                toAdd = [];
                this.find('ul li:not(".removed")').each(function() {
                    var l = Number(e(this).data("id"));
                    if (!isNaN(l)) {
                        if (toAdd.indexOf(l) == -1) {
                            toAdd.push(l)
                        }
                    }
                });
                return {
                    add: toAdd
                }
            } else {
                if (k.options.type == "checkbox") {
                    if (k.paging) {
                        return {
                            add: k.selected,
                            "delete": k.deleted
                        }
                    } else {
                        var h = [];
                        this.find("input").each(function() {
                            var l = false;
                            if (e(this).is(":disabled") && g && g.skipDisabled) {
                                l = true
                            }
                            if (e(this).is(":checked") && l == false) {
                                var m = e(this).closest("[data-id]").data("id");
                                if (m) {
                                    h.push(m)
                                }
                            }
                        });
                        return h
                    }
                }
            }
        },
        clearList: function() {
            this.find("ul").empty();
            e.address.queryParam("selectedItems", "");
            this.removeClass("setting-changed")
        },
        checkChildrenRows: function(o) {
            var p = e(o).is(":checked");
            var m = e("input[type=checkbox]");
            var h = m.index(o);
            var n = parseInt(e(o).attr("childrenCount"));
            for (var l = h + 1; l < h + n + 1; l++) {
                var g = e("input[type=checkbox]")[l];
                var k = parseInt(e(g).attr("childrenCount"));
                if (!isNaN(k)) {
                    n += k
                }
                e("input[type=checkbox]")[l].checked = p;
                e("input[type=checkbox]")[l].disabled = p
            }
        },
        updatePageButtons: function(h) {
            if (h.maxNumberReached) {
                var g = e("button[id=AddNewBookmark]");
                var k = e("button[id=AddNewFolder]");
                if (g != undefined) {
                    e(g).attr("disabled", "disabled")
                }
                if (k != undefined) {
                    e(k).attr("disabled", "disabled")
                }
            }
        }
    };

    function b(h) {
        h.find(".content").each(function() {
            var l = e(this);
            var k = l.parent().children("span").last().text();
            if (openCategories.indexOf(k) == -1) {
                l.hide()
            } else {
                l.parent().find(".icon").addClass("toggled")
            }
            l.find("input").click(function() {
                g(l)
            });
            g(l)
        });
        h.find(".icon").click(function() {
            var k = e(this);
            var m = k.parent().find(".content");
            var l = m.parent().children("span").last().text();
            if (m.is(":visible")) {
                openCategories.splice(openCategories.indexOf(l), 1);
                m.hide("fast");
                k.removeClass("toggled")
            } else {
                openCategories.push(l);
                m.show("fast");
                k.addClass("toggled")
            }
        });
        h.find(".listCategory > input").click(function() {
            h.addClass("setting-changed");
            updateButtonRow(h);
            var l = e(this);
            var k = l.parent().find(".content input");
            l.removeClass("mixed");
            if (l.is(":checked")) {
                k.attr("checked", 1)
            } else {
                k.removeAttr("checked")
            }
        });

        function g(n) {
            var k = n.parent().children("input");
            var m = n.find("input").length;
            var l = n.find("input:checked").length;
            if (m == l) {
                k.removeClass("mixed");
                k.attr("checked", 1)
            } else {
                if (l == 0) {
                    k.removeClass("mixed");
                    k.removeAttr("checked")
                } else {
                    k.addClass("mixed");
                    k.attr("checked", 1)
                }
            }
        }
    }

    function d(h) {
        h.append(e("<br/>"));
        var g = e('<div class="defaultLogin" data-action="showModalPopup" data-child="ChangeDefaultLogin"></div>');
        g.append(getStoredTranslation("TXT_DEFAULT_CONTROL_PANEL_LOGIN_METHOD"));
        var k = e('<span>(<a href="" class="link"></a>)</span>');
        k.find("a").html(getStoredTranslation("TXT_DEVICE_CHANGE"));
        g.append(k);
        h.append(g);
        initTopButton(g)
    }

    function c(h) {
        h.append(e("<br/>"));
        var g = e('<div class="defaultLogin" data-action="showModalPopup" data-child="ChangeDefaultLogin"></div>');
        g.append(getStoredTranslation("TXT_DEFAULT_BROWSER_LOGIN"));
        var k = e('<span>(<a href="" class="link"></a>)</span>');
        k.find("a").html(getStoredTranslation("TXT_DEVICE_CHANGE"));
        g.append(k);
        h.append(g);
        initTopButton(g)
    }

    function f(k, g, l, h) {
        navigate_to(k, undefined, {
            force: true,
            params: {
                tableEditId: g,
                path: escapeString(l),
                childLevel: h
            }
        })
    }
    e.fn.list = function(g) {
        if (a[g]) {
            return a[g].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof g === "object" || !g) {
                return a.init.apply(this, arguments)
            } else {
                e.error("Method " + g + " does not exist on jQuery.list")
            }
        }
    }
})(jQuery);

function showBookmarksPopup(a, c) {
    var e = {};
    var b = "";
    if (c && c.error) {
        if (c.error instanceof Array) {
            b = c.error.join("<br/>")
        } else {
            b = c.error
        }
    } else {
        b = getStoredTranslation("TXT_FAILED")
    }
    e.messageText = b;
    e.showCloseButton = false;
    if (c && (c.errorType == "Duplicate" || c.errorType == "DuplicateFolder")) {
        e.buttonOneId = c.action1Text;
        e.buttonTwoId = c.action2Text;
        e.buttonOneCallback = function() {
            a.hide();
            deleteBookmark(c.fullPath, function() {
                var f = new InputHandler();
                f.saveNodes($(document.getElementById(c.errorNode)), function() {
                    popBreadcrumb(1)
                }, true)
            }, function() {
                showBookmarksPopup(a, undefined)
            })
        };
        e.buttonTwoCallback = function() {
            a.hide();
            $(document.getElementById(c.errorSetting)).find(".input").focus()
        }
    } else {
        if (c && c.errorType == "Full") {
            e.buttonOneId = c.action1Text;
            e.buttonOneCallback = function() {
                a.hide();
                navigate_to("Settings/BookmarkSetup", undefined, {
                    force: true
                })
            }
        } else {
            if (c && c.errorType == "MissingParent") {
                var d = '"' + c.missingParent + '"';
                e.messageText = getRawComplexTranslation("TXT_FOLDER_WAS_DELETED", {
                    name: d
                });
                e.buttonOneId = c.action1Text;
                e.buttonOneCallback = function() {
                    a.hide();
                    navigate_to("Settings/BookmarkSetup", undefined, {
                        force: true
                    })
                }
            } else {
                if (c && c.errorType == "MissingParam") {
                    e.buttonOneId = c.action1Text;
                    e.buttonOneCallback = function() {
                        a.hide();
                        if (c.errorSetting == "BookmarkURL") {
                            $(document.getElementById(c.errorSetting)).find(".setting-node-input-text").focus()
                        } else {
                            $(document.getElementById(c.errorSetting)).find(".input").focus()
                        }
                    }
                } else {
                    if (c && c.errorType == "URLIsTooLong") {
                        e.buttonOneId = c.action1Text;
                        e.buttonOneCallback = function() {
                            a.hide();
                            if (c.errorSetting == "BookmarkURL") {
                                $(document.getElementById(c.errorSetting)).find(".setting-node-input-text").focus()
                            }
                        }
                    } else {
                        if (c && c.errorType == "InvalidPin") {
                            e.buttonOneId = c.action1Text;
                            e.buttonOneCallback = function() {
                                a.hide();
                                $(document.getElementById(c.errorSetting)).find(".input").focus()
                            }
                        } else {
                            e.buttonOneId = "TXT_OK";
                            e.buttonOneCallback = function() {
                                a.hide()
                            }
                        }
                    }
                }
            }
        }
    }
    $(a).popup(e)
}

function deleteBookmark(d, b, g) {
    var c = new Communicator();
    var e = {};
    var f = {};
    var h = [];
    var a = {};
    if (typeof d === "object") {
        for (itemIndex in d) {
            var k = d[itemIndex].toString();
            a = {
                id: k
            };
            h.push(a)
        }
    } else {
        var k = d.toString();
        a = {
            id: k
        };
        h.push(a)
    }
    f.idlist = h;
    e.data = JSON.stringify(f);
    if (b !== undefined) {
        c.addSuccessHandler(b)
    }
    if (g !== undefined) {
        c.addErrorHandler(g)
    }
    c.sendData("/webglue/bookmark/delete", "POST", undefined, "json", e)
}

function getBookmarkListSelection(c, d) {
    var b = [];
    var a = {};
    a.skipDisabled = d;
    b = getList($(document.getElementById("BookmarksList")).find(".list"), a);
    return b
}

function getBookmarkItemData(a, d) {
    var b = undefined;
    var c = undefined;
    var f = getSetting("BOOKMARKS_LIST");
    if (!f || !f.data || !f.data.length) {
        f = getSetting("BOOKMARK_PARENT_FOLDER")
    }
    if (!f || !f.data || !f.data.length) {
        f = getSetting("FOLDER_PARENT_FOLDER")
    }
    if (!f || !f.data || !f.data.length) {
        return b
    }
    c = f.data;
    for (index in c) {
        var e = c[index].name;
        if (d) {
            e = escapeString(e)
        }
        if (e == a) {
            b = c[index];
            break
        }
    }
    return b
}

function initDeleteBookmarkSelection(a) {
    var b = (Boolean($.address.queryParams().tableEditId) && Boolean($.address.queryParams().path));
    if (!b) {
        a.find("button").attr("disabled", true)
    }
    a.find("button").click(function() {
        var e = [];
        if (b) {
            e.push($.address.queryParams().path.toString())
        } else {
            e = getBookmarkListSelection(a, true)
        }
        if (e.length) {
            var f = "";
            if (e.length == 1) {
                var d = getBookmarkItemData(e[0], b);
                e[0] = d.name;
                var g = '"' + d.text + '"';
                if (d.fileType == "directory" || d.fileType == "secure directory") {
                    if (d.name == "/") {
                        f = getStoredTranslation("TXT_DELETING_ALL_BOOKMARKS")
                    } else {
                        f = getRawComplexTranslation("TXT_DELETING_A_FOLDER", {
                            name: g
                        })
                    }
                } else {
                    f = getRawComplexTranslation("TXT_DELETING_A_BOOKMARK", {
                        name: g
                    })
                }
            } else {
                f = getStoredTranslation("TXT_DELETING_SELECTED_BOOKMARKS")
            }
            var c = $($.find(".page")).find(".setting-saved-message");
            if (c) {
                var h = {};
                h.messageText = f;
                h.showCloseButton = false;
                h.buttonOneId = "TXT_CANCEL";
                h.buttonTwoId = "TXT_DELETE";
                h.buttonOneCallback = function() {
                    c.hide()
                };
                h.buttonTwoCallback = function() {
                    c.hide();
                    deleteBookmark(e, function(o) {
                        var n = undefined;
                        var p = false;
                        for (itemIndex in o) {
                            if (o[itemIndex].status) {
                                n = o[itemIndex].id;
                                p = true;
                                break
                            }
                        }
                        if (p) {
                            var m = getBookmarkItemData(n);
                            var k = {};
                            var l = "";
                            var q = '"' + m.text + '"';
                            if (m.fileType == "directory" || m.fileType == "secure directory") {
                                l = getRawComplexTranslation("TXT_FOLDER_WAS_DELETED", {
                                    name: q
                                })
                            } else {
                                if (m.fileType == "bookmark" || m.fileType == "secure bookmark") {
                                    l = getRawComplexTranslation("TXT_BOOKMARK_WAS_DELETED", {
                                        name: q
                                    })
                                } else {
                                    l = getStoredTranslation("TXT_FAILED")
                                }
                            }
                            k.messageText = l;
                            k.showCloseButton = false;
                            k.buttonOneId = "TXT_OK";
                            k.buttonOneCallback = function() {
                                c.hide();
                                if (b) {
                                    navigate_to("Settings/BookmarkSetup", undefined, {
                                        force: true
                                    })
                                } else {
                                    reloadContent()
                                }
                            };
                            c.popup(k)
                        } else {
                            if (b) {
                                navigate_to("Settings/BookmarkSetup", undefined, {
                                    force: true
                                })
                            } else {
                                reloadContent()
                            }
                        }
                    }, function() {
                        showBookmarksPopup(c, undefined)
                    })
                };
                c.popup(h)
            }
        }
    })
}
FILE_UPLOAD_POLL_INTERVAL = 300;
FILE_UPLOAD_THRESHOLD = 10;
InputHandler.prototype = new Communicator();
InputHandler.prototype.constructor = InputHandler;
InputHandler.superclass = Communicator.prototype;

function InputHandler() {
    Communicator.call(this);
    this.addSuccessHandler(InputHandler.prototype.success);
    this.addErrorHandler(InputHandler.prototype.error);
    this.addCompleteHandler(InputHandler.prototype.complete);
    this.disableComponents = new Array();
    this.ignoreQueryParamUpdates = false
}
InputHandler.prototype.ignoreQuery = function(a) {
    this.ignoreQueryParamUpdates = a
};
InputHandler.prototype.saveNodes = function(d, m, e, g) {
    var f = this;
    var h = {};
    var a = true;
    var b = false;
    var l = undefined;
    var c = {};
    var k = false;
    if (g !== undefined) {
        f.verify = g
    } else {
        f.verify = false
    }
    d.find("div[data-setting]:not(:disabled, .ui-state-disabled, [data-control-disabled])").each(function() {
        if ($(this).data("setting-type") == "FileInput" && $(this).find(".hidden-file-input").first().hasClass("setting-changed")) {
            if ($(this).data("check-submit-response") == 1) {
                var q = {
                    success: function(w, y, x) {
                        var v = jQuery.parseJSON(w);
                        if (v.RC["error"].length > 0) {
                            var z = function() {
                                $(".popup").hide();
                                d.find(".setting-saved-message").hide()
                            };
                            displayResultPopup(d, 0, v.RC["error"], z)
                        }
                    },
                    error: function(v) {
                        alert("SUBMIT ERROR " + v)
                    }
                };
                $(this).find(".hidden-file-form").ajaxForm(q)
            }
            if ($(this).data("promptFileUpload")) {
                var o = function() {
                    $(".popup").hide();
                    d.find(".setting-saved-message").hide()
                };
                var r = {
                    error: function(v) {
                        if (v.status == 400) {
                            displayResultPopup(d, 0, getRawTranslation("TXT_UPLOAD_FAIL_INVALID_FILE_FORMAT"), o)
                        } else {
                            if (v.status == 500) {
                                displayResultPopup(d, 0, getRawTranslation("TXT_UPLOAD_FAIL_FILE_CORRUPT_INVALID"), o)
                            } else {
                                displayResultPopup(d, 0, getRawTranslation("TXT_UPDATE_FAILED_UPPER"), o)
                            }
                        }
                    },
                    statusCode: {
                        200: function() {
                            displayResultPopup(d, 1, getRawTranslation("TXT_UPLOAD_SUCCESSFUL"), o)
                        },
                        400: function() {
                            displayResultPopup(d, 0, getRawTranslation("TXT_UPLOAD_FAIL_INVALID_FILE_FORMAT"), o)
                        },
                        500: function() {
                            displayResultPopup(d, 0, getRawTranslation("TXT_UPLOAD_FAIL_FILE_CORRUPT_INVALID"), o)
                        }
                    },
                    timeout: 9000000
                };
                $(this).find(".hidden-file-form").ajaxForm(r);
                showUploadPrompt(d, function() {
                    d.find(".hidden-file-form").submit()
                })
            } else {
                $(this).find(".hidden-file-form").ajaxSubmit({
                    headers: {
                        "X-Csrf-Token": getSessionKey()
                    }
                })
            }
            $(this).removeClass("setting-changed");
            this.upload = d.find(".hidden-file-input").first();
            this.upload.removeClass("setting-changed");
            return
        }
        if (($(this).hasClass("setting-changed")) && (!$(this).is(":visible"))) {
            $(this).removeClass("setting-changed")
        }
        if ($(this).hasClass("setting-changed")) {
            if (!checkNodeValue($(this))) {
                a = false;
                return
            }
            if ($(this).data("reboot")) {
                b = true
            }
            var u = $(this).closest("[data-node]").data("node");
            var p = getNodeValue($(this));
            var s = false;
            if ($(this).data("value-conflict-node") && isValueConflict(u, p)) {
                if (checkValueConflicts(u, p, settingId, c)) {
                    k = true
                } else {
                    s = true
                }
            }
            if ((p != undefined) && (s == false)) {
                h[u] = p
            }
            if ($(this).data("control-node")) {
                var t = $(this).data("control-node");
                d.find('[data-node="' + t + '"] div.setting-changed[data-setting][disabled="disabled"]').each(function() {
                    h[t] = getNodeValue($(this))
                })
            }
        }
    });
    d.find("div[data-setting]:disabled, ui-state-disabled, [data-control-disabled]").each(function() {
        if ($(this).data("evaluate-on-save-even-disabled")) {
            if ($(this).hasClass("setting-changed")) {
                if (!checkNodeValue($(this))) {
                    a = false;
                    return
                }
                var q = $(this).closest("[data-node]").data("node");
                var o = getNodeValue($(this));
                var p = false;
                if ($(this).data("value-conflict-node") && isValueConflict(q, o)) {
                    if (checkValueConflicts(q, o, settingId, c)) {
                        k = true
                    } else {
                        p = true
                    }
                }
                if ((o != undefined) && (p == false)) {
                    h[q] = o
                }
            }
        }
    });
    d.find("div[data-schedule-type]:not(:disabled, .ui-state-disabled, [data-control-disabled])").each(function() {
        var p = $(this);
        var s = p.closest("[data-node]").data("node");
        var r = {};
        var q = p.data("schedule-type");
        r.type = q;
        r.data = [];
        var o = stored_vars[q];
        $.each(o.getData(), function(t, v) {
            var u = v.data;
            r.data.push({
                id: v.id,
                type: u.type,
                days: u.days,
                hour: u.hour
            })
        });
        h[s] = r
    });
    this.baseElem = d;
    if (m && e) {
        this.saveSuccessHandler = m
    } else {
        if (m) {
            this.addCompleteHandler(m)
        }
    }
    if (a) {
        if (b) {
            showRebootPopup(d, n)
        } else {
            if (k) {
                valueConflictsPopup(d, n, c)
            } else {
                n()
            }
        }
    }

    function n() {
        f.sendNodeUpdate(d, h, MAIN_CONTENT_PATH, b)
    }
};
InputHandler.prototype.saveNode = function(b, e) {
    var d;
    var a;
    b.find("div[data-setting]:not(:disabled, .ui-state-disabled, [data-control-disabled])").each(function() {
        if ($(this).data("setting-type") == "FileInput" && $(this).find(".hidden-file-input").first().hasClass("setting-changed")) {
            $(this).find(".hidden-file-form").ajaxSubmit({
                headers: {
                    "X-Csrf-Token": getSessionKey()
                }
            });
            $(this).removeClass("setting-changed");
            this.upload = b.find(".hidden-file-input").first();
            this.upload.removeClass("setting-changed");
            return
        }
        if ($(this).hasClass("setting-changed")) {
            d = $(this).closest("[data-node]").data("node");
            a = getNodeValue($(this))
        }
    });
    if (e) {
        this.addCompleteHandler(e)
    }
    this.baseElem = b;
    this.messageBlock = b.find(".setting-saved-message");
    this.messageText = this.messageBlock.find(".setting-saved-message-text");
    this.fadeTimeout;
    clearTimeout(this.fadeTimeout);
    this.messageText.hide();
    this.messageBlock.show();
    this.initSpinner(this.messageBlock.find(".setting-saved-spinner"));
    var c = {};
    c.data = a;
    c.c = d;
    this.post(MAIN_CONTENT_PATH, c, this)
};
InputHandler.prototype.sendNodeUpdate = function(c, h, b, a) {
    var k = c.closest("[data-node]").data("node");
    if (k === undefined) {
        k = c.closest("[panel-data-node]").attr("panel-data-node")
    }
    var f = new Array();
    $("[data-refresh-on-save~=" + k + "]").each(function(l, m) {
        f.push($(m).closest("[data-node]").data("node"))
    });
    this.addSuccessHandler(function() {
        var p = false;
        for (var l = 0; l < f.length; l++) {
            var o = new ContentHandler($("[data-node=" + f[l] + "]"));
            o.loadContent(f[l]);
            if (p == false && k != f[l] && $(".popup").length == 0) {
                p = true;
                var m = new ContentHandler($("[data-node=" + k + "]"));
                var n = {};
                n.depth = 0;
                m.loadContent(k, n)
            }
        }
        if (a) {
            c.find(".setting-saved-message").hide();
            showRebootingPanel(c)
        }
        $("[data-refresh-node-after-save~=" + k + "]").each(function(q, s) {
            var r = $(this).attr("data-setting");
            $(this).on(NODE_UPDATE, function(u, v) {
                updateNodeValue(r, v)
            });
            if (k == "EditContactContainer") {
                var t = k + "?tableEditId=" + $.address.queryParams().tableEditId;
                refreshNode(t)
            } else {
                refreshNode(k)
            }
        })
    });
    this.buttonRow = c.find(".setting-buttons");
    var g = c.find("[data-action*=save]");
    var e = c.find("[data-action=reset]");
    if (b == undefined) {
        b = MAIN_CONTENT_PATH
    }
    this.messageBlock = c.find(".setting-saved-message");
    this.messageText = this.messageBlock.find(".setting-saved-message-text");
    this.fadeTimeout;
    clearTimeout(this.fadeTimeout);
    g.disable();
    e.disable();
    this.messageText.hide();
    this.messageBlock.show();
    this.initSpinner(this.messageBlock.find(".setting-saved-spinner"));
    var d = {};
    if (!this.ignoreQueryParamUpdates) {
        d = $.address.queryParams()
    }
    d.data = JSON.stringify(h);
    if (d.c === undefined) {
        d.c = k
    }
    this.post(b, d, this)
};
InputHandler.prototype.successHandler = function(data) {
    var me = this;
    var pass = true;
    if (data) {
        $.each(data, function(id, settingObj) {
            if (settingObj.status) {
                pass = false;
                if ((settingObj.rc != undefined) && (settingObj.rc >= 0)) {
                    pass = true
                }
                if (data.url != undefined && data.url.length > 0) {
                    data.RC.url = data.url
                }
                me.showFailedPopup(me.messageBlock, data.RC, pass);
                if (!pass) {
                    return
                }
            }
            if (id == "QueryParams" && !me.ignoreQueryParamUpdates && (data.RC === undefined || data.RC.error === undefined || data.RC.error.length == 0)) {
                $.each(settingObj, function(id, value) {
                    if (id && value) {
                        $.address.queryParam(id, value)
                    }
                })
            } else {
                if ((settingObj.schedule !== undefined) && (stored_vars[id] !== undefined)) {
                    stored_vars[id].saveState()
                } else {
                    if (data.RC === undefined || data.RC.status == 0) {
                        if (settingObj.newValue != undefined) {
                            if (getSetting(id) !== undefined) {
                                if (getSetting(id).val != undefined) {
                                    setSetting(id, "val", settingObj.newValue)
                                } else {
                                    if (getSetting(id).values != undefined && typeof(getSetting(id).values) == "object" && typeof(settingObj.newValue) == "object") {
                                        var thisSetting = getSetting(id);
                                        thisSetting.values = settingObj.newValue;
                                        setSetting(id, thisSetting)
                                    } else {
                                        setSetting(id, settingObj.newValue)
                                    }
                                }
                            } else {
                                var index;
                                for (index = 0; index < external_callbacks.length; index++) {
                                    var extSetting = external_callbacks[index];
                                    var position = extSetting.search(id);
                                    if (position == -1) {
                                        continue
                                    }
                                    if (external_callbacks.length < 1) {
                                        break
                                    }
                                    external_callbacks.splice(index, 1);
                                    id = extSetting;
                                    if (getSetting(id).val != undefined) {
                                        setSetting(id, "val", settingObj.newValue)
                                    } else {
                                        setSetting(id, settingObj.newValue)
                                    }
                                    break
                                }
                            }
                        } else {
                            setSetting(id, settingObj)
                        }
                    }
                }
            }
            var elem = $("[data-setting=" + id + "]");
            var parent = elem.parents("[data-node]")[0];
            if (parent != undefined) {
                $("[data-display-node=" + parent.id + "]").trigger("refresh")
            }
            checkIfNodeChanged(elem);
            elem.trigger("refresh")
        })
    }
    this.stopSpinner();
    if (pass && $(".popup").length == 0) {
        var fadeOutTime = 1500;
        this.showMessage(stored_translations.TXT_SAVED.text);
        if (this.saveSuccessHandler) {
            if (this.verify) {
                fadeOutTime = 500
            }
            timeouts.push(setTimeout(function() {
                me.saveSuccessHandler();
                me.saveSuccessHandler = undefined
            }, fadeOutTime))
        }
        me.baseElem.find("[data-refresh-on-panel-save=1]").each(function() {
            var settingType = $(this).attr("data-setting-type");
            var refreshStr = "refresh" + settingType + "($(this))";
            try {
                eval(refreshStr)
            } catch (err) {
                console.warn("This element is set to refresh itself whenever its containing panel is saved, but SettingType " + settingType + " either doesn't have a refresh method or the method returned an error!")
            }
        })
    }
    if (!pass) {
        me.checkRequiredNodes()
    }
    var formElement = this.baseElem.find("#ImportFaxLogo").find("form").find("input").attr("for");
    if (formElement !== undefined) {
        var clearFileName = "#" + formElement;
        $(clearFileName).val("");
        this.baseElem.find("#ImportFaxLogo").find("form")[0].reset()
    }
    if (this.buttonRow) {
        updateButtonRow(this.buttonRow)
    }
};
InputHandler.prototype.checkRequiredNodes = function() {
    $($.find("div[data-setting]:not(:hidden, :disabled, .ui-state-disabled, [data-control-disabled])")).each(function() {
        checkIfNodeRequired($(this))
    })
};
InputHandler.prototype.success = function(b) {
    var a = this;
    if (this.upload) {
        this.count = 0;
        this.intervalId = setInterval(function() {
            a.count += 1;
            var c = $("#upload_target").first().contents().find("body").text();
            if (c.length > 0) {
                $.extend(b, $.parseJSON(c));
                $("#upload_target").first().contents().find("body").empty();
                clearInterval(a.intervalId)
            } else {
                if (a.count > FILE_UPLOAD_THRESHOLD) {
                    $.extend(b, {
                        RC: {
                            error: getRawTranslation("TXT_WEB_FILE_TIMEOUT"),
                            status: 1
                        }
                    });
                    clearInterval(a.intervalId)
                } else {
                    return
                }
            }
            a.successHandler(b)
        }, FILE_UPLOAD_POLL_INTERVAL)
    } else {
        a.successHandler(b)
    }
};
InputHandler.prototype.error = function(a) {
    this.stopSpinner();
    this.showFailedPopup(this.messageBlock, {
        error: getRawTranslation("TXT_WEB_NOT_RESPONDING")
    }, false);
    updateButtonRow(this.buttonRow)
};
InputHandler.prototype.complete = function(a) {
    $.each(this.disableComponents, function(b, c) {
        c.setEnabled(true)
    })
};
InputHandler.prototype.showFailedPopup = function(a, f, e) {
    var d;
    var c = this;
    if (f && f.error) {
        if (f.error instanceof Array) {
            d = f.error.join("<br/>")
        } else {
            d = f.error
        }
    } else {
        d = getStoredTranslation("TXT_FAILED")
    }
    if ($(".popup").length == 0) {
        if (f && f.customHandler) {
            if (f.customHandler == "Bookmarks") {
                showBookmarksPopup(a, f)
            }
        } else {
            if (f && f.buttonOneTextId && f.buttonTwoTextId) {
                if (f.duplicate == "ShortcutName" || f.duplicate == "EditShortcutName") {
                    d = d.replace(/<name\/>/g, escapeHtml($("#ShortcutName").find("input").last().val().trim()));
                    d = d.replace("<type/>", $("#ShortcutType option:selected").text());
                    d = d.replace("<id/>", f.existingId)
                } else {
                    d = d.replace(/<id\/>/g, $("#ShortcutId").find("input").last().val());
                    d = d.replace("<name/>", escapeHtml(f.existingName));
                    d = d.replace("<type/>", f.existingType)
                }
                $(a).popup({
                    messageText: d,
                    buttonOneId: f.buttonOneTextId,
                    buttonOneCallback: function() {
                        a.hide();
                        b(f.duplicate)
                    },
                    buttonCloseCallback: function() {
                        a.hide()
                    },
                    buttonTwoId: f.buttonTwoTextId,
                    buttonTwoCallback: function() {
                        a.hide();
                        c.confirmUpdateShortcut(f.duplicate)
                    }
                })
            } else {
                $(a).popup({
                    messageText: d,
                    buttonOneId: "TXT_OK",
                    buttonOneCallback: function() {
                        a.hide();
                        navigateToUrl(f);
                        if ((e != undefined) && (e == true)) {
                            if (c.saveSuccessHandler != undefined) {
                                $(".setting-changed").removeClass("setting-changed");
                                c.saveSuccessHandler();
                                c.saveSuccessHandler = undefined
                            }
                        }
                    },
                    buttonCloseCallback: function() {
                        a.hide();
                        navigateToUrl(f);
                        if ((e != undefined) && (e == true)) {
                            if (c.saveSuccessHandler != undefined) {
                                $(".setting-changed").removeClass("setting-changed");
                                c.saveSuccessHandler();
                                c.saveSuccessHandler = undefined
                            }
                        }
                    }
                })
            }
        }
    }

    function b(h) {
        if (h == "EditShortcutName" || h == "EditShortcutId") {
            h = h.split("Edit")[1]
        }
        var g = $("#" + h).find("input").last();
        g.focus();
        g = $("#" + h).find(".setting-node-input").addClass("invalid")
    }
};
InputHandler.prototype.showMessage = function(b) {
    this.messageText.show();
    this.messageText.text(b);
    centerWithinParent(this.messageText, "both");
    var a = this;
    this.fadeTimeout = setTimeout(function() {
        a.messageBlock.fadeOut(1500)
    }, 300)
};
InputHandler.prototype.initSpinner = function(c) {
    this.spinnerInterval;
    this.spinnerFrame = 0;
    this.messageSpinner = c;
    centerWithinParent(this.messageSpinner, "both");
    var b = this;
    var a = function() {
        b.spinnerFrame++;
        b.messageSpinner.css("background-position", "0px -" + (38 * (b.spinnerFrame % 16)) + "px")
    };
    this.spinnerTimeout = setTimeout(function() {
        b.messageSpinner.show()
    }, 500);
    this.spinnerInterval = setInterval(a, 100)
};
InputHandler.prototype.stopSpinner = function() {
    clearInterval(this.spinnerInterval);
    clearTimeout(this.spinnerTimeout);
    this.messageSpinner.hide()
};
InputHandler.prototype.confirmUpdateShortcut = function(f) {
    var c = {};
    if (f == "EditShortcutName" || f == "EditShortcutId") {
        c.conflict = "Edit";
        c.oldId = $.address.queryParams().tableEditId;
        c.field = f
    } else {
        c.field = (f == "ShortcutName") ? "id" : "name"
    }
    c.name = $("#ShortcutName").find("input").last().val().trim();
    c.id = $("#ShortcutId").find("input").last().val();
    var h = {};
    l($("#EditShortcutInfo"), h);
    var d = $("li[id^='ShortcutSettings']");
    d.each(function() {
        if ($(this).is(":visible")) {
            l($(this), h)
        }
    });
    c.data = JSON.stringify(h);
    var b = $("#ShortcutType").find("select").last().val();
    switch (parseInt(b)) {
        case 1:
            c.type = "Copy";
            break;
        case 2:
            c.type = "Email";
            break;
        case 3:
            c.type = "Fax";
            break;
        case 4:
            c.type = "Ftp";
            break;
        case 5:
            c.type = "Profile";
            break;
        default:
            c.type = ""
    }
    var k = $(".page");
    var g = startSpinnerBlock(k);
    var e = 1500;
    this.showMessage(stored_translations.TXT_SAVED.text);
    this.fadeTimeout = setTimeout(function() {
        $(this).find(".setting-saved-message").fadeOut(e)
    }, 300);
    var a = new Communicator();
    a.sendData(SHORTCUTS, "POST", this, "json", c);
    a.addSuccessHandler(function(m) {
        if (m.tableEditId != 0) {
            stopSpinnerBlock(k, g);
            hideSpinnerBlock(k);
            navigate_to("ShortcutsManagement", undefined, {
                force: true
            })
        }
    });

    function l(n, m) {
        n.find("div[data-setting]:not(:disabled, .ui-state-disabled, [data-control-disabled])").each(function() {
            if (!checkNodeValue($(this))) {
                return
            }
            var p = $(this).closest("[data-node]").data("node");
            var o = getNodeValue($(this));
            if (o != undefined) {
                m[p] = o
            }
        })
    }
};

function showRebootingPanel(a) {
    $(a).popup({
        messageText: getRawTranslation("TXT_PRINTER_IS_REBOOTING_PLEASE_RELOAD"),
        showCloseButton: false
    })
}

function initVerifyInput(d) {
    var g = d.find("input");
    d.settingNode(g);
    var e = getSettingData(d);
    if (e.disabled) {
        g.disable()
    }

    function f(h) {
        checkIfNodeChanged(h);
        checkVerifyInput(h);
        updateButtonRow(h)
    }
    d.keyup(function() {
        f(d)
    });
    d.focusout(function() {
        f(d)
    });
    d.bind("refresh", function() {
        var h = getSetting(d.data("setting"));
        setVerifyInput(d, h.val)
    });
    d.focusin(function() {
        markVerifyValid(d)
    });

    function c(k, h) {
        var l = $(k).attr("type");
        if (l == "password") {
            $(k).val("");
            if ($(h).val() == "********") {
                $(h).val("")
            }
        }
    }
    var a = d.find("input").first();
    var b = d.find("input").last();
    a.focusin(function() {
        c(a, b)
    });
    b.focusin(function() {
        c(b, a)
    });
    $("html").click(function(h) {
        if (d.has(h.target).length === 0) {
            checkVerifyInput(d)
        }
    })
}

function checkVerifyInput(c) {
    var d = c.find("input").first();
    var a = c.find("input").last();
    var b;
    if (d.val() != a.val()) {
        markVerifyInvalid(c);
        b = false
    } else {
        markVerifyValid(c);
        b = true
    }
    return b
}

function setVerifyInput(a, b) {
    a.find("input").first().val(b);
    a.find("input").last().val(b);
    checkIfNodeChanged(a);
    checkVerifyInput(a)
}

function getVerifyInput(a) {
    return a.find("input").first().val()
}

function markVerifyValid(c) {
    var b = c.find(".invalid-message");
    var a = c.find("input").last();
    a.css("border-color", "");
    c.removeClass("invalid-node");
    b.hide();
    updateButtonRow(c)
}

function markVerifyInvalid(c) {
    c.addClass("invalid-node");
    var b = c.find(".invalid-message");
    var a = c.find("input").last();
    a.css("border-color", "red");
    b.show();
    updateButtonRow(c)
}

function initSecurityGroup(c) {
    var a = c.parent().data("node");
    var h = c.find("button.add");
    var e = c.find(".authList");
    var k = stored_nodes[a].links;
    for (i in k) {
        var d = k[i];
        var b = $.address.path() + d.link;
        var f = d.link;
        if (d.hideIfAdIsJoined === undefined || stored_settings.LDAP_ID_THAT_IS_ACTUALLY_ACTIVE_DIRECTORY["val"] === -1) {
            if (f.lastIndexOf("/") != -1) {
                f = f.substring(f.lastIndexOf("/") + 1, f.length)
            }
            var g = $("<div></div>").attr("id", f).attr("data-href", b).text(getRawTranslation(d.title));
            g.click(function(l) {
                navigate_to($(this).attr("data-href"), l, {
                    params: {
                        tableEditId: "new"
                    }
                })
            });
            e.append(g)
        }
    }
    e.hide();
    h.click(function() {
        e.toggle()
    });
    h.parent().css("position", "relative");
    $("html").click(function(l) {
        if (h.has(l.target).length === 0 && !h.is(l.target)) {
            e.hide()
        }
    })
}

function initRadioSetting(a) {
    var b = a.find("input");
    a.settingNode(b);
    a.find("a").click(function() {
        if (!a.attr("disabled")) {
            $(".popup-modal-container").modalPopup("display", a.data("child"), undefined)
        }
    });
    if (a.data("setting") == "LDAP_AUTH_TYPE") {
        $("#LdapGssapiNeedsKerberosWarning").toggle(false);
        a.find("input").change(function() {
            var g = $(this);
            var f = g.val();
            if (f == 0) {
                markRadioSetting(a, "");
                toggleLdapSettings(true);
                updateButtonRow(a)
            } else {
                var c = a.closest(".page");
                var e = startSpinnerBlock(c);
                var d = new Communicator();
                d.addSuccessHandler(function(h) {
                    if (h.nodes["settings"]["KERBEROS_DELETE"]["val"] == "") {
                        markRadioSetting(a, "invalid");
                        toggleLdapSettings(false)
                    } else {
                        markRadioSetting(a, "");
                        toggleLdapSettings(true)
                    }
                    updateButtonRow(a)
                });
                d.addCompleteHandler(function(h) {
                    stopSpinnerBlock(c, e);
                    hideSpinnerBlock(c)
                });
                d.sendData(RAW_CONTENT, "GET", this, "json", {
                    c: "DeleteKerberos"
                })
            }
        })
    }
}

function toggleLdapSettings(a) {
    $("#LdapInfo").toggle(a);
    $("#LdapCredentials").toggle(a);
    $("#LdapGssapiCredentials").toggle(a);
    $("#LdapAdvancedOptions").toggle(a);
    $("#LdapSearchClasses").toggle(a);
    $("#LdapAddressBookSetup").toggle(a);
    $("#LdapGssapiNeedsKerberosWarning").toggle(!a)
}

function setRadioSetting(b, c) {
    var d = mapRealToWidgetValue(b, c);
    var a = b.find(".setting-node-input");
    a.find("input:radio[name=" + b.data("setting") + "]").val([c]);
    a.find("input:radio[name=" + b.data("setting") + "]:checked").trigger("change")
}

function getRadioSetting(b, c) {
    var a = b.find(".setting-node-input");
    return mapWidgetToRealValue(b, a.find("input:radio[name=" + b.data("setting") + "]:checked").val())
}

function markRadioSetting(b, c) {
    var a = b.find(".setting-node-input");
    a.removeClass("conflict").removeClass("invalid");
    if (c == "conflict") {
        a.addClass("conflict")
    } else {
        if (c == "invalid") {
            a.addClass("invalid")
        }
    }
}

function initEnumSelectTextInput(b) {
    var c = b.find("select");
    b.settingNode(c);
    extractSettingString(b);
    var a = b.find(".setting-node-input-text");
    c.change(function() {
        checkNodeEnumSelectTextInput(b)
    });
    initTextInput(b)
}

function checkTextInputValid(f, d, c) {
    var h = getNodeName(c);
    if (c.data("required")) {
        var a = false;
        if ((f != undefined) && (f !== "") && (d != undefined) && (d !== "")) {
            a = true
        }
        if (h == "BookmarkURL") {
            var g = c.attr("data-setting");
            var e = getSetting(g);
            for (idx in e.vallist) {
                if (d.indexOf(e.vallist[idx].prefixText) != -1) {
                    a = false;
                    break
                }
            }
        }
        setNodeState(c.find(".setting-node-input"), undefined, a)
    } else {
        if (h == "HomePageLinkSetupURLCustom" || h == "InformationCenterLinkSetupURLCustom" || h == "RegistrationLinkSetupURLCustom" || h == "OrderSuppliesLinkSetupURLCustom" || h == "DownloadsAndUpdatesLinkSetupURLCustom" || h == "TechnicalSupportLinkSetupDescription" || h == "ContactUsLinkSetupURLCustom" || h == "AboutLinkSetupURLCustom") {
            var a = false;
            var b = d.search("://");
            if ((f != undefined) && (f !== "") && (d != undefined) && (d !== "") && b == -1) {
                a = true
            }
            setNodeState(c.find(".setting-node-input"), undefined, a)
        }
    }
}

function updateURLHiddenValue(d) {
    var b = {};
    var c = d.find("select").val();
    var k = d.attr("data-setting");
    var l = getSetting(k);
    var g = l.vallist[c].prefixText;
    var a = l.maxlength;
    var h = d.find(".setting-node-input-text");
    var e = h.val();
    var f = a - g.length;
    h.attr("maxlength", f);
    if (e != "" || c != 0) {
        d.find('[type="hidden"]').attr("value", g + e)
    }
    b.prefixText = g;
    b.inputText = e;
    return b
}

function checkNodeEnumSelectTextInput(b) {
    var a = updateURLHiddenValue(b);
    checkIfNodeChanged(b);
    checkTextInputValid(a.prefixText, a.inputText, b);
    updateButtonRow(b)
}

function extractSettingString(f) {
    var g = f.attr("data-setting");
    var d = getSetting(g);
    var e = f.find(".setting-node-input");
    var a = d.completeURL;
    var c = a.split("://")[1];
    var b = e.find("input[id=text_" + g + "]");
    if (c != undefined) {
        b.attr("value", c)
    } else {
        b.attr("value", "")
    }
}

function setEnumSelectTextInput(b, c) {
    extractSettingString(b);
    var a = b.find("select");
    a.val(c);
    a.trigger("change")
}

function getEnumSelectTextInput(a) {
    updateURLHiddenValue(a);
    return a.find('[type="hidden"]').val()
}

function initTextWithButtonSetting(a) {
    var c = a.find("input");
    a.settingNode(c);
    var b = a.data("action");
    if (b == "LDAP_GROUP_SEARCH_BY_USERNAME" || b == "LDAP_GROUP_SEARCH_BY_GROUP") {
        $("div[data-node=ManageLdapGroupsSearchResults]").toggle(false);
        $("#ManageLdapGroupsNoResults").toggle(false)
    }
    a.find("button").click(function() {
        performLdapSearch(a)
    });
    a.find("input").keyup(function(d) {
        if (d.keyCode == 13) {
            performLdapSearch(a)
        }
    })
}

function getTextWithButtonInput(a) {
    return a.find("input").val()
}

function performLdapSearch(b) {
    var d = b.data("action");
    var h = b.find("input").val();
    var a = new Communicator();
    if (d == "LDAP_GROUP_SEARCH_BY_USERNAME" || d == "LDAP_GROUP_SEARCH_BY_GROUP") {
        var k = b.closest(".page");
        var g = startSpinnerBlock(k);
        var f = parseInt($.address.queryParams().tableEditId);
        var e = {
            c: b.parent().data("node"),
            action: d,
            ldap_id: f
        };
        var c = b.find("input").val();
        if (d == "LDAP_GROUP_SEARCH_BY_GROUP") {
            e.group = c
        } else {
            e.username = c
        }
        a.addSuccessHandler(function(l) {
            if (l.actionResponse["success"] == 1) {
                if (l.actionResponse["searchResults"]["length"] > 0) {
                    stored_settings.LDAP_GROUP_SEARCH_RESULTS["data"] = l.actionResponse["searchResults"]["data"];
                    stored_settings.LDAP_GROUP_SEARCH_RESULTS["length"] = l.actionResponse["searchResults"]["length"];
                    stored_settings.LDAP_GROUP_SEARCH_RESULTS["total"] = l.actionResponse["searchResults"]["total"];
                    $("div[data-node=ManageLdapGroupsSearchResults]").table("update");
                    $("div[data-node=ManageLdapGroupsSearchResults]").toggle(true);
                    $("#ManageLdapGroupsNoResults").toggle(false)
                } else {
                    $("div[data-node=ManageLdapGroupsSearchResults]").toggle(false);
                    $("#ManageLdapGroupsNoResults span").html(getComplexTranslation("TXT_NO_SEARCH_RESULTS_FOUND", {
                        query: c
                    }));
                    $("#ManageLdapGroupsNoResults").toggle(true)
                }
            } else {
                $("div[data-node=ManageLdapGroupsSearchResults]").toggle(false);
                console.error("The result that came back isn't valid, meaning the search encountered an error somewhere!")
            }
        });
        a.addErrorHandler(function(l) {
            console.log("ERROR'D!!!")
        });
        a.addCompleteHandler(function(l) {
            stopSpinnerBlock(k, g);
            hideSpinnerBlock(k)
        });
        a.sendData(MAIN_CONTENT_PATH, "POST", b, "json", e)
    } else {
        console.error("I don't know what sort of button action " + d + " is supposed to be!")
    }
}

function initManageLdapGroupsManualEntry(a) {
    a.find("#setting_LDAP_MANUAL_GROUP_NAME").keyup(function() {
        updateManageLdapGroupsManualEntryChanged(a)
    });
    a.find("#setting_LDAP_MANUAL_GROUP_IDENTIFIER").keyup(function() {
        updateManageLdapGroupsManualEntryChanged(a)
    });
    updateManageLdapGroupsManualEntryChanged(a)
}

function getManageLdapGroupsManualEntry(a) {
    var b = {};
    b.name = a.find("#setting_LDAP_MANUAL_GROUP_NAME").val();
    b.dn = a.find("#setting_LDAP_MANUAL_GROUP_IDENTIFIER").val();
    return b
}

function updateManageLdapGroupsManualEntryChanged(b) {
    var c = b.find("#setting_LDAP_MANUAL_GROUP_NAME");
    var a = b.find("#setting_LDAP_MANUAL_GROUP_IDENTIFIER");
    if (c.val().trim() != "" || a.val().trim() != "") {
        b.addClass("setting-changed")
    } else {
        b.removeClass("setting-changed")
    }
    if (c.val().trim() == "" || a.val().trim() == "") {
        b.addClass("invalid-node")
    } else {
        b.removeClass("invalid-node")
    }
    updateButtonRow(b)
}

function initRadioSlider(f) {
    var a = f.find(".slider");
    var m = f.data("setting");
    var d = parseInt(a.data("value"));
    var g = parseInt(a.data("min"));
    var l = parseInt(a.data("max"));
    var e = parseInt(a.data("step"));
    var k = parseInt(f.data("non-slider-value"));
    var c = getValueMap(f);
    a.slider({
        value: mapRealToWidgetValue(f, d, c),
        min: g,
        max: l,
        step: e,
        slide: function(n, o) {
            f.find(".slider-value").text(mapRealToWidgetValue(f, o.value, c));
            a.attr("data-value", mapRealToWidgetValue(f, o.value, c))
        },
        change: function(n, o) {
            checkIfNodeChanged(f);
            updateButtonRow(f)
        }
    });
    f.find(".slider-value").text(mapRealToWidgetValue(f, d, c));
    a.attr("data-value", mapRealToWidgetValue(f, d, c));
    var b = a.attr("tabindex");
    a.removeAttr("tabindex");
    a.find("a").attr("tabindex", b);
    var h = f.find("input:radio");
    h.change(function() {
        var o = $(this);
        var n = o.val();
        if (n == 0) {
            f.find(".slider-disable-container").disable()
        } else {
            f.find(".slider-disable-container").enable()
        }
        checkIfNodeChanged(f);
        updateButtonRow(f)
    });
    if (d == k) {
        h.val([0]);
        f.find(".slider-disable-container").disable()
    } else {
        h.val([1])
    }
}

function getRadioSlider(b) {
    var a = b.find("input:checked");
    if (a.val() == 0) {
        return b.data("non-slider-value")
    } else {
        return b.find(".slider").slider("value")
    }
}

function setRadioSlider(b, c) {
    var d = b.find("input");
    if (c == b.data("non-slider-value")) {
        d.val([0]);
        b.find("input:checked").trigger("change")
    } else {
        d.val([1]);
        b.find("input:checked").trigger("change");
        var a = b.find(".slider");
        a.slider("value", c);
        b.find(".slider-value").text(c);
        a.trigger("slidechange")
    }
}

function initDateTimePicker(d) {
    var a = d.find("input");
    var e = [getRawTranslation("TXT_SUNDAY_ABBR"), getRawTranslation("TXT_MONDAY_ABBR"), getRawTranslation("TXT_TUESDAY_ABBR"), getRawTranslation("TXT_WEDNESDAY_ABBR"), getRawTranslation("TXT_THURSDAY_ABBR"), getRawTranslation("TXT_FRIDAY_ABBR"), getRawTranslation("TXT_SATURDAY_ABBR")];
    var c = [getRawTranslation("TXT_JANUARY_SHORT"), getRawTranslation("TXT_FEBRUARY_SHORT"), getRawTranslation("TXT_MARCH_SHORT"), getRawTranslation("TXT_APRIL_SHORT"), getRawTranslation("TXT_MAY_SHORT"), getRawTranslation("TXT_JUNE_SHORT"), getRawTranslation("TXT_JULY_SHORT"), getRawTranslation("TXT_AUGUST_SHORT"), getRawTranslation("TXT_SEPTEMBER_SHORT"), getRawTranslation("TXT_OCTOBER_SHORT"), getRawTranslation("TXT_NOVEMBER_SHORT"), getRawTranslation("TXT_DECEMBER_SHORT")];
    var b = "2016:2037";
    var f = new Date();
    a.datetimepicker({
        changeYear: true,
        changeMonth: true,
        constrainInput: true,
        dayNamesMin: e,
        monthNamesShort: c,
        hourText: getRawTranslation("TXT_HOUR"),
        minuteText: getRawTranslation("TXT_MINUTE"),
        timeText: getRawTranslation("TXT_TIME"),
        currentText: getRawTranslation("TXT_NOW"),
        closeText: getRawTranslation("TXT_DONE"),
        showHour: true,
        showMinute: true,
        showSecond: false,
        showMillisec: false,
        showMicrosec: false,
        showTimezone: false,
        yearRange: b,
        hour: f.getHours(),
        minute: f.getMinutes()
    });
    a.attr("readonly", "readonly");
    d.settingNode(a)
}

function updateDateFormatDateTimePicker(a, b) {
    a.find("input").datetimepicker("option", "dateFormat", getDateFormatStringForSetting(b))
}

function getDateTimePicker(c) {
    var b = c.find("input").datetimepicker("getDate");
    if (b == null || b === undefined) {
        return undefined
    } else {
        function d(e) {
            return e < 10 ? "0" + e : e
        }
        var a = b.getFullYear() + "-" + d(b.getMonth() + 1) + "-" + d(b.getDate()) + " " + d(b.getHours()) + ":" + d(b.getMinutes());
        return a
    }
}

function resetDateTimePicker(a) {
    a.find("input").val("")
}

function getDateFormatStringForSetting(a) {
    a = parseInt(a);
    switch (a) {
        case 0:
            return "mm-dd-yy";
        case 1:
            return "dd-mm-yy";
        case 2:
            return "yy-mm-dd";
        default:
            return undefined
    }
}

function initTimePicker(b) {
    var a = b.find("input");
    a.timepicker({
        constrainInput: true,
        hourText: getRawTranslation("TXT_HOUR"),
        minuteText: getRawTranslation("TXT_MINUTE"),
        secondText: getRawTranslation("TXT_SECOND"),
        timeText: getRawTranslation("TXT_TIME"),
        currentText: getRawTranslation("TXT_NOW"),
        closeText: getRawTranslation("TXT_DONE"),
        showHour: true,
        showMinute: true,
        showSecond: true,
        showMillisec: false,
        showMicrosec: false,
        showTimezone: false,
        timeFormat: "HH:mm:ss",
        showButtonPanel: false,
        timeOnlyTitle: getRawTranslation("TXT_CHOOSE_TIME"),
        defaultValue: stored_settings[b.attr("data-setting")].val
    });
    b.settingNode(a)
}

function setTimePicker(b, c) {
    var a = b.find("input")
}

function getTimePicker(d) {
    var b = d.find("input").datetimepicker("getDate");
    if (b == null || b === undefined) {
        return undefined
    }
    var a = b.getHours();
    if (a < 10) {
        a = "0" + a
    }
    var e = b.getMinutes();
    if (e < 10) {
        e = "0" + e
    }
    var c = b.getSeconds();
    if (c < 10) {
        c = "0" + c
    }
    return a + ":" + e + ":" + c
}

function resetTimePicker(a) {
    a.find("input").val(stored_settings[a.attr("data-setting")].val);
    checkIfNodeChanged(a)
}

function initHref(a) {
    a.click(function(b) {
        var c = "";
        if (a.attr("href") !== undefined) {
            c = a.attr("href")
        } else {
            c = a.attr("data-path")
        }
        navigate_to(c, b, {})
    })
}

function initHrefNode(b) {
    var a = b.find("a");
    a.click(function(c) {
        var d = "";
        if (a.attr("href") !== undefined) {
            d = a.attr("href")
        } else {
            d = b.attr("data-path")
        }
        navigate_to(d, c, {})
    });
    initControlNode(b)
}
var NPA_MFP_DATEFORMAT = 16385;
var NPA_MFP_TIMEFORMAT = 16713;

function initShowDateTime(a) {
    a.attr("data-dateformat", getSetting(NPA_MFP_DATEFORMAT).val);
    initHref(a.find("a"));
    displayDateTime(a);
    a.controlNode()
}

function displayDateTime(c) {
    var h = c.find(".setting-node-showdatetime");
    var a;
    var b;
    var g = "hh:mm TT";
    if (getSetting(NPA_MFP_TIMEFORMAT).val == 1) {
        g = "HH:mm"
    }
    var d = getSetting(c.attr("data-setting")).val;
    a = new Date(d * 1000);
    var e = getSetting("TIME_UTC_OFFSET").val;
    a.setUTCSeconds(a.getUTCSeconds() + e);
    b = $.datepicker.formatTime(g, {
        hour: a.getUTCHours(),
        minute: a.getUTCMinutes()
    });
    a = new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
    var f = $.datepicker.formatDate(getDateFormatStringForSetting(c.attr("data-dateformat")), a);
    h.text(f + " " + b)
}

function updateDateFormatShowDateTime(a, b) {
    a.attr("data-dateformat", b);
    displayDateTime(a)
}

function getShowDateTime(a) {
    return getSetting(a.attr("data-setting").val)
}

function refreshShowDateTime(a) {
    var b = 2800;
    timeouts.push(setTimeout(function() {
        reloadContent()
    }, b))
}

function initRadioColorSamples(d) {
    var e = d.parent().find(".setting-node-input-dropdown");
    c(e.find("option:first").attr("colorModel"));
    e.change(function() {
        c(e.find("option:selected").attr("colorModel"))
    });

    function c(h) {
        var f = d.find(".advanced-color-samples-rgb"),
            g = d.find(".advanced-color-samples-cmyk");
        if (h == "RGB") {
            f.show();
            g.hide()
        } else {
            f.hide();
            g.show()
        }
        updateRadioColorSamplesPrintButton(d)
    }
    var b = d.find(".setting-node-input-radio-row");
    a("0");
    b.find("input").click(function() {
        a($(this).val())
    });

    function a(f) {
        var g = d.find(".advanced-color-samples");
        if (f == "0") {
            g.toggle(false)
        } else {
            g.toggle(true)
        }
        updateRadioColorSamplesPrintButton(d)
    }
    d.find(".advanced-color-samples input[type=text]").focusout(function() {
        var k = $(this);
        var l = k.val();
        var f = new RegExp("^[0-9]+$");
        var h = !f.test(l);
        var g = (l > Number(k.attr("data-max")));
        if (h || g) {
            k.addClass("invalid")
        } else {
            k.removeClass("invalid")
        }
        updateRadioColorSamplesPrintButton(d)
    })
}

function updateRadioColorSamplesPrintButton(b) {
    var a = b.closest(".panel-contents").find("button");
    if (b.find("input[type=text].invalid:visible").not(":disabled").length > 0) {
        a.disable()
    } else {
        a.enable()
    }
}

function getRadioColorSamples(a) {}

function setRadioColorSamples(a, b) {}

function initFactoryList(a) {
    var b = a.closest("[data-node]").attr("data-node");
    a.find("button.license-view").each(function() {
        var c = $(this);
        c.click(function() {
            popupLicense(stored_nodes[b]["licenses"][c.attr("data-license-id")])
        })
    });
    a.find(".license-single").each(function() {
        var d = $(this);
        var c = d.find(".license-more");
        if (c.length > 0) {
            c.click(function() {
                var e = c.attr("data-view-id");
                popupLicense(stored_nodes[d.closest("[data-node]").attr("data-node")]["licenses"][e])
            })
        }
    })
}

function initAppsList(b) {
    var c = b.closest("[data-node]").attr("data-node");
    var a = stored_nodes[c]["parts"];
    b.find("button.license-view").each(function() {
        var d = $(this);
        d.click(function() {
            popupLicense(a[d.closest("[data-part]").attr("data-part")]["licenses"][d.attr("data-license-id")])
        })
    });
    b.find("button.license-uninstall").each(function() {
        var d = $(this);
        d.click(function() {
            var e = d.attr("data-license-id");
            var f = a[d.closest("[data-part]").attr("data-part")]["licenses"][e];
            $(".popup-modal-container").popup("init", {
                showCloseButton: true,
                autoHide: true,
                buttonOneId: "TXT_YES",
                buttonTwoId: "TXT_CANCEL",
                messageText: getRawComplexTranslation("TXT_CONFIRM_UNINSTALL_LICENSE", {
                    type: getLicenseTypeText(f),
                    title: f.license.info.name
                }),
                buttonOneCallback: function() {
                    $(".popup-modal-container").popup("init", {
                        showCloseButton: false,
                        autoHide: true,
                        messageText: ""
                    });
                    $(".popup-modal-container").popup("startSpinner");
                    var g = new Communicator();
                    g.addSuccessHandler(function(m) {
                        $(".popup-modal-container").popup("hide");
                        if (m.result.exception !== undefined) {
                            $(".popup-modal-container").popup("init", {
                                showCloseButton: true,
                                autoHide: true,
                                buttonOneId: "TXT_OK",
                                messageText: m.result.exception
                            })
                        } else {
                            var l = d.closest("tr");
                            var h = l.parent();
                            var k = h.parent();
                            l.remove();
                            if (h.find("tr").length == 0) {
                                k.remove()
                            } else {
                                h.find("tr").first().find("td.license-app-leadcol").text(getRawTranslation("TXT_LICENSE"))
                            }
                        }
                    });
                    g.addErrorHandler(function(h) {
                        console.log("FAILURE!");
                        console.log(h)
                    });
                    g.sendData(DO_DELETE_PATH + "/" + c + "/" + f.id, "DELETE", b, "json", {})
                }
            })
        })
    })
}

function popupLicense(k) {
    var c = $("<div></div>");
    var d = $("<div class='license-popup-info'></div>");
    var l = getRawTranslation("TXT_NA");
    var a = "UNKNOWN LICENSE NAME";
    var b = l;
    var n = l;
    if (k.license.info !== undefined) {
        if (k.license.info.name !== undefined) {
            a = k.license.info.name
        }
        if (k.license.info.part.partNumber !== undefined) {
            b = k.license.info.part.partNumber
        }
        if (k.license.info.part.partRevision !== undefined) {
            n = k.license.info.part.partRevision
        }
    }
    d.append($("<div class='license-popup-name'>" + a + "</div>"));
    d.append($("<div class='license-popup-id'>" + getRawTranslation("TXT_DEVICE_WEB_ID") + ": " + k.id + "</div>"));
    d.append($("<div class='license-popup-part'>" + getRawTranslation("TXT_PART_NUMBER") + ": " + b + "</div>"));
    d.append($("<div class='license-popup-revision'>" + getRawTranslation("TXT_REVISION") + ": " + n + "</div>"));
    c.append(d);
    if (k.license.notice !== undefined && k.license.notice.length > 0) {
        c.append($("<div class='license-popup-notice'>" + k.license.notice + "</div>"))
    }
    c.append($("<hr />"));
    var h = $("<div class='license-popup-stats'></div>");
    h.append($("<div class='license-popup-status'>" + getRawTranslation("TXT_STATUS") + ": " + (k.isValid ? getRawTranslation("TXT_VALID") : getRawTranslation("TXT_EXPIRED")) + "</div>"));
    h.append($("<div class='license-popup-type'>" + getRawTranslation("TXT_TYPE") + ": " + getLicenseTypeText(k) + "</div>"));
    h.append($("<div class='license-popup-issued'>" + getRawTranslation("TXT_ISSUED") + ": " + (k.license.issued === undefined ? l : k.license.issued) + "</div>"));
    h.append($("<div class='license-popup-starts'>" + getRawTranslation("TXT_STARTS") + ": " + (k.license.startDate === undefined ? l : k.license.startDate) + "</div>"));
    h.append($("<div class='license-popup-expires'>" + getRawTranslation("TXT_EXPIRES") + ": " + (k.license.endDate === undefined ? l : k.license.endDate) + "</div>"));
    c.append(h);
    var e = k.license.features;
    var f = $("<div></div>");
    var o = $("<table class='feature-list-table-popup'></table>");
    var m = $("<thead><tr><th data-col='feat-name-pop'>" + getRawTranslation("TXT_FEATURE") + "</th><th data-col='feat-version-pop'>" + getRawTranslation("TXT_VERSION") + "</th><th data-col='feat-data-pop'>" + getRawTranslation("TXT_DATA") + "</th><th data-col='feat-count-pop'>" + getRawTranslation("TXT_COUNT") + "</th></tr></thead>");
    o.append(m);
    var g = $("<tbody></tbody>");
    $.each(e, function(q, r) {
        var p = $("<tr></tr>");
        p.append($("<td>" + r.name + "</td>"));
        p.append($("<td>" + r.version + "</td>"));
        p.append($("<td>" + (r.data !== undefined ? r.data : "") + "</td>"));
        p.append($("<td>" + (r.count == "infinite" ? l : r.count) + "</td>"));
        g.append(p)
    });
    o.append(g);
    f.append(o);
    c.append(f);
    $(".popup-modal-container").popup("init", {
        showCloseButton: true,
        buttonOneId: "TXT_OK",
        autoHide: true,
        messageText: c.html()
    })
}

function getLicenseTypeText(b) {
    var a = b.license.type;
    if (a == "factory") {
        return getRawTranslation("TXT_FACTORY")
    } else {
        if (a == "trial") {
            return getRawTranslation("TXT_TRIAL")
        } else {
            if (b.license.endDate !== undefined) {
                return getRawTranslation("TXT_TERM")
            } else {
                return getRawTranslation("TXT_STANDARD")
            }
        }
    }
}

function initResetBlock(a) {
    var c = $("#reset-sanitize-memory").closest(".reset-contents").find(".reset-lesser-erasure input");
    var b = $("#reset-sanitize-disk").closest(".reset-contents").find(".reset-lesser-erasure input[type=checkbox]");
    a.find("input[name=reset-sanitize-memory]").change(function(e) {
        var d = $(e.target);
        if (d.is(":checked")) {
            $("#reset-sanitize-memory").addClass("reset-suboption-highlighted");
            c.prop("checked", true)
        } else {
            $("#reset-sanitize-memory").removeClass("reset-suboption-highlighted");
            c.prop("checked", false);
            $("#reset-sanitize-memory-suboptions input").prop("checked", false)
        }
    });
    c.change(function(d) {
        if (c.length != $("#reset-sanitize-memory").closest(".reset-contents").find(".reset-lesser-erasure input:checked").length) {
            a.find("input[name=reset-sanitize-memory]").prop("checked", false);
            $("#reset-sanitize-memory").removeClass("reset-suboption-highlighted")
        }
    });
    a.find("input[name=reset-sanitize-disk]").change(function(e) {
        var d = $(e.target);
        if (d.is(":checked")) {
            $("#reset-sanitize-disk").addClass("reset-suboption-highlighted");
            b.prop("checked", true).change();
            $("#reset-erase-held-jobs input[value=3]").prop("checked", true)
        } else {
            $("#reset-sanitize-disk").removeClass("reset-suboption-highlighted");
            b.prop("checked", false).change();
            $("#reset-sanitize-disk-suboptions input").prop("checked", false)
        }
    });
    b.change(function(d) {
        if (b.length != $("#reset-sanitize-disk").closest(".reset-contents").find(".reset-lesser-erasure input[type=checkbox]:checked").length) {
            a.find("input[name=reset-sanitize-disk]").prop("checked", false);
            $("#reset-sanitize-disk").removeClass("reset-suboption-highlighted")
        }
    });
    a.find("input[name=reset-erase-held-jobs]").change(function(e) {
        var d = $(e.target);
        if (d.is(":checked")) {
            var f = a.find("input[name=reset-erase-held-jobs-type]");
            f.removeAttr("disabled").prop("checked", false);
            if (f.length == 0) {
                console.error("Why does the Erase Held Jobs checkbox exist if there's no radio buttons underneath it?");
                return
            } else {
                if (f.length == 1) {
                    f.prop("checked", true)
                } else {
                    if (a.find("input[value=2]").length > 0) {
                        a.find("input[value=2]").prop("checked", true)
                    } else {
                        if (a.find("input[value=0]").length > 0) {
                            a.find("input[value=0]").prop("checked", true)
                        }
                    }
                }
            }
        } else {
            a.find("input[name=reset-erase-held-jobs-type]").attr("disabled", "1").prop("checked", false);
            $("#reset-erase-held-jobs input").prop("checked", false)
        }
    }).change();
    a.find("input").change(function() {
        updateResetBlockStartButton(a)
    });
    a.find("input[name=reset-erase-held-jobs-type]").change(function(e) {
        var d = $(e.target);
        if (d.val() != 3) {
            a.find("input[name=reset-sanitize-disk]").prop("checked", false);
            $("#reset-sanitize-disk").removeClass("reset-suboption-highlighted")
        }
    });
    a.find("button[name=reset-printer-reset]").click(function() {
        resetResetBlock(a)
    });
    a.find("button[name=reset-printer-start]").click(function() {
        displayResetPopup(a)
    });
    updateResetBlockStartButton(a)
}

function resetResetBlock(a) {
    a.find("input").prop("checked", false).change()
}

function saveResetBlock(a) {
    console.warn("All right, who just tried to call save on the printer reset block?")
}

function updateResetBlockStartButton(a) {
    if (a.find("input[type=checkbox]:checked").length > 0) {
        if ((a.find("input[name=reset-sanitize-memory]").is(":checked") && a.find("input[name=reset-sanitize-memory-boot]:checked").length == 0) || (a.find("input[name=reset-sanitize-disk]").is(":checked") && a.find("input[name=reset-sanitize-disk-passes]:checked").length == 0) || (a.find("input[name=reset-erase-held-jobs]").is(":checked") && a.find("input[name=reset-erase-held-jobs-type]:checked").length == 0)) {
            a.find("button[name=reset-printer-start]").disable();
            a.find("button[name=reset-printer-reset]").enable()
        } else {
            a.find("button[name=reset-printer-start]").enable();
            a.find("button[name=reset-printer-reset]").enable()
        }
    } else {
        a.find("button[name=reset-printer-start]").disable();
        a.find("button[name=reset-printer-reset]").disable()
    }
}

function displayResetPopup(e) {
    if (e.find("input:checked").length == 0) {
        console.error("Nothing's been checked for reset!  How'd the start button get clicked?");
        return
    }
    var d = {};
    var a;
    if (e.find("input[name=reset-sanitize-memory]").is(":checked")) {
        d.sanitizeMemory = 1;
        a = e.find("input[name=reset-sanitize-memory-boot]:checked");
        if (a.length == 0) {
            console.error("Sanitize Memory is selected, but there's nothing to indicate what to do on the next boot!");
            return
        }
        d.afterSanitizeMemory = a.attr("value")
    }
    if (e.find("input[name=reset-erase-settings]").is(":checked")) {
        d.eraseSettings = 1
    }
    if (e.find("input[name=reset-erase-app-settings]").is(":checked")) {
        d.eraseAppSettings = 1
    }
    if (e.find("input[name=reset-erase-shortcut-settings]").is(":checked")) {
        d.eraseShortcutSettings = 1
    }
    if (e.find("input[name=reset-sanitize-disk]").is(":checked")) {
        d.sanitizeHardDisk = 1;
        a = e.find("input[name=reset-sanitize-disk-passes]:checked");
        if (a.length == 0) {
            console.error("Sanitize Hard Disk is selected, but I don't know how many passes we need to do on the wipe!");
            return
        }
        d.sanitizeWipeCount = a.attr("value")
    }
    if (e.find("input[name=reset-erase-downloads]").is(":checked")) {
        d.eraseDownloads = 1
    }
    if (e.find("input[name=reset-erase-buffered-jobs]").is(":checked")) {
        d.eraseBufferedJobs = 1
    }
    if (e.find("input[name=reset-erase-held-jobs]").is(":checked")) {
        d.eraseHeldJobs = 1;
        a = e.find("input[name=reset-erase-held-jobs-type]:checked");
        if (a.length == 0) {
            console.error("Erase Held Jobs is selected, but I don't know what range of held jobs should be erased!");
            return
        }
        d.eraseHeldJobsType = a.attr("value")
    }
    var c = $("<div></div>");
    c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_THIS_OPERATION_WILL") + "</p>"));
    var b = $("<ul class='popup-list'></ul>");
    if (doesThisResetNeedReboot(d)) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_REBOOT_THE_PRINTER") + "</li>"))
    }
    if (d.sanitizeMemory) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_SANITIZE_MEMORY") + "</li>"))
    }
    if (d.eraseSettings) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_PRINTER_NETWORK_SETTINGS") + "</li>"))
    }
    if (d.eraseFlash) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_USER_JOBS") + "</li>"))
    }
    if (d.eraseAppSettings) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_APP_SETTINGS") + "</li>"))
    }
    if (d.eraseShortcutSettings) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_SHORTCUT_SETTINGS") + "</li>"))
    }
    if (d.eraseDownloads) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_DOWNLOADS") + "</li>"))
    }
    if (d.eraseBufferedJobs) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_BUFFERED_JOBS") + "</li>"))
    }
    if (d.eraseHeldJobsType == 0) {
        b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_RESERVE_HELD_JOBS") + "</li>"))
    } else {
        if (d.eraseHeldJobsType == 1) {
            b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_CONFIDENTIAL_HELD_JOBS") + "</li>"))
        } else {
            if (d.eraseHeldJobsType == 2) {
                b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_NON_RECOVERED_HELD_JOBS") + "</li>"))
            } else {
                if (d.eraseHeldJobsType == 3) {
                    b.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_ERASE_ALL_HELD_JOBS") + "</li>"))
                }
            }
        }
    }
    c.append(b);
    if (d.sanitizeWipeCount == 1) {
        c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_1_PASS_ERASE") + "</p>"))
    } else {
        if (d.sanitizeWipeCount == 3) {
            c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_3_PASS_ERASE") + "</p>"))
        } else {
            if (d.sanitizeWipeCount == 7) {
                c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_7_PASS_ERASE") + "</p>"))
            }
        }
    }
    if (d.afterSanitizeMemory == 0) {
        c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_FINISH_WITH_FIRST_BOOT_WIZARD") + "</p>"))
    } else {
        if (d.afterSanitizeMemory == 1) {
            c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_FINISH_IN_OFFLINE_MODE") + "</p>"))
        }
    }
    c.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_ARE_YOU_SURE") + "</p>"));
    $(".popup-modal-container").popup({
        messageText: c.html(),
        buttonOneId: "TXT_CANCEL",
        buttonTwoId: "TXT_START",
        buttonTwoCallback: function() {
            doPrinterReset(e, d)
        },
        showCloseButton: true
    })
}

function doPrinterReset(c, b) {
    if (doesThisResetNeedReboot(b)) {
        var d;
        if (b.afterSanitizeMemory == 1) {
            d = getRawTranslation("TXT_PRINTER_IS_REBOOTING_TO_OFFLINE")
        } else {
            d = getRawTranslation("TXT_PRINTER_IS_REBOOTING_PLEASE_RELOAD")
        }
        c.popup({
            messageText: d,
            showCloseButton: false
        });

        function a(e) {
            e.popup("hide");
            displayResultPopup(e, 0, getRawTranslation("TXT_PRINTER_WIPE_FAILED"))
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/webglue/reset/wipedisk",
            data: b,
            success: function(e) {
                if (e.rc != 1) {
                    a(c)
                }
            }
        })
    } else {
        c.popup({
            showCloseButton: false
        }).popup("startSpinner");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/webglue/reset/wipedisk",
            data: b,
            success: function(e) {
                c.popup("hide");
                displayResultPopup(c, 1, getRawTranslation("TXT_PRINTER_WIPE_SUCCESS"))
            },
            error: function(e) {
                a(c)
            }
        })
    }
}

function doesThisResetNeedReboot(a) {
    if (a.sanitizeMemory || a.sanitizeHardDisk || a.eraseBufferedJobs) {
        return true
    } else {
        return false
    }
}

function initFactoryDefaultsBlock(a) {
    a.find("input[name=factory-defaults-all]").change(function(c) {
        var b = $(c.target);
        if (b.is(":checked")) {
            $("#factory-defaults-suboptions input").prop("checked", true).change()
        } else {
            $("#factory-defaults-suboptions input").prop("checked", false).change()
        }
    });
    $("#factory-defaults-suboptions input").change(function(b) {
        if ($("#factory-defaults-suboptions input").length != $("#factory-defaults-suboptions input:checked").length) {
            a.find("input[name=factory-defaults-all]").prop("checked", false)
        } else {
            a.find("input[name=factory-defaults-all]").prop("checked", true)
        }
        updateFactoryDefaultsStartButton(a)
    });
    $("button[name=factory-defaults-start]").click(function() {
        displayFactoryDefaultsPopup(a)
    });
    $("button[name=factory-defaults-reset]").click(function() {
        resetFactoryDefaultsBlock(a)
    });
    updateFactoryDefaultsStartButton(a)
}

function updateFactoryDefaultsStartButton(a) {
    if (a.find("input:checked").length > 0) {
        a.find("button[name=factory-defaults-start]").enable();
        a.find("button[name=factory-defaults-reset]").enable()
    } else {
        a.find("button[name=factory-defaults-start]").disable();
        a.find("button[name=factory-defaults-reset]").disable()
    }
}

function resetFactoryDefaultsBlock(a) {
    a.find("input").prop("checked", false).change()
}

function displayFactoryDefaultsPopup(d) {
    if (d.find("input:checked").length == 0) {
        console.error("Nothing's been checked for factory defaults!  How'd the start button get clicked?");
        return
    }
    var c = {};
    var b = $("<div></div>");
    b.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_THIS_OPERATION_WILL") + "</p>"));
    var a = $("<ul class='popup-list'></ul>");
    if (d.find("input[name=factory-defaults-printer]").is(":checked")) {
        c.factoryPrinter = 1
    }
    if (d.find("input[name=factory-defaults-network]").is(":checked")) {
        c.factoryNetwork = 1
    }
    if (d.find("input[name=factory-defaults-fax]").is(":checked")) {
        c.factoryFax = 1
    }
    if (d.find("input[name=factory-defaults-apps]").is(":checked")) {
        c.factoryApps = 1
    }
    if ((c.factoryPrinter) && (c.factoryNetwork) && (c.factoryFax) && (c.factoryApps)) {
        c.everything = 1;
        a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_REBOOT_THE_PRINTER") + "</li>");
        a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_EVERYTHING") + "</li>");
        a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_NON_STANDARD_APPS") + "</li>")
    } else {
        if (c.factoryApps) {
            a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_REBOOT_THE_PRINTER") + "</li>")
        }
        if (c.factoryPrinter) {
            a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_PRINTER") + "</li>")
        }
        if (c.factoryNetwork) {
            a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_NETWORK") + "</li>")
        }
        if (c.factoryFax) {
            a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_FAX") + "</li>")
        }
        if (c.factoryApps) {
            a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_NON_STANDARD_APPS") + "</li>");
            a.append("<li>" + getStoredTranslation("TXT_RESET_POPUP_FACTORY_APPS") + "</li>")
        }
    }
    b.append(a);
    b.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_ARE_YOU_SURE") + "</p>"));
    $(".popup-modal-container").popup({
        messageText: b.html(),
        buttonOneId: "TXT_CANCEL",
        buttonTwoId: "TXT_START",
        buttonTwoCallback: function() {
            doFactoryDefaults(d, c)
        },
        showCloseButton: true
    })
}

function doFactoryDefaults(b, a) {
    b.popup({
        showCloseButton: false
    }).popup("startSpinner");
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/webglue/reset/factoryreset",
        data: a,
        complete: function(c) {
            b.popup("hide");
            if (a.factoryApps || a.everything) {
                showRebootingPanel(b)
            } else {
                window.location.reload()
            }
        }
    })
}

function initCheckboxedEnumBlock(b) {
    var c = b.find("input");
    b.settingNode(c);
    var a = getSetting(b.attr("data-setting")).val;
    mapValueToEnumState(b, a);
    b.find("a").click(function() {
        $(".popup-modal-container").modalPopup("display", b.data("child"), undefined)
    });
    b.find("input[option=enum_value_3]").change(function(e) {
        var d = $(e.target);
        b.find("input[option=enum_value_1]").attr("disabled", "1").prop("checked", true);
        b.find("input[option=enum_value_2]").attr("disabled", "1").prop("checked", true);
        b.find("input[option=enum_value_0]").prop("checked", false);
        if (!(d.is(":checked"))) {
            b.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", true)
        }
        b.attr("cval", 3)
    });
    b.find("input[option=enum_value_2]").change(function(e) {
        var d = $(e.target);
        b.find("input[option=enum_value_1]").attr("disabled", "1").prop("checked", true);
        b.find("input[option=enum_value_0]").prop("checked", false);
        if (!(d.is(":checked"))) {
            b.find("input[option=enum_value_2]").removeAttr("disabled").prop("checked", true)
        }
        b.attr("cval", 2)
    });
    b.find("input[option=enum_value_1]").change(function(e) {
        var d = $(e.target);
        b.find("input[option=enum_value_0]").prop("checked", false);
        if (!(d.is(":checked"))) {
            b.find("input[option=enum_value_1]").removeAttr("disabled").prop("checked", true)
        }
        b.attr("cval", 1)
    });
    b.find("input[option=enum_value_0]").change(function(e) {
        var d = $(e.target);
        b.find("input[option=enum_value_1]").removeAttr("disabled").prop("checked", false);
        b.find("input[option=enum_value_2]").removeAttr("disabled").prop("checked", false);
        b.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", false);
        if (!(d.is(":checked"))) {
            b.find("input[option=enum_value_0]").removeAttr("disabled").prop("checked", true)
        }
        b.attr("cval", 0)
    })
}

function getOptInCheckboxedEnum(b) {
    var e = b.data("setting");
    var a = stored_settings[e].val;
    var d = Number(b.attr("cval"));
    var c = getValueFromEnumState(b, a, d);
    return c
}

function setOptInCheckboxedEnum(b, c) {
    mapValueToEnumState(b, c);
    var a = b.find("input[option=enum_value_" + c + "]");
    a.trigger("change")
}

function markOptInCheckboxedEnum(a, b) {}

function mapValueToEnumState(a, b) {
    switch (b) {
        case 3:
            a.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", true);
            a.find("input[option=enum_value_1]").attr("disabled", "1").prop("checked", true);
            a.find("input[option=enum_value_2]").attr("disabled", "1").prop("checked", true);
            a.find("input[option=enum_value_0]").prop("checked", false);
            a.attr("cval", 3);
            break;
        case 2:
            a.find("input[option=enum_value_2]").removeAttr("disabled").prop("checked", true);
            a.find("input[option=enum_value_1]").attr("disabled", "1").prop("checked", true);
            a.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_0]").prop("checked", false);
            a.attr("cval", 2);
            break;
        case 1:
            a.find("input[option=enum_value_1]").removeAttr("disabled").prop("checked", true);
            a.find("input[option=enum_value_2]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_0]").prop("checked", false);
            a.attr("cval", 1);
            break;
        case 0:
            a.find("input[option=enum_value_0]").prop("checked", true);
            a.find("input[option=enum_value_1]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_2]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", false);
            a.attr("cval", 0);
            break;
        default:
            a.find("input[option=enum_value_0]").prop("checked", false);
            a.find("input[option=enum_value_1]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_2]").removeAttr("disabled").prop("checked", false);
            a.find("input[option=enum_value_3]").removeAttr("disabled").prop("checked", false);
            a.attr("cval", 255);
            break
    }
}

function getValueFromEnumState(c, b, d) {
    var a = b;
    if (b == d) {
        if (c.find("input[option=enum_value_1]").is(":checked")) {
            if ((255 == b) || (0 == b)) {
                a = 1
            }
        } else {
            if (1 == d) {
                a = 1
            }
        }
        if (c.find("input[option=enum_value_2]").is(":checked")) {
            if ((255 == b) || (0 == b) || (1 == b)) {
                a = 2
            }
        } else {
            if (2 == d) {
                a = 2
            }
        }
        if (c.find("input[option=enum_value_3]").is(":checked")) {
            if ((255 == b) || (1 == b) || (2 == b) || (0 == b)) {
                a = 3
            }
        } else {
            if (3 == d) {
                a = 3
            }
        }
        if (c.find("input[option=enum_value_0]").is(":checked")) {
            if ((1 == b) || (2 == b) || (3 == b) || (255 == b)) {
                a = 0
            }
        } else {
            if (0 == d) {
                a = 0
            }
        }
    } else {
        if (0 == d) {
            a = 0;
            if ((c.find("input[option=enum_value_1]").is(":checked")) && (!c.find("input[option=enum_value_2]").is(":checked")) && (!c.find("input[option=enum_value_3]").is(":checked"))) {
                a = 1
            }
            if ((c.find("input[option=enum_value_2]").is(":checked")) && (!c.find("input[option=enum_value_3]").is(":checked"))) {
                a = 2
            }
            if (c.find("input[option=enum_value_3]").is(":checked")) {
                a = 3
            }
            if (!c.find("input[option=enum_value_0]").is(":checked")) {
                a = 0
            }
        }
        if (1 == d) {
            a = 1;
            if (c.find("input[option=enum_value_0]").is(":checked")) {
                a = 0
            }
            if ((c.find("input[option=enum_value_2]").is(":checked")) && (!c.find("input[option=enum_value_3]").is(":checked"))) {
                a = 2
            }
            if (c.find("input[option=enum_value_3]").is(":checked")) {
                a = 3
            }
            if (!c.find("input[option=enum_value_1]").is(":checked")) {
                a = 1
            }
        }
        if (2 == d) {
            a = 2;
            if (c.find("input[option=enum_value_0]").is(":checked")) {
                a = 0
            }
            if (c.find("input[option=enum_value_3]").is(":checked")) {
                a = 3
            }
            if (!c.find("input[option=enum_value_2]").is(":checked")) {
                a = 2
            }
        }
        if (3 == d) {
            a = 3;
            if (c.find("input[option=enum_value_0]").is(":checked")) {
                a = 0
            }
            if (!c.find("input[option=enum_value_3]").is(":checked")) {
                a = 3
            }
        }
        if (255 == d) {
            a = 255;
            if ((c.find("input[option=enum_value_1]").is(":checked")) && (!c.find("input[option=enum_value_2]").is(":checked")) && (!c.find("input[option=enum_value_3]").is(":checked"))) {
                a = 1
            }
            if ((c.find("input[option=enum_value_2]").is(":checked")) && (!c.find("input[option=enum_value_3]").is(":checked"))) {
                a = 2
            }
            if (c.find("input[option=enum_value_3]").is(":checked")) {
                a = 3
            }
            if ((!c.find("input[option=enum_value_1]").is(":checked")) && (!c.find("input[option=enum_value_2]").is(":checked")) && (!c.find("input[option=enum_value_3]").is(":checked")) && (c.find("input[option=enum_value_0]").is(":checked"))) {
                a = 0
            }
        }
    }
    return a
}

function initRadioEnumSelectDropdown(c) {
    var e = c.find("input:radio");
    c.settingNode(e);
    var d = c.attr("data-setting");
    var a = getSetting(d);
    var b = a.data;
    if (b != undefined) {
        populatedropdownOptions(c, b)
    }
    e.change(function() {
        var k = $(this);
        var f = k.val();
        if (f == 0) {
            c.find('[type="hidden"]').attr("value", "/")
        } else {
            var g = c.find("select").val();
            var h = c.find("option[value=" + g + "]").text();
            c.find('[type="hidden"]').attr("value", "/" + h + "/")
        }
        checkIfNodeChanged(c);
        updateButtonRow(c)
    })
}

function populatedropdownOptions(a, f) {
    var e = a.find("input:radio[id=" + a.data("setting") + "_1]");
    e.css("visibility", "hidden");
    var g = a.find(".setting-node-input-dropdown");
    g.attr("style", "visibility:hidden");
    var h = a.attr("data-setting");
    var k = getSetting(h);
    for (var d = 0; d < f.length; d++) {
        var c = f[d];
        if ((c.fileType == "directory" || c.fileType == "secure directory") && c.name != "/") {
            if (h == "BOOKMARK_PARENT_FOLDER") {
                processOptionsValue(a, e, g, c, k, d)
            } else {
                if (!isReferrenceToSelf(c, k)) {
                    processOptionsValue(a, e, g, c, k, d)
                }
            }
        }
    }
    if (k.val == "/") {
        var b = g.find("option").first();
        g.val(b.val())
    }
    g.change(function() {
        var l = a.find("select").val();
        var m = a.find("option[value=" + l + "]").text();
        a.find('[type="hidden"]').attr("value", "/" + m + "/");
        a.find("input:radio[value=1]").prop("checked", true);
        checkIfNodeChanged(a);
        updateButtonRow(a)
    })
}

function processOptionsValue(f, e, a, g, d, b) {
    var c = '<option value="' + b + '" role="option">' + g.name + "</option>";
    a.append(c);
    if ("/" + g.name + "/" == d.val) {
        a.val(b);
        f.find("input:radio[value=1]").prop("checked", true)
    }
    if (e.css("visibility") == "hidden") {
        e.css("visibility", "visible");
        a.attr("style", "visibility:visible")
    }
}

function isReferrenceToSelf(c, a) {
    var b = a.val + a.folderName;
    if (b.slice(1) == c.name) {
        return true
    } else {
        return false
    }
}

function setRadioEnumSelectDropdown(b, c) {
    if (getRadioEnumSelectDropdown(b, c) == c) {
        return
    }
    var d = b.attr("data-setting");
    var a = getSetting(d);
    b.find('[type="hidden"]').attr("value", a.val)
}

function getRadioEnumSelectDropdown(a, b) {
    return a.find('[type="hidden"]').val()
}

function resetRadioEnumSelectDropdown(f) {
    var g = f.attr("data-setting");
    var e = getSetting(g);
    var d = f.find(".setting-node-input");
    var c = f.find('[type="hidden"]').val();
    if (c != e.val) {
        d.find('[type="hidden"]').attr("value", e.val);
        if (e.val == "/") {
            d.find("input:radio[value=0]").prop("checked", true)
        } else {
            d.find("input:radio[value=1]").prop("checked", true)
        }
    }
    var a = f.find(".setting-node-input-dropdown");
    if (a != undefined) {
        var b = e.val.slice(1, -1);
        f.find("option").each(function() {
            if (b == $(this).text()) {
                a.val($(this).val())
            }
        })
    }
    checkIfNodeChanged(f);
    updateButtonRow($(".setting-buttons"))
}

function initSaveResetButtons(a) {
    a.find(".setting-save").closest(".setting-contents").parent().each(function() {
        var f = $(this);
        var b = f.find(".setting-buttons");
        var e = f.find("[data-action*=save]");
        var d = f.find("[data-action=reset]");
        var c = f.find("[data-action=restore-defaults-with-confirmation]");
        var h = f.find(".setting-button-row").data("navback");
        var g = e.data("verify");
        var k = e.data("verifyfunction");
        e.click(function() {
            if (h) {
                saveNodes(f, function() {
                    popBreadcrumb(h)
                }, true)
            } else {
                if (g) {
                    saveAndVerifyNodes(f, function() {
                        if (typeof $.fn[k] === "function") {
                            $.fn[k]()
                        }
                    })
                } else {
                    saveNodes(f)
                }
            }
        });
        d.click(function() {
            resetNodes(f)
        });
        if (c != undefined) {
            c.click(function() {
                showRestoreDefaultsPrompt(f)
            })
        }
        updateButtonRow($(this).find("[data-node]").first())
    })
}

function saveAndVerifyNodes(b, c) {
    var a = new InputHandler();
    a.saveNodes(b, c, true, true)
}

function saveNodes(b, d, c) {
    var a = new InputHandler();
    a.saveNodes(b, d, c)
}

function saveNode(b, c) {
    var a = new InputHandler();
    a.saveNode(b, c)
}

function checkIfNodeRequired(e) {
    if (e.attr("disabled")) {
        return true
    }
    var b = false;
    var a = false;
    if (e.data("requiredcondition")) {
        var d = $("#" + e.data("requiredcondition"));
        var c = d.find(".setting-node-input-text").val();
        if ((c != undefined) && (c !== "")) {
            a = true
        }
    }
    if (e.data("required") || a) {
        var f = getNodeValue(e);
        if ((f != undefined) && (f !== "")) {
            b = true
        }
        setNodeState(e.find(".setting-node-input"), undefined, b)
    }
    return b
}

function checkIfNodeChanged(d) {
    var h = d.closest(".setting-contents").parent();
    var l = h.find("[data-action=restoreDefaults]");
    var o = d.data("setting");
    var b = d.attr("data-no-change-check");
    if (b == 1) {
        return
    }
    if (o == undefined || o == "" || d.is("[data-unchanging]")) {
        return
    }
    var m = getNodeValue(d);
    var f = getSetting(o);
    var c = true;
    if (f != undefined) {
        if (o == "BOOKMARK_URL") {
            c = (m != f.completeURL) && (m != f.val)
        } else {
            if (f.values != undefined) {
                c = false;
                if (f.values.length == m.length) {
                    for (i in f.values) {
                        if (f.values[i] != m[i]) {
                            c = true;
                            break
                        }
                    }
                }
            } else {
                if (f.val != undefined) {
                    c = (m != f.val)
                } else {
                    if (f.data) {
                        if (f.data.length == m.length) {
                            c = false;
                            for (i in f.data) {
                                if (f.data[i].id != m[i]) {
                                    c = true;
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var a = true;
    var g = getSetting(o).fctVal;
    if (l != undefined && g != undefined) {
        a = (m != g)
    }
    var n = false;
    var e = d.data("control-node");
    if (e != undefined && e != "") {
        var k = $("#" + e + " div[data-setting]");
        if (k.length && k.data("setting") == o) {
            n = (k.hasClass("setting-changed") ? true : false)
        }
    }
    if (m != undefined && (n || (c && !d.hasClass("setting-changed")))) {
        d.addClass("setting-changed");
        updateExternalCallbackList(d.parent().attr("data-callback"), d.attr("data-setting"), 1)
    } else {
        if (m == undefined || (!c && d.hasClass("setting-changed"))) {
            d.removeClass("setting-changed");
            updateExternalCallbackList(d.parent().attr("data-callback"), d.attr("data-setting"), 0)
        }
    }
    if (m != undefined && (n || (a && !d.hasClass("setting-factory-changed")))) {
        d.addClass("setting-factory-changed")
    } else {
        if (m == undefined || (!a && d.hasClass("setting-factory-changed"))) {
            d.removeClass("setting-factory-changed")
        }
    }
    $("[data-control-node=" + d.parent().attr("id") + "]").each(function() {
        if (($(this).parent().attr("id") == d.data("control-node")) && d.parent().attr("id") == $(this).data("control-node")) {} else {
            checkIfNodeChanged($(this))
        }
    })
}

function setNodeState(b, c, a) {
    if (a) {
        b.removeClass("invalid")
    } else {
        b.addClass("invalid")
    }
}

function countChangedNodes(b) {
    var a = b.closest(".setting-contents").parent();
    return a.find(".setting-changed").filter(":visible").not(".schedule .setting-changed:hidden, :disabled, [data-control-disabled]").length
}

function countFactoryChangedNodes(b) {
    var a = b.closest(".setting-contents").parent();
    return a.find(".setting-factory-changed").filter(":visible").not(".schedule .setting-factory-changed:hidden, :disabled, [data-control-disabled]").length
}

function countInvalidNodes(b) {
    var a = b.closest(".setting-contents").parent();
    return a.find(".invalid, .invalid-node, .schedule-conflict[data-deleted!=1], .conflict").filter(":visible").not(".schedule-conflict:hidden, :disabled, [data-control-disabled]").length
}

function updateButtonRow(f) {
    var b = f.closest(".setting-contents").parent();
    var e = b.find("[data-action*=save], [data-action=saveAndDownload], [data-action=createGroup], [data-action=saveAndWait]");
    var d = b.find("[data-action=reset]");
    var g = b.find("[data-action=restoreDefaults]");
    var a = 0;
    if (f.is(":visible")) {
        a = countInvalidNodes(f)
    }
    var c = countChangedNodes(f);
    if (c > 0) {
        d.enable();
        if (a == 0) {
            e.enable()
        }
    } else {
        d.disable()
    }
    if (g != undefined) {
        if (countFactoryChangedNodes(f) > 0) {
            g.enable()
        } else {
            g.disable()
        }
    }
    if (c == 0 || a > 0 || saveConditionsNotMet(f)) {
        e.disable()
    }
}

function saveConditionsNotMet(a) {
    if ($(".popup-modal").length && getNodeName(a.closest(".popup-modal")) == "OcrRecognizedLanguagesPopup") {
        return (allowOcrLangSave(a) == false)
    }
    return false
}

function updateTopButtonRow(a) {
    var b = a.attr("data-setting");
    $($.find(".top-button-container")).each(function() {
        if (b == "BOOKMARKS_LIST") {
            var c = (getList(a).length > 0);
            $(this).find("[data-action*=Delete]").each(function() {
                if (c) {
                    $(this).find("button").enable()
                } else {
                    $(this).find("button").disable()
                }
            })
        }
    })
}

function checkNodeValue(elem) {
    var nodeType = elem.attr("data-setting-type");
    var valid = true;
    checkNodeStr = "check" + nodeType;
    if (eval("typeof " + checkNodeStr) == typeof(Function)) {
        valid = eval(checkNodeStr + "(elem)")
    }
    return valid
}

function getNodeValue(elem) {
    var nodeType = elem.attr("data-setting-type");
    var value;
    getNodeStr = "get" + nodeType;
    if (eval("typeof " + getNodeStr) == typeof(Function)) {
        value = eval(getNodeStr + "(elem)")
    } else {
        console.warn("NodeType " + nodeType + " doesn't have a get method yet!")
    }
    return value
}

function setNodeValue(elem, value) {
    var nodeType = elem.attr("data-setting-type");
    setNodeStr = "set" + nodeType;
    if (eval("typeof " + setNodeStr) == typeof(Function)) {
        eval(setNodeStr + "(elem,value)")
    } else {
        console.warn("NodeType " + nodeType + " doesn't have a set method yet!")
    }
}

function markSetting(elem, mark) {
    var settingType = elem.attr("data-setting-type");
    setSettingStr = "mark" + settingType + "(elem,mark)";
    try {
        eval(setSettingStr)
    } catch (err) {
        console.warn("SettingType " + settingType + " doesn't have a mark method yet!")
    }
    updateButtonRow(elem);
    if (mark == "conflict" || mark == "invalid") {
        var panel = elem.parents(".panel").first();
        var panelControl = panel.find(".panel-header");
        if (!panelControl.hasClass("panel-header-toggled")) {
            panel.panel("open")
        }
    }
}

function resetNodes(context) {
    context.find("div[data-setting-type]").each(function() {
        var elem = $(this);
        var nodeType = elem.attr("data-setting-type");
        var resetNodeFunc = "reset" + nodeType;
        if (eval("typeof " + resetNodeFunc) == typeof(Function)) {
            eval(resetNodeFunc + "(elem)")
        } else {
            resetNode(elem)
        }
    });
    updateButtonRow(context.find(".setting-buttons"))
}

function resetNode(c) {
    var b = c.data("setting");
    var a;
    if (b) {
        a = getSetting(b).val;
        if (a == undefined) {
            a = getSetting(b).values
        }
        setNodeValue(c, a);
        checkIfNodeRequired(c)
    } else {
        console.warn("Unable to reset node: data ID not found")
    }
}

function getValueMap(d) {
    var a = d.attr("data-value-map");
    if (a == undefined) {
        return {
            reverse: {
                "*": "*"
            },
            forward: {
                "*": "*"
            }
        }
    }
    var b = a.split(",");
    var f = {};
    f.forward = {};
    f.reverse = {};
    for (var c = 0; c < b.length; c++) {
        var e = b[c].split(":");
        f.forward[e[0]] = e[1];
        f.reverse[e[1]] = e[0]
    }
    return f
}

function mapRealToWidgetValue(a, c, e) {
    if (e == undefined) {
        e = getValueMap(a)
    }
    var d = e.forward[c];
    if (d == undefined) {
        var b = e.forward["*"];
        if (b == undefined || b == "*") {
            return c
        } else {
            return b
        }
    } else {
        return d
    }
}

function mapWidgetToRealValue(a, c, e) {
    if (e == undefined) {
        e = getValueMap(a)
    }
    var d = e.reverse[c];
    if (d == "*") {
        return undefined
    } else {
        if (d == undefined) {
            var b = e.reverse["*"];
            if (b == undefined || b == "*") {
                return c
            } else {
                return b
            }
        } else {
            return d
        }
    }
}

function clearSettingChanged(a) {
    if (a !== undefined) {
        if (a.hasClass("setting-changed")) {
            a.removeClass("setting-changed")
        }
        a.find(".setting-changed").removeClass("setting-changed")
    } else {
        $(".setting-changed").removeClass("setting-changed")
    }
}

function setSetting(d, b, c) {
    if (typeof(b) == "object") {
        stored_settings[d] = {};
        $.extend(true, stored_settings[d], b)
    } else {
        var a = {};
        $.extend(true, a, stored_settings[d]);
        a[b] = c;
        $.extend(true, stored_settings[d], a)
    }
}

function getSetting(b, a) {
    if (b !== undefined) {
        if (a === undefined) {
            return stored_settings[b]
        } else {
            return stored_settings[b][a]
        }
    } else {
        return undefined
    }
}

function getSettingData(a) {
    var b = a.data("setting");
    return stored_settings[b]
}

function popBreadcrumb(b) {
    if (b === undefined) {
        b = 1
    }
    if (isNaN(b) || b < 1) {
        console.error("Can't pop the breadcrumb trail by a value that is either less than 1 or not even a number!");
        return
    }
    var c = $(".breadcrumb li");
    var a = c.size() - 1 - b;
    if (a < 0) {
        a = 0
    }
    $(c[a]).find("a").click()
}

function showUploadPrompt(d, c, a) {
    if (c == undefined) {
        c = b
    }
    if (a == undefined) {
        a = b
    }
    var e = d.closest("[panel-data-node]").attr("panel-data-node");
    if ((getNodeName(d) == "FwUpdate") || (e == "FwUpdate")) {
        checkFwUpdateStatus(d, c, a)
    } else {
        $(d).popup({
            messageText: getRawTranslation("TXT_UPLOAD"),
            buttonOneId: "TXT_NO",
            buttonOneCallback: a,
            buttonTwoId: "TXT_YES",
            buttonTwoCallback: c
        })
    }

    function b() {
        d.find(".setting-saved-message").hide();
        d.popup("hide")
    }
}

function showRebootPopup(c, b, a) {
    $(c).popup({
        messageText: getRawTranslation("TXT_WILL_REBOOT_PRINTER"),
        buttonOneId: "TXT_NO",
        buttonOneCallback: a,
        buttonTwoId: "TXT_YES",
        buttonTwoCallback: b
    })
}

function isValueConflict(c, a) {
    var b = getNodeData(c).valueConflicts && getNodeData(c).valueConflicts[a] != undefined;
    return b
}

function checkValueConflicts(h, e, g, b) {
    var a = false;
    var c = false;
    var d = getNodeData(h).valueConflicts;
    for (var f in b) {
        if (f) {
            break
        }
    }
    if (d[e] != undefined && f == undefined && g) {
        c = true;
        b[h] = {
            nodeName: h,
            nodeValue: e,
            origValue: getSetting(g).origval,
            factoryValue: getSetting(g).fctVal,
            data: d,
            behavior: d[e]
        }
    }
    return c
}

function valueConflictsPopup(f, c, a) {
    var b = false;
    for (var g in a) {
        if (g) {
            b = true;
            break
        }
    }
    if (b == false) {
        c();
        return
    }
    var e = a[g].behavior;

    function d() {}
    $(f).popup({
        messageText: getRawTranslation(e.popupText),
        buttonOneId: e.confirmText,
        buttonOneCallback: c,
        buttonTwoId: e.cancelText,
        buttonTwoCallback: d
    })
}

function getFlsRevision(d, b) {
    stored_vars.fwUploadRevision = "";
    stored_vars.fwUploadRevisionName = "";
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var c = b.target.files[0];
        if (c) {
            var a = new FileReader();
            a.onload = function(l) {
                var h = l.target.result;
                var g = new RegExp('DATE="([^"]+)"');
                var f = g.exec(h);
                if (f) {
                    stored_vars.fwUploadRevision = f[1]
                }
                g = new RegExp('RIP="([^"]+)"');
                var k = g.exec(h);
                if (k) {
                    stored_vars.fwUploadRevisionName = k[1]
                }
            };
            a.readAsText(c.slice(0, 1024))
        } else {
            console.log("Failed to load file")
        }
    } else {
        console.log("The File APIs are not fully supported by your browser.")
    }
}

function padStart(b, a) {
    while (b.length < a) {
        b = "0" + b
    }
    return b
}

function findMaxLength(a, b) {
    var c = Math.max(a.length, b.length);
    return c
}

function isDevelopmentFirmware(a) {
    var b = /^\d+$/;
    return b.test(a)
}

function isCustomFirmware(a) {
    var b = /[a-z]$/i;
    return b.test(a)
}

function removeNonDigits(b) {
    var a = /\D+/g;
    return b.replace(a, "")
}

function checkForCustomAndSameRevision(h, g, c, e, d) {
    var a = isCustomFirmware(h);
    var f = isCustomFirmware(c);
    var b = null;
    if (a || f) {
        if (!d) {
            b = findMaxLength(g, e);
            g = padStart(g, b);
            e = padStart(e, b)
        } else {
            g = removeNonDigits(h);
            e = removeNonDigits(c);
            b = findMaxLength(g, e);
            g = padStart(g, b);
            e = padStart(e, b)
        }
        if (g === e) {
            return true
        }
    }
    return false
}

function currentIsNewer(h, g, b, f, e) {
    if (e) {
        var c = removeNonDigits(h);
        var d = removeNonDigits(b);
        var a = findMaxLength(c, d);
        g = padStart(c, a);
        f = padStart(d, a)
    }
    return g > f
}

function createFwUpdatePopup(d, m, b, e, g, c) {
    var f = $("<div></div>");
    var l = isDevelopmentFirmware(c);
    var k = isDevelopmentFirmware(stored_vars.fwUploadRevisionName);
    var a = !l && !k;
    if (e) {
        if ((!g) || (!stored_vars.fwUploadRevision)) {
            f.append($("<p class='downlevel-warning'><img src='/images/warning_icon_24x24.png'/>" + getStoredTranslation("TXT_WARNING_FW_REV_UNKNOWN") + "</p>"))
        } else {
            if (currentIsNewer(c, g, stored_vars.fwUploadRevisionName, stored_vars.fwUploadRevision, a)) {
                if (isCustomFirmware(c)) {
                    f.append($("<p class='downlevel-warning'><img src='/images/warning_icon_24x24.png'/>" + getStoredTranslation("TXT_WARNING_FW_SPECIAL") + "<br>" + c + " (" + g + ")</p>"))
                } else {
                    f.append($("<img src='/images/warning_icon_24x24.png'/>" + getStoredTranslation("TXT_WARNING_FW_DOWNLEVEL") + "<br>" + c + " (" + g + ") &#x2192; " + stored_vars.fwUploadRevisionName + " (" + stored_vars.fwUploadRevision + ")</p>"))
                }
            } else {
                if (checkForCustomAndSameRevision(c, g, stored_vars.fwUploadRevisionName, stored_vars.fwUploadRevision, a)) {
                    f.append($("<p class='downlevel-warning'><img src='/images/warning_icon_24x24.png'/>" + getStoredTranslation("TXT_WARNING_FW_REV_NOT_COMPARABLE") + "<br>" + c + " (" + g + ") &#x2192; " + stored_vars.fwUploadRevisionName + " (" + stored_vars.fwUploadRevision + ")</p>"))
                } else {
                    f.append($("<p>" + getStoredTranslation("TXT_UPDATE_FIRMWARE") + ": " + c + " &#x2192; " + stored_vars.fwUploadRevisionName + "</p>"))
                }
            }
        }
    }
    f.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_THIS_OPERATION_WILL") + "</p>"));
    var h = $("<ul class='popup-list'></ul>");
    h.append($("<li>" + getStoredTranslation("TXT_UPDATE_PRINTER_FW_CODE") + "</li>"));
    h.append($("<li>" + getStoredTranslation("TXT_RESET_POPUP_REBOOT_THE_PRINTER") + "</li>"));
    f.append(h);
    f.append($("<p class='popup-left'>" + getStoredTranslation("TXT_RESET_POPUP_ARE_YOU_SURE") + "</p>"));
    $(d).popup({
        messageText: f.html(),
        showCloseButton: false,
        buttonOneId: "TXT_CANCEL",
        buttonOneCallback: b,
        buttonTwoId: "TXT_START",
        buttonTwoCallback: function() {
            d.find(".setting-saved-message").hide();
            $(".popup-modal-container").popup("init", {
                showCloseButton: false
            });
            $(".popup-modal-container").popup("startSpinner");
            m();
            m = undefined
        }
    })
}

function showFwUpdatePopup(d, e, l, a) {
    if (e == undefined) {
        return
    }
    var f = d.find("#setting_UPLOAD_FW").data("downlevel-warning");
    if (f) {
        var k = e.dateValue;
        var m = k.split(" ");
        var h = m[0].split("-");
        k = h[1] + " " + h[0] + " 20" + h[2] + " " + m[1];
        var c = new Date(k);
        var g = c.toISOString().slice(0, 10).replace(/-/g, "");
        var b = e.baseValue;
        createFwUpdatePopup(d, l, a, true, g, b)
    } else {
        createFwUpdatePopup(d, l, a, false)
    }
}

function displayResultPopup(b, d, a, e) {
    var c = {
        messageText: a,
        icon: (d == 1 ? "/images/Success_Icon_68x68.png" : "/images/Error_Icon_68x68.png"),
        buttonOneId: "TXT_OK",
        showCloseButton: false,
        autoHide: true
    };
    if (e !== undefined) {
        c.buttonOneCallback = e
    }
    b.popup(c).popup("setPopupSizeLimit")
}
$.fn.verifyLdapSetup = function() {
    $(".popup-modal-container .popup-buttonrow").empty();
    $(".popup-modal-container").modalPopup("display", "LdapTestSetupPopup", false)
};
$.fn.verifyKerberosSetup = function() {
    $(".popup-modal-container .popup-buttonrow").empty();
    $(".popup-modal-container").modalPopup("display", "KerberosTestSetupPopup", false)
};

function saveAndResetElementsExists(d) {
    var a = d.closest(".setting-contents").parent();
    var c = a.find("[data-action*=save], [data-action=saveAndDownload], [data-action=createGroup], [data-action=saveAndWait]");
    var b = a.find("[data-action=reset], [data-action=cancel]");
    return (c.length && b.length)
}

function showRestoreDefaultsPrompt(d) {
    var a = d.closest(".setting-contents").parent();
    var b = a.find("[data-action=restore-defaults-with-confirmation]");
    var c = b.attr("data-confirmation");
    var e = b.attr("data-confirm-yes");
    var f = b.attr("data-confirm-no");
    $(d).popup({
        messageText: c,
        buttonOneId: e,
        buttonOneCallback: function() {
            sendRestoreDefaults(d)
        },
        buttonTwoId: f,
        showCloseButton: false
    })
}

function sendRestoreDefaults(b) {
    var a = new Communicator();
    a.addSuccessHandler(function(c) {
        var d = function() {
            $(".popup").remove();
            reloadContent()
        };
        displayResultPopup(b, c.success, c.status, d)
    });
    a.sendData(APPLICATIONS_PATH + "restoreDefaults", "POST", this, "json", {})
}

function checkFwUpdateStatus(c, b, a) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/webglue/checkFwUpdateStatus",
        success: function(d) {
            if (d.result) {
                showFwUpdatePopup(c, d, b, a)
            } else {
                $(".popup-modal-container").popup("init", {
                    messageText: getRawTranslation("TXT_UPDATE_FAILED_MESSAGE"),
                    icon: "/images/Error_Icon_68x68.png",
                    buttonOneId: "TXT_OK",
                    buttonOneCallback: a,
                    showCloseButton: false,
                    autoHide: true
                })
            }
        },
        error: function(d) {
            console.warn("Error accessing /webglue/checkFwUpdateStatus.")
        }
    })
}

function initDialPrefixRules(b) {
    var c = Number(b.attr("data-setting"));
    loadDialPrefixRules(stored_settings[c].val);
    var a = new RegExp("^[0-9wWpP*#\\-,+]*$");
    $('[id^="DialPrefixRules_prefix"]').each(function() {
        var d = $(this);
        d.keyup(function() {
            if (a.test(d.val())) {
                d.removeClass("invalid-node")
            } else {
                d.addClass("invalid-node")
            }
            updateDialPrefixRules(c);
            checkIfNodeChanged(b);
            updateButtonRow(b)
        })
    });
    updateDialPrefixRules(c)
}

function resetDialPrefixRuleSetting(a) {
    var b = a.attr("data-setting");
    a.val(stored_settings[b].val);
    loadDialPrefixRules(stored_settings[b].val);
    $(".invalid").removeClass("invalid");
    checkIfNodeChanged(a);
    updateButtonRow($(".setting-buttons"))
}

function updateDialPrefixRules(c) {
    var b = "";
    var a = $("#setting_" + c);
    $("#DialPrefixRules .prefixList [id$=BS]").each(function() {
        var d = $(this).val();
        var e = $(this).parent().next().children("input").val();
        b += d + "=" + e;
        if ($(this).attr("id") != $("#DialPrefixRules .prefixList [id$=BS]:last").attr("id")) {
            b += ";"
        }
    });
    if (b.length > 0) {
        setDialPrefixRuleSetting(a, b)
    }
}

function loadDialPrefixRules(a) {
    var b = a.split(";");
    var c = ["prefix1", "prefix2", "prefix3", "prefix4", "prefix5"];
    $(c).each(function(f, h) {
        var d;
        var g;
        var l;
        var e;
        var k;
        if ((b.length > f) && (b[f] != undefined)) {
            d = b[f].split("=");
            g = d[0];
            l = d[1];
            e = (g != undefined) ? g : "";
            k = (l != undefined) ? l : ""
        } else {
            e = "";
            k = ""
        }
        $("#DialPrefixRules [id*=" + this + "][id$=BS]").attr("data-original-value", e).val(e);
        $("#DialPrefixRules [id*=" + this + "][id$=TS]").attr("data-original-value", k).val(k)
    });
    updateDialPrefixRules()
}

function setDialPrefixRuleSetting(a, b) {
    a.attr("value", b)
}

function getDialPrefixRuleSetting(a) {
    return getTextInput(a)
}

function initSchedule(a) {
    var b = a.data("schedule-type");
    createScheduleDropdown(a, b);
    a.controlNode()
}

function createStringListComponent(a) {
    var e = Number(a.attr("data-setting"));
    var f = a.parent().attr("id");
    var b = a.attr("data-delimiter");
    this.stringList = new StringListContainer(a.find(".stringList-container"), "stringList-container", '<img src="/images/delete_x_10x9.png">', e, f, b);
    var c = this.stringList;
    var d = a.attr("data-stored-var");
    stored_vars[d] = this.stringList;
    c.init();
    a.find("#StringList-Add").click(function() {
        c.addRowWithValue(a.find("#stringList-input").val())
    });
    a.find("#stringList-input").bind("doEnter", {
        source: c
    }, function(g) {
        g.data.source.addRowWithValue(a.find("#stringList-input").val())
    });
    a.find("#stringList-input").keyup(function() {
        var k = $(this);
        var g = "^[^" + b + "]*$";
        var h = new RegExp(g);
        if (g != "") {
            if (!h.test($(k).val())) {
                if (!$(k).hasClass("invalid")) {
                    $(k).addClass("invalid")
                }
            } else {
                if ($(k).hasClass("invalid")) {
                    $(k).removeClass("invalid")
                }
            }
        }
        updateButtonRow(a)
    });
    c.addChangeCallback(function() {
        checkIfNodeChanged(a);
        updateButtonRow(a)
    })
}

function createScheduleDropdown(a, d) {
    var c = new ScheduleRowContainer(a, "schedule-container", ('<button class="greyBtn">' + getStoredTranslation("TXT_REMOVE") + "</button>"));
    stored_vars[d] = c;
    c.init(d);
    c.addBlankRow();
    c.addChangeCallback(function(f, e) {
        if ($(".schedule-container-row").length <= 0 || $(".schedule-container-row").length == 1 && f && f.data("deleted")) {
            c.addBlankRow()
        }
    });
    a.find(".schedule-button-add").click(function() {
        c.addBlankRow()
    });
    a.find(".schedule-button-clear").click(function() {
        c.clearAll()
    });
    var b = stored_schedules[d];
    $.each(b, function(e, f) {
        type = f.type;
        if ((d == "FaxHolding" && (type == 0 || type == 1)) || (d == "PowerSaver" && (type == 2 || type == 3 || type == 8 || type == 9)) || (d == "DiskWipe" && (type == 6 || type == 7)) || (d == "UsbSchedule" && (type == 4 || type == 5))) {
            c.addRowWithValues(type, f.days, f.hour)
        }
    });
    c.saveState();
    c.addChangeCallback(function() {
        handleChange(stored_vars[d].elem, d)
    })
}

function handleChange(b, c) {
    var a = stored_vars[c].hasChanged();
    if (b == undefined) {
        b = stored_vars[c].elem
    }
    if (a && !b.hasClass("setting-changed")) {
        b.addClass("setting-changed");
        updateExternalCallbackList(b.parent().attr("data-callback"), b.attr("data-setting"), 1)
    } else {
        if (!a && b.hasClass("setting-changed")) {
            b.removeClass("setting-changed");
            updateExternalCallbackList(b.parent().attr("data-callback"), b.attr("data-setting"), 0)
        }
    }
    updateButtonRow(b)
}

function initImportAccessControls(d) {
    var f = d.find("button.select");
    var b = d.find(".groupList");
    var c = d.data("setting");
    for (i in getSetting(c).data) {
        var a = getSetting(c).data[i];
        var e = $("<div></div>").attr("data-id", a.id).text(a.name);
        b.append(e)
    }
    b.find("div").click(function() {
        var h = $(this).attr("data-id");
        var g = new Communicator();
        g.addSuccessHandler(function(k) {
            $("#AccessControls > div").list("updateData", k.nodes.settings.GROUP_ACCESS_CONTROLS)
        });
        params = {
            c: (d.parents().closest("[data-node]").attr("data-node")),
            tableEditId: h
        };
        g.sendData(RAW_CONTENT, "GET", "", "json", params)
    });
    b.hide();
    f.click(function() {
        b.toggle()
    });
    f.parent().css("position", "relative");
    $("html").click(function(g) {
        if (f.has(g.target).length === 0 && !f.is(g.target)) {
            b.hide()
        }
    })
}

function isThisLdapActiveDirectory(a) {
    if (a === undefined || isNaN(parseInt(a)) || stored_settings.LDAP_ID_THAT_IS_ACTUALLY_ACTIVE_DIRECTORY === undefined || stored_settings.LDAP_ID_THAT_IS_ACTUALLY_ACTIVE_DIRECTORY == -1) {
        return false
    }
    return (stored_settings.LDAP_ID_THAT_IS_ACTUALLY_ACTIVE_DIRECTORY["val"] == a)
}
ScheduleRowContainer.prototype = new RowContainer();
ScheduleRowContainer.prototype.constructor = ScheduleRowContainer;
ScheduleRowContainer.superclass = RowContainer.prototype;

function ScheduleRowContainer(b, c, a) {
    this.container = b;
    RowContainer.call(this, b.find(".schedule-container"), c, a);
    if (this.elem == undefined) {
        return
    }
    this.dropdowns = new Array();
    this.dropdowndata;
    this.lastRowId = 0
}
ScheduleRowContainer.prototype.init = function(a) {
    this.clearAll();
    var b = stored_nodes[this.container.attr("data-node")];
    this.data = [b.options, b.datelist, b.timelist]
};
ScheduleRowContainer.prototype.addRowWithValues = function(d, e, a) {
    var c = this.buildRow();
    var b = 0;
    c.find(".schedule-container-dropdown-type").val(d);
    c.find(".schedule-container-dropdown-days").val(e);
    c.find(".schedule-container-dropdown-hour").val(a);
    this.elem.append(c);
    this.triggerChangeCallbacks()
};
ScheduleRowContainer.prototype.saveState = function() {
    this.savedState = this.getData();
    this.elem.find(".setting-changed").removeClass("setting-changed");
    this.triggerChangeCallbacks()
};
ScheduleRowContainer.prototype.restoreState = function() {
    if (this.savedState == undefined) {
        console.warn("Can't restore schedule row container state, as the state wasn't stored in the first place!");
        return
    }
    this.enableCallbacks = false;
    this.clearAll();
    var a = this;
    $.each(this.savedState, function(b, d) {
        var c = d.data;
        a.addRowWithValues(c.type, c.days, c.hour)
    });
    this.enableCallbacks = true;
    this.triggerChangeCallbacks()
};
ScheduleRowContainer.prototype.triggerChangeCallbacks = function(a) {
    if (a != undefined) {
        var b = this.getDataInternal(a);
        this.checkSingleRowConflicts(b, this.getDataIndexed())
    }
    ScheduleRowContainer.superclass.triggerChangeCallbacks.call(this, a)
};
ScheduleRowContainer.prototype.getLastState = function() {
    return this.savedState
};
ScheduleRowContainer.prototype.populateRow = function(b) {
    var c = this;
    var a = ["type", "days", "hour"];
    $.each(this.data, function(g, f) {
        var d = $("<select></select>").addClass(c.baseclass + "-dropdown").addClass(c.baseclass + "-dropdown-" + a[g]).addClass("input");
        var e = '<option value="-1">----</option>';
        $.each(f, function(k, h) {
            e += '<option value="' + h.value + '">' + getStoredTranslation(h.textid) + "</option>"
        });
        d.html(e);
        b.append($("<td></td>").append(d))
    });
    b.attr("data-rowid", this.lastRowId);
    this.lastRowId++
};
ScheduleRowContainer.prototype.setEnabled = function(a) {
    ScheduleRowContainer.superclass.setEnabled.call(this, a);
    var b = this.baseclass;
    this.elem.find("." + b + "-row").each(function() {
        if (a) {
            $(this).find("select").removeAttr("disabled");
            $(this).find("." + b + "-remove-button").removeAttr("disabled")
        } else {
            $(this).find("select").attr("disabled", 1);
            $(this).find("." + b + "-remove-button").attr("disabled", 1)
        }
    })
};
ScheduleRowContainer.prototype.getData = function() {
    var c = new Array();
    var b = this.baseclass;
    var a = this;
    this.elem.find("." + b + "-row").each(function() {
        var d = a.getDataInternal(this);
        if (d.data["type"] == -1 || d.data["days"] == -1 || d.data["hour"] == -1 || d.deleting != undefined) {
            return
        }
        c.push(d)
    });
    return c
};
ScheduleRowContainer.prototype.getDataIndexed = function() {
    var c = {};
    var b = this.baseclass;
    var a = this;
    this.elem.find("." + b + "-row").each(function() {
        var d = a.getDataInternal(this);
        if (d.data["type"] == -1 || d.data["days"] == -1 || d.data["hour"] == -1) {
            d.ignore = 1
        } else {
            d.ignore = 0
        }
        c[$(this).attr("data-rowid")] = d
    });
    return c
};
ScheduleRowContainer.prototype.getDataInternal = function(f) {
    var e = {};
    var c = {};
    var b = $(f);
    e.rowid = b.attr("data-rowid");
    var h = false;
    var d = b.find(".schedule-container-dropdown-type").val();
    var g = b.find(".schedule-container-dropdown-days").val();
    var a = b.find(".schedule-container-dropdown-hour").val();
    c.type = d;
    c.days = g;
    c.hour = a;
    e.data = c;
    if (b.attr("data-deleted") != undefined) {
        e.deleting = 1
    }
    return e
};
ScheduleRowContainer.prototype.hasChanged = function() {
    var b = this.getData();
    var c = this.getLastState();
    if (b.length != c.length) {
        return true
    } else {
        var a = false;
        $.each(c, function(d, f) {
            if (a) {
                return
            }
            var e = b[d];
            if (e.data["type"] != f.data["type"] || e.data["days"] != f.data["days"] || e.data["hour"] != f.data["hour"]) {
                a = true;
                return
            }
        });
        return a
    }
};
ScheduleRowContainer.prototype.checkSingleRowConflicts = function(b, a) {
    this.recurseSingleRowConflicts(b, a)
};
ScheduleRowContainer.prototype.recurseSingleRowConflicts = function(f, d) {
    var e = d[f.rowid]["ignore"];
    d[f.rowid]["ignore"] = 1;
    var c = this;
    var b = false;
    var a = this.elem.find("[data-rowid=" + f.rowid + "]");
    $.each(d, function(h, l) {
        if (l.ignore == 1) {
            return
        }
        var k = c.elem.find("[data-rowid=" + l.rowid + "]");
        var g = c.hasConflict(f, l);
        if (g) {
            b = true
        }
        if (g && f.deleting == undefined) {
            k.addClass("schedule-conflict");
            d[l.rowid]["really_conflicted"] = 1
        }
        if (k.hasClass("schedule-conflict") && (!g || (g && f.deleting != undefined)) && d[f.rowid]["really_conflicted"] == undefined) {
            c.recurseSingleRowConflicts(l, d)
        }
    });
    if (b) {
        a.addClass("schedule-conflict")
    } else {
        if (d[f.rowid]["really_conflicted"] == undefined) {
            a.removeClass("schedule-conflict")
        }
    }
    d[f.rowid]["ignore"] = e
};
ScheduleRowContainer.prototype.hasConflict = function(e, d) {
    var b = e.data;
    var f = d.data;
    var c = b.days;
    var a = f.days;
    return (b.type != -1 && f.type != -1 && b.days != -1 && f.days != -1 && b.hour != -1 && f.hour != -1 && b.hour == f.hour && (c == a || c == 7 || a == 7 || (c == 8 && (a >= 1 && a <= 5)) || (a == 8 && (c >= 1 && c <= 5)) || (c == 9 && (a == 0 || a == 6)) || (a == 9 && (c == 0 || c == 6))))
};

function resetScheduleSetting(a) {
    var b = a.data("schedule-type");
    if (stored_vars[b] !== undefined) {
        stored_vars[b].restoreState()
    }
}
StringListContainer.prototype = new RowContainer();
StringListContainer.prototype.constructor = StringListContainer;
StringListContainer.superclass = RowContainer.prototype;

function StringListContainer(c, e, a, d, f, b) {
    RowContainer.call(this, c, e, a, false);
    if (c == undefined) {
        return
    }
    this.dropdowns = new Array();
    this.dropdowndata;
    this.settingId = d;
    this.MAX_NUM_ENTRIES = 256;
    this.parentId = f;
    this.delimiter = b
}
StringListContainer.prototype.init = function() {
    var a = this;
    var b = getSetting(this.settingId).val;
    setStringListSetting($("#" + this.parentId), b)
};
StringListContainer.prototype.restoreState = function() {
    $("#" + this.parentId).find("#stringList-input").val("");
    this.init();
    this.triggerChangeCallbacks()
};
StringListContainer.prototype.populateRow = function(a) {
    var b = $("#" + this.parentId).find("#stringList-input").val();
    a.append('<td class="stringList-container-content"><div class="stringList-container-text">' + escapeHtml(b) + "</div></td>")
};
StringListContainer.prototype.rebuildSettingValue = function() {
    var b = [];
    var a = "";
    $("#" + this.parentId).find(".stringList-container-text").each(function() {
        b.push($(this).text())
    });
    a = b.join(this.delimiter);
    $("#setting_" + this.settingId).attr("value", a)
};
StringListContainer.prototype.addRowWithValue = function(h) {
    var a = $("#setting_" + this.settingId).val();
    var e = $("#" + this.parentId).find("#stringList-input");
    var g = a.length + (h.length);
    var b = Number($("#setting_" + this.settingId).attr("maxlength"));
    if (this.canAddNewRow(g, b, h)) {
        var c = this.buildRow();
        $(c).children("td").children("div").text(h);
        this.elem.append(c);
        e.val("");
        var f = b - g;
        if (f > 0) {
            f = f - 1
        }
        e.attr("maxlength", f);
        this.rebuildSettingValue();
        this.hasChange = true;
        this.triggerChangeCallbacks();
        var d = this;
        $(c).one("modified", function(k) {
            d.removeValue(this)
        });
        $(c).children("td:first").attr("tabindex", this.getTabIndex())
    } else {
        if (!e.hasClass("invalid")) {
            setNodeState(e, false)
        }
    }
    updateButtonRow(e)
};
StringListContainer.prototype.canAddNewRow = function(e, b, g) {
    var a = $("#" + this.parentId);
    var f = a.find(".stringList-container-row").length;
    var d = a.find("#stringList-input");
    var c = false;
    if (($.trim(g).length > 0) && !d.hasClass("invalid")) {
        if ((b - e > 0) && (f < this.MAX_NUM_ENTRIES)) {
            c = true
        }
    }
    return c
};
StringListContainer.prototype.removeValue = function(e) {
    var d = $(e).children("td").children("div").text();
    var a = $("#setting_" + this.settingId).val();
    var b = Number(getSetting(this.settingId).maxlen);
    var e = $("#" + this.parentId).find("#stringList-input");
    var c = a.split(this.delimiter);
    c.splice($.inArray(d, c), 1);
    a = c.join(this.delimiter);
    $("#setting_" + this.settingId).val(a);
    var f = b - a.length;
    if ((f != b) && (f > 0)) {
        f = f - 1
    }
    e.attr("maxlength", f);
    if (e.hasClass("invalid")) {
        setNodeState(e, undefined, true)
    }
    this.triggerChangeCallbacks()
};
StringListContainer.prototype.clearAll = function() {
    $("#setting_" + this.settingId).attr("value", "");
    RowContainer.prototype.clearAll.call(this)
};
StringListContainer.prototype.getTabIndex = function() {
    return $("#" + this.parentId).find("#StringList-Add").attr("tabindex")
};

function getStringListSetting(a) {
    return a.find('[type="hidden"]').val()
}

function setStringListSetting(d, e) {
    if (e == getStringListSetting(d)) {
        return
    }
    var b = d.find("#settingHolder").attr("data-delimiter");
    var a = e.split(b);
    var f = d.find("#settingHolder").attr("data-stored-var");
    var c = stored_vars[f];
    c.clearAll();
    if (a.length > 0) {
        $(a).each(function(g, h) {
            if (h.length > 0) {
                c.addRowWithValue(h)
            }
        })
    }
}

function resetStringListSetting(b) {
    var c = b.parent().find("#settingHolder").attr("data-stored-var");
    var a = stored_vars[c];
    a.restoreState()
}
var SCROLL_LIST_BOTTOM_PADDING = 400;
var LIST_EASING = "easeOutBack";
var LIST_TWEEN = 500;

function initScrollList() {
    var a = $("#maincontent");
    var b = {};
    b.content = a.find(".scrollList>ul");
    b.mask = a.find(".scrollList");
    b.maskHeight = b.mask.height();
    b.up = a.find("#scrollUp");
    b.down = a.find("#scrollDown");
    b.buttons = a.find("#scrollButtons");
    b.content.find("li").last().css("padding-bottom", SCROLL_LIST_BOTTOM_PADDING + "px");
    b.contentHeight = b.content.height() - SCROLL_LIST_BOTTOM_PADDING;
    if (a.find("#scrollBar").height() != 0) {
        b.scrollBar = a.find("#scrollBar")
    }
    view_data.list = b;
    if (b.contentHeight > b.maskHeight) {
        initScrollBar();
        initScrollButtons();
        initFlick();
        if (b.content.find("*[selected]").length) {
            scrollToSelected()
        }
    } else {
        b.buttons.hide();
        b.content.find("li").addClass("wide");
        b.mask.css("height", b.contentHeight)
    }
}

function scrollToSelected() {
    var b = view_data.list;
    var a = b.content.find("*[selected]");
    while (a.position().top + b.content.position().top >= b.mask.height()) {
        b.content.css("top", b.content.position().top - b.mask.height())
    }
    scrollListRelease()
}

function initFlick() {
    dragOptions = {
        axis: "y",
        stop: scrollListRelease,
        distance: 20
    };
    view_data.list.content.draggable(dragOptions)
}

function scrollListRelease() {
    var c = view_data.list;
    var b = Math.ceil((c.contentHeight) / c.maskHeight) - 1;
    var a = Math.round(c.content.position().top / c.maskHeight);
    if (a > 0) {
        a = 0
    } else {
        if (a * -1 > b) {
            a = b * -1
        }
    }
    var d = a * c.maskHeight;
    c.content.animate({
        top: d
    }, LIST_TWEEN, LIST_EASING);
    disableScrollButtons(d);
    updateScrollBar(d)
}

function initScrollButtons() {
    var b = view_data.list;
    var a = function(c) {
        b.content.animate({
            top: c
        }, LIST_TWEEN, LIST_EASING);
        disableScrollButtons(c);
        updateScrollBar(c)
    };
    b.up.click(function() {
        if (!$(this).attr("disabled")) {
            b.content.stop(true, true);
            var c = b.content.position().top + b.maskHeight;
            a(c)
        }
    });
    b.down.click(function() {
        if (!$(this).attr("disabled")) {
            b.content.stop(true, true);
            var c = b.content.position().top - b.maskHeight;
            a(c)
        }
    });
    disableScrollButtons(b.content.position().top)
}

function initScrollBar() {
    var b = view_data.list;
    if (b.scrollBar == undefined) {
        return
    }
    b.scrollBarMax = b.down.position().top - b.scrollBar.height();
    b.scrollBarMin = b.up.position().top + b.up.height();
    if (b.scrollBar.height() > 5) {
        b.scrollBarMax += 10;
        b.scrollBarMin -= 10;
        var a = b.scrollBarMax + b.buttons.position().top;
        var c = b.scrollBarMin + b.buttons.position().top;
        scrollOptions = {
            axis: "y",
            stop: scrollListRelease,
            drag: scrollBarDrag,
            containment: [0, c, 0, a]
        };
        b.scrollBar.draggable(scrollOptions)
    }
    b.scrollLength = b.scrollBarMax - b.scrollBarMin;
    updateScrollBar(b.content.position().top)
}

function updateScrollBar(b) {
    var e = view_data.list;
    if (e.scrollBar == undefined) {
        return
    }
    b *= -1;
    var a = Math.ceil(e.contentHeight / e.maskHeight) - 1;
    var d = Math.floor(b / e.maskHeight);
    var c = Math.round(e.scrollLength / a);
    var f = d * c + e.scrollBarMin;
    e.scrollBar.css("top", f + "px")
}

function scrollBarDrag(e, g) {
    var f = view_data.list;
    var d = g.offset.top - f.buttons.position().top;
    var a = (d - f.scrollBarMin) / f.scrollLength;
    var b = Math.ceil(f.contentHeight / f.maskHeight) - 1;
    var c = b * f.maskHeight * a * -1;
    f.content.css("top", c)
}

function disableScrollButtons(a) {
    var b = view_data.list;
    if (a >= 0) {
        b.up.attr("disabled", "disabled")
    } else {
        b.up.removeAttr("disabled")
    }
    if ((a * -1) + b.maskHeight >= b.contentHeight) {
        b.down.attr("disabled", "disabled")
    } else {
        b.down.removeAttr("disabled")
    }
}

function initNavBar(c) {
    var b = c.width();
    var a = 0;
    c.find(".right").children().each(function() {
        b -= $(this).width();
        $(this).css("left", b)
    });
    c.find(".left").children().each(function() {
        $(this).css("left", a);
        a += $(this).width()
    });
    c.show()
}

function navBack() {
    var a = $(".breadcrumb li").last().prev().data("path");
    if (a == undefined) {
        alert("Exit Feature!")
    } else {
        hideView(a)
    }
}

function navSubmit() {
    alert("Submit!")
}

function dropdownSubmit() {
    saveNode($(".dropdown"), function() {
        navBack()
    })
}

function navTips() {
    alert("Tips!")
}

function navHome() {
    alert("Home!")
}

function initNumpad(e) {
    var g = e.attr("data-setting");
    var c = e.find("input");
    e.settingNode(c);
    var b = c.val();
    var f = getSetting(g).decimalpoints;
    if (!f) {
        $("#numpadDot").hide()
    } else {
        c.val(applyDecimalPointConversion(c.val(), g));
        var a = e.find("#maxValue span").last();
        var d = e.find("#minValue span").last();
        a.text(getSetting(g).end);
        d.text(getSetting(g).start)
    }
    c.keydown(function(k) {
        if (k.keyCode == 8) {
            return
        } else {
            if (k.keyCode == 110 || k.keyCode == 190) {
                if (f && c.val().indexOf(".") == -1) {
                    return
                } else {
                    k.preventDefault()
                }
            } else {
                if ((k.keyCode >= 48 && k.keyCode <= 57) || (k.keyCode >= 96 && k.keyCode <= 105)) {
                    var l = k.keyCode <= 57 ? k.keyCode - 48 : k.keyCode - 96;
                    var h = c.val() + l;
                    if (testNumpadValue(g, h)) {
                        b = c.val();
                        c.val(h)
                    }
                    k.preventDefault()
                } else {
                    k.preventDefault()
                }
            }
        }
        checkIfNodeChanged(e)
    });
    e.find(".numpadButton").click(function() {
        var k = c.val();
        if (this.id == "numpadBack") {
            c.val(k.substr(0, k.length - 1))
        } else {
            var h = k + $(this).find("span").html();
            if (testNumpadValue(g, h)) {
                c.val(h)
            }
        }
        checkIfNodeChanged(e)
    });
    c.click(function() {
        this.selectionStart = this.selectionEnd = this.value.length
    })
}

function initNumpadLink(b) {
    var c = b.find(".settingLinkText span").last();
    var a = applyDecimalPointConversion(c.html(), b.attr("data-setting"));
    c.text(a)
}

function testNumpadValue(d, b) {
    var c = getSetting(d);
    var e = Number(b);
    var a = true;
    if (b.indexOf(".") != -1) {
        a = b.split(".")[1].length <= c.decimalpoints
    }
    return (e <= c.end && a)
}(function(f) {
    var d = 500;
    var g = "easeOutExpo";
    var b = 300;
    var a = {
        init: function(h) {
            var m = this;
            m.html("");
            var n = f("<div></div>").addClass("title").text(h.title);
            var l = f("<div></div").addClass("message");
            var k = f("<button>Cancel</button>").addClass("cancel").addClass("standardButton");
            m.append(n).append(l).append(k);
            m.addClass("messagePopup");
            m.data("messagePopup", {
                message: l
            });
            k.click(function() {
                h.cancel();
                if (h.hideOnCancel) {
                    a.hide.apply(m)
                }
                f(this).attr("disabled", "disabled")
            });
            return this
        },
        show: function() {
            c(this);
            this.animate({
                top: 0
            }, d, g);
            f(this).find("button").removeAttr("disabled");
            return this
        },
        hide: function() {
            e(this);
            this.animate({
                top: -1 * this.height()
            }, d, g);
            return this
        },
        text: function(k) {
            var h = this.data("messagePopup").message;
            h.text(k);
            centerWithinParent(h, "both");
            h.css("top", h.position().top - 40)
        }
    };

    function c(k) {
        var h = f("<div></div>").addClass("overlay");
        k.parent().append(h);
        h.hide().fadeIn(b)
    }

    function e(h) {
        h.parent().find(".overlay").fadeOut(b).remove()
    }
    f.fn.messagePopup = function(h) {
        if (a[h]) {
            return a[h].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof h === "object" || !h) {
                return a.init.apply(this, arguments)
            } else {
                f.error("Method " + h + " does not exist on jQuery.messagePopup")
            }
        }
    }
})(jQuery);
ContentHandler.prototype = new Communicator();
ContentHandler.prototype.constructor = ContentHandler;
ContentHandler.superclass = Communicator.prototype;

function ContentHandler(a) {
    Communicator.call(this);
    this.addSuccessHandler(ContentHandler.prototype.success);
    this.addErrorHandler(ContentHandler.prototype.error);
    this.isPanel = false;
    this.context = a
}
ContentHandler.prototype.loadContent = function(b, c) {
    if (!b) {
        return
    }
    if (!c) {
        c = {}
    }
    var a = MAIN_CONTENT_PATH;
    if (window.location.pathname.indexOf("panel/70") != -1) {
        a += "PanelLarge";
        this.isPanel = true
    } else {
        if (window.location.pathname.indexOf("panel/43") != -1) {
            a += "PanelSmall";
            this.isPanel = true
        }
    }
    if (b.length <= 1) {
        if (window.location.pathname == "/se") {
            b = SE_PAGE
        } else {
            b = DEFAULT_PAGE
        }
    }
    c.c = b;
    this.sendData(a, "GET", this.context, "json", c)
};
ContentHandler.prototype.loadRawContent = function(a, b) {
    if (!a) {
        return
    }
    if (!b) {
        b = {}
    }
    b.c = a;
    this.sendData(RAW_CONTENT, "GET", undefined, "json", b)
};
ContentHandler.prototype.setDataHandler = function(a) {
    this.dataHandler = a
};
ContentHandler.prototype.updateData = function(a) {
    if (a.nodes.settings) {
        $.each(a.nodes.settings, function(b, c) {
            setSetting(b, c)
        })
    }
    if (a.nodes.nodes) {
        $.each(a.nodes.nodes, function(b, c) {
            stored_nodes[b] = c
        })
    }
    if (a.nodes.schedules) {
        $.each(a.nodes.schedules, function(b, c) {
            stored_schedules[b] = c
        })
    }
    if (a.nodes.status) {
        stored_status = {};
        $.each(a.nodes.status, function(b, c) {
            stored_status[b] = c
        })
    }
    if (a.nodes.textids) {
        $.each(a.nodes.textids, function(b, c) {
            stored_translations[b] = c
        })
    }
    if (a.nodes.supplies) {
        $.each(a.nodes.supplies, function(b, c) {
            updateStoredDeviceStatus(SUPPLIES_LOCATION_ID, c)
        })
    }
    if (a.nodes.inputs) {
        $.each(a.nodes.inputs, function(b, c) {
            updateStoredDeviceStatus(INPUTS_LOCATION_ID, c)
        })
    }
    if (a.nodes.outputs) {
        $.each(a.nodes.outputs, function(b, c) {
            updateStoredDeviceStatus(OUTPUTS_LOCATION_ID, c)
        })
    }
    if (this.isPanel) {
        changeView(a.html)
    } else {
        if (this.context) {
            this.context.html(a.html);
            initContent(this.context)
        }
    }
    if (open_panels.length > 0) {
        $(open_panels).each(function() {
            $("#" + this).find(".panel").panel("open")
        });
        $("#" + open_panels[open_panels.length - 1]).focus()
    }
};

function updateStoredDeviceStatus(a, c) {
    var b = a + "-" + c.npaId;
    if (b) {
        stored_device_status[b] = c
    }
}
ContentHandler.prototype.success = function(a) {
    if (typeof(this.dataHandler) !== "undefined") {
        this.dataHandler.call(this, a)
    } else {
        this.updateData(a)
    }
};
ContentHandler.prototype.error = function(a) {
    console.error("AJAX request threw an error");
    if (a.status == 400 || a.status == 414 || a.status == 401) {
        window.location.reload()
    }
};
(function(b) {
    var a = {
        init: function(c) {
            return this
        },
        display: function(f, h, e, k) {
            var d = [];
            b.each(k, function(l, m) {
                d.push(l + "=" + m)
            });
            if (h === undefined) {
                h = ""
            }
            var c = window.open(f, "_blank", d.join(","));
            c.document.title = h;
            var g = new ContentHandler(b(c.document.body));
            g.loadContent(e)
        }
    };
    b.fn.newWindowPopup = function(c) {
        if (a[c]) {
            return a[c].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof c === "object" || !c) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + c + " does not exist on jQuery.newWindowPopup")
            }
        }
    }
})(jQuery);

function initActionButtonPanel(d) {
    var c = d.parent().data("node");
    var b = d.find(".actionStatus");
    b.messagePopup({
        cancel: function() {
            stopAction(d)
        },
        title: d.find(".contentLinkText span").html()
    });
    var a = new Communicator();
    a.addSuccessHandler(function(g) {
        var f = g.actionResponse;
        if (f.success) {
            b.messagePopup("text", f.status);
            b.messagePopup("show")
        }
        if (f.pollDelay != undefined) {
            pollStatus(d, f.pollDelay)
        } else {
            window.setTimeout(function() {
                b.messagePopup("hide")
            }, 1500)
        }
    });
    var e = {
        c: c
    };
    d.find(".action").click(function() {
        a.sendData(MAIN_CONTENT_PATH, "POST", d, "json", e)
    })
}

function initActionButton(e) {
    var c = e.parent().data("node");
    var a = new Communicator();
    a.addSuccessHandler(function(n) {
        var l = n.actionResponse;
        var h = undefined;
        var k = e.parent().data("callback") ? true : false;
        var g = (e.parent().data("callback") && e.parent().data("callback").indexOf("external") >= 0) ? true : false;
        var p = e.data("cancel");
        var s = (p != undefined && Number(p) > 0) ? true : false;
        if (g) {
            if (l.pollDelay != undefined) {
                e.popup("hide");
                if (s) {
                    $(e).popup({
                        messageText: l.status,
                        buttonOneId: "TXT_CANCEL",
                        buttonOneCallback: function() {
                            stopAction(e)
                        },
                        autoHide: false,
                        showCloseButton: false
                    })
                } else {
                    $(e).popup({
                        messageText: l.status,
                        autoHide: false,
                        showCloseButton: false
                    })
                }
                pollStatus(e, l.pollDelay)
            } else {
                var o = l.refresh;
                var r = l.status;
                var q = function() {
                    e.popup("hide");
                    if (o != false) {
                        reloadContent();
                        timeouts.push(setTimeout(function() {
                            $(".popup").remove()
                        }, 1000))
                    }
                };
                displayResultPopup(e, l.success, r, q)
            }
        } else {
            e.popup("hide");
            var m = e.data("update");
            var r;
            var q;
            if (m != undefined) {
                r = getRawTranslation(l.status.id);
                q = function() {
                    $("#" + m).text(r)
                }
            } else {
                r = l.text;
                q = function() {
                    e.popup("hide")
                }
            }
            displayResultPopup(e, l.success, r, q)
        }
    });
    var f = {
        c: c
    };
    e.find(".action").click(function() {
        var k = e.data("confirm-textid");
        var n = e.data("confirm-text");
        var h = e.data("confirm-yestext");
        var m = e.data("confirm-yesid");
        var g = e.data("confirm-notext");
        var l = e.data("confirm-noid");
        if (m == "") {
            m = "TXT_OK"
        }
        if (l == "") {
            l = "TXT_CANCEL"
        }
        if (h == "") {
            h = getRawTranslation(m)
        }
        if (g == "") {
            g = getRawTranslation(l)
        }
        if (k != "") {
            showConfirmation(e, getRawTranslation(k), h, g, b)
        } else {
            if (n != "") {
                showConfirmation(e, n, h, g, b)
            } else {
                b(e)
            }
        }
    });

    function b() {
        if (e.data("reboot")) {
            showRebootPopup(e, d)
        } else {
            d()
        }
    }

    function d() {
        if (e.data("reboot")) {
            showRebootingPanel(e)
        } else {
            e.popup({
                showCloseButton: false
            }).popup("startSpinner")
        }
        a.sendData(MAIN_CONTENT_PATH, "POST", e, "json", f)
    }
}

function showConfirmation(e, f, d, b, c, a) {
    $(e).popup({
        messageText: f,
        buttonOneText: b,
        buttonOneCallback: a,
        buttonTwoText: d,
        buttonTwoCallback: c
    })
}

function initActionResetDefaultsButton(c) {
    var b = c.parent().data("node");
    var a = new Communicator();
    a.addSuccessHandler(function(e) {
        reloadContent()
    });
    var d = {
        c: b
    };
    c.find(".action").click(function() {
        a.sendData(MAIN_CONTENT_PATH, "POST", c, "json", d)
    })
}

function pollStatus(e, d) {
    var c = e.parent().data("node");
    var a = new Communicator();
    a.addSuccessHandler(function(k) {
        var h = k.nodes.nodes[c];
        e.popup("setText", h.status);
        if (h.pollDelay != undefined) {
            pollStatus(e, h.pollDelay)
        } else {
            e.popup("hide");
            var g = 1;
            if (h.success != undefined) {
                g = h.success
            }
            displayResultPopup(e, g, h.status)
        }
    });
    var f = {
        c: c
    };
    var b = window.setTimeout(function() {
        a.sendData(RAW_CONTENT, "GET", e, "json", f)
    }, d);
    e.popup("setTimeout", b)
}

function stopAction(c) {
    var b = c.parent().data("node");
    var e = c.popup("getTimeout");
    clearTimeout(e);
    var a = new Communicator();
    a.addSuccessHandler(function(h) {
        var g = h.actionResponse;
        var f = false;
        if (g.success) {
            f = Boolean(g.success == 0)
        }
        if (f) {
            console.warn("stopAction failed")
        } else {
            c.popup("setText", g.status);
            if (g.pollDelay != undefined) {
                pollStatus(c, g.pollDelay)
            } else {
                c.popup("hide")
            }
        }
        $("body").unbind("keypress")
    });
    var d = {
        c: b,
        data: JSON.stringify({
            cancel: 1
        })
    };
    a.sendData(MAIN_CONTENT_PATH, "POST", c, "json", d)
}

function initDeleteButton(c) {
    var b = getSetting(c.data("setting"));
    var a = b.val;
    if (b.disabled) {
        c.disable()
    }
    if (a === undefined || a == "") {
        c.find("button").attr("disabled", true)
    }
    c.find("button").click(function() {
        var e = c.data("confirm-text");
        var g = "";
        var f = $.address.queryParams()["tableEditId"];
        var d = $.address.queryParams()["name"];
        var h = $.address.queryParams()["type"];
        if (c.data("action") == "DeleteShortcut") {
            g = getRawComplexTranslation(e, {
                type: $("#ShortcutType option:selected").text(),
                id: "#" + f
            });
            f = h + "/" + escapeString(d)
        } else {
            g = getRawIndexedComplexTranslation(e, [escapeHtml(a)])
        }
        if (c.data("action") == "DeleteLdapGroup") {
            f = $.address.queryParams()["otherEditId"]
        }
        c.popup({
            messageText: g,
            buttonTwoId: "TXT_DELETE",
            buttonTwoCallback: function() {
                c.popup("hide");
                c.popup({
                    showCloseButton: false
                }).popup("startSpinner");
                var k = new Communicator();
                k.addSuccessHandler(function(o) {
                    if (o.deleted || !o.status) {
                        c.popup("hide");
                        popBreadcrumb(1)
                    } else {
                        c.popup("hide");
                        c.popup({
                            messageText: o.errorText,
                            buttonOneId: "TXT_OK",
                            buttonOneCallback: function() {
                                c.hide();
                                if (o.url != undefined && o.url.length > 0) {
                                    navigate_to(o.url, undefined, {
                                        force: true
                                    })
                                }
                            },
                            autoHide: true
                        })
                    }
                });
                var n = c.parent().attr("data-callback");
                var l = window.location.hash;
                var m = {};
                m[n] = {
                    url: l
                };
                k.sendData(DO_DELETE_PATH + "/" + c.data("action") + "/" + f, "DELETE", c, "json", {});
                $(".setting-changed").removeClass("setting-changed")
            },
            buttonOneId: "TXT_CANCEL"
        })
    })
}

function initUnjoinActiveDirectoryButton(a) {
    a.find("button").click(function() {
        var b = a.data("confirm-text");
        var c = getStoredTranslation(b);
        a.popup({
            messageText: c,
            buttonOneId: "TXT_UNJOIN",
            buttonOneCallback: function() {
                var d = new Communicator();
                d.addSuccessHandler(function(h) {
                    if (h.deleted) {
                        popBreadcrumb(1)
                    } else {
                        if (h.failureCause == "noSecurityRole") {
                            displayResultPopup(a, 0, getStoredTranslation("TXT_NO_SECURITY_MENU_PERMISSION"))
                        } else {
                            displayResultPopup(a, 0, getStoredTranslation("TXT_UNJOIN_FAILED"))
                        }
                    }
                });
                var g = a.parent().attr("data-callback");
                var e = window.location.hash;
                var f = {};
                f[g] = {
                    url: e
                };
                d.sendData(DO_DELETE_PATH + "/" + a.data("action"), "DELETE", a, "json", {})
            },
            buttonTwoId: "TXT_CANCEL"
        })
    })
}

function initViewButton(d) {
    var f = d.data("setting");
    var c = getSetting(f);
    var a = (c !== undefined) ? c.val : undefined;
    var e = d.data("action");
    var b = getNodeData(getNodeName(d));
    if (c !== undefined && a == "") {
        d.find("button").attr("disabled", true)
    }
    d.find("button").click(function() {
        var g = getNodeData(b.children[0]);
        if (g.display == "ModalPopup") {
            $(".popup-modal-container").modalPopup("display", d.data("child"), {
                popBreadcrumbCount: d.data("navback")
            })
        } else {
            if (g.display == "NewWindow") {
                var h = MAIN_CONTENT_PATH + "?c=" + g.children[0];
                $.fn.newWindowPopup("display", h, g.title.translated, g.children[0], g.options)
            } else {
                if (g.display == "VncViewerWindow") {
                    startEWSVncServer();
                    setTimeout(function() {
                        displayVncViewerWindow(g)
                    }, 1500)
                }
            }
        }
    })
}

function initTopButton(a) {
    var b = a.data("action");
    a.find("button, a").click(function() {
        if (b == "showModalPopup") {
            $(".popup-modal-container").modalPopup("display", a.data("child"), {
                popBreadcrumbOnSuccessCount: a.data("navback")
            })
        }
        return false
    })
}

function initManageLdapGroupsButton(a) {
    a.find("button").click(function() {
        var d = countChangedNodes(a);
        var c = countInvalidNodes(a);
        if (c > 0) {
            $(a.closest(".page-contents")).popup({
                messageText: getRawTranslation("TXT_PAGE_CONTAINS_INVALID_SETTINGS"),
                buttonOneId: "TXT_OK"
            })
        } else {
            if (d > 0) {
                $(a.closest(".page-contents")).popup({
                    messageText: getRawTranslation("TXT_MUST_SAVE_BEFORE_CONTINUING"),
                    buttonOneId: "TXT_SAVE",
                    buttonOneCallback: function() {
                        saveNodes(a.closest(".page"), function(e) {
                            var f = jQuery.parseJSON(e.responseText);
                            if (f.RC["status"] == 0) {
                                navigate_to(a.data("edit"), undefined, {
                                    force: true,
                                    params: {
                                        tableEditId: f.QueryParams["tableEditId"]
                                    }
                                })
                            }
                        })
                    },
                    buttonTwoId: "TXT_CANCEL"
                })
            } else {
                var b = parseInt($.address.queryParams().tableEditId);
                if (isNaN(b) || b <= 0) {
                    $(a.closest(".page-contents")).popup({
                        messageText: getRawTranslation("TXT_LDAP_MUST_SPECIFY_SOME_DATA"),
                        buttonOneId: "TXT_OK"
                    });
                    return
                }
                navigate_to(a.data("edit"), undefined, {
                    force: true,
                    params: {
                        tableEditId: b
                    }
                })
            }
        }
    })
}

function initPrintColorSamplesButton(a) {
    a.find("button").click(function() {
        var c = a.closest(".panel-contents");
        var d = a.parent().data("node");
        var e = {
            c: d
        };
        e.sampleId = c.find("select").val();
        e.model = c.find("option:checked").attr("colormodel");
        e.rangeType = c.find("input[type=radio]:checked").val();
        if (e.rangeType == "1") {
            if (e.model == "RGB") {
                e.r = c.find("input.advanced-color-samples-r").val();
                e.g = c.find("input.advanced-color-samples-g").val();
                e.b = c.find("input.advanced-color-samples-b").val();
                e.inc = c.find("input.advanced-color-samples-rgb-increment").val()
            } else {
                if (e.model == "CMYK") {
                    e.cy = c.find("input.advanced-color-samples-c").val();
                    e.m = c.find("input.advanced-color-samples-m").val();
                    e.y = c.find("input.advanced-color-samples-y").val();
                    e.k = c.find("input.advanced-color-samples-k").val();
                    e.inc = c.find("input.advanced-color-samples-cmyk-increment").val()
                }
            }
        }
        c.popup({
            showCloseButton: false
        }).popup("startSpinner");
        var b = new Communicator();
        b.addSuccessHandler(function(f) {
            c.popup("hide");
            var g;
            if (f.actionResponse["success"] == 1) {
                g = getStoredTranslation("TXT_PRINT_JOB_SENT_SUCCESSFULLY")
            } else {
                g = getStoredTranslation("TXT_PRINT_JOB_FAILED")
            }
            displayResultPopup(c, f.actionResponse["success"], g)
        });
        b.sendData(MAIN_CONTENT_PATH, "POST", a, "json", e)
    })
}

function initOptimizeFaxCompatibility(b) {
    var a = b.parent().data("node");
    b.find("button").click(function() {
        var d = b.data("confirm-textid");
        var e = getRawTranslation(d);
        var c = {
            c: a
        };
        b.popup({
            messageText: e,
            buttonOneId: "TXT_CANCEL",
            buttonTwoId: "TXT_CONTINUE",
            buttonTwoCallback: function() {
                var f = new Communicator();
                f.addSuccessHandler(function(h) {
                    var g;
                    if (h.actionResponse["success"] == 1) {
                        g = getStoredTranslation("TXT_DONE")
                    } else {
                        g = getStoredTranslation("TXT_FAILED")
                    }
                    displayResultPopup(b, h.actionResponse["success"], g)
                });
                f.sendData(MAIN_CONTENT_PATH, "POST", b, "json", c)
            }
        })
    })
}

function initDiskEncryptionButton(b) {
    var a = b.parent().data("node");
    b.find("button").click(function() {
        var e = b.data("confirm-text");
        var f = getRawTranslation(e);
        var d = b.data("confirm-proceed-message");
        var c = {
            c: a
        };
        b.popup({
            messageText: f,
            buttonOneId: "TXT_CANCEL",
            buttonTwoId: d,
            buttonTwoCallback: function() {
                var g = new Communicator();
                g.sendData(MAIN_CONTENT_PATH, "POST", b, "json", c)
            }
        }).popup("setDiskEncryptionPopup")
    })
}

function showResponse(a, b, c) {
    $(".popup-modal-container").popup("hide")
}

function showErrorMsg(b, c, a) {
    $(".popup-modal-container").popup("hide")
}

function completeStateHandler(e, c, m) {
    var k = e.responseText;
    var l = 1;
    try {
        var n = jQuery.parseXML(k);
        c = getRawTranslation("TXT_IMPORT_SUCCESSFUL")
    } catch (d) {
        c = getRawTranslation("TXT_IMPORT_SUCCESSFUL");
        var b = k.search("{");
        if (b >= 0) {
            var g = k.substring(b);
            var h = jQuery.parseJSON(g);
            if (h.RC["status"] == 1) {
                c = h.RC["error"];
                if ((c == undefined) || (c.length <= 0)) {
                    c = getRawTranslation("TXT_IMPORT_FAILED")
                }
                l = 0
            }
        } else {
            console.warn("VCC Import responseText: " + k);
            if ($.trim(k) != "OK") {
                c = getRawTranslation("TXT_IMPORT_FAILED")
            }
        }
    }
    if (e.status == 200) {
        displayResultPopup($(".popup-modal-container"), l, c);
        document.getElementById("visible_setting_VCCBUNDLE").value = stored_translations.TXT_NO_FILE_SELECTED.text;
        $("#VccImportFileInput").find("form")[0].reset();
        $("#import_VCCBUNDLE").attr("disabled", "disabled")
    } else {
        if (e.statusText != "error") {
            c = getRawTranslation("TXT_IMPORT_FAILED");
            console.warn("VCC Import responseText: " + c + ": " + e.statusText);
            var q = $(n);
            var a = $(q);
            var p = a.find("Logs");
            var o = p.text();
            if (o.length > 0) {
                o = o.replace(/(?:\r\n|\r|\n)/g, "<br />");
                var f = $("<div></div>");
                f.append($("<p class='import-error-msg'>" + c + "</p>"));
                f.append($("<p class='import-error-list'>" + o + "</p>"));
                displayResultPopup($(".popup-modal-container"), 0, f.html())
            } else {
                if (e.statusText.length > 0) {
                    var f = $("<div></div>");
                    f.append($("<p class='import-error-msg'>" + c + "</p>"));
                    f.append($("<p class='import-error-list'>" + e.status.toString() + " " + e.statusText + "</p>"));
                    displayResultPopup($(".popup-modal-container"), 0, f.html())
                } else {
                    displayResultPopup($(".popup-modal-container"), 0, c)
                }
            }
            document.getElementById("visible_setting_VCCBUNDLE").value = stored_translations.TXT_NO_FILE_SELECTED.text;
            $("#VccImportFileInput").find("form")[0].reset();
            $("#import_VCCBUNDLE").attr("disabled", "disabled")
        }
    }
}

function initImportButton(c) {
    var a = c.find("form");
    var b = {
        headers: {
            "X-Csrf-Token": getSessionKey()
        },
        timeout: 600000,
        success: showResponse,
        error: showErrorMsg,
        complete: completeStateHandler
    };
    a.ajaxForm(b);
    c.find("button.import").click(function() {
        $(".popup-modal-container").popup("init", {
            showCloseButton: false,
            autoHide: true
        });
        a.submit();
        $(".popup-modal-container").popup("startSpinner")
    });
    $("#import_VCCBUNDLE").attr("disabled", "disabled")
}

function initExportButton(a) {
    a.find("button").click(function() {
        var b = a.data("resource");
        window.location = b
    })
}

function initExportAuditLog(a) {
    a.find("button").click(function() {
        var c = a.find("select").val();
        var b = "/webglue/downloadLog?type=auditLog&ExportFormat=" + c;
        window.open(b)
    })
}

function initNavigationButton(a) {
    a.find("button").click(function() {
        var b = a.data("child");
        navigate_to(b, undefined, {
            force: true
        })
    })
}

function startEWSVncServer() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/webglue/startEWSVncServer",
        success: function(a) {
            if (a.result) {
                console.log("VNC Server for EWS started successfully.")
            }
        },
        error: function(a) {
            console.warn("Failed to start VNC Server for EWS.")
        }
    })
}

function displayVncViewerWindow(b) {
    const a = 25;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/webglue/getPanelSize",
        success: function(d) {
            var e = "/noVNC/launch_novnc.html?encrypt=1&path=vnc";
            var c = d.panelSize.split("x");
            if (c.length == 2) {
                b.options.width = parseInt(c[0]);
                b.options.height = parseInt(c[1]) + a
            }
            $.fn.newWindowPopup("display", e, b.title.translated, "", b.options)
        },
        error: function(c) {
            console.warn("Error accessing /webglue/getPanelSize.")
        }
    })
}

function initBasicTable(b) {
    var a = {};
    a.maxRowsPerPage = Number(b.attr("data-maxrows"));
    b.table(a)
}

function initSelectTable(e) {
    var c = {};
    c.maxRowsPerPage = Number(e.attr("data-maxrows"));
    c.type = "select";
    e.table(c);
    if (e.parent().data("node") == "ContactList") {
        var g = e.find("button.select");
        var d = e.attr("data-select");
        var b = $('<div class="groupList"></div>');
        b.append('<div data-id="new">' + getStoredTranslation("TXT_ADDRESSBOOK_NEW_GROUP") + "</div>");
        for (i in getSetting("GROUP_LIST").data) {
            var a = getSetting("GROUP_LIST").data[i];
            var f = $("<div></div>").attr("data-id", a.id).text(a.groupname);
            b.append(f)
        }
        b.find("div").click(function(k) {
            var h = e.data("table").selected;
            var l = $(this).attr("data-id");
            navigate_to(d, k, {
                params: {
                    tableEditId: l,
                    selectedItems: JSON.stringify(h)
                }
            })
        });
        g.parent().append(b);
        g.parent().css("position", "relative");
        b.hide();
        g.click(function() {
            b.toggle()
        });
        $("html").click(function(h) {
            if (g.has(h.target).length === 0 && !g.is(h.target)) {
                b.hide()
            }
        });
        g.attr("disabled", "disabled")
    }
}

function initDeleteTable(b) {
    var a = {};
    a.maxRowsPerPage = Number(b.attr("data-maxrows"));
    a.type = "delete";
    b.table(a);
    b.bind("refresh", function() {
        b.table("reset")
    })
}

function resetDeleteTable(a) {
    a.table("reset");
    a.removeClass("setting-changed")
}

function getDeleteTable(a) {
    var b = {
        "delete": a.table("getDeleted")
    };
    return b
}(function(b) {
    var d = 10;
    var c = 0;
    var a = {
        init: function(s) {
            var s = b.extend({
                type: "basic",
                maxRowsPerPage: undefined
            }, s);
            var h = this;
            var k = h.attr("data-edit");
            var p = h.attr("data-setting");
            if (p === "") {
                return
            }
            var r = getSetting(p);
            var e = 0;
            var m = false;
            if (b.cookies.get(p + "_num_rows") !== null) {
                e = b.cookies.get(p + "_num_rows")
            } else {
                if ((h.data("length") !== undefined) && (Number(h.data("length")) > 0)) {
                    e = Number(h.data("length"))
                } else {
                    e = d
                }
            }
            if ((e !== undefined) && (r.length != e)) {
                setSetting(p, "length", e);
                m = true
            }
            this.data("table", {
                target: h,
                deleted: [],
                selected: [],
                options: s,
                selectedName: []
            });
            a.update.apply(h);
            h.find("thead th.sortable").click(function() {
                var t = b(this).hasClass("headerSortDown");
                var u = b(this).attr("data-field");
                h.find(".headerSortDown,.headerSortUp").removeClass("headerSortUp").removeClass("headerSortDown");
                if (t) {
                    b(this).addClass("headerSortUp")
                } else {
                    b(this).addClass("headerSortDown")
                }
                a.reload(h)
            });
            var o = getNodeData(getNodeName(h))["buttons"];
            for (i in o) {
                if (o[i].type == "add" && o[i].hideshows != undefined) {
                    var q = o[i].hideshows;
                    for (j in q) {
                        var g = q[i].visible;
                        if (g == 0) {
                            h.find("button." + o[i].type).hide()
                        }
                    }
                }
            }
            h.find("button.add").click(function(u) {
                if (h.parent().data("node") == "ShortcutList") {
                    var v = h.find("button.add").data("confirm-text");
                    var w = {};
                    w.method = "findNextAvailable";
                    var t = new Communicator();
                    t.sendData(SHORTCUTS, "GET", h, "json", w);
                    t.addSuccessHandler(function(x) {
                        if ((x.nextId == -1) || (x.nextId > 99999)) {
                            b(h).popup({
                                messageText: getRawTranslation(v),
                                buttonOneId: "TXT_OK"
                            })
                        } else {
                            navigate_to(k, u, {
                                params: {
                                    tableEditId: "new"
                                }
                            })
                        }
                    })
                } else {
                    navigate_to(k, u, {
                        params: {
                            tableEditId: "new"
                        }
                    })
                }
            });
            h.find("button.addwithparams").click(function() {
                var u = h.data("edit-add");
                var t = new ContentHandler(b("#maincontent"));
                t.loadContent(u, b.address.queryParams());
                b.address.path(u)
            });
            h.find("button.addselected").click(function() {
                var u = a.getHeaderList(h);
                var w = {};
                var x = [];
                h.find("input:checked").each(function() {
                    var A = b(this).closest("tr");
                    var z = {};
                    var y = 0;
                    A.find("td:not(.select)").each(function() {
                        z[u[y]] = b(this).text();
                        y++
                    });
                    x.push(z)
                });
                if (x.length == 0) {
                    return
                }
                var v = parseInt(b.address.queryParams().tableEditId);
                w = {
                    c: h.data("node"),
                    ldap_id: v,
                    data: JSON.stringify(x)
                };
                var t = new Communicator();
                h.disable();
                t.addSuccessHandler(function(y) {
                    if (y.actionResponse["RC"]["status"] == 0) {
                        popBreadcrumb(1, "?tableEditId=" + v)
                    }
                });
                t.addCompleteHandler(function(y) {
                    h.enable()
                });
                t.sendData(MAIN_CONTENT_PATH, "POST", h, "json", w)
            });
            h.find("#printSelected .optionsList .option").each(function() {
                b(this).click(function() {
                    l(b(this))
                })
            });

            function l(t) {
                if (h.parent().data("node") == "JobLogList") {
                    printJobAccountingLogs(h, t);
                    closeModalPopup()
                }
            }
            h.find("button.exportSelected").click(function() {
                if (h.parent().data("node") == "JobLogList") {
                    exportJobAccountingLogs(h);
                    closeModalPopup()
                }
            });
            var f = new Communicator();
            h.find("button.massDelete").click(function() {
                var K = h.data("table").selected;
                var v = h.data("table").selectedName;
                var I = h.find("button.massDelete").data("confirm-text");
                var P = h.find("button.massDelete").data("alt-confirm-text");
                var C = h.find("button.massDelete").data("alt-confirm-two-text");
                var H = h.find("button.massDelete").data("alt-confirm-three-text");
                var t = h.find("button.massDelete").data("buttontwoid-text");
                var O = h.find("button.massDelete").data("alt-buttontwoid-text");
                var G = getRawTranslation(I);
                G = G.replace("<number/>", (K.length).toString());
                if (h.parent().data("node") == "JobLogList") {
                    G = getRawTranslation(I);
                    if (K.length == r.data.length) {
                        G = getRawTranslation(P)
                    }
                }
                if ((h.parent().data("node") == "ShortcutList") || (h.parent().data("node") == "DeviceCertificatesTable") || (h.parent().data("node") == "ManageCATable")) {
                    if (K.length == 1) {
                        var B = a.getHeaderList(h);
                        var y = h.find("input:checked").closest("tr");
                        var z = 0;
                        var w = "";
                        var L = "";
                        var Q = "";
                        y.find("td:not(.select)").each(function() {
                            if (B[z] == "typeStr") {
                                w = b(this).text()
                            }
                            if (B[z] == "number") {
                                L = b(this).text()
                            }
                            if (B[z] == "friendlyName") {
                                Q = b(this).text();
                                if (Q == "default") {
                                    G = getRawTranslation(P)
                                }
                            }
                            if (B[z] == "name") {
                                Q = b(this).text()
                            }
                            z++
                        });
                        G = G.replace("<type/>", w);
                        G = G.replace("<id/>", L);
                        G = G.replace("<name/>", escapeHtml(Q))
                    } else {
                        G = getRawTranslation(P);
                        if (h.parent().data("node") == "DeviceCertificatesTable") {
                            G = getRawTranslation(C);
                            var B = a.getHeaderList(h);
                            var A = B.length;
                            var y = h.find("input:checked").closest("tr");
                            var z = 0;
                            y.find("td:not(.select)").each(function() {
                                if (B[z] == "friendlyName") {
                                    if (b(this).text() == "default") {
                                        G = getRawTranslation(H);
                                        return false
                                    }
                                }
                                z++;
                                if (z >= A) {
                                    z = 0
                                }
                            })
                        }
                        G = G.replace("<number/>", (K.length).toString())
                    }
                }
                var N = h.data("setting");
                var E = 1500;
                var J = new Array();
                J[0] = DO_DELETE_PATH + "/" + h.data("node");
                if (h.parent().data("node") == "ShortcutList") {
                    var F = h.find(".tableHolder").find(".pagingContainer");
                    var x = F.find(".filter").attr("selection");
                    if (x !== undefined) {
                        if (x == "None") {
                            var D = h.find("tbody");
                            var y = D.find("input:checked").closest("tr");
                            var x = y.attr("attrtype")
                        }
                        J[0] += "/" + x;
                        var M = 0;
                        v.forEach(function(S) {
                            var R = J[M];
                            var T = unescape(encodeURIComponent(R)).length;
                            if (T < E) {
                                J[M] += "/" + escapeString(S)
                            } else {
                                M++;
                                J[M] = DO_DELETE_PATH + "/" + h.data("node") + "/" + x + "/" + escapeString(S)
                            }
                        })
                    }
                } else {
                    var M = 0;
                    K.forEach(function(S) {
                        var R = J[M];
                        if (R.length < E) {
                            J[M] += "/" + S
                        } else {
                            M++;
                            J[M] = DO_DELETE_PATH + "/" + h.data("node") + "/" + S
                        }
                    })
                }
                var u = "TXT_DELETE";
                if ((t != undefined) && (K.length == 1)) {
                    u = t
                } else {
                    if ((O != undefined) && (K.length > 1)) {
                        u = O
                    }
                }
                b(h).popup({
                    messageText: G,
                    buttonTwoId: u,
                    buttonTwoCallback: function() {
                        var R = new Communicator();
                        R.addSuccessHandler(function(T) {
                            if (T.deleted) {
                                if (N == "GROUP_LIST") {
                                    K.forEach(function(U) {
                                        b(".groupList").find("div").each(function() {
                                            if (b(this).attr("data-id") == U) {
                                                b(this).remove();
                                                return false
                                            }
                                        })
                                    })
                                }
                                h.data("table").selected = [];
                                h.data("table").selectedName = [];
                                h.find("button.select").attr("disabled", "disabled");
                                h.find("button.massDelete").attr("disabled", "disabled");
                                a.reload(h)
                            } else {
                                h.popup("hide");
                                h.popup({
                                    messageText: T.errorText,
                                    buttonOneId: "TXT_OK",
                                    autoHide: true
                                });
                                a.reload(h)
                            }
                        });
                        for (var S = 0; S < J.length; S++) {
                            R.sendData(J[S], "DELETE", h, "json", {})
                        }
                    },
                    buttonOneId: "TXT_CANCEL"
                })
            });
            h.find("button.massDelete").attr("disabled", "disabled");
            h.find("button.showpopup").click(function() {
                var t = getNodeData(getNodeName(h));
                var u = getNodeData(t.children[0]);
                b(".popup-modal-container").modalPopup("display", u.name, undefined)
            });
            h.find(".tableSize").val(r.length);
            h.find(".tableSize").focusout(function() {
                a.updateTableLength(h)
            }).keydown(function(u) {
                var t = 13;
                if (u.which == t) {
                    a.updateTableLength(h)
                }
            });
            h.find(".tableSize").numeric({
                min: 1,
                max: s.maxRowsPerPage
            });
            if (m) {
                m = false;
                a.updateTableLength(h)
            }
            if (h.data("searchable")) {
                var n = {};
                n.type = "live";
                n.target = h;
                n.selectFunc = function() {};
                n.sourceFunc = function() {
                    a.reload(h)
                };
                h.find(".liveSearch").search(n);
                h.find(".live-search-input").keydown(function(t) {
                    if (b(this).val() != "") {
                        b(this).keyup(function(u) {
                            var v = h.attr("data-setting");
                            var w = 0;
                            if (b(this).val() == "") {
                                w = b.cookies.get(v + "_original_offset")
                            }
                            setSetting(v, "offset", w);
                            a.reload(h);
                            b(this).unbind("keyup")
                        })
                    } else {
                        b(this).keyup(function(v) {
                            if (b(this).val() != "") {
                                var w = h.attr("data-setting");
                                var u = getSetting(w);
                                b.cookies.set(w + "_original_offset", u.offset);
                                a.reload(h)
                            }
                        })
                    }
                })
            }
            return this
        },
        getDeleted: function() {
            return this.data("table").deleted
        },
        getHeaderList: function(e) {
            var f = [];
            e.find("th").each(function() {
                var g = b(this).data("field");
                if (g !== undefined && g != "") {
                    f.push(g)
                }
            });
            return f
        },
        getParams: function(f) {
            var o = f.attr("data-setting");
            var p = getSetting(o);
            var e = p.length;
            var k = p.offset;
            var q = f.find(".live-search-input").val();
            var l = f.find(".headerSortUp").length > 0;
            var n = f.find(".headerSortUp,.headerSortDown").attr("data-field");
            var m = "None";
            if (f.find(".filter").length) {
                m = f.find(".filter").attr("selection")
            }
            var g = {
                sortField: n,
                reverse: l,
                offset: p.offset,
                length: p.length,
                search: q,
                type: m
            };
            var h = b.address.queryParam("tableEditId");
            if (h != "") {
                g.tableEditId = h
            }
            return g
        },
        select: function(e, g) {
            if (typeof(g) === "undefined") {
                return
            }
            var f = e.attr("data-edit");
            navigate_to(f, undefined, {
                params: {
                    tableEditId: g
                }
            })
        },
        reload: function(f) {
            var n = f.attr("data-refresh");
            var g = a.getParams(f);
            var m = f.attr("data-setting");
            var o = getSetting(m);
            if (f.data("node") == "ShortcutList") {
                f.attr("data-select", SHORTCUTLIST_EDIT_PATH + g.type);
                f.attr("data-edit-add", SHORTCUTLIST_EDIT_PATH + g.type);
                f.attr("data-edit", SHORTCUTLIST_EDIT_PATH + g.type)
            }
            var h = new ContentHandler();
            h.addSuccessHandler(function() {
                a.update.apply(f)
            });
            if ((m == "CONTACT_LIST" || m == "GROUP_LIST") && o.data.length == 0) {
                if ((f.find(".nextPage").attr("disabled") == "disabled") && (f.find(".prevPage").attr("disabled") == undefined)) {
                    var k = g.offset - g.length;
                    g.offset = k
                }
            }
            if ((f.find(".filter").length) && (f.find(".filter").attr("selection") != "None")) {
                var l = {};
                l.type = f.find(".filter").attr("selection");
                var e = new Communicator();
                e.addSuccessHandler(function(p) {
                    if (p.list.length == 0) {
                        f.find(".filter").attr("selection", "None");
                        g.type = f.find(".filter").attr("selection")
                    }
                    h.loadContent(n, g)
                });
                e.sendData(SHORTCUTS, "GET", f, "json", l)
            } else {
                h.loadContent(n, g)
            }
        },
        getListCount: function(e) {
            b.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: "/webglue/contacts/getListCount",
                data: {
                    settingId: e
                },
                success: function(f) {
                    c = f.result
                },
                error: function(f) {
                    console.warn("Failed to getListCount.")
                }
            });
            return
        },
        reset: function() {
            this.data("table").deleted = [];
            clearSettingChanged(this);
            a.update.apply(this)
        },
        update: function() {
            this.find("tbody").empty();
            var f = this;
            var r = this.data("table").options;
            var o = f.attr("data-setting");
            if (o === "") {
                return
            }
            var g = f.attr("data-edit");
            var q = getSetting(o);
            var m = (f.find(".tableSize") !== undefined) ? Number(f.find(".tableSize").val()) : 0;
            var h = a.getParams(f);
            f.data("table").selected = [];
            f.data("table").selectedName = [];
            if (q.length < m) {
                setSetting(o, "length", m)
            }
            for (i in q.data) {
                a.addTableRow.call(f, q.data[i], i % 2)
            }
            if (q.data.length <= 0) {
                numColumns = q.headers.length + 1;
                var e = b("<tr></tr>");
                if (h.search != undefined && h.search != "") {
                    e.append("<td colspan=" + numColumns + ">" + getStoredTranslation("TXT_NO_RESULTS_FOR") + " " + escapeHtml(h.search) + "</td>")
                } else {
                    if ((o == "CONTACT_LIST" || o == "GROUP_LIST") && q.total > 0) {
                        a.reload(f)
                    } else {
                        if (f.data("searchable")) {
                            if (o == "SHORTCUT_LIST") {
                                c = q.listcount
                            } else {
                                a.getListCount(o)
                            }
                        }
                        if (c <= 0) {
                            e.append("<td colspan=" + numColumns + ">" + getRawTranslation(f.data("empty-text")) + "</td>");
                            f.find(".tableHolder").find(".pagingContainer").hide();
                            f.find(".liveSearch").hide()
                        }
                    }
                }
                e.css("text-align", "center");
                f.find("tbody").append(e)
            }
            if (f.parent().data("node") == "JobLogList") {
                var k = f.find(".tableInfo .translated");
                var p = parseInt(k.attr("data-textid"));
                var n = getStoredTranslation(p);
                n = n.replace("<number/>", q.data.length.toString());
                k.replaceWith(n)
            }
            f.find(".nextPage").unbind("click").click(function() {
                if (b(this).attr("disabled") === undefined) {
                    setSetting(o, "offset", q.offset + q.length);
                    a.reload(f)
                }
            });
            f.find(".prevPage").unbind("click").click(function() {
                if (b(this).attr("disabled") === undefined) {
                    setSetting(o, "offset", q.offset - q.length);
                    a.reload(f)
                }
            });
            a.updateCurPageInfo(f, q);
            f.find("td.delete").click(function() {
                var u = b(this).closest("tr");
                var v = Number(u.attr("data-id"));
                var s = f.data("table").deleted;
                if (u.hasClass("deleted")) {
                    var t = s.indexOf(v);
                    s.splice(t, 1);
                    u.removeClass("deleted")
                } else {
                    f.data("table").deleted.push(v);
                    u.addClass("deleted")
                }
                if (f.find("tr.deleted").length > 0) {
                    f.addClass("setting-changed")
                } else {
                    f.removeClass("setting-changed")
                }
                updateButtonRow(f)
            });
            f.find("td.select input").click(function() {
                var w = b(this).closest("tr");
                var x = Number(w.attr("data-id"));
                var u = f.data("table").selected;
                var v = w.attr("destname");
                var t = f.data("table").selectedName;
                if (b(this).is(":checked")) {
                    f.data("table").selected.push(x);
                    f.data("table").selectedName.push(v)
                } else {
                    var s = u.indexOf(x);
                    if (s != -1) {
                        u.splice(s, 1);
                        t.splice(s, 1);
                        b(this).removeAttr("checked")
                    }
                    if (f.find("th.select input").is(":checked")) {
                        f.find("th.select input").removeAttr("checked")
                    }
                }
                a.updateButtons.call(f, u)
            });
            f.find("th.select input").click(function() {
                var s = f.find("input").closest("tr");
                f.data("table").selected = [];
                f.data("table").selectedName = [];
                if (b(this).is(":checked")) {
                    b(this).attr("checked", 1);
                    s.find("td.select input").each(function() {
                        if (this.disabled == false) {
                            b(this).attr("checked", 1)
                        }
                    });
                    f.find("input:checked").each(function() {
                        var u = b(this).closest("tr");
                        var v = Number(u.attr("data-id"));
                        var t = u.attr("destname");
                        if (!isNaN(v)) {
                            f.data("table").selected.push(v);
                            f.data("table").selectedName.push(t)
                        }
                    })
                } else {
                    b(this).removeAttr("checked");
                    s.find("td.select input").each(function() {
                        s.find("td.select input").removeAttr("checked")
                    })
                }
                a.updateButtons.call(f, f.data("table").selected)
            });
            a.updateButtons.call(f, f.data("table").selected);
            var l = f.find(".dropdownBtn");
            if (l !== undefined && b(".filter").attr("selection") == "None") {
                updateOptions(l)
            }
            f.find(".tableSearch").autocomplete("close");
            return this
        },
        updateButtons: function(h) {
            var k = this;
            if (h.length <= 0) {
                k.find("button.select").attr("disabled", "disabled");
                k.find("#printSelected button").attr("disabled", "disabled");
                k.find("button.exportSelected").attr("disabled", "disabled");
                k.find("button.massDelete").attr("disabled", "disabled");
                k.find("th.select input").removeAttr("checked")
            } else {
                k.find("button.select").removeAttr("disabled");
                k.find("#printSelected button").removeAttr("disabled");
                k.find("button.exportSelected").removeAttr("disabled");
                k.find("button.massDelete").removeAttr("disabled")
            }
            var f = k.find("td.select input:checked").length;
            var g = k.find("td.select input:disabled").length;
            var e = (k.find("td.select input").length) - g;
            if (e != 0 && (f == e)) {
                k.find("th.select input").attr("checked", 1)
            } else {
                k.find("th.select input").removeAttr("checked")
            }
            if (k.find("input:checked").length > 0) {
                k.find("button.addselected").removeAttr("disabled")
            } else {
                k.find("button.addselected").attr("disabled", "disabled")
            }
        },
        addTableRow: function(h, s) {
            var g = this;
            var u = this.data("table").options;
            var q = g.attr("data-setting");
            var t = getSetting(q);
            var k = g.attr("data-edit");
            var l = a.getParams(g);
            var n = g.attr("readonly");
            var e = b("<tr></tr>");
            if (!n) {
                e.attr("data-id", h.id)
            }
            if (h.type !== undefined) {
                e.attr("attrType", h.type)
            }
            if (h.name !== undefined) {
                e.attr("destname", escapeString(h.name))
            }
            if (s) {
                e.addClass("odd")
            }
            if (u.type == "select") {
                var r = b('<td class="select"><input type="checkbox"/></td>');
                e.append(r);
                if (h.is_all_users_group || h.solution_id !== undefined) {
                    r.find("input").disable()
                }
            } else {
                if (u.type == "delete") {
                    e.append('<td class="delete"></td>')
                }
            }
            for (i in t.headers) {
                var m = t.headers[i];
                var p = b("<td></td>").text(h[m.field]);
                if (m.field == "number") {
                    p = b("<td></td>").text("#" + h[m.field])
                }
                if (m.field == "expired-status") {
                    var f = h[m.field];
                    if (f != "Ok") {
                        p = b("<td><img src='/images/warning_icon_24x24.png'></td>")
                    } else {
                        p = b("<td></td>").text("")
                    }
                }
                if (q === "CA_CERTIFICATE_LIST" && m.field === "name") {
                    var o = h.instance_id;
                    if (o != 0) {
                        p = b("<td></td>").html(h[m.field] + "(" + o + ")")
                    }
                }
                if ((m.hideFromTable !== undefined) && m.hideFromTable) {
                    continue
                }
                e.append(p)
            }
            if (!n && k && h.id != undefined) {
                e.find("td:not(.select)").click(function(F) {
                    var y = e.attr("attrType");
                    if (y === "Profile") {
                        b(this).unbind("click")
                    } else {
                        if (y === "JobLog") {
                            var C = e.find(".select input");
                            if (C) {
                                var z = g.data("table").selected;
                                var w = h.id;
                                if (C.is(":checked")) {
                                    var D = z.indexOf(w);
                                    if (D != -1) {
                                        z.splice(D, 1);
                                        C.removeAttr("checked")
                                    }
                                } else {
                                    z.push(w);
                                    C.attr("checked", 1)
                                }
                                a.updateButtons.call(g, z)
                            }
                        } else {
                            var E = b.address.queryParams().tableEditId;
                            if (E) {
                                navigate_to(k, F, {
                                    params: {
                                        tableEditId: E,
                                        otherEditId: h.id
                                    }
                                })
                            } else {
                                if (t.type == "certificate") {
                                    k = g.attr("data-cert-view");
                                    var x = k.split("/");
                                    var G = x[x.length - 1];
                                    var A = g.parent().data("node");
                                    b(".popup-modal-container").modalPopup("display", G, {
                                        certFriendlyName: h.friendlyName,
                                        certCAId: h.ca_id,
                                        certCAName: escapeString(h.name),
                                        refreshTableName: A,
                                        certCAInstance: h.instance_id
                                    })
                                } else {
                                    if (g.data("node") == "ShortcutList") {
                                        var B = g.find(".tableHolder").find(".pagingContainer");
                                        var v = B.find(".filter").attr("selection");
                                        if (v !== undefined) {
                                            if (v == "None") {
                                                if (h.type == "E-mail") {
                                                    v = "Email"
                                                } else {
                                                    if (h.type == "FTP") {
                                                        v = "Ftp"
                                                    } else {
                                                        v = h.type
                                                    }
                                                }
                                            }
                                            g.attr("data-edit", SHORTCUTLIST_EDIT_PATH + v);
                                            k = g.attr("data-edit");
                                            navigate_to(k, F, {
                                                params: {
                                                    tableEditId: h.id,
                                                    name: escapeString(h.name),
                                                    type: v
                                                }
                                            })
                                        }
                                    } else {
                                        navigate_to(k, F, {
                                            params: {
                                                tableEditId: h.id
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                })
            }
            for (i in g.data("table").deleted) {
                if (g.data("table").deleted[i] == h.id) {
                    e.addClass("deleted")
                }
            }
            for (i in g.data("table").selected) {
                if (g.data("table").selected[i] == h.id) {
                    e.find("td.select input").attr("checked", 1)
                }
            }
            g.find("tbody").append(e)
        },
        updateTableLength: function(g) {
            var f = Number(g.find(".tableSize").val());
            if (!isNaN(f) && f > 0) {
                var h = g.attr("data-setting");
                var e = b.cookies.get(h + "_num_rows");
                if (e != f) {
                    b.cookies.set(h + "_num_rows", f);
                    setSetting(h, "length", f)
                }
                setSetting(h, "offset", 0);
                a.reload(g)
            }
        },
        updateCurPageInfo: function(m, k) {
            var f = k.offset + k.data.length;
            var h = m.find(".prevPage");
            var e = m.find(".nextPage");
            e.attr("disabled", (f >= k.total));
            h.attr("disabled", (k.offset <= 0));
            var l = Math.max(Math.ceil(f / k.length), 1);
            var g = Math.max(Math.ceil(k.total / k.length), 1);
            m.find(".pageCount").text(l + "/" + g)
        }
    };
    b.fn.table = function(e) {
        if (a[e]) {
            return a[e].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof e === "object" || !e) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + e + " does not exist on jQuery.table")
            }
        }
    }
})(jQuery);

function escapeString(a) {
    if (!a) {
        return ""
    }
    a = replaceAll("%", "%25", a);
    a = replaceAll("@", "%40", a);
    a = replaceAll("#", "%23", a);
    a = replaceAll("$", "%24", a);
    a = replaceAll("&", "%26", a);
    a = replaceAll("=", "%3D", a);
    a = replaceAll("+", "%2B", a);
    a = replaceAll(";", "%3B", a);
    a = replaceAll(",", "%2C", a);
    a = replaceAll("/", "%2F", a);
    a = replaceAll("\\", "%5C", a);
    a = replaceAll("?", "%3F", a);
    a = replaceAll(".", "%2E", a);
    return a
}

function replaceAll(c, a, b) {
    if (!c || !a || !b) {
        return ""
    }
    return b.replace(new RegExp(escapeRegExp(c), "g"), a)
}

function escapeRegExp(a) {
    if (!a) {
        return ""
    }
    return a.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
}(function(b) {
    var a = {
        init: function(c) {
            var c = b.extend({
                type: "basic",
                target: undefined,
                selectFunc: undefined,
                sourceFunc: undefined,
                length: 7
            }, c);
            var d = this;
            this.data("search", {
                target: d,
                options: c
            });
            if (c.sourceFunc === undefined) {
                c.sourceFunc = function(f, e) {
                    a.liveSearch(d, f, e)
                }
            }
            if (c.type == "live") {
                d.find(".input").autocomplete({
                    source: c.sourceFunc,
                    select: function(e, f) {
                        e.preventDefault();
                        a.select(d, f.item.value)
                    },
                    focus: function(e, f) {
                        b("li.ui-state-hover").removeClass("ui-state-hover");
                        b("a#ui-active-menuitem").parent(".ui-menu-item").addClass("ui-state-hover");
                        e.preventDefault()
                    },
                    minLength: 2,
                    appendTo: d.find(".live-search-content")
                })
            }
            d.find(".input").keydown(function(f) {
                var e = 13;
                if (f.which == e) {
                    d.find(".input").autocomplete("search")
                }
            });
            return this
        },
        liveSearch: function(f, e, d) {
            var g = f.data("source");
            var h = a.getParams(f);
            h.search = e.term;
            h.c = g;
            var c = new Communicator();
            c.addSuccessHandler(function(n) {
                var p = f.data("setting");
                var m = n.nodes.settings[p];
                var l = Array();
                var o = f.data("resultformat");
                var k = "";
                for (i in m.data) {
                    k = formatString(o, m.data[i]);
                    l.push({
                        label: unescapeHtml(k),
                        value: m.data[i]
                    })
                }
                if (l.length <= 0) {
                    var k = getRawTranslation("TXT_NO_RESULTS_FOR") + " " + e.term;
                    l.push({
                        label: k,
                        value: undefined
                    })
                }
                d(l)
            });
            c.sendData(RAW_CONTENT, "GET", f, "json", h)
        },
        select: function(e, f) {
            var d = e.data("search").options;
            var c = d.selectFunc;
            if (c != undefined && typeof(f) === "object") {
                c.call(d.elem, f)
            }
            e.find(".input").val("")
        },
        reload: function(d) {
            var c = d.attr("data-refresh");
            var f = a.getParams(d);
            var e = new ContentHandler();
            e.addSuccessHandler(function() {
                a.update.apply(d)
            });
            e.loadContent(c, f)
        },
        reset: function() {
            a.update.apply(this)
        },
        updateTableSearch: function(d) {
            var e = d.attr("data-setting");
            var c = getSetting(e);
            c.search = d.find(".input").val();
            a.reload(d)
        },
        getParams: function(f) {
            var d = f.data("search").options;
            var h = {};
            var c = f.find(".headerSortUp").length > 0;
            var g = f.find(".headerSortUp,.headerSortDown").attr("data-field");
            var e = f.find(".input").val();
            h = {
                sortField: g,
                reverse: c,
                offset: 0,
                length: d.length,
                search: e
            };
            return h
        },
    };
    b.fn.search = function(c) {
        if (a[c]) {
            return a[c].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof c === "object" || !c) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + c + " does not exist on jQuery.table")
            }
        }
    }
})(jQuery);

function doConflictChecks(c) {
    if ($(".popup-modal").length && getNodeName(c.closest(".popup-modal")) == "OcrRecognizedLanguagesPopup") {
        checkOcrLangCombos(c)
    } else {
        var b = {};
        var a = {};
        analyzeConflicts(c.parent().attr("id"), b, a);
        resolveMarkedConflicts(b)
    }
}

function analyzeConflicts(b, c, a) {
    if (a[b] != undefined) {
        return
    }
    a[b] = 1;
    if (stored_nodes[b] == undefined) {
        return
    }
    if (stored_nodes[b].conflictdata == undefined) {
        return
    }
    $.each(stored_nodes[b].conflictdata, function(m, f) {
        switch (f.type) {
            case "values":
                var n = f.values;
                var g = getNodeValue($("#" + f.node + " div[data-setting-type]"));
                var e = false;
                for (var k = 0; k < n.length; k++) {
                    if (g == n[k]) {
                        e = true;
                        break
                    }
                }
                if (f.invert != undefined && f.invert == 1) {
                    e = !e
                }
                if (e) {
                    executeConflictActions(f.actions, c, a)
                }
                break;
            case "multiValues":
                var l = false;
                var d = f.nodes;
                for (var k = 0; k < d.length; k++) {
                    var n = d[k].values;
                    var g = getNodeValue($("#" + d[k].node + " div[data-setting-type]"));
                    var e = false;
                    for (var h = 0; h < n.length; h++) {
                        if (g == n[h]) {
                            e = true;
                            break
                        }
                    }
                    if (d[k].invert != undefined && d[k].invert == 1) {
                        e = !e
                    }
                    if (!e) {
                        l = true;
                        break
                    }
                }
                if (f.invert != undefined && f.invert == 1) {
                    l = !l
                }
                if (!l) {
                    executeConflictActions(f.actions, c, a)
                }
                break;
            default:
                console.warn("Unknown conflict type " + f.type + "!");
                return
        }
    })
}

function executeConflictActions(c, b, a) {
    $.each(c, function(d, e) {
        switch (e.action) {
            case "changeValues":
                conflictChangeValues(e);
                break;
            case "markNode":
                if (b[e.node] == undefined || (b[e.node].markType == "none" && (e.markType == "conflict" || e.markType == "invalid")) || (b[e.node].markType == "invalid" && e.markType == "conflict")) {
                    b[e.node] = {
                        markType: e.markType,
                        message: e.message
                    };
                    analyzeConflicts(e.node, b, a)
                }
                break;
            default:
                console.warn("Unknown conflict action type " + e.action + "!");
                return
        }
    })
}

function conflictChangeValues(e) {
    var c = $("#" + e.node + " div[data-setting-type]");
    var k = c.find("select");
    var a = k.val();
    k.find("option").remove();
    var d = false;
    var b = e.newValues;
    for (var f = 0; f < b.length; f++) {
        var h;
        if (b[f].textid != undefined) {
            h = getStoredTranslation(b[f].textid)
        } else {
            h = b[f].text
        }
        var g = '<option value="' + b[f].value + '" role="option">' + h + "</option>";
        if (a == b[f].value) {
            d = true
        }
        k.append(g)
    }
    if (d) {
        k.val(a)
    } else {
        k.val(e["default"])
    }
    checkIfNodeChanged(c);
    updateButtonRow(c)
}

function conflictMarkNode(d, c) {
    var b = $("#" + d + " div[data-setting-type]");
    var a = b.find(".node-error");
    if (a.length == 0) {
        console.warn("I can't find the node-error container for node " + d + "!");
        return
    }
    if (c.markType == "conflict" || c.markType == "invalid") {
        a.show()
    } else {
        a.hide()
    }
    a.find(".node-error-image").removeClass("node-error-image-conflict").removeClass("node-error-image-invalid");
    if (c.markType == "conflict") {
        a.find(".node-error-image").addClass("node-error-image-conflict")
    } else {
        if (c.markType == "invalid") {
            a.find(".node-error-image").addClass("node-error-image-invalid")
        }
    }
    markSetting(b, c.markType);
    if (c.message != undefined) {
        if (c.message.id != undefined) {
            a.find(".node-error-text").text(getStoredTranslation(c.message.id))
        } else {
            a.find(".node-error-text").text(c.message.text)
        }
    } else {
        a.find(".node-error-text").html("")
    }
}

function resolveMarkedConflicts(a) {
    $.each(a, function(b, c) {
        conflictMarkNode(b, c)
    })
}(function(b) {
    var a = {
        init: function(c) {
            return this.each(function() {
                var e = b(this);
                var d = e.parent().attr("id");
                c.change(function() {
                    b("[data-control-node=" + d + "],[data-value-action-node=1]").trigger("SettingChanged", [getNodeName(e), getNodeValue(e)]);
                    b("[data-control-node=" + d + "],[data-value-conflict-node=1]").trigger("SettingChanged", [getNodeName(e), getNodeValue(e)]);
                    b("[data-switch-node=" + d + "]").trigger("SettingChanged", [getNodeName(e), getNodeValue(e)]);
                    b("[data-listener-node=" + d + "]").trigger("SettingChanged", [getNodeName(e), getNodeValue(e)]);
                    b("[data-ocrlistener-nodecompression=" + d + "]").trigger("SettingChanged", [getNodeName(e)]);
                    b("[data-ocrlistener-nodesearchable=" + d + "]").trigger("SettingChanged", [getNodeName(e)]);
                    b("[data-ocrlistener-nodeformat=" + d + "]").trigger("SettingChanged", [getNodeName(e)]);
                    doConflictChecks(e);
                    checkIfNodeChanged(e);
                    updateButtonRow(e)
                });
                e.controlNode();
                e.valueActionNode();
                e.valueConflictNode();
                e.listenerNode();
                e.ocrlistenerNode()
            })
        }
    };
    b.fn.settingNode = function(c) {
        if (a[c]) {
            return a[c].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof c === "object" || !c) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + c + " does not exist on jQuery.settingNode")
            }
        }
    }
})(jQuery);

function initControlNode(a) {
    a.controlNode();
    a.find("a").click(function() {
        if (!a.attr("disabled")) {
            $(".popup-modal-container").modalPopup("display", a.data("child"), undefined)
        }
    })
}

function removePrefixIdentifier(b) {
    var a = b.indexOf("*");
    if (a > 0) {
        return b.substring(0, a)
    }
    return b
}(function($) {
    $.fn.controlNode = function() {
        return this.each(function() {
            var elem = $(this);
            var controlNode = elem.data("control-node");
            var controlVal = elem.data("control-value");
            var customValidation = elem.data("control-customvalidation");
            var controlValTextId = elem.data("control-valuetextid");
            if (controlValTextId != undefined) {
                controlVal = getRawTranslation(removePrefixIdentifier(controlValTextId))
            }
            controlVal = splitValues(controlVal);
            var controlAction = elem.data("control-action");
            var settingType = elem.data("setting-type");
            var focusStr = "focus" + settingType + "(elem)";
            var focusAttr = elem.data("control-focus-on-enable");
            var updateDateFormatStr = "updateDateFormat" + settingType + "(elem, val)";
            var inheritParentControl = elem.data("control-inheritparentcontrol");
            var genericControlAction = controlAction;
            var genericControlValue = controlVal;
            var genericControlValueTextId = controlValTextId;
            var controlState = "";
            var parentControlState = "";
            var disableVal = elem.data("control-disable-value");
            if (disableVal !== undefined) {
                disableVal = splitValues(disableVal)
            }
            if (controlNode != undefined && controlNode != "") {
                var curNode = $("#" + controlNode + " [data-setting]");
                if (inheritParentControl == true) {
                    var parentControlNode = curNode.data("control-node");
                    if (parentControlNode != undefined && parentControlNode != "") {
                        var parentControlValue = curNode.data("control-value");
                        if (parentControlValue == undefined) {
                            parentControlValue = curNode.attr("data-control-value")
                        }
                        var parentControlValueTextId = elem.data("control-valuetextid");
                        if (parentControlValueTextId == undefined) {
                            parentControlValueTextId = curNode.attr("data-control-valuetextid")
                        }
                        if (parentControlValueTextId != undefined) {
                            parentControlValue = getRawTranslation(removePrefixIdentifier(parentControlValueTextId))
                        }
                        var parentControlAction = curNode.data("control-action");
                        var grandNode = $("#" + parentControlNode + " [data-setting]");
                        if (grandNode.length != 0) {
                            grandVal = getNodeValue(grandNode);
                            genericControlAction = parentControlAction;
                            genericControlValue = parentControlValue;
                            genericControlValueTextId = parentControlValueTextId;
                            parentControlState = evaluateControl(grandVal, true);
                            doControl();
                            curNode.bind("SettingChanged", function(event, eventNodeName, val) {
                                if (eventNodeName != parentControlNode) {
                                    return
                                }
                                genericControlAction = parentControlAction;
                                genericControlValue = parentControlValue;
                                genericControlValueTextId = parentControlValueTextId;
                                parentControlState = evaluateControl(val);
                                doControl();
                                event.stopPropagation()
                            })
                        } else {
                            inheritParentControl = false
                        }
                    } else {
                        inheritParentControl = false
                    }
                }
                if (curNode.length != 0) {
                    curVal = getNodeValue(curNode);
                    genericControlAction = controlAction;
                    genericControlValue = controlVal;
                    genericControlValueTextId = controlValTextId;
                    if (customValidation == true) {
                        evaluateControlCustom(controlNode)
                    } else {
                        controlState = evaluateControl(curVal, true);
                        doControl()
                    }
                    elem.bind("SettingChanged", function(event, eventNodeName, val) {
                        if (eventNodeName != controlNode) {
                            return
                        }
                        genericControlAction = controlAction;
                        genericControlValue = controlVal;
                        genericControlValueTextId = controlValTextId;
                        processControlNode(controlNode, val);
                        event.stopPropagation()
                    })
                } else {
                    controlState = "show";
                    doControl()
                }
            }

            function processControlNode(controlNode, val) {
                var customValidation = elem.data("control-customvalidation");
                if (customValidation == true) {
                    evaluateControlCustom(controlNode, val)
                } else {
                    controlState = evaluateControl(val);
                    doControl()
                }
            }

            function evaluateControlCustom(controlNode, val) {
                var ctrlNodeSetting = getNodeData(controlNode).setting;
                var ctrlNodeSettingVal = getSetting(ctrlNodeSetting, "val");
                var ctrlNodeSettingVallist = getSetting(ctrlNodeSetting, "vallist");
                if (val !== undefined) {
                    ctrlNodeSettingVal = val
                }
                if (ctrlNodeSettingVallist[ctrlNodeSettingVal].spc == 0) {
                    if (genericControlAction == "show") {
                        elem.show()
                    } else {
                        elem.hide()
                    }
                } else {
                    if (genericControlAction == "hide") {
                        elem.show()
                    } else {
                        elem.hide()
                    }
                }
            }

            function evaluateControl(val, firstTime) {
                var retVal = "";
                var valMatch = testMatchingValue(val, genericControlValue, genericControlValueTextId);
                if ((genericControlAction == "show" && valMatch) || (genericControlAction == "hide" && !valMatch)) {
                    retVal = "show"
                } else {
                    if ((genericControlAction == "hide" && valMatch) || (genericControlAction == "show" && !valMatch)) {
                        retVal = "hide"
                    } else {
                        if ((genericControlAction == "disable" && valMatch) || (genericControlAction == "enable" && !valMatch)) {
                            retVal = "disable"
                        } else {
                            if ((genericControlAction == "enable" && valMatch) || (genericControlAction == "disable" && !valMatch)) {
                                retVal = "enable";
                                if (firstTime == undefined && focusAttr != undefined && focusAttr == "1") {
                                    try {
                                        eval(focusStr)
                                    } catch (err) {
                                        console.warn("This element is set to take focus when it gets enabled, but SettingType " + settingType + " either doesn't have a focus method or the method returned an error!")
                                    }
                                }
                            } else {
                                if (genericControlAction == "updateDateFormat") {
                                    try {
                                        eval(updateDateFormatStr)
                                    } catch (err) {
                                        console.warn("This element is set to update itself whenever the date format is changed, but SettingType " + settingType + " either doesn't have a method to handle date format updates or the method returned an error!")
                                    }
                                }
                            }
                        }
                    }
                }
                return retVal
            }

            function doControl() {
                if (controlState == "show" && (parentControlState == "show" || !inheritParentControl)) {
                    elem.show();
                    elem.parent("li").show();
                    elem.parent("td").show()
                } else {
                    if (controlState == "hide" || parentControlState == "hide") {
                        elem.hide();
                        elem.parent("li").hide();
                        elem.parent("td").hide()
                    } else {
                        if (controlState == "enable") {
                            if (disableVal === undefined) {
                                elem.attr("controlResult", "enable");
                                listenerResult = elem.attr("listenerResult");
                                if (listenerResult != "disable") {
                                    elem.enable()
                                } else {
                                    elem.disable()
                                }
                            } else {
                                if (typeof disableVal == "number") {
                                    elem.find("option[value=" + disableVal + "]").removeAttr("disabled")
                                } else {
                                    for (i = 0; i < disableVal.length; i++) {
                                        var disableValue = disableVal[i];
                                        elem.find("option[value=" + disableValue + "]").removeAttr("disabled")
                                    }
                                }
                            }
                        } else {
                            if (controlState == "disable") {
                                if (disableVal === undefined) {
                                    elem.attr("controlResult", "disable");
                                    elem.disable()
                                } else {
                                    if (typeof disableVal == "number") {
                                        elem.find("option[value=" + disableVal + "]").attr("disabled", "disabled")
                                    } else {
                                        for (i = 0; i < disableVal.length; i++) {
                                            var disableValue = disableVal[i];
                                            elem.find("option[value=" + disableValue + "]").attr("disabled", "disabled")
                                        }
                                    }
                                }
                            } else {
                                console.warn("ControlNode.js::doControl(), command is neither (show,hide,disable,enable),or the state of two controls were not satisfied: controlState=" + controlState + ", parentControlState=" + parentControlState)
                            }
                        }
                    }
                }
            }
        })
    };

    function testControlValue(val, control) {
        if (typeof control == "string") {
            return val == control
        } else {
            if (typeof control == "number") {
                return Number(val) == control
            } else {
                for (i = 0; i < control.length; i++) {
                    if (val == control[i]) {
                        return true
                    }
                }
                return false
            }
        }
    }
})(jQuery);

function initValueActionNode(a) {
    a.valueActionNode()
}(function(a) {
    a.fn.valueActionNode = function() {
        return this.each(function() {
            var c = a(this);
            var d = getNodeName(c);
            if (d === undefined) {
                console.error("Invalid elem passed to valueActionNode; I can't figure out what node this is supposed to be!");
                return
            }
            var b = getNodeData(d);
            if (b === undefined || b.valueActions === undefined) {
                return
            }
            c.bind("SettingChanged", function(h, f, k) {
                if (f != d) {
                    return
                }
                var e = getNodeData(d).valueActions;
                if (e[k] !== undefined) {
                    var g = e[k];
                    if (g.action == "notifyPopup") {
                        c.closest(".panel-contents").popup({
                            messageText: getRawTranslation(g.popupText),
                            buttonOneId: g.confirmText
                        })
                    } else {
                        console.error("I don't know what sort of value action node action " + g.action + " is supposed to be!")
                    }
                }
                h.stopPropagation()
            })
        })
    }
})(jQuery);

function initListenerNode(a) {
    a.listenerNode()
}(function($) {
    $.fn.listenerNode = function() {
        return this.each(function() {
            var elem = $(this);
            var nodeName = getNodeName(elem);
            var listenToNode = elem.data("listener-node");
            var listenToVal = elem.data("listener-value");
            if (nodeName === undefined) {
                console.error("Invalid elem passed to listenerNode; I can't figure out what node this is supposed to be!");
                return
            }
            if (listenToNode === undefined) {
                return
            }
            if (listenToNode !== undefined && listenToVal === undefined) {
                console.error("Invalid elem passed to listenerNode; I can't figure out what value this is supposed to be listening!");
                return
            }
            var nodeData = getNodeData(nodeName);
            var listenToNodeData = getNodeData(listenToNode);
            if (nodeData === undefined || listenToNodeData === undefined) {
                return
            }
            var settingId = elem.data("setting");
            var settingType = elem.data("setting-type");
            var defaultVal = getSetting(settingId, "fctVal");
            var disableVal = elem.data("listener-disable-value");
            var listenToSettingId = listenToNodeData.setting;
            var currentListenToSettingVal = getSetting(listenToSettingId, "val");
            if (disableVal !== undefined) {
                disableVal = splitValues(disableVal)
            }
            if (listenToVal !== undefined) {
                listenToVal = splitValues(listenToVal, true)
            }
            checkForMatch(currentListenToSettingVal, true);

            function checkForMatch(val, firstTime) {
                var currentVal = elem.find("option:selected").val();
                if (disableVal === undefined) {
                    var matchedValue = testMatchingValue(val, listenToVal);
                    if (matchedValue) {
                        elem.attr("listenerResult", "disable");
                        elem.disable()
                    } else {
                        elem.attr("listenerResult", "enable");
                        controlResult = elem.attr("controlResult");
                        if (controlResult != "disable") {
                            elem.enable()
                        } else {
                            elem.disable()
                        }
                    }
                } else {
                    var match = testMatchingValue(currentVal, disableVal);
                    var conflictingOption = testMatchingValue(val, listenToVal);
                    if (conflictingOption) {
                        if (typeof disableVal == "number") {
                            elem.find("option[value=" + disableVal + "]").attr("disabled", "disabled")
                        } else {
                            for (i = 0; i < disableVal.length; i++) {
                                var disableValue = disableVal[i];
                                elem.find("option[value=" + disableValue + "]").attr("disabled", "disabled")
                            }
                        }
                        if (match) {
                            eval("set" + settingType + "(elem, defaultVal)")
                        }
                    } else {
                        if (typeof disableVal == "number") {
                            elem.find("option[value=" + disableVal + "]").removeAttr("disabled")
                        } else {
                            var disabledItem = [];
                            for (i = 0; i < disableVal.length; i++) {
                                if (elem.find("option[value=" + disableVal[i] + "]").attr("disabled") == "disabled") {
                                    disabledItem.push(disableVal[i])
                                }
                            }
                            for (i = 0; i < disableVal.length; i++) {
                                var disableValue = disableVal[i];
                                elem.find("option[value=" + disableValue + "]").removeAttr("disabled")
                            }
                            if (disabledItem.length == 1) {
                                elem.find("option[value=" + disabledItem.pop() + "]").attr("disabled", "disabled")
                            }
                        }
                    }
                }
            }
            elem.bind("SettingChanged", function(event, eventNodeName, val) {
                if (eventNodeName != listenToNode) {
                    return
                }
                checkForMatch(val);
                event.stopPropagation()
            })
        })
    }
})(jQuery);

function initOCRListenerNode(a) {
    a.ocrlistenerNode()
}(function($) {
    $.fn.ocrlistenerNode = function() {
        return this.each(function() {
            var elem = $(this);
            var nodeName = getNodeName(elem);
            if (nodeName === undefined) {
                console.error("Invalid elem passed to listenerNode; I can't figure out what node this is supposed to be!");
                return
            }
            var nodeData = getNodeData(nodeName);
            if (nodeData === undefined) {
                return
            }
            var settingId = elem.data("setting");
            var settingType = elem.data("setting-type");
            var disableVal = elem.data("ocrlistener-disable-value");
            var listenToNodeCompression = elem.data("ocrlistener-nodecompression");
            var valueCompression = elem.data("ocrlistener-valuecompression");
            var listenToNodeSearchable = elem.data("ocrlistener-nodesearchable");
            var valueSearchable = elem.data("ocrlistener-valuesearchable");
            var listenToNodeFormat = elem.data("ocrlistener-nodeformat");
            var valueFormat = elem.data("ocrlistener-valueformat");
            if (listenToNodeCompression === undefined || valueCompression === undefined || listenToNodeSearchable === undefined || valueSearchable === undefined || listenToNodeFormat === undefined || valueFormat === undefined || disableVal === undefined) {
                return
            }
            valueFormat = splitValues(valueFormat);
            disableVal = splitValues(disableVal);
            checkForMatch();

            function checkForMatch() {
                var currentVal = elem.find("option:selected").val();
                var matched = false;
                var fileFormat = getNodeValue($("#" + listenToNodeFormat).children("div"));
                for (i = 0; i < valueFormat.length; i++) {
                    var format = valueFormat[i];
                    if (fileFormat == format) {
                        matched = true;
                        break
                    }
                }
                if (fileFormat == 2 || fileFormat == 6) {
                    matched = false;
                    var value = getNodeValue($("#" + listenToNodeCompression).children("div"));
                    if (value == valueCompression) {
                        matched = true
                    }
                    if (!matched) {
                        value = getNodeValue($("#" + listenToNodeSearchable).children("div"));
                        if (value == valueSearchable) {
                            matched = true
                        }
                    }
                }
                if (matched) {
                    for (i = 0; i < disableVal.length; i++) {
                        var disableValue = disableVal[i];
                        elem.find("option[value=" + disableValue + "]").attr("disabled", "disabled")
                    }
                    eval("set" + settingType + "(elem, 300)")
                } else {
                    for (i = 0; i < disableVal.length; i++) {
                        var disableValue = disableVal[i];
                        elem.find("option[value=" + disableValue + "]").removeAttr("disabled")
                    }
                }
            }
            elem.bind("SettingChanged", function(event, eventNodeName) {
                if (eventNodeName != listenToNodeCompression && eventNodeName != listenToNodeSearchable && eventNodeName != listenToNodeFormat) {
                    return
                }
                checkForMatch();
                event.stopPropagation()
            })
        })
    }
})(jQuery);

function setOcrLanguages(c) {
    var b = new InputHandler();
    b.baseElem = c;
    b.messageBlock = c.find(".setting-saved-message");
    b.messageText = b.messageBlock.find(".setting-saved-message-text");
    b.initSpinner(b.messageBlock.find(".setting-saved-spinner"));
    var a = new Communicator();
    a.addSuccessHandler(function(f) {
        reloadContent();
        b.successHandler(f);
        c.modalPopup("dismiss")
    });
    var d = {
        c: "OcrRecognizedLanguagesPopup"
    };
    var e = {};
    c.find(".setting-changed").each(function() {
        var f = getNodeName(this);
        var g = "0";
        var h = $($(this).find(".setting-node-input-checkbox")[0]);
        if (h.is(":checked") && (!h.is(":disabled") || (h.is(":disabled") && f == "EnglishOcrLanguage"))) {
            g = "1"
        }
        e[f] = g
    });
    d.data = JSON.stringify(e);
    b.messageText.hide();
    b.messageBlock.show();
    a.sendData(MAIN_CONTENT_PATH, "POST", this, "json", d)
}

function checkOcrLangCombos(d) {
    var a = d.closest(".popup-modal");
    if (getNodeName(a) != "OcrRecognizedLanguagesPopup") {
        return
    }
    var g = getNodeName(d);
    var f = d.attr("data-setting");
    var c = getSetting(f);
    var b = [];
    var e = [];
    a.find("div[data-setting-type='Checkbox']").each(function() {
        var h = getNodeName(this);
        if ($($(this).find(".setting-node-input-checkbox")[0]).is(":checked")) {
            var k = getSetting($(this).data("setting"));
            if (k.dbcs == 1) {
                b.push(h)
            } else {
                e.push(h)
            }
        }
    });
    if (b.length > 1 || (e.length > 1 && b.length > 0)) {
        console.error("Error: not a valid OCR language combination");
        return
    }
    if (e.length == 1 && b.length == 1) {
        a.find("div[data-setting-type='Checkbox']").each(function() {
            var h = getNodeName(this);
            if ((h != e[0] && h != b[0]) || (e[0] == "EnglishOcrLanguage" && h == "EnglishOcrLanguage")) {
                $(this).disable()
            } else {
                $(this).enable()
            }
        })
    } else {
        if (e.length > 1 || (e.length == 1 && e[0] != "EnglishOcrLanguage")) {
            a.find("div[data-setting-type='Checkbox']").each(function() {
                var h = getSetting($(this).data("setting"));
                if (h.dbcs == 1) {
                    $(this).disable()
                } else {
                    $(this).enable()
                }
            })
        } else {
            if (b.length == 1 && e == 0) {
                a.find("div[data-setting-type='Checkbox']").each(function() {
                    var h = getNodeName(this);
                    var k = getSetting($(this).data("setting"));
                    if (k.dbcs == 1) {
                        if (h != b[0]) {
                            $(this).disable()
                        } else {
                            $(this).enable()
                        }
                    } else {
                        if (h == "EnglishOcrLanguage") {
                            setNodeValue($(this), 1)
                        }
                        $(this).disable()
                    }
                })
            } else {
                a.find("div[data-setting-type='Checkbox']").each(function() {
                    $(this).enable()
                })
            }
        }
    }
}

function allowOcrLangSave(c) {
    var a = c.closest(".popup-modal");
    if (getNodeName(a) != "OcrRecognizedLanguagesPopup") {
        return true
    }
    var b = 0;
    a.find(".setting-node-input-checkbox").each(function() {
        if ($(this).is(":checked")) {
            b++
        }
    });
    if (b) {
        return true
    } else {
        return false
    }
}
$.address.queryParams = function() {
    var a = $.address.queryString();
    segments = a.split("&");
    var b = {};
    for (seg in segments) {
        parts = segments[seg].split("=");
        b[parts[0]] = parts[1]
    }
    return b
};
$.address.queryParam = function(d, c) {
    var b = $.address.queryParams();
    if (c != undefined) {
        b[d] = c;
        var e = [];
        for (var a in b) {
            if (b[a] != undefined && b[a] != "") {
                e.push(a + "=" + b[a])
            }
        }
        e = e.join("&");
        $.address.queryString(e)
    }
    return b[d]
};

function formatString(c, b) {
    var d = "";
    var a = [];
    if (c !== undefined) {
        c = formatStyle(c);
        a = c.match(new RegExp("{[A-Za-z, 0-9_]+}", "g"));
        d = c;
        $(a).each(function() {
            f = this.replace("{", "").replace("}", "");
            if (f.indexOf(",") >= 0) {
                var e = f.split(",");
                for (index in e) {
                    var f = e[index].trim();
                    replacement = "";
                    if ((b[f] !== undefined) && (b[f].length > 0)) {
                        replacement = b[f];
                        break
                    }
                }
            } else {
                replacement = (b[f] !== undefined) ? b[f] : ""
            }
            replacement = escapeHtml(replacement);
            d = d.replace(this, replacement)
        })
    }
    return d
}

function formatStyle(c) {
    var b = [{
        "char": "#",
        "class": "italic"
    }, {
        "char": "*",
        "class": "bold"
    }];
    var a = c;
    $(b).each(function() {
        a = stylize(a, this["char"], this["class"])
    });
    return a
}

function stylize(e, d, c) {
    if (e.indexOf(d) >= 0) {
        var f = e.indexOf(d) + 1;
        var a = f + e.substring(f).indexOf(d);
        var b = e.substring(0, f - 1) + '<span class="' + c + '">' + e.substring(f, a) + "</span>" + e.substring(a + 1);
        return stylize(b, d, c)
    } else {
        return e
    }
}

function initModalPopup(b) {
    var a = {};
    b.modalPopup(a)
}

function closeModalPopup() {
    $(".popup-modal-container").modalPopup("dismiss")
}(function(d) {
    var e = 0;
    var a = false;
    var f = "";
    var k = "";
    var g = 0;
    var b = "";
    var h = "";
    var l = 0;
    var c = {
        init: function(m) {
            return this
        },
        display: function(m, n) {
            var o = this;
            f = m;
            if (n === undefined) {
                n = {}
            }
            e = n.popBreadcrumbOnSuccessCount;
            a = n.ignoreParams;
            k = n.certFriendlyName;
            g = n.certCAId;
            b = n.certCAName;
            h = n.refreshTableName;
            l = n.certCAInstance;
            o.data("filtered", 0);
            o.modalPopup("refresh")
        },
        refresh: function(p) {
            var o = undefined;
            if (!a) {
                o = d.address.queryParams();
                if (k != "") {
                    o.certFriendlyName = k
                }
                if (g != 0) {
                    o.certCAId = g
                }
                if (b != "") {
                    o.certCAName = b
                }
                if (h != "") {
                    o.refreshTableName = h
                }
                if (l != 0) {
                    o.certCAInstance = l
                }
            }
            var m = this;
            var n = new ContentHandler(m);
            n.addSuccessHandler(function() {
                var q = d(window).height();
                var r = m.find(".popup-modal");
                if (q < 200) {
                    q = 200
                }
                if (q < (r.outerHeight() + 30)) {
                    var u = r.css("padding-top");
                    u = u.substring(0, u.indexOf("px"));
                    u *= 2;
                    r.css("max-height", (q - 32 - u) + "px");
                    r.find(".popup-modal-content > ul").css("max-height", (q - 90 - u) + "px")
                }
                centerWithinWindow(m.find(".popup-modal"));
                c.registerButtons(m);
                m.find("input").first().focus();
                c.handleTabNavigation(m);
                if (f == "UploadSignedCertPopup") {
                    var t = d(".popup-modal-container").find(".hidden-file-form");
                    var s = t.attr("action");
                    s += "?friendlyName=";
                    s += k;
                    t.attr("action", s)
                }
            });
            if (p !== undefined) {
                n.addSuccessHandler(p)
            }
            n.loadContent(f, o)
        },
        handleTabNavigation: function(n) {
            var q = d(n).find("select, input, textarea, button, a");
            var o = q.first();
            var m = q.last();
            o.focus();
            var p = 2000;
            d(q).each(function() {
                var r = d(this).attr("tabindex");
                if (r != undefined) {
                    d(this).attr("tabindex", p + Number(r))
                } else {
                    console.warn("Missing tabindex for component: " + d(this).attr("name"))
                }
            });
            m.on("keydown", function(r) {
                if ((r.which === 9 && !r.shiftKey)) {
                    r.preventDefault();
                    o.focus()
                }
            });
            o.on("keydown", function(r) {
                if ((r.which === 9 && r.shiftKey)) {
                    r.preventDefault();
                    m.focus()
                }
            })
        },
        dismiss: function() {
            this.find(".popup-overlay, .popup-modal").remove()
        },
        registerButtons: function(m) {
            m.find("button").each(function() {
                var n = d(this);
                d(this).click(function() {
                    var p = n.data("action");
                    if (p == "cancel") {
                        m.modalPopup("dismiss")
                    } else {
                        if (p == "navback") {
                            if (n.find(".setting-continue")) {
                                d(".setting-changed").remove()
                            }
                            m.modalPopup("dismiss");
                            popBreadcrumb(1)
                        } else {
                            if (p == "saveAndDownload") {
                                if (f == "GenerateNewCertificate") {
                                    var x = {};
                                    x.download = true;
                                    generateNewCert(m, x)
                                }
                            } else {
                                if (p == "save") {
                                    if (f == "GenerateNewCertificate") {
                                        generateNewCert(m)
                                    } else {
                                        if (f == "CertDefaultsPopup") {
                                            setCertDefaults(m)
                                        } else {
                                            if (f == "OcrRecognizedLanguagesPopup") {
                                                setOcrLanguages(m)
                                            } else {
                                                var v = new InputHandler();
                                                v.ignoreQuery(a);
                                                v.saveNodes(n.closest(".setting-contents").parent(), function(y) {
                                                    m.modalPopup("dismiss");
                                                    if (e !== undefined && e >= 1) {
                                                        popBreadcrumb(e)
                                                    } else {
                                                        reloadContent()
                                                    }
                                                }, true)
                                            }
                                        }
                                    }
                                } else {
                                    if (p == "saveAndWait") {
                                        var v = new InputHandler();
                                        v.ignoreQuery(a);
                                        v.saveNodes(n.closest(".setting-contents").parent(), function(A) {
                                            var A = n.closest(".setting-contents").parent();
                                            var z = n.parent().find("[data-action=cancel]");
                                            z.disable();
                                            var y = A.find(".setting-saved-message");
                                            var B = y.find(".setting-saved-message-text");
                                            B.hide();
                                            var C = startSpinnerBlock(A, 1500);
                                            this.fadeTimeout = setTimeout(function() {
                                                stopSpinnerBlock(A, C);
                                                hideSpinnerBlock(A);
                                                m.modalPopup("dismiss");
                                                reloadContent()
                                            }, 18000)
                                        }, true)
                                    } else {
                                        if (p == "createGroup") {
                                            var v = new InputHandler();
                                            v.ignoreQuery(a);
                                            v.saveNodes(n.closest(".setting-contents").parent(), function(y) {
                                                m.modalPopup("dismiss");
                                                d("#GroupMembership div.list").list("reload", d("#GroupMembership div.list"))
                                            }, true)
                                        } else {
                                            if (p == "filterReportChanged") {
                                                if (m.data("filtered") == 0) {
                                                    m.data("filtered", 1);
                                                    filterReportChangedOnly(m);
                                                    n.html(getStoredTranslation("TXT_SHOW_DEFAULTS"))
                                                } else {
                                                    m.data("filtered", 0);
                                                    filterReportNormal(m);
                                                    n.html(getStoredTranslation("TXT_HIDE_DEFAULTS"))
                                                }
                                            } else {
                                                if (p == "downloadCa") {
                                                    var r = g;
                                                    if (r == 0) {
                                                        var w = getSetting(d("#certificate").attr("data-setting"));
                                                        if (w !== undefined) {
                                                            r = w.ca_id
                                                        }
                                                    }
                                                    if (r != 0) {
                                                        var u = "/webglue/downloadCaCert?caId=" + r;
                                                        window.open(u)
                                                    }
                                                } else {
                                                    if (p == "downloadCert" || p == "downloadCsr") {
                                                        var t = k;
                                                        if (t == "") {
                                                            var w = getSetting(d("#certificate").attr("data-setting"));
                                                            if (w !== undefined) {
                                                                t = w.friendlyName
                                                            }
                                                        }
                                                        if (t != "") {
                                                            var u = "/webglue/downloadCert?friendlyName=" + t;
                                                            if (p == "downloadCsr") {
                                                                u = "/webglue/downloadCsr?friendlyName=" + t
                                                            }
                                                            window.open(u)
                                                        }
                                                    } else {
                                                        if (p == "uploadSignedCert") {
                                                            var s = d("#certificate").attr("data-node");
                                                            var q = getNodeData(s);
                                                            var o = getNodeData(q.children[0]);
                                                            var t = k;
                                                            if (t == "") {
                                                                var w = getSetting(d("#certificate").attr("data-setting"));
                                                                if (w !== undefined) {
                                                                    t = w.friendlyName
                                                                }
                                                            }
                                                            var x = {};
                                                            x.certFriendlyName = t;
                                                            d(".popup-modal-container").modalPopup("display", o.name, x)
                                                        } else {
                                                            if ((p == "DeleteCert") || (p == "DeleteCaCert")) {
                                                                if (p == "DeleteCaCert" && l != 0) {
                                                                    b = b + "(" + l + ")"
                                                                }
                                                                showDeleteCertPopup(m, p, k, g, b, h)
                                                            } else {
                                                                if ((p == "restoreDefaults") && f == "CertDefaultsPopup") {
                                                                    d(m).popup({
                                                                        messageText: getRawTranslation("TXT_CLICK_TO_RESTORE_CERTIFICATE_DEFAULTS"),
                                                                        buttonTwoId: "TXT_RESTORE",
                                                                        buttonTwoCallback: function() {
                                                                            restoreCertDefaults(m)
                                                                        },
                                                                        buttonOneId: "TXT_CANCEL"
                                                                    })
                                                                } else {
                                                                    if (p == "joinactivedir") {
                                                                        navigate_to("Settings/Security/ActiveDirectorySetup", undefined, {
                                                                            params: {
                                                                                tableEditId: "new"
                                                                            }
                                                                        })
                                                                    } else {
                                                                        if (p == "customExport") {
                                                                            doCustomExport()
                                                                        } else {
                                                                            console.warn("I don't know what sort of modal popup button action '" + p + "' is supposed to be!")
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            });
            if ((m.find("button[data-action=save]").length > 0) || (m.find("button[data-action=saveAndDownload]").length > 0) || (m.find("button[data-action=saveAndWait]").length > 0)) {
                updateButtonRow(m.find(".setting-contents ul"))
            }
        }
    };
    d.fn.modalPopup = function(m) {
        if (c[m]) {
            return c[m].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof m === "object" || !m) {
                return c.init.apply(this, arguments)
            } else {
                d.error("Method " + m + " does not exist on jQuery.modalPopup")
            }
        }
    }
})(jQuery);

function initBreadcrumb(a) {
    a.find("a").click(function(c) {
        var d = a.data("path");
        var b = a.data("preserve-query");
        navigate_to(d, c, {
            preserve: b
        })
    })
}

function initLoginMethod(b) {
    var a = b.closest(".content");
    c(b.find(":selected"), a);
    b.change(function() {
        var d = $(this).find(":selected");
        $(".login-node-error").hide();
        c(d, a)
    });
    $("#logindropdown input").keydown(function(d) {
        if (d.keyCode == 13) {
            $("#LoginSubmit button").click();
            return false
        }
    });

    function c(e, d) {
        if (b.find("select option").length > 0) {
            var e = b.find(":selected");
            var f = e.data("creds").split(",");
            d.find(".no-methods").parent("li").hide();
            d.find("[data-cred]").each(function() {
                var g = $(this);
                var h = g.data("cred");
                if (f.indexOf(h) == -1) {
                    g.closest("[data-node]").hide()
                } else {
                    g.closest("[data-node]").show()
                }
            });
            updateOtherFields(f)
        } else {
            d.find("[data-node]").hide();
            d.find(".no-methods").parent("li").show()
        }
    }
}

function updateOtherFields(a) {
    $("#LoginSubmit").show();
    $("#SpnegoOrText").show();
    if (a.length == 2 && a[0] == "spnego" && a[1] == "") {
        $("#LoginSubmit").hide();
        $("#SpnegoOrText").hide()
    }
    disableLoginButton();
    $("#LoginPIN").on("input", function() {
        if ($("#LoginPIN input").val()) {
            $("#LoginSubmit button").enable()
        } else {
            $("#LoginSubmit button").disable()
        }
    });
    $("#LoginUsername").on("input", function() {
        if ($("#LoginUsername input").val()) {
            if (($("#LoginMethod :selected").data("type") == 0) || ($("#LoginMethod :selected").data("type") == 5) || ($("#LoginMethod :selected").data("type") == 10)) {
                if ($("#LoginPassword input").val()) {
                    $("#LoginSubmit button").enable()
                } else {
                    $("#LoginSubmit button").disable()
                }
            } else {
                $("#LoginSubmit button").enable()
            }
        } else {
            $("#LoginSubmit button").disable()
        }
    });
    $("#LoginPassword").on("input", function() {
        if ($("#LoginPassword input").val()) {
            if (($("#LoginMethod :selected").data("type") == 0) || ($("#LoginMethod :selected").data("type") == 5) || ($("#LoginMethod :selected").data("type") == 10)) {
                if ($("#LoginUsername input").val()) {
                    $("#LoginSubmit button").enable()
                } else {
                    $("#LoginSubmit button").disable()
                }
            } else {
                $("#LoginSubmit button").enable()
            }
        } else {
            $("#LoginSubmit button").disable()
        }
    })
}

function updateLoginDropdown() {
    var a = {};
    var c = $("#loginContents");
    var b = new ContentHandler(c);
    b.loadContent("LoginDropdown")
}

function updateLoginStatus() {
    if (hasSession()) {
        var b = getSession();
        var a = b.sessionName;
        if (a === undefined) {
            a = ""
        }
        if (a == "") {
            $(".loginuserinfo").text(getRawTranslation("TXT_LOGGED_IN"))
        } else {
            $(".loginuserinfo").text(getRawComplexTranslation("TXT_WELCOME_NAME", {
                name: a
            }))
        }
        $("#loginclickarea").hide();
        $("#logoutclickarea").show()
    } else {
        $(".loginuserinfo").text(getRawTranslation("TXT_GUEST"));
        $("#logoutclickarea").hide();
        $("#loginclickarea").show()
    }
}

function login(d) {
    $(".popup-modal-container").popup("init", {
        showCloseButton: false,
        autoHide: true
    });
    $(".popup-modal-container").popup("startSpinner");
    var e = {};
    var f = {};
    addLoginData(e);
    var b = $(d).closest(".content");
    var c = $(".login-node-error");
    b.find("input[data-cred], select[data-cred]").each(function() {
        var g = $(this);
        if (g.is(":visible")) {
            var h = g.data("cred");
            f[h] = g.val()
        }
    });
    document.execCommand("ClearAuthenticationCache", "false");
    e.creds = f;
    var a = new Communicator();
    a.addSuccessHandler(function(g) {
        loginCallback(g, c)
    });
    a.addErrorHandler(function(g) {
        $(".popup-modal-container").popup("hide")
    });
    a.post(SESSION_CREATE_PATH, {
        data: JSON.stringify(e)
    })
}

function loginCallback(b, a) {
    $(".popup-modal-container").popup("hide");
    if (b.status != 0 && a) {
        a.find(".error").text(b.error);
        a.fadeIn();
        $("#loginContents .panel-contents").effect("shake", {
            times: 2,
            distance: 5
        }, 20);
        $(".login-node-input").val("");
        disableLoginButton()
    } else {
        if (b.status == 0) {
            createSession(b);
            location.reload()
        }
    }
}

function logout() {
    var b = getSession();
    var a = new Communicator();
    a.addSuccessHandler(logoutCallback);
    a.post(SESSION_DESTROY_PATH, b)
}

function logoutCallback(a) {
    clearSession(a);
    location.reload()
}

function singleSignOn() {
    var c = {};
    var b = $(".spnego-node-message");
    addLoginData(c);
    var a = new Communicator();
    a.addSuccessHandler(function(e) {
        spnegoCommonCallback(e, b)
    });
    a.addErrorHandler(function(e) {
        spnegoCommonCallback(e, b)
    });
    a.sendData(SPNEGO_PATH, "GET", undefined, "", c)
}

function spnegoCommonCallback(f, b) {
    var d = "";
    if ((f != undefined) && (f.status != undefined)) {
        if (f.status == 200) {
            var g = f.responseText;
            var c = g.search("{");
            if (c >= 0) {
                var a = g.substring(c);
                var e = jQuery.parseJSON(a);
                if (e.status == 0) {
                    createSession(e);
                    location.reload();
                    return
                } else {
                    d = e.error
                }
            }
        }
    }
    if (b) {
        if (d.length > 0) {
            b.find(".error").text(d)
        } else {
            b.find(".error").html(getStoredTranslation("TXT_BROWSER_NOT_CONFIGURED"))
        }
    } else {
        $(".spnego-node-message .error").html(getStoredTranslation("TXT_BROWSER_NOT_CONFIGURED"))
    }
    $(".spnego-node-message").fadeIn();
    $("#loginContents .panel-contents").effect("shake", {
        times: 2,
        distance: 5
    }, 20);
    $(".login-node-input").val("")
}

function autoLogin() {
    if (!shouldAutoLogin()) {
        return
    }
    var a = new Communicator();
    a.addSuccessHandler(function(b) {
        loginCallback(b, undefined)
    });
    a.sendData(AUTO_LOGIN_PATH, "GET", undefined, "", {})
}

function addLoginData(b) {
    var d = $("#LoginMethod :selected");
    var a = d.data("type");
    var c = d.data("id");
    b.authtype = a;
    b.authId = c
}

function disableLoginButton() {
    if (($("#LoginUsername input").is(":visible") && $("#LoginUsername input").val() == "") || ($("#LoginPassword input").is(":visible") && $("#LoginPassword input").val() == "") || ($("#LoginPIN input").is(":visible") && $("#LoginPIN input").val() == "")) {
        $("#LoginSubmit button").disable()
    }
}
var SESSION_ID = "sessionId";
var SESSION_KEY = "sessionKey";
var SESSION_NAME = "sessionName";
var AUTO_LOGIN = "autoLogin";
var SESSION_NAME_MAX_LENGTH = 128;

function createSession(b) {
    var a = {
        expiresAt: 0
    };
    $.cookies.set(SESSION_ID, b[SESSION_ID], a);
    $.cookies.set(SESSION_KEY, b[SESSION_KEY], a);
    $.cookies.set(SESSION_NAME, b[SESSION_NAME], a);
    $.cookies.del(AUTO_LOGIN)
}

function clearSession() {
    $.cookies.del(SESSION_ID);
    $.cookies.del(SESSION_KEY);
    $.cookies.del(SESSION_NAME);
    var a = {
        expiresAt: 0
    };
    $.cookies.set(AUTO_LOGIN, false, a)
}

function getSession() {
    var a = {};
    a[SESSION_ID] = $.cookies.get(SESSION_ID);
    a[SESSION_KEY] = $.cookies.get(SESSION_KEY);
    if (($.cookies.get(SESSION_NAME)).length <= SESSION_NAME_MAX_LENGTH) {
        a[SESSION_NAME] = $.cookies.get(SESSION_NAME)
    }
    return a
}

function addSessionToData(b) {
    var c = $.cookies.get(SESSION_ID);
    var a = $.cookies.get(SESSION_KEY);
    if (c && a) {
        b[SESSION_ID] = c;
        b[SESSION_KEY] = a
    }
}

function hasSession() {
    var b = $.cookies.get(SESSION_ID);
    var a = $.cookies.get(SESSION_KEY);
    return (b && a)
}

function shouldAutoLogin() {
    return !hasSession() && $.cookies.get(AUTO_LOGIN) !== false
}

function initReport(f) {
    var b = f.data("report");
    var a = new Communicator();
    var g;
    var h = $(".popup-modal");
    var c = {
        DEVICE_STATISTICS: "ReportDeviceStatistics",
        SHORTCUT_LIST: "ReportShortcutList",
        FAX_JOB_LOG: "ReportFaxJobLog",
        FAX_CALL_LOG: "ReportFaxCallLog",
        EMAIL_SHORTCUTS: "ReportEmailShortcuts",
        FTP_SHORTCUTS: "ReportFTPShortcuts",
        FAX_SHORTCUTS: "ReportFaxShortcuts",
        COPY_SHORTCUTS: "ReportCopyShortcuts",
        PROFILES_LIST: "ReportProfilesList",
        NETWORK_FOLDER_SHORTCUTS: "ReportNetworkFolderShortcuts",
        PRINT_SERVER_SETUP_PAGE: "ReportPrintServerSetupPages",
        PRINT_DIRECTORY: "ReportPrintDirectory",
        PRINT_DEFECTS_GUIDE: "ReportPrintDefectsGuide",
        EVENT_LOG: "PrintConfigEventLog",
        EVENT_LOG_SUMMARY: "PrintConfigEventLogSummary",
        LICENSE_INSTALLED: "ReportLicenseInstalled",
        HEALTHCHECK_STATISTICS: "PrintConfigHealthCheckStatistics"
    };

    function e(k) {
        for (key in c) {
            if (key == k) {
                return c[key]
            }
        }
    }

    function d(n) {
        f.empty();
        if (b == "DEVICE_STATISTICS" || b == "SHORTCUT_LIST" || b == "FAX_JOB_LOG" || b == "FAX_CALL_LOG" || b == "EMAIL_SHORTCUTS" || b == "FTP_SHORTCUTS" || b == "FAX_SHORTCUTS" || b == "COPY_SHORTCUTS" || b == "PROFILES_LIST" || b == "NETWORK_FOLDER_SHORTCUTS" || b == "PRINT_SERVER_SETUP_PAGE" || b == "PRINT_DIRECTORY" || b == "PRINT_DEFECTS_GUIDE" || b == "EVENT_LOG" || b == "EVENT_LOG_SUMMARY" || b == "LICENSE_INSTALLED" || b == "MENU_SETTINGS" || b == "HEALTHCHECK_STATISTICS") {
            f.html(n)
        } else {
            var l = n.nodes.nodes;
            var m = n.nodes.settings;
            var k = n.nodes.supplies;
            displayReportData(f, n.nodes.rootNode, l, m, k)
        }
        finalizePopup(f, g)
    }
    h.find(".popup-buttonrow").toggle(false);
    g = startSpinnerBlock(h);
    a.addSuccessHandler(d);
    switch (b) {
        case "MENU_SETTINGS":
            a.sendData(EWS_REPORTS_PATH + "?name=ReportEWSMenuSettings&fromReport=true", "GET", f, "html", {});
            break;
        case "DIAG_MENU_SETTINGS":
            a.sendData(NODE_DATA_PATH + "Diag/?depth=10&fromReport=true", "GET", f, "json", {});
            break;
        case "CONFIG_MENU_SETTINGS":
            a.sendData(NODE_DATA_PATH + "Settings/Device/Maintenance/ConfigMenu/?depth=10&fromReport=true", "GET", f, "json", {});
            break;
        case "NETWORK_SETUP":
            displayNetworkSetup(f, g);
            break;
        case "DEVICE_INFORMATION":
            a.sendData(NODE_DATA_PATH + "DeviceInformation/?depth=10&fromReport=true", "GET", f, "json", {}, undefined, 300000);
            break;
        case "DEVICE_STATISTICS":
        case "SHORTCUT_LIST":
        case "FAX_JOB_LOG":
        case "FAX_CALL_LOG":
        case "EMAIL_SHORTCUTS":
        case "FTP_SHORTCUTS":
        case "FAX_SHORTCUTS":
        case "COPY_SHORTCUTS":
        case "PROFILES_LIST":
        case "NETWORK_FOLDER_SHORTCUTS":
        case "PRINT_SERVER_SETUP_PAGE":
        case "PRINT_DIRECTORY":
        case "PRINT_DEFECTS_GUIDE":
        case "EVENT_LOG":
        case "EVENT_LOG_SUMMARY":
        case "LICENSE_INSTALLED":
        case "HEALTHCHECK_STATISTICS":
            a.sendData("/webglue/getReport", "GET", f, "html", {
                name: e(b)
            });
            break;
        default:
            console.warn("I don't know what type of report " + b + " is supposed to be!");
            f.text("Invalid report type.");
            finalizePopup(f, g);
            break
    }
}

function finalizePopup(a, b) {
    var c = $(".popup-modal");
    a.css("min-width", "800px");
    a.toggle(true);
    c.find(".popup-buttonrow").toggle(true);
    centerWithinWindow(c);
    stopSpinnerBlock(c, b);
    hideSpinnerBlock(c)
}

function displayNetworkSetup(a, b) {
    var c = "ReportNetworkSetupPopupContents";
    a.html(stored_nodes[c]["htmlData"]);
    finalizePopup(a, b)
}

function displayReportData(f, b, d, g, a) {
    var c = {};
    var e = $("<ul class='report-level-0'></ul>");
    recurseReportData(e, c, b, 1, d, g, a);
    f.append(e)
}

function recurseReportData(D, e, t, x, b, s, F) {
    if (b[t] === undefined) {
        return
    }
    e[t] = 1;
    var y = b[t];
    var q = "ignore";
    var E;
    var m = "";
    if (y.control !== undefined && y.control.node !== undefined) {
        var u = false;
        var v = y.control.node;
        var c = y.control.value;
        if (b[v] == undefined) {
            if (y.control.action == "show" && y.control.value == 0) {
                u = true
            } else {
                return
            }
        } else {
            var w = b[v].setting;
            if (s[w] == undefined) {
                return
            }
            var C = s[w].val;
            if (Array.isArray(c)) {
                for (var A = 0; A < c.length; A++) {
                    if (c[A] == C) {
                        u = true;
                        break
                    }
                }
            } else {
                if (c == C || (c != C && y.control.action == "disable")) {
                    u = true
                }
            }
        }
        if (u == false) {
            return
        }
    }
    if (y.type == "Container" || y.type == "LandingPage" || y.type == "DateTimeLinkNode" || y.type == "Node" || (y.type == "ResetNode" && y.display == "Custom") || (y.type == "RestoreNode" && y.display == "Custom")) {
        q = "header"
    } else {
        if (y.type == "Setting" || y.type == "ReadOnlySetting" || y.type == "CertificateList" || y.type == "ResetButton" || (y.type == "ResetNode" && y.display == "TextDisplay") || y.type == "AuthAccount" || (y.type == "External" && y.display == "Slider") || (y.type == "External" && y.display == "EnumSelect")) {
            if (y.display == "Password") {
                return
            }
            if (y.setting === undefined || s[y.setting] === undefined) {
                if (y.reportOptions !== undefined && y.reportOptions.isTitleValue == 1) {
                    m = y.title.translated
                } else {
                    return
                }
            }
            if (m.length == 0) {
                E = s[y.setting];
                if (E.type == "IntEnum" && E.vallist !== undefined) {
                    m = getIntEnumString(E)
                } else {
                    if (E.type == "Bool") {
                        if (E.vallist != undefined) {
                            for (var A = 0; A < E.vallist.length; A++) {
                                if (E.vallist[A].val == E.val) {
                                    m = E.vallist[A].str;
                                    break
                                }
                            }
                        } else {
                            if (E.val == 0) {
                                m = getStoredTranslation("TXT_OFF")
                            } else {
                                if (E.val == 1) {
                                    m = getStoredTranslation("TXT_ON")
                                }
                            }
                        }
                    } else {
                        if (E.type == "Str") {
                            if (E.vallist !== undefined) {
                                var o = E.val;
                                m = escapeHtml(E.vallist[o].str)
                            } else {
                                m = escapeHtml(E.val)
                            }
                        } else {
                            if (E.vallist !== undefined) {
                                m = getIntEnumString(E)
                            } else {
                                m = E.val
                            }
                        }
                    }
                }
                var l = parseInt(E.decimalpoints);
                if (l > 0) {
                    var z = E.val.toString();
                    var a = z.length - l;
                    m = z.slice(0, a) + "." + z.slice(a)
                }
                if (E.unitsId != undefined && E.unitsId != "TXT_NULL") {
                    m += getStoredTranslation(E.unitsId)
                } else {
                    if (E.units != undefined) {
                        m += E.units
                    }
                }
            }
            q = "setting"
        } else {
            if (y.type == "DateTimeNode") {
                if (y.name == "CurrentDateTime") {
                    if (s[y.setting] === undefined) {
                        return
                    }
                    E = s[y.setting];
                    var n = new Date(E.val * 1000);
                    var k = s.TIME_UTC_OFFSET.val;
                    n.setUTCSeconds(n.getUTCSeconds() + k);
                    var d = "hh:mm TT";
                    if (s[NPA_MFP_TIMEFORMAT].val == 1) {
                        d = "HH:mm"
                    }
                    var h = $.datepicker.formatTime(d, {
                        hour: n.getUTCHours(),
                        minute: n.getUTCMinutes()
                    });
                    n = new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
                    var B = $.datepicker.formatDate(getDateFormatStringForSetting(s[NPA_MFP_DATEFORMAT].val), n);
                    m = B + " " + h
                } else {
                    if (y.name == "TimeZone") {
                        if (s[y.setting] === undefined) {
                            return
                        }
                        E = s[y.setting];
                        if (E.type == "IntEnum" && E.vallist !== undefined) {
                            m = getIntEnumString(E)
                        }
                    }
                }
                q = "setting"
            } else {
                if ((y.type == "ReportDataNode") || (y.type == "WarningStatusReportNode") || (y.type == "SuppliesReportNode") || (y.type == "LesAppsReportNode")) {
                    if (y.reportValue !== undefined) {
                        m = y.reportValue;
                        q = "setting"
                    } else {
                        if (y.reportValueList !== undefined) {
                            m = y.reportValueList;
                            q = "reportValueList"
                        }
                    }
                } else {
                    if (y.action !== undefined) {
                        m = y.type;
                        q = "action"
                    } else {
                        if (y.type == "Button") {
                            m = y.type;
                            q = "Button"
                        }
                    }
                }
            }
        }
    }
    if (y.reportOptions !== undefined) {
        var f = y.reportOptions;
        if (f.type !== undefined) {
            if (f.type == "none") {
                q = "ignore"
            } else {
                if (f.type == "useEnum") {
                    m = E.val
                }
            }
        }
    }
    if (q == "ignore") {
        return
    }
    var p = $("<li></li>");
    var g = "";
    if (y.reportOptions !== undefined) {
        if (y.reportOptions.translated !== undefined) {
            g = y.reportOptions.translated
        } else {
            if (y.reportOptions.id !== undefined) {
                g = getRawTranslation(y.reportOptions.id)
            }
        }
    }
    if (g.length == 0) {
        if (y.title !== undefined) {
            if (y.title.translated !== undefined) {
                g = y.title.translated
            } else {
                if (y.title.id !== undefined) {
                    g = getRawTranslation(y.title.id)
                } else {
                    if (y.title.text !== undefined) {
                        g = y.title.text
                    }
                }
            }
        } else {
            g = t
        }
    }
    if (q == "header") {
        if (y.children === undefined) {
            return
        }
        if (((y.display == "TableHeader" || y.display == "RowTable") && g == t) || (y.reportOptions !== undefined && y.reportOptions.type !== undefined && y.reportOptions.type == "skip")) {
            $.each(y.children, function(G, H) {
                recurseReportData(D, e, H, x + 1, b, s, F)
            })
        } else {
            p.addClass("header").text(g);
            var r = $("<ul class='report-level-" + x + "'></ul>");
            $.each(y.children, function(G, H) {
                recurseReportData(r, e, H, x + 1, b, s, F)
            });
            p.append(r)
        }
        D.append(p)
    } else {
        if (q == "setting") {
            p.addClass("report-item");
            if (E !== undefined && E.fctVal !== E.val) {
                p.addClass("report-item-value-changed")
            }
            if (y.reportDataOnly !== undefined) {
                p.append($("<span class='report-item-name'>" + m + "</span>"))
            } else {
                p.append($("<span class='report-item-name'>" + g + "</span>"));
                p.append(" = ");
                p.append($("<span class='report-item-value'>" + m + "</span>"))
            }
            D.append(p)
        } else {
            if (q == "reportValueList") {
                if (y.type == "LesAppsReportNode") {
                    p.addClass("report-item");
                    if (y.name !== undefined) {
                        p.append($("<span class='report-item-name'>" + y.name + "</span>"))
                    }
                    p.append(" = ");
                    if (y.version !== undefined) {
                        p.append($("<span class='report-item-value'>" + y.version + "</span>"))
                    }
                    D.append(p)
                }
                $.each(m, function() {
                    var G = $("<li></li>");
                    G.addClass("report-item");
                    if ((y.reportDataOnly !== undefined && y.reportDataOnly == 1) || (this.reportDataOnly !== undefined && this.reportDataOnly == 1)) {
                        if (this.value !== undefined) {
                            G.append($("<span class='report-item-name'>" + this.value + "</span>"))
                        } else {
                            G.append($("<span class='report-item-name'>" + this.name + "</span>"))
                        }
                    } else {
                        if (this.name !== undefined) {
                            G.append($("<span class='report-item-name'>" + this.name + "</span>"))
                        } else {
                            G.append($("<span class='report-item-name'>" + g + "</span>"))
                        }
                        G.append(" = ");
                        if (this.value !== undefined) {
                            G.append($("<span class='report-item-name'>" + this.value + "</span>"))
                        } else {
                            G.append($("<span class='report-item-name'>" + this.name + "</span>"))
                        }
                    }
                    D.append(G)
                })
            } else {
                if (q == "action") {
                    p.addClass("report-item");
                    p.append($("<span class='report-item-name'>" + g + "</span>"));
                    D.append(p)
                } else {
                    if (q == "Button") {
                        p.addClass("report-item");
                        p.append($("<span class='report-item-name'>" + g + "</span>"));
                        D.append(p)
                    }
                }
            }
        }
    }
}

function filterReportChangedOnly(a) {
    a.find("li.report-item").not(".report-item-value-changed").toggle(false);
    a.find("li.header").each(function() {
        var b = $(this);
        if (!b.is(":visible")) {
            return
        }
        if (b.find("li.report-item-value-changed").length == 0) {
            b.toggle(false)
        }
    })
}

function filterReportNormal(a) {
    a.find("li").toggle(true)
}

function getIntEnumString(b) {
    var a = "";
    var d;
    for (var c in b.vallist) {
        if (b.vallist[c].val == b.val) {
            a = b.vallist[c].str;
            break
        }
    }
    if (a.length <= 0) {
        d = b.val
    } else {
        d = a
    }
    return d
}

function initModalLink(a) {
    var b = {};
    b = $.address.queryParams();
    var c = b.clickMe;
    if (c && a.find(c)) {
        a.find("a").click();
        $.address.parameter("clickMe", null)
    }
    initControlNode(a)
}

function initSettingMapping(e) {
    var a = e.data("switch-node");
    var c = e.data("mapping");
    if (c) {
        if (typeof c !== "object") {
            if ((c = $.parseJSON(c)) === null) {
                console.error("Expecting an object for mapping, instead found: " + (typeof c));
                return
            }
        }
    } else {
        return
    }
    var b = e.find(".setting-node-value");
    if (a != undefined && a != "") {
        var d = $("#" + a + " [data-setting]");
        if (d.length != 0) {
            e.bind("refresh", function(k) {
                var h = e.data("display-node");
                var g = $("#" + h);
                if (g.length != 0) {
                    var f = getDisplayValue(g);
                    b.text($.trim(f))
                } else {
                    console.warn("No such node " + h)
                }
                k.stopPropagation()
            });
            e.bind("SettingChanged", function(g, f, h) {
                if (h in c) {
                    e.attr("data-display-node", c[h]);
                    e.data("display-node", c[h]);
                    e.trigger("refresh")
                } else {
                    console.warn("No mapping exists for " + h + " on node " + e.attr("id"))
                }
                g.stopPropagation()
            });
            e.trigger("SettingChanged", [getNodeName(d), getNodeValue(d)])
        } else {
            console.warn("No node " + a + " exists")
        }
    }
    e.controlNode()
}

function getDisplayValue(d) {
    var c = d.find("div[data-setting-type]");
    if (c.length != 0) {
        var b = c.data("setting-type");
        if (b == "DropdownSetting") {
            var e = c.data("setting");
            var a = getSetting(e).vallist.length;
            if (a == 1) {
                return d.find("span").html()
            } else {
                return d.find("option:selected").text()
            }
        } else {
            return getNodeValue(d)
        }
    } else {
        return d.text()
    }
}

function initDropdownButton(d) {
    var b = new Dropdown($(d).find(".optionsList"), "dropdown", "slide");
    var c = $(d).find(".action");
    var a = d.parent().data("node");
    if (a == "shortcutTypes") {
        updateOptions(d)
    } else {
        if (a == "VccExport") {
            d.find("#CustomExport a.link").attr("style", "text-decoration:none; font-size:8pt")
        }
    }
    b.hideDropdown();
    $(d).find(".optionsList").click(function(e) {
        if (d.parent().data("node") == "shortcutTypes") {
            b.toggleDropdown()
        }
        e.stopPropagation()
    });
    c.click(function(e) {
        if (e.currentTarget.id == "cancel_VCCBUNDLE") {
            document.getElementById("visible_setting_VCCBUNDLE").value = stored_translations.TXT_NO_FILE_SELECTED.text;
            $("#VccImportFileInput").find("form")[0].reset();
            $("#import_VCCBUNDLE").attr("disabled", "disabled")
        }
        e.stopPropagation();
        b.toggleDropdown()
    })
}

function initTextDisplayWithButton(a) {
    a.controlNode();
    a.find("button").click(function() {
        performAction(a)
    })
}

function performAction(c) {
    var d = c.data("action");
    var e = c.find("input").val();
    var a = new Communicator();
    if (d == "CLEAR_AUTOREBOOT_COUNTER") {
        if (c.data("confirmpopuptext") != "") {
            showConfirmationPopup(c, b)
        } else {
            b()
        }
    } else {
        console.error("TextDisplayWithButton: I don't know what sort of button action " + d + " is supposed to be!")
    }

    function b() {
        resetValue(c, "0");
        var f = {
            c: c.parent().data("node")
        };
        a.sendData(MAIN_CONTENT_PATH, "POST", c, "json", f)
    }
}

function resetValue(a, b) {
    var c = a.find(".setting-node-display-withbutton-numeric");
    c.text(b)
}

function showConfirmationPopup(c, b, a) {
    $(c).popup({
        messageText: getRawTranslation(c.data("confirmpopuptext")),
        buttonOneId: "TXT_CANCEL",
        buttonOneCallback: a,
        buttonTwoId: "TXT_CONTINUE",
        buttonTwoCallback: b
    })
}

function initLandingPage(c) {
    var e = c.find(".landing-button-row");
    var d = c.find(".landing-icons");
    if (d !== undefined) {
        var g = getNodeName(c);
        var b = getNodeData(g);
        for (i in b.childData) {
            var f = b.childData[i].icon;
            if (f === undefined) {
                f = "/images/Landing_Unknown.png"
            }
            if (f !== "none") {
                var h = b.childData[i].name;
                var a = "#" + g + "/" + h;
                var k = $('<div class=landing-item id="' + h + '"></div>');
                k.append($('<div class="landing-icon-holder"><a class="link" href="' + a + '"><img class="landing-icon" src="' + f + '"/></a></div>'));
                k.append($('<div class="landing-text-holder"><a class="link" href="' + a + '">' + b.childData[i].title.translated + "</a></div>"));
                d.append(k)
            }
        }
    }
    e.find("button").each(function() {
        var l = $(this);
        if (l.attr("data-type") == "nodelink") {
            l.click(function() {
                navigate_to(l.attr("data-node-name"), undefined, {
                    force: true
                })
            })
        }
    })
}

function initPortAccessIndicator(b) {
    var c = b.closest("tr");
    var a = c.find("input");
    a.change(function() {
        var d = $(this);
        if (d.is(":checked")) {
            b.removeClass("closed").addClass("open").text(getRawTranslation("TXT_AUTH_AS_OPEN"))
        } else {
            b.removeClass("open").addClass("closed").text(getRawTranslation("TXT_AIO_CLOSED"))
        }
    });
    a.change()
}

function resetPortAccessIndicator(a) {}
var CONCURRENCY_TEXTIDS = ["TXT_SERVICE_ERROR", "TXT_SERVICE_ERROR", "TXT_NULL", "TXT_SYSTEM", "TXT_DISK", "TXT_USB", "TXT_NULL", "TXT_SCANNER", "TXT_PRINTER_WEB_PAGE_HEADER", "TXT_EMAIL", "TXT_FAX", "ENUM_TXT_MPS_FAX_RECEIVE", "TXT_NETWORK", "TXT_NULL", "TXT_OTHER", "TXT_OTHER", "TXT_ALL", "TXT_STATUS_SUPPLIES", "TXT_NULL", "TXT_FAX", "TXT_PRINTER_WEB_PAGE_HEADER", "TXT_UNKNOWN", "TXT_NULL"];
var CURRENT_IRS = [];
var CURRENT_WARNINGS = [];
var deviceMenuFACProtected = false;

function initIrList(a) {
    $(a).on(STATUS_UPDATE, function(b, c) {
        refreshStatusList(a, c)
    });
    CURRENT_IRS = [];
    CURRENT_WARNINGS = [];
    if ($("li[id^='Settings-Device-link']").is(":visible")) {
        deviceMenuFACProtected = false;
        $("button[name=ir-reset-printer]").show()
    } else {
        deviceMenuFACProtected = true;
        $("button[name=ir-reset-printer]").hide()
    }
    $("button[name=ir-reset-printer]").click(function() {
        $(".popup-modal-container").popup({
            messageText: getRawTranslation("TXT_WILL_REBOOT_PRINTER"),
            buttonOneId: "TXT_CANCEL",
            buttonTwoId: "TXT_START",
            buttonTwoCallback: function() {
                doResetPrinter(a)
            },
            showCloseButton: true
        })
    });
    refreshStatusList(a, getLastStatuses())
}

function updateIrList(b, d) {
    if (deviceMenuFACProtected == false) {
        $("button[name=ir-reset-printer]").show()
    } else {
        $("button[name=ir-reset-printer]").hide()
    }
    var a = b.find(".ir-alerts tbody");
    a.empty();
    CURRENT_IRS = [];
    var c = $("<tr></tr>");
    if (d.length < 1) {
        var c = $("<tr></tr>");
        c.append($("<td></td>"));
        c.append($("<td>" + getStoredTranslation("TXT_NO_ALERTS_EXIST_ON_THE_DEVICE") + "</td>"));
        c.append($("<td></td>"));
        c.append($("<td></td>"));
        a.append(c)
    } else {
        d = sortByPriorityThenId(d);
        $.each(d, function(s, g) {
            var e = getLastActions();
            var n = $("<tr data-ir-unique-id='" + g.uniqueId + "' data-ir-handle-id='" + g.handleId + "' data-ir-concurrency='" + g.concurrency + "'></tr>");
            n.append($("<td><img src='/images/error_icon_24x24.png'></td>"));
            n.append($("<td>" + g.title + "</td>"));
            n.append($("<td>" + getStoredTranslation(CONCURRENCY_TEXTIDS[g.concurrency]) + "</td>"));
            if ((e[g.id] !== undefined) && (deviceMenuFACProtected == false)) {
                var l = e[g.id];
                var f = $("<select role='listbox' class='input setting-node-input-dropdown'></select>");
                f.append($("<option role='option' value='-1'>" + getRawTranslation("TXT_ACTIONS_WITH_ELLIPSIS") + "</option>"));
                $.each(l, function(v, w) {
                    if (w.npaTriplet == g.npaTriplet) {
                        f.append($("<option role='option' value='" + w.actionName + "'>" + w.actionText + "</option>"))
                    }
                });
                var k = $("<td></td>");
                k.append(f);
                f.change(function() {
                    if (f.val() != "-1") {
                        var v = b.closest(".panel");
                        var w = startSpinnerBlock(v);
                        fireIrAction(function(x) {
                            stopSpinnerBlock(v, w);
                            hideSpinnerBlock(v);
                            restartStatusInterval()
                        }, f.val(), n.attr("data-ir-unique-id"), n.attr("data-ir-handle-id"), n.attr("data-ir-concurrency"))
                    }
                });
                n.append(k)
            } else {
                n.append($("<td></td>"))
            }
            a.append(n);
            if (g.npaTriplet !== undefined) {
                var p = g.npaTriplet.split(".");
                var r = parseInt("0x" + p[0]);
                var m = parseInt("0x" + p[1]);
                var o = parseInt("0x" + p[2]);
                var u = [8, 24];
                var q = true;

                function t(v) {
                    return v == o
                }
                q = !(u.some(t));
                var h = (r !== NaN && m !== NaN) ? r + "-" + m : undefined;
                if ((h !== undefined) && q) {
                    CURRENT_IRS.push(h)
                }
            }
        })
    }
}

function updateWarningList(b, d) {
    var a = b.find(".ir-warnings tbody");
    a.empty();
    CURRENT_WARNINGS = [];
    if (d.length < 1) {
        var c = $("<tr></tr>");
        c.append($("<td></td>"));
        c.append($("<td>" + getStoredTranslation("TXT_NO_WARNINGS_EXIST_ON_THE_DEVICE") + "</td>"));
        a.append(c)
    } else {
        d = sortByPriorityThenId(d);
        $.each(d, function(h, m) {
            var l = $("<tr data-warn-id='" + m.id + "'></tr>");
            l.append($("<td><img src='/images/warning_icon_24x24.png'></td>"));
            l.append($("<td>" + m.title + "</td>"));
            a.append(l);
            if (m.npaTriplet !== undefined) {
                var e = m.npaTriplet.split(".");
                var g = parseInt("0x" + e[0]);
                var f = parseInt("0x" + e[1]);
                var k = (g !== NaN && f !== NaN) ? g + "-" + f : undefined;
                if (k !== undefined) {
                    CURRENT_WARNINGS.push(k)
                }
            }
        })
    }
    a.append(c)
}

function refreshStatusList(d, c) {
    var b = [];
    var a = [];
    $.each(c, function(e, f) {
        if (f.type == "warning") {
            b.push(f)
        } else {
            if (f.type == "ir") {
                a.push(f)
            }
        }
    });
    updateWarningList(d, b);
    updateIrList(d, a)
}

function fireIrAction(e, b, d, a, c) {
    $.ajax({
        type: "POST",
        url: "/webglue/iraction/send",
        data: {
            actionName: b,
            uniqueId: d,
            handleId: a,
            concurrency: c
        },
        success: function(f) {
            e.call(this, f)
        },
        error: function() {
            console.error("IT'S BROKEN AND IT'S ALL YOUR FAULT")
        }
    })
}

function updateOptions(e) {
    var h = (e).find("#shortcutTypesListDefault");
    var f = getSetting("SHORTCUT_LIST").typeList;
    var k = f.length;
    var c = $(".filter");
    (c).find(".optionsList").empty();
    var d = $(e).find(".action");
    if ((h != undefined) && (k != 0)) {
        d.show();
        h.find("div[id!='ShortcutType_']").attr("disabled", "disabled");
        var b = (e).find("#shortcutTypesList");
        if (k > 1) {
            for (i in f) {
                (e).find("#ShortcutType_" + f[i]).removeAttr("disabled")
            }
            if (c.attr("selection") == "None") {
                c.attr("selection", f[0]);
                var g = (e).find("#ShortcutType_" + f[0]);
                var m = g.attr("textid");
                (d).find("span").replaceWith(getStoredTranslation(m));
                var l = d.outerWidth();
                (d).css("background-position", Math.round(l - 13) + "px")
            }
        } else {
            if (k == 1) {
                d.hide()
            }
        }
        var a = h.find("div[id^='ShortcutType_']");
        a.each(function() {
            if ($(this).attr("disabled") == undefined) {
                $(this).clone().appendTo(b)
            }
        });
        b.find(".option").each(function() {
            $(this).click(function(q) {
                var o = $(this).attr("id").split("_")[1];
                $(".filter").attr("selection", o);
                var r = $(this).attr("textid");
                var n = (e).find(".action");
                (n).find("span").replaceWith(getStoredTranslation(r));
                e.closest(".selectTable").table("reload", e.closest(".selectTable"));
                var p = d.outerWidth();
                (d).css("background-position", Math.round(p - 13) + "px")
            })
        })
    }
}

function enableSelectedType(b) {
    var c = "";
    var a = $("li[id^='ShortcutSettings']");
    a.each(function() {
        $(this).hide()
    });
    switch (parseInt(b.val())) {
        case 1:
            c = "Copy";
            break;
        case 2:
            c = "Email";
            break;
        case 3:
            c = "Fax";
            break;
        case 4:
            c = "Ftp";
            break;
        case 5:
            c = "Profile";
            break;
        case 6:
            c = "NetworkFolder";
            break;
        default:
            c = ""
    }
    $("#ShortcutSettings" + c).show();
    a.each(function() {
        if (!$(this).is(":visible")) {
            $(this).find("div[data-setting]").each(function() {
                if ($(this).hasClass("setting-changed")) {
                    resetNode($(this))
                }
            })
        }
    })
}

function loadEditPageFromType(b) {
    var e = "";
    switch (parseInt(b.val())) {
        case 1:
            e = "Copy";
            break;
        case 2:
            e = "Email";
            break;
        case 3:
            e = "Fax";
            break;
        case 4:
            e = "Ftp";
            break;
        case 5:
            e = "Profile";
            break;
        case 6:
            e = "NetworkFolder";
            break;
        default:
            e = ""
    }
    var d = SHORTCUTLIST_EDIT_PATH + e + "?tableEditId=new";
    b.parent().parent().attr("selshortcuttype", e);
    selectedShortcutType = e;
    var c = "li[id^='ShortcutSettings" + e + "']";
    var a = $(c);
    a.each(function() {
        if (!$(this).is(":visible")) {
            $(this).find("div[data-setting]").each(function() {
                if ($(this).hasClass("setting-changed")) {
                    resetNode($(this))
                }
            })
        }
    });
    navigate_to(d, undefined, {
        force: true
    })
}

function getShortcutTypeValue(b) {
    if (b.parent().attr("id") == "ShortcutType") {
        var a = b.find("select");
        if (a !== undefined) {
            return (parseInt(a.val()))
        } else {
            return 1
        }
    }
    return undefined
}

function resetSelectedShortcutType(a) {
    if (a !== undefined) {
        var b = a.search("ShortcutsManagement");
        if (b > -1) {
            b = a.lastIndexOf("/");
            if (b == 0) {
                selectedShortcutType = "Copy"
            }
        } else {
            selectedShortcutType = "Copy"
        }
    }
}

function confirmUpdateShortcutUtil(f) {
    var c = {};
    if (f == "EditShortcutName" || f == "EditShortcutId") {
        c.conflict = "Edit";
        c.oldId = $.address.queryParams().tableEditId;
        c.field = f
    } else {
        c.field = (f == "ShortcutName") ? "id" : "name"
    }
    c.name = $("#ShortcutName").find("input").last().val();
    c.id = $("#ShortcutId").find("input").last().val();
    var h = {};
    l($("#EditShortcutInfo"), h);
    var d = $("li[id^='ShortcutSettings']");
    d.each(function() {
        if ($(this).is(":visible")) {
            l($(this), h)
        }
    });
    c.data = JSON.stringify(h);
    var b = $("#ShortcutType").find("select").last().val();
    switch (parseInt(b)) {
        case 1:
            c.type = "Copy";
            break;
        case 2:
            c.type = "Email";
            break;
        case 3:
            c.type = "Fax";
            break;
        case 4:
            c.type = "Ftp";
            break;
        case 5:
            c.type = "Profile";
            break;
        case 6:
            c.type = "NetworkFolder";
            break;
        default:
            c.type = ""
    }
    var k = $(".page");
    var g = startSpinnerBlock(k);
    var e = 1500;
    this.showMessage(stored_translations.TXT_SAVED.text);
    this.fadeTimeout = setTimeout(function() {
        $(this).find(".setting-saved-message").fadeOut(e)
    }, 300);
    var a = new Communicator();
    a.sendData(SHORTCUTS, "POST", this, "json", c);
    a.addSuccessHandler(function(m) {
        if (m.tableEditId != 0) {
            stopSpinnerBlock(k, g);
            hideSpinnerBlock(k);
            navigate_to("ShortcutsManagement", undefined, {
                force: true
            })
        }
    });

    function l(n, m) {
        n.find("div[data-setting]:not(:disabled, .ui-state-disabled, [data-control-disabled])").each(function() {
            if (!checkNodeValue($(this))) {
                return
            }
            var p = $(this).closest("[data-node]").data("node");
            var o = getNodeValue($(this));
            if (o != undefined) {
                m[p] = o
            }
        })
    }
}

function getSelectedJobLogNames(d) {
    var e = d.attr("data-setting");
    var c = getSetting(e);
    var b = d.data("table").selected;
    var a = [];
    for (selectedId in b) {
        for (dataId in c.data) {
            if (b[selectedId] == c.data[dataId].id) {
                a.push(c.data[dataId].name)
            }
        }
    }
    return a
}

function printJobAccountingLogs(c, b) {
    var a = getSelectedJobLogNames(c);
    for (selectedIndex in a) {
        printJobAccountingLog(c, a[selectedIndex], b)
    }
}

function printJobAccountingLog(f, b, e) {
    var a = new Communicator();
    var g = {};
    var d = {};
    var c = {};
    d.name = "ReportJobAccounting";
    c.logFileName = b;
    c.formatType = e.attr("val");
    d.reportParams = c;
    g.data = JSON.stringify(d);
    a.sendData("/webglue/printReport", "POST", f, "json", g)
}

function exportJobAccountingLogs(c) {
    var b = getSelectedJobLogNames(c);
    for (selectedIndex in b) {
        var a = "/webglue/downloadLog?type=jobAccounting&name=" + b[selectedIndex];
        window.open(a)
    }
}

function testMatchingValue(d, c, e) {
    if (e != undefined) {
        var a = e.indexOf("*");
        if (a > 0) {
            var b = d.indexOf(c, 0);
            return (b == 0) ? true : false
        } else {
            return d == c
        }
    } else {
        if (typeof c == "string") {
            return d == c
        } else {
            if (typeof c == "number") {
                return Number(d) == c
            } else {
                for (i = 0; i < c.length; i++) {
                    if (d == c[i]) {
                        return true
                    }
                }
                return false
            }
        }
    }
}

function splitValues(a, b) {
    if (a && typeof a == "string" && a.indexOf("{}") != -1) {
        a = a.split("{}");
        if (b && a[a.length - 1] == "") {
            a.pop()
        }
    }
    return a
}

function isEqual(d, c) {
    if ((typeof d) !== (typeof c) || Array.isArray(d) && !Array.isArray(c) || Array.isArray(c) && !Array.isArray(d)) {
        return false
    }
    if (Array.isArray(d) && Array.isArray(c)) {
        if (d.length !== c.length) {
            return false
        }
        for (var e = 0; e < d.length; e++) {
            if (!isEqual(d[e], c[e])) {
                return false
            }
        }
    } else {
        if (typeof d === "object") {
            if (Object.size(d) !== Object.size(c) || d === null && c !== null || c === null && c !== null) {
                return false
            }
            for (property in d) {
                if (!c.hasOwnProperty(property)) {
                    return false
                }
                if (!isEqual(d[property], c[property])) {
                    return false
                }
            }
        } else {
            if (typeof d === "function") {
                return false
            } else {
                return (d === c)
            }
        }
    }
    return true
}

function calculateMaxDescWidth(c) {
    var e = c.find(".setting-node-description");
    if (e != undefined) {
        var l = c.find(".setting-node-title").outerWidth(true);
        var h = c.find(".setting-node-input").find("input").outerWidth(true);
        var n = c.find(".setting-node-input").find(".node-error").outerWidth(true);
        if (isNaN(n)) {
            n = 0
        }
        var a = c.closest(".panel").outerWidth(true);
        var b = c.closest(".panel-contents").outerWidth(true);
        var d = e.css("margin-left");
        if (d != undefined) {
            d = parseInt(d)
        } else {
            d = 0
        }
        var g = b + l + h + n + d;
        var m = Math.round(a - g);
        if (m > 0 && e.css("max-width") != undefined) {
            e.css("max-width").replace("%", "px");
            var k = 60;
            var f = c.data("setting-type");
            if (f == "TextInput" || f == "NumericInput") {
                k = 100
            }
            e.css("max-width", (m - k) + "px")
        }
    }
}

function updateExternalCallbackList(f, e, d) {
    if ((f !== undefined) && (f.search("ews.external.") == 0)) {
        if (d == 1) {
            external_callbacks.push(e)
        } else {
            var b;
            for (b = 0; b < external_callbacks.length; b++) {
                var c = external_callbacks[b];
                var a = c.search(e);
                if (a == -1) {
                    continue
                }
                if (external_callbacks.length < 1) {
                    break
                }
                external_callbacks.splice(b, 1);
                break
            }
        }
    }
}

function checkForSelectedItemStatus(c) {
    if (stored_status.error != undefined) {
        var d = {
            url: "",
            errorText: getStoredTranslation("TXT_ERROR")
        };
        var b = stored_status.error;
        d.errorText = b.err_text;
        var a = $(c).siblings(".setting-saved-message");
        a.show();
        a.popup({
            messageText: d.errorText,
            buttonOneId: "TXT_OK",
            buttonOneCallback: function() {
                a.hide();
                popBreadcrumb(1)
            },
            buttonCloseCallback: function() {
                a.hide();
                popBreadcrumb(1)
            }
        })
    }
}

function doResetPrinter(a) {
    a.popup({
        showCloseButton: false
    }).popup("startSpinner");
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/webglue/reset/doresetprinter",
        success: function(b) {
            a.popup("hide");
            showRebootingPanel(a)
        },
        error: function(b) {
            a.popup("hide");
            displayResultPopup(a, 0, getRawTranslation("TXT_FACTORY_RESET_FAILED"))
        }
    })
}

function StatusContainer(b) {
    if (b === undefined) {
        return
    }
    var a = this;
    this.elem = b;
    this.statusComponents = [];
    a.elem.find("[data-deviceid]:not(.progress)").each(function() {
        var d = $(this);
        var c = d.data("deviceid");
        a.statusComponents[c] = d;
        a.elem.on(STATUS_UPDATE + "-" + c, function(f, e) {
            a.updateStatus(c, e)
        })
    });
    $(b).on(STATUS_UPDATE, function() {
        updateDeviceStatus(1)
    });
    updateDeviceStatus()
}
StatusContainer.prototype.updateStatus = function(b, a) {
    console.log("StatusContainer: called updateStatus base class. Nothing to do")
};
StatusContainer.prototype.hasStatusComponent = function(a) {
    return (this.getStatusComponent(a) !== undefined)
};
StatusContainer.prototype.getStatusComponent = function(a) {
    return this.statusComponents[a]
};
TrayStatusContainer.prototype = new StatusContainer();
TrayStatusContainer.prototype.constructor = TrayStatusContainer;

function TrayStatusContainer(a) {
    StatusContainer.call(this, a)
}
TrayStatusContainer.prototype.updateStatus = function(e, a) {
    var d = min = max = earlywarning = 0;
    if (this.hasStatusComponent(e)) {
        var b = this.getStatusComponent(e).find(".trayStatus").removeClass("tray-ok").removeClass("tray-warning").removeClass("tray-error");
        var c = getStoredDeviceStatus(e);
        if (c !== undefined) {
            d = c.levelInfo.currentLevel;
            min = c.levelInfo.minLevel;
            max = c.levelInfo.maxLevel;
            earlywarning = c.levelInfo.earlyWarningLevel
        }
        if (d <= min || a.status === "error") {
            b.addClass("tray-error")
        } else {
            if ((d > min && d <= earlywarning) || a.status === "warning") {
                b.addClass("tray-warning")
            } else {
                b.addClass("tray-ok")
            }
        }
    }
};

function initTrayStatusContainer(b) {
    var a = new TrayStatusContainer(b)
}
OutputBinStatusContainer.prototype = new StatusContainer();
OutputBinStatusContainer.prototype.constructor = OutputBinStatusContainer;

function OutputBinStatusContainer(a) {
    StatusContainer.call(this, a)
}
OutputBinStatusContainer.prototype.updateStatus = function(g, a) {
    var e = min = max = earlyWarning = 0;
    var f = getRawTranslation("TXT_OK");
    if (this.hasStatusComponent(g)) {
        var b = this.getStatusComponent(g).find(".binStatusIndicator");
        var d = getStoredDeviceStatus(g);
        if (d != undefined) {
            e = d.levelInfo.currentLevel;
            min = d.levelInfo.minLevel | 0;
            max = d.levelInfo.maxLevel | 100;
            earlyWarning = d.levelInfo.earlyWarningLevel
        }
        b.find(".selected").removeClass("selected");
        if (e >= max || a.status === "error") {
            b.find(".error").addClass("selected");
            f = b.find(".error").find(".text").text()
        } else {
            if ((e >= earlyWarning && e < max) || a.status === "warning") {
                b.find(".warning").addClass("selected");
                f = b.find(".warning").find(".text").text()
            } else {
                b.find(".ok").addClass("selected")
            }
        }
        var c = b.find("label").find("span");
        if (c !== undefined) {
            c.text(f)
        }
    }
};

function initOutputBinStatusContainer(b) {
    var a = new OutputBinStatusContainer(b)
}
SupplyStatusContainer.prototype = new StatusContainer();
SupplyStatusContainer.prototype.constructor = SupplyStatusContainer;

function SupplyStatusContainer(a) {
    StatusContainer.call(this, a)
}
SupplyStatusContainer.prototype.updateStatus = function(a, b) {
    var e = min = max = 0;
    var h = "";
    if (this.hasStatusComponent(a)) {
        var d = this.getStatusComponent(a);
        var c = getStoredDeviceStatus(a);
        if (c !== undefined) {
            e = c.curlevel;
            min = c.minlevel | 0;
            max = c.maxlevel | 100
        }
        if (d.hasClass("supplyStatusIndicator")) {
            d.find(".selected").removeClass("selected");
            d.find(".missing").removeClass("missing");
            curIcon = d.find(".status_icon");
            if (curIcon !== undefined) {
                curIcon.remove()
            }
            if (b.status === "error" || b.status === "warning") {
                if (b.level == -1) {
                    d.find(".statusIndicator").addClass("missing selected");
                    h = d.find("#missinglevel").find(".text").text()
                } else {
                    showGaugeLevel(c, d)
                }
            } else {
                d.find(".ok").addClass("selected");
                h = d.find(".ok").find(".text").text()
            }
            if (h !== "") {
                updateSupplyLabel(d, h)
            }
        } else {
            if (d.hasClass("supplyStatusIndicatorOneLevel")) {
                d.find(".selected").removeClass("selected");
                d.find(".missing").removeClass("missing");
                curIcon = d.find(".status_icon");
                if (curIcon !== undefined) {
                    curIcon.remove()
                }
                if (b.status === "error" || b.status === "warning") {
                    if (b.level == -1) {
                        d.find(".statusIndicatorOneLevel").addClass("missing selected");
                        h = d.find("#missinglevel").find(".text").text()
                    } else {
                        showGaugeLevel(c, d)
                    }
                } else {
                    d.find(".ok").addClass("selected");
                    h = d.find(".ok").find(".text").text()
                }
                if (h !== "") {
                    updateSupplyLabel(d, h)
                }
            } else {
                if (d.hasClass("supplyStatusBar")) {
                    var k = d.find(".progress-inner");
                    var g = d.find(".progress-text").data("errortxt");
                    k.removeClass("tray-ok").removeClass("tray-warning").removeClass("tray-error");
                    curIcon = d.find(".status_icon");
                    if (curIcon !== undefined) {
                        curIcon.remove()
                    }
                    if (b.status === "error") {
                        if (b.level == -1) {
                            d.find(".progress-text").html("");
                            var f = $('<div class="status_icon error">&nbsp;</div>');
                            d.append(f)
                        } else {
                            k.addClass("tray-error");
                            d.find(".progress-text").html(getStoredTranslation(g))
                        }
                    } else {
                        k.addClass("tray-ok");
                        d.find(".progress-text").html(getStoredTranslation("TXT_OK"))
                    }
                }
            }
        }
    }
};

function showGaugeLevel(b, a) {
    var c = getRawTranslation("TXT_OK");
    if (b.gaugeLevel === "fullOrEmpty" || b.curlevel === "error") {
        a.find(".error").addClass("selected");
        c = a.find(".error").find(".text").text()
    } else {
        if (b.gaugeLevel === "undefined") {
            a.find(".statusIndicator").addClass("missing selected");
            c = a.find("#missinglevel").find(".text").text()
        } else {
            a.find(".warning").addClass("selected");
            c = a.find(".warning").find(".text").text()
        }
    }
    updateSupplyLabel(a, c)
}

function initSupplyStatusContainer(b) {
    var a = new SupplyStatusContainer(b)
}

function updateSupplyLabel(c, b) {
    var a = c.find("label").find("span");
    if (a !== undefined) {
        a.text(b)
    }
}
var LANGUAGE = "lang";

function initTextSide(a) {
    setupMoreLink(a);
    a.find(".appgrid-more-less").click(function() {
        toggleMoreLink(a)
    })
}

function initAppGrid(a) {
    initWDLWorkflows(a)
}

function initWDLWorkflows(a) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/webservices/ui/wdl/workflows",
        success: function(b) {
            var d = b.html;
            var c = jQuery.parseJSON(d);
            $(c.result).each(function(h) {
                var g = $("<div></div>").addClass("appgrid-item");
                g.attr("data-app-id", this.uuid);
                var e = $("<div></div>").addClass("appgrid-iconside").append('<div class="appgrid-icon"><img src="' + this.upIcon + '"></img></div>').append('<div class="appgrid-status"></div>');
                var k = $("<div></div>").addClass("appgrid-textside").append('<div class="appgrid-nameblock"><div class="appgrid-name">' + escapeHtml(this.name) + '</div><div class="appgrid-description">' + escapeHtml(this.description) + "</div></div>");
                g.append(e).append(k);
                var f = $("div[data-node='AppGrid']");
                f.find(".appgrid-container").append(g)
            })
        },
        error: function(b) {
            console.warn("Error accessing /webservices/ui/wdl/workflows.")
        },
        complete: function(b) {
            initCsf(a)
        }
    })
}

function initCsf(a) {
    var b = {};
    var c = $.cookies.get(LANGUAGE);
    if (c != null) {
        b["Accept-Language"] = c;
        b["X-Csrf-Token"] = getSessionKey()
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/webservices/frameworks/csf/apps",
        headers: b,
        success: function(d, e) {
            console.warn("incoming(json): " + JSON.stringify(d));
            $(d.apps).each(function(k) {
                var h = $("<div></div>").addClass("appgrid-item");
                console.warn("item: " + JSON.stringify(this));
                var h = $("<div></div>").addClass("appgrid-item");
                h.attr("data-app-id", this.id);
                var f = $("<div></div>").addClass("appgrid-iconside").append('<div class="appgrid-icon"><img src="' + this.icon + '"></img></div>').append('<div class="appgrid-status"></div>');
                var l = $("<div></div>").addClass("appgrid-textside").append('<div class="appgrid-nameblock"><div class="appgrid-name">' + escapeHtml(this.name) + '</div><div class="appgrid-description">' + escapeHtml(this.description) + "</div></div>");
                h.append(f).append(l);
                var g = $("div[data-node='AppGrid']");
                g.find(".appgrid-container").append(h)
            })
        },
        error: function(d) {
            console.warn("Error accessing /webservices/frameworks/csf/apps.")
        },
        complete: function(d) {
            initAllAppsInGrid(a)
        }
    })
}

function initAllAppsInGrid(a) {
    a.find(".appgrid-icon img, .appgrid-name").click(function() {
        var c = $(this);
        var d = c.closest("[data-app-id]").attr("data-app-id");
        var b = $("#" + d + " .panel-header");
        if (!b.hasClass("panel-header-toggled")) {
            b.trigger("click", [false])
        }
        b.get(0).scrollIntoView()
    });
    a.find(".appgrid-start").click(function() {
        startStopApplication($(this), "start")
    });
    a.find(".appgrid-stop").click(function() {
        startStopApplication($(this), "stop")
    });
    checkIfAppsIsEmpty()
}

function checkIfAppsIsEmpty() {
    var a = $("div[data-node='AppGrid']");
    var c = a.find(".appgrid-item");
    if (c.length == 0) {
        var b = $("<div></div>").addClass("appgrid-item");
        b.append(getRawTranslation("TXT_NO_APPS_INSTALLED"));
        a.find(".appgrid-container").append(b)
    }
}

function setupMoreLink(b) {
    var a = b.closest(".panel-contents");
    a.show();
    var c = b.find(".appgrid-nameblock");
    if (c.height() > 119) {
        c.toggleClass("appgrid-nameblock-compact");
        b.find(".appgrid-more-less").html(getStoredTranslation("TXT_MORE_WITH_ELLIPSIS"))
    } else {
        b.find(".appgrid-more").hide();
        b.find(".appgrid-fadeout").hide()
    }
    a.hide()
}

function toggleMoreLink(b) {
    var c = b.find(".appgrid-nameblock");
    c.toggleClass("appgrid-nameblock-compact");
    var d = b.find(".appgrid-fadeout");
    var a = b.find(".appgrid-more-less");
    if (c.height() > 119) {
        d.hide();
        a.html(getStoredTranslation("TXT_LESS_WITH_ELLIPSIS"))
    } else {
        d.show();
        a.html(getStoredTranslation("TXT_MORE_WITH_ELLIPSIS"))
    }
}

function startStopApplication(c, e) {
    var b = c.closest(".appgrid-item");
    var h = b.attr("data-app-id");
    var g = b.find(".appgrid-spinner");
    var f = b.find(".appgrid-state");
    var a = b.find(".appgrid-error");
    c.toggle(false);
    a.css("visibility", "hidden");
    var d = startAppGridStartStopSpinner(g);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: APPLICATIONS_PATH + "startstop",
        data: {
            appid: h,
            action: e
        },
        success: function(k) {
            stopAppGridStartStopSpinner(g, d);
            if (k.rc == 1) {
                b.find(".appgrid-" + (e == "stop" ? "start" : "stop")).toggle(true);
                f.removeClass("appgrid-state-green").removeClass("appgrid-state-red").removeClass("appgrid-state-green");
                var l = {
                    state: "unknown",
                    textId: "TXT_UNKNOWN"
                };
                $.each(k.newAppList, function(m, n) {
                    if (n.idNormalized == h) {
                        l = {
                            state: n.state,
                            textId: n.stateId
                        }
                    }
                });
                if (l.state == "running" || l.state == "starting") {
                    if (l.state == "running") {
                        b.find(".appgrid-stop").toggle(true)
                    }
                    f.addClass("appgrid-state-green")
                } else {
                    if (l.state == "stopped" || l.state == "stopping") {
                        if (l.state == "stopped") {
                            b.find(".appgrid-start").toggle(true)
                        }
                        f.addClass("appgrid-state-red")
                    } else {
                        f.addClass("appgrid-state-grey")
                    }
                }
                f.text(getRawTranslation(l.textId))
            } else {
                a.css("visibility", "visible");
                c.toggle(true)
            }
        },
        error: function(k) {
            a.css("visibility", "visible");
            c.toggle(true)
        }
    })
}

function startAppGridStartStopSpinner(b) {
    b.toggle(true);
    var a = 0;
    return setInterval(function() {
        a++;
        b.css("background-position", "center -" + (22 * (a % 16)) + "px")
    }, 100)
}

function stopAppGridStartStopSpinner(a, b) {
    a.toggle(false);
    clearInterval(b)
}

function initLaunchAppGrid(a) {
    a.find(".appgrid-icon img, .appgrid-launch, .appgrid-name").click(function() {
        var d = $(this);
        var c = d.closest(".appgrid-item");
        var b = c.attr("data-app-url");
        window.open(b)
    })
}

function initInstallNewAppUpload(b) {
    var a = b.find("input[type=file]");
    b.find("button.install").click(function() {
        if (a.val() !== undefined && a.val().length > 0) {
            $(".popup-modal-container").popup("init", {
                messageText: "",
                showCloseButton: false
            }).popup("startSpinner");
            var c = b.find("form");
            var d = {
                headers: {
                    "X-Csrf-Token": getSessionKey()
                },
                success: function(e, g, f) {
                    var h = $.parseJSON(e.replace("<pre>", "").replace("</pre>", ""));
                    if (h.wdlType == 1) {
                        installWDL()
                    } else {
                        $(".popup-modal-container").popup("hide");
                        appInstallSuccess(e)
                    }
                },
                error: function() {
                    $(".popup-modal-container").popup("hide");
                    appInstallFailure()
                }
            };
            c.ajaxForm(d);
            c.submit()
        }
    });
    a.change(updateAppFileSelect)
}

function updateAppFileSelect() {
    var f = "#" + $(this).attr("for");
    var e = $(this).val();
    var b = e.lastIndexOf("\\");
    var c = e.lastIndexOf("/");
    var d = Math.max(b, c) + 1;
    var a = e.slice(d);
    $(f).val(a)
}

function appInstallSuccess(a, c, b) {
    a = $.parseJSON(a.replace("<pre>", "").replace("</pre>", ""));
    if (a.result == 1) {
        $(".popup-modal-container").popup("init", {
            messageText: getRawTranslation("TXT_INSTALL_SUCCESS"),
            icon: "/images/Success_Icon_68x68.png",
            buttonOneId: "TXT_OK",
            buttonOneCallback: function() {
                reloadContent()
            },
            showCloseButton: false,
            autoHide: true
        })
    } else {
        appInstallFailure()
    }
}

function appInstallFailure() {
    $(".popup-modal-container").popup("init", {
        messageText: getRawTranslation("TXT_INSTALL_FAILURE"),
        icon: "/images/Error_Icon_68x68.png",
        buttonOneId: "TXT_OK",
        showCloseButton: false,
        autoHide: true
    })
}

function installWDL() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/webservices/ui/wdl/install",
        success: function(a) {
            $(".popup-modal-container").popup("hide");
            if (a.result) {
                $(".popup-modal-container").popup("init", {
                    messageText: getRawTranslation("TXT_INSTALL_SUCCESS"),
                    icon: "/images/Success_Icon_68x68.png",
                    buttonOneId: "TXT_OK",
                    buttonOneCallback: function() {
                        reloadContent()
                    },
                    showCloseButton: false,
                    autoHide: true
                })
            } else {
                appInstallFailure()
            }
        },
        error: function(a) {
            $(".popup-modal-container").popup("hide");
            appInstallFailure();
            console.warn("Error accessing /webservices/ui/wdl/install.")
        }
    })
}

function initCertInfo(e) {
    var f = getNodeData(getNodeName(e));
    var g = f.setting;
    var d = getSetting(g);
    for (i in d.headers) {
        var h = d.headers[i].field;
        e.find("#" + h).text(d[h]);
        if (g === "VIEW_CA_CERTIFICATE" && h === "name") {
            var a = d.instance_id;
            if (a != 0) {
                e.find("#" + h).text(d[h] + "(" + a + ")")
            }
        }
    }
    if (d["expired-status"] != "Ok") {
        var c = e.find(".expired-status");
        c.append($("<img src='/images/warning_icon_30x30.png' class='expired-icon'>"));
        c.append($("<label>" + d["expired-msg"] + "</label>"))
    }
    if (d.fileData != undefined) {
        var b = e.find(".cert-details-container");
        b.attr("style", "display:block");
        d.fileData = d.fileData.replace("\n", "<br/>");
        b.append($("<label>" + d.fileData + "</label>"))
    }
}

function showDeleteCertPopup(c, e, h, f, b, g) {
    var m = CERT_PATH + e + "/";
    var l = c.find("button#" + e).data("confirm-text");
    var k = getRawTranslation(l);
    if (h != undefined) {
        var a = "default";
        if (h != a) {
            l = c.find("button#" + e).data("alt-confirm-text");
            k = getRawTranslation(l)
        }
        k = k.replace("<name/>", escapeHtml(h));
        m = m + h
    } else {
        if (b != undefined && f != undefined) {
            k = k.replace("<name/>", escapeHtml(b));
            m = m + f
        }
    }
    var d = c.find("button#" + e).data("buttontwoid-text");
    $(c).popup({
        messageText: k,
        buttonTwoId: d,
        buttonTwoCallback: function() {
            var n = new Communicator();
            n.addSuccessHandler(function(p) {
                if (p.deleted) {
                    c.modalPopup("dismiss");
                    var o = $("#" + g).find(".selectTable");
                    o.table("reload", o)
                } else {
                    alert(p.deleteMsg)
                }
            });
            n.sendData(m, "DELETE", c, "json", {})
        },
        buttonOneId: "TXT_CANCEL"
    })
}

function getChangedCertFields(b) {
    var a = [];
    b.find(".setting-changed").each(function() {
        var c = getSetting($(this).attr("data-setting"));
        if (c != undefined) {
            var d = {};
            d.name = c.id;
            d.field = c.field;
            d.value = getNodeValue($(this));
            a.push(d)
        }
    });
    return a
}

function getRequiredCertFields(b) {
    var a = [];
    b.find(".child-row").each(function() {
        var c = $(this).children().first();
        if (c != undefined && c.data("required")) {
            a.push(c)
        }
    });
    return a
}

function checkRequiredCertFields(c) {
    var b = getRequiredCertFields(c);
    var a = 0;
    for (a = 0; a < b.length; a++) {
        checkIfNodeRequired(b[a]);
        updateButtonRow(b[a])
    }
}

function processCertError(c, d) {
    if (d.statusString == "MissingParameter") {
        checkRequiredCertFields(c);
        c.find(".invalid").first().find(".input").focus()
    } else {
        if (d.statusString == "DuplicateName") {
            var b = getRequiredCertFields(c);
            var a = 0;
            for (a = 0; a < b.length; a++) {
                var e = b[a];
                if (e.data("setting") == "CERT_FRIENDLY_NAME") {
                    setNodeState(e.find(".setting-node-input"), undefined, false);
                    updateButtonRow(e);
                    e.find(".input").focus();
                    break
                }
            }
        }
    }
}

function generateNewCert(c, k) {
    var a = new Communicator();
    var g = getChangedCertFields(c);
    var d = {};
    var e = {};
    var f = 0;
    var h = "";
    for (f = 0; f < g.length; f++) {
        if (g[f].name == "CERT_FRIENDLY_NAME") {
            h = g[f].value;
            g.splice(f, 1);
            break
        }
    }
    e.friendlyName = h;
    if (g.length) {
        e.defaults = g
    }
    d.data = JSON.stringify(e);
    var b = startSpinnerBlock(c);
    a.addSuccessHandler(function(n) {
        stopSpinnerBlock(c, b);
        hideSpinnerBlock(c);
        if (n.status != 0) {
            var m = c.find(".setting-saved-message");
            if (m == undefined) {
                alert(n.statusMsg)
            } else {
                $(m).popup({
                    messageText: n.statusMsg,
                    icon: "/images/Error_Icon_68x68.png",
                    buttonOneId: "TXT_OK",
                    buttonOneCallback: function() {
                        m.hide();
                        processCertError(c, n)
                    },
                    showCloseButton: false
                })
            }
        } else {
            showFadeoutMessage(c, stored_translations.TXT_SAVED.text, function() {
                closeModalPopup()
            });
            var o = $("#DeviceCertificatesTable").find(".selectTable");
            if (o != undefined) {
                o.table("reload", o)
            }
            if (k != undefined && k.download != undefined && k.download == true) {
                var l = "/webglue/downloadCert?friendlyName=" + h;
                window.open(l)
            }
        }
    });
    a.sendData("/webglue/generateCert", "POST", c, "json", d)
}

function setCertDefaults(c) {
    var a = new Communicator();
    var b = getChangedCertFields(c);
    var f = {};
    var d = {};
    d.defaults = b;
    f.data = JSON.stringify(d);
    var e = startSpinnerBlock(c);
    a.addSuccessHandler(function(h) {
        stopSpinnerBlock(c, e);
        hideSpinnerBlock(c);
        if (h.status != 0) {
            var g = c.find(".setting-saved-message");
            if (g == undefined) {
                alert(h.statusMsg)
            } else {
                $(g).popup({
                    messageText: h.statusMsg,
                    icon: "/images/Error_Icon_68x68.png",
                    buttonOneId: "TXT_OK",
                    buttonOneCallback: function() {
                        g.hide();
                        c.find("input").first().focus()
                    },
                    showCloseButton: false
                })
            }
        } else {
            showFadeoutMessage(c, stored_translations.TXT_SAVED.text, function() {
                closeModalPopup()
            })
        }
    });
    a.sendData("/webglue/setCertDefaults", "POST", c, "json", f)
}

function restoreCertDefaults(b) {
    var a = new Communicator();
    a.addSuccessHandler(function(e) {
        if (e.restored) {
            for (id in e.restored) {
                var d = e.restored[id];
                var g = b.find("#" + id).find("div").first();
                var f = g.find("input").first();
                if (f.val() != d) {
                    setTextInput(g, d);
                    setSetting(g.data("setting"), "val", d)
                }
                g.removeClass("setting-changed");
                updateButtonRow(g)
            }
            b.find("input").first().focus()
        } else {
            var c = b.find(".setting-saved-message");
            if (c == undefined) {
                alert(e.statusMsg)
            } else {
                $(c).popup({
                    messageText: e.statusMsg,
                    icon: "/images/Error_Icon_68x68.png",
                    buttonOneId: "TXT_OK",
                    buttonOneCallback: function() {
                        c.hide();
                        b.find("input").first().focus()
                    },
                    showCloseButton: false
                })
            }
        }
    });
    a.sendData(CERT_PATH + "RestoreDefaults", "GET", b, "json", {})
}

function initSiteMap(a) {
    var b = getNodeName(a);
    if (b == "HelpfulLinksGrid") {
        if (a.find(".indexgrid-item").length != 0) {
            a.find(".indexgrid-item").each(function() {
                var c = getNodeData($(this).attr("id"));
                if (c.link === "") {
                    $(this).find("a").click(function(d) {
                        d.preventDefault()
                    });
                    if (c.defaultUrl === "") {
                        $(this).remove()
                    }
                }
            })
        }
    }
    if (b == "SiteIndexGrid") {
        if (a.find(".indexgrid-item").length != 0) {
            $(".popup-modal-container").popup("init", {
                showCloseButton: false,
                autoHide: true
            });
            $(".popup-modal-container").popup("startSpinner");
            setTimeout(function() {
                a.find(".indexgrid-item").each(function() {
                    var d = $(this).find(".indexgrid-name");
                    if (d.html() === undefined) {
                        $(this).remove();
                        return
                    }
                    var c = d.closest("[index-data-node]").attr("index-data-node");
                    var e = d.closest("[index-data-node]").attr("index-source");
                    createLinks(e, $(this))
                });
                $(".popup-modal-container").popup("hide")
            }, 3000)
        }
    }
}

function createLinks(d, c) {
    var b = [];
    var a = new Communicator();
    a.setAsync(false);
    a.addSuccessHandler(function(l) {
        var e = {};
        e[d] = l.nodes.nodes[d];
        if (e[d] !== undefined) {
            var o = $('<div class="indexgrid-links"></div>');
            var m = $("<ul></ul>");
            var h = e[d].children;
            for (i in h) {
                if (l.nodes.nodes[h[i]] !== undefined) {
                    var f = l.nodes.nodes[h[i]];
                    var n = f.name;
                    var k = e[d].name;
                    var g = "/#/" + k + "/" + n + "?depth=0";
                    if (n === "TrayConfiguration") {
                        g = "/#/" + k + "?depth=1"
                    }
                    m.append($('<li id="' + n + '"><a class="link" href="' + g + '">' + f.title.translated + "</a></li>"))
                }
            }
            o.append(m);
            c.append(o)
        } else {
            $("#" + c.attr("id")).remove()
        }
    });
    a.sendData(RAW_CONTENT, "GET", undefined, "json", {
        c: d,
        depth: 1,
        checkdepth: true
    })
}

function initSearchResults(b) {
    if (b.find(".searchresult-items").length != 0) {
        var a = 0;
        b.find(".searchResult").each(function() {
            var c = $(this).attr("parent-node-name");
            var f = $(this).attr("search-node-name");
            var d = $(this).attr("node-controlled");
            a++;
            if (c && f && d === "yes") {
                var e = getHiddenChildren(c);
                if (e !== undefined) {
                    for (i in e) {
                        if (e[i] === f) {
                            $(this).remove();
                            a--;
                            break
                        }
                    }
                }
            }
        });
        if (a > 0) {
            b.find(".noResults").remove()
        }
    }
    stopSpinnerPopup();
    $(b).show()
}

function initNLRP(a) {
    $(a).on(STATUS_UPDATE, function() {
        data = {};
        data.timedRefresh = 1;
        refreshNode("NLRP", data)
    });
    $(a).on(NODE_UPDATE, function(b, c) {
        nodeUpdated(a, c)
    });
    refreshNode("NLRP")
}

function nodeUpdated(b, c) {
    var a = b;
    a.empty();
    if (c != undefined) {
        if (c.nodes.nodes.NLRP != undefined) {
            a.append(c.nodes.nodes.NLRP.message)
        }
    }
}

function initValueConflictNode(a) {
    a.valueConflictNode()
}(function(a) {
    a.fn.valueConflictNode = function() {
        return this.each(function() {
            var c = a(this);
            var d = getNodeName(c);
            if (d === undefined) {
                console.error("Invalid elem passed to valueConflictNode; I can't figure out what node this is supposed to be!");
                return
            }
            var b = getNodeData(d);
            if (b === undefined || b.valueConflicts === undefined) {
                return
            }
            c.bind("SettingChanged", function(h, e, k) {
                if (e != d) {
                    return
                }
                var g = getNodeData(d).valueConflicts;
                if (g[k] !== undefined) {
                    var f = g[k];
                    if (f.action == "OnSaveAndChangePopup") {
                        c.closest(".panel-contents").popup({
                            messageText: getRawTranslation(f.popupText),
                            buttonOneId: f.confirmText
                        })
                    } else {
                        if (f.action == "onSavePopup") {} else {
                            console.error("I don't know what sort of value conflict node  " + f.action + " is supposed to be!")
                        }
                    }
                }
                h.stopPropagation()
            })
        })
    }
})(jQuery);

function initCustomExportItems(a) {
    a.find("#export-device-settings-all").change(function(c) {
        var b = $(c.target);
        if (b.is(":checked")) {
            $("#export-device-settings-changes").prop("checked", false).change()
        }
    });
    a.find("#export-device-settings-changes").change(function(c) {
        var b = $(c.target);
        if (b.is(":checked")) {
            $("#export-device-settings-all").prop("checked", false).change()
        }
    })
}

function doCustomExport() {
    var d = $(".export-options");
    if (d.find("input:checked").length > 0) {
        var b = "";
        var a = undefined;
        d.find(".export-checkbox").each(function() {
            if ($(this).is(":checked")) {
                if (b.length) {
                    b += ","
                }
                b += $(this).attr("filter-type");
                if ($(this).attr("id") == "export-device-settings-changes") {
                    a = "user"
                }
            }
        });
        var c = "/webservices/vcc/bundles?filter=" + b;
        if (a !== undefined) {
            c += "&type=";
            c += a
        }
        window.location.href = escapeHtml(c);
        closeModalPopup()
    }
}
var MAIN_CONTENT_PATH = "/webglue/content";
var RAW_CONTENT = "/webglue/rawcontent";
var DO_ACTION_PATH = "/webglue/do_action";
var DO_DELETE_PATH = "/webglue/delete";
var SESSION_CREATE_PATH = "/webglue/session/create";
var SESSION_DESTROY_PATH = "/webglue/session/destroy";
var SPNEGO_PATH = "/webglue/session/spnego";
var AUTO_LOGIN_PATH = "/webglue/session/autologin";
var NODE_DATA_PATH = "/webglue/webui/nodedata/";
var APPLICATIONS_PATH = "/webglue/applications/";
var WEBSERVICES_PATH = "/webservices/";
var UI_WEBSERVICES_PATH = WEBSERVICES_PATH + "ui/";
var EWS_REPORTS_PATH = "/webglue/getReport";
var DEFAULT_PAGE = "/Status";
var SE_PAGE = "/SEMenuContent";
var SHORTCUTS = "/webglue/shortcuts/";
var CERT_PATH = "/webglue/certMgr";
var SUPPLIES_LOCATION_ID = 8;
var INPUTS_LOCATION_ID = 1;
var OUTPUTS_LOCATION_ID = 2;
var STATUS_UPDATE = "STATUS_UPDATE";
var NODE_UPDATE = "NODE_UPDATE";
var SUPPORTED_LANGUAGES = ["en", "fr", "de", "it", "es", "da", "no", "nl", "sv", "fi", "pt", "ja", "ru", "cs", "pl", "hu", "tr", "zh-TW", "zh-CN", "ko", "el", "ro", "sk", "sr", "sl", "hr"];
var stored_vars = {};
var stored_settings = {};
var stored_nodes = {};
var stored_schedules = {};
var stored_status = {};
var stored_device_status = {};
var view_stack = [];
var view_data = {};
var open_panels = [];
var timeouts = [];
var statusInterval;
var lastStatuses = [];
var lastActions = {};
var external_callbacks = [];
var STORED_SCHEDULE_OBJ = "scheduleObj";
var STORED_BANNED_FAX_LIST = "bannedFaxListObj";
var STORED_EMAIL_LIST1 = "EmailList1Obj";
var STORED_EMAIL_LIST2 = "EmailList2Obj";
var SHORTCUTLIST_EDIT_PATH = "ShortcutsManagement/ShortcutList/EditShortcut";
var selectedShortcutType = "Copy";

function liftOff(c) {
    var a = $(".printerlogo");
    var d = a.find("img").attr("src");
    if (c === undefined) {
        c = "RocketPrinterVertical.png"
    }
    a.fadeOut(500, function() {
        a.html('<img src="/images/' + c + '">');
        a.fadeIn(500, b)
    });

    function b() {
        var f = 0;
        a.animate({
            top: -300
        }, 3000, "easeInExpo", e).effect("shake", {
            times: 50,
            distance: 5
        }, 2500, e).dequeue();

        function e() {
            f++;
            if (f < 2) {
                return
            }
            a.hide();
            a.attr("style", "display:none");
            a.html('<img src="' + d + '" alt="Printer Logo">');
            a.css("top", "");
            a.css("left", "");
            a.fadeIn(500)
        }
    }
}
var gblSpinnerPopupHandle;

function startSpinnerPopup(b) {
    var a = 4000;
    if (b !== undefined) {
        a = b
    }
    $(".popup-modal-container").popup("init", {
        showCloseButton: false,
        autoHide: true
    });
    $(".popup-modal-container").popup("startSpinner");
    gblSpinnerPopupHandle = setTimeout(function() {
        stopSpinnerPopup()
    }, a)
}

function stopSpinnerPopup() {
    if (gblSpinnerPopupHandle !== undefined) {
        clearTimeout(gblSpinnerPopupHandle);
        gblSpinnerPopupHandle = undefined
    }
    $(".popup-modal-container").popup("hide")
}

function initSiteSearch() {
    var b = $("#siteSearch input");
    var a = $("#siteSearch button");
    c();

    function c() {
        a.enable()
    }
    a.click(function(h) {
        var f = b.val().length;
        if (f < 2) {
            $(".popup-modal-container").popup({
                messageText: getRawTranslation("TXT_SEARCH_KEYWORD_TWO_CHARACTERS"),
                buttonOneId: "TXT_OK",
                icon: "/images/Error_Icon_68x68.png",
                showCloseButton: false
            });
            return
        }
        var e = b.val();
        var g = e.toLowerCase();
        var d = false;
        if (/^\x72\x6F\x63\x6B\x65\x74\x20/.test(g) && $(".printerlogo").is(":visible") && !($(".printerlogo").is(":animated"))) {
            g = g.slice(7);
            if (/^\x70\x72\x69\x6E\x74\x65\x72$/.test(g)) {
                liftOff("RocketPrinterVertical.png");
                d = true
            } else {
                if (/^\x73\x74\x61\x6E$/.test(g)) {
                    liftOff("RocketStan.png");
                    d = true
                }
            }
        }
        if (!d) {
            navigate_to("SiteSearch", h, {
                params: {
                    search: b.val()
                }
            });
            if ($(".setting-changed").length == 0) {
                startSpinnerPopup(20000)
            }
        }
    });
    b.keydown(function(d) {
        if (d.keyCode == 13) {
            a.click();
            return false
        }
    });
    b.keyup(function() {
        c()
    });
    b.mouseup(function() {
        c()
    })
}

function initImportExport() {
    var c = $("#VccExport");
    var d = new ContentHandler(c);
    d.loadContent("VccExport");
    initContent(c);
    var a = $("#VccImport");
    var b = new ContentHandler(a);
    b.loadContent("VccImport");
    initContent(a)
}

function getQueryParam(c) {
    var b = new RegExp("[\\?&]" + c + "=([^&#]*)");
    var a = b.exec(window.location.hash);
    if (a == null) {
        return ""
    } else {
        return a[1]
    }
}

function changeLanguage(b) {
    var a = new Date();
    a.setFullYear(a.getFullYear() + 1);
    $.cookies.set("lang", b, {
        expiresAt: a
    });
    window.location.reload()
}

function getLanguage() {
    return $.cookies.get("lang")
}

function formatID(a) {
    if (a.charAt(0) != "#") {
        a = "#" + a
    }
    return a
}

function initGroup(b, a) {
    if (a != undefined) {
        $(b).each(function() {
            a($(this), $(this).attr("class").split(" ")[0])
        })
    }
}

function initComponents(context) {
    initGroup(".progress", ProgressBar.prototype.init);
    initSaveResetButtons(context);
    context.find("div[data-init], li[data-init], a[data-init]").each(function() {
        var elem = $(this);
        var fnc = elem.attr("data-init").split("(")[0];
        if (eval("typeof " + fnc) == typeof(Function)) {
            eval(fnc + "(elem)")
        } else {
            console.warn("data-init function " + fnc + " isn't implemented!")
        }
    });
    context.find("div[data-init]").each(function() {
        doConflictChecks($(this))
    });
    restartStatusInterval()
}

function centerTitles(a) {
    a.find(".setting-node-title").each(function() {
        if ($(this).css("vertical-align") == "middle") {
            centerWithinParent($(this).find("span"), "vertical")
        }
    })
}

function initContent(a) {
    disableDragging();
    initComponents(a);
    centerTitles(a);
    a.find(".panel").each(function() {
        if ($(this).parent().is(":first-child")) {
            $(this).panel("open")
        } else {
            var b = $(this).closest("[data-node]").data("node");
            if (b === undefined) {
                $(this).panel("open");
                return (false)
            }
        }
    });
    updateLoginStatus()
}

function initOneTime() {
    var c = new Dropdown($("#languagedropdown"), "dropdown", "fade");
    $("#languageclickarea").click(function(f) {
        c.toggleDropdown(f)
    });
    $("#languagedropdowntab").click(function(f) {
        c.hideDropdown(f)
    });
    var b = new Dropdown($("#logindropdown"), "dropdown", "fade");
    $("#loginclickarea").click(function(f) {
        b.toggleDropdown(f)
    });
    $("#logindropdowntab").click(function(f) {
        b.hideDropdown(f)
    });
    b.addShowHandler(updateLoginDropdown);
    var d = $("#loginclickarea").width() + 12;
    $("#logindropdowntab").css("width", d);
    var a = $("#languageclickarea").width() + 12;
    $("#languagedropdowntab").css("width", a);
    $("#logoutclickarea").click(function(f) {
        logout()
    });
    $("html").click(function() {
        closeAllDropdowns()
    });
    $(".dropdownanchor").click(function(f) {
        f.stopPropagation()
    });
    $(document).keypress(function(f) {
        if (f.which == Clickable.prototype.ENTERBUTTON) {
            $(document.activeElement).trigger("doEnter");
            $(document.activeElement).click();
            f.preventDefault()
        }
    });
    $.valHooks.textarea = {
        get: function(f) {
            return f.value.replace(/\r?\n/g, "\r\n")
        }
    };
    var e = $.cookies.get("lang");
    if (e == null || $.inArray(e, SUPPORTED_LANGUAGES) == -1) {
        $.cookies.set("lang", "en")
    }
    initSiteSearch();
    initImportExport();
    initNavArea();
    initStatusArea()
}

function initNavArea() {
    $("ul.linksList a.navLink").each(function() {
        var a = $(this);
        initHref(a)
    })
}

function initStatusArea() {
    $("#StatusArea .warnings .warningline").add($("#StatusArea .warnings .warningline-more")).click(function() {
        navigate_to("Status", undefined, {})
    })
}

function restartStatusInterval() {
    clearInterval(statusInterval);
    statusInterval = setInterval(function() {
        updateDeviceData(1);
        refreshStatusArea()
    }, 15000);
    refreshStatusArea()
}

function updateNode(a) {
    $.event.trigger(NODE_UPDATE, [a])
}

function updateNodeValue(settings, updates) {
    if (updates != undefined) {
        var newVal = eval("updates.nodes.settings." + settings + ".val");
        var settingNode = "setting_" + settings;
        $(document.getElementById(settingNode)).val(newVal);
        setSetting(settings, "val", newVal)
    }
}

function refreshNode(b, a) {
    $.ajax({
        type: "GET",
        dataType: "json",
        data: a,
        url: NODE_DATA_PATH + b,
        success: function(c) {
            validateExistingSession(c);
            updateNode(c)
        },
        error: function() {
            console.warn("refreshNode callback Error!")
        }
    })
}

function refreshStatusArea() {
    $.ajax({
        cache: false,
        type: "GET",
        dataType: "json",
        url: "/webglue/isw/status",
        success: function(f) {
            var n = f;
            storeStatusAndUpdate(n);
            var b;
            var e;
            var h = false;
            for (var m in n) {
                var c = n[m];
                if ((c.type == "ir" || c.type == "warning") && e !== undefined) {
                    h = true
                }
                if (c.type == "status" && b === undefined) {
                    b = c
                } else {
                    if (c.type == "ir" || c.type == "warning") {
                        if (e === undefined || (e.type == "warning" && c.type == "ir")) {
                            e = c
                        }
                    }
                }
            }
            var g = $("#StatusArea .status");
            var d = g.find(".statusline");
            var l = $("#StatusArea .warnings");
            var a = l.find(".warningline");
            var k = l.find(".warningline-more");
            if (b !== undefined) {
                d.text(b.IrTitle).removeClass("statuswarning").removeClass("statuserror").addClass("statusready");
                g.css("visibility", "")
            } else {
                d.empty();
                g.css("visibility", "hidden")
            }
            if (e !== undefined) {
                d.removeClass("statusready");
                a.text(e.IrTitle);
                k.toggle(h);
                if (e.type == "ir") {
                    a.add(d).removeClass("statuswarning").addClass("statuserror")
                } else {
                    a.add(d).removeClass("statuserror").addClass("statuswarning")
                }
                l.css("visibility", "")
            } else {
                a.empty();
                l.css("visibility", "hidden")
            }
        },
        error: function() {
            console.error("There was an error retrieving the printer status.")
        }
    })
}

function storeStatusAndUpdate(a) {
    lastStatuses = [];
    lastActions = {};
    $.each(a, function(b, c) {
        if (c.type == "ir" || c.type == "status" || c.type == "warning") {
            lastStatuses.push({
                id: c.id,
                concurrency: c.concurrency,
                type: c.type,
                title: escapeHtml(c.IrTitle),
                image: c.graphicId,
                description: escapeHtml(c.IrTitle),
                uniqueId: c.uniqueId,
                handleId: c.handleId,
                npaTriplet: c.npaTriplet,
                priority: c.priority
            })
        } else {
            if (c.type == "action") {
                if (lastActions[c.id] === undefined) {
                    lastActions[c.id] = []
                }
                lastActions[c.id].push({
                    id: c.id,
                    irId: c.id,
                    actionName: c.actionName,
                    actionText: c.actionText,
                    description: escapeHtml(c.IrTitle),
                    npaTriplet: c.npaTriplet
                })
            }
        }
    });
    updateStatus()
}

function updateStatus() {
    $.event.trigger(STATUS_UPDATE, [getLastStatuses()])
}

function updateDeviceStatus() {
    var d = {};
    var a = undefined;
    var b = undefined;
    var c = {};
    $("[data-deviceid]:visible").each(function() {
        var f = $(this).data("deviceid");
        var e = Number(f.split("-")[0]);
        if (e !== NaN) {
            if (e === SUPPLIES_LOCATION_ID) {
                a = stored_device_status[f].curlevel
            } else {
                a = stored_device_status[f].levelInfo.currentLevel
            }
            b = stored_device_status[f].currentStatusEnum
        }
        c = {
            status: "clear",
            level: a,
            "enum": b
        };
        if (CURRENT_IRS.indexOf(f) >= 0) {
            c.status = "error"
        } else {
            if (CURRENT_WARNINGS.indexOf(f) >= 0) {
                c.status = "warning"
            } else {
                if (isNaN(f.split("-")[1])) {
                    c.status = a
                }
            }
        }
        d[f] = c
    });
    $.each(d, function(f, e) {
        $.event.trigger(STATUS_UPDATE + "-" + f, [e])
    })
}

function updateDeviceData(b) {
    var a = new ContentHandler();
    a.setAsync(true);
    params = {};
    params.timedRefresh = b;
    a.loadRawContent("Status", params)
}

function getLastStatuses() {
    return lastStatuses
}

function getLastActions() {
    return lastActions
}

function disableDragging() {
    $("img").mousedown(function(a) {
        a.preventDefault()
    })
}

function clearTimeouts() {
    for (var a = 0; a < timeouts.length; ++a) {
        clearTimeout(timeouts[a]);
        clearInterval(timeouts[a])
    }
    timeouts = []
}

function initAddressManager() {
    $.address.change(function(a) {
        $(".linksList a[data-path]").each(function() {
            var d = $.address.path();
            var c = $(this).attr("data-path");
            if (d.search(c) >= 0) {
                $(".link-selected").removeClass("link-selected");
                $(this).addClass("link-selected")
            }
        });
        clearTimeouts();
        closeAllDropdowns();
        closeModalPopup();
        resetSelectedShortcutType(a.path);
        var b = new ContentHandler($("#maincontent"));
        b.loadContent(a.path, a.parameters)
    })
}

function reloadContent() {
    var a = window.location.hash.replace("#", "");
    var b = $.address.path();
    var c = new ContentHandler($("#maincontent"));
    c.loadContent($.address.path(), $.address.queryParams())
}
$(document).ready(function() {
    if (hasSession()) {
        $.ajaxSetup({
            headers: {
                "X-Csrf-Token": getSessionKey()
            }
        })
    }
    initAddressManager();
    initOneTime()
});

function centerWithinParent(c, a) {
    var b = c.parent();
    var d = b.height();
    var e = b.width();
    if (b.css("position") == "static") {
        b.css("position", "relative")
    }
    if (a == "vertical" || a == "both") {
        c.css("position", "absolute").css("top", "" + Math.round(((d - c.outerHeight(true)) / 2)) + "px")
    }
    if (a == "horizontal" || a == "both") {
        c.css("position", "absolute").css("left", "" + Math.round(((e - c.outerWidth(true)) / 2)) + "px")
    }
}

function centerWithinWindow(c) {
    var d = $(window);
    var b = d.height();
    var a = d.width();
    c.css("position", "fixed");
    c.css("top", "" + Math.round(((b - c.outerHeight(true)) / 2)) + "px").css("left", "" + Math.round(((a - c.outerWidth(true)) / 2)) + "px")
}

function centerWithinCurrentViewport(e) {
    var f = $(window);
    var c = f.height();
    var b = f.width();
    e.css("position", "absolute");
    var d = Math.round(((c - e.outerHeight(true)) / 2) + f.scrollTop());
    var a = Math.round(((b - e.outerWidth(true)) / 2) + f.scrollLeft());
    e.css("top", "" + d + "px").css("left", "" + a + "px")
}

function getStoredTranslation(b) {
    var a = undefined;
    if (typeof b === "string") {
        a = stored_translations[b]
    } else {
        if (typeof b === "number") {
            for (stringItem in stored_translations) {
                if (b === stored_translations[stringItem]["id"]) {
                    a = stored_translations[stringItem];
                    break
                }
            }
        }
    }
    if (a == undefined) {
        return '<span class="translated">UNKNOWN TEXT ID ' + b + "</span>"
    } else {
        return '<span class="translated" data-textid="' + a.id + '">' + a.text + "</span>"
    }
}

function getRawTranslation(b) {
    var a = stored_translations[b];
    if (a == undefined) {
        console.warn("UNKNOWN TEXT ID " + b);
        return "UNKNOWN TEXT ID " + b
    } else {
        return stored_translations[b]["text"]
    }
}

function getRawComplexTranslation(d, b) {
    var a = stored_translations[d];
    if (a == undefined) {
        return "UNKNOWN TEXT ID " + d
    } else {
        var d = a.id;
        var c = a.text;
        $.each(b, function(e, f) {
            c = c.replace("<" + e + "/>", escapeHtml(f), "gi")
        });
        return c
    }
}

function getRawComplexTranslation(d, b) {
    var a = stored_translations[d];
    if (a == undefined) {
        return "UNKNOWN TEXT ID " + d
    } else {
        var d = a.id;
        var c = a.text;
        $.each(b, function(e, f) {
            c = c.split("<" + e + "/>").join(escapeHtml(f))
        });
        return c
    }
}

function getComplexTranslation(b, a) {
    return '<span class="translated" data-textid="' + b + '">' + getRawComplexTranslation(b, a) + "</span>"
}

function getRawIndexedComplexTranslation(e, c) {
    var b = stored_translations[e];
    if (b == undefined) {
        return "UNKNOWN TEXT ID " + e
    } else {
        var e = b.id;
        var d = b.text;
        var a = /<\w*?\/>/;
        while (a.test(d) && c.length > 0) {
            d = d.replace(a, c.shift())
        }
        return d
    }
}

function getIndexedComplexTranslation(b, a) {
    return '<span class="translated" data-textid="' + b + '">' + getRawComplexIndexedTranslation(b, a) + "</span>"
}

function escapeHtml(a) {
    return $("<div/>").text(a).html()
}

function unescapeHtml(a) {
    return $("<div>").html(a).text()
}

function showFadeoutMessage(b, e, f) {
    var a = b.find(".setting-saved-message");
    var d = a.find(".setting-saved-message-text");
    a.show();
    d.show();
    d.text(e);
    centerWithinParent(d, "both");
    var c = setTimeout(function() {
        a.fadeOut(1500);
        if (f != undefined) {
            f()
        }
        clearTimeout(c)
    }, 300)
}

function startSpinnerBlock(c, b) {
    var f = {};
    var a = c.find(".setting-saved-message");
    var e = c.find(".setting-saved-spinner");
    var d = 500;
    if (b !== undefined) {
        d = b
    }

    function g() {
        e.attr("style", "visibility: visible");
        centerWithinParent(e, "both");
        var k = 0;
        var h = function() {
            k++;
            e.css("background-position", "0px -" + (38 * (k % 16)) + "px")
        };
        f.spinnerTimeout = setTimeout(function() {
            a.attr("style", "display: block");
            e.show()
        }, d);
        f.spinnerInterval = setInterval(h, 100)
    }
    a.show();
    g();
    return f
}

function stopSpinnerBlock(b, a) {
    clearInterval(a.spinnerInterval);
    clearTimeout(a.spinnerTimeout);
    b.find(".setting-saved-spinner").hide()
}

function hideSpinnerBlock(a) {
    a.find(".setting-saved-message").hide()
}

function navigateTo(a) {
    $.address.value(a);
    closeAllDropdowns();
    reloadContent()
}

function getStoredDeviceStatus(a) {
    return stored_device_status[a]
}

function getNodeName(a) {
    return $(a).closest("[data-node]").attr("data-node")
}

function getNodeData(d, c) {
    var b = undefined;
    if (c === undefined) {
        c = false
    }
    if (stored_nodes[d] === undefined || c) {
        var a = new Communicator();
        a.setAsync(false);
        a.addSuccessHandler(function(f) {
            var e = {};
            e[d] = f.nodes.nodes[d];
            if (e[d] !== undefined) {
                $.extend(true, stored_nodes, e);
                b = stored_nodes[d]
            }
        });
        a.addErrorHandler(function(e) {
            return undefined
        });
        a.sendData(RAW_CONTENT, "GET", undefined, "json", {
            c: d
        })
    } else {
        b = stored_nodes[d]
    }
    return b
}

function getHiddenChildren(c) {
    var b = [];
    var a = new Communicator();
    a.setAsync(false);
    a.addSuccessHandler(function(o) {
        var e = {};
        e[c] = o.nodes.nodes[c];
        if (e[c] !== undefined) {
            var h = e[c].children;
            for (i in h) {
                if (o.nodes.nodes[h[i]] === undefined) {
                    b.push(h[i])
                } else {
                    if (o.nodes.nodes[h[i]].control !== undefined) {
                        var g = o.nodes.nodes[h[i]].control.node;
                        var r = o.nodes.nodes[h[i]].control.value;
                        var f = o.nodes.nodes[h[i]].control.action;
                        if (o.nodes.nodes[g] !== undefined) {
                            if (o.nodes.nodes[g].control !== undefined) {
                                var d = o.nodes.nodes[g].control.node;
                                var q = o.nodes.nodes[g].control.value;
                                var s = o.nodes.nodes[g].control.action;
                                if (o.nodes.nodes[d] !== undefined) {
                                    if (o.nodes.nodes[d].control === undefined) {
                                        var n = o.nodes.nodes[d].setting;
                                        var k = o.nodes.settings[n].val;
                                        l(s, k, q)
                                    }
                                }
                            }
                            var p = o.nodes.nodes[g].setting;
                            var m = o.nodes.settings[p].val;
                            l(f, m, r)
                        }
                    }
                }
            }
        } else {
            return undefined
        }

        function l(v, t, u) {
            if (v == "show") {
                if (t != u) {
                    b.push(h[i])
                }
            } else {
                if (v == "hide") {
                    if (t == u) {
                        b.push(h[i])
                    }
                }
            }
        }
    });
    a.addErrorHandler(function(d) {
        return undefined
    });
    a.sendData(RAW_CONTENT, "GET", undefined, "json", {
        c: c
    });
    return b
}(function(a) {
    a.fn.enable = function() {
        if (this.attr("disabled")) {
            this.fadeTo("fast", 1);
            this.removeAttr("data-control-disabled");
            this.removeAttr("disabled");
            this.find("button,input,textarea,select").removeAttr("disabled");
            this.find(".slider").slider("option", "disabled", false)
        }
    };
    a.fn.disable = function() {
        if (!this.attr("disabled")) {
            this.fadeTo("fast", 0.34);
            this.attr("data-control-disabled", 1);
            this.attr("disabled", "disabled");
            this.find("button,input,textarea,select").attr("disabled", "disabled");
            this.find(".slider").slider("option", "disabled", true)
        }
    }
})(jQuery);
(function() {
    var e;
    var d = function() {};
    var b = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"];
    var c = b.length;
    var a = (window.console = window.console || {});
    while (c--) {
        e = b[c];
        if (!a[e]) {
            a[e] = d
        }
    }
}());
Object.size = function(c) {
    var b = 0,
        a;
    for (a in c) {
        if (c.hasOwnProperty(a)) {
            b++
        }
    }
    return b
};

function sortByPriorityThenId(a) {
    a.sort(function(d, c) {
        if (d.priority == c.priority) {
            return parseInt(c.id) - parseInt(d.id)
        } else {
            if (d.priority == undefined) {
                return -1
            } else {
                if (c.priority == undefined) {
                    return 1
                }
            }
            return parseInt(d.priority) - parseInt(c.priority)
        }
    });
    return a
}

function getSessionKey() {
    var a = "";
    if (hasSession()) {
        var b = getSession();
        a = b.sessionKey
    }
    return a
}

function validateExistingSession(a) {
    if (a.nodes && a.nodes.guestSession && hasSession()) {
        $("body").popup({
            messageText: getRawTranslation("TXT_SESSION_EXPIRED"),
            buttonOneId: "TXT_OK",
            buttonOneCallback: function() {
                location.reload()
            }
        });
        clearSession()
    }
};