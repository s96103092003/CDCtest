(function () {
    function c(o, a, s) {
        function l(n, e) {
            if (!a[n]) {
                if (!o[n]) {
                    var t = "function" == typeof require && require;
                    if (!e && t) return t(n, !0);
                    if (u) return u(n, !0);
                    var i = new Error("Cannot find module '" + n + "'");
                    throw i.code = "MODULE_NOT_FOUND", i
                }
                var r = a[n] = {
                    exports: {}
                };
                o[n][0].call(r.exports, function (e) {
                    var t = o[n][1][e];
                    return l(t || e)
                }, r, r.exports, c, o, a, s)
            }
            return a[n].exports
        }
        for (var u = "function" == typeof require && require, e = 0; e < s.length; e++) l(s[e]);
        return l
    }
    return c
})()({
    1: [function (e, t, n) {
        "use strict";
        var i = {
            PAGE_VIEW: "Page View",
            ON_BOARDING: {
                FINISHED_SET_PLUGIN: "OB Set Plugin",
                FINISHED_INSTALL_CODE: "OB Install Plugin",
                FINISHED_INTEGRATE_CHANNEL: "OB Integrate Channel",
                FINISHED_Q1: "OB Question 1",
                FINISHED_Q2: "OB Question 2",
                FINISHED_Q3: "OB Question 3",
                FINISHED_Q4: "OB Question 4",
                INTEGRATE_LINE: "OB Integrate LINE",
                INTEGRATE_FACEBOOK: "OB Integrate Facebook"
            },
            BROADCAST: {
                FACEBOOK_BROADCAST: "Facebook Broadcast",
                LINE_BROADCAST: "LINE Broadcast",
                WHATSAPP_BROADCAST: "Whatsapp Broadcast"
            },
            BOT: {
                FB_BOT_DEPLOY: "FB Bot Deploy",
                LINE_BOT_DEPLOY: "LINE Bot Deploy",
                WEB_BOT_DEPLOY: "Web Bot Deploy"
            },
            REMARKETING: {
                REMARKETING_CREATE: "Remarketing Create",
                REMARKETING_EDIT: "Remarketing Edit"
            },
            SOCIAL_SUBSCRIBER: {
                GENERAL_SUBSCRIBER: "General Subscriber",
                GENERAL_SUBSCRIBER_ON: "General Subscriber On"
            },
            FB_COMMENT_REPLY: "FB Comment Reply Create",
            KEY_AUTO_REPLY: "Key Auto Reply Create",
            KEY_AUTO_ASSIGN: "Key Auto Assign Create",
            TEAMMATE_ADD: "Teammate Invite",
            CHANNEL_INTEGRATE: {
                FACEBOOK_INTEGRATE: "Facebook Integrate",
                LINE_INTEGRATE: "LINE Integrate"
            },
            PRICING_PLAN: {
                CONTACT_BAR_SCROLL: "Contact Bar Scroll",
                PRICING_PLAN_SELECT: "Pricing Plan Select",
                PRICING_PLAN_CHANGE: "Pricing Plan Change"
            },
            ON_SALE_CTA_CLICK: "On Sale Button Click"
        };
        t.exports = i
    }, {}],
    2: [function (e, t, n) {
        "use strict";
        var i = e("exif-js");
        e("appconfig");
        var r = new AppConfig;
        var o = r.restApiHost;
        var u = e("./http-functions");
        var a = $;
        t.exports = {
            authenticate: function e() {
                var t = "/restapi/v1/admin/login/admin-authenticate";
                u.postRequest(t, {}, function (e, t, n) {
                    if (e) {
                        $(document).trigger("authenticateDidSuccess", n);
                        $(document).trigger("userDataDidUpdate", n)
                    } else {
                        $(document).trigger("authenticateDidFail", n)
                    }
                })
            },
            authenticateWithCallBack: function e(t) {
                var n = "/restapi/v1/admin/login/admin-authenticate";
                u.postRequest(n, false, t)
            },
            putUpdateUserPhone: function e(t, n) {
                var i = "/restapi/v1/admin/users/update-login-phone";
                u.putRequest(i, {
                    phone: t
                }, n)
            },
            logout: function e() {
                var t = "/restapi/v1/admin/login/logout";
                u.postRequest(t, false, function (e, t, n) {
                    if (e) {
                        $(document).trigger("accountLogoutDidSuccess", n)
                    } else {
                        $(document).trigger("accountLogoutDidFail", [t, "accountLogin fail"])
                    }
                })
            },
            resizePhotoToStandard: function e(c, f) {
                if (c.type.match(/image.*/)) {
                    var t = new FileReader;
                    t.onload = function (e) {
                        var u = new Image;
                        u.onload = function (e) {
                            i.getData(this, function () {
                                var e = document.createElement("canvas"),
                                    t = 1e3,
                                    n = u.width,
                                    i = u.height;
                                var r = e.getContext("2d");
                                if (n > i) {
                                    if (n > t) {
                                        i *= t / n;
                                        n = t
                                    }
                                } else {
                                    if (i > t) {
                                        n *= t / i;
                                        i = t
                                    }
                                }
                                e.width = n;
                                e.height = i;
                                var o = this.exifdata.Orientation;
                                var a = e.style.width;
                                var s = e.style.height;
                                if (o) {
                                    if (o > 4) {
                                        e.width = i;
                                        e.style.width = s;
                                        e.height = n;
                                        e.style.height = a
                                    }
                                    switch (o) {
                                        case 2:
                                            r.translate(n, 0);
                                            r.scale(-1, 1);
                                            break;
                                        case 3:
                                            r.translate(n, i);
                                            r.rotate(Math.PI);
                                            break;
                                        case 4:
                                            r.translate(0, i);
                                            r.scale(1, -1);
                                            break;
                                        case 5:
                                            r.rotate(.5 * Math.PI);
                                            r.scale(1, -1);
                                            break;
                                        case 6:
                                            r.rotate(.5 * Math.PI);
                                            r.translate(0, -i);
                                            break;
                                        case 7:
                                            r.rotate(.5 * Math.PI);
                                            r.translate(n, -i);
                                            r.scale(-1, 1);
                                            break;
                                        case 8:
                                            r.rotate(-.5 * Math.PI);
                                            r.translate(-n, 0);
                                            break
                                    }
                                }
                                r.drawImage(u, 0, 0, n, i);
                                var l = e.toDataURL(c.type);
                                f(e, l, e.width, e.height)
                            })
                        };
                        u.src = e.target.result
                    };
                    t.readAsDataURL(c)
                }
            },
            postProfile: function e(t, n, r) {
                var i = new FormData;
                i.append("photo", t);
                i.append("team-or-user", n);
                a.ajax({
                    url: "".concat(o, "/restapi/v1/admin/upload/profile"),
                    type: "POST",
                    data: i,
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    cache: false,
                    processData: false,
                    mimeType: "multipart/form-data",
                    success: function e(t, n, i) {
                        r(true, n, t)
                    },
                    error: function e(t, n) {
                        r(false, n, null)
                    }
                })
            },
            putUpdateUserFullName: function e(t, n) {
                var i = "/restapi/v1/admin/users/updateFullname";
                var r = {
                    name: t
                };
                u.putRequest(i, r, n)
            },
            putUpdateUserEmail: function e(t, n) {
                var i = "/restapi/v1/admin/users/login-email";
                u.putRequest(i, {
                    email: t
                }, n)
            },
            radicaLogin: function e(t, n) {
                var i = {
                    otp: t
                };
                var r = "/restapi/v1/admin/login/radica-login";
                u.postRequest(r, i, n)
            },
            getTeamByVerificationCode: function e(t, n) {
                var i = "/restapi/v1/admin/login/get-teams";
                u.postRequest(i, t, n)
            },
            postEmailAuthV2: function e(t, n) {
                var i = "/restapi/v1/admin/login/email-auth";
                u.postRequest(i, t, n)
            },
            postPhoneAuth: function e(t, n) {
                var i = "/restapi/v1/admin/login/phone-auth";
                u.postRequest(i, t, n)
            },
            postEmailLoginV2: function e(t, n) {
                var i = "/restapi/v1/admin/login/email-login";
                u.postRequest(i, t, n)
            },
            postPhoneLogin: function e(t, n) {
                var i = "/restapi/v1/admin/login/phone-login";
                u.postRequest(i, t, n)
            },
            getAllTeamMembers: function e(i) {
                var t = "/restapi/v1/admin/team/client/members";
                u.getRequest(t, false, function (e, t, n) {
                    if (e) {
                        if (i) {
                            i(true, t, n)
                        } else {
                            console.log(n);
                            $(document).trigger("getAllTeamMembersDidFinished", new Array(n))
                        }
                    } else {}
                })
            },
            getAllPlatformChannels: function e(t) {
                var n = "/restapi/v1/admin/platform/channels";
                u.getRequest(n, false, t)
            },
            postPhoto: function e(t, n, r) {
                var i = new FormData;
                i.append("photo", t);
                i.append("team", n);
                a.ajax({
                    url: "".concat(o, "/restapi/v1/admin/upload/photo"),
                    type: "POST",
                    data: i,
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    cache: false,
                    processData: false,
                    mimeType: "multipart/form-data",
                    success: function e(t, n, i) {
                        r(true, n, t)
                    },
                    error: function e(t, n) {
                        r(false, n, null)
                    }
                })
            },
            getAllChatbots: function e(t, n) {
                var i = "/restapi/v1/admin/chatbot/get-all";
                u.getRequest(i, {
                    platform: t
                }, n)
            },
            getMessageBlocks: function e(t, n) {
                var i = "/restapi/v1/admin/chatbot/messageblocks/".concat(t);
                u.getRequest(i, false, n)
            },
            getMessageBlock: function e(t, n) {
                var i = "/restapi/v1/admin/chatbot/messageblock/".concat(t);
                u.getRequest(i, false, n)
            },
            getCustomTagsApiUrl: function e() {
                return "".concat(o, "/restapi/v1/admin/custom_tags")
            },
            checkIsFeatureEnabled: function e(t, n) {
                var i = "/restapi/v1/admin/subscription/plan-details/".concat(t);
                u.getRequest(i, false, n)
            },
            putUpdateTeamDomain: function e(t, n) {
                var i = "/restapi/v1/admin/team/update-team-domain";
                u.putRequest(i, {
                    domain: t
                }, n)
            },
            getTeamDomain: function e(r) {
                a.ajax({
                    method: "GET",
                    contentType: "application/json;charset=utf-8",
                    crossDomain: true,
                    url: "".concat(o, "/restapi/v1/admin/team/team-domain"),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function e(t, n, i) {
                        if (r) {
                            r(true, n, t)
                        } else {
                            a(document).trigger("getTeamDomainDidFinished", t)
                        }
                    },
                    error: function e(t, n) {}
                })
            },
            getTeamCard: function e(t) {
                var n = "/restapi/v1/admin/subscription/card";
                u.getRequest(n, false, t)
            },
            getAllProducts: function e(t, n) {
                var i = "/restapi/v1/admin/subscription/products/".concat(t);
                u.getRequest(i, false, n)
            },
            getTeamSubscription: function e(t) {
                var n = "/restapi/v1/admin/subscription/subscription";
                u.getRequest(n, false, t)
            },
            getContactAndRemarketingMsgCount: function e(t) {
                var n = "/restapi/v1/admin/subscription/contact-remarket-msg-count";
                u.getRequest(n, false, t)
            },
            postFacebookLoginAccess: function e(t, n, i) {
                var r = "/restapi/v1/admin/facebook/access";
                var o = {
                    userID: t,
                    accessToken: n
                };
                u.postRequest(r, o, i)
            },
            getFacebookGraphApiMyPagesV2: function e(t, n) {
                var i = "/restapi/v1/admin/facebook/pages";
                u.getRequest(i, {
                    accessToken: t
                }, n)
            },
            postFacebookSubscribePageV2: function e(t, n) {
                var i = "/restapi/v1/admin/facebook/pages/".concat(t, "/subscribed_apps");
                u.postRequest(i, false, n)
            },
            postFacebookBotSetDefaultSettingV2: function e(t, n) {
                var i = "/restapi/v1/admin/facebook/pages/".concat(t, "/default_bot_settings");
                u.postRequest(i, false, n)
            },
            postSetPersistanceMenu: function e(t, n, i) {
                var r = "/restapi/v1/admin/facebook/set-persistance-menu";
                var o = {
                    page_name: t,
                    page_access_token: n
                };
                u.postRequest(r, o, i)
            },
            deleteUnSubscribePage: function e(t, n) {
                var i = "/restapi/v1/admin/facebook/unsubscribe-page";
                var r = {
                    pageId: t
                };
                u.postRequest(i, r, n)
            },
            addOrupdateLineIntegratedChannels: function e(t, n) {
                var i = "/restapi/v1/admin/line/add-or-update-integrated-channels";
                u.postRequest(i, t, n)
            },
            markOnboardingComplete: function e(t) {
                var n = "/restapi/v1/admin/on-board/complete";
                u.putRequest(n, {}, t)
            },
            onBoardingSetChatPlugin: function e(t, n) {
                var i = "/restapi/v1/admin/registration/plugin-setting";
                u.postRequest(i, t, n)
            },
            postQuestionResult: function e(t, n) {
                var i = "/restapi/v1/admin/on-board/survey";
                u.postRequest(i, t, n)
            },
            postSubscribePage: function e(t, n, i, r, o, a) {
                var s = "/restapi/v1/admin/facebook/subscribe-page";
                var l = {
                    page_id: t,
                    page_name: n,
                    page_admin_username: i,
                    page_access_token: r,
                    profile_path: o
                };
                u.postRequest(s, l, a)
            },
            postCreateTeamByEmailV2: function e(t, n) {
                var i = "/restapi/v1/admin/registration/createteam";
                u.postRequest(i, t, n)
            },
            getFacebookIntegratedPages: function e(t) {
                var n = "/restapi/v1/admin/facebook/integrated-pages";
                u.getRequest(n, false, t)
            },
            getLineIntegratedChannels: function e(t) {
                var n = "/restapi/v1/admin/line/integrated-channels";
                u.getRequest(n, false, t)
            },
            getFacebookCommentReplyCampaign: function e(t, n) {
                var i = "/restapi/v1/admin/facebook/comment-reply/campaign";
                u.getRequest(i, t, n)
            },
            getAutoreplyGroups: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/groups";
                u.getRequest(i, {
                    type: t
                }, n)
            },
            postSearchMessageBlockById: function e(t, n) {
                var i = "/restapi/v1/admin/chatbot/messageblocks/search";
                u.postRequest(i, t, n)
            },
            getAutoreplyRules: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/groups/".concat(t, "/rules");
                u.getRequest(i, false, n)
            },
            postCloneKeywordAutoreplyGroup: function e(t, n, i) {
                var r = "/restapi/v1/admin/auto_reply/groups/" + t + "/clone";
                u.postRequest(r, n, i)
            },
            putUpdateKeywordAutoreplyGroup: function e(t, n, i) {
                var r = "/restapi/v1/admin/auto_reply/groups/" + t;
                u.putRequest(r, n, i)
            },
            postCreateAutoreplyGroup: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/groups";
                u.postRequest(i, t, n)
            },
            putUpdateAutoreplyRule: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/rules/".concat(t.ruleId);
                delete t.ruleId;
                u.putRequest(i, t, n)
            },
            postCreateAutoreplyRule: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/rules";
                u.postRequest(i, t, n)
            },
            deleteAutoreplyGroup: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/groups/".concat(t);
                u.deleteRequest(i, false, n)
            },
            getAutoreplyRuleDetail: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/rules/".concat(t);
                u.getRequest(i, false, n)
            },
            deleteAutoreplyRule: function e(t, n) {
                var i = "/restapi/v1/admin/auto_reply/rules/".concat(t);
                u.deleteRequest(i, false, n)
            },
            getIntegratedWidgets: function e(t, n) {
                var i = "/restapi/v1/admin/subscription/optin-plugin/setting/".concat(encodeURI(t.teamName));
                u.getRequest(i, false, n)
            },
            setSocialWidgetSetting: function e(t, n) {
                var i = "/restapi/v1/admin/subscription/optin-plugin/setting";
                u.postRequest(i, t, n)
            },
            getAllShopLocations: function e(t) {
                var n = "/restapi/v1/admin/team/shop-locations";
                u.getRequest(n, false, t)
            }
        }
    }, {
        "./http-functions": 3,
        appconfig: 7,
        "exif-js": 14
    }],
    3: [function (e, t, n) {
        "use strict";
        e("appconfig");
        var i = new AppConfig;
        var a = i.restApiHost;
        var s = $;
        t.exports = {
            getRequest: function e(t, n, i) {
                this.callApi("GET", t, n, i)
            },
            postRequest: function e(t, n, i) {
                this.callApi("POST", t, n, i)
            },
            putRequest: function e(t, n, i) {
                this.callApi("PUT", t, n, i)
            },
            deleteRequest: function e(t, n, i) {
                this.callApi("DELETE", t, n, i)
            },
            callApi: function e(t, n, i, r) {
                var o = {
                    method: t,
                    contentType: "application/json;charset=utf-8",
                    crossDomain: true,
                    url: a + n,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function e(t, n, i) {
                        r(true, n, t)
                    },
                    error: function e(t, n) {
                        r(false, n, t)
                    }
                };
                if (i) {
                    if (t === "GET") {
                        o.data = i
                    } else if (t === "DELETE") {
                        o.url += "?" + $.param(i)
                    } else {
                        o.data = JSON.stringify(i)
                    }
                }
                s.ajax(o)
            }
        }
    }, {
        appconfig: 7
    }],
    4: [function (e, t, n) {
        "use strict";
        var u = e("./http-functions");
        var i = $;
        t.exports = {
            updateSubscribeFacebookPageAdmin: function e(t, n, i) {
                var r = "/restapi/v1/admin/facebook/update-subscribe-page-admin";
                var o = {
                    pageId: t,
                    adminUsername: n
                };
                u.putRequest(r, o, i)
            },
            putUpdateSubscribeChannelAdminUser: function e(t, n, i) {
                var r = "/restapi/v1/admin/line/update-subscribe-channel-admin";
                var o = {
                    channelId: t,
                    adminUsername: n
                };
                u.putRequest(r, o, i)
            },
            deleteUnSubscribeChannel: function e(t, n) {
                var i = "/restapi/v1/admin/line/unsubscribe-channel";
                var r = {
                    channel_id: t
                };
                u.postRequest(i, r, n)
            },
            deleteFacebookGraphApiSubscribePageV2: function e(t, n) {
                var i = "/restapi/v1/admin/facebook/pages/" + t + "/subscribed_apps";
                u.deleteRequest(i, false, n)
            },
            getValidTeamMembers: function e() {
                var t = "/restapi/v1/admin/team/teammates";
                u.getRequest(t, null, function (e, t, n) {
                    if (e) {
                        i(document).trigger("getValidTeamMembersDidFinished", new Array(n))
                    }
                })
            },
            getIntegratedInstagramAccounts: function e(t) {
                var n = "/restapi/v1/admin/instagram/integrated-accounts";
                u.getRequest(n, false, t)
            },
            getInstagramAvailableAccounts: function e(t, n) {
                var i = "/restapi/v1/admin/instagram/available-accounts";
                u.getRequest(i, {
                    accessToken: t
                }, n)
            },
            putUpdateInstagramFollowupTeammate: function e(t, n, i) {
                var r = "/restapi/v1/admin/instagram/accounts/" + t + "/actions/followup-teammate";
                u.putRequest(r, {
                    username: n
                }, i)
            },
            postConnectInstagramAccount: function e(t, n, i, r, o, a) {
                var s = {
                    id: t,
                    name: n,
                    adminUsername: i,
                    accessToken: r,
                    profilePic: o
                };
                var l = "/restapi/v1/admin/instagram/accounts";
                u.postRequest(l, s, a)
            },
            deleteInstagramAccount: function e(t, n) {
                var i = "/restapi/v1/admin/instagram/accounts/" + t;
                u.deleteRequest(i, false, n)
            }
        }
    }, {
        "./http-functions": 3
    }],
    5: [function (e, t, n) {
        "use strict";
        var i = e("exif-js");
        var r = e("jwt-decode");
        var o = e("js-cookie");
        var c = e("i18next");
        var a = e("i18next-xhr-backend");
        var s = e("clipboard");
        e("bootstrap-colorpicker");
        e("bootstrap-tagsinput");
        var f = e("../restapi/common");
        var l = e("../restapi/integration");
        var u = e("../helpers/mixpanelEvents");
        var p = null;
        var d = null;
        var h = [];
        var g = {};
        var g = {};
        var m = {};
        var v = {};
        var _ = {};
        var y = {};
        var b = {};
        var x = null;
        var w = false;
        var E = null;
        var k = false;
        var S = null;
        var T = null;
        var N = "Trial expired in";
        var A = 1e3;
        var C = 1e3;
        var O = false;

        function I() {
            var e = window.navigator.userAgent;
            var t = e.indexOf("MSIE ");
            if (t > 0) {
                return parseInt(e.substring(t + 5, e.indexOf(".", t)), 10)
            }
            var n = e.indexOf("Trident/");
            if (n > 0) {
                var i = e.indexOf("rv:");
                return parseInt(e.substring(i + 3, e.indexOf(".", i)), 10)
            }
            var r = e.indexOf("Edge/");
            if (r > 0) {
                return parseInt(e.substring(r + 5, e.indexOf(".", r)), 10)
            }
            return false
        }
        if (o.get("app_lang") != null) {
            p = o.get("app_lang")
        } else {
            if (I() == false) {
                var R = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
                if (R.includes("en")) {
                    p = "en"
                } else if (R.includes("zh")) {
                    p = "zh-Hant"
                } else {
                    p = "zh-Hant"
                }
            } else {
                p = "zh-Hant"
            }
        }
        e("appconfig");
        var P = new AppConfig;
        var L = e("mixpanel-browser");
        L.init(P.mixpanelToken);
        var D = null;
        var M = "#000000";
        var j = null;
        var F = "en";
        var H = "";
        var U = false;
        var q = "";
        var B = null;
        var G = null;
        var W = null;
        var Y = new s(".clipboard-btn");

        function V() {
            if (U == true) {
                $("#enable-sso-signin").addClass("btn-primary");
                $("#enable-sso-signin").removeClass("btn-default");
                $("#disable-sso-signin").addClass("btn-default");
                $("#disable-sso-signin").removeClass("btn-primary")
            }
        }

        function K() {
            q = "\x3c!-- Start of Easychat code --\x3e\n<script>\n";
            q = q + "var easychat_sso_key = '" + G + "'" + "\n";
            q = q + "var easychat_user_email = 'YOUR-USER-EMAIL-ADDRESS'" + "\n";
            q = q + "var easychat_user_phone = 'YOUR-USER-PHONE-NO'" + "\n";
            q = q + "var a=document.createElement('a');a.setAttribute('href','javascript:;');a.setAttribute('id','easychat-floating-button');var img=document.createElement('img');img.src='" + P.chatPluginIconPath + "';a.appendChild(img);var span=document.createElement('span');span.setAttribute('id','easychat-unread-badge');span.setAttribute('style','display: none');var d1=document.createElement('div');d1.setAttribute('id','easychat-close-btn');d1.setAttribute('class','easychat-close-btn-close');var d2=document.createElement('div');d2.setAttribute('id','easychat-chat-dialog');d2.setAttribute('class','easychat-chat-dialog-close');var ifrm=document.createElement('iframe');ifrm.setAttribute('id','easychat-chat-dialog-iframe');ifrm.setAttribute('src','" + P.chatPluginURL + "appkey=" + H + "&color=" + M + "&lang=" + F + "&ssokey='+" + "easychat_sso_key" + "+'&email='+" + "easychat_user_email" + "+'&phone='+" + "easychat_user_phone" + ');ifrm.style.width="100%";ifrm.style.height="100%";ifrm.style.frameborder="0";ifrm.style.scrolling="on";d2.appendChild(ifrm);document.body.appendChild(a);document.body.appendChild(span);document.body.appendChild(d1);document.body.appendChild(d2);<\/script><script src=' + '"' + P.chatPluginJSPath + '"' + "><\/script>\n";
            q = q + "\x3c!-- End of Easychat code --\x3e";
            $("#js-code").val(q)
        }
        Y.on("success", function (e) {
            if (B == null || B == "") {
                e.preventDefault();
                bootbox.alert(c.t("PLEASE_INPUT_YOUR_WEBSITE_ADDRESS_IN_INSTALL_PAGE_BEFORE_ADD_TO_WEBSITE"));
                return
            } else if (U == false) {
                e.preventDefault();
                bootbox.alert(c.t("PLEASE_ENABLE_SSO_BEFORE_COPY_THE_CODE"));
                return
            }
            e.clearSelection()
        });
        Y.on("error", function (e) {
            console.error("Action:", e.action);
            console.error("Trigger:", e.trigger)
        });

        function z(i) {
            f.getFacebookIntegratedPages(function (e, t, n) {
                if (e == true) {
                    $(".fb-interated-page-table-body").empty();
                    $.each(n, function (e, n) {
                        var t = '<img src="' + n.profile_path + '" class="avatar" alt="Avatar">';
                        var i = '<button type="button" class="btn btn-danger btn-sm lang-disconnect disconnect-fb-page-btn" data-id="' + n.page_id + '">' + c.t("DISCONNECT") + "</button>";
                        var r = 0;
                        var o = null;
                        o = '<option value="00000000-0000-0000-0000-000000000000">' + c.t("ALL") + "</option>";
                        $.each(h, function (e, t) {
                            o = o + '<option value="' + t.username + '">' + t.name + "</option>";
                            if (t.username === n.page_admin_username) {
                                r = e
                            }
                        });
                        var a = '<select class="select2_single form-control fb-interated-page-follow-up-teammate" tabindex="' + r + '" data-id=' + n.page_id + ">";
                        var s = "</select>";
                        var l = a + o + s;
                        $(".fb-interated-page-table-body").append("<tr>" + "<td>" + t + "</td>" + "<td>" + n.page_id + "</td>" + "<td>" + n.page_name + "</td>" + "<td>" + l + "</td>" + "<td>" + i + "</td>" + "</tr>");
                        $(".fb-interated-page-follow-up-teammate[data-id='" + n.page_id + "']").val(n.page_admin_username);
                        m[n.page_id] = n
                    });
                    $("#fb-interated-page-table").show();
                    $(".fb-interated-page-follow-up-teammate").on("change", function () {
                        var e = $(this).data("id");
                        l.updateSubscribeFacebookPageAdmin(e, this.value, function (e, t, n) {
                            if (e == false) {} else {}
                        })
                    })
                }
                if (i) {
                    J()
                }
            })
        }

        function X(e) {
            l.getIntegratedInstagramAccounts(function (e, t, n) {
                if (e == true) {
                    $(".ig-integrated-acc-table-body").empty();
                    $.each(n.data, function (e, n) {
                        var t = "";
                        if (n.profile_path) {
                            t = '<img src="' + n.profile_path + '" class="avatar" alt="Avatar">'
                        }
                        var i = '<button type="button" class="btn btn-danger btn-sm lang-disconnect disconnect-ig-acc-btn" data-id="' + n.ig_id + '">' + c.t("DISCONNECT") + "</button>";
                        var r = 0;
                        var o = null;
                        o = '<option value="00000000-0000-0000-0000-000000000000">' + c.t("ALL") + "</option>";
                        $.each(h, function (e, t) {
                            o = o + '<option value="' + t.username + '">' + t.name + "</option>";
                            if (t.username === n.business_admin_username) {
                                r = e
                            }
                        });
                        var a = '<select class="select2_single form-control ig-integrated-acc-follow-up-teammate" tabindex="' + r + '" data-id=' + n.ig_id + ">";
                        var s = "</select>";
                        var l = a + o + s;
                        $(".ig-integrated-acc-table-body").append("<tr>" + "<td>" + t + "</td>" + "<td>" + n.ig_id + "</td>" + "<td>" + n.business_name + "</td>" + "<td>" + l + "</td>" + "<td>" + i + "</td>" + "</tr>");
                        $(".ig-integrated-acc-follow-up-teammate[data-id='" + n.ig_id + "']").val(n.business_admin_username);
                        _[n.ig_id] = n
                    });
                    $("#ig-integrated-acc-table").show();
                    $(".ig-integrated-acc-follow-up-teammate").on("change", function () {
                        var e = $(this).data("id");
                        l.putUpdateInstagramFollowupTeammate(e, this.value, function (e, t, n) {
                            if (e == false) {} else {}
                        })
                    })
                }
            });
            if (e) {
                Q()
            }
        }

        function J() {
            if (W != null) {
                f.getFacebookGraphApiMyPagesV2(W, function (e, t, n) {
                    if (e == true) {
                        $(".fb-available-page-table-body").empty();
                        $.each(n.data, function (e, t) {
                            if (m[t.id] == null) {
                                var n = null;
                                var i = '<button type="button" class="btn btn-success btn-sm lang-connect connect-fb-page-btn" data-id="' + t.id + '">' + c.t("CONNECT") + "</button>";
                                if (t.picture != null) {
                                    n = '<img src="' + t.picture.data.url + '" class="avatar" alt="Avatar">'
                                }
                                var r = 0;
                                var o = null;
                                o = '<option value="00000000-0000-0000-0000-000000000000">' + c.t("ALL") + "</option>";
                                $.each(h, function (e, t) {
                                    o = o + '<option value="' + t.username + '">' + t.name + "</option>";
                                    if (t.username === d) {
                                        r = e
                                    }
                                });
                                var a = '<select class="select2_single form-control fb-available-page-follow-up-teammate" tabindex="' + r + '" data-id = ' + t.id + ">";
                                var s = "</select>";
                                var l = a + o + s;
                                $(".fb-available-page-table-body").append("<tr>" + "<td>" + n + "</td>" + "<td>" + t.id + "</td>" + "<td>" + t.name + "</td>" + "<td>" + l + "</td>" + "<td>" + i + "</td>" + "</tr>");
                                $(".fb-available-page-follow-up-teammate[data-id='" + t.id + "']").val("00000000-0000-0000-0000-000000000000");
                                v[t.id] = t
                            }
                        });
                        $(".fb-available-page-follow-up-teammate").on("change", function () {
                            var e = $(this).data("id");
                            var t = v[e];
                            if (t != null) {
                                t.page_admin_username = this.value;
                                v[e] = t
                            }
                        })
                    }
                    $("#fb-available-page-table").show()
                })
            }
        }

        function Q() {
            if (W != null) {
                l.getInstagramAvailableAccounts(W, function (e, t, n) {
                    if (e == true) {
                        $(".ig-available-acc-table-body").empty();
                        $.each(n.data, function (e, t) {
                            if (_[t.id] == null) {
                                var n = null;
                                var i = '<button type="button" class="btn btn-success btn-sm lang-connect connect-ig-acc-btn" data-id="' + t.id + '">' + c.t("CONNECT") + "</button>";
                                if (t.profilePic != null) {
                                    n = '<img src="' + t.profilePic + '" class="avatar" alt="Avatar">'
                                }
                                var r = 0;
                                var o = null;
                                o = '<option value="00000000-0000-0000-0000-000000000000">' + c.t("ALL") + "</option>";
                                $.each(h, function (e, t) {
                                    o = o + '<option value="' + t.username + '">' + t.name + "</option>";
                                    if (t.username === d) {
                                        r = e
                                    }
                                });
                                var a = '<select class="select2_single form-control ig-available-acc-follow-up-teammate" tabindex="' + r + '" data-id = ' + t.id + ">";
                                var s = "</select>";
                                var l = a + o + s;
                                var u = t.name + " (" + t.username + ")";
                                $(".ig-available-acc-table-body").append("<tr>" + "<td>" + n + "</td>" + "<td>" + t.id + "</td>" + "<td>" + u + "</td>" + "<td>" + t.linkedPageName + "</td>" + "<td>" + l + "</td>" + "<td>" + i + "</td>" + "</tr>");
                                $(".ig-available-acc-follow-up-teammate[data-id='" + t.id + "']").val("00000000-0000-0000-0000-000000000000");
                                y[t.id] = t
                            }
                        });
                        $(".ig-available-acc-follow-up-teammate").on("change", function () {
                            var e = $(this).data("id");
                            var t = y[e];
                            if (t != null) {
                                t.adminUsername = this.value;
                                y[e] = t
                            }
                        })
                    }
                    $("#ig-available-acc-table").show()
                })
            }
        }

        function Z() {
            if (k == true) {
                return
            }
            f.getLineIntegratedChannels(function (e, t, n) {
                if (e == true) {
                    $(".line-interated-page-table-body").empty();
                    if (n.length > 0) {
                        $.each(n, function (e, n) {
                            var t = '<button type="button" class="btn btn-primary btn-sm lang-edit edit-line-channel-btn" data-id="' + n.channel_id + '">' + c.t("EDIT") + "</button>";
                            var i = '<button type="button" class="btn btn-danger btn-sm lang-disconnect disconnect-line-channel-btn" data-id="' + n.channel_id + '">' + c.t("DISCONNECT") + "</button>";
                            var r = '<button type="button" class="btn btn-success btn-sm lang-webhook webhook-line-channel-btn" data-id="' + n.channel_id + '">' + c.t("WEBHOOK") + "</button>";
                            var o = 0;
                            var a = null;
                            a = '<option value="00000000-0000-0000-0000-000000000000">' + c.t("ALL") + "</option>";
                            $.each(h, function (e, t) {
                                a = a + '<option value="' + t.username + '">' + t.name + "</option>";
                                if (t.username === n.channel_admin_username) {
                                    T = n.channel_admin_username;
                                    o = e
                                }
                            });
                            var s = '<select class="select2_single form-control line-interated-channel-follow-up-teammate" tabindex="' + o + '" data-id=' + n.channel_id + ">";
                            var l = "</select>";
                            var u = s + a + l;
                            $(".line-interated-page-table-body").append("<tr>" + "<td>" + '<input type="text" required="required" class="line-app-name form-control col-md-2 col-xs-12" data-id="' + n.channel_id + '" + value="' + n.channel_name + '">' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-id form-control col-md-2 col-xs-12" readonly data-id="' + n.channel_id + '" + value="' + n.channel_id + '">' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-secret form-control col-md-2 col-xs-12" data-id="' + n.channel_id + '" + value="' + n.channel_secret + '">' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-access-token form-control col-md-2 col-xs-12" data-id="' + n.channel_id + '" + value="' + n.channel_access_token + '">' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-oa-id form-control col-md-2 col-xs-12" data-id="' + n.channel_id + '" + value="' + (n.oa_id || "") + '">' + "</td>" + "<td>" + u + "</td>" + '<td class="table-inline-group">' + t + i + r + "</td>" + "</tr>");
                            $(".line-interated-channel-follow-up-teammate[data-id='" + n.channel_id + "']").val(n.channel_admin_username);
                            b[n.channel_id] = n
                        })
                    }
                }
            })
        }

        function ee(e) {
            if (e.status === "connected") {
                if (e.authResponse.accessToken != null && e.authResponse.userID != null) {
                    f.postFacebookLoginAccess(e.authResponse.userID, e.authResponse.accessToken, function (e, t, n) {
                        if (e == false) {
                            if (t == 403) {
                                bootbox.alert(c.t("SEND_TO_FACEBOOK_MESSENGER_EXPIRED_TRIAL"))
                            } else {
                                bootbox.alert(c.t("FACEBOOK_LOGIN_ACCESS_EASYCHAT_SERVER_ERROR") + " (Code: 1003)")
                            }
                        } else {
                            W = n.long_lived_access_token
                        }
                    })
                }
            } else {}
        }

        function te() {
            FB.getLoginStatus(function (e) {
                ee(e)
            })
        }
        $(document).ready(function () {
            $("#install-page").addClass("active");
            $("#install-page ul.child_menu").css("display", "block");
            $(".menu-integration").addClass("active");
            $("#connect-your-fb-acc").show();
            $("#disconnect-your-fb-acc").hide();
            $("#fb-interated-page-table").hide();
            $("#fb-available-page-table").hide();
            $("#connect-your-ig-acc").show();
            $("#ig-integrated-acc-table").hide();
            $("#ig-available-acc-table").hide();
            $("#fb-feature-expired").hide();
            $("#delete-line-channal").hide();
            $("#line-webhook-url").hide();
            $("#line-feature-expired").hide();
            $(".lang-input-line-channel-copy-webhook-url").hide();
            $("#add-new-line-channel").hide();
            $("#fb-feature-expired").click(function (e) {
                e.preventDefault();
                window.location.href = "pricing.html"
            });
            $("#line-feature-expired").click(function (e) {
                e.preventDefault();
                window.location.href = "pricing.html"
            });
            $(".line-interated-channel-follow-up-teammate").on("change", function () {
                T = this.value;
                var e = $(this).data("id");
                if (e != "new_line_channel") {
                    l.putUpdateSubscribeChannelAdminUser(e, this.value, function (e, t, n) {
                        if (e == false) {} else {}
                    })
                }
            });
            $(document).on("click", "#add-new-line-channel", function () {
                $("#add-new-line-channel").hide();
                var e = '<button type="button" class="btn btn-primary btn-sm lang-add-new" id="add-line-channel-btn" data-id="new_line_channel">' + c.t("ADD_NEW") + "</button>";
                var n = 0;
                var i = null;
                i = '<option value="00000000-0000-0000-0000-000000000000">' + c.t("ALL") + "</option>";
                $.each(h, function (e, t) {
                    i = i + '<option value="' + t.username + '">' + t.name + "</option>";
                    if (t.username === d) {
                        n = e
                    }
                });
                var t = '<select class="select2_single form-control line-interated-channel-follow-up-teammate" tabindex="' + n + '" data-id="new_line_channel"' + ">";
                var r = "</select>";
                var o = t + i + r;
                $(".line-interated-page-table-body").append("<tr>" + "<td>" + '<input type="text" required="required" class="line-app-name form-control col-md-2 col-xs-12" data-id="new_line_channel"' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-id form-control col-md-2 col-xs-12" data-id="new_line_channel"' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-secret form-control col-md-2 col-xs-12" data-id="new_line_channel"' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-access-token form-control col-md-2 col-xs-12" data-id="new_line_channel"' + "</td>" + "<td>" + '<input type="text" required="required" class="line-channel-oa-id form-control col-md-2 col-xs-12" data-id="new_line_channel"' + "</td>" + "<td>" + o + "</td>" + "<td>" + e + "</td>" + "</tr>");
                $(".line-interated-channel-follow-up-teammate[data-id='" + "new_line_channel" + "']").val("00000000-0000-0000-0000-000000000000")
            });
            $(document).on("click", "#add-line-channel-btn", function () {
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_CONNECT_THIS_LINE_CHANNEL"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = $(".line-app-name[data-id='" + "new_line_channel" + "']").val();
                            var i = $(".line-channel-id[data-id='" + "new_line_channel" + "']").val();
                            var r = $(".line-channel-secret[data-id='" + "new_line_channel" + "']").val();
                            var o = $(".line-channel-access-token[data-id='" + "new_line_channel" + "']").val();
                            var a = $(".line-interated-channel-follow-up-teammate[data-id='" + "new_line_channel" + "']").val();
                            var s = $(".line-channel-oa-id[data-id='" + "new_line_channel" + "']").val();
                            if (n == null || n == "" || i == null || i == "" || r == null || r == "" || o == null || o == "" || a == null || a == "") {
                                bootbox.alert(c.t("MISSING_LINE_CHANNEL_INFORMATION"));
                                return
                            }
                            i = i.trim();
                            r = r.trim();
                            o = o.trim();
                            s = s.trim();
                            if (s[0] === "@") {
                                s = s.replace("@", "")
                            }
                            if (i.indexOf(" ") > -1) {
                                bootbox.alert(c.t("LINE_CHANNEL_INFORMATION_ID_INVALID"));
                                return
                            }
                            if (r.indexOf(" ") > -1) {
                                bootbox.alert(c.t("LINE_CHANNEL_INFORMATION_CHANNEL_SECRET_INVALID"));
                                return
                            }
                            if (o.indexOf(" ") > -1) {
                                bootbox.alert(c.t("LINE_CHANNEL_INFORMATION_CHANNEL_ACCESS_TOKEN_INVALID"));
                                return
                            }
                            $("#add-line-channel-btn").addClass("disabled");
                            $("#add-line-channel-btn").prepend('<i class="fa fa-circle-o-notch fa-spin"></i>');
                            var l = {
                                channel_name: n,
                                channel_id: i,
                                channel_secret: r,
                                channel_access_token: o,
                                channel_admin_username: a,
                                oa_id: s || null
                            };
                            f.addOrupdateLineIntegratedChannels(l, function (e, t, n) {
                                if (e == true) {
                                    $("#add-line-channel-btn").removeClass("disabled");
                                    $("#add-line-channel-btn").find("i").remove();
                                    x = n;
                                    bootbox.alert(c.t("LINE_CHANNEL_INTEGRATION_SUCCESS") + "<b>" + "https://api.easychat.co/restapi/v1/line/webhook/" + x.channel_id) + "</b>";
                                    Z();
                                    $("#add-new-line-channel").show();
                                    L.people.increment(u.CHANNEL_INTEGRATE.LINE_INTEGRATE);
                                    L.track(u.CHANNEL_INTEGRATE.LINE_INTEGRATE)
                                } else {
                                    $("#add-line-channel-btn").removeClass("disabled");
                                    $("#add-line-channel-btn").find("i").remove();
                                    if (n.responseJSON && n.responseJSON.code === 703) {
                                        bootbox.alert(c.t("THIS_LINE_CHANNEL_HAS_BEEN_INTEGRATED_BY_OTHER_TEAM"))
                                    } else {
                                        bootbox.alert(c.t("LINE_CHANNEL_INTEGRATION_ERROR"))
                                    }
                                }
                            })
                        }
                    }
                })
            });
            $(document).on("click", ".edit-line-channel-btn", function () {
                var u = $(this);
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_EDIT_THIS_LINE_CHANNEL"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = u.data("id");
                            var i = $(".line-app-name[data-id='" + n + "']").val();
                            var n = $(".line-channel-id[data-id='" + n + "']").val();
                            var r = $(".line-channel-secret[data-id='" + n + "']").val();
                            var o = $(".line-channel-access-token[data-id='" + n + "']").val();
                            var a = $(".line-interated-channel-follow-up-teammate[data-id='" + n + "']").val();
                            var s = $(".line-channel-oa-id[data-id='" + n + "']").val();
                            if (i == null || i == "" || n == null || n == "" || r == null || r == "" || o == null || o == "" || a == null || a == "") {
                                bootbox.alert(c.t("MISSING_LINE_CHANNEL_INFORMATION"));
                                return
                            }
                            n = n.trim();
                            r = r.trim();
                            o = o.trim();
                            s = s.trim();
                            if (s[0] === "@") {
                                s = s.replace("@", "")
                            }
                            if (n.indexOf(" ") > -1) {
                                bootbox.alert(c.t("LINE_CHANNEL_INFORMATION_ID_INVALID"));
                                return
                            }
                            if (r.indexOf(" ") > -1) {
                                bootbox.alert(c.t("LINE_CHANNEL_INFORMATION_CHANNEL_SECRET_INVALID"));
                                return
                            }
                            if (o.indexOf(" ") > -1) {
                                bootbox.alert(c.t("LINE_CHANNEL_INFORMATION_CHANNEL_ACCESS_TOKEN_INVALID"));
                                return
                            }
                            u.addClass("disabled");
                            u.prepend('<i class="fa fa-circle-o-notch fa-spin"></i> ');
                            var l = {
                                channel_name: i,
                                channel_id: n,
                                channel_secret: r,
                                channel_access_token: o,
                                channel_admin_username: a,
                                oa_id: s || null
                            };
                            f.addOrupdateLineIntegratedChannels(l, function (e, t, n) {
                                if (e == true) {
                                    x = n;
                                    bootbox.alert(c.t("UPDATE_SUCCESS"));
                                    Z();
                                    $("#add-new-line-channel").show()
                                } else {
                                    if (n.responseJSON && n.responseJSON.code === 703) {
                                        bootbox.alert(c.t("THIS_LINE_CHANNEL_HAS_BEEN_INTEGRATED_BY_OTHER_TEAM"))
                                    } else {
                                        bootbox.alert(c.t("LINE_CHANNEL_INTEGRATION_ERROR"))
                                    }
                                }
                            })
                        }
                    }
                })
            });
            $(document).on("click", ".webhook-line-channel-btn", function () {
                var e = $(this);
                var t = e.data("id");
                bootbox.alert(c.t("LINE_WEBHOOK_MESSAGE") + "<b>" + "https://api.easychat.co/restapi/v1/line/webhook/" + t + "</b>")
            });
            $(document).on("click", ".disconnect-line-channel-btn", function () {
                var i = $(this);
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_DISCONNECT_THIS_LINE_CHANNEL"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = i.data("id");
                            i.addClass("disabled");
                            i.prepend('<i class="fa fa-circle-o-notch fa-spin"></i> ');
                            l.deleteUnSubscribeChannel(n, function (e, t, n) {
                                if (e == true) {
                                    Z();
                                    $("#add-new-line-channel").show()
                                } else {
                                    i.removeClass("disabled");
                                    i.find("i").remove()
                                }
                            })
                        }
                    }
                })
            });
            $(document).on("click", ".connect-fb-page-btn", function () {
                var o = $(this);
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_CONNECT_THIS_FACEBOOK_PAGE"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = o.data("id");
                            var r = v[n];
                            o.addClass("disabled");
                            o.prepend('<i class="fa fa-circle-o-notch fa-spin"></i> ');
                            f.postSubscribePage(r.id, r.name, r.page_admin_username, r.access_token, r.picture.data.url, function (e, t, n) {
                                if (e == true) {
                                    f.postFacebookSubscribePageV2(r.id, function (e, t, n) {
                                        if (e == true) {
                                            f.postFacebookBotSetDefaultSettingV2(r.id, function (e, t, n) {
                                                if (e == true) {
                                                    z(true);
                                                    f.postSetPersistanceMenu(r.name, r.access_token, function (e, t, n) {
                                                        if (e == true) {
                                                            L.people.increment(u.CHANNEL_INTEGRATE.FACEBOOK_INTEGRATE);
                                                            L.track(u.CHANNEL_INTEGRATE.FACEBOOK_INTEGRATE)
                                                        } else {}
                                                    })
                                                } else {
                                                    f.deleteUnSubscribePage(r.id, function (e, t, n) {
                                                        if (e == true) {} else {}
                                                    });
                                                    o.removeClass("disabled");
                                                    o.find("i").remove();
                                                    var i = "";
                                                    if (n.responseJSON && n.responseJSON.message) {
                                                        i = "(" + n.responseJSON.message + ")"
                                                    }
                                                    bootbox.alert(c.t("FACEBOOK_MESSENGER_PAGE_INTEGRATION_ERROR") + "\n" + i)
                                                }
                                            })
                                        } else {
                                            f.deleteUnSubscribePage(r.id, function (e, t, n) {
                                                if (e == true) {} else {}
                                            });
                                            o.removeClass("disabled");
                                            o.find("i").remove();
                                            var i = "";
                                            if (n.responseJSON && n.responseJSON.message) {
                                                i = "(" + n.responseJSON.message + ")"
                                            }
                                            bootbox.alert(c.t("FACEBOOK_MESSENGER_PAGE_INTEGRATION_ERROR") + "\n" + i)
                                        }
                                    })
                                } else {
                                    if (n.responseJSON.exceptionType == -90007) {
                                        o.removeClass("disabled");
                                        o.find("i").remove();
                                        bootbox.alert(c.t("THIS_FACEBOOK_PAGE_HAS_BEEN_INTEGRATED_BY_OTHER_TEAM"))
                                    } else {
                                        o.removeClass("disabled");
                                        o.find("i").remove();
                                        bootbox.alert(c.t("FACEBOOK_MESSENGER_PAGE_INTEGRATION_ERROR"))
                                    }
                                }
                            })
                        }
                    }
                })
            });
            $(document).on("click", ".disconnect-fb-page-btn", function () {
                var r = $(this);
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_DISCONNECT_THIS_FACEBOOK_PAGE"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = r.data("id");
                            var i = m[n];
                            r.addClass("disabled");
                            r.prepend('<i class="fa fa-circle-o-notch fa-spin"></i> ');
                            l.deleteFacebookGraphApiSubscribePageV2(i.page_id, function (e, t, n) {
                                f.deleteUnSubscribePage(i.page_id, function (e, t, n) {
                                    if (e == true) {
                                        m = {};
                                        z(true);
                                        bootbox.alert(c.t("FACEBOOK_MESSENGER_PAGE_INTEGRATION_DISCONNECTED"))
                                    } else {
                                        r.removeClass("disabled");
                                        r.find("i").remove()
                                    }
                                })
                            })
                        }
                    }
                })
            });
            $(document).on("click", "#disconnect-your-fb-acc", function () {
                FB.logout(function (e) {
                    W = null;
                    $(".fb-available-page-table-body").empty();
                    $("#connect-your-fb-acc").show();
                    $("#disconnect-your-fb-acc").hide();
                    $("#fb-available-page-table").hide()
                })
            });
            $(document).on("click", "#connect-your-fb-acc", function () {
                FB.login(function (e) {
                    if (e.status === "connected") {
                        if (e.authResponse.accessToken != null && e.authResponse.userID != null) {
                            f.postFacebookLoginAccess(e.authResponse.userID, e.authResponse.accessToken, function (e, t, n) {
                                if (e == false) {
                                    if (t == 403) {
                                        bootbox.alert(c.t("SEND_TO_FACEBOOK_MESSENGER_EXPIRED_TRIAL"))
                                    } else {
                                        bootbox.alert(c.t("FACEBOOK_LOGIN_ACCESS_EASYCHAT_SERVER_ERROR") + " (Code: 1001)")
                                    }
                                } else {
                                    W = n.long_lived_access_token;
                                    J()
                                }
                            })
                        } else {
                            bootbox.alert(c.t("FACEBOOK_LOGIN_ACCESS_EASYCHAT_SERVER_ERROR") + " (Code: 1002)")
                        }
                    } else {
                        $(".fb-interated-page-table").hide();
                        $(".fb-available-page-table").hide()
                    }
                }, {
                    scope: "pages_manage_ads,pages_manage_metadata,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,pages_messaging,pages_manage_posts,pages_manage_engagement"
                })
            });
            $(document).on("click", "#connect-your-ig-acc", function () {
                var e = ["pages_manage_metadata", "instagram_basic", "pages_show_list", "instagram_manage_messages"];
                FB.login(function (e) {
                    if (e.status === "connected") {
                        if (e.authResponse.accessToken != null && e.authResponse.userID != null) {
                            f.postFacebookLoginAccess(e.authResponse.userID, e.authResponse.accessToken, function (e, t, n) {
                                if (e == false) {
                                    if (t == 403) {
                                        bootbox.alert(c.t("SEND_TO_FACEBOOK_MESSENGER_EXPIRED_TRIAL"))
                                    } else {
                                        bootbox.alert(c.t("FACEBOOK_LOGIN_ACCESS_EASYCHAT_SERVER_ERROR") + " (Code: 1001)")
                                    }
                                } else {
                                    W = n.long_lived_access_token;
                                    Q()
                                }
                            })
                        } else {
                            bootbox.alert(c.t("FACEBOOK_LOGIN_ACCESS_EASYCHAT_SERVER_ERROR") + " (Code: 1002)")
                        }
                    } else {
                        $(".ig-integrated-acc-table").hide();
                        $(".ig-available-acc-table").hide()
                    }
                }, {
                    scope: e.join(",")
                })
            });
            $(document).on("click", ".connect-ig-acc-btn", function () {
                var r = $(this);
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_CONNECT_THIS_INSTAGRAM_ACC"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = r.data("id");
                            var i = y[n];
                            r.addClass("disabled");
                            r.prepend('<i class="fa fa-circle-o-notch fa-spin"></i> ');
                            l.postConnectInstagramAccount(i.id, i.name, i.adminUsername, i.accessToken, i.profilePic, function (e, t, n) {
                                if (e == true) {
                                    X(true)
                                } else {
                                    r.removeClass("disabled");
                                    r.find("i").remove();
                                    if (n.responseJSON.code == 706) {
                                        bootbox.alert(c.t("THIS_INSTAGRAM_ACC_HAS_BEEN_INTEGRATED_BY_OTHER_TEAM"))
                                    } else {
                                        bootbox.alert(c.t("INSTAGRAM_ACC_INTEGRATION_FAILED"))
                                    }
                                }
                            })
                        }
                    }
                })
            });
            $(document).on("click", ".disconnect-ig-acc-btn", function () {
                var r = $(this);
                bootbox.confirm({
                    message: c.t("ARE_YOU_SURE_TO_DISCONNECT_THIS_INSTAGRAM_ACC"),
                    buttons: {
                        confirm: {
                            label: c.t("YES"),
                            className: "btn-success"
                        },
                        cancel: {
                            label: c.t("NO"),
                            className: "btn-danger"
                        }
                    },
                    callback: function e(t) {
                        if (t == true) {
                            var n = r.data("id");
                            var i = _[n];
                            r.addClass("disabled");
                            r.prepend('<i class="fa fa-circle-o-notch fa-spin"></i> ');
                            l.deleteInstagramAccount(n, function (e, t, n) {
                                if (e == true) {
                                    _ = {};
                                    X(true);
                                    bootbox.alert(c.t("INSTAGRAM_ACC_INTEGRATION_DISCONNECTED"))
                                } else {
                                    r.removeClass("disabled");
                                    r.find("i").remove()
                                }
                            })
                        }
                    }
                })
            });
            window.fbAsyncInit = function () {
                FB.init({
                    appId: P.fbAppId,
                    cookie: true,
                    xfbml: true,
                    version: "v2.11"
                });
                FB.getLoginStatus(function (e) {
                    ee(e)
                })
            };
            (function (e, t, n) {
                var i, r = e.getElementsByTagName(t)[0];
                if (e.getElementById(n)) return;
                i = e.createElement(t);
                i.id = n;
                i.src = "https://connect.facebook.net/en_US/sdk.js";
                r.parentNode.insertBefore(i, r)
            })(document, "script", "facebook-jssdk")
        });
        $(document).on("userDataDidUpdate", function (e, t) {
            var n = t;
            d = n.username;
            M = n.colorCode;
            H = n.appKey;
            j = n.team;
            $("#current-color").val(M);
            $(".color-icon").css("background-color", M);
            K()
        });
        $(document).on("authenticateDidSuccess", function (e, t) {
            var n = t;
            d = n.username;
            l.getValidTeamMembers()
        });
        $(document).on("getValidTeamMembersDidFinished", function (e, t) {
            var n = t;
            P.log("getValidTeamMembersDidFinished - " + JSON.stringify(n, null, "  "));
            h = n;
            $.each(h, function (e, t) {
                g[t.username] = t
            });
            $("#add-new-line-channel").show();
            Z();
            z(false);
            $("#btn-contact-us").click(function () {
                var e = document.getElementById("easychat-floating-button") || document.getElementById("easychat-floating-button-left");
                e.click()
            });
            f.checkIsFeatureEnabled(P.FEATURE_IG_INTEGRATION, function (e, t, n) {
                if (e == true) {
                    if (n.valid == true) {
                        $("#instagram-integration-not-supported-wrapper").hide();
                        $("#instagram-integration-wrapper").show();
                        X(false)
                    }
                }
            })
        });

        function ne() {
            var e = "English";
            if (p === "en") {
                e = "English"
            } else if (p === "zh-Hant") {
                e = "中文(繁體)"
            }
            var t = {
                debug: false,
                lng: p,
                fallbackLng: false,
                keySeparator: false,
                nsSeparator: false,
                ns: "translation",
                defaultNS: "translation",
                backend: {
                    loadPath: "locales/{{lng}}/{{ns}}.json"
                }
            };
            c.use(a);
            c.init(t, function (e) {});
            if (p === "en") {
                N = "Trial expired in "
            } else if (p === "zh-Hant") {
                N = "試用到期日為 "
            }
        }
        ne()
    }, {
        "../helpers/mixpanelEvents": 1,
        "../restapi/common": 2,
        "../restapi/integration": 4,
        appconfig: 7,
        "bootstrap-colorpicker": 8,
        "bootstrap-tagsinput": 9,
        clipboard: 11,
        "exif-js": 14,
        i18next: 36,
        "i18next-xhr-backend": 20,
        "js-cookie": 38,
        "jwt-decode": 41,
        "mixpanel-browser": 42
    }],
    6: [function (e, t, n) {
        (function () {
            "use strict";
            var e = {
                restApiHost: "https://api.omnichat.ai",
                xmppHost: "chat.easychat.co",
                xmppMucHost: "conference.chat.easychat.co",
                xmppBoshURL: "https://chat.easychat.co:7443/http-bind/",
                qrcodeURL: "https://s3-ap-southeast-1.amazonaws.com/caas-media-storage/upload/photos/",
                adminChatURL: "https://admin-chat.omnichat.ai/",
                deeplink: "https://easychat.app.link?",
                chatPluginURL: "https://client-chat.easychat.co/?",
                chatPluginJSPath: "https://chat-plugin.easychat.co/easychat.js",
                chatPluginIconPath: "https://chat-plugin.easychat.co/icon.svg",
                accountKitAppId: 0x462fbccd99746,
                stripeToken: "pk_live_sfd6d68EtDxdSgSBF9CQGE8N",
                fbAppId: "1234733519968070",
                intlTelInputApiKey: "ea707b71110ebc",
                mixpanelToken: "96e1205d0550983f96cd92066530f7b1",
                debug: false
            };
            if (typeof n !== "undefined") {
                if (typeof t !== "undefined" && t.exports) {
                    n = t.exports = e
                }
                n.AppEnv = e
            } else {
                window.AppEnv = e
            }
        })()
    }, {}],
    7: [function (n, e, t) {
        (function () {
            "use strict";
            window.AppConfig = function () {
                var t = this;
                var e = n("./env");
                t.restApiHost = e.restApiHost;
                t.xmppHost = e.xmppHost;
                t.xmppMucHost = e.xmppMucHost;
                t.xmppBoshURL = e.xmppBoshURL;
                t.qrcodeURL = e.qrcodeURL;
                t.adminChatURL = e.adminChatURL;
                t.deeplink = e.deeplink;
                t.chatPluginURL = e.chatPluginURL;
                t.chatPluginJSPath = e.chatPluginJSPath;
                t.chatPluginIconPath = e.chatPluginIconPath;
                t.intlTelInputApiKey = e.intlTelInputApiKey;
                t.mixpanelToken = e.mixpanelToken;
                t.debug = e.debug;
                t.accountKitAppId = e.accountKitAppId;
                t.stripeToken = e.stripeToken;
                t.fbAppId = e.fbAppId;
                t.NO_PLAN = 0;
                t.EARLY_BIRD_PLAN = 1;
                t.INDIVIDUAL_PLAN = 2;
                t.TEAM_PLAN = 3;
                t.DAILY_TESTING_PLAN = 4;
                t.EARLY_BIRD_PLUS_PLAN = 5;
                t.SOCIAL_ENGAGEMENT_PLAN = 6;
                t.INDIVIDUAL_TW_PLAN = 7;
                t.ENTERPRISE_PLAN = 100;
                t.TEAM_TW_PLAN = 13;
                t.SOCIAL_ENGAGEMENT_TW_PLAN = 16;
                t.TEAM_YEARLY_PLAN = 103;
                t.SOCIAL_ENGAGEMENT_YEARLY_PLAN = 106;
                t.TEAM_TW_YEARLY_PLAN = 113;
                t.SOCIAL_ENGAGEMENT_TW_YEARLY_PLAN = 116;
                t.earlyBirdMaxAgents = 5;
                t.individualMaxAgents = 1;
                t.trialPlanMaxAgents = 5;
                t.teamMaxAgents = 50;
                t.teamPlanPrice = 49.99;
                t.socialEngagementPlanPrice = 79.99;
                t.teamPlanTWPrice = 199;
                t.socialEngagementPlanTWPrice = 299;
                t.teamPlanYearlyPrice = 540;
                t.socialEngagementPlanYearlyPrice = 864;
                t.teamPlanYearlyTWPrice = 2149;
                t.socialEngagementPlanYearlyTWPrice = 3229;
                t.CUSTOMER_SERVICE_HK_PLAN = 21;
                t.CUSTOMER_SERVICE_TW_PLAN = 22;
                t.SALES_CUSTOMER_SERVICE_HK_PLAN = 23;
                t.SALES_CUSTOMER_SERVICE_TW_PLAN = 24;
                t.ENTERPRISE_HK_PLAN = 25;
                t.ENTERPRISE_TW_PLAN = 26;
                t.CUSTOMER_SERVICE_YEARLY_HK_PLAN = 121;
                t.CUSTOMER_SERVICE_YEARLY_TW_PLAN = 122;
                t.SALES_CUSTOMER_SERVICE_YEARLY_HK_PLAN = 123;
                t.SALES_CUSTOMER_SERVICE_YEARLY_TW_PLAN = 124;
                t.ENTERPRISE_YEARLY_HK_PLAN = 125;
                t.ENTERPRISE_YEARLY_TW_PLAN = 126;
                t.CustomerServicePlanMaxAgents = 2;
                t.SalesCustomerServicePlanMaxAgents = 5;
                t.enterprisePlanMaxAgents = 15;
                t.CustomerServicePlanHKPrice = 300;
                t.CustomerServicePlanTWPrice = 1080;
                t.SalesCustomerServicePlanHKPrice = 800;
                t.SalesCustomerServicePlanTWPrice = 2880;
                t.enterprisePlanHKPrice = 2500;
                t.enterprisePlanTWPrice = 9e3;
                t.CustomerServicePlanYearlyHKPrice = 3240;
                t.CustomerServicePlanYearlyTWPrice = 11664;
                t.SalesCustomerServicePlanYearlyHKPrice = 8640;
                t.SalesCustomerServicePlanYearlyTWPrice = 31104;
                t.enterprisePlanYearlyHKPrice = 27e3;
                t.enterprisePlanYearlyTWPrice = 97200;
                t.STARTING_PLAN_MONTHY_HKD = 1001;
                t.STARTING_PLAN_MONTHY_TWD = 1002;
                t.STARTING_PLAN_MONTHY_USD = 1003;
                t.CUSTOMER_SUPPORT_MONTHY_HKD = 1004;
                t.CUSTOMER_SUPPORT_MONTHY_TWD = 1005;
                t.CUSTOMER_SUPPORT_MONTHY_USD = 1006;
                t.ENGAGEMENT_AND_SALES_MONTHY_HKD = 1007;
                t.ENGAGEMENT_AND_SALES_MONTHY_TWD = 1008;
                t.ENGAGEMENT_AND_SALES_MONTHY_USD = 1009;
                t.BRAND_AND_ENTERPRISE_MONTHY_HKD = 1010;
                t.BRAND_AND_ENTERPRISE_MONTHY_TWD = 1011;
                t.BRAND_AND_ENTERPRISE_MONTHY_USD = 1012;
                t.CUSTOMER_SUPPORT_YEARLY_HKD = 1104;
                t.CUSTOMER_SUPPORT_YEARLY_TWD = 1105;
                t.CUSTOMER_SUPPORT_YEARLY_USD = 1106;
                t.ENGAGEMENT_AND_SALES_YEARLY_HKD = 1107;
                t.ENGAGEMENT_AND_SALES_YEARLY_TWD = 1108;
                t.ENGAGEMENT_AND_SALES_YEARLY_USD = 1109;
                t.BRAND_AND_ENTERPRISE_YEARLY_HKD = 1110;
                t.BRAND_AND_ENTERPRISE_YEARLY_TWD = 1111;
                t.BRAND_AND_ENTERPRISE_YEARLY_USD = 1112;
                t.BRAND_AND_ENTERPRISE_TRIAL_HKD = 1201;
                t.BRAND_AND_ENTERPRISE_TRIAL_TWD = 1202;
                t.BRAND_AND_ENTERPRISE_TRIAL_USD = 1203;
                t.CustomerServicePlanHKPrice = 100;
                t.CustomerServicePlanTWPrice = 400;
                t.CustomerServicePlanUSPrice = 15;
                t.SalesCustomerServicePlanHKPrice = 200;
                t.SalesCustomerServicePlanTWPrice = 800;
                t.SalesCustomerServicePlanUSPrice = 25;
                t.enterprisePlanHKPrice = 300;
                t.enterprisePlanTWPrice = 1200;
                t.enterprisePlanUSPrice = 40;
                t.CustomerServicePlanYearlyHKPrice = 960;
                t.CustomerServicePlanYearlyTWPrice = 3840;
                t.CustomerServicePlanYearlyUSPrice = 144;
                t.SalesCustomerServicePlanYearlyHKPrice = 1920;
                t.SalesCustomerServicePlanYearlyTWPrice = 7680;
                t.SalesCustomerServicePlanYearlyUSPrice = 240;
                t.enterprisePlanYearlyHKPrice = 2880;
                t.enterprisePlanYearlyTWPrice = 11520;
                t.enterprisePlanYearlyUSPrice = 384;
                t.HK_TRIALING = "2019-HK-00001";
                t.HK_PRODUCT_CUSTOMER_SUPPORT = "2019-HK-10001";
                t.HK_PRODUCT_STANDARD_MARKETING = "2019-HK-10002";
                t.HK_PRODUCT_PRO_MARKETING = "2019-HK-10003";
                t.HK_PRODUCT_ENTERPRISE = "2019-HK-10004";
                t.TW_TRIALING = "2019-TW-00001";
                t.TW_PRODUCT_CUSTOMER_SUPPORT = "2019-TW-10001";
                t.TW_PRODUCT_STANDARD_MARKETING = "2019-TW-10002";
                t.TW_PRODUCT_PRO_MARKETING = "2019-TW-10003";
                t.TW_PRODUCT_ENTERPRISE = "2019-TW-10004";
                t.US_TRIALING = "2019-US-00001";
                t.US_PRODUCT_CUSTOMER_SUPPORT = "2019-US-10001";
                t.US_PRODUCT_STANDARD_MARKETING = "2019-US-10002";
                t.US_PRODUCT_PRO_MARKETING = "2019-US-10003";
                t.US_PRODUCT_ENTERPRISE = "2019-US-10004";
                t.HK_PRODUCT_ENTERPRISE_2020 = "2020-HK-10003";
                t.TW_PRODUCT_ENTERPRISE_2020 = "2020-TW-10003";
                t.US_PRODUCT_ENTERPRISE_2020 = "2020-US-10003";
                t.FEATURE_CUSTOMER_ANALYSIS = "cua";
                t.FEATURE_AUTO_MESSAGE = "trm";
                t.FEATURE_CHAT_STATISTICS = "cha";
                t.FEATURE_PUSH_TO_CHAT = "ptc";
                t.FEATURE_CRM = "crm";
                t.FEATURE_BROADCAST = "bc";
                t.FEATURE_CHATBOT = "bot";
                t.FEATURE_KEYWORD_AUTO_REPLY = "kar";
                t.FEATURE_KEYWORD_AUTO_ASSIGN = "kaa";
                t.FEATURE_FB_COMMENT_AUTO_REPLY = "fbcar";
                t.FEATURE_FB_INDEGRATION = "fbi";
                t.FEATURE_IG_INTEGRATION = "igi";
                t.FEATURE_LINE_INDEGRATION = "lii";
                t.FEATURE_WHATSAPP_INDEGRATION = "whi";
                t.Waca = "Waca";
                t.NineOneApp = "91App";
                t.USER_ROLE_ADMIN = 1;
                t.USER_ROLE_CS = 2;
                t.USER_ROLE_MARKETING = 3;
                t.USER_ROLE_CS_MANAGER = 4;
                t.USER_ROLE_MANAGER = 5;
                t.USER_ROLE_SALESPERSON = 6;
                t.USER_ROLE_SALES_MANAGER = 7;
                t.FORMAT_DOLLAR = "dollar";
                t.FORMAT_PERCENT = "percent";
                t.FORMAT_NONE = "none";
                t.BD_PARTNER = {
                    CRESCLAB: "cresclab"
                };
                t.log = function (e) {
                    if (t.debug == true) {
                        console.log(e)
                    }
                }
            }
        })()
    }, {
        "./env": 6
    }],
    8: [function (n, i, r) {
        (function (e, t) {
            if (typeof define === "function" && define.amd) {
                define(["jquery"], function (e) {
                    return t(e)
                })
            } else if (typeof r === "object") {
                i.exports = t(n("jquery"))
            } else if (jQuery && !jQuery.fn.colorpicker) {
                t(jQuery)
            }
        })(this, function (u) {
            "use strict";
            var o = function (e, t, n, i, r) {
                this.fallbackValue = n ? typeof n === "string" ? this.parse(n) : n : null;
                this.fallbackFormat = i ? i : "rgba";
                this.hexNumberSignPrefix = r === true;
                this.value = this.fallbackValue;
                this.origFormat = null;
                this.predefinedColors = t ? t : {};
                this.colors = u.extend({}, o.webColors, this.predefinedColors);
                if (e) {
                    if (typeof e.h !== "undefined") {
                        this.value = e
                    } else {
                        this.setColor(String(e))
                    }
                }
                if (!this.value) {
                    this.value = {
                        h: 0,
                        s: 0,
                        b: 0,
                        a: 1
                    }
                }
            };
            o.webColors = {
                aliceblue: "f0f8ff",
                antiquewhite: "faebd7",
                aqua: "00ffff",
                aquamarine: "7fffd4",
                azure: "f0ffff",
                beige: "f5f5dc",
                bisque: "ffe4c4",
                black: "000000",
                blanchedalmond: "ffebcd",
                blue: "0000ff",
                blueviolet: "8a2be2",
                brown: "a52a2a",
                burlywood: "deb887",
                cadetblue: "5f9ea0",
                chartreuse: "7fff00",
                chocolate: "d2691e",
                coral: "ff7f50",
                cornflowerblue: "6495ed",
                cornsilk: "fff8dc",
                crimson: "dc143c",
                cyan: "00ffff",
                darkblue: "00008b",
                darkcyan: "008b8b",
                darkgoldenrod: "b8860b",
                darkgray: "a9a9a9",
                darkgreen: "006400",
                darkkhaki: "bdb76b",
                darkmagenta: "8b008b",
                darkolivegreen: "556b2f",
                darkorange: "ff8c00",
                darkorchid: "9932cc",
                darkred: "8b0000",
                darksalmon: "e9967a",
                darkseagreen: "8fbc8f",
                darkslateblue: "483d8b",
                darkslategray: "2f4f4f",
                darkturquoise: "00ced1",
                darkviolet: "9400d3",
                deeppink: "ff1493",
                deepskyblue: "00bfff",
                dimgray: "696969",
                dodgerblue: "1e90ff",
                firebrick: "b22222",
                floralwhite: "fffaf0",
                forestgreen: "228b22",
                fuchsia: "ff00ff",
                gainsboro: "dcdcdc",
                ghostwhite: "f8f8ff",
                gold: "ffd700",
                goldenrod: "daa520",
                gray: "808080",
                green: "008000",
                greenyellow: "adff2f",
                honeydew: "f0fff0",
                hotpink: "ff69b4",
                indianred: "cd5c5c",
                indigo: "4b0082",
                ivory: "fffff0",
                khaki: "f0e68c",
                lavender: "e6e6fa",
                lavenderblush: "fff0f5",
                lawngreen: "7cfc00",
                lemonchiffon: "fffacd",
                lightblue: "add8e6",
                lightcoral: "f08080",
                lightcyan: "e0ffff",
                lightgoldenrodyellow: "fafad2",
                lightgrey: "d3d3d3",
                lightgreen: "90ee90",
                lightpink: "ffb6c1",
                lightsalmon: "ffa07a",
                lightseagreen: "20b2aa",
                lightskyblue: "87cefa",
                lightslategray: "778899",
                lightsteelblue: "b0c4de",
                lightyellow: "ffffe0",
                lime: "00ff00",
                limegreen: "32cd32",
                linen: "faf0e6",
                magenta: "ff00ff",
                maroon: "800000",
                mediumaquamarine: "66cdaa",
                mediumblue: "0000cd",
                mediumorchid: "ba55d3",
                mediumpurple: "9370d8",
                mediumseagreen: "3cb371",
                mediumslateblue: "7b68ee",
                mediumspringgreen: "00fa9a",
                mediumturquoise: "48d1cc",
                mediumvioletred: "c71585",
                midnightblue: "191970",
                mintcream: "f5fffa",
                mistyrose: "ffe4e1",
                moccasin: "ffe4b5",
                navajowhite: "ffdead",
                navy: "000080",
                oldlace: "fdf5e6",
                olive: "808000",
                olivedrab: "6b8e23",
                orange: "ffa500",
                orangered: "ff4500",
                orchid: "da70d6",
                palegoldenrod: "eee8aa",
                palegreen: "98fb98",
                paleturquoise: "afeeee",
                palevioletred: "d87093",
                papayawhip: "ffefd5",
                peachpuff: "ffdab9",
                peru: "cd853f",
                pink: "ffc0cb",
                plum: "dda0dd",
                powderblue: "b0e0e6",
                purple: "800080",
                red: "ff0000",
                rosybrown: "bc8f8f",
                royalblue: "4169e1",
                saddlebrown: "8b4513",
                salmon: "fa8072",
                sandybrown: "f4a460",
                seagreen: "2e8b57",
                seashell: "fff5ee",
                sienna: "a0522d",
                silver: "c0c0c0",
                skyblue: "87ceeb",
                slateblue: "6a5acd",
                slategray: "708090",
                snow: "fffafa",
                springgreen: "00ff7f",
                steelblue: "4682b4",
                tan: "d2b48c",
                teal: "008080",
                thistle: "d8bfd8",
                tomato: "ff6347",
                turquoise: "40e0d0",
                violet: "ee82ee",
                wheat: "f5deb3",
                white: "ffffff",
                whitesmoke: "f5f5f5",
                yellow: "ffff00",
                yellowgreen: "9acd32",
                transparent: "transparent"
            };
            o.prototype = {
                constructor: o,
                colors: {},
                predefinedColors: {},
                getValue: function () {
                    return this.value
                },
                setValue: function (e) {
                    this.value = e
                },
                _sanitizeNumber: function (e) {
                    if (typeof e === "number") {
                        return e
                    }
                    if (isNaN(e) || e === null || e === "" || e === undefined) {
                        return 1
                    }
                    if (e === "") {
                        return 0
                    }
                    if (typeof e.toLowerCase !== "undefined") {
                        if (e.match(/^\./)) {
                            e = "0" + e
                        }
                        return Math.ceil(parseFloat(e) * 100) / 100
                    }
                    return 1
                },
                isTransparent: function (e) {
                    if (!e || !(typeof e === "string" || e instanceof String)) {
                        return false
                    }
                    e = e.toLowerCase().trim();
                    return e === "transparent" || e.match(/#?00000000/) || e.match(/(rgba|hsla)\(0,0,0,0?\.?0\)/)
                },
                rgbaIsTransparent: function (e) {
                    return e.r === 0 && e.g === 0 && e.b === 0 && e.a === 0
                },
                setColor: function (e) {
                    e = e.toLowerCase().trim();
                    if (e) {
                        if (this.isTransparent(e)) {
                            this.value = {
                                h: 0,
                                s: 0,
                                b: 0,
                                a: 0
                            };
                            return true
                        } else {
                            var t = this.parse(e);
                            if (t) {
                                this.value = this.value = {
                                    h: t.h,
                                    s: t.s,
                                    b: t.b,
                                    a: t.a
                                };
                                if (!this.origFormat) {
                                    this.origFormat = t.format
                                }
                            } else if (this.fallbackValue) {
                                this.value = this.fallbackValue
                            }
                        }
                    }
                    return false
                },
                setHue: function (e) {
                    this.value.h = 1 - e
                },
                setSaturation: function (e) {
                    this.value.s = e
                },
                setBrightness: function (e) {
                    this.value.b = 1 - e
                },
                setAlpha: function (e) {
                    this.value.a = Math.round(parseInt((1 - e) * 100, 10) / 100 * 100) / 100
                },
                toRGB: function (e, t, n, i) {
                    if (arguments.length === 0) {
                        e = this.value.h;
                        t = this.value.s;
                        n = this.value.b;
                        i = this.value.a
                    }
                    e *= 360;
                    var r, o, a, s, l;
                    e = e % 360 / 60;
                    l = n * t;
                    s = l * (1 - Math.abs(e % 2 - 1));
                    r = o = a = n - l;
                    e = ~~e;
                    r += [l, s, 0, 0, s, l][e];
                    o += [s, l, l, s, 0, 0][e];
                    a += [0, 0, s, l, l, s][e];
                    return {
                        r: Math.round(r * 255),
                        g: Math.round(o * 255),
                        b: Math.round(a * 255),
                        a: i
                    }
                },
                toHex: function (e, t, n, i, r) {
                    if (arguments.length <= 1) {
                        t = this.value.h;
                        n = this.value.s;
                        i = this.value.b;
                        r = this.value.a
                    }
                    var o = "#";
                    var a = this.toRGB(t, n, i, r);
                    if (this.rgbaIsTransparent(a)) {
                        return "transparent"
                    }
                    if (!e) {
                        o = this.hexNumberSignPrefix ? "#" : ""
                    }
                    var s = o + ((1 << 24) + (parseInt(a.r) << 16) + (parseInt(a.g) << 8) + parseInt(a.b)).toString(16).slice(1);
                    return s
                },
                toHSL: function (e, t, n, i) {
                    if (arguments.length === 0) {
                        e = this.value.h;
                        t = this.value.s;
                        n = this.value.b;
                        i = this.value.a
                    }
                    var r = e,
                        o = (2 - t) * n,
                        a = t * n;
                    if (o > 0 && o <= 1) {
                        a /= o
                    } else {
                        a /= 2 - o
                    }
                    o /= 2;
                    if (a > 1) {
                        a = 1
                    }
                    return {
                        h: isNaN(r) ? 0 : r,
                        s: isNaN(a) ? 0 : a,
                        l: isNaN(o) ? 0 : o,
                        a: isNaN(i) ? 0 : i
                    }
                },
                toAlias: function (e, t, n, i) {
                    var r, o = arguments.length === 0 ? this.toHex(true) : this.toHex(true, e, t, n, i);
                    var a = this.origFormat === "alias" ? o : this.toString(false, this.origFormat);
                    for (var s in this.colors) {
                        r = this.colors[s].toLowerCase().trim();
                        if (r === o || r === a) {
                            return s
                        }
                    }
                    return false
                },
                RGBtoHSB: function (e, t, n, i) {
                    e /= 255;
                    t /= 255;
                    n /= 255;
                    var r, o, a, s;
                    a = Math.max(e, t, n);
                    s = a - Math.min(e, t, n);
                    r = s === 0 ? null : a === e ? (t - n) / s : a === t ? (n - e) / s + 2 : (e - t) / s + 4;
                    r = (r + 360) % 6 * 60 / 360;
                    o = s === 0 ? 0 : s / a;
                    return {
                        h: this._sanitizeNumber(r),
                        s: o,
                        b: a,
                        a: this._sanitizeNumber(i)
                    }
                },
                HueToRGB: function (e, t, n) {
                    if (n < 0) {
                        n += 1
                    } else if (n > 1) {
                        n -= 1
                    }
                    if (n * 6 < 1) {
                        return e + (t - e) * n * 6
                    } else if (n * 2 < 1) {
                        return t
                    } else if (n * 3 < 2) {
                        return e + (t - e) * (2 / 3 - n) * 6
                    } else {
                        return e
                    }
                },
                HSLtoRGB: function (e, t, n, i) {
                    if (t < 0) {
                        t = 0
                    }
                    var r;
                    if (n <= .5) {
                        r = n * (1 + t)
                    } else {
                        r = n + t - n * t
                    }
                    var o = 2 * n - r;
                    var a = e + 1 / 3;
                    var s = e;
                    var l = e - 1 / 3;
                    var u = Math.round(this.HueToRGB(o, r, a) * 255);
                    var c = Math.round(this.HueToRGB(o, r, s) * 255);
                    var f = Math.round(this.HueToRGB(o, r, l) * 255);
                    return [u, c, f, this._sanitizeNumber(i)]
                },
                parse: function (i) {
                    if (typeof i !== "string") {
                        return this.fallbackValue
                    }
                    if (arguments.length === 0) {
                        return false
                    }
                    var r = this,
                        o = false,
                        a = typeof this.colors[i] !== "undefined",
                        s, l;
                    if (a) {
                        i = this.colors[i].toLowerCase().trim()
                    }
                    u.each(this.stringParsers, function (e, t) {
                        var n = t.re.exec(i);
                        s = n && t.parse.apply(r, [n]);
                        if (s) {
                            o = {};
                            l = a ? "alias" : t.format ? t.format : r.getValidFallbackFormat();
                            if (l.match(/hsla?/)) {
                                o = r.RGBtoHSB.apply(r, r.HSLtoRGB.apply(r, s))
                            } else {
                                o = r.RGBtoHSB.apply(r, s)
                            }
                            if (o instanceof Object) {
                                o.format = l
                            }
                            return false
                        }
                        return true
                    });
                    return o
                },
                getValidFallbackFormat: function () {
                    var e = ["rgba", "rgb", "hex", "hsla", "hsl"];
                    if (this.origFormat && e.indexOf(this.origFormat) !== -1) {
                        return this.origFormat
                    }
                    if (this.fallbackFormat && e.indexOf(this.fallbackFormat) !== -1) {
                        return this.fallbackFormat
                    }
                    return "rgba"
                },
                toString: function (e, t, n) {
                    t = t || this.origFormat || this.fallbackFormat;
                    n = n || false;
                    var i = false;
                    switch (t) {
                        case "rgb": {
                            i = this.toRGB();
                            if (this.rgbaIsTransparent(i)) {
                                return "transparent"
                            }
                            return "rgb(" + i.r + "," + i.g + "," + i.b + ")"
                        }
                        break;
                    case "rgba": {
                        i = this.toRGB();
                        return "rgba(" + i.r + "," + i.g + "," + i.b + "," + i.a + ")"
                    }
                    break;
                    case "hsl": {
                        i = this.toHSL();
                        return "hsl(" + Math.round(i.h * 360) + "," + Math.round(i.s * 100) + "%," + Math.round(i.l * 100) + "%)"
                    }
                    break;
                    case "hsla": {
                        i = this.toHSL();
                        return "hsla(" + Math.round(i.h * 360) + "," + Math.round(i.s * 100) + "%," + Math.round(i.l * 100) + "%," + i.a + ")"
                    }
                    break;
                    case "hex": {
                        return this.toHex(e)
                    }
                    break;
                    case "alias": {
                        i = this.toAlias();
                        if (i === false) {
                            return this.toString(e, this.getValidFallbackFormat())
                        }
                        if (n && !(i in o.webColors) && i in this.predefinedColors) {
                            return this.predefinedColors[i]
                        }
                        return i
                    }
                    default: {
                        return i
                    }
                    break
                    }
                },
                stringParsers: [{
                    re: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*?\)/,
                    format: "rgb",
                    parse: function (e) {
                        return [e[1], e[2], e[3], 1]
                    }
                }, {
                    re: /rgb\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
                    format: "rgb",
                    parse: function (e) {
                        return [2.55 * e[1], 2.55 * e[2], 2.55 * e[3], 1]
                    }
                }, {
                    re: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
                    format: "rgba",
                    parse: function (e) {
                        return [e[1], e[2], e[3], e[4]]
                    }
                }, {
                    re: /rgba\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
                    format: "rgba",
                    parse: function (e) {
                        return [2.55 * e[1], 2.55 * e[2], 2.55 * e[3], e[4]]
                    }
                }, {
                    re: /hsl\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
                    format: "hsl",
                    parse: function (e) {
                        return [e[1] / 360, e[2] / 100, e[3] / 100, e[4]]
                    }
                }, {
                    re: /hsla\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
                    format: "hsla",
                    parse: function (e) {
                        return [e[1] / 360, e[2] / 100, e[3] / 100, e[4]]
                    }
                }, {
                    re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
                    format: "hex",
                    parse: function (e) {
                        return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16), 1]
                    }
                }, {
                    re: /#?([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
                    format: "hex",
                    parse: function (e) {
                        return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16), 1]
                    }
                }],
                colorNameToHex: function (e) {
                    if (typeof this.colors[e.toLowerCase()] !== "undefined") {
                        return this.colors[e.toLowerCase()]
                    }
                    return false
                }
            };
            var a = {
                horizontal: false,
                inline: false,
                color: false,
                format: false,
                input: "input",
                container: false,
                component: ".add-on, .input-group-addon",
                fallbackColor: false,
                fallbackFormat: "hex",
                hexNumberSignPrefix: true,
                sliders: {
                    saturation: {
                        maxLeft: 100,
                        maxTop: 100,
                        callLeft: "setSaturation",
                        callTop: "setBrightness"
                    },
                    hue: {
                        maxLeft: 0,
                        maxTop: 100,
                        callLeft: false,
                        callTop: "setHue"
                    },
                    alpha: {
                        maxLeft: 0,
                        maxTop: 100,
                        callLeft: false,
                        callTop: "setAlpha"
                    }
                },
                slidersHorz: {
                    saturation: {
                        maxLeft: 100,
                        maxTop: 100,
                        callLeft: "setSaturation",
                        callTop: "setBrightness"
                    },
                    hue: {
                        maxLeft: 100,
                        maxTop: 0,
                        callLeft: "setHue",
                        callTop: false
                    },
                    alpha: {
                        maxLeft: 100,
                        maxTop: 0,
                        callLeft: "setAlpha",
                        callTop: false
                    }
                },
                template: '<div class="colorpicker dropdown-menu">' + '<div class="colorpicker-saturation"><i><b></b></i></div>' + '<div class="colorpicker-hue"><i></i></div>' + '<div class="colorpicker-alpha"><i></i></div>' + '<div class="colorpicker-color"><div /></div>' + '<div class="colorpicker-selectors"></div>' + "</div>",
                align: "right",
                customClass: null,
                colorSelectors: null
            };
            var s = function (e, t) {
                this.element = u(e).addClass("colorpicker-element");
                this.options = u.extend(true, {}, a, this.element.data(), t);
                this.component = this.options.component;
                this.component = this.component !== false ? this.element.find(this.component) : false;
                if (this.component && this.component.length === 0) {
                    this.component = false
                }
                this.container = this.options.container === true ? this.element : this.options.container;
                this.container = this.container !== false ? u(this.container) : false;
                this.input = this.element.is("input") ? this.element : this.options.input ? this.element.find(this.options.input) : false;
                if (this.input && this.input.length === 0) {
                    this.input = false
                }
                this.color = this.createColor(this.options.color !== false ? this.options.color : this.getValue());
                this.format = this.options.format !== false ? this.options.format : this.color.origFormat;
                if (this.options.color !== false) {
                    this.updateInput(this.color);
                    this.updateData(this.color)
                }
                this.disabled = false;
                var n = this.picker = u(this.options.template);
                if (this.options.customClass) {
                    n.addClass(this.options.customClass)
                }
                if (this.options.inline) {
                    n.addClass("colorpicker-inline colorpicker-visible")
                } else {
                    n.addClass("colorpicker-hidden")
                }
                if (this.options.horizontal) {
                    n.addClass("colorpicker-horizontal")
                }
                if (["rgba", "hsla", "alias"].indexOf(this.format) !== -1 || this.options.format === false || this.getValue() === "transparent") {
                    n.addClass("colorpicker-with-alpha")
                }
                if (this.options.align === "right") {
                    n.addClass("colorpicker-right")
                }
                if (this.options.inline === true) {
                    n.addClass("colorpicker-no-arrow")
                }
                if (this.options.colorSelectors) {
                    var i = this,
                        r = i.picker.find(".colorpicker-selectors");
                    if (r.length > 0) {
                        u.each(this.options.colorSelectors, function (e, t) {
                            var n = u("<i />").addClass("colorpicker-selectors-color").css("background-color", t).data("class", e).data("alias", e);
                            n.on("mousedown.colorpicker touchstart.colorpicker", function (e) {
                                e.preventDefault();
                                i.setValue(i.format === "alias" ? u(this).data("alias") : u(this).css("background-color"))
                            });
                            r.append(n)
                        });
                        r.show().addClass("colorpicker-visible")
                    }
                }
                n.on("mousedown.colorpicker touchstart.colorpicker", u.proxy(function (e) {
                    if (e.target === e.currentTarget) {
                        e.preventDefault()
                    }
                }, this));
                n.find(".colorpicker-saturation, .colorpicker-hue, .colorpicker-alpha").on("mousedown.colorpicker touchstart.colorpicker", u.proxy(this.mousedown, this));
                n.appendTo(this.container ? this.container : u("body"));
                if (this.input !== false) {
                    this.input.on({
                        "keyup.colorpicker": u.proxy(this.keyup, this)
                    });
                    this.input.on({
                        "input.colorpicker": u.proxy(this.change, this)
                    });
                    if (this.component === false) {
                        this.element.on({
                            "focus.colorpicker": u.proxy(this.show, this)
                        })
                    }
                    if (this.options.inline === false) {
                        this.element.on({
                            "focusout.colorpicker": u.proxy(this.hide, this)
                        })
                    }
                }
                if (this.component !== false) {
                    this.component.on({
                        "click.colorpicker": u.proxy(this.show, this)
                    })
                }
                if (this.input === false && this.component === false) {
                    this.element.on({
                        "click.colorpicker": u.proxy(this.show, this)
                    })
                }
                if (this.input !== false && this.component !== false && this.input.attr("type") === "color") {
                    this.input.on({
                        "click.colorpicker": u.proxy(this.show, this),
                        "focus.colorpicker": u.proxy(this.show, this)
                    })
                }
                this.update();
                u(u.proxy(function () {
                    this.element.trigger("create")
                }, this))
            };
            s.Color = o;
            s.prototype = {
                constructor: s,
                destroy: function () {
                    this.picker.remove();
                    this.element.removeData("colorpicker", "color").off(".colorpicker");
                    if (this.input !== false) {
                        this.input.off(".colorpicker")
                    }
                    if (this.component !== false) {
                        this.component.off(".colorpicker")
                    }
                    this.element.removeClass("colorpicker-element");
                    this.element.trigger({
                        type: "destroy"
                    })
                },
                reposition: function () {
                    if (this.options.inline !== false || this.options.container) {
                        return false
                    }
                    var e = this.container && this.container[0] !== window.document.body ? "position" : "offset";
                    var t = this.component || this.element;
                    var n = t[e]();
                    if (this.options.align === "right") {
                        n.left -= this.picker.outerWidth() - t.outerWidth()
                    }
                    this.picker.css({
                        top: n.top + t.outerHeight(),
                        left: n.left
                    })
                },
                show: function (e) {
                    if (this.isDisabled()) {
                        return
                    }
                    this.picker.addClass("colorpicker-visible").removeClass("colorpicker-hidden");
                    this.reposition();
                    u(window).on("resize.colorpicker", u.proxy(this.reposition, this));
                    if (e && (!this.hasInput() || this.input.attr("type") === "color")) {
                        if (e.stopPropagation && e.preventDefault) {
                            e.stopPropagation();
                            e.preventDefault()
                        }
                    }
                    if ((this.component || !this.input) && this.options.inline === false) {
                        u(window.document).on({
                            "mousedown.colorpicker": u.proxy(this.hide, this)
                        })
                    }
                    this.element.trigger({
                        type: "showPicker",
                        color: this.color
                    })
                },
                hide: function (e) {
                    if (typeof e !== "undefined" && e.target) {
                        if (u(e.currentTarget).parents(".colorpicker").length > 0 || u(e.target).parents(".colorpicker").length > 0) {
                            return false
                        }
                    }
                    this.picker.addClass("colorpicker-hidden").removeClass("colorpicker-visible");
                    u(window).off("resize.colorpicker", this.reposition);
                    u(window.document).off({
                        "mousedown.colorpicker": this.hide
                    });
                    this.update();
                    this.element.trigger({
                        type: "hidePicker",
                        color: this.color
                    })
                },
                updateData: function (e) {
                    e = e || this.color.toString(false, this.format);
                    this.element.data("color", e);
                    return e
                },
                updateInput: function (e) {
                    e = e || this.color.toString(false, this.format);
                    if (this.input !== false) {
                        this.input.prop("value", e);
                        this.input.trigger("change")
                    }
                    return e
                },
                updatePicker: function (e) {
                    if (typeof e !== "undefined") {
                        this.color = this.createColor(e)
                    }
                    var t = this.options.horizontal === false ? this.options.sliders : this.options.slidersHorz;
                    var n = this.picker.find("i");
                    if (n.length === 0) {
                        return
                    }
                    if (this.options.horizontal === false) {
                        t = this.options.sliders;
                        n.eq(1).css("top", t.hue.maxTop * (1 - this.color.value.h)).end().eq(2).css("top", t.alpha.maxTop * (1 - this.color.value.a))
                    } else {
                        t = this.options.slidersHorz;
                        n.eq(1).css("left", t.hue.maxLeft * (1 - this.color.value.h)).end().eq(2).css("left", t.alpha.maxLeft * (1 - this.color.value.a))
                    }
                    n.eq(0).css({
                        top: t.saturation.maxTop - this.color.value.b * t.saturation.maxTop,
                        left: this.color.value.s * t.saturation.maxLeft
                    });
                    this.picker.find(".colorpicker-saturation").css("backgroundColor", this.color.toHex(true, this.color.value.h, 1, 1, 1));
                    this.picker.find(".colorpicker-alpha").css("backgroundColor", this.color.toHex(true));
                    this.picker.find(".colorpicker-color, .colorpicker-color div").css("backgroundColor", this.color.toString(true, this.format));
                    return e
                },
                updateComponent: function (e) {
                    var t;
                    if (typeof e !== "undefined") {
                        t = this.createColor(e)
                    } else {
                        t = this.color
                    }
                    if (this.component !== false) {
                        var n = this.component.find("i").eq(0);
                        if (n.length > 0) {
                            n.css({
                                backgroundColor: t.toString(true, this.format)
                            })
                        } else {
                            this.component.css({
                                backgroundColor: t.toString(true, this.format)
                            })
                        }
                    }
                    return t.toString(false, this.format)
                },
                update: function (e) {
                    var t;
                    if (this.getValue(false) !== false || e === true) {
                        t = this.updateComponent();
                        this.updateInput(t);
                        this.updateData(t);
                        this.updatePicker()
                    }
                    return t
                },
                setValue: function (e) {
                    this.color = this.createColor(e);
                    this.update(true);
                    this.element.trigger({
                        type: "changeColor",
                        color: this.color,
                        value: e
                    })
                },
                createColor: function (e) {
                    return new o(e ? e : null, this.options.colorSelectors, this.options.fallbackColor ? this.options.fallbackColor : this.color, this.options.fallbackFormat, this.options.hexNumberSignPrefix)
                },
                getValue: function (e) {
                    e = typeof e === "undefined" ? this.options.fallbackColor : e;
                    var t;
                    if (this.hasInput()) {
                        t = this.input.val()
                    } else {
                        t = this.element.data("color")
                    }
                    if (t === undefined || t === "" || t === null) {
                        t = e
                    }
                    return t
                },
                hasInput: function () {
                    return this.input !== false
                },
                isDisabled: function () {
                    return this.disabled
                },
                disable: function () {
                    if (this.hasInput()) {
                        this.input.prop("disabled", true)
                    }
                    this.disabled = true;
                    this.element.trigger({
                        type: "disable",
                        color: this.color,
                        value: this.getValue()
                    });
                    return true
                },
                enable: function () {
                    if (this.hasInput()) {
                        this.input.prop("disabled", false)
                    }
                    this.disabled = false;
                    this.element.trigger({
                        type: "enable",
                        color: this.color,
                        value: this.getValue()
                    });
                    return true
                },
                currentSlider: null,
                mousePointer: {
                    left: 0,
                    top: 0
                },
                mousedown: function (e) {
                    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
                        e.pageX = e.originalEvent.touches[0].pageX;
                        e.pageY = e.originalEvent.touches[0].pageY
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    var t = u(e.target);
                    var n = t.closest("div");
                    var i = this.options.horizontal ? this.options.slidersHorz : this.options.sliders;
                    if (!n.is(".colorpicker")) {
                        if (n.is(".colorpicker-saturation")) {
                            this.currentSlider = u.extend({}, i.saturation)
                        } else if (n.is(".colorpicker-hue")) {
                            this.currentSlider = u.extend({}, i.hue)
                        } else if (n.is(".colorpicker-alpha")) {
                            this.currentSlider = u.extend({}, i.alpha)
                        } else {
                            return false
                        }
                        var r = n.offset();
                        this.currentSlider.guide = n.find("i")[0].style;
                        this.currentSlider.left = e.pageX - r.left;
                        this.currentSlider.top = e.pageY - r.top;
                        this.mousePointer = {
                            left: e.pageX,
                            top: e.pageY
                        };
                        u(window.document).on({
                            "mousemove.colorpicker": u.proxy(this.mousemove, this),
                            "touchmove.colorpicker": u.proxy(this.mousemove, this),
                            "mouseup.colorpicker": u.proxy(this.mouseup, this),
                            "touchend.colorpicker": u.proxy(this.mouseup, this)
                        }).trigger("mousemove")
                    }
                    return false
                },
                mousemove: function (e) {
                    if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
                        e.pageX = e.originalEvent.touches[0].pageX;
                        e.pageY = e.originalEvent.touches[0].pageY
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    var t = Math.max(0, Math.min(this.currentSlider.maxLeft, this.currentSlider.left + ((e.pageX || this.mousePointer.left) - this.mousePointer.left)));
                    var n = Math.max(0, Math.min(this.currentSlider.maxTop, this.currentSlider.top + ((e.pageY || this.mousePointer.top) - this.mousePointer.top)));
                    this.currentSlider.guide.left = t + "px";
                    this.currentSlider.guide.top = n + "px";
                    if (this.currentSlider.callLeft) {
                        this.color[this.currentSlider.callLeft].call(this.color, t / this.currentSlider.maxLeft)
                    }
                    if (this.currentSlider.callTop) {
                        this.color[this.currentSlider.callTop].call(this.color, n / this.currentSlider.maxTop)
                    }
                    if (this.options.format === false && (this.currentSlider.callTop === "setAlpha" || this.currentSlider.callLeft === "setAlpha")) {
                        if (this.color.value.a !== 1) {
                            this.format = "rgba";
                            this.color.origFormat = "rgba"
                        } else {
                            this.format = "hex";
                            this.color.origFormat = "hex"
                        }
                    }
                    this.update(true);
                    this.element.trigger({
                        type: "changeColor",
                        color: this.color
                    });
                    return false
                },
                mouseup: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    u(window.document).off({
                        "mousemove.colorpicker": this.mousemove,
                        "touchmove.colorpicker": this.mousemove,
                        "mouseup.colorpicker": this.mouseup,
                        "touchend.colorpicker": this.mouseup
                    });
                    return false
                },
                change: function (e) {
                    this.color = this.createColor(this.input.val());
                    if (this.color.origFormat && this.options.format === false) {
                        this.format = this.color.origFormat
                    }
                    if (this.getValue(false) !== false) {
                        this.updateData();
                        this.updateComponent();
                        this.updatePicker()
                    }
                    this.element.trigger({
                        type: "changeColor",
                        color: this.color,
                        value: this.input.val()
                    })
                },
                keyup: function (e) {
                    if (e.keyCode === 38) {
                        if (this.color.value.a < 1) {
                            this.color.value.a = Math.round((this.color.value.a + .01) * 100) / 100
                        }
                        this.update(true)
                    } else if (e.keyCode === 40) {
                        if (this.color.value.a > 0) {
                            this.color.value.a = Math.round((this.color.value.a - .01) * 100) / 100
                        }
                        this.update(true)
                    }
                    this.element.trigger({
                        type: "changeColor",
                        color: this.color,
                        value: this.input.val()
                    })
                }
            };
            u.colorpicker = s;
            u.fn.colorpicker = function (i) {
                var r = Array.prototype.slice.call(arguments, 1),
                    e = this.length === 1,
                    o = null;
                var t = this.each(function () {
                    var e = u(this),
                        t = e.data("colorpicker"),
                        n = typeof i === "object" ? i : {};
                    if (!t) {
                        t = new s(this, n);
                        e.data("colorpicker", t)
                    }
                    if (typeof i === "string") {
                        if (u.isFunction(t[i])) {
                            o = t[i].apply(t, r)
                        } else {
                            if (r.length) {
                                t[i] = r[0]
                            }
                            o = t[i]
                        }
                    } else {
                        o = e
                    }
                });
                return e ? o : t
            };
            u.fn.colorpicker.constructor = s
        })
    }, {
        jquery: 37
    }],
    9: [function (e, t, n) {
        (function (v) {
            "use strict";
            var o = {
                tagClass: function (e) {
                    return "label label-info"
                },
                itemValue: function (e) {
                    return e ? e.toString() : e
                },
                itemText: function (e) {
                    return this.itemValue(e)
                },
                itemTitle: function (e) {
                    return null
                },
                freeInput: true,
                addOnBlur: true,
                maxTags: undefined,
                maxChars: undefined,
                confirmKeys: [13, 44],
                delimiter: ",",
                delimiterRegex: null,
                cancelConfirmKeysOnEmpty: false,
                onTagExists: function (e, t) {
                    t.hide().fadeIn()
                },
                trimValue: false,
                allowDuplicates: false
            };

            function a(e, t) {
                this.isInit = true;
                this.itemsArray = [];
                this.$element = v(e);
                this.$element.hide();
                this.isSelect = e.tagName === "SELECT";
                this.multiple = this.isSelect && e.hasAttribute("multiple");
                this.objectItems = t && t.itemValue;
                this.placeholderText = e.hasAttribute("placeholder") ? this.$element.attr("placeholder") : "";
                this.inputSize = Math.max(1, this.placeholderText.length);
                this.$container = v('<div class="bootstrap-tagsinput"></div>');
                this.$input = v('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);
                this.$element.before(this.$container);
                this.build(t);
                this.isInit = false
            }
            a.prototype = {
                constructor: a,
                add: function (e, t, n) {
                    var i = this;
                    if (i.options.maxTags && i.itemsArray.length >= i.options.maxTags) return;
                    if (e !== false && !e) return;
                    if (typeof e === "string" && i.options.trimValue) {
                        e = v.trim(e)
                    }
                    if (typeof e === "object" && !i.objectItems) throw "Can't add objects when itemValue option is not set";
                    if (e.toString().match(/^\s*$/)) return;
                    if (i.isSelect && !i.multiple && i.itemsArray.length > 0) i.remove(i.itemsArray[0]);
                    if (typeof e === "string" && this.$element[0].tagName === "INPUT") {
                        var r = i.options.delimiterRegex ? i.options.delimiterRegex : i.options.delimiter;
                        var o = e.split(r);
                        if (o.length > 1) {
                            for (var a = 0; a < o.length; a++) {
                                this.add(o[a], true)
                            }
                            if (!t) i.pushVal();
                            return
                        }
                    }
                    var s = i.options.itemValue(e),
                        l = i.options.itemText(e),
                        u = i.options.tagClass(e),
                        c = i.options.itemTitle(e);
                    var f = v.grep(i.itemsArray, function (e) {
                        return i.options.itemValue(e) === s
                    })[0];
                    if (f && !i.options.allowDuplicates) {
                        if (i.options.onTagExists) {
                            var p = v(".tag", i.$container).filter(function () {
                                return v(this).data("item") === f
                            });
                            i.options.onTagExists(e, p)
                        }
                        return
                    }
                    if (i.items().toString().length + e.length + 1 > i.options.maxInputLength) return;
                    var d = v.Event("beforeItemAdd", {
                        item: e,
                        cancel: false,
                        options: n
                    });
                    i.$element.trigger(d);
                    if (d.cancel) return;
                    i.itemsArray.push(e);
                    var h = v('<span class="tag ' + _(u) + (c !== null ? '" title="' + c : "") + '">' + _(l) + '<span data-role="remove"></span></span>');
                    h.data("item", e);
                    i.findInputWrapper().before(h);
                    h.after(" ");
                    var g = v('option[value="' + encodeURIComponent(s) + '"]', i.$element).length || v('option[value="' + _(s) + '"]', i.$element).length;
                    if (i.isSelect && !g) {
                        var m = v("<option selected>" + _(l) + "</option>");
                        m.data("item", e);
                        m.attr("value", s);
                        i.$element.append(m)
                    }
                    if (!t) i.pushVal();
                    if (i.options.maxTags === i.itemsArray.length || i.items().toString().length === i.options.maxInputLength) i.$container.addClass("bootstrap-tagsinput-max");
                    if (v(".typeahead, .twitter-typeahead", i.$container).length) {
                        i.$input.typeahead("val", "")
                    }
                    if (this.isInit) {
                        i.$element.trigger(v.Event("itemAddedOnInit", {
                            item: e,
                            options: n
                        }))
                    } else {
                        i.$element.trigger(v.Event("itemAdded", {
                            item: e,
                            options: n
                        }))
                    }
                },
                remove: function (t, e, n) {
                    var i = this;
                    if (i.objectItems) {
                        if (typeof t === "object") t = v.grep(i.itemsArray, function (e) {
                            return i.options.itemValue(e) == i.options.itemValue(t)
                        });
                        else t = v.grep(i.itemsArray, function (e) {
                            return i.options.itemValue(e) == t
                        });
                        t = t[t.length - 1]
                    }
                    if (t) {
                        var r = v.Event("beforeItemRemove", {
                            item: t,
                            cancel: false,
                            options: n
                        });
                        i.$element.trigger(r);
                        if (r.cancel) return;
                        v(".tag", i.$container).filter(function () {
                            return v(this).data("item") === t
                        }).remove();
                        v("option", i.$element).filter(function () {
                            return v(this).data("item") === t
                        }).remove();
                        if (v.inArray(t, i.itemsArray) !== -1) i.itemsArray.splice(v.inArray(t, i.itemsArray), 1)
                    }
                    if (!e) i.pushVal();
                    if (i.options.maxTags > i.itemsArray.length) i.$container.removeClass("bootstrap-tagsinput-max");
                    i.$element.trigger(v.Event("itemRemoved", {
                        item: t,
                        options: n
                    }))
                },
                removeAll: function () {
                    var e = this;
                    v(".tag", e.$container).remove();
                    v("option", e.$element).remove();
                    while (e.itemsArray.length > 0) e.itemsArray.pop();
                    e.pushVal()
                },
                refresh: function () {
                    var a = this;
                    v(".tag", a.$container).each(function () {
                        var e = v(this),
                            t = e.data("item"),
                            n = a.options.itemValue(t),
                            i = a.options.itemText(t),
                            r = a.options.tagClass(t);
                        e.attr("class", null);
                        e.addClass("tag " + _(r));
                        e.contents().filter(function () {
                            return this.nodeType == 3
                        })[0].nodeValue = _(i);
                        if (a.isSelect) {
                            var o = v("option", a.$element).filter(function () {
                                return v(this).data("item") === t
                            });
                            o.attr("value", n)
                        }
                    })
                },
                items: function () {
                    return this.itemsArray
                },
                pushVal: function () {
                    var t = this,
                        e = v.map(t.items(), function (e) {
                            return t.options.itemValue(e).toString()
                        });
                    t.$element.val(e, true).trigger("change")
                },
                build: function (e) {
                    var c = this;
                    c.options = v.extend({}, o, e);
                    if (c.objectItems) c.options.freeInput = false;
                    s(c.options, "itemValue");
                    s(c.options, "itemText");
                    l(c.options, "tagClass");
                    if (c.options.typeahead) {
                        var i = c.options.typeahead || {};
                        l(i, "source");
                        c.$input.typeahead(v.extend({}, i, {
                            source: function (e, r) {
                                function t(e) {
                                    var t = [];
                                    for (var n = 0; n < e.length; n++) {
                                        var i = c.options.itemText(e[n]);
                                        o[i] = e[n];
                                        t.push(i)
                                    }
                                    r(t)
                                }
                                this.map = {};
                                var o = this.map,
                                    n = i.source(e);
                                if (v.isFunction(n.success)) {
                                    n.success(t)
                                } else if (v.isFunction(n.then)) {
                                    n.then(t)
                                } else {
                                    v.when(n).then(t)
                                }
                            },
                            updater: function (e) {
                                c.add(this.map[e]);
                                return this.map[e]
                            },
                            matcher: function (e) {
                                return e.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1
                            },
                            sorter: function (e) {
                                return e.sort()
                            },
                            highlighter: function (e) {
                                var t = new RegExp("(" + this.query + ")", "gi");
                                return e.replace(t, "<strong>$1</strong>")
                            }
                        }))
                    }
                    if (c.options.typeaheadjs) {
                        var t = null;
                        var n = {};
                        var r = c.options.typeaheadjs;
                        if (v.isArray(r)) {
                            t = r[0];
                            n = r[1]
                        } else {
                            n = r
                        }
                        c.$input.typeahead(t, n).on("typeahead:selected", v.proxy(function (e, t) {
                            if (n.valueKey) c.add(t[n.valueKey]);
                            else c.add(t);
                            c.$input.typeahead("val", "")
                        }, c))
                    }
                    c.$container.on("click", v.proxy(function (e) {
                        if (!c.$element.attr("disabled")) {
                            c.$input.removeAttr("disabled")
                        }
                        c.$input.focus()
                    }, c));
                    if (c.options.addOnBlur && c.options.freeInput) {
                        c.$input.on("focusout", v.proxy(function (e) {
                            if (v(".typeahead, .twitter-typeahead", c.$container).length === 0) {
                                c.add(c.$input.val());
                                c.$input.val("")
                            }
                        }, c))
                    }
                    c.$container.on("keydown", "input", v.proxy(function (e) {
                        var t = v(e.target),
                            n = c.findInputWrapper();
                        if (c.$element.attr("disabled")) {
                            c.$input.attr("disabled", "disabled");
                            return
                        }
                        switch (e.which) {
                            case 8:
                                if (f(t[0]) === 0) {
                                    var i = n.prev();
                                    if (i.length) {
                                        c.remove(i.data("item"))
                                    }
                                }
                                break;
                            case 46:
                                if (f(t[0]) === 0) {
                                    var r = n.next();
                                    if (r.length) {
                                        c.remove(r.data("item"))
                                    }
                                }
                                break;
                            case 37:
                                var o = n.prev();
                                if (t.val().length === 0 && o[0]) {
                                    o.before(n);
                                    t.focus()
                                }
                                break;
                            case 39:
                                var a = n.next();
                                if (t.val().length === 0 && a[0]) {
                                    a.after(n);
                                    t.focus()
                                }
                                break;
                            default:
                        }
                        var s = t.val().length,
                            l = Math.ceil(s / 5),
                            u = s + l + 1;
                        t.attr("size", Math.max(this.inputSize, t.val().length))
                    }, c));
                    c.$container.on("keypress", "input", v.proxy(function (e) {
                        var t = v(e.target);
                        if (c.$element.attr("disabled")) {
                            c.$input.attr("disabled", "disabled");
                            return
                        }
                        var n = t.val(),
                            i = c.options.maxChars && n.length >= c.options.maxChars;
                        if (c.options.freeInput && (u(e, c.options.confirmKeys) || i)) {
                            if (n.length !== 0) {
                                c.add(i ? n.substr(0, c.options.maxChars) : n);
                                t.val("")
                            }
                            if (c.options.cancelConfirmKeysOnEmpty === false) {
                                e.preventDefault()
                            }
                        }
                        var r = t.val().length,
                            o = Math.ceil(r / 5),
                            a = r + o + 1;
                        t.attr("size", Math.max(this.inputSize, t.val().length))
                    }, c));
                    c.$container.on("click", "[data-role=remove]", v.proxy(function (e) {
                        if (c.$element.attr("disabled")) {
                            return
                        }
                        c.remove(v(e.target).closest(".tag").data("item"))
                    }, c));
                    if (c.options.itemValue === o.itemValue) {
                        if (c.$element[0].tagName === "INPUT") {
                            c.add(c.$element.val())
                        } else {
                            v("option", c.$element).each(function () {
                                c.add(v(this).attr("value"), true)
                            })
                        }
                    }
                },
                destroy: function () {
                    var e = this;
                    e.$container.off("keypress", "input");
                    e.$container.off("click", "[role=remove]");
                    e.$container.remove();
                    e.$element.removeData("tagsinput");
                    e.$element.show()
                },
                focus: function () {
                    this.$input.focus()
                },
                input: function () {
                    return this.$input
                },
                findInputWrapper: function () {
                    var e = this.$input[0],
                        t = this.$container[0];
                    while (e && e.parentNode !== t) e = e.parentNode;
                    return v(e)
                }
            };
            v.fn.tagsinput = function (n, i, r) {
                var o = [];
                this.each(function () {
                    var e = v(this).data("tagsinput");
                    if (!e) {
                        e = new a(this, n);
                        v(this).data("tagsinput", e);
                        o.push(e);
                        if (this.tagName === "SELECT") {
                            v("option", v(this)).attr("selected", "selected")
                        }
                        v(this).val(v(this).val())
                    } else if (!n && !i) {
                        o.push(e)
                    } else if (e[n] !== undefined) {
                        if (e[n].length === 3 && r !== undefined) {
                            var t = e[n](i, null, r)
                        } else {
                            var t = e[n](i)
                        }
                        if (t !== undefined) o.push(t)
                    }
                });
                if (typeof n == "string") {
                    return o.length > 1 ? o : o[0]
                } else {
                    return o
                }
            };
            v.fn.tagsinput.Constructor = a;

            function s(e, t) {
                if (typeof e[t] !== "function") {
                    var n = e[t];
                    e[t] = function (e) {
                        return e[n]
                    }
                }
            }

            function l(e, t) {
                if (typeof e[t] !== "function") {
                    var n = e[t];
                    e[t] = function () {
                        return n
                    }
                }
            }
            var t = v("<div />");

            function _(e) {
                if (e) {
                    return t.text(e).html()
                } else {
                    return ""
                }
            }

            function f(e) {
                var t = 0;
                if (document.selection) {
                    e.focus();
                    var n = document.selection.createRange();
                    n.moveStart("character", -e.value.length);
                    t = n.text.length
                } else if (e.selectionStart || e.selectionStart == "0") {
                    t = e.selectionStart
                }
                return t
            }

            function u(o, e) {
                var a = false;
                v.each(e, function (e, t) {
                    if (typeof t === "number" && o.which === t) {
                        a = true;
                        return false
                    }
                    if (o.which === t.which) {
                        var n = !t.hasOwnProperty("altKey") || o.altKey === t.altKey,
                            i = !t.hasOwnProperty("shiftKey") || o.shiftKey === t.shiftKey,
                            r = !t.hasOwnProperty("ctrlKey") || o.ctrlKey === t.ctrlKey;
                        if (n && i && r) {
                            a = true;
                            return false
                        }
                    }
                });
                return a
            }
            v(function () {
                v("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput()
            })
        })(window.jQuery)
    }, {}],
    10: [function (i, r, o) {
        (function (e, t) {
            if (typeof define === "function" && define.amd) {
                define(["module", "select"], t)
            } else if (typeof o !== "undefined") {
                t(r, i("select"))
            } else {
                var n = {
                    exports: {}
                };
                t(n, e.select);
                e.clipboardAction = n.exports
            }
        })(this, function (e, t) {
            "use strict";
            var r = n(t);

            function n(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            var i = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
                return typeof e
            } : function (e) {
                return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            };

            function o(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function")
                }
            }
            var a = function () {
                function i(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || false;
                        i.configurable = true;
                        if ("value" in i) i.writable = true;
                        Object.defineProperty(e, i.key, i)
                    }
                }
                return function (e, t, n) {
                    if (t) i(e.prototype, t);
                    if (n) i(e, n);
                    return e
                }
            }();
            var s = function () {
                function t(e) {
                    o(this, t);
                    this.resolveOptions(e);
                    this.initSelection()
                }
                a(t, [{
                    key: "resolveOptions",
                    value: function e() {
                        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        this.action = t.action;
                        this.container = t.container;
                        this.emitter = t.emitter;
                        this.target = t.target;
                        this.text = t.text;
                        this.trigger = t.trigger;
                        this.selectedText = ""
                    }
                }, {
                    key: "initSelection",
                    value: function e() {
                        if (this.text) {
                            this.selectFake()
                        } else if (this.target) {
                            this.selectTarget()
                        }
                    }
                }, {
                    key: "selectFake",
                    value: function e() {
                        var t = this;
                        var n = document.documentElement.getAttribute("dir") == "rtl";
                        this.removeFake();
                        this.fakeHandlerCallback = function () {
                            return t.removeFake()
                        };
                        this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || true;
                        this.fakeElem = document.createElement("textarea");
                        this.fakeElem.style.fontSize = "12pt";
                        this.fakeElem.style.border = "0";
                        this.fakeElem.style.padding = "0";
                        this.fakeElem.style.margin = "0";
                        this.fakeElem.style.position = "absolute";
                        this.fakeElem.style[n ? "right" : "left"] = "-9999px";
                        var i = window.pageYOffset || document.documentElement.scrollTop;
                        this.fakeElem.style.top = i + "px";
                        this.fakeElem.setAttribute("readonly", "");
                        this.fakeElem.value = this.text;
                        this.container.appendChild(this.fakeElem);
                        this.selectedText = (0, r.default)(this.fakeElem);
                        this.copyText()
                    }
                }, {
                    key: "removeFake",
                    value: function e() {
                        if (this.fakeHandler) {
                            this.container.removeEventListener("click", this.fakeHandlerCallback);
                            this.fakeHandler = null;
                            this.fakeHandlerCallback = null
                        }
                        if (this.fakeElem) {
                            this.container.removeChild(this.fakeElem);
                            this.fakeElem = null
                        }
                    }
                }, {
                    key: "selectTarget",
                    value: function e() {
                        this.selectedText = (0, r.default)(this.target);
                        this.copyText()
                    }
                }, {
                    key: "copyText",
                    value: function e() {
                        var t = void 0;
                        try {
                            t = document.execCommand(this.action)
                        } catch (e) {
                            t = false
                        }
                        this.handleResult(t)
                    }
                }, {
                    key: "handleResult",
                    value: function e(t) {
                        this.emitter.emit(t ? "success" : "error", {
                            action: this.action,
                            text: this.selectedText,
                            trigger: this.trigger,
                            clearSelection: this.clearSelection.bind(this)
                        })
                    }
                }, {
                    key: "clearSelection",
                    value: function e() {
                        if (this.trigger) {
                            this.trigger.focus()
                        }
                        window.getSelection().removeAllRanges()
                    }
                }, {
                    key: "destroy",
                    value: function e() {
                        this.removeFake()
                    }
                }, {
                    key: "action",
                    set: function e() {
                        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "copy";
                        this._action = t;
                        if (this._action !== "copy" && this._action !== "cut") {
                            throw new Error('Invalid "action" value, use either "copy" or "cut"')
                        }
                    },
                    get: function e() {
                        return this._action
                    }
                }, {
                    key: "target",
                    set: function e(t) {
                        if (t !== undefined) {
                            if (t && (typeof t === "undefined" ? "undefined" : i(t)) === "object" && t.nodeType === 1) {
                                if (this.action === "copy" && t.hasAttribute("disabled")) {
                                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute')
                                }
                                if (this.action === "cut" && (t.hasAttribute("readonly") || t.hasAttribute("disabled"))) {
                                    throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')
                                }
                                this._target = t
                            } else {
                                throw new Error('Invalid "target" value, use a valid Element')
                            }
                        }
                    },
                    get: function e() {
                        return this._target
                    }
                }]);
                return t
            }();
            e.exports = s
        })
    }, {
        select: 43
    }],
    11: [function (i, r, o) {
        (function (e, t) {
            if (typeof define === "function" && define.amd) {
                define(["module", "./clipboard-action", "tiny-emitter", "good-listener"], t)
            } else if (typeof o !== "undefined") {
                t(r, i("./clipboard-action"), i("tiny-emitter"), i("good-listener"))
            } else {
                var n = {
                    exports: {}
                };
                t(n, e.clipboardAction, e.tinyEmitter, e.goodListener);
                e.clipboard = n.exports
            }
        })(this, function (e, t, n, i) {
            "use strict";
            var r = s(t);
            var o = s(n);
            var a = s(i);

            function s(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            var l = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
                return typeof e
            } : function (e) {
                return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            };

            function u(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function")
                }
            }
            var c = function () {
                function i(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || false;
                        i.configurable = true;
                        if ("value" in i) i.writable = true;
                        Object.defineProperty(e, i.key, i)
                    }
                }
                return function (e, t, n) {
                    if (t) i(e.prototype, t);
                    if (n) i(e, n);
                    return e
                }
            }();

            function f(e, t) {
                if (!e) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
                }
                return t && (typeof t === "object" || typeof t === "function") ? t : e
            }

            function p(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t)
                }
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t
            }
            var d = function (e) {
                p(i, e);

                function i(e, t) {
                    u(this, i);
                    var n = f(this, (i.__proto__ || Object.getPrototypeOf(i)).call(this));
                    n.resolveOptions(t);
                    n.listenClick(e);
                    return n
                }
                c(i, [{
                    key: "resolveOptions",
                    value: function e() {
                        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        this.action = typeof t.action === "function" ? t.action : this.defaultAction;
                        this.target = typeof t.target === "function" ? t.target : this.defaultTarget;
                        this.text = typeof t.text === "function" ? t.text : this.defaultText;
                        this.container = l(t.container) === "object" ? t.container : document.body
                    }
                }, {
                    key: "listenClick",
                    value: function e(t) {
                        var n = this;
                        this.listener = (0, a.default)(t, "click", function (e) {
                            return n.onClick(e)
                        })
                    }
                }, {
                    key: "onClick",
                    value: function e(t) {
                        var n = t.delegateTarget || t.currentTarget;
                        if (this.clipboardAction) {
                            this.clipboardAction = null
                        }
                        this.clipboardAction = new r.default({
                            action: this.action(n),
                            target: this.target(n),
                            text: this.text(n),
                            container: this.container,
                            trigger: n,
                            emitter: this
                        })
                    }
                }, {
                    key: "defaultAction",
                    value: function e(t) {
                        return h("action", t)
                    }
                }, {
                    key: "defaultTarget",
                    value: function e(t) {
                        var n = h("target", t);
                        if (n) {
                            return document.querySelector(n)
                        }
                    }
                }, {
                    key: "defaultText",
                    value: function e(t) {
                        return h("text", t)
                    }
                }, {
                    key: "destroy",
                    value: function e() {
                        this.listener.destroy();
                        if (this.clipboardAction) {
                            this.clipboardAction.destroy();
                            this.clipboardAction = null
                        }
                    }
                }], [{
                    key: "isSupported",
                    value: function e() {
                        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ["copy", "cut"];
                        var n = typeof t === "string" ? [t] : t;
                        var i = !!document.queryCommandSupported;
                        n.forEach(function (e) {
                            i = i && !!document.queryCommandSupported(e)
                        });
                        return i
                    }
                }]);
                return i
            }(o.default);

            function h(e, t) {
                var n = "data-clipboard-" + e;
                if (!t.hasAttribute(n)) {
                    return
                }
                return t.getAttribute(n)
            }
            e.exports = d
        })
    }, {
        "./clipboard-action": 10,
        "good-listener": 16,
        "tiny-emitter": 44
    }],
    12: [function (e, t, n) {
        var i = 9;
        if (typeof Element !== "undefined" && !Element.prototype.matches) {
            var r = Element.prototype;
            r.matches = r.matchesSelector || r.mozMatchesSelector || r.msMatchesSelector || r.oMatchesSelector || r.webkitMatchesSelector
        }

        function o(e, t) {
            while (e && e.nodeType !== i) {
                if (typeof e.matches === "function" && e.matches(t)) {
                    return e
                }
                e = e.parentNode
            }
        }
        t.exports = o
    }, {}],
    13: [function (e, t, n) {
        var r = e("./closest");

        function o(e, t, n, i, r) {
            var o = a.apply(this, arguments);
            e.addEventListener(n, o, r);
            return {
                destroy: function () {
                    e.removeEventListener(n, o, r)
                }
            }
        }

        function i(e, t, n, i, r) {
            if (typeof e.addEventListener === "function") {
                return o.apply(null, arguments)
            }
            if (typeof n === "function") {
                return o.bind(null, document).apply(null, arguments)
            }
            if (typeof e === "string") {
                e = document.querySelectorAll(e)
            }
            return Array.prototype.map.call(e, function (e) {
                return o(e, t, n, i, r)
            })
        }

        function a(t, n, e, i) {
            return function (e) {
                e.delegateTarget = r(e.target, n);
                if (e.delegateTarget) {
                    i.call(t, e)
                }
            }
        }
        t.exports = i
    }, {
        "./closest": 12
    }],
    14: [function (e, N, A) {
        (function () {
            var f = false;
            var e = this;
            var a = function (e) {
                if (e instanceof a) return e;
                if (!(this instanceof a)) return new a(e);
                this.EXIFwrapped = e
            };
            if (typeof A !== "undefined") {
                if (typeof N !== "undefined" && N.exports) {
                    A = N.exports = a
                }
                A.EXIF = a
            } else {
                e.EXIF = a
            }
            var u = a.Tags = {
                36864: "ExifVersion",
                40960: "FlashpixVersion",
                40961: "ColorSpace",
                40962: "PixelXDimension",
                40963: "PixelYDimension",
                37121: "ComponentsConfiguration",
                37122: "CompressedBitsPerPixel",
                37500: "MakerNote",
                37510: "UserComment",
                40964: "RelatedSoundFile",
                36867: "DateTimeOriginal",
                36868: "DateTimeDigitized",
                37520: "SubsecTime",
                37521: "SubsecTimeOriginal",
                37522: "SubsecTimeDigitized",
                33434: "ExposureTime",
                33437: "FNumber",
                34850: "ExposureProgram",
                34852: "SpectralSensitivity",
                34855: "ISOSpeedRatings",
                34856: "OECF",
                37377: "ShutterSpeedValue",
                37378: "ApertureValue",
                37379: "BrightnessValue",
                37380: "ExposureBias",
                37381: "MaxApertureValue",
                37382: "SubjectDistance",
                37383: "MeteringMode",
                37384: "LightSource",
                37385: "Flash",
                37396: "SubjectArea",
                37386: "FocalLength",
                41483: "FlashEnergy",
                41484: "SpatialFrequencyResponse",
                41486: "FocalPlaneXResolution",
                41487: "FocalPlaneYResolution",
                41488: "FocalPlaneResolutionUnit",
                41492: "SubjectLocation",
                41493: "ExposureIndex",
                41495: "SensingMethod",
                41728: "FileSource",
                41729: "SceneType",
                41730: "CFAPattern",
                41985: "CustomRendered",
                41986: "ExposureMode",
                41987: "WhiteBalance",
                41988: "DigitalZoomRation",
                41989: "FocalLengthIn35mmFilm",
                41990: "SceneCaptureType",
                41991: "GainControl",
                41992: "Contrast",
                41993: "Saturation",
                41994: "Sharpness",
                41995: "DeviceSettingDescription",
                41996: "SubjectDistanceRange",
                40965: "InteroperabilityIFDPointer",
                42016: "ImageUniqueID"
            };
            var c = a.TiffTags = {
                256: "ImageWidth",
                257: "ImageHeight",
                34665: "ExifIFDPointer",
                34853: "GPSInfoIFDPointer",
                40965: "InteroperabilityIFDPointer",
                258: "BitsPerSample",
                259: "Compression",
                262: "PhotometricInterpretation",
                274: "Orientation",
                277: "SamplesPerPixel",
                284: "PlanarConfiguration",
                530: "YCbCrSubSampling",
                531: "YCbCrPositioning",
                282: "XResolution",
                283: "YResolution",
                296: "ResolutionUnit",
                273: "StripOffsets",
                278: "RowsPerStrip",
                279: "StripByteCounts",
                513: "JPEGInterchangeFormat",
                514: "JPEGInterchangeFormatLength",
                301: "TransferFunction",
                318: "WhitePoint",
                319: "PrimaryChromaticities",
                529: "YCbCrCoefficients",
                532: "ReferenceBlackWhite",
                306: "DateTime",
                270: "ImageDescription",
                271: "Make",
                272: "Model",
                305: "Software",
                315: "Artist",
                33432: "Copyright"
            };
            var p = a.GPSTags = {
                0: "GPSVersionID",
                1: "GPSLatitudeRef",
                2: "GPSLatitude",
                3: "GPSLongitudeRef",
                4: "GPSLongitude",
                5: "GPSAltitudeRef",
                6: "GPSAltitude",
                7: "GPSTimeStamp",
                8: "GPSSatellites",
                9: "GPSStatus",
                10: "GPSMeasureMode",
                11: "GPSDOP",
                12: "GPSSpeedRef",
                13: "GPSSpeed",
                14: "GPSTrackRef",
                15: "GPSTrack",
                16: "GPSImgDirectionRef",
                17: "GPSImgDirection",
                18: "GPSMapDatum",
                19: "GPSDestLatitudeRef",
                20: "GPSDestLatitude",
                21: "GPSDestLongitudeRef",
                22: "GPSDestLongitude",
                23: "GPSDestBearingRef",
                24: "GPSDestBearing",
                25: "GPSDestDistanceRef",
                26: "GPSDestDistance",
                27: "GPSProcessingMethod",
                28: "GPSAreaInformation",
                29: "GPSDateStamp",
                30: "GPSDifferential"
            };
            var l = a.IFD1Tags = {
                256: "ImageWidth",
                257: "ImageHeight",
                258: "BitsPerSample",
                259: "Compression",
                262: "PhotometricInterpretation",
                273: "StripOffsets",
                274: "Orientation",
                277: "SamplesPerPixel",
                278: "RowsPerStrip",
                279: "StripByteCounts",
                282: "XResolution",
                283: "YResolution",
                284: "PlanarConfiguration",
                296: "ResolutionUnit",
                513: "JpegIFOffset",
                514: "JpegIFByteCount",
                529: "YCbCrCoefficients",
                530: "YCbCrSubSampling",
                531: "YCbCrPositioning",
                532: "ReferenceBlackWhite"
            };
            var d = a.StringValues = {
                ExposureProgram: {
                    0: "Not defined",
                    1: "Manual",
                    2: "Normal program",
                    3: "Aperture priority",
                    4: "Shutter priority",
                    5: "Creative program",
                    6: "Action program",
                    7: "Portrait mode",
                    8: "Landscape mode"
                },
                MeteringMode: {
                    0: "Unknown",
                    1: "Average",
                    2: "CenterWeightedAverage",
                    3: "Spot",
                    4: "MultiSpot",
                    5: "Pattern",
                    6: "Partial",
                    255: "Other"
                },
                LightSource: {
                    0: "Unknown",
                    1: "Daylight",
                    2: "Fluorescent",
                    3: "Tungsten (incandescent light)",
                    4: "Flash",
                    9: "Fine weather",
                    10: "Cloudy weather",
                    11: "Shade",
                    12: "Daylight fluorescent (D 5700 - 7100K)",
                    13: "Day white fluorescent (N 4600 - 5400K)",
                    14: "Cool white fluorescent (W 3900 - 4500K)",
                    15: "White fluorescent (WW 3200 - 3700K)",
                    17: "Standard light A",
                    18: "Standard light B",
                    19: "Standard light C",
                    20: "D55",
                    21: "D65",
                    22: "D75",
                    23: "D50",
                    24: "ISO studio tungsten",
                    255: "Other"
                },
                Flash: {
                    0: "Flash did not fire",
                    1: "Flash fired",
                    5: "Strobe return light not detected",
                    7: "Strobe return light detected",
                    9: "Flash fired, compulsory flash mode",
                    13: "Flash fired, compulsory flash mode, return light not detected",
                    15: "Flash fired, compulsory flash mode, return light detected",
                    16: "Flash did not fire, compulsory flash mode",
                    24: "Flash did not fire, auto mode",
                    25: "Flash fired, auto mode",
                    29: "Flash fired, auto mode, return light not detected",
                    31: "Flash fired, auto mode, return light detected",
                    32: "No flash function",
                    65: "Flash fired, red-eye reduction mode",
                    69: "Flash fired, red-eye reduction mode, return light not detected",
                    71: "Flash fired, red-eye reduction mode, return light detected",
                    73: "Flash fired, compulsory flash mode, red-eye reduction mode",
                    77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                    79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                    89: "Flash fired, auto mode, red-eye reduction mode",
                    93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                    95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
                },
                SensingMethod: {
                    1: "Not defined",
                    2: "One-chip color area sensor",
                    3: "Two-chip color area sensor",
                    4: "Three-chip color area sensor",
                    5: "Color sequential area sensor",
                    7: "Trilinear sensor",
                    8: "Color sequential linear sensor"
                },
                SceneCaptureType: {
                    0: "Standard",
                    1: "Landscape",
                    2: "Portrait",
                    3: "Night scene"
                },
                SceneType: {
                    1: "Directly photographed"
                },
                CustomRendered: {
                    0: "Normal process",
                    1: "Custom process"
                },
                WhiteBalance: {
                    0: "Auto white balance",
                    1: "Manual white balance"
                },
                GainControl: {
                    0: "None",
                    1: "Low gain up",
                    2: "High gain up",
                    3: "Low gain down",
                    4: "High gain down"
                },
                Contrast: {
                    0: "Normal",
                    1: "Soft",
                    2: "Hard"
                },
                Saturation: {
                    0: "Normal",
                    1: "Low saturation",
                    2: "High saturation"
                },
                Sharpness: {
                    0: "Normal",
                    1: "Soft",
                    2: "Hard"
                },
                SubjectDistanceRange: {
                    0: "Unknown",
                    1: "Macro",
                    2: "Close view",
                    3: "Distant view"
                },
                FileSource: {
                    3: "DSC"
                },
                Components: {
                    0: "",
                    1: "Y",
                    2: "Cb",
                    3: "Cr",
                    4: "R",
                    5: "G",
                    6: "B"
                }
            };

            function t(e, t, n) {
                if (e.addEventListener) {
                    e.addEventListener(t, n, false)
                } else if (e.attachEvent) {
                    e.attachEvent("on" + t, n)
                }
            }

            function r(e) {
                return !!e.exifdata
            }

            function s(e, t) {
                t = t || e.match(/^data\:([^\;]+)\;base64,/im)[1] || "";
                e = e.replace(/^data\:([^\;]+)\;base64,/gim, "");
                var n = atob(e);
                var i = n.length;
                var r = new ArrayBuffer(i);
                var o = new Uint8Array(r);
                for (var a = 0; a < i; a++) {
                    o[a] = n.charCodeAt(a)
                }
                return r
            }

            function h(e, t) {
                var n = new XMLHttpRequest;
                n.open("GET", e, true);
                n.responseType = "blob";
                n.onload = function (e) {
                    if (this.status == 200 || this.status === 0) {
                        t(this.response)
                    }
                };
                n.send()
            }

            function i(r, o) {
                function t(e) {
                    var t = g(e);
                    r.exifdata = t || {};
                    var n = m(e);
                    r.iptcdata = n || {};
                    if (a.isXmpEnabled) {
                        var i = k(e);
                        r.xmpdata = i || {}
                    }
                    if (o) {
                        o.call(r)
                    }
                }
                if (r.src) {
                    if (/^data\:/i.test(r.src)) {
                        var e = s(r.src);
                        t(e)
                    } else if (/^blob\:/i.test(r.src)) {
                        var n = new FileReader;
                        n.onload = function (e) {
                            t(e.target.result)
                        };
                        h(r.src, function (e) {
                            n.readAsArrayBuffer(e)
                        })
                    } else {
                        var i = new XMLHttpRequest;
                        i.onload = function () {
                            if (this.status == 200 || this.status === 0) {
                                t(i.response)
                            } else {
                                throw "Could not load image"
                            }
                            i = null
                        };
                        i.open("GET", r.src, true);
                        i.responseType = "arraybuffer";
                        i.send(null)
                    }
                } else if (self.FileReader && (r instanceof self.Blob || r instanceof self.File)) {
                    var n = new FileReader;
                    n.onload = function (e) {
                        if (f) console.log("Got file of length " + e.target.result.byteLength);
                        t(e.target.result)
                    };
                    n.readAsArrayBuffer(r)
                }
            }

            function g(e) {
                var t = new DataView(e);
                if (f) console.log("Got file of length " + e.byteLength);
                if (t.getUint8(0) != 255 || t.getUint8(1) != 216) {
                    if (f) console.log("Not a valid JPEG");
                    return false
                }
                var n = 2,
                    i = e.byteLength,
                    r;
                while (n < i) {
                    if (t.getUint8(n) != 255) {
                        if (f) console.log("Not a valid marker at offset " + n + ", found: " + t.getUint8(n));
                        return false
                    }
                    r = t.getUint8(n + 1);
                    if (f) console.log(r);
                    if (r == 225) {
                        if (f) console.log("Found 0xFFE1 marker");
                        return o(t, n + 4, t.getUint16(n + 2) - 2)
                    } else {
                        n += 2 + t.getUint16(n + 2)
                    }
                }
            }

            function m(e) {
                var t = new DataView(e);
                if (f) console.log("Got file of length " + e.byteLength);
                if (t.getUint8(0) != 255 || t.getUint8(1) != 216) {
                    if (f) console.log("Not a valid JPEG");
                    return false
                }
                var n = 2,
                    i = e.byteLength;
                var r = function (e, t) {
                    return e.getUint8(t) === 56 && e.getUint8(t + 1) === 66 && e.getUint8(t + 2) === 73 && e.getUint8(t + 3) === 77 && e.getUint8(t + 4) === 4 && e.getUint8(t + 5) === 4
                };
                while (n < i) {
                    if (r(t, n)) {
                        var o = t.getUint8(n + 7);
                        if (o % 2 !== 0) o += 1;
                        if (o === 0) {
                            o = 4
                        }
                        var a = n + 8 + o;
                        var s = t.getUint16(n + 6 + o);
                        return _(e, a, s);
                        break
                    }
                    n++
                }
            }
            var v = {
                120: "caption",
                110: "credit",
                25: "keywords",
                55: "dateCreated",
                80: "byline",
                85: "bylineTitle",
                122: "captionWriter",
                105: "headline",
                116: "copyright",
                15: "category"
            };

            function _(e, t, n) {
                var i = new DataView(e);
                var r = {};
                var o, a, s, l, u;
                var c = t;
                while (c < t + n) {
                    if (i.getUint8(c) === 28 && i.getUint8(c + 1) === 2) {
                        l = i.getUint8(c + 2);
                        if (l in v) {
                            s = i.getInt16(c + 3);
                            u = s + 5;
                            a = v[l];
                            o = E(i, c + 5, s);
                            if (r.hasOwnProperty(a)) {
                                if (r[a] instanceof Array) {
                                    r[a].push(o)
                                } else {
                                    r[a] = [r[a], o]
                                }
                            } else {
                                r[a] = o
                            }
                        }
                    }
                    c++
                }
                return r
            }

            function y(e, t, n, i, r) {
                var o = e.getUint16(n, !r),
                    a = {},
                    s, l, u;
                for (u = 0; u < o; u++) {
                    s = n + u * 12 + 2;
                    l = i[e.getUint16(s, !r)];
                    if (!l && f) console.log("Unknown tag: " + e.getUint16(s, !r));
                    a[l] = b(e, s, t, n, r)
                }
                return a
            }

            function b(e, t, n, i, r) {
                var o = e.getUint16(t + 2, !r),
                    a = e.getUint32(t + 4, !r),
                    s = e.getUint32(t + 8, !r) + n,
                    l, u, c, f, p, d;
                switch (o) {
                    case 1:
                    case 7:
                        if (a == 1) {
                            return e.getUint8(t + 8, !r)
                        } else {
                            l = a > 4 ? s : t + 8;
                            u = [];
                            for (f = 0; f < a; f++) {
                                u[f] = e.getUint8(l + f)
                            }
                            return u
                        }
                        case 2:
                            l = a > 4 ? s : t + 8;
                            return E(e, l, a - 1);
                        case 3:
                            if (a == 1) {
                                return e.getUint16(t + 8, !r)
                            } else {
                                l = a > 2 ? s : t + 8;
                                u = [];
                                for (f = 0; f < a; f++) {
                                    u[f] = e.getUint16(l + 2 * f, !r)
                                }
                                return u
                            }
                            case 4:
                                if (a == 1) {
                                    return e.getUint32(t + 8, !r)
                                } else {
                                    u = [];
                                    for (f = 0; f < a; f++) {
                                        u[f] = e.getUint32(s + 4 * f, !r)
                                    }
                                    return u
                                }
                                case 5:
                                    if (a == 1) {
                                        p = e.getUint32(s, !r);
                                        d = e.getUint32(s + 4, !r);
                                        c = new Number(p / d);
                                        c.numerator = p;
                                        c.denominator = d;
                                        return c
                                    } else {
                                        u = [];
                                        for (f = 0; f < a; f++) {
                                            p = e.getUint32(s + 8 * f, !r);
                                            d = e.getUint32(s + 4 + 8 * f, !r);
                                            u[f] = new Number(p / d);
                                            u[f].numerator = p;
                                            u[f].denominator = d
                                        }
                                        return u
                                    }
                                    case 9:
                                        if (a == 1) {
                                            return e.getInt32(t + 8, !r)
                                        } else {
                                            u = [];
                                            for (f = 0; f < a; f++) {
                                                u[f] = e.getInt32(s + 4 * f, !r)
                                            }
                                            return u
                                        }
                                        case 10:
                                            if (a == 1) {
                                                return e.getInt32(s, !r) / e.getInt32(s + 4, !r)
                                            } else {
                                                u = [];
                                                for (f = 0; f < a; f++) {
                                                    u[f] = e.getInt32(s + 8 * f, !r) / e.getInt32(s + 4 + 8 * f, !r)
                                                }
                                                return u
                                            }
                }
            }

            function x(e, t, n) {
                var i = e.getUint16(t, !n);
                return e.getUint32(t + 2 + i * 12, !n)
            }

            function w(e, t, n, i) {
                var r = x(e, t + n, i);
                if (!r) {
                    return {}
                } else if (r > e.byteLength) {
                    return {}
                }
                var o = y(e, t, t + r, l, i);
                if (o["Compression"]) {
                    switch (o["Compression"]) {
                        case 6:
                            if (o.JpegIFOffset && o.JpegIFByteCount) {
                                var a = t + o.JpegIFOffset;
                                var s = o.JpegIFByteCount;
                                o["blob"] = new Blob([new Uint8Array(e.buffer, a, s)], {
                                    type: "image/jpeg"
                                })
                            }
                            break;
                        case 1:
                            console.log("Thumbnail image format is TIFF, which is not implemented.");
                            break;
                        default:
                            console.log("Unknown thumbnail image format '%s'", o["Compression"])
                    }
                } else if (o["PhotometricInterpretation"] == 2) {
                    console.log("Thumbnail image format is RGB, which is not implemented.")
                }
                return o
            }

            function E(e, t, i) {
                var r = "";
                for (n = t; n < t + i; n++) {
                    r += String.fromCharCode(e.getUint8(n))
                }
                return r
            }

            function o(e, t) {
                if (E(e, t, 4) != "Exif") {
                    if (f) console.log("Not valid EXIF data! " + E(e, t, 4));
                    return false
                }
                var n, i, r, o, a, s = t + 6;
                if (e.getUint16(s) == 18761) {
                    n = false
                } else if (e.getUint16(s) == 19789) {
                    n = true
                } else {
                    if (f) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
                    return false
                }
                if (e.getUint16(s + 2, !n) != 42) {
                    if (f) console.log("Not valid TIFF data! (no 0x002A)");
                    return false
                }
                var l = e.getUint32(s + 4, !n);
                if (l < 8) {
                    if (f) console.log("Not valid TIFF data! (First offset less than 8)", e.getUint32(s + 4, !n));
                    return false
                }
                i = y(e, s, s + l, c, n);
                if (i.ExifIFDPointer) {
                    o = y(e, s, s + i.ExifIFDPointer, u, n);
                    for (r in o) {
                        switch (r) {
                            case "LightSource":
                            case "Flash":
                            case "MeteringMode":
                            case "ExposureProgram":
                            case "SensingMethod":
                            case "SceneCaptureType":
                            case "SceneType":
                            case "CustomRendered":
                            case "WhiteBalance":
                            case "GainControl":
                            case "Contrast":
                            case "Saturation":
                            case "Sharpness":
                            case "SubjectDistanceRange":
                            case "FileSource":
                                o[r] = d[r][o[r]];
                                break;
                            case "ExifVersion":
                            case "FlashpixVersion":
                                o[r] = String.fromCharCode(o[r][0], o[r][1], o[r][2], o[r][3]);
                                break;
                            case "ComponentsConfiguration":
                                o[r] = d.Components[o[r][0]] + d.Components[o[r][1]] + d.Components[o[r][2]] + d.Components[o[r][3]];
                                break
                        }
                        i[r] = o[r]
                    }
                }
                if (i.GPSInfoIFDPointer) {
                    a = y(e, s, s + i.GPSInfoIFDPointer, p, n);
                    for (r in a) {
                        switch (r) {
                            case "GPSVersionID":
                                a[r] = a[r][0] + "." + a[r][1] + "." + a[r][2] + "." + a[r][3];
                                break
                        }
                        i[r] = a[r]
                    }
                }
                i["thumbnail"] = w(e, s, l, n);
                return i
            }

            function k(e) {
                if (!("DOMParser" in self)) {
                    return
                }
                var t = new DataView(e);
                if (f) console.log("Got file of length " + e.byteLength);
                if (t.getUint8(0) != 255 || t.getUint8(1) != 216) {
                    if (f) console.log("Not a valid JPEG");
                    return false
                }
                var n = 2,
                    i = e.byteLength,
                    r = new DOMParser;
                while (n < i - 4) {
                    if (E(t, n, 4) == "http") {
                        var o = n - 1;
                        var a = t.getUint16(n - 2) - 1;
                        var s = E(t, o, a);
                        var l = s.indexOf("xmpmeta>") + 8;
                        s = s.substring(s.indexOf("<x:xmpmeta"), l);
                        var u = s.indexOf("x:xmpmeta") + 10;
                        s = s.slice(0, u) + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" ' + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" ' + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" ' + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" ' + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" ' + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" ' + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" ' + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" ' + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" ' + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' + s.slice(u);
                        var c = r.parseFromString(s, "text/xml");
                        return T(c)
                    } else {
                        n++
                    }
                }
            }

            function S(e) {
                var t = {};
                if (e.nodeType == 1) {
                    if (e.attributes.length > 0) {
                        t["@attributes"] = {};
                        for (var n = 0; n < e.attributes.length; n++) {
                            var i = e.attributes.item(n);
                            t["@attributes"][i.nodeName] = i.nodeValue
                        }
                    }
                } else if (e.nodeType == 3) {
                    return e.nodeValue
                }
                if (e.hasChildNodes()) {
                    for (var r = 0; r < e.childNodes.length; r++) {
                        var o = e.childNodes.item(r);
                        var a = o.nodeName;
                        if (t[a] == null) {
                            t[a] = S(o)
                        } else {
                            if (t[a].push == null) {
                                var s = t[a];
                                t[a] = [];
                                t[a].push(s)
                            }
                            t[a].push(S(o))
                        }
                    }
                }
                return t
            }

            function T(e) {
                try {
                    var t = {};
                    if (e.children.length > 0) {
                        for (var n = 0; n < e.children.length; n++) {
                            var i = e.children.item(n);
                            var r = i.attributes;
                            for (var o in r) {
                                var a = r[o];
                                var s = a.nodeName;
                                var l = a.nodeValue;
                                if (s !== undefined) {
                                    t[s] = l
                                }
                            }
                            var u = i.nodeName;
                            if (typeof t[u] == "undefined") {
                                t[u] = S(i)
                            } else {
                                if (typeof t[u].push == "undefined") {
                                    var c = t[u];
                                    t[u] = [];
                                    t[u].push(c)
                                }
                                t[u].push(S(i))
                            }
                        }
                    } else {
                        t = e.textContent
                    }
                    return t
                } catch (e) {
                    console.log(e.message)
                }
            }
            a.enableXmp = function () {
                a.isXmpEnabled = true
            };
            a.disableXmp = function () {
                a.isXmpEnabled = false
            };
            a.getData = function (e, t) {
                if ((self.Image && e instanceof self.Image || self.HTMLImageElement && e instanceof self.HTMLImageElement) && !e.complete) return false;
                if (!r(e)) {
                    i(e, t)
                } else {
                    if (t) {
                        t.call(e)
                    }
                }
                return true
            };
            a.getTag = function (e, t) {
                if (!r(e)) return;
                return e.exifdata[t]
            };
            a.getIptcTag = function (e, t) {
                if (!r(e)) return;
                return e.iptcdata[t]
            };
            a.getAllTags = function (e) {
                if (!r(e)) return {};
                var t, n = e.exifdata,
                    i = {};
                for (t in n) {
                    if (n.hasOwnProperty(t)) {
                        i[t] = n[t]
                    }
                }
                return i
            };
            a.getAllIptcTags = function (e) {
                if (!r(e)) return {};
                var t, n = e.iptcdata,
                    i = {};
                for (t in n) {
                    if (n.hasOwnProperty(t)) {
                        i[t] = n[t]
                    }
                }
                return i
            };
            a.pretty = function (e) {
                if (!r(e)) return "";
                var t, n = e.exifdata,
                    i = "";
                for (t in n) {
                    if (n.hasOwnProperty(t)) {
                        if (typeof n[t] == "object") {
                            if (n[t] instanceof Number) {
                                i += t + " : " + n[t] + " [" + n[t].numerator + "/" + n[t].denominator + "]\r\n"
                            } else {
                                i += t + " : [" + n[t].length + " values]\r\n"
                            }
                        } else {
                            i += t + " : " + n[t] + "\r\n"
                        }
                    }
                }
                return i
            };
            a.readFromBinaryFile = function (e) {
                return g(e)
            };
            if (typeof define === "function" && define.amd) {
                define("exif-js", [], function () {
                    return a
                })
            }
        }).call(this)
    }, {}],
    15: [function (e, t, n) {
        n.node = function (e) {
            return e !== undefined && e instanceof HTMLElement && e.nodeType === 1
        };
        n.nodeList = function (e) {
            var t = Object.prototype.toString.call(e);
            return e !== undefined && (t === "[object NodeList]" || t === "[object HTMLCollection]") && "length" in e && (e.length === 0 || n.node(e[0]))
        };
        n.string = function (e) {
            return typeof e === "string" || e instanceof String
        };
        n.fn = function (e) {
            var t = Object.prototype.toString.call(e);
            return t === "[object Function]"
        }
    }, {}],
    16: [function (e, t, n) {
        var i = e("./is");
        var r = e("delegate");

        function o(e, t, n) {
            if (!e && !t && !n) {
                throw new Error("Missing required arguments")
            }
            if (!i.string(t)) {
                throw new TypeError("Second argument must be a String")
            }
            if (!i.fn(n)) {
                throw new TypeError("Third argument must be a Function")
            }
            if (i.node(e)) {
                return a(e, t, n)
            } else if (i.nodeList(e)) {
                return s(e, t, n)
            } else if (i.string(e)) {
                return l(e, t, n)
            } else {
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
            }
        }

        function a(e, t, n) {
            e.addEventListener(t, n);
            return {
                destroy: function () {
                    e.removeEventListener(t, n)
                }
            }
        }

        function s(e, t, n) {
            Array.prototype.forEach.call(e, function (e) {
                e.addEventListener(t, n)
            });
            return {
                destroy: function () {
                    Array.prototype.forEach.call(e, function (e) {
                        e.removeEventListener(t, n)
                    })
                }
            }
        }

        function l(e, t, n) {
            return r(document.body, e, t, n)
        }
        t.exports = o
    }, {
        "./is": 15,
        delegate: 13
    }],
    17: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var l = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
            return typeof e
        } : function (e) {
            return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };

        function u(e, t) {
            if (t && (typeof t === "undefined" ? "undefined" : l(t)) === "object") {
                var n = "",
                    i = encodeURIComponent;
                for (var r in t) {
                    n += "&" + i(r) + "=" + i(t[r])
                }
                if (!n) {
                    return e
                }
                e = e + (e.indexOf("?") !== -1 ? "&" : "?") + n.slice(1)
            }
            return e
        }

        function i(e, t, n, i, r) {
            if (i && (typeof i === "undefined" ? "undefined" : l(i)) === "object") {
                if (!r) {
                    i["_t"] = new Date
                }
                i = u("", i).slice(1)
            }
            if (t.queryStringParams) {
                e = u(e, t.queryStringParams)
            }
            try {
                var o;
                if (XMLHttpRequest) {
                    o = new XMLHttpRequest
                } else {
                    o = new ActiveXObject("MSXML2.XMLHTTP.3.0")
                }
                o.open(i ? "POST" : "GET", e, 1);
                if (!t.crossDomain) {
                    o.setRequestHeader("X-Requested-With", "XMLHttpRequest")
                }
                o.withCredentials = !!t.withCredentials;
                if (i) {
                    o.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                }
                if (o.overrideMimeType) {
                    o.overrideMimeType("application/json")
                }
                var a = t.customHeaders;
                if (a) {
                    for (var s in a) {
                        o.setRequestHeader(s, a[s])
                    }
                }
                o.onreadystatechange = function () {
                    o.readyState > 3 && n && n(o.responseText, o)
                };
                o.send(i)
            } catch (e) {
                console && console.log(e)
            }
        }
        n.default = i
    }, {}],
    18: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var i = function () {
            function i(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.enumerable = i.enumerable || false;
                    i.configurable = true;
                    if ("value" in i) i.writable = true;
                    Object.defineProperty(e, i.key, i)
                }
            }
            return function (e, t, n) {
                if (t) i(e.prototype, t);
                if (n) i(e, n);
                return e
            }
        }();
        var r = e("./utils.js");
        var o = u(r);
        var a = e("./ajax.js");
        var s = l(a);

        function l(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function u(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function c(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function f() {
            return {
                loadPath: "/locales/{{lng}}/{{ns}}.json",
                addPath: "/locales/add/{{lng}}/{{ns}}",
                allowMultiLoading: false,
                parse: JSON.parse,
                crossDomain: false,
                ajax: s.default
            }
        }
        var p = function () {
            function n(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                c(this, n);
                this.init(e, t);
                this.type = "backend"
            }
            i(n, [{
                key: "init",
                value: function e(t) {
                    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    this.services = t;
                    this.options = o.defaults(n, this.options || {}, f())
                }
            }, {
                key: "readMulti",
                value: function e(t, n, i) {
                    var r = this.options.loadPath;
                    if (typeof this.options.loadPath === "function") {
                        r = this.options.loadPath(t, n)
                    }
                    var o = this.services.interpolator.interpolate(r, {
                        lng: t.join("+"),
                        ns: n.join("+")
                    });
                    this.loadUrl(o, i)
                }
            }, {
                key: "read",
                value: function e(t, n, i) {
                    var r = this.options.loadPath;
                    if (typeof this.options.loadPath === "function") {
                        r = this.options.loadPath([t], [n])
                    }
                    var o = this.services.interpolator.interpolate(r, {
                        lng: t,
                        ns: n
                    });
                    this.loadUrl(o, i)
                }
            }, {
                key: "loadUrl",
                value: function e(r, o) {
                    var a = this;
                    this.options.ajax(r, this.options, function (e, t) {
                        if (t.status >= 500 && t.status < 600) return o("failed loading " + r, true);
                        if (t.status >= 400 && t.status < 500) return o("failed loading " + r, false);
                        var n = void 0,
                            i = void 0;
                        try {
                            n = a.options.parse(e, r)
                        } catch (e) {
                            i = "failed parsing " + r + " to json"
                        }
                        if (i) return o(i, false);
                        o(null, n)
                    })
                }
            }, {
                key: "create",
                value: function e(t, n, i, r) {
                    var o = this;
                    if (typeof t === "string") t = [t];
                    var a = {};
                    a[i] = r || "";
                    t.forEach(function (e) {
                        var t = o.services.interpolator.interpolate(o.options.addPath, {
                            lng: e,
                            ns: n
                        });
                        o.options.ajax(t, o.options, function (e, t) {}, a)
                    })
                }
            }]);
            return n
        }();
        p.type = "backend";
        n.default = p
    }, {
        "./ajax.js": 17,
        "./utils.js": 19
    }],
    19: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.defaults = a;
        n.extend = s;
        var i = [];
        var r = i.forEach;
        var o = i.slice;

        function a(n) {
            r.call(o.call(arguments, 1), function (e) {
                if (e) {
                    for (var t in e) {
                        if (n[t] === undefined) n[t] = e[t]
                    }
                }
            });
            return n
        }

        function s(n) {
            r.call(o.call(arguments, 1), function (e) {
                if (e) {
                    for (var t in e) {
                        n[t] = e[t]
                    }
                }
            });
            return n
        }
    }, {}],
    20: [function (e, t, n) {
        t.exports = e("./dist/commonjs/index.js").default
    }, {
        "./dist/commonjs/index.js": 18
    }],
    21: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var l = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) {
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        e[i] = n[i]
                    }
                }
            }
            return e
        };
        var c = function () {
            function n(e, t) {
                var n = [];
                var i = true;
                var r = false;
                var o = undefined;
                try {
                    for (var a = e[Symbol.iterator](), s; !(i = (s = a.next()).done); i = true) {
                        n.push(s.value);
                        if (t && n.length === t) break
                    }
                } catch (e) {
                    r = true;
                    o = e
                } finally {
                    try {
                        if (!i && a["return"]) a["return"]()
                    } finally {
                        if (r) throw o
                    }
                }
                return n
            }
            return function (e, t) {
                if (Array.isArray(e)) {
                    return e
                } else if (Symbol.iterator in Object(e)) {
                    return n(e, t)
                } else {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }
        }();
        var i = e("./utils");
        var f = p(i);
        var r = e("./logger");
        var s = u(r);
        var o = e("./EventEmitter");
        var a = u(o);

        function u(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function p(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function d(e, t) {
            var n = Object.getOwnPropertyNames(t);
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                var o = Object.getOwnPropertyDescriptor(t, r);
                if (o && o.configurable && e[r] === undefined) {
                    Object.defineProperty(e, r, o)
                }
            }
            return e
        }

        function h(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function g(e, t) {
            if (!e) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
            }
            return t && (typeof t === "object" || typeof t === "function") ? t : e
        }

        function m(e, t) {
            if (typeof t !== "function" && t !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof t)
            }
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : d(e, t)
        }

        function v(e, t) {
            var n = e.indexOf(t);
            while (n !== -1) {
                e.splice(n, 1);
                n = e.indexOf(t)
            }
        }
        var _ = function (o) {
            m(a, o);

            function a(e, t, n) {
                var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                h(this, a);
                var r = g(this, o.call(this));
                r.backend = e;
                r.store = t;
                r.services = n;
                r.options = i;
                r.logger = s.default.create("backendConnector");
                r.state = {};
                r.queue = [];
                r.backend && r.backend.init && r.backend.init(n, i.backend, i);
                return r
            }
            a.prototype.queueLoad = function e(t, r, n) {
                var o = this;
                var a = [],
                    s = [],
                    l = [],
                    u = [];
                t.forEach(function (n) {
                    var i = true;
                    r.forEach(function (e) {
                        var t = n + "|" + e;
                        if (o.store.hasResourceBundle(n, e)) {
                            o.state[t] = 2
                        } else if (o.state[t] < 0) {} else if (o.state[t] === 1) {
                            if (s.indexOf(t) < 0) s.push(t)
                        } else {
                            o.state[t] = 1;
                            i = false;
                            if (s.indexOf(t) < 0) s.push(t);
                            if (a.indexOf(t) < 0) a.push(t);
                            if (u.indexOf(e) < 0) u.push(e)
                        }
                    });
                    if (!i) l.push(n)
                });
                if (a.length || s.length) {
                    this.queue.push({
                        pending: s,
                        loaded: {},
                        errors: [],
                        callback: n
                    })
                }
                return {
                    toLoad: a,
                    pending: s,
                    toLoadLanguages: l,
                    toLoadNamespaces: u
                }
            };
            a.prototype.loaded = function e(t, n, i) {
                var r = this;
                var o = t.split("|"),
                    a = c(o, 2),
                    s = a[0],
                    l = a[1];
                if (n) this.emit("failedLoading", s, l, n);
                if (i) {
                    this.store.addResourceBundle(s, l, i)
                }
                this.state[t] = n ? -1 : 2;
                this.queue.forEach(function (e) {
                    f.pushPath(e.loaded, [s], l);
                    v(e.pending, t);
                    if (n) e.errors.push(n);
                    if (e.pending.length === 0 && !e.done) {
                        r.emit("loaded", e.loaded);
                        e.errors.length ? e.callback(e.errors) : e.callback();
                        e.done = true
                    }
                });
                this.queue = this.queue.filter(function (e) {
                    return !e.done
                })
            };
            a.prototype.read = function e(n, i, r, o, a, s) {
                var l = this;
                if (!o) o = 0;
                if (!a) a = 250;
                if (!n.length) return s(null, {});
                this.backend[r](n, i, function (e, t) {
                    if (e && t && o < 5) {
                        setTimeout(function () {
                            l.read.call(l, n, i, r, ++o, a * 2, s)
                        }, a);
                        return
                    }
                    s(e, t)
                })
            };
            a.prototype.load = function e(t, n, i) {
                var u = this;
                if (!this.backend) {
                    this.logger.warn("No backend was added via i18next.use. Will not load resources.");
                    return i && i()
                }
                var r = l({}, this.backend.options, this.options.backend);
                if (typeof t === "string") t = this.services.languageUtils.toResolveHierarchy(t);
                if (typeof n === "string") n = [n];
                var o = this.queueLoad(t, n, i);
                if (!o.toLoad.length) {
                    if (!o.pending.length) i();
                    return
                }
                if (r.allowMultiLoading && this.backend.readMulti) {
                    this.read(o.toLoadLanguages, o.toLoadNamespaces, "readMulti", null, null, function (s, l) {
                        if (s) u.logger.warn("loading namespaces " + o.toLoadNamespaces.join(", ") + " for languages " + o.toLoadLanguages.join(", ") + " via multiloading failed", s);
                        if (!s && l) u.logger.log("loaded namespaces " + o.toLoadNamespaces.join(", ") + " for languages " + o.toLoadLanguages.join(", ") + " via multiloading", l);
                        o.toLoad.forEach(function (e) {
                            var t = e.split("|"),
                                n = c(t, 2),
                                i = n[0],
                                r = n[1];
                            var o = f.getPath(l, [i, r]);
                            if (o) {
                                u.loaded(e, s, o)
                            } else {
                                var a = "loading namespace " + r + " for language " + i + " via multiloading failed";
                                u.loaded(e, a);
                                u.logger.error(a)
                            }
                        })
                    })
                } else {
                    (function () {
                        var t = function e(n) {
                            var i = this;
                            var t = n.split("|"),
                                r = c(t, 2),
                                o = r[0],
                                a = r[1];
                            this.read(o, a, "read", null, null, function (e, t) {
                                if (e) i.logger.warn("loading namespace " + a + " for language " + o + " failed", e);
                                if (!e && t) i.logger.log("loaded namespace " + a + " for language " + o, t);
                                i.loaded(n, e, t)
                            })
                        };
                        o.toLoad.forEach(function (e) {
                            t.call(u, e)
                        })
                    })()
                }
            };
            a.prototype.reload = function e(t, a) {
                var s = this;
                if (!this.backend) {
                    this.logger.warn("No backend was added via i18next.use. Will not load resources.")
                }
                var n = l({}, this.backend.options, this.options.backend);
                if (typeof t === "string") t = this.services.languageUtils.toResolveHierarchy(t);
                if (typeof a === "string") a = [a];
                if (n.allowMultiLoading && this.backend.readMulti) {
                    this.read(t, a, "readMulti", null, null, function (r, o) {
                        if (r) s.logger.warn("reloading namespaces " + a.join(", ") + " for languages " + t.join(", ") + " via multiloading failed", r);
                        if (!r && o) s.logger.log("reloaded namespaces " + a.join(", ") + " for languages " + t.join(", ") + " via multiloading", o);
                        t.forEach(function (i) {
                            a.forEach(function (e) {
                                var t = f.getPath(o, [i, e]);
                                if (t) {
                                    s.loaded(i + "|" + e, r, t)
                                } else {
                                    var n = "reloading namespace " + e + " for language " + i + " via multiloading failed";
                                    s.loaded(i + "|" + e, n);
                                    s.logger.error(n)
                                }
                            })
                        })
                    })
                } else {
                    (function () {
                        var n = function e(n) {
                            var i = this;
                            var t = n.split("|"),
                                r = c(t, 2),
                                o = r[0],
                                a = r[1];
                            this.read(o, a, "read", null, null, function (e, t) {
                                if (e) i.logger.warn("reloading namespace " + a + " for language " + o + " failed", e);
                                if (!e && t) i.logger.log("reloaded namespace " + a + " for language " + o, t);
                                i.loaded(n, e, t)
                            })
                        };
                        t.forEach(function (t) {
                            a.forEach(function (e) {
                                n.call(s, t + "|" + e)
                            })
                        })
                    })()
                }
            };
            a.prototype.saveMissing = function e(t, n, i, r) {
                if (this.backend && this.backend.create) this.backend.create(t, n, i, r);
                if (!t || !t[0]) return;
                this.store.addResource(t[0], n, i, r)
            };
            return a
        }(a.default);
        n.default = _
    }, {
        "./EventEmitter": 23,
        "./logger": 33,
        "./utils": 35
    }],
    22: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var i = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) {
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        e[i] = n[i]
                    }
                }
            }
            return e
        };
        var r = e("./utils");
        var o = f(r);
        var a = e("./logger");
        var s = c(a);
        var l = e("./EventEmitter");
        var u = c(l);

        function c(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function f(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function p(e, t) {
            var n = Object.getOwnPropertyNames(t);
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                var o = Object.getOwnPropertyDescriptor(t, r);
                if (o && o.configurable && e[r] === undefined) {
                    Object.defineProperty(e, r, o)
                }
            }
            return e
        }

        function d(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function h(e, t) {
            if (!e) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
            }
            return t && (typeof t === "object" || typeof t === "function") ? t : e
        }

        function g(e, t) {
            if (typeof t !== "function" && t !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof t)
            }
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : p(e, t)
        }
        var m = function (o) {
            g(a, o);

            function a(e, t, n) {
                var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                d(this, a);
                var r = h(this, o.call(this));
                r.cache = e;
                r.store = t;
                r.services = n;
                r.options = i;
                r.logger = s.default.create("cacheConnector");
                r.cache && r.cache.init && r.cache.init(n, i.cache, i);
                return r
            }
            a.prototype.load = function e(o, t, a) {
                var s = this;
                if (!this.cache) return a && a();
                var n = i({}, this.cache.options, this.options.cache);
                if (typeof o === "string") o = this.services.languageUtils.toResolveHierarchy(o);
                if (typeof t === "string") t = [t];
                if (n.enabled) {
                    this.cache.load(o, function (e, t) {
                        if (e) s.logger.error("loading languages " + o.join(", ") + " from cache failed", e);
                        if (t) {
                            for (var n in t) {
                                for (var i in t[n]) {
                                    if (i === "i18nStamp") continue;
                                    var r = t[n][i];
                                    if (r) s.store.addResourceBundle(n, i, r)
                                }
                            }
                        }
                        if (a) a()
                    })
                } else {
                    if (a) a()
                }
            };
            a.prototype.save = function e() {
                if (this.cache && this.options.cache && this.options.cache.enabled) this.cache.save(this.store.data)
            };
            return a
        }(u.default);
        n.default = m
    }, {
        "./EventEmitter": 23,
        "./logger": 33,
        "./utils": 35
    }],
    23: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });

        function i(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var r = function () {
            function e() {
                i(this, e);
                this.observers = {}
            }
            e.prototype.on = function e(t, n) {
                var i = this;
                t.split(" ").forEach(function (e) {
                    i.observers[e] = i.observers[e] || [];
                    i.observers[e].push(n)
                })
            };
            e.prototype.off = function e(t, n) {
                var i = this;
                if (!this.observers[t]) {
                    return
                }
                this.observers[t].forEach(function () {
                    if (!n) {
                        delete i.observers[t]
                    } else {
                        var e = i.observers[t].indexOf(n);
                        if (e > -1) {
                            i.observers[t].splice(e, 1)
                        }
                    }
                })
            };
            e.prototype.emit = function e(n) {
                for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) {
                    i[r - 1] = arguments[r]
                }
                if (this.observers[n]) {
                    var o = [].concat(this.observers[n]);
                    o.forEach(function (e) {
                        e.apply(undefined, i)
                    })
                }
                if (this.observers["*"]) {
                    var a = [].concat(this.observers["*"]);
                    a.forEach(function (e) {
                        var t;
                        e.apply(e, (t = [n]).concat.apply(t, i))
                    })
                }
            };
            return e
        }();
        n.default = r
    }, {}],
    24: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var i = e("./utils");
        var c = s(i);
        var r = e("./logger");
        var o = a(r);

        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function s(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function l(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var u = function () {
            function t() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                l(this, t);
                this.logger = o.default.create("interpolator");
                this.init(e, true)
            }
            t.prototype.init = function e() {
                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var n = arguments[1];
                if (n) {
                    this.options = t;
                    this.format = t.interpolation && t.interpolation.format || function (e) {
                        return e
                    };
                    this.escape = t.interpolation && t.interpolation.escape || c.escape
                }
                if (!t.interpolation) t.interpolation = {
                    escapeValue: true
                };
                var i = t.interpolation;
                this.escapeValue = i.escapeValue !== undefined ? i.escapeValue : true;
                this.prefix = i.prefix ? c.regexEscape(i.prefix) : i.prefixEscaped || "{{";
                this.suffix = i.suffix ? c.regexEscape(i.suffix) : i.suffixEscaped || "}}";
                this.formatSeparator = i.formatSeparator ? c.regexEscape(i.formatSeparator) : i.formatSeparator || ",";
                this.unescapePrefix = i.unescapeSuffix ? "" : i.unescapePrefix || "-";
                this.unescapeSuffix = this.unescapePrefix ? "" : i.unescapeSuffix || "";
                this.nestingPrefix = i.nestingPrefix ? c.regexEscape(i.nestingPrefix) : i.nestingPrefixEscaped || c.regexEscape("$t(");
                this.nestingSuffix = i.nestingSuffix ? c.regexEscape(i.nestingSuffix) : i.nestingSuffixEscaped || c.regexEscape(")");
                this.resetRegExp()
            };
            t.prototype.reset = function e() {
                if (this.options) this.init(this.options)
            };
            t.prototype.resetRegExp = function e() {
                var t = this.prefix + "(.+?)" + this.suffix;
                this.regexp = new RegExp(t, "g");
                var n = this.prefix + this.unescapePrefix + "(.+?)" + this.unescapeSuffix + this.suffix;
                this.regexpUnescape = new RegExp(n, "g");
                var i = this.nestingPrefix + "(.+?)" + this.nestingSuffix;
                this.nestingRegexp = new RegExp(i, "g")
            };
            t.prototype.interpolate = function e(t, o, a) {
                var s = this;
                var n = void 0,
                    i = void 0;

                function r(e) {
                    return e.replace(/\$/g, "$$$$")
                }
                var l = function e(t) {
                    if (t.indexOf(s.formatSeparator) < 0) return c.getPath(o, t);
                    var n = t.split(s.formatSeparator);
                    var i = n.shift().trim();
                    var r = n.join(s.formatSeparator).trim();
                    return s.format(c.getPath(o, i), r, a)
                };
                this.resetRegExp();
                while (n = this.regexpUnescape.exec(t)) {
                    var u = l(n[1].trim());
                    t = t.replace(n[0], u);
                    this.regexpUnescape.lastIndex = 0
                }
                while (n = this.regexp.exec(t)) {
                    i = l(n[1].trim());
                    if (typeof i !== "string") i = c.makeString(i);
                    if (!i) {
                        this.logger.warn("missed to pass in variable " + n[1] + " for interpolating " + t);
                        i = ""
                    }
                    i = this.escapeValue ? r(this.escape(i)) : r(i);
                    t = t.replace(n[0], i);
                    this.regexp.lastIndex = 0
                }
                return t
            };
            t.prototype.nest = function e(t, n) {
                var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var r = void 0,
                    o = void 0;
                var a = JSON.parse(JSON.stringify(i));
                a.applyPostProcessor = false;

                function s(e) {
                    return e.replace(/\$/g, "$$$$")
                }

                function l(t) {
                    if (t.indexOf(",") < 0) return t;
                    var e = t.split(",");
                    t = e.shift();
                    var n = e.join(",");
                    n = this.interpolate(n, a);
                    n = n.replace(/'/g, '"');
                    try {
                        a = JSON.parse(n)
                    } catch (e) {
                        this.logger.error("failed parsing options string in nesting for key " + t, e)
                    }
                    return t
                }
                while (r = this.nestingRegexp.exec(t)) {
                    o = n(l.call(this, r[1].trim()), a);
                    if (typeof o !== "string") o = c.makeString(o);
                    if (!o) {
                        this.logger.warn("missed to pass in variable " + r[1] + " for interpolating " + t);
                        o = ""
                    }
                    t = t.replace(r[0], o);
                    this.regexp.lastIndex = 0
                }
                return t
            };
            return t
        }();
        n.default = u
    }, {
        "./logger": 33,
        "./utils": 35
    }],
    25: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var i = e("./logger");
        var r = o(i);

        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function a(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function s(e) {
            return e.charAt(0).toUpperCase() + e.slice(1)
        }
        var l = function () {
            function t(e) {
                a(this, t);
                this.options = e;
                this.whitelist = this.options.whitelist || false;
                this.logger = r.default.create("languageUtils")
            }
            t.prototype.getLanguagePartFromCode = function e(t) {
                if (t.indexOf("-") < 0) return t;
                var n = ["NB-NO", "NN-NO", "nb-NO", "nn-NO", "nb-no", "nn-no"];
                var i = t.split("-");
                return this.formatLanguageCode(n.indexOf(t) > -1 ? i[1].toLowerCase() : i[0])
            };
            t.prototype.getScriptPartFromCode = function e(t) {
                if (t.indexOf("-") < 0) return null;
                var n = t.split("-");
                if (n.length === 2) return null;
                n.pop();
                return this.formatLanguageCode(n.join("-"))
            };
            t.prototype.getLanguagePartFromCode = function e(t) {
                if (t.indexOf("-") < 0) return t;
                var n = ["NB-NO", "NN-NO", "nb-NO", "nn-NO", "nb-no", "nn-no"];
                var i = t.split("-");
                return this.formatLanguageCode(n.indexOf(t) > -1 ? i[1].toLowerCase() : i[0])
            };
            t.prototype.formatLanguageCode = function e(t) {
                if (typeof t === "string" && t.indexOf("-") > -1) {
                    var n = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
                    var i = t.split("-");
                    if (this.options.lowerCaseLng) {
                        i = i.map(function (e) {
                            return e.toLowerCase()
                        })
                    } else if (i.length === 2) {
                        i[0] = i[0].toLowerCase();
                        i[1] = i[1].toUpperCase();
                        if (n.indexOf(i[1].toLowerCase()) > -1) i[1] = s(i[1].toLowerCase())
                    } else if (i.length === 3) {
                        i[0] = i[0].toLowerCase();
                        if (i[1].length === 2) i[1] = i[1].toUpperCase();
                        if (i[0] !== "sgn" && i[2].length === 2) i[2] = i[2].toUpperCase();
                        if (n.indexOf(i[1].toLowerCase()) > -1) i[1] = s(i[1].toLowerCase());
                        if (n.indexOf(i[2].toLowerCase()) > -1) i[2] = s(i[2].toLowerCase())
                    }
                    return i.join("-")
                } else {
                    return this.options.cleanCode || this.options.lowerCaseLng ? t.toLowerCase() : t
                }
            };
            t.prototype.isWhitelisted = function e(t, n) {
                if (this.options.load === "languageOnly" || this.options.nonExplicitWhitelist && !n) {
                    t = this.getLanguagePartFromCode(t)
                }
                return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(t) > -1 ? true : false
            };
            t.prototype.getFallbackCodes = function e(t, n) {
                if (!t) return [];
                if (typeof t === "string") t = [t];
                if (Object.prototype.toString.apply(t) === "[object Array]") return t;
                var i = t[n];
                if (!i) i = t[this.getScriptPartFromCode(n)];
                if (!i) i = t[this.formatLanguageCode(n)];
                if (!i) i = t.default;
                return i || []
            };
            t.prototype.toResolveHierarchy = function e(t, n) {
                var i = this;
                var r = this.getFallbackCodes(n || this.options.fallbackLng || [], t);
                var o = [];
                var a = function e(t) {
                    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                    if (!t) return;
                    if (i.isWhitelisted(t, n)) {
                        o.push(t)
                    } else {
                        i.logger.warn("rejecting non-whitelisted language code: " + t)
                    }
                };
                if (typeof t === "string" && t.indexOf("-") > -1) {
                    if (this.options.load !== "languageOnly") a(this.formatLanguageCode(t), true);
                    if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") a(this.getScriptPartFromCode(t), true);
                    if (this.options.load !== "currentOnly") a(this.getLanguagePartFromCode(t))
                } else if (typeof t === "string") {
                    a(this.formatLanguageCode(t))
                }
                r.forEach(function (e) {
                    if (o.indexOf(e) < 0) a(i.formatLanguageCode(e))
                });
                return o
            };
            return t
        }();
        n.default = l
    }, {
        "./logger": 33
    }],
    26: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var a = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
            return typeof e
        } : function (e) {
            return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        var i = e("./logger");
        var r = o(i);

        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function s(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var l = [{
            lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "tg", "ti", "tr", "uz", "wa"],
            nr: [1, 2],
            fc: 1
        }, {
            lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "es_ar", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "he", "hi", "hu", "hy", "ia", "it", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt", "pt_br", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
            nr: [1, 2],
            fc: 2
        }, {
            lngs: ["ay", "bo", "cgg", "fa", "id", "ja", "jbo", "ka", "kk", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
            nr: [1],
            fc: 3
        }, {
            lngs: ["be", "bs", "dz", "hr", "ru", "sr", "uk"],
            nr: [1, 2, 5],
            fc: 4
        }, {
            lngs: ["ar"],
            nr: [0, 1, 2, 3, 11, 100],
            fc: 5
        }, {
            lngs: ["cs", "sk"],
            nr: [1, 2, 5],
            fc: 6
        }, {
            lngs: ["csb", "pl"],
            nr: [1, 2, 5],
            fc: 7
        }, {
            lngs: ["cy"],
            nr: [1, 2, 3, 8],
            fc: 8
        }, {
            lngs: ["fr"],
            nr: [1, 2],
            fc: 9
        }, {
            lngs: ["ga"],
            nr: [1, 2, 3, 7, 11],
            fc: 10
        }, {
            lngs: ["gd"],
            nr: [1, 2, 3, 20],
            fc: 11
        }, {
            lngs: ["is"],
            nr: [1, 2],
            fc: 12
        }, {
            lngs: ["jv"],
            nr: [0, 1],
            fc: 13
        }, {
            lngs: ["kw"],
            nr: [1, 2, 3, 4],
            fc: 14
        }, {
            lngs: ["lt"],
            nr: [1, 2, 10],
            fc: 15
        }, {
            lngs: ["lv"],
            nr: [1, 2, 0],
            fc: 16
        }, {
            lngs: ["mk"],
            nr: [1, 2],
            fc: 17
        }, {
            lngs: ["mnk"],
            nr: [0, 1, 2],
            fc: 18
        }, {
            lngs: ["mt"],
            nr: [1, 2, 11, 20],
            fc: 19
        }, {
            lngs: ["or"],
            nr: [2, 1],
            fc: 2
        }, {
            lngs: ["ro"],
            nr: [1, 2, 20],
            fc: 20
        }, {
            lngs: ["sl"],
            nr: [5, 1, 2, 3],
            fc: 21
        }];
        var u = {
            1: function e(t) {
                return Number(t > 1)
            },
            2: function e(t) {
                return Number(t != 1)
            },
            3: function e(t) {
                return 0
            },
            4: function e(t) {
                return Number(t % 10 == 1 && t % 100 != 11 ? 0 : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2)
            },
            5: function e(t) {
                return Number(t === 0 ? 0 : t == 1 ? 1 : t == 2 ? 2 : t % 100 >= 3 && t % 100 <= 10 ? 3 : t % 100 >= 11 ? 4 : 5)
            },
            6: function e(t) {
                return Number(t == 1 ? 0 : t >= 2 && t <= 4 ? 1 : 2)
            },
            7: function e(t) {
                return Number(t == 1 ? 0 : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2)
            },
            8: function e(t) {
                return Number(t == 1 ? 0 : t == 2 ? 1 : t != 8 && t != 11 ? 2 : 3)
            },
            9: function e(t) {
                return Number(t >= 2)
            },
            10: function e(t) {
                return Number(t == 1 ? 0 : t == 2 ? 1 : t < 7 ? 2 : t < 11 ? 3 : 4)
            },
            11: function e(t) {
                return Number(t == 1 || t == 11 ? 0 : t == 2 || t == 12 ? 1 : t > 2 && t < 20 ? 2 : 3)
            },
            12: function e(t) {
                return Number(t % 10 != 1 || t % 100 == 11)
            },
            13: function e(t) {
                return Number(t !== 0)
            },
            14: function e(t) {
                return Number(t == 1 ? 0 : t == 2 ? 1 : t == 3 ? 2 : 3)
            },
            15: function e(t) {
                return Number(t % 10 == 1 && t % 100 != 11 ? 0 : t % 10 >= 2 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2)
            },
            16: function e(t) {
                return Number(t % 10 == 1 && t % 100 != 11 ? 0 : t !== 0 ? 1 : 2)
            },
            17: function e(t) {
                return Number(t == 1 || t % 10 == 1 ? 0 : 1)
            },
            18: function e(t) {
                return Number(t == 0 ? 0 : t == 1 ? 1 : 2)
            },
            19: function e(t) {
                return Number(t == 1 ? 0 : t === 0 || t % 100 > 1 && t % 100 < 11 ? 1 : t % 100 > 10 && t % 100 < 20 ? 2 : 3)
            },
            20: function e(t) {
                return Number(t == 1 ? 0 : t === 0 || t % 100 > 0 && t % 100 < 20 ? 1 : 2)
            },
            21: function e(t) {
                return Number(t % 100 == 1 ? 1 : t % 100 == 2 ? 2 : t % 100 == 3 || t % 100 == 4 ? 3 : 0)
            }
        };

        function c() {
            var e, n = {};
            l.forEach(function (t) {
                t.lngs.forEach(function (e) {
                    return n[e] = {
                        numbers: t.nr,
                        plurals: u[t.fc]
                    }
                })
            });
            return n
        }
        var f = function () {
            function n(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                s(this, n);
                this.languageUtils = e;
                this.options = t;
                this.logger = r.default.create("pluralResolver");
                this.rules = c()
            }
            n.prototype.addRule = function e(t, n) {
                this.rules[t] = n
            };
            n.prototype.getRule = function e(t) {
                return this.rules[this.languageUtils.getLanguagePartFromCode(t)]
            };
            n.prototype.needsPlural = function e(t) {
                var n = this.getRule(t);
                return n && n.numbers.length <= 1 ? false : true
            };
            n.prototype.getSuffix = function e(t, i) {
                var r = this;
                var o = this.getRule(t);
                if (o) {
                    var n = function () {
                        if (o.numbers.length === 1) return {
                            v: ""
                        };
                        var e = o.noAbs ? o.plurals(i) : o.plurals(Math.abs(i));
                        var t = o.numbers[e];
                        if (o.numbers.length === 2 && o.numbers[0] === 1) {
                            if (t === 2) {
                                t = "plural"
                            } else if (t === 1) {
                                t = ""
                            }
                        }
                        var n = function e() {
                            return r.options.prepend && t.toString() ? r.options.prepend + t.toString() : t.toString()
                        };
                        if (r.options.compatibilityJSON === "v1") {
                            if (t === 1) return {
                                v: ""
                            };
                            if (typeof t === "number") return {
                                v: "_plural_" + t.toString()
                            };
                            return {
                                v: n()
                            }
                        } else if (r.options.compatibilityJSON === "v2" || o.numbers.length === 2 && o.numbers[0] === 1) {
                            return {
                                v: n()
                            }
                        } else if (o.numbers.length === 2 && o.numbers[0] === 1) {
                            return {
                                v: n()
                            }
                        }
                        return {
                            v: r.options.prepend && e.toString() ? r.options.prepend + e.toString() : e.toString()
                        }
                    }();
                    if ((typeof n === "undefined" ? "undefined" : a(n)) === "object") return n.v
                } else {
                    this.logger.warn("no plural rule found for: " + t);
                    return ""
                }
            };
            return n
        }();
        n.default = f
    }, {
        "./logger": 33
    }],
    27: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var l = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) {
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        e[i] = n[i]
                    }
                }
            }
            return e
        };
        var i = e("./EventEmitter");
        var r = s(i);
        var o = e("./utils");
        var u = a(o);

        function a(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function c(e, t) {
            var n = Object.getOwnPropertyNames(t);
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                var o = Object.getOwnPropertyDescriptor(t, r);
                if (o && o.configurable && e[r] === undefined) {
                    Object.defineProperty(e, r, o)
                }
            }
            return e
        }

        function f(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function p(e, t) {
            if (!e) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
            }
            return t && (typeof t === "object" || typeof t === "function") ? t : e
        }

        function d(e, t) {
            if (typeof t !== "function" && t !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof t)
            }
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : c(e, t)
        }
        var h = function (i) {
            d(r, i);

            function r() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                    ns: ["translation"],
                    defaultNS: "translation"
                };
                f(this, r);
                var n = p(this, i.call(this));
                n.data = e;
                n.options = t;
                return n
            }
            r.prototype.addNamespaces = function e(t) {
                if (this.options.ns.indexOf(t) < 0) {
                    this.options.ns.push(t)
                }
            };
            r.prototype.removeNamespaces = function e(t) {
                var n = this.options.ns.indexOf(t);
                if (n > -1) {
                    this.options.ns.splice(n, 1)
                }
            };
            r.prototype.getResource = function e(t, n, i) {
                var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var o = r.keySeparator || this.options.keySeparator;
                if (o === undefined) o = ".";
                var a = [t, n];
                if (i && typeof i !== "string") a = a.concat(i);
                if (i && typeof i === "string") a = a.concat(o ? i.split(o) : i);
                if (t.indexOf(".") > -1) {
                    a = t.split(".")
                }
                return u.getPath(this.data, a)
            };
            r.prototype.addResource = function e(t, n, i, r) {
                var o = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
                    silent: false
                };
                var a = this.options.keySeparator;
                if (a === undefined) a = ".";
                var s = [t, n];
                if (i) s = s.concat(a ? i.split(a) : i);
                if (t.indexOf(".") > -1) {
                    s = t.split(".");
                    r = n;
                    n = s[1]
                }
                this.addNamespaces(n);
                u.setPath(this.data, s, r);
                if (!o.silent) this.emit("added", t, n, i, r)
            };
            r.prototype.addResources = function e(t, n, i) {
                for (var r in i) {
                    if (typeof i[r] === "string") this.addResource(t, n, r, i[r], {
                        silent: true
                    })
                }
                this.emit("added", t, n, i)
            };
            r.prototype.addResourceBundle = function e(t, n, i, r, o) {
                var a = [t, n];
                if (t.indexOf(".") > -1) {
                    a = t.split(".");
                    r = i;
                    i = n;
                    n = a[1]
                }
                this.addNamespaces(n);
                var s = u.getPath(this.data, a) || {};
                if (r) {
                    u.deepExtend(s, i, o)
                } else {
                    s = l({}, s, i)
                }
                u.setPath(this.data, a, s);
                this.emit("added", t, n, i)
            };
            r.prototype.removeResourceBundle = function e(t, n) {
                if (this.hasResourceBundle(t, n)) {
                    delete this.data[t][n]
                }
                this.removeNamespaces(n);
                this.emit("removed", t, n)
            };
            r.prototype.hasResourceBundle = function e(t, n) {
                return this.getResource(t, n) !== undefined
            };
            r.prototype.getResourceBundle = function e(t, n) {
                if (!n) n = this.options.defaultNS;
                if (this.options.compatibilityAPI === "v1") return l({}, this.getResource(t, n));
                return this.getResource(t, n)
            };
            r.prototype.toJSON = function e() {
                return this.data
            };
            return r
        }(r.default);
        n.default = h
    }, {
        "./EventEmitter": 23,
        "./utils": 35
    }],
    28: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var w = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) {
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        e[i] = n[i]
                    }
                }
            }
            return e
        };
        var E = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
            return typeof e
        } : function (e) {
            return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        var i = e("./logger");
        var o = d(i);
        var r = e("./EventEmitter");
        var a = d(r);
        var s = e("./postProcessor");
        var l = d(s);
        var u = e("./compatibility/v1");
        var k = p(u);
        var c = e("./utils");
        var f = p(c);

        function p(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function d(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function h(e, t) {
            var n = Object.getOwnPropertyNames(t);
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                var o = Object.getOwnPropertyDescriptor(t, r);
                if (o && o.configurable && e[r] === undefined) {
                    Object.defineProperty(e, r, o)
                }
            }
            return e
        }

        function g(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function m(e, t) {
            if (!e) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
            }
            return t && (typeof t === "object" || typeof t === "function") ? t : e
        }

        function v(e, t) {
            if (typeof t !== "function" && t !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof t)
            }
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : h(e, t)
        }
        var _ = function (i) {
            v(r, i);

            function r(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                g(this, r);
                var n = m(this, i.call(this));
                f.copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector"], e, n);
                n.options = t;
                n.logger = o.default.create("translator");
                return n
            }
            r.prototype.changeLanguage = function e(t) {
                if (t) this.language = t
            };
            r.prototype.exists = function e(t) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                    interpolation: {}
                };
                if (this.options.compatibilityAPI === "v1") {
                    n = k.convertTOptions(n)
                }
                return this.resolve(t, n) !== undefined
            };
            r.prototype.extractFromKey = function e(t, n) {
                var i = n.nsSeparator || this.options.nsSeparator;
                if (i === undefined) i = ":";
                var r = n.keySeparator || this.options.keySeparator || ".";
                var o = n.ns || this.options.defaultNS;
                if (i && t.indexOf(i) > -1) {
                    var a = t.split(i);
                    if (i !== r || i === r && this.options.ns.indexOf(a[0]) > -1) o = a.shift();
                    t = a.join(r)
                }
                if (typeof o === "string") o = [o];
                return {
                    key: t,
                    namespaces: o
                }
            };
            r.prototype.translate = function e(t) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                if ((typeof n === "undefined" ? "undefined" : E(n)) !== "object") {
                    n = this.options.overloadTranslationOptionHandler(arguments)
                } else if (this.options.compatibilityAPI === "v1") {
                    n = k.convertTOptions(n)
                }
                if (t === undefined || t === null || t === "") return "";
                if (typeof t === "number") t = String(t);
                if (typeof t === "string") t = [t];
                var i = n.keySeparator || this.options.keySeparator || ".";
                var r = this.extractFromKey(t[t.length - 1], n),
                    o = r.key,
                    a = r.namespaces;
                var s = a[a.length - 1];
                var l = n.lng || this.language;
                var u = n.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
                if (l && l.toLowerCase() === "cimode") {
                    if (u) {
                        var c = n.nsSeparator || this.options.nsSeparator;
                        return s + c + o
                    }
                    return o
                }
                var f = this.resolve(t, n);
                var p = Object.prototype.toString.apply(f);
                var d = ["[object Number]", "[object Function]", "[object RegExp]"];
                var h = n.joinArrays !== undefined ? n.joinArrays : this.options.joinArrays;
                if (f && typeof f !== "string" && d.indexOf(p) < 0 && !(h && p === "[object Array]")) {
                    if (!n.returnObjects && !this.options.returnObjects) {
                        this.logger.warn("accessing an object - but returnObjects options is not enabled!");
                        return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(o, f, n) : "key '" + o + " (" + this.language + ")' returned an object instead of string."
                    }
                    if (n.keySeparator || this.options.keySeparator) {
                        var g = p === "[object Array]" ? [] : {};
                        for (var m in f) {
                            g[m] = this.translate("" + o + i + m, w({
                                joinArrays: false,
                                ns: a
                            }, n))
                        }
                        f = g
                    }
                } else if (h && p === "[object Array]") {
                    f = f.join(h);
                    if (f) f = this.extendTranslation(f, o, n)
                } else {
                    var v = false,
                        _ = false;
                    if (!this.isValidLookup(f) && n.defaultValue !== undefined) {
                        v = true;
                        f = n.defaultValue
                    }
                    if (!this.isValidLookup(f)) {
                        _ = true;
                        f = o
                    }
                    if (_ || v) {
                        this.logger.log("missingKey", l, s, o, f);
                        var y = [];
                        var b = this.languageUtils.getFallbackCodes(this.options.fallbackLng, n.lng || this.language);
                        if (this.options.saveMissingTo === "fallback" && b && b[0]) {
                            for (var x = 0; x < b.length; x++) {
                                y.push(b[x])
                            }
                        } else if (this.options.saveMissingTo === "all") {
                            y = this.languageUtils.toResolveHierarchy(n.lng || this.language)
                        } else {
                            y.push(n.lng || this.language)
                        }
                        if (this.options.saveMissing) {
                            if (this.options.missingKeyHandler) {
                                this.options.missingKeyHandler(y, s, o, f)
                            } else if (this.backendConnector && this.backendConnector.saveMissing) {
                                this.backendConnector.saveMissing(y, s, o, f)
                            }
                        }
                        this.emit("missingKey", y, s, o, f)
                    }
                    f = this.extendTranslation(f, o, n);
                    if (_ && f === o && this.options.appendNamespaceToMissingKey) f = s + ":" + o;
                    if (_ && this.options.parseMissingKeyHandler) f = this.options.parseMissingKeyHandler(f)
                }
                return f
            };
            r.prototype.extendTranslation = function e(t, n, i) {
                var r = this;
                if (i.interpolation) this.interpolator.init(w({}, i, {
                    interpolation: w({}, this.options.interpolation, i.interpolation)
                }));
                var o = i.replace && typeof i.replace !== "string" ? i.replace : i;
                if (this.options.interpolation.defaultVariables) o = w({}, this.options.interpolation.defaultVariables, o);
                t = this.interpolator.interpolate(t, o, this.language);
                t = this.interpolator.nest(t, function () {
                    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) {
                        t[n] = arguments[n]
                    }
                    return r.translate.apply(r, t)
                }, i);
                if (i.interpolation) this.interpolator.reset();
                var a = i.postProcess || this.options.postProcess;
                var s = typeof a === "string" ? [a] : a;
                if (t !== undefined && s && s.length && i.applyPostProcessor !== false) {
                    t = l.default.handle(s, t, n, i, this)
                }
                return t
            };
            r.prototype.resolve = function e(t) {
                var u = this;
                var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var f = void 0;
                if (typeof t === "string") t = [t];
                t.forEach(function (e) {
                    if (u.isValidLookup(f)) return;
                    var t = u.extractFromKey(e, c),
                        a = t.key,
                        n = t.namespaces;
                    if (u.options.fallbackNS) n = n.concat(u.options.fallbackNS);
                    var s = c.count !== undefined && typeof c.count !== "string";
                    var l = c.context !== undefined && typeof c.context === "string" && c.context !== "";
                    var i = c.lngs ? c.lngs : u.languageUtils.toResolveHierarchy(c.lng || u.language);
                    n.forEach(function (o) {
                        if (u.isValidLookup(f)) return;
                        i.forEach(function (e) {
                            if (u.isValidLookup(f)) return;
                            var t = a;
                            var n = [t];
                            var i = void 0;
                            if (s) i = u.pluralResolver.getSuffix(e, c.count);
                            if (s && l) n.push(t + i);
                            if (l) n.push(t += "" + u.options.contextSeparator + c.context);
                            if (s) n.push(t += i);
                            var r = void 0;
                            while (r = n.pop()) {
                                if (u.isValidLookup(f)) continue;
                                f = u.getResource(e, o, r, c)
                            }
                        })
                    })
                });
                return f
            };
            r.prototype.isValidLookup = function e(t) {
                return t !== undefined && !(!this.options.returnNull && t === null) && !(!this.options.returnEmptyString && t === "")
            };
            r.prototype.getResource = function e(t, n, i) {
                var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                return this.resourceStore.getResource(t, n, i, r)
            };
            return r
        }(a.default);
        n.default = _
    }, {
        "./EventEmitter": 23,
        "./compatibility/v1": 29,
        "./logger": 33,
        "./postProcessor": 34,
        "./utils": 35
    }],
    29: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.convertAPIOptions = s;
        n.convertJSONOptions = l;
        n.convertTOptions = u;
        n.appendBackwardsAPI = c;
        var i = e("../logger");
        var r = o(i);

        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function a(e) {
            e.interpolation = {
                unescapeSuffix: "HTML"
            };
            e.interpolation.prefix = e.interpolationPrefix || "__";
            e.interpolation.suffix = e.interpolationSuffix || "__";
            e.interpolation.escapeValue = e.escapeInterpolation || false;
            e.interpolation.nestingPrefix = e.reusePrefix || "$t(";
            e.interpolation.nestingSuffix = e.reuseSuffix || ")";
            return e
        }

        function s(e) {
            if (e.resStore) e.resources = e.resStore;
            if (e.ns && e.ns.defaultNs) {
                e.defaultNS = e.ns.defaultNs;
                e.ns = e.ns.namespaces
            } else {
                e.defaultNS = e.ns || "translation"
            }
            if (e.fallbackToDefaultNS && e.defaultNS) e.fallbackNS = e.defaultNS;
            e.saveMissing = e.sendMissing;
            e.saveMissingTo = e.sendMissingTo || "current";
            e.returnNull = e.fallbackOnNull ? false : true;
            e.returnEmptyString = e.fallbackOnEmpty ? false : true;
            e.returnObjects = e.returnObjectTrees;
            e.joinArrays = "\n";
            e.returnedObjectHandler = e.objectTreeKeyHandler;
            e.parseMissingKeyHandler = e.parseMissingKey;
            e.appendNamespaceToMissingKey = true;
            e.nsSeparator = e.nsseparator || ":";
            e.keySeparator = e.keyseparator || ".";
            if (e.shortcutFunction === "sprintf") {
                e.overloadTranslationOptionHandler = function (e) {
                    var t = [];
                    for (var n = 1; n < e.length; n++) {
                        t.push(e[n])
                    }
                    return {
                        postProcess: "sprintf",
                        sprintf: t
                    }
                }
            }
            e.whitelist = e.lngWhitelist;
            e.preload = e.preload;
            if (e.load === "current") e.load = "currentOnly";
            if (e.load === "unspecific") e.load = "languageOnly";
            e.backend = e.backend || {};
            e.backend.loadPath = e.resGetPath || "locales/__lng__/__ns__.json";
            e.backend.addPath = e.resPostPath || "locales/add/__lng__/__ns__";
            e.backend.allowMultiLoading = e.dynamicLoad;
            e.cache = e.cache || {};
            e.cache.prefix = "res_";
            e.cache.expirationTime = 7 * 24 * 60 * 60 * 1e3;
            e.cache.enabled = e.useLocalStorage ? true : false;
            e = a(e);
            if (e.defaultVariables) e.interpolation.defaultVariables = e.defaultVariables;
            return e
        }

        function l(e) {
            e = a(e);
            e.joinArrays = "\n";
            return e
        }

        function u(e) {
            if (e.interpolationPrefix || e.interpolationSuffix || e.escapeInterpolation) {
                e = a(e)
            }
            e.nsSeparator = e.nsseparator;
            e.keySeparator = e.keyseparator;
            e.returnObjects = e.returnObjectTrees;
            return e
        }

        function c(i) {
            i.lng = function () {
                r.default.deprecate("i18next.lng() can be replaced by i18next.language for detected language or i18next.languages for languages ordered by translation lookup.");
                return i.services.languageUtils.toResolveHierarchy(i.language)[0]
            };
            i.preload = function (e, t) {
                r.default.deprecate("i18next.preload() can be replaced with i18next.loadLanguages()");
                i.loadLanguages(e, t)
            };
            i.setLng = function (e, t, n) {
                r.default.deprecate("i18next.setLng() can be replaced with i18next.changeLanguage() or i18next.getFixedT() to get a translation function with fixed language or namespace.");
                if (typeof t === "function") {
                    n = t;
                    t = {}
                }
                if (!t) t = {};
                if (t.fixLng === true) {
                    if (n) return n(null, i.getFixedT(e))
                }
                i.changeLanguage(e, n)
            };
            i.addPostProcessor = function (e, t) {
                r.default.deprecate("i18next.addPostProcessor() can be replaced by i18next.use({ type: 'postProcessor', name: 'name', process: fc })");
                i.use({
                    type: "postProcessor",
                    name: e,
                    process: t
                })
            }
        }
    }, {
        "../logger": 33
    }],
    30: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.get = i;
        n.transformOptions = r;

        function i() {
            return {
                debug: false,
                initImmediate: true,
                ns: ["translation"],
                defaultNS: ["translation"],
                fallbackLng: ["dev"],
                fallbackNS: false,
                whitelist: false,
                nonExplicitWhitelist: false,
                load: "all",
                preload: false,
                keySeparator: ".",
                nsSeparator: ":",
                pluralSeparator: "_",
                contextSeparator: "_",
                saveMissing: false,
                saveMissingTo: "fallback",
                missingKeyHandler: false,
                postProcess: false,
                returnNull: true,
                returnEmptyString: true,
                returnObjects: false,
                joinArrays: false,
                returnedObjectHandler: function e() {},
                parseMissingKeyHandler: false,
                appendNamespaceToMissingKey: false,
                appendNamespaceToCIMode: false,
                overloadTranslationOptionHandler: function e(t) {
                    return {
                        defaultValue: t[1]
                    }
                },
                interpolation: {
                    escapeValue: true,
                    format: function e(t, n, i) {
                        return t
                    },
                    prefix: "{{",
                    suffix: "}}",
                    formatSeparator: ",",
                    unescapePrefix: "-",
                    nestingPrefix: "$t(",
                    nestingSuffix: ")",
                    defaultVariables: undefined
                }
            }
        }

        function r(e) {
            if (typeof e.ns === "string") e.ns = [e.ns];
            if (typeof e.fallbackLng === "string") e.fallbackLng = [e.fallbackLng];
            if (typeof e.fallbackNS === "string") e.fallbackNS = [e.fallbackNS];
            if (e.whitelist && e.whitelist.indexOf("cimode") < 0) e.whitelist.push("cimode");
            return e
        }
    }, {}],
    31: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var o = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (e) {
            return typeof e
        } : function (e) {
            return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        var u = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) {
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        e[i] = n[i]
                    }
                }
            }
            return e
        };
        var i = e("./logger");
        var c = C(i);
        var r = e("./EventEmitter");
        var a = C(r);
        var s = e("./ResourceStore");
        var f = C(s);
        var l = e("./Translator");
        var p = C(l);
        var d = e("./LanguageUtils");
        var h = C(d);
        var g = e("./PluralResolver");
        var m = C(g);
        var v = e("./Interpolator");
        var _ = C(v);
        var y = e("./BackendConnector");
        var b = C(y);
        var x = e("./CacheConnector");
        var w = C(x);
        var E = e("./defaults");
        var k = e("./postProcessor");
        var S = C(k);
        var T = e("./compatibility/v1");
        var N = A(T);

        function A(e) {
            if (e && e.__esModule) {
                return e
            } else {
                var t = {};
                if (e != null) {
                    for (var n in e) {
                        if (Object.prototype.hasOwnProperty.call(e, n)) t[n] = e[n]
                    }
                }
                t.default = e;
                return t
            }
        }

        function C(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function O(e, t) {
            var n = Object.getOwnPropertyNames(t);
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                var o = Object.getOwnPropertyDescriptor(t, r);
                if (o && o.configurable && e[r] === undefined) {
                    Object.defineProperty(e, r, o)
                }
            }
            return e
        }

        function I(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function R(e, t) {
            if (!e) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
            }
            return t && (typeof t === "object" || typeof t === "function") ? t : e
        }

        function P(e, t) {
            if (typeof t !== "function" && t !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof t)
            }
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (t) Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : O(e, t)
        }

        function L() {}
        var D = function (i) {
            P(s, i);

            function s() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var t = arguments[1];
                I(this, s);
                var n = R(this, i.call(this));
                n.options = (0, E.transformOptions)(e);
                n.services = {};
                n.logger = c.default;
                n.modules = {};
                if (t && !n.isInitialized && !e.isClone) n.init(e, t);
                return n
            }
            s.prototype.init = function e(t, n) {
                var r = this;
                if (typeof t === "function") {
                    n = t;
                    t = {}
                }
                if (!t) t = {};
                if (t.compatibilityAPI === "v1") {
                    this.options = u({}, (0, E.get)(), (0, E.transformOptions)(N.convertAPIOptions(t)), {})
                } else if (t.compatibilityJSON === "v1") {
                    this.options = u({}, (0, E.get)(), (0, E.transformOptions)(N.convertJSONOptions(t)), {})
                } else {
                    this.options = u({}, (0, E.get)(), this.options, (0, E.transformOptions)(t))
                }
                if (!n) n = L;

                function i(e) {
                    if (!e) return;
                    if (typeof e === "function") return new e;
                    return e
                }
                if (!this.options.isClone) {
                    if (this.modules.logger) {
                        c.default.init(i(this.modules.logger), this.options)
                    } else {
                        c.default.init(null, this.options)
                    }
                    var o = new h.default(this.options);
                    this.store = new f.default(this.options.resources, this.options);
                    var a = this.services;
                    a.logger = c.default;
                    a.resourceStore = this.store;
                    a.resourceStore.on("added removed", function (e, t) {
                        a.cacheConnector.save()
                    });
                    a.languageUtils = o;
                    a.pluralResolver = new m.default(o, {
                        prepend: this.options.pluralSeparator,
                        compatibilityJSON: this.options.compatibilityJSON
                    });
                    a.interpolator = new _.default(this.options);
                    a.backendConnector = new b.default(i(this.modules.backend), a.resourceStore, a, this.options);
                    a.backendConnector.on("*", function (e) {
                        for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) {
                            n[i - 1] = arguments[i]
                        }
                        r.emit.apply(r, [e].concat(n))
                    });
                    a.backendConnector.on("loaded", function (e) {
                        a.cacheConnector.save()
                    });
                    a.cacheConnector = new w.default(i(this.modules.cache), a.resourceStore, a, this.options);
                    a.cacheConnector.on("*", function (e) {
                        for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) {
                            n[i - 1] = arguments[i]
                        }
                        r.emit.apply(r, [e].concat(n))
                    });
                    if (this.modules.languageDetector) {
                        a.languageDetector = i(this.modules.languageDetector);
                        a.languageDetector.init(a, this.options.detection, this.options)
                    }
                    this.translator = new p.default(this.services, this.options);
                    this.translator.on("*", function (e) {
                        for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) {
                            n[i - 1] = arguments[i]
                        }
                        r.emit.apply(r, [e].concat(n))
                    })
                }
                var s = ["getResource", "addResource", "addResources", "addResourceBundle", "removeResourceBundle", "hasResourceBundle", "getResourceBundle"];
                s.forEach(function (e) {
                    r[e] = function () {
                        return this.store[e].apply(this.store, arguments)
                    }
                });
                if (this.options.compatibilityAPI === "v1") N.appendBackwardsAPI(this);
                var l = function e() {
                    r.changeLanguage(r.options.lng, function (e, t) {
                        r.isInitialized = true;
                        r.logger.log("initialized", r.options);
                        r.emit("initialized", r.options);
                        n(e, t)
                    })
                };
                if (this.options.resources || !this.options.initImmediate) {
                    l()
                } else {
                    setTimeout(l, 0)
                }
                return this
            };
            s.prototype.loadResources = function e() {
                var r = this;
                var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : L;
                if (!this.options.resources) {
                    var t = function () {
                        if (r.language && r.language.toLowerCase() === "cimode") return {
                            v: n()
                        };
                        var i = [];
                        var t = function e(t) {
                            var n = r.services.languageUtils.toResolveHierarchy(t);
                            n.forEach(function (e) {
                                if (i.indexOf(e) < 0) i.push(e)
                            })
                        };
                        t(r.language);
                        if (r.options.preload) {
                            r.options.preload.forEach(function (e) {
                                t(e)
                            })
                        }
                        r.services.cacheConnector.load(i, r.options.ns, function () {
                            r.services.backendConnector.load(i, r.options.ns, n)
                        })
                    }();
                    if ((typeof t === "undefined" ? "undefined" : o(t)) === "object") return t.v
                } else {
                    n(null)
                }
            };
            s.prototype.reloadResources = function e(t, n) {
                if (!t) t = this.languages;
                if (!n) n = this.options.ns;
                this.services.backendConnector.reload(t, n)
            };
            s.prototype.use = function e(t) {
                if (t.type === "backend") {
                    this.modules.backend = t
                }
                if (t.type === "cache") {
                    this.modules.cache = t
                }
                if (t.type === "logger" || t.log && t.warn && t.warn) {
                    this.modules.logger = t
                }
                if (t.type === "languageDetector") {
                    this.modules.languageDetector = t
                }
                if (t.type === "postProcessor") {
                    S.default.addPostProcessor(t)
                }
                return this
            };
            s.prototype.changeLanguage = function e(n, i) {
                var r = this;
                var t = function e(t) {
                    if (n) {
                        r.emit("languageChanged", n);
                        r.logger.log("languageChanged", n)
                    }
                    if (i) i(t, function () {
                        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) {
                            t[n] = arguments[n]
                        }
                        return r.t.apply(r, t)
                    })
                };
                if (!n && this.services.languageDetector) n = this.services.languageDetector.detect();
                if (n) {
                    this.language = n;
                    this.languages = this.services.languageUtils.toResolveHierarchy(n);
                    this.translator.changeLanguage(n);
                    if (this.services.languageDetector) this.services.languageDetector.cacheUserLanguage(n)
                }
                this.loadResources(function (e) {
                    t(e)
                })
            };
            s.prototype.getFixedT = function e(t, n) {
                var r = this;
                var i = function e(t) {
                    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    var i = u({}, n);
                    i.lng = i.lng || e.lng;
                    i.ns = i.ns || e.ns;
                    return r.t(t, i)
                };
                i.lng = t;
                i.ns = n;
                return i
            };
            s.prototype.t = function e() {
                return this.translator && this.translator.translate.apply(this.translator, arguments)
            };
            s.prototype.exists = function e() {
                return this.translator && this.translator.exists.apply(this.translator, arguments)
            };
            s.prototype.setDefaultNamespace = function e(t) {
                this.options.defaultNS = t
            };
            s.prototype.loadNamespaces = function e(t, n) {
                var i = this;
                if (!this.options.ns) return n && n();
                if (typeof t === "string") t = [t];
                t.forEach(function (e) {
                    if (i.options.ns.indexOf(e) < 0) i.options.ns.push(e)
                });
                this.loadResources(n)
            };
            s.prototype.loadLanguages = function e(t, n) {
                if (typeof t === "string") t = [t];
                var i = this.options.preload || [];
                var r = t.filter(function (e) {
                    return i.indexOf(e) < 0
                });
                if (!r.length) return n();
                this.options.preload = i.concat(r);
                this.loadResources(n)
            };
            s.prototype.dir = function e(t) {
                if (!t) t = this.language;
                if (!t) return "rtl";
                var n = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam"];
                return n.indexOf(this.services.languageUtils.getLanguagePartFromCode(t)) >= 0 ? "rtl" : "ltr"
            };
            s.prototype.createInstance = function e() {
                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var n = arguments[1];
                return new s(t, n)
            };
            s.prototype.cloneInstance = function e() {
                var t = this;
                var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : L;
                var r = u({}, n, this.options, {
                    isClone: true
                });
                var o = new s(r, i);
                var a = ["store", "services", "language"];
                a.forEach(function (e) {
                    o[e] = t[e]
                });
                o.translator = new p.default(o.services, o.options);
                o.translator.on("*", function (e) {
                    for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) {
                        n[i - 1] = arguments[i]
                    }
                    o.emit.apply(o, [e].concat(n))
                });
                o.init(r, i);
                return o
            };
            return s
        }(a.default);
        n.default = new D
    }, {
        "./BackendConnector": 21,
        "./CacheConnector": 22,
        "./EventEmitter": 23,
        "./Interpolator": 24,
        "./LanguageUtils": 25,
        "./PluralResolver": 26,
        "./ResourceStore": 27,
        "./Translator": 28,
        "./compatibility/v1": 29,
        "./defaults": 30,
        "./logger": 33,
        "./postProcessor": 34
    }],
    32: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var i = e("./i18next");
        var r = o(i);

        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        n.default = r.default
    }, {
        "./i18next": 31
    }],
    33: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        var r = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) {
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        e[i] = n[i]
                    }
                }
            }
            return e
        };

        function o(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }
        var a = {
            type: "logger",
            log: function e(t) {
                this._output("log", t)
            },
            warn: function e(t) {
                this._output("warn", t)
            },
            error: function e(t) {
                this._output("error", t)
            },
            _output: function e(t, n) {
                if (console && console[t]) console[t].apply(console, Array.prototype.slice.call(n))
            }
        };
        var i = function () {
            function i(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                o(this, i);
                this.init(e, t)
            }
            i.prototype.init = function e(t) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                this.prefix = n.prefix || "i18next:";
                this.logger = t || a;
                this.options = n;
                this.debug = n.debug === false ? false : true
            };
            i.prototype.setDebug = function e(t) {
                this.debug = t
            };
            i.prototype.log = function e() {
                this.forward(arguments, "log", "", true)
            };
            i.prototype.warn = function e() {
                this.forward(arguments, "warn", "", true)
            };
            i.prototype.error = function e() {
                this.forward(arguments, "error", "")
            };
            i.prototype.deprecate = function e() {
                this.forward(arguments, "warn", "WARNING DEPRECATED: ", true)
            };
            i.prototype.forward = function e(t, n, i, r) {
                if (r && !this.debug) return;
                if (typeof t[0] === "string") t[0] = i + this.prefix + " " + t[0];
                this.logger[n](t)
            };
            i.prototype.create = function e(t) {
                var n = new i(this.logger, r({
                    prefix: this.prefix + ":" + t + ":"
                }, this.options));
                return n
            };
            return i
        }();
        n.default = new i
    }, {}],
    34: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.default = {
            processors: {},
            addPostProcessor: function e(t) {
                this.processors[t.name] = t
            },
            handle: function e(t, n, i, r, o) {
                var a = this;
                t.forEach(function (e) {
                    if (a.processors[e]) n = a.processors[e].process(n, i, r, o)
                });
                return n
            }
        }
    }, {}],
    35: [function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.makeString = i;
        n.copy = r;
        n.setPath = o;
        n.pushPath = a;
        n.getPath = l;
        n.deepExtend = u;
        n.regexEscape = c;
        n.escape = p;

        function i(e) {
            if (e == null) return "";
            return "" + e
        }

        function r(e, t, n) {
            e.forEach(function (e) {
                if (t[e]) n[e] = t[e]
            })
        }

        function s(e, t, n) {
            function i(e) {
                return e && e.indexOf("###") > -1 ? e.replace(/###/g, ".") : e
            }
            var r = typeof t !== "string" ? [].concat(t) : t.split(".");
            while (r.length > 1) {
                if (!e) return {};
                var o = i(r.shift());
                if (!e[o] && n) e[o] = new n;
                e = e[o]
            }
            if (!e) return {};
            return {
                obj: e,
                k: i(r.shift())
            }
        }

        function o(e, t, n) {
            var i = s(e, t, Object),
                r = i.obj,
                o = i.k;
            r[o] = n
        }

        function a(e, t, n, i) {
            var r = s(e, t, Object),
                o = r.obj,
                a = r.k;
            o[a] = o[a] || [];
            if (i) o[a] = o[a].concat(n);
            if (!i) o[a].push(n)
        }

        function l(e, t) {
            var n = s(e, t),
                i = n.obj,
                r = n.k;
            if (!i) return undefined;
            return i[r]
        }

        function u(e, t, n) {
            for (var i in t) {
                if (i in e) {
                    if (typeof e[i] === "string" || e[i] instanceof String || typeof t[i] === "string" || t[i] instanceof String) {
                        if (n) e[i] = t[i]
                    } else {
                        u(e[i], t[i], n)
                    }
                } else {
                    e[i] = t[i]
                }
            }
            return e
        }

        function c(e) {
            return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
        }
        var f = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;"
        };

        function p(e) {
            if (typeof e === "string") {
                return e.replace(/[&<>"'\/]/g, function (e) {
                    return f[e]
                })
            } else {
                return e
            }
        }
    }, {}],
    36: [function (e, t, n) {
        arguments[4][20][0].apply(n, arguments)
    }, {
        "./dist/commonjs/index.js": 32,
        dup: 20
    }],
    37: [function (e, n, t) {
        (function (e, t) {
            "use strict";
            if (typeof n === "object" && typeof n.exports === "object") {
                n.exports = e.document ? t(e, true) : function (e) {
                    if (!e.document) {
                        throw new Error("jQuery requires a window with a document")
                    }
                    return t(e)
                }
            } else {
                t(e)
            }
        })(typeof window !== "undefined" ? window : this, function (E, e) {
            "use strict";
            var t = [];
            var k = E.document;
            var i = Object.getPrototypeOf;
            var s = t.slice;
            var g = t.concat;
            var l = t.push;
            var r = t.indexOf;
            var n = {};
            var o = n.toString;
            var m = n.hasOwnProperty;
            var a = m.toString;
            var u = a.call(Object);
            var v = {};
            var _ = function e(t) {
                return typeof t === "function" && typeof t.nodeType !== "number"
            };
            var y = function e(t) {
                return t != null && t === t.window
            };
            var c = {
                type: true,
                src: true,
                nonce: true,
                noModule: true
            };

            function b(e, t, n) {
                n = n || k;
                var i, r, o = n.createElement("script");
                o.text = e;
                if (t) {
                    for (i in c) {
                        r = t[i] || t.getAttribute && t.getAttribute(i);
                        if (r) {
                            o.setAttribute(i, r)
                        }
                    }
                }
                n.head.appendChild(o).parentNode.removeChild(o)
            }

            function x(e) {
                if (e == null) {
                    return e + ""
                }
                return typeof e === "object" || typeof e === "function" ? n[o.call(e)] || "object" : typeof e
            }
            var f = "3.4.1",
                S = function (e, t) {
                    return new S.fn.init(e, t)
                },
                p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            S.fn = S.prototype = {
                jquery: f,
                constructor: S,
                length: 0,
                toArray: function () {
                    return s.call(this)
                },
                get: function (e) {
                    if (e == null) {
                        return s.call(this)
                    }
                    return e < 0 ? this[e + this.length] : this[e]
                },
                pushStack: function (e) {
                    var t = S.merge(this.constructor(), e);
                    t.prevObject = this;
                    return t
                },
                each: function (e) {
                    return S.each(this, e)
                },
                map: function (n) {
                    return this.pushStack(S.map(this, function (e, t) {
                        return n.call(e, t, e)
                    }))
                },
                slice: function () {
                    return this.pushStack(s.apply(this, arguments))
                },
                first: function () {
                    return this.eq(0)
                },
                last: function () {
                    return this.eq(-1)
                },
                eq: function (e) {
                    var t = this.length,
                        n = +e + (e < 0 ? t : 0);
                    return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
                },
                end: function () {
                    return this.prevObject || this.constructor()
                },
                push: l,
                sort: t.sort,
                splice: t.splice
            };
            S.extend = S.fn.extend = function () {
                var e, t, n, i, r, o, a = arguments[0] || {},
                    s = 1,
                    l = arguments.length,
                    u = false;
                if (typeof a === "boolean") {
                    u = a;
                    a = arguments[s] || {};
                    s++
                }
                if (typeof a !== "object" && !_(a)) {
                    a = {}
                }
                if (s === l) {
                    a = this;
                    s--
                }
                for (; s < l; s++) {
                    if ((e = arguments[s]) != null) {
                        for (t in e) {
                            i = e[t];
                            if (t === "__proto__" || a === i) {
                                continue
                            }
                            if (u && i && (S.isPlainObject(i) || (r = Array.isArray(i)))) {
                                n = a[t];
                                if (r && !Array.isArray(n)) {
                                    o = []
                                } else if (!r && !S.isPlainObject(n)) {
                                    o = {}
                                } else {
                                    o = n
                                }
                                r = false;
                                a[t] = S.extend(u, o, i)
                            } else if (i !== undefined) {
                                a[t] = i
                            }
                        }
                    }
                }
                return a
            };
            S.extend({
                expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
                isReady: true,
                error: function (e) {
                    throw new Error(e)
                },
                noop: function () {},
                isPlainObject: function (e) {
                    var t, n;
                    if (!e || o.call(e) !== "[object Object]") {
                        return false
                    }
                    t = i(e);
                    if (!t) {
                        return true
                    }
                    n = m.call(t, "constructor") && t.constructor;
                    return typeof n === "function" && a.call(n) === u
                },
                isEmptyObject: function (e) {
                    var t;
                    for (t in e) {
                        return false
                    }
                    return true
                },
                globalEval: function (e, t) {
                    b(e, {
                        nonce: t && t.nonce
                    })
                },
                each: function (e, t) {
                    var n, i = 0;
                    if (d(e)) {
                        n = e.length;
                        for (; i < n; i++) {
                            if (t.call(e[i], i, e[i]) === false) {
                                break
                            }
                        }
                    } else {
                        for (i in e) {
                            if (t.call(e[i], i, e[i]) === false) {
                                break
                            }
                        }
                    }
                    return e
                },
                trim: function (e) {
                    return e == null ? "" : (e + "").replace(p, "")
                },
                makeArray: function (e, t) {
                    var n = t || [];
                    if (e != null) {
                        if (d(Object(e))) {
                            S.merge(n, typeof e === "string" ? [e] : e)
                        } else {
                            l.call(n, e)
                        }
                    }
                    return n
                },
                inArray: function (e, t, n) {
                    return t == null ? -1 : r.call(t, e, n)
                },
                merge: function (e, t) {
                    var n = +t.length,
                        i = 0,
                        r = e.length;
                    for (; i < n; i++) {
                        e[r++] = t[i]
                    }
                    e.length = r;
                    return e
                },
                grep: function (e, t, n) {
                    var i, r = [],
                        o = 0,
                        a = e.length,
                        s = !n;
                    for (; o < a; o++) {
                        i = !t(e[o], o);
                        if (i !== s) {
                            r.push(e[o])
                        }
                    }
                    return r
                },
                map: function (e, t, n) {
                    var i, r, o = 0,
                        a = [];
                    if (d(e)) {
                        i = e.length;
                        for (; o < i; o++) {
                            r = t(e[o], o, n);
                            if (r != null) {
                                a.push(r)
                            }
                        }
                    } else {
                        for (o in e) {
                            r = t(e[o], o, n);
                            if (r != null) {
                                a.push(r)
                            }
                        }
                    }
                    return g.apply([], a)
                },
                guid: 1,
                support: v
            });
            if (typeof Symbol === "function") {
                S.fn[Symbol.iterator] = t[Symbol.iterator]
            }
            S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
                n["[object " + t + "]"] = t.toLowerCase()
            });

            function d(e) {
                var t = !!e && "length" in e && e.length,
                    n = x(e);
                if (_(e) || y(e)) {
                    return false
                }
                return n === "array" || t === 0 || typeof t === "number" && t > 0 && t - 1 in e
            }
            var h = function (n) {
                var e, d, b, o, r, h, f, g, x, l, u, w, E, a, k, m, s, c, v, S = "sizzle" + 1 * new Date,
                    _ = n.document,
                    T = 0,
                    i = 0,
                    p = le(),
                    y = le(),
                    N = le(),
                    A = le(),
                    C = function (e, t) {
                        if (e === t) {
                            u = true
                        }
                        return 0
                    },
                    O = {}.hasOwnProperty,
                    t = [],
                    I = t.pop,
                    R = t.push,
                    P = t.push,
                    L = t.slice,
                    D = function (e, t) {
                        var n = 0,
                            i = e.length;
                        for (; n < i; n++) {
                            if (e[n] === t) {
                                return n
                            }
                        }
                        return -1
                    },
                    M = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                    j = "[\\x20\\t\\r\\n\\f]",
                    F = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
                    H = "\\[" + j + "*(" + F + ")(?:" + j + "*([*^$|!~]?=)" + j + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + F + "))|)" + j + "*\\]",
                    U = ":(" + F + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + H + ")*)|" + ".*" + ")\\)|)",
                    q = new RegExp(j + "+", "g"),
                    $ = new RegExp("^" + j + "+|((?:^|[^\\\\])(?:\\\\.)*)" + j + "+$", "g"),
                    B = new RegExp("^" + j + "*," + j + "*"),
                    G = new RegExp("^" + j + "*([>+~]|" + j + ")" + j + "*"),
                    W = new RegExp(j + "|>"),
                    Y = new RegExp(U),
                    V = new RegExp("^" + F + "$"),
                    K = {
                        ID: new RegExp("^#(" + F + ")"),
                        CLASS: new RegExp("^\\.(" + F + ")"),
                        TAG: new RegExp("^(" + F + "|[*])"),
                        ATTR: new RegExp("^" + H),
                        PSEUDO: new RegExp("^" + U),
                        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + j + "*(even|odd|(([+-]|)(\\d*)n|)" + j + "*(?:([+-]|)" + j + "*(\\d+)|))" + j + "*\\)|)", "i"),
                        bool: new RegExp("^(?:" + M + ")$", "i"),
                        needsContext: new RegExp("^" + j + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + j + "*((?:-\\d)?\\d*)" + j + "*\\)|)(?=[^-]|$)", "i")
                    },
                    z = /HTML$/i,
                    X = /^(?:input|select|textarea|button)$/i,
                    J = /^h\d$/i,
                    Q = /^[^{]+\{\s*\[native \w/,
                    Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                    ee = /[+~]/,
                    te = new RegExp("\\\\([\\da-f]{1,6}" + j + "?|(" + j + ")|.)", "ig"),
                    ne = function (e, t, n) {
                        var i = "0x" + t - 65536;
                        return i !== i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, i & 1023 | 56320)
                    },
                    ie = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                    re = function (e, t) {
                        if (t) {
                            if (e === "\0") {
                                return "�"
                            }
                            return e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " "
                        }
                        return "\\" + e
                    },
                    oe = function () {
                        w()
                    },
                    ae = be(function (e) {
                        return e.disabled === true && e.nodeName.toLowerCase() === "fieldset"
                    }, {
                        dir: "parentNode",
                        next: "legend"
                    });
                try {
                    P.apply(t = L.call(_.childNodes), _.childNodes);
                    t[_.childNodes.length].nodeType
                } catch (e) {
                    P = {
                        apply: t.length ? function (e, t) {
                            R.apply(e, L.call(t))
                        } : function (e, t) {
                            var n = e.length,
                                i = 0;
                            while (e[n++] = t[i++]) {}
                            e.length = n - 1
                        }
                    }
                }

                function se(t, e, n, i) {
                    var r, o, a, s, l, u, c, f = e && e.ownerDocument,
                        p = e ? e.nodeType : 9;
                    n = n || [];
                    if (typeof t !== "string" || !t || p !== 1 && p !== 9 && p !== 11) {
                        return n
                    }
                    if (!i) {
                        if ((e ? e.ownerDocument || e : _) !== E) {
                            w(e)
                        }
                        e = e || E;
                        if (k) {
                            if (p !== 11 && (l = Z.exec(t))) {
                                if (r = l[1]) {
                                    if (p === 9) {
                                        if (a = e.getElementById(r)) {
                                            if (a.id === r) {
                                                n.push(a);
                                                return n
                                            }
                                        } else {
                                            return n
                                        }
                                    } else {
                                        if (f && (a = f.getElementById(r)) && v(e, a) && a.id === r) {
                                            n.push(a);
                                            return n
                                        }
                                    }
                                } else if (l[2]) {
                                    P.apply(n, e.getElementsByTagName(t));
                                    return n
                                } else if ((r = l[3]) && d.getElementsByClassName && e.getElementsByClassName) {
                                    P.apply(n, e.getElementsByClassName(r));
                                    return n
                                }
                            }
                            if (d.qsa && !A[t + " "] && (!m || !m.test(t)) && (p !== 1 || e.nodeName.toLowerCase() !== "object")) {
                                c = t;
                                f = e;
                                if (p === 1 && W.test(t)) {
                                    if (s = e.getAttribute("id")) {
                                        s = s.replace(ie, re)
                                    } else {
                                        e.setAttribute("id", s = S)
                                    }
                                    u = h(t);
                                    o = u.length;
                                    while (o--) {
                                        u[o] = "#" + s + " " + ye(u[o])
                                    }
                                    c = u.join(",");
                                    f = ee.test(t) && ve(e.parentNode) || e
                                }
                                try {
                                    P.apply(n, f.querySelectorAll(c));
                                    return n
                                } catch (e) {
                                    A(t, true)
                                } finally {
                                    if (s === S) {
                                        e.removeAttribute("id")
                                    }
                                }
                            }
                        }
                    }
                    return g(t.replace($, "$1"), e, n, i)
                }

                function le() {
                    var n = [];

                    function i(e, t) {
                        if (n.push(e + " ") > b.cacheLength) {
                            delete i[n.shift()]
                        }
                        return i[e + " "] = t
                    }
                    return i
                }

                function ue(e) {
                    e[S] = true;
                    return e
                }

                function ce(e) {
                    var t = E.createElement("fieldset");
                    try {
                        return !!e(t)
                    } catch (e) {
                        return false
                    } finally {
                        if (t.parentNode) {
                            t.parentNode.removeChild(t)
                        }
                        t = null
                    }
                }

                function fe(e, t) {
                    var n = e.split("|"),
                        i = n.length;
                    while (i--) {
                        b.attrHandle[n[i]] = t
                    }
                }

                function pe(e, t) {
                    var n = t && e,
                        i = n && e.nodeType === 1 && t.nodeType === 1 && e.sourceIndex - t.sourceIndex;
                    if (i) {
                        return i
                    }
                    if (n) {
                        while (n = n.nextSibling) {
                            if (n === t) {
                                return -1
                            }
                        }
                    }
                    return e ? 1 : -1
                }

                function de(n) {
                    return function (e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && e.type === n
                    }
                }

                function he(n) {
                    return function (e) {
                        var t = e.nodeName.toLowerCase();
                        return (t === "input" || t === "button") && e.type === n
                    }
                }

                function ge(t) {
                    return function (e) {
                        if ("form" in e) {
                            if (e.parentNode && e.disabled === false) {
                                if ("label" in e) {
                                    if ("label" in e.parentNode) {
                                        return e.parentNode.disabled === t
                                    } else {
                                        return e.disabled === t
                                    }
                                }
                                return e.isDisabled === t || e.isDisabled !== !t && ae(e) === t
                            }
                            return e.disabled === t
                        } else if ("label" in e) {
                            return e.disabled === t
                        }
                        return false
                    }
                }

                function me(a) {
                    return ue(function (o) {
                        o = +o;
                        return ue(function (e, t) {
                            var n, i = a([], e.length, o),
                                r = i.length;
                            while (r--) {
                                if (e[n = i[r]]) {
                                    e[n] = !(t[n] = e[n])
                                }
                            }
                        })
                    })
                }

                function ve(e) {
                    return e && typeof e.getElementsByTagName !== "undefined" && e
                }
                d = se.support = {};
                r = se.isXML = function (e) {
                    var t = e.namespaceURI,
                        n = (e.ownerDocument || e).documentElement;
                    return !z.test(t || n && n.nodeName || "HTML")
                };
                w = se.setDocument = function (e) {
                    var t, n, i = e ? e.ownerDocument || e : _;
                    if (i === E || i.nodeType !== 9 || !i.documentElement) {
                        return E
                    }
                    E = i;
                    a = E.documentElement;
                    k = !r(E);
                    if (_ !== E && (n = E.defaultView) && n.top !== n) {
                        if (n.addEventListener) {
                            n.addEventListener("unload", oe, false)
                        } else if (n.attachEvent) {
                            n.attachEvent("onunload", oe)
                        }
                    }
                    d.attributes = ce(function (e) {
                        e.className = "i";
                        return !e.getAttribute("className")
                    });
                    d.getElementsByTagName = ce(function (e) {
                        e.appendChild(E.createComment(""));
                        return !e.getElementsByTagName("*").length
                    });
                    d.getElementsByClassName = Q.test(E.getElementsByClassName);
                    d.getById = ce(function (e) {
                        a.appendChild(e).id = S;
                        return !E.getElementsByName || !E.getElementsByName(S).length
                    });
                    if (d.getById) {
                        b.filter["ID"] = function (e) {
                            var t = e.replace(te, ne);
                            return function (e) {
                                return e.getAttribute("id") === t
                            }
                        };
                        b.find["ID"] = function (e, t) {
                            if (typeof t.getElementById !== "undefined" && k) {
                                var n = t.getElementById(e);
                                return n ? [n] : []
                            }
                        }
                    } else {
                        b.filter["ID"] = function (e) {
                            var n = e.replace(te, ne);
                            return function (e) {
                                var t = typeof e.getAttributeNode !== "undefined" && e.getAttributeNode("id");
                                return t && t.value === n
                            }
                        };
                        b.find["ID"] = function (e, t) {
                            if (typeof t.getElementById !== "undefined" && k) {
                                var n, i, r, o = t.getElementById(e);
                                if (o) {
                                    n = o.getAttributeNode("id");
                                    if (n && n.value === e) {
                                        return [o]
                                    }
                                    r = t.getElementsByName(e);
                                    i = 0;
                                    while (o = r[i++]) {
                                        n = o.getAttributeNode("id");
                                        if (n && n.value === e) {
                                            return [o]
                                        }
                                    }
                                }
                                return []
                            }
                        }
                    }
                    b.find["TAG"] = d.getElementsByTagName ? function (e, t) {
                        if (typeof t.getElementsByTagName !== "undefined") {
                            return t.getElementsByTagName(e)
                        } else if (d.qsa) {
                            return t.querySelectorAll(e)
                        }
                    } : function (e, t) {
                        var n, i = [],
                            r = 0,
                            o = t.getElementsByTagName(e);
                        if (e === "*") {
                            while (n = o[r++]) {
                                if (n.nodeType === 1) {
                                    i.push(n)
                                }
                            }
                            return i
                        }
                        return o
                    };
                    b.find["CLASS"] = d.getElementsByClassName && function (e, t) {
                        if (typeof t.getElementsByClassName !== "undefined" && k) {
                            return t.getElementsByClassName(e)
                        }
                    };
                    s = [];
                    m = [];
                    if (d.qsa = Q.test(E.querySelectorAll)) {
                        ce(function (e) {
                            a.appendChild(e).innerHTML = "<a id='" + S + "'></a>" + "<select id='" + S + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";
                            if (e.querySelectorAll("[msallowcapture^='']").length) {
                                m.push("[*^$]=" + j + "*(?:''|\"\")")
                            }
                            if (!e.querySelectorAll("[selected]").length) {
                                m.push("\\[" + j + "*(?:value|" + M + ")")
                            }
                            if (!e.querySelectorAll("[id~=" + S + "-]").length) {
                                m.push("~=")
                            }
                            if (!e.querySelectorAll(":checked").length) {
                                m.push(":checked")
                            }
                            if (!e.querySelectorAll("a#" + S + "+*").length) {
                                m.push(".#.+[+~]")
                            }
                        });
                        ce(function (e) {
                            e.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";
                            var t = E.createElement("input");
                            t.setAttribute("type", "hidden");
                            e.appendChild(t).setAttribute("name", "D");
                            if (e.querySelectorAll("[name=d]").length) {
                                m.push("name" + j + "*[*^$|!~]?=")
                            }
                            if (e.querySelectorAll(":enabled").length !== 2) {
                                m.push(":enabled", ":disabled")
                            }
                            a.appendChild(e).disabled = true;
                            if (e.querySelectorAll(":disabled").length !== 2) {
                                m.push(":enabled", ":disabled")
                            }
                            e.querySelectorAll("*,:x");
                            m.push(",.*:")
                        })
                    }
                    if (d.matchesSelector = Q.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) {
                        ce(function (e) {
                            d.disconnectedMatch = c.call(e, "*");
                            c.call(e, "[s!='']:x");
                            s.push("!=", U)
                        })
                    }
                    m = m.length && new RegExp(m.join("|"));
                    s = s.length && new RegExp(s.join("|"));
                    t = Q.test(a.compareDocumentPosition);
                    v = t || Q.test(a.contains) ? function (e, t) {
                        var n = e.nodeType === 9 ? e.documentElement : e,
                            i = t && t.parentNode;
                        return e === i || !!(i && i.nodeType === 1 && (n.contains ? n.contains(i) : e.compareDocumentPosition && e.compareDocumentPosition(i) & 16))
                    } : function (e, t) {
                        if (t) {
                            while (t = t.parentNode) {
                                if (t === e) {
                                    return true
                                }
                            }
                        }
                        return false
                    };
                    C = t ? function (e, t) {
                        if (e === t) {
                            u = true;
                            return 0
                        }
                        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        if (n) {
                            return n
                        }
                        n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1;
                        if (n & 1 || !d.sortDetached && t.compareDocumentPosition(e) === n) {
                            if (e === E || e.ownerDocument === _ && v(_, e)) {
                                return -1
                            }
                            if (t === E || t.ownerDocument === _ && v(_, t)) {
                                return 1
                            }
                            return l ? D(l, e) - D(l, t) : 0
                        }
                        return n & 4 ? -1 : 1
                    } : function (e, t) {
                        if (e === t) {
                            u = true;
                            return 0
                        }
                        var n, i = 0,
                            r = e.parentNode,
                            o = t.parentNode,
                            a = [e],
                            s = [t];
                        if (!r || !o) {
                            return e === E ? -1 : t === E ? 1 : r ? -1 : o ? 1 : l ? D(l, e) - D(l, t) : 0
                        } else if (r === o) {
                            return pe(e, t)
                        }
                        n = e;
                        while (n = n.parentNode) {
                            a.unshift(n)
                        }
                        n = t;
                        while (n = n.parentNode) {
                            s.unshift(n)
                        }
                        while (a[i] === s[i]) {
                            i++
                        }
                        return i ? pe(a[i], s[i]) : a[i] === _ ? -1 : s[i] === _ ? 1 : 0
                    };
                    return E
                };
                se.matches = function (e, t) {
                    return se(e, null, null, t)
                };
                se.matchesSelector = function (e, t) {
                    if ((e.ownerDocument || e) !== E) {
                        w(e)
                    }
                    if (d.matchesSelector && k && !A[t + " "] && (!s || !s.test(t)) && (!m || !m.test(t))) {
                        try {
                            var n = c.call(e, t);
                            if (n || d.disconnectedMatch || e.document && e.document.nodeType !== 11) {
                                return n
                            }
                        } catch (e) {
                            A(t, true)
                        }
                    }
                    return se(t, E, null, [e]).length > 0
                };
                se.contains = function (e, t) {
                    if ((e.ownerDocument || e) !== E) {
                        w(e)
                    }
                    return v(e, t)
                };
                se.attr = function (e, t) {
                    if ((e.ownerDocument || e) !== E) {
                        w(e)
                    }
                    var n = b.attrHandle[t.toLowerCase()],
                        i = n && O.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !k) : undefined;
                    return i !== undefined ? i : d.attributes || !k ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
                };
                se.escape = function (e) {
                    return (e + "").replace(ie, re)
                };
                se.error = function (e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                };
                se.uniqueSort = function (e) {
                    var t, n = [],
                        i = 0,
                        r = 0;
                    u = !d.detectDuplicates;
                    l = !d.sortStable && e.slice(0);
                    e.sort(C);
                    if (u) {
                        while (t = e[r++]) {
                            if (t === e[r]) {
                                i = n.push(r)
                            }
                        }
                        while (i--) {
                            e.splice(n[i], 1)
                        }
                    }
                    l = null;
                    return e
                };
                o = se.getText = function (e) {
                    var t, n = "",
                        i = 0,
                        r = e.nodeType;
                    if (!r) {
                        while (t = e[i++]) {
                            n += o(t)
                        }
                    } else if (r === 1 || r === 9 || r === 11) {
                        if (typeof e.textContent === "string") {
                            return e.textContent
                        } else {
                            for (e = e.firstChild; e; e = e.nextSibling) {
                                n += o(e)
                            }
                        }
                    } else if (r === 3 || r === 4) {
                        return e.nodeValue
                    }
                    return n
                };
                b = se.selectors = {
                    cacheLength: 50,
                    createPseudo: ue,
                    match: K,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: true
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: true
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function (e) {
                            e[1] = e[1].replace(te, ne);
                            e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne);
                            if (e[2] === "~=") {
                                e[3] = " " + e[3] + " "
                            }
                            return e.slice(0, 4)
                        },
                        CHILD: function (e) {
                            e[1] = e[1].toLowerCase();
                            if (e[1].slice(0, 3) === "nth") {
                                if (!e[3]) {
                                    se.error(e[0])
                                }
                                e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd"));
                                e[5] = +(e[7] + e[8] || e[3] === "odd")
                            } else if (e[3]) {
                                se.error(e[0])
                            }
                            return e
                        },
                        PSEUDO: function (e) {
                            var t, n = !e[6] && e[2];
                            if (K["CHILD"].test(e[0])) {
                                return null
                            }
                            if (e[3]) {
                                e[2] = e[4] || e[5] || ""
                            } else if (n && Y.test(n) && (t = h(n, true)) && (t = n.indexOf(")", n.length - t) - n.length)) {
                                e[0] = e[0].slice(0, t);
                                e[2] = n.slice(0, t)
                            }
                            return e.slice(0, 3)
                        }
                    },
                    filter: {
                        TAG: function (e) {
                            var t = e.replace(te, ne).toLowerCase();
                            return e === "*" ? function () {
                                return true
                            } : function (e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function (e) {
                            var t = p[e + " "];
                            return t || (t = new RegExp("(^|" + j + ")" + e + "(" + j + "|$)")) && p(e, function (e) {
                                return t.test(typeof e.className === "string" && e.className || typeof e.getAttribute !== "undefined" && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function (n, i, r) {
                            return function (e) {
                                var t = se.attr(e, n);
                                if (t == null) {
                                    return i === "!="
                                }
                                if (!i) {
                                    return true
                                }
                                t += "";
                                return i === "=" ? t === r : i === "!=" ? t !== r : i === "^=" ? r && t.indexOf(r) === 0 : i === "*=" ? r && t.indexOf(r) > -1 : i === "$=" ? r && t.slice(-r.length) === r : i === "~=" ? (" " + t.replace(q, " ") + " ").indexOf(r) > -1 : i === "|=" ? t === r || t.slice(0, r.length + 1) === r + "-" : false
                            }
                        },
                        CHILD: function (h, e, t, g, m) {
                            var v = h.slice(0, 3) !== "nth",
                                _ = h.slice(-4) !== "last",
                                y = e === "of-type";
                            return g === 1 && m === 0 ? function (e) {
                                return !!e.parentNode
                            } : function (e, t, n) {
                                var i, r, o, a, s, l, u = v !== _ ? "nextSibling" : "previousSibling",
                                    c = e.parentNode,
                                    f = y && e.nodeName.toLowerCase(),
                                    p = !n && !y,
                                    d = false;
                                if (c) {
                                    if (v) {
                                        while (u) {
                                            a = e;
                                            while (a = a[u]) {
                                                if (y ? a.nodeName.toLowerCase() === f : a.nodeType === 1) {
                                                    return false
                                                }
                                            }
                                            l = u = h === "only" && !l && "nextSibling"
                                        }
                                        return true
                                    }
                                    l = [_ ? c.firstChild : c.lastChild];
                                    if (_ && p) {
                                        a = c;
                                        o = a[S] || (a[S] = {});
                                        r = o[a.uniqueID] || (o[a.uniqueID] = {});
                                        i = r[h] || [];
                                        s = i[0] === T && i[1];
                                        d = s && i[2];
                                        a = s && c.childNodes[s];
                                        while (a = ++s && a && a[u] || (d = s = 0) || l.pop()) {
                                            if (a.nodeType === 1 && ++d && a === e) {
                                                r[h] = [T, s, d];
                                                break
                                            }
                                        }
                                    } else {
                                        if (p) {
                                            a = e;
                                            o = a[S] || (a[S] = {});
                                            r = o[a.uniqueID] || (o[a.uniqueID] = {});
                                            i = r[h] || [];
                                            s = i[0] === T && i[1];
                                            d = s
                                        }
                                        if (d === false) {
                                            while (a = ++s && a && a[u] || (d = s = 0) || l.pop()) {
                                                if ((y ? a.nodeName.toLowerCase() === f : a.nodeType === 1) && ++d) {
                                                    if (p) {
                                                        o = a[S] || (a[S] = {});
                                                        r = o[a.uniqueID] || (o[a.uniqueID] = {});
                                                        r[h] = [T, d]
                                                    }
                                                    if (a === e) {
                                                        break
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    d -= m;
                                    return d === g || d % g === 0 && d / g >= 0
                                }
                            }
                        },
                        PSEUDO: function (e, o) {
                            var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                            if (a[S]) {
                                return a(o)
                            }
                            if (a.length > 1) {
                                t = [e, e, "", o];
                                return b.setFilters.hasOwnProperty(e.toLowerCase()) ? ue(function (e, t) {
                                    var n, i = a(e, o),
                                        r = i.length;
                                    while (r--) {
                                        n = D(e, i[r]);
                                        e[n] = !(t[n] = i[r])
                                    }
                                }) : function (e) {
                                    return a(e, 0, t)
                                }
                            }
                            return a
                        }
                    },
                    pseudos: {
                        not: ue(function (e) {
                            var i = [],
                                r = [],
                                s = f(e.replace($, "$1"));
                            return s[S] ? ue(function (e, t, n, i) {
                                var r, o = s(e, null, i, []),
                                    a = e.length;
                                while (a--) {
                                    if (r = o[a]) {
                                        e[a] = !(t[a] = r)
                                    }
                                }
                            }) : function (e, t, n) {
                                i[0] = e;
                                s(i, null, n, r);
                                i[0] = null;
                                return !r.pop()
                            }
                        }),
                        has: ue(function (t) {
                            return function (e) {
                                return se(t, e).length > 0
                            }
                        }),
                        contains: ue(function (t) {
                            t = t.replace(te, ne);
                            return function (e) {
                                return (e.textContent || o(e)).indexOf(t) > -1
                            }
                        }),
                        lang: ue(function (n) {
                            if (!V.test(n || "")) {
                                se.error("unsupported lang: " + n)
                            }
                            n = n.replace(te, ne).toLowerCase();
                            return function (e) {
                                var t;
                                do {
                                    if (t = k ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) {
                                        t = t.toLowerCase();
                                        return t === n || t.indexOf(n + "-") === 0
                                    }
                                } while ((e = e.parentNode) && e.nodeType === 1);
                                return false
                            }
                        }),
                        target: function (e) {
                            var t = n.location && n.location.hash;
                            return t && t.slice(1) === e.id
                        },
                        root: function (e) {
                            return e === a
                        },
                        focus: function (e) {
                            return e === E.activeElement && (!E.hasFocus || E.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: ge(false),
                        disabled: ge(true),
                        checked: function (e) {
                            var t = e.nodeName.toLowerCase();
                            return t === "input" && !!e.checked || t === "option" && !!e.selected
                        },
                        selected: function (e) {
                            if (e.parentNode) {
                                e.parentNode.selectedIndex
                            }
                            return e.selected === true
                        },
                        empty: function (e) {
                            for (e = e.firstChild; e; e = e.nextSibling) {
                                if (e.nodeType < 6) {
                                    return false
                                }
                            }
                            return true
                        },
                        parent: function (e) {
                            return !b.pseudos["empty"](e)
                        },
                        header: function (e) {
                            return J.test(e.nodeName)
                        },
                        input: function (e) {
                            return X.test(e.nodeName)
                        },
                        button: function (e) {
                            var t = e.nodeName.toLowerCase();
                            return t === "input" && e.type === "button" || t === "button"
                        },
                        text: function (e) {
                            var t;
                            return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === "text")
                        },
                        first: me(function () {
                            return [0]
                        }),
                        last: me(function (e, t) {
                            return [t - 1]
                        }),
                        eq: me(function (e, t, n) {
                            return [n < 0 ? n + t : n]
                        }),
                        even: me(function (e, t) {
                            var n = 0;
                            for (; n < t; n += 2) {
                                e.push(n)
                            }
                            return e
                        }),
                        odd: me(function (e, t) {
                            var n = 1;
                            for (; n < t; n += 2) {
                                e.push(n)
                            }
                            return e
                        }),
                        lt: me(function (e, t, n) {
                            var i = n < 0 ? n + t : n > t ? t : n;
                            for (; --i >= 0;) {
                                e.push(i)
                            }
                            return e
                        }),
                        gt: me(function (e, t, n) {
                            var i = n < 0 ? n + t : n;
                            for (; ++i < t;) {
                                e.push(i)
                            }
                            return e
                        })
                    }
                };
                b.pseudos["nth"] = b.pseudos["eq"];
                for (e in {
                        radio: true,
                        checkbox: true,
                        file: true,
                        password: true,
                        image: true
                    }) {
                    b.pseudos[e] = de(e)
                }
                for (e in {
                        submit: true,
                        reset: true
                    }) {
                    b.pseudos[e] = he(e)
                }

                function _e() {}
                _e.prototype = b.filters = b.pseudos;
                b.setFilters = new _e;
                h = se.tokenize = function (e, t) {
                    var n, i, r, o, a, s, l, u = y[e + " "];
                    if (u) {
                        return t ? 0 : u.slice(0)
                    }
                    a = e;
                    s = [];
                    l = b.preFilter;
                    while (a) {
                        if (!n || (i = B.exec(a))) {
                            if (i) {
                                a = a.slice(i[0].length) || a
                            }
                            s.push(r = [])
                        }
                        n = false;
                        if (i = G.exec(a)) {
                            n = i.shift();
                            r.push({
                                value: n,
                                type: i[0].replace($, " ")
                            });
                            a = a.slice(n.length)
                        }
                        for (o in b.filter) {
                            if ((i = K[o].exec(a)) && (!l[o] || (i = l[o](i)))) {
                                n = i.shift();
                                r.push({
                                    value: n,
                                    type: o,
                                    matches: i
                                });
                                a = a.slice(n.length)
                            }
                        }
                        if (!n) {
                            break
                        }
                    }
                    return t ? a.length : a ? se.error(e) : y(e, s).slice(0)
                };

                function ye(e) {
                    var t = 0,
                        n = e.length,
                        i = "";
                    for (; t < n; t++) {
                        i += e[t].value
                    }
                    return i
                }

                function be(s, e, t) {
                    var l = e.dir,
                        u = e.next,
                        c = u || l,
                        f = t && c === "parentNode",
                        p = i++;
                    return e.first ? function (e, t, n) {
                        while (e = e[l]) {
                            if (e.nodeType === 1 || f) {
                                return s(e, t, n)
                            }
                        }
                        return false
                    } : function (e, t, n) {
                        var i, r, o, a = [T, p];
                        if (n) {
                            while (e = e[l]) {
                                if (e.nodeType === 1 || f) {
                                    if (s(e, t, n)) {
                                        return true
                                    }
                                }
                            }
                        } else {
                            while (e = e[l]) {
                                if (e.nodeType === 1 || f) {
                                    o = e[S] || (e[S] = {});
                                    r = o[e.uniqueID] || (o[e.uniqueID] = {});
                                    if (u && u === e.nodeName.toLowerCase()) {
                                        e = e[l] || e
                                    } else if ((i = r[c]) && i[0] === T && i[1] === p) {
                                        return a[2] = i[2]
                                    } else {
                                        r[c] = a;
                                        if (a[2] = s(e, t, n)) {
                                            return true
                                        }
                                    }
                                }
                            }
                        }
                        return false
                    }
                }

                function xe(r) {
                    return r.length > 1 ? function (e, t, n) {
                        var i = r.length;
                        while (i--) {
                            if (!r[i](e, t, n)) {
                                return false
                            }
                        }
                        return true
                    } : r[0]
                }

                function we(e, t, n) {
                    var i = 0,
                        r = t.length;
                    for (; i < r; i++) {
                        se(e, t[i], n)
                    }
                    return n
                }

                function Ee(e, t, n, i, r) {
                    var o, a = [],
                        s = 0,
                        l = e.length,
                        u = t != null;
                    for (; s < l; s++) {
                        if (o = e[s]) {
                            if (!n || n(o, i, r)) {
                                a.push(o);
                                if (u) {
                                    t.push(s)
                                }
                            }
                        }
                    }
                    return a
                }

                function ke(d, h, g, m, v, e) {
                    if (m && !m[S]) {
                        m = ke(m)
                    }
                    if (v && !v[S]) {
                        v = ke(v, e)
                    }
                    return ue(function (e, t, n, i) {
                        var r, o, a, s = [],
                            l = [],
                            u = t.length,
                            c = e || we(h || "*", n.nodeType ? [n] : n, []),
                            f = d && (e || !h) ? Ee(c, s, d, n, i) : c,
                            p = g ? v || (e ? d : u || m) ? [] : t : f;
                        if (g) {
                            g(f, p, n, i)
                        }
                        if (m) {
                            r = Ee(p, l);
                            m(r, [], n, i);
                            o = r.length;
                            while (o--) {
                                if (a = r[o]) {
                                    p[l[o]] = !(f[l[o]] = a)
                                }
                            }
                        }
                        if (e) {
                            if (v || d) {
                                if (v) {
                                    r = [];
                                    o = p.length;
                                    while (o--) {
                                        if (a = p[o]) {
                                            r.push(f[o] = a)
                                        }
                                    }
                                    v(null, p = [], r, i)
                                }
                                o = p.length;
                                while (o--) {
                                    if ((a = p[o]) && (r = v ? D(e, a) : s[o]) > -1) {
                                        e[r] = !(t[r] = a)
                                    }
                                }
                            }
                        } else {
                            p = Ee(p === t ? p.splice(u, p.length) : p);
                            if (v) {
                                v(null, t, p, i)
                            } else {
                                P.apply(t, p)
                            }
                        }
                    })
                }

                function Se(e) {
                    var r, t, n, i = e.length,
                        o = b.relative[e[0].type],
                        a = o || b.relative[" "],
                        s = o ? 1 : 0,
                        l = be(function (e) {
                            return e === r
                        }, a, true),
                        u = be(function (e) {
                            return D(r, e) > -1
                        }, a, true),
                        c = [function (e, t, n) {
                            var i = !o && (n || t !== x) || ((r = t).nodeType ? l(e, t, n) : u(e, t, n));
                            r = null;
                            return i
                        }];
                    for (; s < i; s++) {
                        if (t = b.relative[e[s].type]) {
                            c = [be(xe(c), t)]
                        } else {
                            t = b.filter[e[s].type].apply(null, e[s].matches);
                            if (t[S]) {
                                n = ++s;
                                for (; n < i; n++) {
                                    if (b.relative[e[n].type]) {
                                        break
                                    }
                                }
                                return ke(s > 1 && xe(c), s > 1 && ye(e.slice(0, s - 1).concat({
                                    value: e[s - 2].type === " " ? "*" : ""
                                })).replace($, "$1"), t, s < n && Se(e.slice(s, n)), n < i && Se(e = e.slice(n)), n < i && ye(e))
                            }
                            c.push(t)
                        }
                    }
                    return xe(c)
                }

                function Te(m, v) {
                    var _ = v.length > 0,
                        y = m.length > 0,
                        e = function (e, t, n, i, r) {
                            var o, a, s, l = 0,
                                u = "0",
                                c = e && [],
                                f = [],
                                p = x,
                                d = e || y && b.find["TAG"]("*", r),
                                h = T += p == null ? 1 : Math.random() || .1,
                                g = d.length;
                            if (r) {
                                x = t === E || t || r
                            }
                            for (; u !== g && (o = d[u]) != null; u++) {
                                if (y && o) {
                                    a = 0;
                                    if (!t && o.ownerDocument !== E) {
                                        w(o);
                                        n = !k
                                    }
                                    while (s = m[a++]) {
                                        if (s(o, t || E, n)) {
                                            i.push(o);
                                            break
                                        }
                                    }
                                    if (r) {
                                        T = h
                                    }
                                }
                                if (_) {
                                    if (o = !s && o) {
                                        l--
                                    }
                                    if (e) {
                                        c.push(o)
                                    }
                                }
                            }
                            l += u;
                            if (_ && u !== l) {
                                a = 0;
                                while (s = v[a++]) {
                                    s(c, f, t, n)
                                }
                                if (e) {
                                    if (l > 0) {
                                        while (u--) {
                                            if (!(c[u] || f[u])) {
                                                f[u] = I.call(i)
                                            }
                                        }
                                    }
                                    f = Ee(f)
                                }
                                P.apply(i, f);
                                if (r && !e && f.length > 0 && l + v.length > 1) {
                                    se.uniqueSort(i)
                                }
                            }
                            if (r) {
                                T = h;
                                x = p
                            }
                            return c
                        };
                    return _ ? ue(e) : e
                }
                f = se.compile = function (e, t) {
                    var n, i = [],
                        r = [],
                        o = N[e + " "];
                    if (!o) {
                        if (!t) {
                            t = h(e)
                        }
                        n = t.length;
                        while (n--) {
                            o = Se(t[n]);
                            if (o[S]) {
                                i.push(o)
                            } else {
                                r.push(o)
                            }
                        }
                        o = N(e, Te(r, i));
                        o.selector = e
                    }
                    return o
                };
                g = se.select = function (e, t, n, i) {
                    var r, o, a, s, l, u = typeof e === "function" && e,
                        c = !i && h(e = u.selector || e);
                    n = n || [];
                    if (c.length === 1) {
                        o = c[0] = c[0].slice(0);
                        if (o.length > 2 && (a = o[0]).type === "ID" && t.nodeType === 9 && k && b.relative[o[1].type]) {
                            t = (b.find["ID"](a.matches[0].replace(te, ne), t) || [])[0];
                            if (!t) {
                                return n
                            } else if (u) {
                                t = t.parentNode
                            }
                            e = e.slice(o.shift().value.length)
                        }
                        r = K["needsContext"].test(e) ? 0 : o.length;
                        while (r--) {
                            a = o[r];
                            if (b.relative[s = a.type]) {
                                break
                            }
                            if (l = b.find[s]) {
                                if (i = l(a.matches[0].replace(te, ne), ee.test(o[0].type) && ve(t.parentNode) || t)) {
                                    o.splice(r, 1);
                                    e = i.length && ye(o);
                                    if (!e) {
                                        P.apply(n, i);
                                        return n
                                    }
                                    break
                                }
                            }
                        }
                    }(u || f(e, c))(i, t, !k, n, !t || ee.test(e) && ve(t.parentNode) || t);
                    return n
                };
                d.sortStable = S.split("").sort(C).join("") === S;
                d.detectDuplicates = !!u;
                w();
                d.sortDetached = ce(function (e) {
                    return e.compareDocumentPosition(E.createElement("fieldset")) & 1
                });
                if (!ce(function (e) {
                        e.innerHTML = "<a href='#'></a>";
                        return e.firstChild.getAttribute("href") === "#"
                    })) {
                    fe("type|href|height|width", function (e, t, n) {
                        if (!n) {
                            return e.getAttribute(t, t.toLowerCase() === "type" ? 1 : 2)
                        }
                    })
                }
                if (!d.attributes || !ce(function (e) {
                        e.innerHTML = "<input/>";
                        e.firstChild.setAttribute("value", "");
                        return e.firstChild.getAttribute("value") === ""
                    })) {
                    fe("value", function (e, t, n) {
                        if (!n && e.nodeName.toLowerCase() === "input") {
                            return e.defaultValue
                        }
                    })
                }
                if (!ce(function (e) {
                        return e.getAttribute("disabled") == null
                    })) {
                    fe(M, function (e, t, n) {
                        var i;
                        if (!n) {
                            return e[t] === true ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
                        }
                    })
                }
                return se
            }(E);
            S.find = h;
            S.expr = h.selectors;
            S.expr[":"] = S.expr.pseudos;
            S.uniqueSort = S.unique = h.uniqueSort;
            S.text = h.getText;
            S.isXMLDoc = h.isXML;
            S.contains = h.contains;
            S.escapeSelector = h.escape;
            var w = function (e, t, n) {
                var i = [],
                    r = n !== undefined;
                while ((e = e[t]) && e.nodeType !== 9) {
                    if (e.nodeType === 1) {
                        if (r && S(e).is(n)) {
                            break
                        }
                        i.push(e)
                    }
                }
                return i
            };
            var T = function (e, t) {
                var n = [];
                for (; e; e = e.nextSibling) {
                    if (e.nodeType === 1 && e !== t) {
                        n.push(e)
                    }
                }
                return n
            };
            var N = S.expr.match.needsContext;

            function A(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            }
            var C = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

            function O(e, n, i) {
                if (_(n)) {
                    return S.grep(e, function (e, t) {
                        return !!n.call(e, t, e) !== i
                    })
                }
                if (n.nodeType) {
                    return S.grep(e, function (e) {
                        return e === n !== i
                    })
                }
                if (typeof n !== "string") {
                    return S.grep(e, function (e) {
                        return r.call(n, e) > -1 !== i
                    })
                }
                return S.filter(n, e, i)
            }
            S.filter = function (e, t, n) {
                var i = t[0];
                if (n) {
                    e = ":not(" + e + ")"
                }
                if (t.length === 1 && i.nodeType === 1) {
                    return S.find.matchesSelector(i, e) ? [i] : []
                }
                return S.find.matches(e, S.grep(t, function (e) {
                    return e.nodeType === 1
                }))
            };
            S.fn.extend({
                find: function (e) {
                    var t, n, i = this.length,
                        r = this;
                    if (typeof e !== "string") {
                        return this.pushStack(S(e).filter(function () {
                            for (t = 0; t < i; t++) {
                                if (S.contains(r[t], this)) {
                                    return true
                                }
                            }
                        }))
                    }
                    n = this.pushStack([]);
                    for (t = 0; t < i; t++) {
                        S.find(e, r[t], n)
                    }
                    return i > 1 ? S.uniqueSort(n) : n
                },
                filter: function (e) {
                    return this.pushStack(O(this, e || [], false))
                },
                not: function (e) {
                    return this.pushStack(O(this, e || [], true))
                },
                is: function (e) {
                    return !!O(this, typeof e === "string" && N.test(e) ? S(e) : e || [], false).length
                }
            });
            var I, R = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
                P = S.fn.init = function (e, t, n) {
                    var i, r;
                    if (!e) {
                        return this
                    }
                    n = n || I;
                    if (typeof e === "string") {
                        if (e[0] === "<" && e[e.length - 1] === ">" && e.length >= 3) {
                            i = [null, e, null]
                        } else {
                            i = R.exec(e)
                        }
                        if (i && (i[1] || !t)) {
                            if (i[1]) {
                                t = t instanceof S ? t[0] : t;
                                S.merge(this, S.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : k, true));
                                if (C.test(i[1]) && S.isPlainObject(t)) {
                                    for (i in t) {
                                        if (_(this[i])) {
                                            this[i](t[i])
                                        } else {
                                            this.attr(i, t[i])
                                        }
                                    }
                                }
                                return this
                            } else {
                                r = k.getElementById(i[2]);
                                if (r) {
                                    this[0] = r;
                                    this.length = 1
                                }
                                return this
                            }
                        } else if (!t || t.jquery) {
                            return (t || n).find(e)
                        } else {
                            return this.constructor(t).find(e)
                        }
                    } else if (e.nodeType) {
                        this[0] = e;
                        this.length = 1;
                        return this
                    } else if (_(e)) {
                        return n.ready !== undefined ? n.ready(e) : e(S)
                    }
                    return S.makeArray(e, this)
                };
            P.prototype = S.fn;
            I = S(k);
            var L = /^(?:parents|prev(?:Until|All))/,
                D = {
                    children: true,
                    contents: true,
                    next: true,
                    prev: true
                };
            S.fn.extend({
                has: function (e) {
                    var t = S(e, this),
                        n = t.length;
                    return this.filter(function () {
                        var e = 0;
                        for (; e < n; e++) {
                            if (S.contains(this, t[e])) {
                                return true
                            }
                        }
                    })
                },
                closest: function (e, t) {
                    var n, i = 0,
                        r = this.length,
                        o = [],
                        a = typeof e !== "string" && S(e);
                    if (!N.test(e)) {
                        for (; i < r; i++) {
                            for (n = this[i]; n && n !== t; n = n.parentNode) {
                                if (n.nodeType < 11 && (a ? a.index(n) > -1 : n.nodeType === 1 && S.find.matchesSelector(n, e))) {
                                    o.push(n);
                                    break
                                }
                            }
                        }
                    }
                    return this.pushStack(o.length > 1 ? S.uniqueSort(o) : o)
                },
                index: function (e) {
                    if (!e) {
                        return this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                    }
                    if (typeof e === "string") {
                        return r.call(S(e), this[0])
                    }
                    return r.call(this, e.jquery ? e[0] : e)
                },
                add: function (e, t) {
                    return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))))
                },
                addBack: function (e) {
                    return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
                }
            });

            function M(e, t) {
                while ((e = e[t]) && e.nodeType !== 1) {}
                return e
            }
            S.each({
                parent: function (e) {
                    var t = e.parentNode;
                    return t && t.nodeType !== 11 ? t : null
                },
                parents: function (e) {
                    return w(e, "parentNode")
                },
                parentsUntil: function (e, t, n) {
                    return w(e, "parentNode", n)
                },
                next: function (e) {
                    return M(e, "nextSibling")
                },
                prev: function (e) {
                    return M(e, "previousSibling")
                },
                nextAll: function (e) {
                    return w(e, "nextSibling")
                },
                prevAll: function (e) {
                    return w(e, "previousSibling")
                },
                nextUntil: function (e, t, n) {
                    return w(e, "nextSibling", n)
                },
                prevUntil: function (e, t, n) {
                    return w(e, "previousSibling", n)
                },
                siblings: function (e) {
                    return T((e.parentNode || {}).firstChild, e)
                },
                children: function (e) {
                    return T(e.firstChild)
                },
                contents: function (e) {
                    if (typeof e.contentDocument !== "undefined") {
                        return e.contentDocument
                    }
                    if (A(e, "template")) {
                        e = e.content || e
                    }
                    return S.merge([], e.childNodes)
                }
            }, function (i, r) {
                S.fn[i] = function (e, t) {
                    var n = S.map(this, r, e);
                    if (i.slice(-5) !== "Until") {
                        t = e
                    }
                    if (t && typeof t === "string") {
                        n = S.filter(t, n)
                    }
                    if (this.length > 1) {
                        if (!D[i]) {
                            S.uniqueSort(n)
                        }
                        if (L.test(i)) {
                            n.reverse()
                        }
                    }
                    return this.pushStack(n)
                }
            });
            var j = /[^\x20\t\r\n\f]+/g;

            function F(e) {
                var n = {};
                S.each(e.match(j) || [], function (e, t) {
                    n[t] = true
                });
                return n
            }
            S.Callbacks = function (i) {
                i = typeof i === "string" ? F(i) : S.extend({}, i);
                var n, e, t, r, o = [],
                    a = [],
                    s = -1,
                    l = function () {
                        r = r || i.once;
                        t = n = true;
                        for (; a.length; s = -1) {
                            e = a.shift();
                            while (++s < o.length) {
                                if (o[s].apply(e[0], e[1]) === false && i.stopOnFalse) {
                                    s = o.length;
                                    e = false
                                }
                            }
                        }
                        if (!i.memory) {
                            e = false
                        }
                        n = false;
                        if (r) {
                            if (e) {
                                o = []
                            } else {
                                o = ""
                            }
                        }
                    },
                    u = {
                        add: function () {
                            if (o) {
                                if (e && !n) {
                                    s = o.length - 1;
                                    a.push(e)
                                }(function n(e) {
                                    S.each(e, function (e, t) {
                                        if (_(t)) {
                                            if (!i.unique || !u.has(t)) {
                                                o.push(t)
                                            }
                                        } else if (t && t.length && x(t) !== "string") {
                                            n(t)
                                        }
                                    })
                                })(arguments);
                                if (e && !n) {
                                    l()
                                }
                            }
                            return this
                        },
                        remove: function () {
                            S.each(arguments, function (e, t) {
                                var n;
                                while ((n = S.inArray(t, o, n)) > -1) {
                                    o.splice(n, 1);
                                    if (n <= s) {
                                        s--
                                    }
                                }
                            });
                            return this
                        },
                        has: function (e) {
                            return e ? S.inArray(e, o) > -1 : o.length > 0
                        },
                        empty: function () {
                            if (o) {
                                o = []
                            }
                            return this
                        },
                        disable: function () {
                            r = a = [];
                            o = e = "";
                            return this
                        },
                        disabled: function () {
                            return !o
                        },
                        lock: function () {
                            r = a = [];
                            if (!e && !n) {
                                o = e = ""
                            }
                            return this
                        },
                        locked: function () {
                            return !!r
                        },
                        fireWith: function (e, t) {
                            if (!r) {
                                t = t || [];
                                t = [e, t.slice ? t.slice() : t];
                                a.push(t);
                                if (!n) {
                                    l()
                                }
                            }
                            return this
                        },
                        fire: function () {
                            u.fireWith(this, arguments);
                            return this
                        },
                        fired: function () {
                            return !!t
                        }
                    };
                return u
            };

            function H(e) {
                return e
            }

            function U(e) {
                throw e
            }

            function q(e, t, n, i) {
                var r;
                try {
                    if (e && _(r = e.promise)) {
                        r.call(e).done(t).fail(n)
                    } else if (e && _(r = e.then)) {
                        r.call(e, t, n)
                    } else {
                        t.apply(undefined, [e].slice(i))
                    }
                } catch (e) {
                    n.apply(undefined, [e])
                }
            }
            S.extend({
                Deferred: function (e) {
                    var o = [
                            ["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2],
                            ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"],
                            ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]
                        ],
                        r = "pending",
                        a = {
                            state: function () {
                                return r
                            },
                            always: function () {
                                s.done(arguments).fail(arguments);
                                return this
                            },
                            catch: function (e) {
                                return a.then(null, e)
                            },
                            pipe: function () {
                                var r = arguments;
                                return S.Deferred(function (i) {
                                    S.each(o, function (e, t) {
                                        var n = _(r[t[4]]) && r[t[4]];
                                        s[t[1]](function () {
                                            var e = n && n.apply(this, arguments);
                                            if (e && _(e.promise)) {
                                                e.promise().progress(i.notify).done(i.resolve).fail(i.reject)
                                            } else {
                                                i[t[0] + "With"](this, n ? [e] : arguments)
                                            }
                                        })
                                    });
                                    r = null
                                }).promise()
                            },
                            then: function (t, n, i) {
                                var l = 0;

                                function u(r, o, a, s) {
                                    return function () {
                                        var n = this,
                                            i = arguments,
                                            e = function () {
                                                var e, t;
                                                if (r < l) {
                                                    return
                                                }
                                                e = a.apply(n, i);
                                                if (e === o.promise()) {
                                                    throw new TypeError("Thenable self-resolution")
                                                }
                                                t = e && (typeof e === "object" || typeof e === "function") && e.then;
                                                if (_(t)) {
                                                    if (s) {
                                                        t.call(e, u(l, o, H, s), u(l, o, U, s))
                                                    } else {
                                                        l++;
                                                        t.call(e, u(l, o, H, s), u(l, o, U, s), u(l, o, H, o.notifyWith))
                                                    }
                                                } else {
                                                    if (a !== H) {
                                                        n = undefined;
                                                        i = [e]
                                                    }(s || o.resolveWith)(n, i)
                                                }
                                            },
                                            t = s ? e : function () {
                                                try {
                                                    e()
                                                } catch (e) {
                                                    if (S.Deferred.exceptionHook) {
                                                        S.Deferred.exceptionHook(e, t.stackTrace)
                                                    }
                                                    if (r + 1 >= l) {
                                                        if (a !== U) {
                                                            n = undefined;
                                                            i = [e]
                                                        }
                                                        o.rejectWith(n, i)
                                                    }
                                                }
                                            };
                                        if (r) {
                                            t()
                                        } else {
                                            if (S.Deferred.getStackHook) {
                                                t.stackTrace = S.Deferred.getStackHook()
                                            }
                                            E.setTimeout(t)
                                        }
                                    }
                                }
                                return S.Deferred(function (e) {
                                    o[0][3].add(u(0, e, _(i) ? i : H, e.notifyWith));
                                    o[1][3].add(u(0, e, _(t) ? t : H));
                                    o[2][3].add(u(0, e, _(n) ? n : U))
                                }).promise()
                            },
                            promise: function (e) {
                                return e != null ? S.extend(e, a) : a
                            }
                        },
                        s = {};
                    S.each(o, function (e, t) {
                        var n = t[2],
                            i = t[5];
                        a[t[1]] = n.add;
                        if (i) {
                            n.add(function () {
                                r = i
                            }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock)
                        }
                        n.add(t[3].fire);
                        s[t[0]] = function () {
                            s[t[0] + "With"](this === s ? undefined : this, arguments);
                            return this
                        };
                        s[t[0] + "With"] = n.fireWith
                    });
                    a.promise(s);
                    if (e) {
                        e.call(s, s)
                    }
                    return s
                },
                when: function (e) {
                    var n = arguments.length,
                        t = n,
                        i = Array(t),
                        r = s.call(arguments),
                        o = S.Deferred(),
                        a = function (t) {
                            return function (e) {
                                i[t] = this;
                                r[t] = arguments.length > 1 ? s.call(arguments) : e;
                                if (!--n) {
                                    o.resolveWith(i, r)
                                }
                            }
                        };
                    if (n <= 1) {
                        q(e, o.done(a(t)).resolve, o.reject, !n);
                        if (o.state() === "pending" || _(r[t] && r[t].then)) {
                            return o.then()
                        }
                    }
                    while (t--) {
                        q(r[t], a(t), o.reject)
                    }
                    return o.promise()
                }
            });
            var $ = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
            S.Deferred.exceptionHook = function (e, t) {
                if (E.console && E.console.warn && e && $.test(e.name)) {
                    E.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
                }
            };
            S.readyException = function (e) {
                E.setTimeout(function () {
                    throw e
                })
            };
            var B = S.Deferred();
            S.fn.ready = function (e) {
                B.then(e).catch(function (e) {
                    S.readyException(e)
                });
                return this
            };
            S.extend({
                isReady: false,
                readyWait: 1,
                ready: function (e) {
                    if (e === true ? --S.readyWait : S.isReady) {
                        return
                    }
                    S.isReady = true;
                    if (e !== true && --S.readyWait > 0) {
                        return
                    }
                    B.resolveWith(k, [S])
                }
            });
            S.ready.then = B.then;

            function G() {
                k.removeEventListener("DOMContentLoaded", G);
                E.removeEventListener("load", G);
                S.ready()
            }
            if (k.readyState === "complete" || k.readyState !== "loading" && !k.documentElement.doScroll) {
                E.setTimeout(S.ready)
            } else {
                k.addEventListener("DOMContentLoaded", G);
                E.addEventListener("load", G)
            }
            var W = function (e, t, n, i, r, o, a) {
                var s = 0,
                    l = e.length,
                    u = n == null;
                if (x(n) === "object") {
                    r = true;
                    for (s in n) {
                        W(e, t, s, n[s], true, o, a)
                    }
                } else if (i !== undefined) {
                    r = true;
                    if (!_(i)) {
                        a = true
                    }
                    if (u) {
                        if (a) {
                            t.call(e, i);
                            t = null
                        } else {
                            u = t;
                            t = function (e, t, n) {
                                return u.call(S(e), n)
                            }
                        }
                    }
                    if (t) {
                        for (; s < l; s++) {
                            t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)))
                        }
                    }
                }
                if (r) {
                    return e
                }
                if (u) {
                    return t.call(e)
                }
                return l ? t(e[0], n) : o
            };
            var Y = /^-ms-/,
                V = /-([a-z])/g;

            function K(e, t) {
                return t.toUpperCase()
            }

            function z(e) {
                return e.replace(Y, "ms-").replace(V, K)
            }
            var X = function (e) {
                return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType
            };

            function J() {
                this.expando = S.expando + J.uid++
            }
            J.uid = 1;
            J.prototype = {
                cache: function (e) {
                    var t = e[this.expando];
                    if (!t) {
                        t = {};
                        if (X(e)) {
                            if (e.nodeType) {
                                e[this.expando] = t
                            } else {
                                Object.defineProperty(e, this.expando, {
                                    value: t,
                                    configurable: true
                                })
                            }
                        }
                    }
                    return t
                },
                set: function (e, t, n) {
                    var i, r = this.cache(e);
                    if (typeof t === "string") {
                        r[z(t)] = n
                    } else {
                        for (i in t) {
                            r[z(i)] = t[i]
                        }
                    }
                    return r
                },
                get: function (e, t) {
                    return t === undefined ? this.cache(e) : e[this.expando] && e[this.expando][z(t)]
                },
                access: function (e, t, n) {
                    if (t === undefined || t && typeof t === "string" && n === undefined) {
                        return this.get(e, t)
                    }
                    this.set(e, t, n);
                    return n !== undefined ? n : t
                },
                remove: function (e, t) {
                    var n, i = e[this.expando];
                    if (i === undefined) {
                        return
                    }
                    if (t !== undefined) {
                        if (Array.isArray(t)) {
                            t = t.map(z)
                        } else {
                            t = z(t);
                            t = t in i ? [t] : t.match(j) || []
                        }
                        n = t.length;
                        while (n--) {
                            delete i[t[n]]
                        }
                    }
                    if (t === undefined || S.isEmptyObject(i)) {
                        if (e.nodeType) {
                            e[this.expando] = undefined
                        } else {
                            delete e[this.expando]
                        }
                    }
                },
                hasData: function (e) {
                    var t = e[this.expando];
                    return t !== undefined && !S.isEmptyObject(t)
                }
            };
            var Q = new J;
            var Z = new J;
            var ee = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                te = /[A-Z]/g;

            function ne(e) {
                if (e === "true") {
                    return true
                }
                if (e === "false") {
                    return false
                }
                if (e === "null") {
                    return null
                }
                if (e === +e + "") {
                    return +e
                }
                if (ee.test(e)) {
                    return JSON.parse(e)
                }
                return e
            }

            function ie(e, t, n) {
                var i;
                if (n === undefined && e.nodeType === 1) {
                    i = "data-" + t.replace(te, "-$&").toLowerCase();
                    n = e.getAttribute(i);
                    if (typeof n === "string") {
                        try {
                            n = ne(n)
                        } catch (e) {}
                        Z.set(e, t, n)
                    } else {
                        n = undefined
                    }
                }
                return n
            }
            S.extend({
                hasData: function (e) {
                    return Z.hasData(e) || Q.hasData(e)
                },
                data: function (e, t, n) {
                    return Z.access(e, t, n)
                },
                removeData: function (e, t) {
                    Z.remove(e, t)
                },
                _data: function (e, t, n) {
                    return Q.access(e, t, n)
                },
                _removeData: function (e, t) {
                    Q.remove(e, t)
                }
            });
            S.fn.extend({
                data: function (n, e) {
                    var t, i, r, o = this[0],
                        a = o && o.attributes;
                    if (n === undefined) {
                        if (this.length) {
                            r = Z.get(o);
                            if (o.nodeType === 1 && !Q.get(o, "hasDataAttrs")) {
                                t = a.length;
                                while (t--) {
                                    if (a[t]) {
                                        i = a[t].name;
                                        if (i.indexOf("data-") === 0) {
                                            i = z(i.slice(5));
                                            ie(o, i, r[i])
                                        }
                                    }
                                }
                                Q.set(o, "hasDataAttrs", true)
                            }
                        }
                        return r
                    }
                    if (typeof n === "object") {
                        return this.each(function () {
                            Z.set(this, n)
                        })
                    }
                    return W(this, function (e) {
                        var t;
                        if (o && e === undefined) {
                            t = Z.get(o, n);
                            if (t !== undefined) {
                                return t
                            }
                            t = ie(o, n);
                            if (t !== undefined) {
                                return t
                            }
                            return
                        }
                        this.each(function () {
                            Z.set(this, n, e)
                        })
                    }, null, e, arguments.length > 1, null, true)
                },
                removeData: function (e) {
                    return this.each(function () {
                        Z.remove(this, e)
                    })
                }
            });
            S.extend({
                queue: function (e, t, n) {
                    var i;
                    if (e) {
                        t = (t || "fx") + "queue";
                        i = Q.get(e, t);
                        if (n) {
                            if (!i || Array.isArray(n)) {
                                i = Q.access(e, t, S.makeArray(n))
                            } else {
                                i.push(n)
                            }
                        }
                        return i || []
                    }
                },
                dequeue: function (e, t) {
                    t = t || "fx";
                    var n = S.queue(e, t),
                        i = n.length,
                        r = n.shift(),
                        o = S._queueHooks(e, t),
                        a = function () {
                            S.dequeue(e, t)
                        };
                    if (r === "inprogress") {
                        r = n.shift();
                        i--
                    }
                    if (r) {
                        if (t === "fx") {
                            n.unshift("inprogress")
                        }
                        delete o.stop;
                        r.call(e, a, o)
                    }
                    if (!i && o) {
                        o.empty.fire()
                    }
                },
                _queueHooks: function (e, t) {
                    var n = t + "queueHooks";
                    return Q.get(e, n) || Q.access(e, n, {
                        empty: S.Callbacks("once memory").add(function () {
                            Q.remove(e, [t + "queue", n])
                        })
                    })
                }
            });
            S.fn.extend({
                queue: function (t, n) {
                    var e = 2;
                    if (typeof t !== "string") {
                        n = t;
                        t = "fx";
                        e--
                    }
                    if (arguments.length < e) {
                        return S.queue(this[0], t)
                    }
                    return n === undefined ? this : this.each(function () {
                        var e = S.queue(this, t, n);
                        S._queueHooks(this, t);
                        if (t === "fx" && e[0] !== "inprogress") {
                            S.dequeue(this, t)
                        }
                    })
                },
                dequeue: function (e) {
                    return this.each(function () {
                        S.dequeue(this, e)
                    })
                },
                clearQueue: function (e) {
                    return this.queue(e || "fx", [])
                },
                promise: function (e, t) {
                    var n, i = 1,
                        r = S.Deferred(),
                        o = this,
                        a = this.length,
                        s = function () {
                            if (!--i) {
                                r.resolveWith(o, [o])
                            }
                        };
                    if (typeof e !== "string") {
                        t = e;
                        e = undefined
                    }
                    e = e || "fx";
                    while (a--) {
                        n = Q.get(o[a], e + "queueHooks");
                        if (n && n.empty) {
                            i++;
                            n.empty.add(s)
                        }
                    }
                    s();
                    return r.promise(t)
                }
            });
            var re = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
            var oe = new RegExp("^(?:([+-])=|)(" + re + ")([a-z%]*)$", "i");
            var ae = ["Top", "Right", "Bottom", "Left"];
            var se = k.documentElement;
            var le = function (e) {
                    return S.contains(e.ownerDocument, e)
                },
                ue = {
                    composed: true
                };
            if (se.getRootNode) {
                le = function (e) {
                    return S.contains(e.ownerDocument, e) || e.getRootNode(ue) === e.ownerDocument
                }
            }
            var ce = function (e, t) {
                e = t || e;
                return e.style.display === "none" || e.style.display === "" && le(e) && S.css(e, "display") === "none"
            };
            var fe = function (e, t, n, i) {
                var r, o, a = {};
                for (o in t) {
                    a[o] = e.style[o];
                    e.style[o] = t[o]
                }
                r = n.apply(e, i || []);
                for (o in t) {
                    e.style[o] = a[o]
                }
                return r
            };

            function pe(e, t, n, i) {
                var r, o, a = 20,
                    s = i ? function () {
                        return i.cur()
                    } : function () {
                        return S.css(e, t, "")
                    },
                    l = s(),
                    u = n && n[3] || (S.cssNumber[t] ? "" : "px"),
                    c = e.nodeType && (S.cssNumber[t] || u !== "px" && +l) && oe.exec(S.css(e, t));
                if (c && c[3] !== u) {
                    l = l / 2;
                    u = u || c[3];
                    c = +l || 1;
                    while (a--) {
                        S.style(e, t, c + u);
                        if ((1 - o) * (1 - (o = s() / l || .5)) <= 0) {
                            a = 0
                        }
                        c = c / o
                    }
                    c = c * 2;
                    S.style(e, t, c + u);
                    n = n || []
                }
                if (n) {
                    c = +c || +l || 0;
                    r = n[1] ? c + (n[1] + 1) * n[2] : +n[2];
                    if (i) {
                        i.unit = u;
                        i.start = c;
                        i.end = r
                    }
                }
                return r
            }
            var de = {};

            function he(e) {
                var t, n = e.ownerDocument,
                    i = e.nodeName,
                    r = de[i];
                if (r) {
                    return r
                }
                t = n.body.appendChild(n.createElement(i));
                r = S.css(t, "display");
                t.parentNode.removeChild(t);
                if (r === "none") {
                    r = "block"
                }
                de[i] = r;
                return r
            }

            function ge(e, t) {
                var n, i, r = [],
                    o = 0,
                    a = e.length;
                for (; o < a; o++) {
                    i = e[o];
                    if (!i.style) {
                        continue
                    }
                    n = i.style.display;
                    if (t) {
                        if (n === "none") {
                            r[o] = Q.get(i, "display") || null;
                            if (!r[o]) {
                                i.style.display = ""
                            }
                        }
                        if (i.style.display === "" && ce(i)) {
                            r[o] = he(i)
                        }
                    } else {
                        if (n !== "none") {
                            r[o] = "none";
                            Q.set(i, "display", n)
                        }
                    }
                }
                for (o = 0; o < a; o++) {
                    if (r[o] != null) {
                        e[o].style.display = r[o]
                    }
                }
                return e
            }
            S.fn.extend({
                show: function () {
                    return ge(this, true)
                },
                hide: function () {
                    return ge(this)
                },
                toggle: function (e) {
                    if (typeof e === "boolean") {
                        return e ? this.show() : this.hide()
                    }
                    return this.each(function () {
                        if (ce(this)) {
                            S(this).show()
                        } else {
                            S(this).hide()
                        }
                    })
                }
            });
            var me = /^(?:checkbox|radio)$/i;
            var ve = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
            var _e = /^$|^module$|\/(?:java|ecma)script/i;
            var ye = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
            ye.optgroup = ye.option;
            ye.tbody = ye.tfoot = ye.colgroup = ye.caption = ye.thead;
            ye.th = ye.td;

            function be(e, t) {
                var n;
                if (typeof e.getElementsByTagName !== "undefined") {
                    n = e.getElementsByTagName(t || "*")
                } else if (typeof e.querySelectorAll !== "undefined") {
                    n = e.querySelectorAll(t || "*")
                } else {
                    n = []
                }
                if (t === undefined || t && A(e, t)) {
                    return S.merge([e], n)
                }
                return n
            }

            function xe(e, t) {
                var n = 0,
                    i = e.length;
                for (; n < i; n++) {
                    Q.set(e[n], "globalEval", !t || Q.get(t[n], "globalEval"))
                }
            }
            var we = /<|&#?\w+;/;

            function Ee(e, t, n, i, r) {
                var o, a, s, l, u, c, f = t.createDocumentFragment(),
                    p = [],
                    d = 0,
                    h = e.length;
                for (; d < h; d++) {
                    o = e[d];
                    if (o || o === 0) {
                        if (x(o) === "object") {
                            S.merge(p, o.nodeType ? [o] : o)
                        } else if (!we.test(o)) {
                            p.push(t.createTextNode(o))
                        } else {
                            a = a || f.appendChild(t.createElement("div"));
                            s = (ve.exec(o) || ["", ""])[1].toLowerCase();
                            l = ye[s] || ye._default;
                            a.innerHTML = l[1] + S.htmlPrefilter(o) + l[2];
                            c = l[0];
                            while (c--) {
                                a = a.lastChild
                            }
                            S.merge(p, a.childNodes);
                            a = f.firstChild;
                            a.textContent = ""
                        }
                    }
                }
                f.textContent = "";
                d = 0;
                while (o = p[d++]) {
                    if (i && S.inArray(o, i) > -1) {
                        if (r) {
                            r.push(o)
                        }
                        continue
                    }
                    u = le(o);
                    a = be(f.appendChild(o), "script");
                    if (u) {
                        xe(a)
                    }
                    if (n) {
                        c = 0;
                        while (o = a[c++]) {
                            if (_e.test(o.type || "")) {
                                n.push(o)
                            }
                        }
                    }
                }
                return f
            }(function () {
                var e = k.createDocumentFragment(),
                    t = e.appendChild(k.createElement("div")),
                    n = k.createElement("input");
                n.setAttribute("type", "radio");
                n.setAttribute("checked", "checked");
                n.setAttribute("name", "t");
                t.appendChild(n);
                v.checkClone = t.cloneNode(true).cloneNode(true).lastChild.checked;
                t.innerHTML = "<textarea>x</textarea>";
                v.noCloneChecked = !!t.cloneNode(true).lastChild.defaultValue
            })();
            var ke = /^key/,
                Se = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
                Te = /^([^.]*)(?:\.(.+)|)/;

            function Ne() {
                return true
            }

            function Ae() {
                return false
            }

            function Ce(e, t) {
                return e === Oe() === (t === "focus")
            }

            function Oe() {
                try {
                    return k.activeElement
                } catch (e) {}
            }

            function Ie(e, t, n, i, r, o) {
                var a, s;
                if (typeof t === "object") {
                    if (typeof n !== "string") {
                        i = i || n;
                        n = undefined
                    }
                    for (s in t) {
                        Ie(e, s, n, i, t[s], o)
                    }
                    return e
                }
                if (i == null && r == null) {
                    r = n;
                    i = n = undefined
                } else if (r == null) {
                    if (typeof n === "string") {
                        r = i;
                        i = undefined
                    } else {
                        r = i;
                        i = n;
                        n = undefined
                    }
                }
                if (r === false) {
                    r = Ae
                } else if (!r) {
                    return e
                }
                if (o === 1) {
                    a = r;
                    r = function (e) {
                        S().off(e);
                        return a.apply(this, arguments)
                    };
                    r.guid = a.guid || (a.guid = S.guid++)
                }
                return e.each(function () {
                    S.event.add(this, t, r, i, n)
                })
            }
            S.event = {
                global: {},
                add: function (t, e, n, i, r) {
                    var o, a, s, l, u, c, f, p, d, h, g, m = Q.get(t);
                    if (!m) {
                        return
                    }
                    if (n.handler) {
                        o = n;
                        n = o.handler;
                        r = o.selector
                    }
                    if (r) {
                        S.find.matchesSelector(se, r)
                    }
                    if (!n.guid) {
                        n.guid = S.guid++
                    }
                    if (!(l = m.events)) {
                        l = m.events = {}
                    }
                    if (!(a = m.handle)) {
                        a = m.handle = function (e) {
                            return typeof S !== "undefined" && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : undefined
                        }
                    }
                    e = (e || "").match(j) || [""];
                    u = e.length;
                    while (u--) {
                        s = Te.exec(e[u]) || [];
                        d = g = s[1];
                        h = (s[2] || "").split(".").sort();
                        if (!d) {
                            continue
                        }
                        f = S.event.special[d] || {};
                        d = (r ? f.delegateType : f.bindType) || d;
                        f = S.event.special[d] || {};
                        c = S.extend({
                            type: d,
                            origType: g,
                            data: i,
                            handler: n,
                            guid: n.guid,
                            selector: r,
                            needsContext: r && S.expr.match.needsContext.test(r),
                            namespace: h.join(".")
                        }, o);
                        if (!(p = l[d])) {
                            p = l[d] = [];
                            p.delegateCount = 0;
                            if (!f.setup || f.setup.call(t, i, h, a) === false) {
                                if (t.addEventListener) {
                                    t.addEventListener(d, a)
                                }
                            }
                        }
                        if (f.add) {
                            f.add.call(t, c);
                            if (!c.handler.guid) {
                                c.handler.guid = n.guid
                            }
                        }
                        if (r) {
                            p.splice(p.delegateCount++, 0, c)
                        } else {
                            p.push(c)
                        }
                        S.event.global[d] = true
                    }
                },
                remove: function (e, t, n, i, r) {
                    var o, a, s, l, u, c, f, p, d, h, g, m = Q.hasData(e) && Q.get(e);
                    if (!m || !(l = m.events)) {
                        return
                    }
                    t = (t || "").match(j) || [""];
                    u = t.length;
                    while (u--) {
                        s = Te.exec(t[u]) || [];
                        d = g = s[1];
                        h = (s[2] || "").split(".").sort();
                        if (!d) {
                            for (d in l) {
                                S.event.remove(e, d + t[u], n, i, true)
                            }
                            continue
                        }
                        f = S.event.special[d] || {};
                        d = (i ? f.delegateType : f.bindType) || d;
                        p = l[d] || [];
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)");
                        a = o = p.length;
                        while (o--) {
                            c = p[o];
                            if ((r || g === c.origType) && (!n || n.guid === c.guid) && (!s || s.test(c.namespace)) && (!i || i === c.selector || i === "**" && c.selector)) {
                                p.splice(o, 1);
                                if (c.selector) {
                                    p.delegateCount--
                                }
                                if (f.remove) {
                                    f.remove.call(e, c)
                                }
                            }
                        }
                        if (a && !p.length) {
                            if (!f.teardown || f.teardown.call(e, h, m.handle) === false) {
                                S.removeEvent(e, d, m.handle)
                            }
                            delete l[d]
                        }
                    }
                    if (S.isEmptyObject(l)) {
                        Q.remove(e, "handle events")
                    }
                },
                dispatch: function (e) {
                    var t = S.event.fix(e);
                    var n, i, r, o, a, s, l = new Array(arguments.length),
                        u = (Q.get(this, "events") || {})[t.type] || [],
                        c = S.event.special[t.type] || {};
                    l[0] = t;
                    for (n = 1; n < arguments.length; n++) {
                        l[n] = arguments[n]
                    }
                    t.delegateTarget = this;
                    if (c.preDispatch && c.preDispatch.call(this, t) === false) {
                        return
                    }
                    s = S.event.handlers.call(this, t, u);
                    n = 0;
                    while ((o = s[n++]) && !t.isPropagationStopped()) {
                        t.currentTarget = o.elem;
                        i = 0;
                        while ((a = o.handlers[i++]) && !t.isImmediatePropagationStopped()) {
                            if (!t.rnamespace || a.namespace === false || t.rnamespace.test(a.namespace)) {
                                t.handleObj = a;
                                t.data = a.data;
                                r = ((S.event.special[a.origType] || {}).handle || a.handler).apply(o.elem, l);
                                if (r !== undefined) {
                                    if ((t.result = r) === false) {
                                        t.preventDefault();
                                        t.stopPropagation()
                                    }
                                }
                            }
                        }
                    }
                    if (c.postDispatch) {
                        c.postDispatch.call(this, t)
                    }
                    return t.result
                },
                handlers: function (e, t) {
                    var n, i, r, o, a, s = [],
                        l = t.delegateCount,
                        u = e.target;
                    if (l && u.nodeType && !(e.type === "click" && e.button >= 1)) {
                        for (; u !== this; u = u.parentNode || this) {
                            if (u.nodeType === 1 && !(e.type === "click" && u.disabled === true)) {
                                o = [];
                                a = {};
                                for (n = 0; n < l; n++) {
                                    i = t[n];
                                    r = i.selector + " ";
                                    if (a[r] === undefined) {
                                        a[r] = i.needsContext ? S(r, this).index(u) > -1 : S.find(r, this, null, [u]).length
                                    }
                                    if (a[r]) {
                                        o.push(i)
                                    }
                                }
                                if (o.length) {
                                    s.push({
                                        elem: u,
                                        handlers: o
                                    })
                                }
                            }
                        }
                    }
                    u = this;
                    if (l < t.length) {
                        s.push({
                            elem: u,
                            handlers: t.slice(l)
                        })
                    }
                    return s
                },
                addProp: function (t, e) {
                    Object.defineProperty(S.Event.prototype, t, {
                        enumerable: true,
                        configurable: true,
                        get: _(e) ? function () {
                            if (this.originalEvent) {
                                return e(this.originalEvent)
                            }
                        } : function () {
                            if (this.originalEvent) {
                                return this.originalEvent[t]
                            }
                        },
                        set: function (e) {
                            Object.defineProperty(this, t, {
                                enumerable: true,
                                configurable: true,
                                writable: true,
                                value: e
                            })
                        }
                    })
                },
                fix: function (e) {
                    return e[S.expando] ? e : new S.Event(e)
                },
                special: {
                    load: {
                        noBubble: true
                    },
                    click: {
                        setup: function (e) {
                            var t = this || e;
                            if (me.test(t.type) && t.click && A(t, "input")) {
                                Re(t, "click", Ne)
                            }
                            return false
                        },
                        trigger: function (e) {
                            var t = this || e;
                            if (me.test(t.type) && t.click && A(t, "input")) {
                                Re(t, "click")
                            }
                            return true
                        },
                        _default: function (e) {
                            var t = e.target;
                            return me.test(t.type) && t.click && A(t, "input") && Q.get(t, "click") || A(t, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function (e) {
                            if (e.result !== undefined && e.originalEvent) {
                                e.originalEvent.returnValue = e.result
                            }
                        }
                    }
                }
            };

            function Re(e, r, o) {
                if (!o) {
                    if (Q.get(e, r) === undefined) {
                        S.event.add(e, r, Ne)
                    }
                    return
                }
                Q.set(e, r, false);
                S.event.add(e, r, {
                    namespace: false,
                    handler: function (e) {
                        var t, n, i = Q.get(this, r);
                        if (e.isTrigger & 1 && this[r]) {
                            if (!i.length) {
                                i = s.call(arguments);
                                Q.set(this, r, i);
                                t = o(this, r);
                                this[r]();
                                n = Q.get(this, r);
                                if (i !== n || t) {
                                    Q.set(this, r, false)
                                } else {
                                    n = {}
                                }
                                if (i !== n) {
                                    e.stopImmediatePropagation();
                                    e.preventDefault();
                                    return n.value
                                }
                            } else if ((S.event.special[r] || {}).delegateType) {
                                e.stopPropagation()
                            }
                        } else if (i.length) {
                            Q.set(this, r, {
                                value: S.event.trigger(S.extend(i[0], S.Event.prototype), i.slice(1), this)
                            });
                            e.stopImmediatePropagation()
                        }
                    }
                })
            }
            S.removeEvent = function (e, t, n) {
                if (e.removeEventListener) {
                    e.removeEventListener(t, n)
                }
            };
            S.Event = function (e, t) {
                if (!(this instanceof S.Event)) {
                    return new S.Event(e, t)
                }
                if (e && e.type) {
                    this.originalEvent = e;
                    this.type = e.type;
                    this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && e.returnValue === false ? Ne : Ae;
                    this.target = e.target && e.target.nodeType === 3 ? e.target.parentNode : e.target;
                    this.currentTarget = e.currentTarget;
                    this.relatedTarget = e.relatedTarget
                } else {
                    this.type = e
                }
                if (t) {
                    S.extend(this, t)
                }
                this.timeStamp = e && e.timeStamp || Date.now();
                this[S.expando] = true
            };
            S.Event.prototype = {
                constructor: S.Event,
                isDefaultPrevented: Ae,
                isPropagationStopped: Ae,
                isImmediatePropagationStopped: Ae,
                isSimulated: false,
                preventDefault: function () {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = Ne;
                    if (e && !this.isSimulated) {
                        e.preventDefault()
                    }
                },
                stopPropagation: function () {
                    var e = this.originalEvent;
                    this.isPropagationStopped = Ne;
                    if (e && !this.isSimulated) {
                        e.stopPropagation()
                    }
                },
                stopImmediatePropagation: function () {
                    var e = this.originalEvent;
                    this.isImmediatePropagationStopped = Ne;
                    if (e && !this.isSimulated) {
                        e.stopImmediatePropagation()
                    }
                    this.stopPropagation()
                }
            };
            S.each({
                altKey: true,
                bubbles: true,
                cancelable: true,
                changedTouches: true,
                ctrlKey: true,
                detail: true,
                eventPhase: true,
                metaKey: true,
                pageX: true,
                pageY: true,
                shiftKey: true,
                view: true,
                char: true,
                code: true,
                charCode: true,
                key: true,
                keyCode: true,
                button: true,
                buttons: true,
                clientX: true,
                clientY: true,
                offsetX: true,
                offsetY: true,
                pointerId: true,
                pointerType: true,
                screenX: true,
                screenY: true,
                targetTouches: true,
                toElement: true,
                touches: true,
                which: function (e) {
                    var t = e.button;
                    if (e.which == null && ke.test(e.type)) {
                        return e.charCode != null ? e.charCode : e.keyCode
                    }
                    if (!e.which && t !== undefined && Se.test(e.type)) {
                        if (t & 1) {
                            return 1
                        }
                        if (t & 2) {
                            return 3
                        }
                        if (t & 4) {
                            return 2
                        }
                        return 0
                    }
                    return e.which
                }
            }, S.event.addProp);
            S.each({
                focus: "focusin",
                blur: "focusout"
            }, function (e, t) {
                S.event.special[e] = {
                    setup: function () {
                        Re(this, e, Ce);
                        return false
                    },
                    trigger: function () {
                        Re(this, e);
                        return true
                    },
                    delegateType: t
                }
            });
            S.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout"
            }, function (e, o) {
                S.event.special[e] = {
                    delegateType: o,
                    bindType: o,
                    handle: function (e) {
                        var t, n = this,
                            i = e.relatedTarget,
                            r = e.handleObj;
                        if (!i || i !== n && !S.contains(n, i)) {
                            e.type = r.origType;
                            t = r.handler.apply(this, arguments);
                            e.type = o
                        }
                        return t
                    }
                }
            });
            S.fn.extend({
                on: function (e, t, n, i) {
                    return Ie(this, e, t, n, i)
                },
                one: function (e, t, n, i) {
                    return Ie(this, e, t, n, i, 1)
                },
                off: function (e, t, n) {
                    var i, r;
                    if (e && e.preventDefault && e.handleObj) {
                        i = e.handleObj;
                        S(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler);
                        return this
                    }
                    if (typeof e === "object") {
                        for (r in e) {
                            this.off(r, t, e[r])
                        }
                        return this
                    }
                    if (t === false || typeof t === "function") {
                        n = t;
                        t = undefined
                    }
                    if (n === false) {
                        n = Ae
                    }
                    return this.each(function () {
                        S.event.remove(this, e, n, t)
                    })
                }
            });
            var Pe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
                Le = /<script|<style|<link/i,
                De = /checked\s*(?:[^=]|=\s*.checked.)/i,
                Me = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

            function je(e, t) {
                if (A(e, "table") && A(t.nodeType !== 11 ? t : t.firstChild, "tr")) {
                    return S(e).children("tbody")[0] || e
                }
                return e
            }

            function Fe(e) {
                e.type = (e.getAttribute("type") !== null) + "/" + e.type;
                return e
            }

            function He(e) {
                if ((e.type || "").slice(0, 5) === "true/") {
                    e.type = e.type.slice(5)
                } else {
                    e.removeAttribute("type")
                }
                return e
            }

            function Ue(e, t) {
                var n, i, r, o, a, s, l, u;
                if (t.nodeType !== 1) {
                    return
                }
                if (Q.hasData(e)) {
                    o = Q.access(e);
                    a = Q.set(t, o);
                    u = o.events;
                    if (u) {
                        delete a.handle;
                        a.events = {};
                        for (r in u) {
                            for (n = 0, i = u[r].length; n < i; n++) {
                                S.event.add(t, r, u[r][n])
                            }
                        }
                    }
                }
                if (Z.hasData(e)) {
                    s = Z.access(e);
                    l = S.extend({}, s);
                    Z.set(t, l)
                }
            }

            function qe(e, t) {
                var n = t.nodeName.toLowerCase();
                if (n === "input" && me.test(e.type)) {
                    t.checked = e.checked
                } else if (n === "input" || n === "textarea") {
                    t.defaultValue = e.defaultValue
                }
            }

            function $e(n, i, r, o) {
                i = g.apply([], i);
                var e, t, a, s, l, u, c = 0,
                    f = n.length,
                    p = f - 1,
                    d = i[0],
                    h = _(d);
                if (h || f > 1 && typeof d === "string" && !v.checkClone && De.test(d)) {
                    return n.each(function (e) {
                        var t = n.eq(e);
                        if (h) {
                            i[0] = d.call(this, e, t.html())
                        }
                        $e(t, i, r, o)
                    })
                }
                if (f) {
                    e = Ee(i, n[0].ownerDocument, false, n, o);
                    t = e.firstChild;
                    if (e.childNodes.length === 1) {
                        e = t
                    }
                    if (t || o) {
                        a = S.map(be(e, "script"), Fe);
                        s = a.length;
                        for (; c < f; c++) {
                            l = e;
                            if (c !== p) {
                                l = S.clone(l, true, true);
                                if (s) {
                                    S.merge(a, be(l, "script"))
                                }
                            }
                            r.call(n[c], l, c)
                        }
                        if (s) {
                            u = a[a.length - 1].ownerDocument;
                            S.map(a, He);
                            for (c = 0; c < s; c++) {
                                l = a[c];
                                if (_e.test(l.type || "") && !Q.access(l, "globalEval") && S.contains(u, l)) {
                                    if (l.src && (l.type || "").toLowerCase() !== "module") {
                                        if (S._evalUrl && !l.noModule) {
                                            S._evalUrl(l.src, {
                                                nonce: l.nonce || l.getAttribute("nonce")
                                            })
                                        }
                                    } else {
                                        b(l.textContent.replace(Me, ""), l, u)
                                    }
                                }
                            }
                        }
                    }
                }
                return n
            }

            function Be(e, t, n) {
                var i, r = t ? S.filter(t, e) : e,
                    o = 0;
                for (;
                    (i = r[o]) != null; o++) {
                    if (!n && i.nodeType === 1) {
                        S.cleanData(be(i))
                    }
                    if (i.parentNode) {
                        if (n && le(i)) {
                            xe(be(i, "script"))
                        }
                        i.parentNode.removeChild(i)
                    }
                }
                return e
            }
            S.extend({
                htmlPrefilter: function (e) {
                    return e.replace(Pe, "<$1></$2>")
                },
                clone: function (e, t, n) {
                    var i, r, o, a, s = e.cloneNode(true),
                        l = le(e);
                    if (!v.noCloneChecked && (e.nodeType === 1 || e.nodeType === 11) && !S.isXMLDoc(e)) {
                        a = be(s);
                        o = be(e);
                        for (i = 0, r = o.length; i < r; i++) {
                            qe(o[i], a[i])
                        }
                    }
                    if (t) {
                        if (n) {
                            o = o || be(e);
                            a = a || be(s);
                            for (i = 0, r = o.length; i < r; i++) {
                                Ue(o[i], a[i])
                            }
                        } else {
                            Ue(e, s)
                        }
                    }
                    a = be(s, "script");
                    if (a.length > 0) {
                        xe(a, !l && be(e, "script"))
                    }
                    return s
                },
                cleanData: function (e) {
                    var t, n, i, r = S.event.special,
                        o = 0;
                    for (;
                        (n = e[o]) !== undefined; o++) {
                        if (X(n)) {
                            if (t = n[Q.expando]) {
                                if (t.events) {
                                    for (i in t.events) {
                                        if (r[i]) {
                                            S.event.remove(n, i)
                                        } else {
                                            S.removeEvent(n, i, t.handle)
                                        }
                                    }
                                }
                                n[Q.expando] = undefined
                            }
                            if (n[Z.expando]) {
                                n[Z.expando] = undefined
                            }
                        }
                    }
                }
            });
            S.fn.extend({
                detach: function (e) {
                    return Be(this, e, true)
                },
                remove: function (e) {
                    return Be(this, e)
                },
                text: function (e) {
                    return W(this, function (e) {
                        return e === undefined ? S.text(this) : this.empty().each(function () {
                            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                                this.textContent = e
                            }
                        })
                    }, null, e, arguments.length)
                },
                append: function () {
                    return $e(this, arguments, function (e) {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                            var t = je(this, e);
                            t.appendChild(e)
                        }
                    })
                },
                prepend: function () {
                    return $e(this, arguments, function (e) {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                            var t = je(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function () {
                    return $e(this, arguments, function (e) {
                        if (this.parentNode) {
                            this.parentNode.insertBefore(e, this)
                        }
                    })
                },
                after: function () {
                    return $e(this, arguments, function (e) {
                        if (this.parentNode) {
                            this.parentNode.insertBefore(e, this.nextSibling)
                        }
                    })
                },
                empty: function () {
                    var e, t = 0;
                    for (;
                        (e = this[t]) != null; t++) {
                        if (e.nodeType === 1) {
                            S.cleanData(be(e, false));
                            e.textContent = ""
                        }
                    }
                    return this
                },
                clone: function (e, t) {
                    e = e == null ? false : e;
                    t = t == null ? e : t;
                    return this.map(function () {
                        return S.clone(this, e, t)
                    })
                },
                html: function (e) {
                    return W(this, function (e) {
                        var t = this[0] || {},
                            n = 0,
                            i = this.length;
                        if (e === undefined && t.nodeType === 1) {
                            return t.innerHTML
                        }
                        if (typeof e === "string" && !Le.test(e) && !ye[(ve.exec(e) || ["", ""])[1].toLowerCase()]) {
                            e = S.htmlPrefilter(e);
                            try {
                                for (; n < i; n++) {
                                    t = this[n] || {};
                                    if (t.nodeType === 1) {
                                        S.cleanData(be(t, false));
                                        t.innerHTML = e
                                    }
                                }
                                t = 0
                            } catch (e) {}
                        }
                        if (t) {
                            this.empty().append(e)
                        }
                    }, null, e, arguments.length)
                },
                replaceWith: function () {
                    var n = [];
                    return $e(this, arguments, function (e) {
                        var t = this.parentNode;
                        if (S.inArray(this, n) < 0) {
                            S.cleanData(be(this));
                            if (t) {
                                t.replaceChild(e, this)
                            }
                        }
                    }, n)
                }
            });
            S.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function (e, a) {
                S.fn[e] = function (e) {
                    var t, n = [],
                        i = S(e),
                        r = i.length - 1,
                        o = 0;
                    for (; o <= r; o++) {
                        t = o === r ? this : this.clone(true);
                        S(i[o])[a](t);
                        l.apply(n, t.get())
                    }
                    return this.pushStack(n)
                }
            });
            var Ge = new RegExp("^(" + re + ")(?!px)[a-z%]+$", "i");
            var We = function (e) {
                var t = e.ownerDocument.defaultView;
                if (!t || !t.opener) {
                    t = E
                }
                return t.getComputedStyle(e)
            };
            var Ye = new RegExp(ae.join("|"), "i");
            (function () {
                function e() {
                    if (!l) {
                        return
                    }
                    s.style.cssText = "position:absolute;left:-11111px;width:60px;" + "margin-top:1px;padding:0;border:0";
                    l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;" + "margin:auto;border:1px;padding:1px;" + "width:60%;top:1%";
                    se.appendChild(s).appendChild(l);
                    var e = E.getComputedStyle(l);
                    n = e.top !== "1%";
                    a = t(e.marginLeft) === 12;
                    l.style.right = "60%";
                    o = t(e.right) === 36;
                    i = t(e.width) === 36;
                    l.style.position = "absolute";
                    r = t(l.offsetWidth / 3) === 12;
                    se.removeChild(s);
                    l = null
                }

                function t(e) {
                    return Math.round(parseFloat(e))
                }
                var n, i, r, o, a, s = k.createElement("div"),
                    l = k.createElement("div");
                if (!l.style) {
                    return
                }
                l.style.backgroundClip = "content-box";
                l.cloneNode(true).style.backgroundClip = "";
                v.clearCloneStyle = l.style.backgroundClip === "content-box";
                S.extend(v, {
                    boxSizingReliable: function () {
                        e();
                        return i
                    },
                    pixelBoxStyles: function () {
                        e();
                        return o
                    },
                    pixelPosition: function () {
                        e();
                        return n
                    },
                    reliableMarginLeft: function () {
                        e();
                        return a
                    },
                    scrollboxSize: function () {
                        e();
                        return r
                    }
                })
            })();

            function Ve(e, t, n) {
                var i, r, o, a, s = e.style;
                n = n || We(e);
                if (n) {
                    a = n.getPropertyValue(t) || n[t];
                    if (a === "" && !le(e)) {
                        a = S.style(e, t)
                    }
                    if (!v.pixelBoxStyles() && Ge.test(a) && Ye.test(t)) {
                        i = s.width;
                        r = s.minWidth;
                        o = s.maxWidth;
                        s.minWidth = s.maxWidth = s.width = a;
                        a = n.width;
                        s.width = i;
                        s.minWidth = r;
                        s.maxWidth = o
                    }
                }
                return a !== undefined ? a + "" : a
            }

            function Ke(e, t) {
                return {
                    get: function () {
                        if (e()) {
                            delete this.get;
                            return
                        }
                        return (this.get = t).apply(this, arguments)
                    }
                }
            }
            var ze = ["Webkit", "Moz", "ms"],
                Xe = k.createElement("div").style,
                Je = {};

            function Qe(e) {
                var t = e[0].toUpperCase() + e.slice(1),
                    n = ze.length;
                while (n--) {
                    e = ze[n] + t;
                    if (e in Xe) {
                        return e
                    }
                }
            }

            function Ze(e) {
                var t = S.cssProps[e] || Je[e];
                if (t) {
                    return t
                }
                if (e in Xe) {
                    return e
                }
                return Je[e] = Qe(e) || e
            }
            var et = /^(none|table(?!-c[ea]).+)/,
                tt = /^--/,
                nt = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                it = {
                    letterSpacing: "0",
                    fontWeight: "400"
                };

            function rt(e, t, n) {
                var i = oe.exec(t);
                return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
            }

            function ot(e, t, n, i, r, o) {
                var a = t === "width" ? 1 : 0,
                    s = 0,
                    l = 0;
                if (n === (i ? "border" : "content")) {
                    return 0
                }
                for (; a < 4; a += 2) {
                    if (n === "margin") {
                        l += S.css(e, n + ae[a], true, r)
                    }
                    if (!i) {
                        l += S.css(e, "padding" + ae[a], true, r);
                        if (n !== "padding") {
                            l += S.css(e, "border" + ae[a] + "Width", true, r)
                        } else {
                            s += S.css(e, "border" + ae[a] + "Width", true, r)
                        }
                    } else {
                        if (n === "content") {
                            l -= S.css(e, "padding" + ae[a], true, r)
                        }
                        if (n !== "margin") {
                            l -= S.css(e, "border" + ae[a] + "Width", true, r)
                        }
                    }
                }
                if (!i && o >= 0) {
                    l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - l - s - .5)) || 0
                }
                return l
            }

            function at(e, t, n) {
                var i = We(e),
                    r = !v.boxSizingReliable() || n,
                    o = r && S.css(e, "boxSizing", false, i) === "border-box",
                    a = o,
                    s = Ve(e, t, i),
                    l = "offset" + t[0].toUpperCase() + t.slice(1);
                if (Ge.test(s)) {
                    if (!n) {
                        return s
                    }
                    s = "auto"
                }
                if ((!v.boxSizingReliable() && o || s === "auto" || !parseFloat(s) && S.css(e, "display", false, i) === "inline") && e.getClientRects().length) {
                    o = S.css(e, "boxSizing", false, i) === "border-box";
                    a = l in e;
                    if (a) {
                        s = e[l]
                    }
                }
                s = parseFloat(s) || 0;
                return s + ot(e, t, n || (o ? "border" : "content"), a, i, s) + "px"
            }
            S.extend({
                cssHooks: {
                    opacity: {
                        get: function (e, t) {
                            if (t) {
                                var n = Ve(e, "opacity");
                                return n === "" ? "1" : n
                            }
                        }
                    }
                },
                cssNumber: {
                    animationIterationCount: true,
                    columnCount: true,
                    fillOpacity: true,
                    flexGrow: true,
                    flexShrink: true,
                    fontWeight: true,
                    gridArea: true,
                    gridColumn: true,
                    gridColumnEnd: true,
                    gridColumnStart: true,
                    gridRow: true,
                    gridRowEnd: true,
                    gridRowStart: true,
                    lineHeight: true,
                    opacity: true,
                    order: true,
                    orphans: true,
                    widows: true,
                    zIndex: true,
                    zoom: true
                },
                cssProps: {},
                style: function (e, t, n, i) {
                    if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
                        return
                    }
                    var r, o, a, s = z(t),
                        l = tt.test(t),
                        u = e.style;
                    if (!l) {
                        t = Ze(s)
                    }
                    a = S.cssHooks[t] || S.cssHooks[s];
                    if (n !== undefined) {
                        o = typeof n;
                        if (o === "string" && (r = oe.exec(n)) && r[1]) {
                            n = pe(e, t, r);
                            o = "number"
                        }
                        if (n == null || n !== n) {
                            return
                        }
                        if (o === "number" && !l) {
                            n += r && r[3] || (S.cssNumber[s] ? "" : "px")
                        }
                        if (!v.clearCloneStyle && n === "" && t.indexOf("background") === 0) {
                            u[t] = "inherit"
                        }
                        if (!a || !("set" in a) || (n = a.set(e, n, i)) !== undefined) {
                            if (l) {
                                u.setProperty(t, n)
                            } else {
                                u[t] = n
                            }
                        }
                    } else {
                        if (a && "get" in a && (r = a.get(e, false, i)) !== undefined) {
                            return r
                        }
                        return u[t]
                    }
                },
                css: function (e, t, n, i) {
                    var r, o, a, s = z(t),
                        l = tt.test(t);
                    if (!l) {
                        t = Ze(s)
                    }
                    a = S.cssHooks[t] || S.cssHooks[s];
                    if (a && "get" in a) {
                        r = a.get(e, true, n)
                    }
                    if (r === undefined) {
                        r = Ve(e, t, i)
                    }
                    if (r === "normal" && t in it) {
                        r = it[t]
                    }
                    if (n === "" || n) {
                        o = parseFloat(r);
                        return n === true || isFinite(o) ? o || 0 : r
                    }
                    return r
                }
            });
            S.each(["height", "width"], function (e, u) {
                S.cssHooks[u] = {
                    get: function (e, t, n) {
                        if (t) {
                            return et.test(S.css(e, "display")) && (!e.getClientRects().length || !e.getBoundingClientRect().width) ? fe(e, nt, function () {
                                return at(e, u, n)
                            }) : at(e, u, n)
                        }
                    },
                    set: function (e, t, n) {
                        var i, r = We(e),
                            o = !v.scrollboxSize() && r.position === "absolute",
                            a = o || n,
                            s = a && S.css(e, "boxSizing", false, r) === "border-box",
                            l = n ? ot(e, u, n, s, r) : 0;
                        if (s && o) {
                            l -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(r[u]) - ot(e, u, "border", false, r) - .5)
                        }
                        if (l && (i = oe.exec(t)) && (i[3] || "px") !== "px") {
                            e.style[u] = t;
                            t = S.css(e, u)
                        }
                        return rt(e, t, l)
                    }
                }
            });
            S.cssHooks.marginLeft = Ke(v.reliableMarginLeft, function (e, t) {
                if (t) {
                    return (parseFloat(Ve(e, "marginLeft")) || e.getBoundingClientRect().left - fe(e, {
                        marginLeft: 0
                    }, function () {
                        return e.getBoundingClientRect().left
                    })) + "px"
                }
            });
            S.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function (r, o) {
                S.cssHooks[r + o] = {
                    expand: function (e) {
                        var t = 0,
                            n = {},
                            i = typeof e === "string" ? e.split(" ") : [e];
                        for (; t < 4; t++) {
                            n[r + ae[t] + o] = i[t] || i[t - 2] || i[0]
                        }
                        return n
                    }
                };
                if (r !== "margin") {
                    S.cssHooks[r + o].set = rt
                }
            });
            S.fn.extend({
                css: function (e, t) {
                    return W(this, function (e, t, n) {
                        var i, r, o = {},
                            a = 0;
                        if (Array.isArray(t)) {
                            i = We(e);
                            r = t.length;
                            for (; a < r; a++) {
                                o[t[a]] = S.css(e, t[a], false, i)
                            }
                            return o
                        }
                        return n !== undefined ? S.style(e, t, n) : S.css(e, t)
                    }, e, t, arguments.length > 1)
                }
            });

            function st(e, t, n, i, r) {
                return new st.prototype.init(e, t, n, i, r)
            }
            S.Tween = st;
            st.prototype = {
                constructor: st,
                init: function (e, t, n, i, r, o) {
                    this.elem = e;
                    this.prop = n;
                    this.easing = r || S.easing._default;
                    this.options = t;
                    this.start = this.now = this.cur();
                    this.end = i;
                    this.unit = o || (S.cssNumber[n] ? "" : "px")
                },
                cur: function () {
                    var e = st.propHooks[this.prop];
                    return e && e.get ? e.get(this) : st.propHooks._default.get(this)
                },
                run: function (e) {
                    var t, n = st.propHooks[this.prop];
                    if (this.options.duration) {
                        this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration)
                    } else {
                        this.pos = t = e
                    }
                    this.now = (this.end - this.start) * t + this.start;
                    if (this.options.step) {
                        this.options.step.call(this.elem, this.now, this)
                    }
                    if (n && n.set) {
                        n.set(this)
                    } else {
                        st.propHooks._default.set(this)
                    }
                    return this
                }
            };
            st.prototype.init.prototype = st.prototype;
            st.propHooks = {
                _default: {
                    get: function (e) {
                        var t;
                        if (e.elem.nodeType !== 1 || e.elem[e.prop] != null && e.elem.style[e.prop] == null) {
                            return e.elem[e.prop]
                        }
                        t = S.css(e.elem, e.prop, "");
                        return !t || t === "auto" ? 0 : t
                    },
                    set: function (e) {
                        if (S.fx.step[e.prop]) {
                            S.fx.step[e.prop](e)
                        } else if (e.elem.nodeType === 1 && (S.cssHooks[e.prop] || e.elem.style[Ze(e.prop)] != null)) {
                            S.style(e.elem, e.prop, e.now + e.unit)
                        } else {
                            e.elem[e.prop] = e.now
                        }
                    }
                }
            };
            st.propHooks.scrollTop = st.propHooks.scrollLeft = {
                set: function (e) {
                    if (e.elem.nodeType && e.elem.parentNode) {
                        e.elem[e.prop] = e.now
                    }
                }
            };
            S.easing = {
                linear: function (e) {
                    return e
                },
                swing: function (e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                },
                _default: "swing"
            };
            S.fx = st.prototype.init;
            S.fx.step = {};
            var lt, ut, ct = /^(?:toggle|show|hide)$/,
                ft = /queueHooks$/;

            function pt() {
                if (ut) {
                    if (k.hidden === false && E.requestAnimationFrame) {
                        E.requestAnimationFrame(pt)
                    } else {
                        E.setTimeout(pt, S.fx.interval)
                    }
                    S.fx.tick()
                }
            }

            function dt() {
                E.setTimeout(function () {
                    lt = undefined
                });
                return lt = Date.now()
            }

            function ht(e, t) {
                var n, i = 0,
                    r = {
                        height: e
                    };
                t = t ? 1 : 0;
                for (; i < 4; i += 2 - t) {
                    n = ae[i];
                    r["margin" + n] = r["padding" + n] = e
                }
                if (t) {
                    r.opacity = r.width = e
                }
                return r
            }

            function gt(e, t, n) {
                var i, r = (_t.tweeners[t] || []).concat(_t.tweeners["*"]),
                    o = 0,
                    a = r.length;
                for (; o < a; o++) {
                    if (i = r[o].call(n, t, e)) {
                        return i
                    }
                }
            }

            function mt(e, t, n) {
                var i, r, o, a, s, l, u, c, f = "width" in t || "height" in t,
                    p = this,
                    d = {},
                    h = e.style,
                    g = e.nodeType && ce(e),
                    m = Q.get(e, "fxshow");
                if (!n.queue) {
                    a = S._queueHooks(e, "fx");
                    if (a.unqueued == null) {
                        a.unqueued = 0;
                        s = a.empty.fire;
                        a.empty.fire = function () {
                            if (!a.unqueued) {
                                s()
                            }
                        }
                    }
                    a.unqueued++;
                    p.always(function () {
                        p.always(function () {
                            a.unqueued--;
                            if (!S.queue(e, "fx").length) {
                                a.empty.fire()
                            }
                        })
                    })
                }
                for (i in t) {
                    r = t[i];
                    if (ct.test(r)) {
                        delete t[i];
                        o = o || r === "toggle";
                        if (r === (g ? "hide" : "show")) {
                            if (r === "show" && m && m[i] !== undefined) {
                                g = true
                            } else {
                                continue
                            }
                        }
                        d[i] = m && m[i] || S.style(e, i)
                    }
                }
                l = !S.isEmptyObject(t);
                if (!l && S.isEmptyObject(d)) {
                    return
                }
                if (f && e.nodeType === 1) {
                    n.overflow = [h.overflow, h.overflowX, h.overflowY];
                    u = m && m.display;
                    if (u == null) {
                        u = Q.get(e, "display")
                    }
                    c = S.css(e, "display");
                    if (c === "none") {
                        if (u) {
                            c = u
                        } else {
                            ge([e], true);
                            u = e.style.display || u;
                            c = S.css(e, "display");
                            ge([e])
                        }
                    }
                    if (c === "inline" || c === "inline-block" && u != null) {
                        if (S.css(e, "float") === "none") {
                            if (!l) {
                                p.done(function () {
                                    h.display = u
                                });
                                if (u == null) {
                                    c = h.display;
                                    u = c === "none" ? "" : c
                                }
                            }
                            h.display = "inline-block"
                        }
                    }
                }
                if (n.overflow) {
                    h.overflow = "hidden";
                    p.always(function () {
                        h.overflow = n.overflow[0];
                        h.overflowX = n.overflow[1];
                        h.overflowY = n.overflow[2]
                    })
                }
                l = false;
                for (i in d) {
                    if (!l) {
                        if (m) {
                            if ("hidden" in m) {
                                g = m.hidden
                            }
                        } else {
                            m = Q.access(e, "fxshow", {
                                display: u
                            })
                        }
                        if (o) {
                            m.hidden = !g
                        }
                        if (g) {
                            ge([e], true)
                        }
                        p.done(function () {
                            if (!g) {
                                ge([e])
                            }
                            Q.remove(e, "fxshow");
                            for (i in d) {
                                S.style(e, i, d[i])
                            }
                        })
                    }
                    l = gt(g ? m[i] : 0, i, p);
                    if (!(i in m)) {
                        m[i] = l.start;
                        if (g) {
                            l.end = l.start;
                            l.start = 0
                        }
                    }
                }
            }

            function vt(e, t) {
                var n, i, r, o, a;
                for (n in e) {
                    i = z(n);
                    r = t[i];
                    o = e[n];
                    if (Array.isArray(o)) {
                        r = o[1];
                        o = e[n] = o[0]
                    }
                    if (n !== i) {
                        e[i] = o;
                        delete e[n]
                    }
                    a = S.cssHooks[i];
                    if (a && "expand" in a) {
                        o = a.expand(o);
                        delete e[i];
                        for (n in o) {
                            if (!(n in e)) {
                                e[n] = o[n];
                                t[n] = r
                            }
                        }
                    } else {
                        t[i] = r
                    }
                }
            }

            function _t(a, e, t) {
                var n, s, i = 0,
                    r = _t.prefilters.length,
                    l = S.Deferred().always(function () {
                        delete o.elem
                    }),
                    o = function () {
                        if (s) {
                            return false
                        }
                        var e = lt || dt(),
                            t = Math.max(0, u.startTime + u.duration - e),
                            n = t / u.duration || 0,
                            i = 1 - n,
                            r = 0,
                            o = u.tweens.length;
                        for (; r < o; r++) {
                            u.tweens[r].run(i)
                        }
                        l.notifyWith(a, [u, i, t]);
                        if (i < 1 && o) {
                            return t
                        }
                        if (!o) {
                            l.notifyWith(a, [u, 1, 0])
                        }
                        l.resolveWith(a, [u]);
                        return false
                    },
                    u = l.promise({
                        elem: a,
                        props: S.extend({}, e),
                        opts: S.extend(true, {
                            specialEasing: {},
                            easing: S.easing._default
                        }, t),
                        originalProperties: e,
                        originalOptions: t,
                        startTime: lt || dt(),
                        duration: t.duration,
                        tweens: [],
                        createTween: function (e, t) {
                            var n = S.Tween(a, u.opts, e, t, u.opts.specialEasing[e] || u.opts.easing);
                            u.tweens.push(n);
                            return n
                        },
                        stop: function (e) {
                            var t = 0,
                                n = e ? u.tweens.length : 0;
                            if (s) {
                                return this
                            }
                            s = true;
                            for (; t < n; t++) {
                                u.tweens[t].run(1)
                            }
                            if (e) {
                                l.notifyWith(a, [u, 1, 0]);
                                l.resolveWith(a, [u, e])
                            } else {
                                l.rejectWith(a, [u, e])
                            }
                            return this
                        }
                    }),
                    c = u.props;
                vt(c, u.opts.specialEasing);
                for (; i < r; i++) {
                    n = _t.prefilters[i].call(u, a, c, u.opts);
                    if (n) {
                        if (_(n.stop)) {
                            S._queueHooks(u.elem, u.opts.queue).stop = n.stop.bind(n)
                        }
                        return n
                    }
                }
                S.map(c, gt, u);
                if (_(u.opts.start)) {
                    u.opts.start.call(a, u)
                }
                u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always);
                S.fx.timer(S.extend(o, {
                    elem: a,
                    anim: u,
                    queue: u.opts.queue
                }));
                return u
            }
            S.Animation = S.extend(_t, {
                tweeners: {
                    "*": [function (e, t) {
                        var n = this.createTween(e, t);
                        pe(n.elem, e, oe.exec(t), n);
                        return n
                    }]
                },
                tweener: function (e, t) {
                    if (_(e)) {
                        t = e;
                        e = ["*"]
                    } else {
                        e = e.match(j)
                    }
                    var n, i = 0,
                        r = e.length;
                    for (; i < r; i++) {
                        n = e[i];
                        _t.tweeners[n] = _t.tweeners[n] || [];
                        _t.tweeners[n].unshift(t)
                    }
                },
                prefilters: [mt],
                prefilter: function (e, t) {
                    if (t) {
                        _t.prefilters.unshift(e)
                    } else {
                        _t.prefilters.push(e)
                    }
                }
            });
            S.speed = function (e, t, n) {
                var i = e && typeof e === "object" ? S.extend({}, e) : {
                    complete: n || !n && t || _(e) && e,
                    duration: e,
                    easing: n && t || t && !_(t) && t
                };
                if (S.fx.off) {
                    i.duration = 0
                } else {
                    if (typeof i.duration !== "number") {
                        if (i.duration in S.fx.speeds) {
                            i.duration = S.fx.speeds[i.duration]
                        } else {
                            i.duration = S.fx.speeds._default
                        }
                    }
                }
                if (i.queue == null || i.queue === true) {
                    i.queue = "fx"
                }
                i.old = i.complete;
                i.complete = function () {
                    if (_(i.old)) {
                        i.old.call(this)
                    }
                    if (i.queue) {
                        S.dequeue(this, i.queue)
                    }
                };
                return i
            };
            S.fn.extend({
                fadeTo: function (e, t, n, i) {
                    return this.filter(ce).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, i)
                },
                animate: function (t, e, n, i) {
                    var r = S.isEmptyObject(t),
                        o = S.speed(e, n, i),
                        a = function () {
                            var e = _t(this, S.extend({}, t), o);
                            if (r || Q.get(this, "finish")) {
                                e.stop(true)
                            }
                        };
                    a.finish = a;
                    return r || o.queue === false ? this.each(a) : this.queue(o.queue, a)
                },
                stop: function (r, e, o) {
                    var a = function (e) {
                        var t = e.stop;
                        delete e.stop;
                        t(o)
                    };
                    if (typeof r !== "string") {
                        o = e;
                        e = r;
                        r = undefined
                    }
                    if (e && r !== false) {
                        this.queue(r || "fx", [])
                    }
                    return this.each(function () {
                        var e = true,
                            t = r != null && r + "queueHooks",
                            n = S.timers,
                            i = Q.get(this);
                        if (t) {
                            if (i[t] && i[t].stop) {
                                a(i[t])
                            }
                        } else {
                            for (t in i) {
                                if (i[t] && i[t].stop && ft.test(t)) {
                                    a(i[t])
                                }
                            }
                        }
                        for (t = n.length; t--;) {
                            if (n[t].elem === this && (r == null || n[t].queue === r)) {
                                n[t].anim.stop(o);
                                e = false;
                                n.splice(t, 1)
                            }
                        }
                        if (e || !o) {
                            S.dequeue(this, r)
                        }
                    })
                },
                finish: function (a) {
                    if (a !== false) {
                        a = a || "fx"
                    }
                    return this.each(function () {
                        var e, t = Q.get(this),
                            n = t[a + "queue"],
                            i = t[a + "queueHooks"],
                            r = S.timers,
                            o = n ? n.length : 0;
                        t.finish = true;
                        S.queue(this, a, []);
                        if (i && i.stop) {
                            i.stop.call(this, true)
                        }
                        for (e = r.length; e--;) {
                            if (r[e].elem === this && r[e].queue === a) {
                                r[e].anim.stop(true);
                                r.splice(e, 1)
                            }
                        }
                        for (e = 0; e < o; e++) {
                            if (n[e] && n[e].finish) {
                                n[e].finish.call(this)
                            }
                        }
                        delete t.finish
                    })
                }
            });
            S.each(["toggle", "show", "hide"], function (e, i) {
                var r = S.fn[i];
                S.fn[i] = function (e, t, n) {
                    return e == null || typeof e === "boolean" ? r.apply(this, arguments) : this.animate(ht(i, true), e, t, n)
                }
            });
            S.each({
                slideDown: ht("show"),
                slideUp: ht("hide"),
                slideToggle: ht("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function (e, i) {
                S.fn[e] = function (e, t, n) {
                    return this.animate(i, e, t, n)
                }
            });
            S.timers = [];
            S.fx.tick = function () {
                var e, t = 0,
                    n = S.timers;
                lt = Date.now();
                for (; t < n.length; t++) {
                    e = n[t];
                    if (!e() && n[t] === e) {
                        n.splice(t--, 1)
                    }
                }
                if (!n.length) {
                    S.fx.stop()
                }
                lt = undefined
            };
            S.fx.timer = function (e) {
                S.timers.push(e);
                S.fx.start()
            };
            S.fx.interval = 13;
            S.fx.start = function () {
                if (ut) {
                    return
                }
                ut = true;
                pt()
            };
            S.fx.stop = function () {
                ut = null
            };
            S.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            };
            S.fn.delay = function (i, e) {
                i = S.fx ? S.fx.speeds[i] || i : i;
                e = e || "fx";
                return this.queue(e, function (e, t) {
                    var n = E.setTimeout(e, i);
                    t.stop = function () {
                        E.clearTimeout(n)
                    }
                })
            };
            (function () {
                var e = k.createElement("input"),
                    t = k.createElement("select"),
                    n = t.appendChild(k.createElement("option"));
                e.type = "checkbox";
                v.checkOn = e.value !== "";
                v.optSelected = n.selected;
                e = k.createElement("input");
                e.value = "t";
                e.type = "radio";
                v.radioValue = e.value === "t"
            })();
            var yt, bt = S.expr.attrHandle;
            S.fn.extend({
                attr: function (e, t) {
                    return W(this, S.attr, e, t, arguments.length > 1)
                },
                removeAttr: function (e) {
                    return this.each(function () {
                        S.removeAttr(this, e)
                    })
                }
            });
            S.extend({
                attr: function (e, t, n) {
                    var i, r, o = e.nodeType;
                    if (o === 3 || o === 8 || o === 2) {
                        return
                    }
                    if (typeof e.getAttribute === "undefined") {
                        return S.prop(e, t, n)
                    }
                    if (o !== 1 || !S.isXMLDoc(e)) {
                        r = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? yt : undefined)
                    }
                    if (n !== undefined) {
                        if (n === null) {
                            S.removeAttr(e, t);
                            return
                        }
                        if (r && "set" in r && (i = r.set(e, n, t)) !== undefined) {
                            return i
                        }
                        e.setAttribute(t, n + "");
                        return n
                    }
                    if (r && "get" in r && (i = r.get(e, t)) !== null) {
                        return i
                    }
                    i = S.find.attr(e, t);
                    return i == null ? undefined : i
                },
                attrHooks: {
                    type: {
                        set: function (e, t) {
                            if (!v.radioValue && t === "radio" && A(e, "input")) {
                                var n = e.value;
                                e.setAttribute("type", t);
                                if (n) {
                                    e.value = n
                                }
                                return t
                            }
                        }
                    }
                },
                removeAttr: function (e, t) {
                    var n, i = 0,
                        r = t && t.match(j);
                    if (r && e.nodeType === 1) {
                        while (n = r[i++]) {
                            e.removeAttribute(n)
                        }
                    }
                }
            });
            yt = {
                set: function (e, t, n) {
                    if (t === false) {
                        S.removeAttr(e, n)
                    } else {
                        e.setAttribute(n, n)
                    }
                    return n
                }
            };
            S.each(S.expr.match.bool.source.match(/\w+/g), function (e, t) {
                var a = bt[t] || S.find.attr;
                bt[t] = function (e, t, n) {
                    var i, r, o = t.toLowerCase();
                    if (!n) {
                        r = bt[o];
                        bt[o] = i;
                        i = a(e, t, n) != null ? o : null;
                        bt[o] = r
                    }
                    return i
                }
            });
            var xt = /^(?:input|select|textarea|button)$/i,
                wt = /^(?:a|area)$/i;
            S.fn.extend({
                prop: function (e, t) {
                    return W(this, S.prop, e, t, arguments.length > 1)
                },
                removeProp: function (e) {
                    return this.each(function () {
                        delete this[S.propFix[e] || e]
                    })
                }
            });
            S.extend({
                prop: function (e, t, n) {
                    var i, r, o = e.nodeType;
                    if (o === 3 || o === 8 || o === 2) {
                        return
                    }
                    if (o !== 1 || !S.isXMLDoc(e)) {
                        t = S.propFix[t] || t;
                        r = S.propHooks[t]
                    }
                    if (n !== undefined) {
                        if (r && "set" in r && (i = r.set(e, n, t)) !== undefined) {
                            return i
                        }
                        return e[t] = n
                    }
                    if (r && "get" in r && (i = r.get(e, t)) !== null) {
                        return i
                    }
                    return e[t]
                },
                propHooks: {
                    tabIndex: {
                        get: function (e) {
                            var t = S.find.attr(e, "tabindex");
                            if (t) {
                                return parseInt(t, 10)
                            }
                            if (xt.test(e.nodeName) || wt.test(e.nodeName) && e.href) {
                                return 0
                            }
                            return -1
                        }
                    }
                },
                propFix: {
                    for: "htmlFor",
                    class: "className"
                }
            });
            if (!v.optSelected) {
                S.propHooks.selected = {
                    get: function (e) {
                        var t = e.parentNode;
                        if (t && t.parentNode) {
                            t.parentNode.selectedIndex
                        }
                        return null
                    },
                    set: function (e) {
                        var t = e.parentNode;
                        if (t) {
                            t.selectedIndex;
                            if (t.parentNode) {
                                t.parentNode.selectedIndex
                            }
                        }
                    }
                }
            }
            S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
                S.propFix[this.toLowerCase()] = this
            });

            function Et(e) {
                var t = e.match(j) || [];
                return t.join(" ")
            }

            function kt(e) {
                return e.getAttribute && e.getAttribute("class") || ""
            }

            function St(e) {
                if (Array.isArray(e)) {
                    return e
                }
                if (typeof e === "string") {
                    return e.match(j) || []
                }
                return []
            }
            S.fn.extend({
                addClass: function (t) {
                    var e, n, i, r, o, a, s, l = 0;
                    if (_(t)) {
                        return this.each(function (e) {
                            S(this).addClass(t.call(this, e, kt(this)))
                        })
                    }
                    e = St(t);
                    if (e.length) {
                        while (n = this[l++]) {
                            r = kt(n);
                            i = n.nodeType === 1 && " " + Et(r) + " ";
                            if (i) {
                                a = 0;
                                while (o = e[a++]) {
                                    if (i.indexOf(" " + o + " ") < 0) {
                                        i += o + " "
                                    }
                                }
                                s = Et(i);
                                if (r !== s) {
                                    n.setAttribute("class", s)
                                }
                            }
                        }
                    }
                    return this
                },
                removeClass: function (t) {
                    var e, n, i, r, o, a, s, l = 0;
                    if (_(t)) {
                        return this.each(function (e) {
                            S(this).removeClass(t.call(this, e, kt(this)))
                        })
                    }
                    if (!arguments.length) {
                        return this.attr("class", "")
                    }
                    e = St(t);
                    if (e.length) {
                        while (n = this[l++]) {
                            r = kt(n);
                            i = n.nodeType === 1 && " " + Et(r) + " ";
                            if (i) {
                                a = 0;
                                while (o = e[a++]) {
                                    while (i.indexOf(" " + o + " ") > -1) {
                                        i = i.replace(" " + o + " ", " ")
                                    }
                                }
                                s = Et(i);
                                if (r !== s) {
                                    n.setAttribute("class", s)
                                }
                            }
                        }
                    }
                    return this
                },
                toggleClass: function (r, t) {
                    var o = typeof r,
                        a = o === "string" || Array.isArray(r);
                    if (typeof t === "boolean" && a) {
                        return t ? this.addClass(r) : this.removeClass(r)
                    }
                    if (_(r)) {
                        return this.each(function (e) {
                            S(this).toggleClass(r.call(this, e, kt(this), t), t)
                        })
                    }
                    return this.each(function () {
                        var e, t, n, i;
                        if (a) {
                            t = 0;
                            n = S(this);
                            i = St(r);
                            while (e = i[t++]) {
                                if (n.hasClass(e)) {
                                    n.removeClass(e)
                                } else {
                                    n.addClass(e)
                                }
                            }
                        } else if (r === undefined || o === "boolean") {
                            e = kt(this);
                            if (e) {
                                Q.set(this, "__className__", e)
                            }
                            if (this.setAttribute) {
                                this.setAttribute("class", e || r === false ? "" : Q.get(this, "__className__") || "")
                            }
                        }
                    })
                },
                hasClass: function (e) {
                    var t, n, i = 0;
                    t = " " + e + " ";
                    while (n = this[i++]) {
                        if (n.nodeType === 1 && (" " + Et(kt(n)) + " ").indexOf(t) > -1) {
                            return true
                        }
                    }
                    return false
                }
            });
            var Tt = /\r/g;
            S.fn.extend({
                val: function (n) {
                    var i, e, r, t = this[0];
                    if (!arguments.length) {
                        if (t) {
                            i = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()];
                            if (i && "get" in i && (e = i.get(t, "value")) !== undefined) {
                                return e
                            }
                            e = t.value;
                            if (typeof e === "string") {
                                return e.replace(Tt, "")
                            }
                            return e == null ? "" : e
                        }
                        return
                    }
                    r = _(n);
                    return this.each(function (e) {
                        var t;
                        if (this.nodeType !== 1) {
                            return
                        }
                        if (r) {
                            t = n.call(this, e, S(this).val())
                        } else {
                            t = n
                        }
                        if (t == null) {
                            t = ""
                        } else if (typeof t === "number") {
                            t += ""
                        } else if (Array.isArray(t)) {
                            t = S.map(t, function (e) {
                                return e == null ? "" : e + ""
                            })
                        }
                        i = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()];
                        if (!i || !("set" in i) || i.set(this, t, "value") === undefined) {
                            this.value = t
                        }
                    })
                }
            });
            S.extend({
                valHooks: {
                    option: {
                        get: function (e) {
                            var t = S.find.attr(e, "value");
                            return t != null ? t : Et(S.text(e))
                        }
                    },
                    select: {
                        get: function (e) {
                            var t, n, i, r = e.options,
                                o = e.selectedIndex,
                                a = e.type === "select-one",
                                s = a ? null : [],
                                l = a ? o + 1 : r.length;
                            if (o < 0) {
                                i = l
                            } else {
                                i = a ? o : 0
                            }
                            for (; i < l; i++) {
                                n = r[i];
                                if ((n.selected || i === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
                                    t = S(n).val();
                                    if (a) {
                                        return t
                                    }
                                    s.push(t)
                                }
                            }
                            return s
                        },
                        set: function (e, t) {
                            var n, i, r = e.options,
                                o = S.makeArray(t),
                                a = r.length;
                            while (a--) {
                                i = r[a];
                                if (i.selected = S.inArray(S.valHooks.option.get(i), o) > -1) {
                                    n = true
                                }
                            }
                            if (!n) {
                                e.selectedIndex = -1
                            }
                            return o
                        }
                    }
                }
            });
            S.each(["radio", "checkbox"], function () {
                S.valHooks[this] = {
                    set: function (e, t) {
                        if (Array.isArray(t)) {
                            return e.checked = S.inArray(S(e).val(), t) > -1
                        }
                    }
                };
                if (!v.checkOn) {
                    S.valHooks[this].get = function (e) {
                        return e.getAttribute("value") === null ? "on" : e.value
                    }
                }
            });
            v.focusin = "onfocusin" in E;
            var Nt = /^(?:focusinfocus|focusoutblur)$/,
                At = function (e) {
                    e.stopPropagation()
                };
            S.extend(S.event, {
                trigger: function (e, t, n, i) {
                    var r, o, a, s, l, u, c, f, p = [n || k],
                        d = m.call(e, "type") ? e.type : e,
                        h = m.call(e, "namespace") ? e.namespace.split(".") : [];
                    o = f = a = n = n || k;
                    if (n.nodeType === 3 || n.nodeType === 8) {
                        return
                    }
                    if (Nt.test(d + S.event.triggered)) {
                        return
                    }
                    if (d.indexOf(".") > -1) {
                        h = d.split(".");
                        d = h.shift();
                        h.sort()
                    }
                    l = d.indexOf(":") < 0 && "on" + d;
                    e = e[S.expando] ? e : new S.Event(d, typeof e === "object" && e);
                    e.isTrigger = i ? 2 : 3;
                    e.namespace = h.join(".");
                    e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                    e.result = undefined;
                    if (!e.target) {
                        e.target = n
                    }
                    t = t == null ? [e] : S.makeArray(t, [e]);
                    c = S.event.special[d] || {};
                    if (!i && c.trigger && c.trigger.apply(n, t) === false) {
                        return
                    }
                    if (!i && !c.noBubble && !y(n)) {
                        s = c.delegateType || d;
                        if (!Nt.test(s + d)) {
                            o = o.parentNode
                        }
                        for (; o; o = o.parentNode) {
                            p.push(o);
                            a = o
                        }
                        if (a === (n.ownerDocument || k)) {
                            p.push(a.defaultView || a.parentWindow || E)
                        }
                    }
                    r = 0;
                    while ((o = p[r++]) && !e.isPropagationStopped()) {
                        f = o;
                        e.type = r > 1 ? s : c.bindType || d;
                        u = (Q.get(o, "events") || {})[e.type] && Q.get(o, "handle");
                        if (u) {
                            u.apply(o, t)
                        }
                        u = l && o[l];
                        if (u && u.apply && X(o)) {
                            e.result = u.apply(o, t);
                            if (e.result === false) {
                                e.preventDefault()
                            }
                        }
                    }
                    e.type = d;
                    if (!i && !e.isDefaultPrevented()) {
                        if ((!c._default || c._default.apply(p.pop(), t) === false) && X(n)) {
                            if (l && _(n[d]) && !y(n)) {
                                a = n[l];
                                if (a) {
                                    n[l] = null
                                }
                                S.event.triggered = d;
                                if (e.isPropagationStopped()) {
                                    f.addEventListener(d, At)
                                }
                                n[d]();
                                if (e.isPropagationStopped()) {
                                    f.removeEventListener(d, At)
                                }
                                S.event.triggered = undefined;
                                if (a) {
                                    n[l] = a
                                }
                            }
                        }
                    }
                    return e.result
                },
                simulate: function (e, t, n) {
                    var i = S.extend(new S.Event, n, {
                        type: e,
                        isSimulated: true
                    });
                    S.event.trigger(i, null, t)
                }
            });
            S.fn.extend({
                trigger: function (e, t) {
                    return this.each(function () {
                        S.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function (e, t) {
                    var n = this[0];
                    if (n) {
                        return S.event.trigger(e, t, n, true)
                    }
                }
            });
            if (!v.focusin) {
                S.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function (n, i) {
                    var r = function (e) {
                        S.event.simulate(i, e.target, S.event.fix(e))
                    };
                    S.event.special[i] = {
                        setup: function () {
                            var e = this.ownerDocument || this,
                                t = Q.access(e, i);
                            if (!t) {
                                e.addEventListener(n, r, true)
                            }
                            Q.access(e, i, (t || 0) + 1)
                        },
                        teardown: function () {
                            var e = this.ownerDocument || this,
                                t = Q.access(e, i) - 1;
                            if (!t) {
                                e.removeEventListener(n, r, true);
                                Q.remove(e, i)
                            } else {
                                Q.access(e, i, t)
                            }
                        }
                    }
                })
            }
            var Ct = E.location;
            var Ot = Date.now();
            var It = /\?/;
            S.parseXML = function (e) {
                var t;
                if (!e || typeof e !== "string") {
                    return null
                }
                try {
                    t = (new E.DOMParser).parseFromString(e, "text/xml")
                } catch (e) {
                    t = undefined
                }
                if (!t || t.getElementsByTagName("parsererror").length) {
                    S.error("Invalid XML: " + e)
                }
                return t
            };
            var Rt = /\[\]$/,
                Pt = /\r?\n/g,
                Lt = /^(?:submit|button|image|reset|file)$/i,
                Dt = /^(?:input|select|textarea|keygen)/i;

            function Mt(n, e, i, r) {
                var t;
                if (Array.isArray(e)) {
                    S.each(e, function (e, t) {
                        if (i || Rt.test(n)) {
                            r(n, t)
                        } else {
                            Mt(n + "[" + (typeof t === "object" && t != null ? e : "") + "]", t, i, r)
                        }
                    })
                } else if (!i && x(e) === "object") {
                    for (t in e) {
                        Mt(n + "[" + t + "]", e[t], i, r)
                    }
                } else {
                    r(n, e)
                }
            }
            S.param = function (e, t) {
                var n, i = [],
                    r = function (e, t) {
                        var n = _(t) ? t() : t;
                        i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(n == null ? "" : n)
                    };
                if (e == null) {
                    return ""
                }
                if (Array.isArray(e) || e.jquery && !S.isPlainObject(e)) {
                    S.each(e, function () {
                        r(this.name, this.value)
                    })
                } else {
                    for (n in e) {
                        Mt(n, e[n], t, r)
                    }
                }
                return i.join("&")
            };
            S.fn.extend({
                serialize: function () {
                    return S.param(this.serializeArray())
                },
                serializeArray: function () {
                    return this.map(function () {
                        var e = S.prop(this, "elements");
                        return e ? S.makeArray(e) : this
                    }).filter(function () {
                        var e = this.type;
                        return this.name && !S(this).is(":disabled") && Dt.test(this.nodeName) && !Lt.test(e) && (this.checked || !me.test(e))
                    }).map(function (e, t) {
                        var n = S(this).val();
                        if (n == null) {
                            return null
                        }
                        if (Array.isArray(n)) {
                            return S.map(n, function (e) {
                                return {
                                    name: t.name,
                                    value: e.replace(Pt, "\r\n")
                                }
                            })
                        }
                        return {
                            name: t.name,
                            value: n.replace(Pt, "\r\n")
                        }
                    }).get()
                }
            });
            var jt = /%20/g,
                Ft = /#.*$/,
                Ht = /([?&])_=[^&]*/,
                Ut = /^(.*?):[ \t]*([^\r\n]*)$/gm,
                qt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
                $t = /^(?:GET|HEAD)$/,
                Bt = /^\/\//,
                Gt = {},
                Wt = {},
                Yt = "*/".concat("*"),
                Vt = k.createElement("a");
            Vt.href = Ct.href;

            function Kt(o) {
                return function (e, t) {
                    if (typeof e !== "string") {
                        t = e;
                        e = "*"
                    }
                    var n, i = 0,
                        r = e.toLowerCase().match(j) || [];
                    if (_(t)) {
                        while (n = r[i++]) {
                            if (n[0] === "+") {
                                n = n.slice(1) || "*";
                                (o[n] = o[n] || []).unshift(t)
                            } else {
                                (o[n] = o[n] || []).push(t)
                            }
                        }
                    }
                }
            }

            function zt(t, r, o, a) {
                var s = {},
                    l = t === Wt;

                function u(e) {
                    var i;
                    s[e] = true;
                    S.each(t[e] || [], function (e, t) {
                        var n = t(r, o, a);
                        if (typeof n === "string" && !l && !s[n]) {
                            r.dataTypes.unshift(n);
                            u(n);
                            return false
                        } else if (l) {
                            return !(i = n)
                        }
                    });
                    return i
                }
                return u(r.dataTypes[0]) || !s["*"] && u("*")
            }

            function Xt(e, t) {
                var n, i, r = S.ajaxSettings.flatOptions || {};
                for (n in t) {
                    if (t[n] !== undefined) {
                        (r[n] ? e : i || (i = {}))[n] = t[n]
                    }
                }
                if (i) {
                    S.extend(true, e, i)
                }
                return e
            }

            function Jt(e, t, n) {
                var i, r, o, a, s = e.contents,
                    l = e.dataTypes;
                while (l[0] === "*") {
                    l.shift();
                    if (i === undefined) {
                        i = e.mimeType || t.getResponseHeader("Content-Type")
                    }
                }
                if (i) {
                    for (r in s) {
                        if (s[r] && s[r].test(i)) {
                            l.unshift(r);
                            break
                        }
                    }
                }
                if (l[0] in n) {
                    o = l[0]
                } else {
                    for (r in n) {
                        if (!l[0] || e.converters[r + " " + l[0]]) {
                            o = r;
                            break
                        }
                        if (!a) {
                            a = r
                        }
                    }
                    o = o || a
                }
                if (o) {
                    if (o !== l[0]) {
                        l.unshift(o)
                    }
                    return n[o]
                }
            }

            function Qt(e, t, n, i) {
                var r, o, a, s, l, u = {},
                    c = e.dataTypes.slice();
                if (c[1]) {
                    for (a in e.converters) {
                        u[a.toLowerCase()] = e.converters[a]
                    }
                }
                o = c.shift();
                while (o) {
                    if (e.responseFields[o]) {
                        n[e.responseFields[o]] = t
                    }
                    if (!l && i && e.dataFilter) {
                        t = e.dataFilter(t, e.dataType)
                    }
                    l = o;
                    o = c.shift();
                    if (o) {
                        if (o === "*") {
                            o = l
                        } else if (l !== "*" && l !== o) {
                            a = u[l + " " + o] || u["* " + o];
                            if (!a) {
                                for (r in u) {
                                    s = r.split(" ");
                                    if (s[1] === o) {
                                        a = u[l + " " + s[0]] || u["* " + s[0]];
                                        if (a) {
                                            if (a === true) {
                                                a = u[r]
                                            } else if (u[r] !== true) {
                                                o = s[0];
                                                c.unshift(s[1])
                                            }
                                            break
                                        }
                                    }
                                }
                            }
                            if (a !== true) {
                                if (a && e.throws) {
                                    t = a(t)
                                } else {
                                    try {
                                        t = a(t)
                                    } catch (e) {
                                        return {
                                            state: "parsererror",
                                            error: a ? e : "No conversion from " + l + " to " + o
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return {
                    state: "success",
                    data: t
                }
            }
            S.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: Ct.href,
                    type: "GET",
                    isLocal: qt.test(Ct.protocol),
                    global: true,
                    processData: true,
                    async: true,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": Yt,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /\bxml\b/,
                        html: /\bhtml/,
                        json: /\bjson\b/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": true,
                        "text json": JSON.parse,
                        "text xml": S.parseXML
                    },
                    flatOptions: {
                        url: true,
                        context: true
                    }
                },
                ajaxSetup: function (e, t) {
                    return t ? Xt(Xt(e, S.ajaxSettings), t) : Xt(S.ajaxSettings, e)
                },
                ajaxPrefilter: Kt(Gt),
                ajaxTransport: Kt(Wt),
                ajax: function (e, t) {
                    if (typeof e === "object") {
                        t = e;
                        e = undefined
                    }
                    t = t || {};
                    var c, f, p, n, d, i, h, g, r, o, m = S.ajaxSetup({}, t),
                        v = m.context || m,
                        _ = m.context && (v.nodeType || v.jquery) ? S(v) : S.event,
                        y = S.Deferred(),
                        b = S.Callbacks("once memory"),
                        x = m.statusCode || {},
                        a = {},
                        s = {},
                        l = "canceled",
                        w = {
                            readyState: 0,
                            getResponseHeader: function (e) {
                                var t;
                                if (h) {
                                    if (!n) {
                                        n = {};
                                        while (t = Ut.exec(p)) {
                                            n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2])
                                        }
                                    }
                                    t = n[e.toLowerCase() + " "]
                                }
                                return t == null ? null : t.join(", ")
                            },
                            getAllResponseHeaders: function () {
                                return h ? p : null
                            },
                            setRequestHeader: function (e, t) {
                                if (h == null) {
                                    e = s[e.toLowerCase()] = s[e.toLowerCase()] || e;
                                    a[e] = t
                                }
                                return this
                            },
                            overrideMimeType: function (e) {
                                if (h == null) {
                                    m.mimeType = e
                                }
                                return this
                            },
                            statusCode: function (e) {
                                var t;
                                if (e) {
                                    if (h) {
                                        w.always(e[w.status])
                                    } else {
                                        for (t in e) {
                                            x[t] = [x[t], e[t]]
                                        }
                                    }
                                }
                                return this
                            },
                            abort: function (e) {
                                var t = e || l;
                                if (c) {
                                    c.abort(t)
                                }
                                u(0, t);
                                return this
                            }
                        };
                    y.promise(w);
                    m.url = ((e || m.url || Ct.href) + "").replace(Bt, Ct.protocol + "//");
                    m.type = t.method || t.type || m.method || m.type;
                    m.dataTypes = (m.dataType || "*").toLowerCase().match(j) || [""];
                    if (m.crossDomain == null) {
                        i = k.createElement("a");
                        try {
                            i.href = m.url;
                            i.href = i.href;
                            m.crossDomain = Vt.protocol + "//" + Vt.host !== i.protocol + "//" + i.host
                        } catch (e) {
                            m.crossDomain = true
                        }
                    }
                    if (m.data && m.processData && typeof m.data !== "string") {
                        m.data = S.param(m.data, m.traditional)
                    }
                    zt(Gt, m, t, w);
                    if (h) {
                        return w
                    }
                    g = S.event && m.global;
                    if (g && S.active++ === 0) {
                        S.event.trigger("ajaxStart")
                    }
                    m.type = m.type.toUpperCase();
                    m.hasContent = !$t.test(m.type);
                    f = m.url.replace(Ft, "");
                    if (!m.hasContent) {
                        o = m.url.slice(f.length);
                        if (m.data && (m.processData || typeof m.data === "string")) {
                            f += (It.test(f) ? "&" : "?") + m.data;
                            delete m.data
                        }
                        if (m.cache === false) {
                            f = f.replace(Ht, "$1");
                            o = (It.test(f) ? "&" : "?") + "_=" + Ot++ + o
                        }
                        m.url = f + o
                    } else if (m.data && m.processData && (m.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
                        m.data = m.data.replace(jt, "+")
                    }
                    if (m.ifModified) {
                        if (S.lastModified[f]) {
                            w.setRequestHeader("If-Modified-Since", S.lastModified[f])
                        }
                        if (S.etag[f]) {
                            w.setRequestHeader("If-None-Match", S.etag[f])
                        }
                    }
                    if (m.data && m.hasContent && m.contentType !== false || t.contentType) {
                        w.setRequestHeader("Content-Type", m.contentType)
                    }
                    w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + (m.dataTypes[0] !== "*" ? ", " + Yt + "; q=0.01" : "") : m.accepts["*"]);
                    for (r in m.headers) {
                        w.setRequestHeader(r, m.headers[r])
                    }
                    if (m.beforeSend && (m.beforeSend.call(v, w, m) === false || h)) {
                        return w.abort()
                    }
                    l = "abort";
                    b.add(m.complete);
                    w.done(m.success);
                    w.fail(m.error);
                    c = zt(Wt, m, t, w);
                    if (!c) {
                        u(-1, "No Transport")
                    } else {
                        w.readyState = 1;
                        if (g) {
                            _.trigger("ajaxSend", [w, m])
                        }
                        if (h) {
                            return w
                        }
                        if (m.async && m.timeout > 0) {
                            d = E.setTimeout(function () {
                                w.abort("timeout")
                            }, m.timeout)
                        }
                        try {
                            h = false;
                            c.send(a, u)
                        } catch (e) {
                            if (h) {
                                throw e
                            }
                            u(-1, e)
                        }
                    }

                    function u(e, t, n, i) {
                        var r, o, a, s, l, u = t;
                        if (h) {
                            return
                        }
                        h = true;
                        if (d) {
                            E.clearTimeout(d)
                        }
                        c = undefined;
                        p = i || "";
                        w.readyState = e > 0 ? 4 : 0;
                        r = e >= 200 && e < 300 || e === 304;
                        if (n) {
                            s = Jt(m, w, n)
                        }
                        s = Qt(m, s, w, r);
                        if (r) {
                            if (m.ifModified) {
                                l = w.getResponseHeader("Last-Modified");
                                if (l) {
                                    S.lastModified[f] = l
                                }
                                l = w.getResponseHeader("etag");
                                if (l) {
                                    S.etag[f] = l
                                }
                            }
                            if (e === 204 || m.type === "HEAD") {
                                u = "nocontent"
                            } else if (e === 304) {
                                u = "notmodified"
                            } else {
                                u = s.state;
                                o = s.data;
                                a = s.error;
                                r = !a
                            }
                        } else {
                            a = u;
                            if (e || !u) {
                                u = "error";
                                if (e < 0) {
                                    e = 0
                                }
                            }
                        }
                        w.status = e;
                        w.statusText = (t || u) + "";
                        if (r) {
                            y.resolveWith(v, [o, u, w])
                        } else {
                            y.rejectWith(v, [w, u, a])
                        }
                        w.statusCode(x);
                        x = undefined;
                        if (g) {
                            _.trigger(r ? "ajaxSuccess" : "ajaxError", [w, m, r ? o : a])
                        }
                        b.fireWith(v, [w, u]);
                        if (g) {
                            _.trigger("ajaxComplete", [w, m]);
                            if (!--S.active) {
                                S.event.trigger("ajaxStop")
                            }
                        }
                    }
                    return w
                },
                getJSON: function (e, t, n) {
                    return S.get(e, t, n, "json")
                },
                getScript: function (e, t) {
                    return S.get(e, undefined, t, "script")
                }
            });
            S.each(["get", "post"], function (e, r) {
                S[r] = function (e, t, n, i) {
                    if (_(t)) {
                        i = i || n;
                        n = t;
                        t = undefined
                    }
                    return S.ajax(S.extend({
                        url: e,
                        type: r,
                        dataType: i,
                        data: t,
                        success: n
                    }, S.isPlainObject(e) && e))
                }
            });
            S._evalUrl = function (e, t) {
                return S.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    cache: true,
                    async: false,
                    global: false,
                    converters: {
                        "text script": function () {}
                    },
                    dataFilter: function (e) {
                        S.globalEval(e, t)
                    }
                })
            };
            S.fn.extend({
                wrapAll: function (e) {
                    var t;
                    if (this[0]) {
                        if (_(e)) {
                            e = e.call(this[0])
                        }
                        t = S(e, this[0].ownerDocument).eq(0).clone(true);
                        if (this[0].parentNode) {
                            t.insertBefore(this[0])
                        }
                        t.map(function () {
                            var e = this;
                            while (e.firstElementChild) {
                                e = e.firstElementChild
                            }
                            return e
                        }).append(this)
                    }
                    return this
                },
                wrapInner: function (n) {
                    if (_(n)) {
                        return this.each(function (e) {
                            S(this).wrapInner(n.call(this, e))
                        })
                    }
                    return this.each(function () {
                        var e = S(this),
                            t = e.contents();
                        if (t.length) {
                            t.wrapAll(n)
                        } else {
                            e.append(n)
                        }
                    })
                },
                wrap: function (t) {
                    var n = _(t);
                    return this.each(function (e) {
                        S(this).wrapAll(n ? t.call(this, e) : t)
                    })
                },
                unwrap: function (e) {
                    this.parent(e).not("body").each(function () {
                        S(this).replaceWith(this.childNodes)
                    });
                    return this
                }
            });
            S.expr.pseudos.hidden = function (e) {
                return !S.expr.pseudos.visible(e)
            };
            S.expr.pseudos.visible = function (e) {
                return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
            };
            S.ajaxSettings.xhr = function () {
                try {
                    return new E.XMLHttpRequest
                } catch (e) {}
            };
            var Zt = {
                    0: 200,
                    1223: 204
                },
                en = S.ajaxSettings.xhr();
            v.cors = !!en && "withCredentials" in en;
            v.ajax = en = !!en;
            S.ajaxTransport(function (r) {
                var o, a;
                if (v.cors || en && !r.crossDomain) {
                    return {
                        send: function (e, t) {
                            var n, i = r.xhr();
                            i.open(r.type, r.url, r.async, r.username, r.password);
                            if (r.xhrFields) {
                                for (n in r.xhrFields) {
                                    i[n] = r.xhrFields[n]
                                }
                            }
                            if (r.mimeType && i.overrideMimeType) {
                                i.overrideMimeType(r.mimeType)
                            }
                            if (!r.crossDomain && !e["X-Requested-With"]) {
                                e["X-Requested-With"] = "XMLHttpRequest"
                            }
                            for (n in e) {
                                i.setRequestHeader(n, e[n])
                            }
                            o = function (e) {
                                return function () {
                                    if (o) {
                                        o = a = i.onload = i.onerror = i.onabort = i.ontimeout = i.onreadystatechange = null;
                                        if (e === "abort") {
                                            i.abort()
                                        } else if (e === "error") {
                                            if (typeof i.status !== "number") {
                                                t(0, "error")
                                            } else {
                                                t(i.status, i.statusText)
                                            }
                                        } else {
                                            t(Zt[i.status] || i.status, i.statusText, (i.responseType || "text") !== "text" || typeof i.responseText !== "string" ? {
                                                binary: i.response
                                            } : {
                                                text: i.responseText
                                            }, i.getAllResponseHeaders())
                                        }
                                    }
                                }
                            };
                            i.onload = o();
                            a = i.onerror = i.ontimeout = o("error");
                            if (i.onabort !== undefined) {
                                i.onabort = a
                            } else {
                                i.onreadystatechange = function () {
                                    if (i.readyState === 4) {
                                        E.setTimeout(function () {
                                            if (o) {
                                                a()
                                            }
                                        })
                                    }
                                }
                            }
                            o = o("abort");
                            try {
                                i.send(r.hasContent && r.data || null)
                            } catch (e) {
                                if (o) {
                                    throw e
                                }
                            }
                        },
                        abort: function () {
                            if (o) {
                                o()
                            }
                        }
                    }
                }
            });
            S.ajaxPrefilter(function (e) {
                if (e.crossDomain) {
                    e.contents.script = false
                }
            });
            S.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /\b(?:java|ecma)script\b/
                },
                converters: {
                    "text script": function (e) {
                        S.globalEval(e);
                        return e
                    }
                }
            });
            S.ajaxPrefilter("script", function (e) {
                if (e.cache === undefined) {
                    e.cache = false
                }
                if (e.crossDomain) {
                    e.type = "GET"
                }
            });
            S.ajaxTransport("script", function (n) {
                if (n.crossDomain || n.scriptAttrs) {
                    var i, r;
                    return {
                        send: function (e, t) {
                            i = S("<script>").attr(n.scriptAttrs || {}).prop({
                                charset: n.scriptCharset,
                                src: n.url
                            }).on("load error", r = function (e) {
                                i.remove();
                                r = null;
                                if (e) {
                                    t(e.type === "error" ? 404 : 200, e.type)
                                }
                            });
                            k.head.appendChild(i[0])
                        },
                        abort: function () {
                            if (r) {
                                r()
                            }
                        }
                    }
                }
            });
            var tn = [],
                nn = /(=)\?(?=&|$)|\?\?/;
            S.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function () {
                    var e = tn.pop() || S.expando + "_" + Ot++;
                    this[e] = true;
                    return e
                }
            });
            S.ajaxPrefilter("json jsonp", function (e, t, n) {
                var i, r, o, a = e.jsonp !== false && (nn.test(e.url) ? "url" : typeof e.data === "string" && (e.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && nn.test(e.data) && "data");
                if (a || e.dataTypes[0] === "jsonp") {
                    i = e.jsonpCallback = _(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback;
                    if (a) {
                        e[a] = e[a].replace(nn, "$1" + i)
                    } else if (e.jsonp !== false) {
                        e.url += (It.test(e.url) ? "&" : "?") + e.jsonp + "=" + i
                    }
                    e.converters["script json"] = function () {
                        if (!o) {
                            S.error(i + " was not called")
                        }
                        return o[0]
                    };
                    e.dataTypes[0] = "json";
                    r = E[i];
                    E[i] = function () {
                        o = arguments
                    };
                    n.always(function () {
                        if (r === undefined) {
                            S(E).removeProp(i)
                        } else {
                            E[i] = r
                        }
                        if (e[i]) {
                            e.jsonpCallback = t.jsonpCallback;
                            tn.push(i)
                        }
                        if (o && _(r)) {
                            r(o[0])
                        }
                        o = r = undefined
                    });
                    return "script"
                }
            });
            v.createHTMLDocument = function () {
                var e = k.implementation.createHTMLDocument("").body;
                e.innerHTML = "<form></form><form></form>";
                return e.childNodes.length === 2
            }();
            S.parseHTML = function (e, t, n) {
                if (typeof e !== "string") {
                    return []
                }
                if (typeof t === "boolean") {
                    n = t;
                    t = false
                }
                var i, r, o;
                if (!t) {
                    if (v.createHTMLDocument) {
                        t = k.implementation.createHTMLDocument("");
                        i = t.createElement("base");
                        i.href = k.location.href;
                        t.head.appendChild(i)
                    } else {
                        t = k
                    }
                }
                r = C.exec(e);
                o = !n && [];
                if (r) {
                    return [t.createElement(r[1])]
                }
                r = Ee([e], t, o);
                if (o && o.length) {
                    S(o).remove()
                }
                return S.merge([], r.childNodes)
            };
            S.fn.load = function (e, t, n) {
                var i, r, o, a = this,
                    s = e.indexOf(" ");
                if (s > -1) {
                    i = Et(e.slice(s));
                    e = e.slice(0, s)
                }
                if (_(t)) {
                    n = t;
                    t = undefined
                } else if (t && typeof t === "object") {
                    r = "POST"
                }
                if (a.length > 0) {
                    S.ajax({
                        url: e,
                        type: r || "GET",
                        dataType: "html",
                        data: t
                    }).done(function (e) {
                        o = arguments;
                        a.html(i ? S("<div>").append(S.parseHTML(e)).find(i) : e)
                    }).always(n && function (e, t) {
                        a.each(function () {
                            n.apply(this, o || [e.responseText, t, e])
                        })
                    })
                }
                return this
            };
            S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
                S.fn[t] = function (e) {
                    return this.on(t, e)
                }
            });
            S.expr.pseudos.animated = function (t) {
                return S.grep(S.timers, function (e) {
                    return t === e.elem
                }).length
            };
            S.offset = {
                setOffset: function (e, t, n) {
                    var i, r, o, a, s, l, u, c = S.css(e, "position"),
                        f = S(e),
                        p = {};
                    if (c === "static") {
                        e.style.position = "relative"
                    }
                    s = f.offset();
                    o = S.css(e, "top");
                    l = S.css(e, "left");
                    u = (c === "absolute" || c === "fixed") && (o + l).indexOf("auto") > -1;
                    if (u) {
                        i = f.position();
                        a = i.top;
                        r = i.left
                    } else {
                        a = parseFloat(o) || 0;
                        r = parseFloat(l) || 0
                    }
                    if (_(t)) {
                        t = t.call(e, n, S.extend({}, s))
                    }
                    if (t.top != null) {
                        p.top = t.top - s.top + a
                    }
                    if (t.left != null) {
                        p.left = t.left - s.left + r
                    }
                    if ("using" in t) {
                        t.using.call(e, p)
                    } else {
                        f.css(p)
                    }
                }
            };
            S.fn.extend({
                offset: function (t) {
                    if (arguments.length) {
                        return t === undefined ? this : this.each(function (e) {
                            S.offset.setOffset(this, t, e)
                        })
                    }
                    var e, n, i = this[0];
                    if (!i) {
                        return
                    }
                    if (!i.getClientRects().length) {
                        return {
                            top: 0,
                            left: 0
                        }
                    }
                    e = i.getBoundingClientRect();
                    n = i.ownerDocument.defaultView;
                    return {
                        top: e.top + n.pageYOffset,
                        left: e.left + n.pageXOffset
                    }
                },
                position: function () {
                    if (!this[0]) {
                        return
                    }
                    var e, t, n, i = this[0],
                        r = {
                            top: 0,
                            left: 0
                        };
                    if (S.css(i, "position") === "fixed") {
                        t = i.getBoundingClientRect()
                    } else {
                        t = this.offset();
                        n = i.ownerDocument;
                        e = i.offsetParent || n.documentElement;
                        while (e && (e === n.body || e === n.documentElement) && S.css(e, "position") === "static") {
                            e = e.parentNode
                        }
                        if (e && e !== i && e.nodeType === 1) {
                            r = S(e).offset();
                            r.top += S.css(e, "borderTopWidth", true);
                            r.left += S.css(e, "borderLeftWidth", true)
                        }
                    }
                    return {
                        top: t.top - r.top - S.css(i, "marginTop", true),
                        left: t.left - r.left - S.css(i, "marginLeft", true)
                    }
                },
                offsetParent: function () {
                    return this.map(function () {
                        var e = this.offsetParent;
                        while (e && S.css(e, "position") === "static") {
                            e = e.offsetParent
                        }
                        return e || se
                    })
                }
            });
            S.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function (t, r) {
                var o = "pageYOffset" === r;
                S.fn[t] = function (e) {
                    return W(this, function (e, t, n) {
                        var i;
                        if (y(e)) {
                            i = e
                        } else if (e.nodeType === 9) {
                            i = e.defaultView
                        }
                        if (n === undefined) {
                            return i ? i[r] : e[t]
                        }
                        if (i) {
                            i.scrollTo(!o ? n : i.pageXOffset, o ? n : i.pageYOffset)
                        } else {
                            e[t] = n
                        }
                    }, t, e, arguments.length)
                }
            });
            S.each(["top", "left"], function (e, n) {
                S.cssHooks[n] = Ke(v.pixelPosition, function (e, t) {
                    if (t) {
                        t = Ve(e, n);
                        return Ge.test(t) ? S(e).position()[n] + "px" : t
                    }
                })
            });
            S.each({
                Height: "height",
                Width: "width"
            }, function (a, s) {
                S.each({
                    padding: "inner" + a,
                    content: s,
                    "": "outer" + a
                }, function (i, o) {
                    S.fn[o] = function (e, t) {
                        var n = arguments.length && (i || typeof e !== "boolean"),
                            r = i || (e === true || t === true ? "margin" : "border");
                        return W(this, function (e, t, n) {
                            var i;
                            if (y(e)) {
                                return o.indexOf("outer") === 0 ? e["inner" + a] : e.document.documentElement["client" + a]
                            }
                            if (e.nodeType === 9) {
                                i = e.documentElement;
                                return Math.max(e.body["scroll" + a], i["scroll" + a], e.body["offset" + a], i["offset" + a], i["client" + a])
                            }
                            return n === undefined ? S.css(e, t, r) : S.style(e, t, n, r)
                        }, s, n ? e : undefined, n)
                    }
                })
            });
            S.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function (e, n) {
                S.fn[n] = function (e, t) {
                    return arguments.length > 0 ? this.on(n, null, e, t) : this.trigger(n)
                }
            });
            S.fn.extend({
                hover: function (e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                }
            });
            S.fn.extend({
                bind: function (e, t, n) {
                    return this.on(e, null, t, n)
                },
                unbind: function (e, t) {
                    return this.off(e, null, t)
                },
                delegate: function (e, t, n, i) {
                    return this.on(t, e, n, i)
                },
                undelegate: function (e, t, n) {
                    return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
                }
            });
            S.proxy = function (e, t) {
                var n, i, r;
                if (typeof t === "string") {
                    n = e[t];
                    t = e;
                    e = n
                }
                if (!_(e)) {
                    return undefined
                }
                i = s.call(arguments, 2);
                r = function () {
                    return e.apply(t || this, i.concat(s.call(arguments)))
                };
                r.guid = e.guid = e.guid || S.guid++;
                return r
            };
            S.holdReady = function (e) {
                if (e) {
                    S.readyWait++
                } else {
                    S.ready(true)
                }
            };
            S.isArray = Array.isArray;
            S.parseJSON = JSON.parse;
            S.nodeName = A;
            S.isFunction = _;
            S.isWindow = y;
            S.camelCase = z;
            S.type = x;
            S.now = Date.now;
            S.isNumeric = function (e) {
                var t = S.type(e);
                return (t === "number" || t === "string") && !isNaN(e - parseFloat(e))
            };
            if (typeof define === "function" && define.amd) {
                define("jquery", [], function () {
                    return S
                })
            }
            var rn = E.jQuery,
                on = E.$;
            S.noConflict = function (e) {
                if (E.$ === S) {
                    E.$ = on
                }
                if (e && E.jQuery === S) {
                    E.jQuery = rn
                }
                return S
            };
            if (!e) {
                E.jQuery = E.$ = S
            }
            return S
        })
    }, {}],
    38: [function (e, r, o) {
        (function (e) {
            var t;
            if (typeof define === "function" && define.amd) {
                define(e);
                t = true
            }
            if (typeof o === "object") {
                r.exports = e();
                t = true
            }
            if (!t) {
                var n = window.Cookies;
                var i = window.Cookies = e();
                i.noConflict = function () {
                    window.Cookies = n;
                    return i
                }
            }
        })(function () {
            function s() {
                var e = 0;
                var t = {};
                for (; e < arguments.length; e++) {
                    var n = arguments[e];
                    for (var i in n) {
                        t[i] = n[i]
                    }
                }
                return t
            }

            function u(e) {
                return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
            }

            function e(l) {
                function a() {}

                function n(e, t, n) {
                    if (typeof document === "undefined") {
                        return
                    }
                    n = s({
                        path: "/"
                    }, a.defaults, n);
                    if (typeof n.expires === "number") {
                        n.expires = new Date(new Date * 1 + n.expires * 864e5)
                    }
                    n.expires = n.expires ? n.expires.toUTCString() : "";
                    try {
                        var i = JSON.stringify(t);
                        if (/^[\{\[]/.test(i)) {
                            t = i
                        }
                    } catch (e) {}
                    t = l.write ? l.write(t, e) : encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                    e = encodeURIComponent(String(e)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                    var r = "";
                    for (var o in n) {
                        if (!n[o]) {
                            continue
                        }
                        r += "; " + o;
                        if (n[o] === true) {
                            continue
                        }
                        r += "=" + n[o].split(";")[0]
                    }
                    return document.cookie = e + "=" + t + r
                }

                function t(e, t) {
                    if (typeof document === "undefined") {
                        return
                    }
                    var n = {};
                    var i = document.cookie ? document.cookie.split("; ") : [];
                    var r = 0;
                    for (; r < i.length; r++) {
                        var o = i[r].split("=");
                        var a = o.slice(1).join("=");
                        if (!t && a.charAt(0) === '"') {
                            a = a.slice(1, -1)
                        }
                        try {
                            var s = u(o[0]);
                            a = (l.read || l)(a, s) || u(a);
                            if (t) {
                                try {
                                    a = JSON.parse(a)
                                } catch (e) {}
                            }
                            n[s] = a;
                            if (e === s) {
                                break
                            }
                        } catch (e) {}
                    }
                    return e ? n[e] : n
                }
                a.set = n;
                a.get = function (e) {
                    return t(e, false)
                };
                a.getJSON = function (e) {
                    return t(e, true)
                };
                a.remove = function (e, t) {
                    n(e, "", s(t, {
                        expires: -1
                    }))
                };
                a.defaults = {};
                a.withConverter = e;
                return a
            }
            return e(function () {})
        })
    }, {}],
    39: [function (e, t, n) {
        var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        function l(e) {
            this.message = e
        }
        l.prototype = new Error;
        l.prototype.name = "InvalidCharacterError";

        function i(e) {
            var t = String(e).replace(/=+$/, "");
            if (t.length % 4 == 1) {
                throw new l("'atob' failed: The string to be decoded is not correctly encoded.")
            }
            for (var n = 0, i, r, o = 0, a = ""; r = t.charAt(o++); ~r && (i = n % 4 ? i * 64 + r : r, n++ % 4) ? a += String.fromCharCode(255 & i >> (-2 * n & 6)) : 0) {
                r = s.indexOf(r)
            }
            return a
        }
        t.exports = typeof window !== "undefined" && window.atob && window.atob.bind(window) || i
    }, {}],
    40: [function (e, t, n) {
        var i = e("./atob");

        function r(e) {
            return decodeURIComponent(i(e).replace(/(.)/g, function (e, t) {
                var n = t.charCodeAt(0).toString(16).toUpperCase();
                if (n.length < 2) {
                    n = "0" + n
                }
                return "%" + n
            }))
        }
        t.exports = function (e) {
            var t = e.replace(/-/g, "+").replace(/_/g, "/");
            switch (t.length % 4) {
                case 0:
                    break;
                case 2:
                    t += "==";
                    break;
                case 3:
                    t += "=";
                    break;
                default:
                    throw "Illegal base64url string!"
            }
            try {
                return r(t)
            } catch (e) {
                return i(t)
            }
        }
    }, {
        "./atob": 39
    }],
    41: [function (e, t, n) {
        "use strict";
        var i = e("./base64_url_decode");

        function r(e) {
            this.message = e
        }
        r.prototype = new Error;
        r.prototype.name = "InvalidTokenError";
        t.exports = function (e, t) {
            if (typeof e !== "string") {
                throw new r("Invalid token specified")
            }
            t = t || {};
            var n = t.header === true ? 0 : 1;
            try {
                return JSON.parse(i(e.split(".")[n]))
            } catch (e) {
                throw new r("Invalid token specified: " + e.message)
            }
        };
        t.exports.InvalidTokenError = r
    }, {
        "./base64_url_decode": 40
    }],
    42: [function (e, t, n) {
        "use strict";
        var s = {
            DEBUG: false,
            LIB_VERSION: "2.35.0"
        };
        var r;
        if (typeof window === "undefined") {
            var i = {
                hostname: ""
            };
            r = {
                navigator: {
                    userAgent: ""
                },
                document: {
                    location: i,
                    referrer: ""
                },
                screen: {
                    width: 0,
                    height: 0
                },
                location: i
            }
        } else {
            r = window
        }
        var o = Array.prototype;
        var a = Function.prototype;
        var l = Object.prototype;
        var u = o.slice;
        var d = l.toString;
        var h = l.hasOwnProperty;
        var c = r.console;
        var f = r.navigator;
        var E = r.document;
        var p = r.opera;
        var g = r.screen;
        var m = f.userAgent;
        var v = a.bind;
        var _ = o.forEach;
        var y = o.indexOf;
        var b = Array.isArray;
        var x = {};
        var k = {
            trim: function (e) {
                return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
            }
        };
        var w = {
            log: function () {
                if (s.DEBUG && !k.isUndefined(c) && c) {
                    try {
                        c.log.apply(c, arguments)
                    } catch (e) {
                        k.each(arguments, function (e) {
                            c.log(e)
                        })
                    }
                }
            },
            error: function () {
                if (s.DEBUG && !k.isUndefined(c) && c) {
                    var t = ["Mixpanel error:"].concat(k.toArray(arguments));
                    try {
                        c.error.apply(c, t)
                    } catch (e) {
                        k.each(t, function (e) {
                            c.error(e)
                        })
                    }
                }
            },
            critical: function () {
                if (!k.isUndefined(c) && c) {
                    var t = ["Mixpanel error:"].concat(k.toArray(arguments));
                    try {
                        c.error.apply(c, t)
                    } catch (e) {
                        k.each(t, function (e) {
                            c.error(e)
                        })
                    }
                }
            }
        };
        k.bind = function (i, r) {
            var o, a;
            if (v && i.bind === v) {
                return v.apply(i, u.call(arguments, 1))
            }
            if (!k.isFunction(i)) {
                throw new TypeError
            }
            o = u.call(arguments, 2);
            a = function () {
                if (!(this instanceof a)) {
                    return i.apply(r, o.concat(u.call(arguments)))
                }
                var e = {};
                e.prototype = i.prototype;
                var t = new e;
                e.prototype = null;
                var n = i.apply(t, o.concat(u.call(arguments)));
                if (Object(n) === n) {
                    return n
                }
                return t
            };
            return a
        };
        k.bind_instance_methods = function (e) {
            for (var t in e) {
                if (typeof e[t] === "function") {
                    e[t] = k.bind(e[t], e)
                }
            }
        };
        k.each = function (e, t, n) {
            if (e === null || e === undefined) {
                return
            }
            if (_ && e.forEach === _) {
                e.forEach(t, n)
            } else if (e.length === +e.length) {
                for (var i = 0, r = e.length; i < r; i++) {
                    if (i in e && t.call(n, e[i], i, e) === x) {
                        return
                    }
                }
            } else {
                for (var o in e) {
                    if (h.call(e, o)) {
                        if (t.call(n, e[o], o, e) === x) {
                            return
                        }
                    }
                }
            }
        };
        k.escapeHTML = function (e) {
            var t = e;
            if (t && k.isString(t)) {
                t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            }
            return t
        };
        k.extend = function (n) {
            k.each(u.call(arguments, 1), function (e) {
                for (var t in e) {
                    if (e[t] !== void 0) {
                        n[t] = e[t]
                    }
                }
            });
            return n
        };
        k.isArray = b || function (e) {
            return d.call(e) === "[object Array]"
        };
        k.isFunction = function (e) {
            try {
                return /^\s*\bfunction\b/.test(e)
            } catch (e) {
                return false
            }
        };
        k.isArguments = function (e) {
            return !!(e && h.call(e, "callee"))
        };
        k.toArray = function (e) {
            if (!e) {
                return []
            }
            if (e.toArray) {
                return e.toArray()
            }
            if (k.isArray(e)) {
                return u.call(e)
            }
            if (k.isArguments(e)) {
                return u.call(e)
            }
            return k.values(e)
        };
        k.keys = function (e) {
            var n = [];
            if (e === null) {
                return n
            }
            k.each(e, function (e, t) {
                n[n.length] = t
            });
            return n
        };
        k.values = function (e) {
            var t = [];
            if (e === null) {
                return t
            }
            k.each(e, function (e) {
                t[t.length] = e
            });
            return t
        };
        k.identity = function (e) {
            return e
        };
        k.include = function (e, t) {
            var n = false;
            if (e === null) {
                return n
            }
            if (y && e.indexOf === y) {
                return e.indexOf(t) != -1
            }
            k.each(e, function (e) {
                if (n || (n = e === t)) {
                    return x
                }
            });
            return n
        };
        k.includes = function (e, t) {
            return e.indexOf(t) !== -1
        };
        k.inherit = function (e, t) {
            e.prototype = new t;
            e.prototype.constructor = e;
            e.superclass = t.prototype;
            return e
        };
        k.isObject = function (e) {
            return e === Object(e) && !k.isArray(e)
        };
        k.isEmptyObject = function (e) {
            if (k.isObject(e)) {
                for (var t in e) {
                    if (h.call(e, t)) {
                        return false
                    }
                }
                return true
            }
            return false
        };
        k.isUndefined = function (e) {
            return e === void 0
        };
        k.isString = function (e) {
            return d.call(e) == "[object String]"
        };
        k.isDate = function (e) {
            return d.call(e) == "[object Date]"
        };
        k.isNumber = function (e) {
            return d.call(e) == "[object Number]"
        };
        k.isElement = function (e) {
            return !!(e && e.nodeType === 1)
        };
        k.encodeDates = function (n) {
            k.each(n, function (e, t) {
                if (k.isDate(e)) {
                    n[t] = k.formatDate(e)
                } else if (k.isObject(e)) {
                    n[t] = k.encodeDates(e)
                }
            });
            return n
        };
        k.timestamp = function () {
            Date.now = Date.now || function () {
                return +new Date
            };
            return Date.now()
        };
        k.formatDate = function (e) {
            function t(e) {
                return e < 10 ? "0" + e : e
            }
            return e.getUTCFullYear() + "-" + t(e.getUTCMonth() + 1) + "-" + t(e.getUTCDate()) + "T" + t(e.getUTCHours()) + ":" + t(e.getUTCMinutes()) + ":" + t(e.getUTCSeconds())
        };
        k.safewrap = function (e) {
            return function () {
                try {
                    return e.apply(this, arguments)
                } catch (e) {
                    w.critical("Implementation error. Please turn on debug and contact support@mixpanel.com.");
                    if (s.DEBUG) {
                        w.critical(e)
                    }
                }
            }
        };
        k.safewrap_class = function (e, t) {
            for (var n = 0; n < t.length; n++) {
                e.prototype[t[n]] = k.safewrap(e.prototype[t[n]])
            }
        };
        k.safewrap_instance_methods = function (e) {
            for (var t in e) {
                if (typeof e[t] === "function") {
                    e[t] = k.safewrap(e[t])
                }
            }
        };
        k.strip_empty_properties = function (e) {
            var n = {};
            k.each(e, function (e, t) {
                if (k.isString(e) && e.length > 0) {
                    n[t] = e
                }
            });
            return n
        };
        k.truncate = function (e, n) {
            var i;
            if (typeof e === "string") {
                i = e.slice(0, n)
            } else if (k.isArray(e)) {
                i = [];
                k.each(e, function (e) {
                    i.push(k.truncate(e, n))
                })
            } else if (k.isObject(e)) {
                i = {};
                k.each(e, function (e, t) {
                    i[t] = k.truncate(e, n)
                })
            } else {
                i = e
            }
            return i
        };
        k.JSONEncode = function () {
            return function (e) {
                var t = e;
                var f = function (e) {
                    var t = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                    var n = {
                        "\b": "\\b",
                        "\t": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "\\": "\\\\"
                    };
                    t.lastIndex = 0;
                    return t.test(e) ? '"' + e.replace(t, function (e) {
                        var t = n[e];
                        return typeof t === "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                    }) + '"' : '"' + e + '"'
                };
                var p = function (e, t) {
                    var n = "";
                    var i = "    ";
                    var r = 0;
                    var o = "";
                    var a = "";
                    var s = 0;
                    var l = n;
                    var u = [];
                    var c = t[e];
                    if (c && typeof c === "object" && typeof c.toJSON === "function") {
                        c = c.toJSON(e)
                    }
                    switch (typeof c) {
                        case "string":
                            return f(c);
                        case "number":
                            return isFinite(c) ? String(c) : "null";
                        case "boolean":
                        case "null":
                            return String(c);
                        case "object":
                            if (!c) {
                                return "null"
                            }
                            n += i;
                            u = [];
                            if (d.apply(c) === "[object Array]") {
                                s = c.length;
                                for (r = 0; r < s; r += 1) {
                                    u[r] = p(r, c) || "null"
                                }
                                a = u.length === 0 ? "[]" : n ? "[\n" + n + u.join(",\n" + n) + "\n" + l + "]" : "[" + u.join(",") + "]";
                                n = l;
                                return a
                            }
                            for (o in c) {
                                if (h.call(c, o)) {
                                    a = p(o, c);
                                    if (a) {
                                        u.push(f(o) + (n ? ": " : ":") + a)
                                    }
                                }
                            }
                            a = u.length === 0 ? "{}" : n ? "{" + u.join(",") + "" + l + "}" : "{" + u.join(",") + "}";
                            n = l;
                            return a
                    }
                };
                return p("", {
                    "": t
                })
            }
        }();
        k.JSONDecode = function () {
            var n, r, o = {
                    '"': '"',
                    "\\": "\\",
                    "/": "/",
                    b: "\b",
                    f: "\f",
                    n: "\n",
                    r: "\r",
                    t: "\t"
                },
                i, a = function (e) {
                    var t = new SyntaxError(e);
                    t.at = n;
                    t.text = i;
                    throw t
                },
                s = function (e) {
                    if (e && e !== r) {
                        a("Expected '" + e + "' instead of '" + r + "'")
                    }
                    r = i.charAt(n);
                    n += 1;
                    return r
                },
                e = function () {
                    var e, t = "";
                    if (r === "-") {
                        t = "-";
                        s("-")
                    }
                    while (r >= "0" && r <= "9") {
                        t += r;
                        s()
                    }
                    if (r === ".") {
                        t += ".";
                        while (s() && r >= "0" && r <= "9") {
                            t += r
                        }
                    }
                    if (r === "e" || r === "E") {
                        t += r;
                        s();
                        if (r === "-" || r === "+") {
                            t += r;
                            s()
                        }
                        while (r >= "0" && r <= "9") {
                            t += r;
                            s()
                        }
                    }
                    e = +t;
                    if (!isFinite(e)) {
                        a("Bad number")
                    } else {
                        return e
                    }
                },
                l = function () {
                    var e, t, n = "",
                        i;
                    if (r === '"') {
                        while (s()) {
                            if (r === '"') {
                                s();
                                return n
                            }
                            if (r === "\\") {
                                s();
                                if (r === "u") {
                                    i = 0;
                                    for (t = 0; t < 4; t += 1) {
                                        e = parseInt(s(), 16);
                                        if (!isFinite(e)) {
                                            break
                                        }
                                        i = i * 16 + e
                                    }
                                    n += String.fromCharCode(i)
                                } else if (typeof o[r] === "string") {
                                    n += o[r]
                                } else {
                                    break
                                }
                            } else {
                                n += r
                            }
                        }
                    }
                    a("Bad string")
                },
                u = function () {
                    while (r && r <= " ") {
                        s()
                    }
                },
                t = function () {
                    switch (r) {
                        case "t":
                            s("t");
                            s("r");
                            s("u");
                            s("e");
                            return true;
                        case "f":
                            s("f");
                            s("a");
                            s("l");
                            s("s");
                            s("e");
                            return false;
                        case "n":
                            s("n");
                            s("u");
                            s("l");
                            s("l");
                            return null
                    }
                    a('Unexpected "' + r + '"')
                },
                c, f = function () {
                    var e = [];
                    if (r === "[") {
                        s("[");
                        u();
                        if (r === "]") {
                            s("]");
                            return e
                        }
                        while (r) {
                            e.push(c());
                            u();
                            if (r === "]") {
                                s("]");
                                return e
                            }
                            s(",");
                            u()
                        }
                    }
                    a("Bad array")
                },
                p = function () {
                    var e, t = {};
                    if (r === "{") {
                        s("{");
                        u();
                        if (r === "}") {
                            s("}");
                            return t
                        }
                        while (r) {
                            e = l();
                            u();
                            s(":");
                            if (Object.hasOwnProperty.call(t, e)) {
                                a('Duplicate key "' + e + '"')
                            }
                            t[e] = c();
                            u();
                            if (r === "}") {
                                s("}");
                                return t
                            }
                            s(",");
                            u()
                        }
                    }
                    a("Bad object")
                };
            c = function () {
                u();
                switch (r) {
                    case "{":
                        return p();
                    case "[":
                        return f();
                    case '"':
                        return l();
                    case "-":
                        return e();
                    default:
                        return r >= "0" && r <= "9" ? e() : t()
                }
            };
            return function (e) {
                var t;
                i = e;
                n = 0;
                r = " ";
                t = c();
                u();
                if (r) {
                    a("Syntax error")
                }
                return t
            }
        }();
        k.base64Encode = function (e) {
            var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var n, i, r, o, a, s, l, u, c = 0,
                f = 0,
                p = "",
                d = [];
            if (!e) {
                return e
            }
            e = k.utf8Encode(e);
            do {
                n = e.charCodeAt(c++);
                i = e.charCodeAt(c++);
                r = e.charCodeAt(c++);
                u = n << 16 | i << 8 | r;
                o = u >> 18 & 63;
                a = u >> 12 & 63;
                s = u >> 6 & 63;
                l = u & 63;
                d[f++] = t.charAt(o) + t.charAt(a) + t.charAt(s) + t.charAt(l)
            } while (c < e.length);
            p = d.join("");
            switch (e.length % 3) {
                case 1:
                    p = p.slice(0, -2) + "==";
                    break;
                case 2:
                    p = p.slice(0, -1) + "=";
                    break
            }
            return p
        };
        k.utf8Encode = function (e) {
            e = (e + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            var t = "",
                n, i;
            var r = 0,
                o;
            n = i = 0;
            r = e.length;
            for (o = 0; o < r; o++) {
                var a = e.charCodeAt(o);
                var s = null;
                if (a < 128) {
                    i++
                } else if (a > 127 && a < 2048) {
                    s = String.fromCharCode(a >> 6 | 192, a & 63 | 128)
                } else {
                    s = String.fromCharCode(a >> 12 | 224, a >> 6 & 63 | 128, a & 63 | 128)
                }
                if (s !== null) {
                    if (i > n) {
                        t += e.substring(n, i)
                    }
                    t += s;
                    n = i = o + 1
                }
            }
            if (i > n) {
                t += e.substring(n, e.length)
            }
            return t
        };
        k.UUID = function () {
            var t = function () {
                var e = 1 * new Date,
                    t = 0;
                while (e == 1 * new Date) {
                    t++
                }
                return e.toString(16) + t.toString(16)
            };
            var n = function () {
                return Math.random().toString(16).replace(".", "")
            };
            var i = function () {
                var e = m,
                    t, n, r = [],
                    i = 0;

                function o(e, t) {
                    var n, i = 0;
                    for (n = 0; n < t.length; n++) {
                        i |= r[n] << n * 8
                    }
                    return e ^ i
                }
                for (t = 0; t < e.length; t++) {
                    n = e.charCodeAt(t);
                    r.unshift(n & 255);
                    if (r.length >= 4) {
                        i = o(i, r);
                        r = []
                    }
                }
                if (r.length > 0) {
                    i = o(i, r)
                }
                return i.toString(16)
            };
            return function () {
                var e = (g.height * g.width).toString(16);
                return t() + "-" + n() + "-" + i() + "-" + e + "-" + t()
            }
        }();
        k.isBlockedUA = function (e) {
            if (/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(e)) {
                return true
            }
            return false
        };
        k.HTTPBuildQuery = function (e, t) {
            var n, i, r = [];
            if (k.isUndefined(t)) {
                t = "&"
            }
            k.each(e, function (e, t) {
                n = encodeURIComponent(e.toString());
                i = encodeURIComponent(t);
                r[r.length] = i + "=" + n
            });
            return r.join(t)
        };
        k.getQueryParam = function (e, t) {
            t = t.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
            var n = "[\\?&]" + t + "=([^&#]*)",
                i = new RegExp(n),
                r = i.exec(e);
            if (r === null || r && typeof r[1] !== "string" && r[1].length) {
                return ""
            } else {
                var o = r[1];
                try {
                    o = decodeURIComponent(o)
                } catch (e) {
                    w.error("Skipping decoding for malformed query param: " + o)
                }
                return o.replace(/\+/g, " ")
            }
        };
        k.getHashParam = function (e, t) {
            var n = e.match(new RegExp(t + "=([^&]*)"));
            return n ? n[1] : null
        };
        k.cookie = {
            get: function (e) {
                var t = e + "=";
                var n = E.cookie.split(";");
                for (var i = 0; i < n.length; i++) {
                    var r = n[i];
                    while (r.charAt(0) == " ") {
                        r = r.substring(1, r.length)
                    }
                    if (r.indexOf(t) === 0) {
                        return decodeURIComponent(r.substring(t.length, r.length))
                    }
                }
                return null
            },
            parse: function (e) {
                var t;
                try {
                    t = k.JSONDecode(k.cookie.get(e)) || {}
                } catch (e) {}
                return t
            },
            set_seconds: function (e, t, n, i, r, o, a) {
                var s = "",
                    l = "",
                    u = "";
                if (a) {
                    s = "; domain=" + a
                } else if (i) {
                    var c = C(E.location.hostname);
                    s = c ? "; domain=." + c : ""
                }
                if (n) {
                    var f = new Date;
                    f.setTime(f.getTime() + n * 1e3);
                    l = "; expires=" + f.toGMTString()
                }
                if (o) {
                    r = true;
                    u = "; SameSite=None"
                }
                if (r) {
                    u += "; secure"
                }
                E.cookie = e + "=" + encodeURIComponent(t) + l + "; path=/" + s + u
            },
            set: function (e, t, n, i, r, o, a) {
                var s = "",
                    l = "",
                    u = "";
                if (a) {
                    s = "; domain=" + a
                } else if (i) {
                    var c = C(E.location.hostname);
                    s = c ? "; domain=." + c : ""
                }
                if (n) {
                    var f = new Date;
                    f.setTime(f.getTime() + n * 24 * 60 * 60 * 1e3);
                    l = "; expires=" + f.toGMTString()
                }
                if (o) {
                    r = true;
                    u = "; SameSite=None"
                }
                if (r) {
                    u += "; secure"
                }
                var p = e + "=" + encodeURIComponent(t) + l + "; path=/" + s + u;
                E.cookie = p;
                return p
            },
            remove: function (e, t, n) {
                k.cookie.set(e, "", -1, t, false, false, n)
            }
        };
        var S = null;
        k.localStorage = {
            is_supported: function () {
                if (S !== null) {
                    return S
                }
                var t = true;
                try {
                    var e = "__mplssupport__",
                        n = "xyz";
                    k.localStorage.set(e, n);
                    if (k.localStorage.get(e) !== n) {
                        t = false
                    }
                    k.localStorage.remove(e)
                } catch (e) {
                    t = false
                }
                if (!t) {
                    w.error("localStorage unsupported; falling back to cookie store")
                }
                S = t;
                return t
            },
            error: function (e) {
                w.error("localStorage error: " + e)
            },
            get: function (e) {
                try {
                    return window.localStorage.getItem(e)
                } catch (e) {
                    k.localStorage.error(e)
                }
                return null
            },
            parse: function (e) {
                try {
                    return k.JSONDecode(k.localStorage.get(e)) || {}
                } catch (e) {}
                return null
            },
            set: function (e, t) {
                try {
                    window.localStorage.setItem(e, t)
                } catch (e) {
                    k.localStorage.error(e)
                }
            },
            remove: function (e) {
                try {
                    window.localStorage.removeItem(e)
                } catch (e) {
                    k.localStorage.error(e)
                }
            }
        };
        k.register_event = function () {
            var e = function (e, t, n, i, r) {
                if (!e) {
                    w.error("No valid element provided to register_event");
                    return
                }
                if (e.addEventListener && !i) {
                    e.addEventListener(t, n, !!r)
                } else {
                    var o = "on" + t;
                    var a = e[o];
                    e[o] = s(e, n, a)
                }
            };

            function s(r, o, a) {
                var e = function (e) {
                    e = e || l(window.event);
                    if (!e) {
                        return undefined
                    }
                    var t = true;
                    var n, i;
                    if (k.isFunction(a)) {
                        n = a(e)
                    }
                    i = o.call(r, e);
                    if (false === n || false === i) {
                        t = false
                    }
                    return t
                };
                return e
            }

            function l(e) {
                if (e) {
                    e.preventDefault = l.preventDefault;
                    e.stopPropagation = l.stopPropagation
                }
                return e
            }
            l.preventDefault = function () {
                this.returnValue = false
            };
            l.stopPropagation = function () {
                this.cancelBubble = true
            };
            return e
        }();
        var T = new RegExp('^(\\w*)\\[(\\w+)([=~\\|\\^\\$\\*]?)=?"?([^\\]"]*)"?\\]$');
        k.dom_query = function () {
            function x(e) {
                return e.all ? e.all : e.getElementsByTagName("*")
            }
            var i = /[\t\r\n]/g;

            function w(e, t) {
                var n = " " + t + " ";
                return (" " + e.className + " ").replace(i, " ").indexOf(n) >= 0
            }

            function t(e) {
                if (!E.getElementsByTagName) {
                    return []
                }
                var t = e.split(" ");
                var n, i, r, o, a, s, l, u, c, f;
                var p = [E];
                for (s = 0; s < t.length; s++) {
                    n = t[s].replace(/^\s+/, "").replace(/\s+$/, "");
                    if (n.indexOf("#") > -1) {
                        i = n.split("#");
                        r = i[0];
                        var d = i[1];
                        var h = E.getElementById(d);
                        if (!h || r && h.nodeName.toLowerCase() != r) {
                            return []
                        }
                        p = [h];
                        continue
                    }
                    if (n.indexOf(".") > -1) {
                        i = n.split(".");
                        r = i[0];
                        var g = i[1];
                        if (!r) {
                            r = "*"
                        }
                        o = [];
                        a = 0;
                        for (l = 0; l < p.length; l++) {
                            if (r == "*") {
                                c = x(p[l])
                            } else {
                                c = p[l].getElementsByTagName(r)
                            }
                            for (u = 0; u < c.length; u++) {
                                o[a++] = c[u]
                            }
                        }
                        p = [];
                        f = 0;
                        for (l = 0; l < o.length; l++) {
                            if (o[l].className && k.isString(o[l].className) && w(o[l], g)) {
                                p[f++] = o[l]
                            }
                        }
                        continue
                    }
                    var m = n.match(T);
                    if (m) {
                        r = m[1];
                        var v = m[2];
                        var _ = m[3];
                        var y = m[4];
                        if (!r) {
                            r = "*"
                        }
                        o = [];
                        a = 0;
                        for (l = 0; l < p.length; l++) {
                            if (r == "*") {
                                c = x(p[l])
                            } else {
                                c = p[l].getElementsByTagName(r)
                            }
                            for (u = 0; u < c.length; u++) {
                                o[a++] = c[u]
                            }
                        }
                        p = [];
                        f = 0;
                        var b;
                        switch (_) {
                            case "=":
                                b = function (e) {
                                    return e.getAttribute(v) == y
                                };
                                break;
                            case "~":
                                b = function (e) {
                                    return e.getAttribute(v).match(new RegExp("\\b" + y + "\\b"))
                                };
                                break;
                            case "|":
                                b = function (e) {
                                    return e.getAttribute(v).match(new RegExp("^" + y + "-?"))
                                };
                                break;
                            case "^":
                                b = function (e) {
                                    return e.getAttribute(v).indexOf(y) === 0
                                };
                                break;
                            case "$":
                                b = function (e) {
                                    return e.getAttribute(v).lastIndexOf(y) == e.getAttribute(v).length - y.length
                                };
                                break;
                            case "*":
                                b = function (e) {
                                    return e.getAttribute(v).indexOf(y) > -1
                                };
                                break;
                            default:
                                b = function (e) {
                                    return e.getAttribute(v)
                                }
                        }
                        p = [];
                        f = 0;
                        for (l = 0; l < o.length; l++) {
                            if (b(o[l])) {
                                p[f++] = o[l]
                            }
                        }
                        continue
                    }
                    r = n;
                    o = [];
                    a = 0;
                    for (l = 0; l < p.length; l++) {
                        c = p[l].getElementsByTagName(r);
                        for (u = 0; u < c.length; u++) {
                            o[a++] = c[u]
                        }
                    }
                    p = o
                }
                return p
            }
            return function (e) {
                if (k.isElement(e)) {
                    return [e]
                } else if (k.isObject(e) && !k.isUndefined(e.length)) {
                    return e
                } else {
                    return t.call(this, e)
                }
            }
        }();
        k.info = {
            campaignParams: function () {
                var e = "utm_source utm_medium utm_campaign utm_content utm_term".split(" "),
                    t = "",
                    n = {};
                k.each(e, function (e) {
                    t = k.getQueryParam(E.URL, e);
                    if (t.length) {
                        n[e] = t
                    }
                });
                return n
            },
            searchEngine: function (e) {
                if (e.search("https?://(.*)google.([^/?]*)") === 0) {
                    return "google"
                } else if (e.search("https?://(.*)bing.com") === 0) {
                    return "bing"
                } else if (e.search("https?://(.*)yahoo.com") === 0) {
                    return "yahoo"
                } else if (e.search("https?://(.*)duckduckgo.com") === 0) {
                    return "duckduckgo"
                } else {
                    return null
                }
            },
            searchInfo: function (e) {
                var t = k.info.searchEngine(e),
                    n = t != "yahoo" ? "q" : "p",
                    i = {};
                if (t !== null) {
                    i["$search_engine"] = t;
                    var r = k.getQueryParam(e, n);
                    if (r.length) {
                        i["mp_keyword"] = r
                    }
                }
                return i
            },
            browser: function (e, t, n) {
                t = t || "";
                if (n || k.includes(e, " OPR/")) {
                    if (k.includes(e, "Mini")) {
                        return "Opera Mini"
                    }
                    return "Opera"
                } else if (/(BlackBerry|PlayBook|BB10)/i.test(e)) {
                    return "BlackBerry"
                } else if (k.includes(e, "IEMobile") || k.includes(e, "WPDesktop")) {
                    return "Internet Explorer Mobile"
                } else if (k.includes(e, "SamsungBrowser/")) {
                    return "Samsung Internet"
                } else if (k.includes(e, "Edge") || k.includes(e, "Edg/")) {
                    return "Microsoft Edge"
                } else if (k.includes(e, "FBIOS")) {
                    return "Facebook Mobile"
                } else if (k.includes(e, "Chrome")) {
                    return "Chrome"
                } else if (k.includes(e, "CriOS")) {
                    return "Chrome iOS"
                } else if (k.includes(e, "UCWEB") || k.includes(e, "UCBrowser")) {
                    return "UC Browser"
                } else if (k.includes(e, "FxiOS")) {
                    return "Firefox iOS"
                } else if (k.includes(t, "Apple")) {
                    if (k.includes(e, "Mobile")) {
                        return "Mobile Safari"
                    }
                    return "Safari"
                } else if (k.includes(e, "Android")) {
                    return "Android Mobile"
                } else if (k.includes(e, "Konqueror")) {
                    return "Konqueror"
                } else if (k.includes(e, "Firefox")) {
                    return "Firefox"
                } else if (k.includes(e, "MSIE") || k.includes(e, "Trident/")) {
                    return "Internet Explorer"
                } else if (k.includes(e, "Gecko")) {
                    return "Mozilla"
                } else {
                    return ""
                }
            },
            browserVersion: function (e, t, n) {
                var i = k.info.browser(e, t, n);
                var r = {
                    "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
                    "Microsoft Edge": /Edge?\/(\d+(\.\d+)?)/,
                    Chrome: /Chrome\/(\d+(\.\d+)?)/,
                    "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
                    "UC Browser": /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
                    Safari: /Version\/(\d+(\.\d+)?)/,
                    "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
                    Opera: /(Opera|OPR)\/(\d+(\.\d+)?)/,
                    Firefox: /Firefox\/(\d+(\.\d+)?)/,
                    "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
                    Konqueror: /Konqueror:(\d+(\.\d+)?)/,
                    BlackBerry: /BlackBerry (\d+(\.\d+)?)/,
                    "Android Mobile": /android\s(\d+(\.\d+)?)/,
                    "Samsung Internet": /SamsungBrowser\/(\d+(\.\d+)?)/,
                    "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
                    Mozilla: /rv:(\d+(\.\d+)?)/
                };
                var o = r[i];
                if (o === undefined) {
                    return null
                }
                var a = e.match(o);
                if (!a) {
                    return null
                }
                return parseFloat(a[a.length - 2])
            },
            os: function () {
                var e = m;
                if (/Windows/i.test(e)) {
                    if (/Phone/.test(e) || /WPDesktop/.test(e)) {
                        return "Windows Phone"
                    }
                    return "Windows"
                } else if (/(iPhone|iPad|iPod)/.test(e)) {
                    return "iOS"
                } else if (/Android/.test(e)) {
                    return "Android"
                } else if (/(BlackBerry|PlayBook|BB10)/i.test(e)) {
                    return "BlackBerry"
                } else if (/Mac/i.test(e)) {
                    return "Mac OS X"
                } else if (/Linux/.test(e)) {
                    return "Linux"
                } else if (/CrOS/.test(e)) {
                    return "Chrome OS"
                } else {
                    return ""
                }
            },
            device: function (e) {
                if (/Windows Phone/i.test(e) || /WPDesktop/.test(e)) {
                    return "Windows Phone"
                } else if (/iPad/.test(e)) {
                    return "iPad"
                } else if (/iPod/.test(e)) {
                    return "iPod Touch"
                } else if (/iPhone/.test(e)) {
                    return "iPhone"
                } else if (/(BlackBerry|PlayBook|BB10)/i.test(e)) {
                    return "BlackBerry"
                } else if (/Android/.test(e)) {
                    return "Android"
                } else {
                    return ""
                }
            },
            referringDomain: function (e) {
                var t = e.split("/");
                if (t.length >= 3) {
                    return t[2]
                }
                return ""
            },
            properties: function () {
                return k.extend(k.strip_empty_properties({
                    $os: k.info.os(),
                    $browser: k.info.browser(m, f.vendor, p),
                    $referrer: E.referrer,
                    $referring_domain: k.info.referringDomain(E.referrer),
                    $device: k.info.device(m)
                }), {
                    $current_url: r.location.href,
                    $browser_version: k.info.browserVersion(m, f.vendor, p),
                    $screen_height: g.height,
                    $screen_width: g.width,
                    mp_lib: "web",
                    $lib_version: s.LIB_VERSION,
                    $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
                    time: k.timestamp() / 1e3
                })
            },
            people_properties: function () {
                return k.extend(k.strip_empty_properties({
                    $os: k.info.os(),
                    $browser: k.info.browser(m, f.vendor, p)
                }), {
                    $browser_version: k.info.browserVersion(m, f.vendor, p)
                })
            },
            pageviewInfo: function (e) {
                return k.strip_empty_properties({
                    mp_page: e,
                    mp_referrer: E.referrer,
                    mp_browser: k.info.browser(m, f.vendor, p),
                    mp_platform: k.info.os()
                })
            }
        };
        var N = /[a-z0-9][a-z0-9-]*\.[a-z]+$/i;
        var A = /[a-z0-9][a-z0-9-]+\.[a-z.]{2,6}$/i;
        var C = function (e) {
            var t = A;
            var n = e.split(".");
            var i = n[n.length - 1];
            if (i.length > 4 || i === "com" || i === "org") {
                t = N
            }
            var r = e.match(t);
            return r ? r[0] : ""
        };
        k["toArray"] = k.toArray;
        k["isObject"] = k.isObject;
        k["JSONEncode"] = k.JSONEncode;
        k["JSONDecode"] = k.JSONDecode;
        k["isBlockedUA"] = k.isBlockedUA;
        k["isEmptyObject"] = k.isEmptyObject;
        k["info"] = k.info;
        k["info"]["device"] = k.info.device;
        k["info"]["browser"] = k.info.browser;
        k["info"]["browserVersion"] = k.info.browserVersion;
        k["info"]["properties"] = k.info.properties;

        function O(e) {
            switch (typeof e.className) {
                case "string":
                    return e.className;
                case "object":
                    return e.className.baseVal || e.getAttribute("class") || "";
                default:
                    return ""
            }
        }

        function I(e) {
            var t = "";
            if (M(e) && e.childNodes && e.childNodes.length) {
                k.each(e.childNodes, function (e) {
                    if (L(e) && e.textContent) {
                        t += k.trim(e.textContent).split(/(\s+)/).filter(j).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255)
                    }
                })
            }
            return k.trim(t)
        }

        function R(e) {
            return e && e.nodeType === 1
        }

        function P(e, t) {
            return e && e.tagName && e.tagName.toLowerCase() === t.toLowerCase()
        }

        function L(e) {
            return e && e.nodeType === 3
        }

        function D(e, t) {
            if (!e || P(e, "html") || !R(e)) {
                return false
            }
            var n = e.tagName.toLowerCase();
            switch (n) {
                case "html":
                    return false;
                case "form":
                    return t.type === "submit";
                case "input":
                    if (["button", "submit"].indexOf(e.getAttribute("type")) === -1) {
                        return t.type === "change"
                    } else {
                        return t.type === "click"
                    }
                    case "select":
                    case "textarea":
                        return t.type === "change";
                    default:
                        return t.type === "click"
            }
        }

        function M(e) {
            for (var t = e; t.parentNode && !P(t, "body"); t = t.parentNode) {
                var n = O(t).split(" ");
                if (k.includes(n, "mp-sensitive") || k.includes(n, "mp-no-track")) {
                    return false
                }
            }
            if (k.includes(O(e).split(" "), "mp-include")) {
                return true
            }
            if (P(e, "input") || P(e, "select") || P(e, "textarea") || e.getAttribute("contenteditable") === "true") {
                return false
            }
            var i = e.type || "";
            if (typeof i === "string") {
                switch (i.toLowerCase()) {
                    case "hidden":
                        return false;
                    case "password":
                        return false
                }
            }
            var r = e.name || e.id || "";
            if (typeof r === "string") {
                var o = /^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i;
                if (o.test(r.replace(/[^a-zA-Z0-9]/g, ""))) {
                    return false
                }
            }
            return true
        }

        function j(e) {
            if (e === null || k.isUndefined(e)) {
                return false
            }
            if (typeof e === "string") {
                e = k.trim(e);
                var t = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
                if (t.test((e || "").replace(/[- ]/g, ""))) {
                    return false
                }
                var n = /(^\d{3}-?\d{2}-?\d{4}$)/;
                if (n.test(e)) {
                    return false
                }
            }
            return true
        }
        var F = {
            _initializedTokens: [],
            _previousElementSibling: function (e) {
                if (e.previousElementSibling) {
                    return e.previousElementSibling
                } else {
                    do {
                        e = e.previousSibling
                    } while (e && !R(e));
                    return e
                }
            },
            _loadScript: function (e, t) {
                var n = document.createElement("script");
                n.type = "text/javascript";
                n.src = e;
                n.onload = t;
                var i = document.getElementsByTagName("script");
                if (i.length > 0) {
                    i[0].parentNode.insertBefore(n, i[0])
                } else {
                    document.body.appendChild(n)
                }
            },
            _getPropertiesFromElement: function (e) {
                var t = {
                    classes: O(e).split(" "),
                    tag_name: e.tagName.toLowerCase()
                };
                if (M(e)) {
                    k.each(e.attributes, function (e) {
                        if (j(e.value)) {
                            t["attr__" + e.name] = e.value
                        }
                    })
                }
                var n = 1;
                var i = 1;
                var r = e;
                while (r = this._previousElementSibling(r)) {
                    n++;
                    if (r.tagName === e.tagName) {
                        i++
                    }
                }
                t["nth_child"] = n;
                t["nth_of_type"] = i;
                return t
            },
            _getDefaultProperties: function (e) {
                return {
                    $event_type: e,
                    $ce_version: 1,
                    $host: window.location.host,
                    $pathname: window.location.pathname
                }
            },
            _extractCustomPropertyValue: function (e) {
                var n = [];
                k.each(document.querySelectorAll(e["css_selector"]), function (e) {
                    var t;
                    if (["input", "select"].indexOf(e.tagName.toLowerCase()) > -1) {
                        t = e["value"]
                    } else if (e["textContent"]) {
                        t = e["textContent"]
                    }
                    if (j(t)) {
                        n.push(t)
                    }
                });
                return n.join(", ")
            },
            _getCustomProperties: function (i) {
                var r = {};
                k.each(this._customProperties, function (n) {
                    k.each(n["event_selectors"], function (e) {
                        var t = document.querySelectorAll(e);
                        k.each(t, function (e) {
                            if (k.includes(i, e) && M(e)) {
                                r[n["name"]] = this._extractCustomPropertyValue(n)
                            }
                        }, this)
                    }, this)
                }, this);
                return r
            },
            _getEventTarget: function (e) {
                if (typeof e.target === "undefined") {
                    return e.srcElement
                } else {
                    return e.target
                }
            },
            _trackEvent: function (e, t) {
                var n = this._getEventTarget(e);
                if (L(n)) {
                    n = n.parentNode
                }
                if (D(n, e)) {
                    var i = [n];
                    var r = n;
                    while (r.parentNode && !P(r, "body")) {
                        i.push(r.parentNode);
                        r = r.parentNode
                    }
                    var o = [];
                    var a, s = false;
                    k.each(i, function (e) {
                        var t = M(e);
                        if (e.tagName.toLowerCase() === "a") {
                            a = e.getAttribute("href");
                            a = t && j(a) && a
                        }
                        var n = O(e).split(" ");
                        if (k.includes(n, "mp-no-track")) {
                            s = true
                        }
                        o.push(this._getPropertiesFromElement(e))
                    }, this);
                    if (s) {
                        return false
                    }
                    var l;
                    var u = I(n);
                    if (u && u.length) {
                        l = u
                    }
                    var c = k.extend(this._getDefaultProperties(e.type), {
                        $elements: o,
                        $el_attr__href: a,
                        $el_text: l
                    }, this._getCustomProperties(i));
                    t.track("$web_event", c);
                    return true
                }
            },
            _navigate: function (e) {
                window.location.href = e
            },
            _addDomEventHandlers: function (t) {
                var e = k.bind(function (e) {
                    e = e || window.event;
                    this._trackEvent(e, t)
                }, this);
                k.register_event(document, "submit", e, false, true);
                k.register_event(document, "change", e, false, true);
                k.register_event(document, "click", e, false, true)
            },
            _customProperties: {},
            init: function (t) {
                if (!(document && document.body)) {
                    console.log("document not ready yet, trying again in 500 milliseconds...");
                    var e = this;
                    setTimeout(function () {
                        e.init(t)
                    }, 500);
                    return
                }
                var n = t.get_config("token");
                if (this._initializedTokens.indexOf(n) > -1) {
                    console.log('autotrack already initialized for token "' + n + '"');
                    return
                }
                this._initializedTokens.push(n);
                if (!this._maybeLoadEditor(t)) {
                    var i = k.bind(function (e) {
                        if (e && e["config"] && e["config"]["enable_collect_everything"] === true) {
                            if (e["custom_properties"]) {
                                this._customProperties = e["custom_properties"]
                            }
                            t.track("$web_event", k.extend({
                                $title: document.title
                            }, this._getDefaultProperties("pageview")));
                            this._addDomEventHandlers(t)
                        } else {
                            t["__autotrack_enabled"] = false
                        }
                    }, this);
                    t._send_request(t.get_config("api_host") + "/decide/", {
                        verbose: true,
                        version: "1",
                        lib: "web",
                        token: n
                    }, {
                        method: "GET",
                        transport: "XHR"
                    }, t._prepare_callback(i))
                }
            },
            _editorParamsFromHash: function (e, t) {
                var n;
                try {
                    var i = k.getHashParam(t, "state");
                    i = JSON.parse(decodeURIComponent(i));
                    var r = k.getHashParam(t, "expires_in");
                    n = {
                        accessToken: k.getHashParam(t, "access_token"),
                        accessTokenExpiresAt: (new Date).getTime() + Number(r) * 1e3,
                        bookmarkletMode: !!i["bookmarkletMode"],
                        projectId: i["projectId"],
                        projectOwnerId: i["projectOwnerId"],
                        projectToken: i["token"],
                        readOnly: i["readOnly"],
                        userFlags: i["userFlags"],
                        userId: i["userId"]
                    };
                    window.sessionStorage.setItem("editorParams", JSON.stringify(n));
                    if (i["desiredHash"]) {
                        window.location.hash = i["desiredHash"]
                    } else if (window.history) {
                        history.replaceState("", document.title, window.location.pathname + window.location.search)
                    } else {
                        window.location.hash = ""
                    }
                } catch (e) {
                    console.error("Unable to parse data from hash", e)
                }
                return n
            },
            _maybeLoadEditor: function (e) {
                try {
                    var t = false;
                    if (k.getHashParam(window.location.hash, "state")) {
                        var n = k.getHashParam(window.location.hash, "state");
                        n = JSON.parse(decodeURIComponent(n));
                        t = n["action"] === "mpeditor"
                    }
                    var i = !!window.sessionStorage.getItem("_mpcehash");
                    var r;
                    if (t) {
                        r = this._editorParamsFromHash(e, window.location.hash)
                    } else if (i) {
                        r = this._editorParamsFromHash(e, window.sessionStorage.getItem("_mpcehash"));
                        window.sessionStorage.removeItem("_mpcehash")
                    } else {
                        r = JSON.parse(window.sessionStorage.getItem("editorParams") || "{}")
                    }
                    if (r["projectToken"] && e.get_config("token") === r["projectToken"]) {
                        this._loadEditor(e, r);
                        return true
                    } else {
                        return false
                    }
                } catch (e) {
                    return false
                }
            },
            _loadEditor: function (e, t) {
                if (!window["_mpEditorLoaded"]) {
                    window["_mpEditorLoaded"] = true;
                    var n = e.get_config("app_host") + "/js-bundle/reports/collect-everything/editor.js?_ts=" + (new Date).getTime();
                    this._loadScript(n, function () {
                        window["mp_load_editor"](t)
                    });
                    return true
                }
                return false
            },
            enabledForProject: function (e, t, n) {
                t = !k.isUndefined(t) ? t : 10;
                n = !k.isUndefined(n) ? n : 10;
                var i = 0;
                for (var r = 0; r < e.length; r++) {
                    i += e.charCodeAt(r)
                }
                return i % t < n
            },
            isBrowserSupported: function () {
                return k.isFunction(document.querySelectorAll)
            }
        };
        k.bind_instance_methods(F);
        k.safewrap_instance_methods(F);
        var H = function () {};
        H.prototype.create_properties = function () {};
        H.prototype.event_handler = function () {};
        H.prototype.after_track_handler = function () {};
        H.prototype.init = function (e) {
            this.mp = e;
            return this
        };
        H.prototype.track = function (e, r, o, a) {
            var s = this;
            var t = k.dom_query(e);
            if (t.length === 0) {
                w.error("The DOM query (" + e + ") returned 0 elements");
                return
            }
            k.each(t, function (e) {
                k.register_event(e, this.override_event, function (e) {
                    var t = {};
                    var n = s.create_properties(o, this);
                    var i = s.mp.get_config("track_links_timeout");
                    s.event_handler(e, this, t);
                    window.setTimeout(s.track_callback(a, n, t, true), i);
                    s.mp.track(r, n, s.track_callback(a, n, t))
                })
            }, this);
            return true
        };
        H.prototype.track_callback = function (e, t, n, i) {
            i = i || false;
            var r = this;
            return function () {
                if (n.callback_fired) {
                    return
                }
                n.callback_fired = true;
                if (e && e(i, t) === false) {
                    return
                }
                r.after_track_handler(t, n, i)
            }
        };
        H.prototype.create_properties = function (e, t) {
            var n;
            if (typeof e === "function") {
                n = e(t)
            } else {
                n = k.extend({}, e)
            }
            return n
        };
        var U = function () {
            this.override_event = "click"
        };
        k.inherit(U, H);
        U.prototype.create_properties = function (e, t) {
            var n = U.superclass.create_properties.apply(this, arguments);
            if (t.href) {
                n["url"] = t.href
            }
            return n
        };
        U.prototype.event_handler = function (e, t, n) {
            n.new_tab = e.which === 2 || e.metaKey || e.ctrlKey || t.target === "_blank";
            n.href = t.href;
            if (!n.new_tab) {
                e.preventDefault()
            }
        };
        U.prototype.after_track_handler = function (e, t) {
            if (t.new_tab) {
                return
            }
            setTimeout(function () {
                window.location = t.href
            }, 0)
        };
        var q = function () {
            this.override_event = "submit"
        };
        k.inherit(q, H);
        q.prototype.event_handler = function (e, t, n) {
            n.element = t;
            e.preventDefault()
        };
        q.prototype.after_track_handler = function (e, t) {
            setTimeout(function () {
                t.element.submit()
            }, 0)
        };
        var $ = "__mp_opt_in_out_";

        function B(e, t) {
            te(true, e, t)
        }

        function G(e, t) {
            te(false, e, t)
        }

        function W(e, t) {
            return Z(e, t) === "1"
        }

        function Y(e, t) {
            if (ee(t)) {
                return true
            }
            return Z(e, t) === "0"
        }

        function V(e) {
            return ne(e, function (e) {
                return this.get_config(e)
            })
        }

        function K(e) {
            return ne(e, function (e) {
                return this._get_config(e)
            })
        }

        function z(e) {
            return ne(e, function (e) {
                return this._get_config(e)
            })
        }

        function X(e, t) {
            t = t || {};
            J(t).remove(Q(e, t), !!t.crossSubdomainCookie, t.cookieDomain)
        }

        function J(e) {
            e = e || {};
            return e.persistenceType === "localStorage" ? k.localStorage : k.cookie
        }

        function Q(e, t) {
            t = t || {};
            return (t.persistencePrefix || $) + e
        }

        function Z(e, t) {
            return J(t).get(Q(e, t))
        }

        function ee(e) {
            if (e && e.ignoreDnt) {
                return false
            }
            var t = e && e.window || r;
            var n = t["navigator"] || {};
            var i = false;
            k.each([n["doNotTrack"], n["msDoNotTrack"], t["doNotTrack"]], function (e) {
                if (k.includes([true, 1, "1", "yes"], e)) {
                    i = true
                }
            });
            return i
        }

        function te(e, t, n) {
            if (!k.isString(t) || !t.length) {
                console.error("gdpr." + (e ? "optIn" : "optOut") + " called with an invalid token");
                return
            }
            n = n || {};
            J(n).set(Q(t, n), e ? 1 : 0, k.isNumber(n.cookieExpiration) ? n.cookieExpiration : null, !!n.crossSubdomainCookie, !!n.secureCookie, !!n.crossSiteCookie, n.cookieDomain);
            if (n.track && e) {
                n.track(n.trackEventName || "$opt_in", n.trackProperties)
            }
        }

        function ne(s, l) {
            return function () {
                var e = false;
                try {
                    var t = l.call(this, "token");
                    var n = l.call(this, "ignore_dnt");
                    var i = l.call(this, "opt_out_tracking_persistence_type");
                    var r = l.call(this, "opt_out_tracking_cookie_prefix");
                    var o = l.call(this, "window");
                    if (t) {
                        e = Y(t, {
                            ignoreDnt: n,
                            persistenceType: i,
                            persistencePrefix: r,
                            window: o
                        })
                    }
                } catch (e) {
                    console.error("Unexpected error when checking tracking opt-out status: " + e)
                }
                if (!e) {
                    return s.apply(this, arguments)
                }
                var a = arguments[arguments.length - 1];
                if (typeof a === "function") {
                    a(0)
                }
                return
            }
        }
        var ie = "$set";
        var re = "$set_once";
        var oe = "$unset";
        var ae = "$add";
        var se = "$append";
        var le = "$union";
        var ue = "$remove";
        var ce = "$delete";
        var fe = {
            set_action: function (e, t) {
                var n = {};
                var i = {};
                if (k.isObject(e)) {
                    k.each(e, function (e, t) {
                        if (!this._is_reserved_property(t)) {
                            i[t] = e
                        }
                    }, this)
                } else {
                    i[e] = t
                }
                n[ie] = i;
                return n
            },
            unset_action: function (e) {
                var t = {};
                var n = [];
                if (!k.isArray(e)) {
                    e = [e]
                }
                k.each(e, function (e) {
                    if (!this._is_reserved_property(e)) {
                        n.push(e)
                    }
                }, this);
                t[oe] = n;
                return t
            },
            set_once_action: function (e, t) {
                var n = {};
                var i = {};
                if (k.isObject(e)) {
                    k.each(e, function (e, t) {
                        if (!this._is_reserved_property(t)) {
                            i[t] = e
                        }
                    }, this)
                } else {
                    i[e] = t
                }
                n[re] = i;
                return n
            },
            union_action: function (e, t) {
                var n = {};
                var i = {};
                if (k.isObject(e)) {
                    k.each(e, function (e, t) {
                        if (!this._is_reserved_property(t)) {
                            i[t] = k.isArray(e) ? e : [e]
                        }
                    }, this)
                } else {
                    i[e] = k.isArray(t) ? t : [t]
                }
                n[le] = i;
                return n
            },
            append_action: function (e, t) {
                var n = {};
                var i = {};
                if (k.isObject(e)) {
                    k.each(e, function (e, t) {
                        if (!this._is_reserved_property(t)) {
                            i[t] = e
                        }
                    }, this)
                } else {
                    i[e] = t
                }
                n[se] = i;
                return n
            },
            remove_action: function (e, t) {
                var n = {};
                var i = {};
                if (k.isObject(e)) {
                    k.each(e, function (e, t) {
                        if (!this._is_reserved_property(t)) {
                            i[t] = e
                        }
                    }, this)
                } else {
                    i[e] = t
                }
                n[ue] = i;
                return n
            },
            delete_action: function () {
                var e = {};
                e[ce] = "";
                return e
            }
        };
        var pe = function () {};
        k.extend(pe.prototype, fe);
        pe.prototype._init = function (e, t, n) {
            this._mixpanel = e;
            this._group_key = t;
            this._group_id = n
        };
        pe.prototype.set = z(function (e, t, n) {
            var i = this.set_action(e, t);
            if (k.isObject(e)) {
                n = t
            }
            return this._send_request(i, n)
        });
        pe.prototype.set_once = z(function (e, t, n) {
            var i = this.set_once_action(e, t);
            if (k.isObject(e)) {
                n = t
            }
            return this._send_request(i, n)
        });
        pe.prototype.unset = z(function (e, t) {
            var n = this.unset_action(e);
            return this._send_request(n, t)
        });
        pe.prototype.union = z(function (e, t, n) {
            if (k.isObject(e)) {
                n = t
            }
            var i = this.union_action(e, t);
            return this._send_request(i, n)
        });
        pe.prototype["delete"] = z(function (e) {
            var t = this.delete_action();
            return this._send_request(t, e)
        });
        pe.prototype.remove = z(function (e, t, n) {
            var i = this.remove_action(e, t);
            return this._send_request(i, n)
        });
        pe.prototype._send_request = function (e, t) {
            e["$group_key"] = this._group_key;
            e["$group_id"] = this._group_id;
            e["$token"] = this._get_config("token");
            var n = k.encodeDates(e);
            var i = k.truncate(n, 255);
            var r = k.JSONEncode(n);
            var o = k.base64Encode(r);
            w.log(e);
            this._mixpanel._send_request(this._mixpanel.get_config("api_host") + "/groups/", {
                data: o
            }, this._mixpanel._prepare_callback(t, i));
            return i
        };
        pe.prototype._is_reserved_property = function (e) {
            return e === "$group_key" || e === "$group_id"
        };
        pe.prototype._get_config = function (e) {
            return this._mixpanel.get_config(e)
        };
        pe.prototype.toString = function () {
            return this._mixpanel.toString() + ".group." + this._group_key + "." + this._group_id
        };
        pe.prototype["remove"] = pe.prototype.remove;
        pe.prototype["set"] = pe.prototype.set;
        pe.prototype["set_once"] = pe.prototype.set_once;
        pe.prototype["union"] = pe.prototype.union;
        pe.prototype["unset"] = pe.prototype.unset;
        pe.prototype["toString"] = pe.prototype.toString;
        var de = "__mps";
        var he = "__mpso";
        var ge = "__mpus";
        var me = "__mpa";
        var ve = "__mpap";
        var _e = "__mpr";
        var ye = "__mpu";
        var be = "$people_distinct_id";
        var xe = "__alias";
        var we = "__cmpns";
        var Ee = "__timers";
        var ke = [de, he, ge, me, ve, _e, ye, be, xe, we, Ee];
        var Se = function (e) {
            this["props"] = {};
            this.campaign_params_saved = false;
            if (e["persistence_name"]) {
                this.name = "mp_" + e["persistence_name"]
            } else {
                this.name = "mp_" + e["token"] + "_mixpanel"
            }
            var t = e["persistence"];
            if (t !== "cookie" && t !== "localStorage") {
                w.critical("Unknown persistence type " + t + "; falling back to cookie");
                t = e["persistence"] = "cookie"
            }
            if (t === "localStorage" && k.localStorage.is_supported()) {
                this.storage = k.localStorage
            } else {
                this.storage = k.cookie
            }
            this.load();
            this.update_config(e);
            this.upgrade(e);
            this.save()
        };
        Se.prototype.properties = function () {
            var n = {};
            k.each(this["props"], function (e, t) {
                if (!k.include(ke, t)) {
                    n[t] = e
                }
            });
            return n
        };
        Se.prototype.load = function () {
            if (this.disabled) {
                return
            }
            var e = this.storage.parse(this.name);
            if (e) {
                this["props"] = k.extend({}, e)
            }
        };
        Se.prototype.upgrade = function (e) {
            var t = e["upgrade"],
                n, i;
            if (t) {
                n = "mp_super_properties";
                if (typeof t === "string") {
                    n = t
                }
                i = this.storage.parse(n);
                this.storage.remove(n);
                this.storage.remove(n, true);
                if (i) {
                    this["props"] = k.extend(this["props"], i["all"], i["events"])
                }
            }
            if (!e["cookie_name"] && e["name"] !== "mixpanel") {
                n = "mp_" + e["token"] + "_" + e["name"];
                i = this.storage.parse(n);
                if (i) {
                    this.storage.remove(n);
                    this.storage.remove(n, true);
                    this.register_once(i)
                }
            }
            if (this.storage === k.localStorage) {
                i = k.cookie.parse(this.name);
                k.cookie.remove(this.name);
                k.cookie.remove(this.name, true);
                if (i) {
                    this.register_once(i)
                }
            }
        };
        Se.prototype.save = function () {
            if (this.disabled) {
                return
            }
            this._expire_notification_campaigns();
            this.storage.set(this.name, k.JSONEncode(this["props"]), this.expire_days, this.cross_subdomain, this.secure, this.cross_site, this.cookie_domain)
        };
        Se.prototype.remove = function () {
            this.storage.remove(this.name, false, this.cookie_domain);
            this.storage.remove(this.name, true, this.cookie_domain)
        };
        Se.prototype.clear = function () {
            this.remove();
            this["props"] = {}
        };
        Se.prototype.register_once = function (e, n, t) {
            if (k.isObject(e)) {
                if (typeof n === "undefined") {
                    n = "None"
                }
                this.expire_days = typeof t === "undefined" ? this.default_expiry : t;
                k.each(e, function (e, t) {
                    if (!this["props"].hasOwnProperty(t) || this["props"][t] === n) {
                        this["props"][t] = e
                    }
                }, this);
                this.save();
                return true
            }
            return false
        };
        Se.prototype.register = function (e, t) {
            if (k.isObject(e)) {
                this.expire_days = typeof t === "undefined" ? this.default_expiry : t;
                k.extend(this["props"], e);
                this.save();
                return true
            }
            return false
        };
        Se.prototype.unregister = function (e) {
            if (e in this["props"]) {
                delete this["props"][e];
                this.save()
            }
        };
        Se.prototype._expire_notification_campaigns = k.safewrap(function () {
            var e = this["props"][we],
                t = s.DEBUG ? 60 * 1e3 : 60 * 60 * 1e3;
            if (!e) {
                return
            }
            for (var n in e) {
                if (1 * new Date - e[n] > t) {
                    delete e[n]
                }
            }
            if (k.isEmptyObject(e)) {
                delete this["props"][we]
            }
        });
        Se.prototype.update_campaign_params = function () {
            if (!this.campaign_params_saved) {
                this.register_once(k.info.campaignParams());
                this.campaign_params_saved = true
            }
        };
        Se.prototype.update_search_keyword = function (e) {
            this.register(k.info.searchInfo(e))
        };
        Se.prototype.update_referrer_info = function (e) {
            this.register_once({
                $initial_referrer: e || "$direct",
                $initial_referring_domain: k.info.referringDomain(e) || "$direct"
            }, "")
        };
        Se.prototype.get_referrer_info = function () {
            return k.strip_empty_properties({
                $initial_referrer: this["props"]["$initial_referrer"],
                $initial_referring_domain: this["props"]["$initial_referring_domain"]
            })
        };
        Se.prototype.safe_merge = function (n) {
            k.each(this["props"], function (e, t) {
                if (!(t in n)) {
                    n[t] = e
                }
            });
            return n
        };
        Se.prototype.update_config = function (e) {
            this.default_expiry = this.expire_days = e["cookie_expiration"];
            this.set_disabled(e["disable_persistence"]);
            this.set_cookie_domain(e["cookie_domain"]);
            this.set_cross_site(e["cross_site_cookie"]);
            this.set_cross_subdomain(e["cross_subdomain_cookie"]);
            this.set_secure(e["secure_cookie"])
        };
        Se.prototype.set_disabled = function (e) {
            this.disabled = e;
            if (this.disabled) {
                this.remove()
            } else {
                this.save()
            }
        };
        Se.prototype.set_cookie_domain = function (e) {
            if (e !== this.cookie_domain) {
                this.remove();
                this.cookie_domain = e;
                this.save()
            }
        };
        Se.prototype.set_cross_site = function (e) {
            if (e !== this.cross_site) {
                this.cross_site = e;
                this.remove();
                this.save()
            }
        };
        Se.prototype.set_cross_subdomain = function (e) {
            if (e !== this.cross_subdomain) {
                this.cross_subdomain = e;
                this.remove();
                this.save()
            }
        };
        Se.prototype.get_cross_subdomain = function () {
            return this.cross_subdomain
        };
        Se.prototype.set_secure = function (e) {
            if (e !== this.secure) {
                this.secure = e ? true : false;
                this.remove();
                this.save()
            }
        };
        Se.prototype._add_to_people_queue = function (e, t) {
            var n = this._get_queue_key(e),
                i = t[e],
                r = this._get_or_create_queue(ie),
                o = this._get_or_create_queue(re),
                a = this._get_or_create_queue(oe),
                s = this._get_or_create_queue(ae),
                l = this._get_or_create_queue(le),
                u = this._get_or_create_queue(ue, []),
                c = this._get_or_create_queue(se, []);
            if (n === de) {
                k.extend(r, i);
                this._pop_from_people_queue(ae, i);
                this._pop_from_people_queue(le, i);
                this._pop_from_people_queue(oe, i)
            } else if (n === he) {
                k.each(i, function (e, t) {
                    if (!(t in o)) {
                        o[t] = e
                    }
                });
                this._pop_from_people_queue(oe, i)
            } else if (n === ge) {
                k.each(i, function (t) {
                    k.each([r, o, s, l], function (e) {
                        if (t in e) {
                            delete e[t]
                        }
                    });
                    k.each(c, function (e) {
                        if (t in e) {
                            delete e[t]
                        }
                    });
                    a[t] = true
                })
            } else if (n === me) {
                k.each(i, function (e, t) {
                    if (t in r) {
                        r[t] += e
                    } else {
                        if (!(t in s)) {
                            s[t] = 0
                        }
                        s[t] += e
                    }
                }, this);
                this._pop_from_people_queue(oe, i)
            } else if (n === ye) {
                k.each(i, function (e, t) {
                    if (k.isArray(e)) {
                        if (!(t in l)) {
                            l[t] = []
                        }
                        l[t] = l[t].concat(e)
                    }
                });
                this._pop_from_people_queue(oe, i)
            } else if (n === _e) {
                u.push(i);
                this._pop_from_people_queue(se, i)
            } else if (n === ve) {
                c.push(i);
                this._pop_from_people_queue(oe, i)
            }
            w.log("MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):");
            w.log(t);
            this.save()
        };
        Se.prototype._pop_from_people_queue = function (e, t) {
            var i = this._get_queue(e);
            if (!k.isUndefined(i)) {
                k.each(t, function (t, n) {
                    if (e === se || e === ue) {
                        k.each(i, function (e) {
                            if (e[n] === t) {
                                delete e[n]
                            }
                        })
                    } else {
                        delete i[n]
                    }
                }, this);
                this.save()
            }
        };
        Se.prototype._get_queue_key = function (e) {
            if (e === ie) {
                return de
            } else if (e === re) {
                return he
            } else if (e === oe) {
                return ge
            } else if (e === ae) {
                return me
            } else if (e === se) {
                return ve
            } else if (e === ue) {
                return _e
            } else if (e === le) {
                return ye
            } else {
                w.error("Invalid queue:", e)
            }
        };
        Se.prototype._get_queue = function (e) {
            return this["props"][this._get_queue_key(e)]
        };
        Se.prototype._get_or_create_queue = function (e, t) {
            var n = this._get_queue_key(e);
            t = k.isUndefined(t) ? {} : t;
            return this["props"][n] || (this["props"][n] = t)
        };
        Se.prototype.set_event_timer = function (e, t) {
            var n = this["props"][Ee] || {};
            n[e] = t;
            this["props"][Ee] = n;
            this.save()
        };
        Se.prototype.remove_event_timer = function (e) {
            var t = this["props"][Ee] || {};
            var n = t[e];
            if (!k.isUndefined(n)) {
                delete this["props"][Ee][e];
                this.save()
            }
            return n
        };
        var Te = "operator";
        var Ne = "property";
        var Ae = "window";
        var Ce = "unit";
        var Oe = "value";
        var Ie = "hour";
        var Re = "day";
        var Pe = "week";
        var Le = "month";
        var De = "event";
        var Me = "literal";
        var je = "and";
        var Fe = "or";
        var He = "in";
        var Ue = "not in";
        var qe = "+";
        var $e = "-";
        var Be = "*";
        var Ge = "/";
        var We = "%";
        var Ye = "==";
        var Ve = "!=";
        var Ke = ">";
        var ze = "<";
        var Xe = ">=";
        var Je = "<=";
        var Qe = "boolean";
        var Ze = "datetime";
        var et = "list";
        var tt = "number";
        var nt = "string";
        var it = "not";
        var rt = "defined";
        var ot = "not defined";
        var at = "now";

        function st(e) {
            if (e === null) {
                return null
            }
            switch (typeof e) {
                case "object":
                    if (k.isDate(e) && e.getTime() >= 0) {
                        return e.getTime()
                    }
                    return null;
                case "boolean":
                    return Number(e);
                case "number":
                    return e;
                case "string":
                    e = Number(e);
                    if (!isNaN(e)) {
                        return e
                    }
                    return 0
            }
            return null
        }

        function lt(e, t) {
            if (!e["operator"] || e["operator"] !== tt || !e["children"] || e["children"].length !== 1) {
                throw "Invalid cast operator: number " + e
            }
            return st(At(e["children"][0], t))
        }

        function ut(e) {
            if (e === null) {
                return false
            }
            switch (typeof e) {
                case "boolean":
                    return e;
                case "number":
                    return e !== 0;
                case "string":
                    return e.length > 0;
                case "object":
                    if (k.isArray(e) && e.length > 0) {
                        return true
                    }
                    if (k.isDate(e) && e.getTime() > 0) {
                        return true
                    }
                    if (k.isObject(e) && !k.isEmptyObject(e)) {
                        return true
                    }
                    return false
            }
            return false
        }

        function ct(e, t) {
            if (!e["operator"] || e["operator"] !== Qe || !e["children"] || e["children"].length !== 1) {
                throw "Invalid cast operator: boolean " + e
            }
            return ut(At(e["children"][0], t))
        }

        function ft(e, t) {
            if (!e["operator"] || e["operator"] !== Ze || !e["children"] || e["children"].length !== 1) {
                throw "Invalid cast operator: datetime " + e
            }
            var n = At(e["children"][0], t);
            if (n === null) {
                return null
            }
            switch (typeof n) {
                case "number":
                case "string":
                    var i = new Date(n);
                    if (isNaN(i.getTime())) {
                        return null
                    }
                    return i;
                case "object":
                    if (k.isDate(n)) {
                        return n
                    }
            }
            return null
        }

        function pt(e, t) {
            if (!e["operator"] || e["operator"] !== et || !e["children"] || e["children"].length !== 1) {
                throw "Invalid cast operator: list " + e
            }
            var n = At(e["children"][0], t);
            if (n === null) {
                return null
            }
            if (k.isArray(n)) {
                return n
            }
            return null
        }

        function dt(e, t) {
            if (!e["operator"] || e["operator"] !== nt || !e["children"] || e["children"].length !== 1) {
                throw "Invalid cast operator: string " + e
            }
            var n = At(e["children"][0], t);
            switch (typeof n) {
                case "object":
                    if (k.isDate(n)) {
                        return n.toJSON()
                    }
                    return JSON.stringify(n)
            }
            return String(n)
        }

        function ht(e, t) {
            if (!e["operator"] || e["operator"] !== je || !e["children"] || e["children"].length !== 2) {
                throw "Invalid operator: AND " + e
            }
            return ut(At(e["children"][0], t)) && ut(At(e["children"][1], t))
        }

        function gt(e, t) {
            if (!e["operator"] || e["operator"] !== Fe || !e["children"] || e["children"].length !== 2) {
                throw "Invalid operator: OR " + e
            }
            return ut(At(e["children"][0], t)) || ut(At(e["children"][1], t))
        }

        function mt(e, t) {
            if (!e["operator"] || [He, Ue].indexOf(e["operator"]) === -1 || !e["children"] || e["children"].length !== 2) {
                throw "Invalid operator: IN/NOT IN " + e
            }
            var n = At(e["children"][0], t);
            var i = At(e["children"][1], t);
            if (!k.isArray(i) && !k.isString(i)) {
                throw "Invalid operand for operator IN: invalid type" + i
            }
            var r = i.indexOf(n) > -1;
            if (e["operator"] === Ue) {
                return !r
            }
            return r
        }

        function vt(e, t) {
            if (!e["operator"] || e["operator"] !== qe || !e["children"] || e["children"].length < 2) {
                throw "Invalid operator: PLUS " + e
            }
            var n = At(e["children"][0], t);
            var i = At(e["children"][1], t);
            if (typeof n === "number" && typeof i === "number") {
                return n + i
            }
            if (typeof n === "string" && typeof i === "string") {
                return n + i
            }
            return null
        }

        function _t(e, t) {
            if (!e["operator"] || [$e, Be, Ge, We].indexOf(e["operator"]) === -1 || !e["children"] || e["children"].length < 2) {
                throw "Invalid arithmetic operator " + e
            }
            var n = At(e["children"][0], t);
            var i = At(e["children"][1], t);
            if (typeof n === "number" && typeof i === "number") {
                switch (e["operator"]) {
                    case $e:
                        return n - i;
                    case Be:
                        return n * i;
                    case Ge:
                        if (i !== 0) {
                            return n / i
                        }
                        return null;
                    case We:
                        if (i === 0) {
                            return null
                        }
                        if (n === 0) {
                            return 0
                        }
                        if (n < 0 && i > 0 || n > 0 && i < 0) {
                            return -(Math.floor(n / i) * i - n)
                        }
                        return n % i;
                    default:
                        throw "Unknown operator: " + e["operator"]
                }
            }
            return null
        }

        function yt(e, t) {
            if (e === t) return true;
            if (e === null || t === null) return false;
            if (e.length !== t.length) return false;
            for (var n = 0; n < e.length; n++) {
                if (e[n] !== t[n]) {
                    return false
                }
            }
            return true
        }

        function bt(e, t) {
            if (e === null && e === t) {
                return true
            }
            if (typeof e === typeof t) {
                switch (typeof e) {
                    case "number":
                    case "string":
                    case "boolean":
                        return e === t;
                    case "object":
                        if (k.isArray(e) && k.isArray(t)) {
                            return yt(e, t)
                        }
                        if (k.isDate(e) && k.isDate(t)) {
                            return e.getTime() === t.getTime()
                        }
                        if (k.isObject(e) && k.isObject(t)) {
                            return JSON.stringify(e) === JSON.stringify(t)
                        }
                }
            }
            return false
        }

        function xt(e, t) {
            if (!e["operator"] || [Ye, Ve].indexOf(e["operator"]) === -1 || !e["children"] || e["children"].length !== 2) {
                throw "Invalid equality operator " + e
            }
            var n = bt(At(e["children"][0], t), At(e["children"][1], t));
            switch (e["operator"]) {
                case Ye:
                    return n;
                case Ve:
                    return !n
            }
        }

        function wt(e, t) {
            if (!e["operator"] || [Ke, Xe, ze, Je].indexOf(e["operator"]) === -1 || !e["children"] || e["children"].length !== 2) {
                throw "Invalid comparison operator " + e
            }
            var n = At(e["children"][0], t);
            var i = At(e["children"][1], t);
            if (typeof n === typeof i) {
                if (typeof i === "number" || k.isDate(i)) {
                    n = st(n);
                    i = st(i);
                    switch (e["operator"]) {
                        case Ke:
                            return n > i;
                        case Xe:
                            return n >= i;
                        case ze:
                            return n < i;
                        case Je:
                            return n <= i
                    }
                } else if (typeof i === "string") {
                    var r = n.localeCompare(i);
                    switch (e["operator"]) {
                        case Ke:
                            return r > 0;
                        case Xe:
                            return r >= 0;
                        case ze:
                            return r < 0;
                        case Je:
                            return r <= 0
                    }
                }
            }
            return null
        }

        function Et(e, t) {
            if (!e["operator"] || [rt, ot].indexOf(e["operator"]) === -1 || !e["children"] || e["children"].length !== 1) {
                throw "Invalid defined/not defined operator: " + e
            }
            var n = At(e["children"][0], t) !== null;
            if (e["operator"] === ot) {
                return !n
            }
            return n
        }

        function kt(e, t) {
            if (!e["operator"] || e["operator"] !== it || !e["children"] || e["children"].length !== 1) {
                throw "Invalid not operator: " + e
            }
            var n = At(e["children"][0], t);
            if (n === null) {
                return true
            }
            if (typeof n === "boolean") {
                return !n
            }
            return null
        }

        function St(e, t) {
            if (!e["operator"]) {
                throw "Invalid operator: operator key missing " + e
            }
            switch (e["operator"]) {
                case je:
                    return ht(e, t);
                case Fe:
                    return gt(e, t);
                case He:
                case Ue:
                    return mt(e, t);
                case qe:
                    return vt(e, t);
                case $e:
                case Be:
                case Ge:
                case We:
                    return _t(e, t);
                case Ye:
                case Ve:
                    return xt(e, t);
                case Ke:
                case ze:
                case Xe:
                case Je:
                    return wt(e, t);
                case Qe:
                    return ct(e, t);
                case Ze:
                    return ft(e, t);
                case et:
                    return pt(e, t);
                case tt:
                    return lt(e, t);
                case nt:
                    return dt(e, t);
                case rt:
                case ot:
                    return Et(e, t);
                case it:
                    return kt(e, t)
            }
        }

        function Tt(e) {
            var t = e[Ae];
            if (!t || !t[Ce] || !t[Oe]) {
                throw "Invalid window: missing required keys " + JSON.stringify(e)
            }
            var n = new Date;
            switch (t[Ce]) {
                case Ie:
                    n.setTime(n.getTime() + t[Oe] * -1 * 60 * 60 * 1e3);
                    break;
                case Re:
                    n.setTime(n.getTime() + t[Oe] * -1 * 24 * 60 * 60 * 1e3);
                    break;
                case Pe:
                    n.setTime(n.getTime() + t[Oe] * -1 * 7 * 24 * 60 * 60 * 1e3);
                    break;
                case Le:
                    n.setTime(n.getTime() + t[Oe] * -1 * 30 * 24 * 60 * 60 * 1e3);
                    break;
                default:
                    throw "Invalid unit: " + t[Ce]
            }
            return n
        }

        function Nt(e, t) {
            if (!e["property"] || !e["value"]) {
                throw "Invalid operand: missing required keys " + e
            }
            switch (e["property"]) {
                case De:
                    if (t[e["value"]] !== undefined) {
                        return t[e["value"]]
                    }
                    return null;
                case Me:
                    if (e["value"] === at) {
                        return new Date
                    }
                    if (typeof e["value"] === "object") {
                        return Tt(e["value"])
                    }
                    return e["value"];
                default:
                    throw "Invalid operand: Invalid property type " + e["property"]
            }
        }

        function At(e, t) {
            if (e[Ne]) {
                return Nt(e, t)
            }
            if (e[Te]) {
                return St(e, t)
            }
        }
        var Ct = function (e, t) {
            k.bind_instance_methods(this);
            this.mixpanel = t;
            this.persistence = this.mixpanel["persistence"];
            this.resource_protocol = this.mixpanel.get_config("inapp_protocol");
            this.cdn_host = this.mixpanel.get_config("cdn");
            this.campaign_id = k.escapeHTML(e["id"]);
            this.message_id = k.escapeHTML(e["message_id"]);
            this.body = (k.escapeHTML(e["body"]) || "").replace(/\n/g, "<br/>");
            this.cta = k.escapeHTML(e["cta"]) || "Close";
            this.notif_type = k.escapeHTML(e["type"]) || "takeover";
            this.style = k.escapeHTML(e["style"]) || "light";
            this.title = k.escapeHTML(e["title"]) || "";
            this.video_width = Ct.VIDEO_WIDTH;
            this.video_height = Ct.VIDEO_HEIGHT;
            this.display_triggers = e["display_triggers"] || [];
            this.dest_url = e["cta_url"] || null;
            this.image_url = e["image_url"] || null;
            this.thumb_image_url = e["thumb_image_url"] || null;
            this.video_url = e["video_url"] || null;
            if (this.thumb_image_url && this.thumb_image_url.indexOf("//") === 0) {
                this.thumb_image_url = this.thumb_image_url.replace("//", this.resource_protocol)
            }
            this.clickthrough = true;
            if (!this.dest_url) {
                this.dest_url = "#dismiss";
                this.clickthrough = false
            }
            this.mini = this.notif_type === "mini";
            if (!this.mini) {
                this.notif_type = "takeover"
            }
            this.notif_width = !this.mini ? Ct.NOTIF_WIDTH : Ct.NOTIF_WIDTH_MINI;
            this._set_client_config();
            this.imgs_to_preload = this._init_image_html();
            this._init_video()
        };
        Ct.ANIM_TIME = 200;
        Ct.MARKUP_PREFIX = "mixpanel-notification";
        Ct.BG_OPACITY = .6;
        Ct.NOTIF_TOP = 25;
        Ct.NOTIF_START_TOP = 200;
        Ct.NOTIF_WIDTH = 388;
        Ct.NOTIF_WIDTH_MINI = 420;
        Ct.NOTIF_HEIGHT_MINI = 85;
        Ct.THUMB_BORDER_SIZE = 5;
        Ct.THUMB_IMG_SIZE = 60;
        Ct.THUMB_OFFSET = Math.round(Ct.THUMB_IMG_SIZE / 2);
        Ct.VIDEO_WIDTH = 595;
        Ct.VIDEO_HEIGHT = 334;
        Ct.prototype.show = function () {
            var e = this;
            this._set_client_config();
            if (!this.body_el) {
                setTimeout(function () {
                    e.show()
                }, 300);
                return
            }
            this._init_styles();
            this._init_notification_el();
            this._preload_images(this._attach_and_animate)
        };
        Ct.prototype.dismiss = k.safewrap(function () {
            if (!this.marked_as_shown) {
                this._mark_delivery({
                    invisible: true
                })
            }
            var e = this.showing_video ? this._get_el("video") : this._get_notification_display_el();
            if (this.use_transitions) {
                this._remove_class("bg", "visible");
                this._add_class(e, "exiting");
                setTimeout(this._remove_notification_el, Ct.ANIM_TIME)
            } else {
                var t, n, i;
                if (this.mini) {
                    t = "right";
                    n = 20;
                    i = -100
                } else {
                    t = "top";
                    n = Ct.NOTIF_TOP;
                    i = Ct.NOTIF_START_TOP + Ct.NOTIF_TOP
                }
                this._animate_els([{
                    el: this._get_el("bg"),
                    attr: "opacity",
                    start: Ct.BG_OPACITY,
                    goal: 0
                }, {
                    el: e,
                    attr: "opacity",
                    start: 1,
                    goal: 0
                }, {
                    el: e,
                    attr: t,
                    start: n,
                    goal: i
                }], Ct.ANIM_TIME, this._remove_notification_el)
            }
        });
        Ct.prototype._add_class = k.safewrap(function (e, t) {
            t = Ct.MARKUP_PREFIX + "-" + t;
            if (typeof e === "string") {
                e = this._get_el(e)
            }
            if (!e.className) {
                e.className = t
            } else if (!~(" " + e.className + " ").indexOf(" " + t + " ")) {
                e.className += " " + t
            }
        });
        Ct.prototype._remove_class = k.safewrap(function (e, t) {
            t = Ct.MARKUP_PREFIX + "-" + t;
            if (typeof e === "string") {
                e = this._get_el(e)
            }
            if (e.className) {
                e.className = (" " + e.className + " ").replace(" " + t + " ", "").replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
            }
        });
        Ct.prototype._animate_els = k.safewrap(function (e, t, n, i) {
            var r = this,
                o = false,
                a, s, l = 1 * new Date,
                u;
            i = i || l;
            u = l - i;
            for (a = 0; a < e.length; a++) {
                s = e[a];
                if (typeof s.val === "undefined") {
                    s.val = s.start
                }
                if (s.val !== s.goal) {
                    o = true;
                    var c = s.goal - s.start,
                        f = s.goal >= s.start ? 1 : -1;
                    s.val = s.start + c * u / t;
                    if (s.attr !== "opacity") {
                        s.val = Math.round(s.val)
                    }
                    if (f > 0 && s.val >= s.goal || f < 0 && s.val <= s.goal) {
                        s.val = s.goal
                    }
                }
            }
            if (!o) {
                if (n) {
                    n()
                }
                return
            }
            for (a = 0; a < e.length; a++) {
                s = e[a];
                if (s.el) {
                    var p = s.attr === "opacity" ? "" : "px";
                    s.el.style[s.attr] = String(s.val) + p
                }
            }
            setTimeout(function () {
                r._animate_els(e, t, n, i)
            }, 10)
        });
        Ct.prototype._attach_and_animate = k.safewrap(function () {
            var r = this;
            if (this.shown || this._get_shown_campaigns()[this.campaign_id]) {
                return
            }
            this.shown = true;
            this.body_el.appendChild(this.notification_el);
            setTimeout(function () {
                var e = r._get_notification_display_el();
                if (r.use_transitions) {
                    if (!r.mini) {
                        r._add_class("bg", "visible")
                    }
                    r._add_class(e, "visible");
                    r._mark_as_shown()
                } else {
                    var t, n, i;
                    if (r.mini) {
                        t = "right";
                        n = -100;
                        i = 20
                    } else {
                        t = "top";
                        n = Ct.NOTIF_START_TOP + Ct.NOTIF_TOP;
                        i = Ct.NOTIF_TOP
                    }
                    r._animate_els([{
                        el: r._get_el("bg"),
                        attr: "opacity",
                        start: 0,
                        goal: Ct.BG_OPACITY
                    }, {
                        el: e,
                        attr: "opacity",
                        start: 0,
                        goal: 1
                    }, {
                        el: e,
                        attr: t,
                        start: n,
                        goal: i
                    }], Ct.ANIM_TIME, r._mark_as_shown)
                }
            }, 100);
            k.register_event(r._get_el("cancel"), "click", function (e) {
                e.preventDefault();
                r.dismiss()
            });
            var e = r._get_el("button") || r._get_el("mini-content");
            k.register_event(e, "click", function (e) {
                e.preventDefault();
                if (r.show_video) {
                    r._track_event("$campaign_open", {
                        $resource_type: "video"
                    });
                    r._switch_to_video()
                } else {
                    r.dismiss();
                    if (r.clickthrough) {
                        var t = null;
                        if (r.mixpanel.get_config("inapp_link_new_window")) {
                            window.open(r.dest_url)
                        } else {
                            t = function () {
                                window.location.href = r.dest_url
                            }
                        }
                        r._track_event("$campaign_open", {
                            $resource_type: "link"
                        }, t)
                    }
                }
            })
        });
        Ct.prototype._get_el = function (e) {
            return document.getElementById(Ct.MARKUP_PREFIX + "-" + e)
        };
        Ct.prototype._get_notification_display_el = function () {
            return this._get_el(this.notif_type)
        };
        Ct.prototype._get_shown_campaigns = function () {
            return this.persistence["props"][we] || (this.persistence["props"][we] = {})
        };
        Ct.prototype._matches_event_data = k.safewrap(function (e) {
            var t = e["event"] || "";
            for (var n = 0; n < this.display_triggers.length; n++) {
                var i = this.display_triggers[n];
                var r = i["event"] || "";
                if (r === "$any_event" || t === i["event"]) {
                    if (i["selector"] && !k.isEmptyObject(i["selector"])) {
                        if (At(i["selector"], e["properties"])) {
                            return true
                        }
                    } else {
                        return true
                    }
                }
            }
            return false
        });
        Ct.prototype._browser_lte = function (e, t) {
            return this.browser_versions[e] && this.browser_versions[e] <= t
        };
        Ct.prototype._init_image_html = function () {
            var e = [];
            if (!this.mini) {
                if (this.image_url) {
                    e.push(this.image_url);
                    this.img_html = '<img id="img" src="' + this.image_url + '"/>'
                } else {
                    this.img_html = ""
                }
                if (this.thumb_image_url) {
                    e.push(this.thumb_image_url);
                    this.thumb_img_html = '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div>' + '<img id="thumbnail"' + ' src="' + this.thumb_image_url + '"' + ' width="' + Ct.THUMB_IMG_SIZE + '"' + ' height="' + Ct.THUMB_IMG_SIZE + '"' + "/>" + '<div id="thumbspacer"></div>'
                } else {
                    this.thumb_img_html = ""
                }
            } else {
                this.thumb_image_url = this.thumb_image_url || this.cdn_host + "/site_media/images/icons/notifications/mini-news-dark.png";
                e.push(this.thumb_image_url)
            }
            return e
        };
        Ct.prototype._init_notification_el = function () {
            var e = "";
            var t = "";
            var n = "";
            var i = '<div id="cancel">' + '<div id="cancel-icon"></div>' + "</div>";
            this.notification_el = document.createElement("div");
            this.notification_el.id = Ct.MARKUP_PREFIX + "-wrapper";
            if (!this.mini) {
                var r = this.clickthrough || this.show_video ? "" : '<div id="button-close"></div>',
                    o = this.show_video ? '<div id="button-play"></div>' : "";
                if (this._browser_lte("ie", 7)) {
                    r = "";
                    o = ""
                }
                e = '<div id="takeover">' + this.thumb_img_html + '<div id="mainbox">' + i + '<div id="content">' + this.img_html + '<div id="title">' + this.title + "</div>" + '<div id="body">' + this.body + "</div>" + '<div id="tagline">' + '<a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a>' + "</div>" + "</div>" + '<div id="button">' + r + '<a id="button-link" href="' + this.dest_url + '">' + this.cta + "</a>" + o + "</div>" + "</div>" + "</div>"
            } else {
                e = '<div id="mini">' + '<div id="mainbox">' + i + '<div id="mini-content">' + '<div id="mini-icon">' + '<div id="mini-icon-img"></div>' + "</div>" + '<div id="body">' + '<div id="body-text"><div>' + this.body + "</div></div>" + "</div>" + "</div>" + "</div>" + '<div id="mini-border"></div>' + "</div>"
            }
            if (this.youtube_video) {
                t = this.resource_protocol + "www.youtube.com/embed/" + this.youtube_video + "?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080";
                if (this.yt_custom) {
                    t += "&enablejsapi=1&html5=1&controls=0";
                    n = '<div id="video-controls">' + '<div id="video-progress" class="video-progress-el">' + '<div id="video-progress-total" class="video-progress-el"></div>' + '<div id="video-elapsed" class="video-progress-el"></div>' + "</div>" + '<div id="video-time" class="video-progress-el"></div>' + "</div>"
                }
            } else if (this.vimeo_video) {
                t = this.resource_protocol + "player.vimeo.com/video/" + this.vimeo_video + "?autoplay=1&title=0&byline=0&portrait=0"
            }
            if (this.show_video) {
                this.video_iframe = '<iframe id="' + Ct.MARKUP_PREFIX + '-video-frame" ' + 'width="' + this.video_width + '" height="' + this.video_height + '" ' + ' src="' + t + '"' + ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"' + "></iframe>";
                n = '<div id="video-' + (this.flip_animate ? "" : "no") + 'flip">' + '<div id="video">' + '<div id="video-holder"></div>' + n + "</div>" + "</div>"
            }
            var a = n + e;
            if (this.flip_animate) {
                a = (this.mini ? e : "") + '<div id="flipcontainer"><div id="flipper">' + (this.mini ? n : a) + "</div></div>"
            }
            this.notification_el.innerHTML = ('<div id="overlay" class="' + this.notif_type + '">' + '<div id="campaignid-' + this.campaign_id + '">' + '<div id="bgwrapper">' + '<div id="bg"></div>' + a + "</div>" + "</div>" + "</div>").replace(/class="/g, 'class="' + Ct.MARKUP_PREFIX + "-").replace(/id="/g, 'id="' + Ct.MARKUP_PREFIX + "-")
        };
        Ct.prototype._init_styles = function () {
            if (this.style === "dark") {
                this.style_vals = {
                    bg: "#1d1f25",
                    bg_actions: "#282b32",
                    bg_hover: "#3a4147",
                    bg_light: "#4a5157",
                    border_gray: "#32353c",
                    cancel_opacity: "0.4",
                    mini_hover: "#2a3137",
                    text_title: "#fff",
                    text_main: "#9498a3",
                    text_tagline: "#464851",
                    text_hover: "#ddd"
                }
            } else {
                this.style_vals = {
                    bg: "#fff",
                    bg_actions: "#e7eaee",
                    bg_hover: "#eceff3",
                    bg_light: "#f5f5f5",
                    border_gray: "#e4ecf2",
                    cancel_opacity: "1.0",
                    mini_hover: "#fafafa",
                    text_title: "#5c6578",
                    text_main: "#8b949b",
                    text_tagline: "#ced9e6",
                    text_hover: "#7c8598"
                }
            }
            var e = "0px 0px 35px 0px rgba(45, 49, 56, 0.7)",
                t = e,
                n = e,
                i = Ct.THUMB_IMG_SIZE + Ct.THUMB_BORDER_SIZE * 2,
                r = Ct.ANIM_TIME / 1e3 + "s";
            if (this.mini) {
                e = "none"
            }
            var o = {},
                a = Ct.NOTIF_WIDTH_MINI + 20;
            o["@media only screen and (max-width: " + (a - 1) + "px)"] = {
                "#overlay": {
                    display: "none"
                }
            };
            var s = {
                ".flipped": {
                    transform: "rotateY(180deg)"
                },
                "#overlay": {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    "text-align": "center",
                    "z-index": "10000",
                    "font-family": '"Helvetica", "Arial", sans-serif',
                    "-webkit-font-smoothing": "antialiased",
                    "-moz-osx-font-smoothing": "grayscale"
                },
                "#overlay.mini": {
                    height: "0",
                    overflow: "visible"
                },
                "#overlay a": {
                    width: "initial",
                    padding: "0",
                    "text-decoration": "none",
                    "text-transform": "none",
                    color: "inherit"
                },
                "#bgwrapper": {
                    position: "relative",
                    width: "100%",
                    height: "100%"
                },
                "#bg": {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    "min-width": this.doc_width * 4 + "px",
                    "min-height": this.doc_height * 4 + "px",
                    "background-color": "black",
                    opacity: "0.0",
                    "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)",
                    filter: "alpha(opacity=60)",
                    transition: "opacity " + r
                },
                "#bg.visible": {
                    opacity: Ct.BG_OPACITY
                },
                ".mini #bg": {
                    width: "0",
                    height: "0",
                    "min-width": "0"
                },
                "#flipcontainer": {
                    perspective: "1000px",
                    position: "absolute",
                    width: "100%"
                },
                "#flipper": {
                    position: "relative",
                    "transform-style": "preserve-3d",
                    transition: "0.3s"
                },
                "#takeover": {
                    position: "absolute",
                    left: "50%",
                    width: Ct.NOTIF_WIDTH + "px",
                    "margin-left": Math.round(-Ct.NOTIF_WIDTH / 2) + "px",
                    "backface-visibility": "hidden",
                    transform: "rotateY(0deg)",
                    opacity: "0.0",
                    top: Ct.NOTIF_START_TOP + "px",
                    transition: "opacity " + r + ", top " + r
                },
                "#takeover.visible": {
                    opacity: "1.0",
                    top: Ct.NOTIF_TOP + "px"
                },
                "#takeover.exiting": {
                    opacity: "0.0",
                    top: Ct.NOTIF_START_TOP + "px"
                },
                "#thumbspacer": {
                    height: Ct.THUMB_OFFSET + "px"
                },
                "#thumbborder-wrapper": {
                    position: "absolute",
                    top: -Ct.THUMB_BORDER_SIZE + "px",
                    left: Ct.NOTIF_WIDTH / 2 - Ct.THUMB_OFFSET - Ct.THUMB_BORDER_SIZE + "px",
                    width: i + "px",
                    height: i / 2 + "px",
                    overflow: "hidden"
                },
                "#thumbborder": {
                    position: "absolute",
                    width: i + "px",
                    height: i + "px",
                    "border-radius": i + "px",
                    "background-color": this.style_vals.bg_actions,
                    opacity: "0.5"
                },
                "#thumbnail": {
                    position: "absolute",
                    top: "0px",
                    left: Ct.NOTIF_WIDTH / 2 - Ct.THUMB_OFFSET + "px",
                    width: Ct.THUMB_IMG_SIZE + "px",
                    height: Ct.THUMB_IMG_SIZE + "px",
                    overflow: "hidden",
                    "z-index": "100",
                    "border-radius": Ct.THUMB_IMG_SIZE + "px"
                },
                "#mini": {
                    position: "absolute",
                    right: "20px",
                    top: Ct.NOTIF_TOP + "px",
                    width: this.notif_width + "px",
                    height: Ct.NOTIF_HEIGHT_MINI * 2 + "px",
                    "margin-top": 20 - Ct.NOTIF_HEIGHT_MINI + "px",
                    "backface-visibility": "hidden",
                    opacity: "0.0",
                    transform: "rotateX(90deg)",
                    transition: "opacity 0.3s, transform 0.3s, right 0.3s"
                },
                "#mini.visible": {
                    opacity: "1.0",
                    transform: "rotateX(0deg)"
                },
                "#mini.exiting": {
                    opacity: "0.0",
                    right: "-150px"
                },
                "#mainbox": {
                    "border-radius": "4px",
                    "box-shadow": e,
                    "text-align": "center",
                    "background-color": this.style_vals.bg,
                    "font-size": "14px",
                    color: this.style_vals.text_main
                },
                "#mini #mainbox": {
                    height: Ct.NOTIF_HEIGHT_MINI + "px",
                    "margin-top": Ct.NOTIF_HEIGHT_MINI + "px",
                    "border-radius": "3px",
                    transition: "background-color " + r
                },
                "#mini-border": {
                    height: Ct.NOTIF_HEIGHT_MINI + 6 + "px",
                    width: Ct.NOTIF_WIDTH_MINI + 6 + "px",
                    position: "absolute",
                    top: "-3px",
                    left: "-3px",
                    "margin-top": Ct.NOTIF_HEIGHT_MINI + "px",
                    "border-radius": "6px",
                    opacity: "0.25",
                    "background-color": "#fff",
                    "z-index": "-1",
                    "box-shadow": n
                },
                "#mini-icon": {
                    position: "relative",
                    display: "inline-block",
                    width: "75px",
                    height: Ct.NOTIF_HEIGHT_MINI + "px",
                    "border-radius": "3px 0 0 3px",
                    "background-color": this.style_vals.bg_actions,
                    background: "linear-gradient(135deg, " + this.style_vals.bg_light + " 0%, " + this.style_vals.bg_actions + " 100%)",
                    transition: "background-color " + r
                },
                "#mini:hover #mini-icon": {
                    "background-color": this.style_vals.mini_hover
                },
                "#mini:hover #mainbox": {
                    "background-color": this.style_vals.mini_hover
                },
                "#mini-icon-img": {
                    position: "absolute",
                    "background-image": "url(" + this.thumb_image_url + ")",
                    width: "48px",
                    height: "48px",
                    top: "20px",
                    left: "12px"
                },
                "#content": {
                    padding: "30px 20px 0px 20px"
                },
                "#mini-content": {
                    "text-align": "left",
                    height: Ct.NOTIF_HEIGHT_MINI + "px",
                    cursor: "pointer"
                },
                "#img": {
                    width: "328px",
                    "margin-top": "30px",
                    "border-radius": "5px"
                },
                "#title": {
                    "max-height": "600px",
                    overflow: "hidden",
                    "word-wrap": "break-word",
                    padding: "25px 0px 20px 0px",
                    "font-size": "19px",
                    "font-weight": "bold",
                    color: this.style_vals.text_title
                },
                "#body": {
                    "max-height": "600px",
                    "margin-bottom": "25px",
                    overflow: "hidden",
                    "word-wrap": "break-word",
                    "line-height": "21px",
                    "font-size": "15px",
                    "font-weight": "normal",
                    "text-align": "left"
                },
                "#mini #body": {
                    display: "inline-block",
                    "max-width": "250px",
                    margin: "0 0 0 30px",
                    height: Ct.NOTIF_HEIGHT_MINI + "px",
                    "font-size": "16px",
                    "letter-spacing": "0.8px",
                    color: this.style_vals.text_title
                },
                "#mini #body-text": {
                    display: "table",
                    height: Ct.NOTIF_HEIGHT_MINI + "px"
                },
                "#mini #body-text div": {
                    display: "table-cell",
                    "vertical-align": "middle"
                },
                "#tagline": {
                    "margin-bottom": "15px",
                    "font-size": "10px",
                    "font-weight": "600",
                    "letter-spacing": "0.8px",
                    color: "#ccd7e0",
                    "text-align": "left"
                },
                "#tagline a": {
                    color: this.style_vals.text_tagline,
                    transition: "color " + r
                },
                "#tagline a:hover": {
                    color: this.style_vals.text_hover
                },
                "#cancel": {
                    position: "absolute",
                    right: "0",
                    width: "8px",
                    height: "8px",
                    padding: "10px",
                    "border-radius": "20px",
                    margin: "12px 12px 0 0",
                    "box-sizing": "content-box",
                    cursor: "pointer",
                    transition: "background-color " + r
                },
                "#mini #cancel": {
                    margin: "7px 7px 0 0"
                },
                "#cancel-icon": {
                    width: "8px",
                    height: "8px",
                    overflow: "hidden",
                    "background-image": "url(" + this.cdn_host + "/site_media/images/icons/notifications/cancel-x.png)",
                    opacity: this.style_vals.cancel_opacity
                },
                "#cancel:hover": {
                    "background-color": this.style_vals.bg_hover
                },
                "#button": {
                    display: "block",
                    height: "60px",
                    "line-height": "60px",
                    "text-align": "center",
                    "background-color": this.style_vals.bg_actions,
                    "border-radius": "0 0 4px 4px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "background-color " + r
                },
                "#button-close": {
                    display: "inline-block",
                    width: "9px",
                    height: "60px",
                    "margin-right": "8px",
                    "vertical-align": "top",
                    "background-image": "url(" + this.cdn_host + "/site_media/images/icons/notifications/close-x-" + this.style + ".png)",
                    "background-repeat": "no-repeat",
                    "background-position": "0px 25px"
                },
                "#button-play": {
                    display: "inline-block",
                    width: "30px",
                    height: "60px",
                    "margin-left": "15px",
                    "background-image": "url(" + this.cdn_host + "/site_media/images/icons/notifications/play-" + this.style + "-small.png)",
                    "background-repeat": "no-repeat",
                    "background-position": "0px 15px"
                },
                "a#button-link": {
                    display: "inline-block",
                    "vertical-align": "top",
                    "text-align": "center",
                    "font-size": "17px",
                    "font-weight": "bold",
                    overflow: "hidden",
                    "word-wrap": "break-word",
                    color: this.style_vals.text_title,
                    transition: "color " + r
                },
                "#button:hover": {
                    "background-color": this.style_vals.bg_hover,
                    color: this.style_vals.text_hover
                },
                "#button:hover a": {
                    color: this.style_vals.text_hover
                },
                "#video-noflip": {
                    position: "relative",
                    top: -this.video_height * 2 + "px"
                },
                "#video-flip": {
                    "backface-visibility": "hidden",
                    transform: "rotateY(180deg)"
                },
                "#video": {
                    position: "absolute",
                    width: this.video_width - 1 + "px",
                    height: this.video_height + "px",
                    top: Ct.NOTIF_TOP + "px",
                    "margin-top": "100px",
                    left: "50%",
                    "margin-left": Math.round(-this.video_width / 2) + "px",
                    overflow: "hidden",
                    "border-radius": "5px",
                    "box-shadow": t,
                    transform: "translateZ(1px)",
                    transition: "opacity " + r + ", top " + r
                },
                "#video.exiting": {
                    opacity: "0.0",
                    top: this.video_height + "px"
                },
                "#video-holder": {
                    position: "absolute",
                    width: this.video_width - 1 + "px",
                    height: this.video_height + "px",
                    overflow: "hidden",
                    "border-radius": "5px"
                },
                "#video-frame": {
                    "margin-left": "-1px",
                    width: this.video_width + "px"
                },
                "#video-controls": {
                    opacity: "0",
                    transition: "opacity 0.5s"
                },
                "#video:hover #video-controls": {
                    opacity: "1.0"
                },
                "#video .video-progress-el": {
                    position: "absolute",
                    bottom: "0",
                    height: "25px",
                    "border-radius": "0 0 0 5px"
                },
                "#video-progress": {
                    width: "90%"
                },
                "#video-progress-total": {
                    width: "100%",
                    "background-color": this.style_vals.bg,
                    opacity: "0.7"
                },
                "#video-elapsed": {
                    width: "0",
                    "background-color": "#6cb6f5",
                    opacity: "0.9"
                },
                "#video #video-time": {
                    width: "10%",
                    right: "0",
                    "font-size": "11px",
                    "line-height": "25px",
                    color: this.style_vals.text_main,
                    "background-color": "#666",
                    "border-radius": "0 0 5px 0"
                }
            };
            if (this._browser_lte("ie", 8)) {
                k.extend(s, {
                    "* html #overlay": {
                        position: "absolute"
                    },
                    "* html #bg": {
                        position: "absolute"
                    },
                    "html, body": {
                        height: "100%"
                    }
                })
            }
            if (this._browser_lte("ie", 7)) {
                k.extend(s, {
                    "#mini #body": {
                        display: "inline",
                        zoom: "1",
                        border: "1px solid " + this.style_vals.bg_hover
                    },
                    "#mini #body-text": {
                        padding: "20px"
                    },
                    "#mini #mini-icon": {
                        display: "none"
                    }
                })
            }
            var l = ["backface-visibility", "border-radius", "box-shadow", "opacity", "perspective", "transform", "transform-style", "transition"],
                u = ["khtml", "moz", "ms", "o", "webkit"];
            for (var c in s) {
                for (var f = 0; f < l.length; f++) {
                    var p = l[f];
                    if (p in s[c]) {
                        var d = s[c][p];
                        for (var h = 0; h < u.length; h++) {
                            s[c]["-" + u[h] + "-" + p] = d
                        }
                    }
                }
            }
            var g = function (e, t) {
                var i = function (e) {
                    var t = "";
                    for (var n in e) {
                        var i = n.replace(/#/g, "#" + Ct.MARKUP_PREFIX + "-").replace(/\./g, "." + Ct.MARKUP_PREFIX + "-");
                        t += "\n" + i + " {";
                        var r = e[n];
                        for (var o in r) {
                            t += o + ":" + r[o] + ";"
                        }
                        t += "}"
                    }
                    return t
                };
                var n = function (e) {
                    var t = "";
                    for (var n in e) {
                        t += "\n" + n + " {" + i(e[n]) + "\n}"
                    }
                    return t
                };
                var r = i(e) + n(t),
                    o = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
                    a = document.createElement("style");
                o.appendChild(a);
                a.setAttribute("type", "text/css");
                if (a.styleSheet) {
                    a.styleSheet.cssText = r
                } else {
                    a.textContent = r
                }
            };
            g(s, o)
        };
        Ct.prototype._init_video = k.safewrap(function () {
            if (!this.video_url) {
                return
            }
            var e = this;
            e.yt_custom = "postMessage" in window;
            e.dest_url = e.video_url;
            var t = e.video_url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i),
                n = e.video_url.match(/vimeo\.com\/.*?(\d+)/i);
            if (t) {
                e.show_video = true;
                e.youtube_video = t[1];
                if (e.yt_custom) {
                    window["onYouTubeIframeAPIReady"] = function () {
                        if (e._get_el("video-frame")) {
                            e._yt_video_ready()
                        }
                    };
                    var i = document.createElement("script");
                    i.src = e.resource_protocol + "www.youtube.com/iframe_api";
                    var r = document.getElementsByTagName("script")[0];
                    r.parentNode.insertBefore(i, r)
                }
            } else if (n) {
                e.show_video = true;
                e.vimeo_video = n[1]
            }
            if (e._browser_lte("ie", 7) || e._browser_lte("firefox", 3)) {
                e.show_video = false;
                e.clickthrough = true
            }
        });
        Ct.prototype._mark_as_shown = k.safewrap(function () {
            var e = this;
            k.register_event(e._get_el("bg"), "click", function () {
                e.dismiss()
            });
            var t = function (e, t) {
                var n = {};
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    n = document.defaultView.getComputedStyle(e, null)
                } else if (e.currentStyle) {
                    n = e.currentStyle
                }
                return n[t]
            };
            if (this.campaign_id) {
                var n = this._get_el("overlay");
                if (n && t(n, "visibility") !== "hidden" && t(n, "display") !== "none") {
                    this._mark_delivery()
                }
            }
        });
        Ct.prototype._mark_delivery = k.safewrap(function (e) {
            if (!this.marked_as_shown) {
                this.marked_as_shown = true;
                if (this.campaign_id) {
                    this._get_shown_campaigns()[this.campaign_id] = 1 * new Date;
                    this.persistence.save()
                }
                this._track_event("$campaign_delivery", e);
                this.mixpanel["people"]["append"]({
                    $campaigns: this.campaign_id,
                    $notifications: {
                        campaign_id: this.campaign_id,
                        message_id: this.message_id,
                        type: "web",
                        time: new Date
                    }
                })
            }
        });
        Ct.prototype._preload_images = function (t) {
            var e = this;
            if (this.imgs_to_preload.length === 0) {
                t();
                return
            }
            var n = 0;
            var i = [];
            var r = function () {
                n++;
                if (n === e.imgs_to_preload.length && t) {
                    t();
                    t = null
                }
            };
            for (var o = 0; o < this.imgs_to_preload.length; o++) {
                var a = new Image;
                a.onload = r;
                a.src = this.imgs_to_preload[o];
                if (a.complete) {
                    r()
                }
                i.push(a)
            }
            if (this._browser_lte("ie", 7)) {
                setTimeout(function () {
                    var e = true;
                    for (o = 0; o < i.length; o++) {
                        if (!i[o].complete) {
                            e = false
                        }
                    }
                    if (e && t) {
                        t();
                        t = null
                    }
                }, 500)
            }
        };
        Ct.prototype._remove_notification_el = k.safewrap(function () {
            window.clearInterval(this._video_progress_checker);
            this.notification_el.style.visibility = "hidden";
            this.body_el.removeChild(this.notification_el)
        });
        Ct.prototype._set_client_config = function () {
            var e = function (e) {
                var t = navigator.userAgent.match(e);
                return t && t[1]
            };
            this.browser_versions = {};
            this.browser_versions["chrome"] = e(/Chrome\/(\d+)/);
            this.browser_versions["firefox"] = e(/Firefox\/(\d+)/);
            this.browser_versions["ie"] = e(/MSIE (\d+).+/);
            if (!this.browser_versions["ie"] && !window.ActiveXObject && "ActiveXObject" in window) {
                this.browser_versions["ie"] = 11
            }
            this.body_el = document.body || document.getElementsByTagName("body")[0];
            if (this.body_el) {
                this.doc_width = Math.max(this.body_el.scrollWidth, document.documentElement.scrollWidth, this.body_el.offsetWidth, document.documentElement.offsetWidth, this.body_el.clientWidth, document.documentElement.clientWidth);
                this.doc_height = Math.max(this.body_el.scrollHeight, document.documentElement.scrollHeight, this.body_el.offsetHeight, document.documentElement.offsetHeight, this.body_el.clientHeight, document.documentElement.clientHeight)
            }
            var i = this.browser_versions["ie"];
            var r = document.createElement("div").style,
                t = function (e) {
                    if (e in r) {
                        return true
                    }
                    if (!i) {
                        e = e[0].toUpperCase() + e.slice(1);
                        var t = ["O" + e, "Webkit" + e, "Moz" + e];
                        for (var n = 0; n < t.length; n++) {
                            if (t[n] in r) {
                                return true
                            }
                        }
                    }
                    return false
                };
            this.use_transitions = this.body_el && t("transition") && t("transform");
            this.flip_animate = (this.browser_versions["chrome"] >= 33 || this.browser_versions["firefox"] >= 15) && this.body_el && t("backfaceVisibility") && t("perspective") && t("transform")
        };
        Ct.prototype._switch_to_video = k.safewrap(function () {
            var e = this,
                t = [{
                    el: e._get_notification_display_el(),
                    attr: "opacity",
                    start: 1,
                    goal: 0
                }, {
                    el: e._get_notification_display_el(),
                    attr: "top",
                    start: Ct.NOTIF_TOP,
                    goal: -500
                }, {
                    el: e._get_el("video-noflip"),
                    attr: "opacity",
                    start: 0,
                    goal: 1
                }, {
                    el: e._get_el("video-noflip"),
                    attr: "top",
                    start: -e.video_height * 2,
                    goal: 0
                }];
            if (e.mini) {
                var n = e._get_el("bg"),
                    i = e._get_el("overlay");
                n.style.width = "100%";
                n.style.height = "100%";
                i.style.width = "100%";
                e._add_class(e._get_notification_display_el(), "exiting");
                e._add_class(n, "visible");
                t.push({
                    el: e._get_el("bg"),
                    attr: "opacity",
                    start: 0,
                    goal: Ct.BG_OPACITY
                })
            }
            var r = e._get_el("video-holder");
            r.innerHTML = e.video_iframe;
            var o = function () {
                if (window["YT"] && window["YT"]["loaded"]) {
                    e._yt_video_ready()
                }
                e.showing_video = true;
                e._get_notification_display_el().style.visibility = "hidden"
            };
            if (e.flip_animate) {
                e._add_class("flipper", "flipped");
                setTimeout(o, Ct.ANIM_TIME)
            } else {
                e._animate_els(t, Ct.ANIM_TIME, o)
            }
        });
        Ct.prototype._track_event = function (e, t, n) {
            if (this.campaign_id) {
                t = t || {};
                t = k.extend(t, {
                    campaign_id: this.campaign_id,
                    message_id: this.message_id,
                    message_type: "web_inapp",
                    message_subtype: this.notif_type
                });
                this.mixpanel["track"](e, t, n)
            } else if (n) {
                n.call()
            }
        };
        Ct.prototype._yt_video_ready = k.safewrap(function () {
            var i = this;
            if (i.video_inited) {
                return
            }
            i.video_inited = true;
            var a = i._get_el("video-elapsed"),
                s = i._get_el("video-time"),
                l = i._get_el("video-progress");
            new window["YT"]["Player"](Ct.MARKUP_PREFIX + "-video-frame", {
                events: {
                    onReady: function (e) {
                        var n = e["target"],
                            r = n["getDuration"](),
                            o = function (e) {
                                return ("00" + e).slice(-2)
                            },
                            t = function (e) {
                                var t = Math.round(r - e),
                                    n = Math.floor(t / 60),
                                    i = Math.floor(n / 60);
                                t -= n * 60;
                                n -= i * 60;
                                s.innerHTML = "-" + (i ? i + ":" : "") + o(n) + ":" + o(t)
                            };
                        t(0);
                        i._video_progress_checker = window.setInterval(function () {
                            var e = n["getCurrentTime"]();
                            a.style.width = e / r * 100 + "%";
                            t(e)
                        }, 250);
                        k.register_event(l, "click", function (e) {
                            var t = Math.max(0, e.pageX - l.getBoundingClientRect().left);
                            n["seekTo"](r * t / l.clientWidth, true)
                        })
                    }
                }
            })
        });
        var Ot = function () {};
        k.extend(Ot.prototype, fe);
        Ot.prototype._init = function (e) {
            this._mixpanel = e
        };
        Ot.prototype.set = K(function (e, t, n) {
            var i = this.set_action(e, t);
            if (k.isObject(e)) {
                n = t
            }
            if (this._get_config("save_referrer")) {
                this._mixpanel["persistence"].update_referrer_info(document.referrer)
            }
            i[ie] = k.extend({}, k.info.people_properties(), this._mixpanel["persistence"].get_referrer_info(), i[ie]);
            return this._send_request(i, n)
        });
        Ot.prototype.set_once = K(function (e, t, n) {
            var i = this.set_once_action(e, t);
            if (k.isObject(e)) {
                n = t
            }
            return this._send_request(i, n)
        });
        Ot.prototype.unset = K(function (e, t) {
            var n = this.unset_action(e);
            return this._send_request(n, t)
        });
        Ot.prototype.increment = K(function (e, t, n) {
            var i = {};
            var r = {};
            if (k.isObject(e)) {
                k.each(e, function (e, t) {
                    if (!this._is_reserved_property(t)) {
                        if (isNaN(parseFloat(e))) {
                            w.error("Invalid increment value passed to mixpanel.people.increment - must be a number");
                            return
                        } else {
                            r[t] = e
                        }
                    }
                }, this);
                n = t
            } else {
                if (k.isUndefined(t)) {
                    t = 1
                }
                r[e] = t
            }
            i[ae] = r;
            return this._send_request(i, n)
        });
        Ot.prototype.append = K(function (e, t, n) {
            if (k.isObject(e)) {
                n = t
            }
            var i = this.append_action(e, t);
            return this._send_request(i, n)
        });
        Ot.prototype.remove = K(function (e, t, n) {
            if (k.isObject(e)) {
                n = t
            }
            var i = this.remove_action(e, t);
            return this._send_request(i, n)
        });
        Ot.prototype.union = K(function (e, t, n) {
            if (k.isObject(e)) {
                n = t
            }
            var i = this.union_action(e, t);
            return this._send_request(i, n)
        });
        Ot.prototype.track_charge = K(function (e, t, n) {
            if (!k.isNumber(e)) {
                e = parseFloat(e);
                if (isNaN(e)) {
                    w.error("Invalid value passed to mixpanel.people.track_charge - must be a number");
                    return
                }
            }
            return this.append("$transactions", k.extend({
                $amount: e
            }, t), n)
        });
        Ot.prototype.clear_charges = function (e) {
            return this.set("$transactions", [], e)
        };
        Ot.prototype.delete_user = function () {
            if (!this._identify_called()) {
                w.error("mixpanel.people.delete_user() requires you to call identify() first");
                return
            }
            var e = {
                $delete: this._mixpanel.get_distinct_id()
            };
            return this._send_request(e)
        };
        Ot.prototype.toString = function () {
            return this._mixpanel.toString() + ".people"
        };
        Ot.prototype._send_request = function (e, t) {
            e["$token"] = this._get_config("token");
            e["$distinct_id"] = this._mixpanel.get_distinct_id();
            var n = this._mixpanel.get_property("$device_id");
            var i = this._mixpanel.get_property("$user_id");
            var r = this._mixpanel.get_property("$had_persisted_distinct_id");
            if (n) {
                e["$device_id"] = n
            }
            if (i) {
                e["$user_id"] = i
            }
            if (r) {
                e["$had_persisted_distinct_id"] = r
            }
            var o = k.encodeDates(e);
            var a = k.truncate(o, 255);
            var s = k.JSONEncode(o);
            var l = k.base64Encode(s);
            if (!this._identify_called()) {
                this._enqueue(e);
                if (!k.isUndefined(t)) {
                    if (this._get_config("verbose")) {
                        t({
                            status: -1,
                            error: null
                        })
                    } else {
                        t(-1)
                    }
                }
                return a
            }
            w.log("MIXPANEL PEOPLE REQUEST:");
            w.log(a);
            this._mixpanel._send_request(this._get_config("api_host") + "/engage/", {
                data: l
            }, this._mixpanel._prepare_callback(t, a));
            return a
        };
        Ot.prototype._get_config = function (e) {
            return this._mixpanel.get_config(e)
        };
        Ot.prototype._identify_called = function () {
            return this._mixpanel._flags.identify_called === true
        };
        Ot.prototype._enqueue = function (e) {
            if (ie in e) {
                this._mixpanel["persistence"]._add_to_people_queue(ie, e)
            } else if (re in e) {
                this._mixpanel["persistence"]._add_to_people_queue(re, e)
            } else if (oe in e) {
                this._mixpanel["persistence"]._add_to_people_queue(oe, e)
            } else if (ae in e) {
                this._mixpanel["persistence"]._add_to_people_queue(ae, e)
            } else if (se in e) {
                this._mixpanel["persistence"]._add_to_people_queue(se, e)
            } else if (ue in e) {
                this._mixpanel["persistence"]._add_to_people_queue(ue, e)
            } else if (le in e) {
                this._mixpanel["persistence"]._add_to_people_queue(le, e)
            } else {
                w.error("Invalid call to _enqueue():", e)
            }
        };
        Ot.prototype._flush_one_queue = function (n, e, i, t) {
            var r = this;
            var o = k.extend({}, this._mixpanel["persistence"]._get_queue(n));
            var a = o;
            if (!k.isUndefined(o) && k.isObject(o) && !k.isEmptyObject(o)) {
                r._mixpanel["persistence"]._pop_from_people_queue(n, o);
                if (t) {
                    a = t(o)
                }
                e.call(r, a, function (e, t) {
                    if (e === 0) {
                        r._mixpanel["persistence"]._add_to_people_queue(n, o)
                    }
                    if (!k.isUndefined(i)) {
                        i(e, t)
                    }
                })
            }
        };
        Ot.prototype._flush = function (e, t, n, i, r, o, a) {
            var s = this;
            var l = this._mixpanel["persistence"]._get_queue(se);
            var u = this._mixpanel["persistence"]._get_queue(ue);
            this._flush_one_queue(ie, this.set, e);
            this._flush_one_queue(re, this.set_once, i);
            this._flush_one_queue(oe, this.unset, o, function (e) {
                return k.keys(e)
            });
            this._flush_one_queue(ae, this.increment, t);
            this._flush_one_queue(le, this.union, r);
            if (!k.isUndefined(l) && k.isArray(l) && l.length) {
                var c;
                var f = function (e, t) {
                    if (e === 0) {
                        s._mixpanel["persistence"]._add_to_people_queue(se, c)
                    }
                    if (!k.isUndefined(n)) {
                        n(e, t)
                    }
                };
                for (var p = l.length - 1; p >= 0; p--) {
                    c = l.pop();
                    if (!k.isEmptyObject(c)) {
                        s.append(c, f)
                    }
                }
                s._mixpanel["persistence"].save()
            }
            if (!k.isUndefined(u) && k.isArray(u) && u.length) {
                var d;
                var h = function (e, t) {
                    if (e === 0) {
                        s._mixpanel["persistence"]._add_to_people_queue(ue, d)
                    }
                    if (!k.isUndefined(a)) {
                        a(e, t)
                    }
                };
                for (var g = u.length - 1; g >= 0; g--) {
                    d = u.pop();
                    if (!k.isEmptyObject(d)) {
                        s.remove(d, h)
                    }
                }
                s._mixpanel["persistence"].save()
            }
        };
        Ot.prototype._is_reserved_property = function (e) {
            return e === "$distinct_id" || e === "$token" || e === "$device_id" || e === "$user_id" || e === "$had_persisted_distinct_id"
        };
        Ot.prototype["set"] = Ot.prototype.set;
        Ot.prototype["set_once"] = Ot.prototype.set_once;
        Ot.prototype["unset"] = Ot.prototype.unset;
        Ot.prototype["increment"] = Ot.prototype.increment;
        Ot.prototype["append"] = Ot.prototype.append;
        Ot.prototype["remove"] = Ot.prototype.remove;
        Ot.prototype["union"] = Ot.prototype.union;
        Ot.prototype["track_charge"] = Ot.prototype.track_charge;
        Ot.prototype["clear_charges"] = Ot.prototype.clear_charges;
        Ot.prototype["delete_user"] = Ot.prototype.delete_user;
        Ot.prototype["toString"] = Ot.prototype.toString;
        var It;
        var Rt;
        var Pt = 0;
        var Lt = 1;
        var Dt = "mixpanel";
        var Mt = r.XMLHttpRequest && "withCredentials" in new XMLHttpRequest;
        var jt = !Mt && m.indexOf("MSIE") === -1 && m.indexOf("Mozilla") === -1;
        var Ft = f["sendBeacon"];
        if (Ft) {
            Ft = k.bind(Ft, f)
        }
        var Ht = {
            api_host: "https://api-js.mixpanel.com",
            api_method: "POST",
            api_transport: "XHR",
            app_host: "https://mixpanel.com",
            autotrack: true,
            cdn: "https://cdn.mxpnl.com",
            cross_site_cookie: false,
            cross_subdomain_cookie: true,
            persistence: "cookie",
            persistence_name: "",
            cookie_domain: "",
            cookie_name: "",
            loaded: function () {},
            store_google: true,
            save_referrer: true,
            test: false,
            verbose: false,
            img: false,
            track_pageview: true,
            debug: false,
            track_links_timeout: 300,
            cookie_expiration: 365,
            upgrade: false,
            disable_persistence: false,
            disable_cookie: false,
            secure_cookie: false,
            ip: true,
            opt_out_tracking_by_default: false,
            opt_out_persistence_by_default: false,
            opt_out_tracking_persistence_type: "localStorage",
            opt_out_tracking_cookie_prefix: null,
            property_blacklist: [],
            xhr_headers: {},
            inapp_protocol: "//",
            inapp_link_new_window: false,
            ignore_dnt: false
        };
        var Ut = false;
        var qt = function () {};
        var $t = function (e, t, n) {
            var i, r = n === Dt ? Rt : Rt[n];
            if (r && It === Pt) {
                i = r
            } else {
                if (r && !k.isArray(r)) {
                    w.error("You have already initialized " + n);
                    return
                }
                i = new qt
            }
            i._cached_groups = {};
            i._user_decide_check_complete = false;
            i._events_tracked_before_user_decide_check_complete = [];
            i._init(e, t, n);
            i["people"] = new Ot;
            i["people"]._init(i);
            s.DEBUG = s.DEBUG || i.get_config("debug");
            i["__autotrack_enabled"] = i.get_config("autotrack");
            if (i.get_config("autotrack")) {
                var o = 100;
                var a = 100;
                if (!F.enabledForProject(i.get_config("token"), o, a)) {
                    i["__autotrack_enabled"] = false;
                    w.log("Not in active bucket: disabling Automatic Event Collection.")
                } else if (!F.isBrowserSupported()) {
                    i["__autotrack_enabled"] = false;
                    w.log("Disabling Automatic Event Collection because this browser is not supported")
                } else {
                    F.init(i)
                }
            }
            if (!k.isUndefined(r) && k.isArray(r)) {
                i._execute_array.call(i["people"], r["people"]);
                i._execute_array(r)
            }
            return i
        };
        qt.prototype.init = function (e, t, n) {
            if (k.isUndefined(n)) {
                w.error("You must name your new library: init(token, config, name)");
                return
            }
            if (n === Dt) {
                w.error("You must initialize the main mixpanel object right after you include the Mixpanel js snippet");
                return
            }
            var i = $t(e, t, n);
            Rt[n] = i;
            i._loaded();
            return i
        };
        qt.prototype._init = function (e, t, n) {
            this["__loaded"] = true;
            this["config"] = {};
            this["_triggered_notifs"] = [];
            this.set_config(k.extend({}, Ht, t, {
                name: n,
                token: e,
                callback_fn: (n === Dt ? n : Dt + "." + n) + "._jsc"
            }));
            this["_jsc"] = function () {};
            this.__dom_loaded_queue = [];
            this.__request_queue = [];
            this.__disabled_events = [];
            this._flags = {
                disable_all_events: false,
                identify_called: false
            };
            this["persistence"] = this["cookie"] = new Se(this["config"]);
            this._gdpr_init();
            var i = k.UUID();
            if (!this.get_distinct_id()) {
                this.register_once({
                    distinct_id: i,
                    $device_id: i
                }, "")
            }
        };
        qt.prototype._loaded = function () {
            this.get_config("loaded")(this);
            if (this.get_config("track_pageview")) {
                this.track_pageview()
            }
        };
        qt.prototype._dom_loaded = function () {
            k.each(this.__dom_loaded_queue, function (e) {
                this._track_dom.apply(this, e)
            }, this);
            if (!this.has_opted_out_tracking()) {
                k.each(this.__request_queue, function (e) {
                    this._send_request.apply(this, e)
                }, this)
            }
            delete this.__dom_loaded_queue;
            delete this.__request_queue
        };
        qt.prototype._track_dom = function (e, t) {
            if (this.get_config("img")) {
                w.error("You can't use DOM tracking functions with img = true.");
                return false
            }
            if (!Ut) {
                this.__dom_loaded_queue.push([e, t]);
                return false
            }
            var n = (new e).init(this);
            return n.track.apply(n, t)
        };
        qt.prototype._prepare_callback = function (t, n) {
            if (k.isUndefined(t)) {
                return null
            }
            if (Mt) {
                var e = function (e) {
                    t(e, n)
                };
                return e
            } else {
                var i = this["_jsc"];
                var r = "" + Math.floor(Math.random() * 1e8);
                var o = this.get_config("callback_fn") + "[" + r + "]";
                i[r] = function (e) {
                    delete i[r];
                    t(e, n)
                };
                return o
            }
        };
        qt.prototype._send_request = function (e, t, n, i) {
            var r = true;
            if (jt) {
                this.__request_queue.push(arguments);
                return r
            }
            var o = {
                method: this.get_config("api_method"),
                transport: this.get_config("api_transport")
            };
            var a = null;
            if (!i && (k.isFunction(n) || typeof n === "string")) {
                i = n;
                n = null
            }
            n = k.extend(o, n || {});
            if (!Mt) {
                n.method = "GET"
            }
            var s = n.method === "POST";
            var l = Ft && s && n.transport.toLowerCase() === "sendbeacon";
            var u = this.get_config("verbose");
            if (t["verbose"]) {
                u = true
            }
            if (this.get_config("test")) {
                t["test"] = 1
            }
            if (u) {
                t["verbose"] = 1
            }
            if (this.get_config("img")) {
                t["img"] = 1
            }
            if (!Mt) {
                if (i) {
                    t["callback"] = i
                } else if (u || this.get_config("test")) {
                    t["callback"] = "(function(){})"
                }
            }
            t["ip"] = this.get_config("ip") ? 1 : 0;
            t["_"] = (new Date).getTime().toString();
            if (s) {
                a = "data=" + t["data"];
                delete t["data"]
            }
            e += "?" + k.HTTPBuildQuery(t);
            if ("img" in t) {
                var c = E.createElement("img");
                c.src = e;
                E.body.appendChild(c)
            } else if (l) {
                try {
                    r = Ft(e, a)
                } catch (e) {
                    w.error(e);
                    r = false
                }
            } else if (Mt) {
                try {
                    var f = new XMLHttpRequest;
                    f.open(n.method, e, true);
                    var p = this.get_config("xhr_headers");
                    if (s) {
                        p["Content-Type"] = "application/x-www-form-urlencoded"
                    }
                    k.each(p, function (e, t) {
                        f.setRequestHeader(t, e)
                    });
                    f.withCredentials = true;
                    f.onreadystatechange = function () {
                        if (f.readyState === 4) {
                            if (f.status === 200) {
                                if (i) {
                                    if (u) {
                                        var e;
                                        try {
                                            e = k.JSONDecode(f.responseText)
                                        } catch (e) {
                                            w.error(e);
                                            return
                                        }
                                        i(e)
                                    } else {
                                        i(Number(f.responseText))
                                    }
                                }
                            } else {
                                var t = "Bad HTTP status: " + f.status + " " + f.statusText;
                                w.error(t);
                                if (i) {
                                    if (u) {
                                        i({
                                            status: 0,
                                            error: t
                                        })
                                    } else {
                                        i(0)
                                    }
                                }
                            }
                        }
                    };
                    f.send(a)
                } catch (e) {
                    w.error(e);
                    r = false
                }
            } else {
                var d = E.createElement("script");
                d.type = "text/javascript";
                d.async = true;
                d.defer = true;
                d.src = e;
                var h = E.getElementsByTagName("script")[0];
                h.parentNode.insertBefore(d, h)
            }
            return r
        };
        qt.prototype._execute_array = function (e) {
            var t, n = [],
                i = [],
                r = [];
            k.each(e, function (e) {
                if (e) {
                    t = e[0];
                    if (k.isArray(t)) {
                        r.push(e)
                    } else if (typeof e === "function") {
                        e.call(this)
                    } else if (k.isArray(e) && t === "alias") {
                        n.push(e)
                    } else if (k.isArray(e) && t.indexOf("track") !== -1 && typeof this[t] === "function") {
                        r.push(e)
                    } else {
                        i.push(e)
                    }
                }
            }, this);
            var o = function (e, n) {
                k.each(e, function (e) {
                    if (k.isArray(e[0])) {
                        var t = n;
                        k.each(e, function (e) {
                            t = t[e[0]].apply(t, e.slice(1))
                        })
                    } else {
                        this[e[0]].apply(this, e.slice(1))
                    }
                }, n)
            };
            o(n, this);
            o(i, this);
            o(r, this)
        };
        qt.prototype.push = function (e) {
            this._execute_array([e])
        };
        qt.prototype.disable = function (e) {
            if (typeof e === "undefined") {
                this._flags.disable_all_events = true
            } else {
                this.__disabled_events = this.__disabled_events.concat(e)
            }
        };
        qt.prototype.track = V(function (e, t, n, i) {
            if (!i && typeof n === "function") {
                i = n;
                n = null
            }
            n = n || {};
            var r = n["transport"];
            if (r) {
                n.transport = r
            }
            if (typeof i !== "function") {
                i = function () {}
            }
            if (k.isUndefined(e)) {
                w.error("No event name provided to mixpanel.track");
                return
            }
            if (this._event_is_disabled(e)) {
                i(0);
                return
            }
            t = t || {};
            t["token"] = this.get_config("token");
            var o = this["persistence"].remove_event_timer(e);
            if (!k.isUndefined(o)) {
                var a = (new Date).getTime() - o;
                t["$duration"] = parseFloat((a / 1e3).toFixed(3))
            }
            this["persistence"].update_search_keyword(E.referrer);
            if (this.get_config("store_google")) {
                this["persistence"].update_campaign_params()
            }
            if (this.get_config("save_referrer")) {
                this["persistence"].update_referrer_info(E.referrer)
            }
            t = k.extend({}, k.info.properties(), this["persistence"].properties(), t);
            var s = this.get_config("property_blacklist");
            if (k.isArray(s)) {
                k.each(s, function (e) {
                    delete t[e]
                })
            } else {
                w.error("Invalid value for property_blacklist config: " + s)
            }
            var l = {
                event: e,
                properties: t
            };
            var u = k.truncate(l, 255);
            var c = k.JSONEncode(u);
            var f = k.base64Encode(c);
            w.log("MIXPANEL REQUEST:");
            w.log(u);
            var p = this._send_request(this.get_config("api_host") + "/track/", {
                data: f
            }, n, this._prepare_callback(i, u));
            this._check_and_handle_triggered_notifications(l);
            return p && u
        });
        qt.prototype.set_group = V(function (e, t, n) {
            if (!k.isArray(t)) {
                t = [t]
            }
            var i = {};
            i[e] = t;
            this.register(i);
            return this["people"].set(e, t, n)
        });
        qt.prototype.add_group = V(function (e, t, n) {
            var i = this.get_property(e);
            if (i === undefined) {
                var r = {};
                r[e] = [t];
                this.register(r)
            } else {
                if (i.indexOf(t) === -1) {
                    i.push(t);
                    this.register(r)
                }
            }
            return this["people"].union(e, t, n)
        });
        qt.prototype.remove_group = V(function (e, t, n) {
            var i = this.get_property(e);
            if (i !== undefined) {
                var r = i.indexOf(t);
                if (r > -1) {
                    i.splice(r, 1);
                    this.register({
                        group_key: i
                    })
                }
                if (i.length === 0) {
                    this.unregister(e)
                }
            }
            return this["people"].remove(e, t, n)
        });
        qt.prototype.track_with_groups = V(function (e, t, n, i) {
            var r = k.extend({}, t || {});
            k.each(n, function (e, t) {
                if (e !== null && e !== undefined) {
                    r[t] = e
                }
            });
            return this.track(e, r, i)
        });
        qt.prototype._create_map_key = function (e, t) {
            return e + "_" + JSON.stringify(t)
        };
        qt.prototype._remove_group_from_cache = function (e, t) {
            delete this._cached_groups[this._create_map_key(e, t)]
        };
        qt.prototype.get_group = function (e, t) {
            var n = this._create_map_key(e, t);
            var i = this._cached_groups[n];
            if (i === undefined || i._group_key !== e || i._group_id !== t) {
                i = new pe;
                i._init(this, e, t);
                this._cached_groups[n] = i
            }
            return i
        };
        qt.prototype.track_pageview = function (e) {
            if (k.isUndefined(e)) {
                e = E.location.href
            }
            this.track("mp_page_view", k.info.pageviewInfo(e))
        };
        qt.prototype.track_links = function () {
            return this._track_dom.call(this, U, arguments)
        };
        qt.prototype.track_forms = function () {
            return this._track_dom.call(this, q, arguments)
        };
        qt.prototype.time_event = function (e) {
            if (k.isUndefined(e)) {
                w.error("No event name provided to mixpanel.time_event");
                return
            }
            if (this._event_is_disabled(e)) {
                return
            }
            this["persistence"].set_event_timer(e, (new Date).getTime())
        };
        qt.prototype.register = function (e, t) {
            this["persistence"].register(e, t)
        };
        qt.prototype.register_once = function (e, t, n) {
            this["persistence"].register_once(e, t, n)
        };
        qt.prototype.unregister = function (e) {
            this["persistence"].unregister(e)
        };
        qt.prototype._register_single = function (e, t) {
            var n = {};
            n[e] = t;
            this.register(n)
        };
        qt.prototype.identify = function (e, t, n, i, r, o, a, s) {
            var l = this.get_distinct_id();
            this.register({
                $user_id: e
            });
            if (!this.get_property("$device_id")) {
                var u = l;
                this.register_once({
                    $had_persisted_distinct_id: true,
                    $device_id: u
                }, "")
            }
            if (e !== l && e !== this.get_property(xe)) {
                this.unregister(xe);
                this.register({
                    distinct_id: e
                })
            }
            this._check_and_handle_notifications(this.get_distinct_id());
            this._flags.identify_called = true;
            this["people"]._flush(t, n, i, r, o, a, s);
            if (e !== l) {
                this.track("$identify", {
                    distinct_id: e,
                    $anon_distinct_id: l
                })
            }
        };
        qt.prototype.reset = function () {
            this["persistence"].clear();
            this._flags.identify_called = false;
            var e = k.UUID();
            this.register_once({
                distinct_id: e,
                $device_id: e
            }, "")
        };
        qt.prototype.get_distinct_id = function () {
            return this.get_property("distinct_id")
        };
        qt.prototype.alias = function (e, t) {
            if (e === this.get_property(be)) {
                w.critical("Attempting to create alias for existing People user - aborting.");
                return -2
            }
            var n = this;
            if (k.isUndefined(t)) {
                t = this.get_distinct_id()
            }
            if (e !== t) {
                this._register_single(xe, e);
                return this.track("$create_alias", {
                    alias: e,
                    distinct_id: t
                }, function () {
                    n.identify(e)
                })
            } else {
                w.error("alias matches current distinct_id - skipping api call.");
                this.identify(e);
                return -1
            }
        };
        qt.prototype.name_tag = function (e) {
            this._register_single("mp_name_tag", e)
        };
        qt.prototype.set_config = function (e) {
            if (k.isObject(e)) {
                k.extend(this["config"], e);
                if (!this.get_config("persistence_name")) {
                    this["config"]["persistence_name"] = this["config"]["cookie_name"]
                }
                if (!this.get_config("disable_persistence")) {
                    this["config"]["disable_persistence"] = this["config"]["disable_cookie"]
                }
                if (this["persistence"]) {
                    this["persistence"].update_config(this["config"])
                }
                s.DEBUG = s.DEBUG || this.get_config("debug")
            }
        };
        qt.prototype.get_config = function (e) {
            return this["config"][e]
        };
        qt.prototype.get_property = function (e) {
            return this["persistence"]["props"][e]
        };
        qt.prototype.toString = function () {
            var e = this.get_config("name");
            if (e !== Dt) {
                e = Dt + "." + e
            }
            return e
        };
        qt.prototype._event_is_disabled = function (e) {
            return k.isBlockedUA(m) || this._flags.disable_all_events || k.include(this.__disabled_events, e)
        };
        qt.prototype._check_and_handle_triggered_notifications = V(function (e) {
            if (!this._user_decide_check_complete) {
                this._events_tracked_before_user_decide_check_complete.push(e)
            } else {
                var t = this["_triggered_notifs"];
                for (var n = 0; n < t.length; n++) {
                    var i = new Ct(t[n], this);
                    if (i._matches_event_data(e)) {
                        this._show_notification(t[n]);
                        return
                    }
                }
            }
        });
        qt.prototype._check_and_handle_notifications = V(function (e) {
            if (!e || this._flags.identify_called || this.get_config("disable_notifications")) {
                return
            }
            w.log("MIXPANEL NOTIFICATION CHECK");
            var t = {
                verbose: true,
                version: "3",
                lib: "web",
                token: this.get_config("token"),
                distinct_id: e
            };
            this._send_request(this.get_config("api_host") + "/decide/", t, {
                method: "GET",
                transport: "XHR"
            }, this._prepare_callback(k.bind(function (e) {
                if (e["notifications"] && e["notifications"].length > 0) {
                    this["_triggered_notifs"] = [];
                    var t = [];
                    k.each(e["notifications"], function (e) {
                        (e["display_triggers"] && e["display_triggers"].length > 0 ? this["_triggered_notifs"] : t).push(e)
                    }, this);
                    if (t.length > 0) {
                        this._show_notification.call(this, t[0])
                    }
                }
                this._handle_user_decide_check_complete()
            }, this)))
        });
        qt.prototype._handle_user_decide_check_complete = function () {
            this._user_decide_check_complete = true;
            var e = this._events_tracked_before_user_decide_check_complete;
            while (e.length > 0) {
                var t = e.shift();
                this._check_and_handle_triggered_notifications(t)
            }
        };
        qt.prototype._show_notification = function (e) {
            var t = new Ct(e, this);
            t.show()
        };
        qt.prototype._gdpr_init = function () {
            var e = this.get_config("opt_out_tracking_persistence_type") === "localStorage";
            if (e && k.localStorage.is_supported()) {
                if (!this.has_opted_in_tracking() && this.has_opted_in_tracking({
                        persistence_type: "cookie"
                    })) {
                    this.opt_in_tracking({
                        enable_persistence: false
                    })
                }
                if (!this.has_opted_out_tracking() && this.has_opted_out_tracking({
                        persistence_type: "cookie"
                    })) {
                    this.opt_out_tracking({
                        clear_persistence: false
                    })
                }
                this.clear_opt_in_out_tracking({
                    persistence_type: "cookie",
                    enable_persistence: false
                })
            }
            if (this.has_opted_out_tracking()) {
                this._gdpr_update_persistence({
                    clear_persistence: true
                })
            } else if (!this.has_opted_in_tracking() && (this.get_config("opt_out_tracking_by_default") || k.cookie.get("mp_optout"))) {
                k.cookie.remove("mp_optout");
                this.opt_out_tracking({
                    clear_persistence: this.get_config("opt_out_persistence_by_default")
                })
            }
        };
        qt.prototype._gdpr_update_persistence = function (e) {
            var t;
            if (e && e["clear_persistence"]) {
                t = true
            } else if (e && e["enable_persistence"]) {
                t = false
            } else {
                return
            }
            if (!this.get_config("disable_persistence") && this["persistence"].disabled !== t) {
                this["persistence"].set_disabled(t)
            }
        };
        qt.prototype._gdpr_call_func = function (e, t) {
            t = k.extend({
                track: k.bind(this.track, this),
                persistence_type: this.get_config("opt_out_tracking_persistence_type"),
                cookie_prefix: this.get_config("opt_out_tracking_cookie_prefix"),
                cookie_expiration: this.get_config("cookie_expiration"),
                cross_site_cookie: this.get_config("cross_site_cookie"),
                cross_subdomain_cookie: this.get_config("cross_subdomain_cookie"),
                cookie_domain: this.get_config("cookie_domain"),
                secure_cookie: this.get_config("secure_cookie"),
                ignore_dnt: this.get_config("ignore_dnt")
            }, t);
            if (!k.localStorage.is_supported()) {
                t["persistence_type"] = "cookie"
            }
            return e(this.get_config("token"), {
                track: t["track"],
                trackEventName: t["track_event_name"],
                trackProperties: t["track_properties"],
                persistenceType: t["persistence_type"],
                persistencePrefix: t["cookie_prefix"],
                cookieDomain: t["cookie_domain"],
                cookieExpiration: t["cookie_expiration"],
                crossSiteCookie: t["cross_site_cookie"],
                crossSubdomainCookie: t["cross_subdomain_cookie"],
                secureCookie: t["secure_cookie"],
                ignoreDnt: t["ignore_dnt"]
            })
        };
        qt.prototype.opt_in_tracking = function (e) {
            e = k.extend({
                enable_persistence: true
            }, e);
            this._gdpr_call_func(B, e);
            this._gdpr_update_persistence(e)
        };
        qt.prototype.opt_out_tracking = function (e) {
            e = k.extend({
                clear_persistence: true,
                delete_user: true
            }, e);
            if (e["delete_user"] && this["people"] && this["people"]._identify_called()) {
                this["people"].delete_user();
                this["people"].clear_charges()
            }
            this._gdpr_call_func(G, e);
            this._gdpr_update_persistence(e)
        };
        qt.prototype.has_opted_in_tracking = function (e) {
            return this._gdpr_call_func(W, e)
        };
        qt.prototype.has_opted_out_tracking = function (e) {
            return this._gdpr_call_func(Y, e)
        };
        qt.prototype.clear_opt_in_out_tracking = function (e) {
            e = k.extend({
                enable_persistence: true
            }, e);
            this._gdpr_call_func(X, e);
            this._gdpr_update_persistence(e)
        };
        qt.prototype["init"] = qt.prototype.init;
        qt.prototype["reset"] = qt.prototype.reset;
        qt.prototype["disable"] = qt.prototype.disable;
        qt.prototype["time_event"] = qt.prototype.time_event;
        qt.prototype["track"] = qt.prototype.track;
        qt.prototype["track_links"] = qt.prototype.track_links;
        qt.prototype["track_forms"] = qt.prototype.track_forms;
        qt.prototype["track_pageview"] = qt.prototype.track_pageview;
        qt.prototype["register"] = qt.prototype.register;
        qt.prototype["register_once"] = qt.prototype.register_once;
        qt.prototype["unregister"] = qt.prototype.unregister;
        qt.prototype["identify"] = qt.prototype.identify;
        qt.prototype["alias"] = qt.prototype.alias;
        qt.prototype["name_tag"] = qt.prototype.name_tag;
        qt.prototype["set_config"] = qt.prototype.set_config;
        qt.prototype["get_config"] = qt.prototype.get_config;
        qt.prototype["get_property"] = qt.prototype.get_property;
        qt.prototype["get_distinct_id"] = qt.prototype.get_distinct_id;
        qt.prototype["toString"] = qt.prototype.toString;
        qt.prototype["_check_and_handle_notifications"] = qt.prototype._check_and_handle_notifications;
        qt.prototype["_handle_user_decide_check_complete"] = qt.prototype._handle_user_decide_check_complete;
        qt.prototype["_show_notification"] = qt.prototype._show_notification;
        qt.prototype["opt_out_tracking"] = qt.prototype.opt_out_tracking;
        qt.prototype["opt_in_tracking"] = qt.prototype.opt_in_tracking;
        qt.prototype["has_opted_out_tracking"] = qt.prototype.has_opted_out_tracking;
        qt.prototype["has_opted_in_tracking"] = qt.prototype.has_opted_in_tracking;
        qt.prototype["clear_opt_in_out_tracking"] = qt.prototype.clear_opt_in_out_tracking;
        qt.prototype["get_group"] = qt.prototype.get_group;
        qt.prototype["set_group"] = qt.prototype.set_group;
        qt.prototype["add_group"] = qt.prototype.add_group;
        qt.prototype["remove_group"] = qt.prototype.remove_group;
        qt.prototype["track_with_groups"] = qt.prototype.track_with_groups;
        Se.prototype["properties"] = Se.prototype.properties;
        Se.prototype["update_search_keyword"] = Se.prototype.update_search_keyword;
        Se.prototype["update_referrer_info"] = Se.prototype.update_referrer_info;
        Se.prototype["get_cross_subdomain"] = Se.prototype.get_cross_subdomain;
        Se.prototype["clear"] = Se.prototype.clear;
        k.safewrap_class(qt, ["identify", "_check_and_handle_notifications", "_show_notification"]);
        var Bt = {};
        var Gt = function () {
            k.each(Bt, function (e, t) {
                if (t !== Dt) {
                    Rt[t] = e
                }
            });
            Rt["_"] = k
        };
        var Wt = function () {
            Rt["init"] = function (e, t, n) {
                if (n) {
                    if (!Rt[n]) {
                        Rt[n] = Bt[n] = $t(e, t, n);
                        Rt[n]._loaded()
                    }
                    return Rt[n]
                } else {
                    var i = Rt;
                    if (Bt[Dt]) {
                        i = Bt[Dt]
                    } else if (e) {
                        i = $t(e, t, Dt);
                        i._loaded();
                        Bt[Dt] = i
                    }
                    Rt = i;
                    if (It === Lt) {
                        r[Dt] = Rt
                    }
                    Gt()
                }
            }
        };
        var Yt = function () {
            function e() {
                if (e.done) {
                    return
                }
                e.done = true;
                Ut = true;
                jt = false;
                k.each(Bt, function (e) {
                    e._dom_loaded()
                })
            }

            function t() {
                try {
                    E.documentElement.doScroll("left")
                } catch (e) {
                    setTimeout(t, 1);
                    return
                }
                e()
            }
            if (E.addEventListener) {
                if (E.readyState === "complete") {
                    e()
                } else {
                    E.addEventListener("DOMContentLoaded", e, false)
                }
            } else if (E.attachEvent) {
                E.attachEvent("onreadystatechange", e);
                var n = false;
                try {
                    n = r.frameElement === null
                } catch (e) {}
                if (E.documentElement.doScroll && n) {
                    t()
                }
            }
            k.register_event(r, "load", e, true)
        };

        function Vt() {
            It = Pt;
            Rt = new qt;
            Wt();
            Rt["init"]();
            Yt();
            return Rt
        }
        var Kt = Vt();
        t.exports = Kt
    }, {}],
    43: [function (e, t, n) {
        function i(e) {
            var t;
            if (e.nodeName === "SELECT") {
                e.focus();
                t = e.value
            } else if (e.nodeName === "INPUT" || e.nodeName === "TEXTAREA") {
                var n = e.hasAttribute("readonly");
                if (!n) {
                    e.setAttribute("readonly", "")
                }
                e.select();
                e.setSelectionRange(0, e.value.length);
                if (!n) {
                    e.removeAttribute("readonly")
                }
                t = e.value
            } else {
                if (e.hasAttribute("contenteditable")) {
                    e.focus()
                }
                var i = window.getSelection();
                var r = document.createRange();
                r.selectNodeContents(e);
                i.removeAllRanges();
                i.addRange(r);
                t = i.toString()
            }
            return t
        }
        t.exports = i
    }, {}],
    44: [function (e, t, n) {
        function i() {}
        i.prototype = {
            on: function (e, t, n) {
                var i = this.e || (this.e = {});
                (i[e] || (i[e] = [])).push({
                    fn: t,
                    ctx: n
                });
                return this
            },
            once: function (e, t, n) {
                var i = this;

                function r() {
                    i.off(e, r);
                    t.apply(n, arguments)
                }
                r._ = t;
                return this.on(e, r, n)
            },
            emit: function (e) {
                var t = [].slice.call(arguments, 1);
                var n = ((this.e || (this.e = {}))[e] || []).slice();
                var i = 0;
                var r = n.length;
                for (i; i < r; i++) {
                    n[i].fn.apply(n[i].ctx, t)
                }
                return this
            },
            off: function (e, t) {
                var n = this.e || (this.e = {});
                var i = n[e];
                var r = [];
                if (i && t) {
                    for (var o = 0, a = i.length; o < a; o++) {
                        if (i[o].fn !== t && i[o].fn._ !== t) r.push(i[o])
                    }
                }
                r.length ? n[e] = r : delete n[e];
                return this
            }
        };
        t.exports = i;
        t.exports.TinyEmitter = i
    }, {}]
}, {}, [5]);