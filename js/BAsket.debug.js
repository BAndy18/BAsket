BAsketVer = "2.01.0328.88";(function($, DX, undefined) {
    var translator = DX.translator,
        fx = DX.fx,
        VIEW_OFFSET = 40,
        NAVIGATION_MAX_WIDTH = 300,
        NAVIGATION_TOGGLE_DURATION = 400;
    DX.framework.html.SlideOutController = DX.framework.html.DefaultLayoutController.inherit({
        _getLayoutTemplateName: function() {
            return "slideout"
        },
        _createNavigation: function(navigationCommands) {
            var self = this;
            this.callBase(navigationCommands);
            this.$slideOut = $("<div/>").appendTo(this._$hiddenBag).dxSlideOut({menuItemTemplate: $("#slideOutMenuItemTemplate")}).dxCommandContainer({id: 'global-navigation'});
            this.slideOut = this.$slideOut.dxSlideOut("instance");
            var container = this.$slideOut.dxCommandContainer("instance");
            this._commandManager._arrangeCommandsToContainers(navigationCommands, [container]);
            this.$slideOut.find(".dx-slideout-item-container").append(this._$mainLayout)
        },
        _getRootElement: function() {
            return this.$slideOut
        },
        init: function(options) {
            this.callBase(options);
            this._navigationManager = options.navigationManager;
            this._navigatingHandler = $.proxy(this._onNavigating, this)
        },
        activate: function() {
            this.callBase.apply(this, arguments);
            this._navigationManager.navigating.add(this._navigatingHandler)
        },
        deactivate: function() {
            this.callBase.apply(this, arguments);
            this._navigationManager.navigating.remove(this._navigatingHandler)
        },
        _onNavigating: function(args) {
            var self = this;
            if (this.slideOut.option("menuVisible"))
                args.navigateWhen.push(this._toggleNavigation().done(function() {
                    self._disableTransitions = true
                }))
        },
        _onViewShown: function(viewInfo) {
            this._disableTransitions = false
        },
        _isPlaceholderEmpty: function(viewInfo) {
            var $markup = viewInfo.renderResult.$markup;
            var toolbar = $markup.find(".layout-toolbar").data("dxToolbar");
            var items = toolbar.option("items");
            var backCommands = $.grep(items, function(item) {
                    return (item.behavior === "back" || item.id === "back") && item.visible === true
                });
            return !backCommands.length
        },
        _onRenderComplete: function(viewInfo) {
            var self = this;
            self._initNavigation(viewInfo.renderResult.$markup);
            if (self._isPlaceholderEmpty(viewInfo))
                self._initNavigationButton(viewInfo.renderResult.$markup);
            var $content = viewInfo.renderResult.$markup.find(".layout-content"),
                $appbar = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom"),
                appbar = $appbar.data("dxToolbar");
            if (appbar) {
                self._refreshAppbarVisibility(appbar, $content);
                appbar.optionChanged.add(function(name, value) {
                    if (name === "items")
                        self._refreshAppbarVisibility(appbar, $content)
                })
            }
        },
        _refreshAppbarVisibility: function(appbar, $content) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            $content.toggleClass("has-toolbar-bottom", isAppbarNotEmpty);
            appbar.option("visible", isAppbarNotEmpty)
        },
        _initNavigationButton: function($markup) {
            var self = this,
                $toolbar = $markup.find(".layout-toolbar"),
                toolbar = $toolbar.data("dxToolbar");
            var showNavButton = function($markup, $navButtonItem) {
                    $navButtonItem = $navButtonItem || $toolbar.find(".nav-button-item");
                    $navButtonItem.show();
                    $navButtonItem.find(".nav-button").data("dxButton").option("clickAction", $.proxy(self._toggleNavigation, self, $markup))
                };
            showNavButton($markup);
            toolbar.option("itemRenderedAction", function(e) {
                var data = e.itemData,
                    $element = e.itemElement;
                if (data.template === "nav-button")
                    $.proxy(showNavButton, self, $markup)()
            });
            toolbar.repaint()
        },
        _initNavigation: function($markup) {
            this._isNavigationVisible = false
        },
        _toggleNavigation: function($markup) {
            return this.slideOut.toggleMenuVisibility()
        }
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "ios",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "android",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "tizen",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "win8",
        phone: true,
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "generic",
        controller: new DX.framework.html.SlideOutController
    })
})(jQuery, DevExpress);(function($, DX, undefined) {
    var HAS_NAVBAR_CLASS = "has-navbar",
        HAS_TOOLBAR_CLASS = "has-toolbar",
        HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        TOOLBAR_BOTTOM_ACTIVE_CLASS = "dx-appbar-active",
        SEMI_HIDDEN_CLASS = "semi-hidden",
        TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom.win8",
        ACTIVE_PIVOT_ITEM_SELECTOR = ".dx-pivot-item:not(.dx-pivot-item-hidden)",
        LAYOUT_FOOTER_SELECTOR = ".layout-footer",
        ACTIVE_TOOLBAR_SELECTOR = ".dx-active-view .dx-toolbar";
    DX.framework.html.NavBarController = DX.framework.html.DefaultLayoutController.inherit({
        _getLayoutTemplateName: function() {
            return "navbar"
        },
        _createNavigation: function(navigationCommands) {
            this.callBase(navigationCommands);
            var $navbar = this._$mainLayout.find(".navbar-container");
            if ($navbar.length && navigationCommands) {
                var container = $navbar.dxCommandContainer("instance");
                this._commandManager._arrangeCommandsToContainers(navigationCommands, [container]);
                this._$mainLayout.addClass(HAS_NAVBAR_CLASS)
            }
        },
        _showViewImpl: function(viewInfo) {
            var self = this;
            return self.callBase.apply(self, arguments).done(function() {
                    var $toolbar = self._$mainLayout.find(LAYOUT_FOOTER_SELECTOR).find(ACTIVE_TOOLBAR_SELECTOR),
                        isToolbarEmpty = !$toolbar.length || !$toolbar.dxToolbar("instance").option("visible");
                    self._$mainLayout.toggleClass(HAS_TOOLBAR_CLASS, !isToolbarEmpty)
                })
        }
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "ios",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "android",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "tizen",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "generic",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "split",
        platform: "win8",
        phone: false,
        root: true,
        controller: new DX.framework.html.NavBarController
    })
})(jQuery, DevExpress);(function($, DX, undefined) {
    DX.framework.html.EmptyLayoutController = DX.framework.html.DefaultLayoutController.inherit({ctor: function(options) {
            options = options || {};
            options.layoutTemplateName = "empty";
            this.callBase(options)
        }});
    DX.framework.html.layoutControllers.push({
        navigationType: "empty",
        controller: new DX.framework.html.EmptyLayoutController
    })
})(jQuery, DevExpress);var U = (function ($, window) {
	var root = {};

	/*
		* Date Format 1.2.3
		* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
		* MIT license
		*
		* Includes enhancements by Scott Trenda <scott.trenda.net>
		* and Kris Kowal <cixar.com/~kris.kowal/>
		*
		* Accepts a date, a mask, or a date and a mask.
		* Returns a formatted version of the given date.
		* The date defaults to the current date/time.
		* The mask defaults to dateFormat.masks.default.
		*/

	var dateFormat = function () {
		var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
            	val = String(val);
            	len = len || 2;
            	while (val.length < len) val = "0" + val;
            	return val;
            };

		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;

			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}

			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");

			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                	d: d,
                	dd: pad(d),
                	ddd: dF.i18n.dayNames[D],
                	dddd: dF.i18n.dayNames[D + 7],
                	m: m + 1,
                	mm: pad(m + 1),
                	mmm: dF.i18n.monthNames[m],
                	mmmm: dF.i18n.monthNames[m + 12],
                	yy: String(y).slice(2),
                	yyyy: y,
                	h: H % 12 || 12,
                	hh: pad(H % 12 || 12),
                	H: H,
                	HH: pad(H),
                	M: M,
                	MM: pad(M),
                	s: s,
                	ss: pad(s),
                	l: pad(L, 3),
                	L: pad(L > 99 ? Math.round(L / 10) : L),
                	t: H < 12 ? "a" : "p",
                	tt: H < 12 ? "am" : "pm",
                	T: H < 12 ? "A" : "P",
                	TT: H < 12 ? "AM" : "PM",
                	Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                	o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                	S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();

	// Some common format strings
	dateFormat.masks = {
		"default": "ddd mmm dd yyyy HH:MM:ss",
		shortDate: "m/d/yy",
		mediumDate: "mmm d, yyyy",
		longDate: "mmmm d, yyyy",
		fullDate: "dddd, mmmm d, yyyy",
		shortTime: "h:MM TT",
		mediumTime: "h:MM:ss TT",
		longTime: "h:MM:ss TT Z",
		isoDate: "yyyy-mm-dd",
		isoTime: "HH:MM:ss",
		isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

	// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};

	// For convenience...
	// root.Date.prototype.format = function (mask, utc) {
	//     return dateFormat(this, mask, utc);
	// };
	root.DateFormat = function (date, mask) {
		if (!mask)
			mask = 'dd-mm-yyyy';
		return dateFormat(date, mask);
	};

	return root;
})(jQuery, window);

var _ = (function (window) {
	var root = {};

	root.Common = {};
	root.Navigation = {};
	root.ReadNews = {};
	root.Preferences = {};
	root.Order = {};
	root.Products = {};
	root.Clients = {};
	root.RoadMap = {};
	root.Info = {};

	root.getText = function(txt) {
		return Globalize.localize(txt);
	}

	return root;
})(window);

var P = (function ($, window) {
	var root = {};

	root.navigation = [
            {
            	"id": "Home", "action": "#home", "heightRatio": 4, "widthRatio": 4, "icon": "home",
            	"title": "BAsket", "backcolor": "black"
            },
            {
            	"id": "Order", "action": "#Order", "heightRatio": 4, "widthRatio": 8, "icon": "cart",
            	"title": "NewOrder", "backcolor": "#FF981D"
            },
            {
            	"id": "OrderList", "action": "#OrderList", "heightRatio": 4, "widthRatio": 4, "icon": "favorites",
            	"title": "Order List", "backcolor": "#15992A"
            },
            {
            	"id": "RoadMapList", "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8, "icon": "map",
            	"title": "RoadMap", "backcolor": "#006AC1"
            },
            {
            	"id": "Clients", "action": "#Clients", "heightRatio": 4, "widthRatio": 8, "icon": "globe",
            	"title": "Clients", "backcolor": "#7200AC"
            },
            {
            	"id": "ReadNews", "action": "#ReadNews", "heightRatio": 4, "widthRatio": 4, "icon": "download",
            	"title": "ReadNews", "backcolor": "red"
            },
            {
            	"id": "Preferences", "action": "#Preferences", "heightRatio": 4, "widthRatio": 4, "icon": "preferences",
            	"title": "Preferences", "backcolor": "red"
            },
            {
            	"id": "Info", "action": "#Info", "heightRatio": 4, "widthRatio": 2, "icon": "info",
            	"title": "Info", "backcolor": "#7200AC"
            }
	];

	root.loadPanelVisible = ko.observable(false);
	function iniLocalStor(key, defval) {
		var vari = window.localStorage.getItem(key);
		if (!vari && defval) {
			vari = defval;
			window.localStorage.setItem(key, vari);
		}
		return vari;
	};
    root.getLocalStor = function(key, defval) {
        var ret = iniLocalStor(key, defval);
        if (ret == 'true') return true;
        if (ret == 'false') return false;
        return ret;
    }

	root.ChangeLookup = function(id, key) {
		var lookup = $(id).data("dxLookup");
		var value = lookup.option("value");
		window.localStorage.setItem(key, value);
		return value;
	};
	root.ChangeValue = function(key, value) {
		window.localStorage.setItem(key, value);
		return value;
	};

	// var languageMap = {
	// 	'English': EN_US,
	// 	'Русский': RU_RU
	// };
	var languageMap = {
		'English': 'en',
		'Русский': 'ru'
	};
	function getValue(obj, key) {
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (i == key) {
				return obj[i];
			}
		}
	};
	// function objCopy(o1,o2){o1 = o2}

	root.ChangeLanguageUI = function() {
		// if (root.languageUI == '-')
		// 	_ = RU_RU;
		// else
		// 	_ = getValue(languageMap, root.languageUI);

		root.Culture = (languageMap[root.languageUI] == 'ru') ? 'ru':'default';
		
		// root.Culture = 'ru';
		Globalize.culture(root.Culture);
		var mes = Globalize.cultures[root.Culture].messages;

		_.Common		= mes.Common;
		_.Navigation	= mes.Navigation;
		_.ReadNews		= mes.ReadNews;
		_.Preferences	= mes.Preferences;
		_.Order			= mes.Order;
		_.Products		= mes.Products;
		_.Clients		= mes.Clients;
		_.RoadMap		= mes.RoadMap;
		_.Info			= mes.Info;

		root.navigation.forEach(function(entry) {
			var nav = eval("_.Navigation." + entry.id);
			if (nav)
				entry.title = nav;
		});
	};

	root.getInfo = function() {
		var getUrl = "localization/Info_" + root.Culture + ".html";
		$.get(getUrl).then(function(text, status, xhr){
	   		var tV = text.split('##');
	   		for (var i in tV){
	   			var tn = tV[i].split('|');
	   			if (tn.length > 1) {
	   				var navi = tn[0];
	   				if (navi)
	   					_.Info[navi] = tn[1];
	   				if (navi == 'Contacts')
	   					_.Info[navi] = _.Info[navi].replace(/#EMail#/g, P.EMail);
	   				else if (navi == 'SysInfo')
	   					_.Info[navi] = _.Info[navi]
	   						.replace('#device#', 
		   						(DevExpress.devices.current().generic  ? ' =generic= ':'') + 
					            (DevExpress.devices.current().phone  ? ' =phone= ':'') + 
					            (DevExpress.devices.current().tablet  ? ' =tablet= ':'') + 
					            (DevExpress.devices.current().android  ? ' =android= ':'') + 
					            (DevExpress.devices.current().ios  ? ' =ios= ':'') + 
					            (DevExpress.devices.current().tizen  ? ' =tizen= ':'') + 
					            (DevExpress.devices.current().win8  ? ' =win8= ':''))
				            .replace('#deviceType#', DevExpress.devices.current().deviceType)
				            .replace('#platform#', DevExpress.devices.current().platform)
				            .replace('#screen_height#', screen.height)
				            .replace('#screen_width#', screen.width)
				            .replace('#userAgent#', navigator.userAgent)
				            .replace('#language#', navigator.language)
				            .replace('#copyright#', P.copyright)
				            .replace('#cookieEnabled#', (navigator.cookieEnabled ? 'Enabled':'Disabled'))
				            ;
	   			}
	   		}
		});
	}


	root.LoadFile = function(filename, filetype) {
		if (filetype == "js") { //if filename is a external JavaScript file
			var fileref = document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		}
		else if (filetype == "css") { //if filename is an external CSS file
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if (typeof fileref != "undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	}

	root.geoCurrent = ko.observable("");
	root.getGeo = function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					root.geoCurrent(position.coords.latitude.toFixed(6) + ',' + position.coords.longitude.toFixed(6));
					///alert(root.geoCurrent);
				},
				function(msg) {
					root.geoCurrent(typeof msg == 'string' ? msg : "failed");
					//alert(root.geoCurrent);
				});
		}
	};
	root.getDistance = function(p1, p2) {
		var R = 6371; // km
		var dLat = ((p2[0]) - (p1[0])) * Math.PI / 180;
		var dLon = ((p2[1]) - (p1[1])) * Math.PI / 180;
		var lat1 = (p1[0]) * Math.PI / 180;
		var lat2 = (p2[0]) * Math.PI / 180;

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};
	root.geoBearing = function(p1, p2) {
		var dLon = (p2[1] - p1[1]) * Math.PI / 180;
		var y = Math.sin(dLon) * Math.cos(p2[0]);
		var x = Math.cos(p1[0]) * Math.sin(p2[0]) -
			Math.sin(p1[0]) * Math.cos(p2[0]) * Math.cos(dLon);
		var brng = Math.atan2(y, x) * 180 / Math.PI;
		return brng;
	};
	root.geoCoder = function(address) {
		var geocoder = new google.maps.Geocoder();
		var deferred = new $.Deferred();
		//var address = document.getElementById("gadres").value;
		geocoder.geocode({ 'address': address }, function(results, status) {
			var res = [];
			if (status == google.maps.GeocoderStatus.OK) {
				//map.setCenter(results[0].geometry.location);
				res = [
					results[0].geometry.location.lat().toFixed(6),
					results[0].geometry.location.lng().toFixed(6)
				];
			}
			deferred.resolve(res);
		});
		return deferred;
	};

	root.itemClick = function(e) {
		BAsket.app.navigate(e.itemData.action.substring(1), { direction: 'none', root: true });
	};
	root.itemIcon = function(icon) {
		return 'tileicon dx-icon-' + icon.toLowerCase();
	};
	root.itemCount = {
		'OrderList': iniLocalStor("OrderList", '0'),
		'RoadMapList': iniLocalStor("RoadMapList", ''),
		'Clients': iniLocalStor("Clients", ''),
		'ReadNews': iniLocalStor("ReadNews", '')
	};

	root.trace = function(str) {
		if (P.debugMode){
			var element = document.getElementById('consoleOut');
			if (element)
				element.innerHTML += str + '<br />';
		}
		if (console)
			console.log(str);
	};


    root.setQuantToWar = function(war) {
        for (var i in P.arrayBAsket) 
            if (P.arrayBAsket[i].Id == war.Id) {
                war.Quant = P.arrayBAsket[i].Quant;
                return war;
            }
        return war;
    };
    root.validateEmail = function(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

	root.getDeviceId = function() {
		var deviceId = '';
		if (window.device) {
			deviceId = window.device.uuid;
			root.bPhoneGap = true;
		}
		if (!deviceId)
			deviceId = iniLocalStor("userPassword", "-");

		//console.log('deviceId:' + deviceId);
		return deviceId;
	};

	//root.navAgent = navigator.userAgent;
	root.deviceInfo = DevExpress.devices.current();

	root.curCategoryId = 0;
	root.curCategoryName = '';
	root.curModeChoice = true;
	root.modeProdView = true;
	root.fromProducts = false;
	//root.currentNms = []
	root.arrayBAsket = [];
	root.arrayBAsketL = [];
	root.copyright = '';
	root.debugMode = false;
	root.useWebDb = true;
	root.bPhoneGap = false;
    root.maxSizeLocalDb = 5000000;

	root.arrCategory = [];
	root.arrNMS = [];

	root.dataSouceUrl = '';
	root.pageSize = 30;
	root.EMail = "BAndySoft" + "@" + "gmail" + "." + "com";

	root.Init = function () {
		root.useWebDb = iniLocalStor("useWebDb", "true") == "true";
	    if (typeof window.openDatabase === 'undefined') {
	    	root.useWebDb = false;
			//alert("Test openDatabase OK " + root.useWebDb);
		}

		root.layout = iniLocalStor("Layout", "slideout");

        root.platformDevice = 'android';
		// root.platformDevice = 'win8';
		root.platformDevice = iniLocalStor("Platform", 'android');
		if (root.platformDevice == '-')
			root.platformDevice = root.deviceInfo.platform;

		root.deviceClass = {};
		root.deviceClass['platform'] = root.platformDevice;
		var pdArr = root.platformDevice.split(' ');
        // if (pdArr[0] == 'ios')
        //     root.LoadFile('css/dx.ios.default.css', 'css');
        if (pdArr[0] == 'generic')
            root.LoadFile('css/dx.generic.light.css', 'css');
		if (pdArr.length > 1) {
			root.deviceClass['platform'] = pdArr[0];
			if (pdArr[0] == 'ios' && pdArr[1] == 'v6')
				root.deviceClass['version'] = '6';
			else if (pdArr[1] == 'black') {
				if (pdArr[0] == 'android')
					root.LoadFile('css/dx.android.holo-dark.css', 'css');
				if (pdArr[0] == 'tizen')
					root.LoadFile('css/dx.tizen.black.css', 'css');
			}
		} else {
            if (pdArr[0] == 'tizen')
                root.LoadFile('css/dx.tizen.white.css', 'css');
        }

        root.dataSouceUrl = iniLocalStor("dataSouceUrl", "");
        root.adminPassword = iniLocalStor("adminPassword", "admin");
        root.modeProdView = iniLocalStor("modeProdView", "true") == "true";
        root.debugMode = iniLocalStor("debugMode", "true") == "true";

        root.mapProvider = iniLocalStor("MapProvider", "google");

        root.languageUI = iniLocalStor("LanguageUI", '-');
        if (root.languageUI == '-')
        	root.languageUI = navigator.language == 'ru' ? 'Русский' : 'English';
        root.ChangeLanguageUI();

        BAsket.navigation = P.navigation.slice(0);
        BAsket.navigation = BAsket.navigation.splice(1);

        root.UserName = iniLocalStor("userName", "-");
        if (root.UserName == '-') root.UserName = 'BAsket User';
        root.UserPassword = iniLocalStor("userPassword", "-");
        if (root.UserPassword == '-') root.UserPassword = root.getDeviceId();
        root.UserEMail = iniLocalStor("userEMail", "-");

        var auth = "Basic " + [root.UserName, root.UserPassword].join(":");
        // var auth = "Basic " + [root.UserName + ":" + root.UserPassword].join(":");
        auth = DevExpress.data.base64_encode(auth);
        // document.cookie = ".ASPXAUTH=" + auth;
        // document.cookie = ".ASPXAUTH=" + DevExpress.data.base64_encode(auth);
        document.cookie = ".BAsketAUTH=" + auth;
        sessionStorage['.BAsketAUTH'] = auth;
        root.ajaxHeaders = (root.bPhoneGap || !location.port) ? {
            'Authorization': auth
            // 'Cookie' : document.cookie
            // 'Access-Control-Allow-Origin': true,
            // 'Authorization' : getToken()
            // 'Authorization': "Basic " + DevExpress.data.base64_encode([P.UserName, P.UserPassword].join(":"))
        } : {};
        // root.ajaxHeaders = {};

        root.copyright = 'BAsket \u00A9 2014 BAndySoft. All rights reserved (' + root.deviceClass.platform + '; ver. ' + BAsketVer + ')';

		root.arrCategory = JSON.parse(iniLocalStor("categories", "{}"));
        if (!root.arrCategory.length || false) {
            // DevExpress.ui.dialog.confirm("Вы уверены?", "Первичная загрузка данных").done(function (dialogResult) {
            // if (dialogResult){
            DAL.ReadNews(true, true);
            // }
            // });
            return;
        }
		root.arrNMS[0] = JSON.parse(iniLocalStor("NMS0", '{}'));
       	// P.trace('arrNMS 0 length ' + root.arrNMS[0].length);
		for (var i = 0; i < root.arrNMS[0].length; i++) {
        	// P.trace('arrNMS ' + i);
        	var str = iniLocalStor("NMS" + root.arrNMS[0][i].Id, '');
        	if (str)
				root.arrNMS[root.arrNMS[0][i].Id] = JSON.parse(str);
		}
        if (root.arrCategory.length > 0){
    		root.curCategoryId = root.arrCategory[0].Id;
    		root.curCategoryName = root.arrCategory[0].N;
        }

        root.getInfo();
		DAL.TableCount();

		var view = $("#idMainTileView").data("dxTileView");        //dxTileView("instance");
		if (view)
			view.repaint();
	};

	return root;
})(jQuery, window);


window.onerror = function (msg, url, line, column, errorObj) {
  // You can view the information in an alert to see things working
  // like so:
  var addlog = '';
  //addlog = (errorObj) ? "\n" + errorObj.stack : ' no addlog';
  var str = "Error: ";
  if (msg.target){
    // for (var i in msg)
    str += msg.target.src;
  } else {
    if (!url) url = '-';
      str += msg + "\nurl: " + url + "\nline #: " + line + "/" + column + addlog;
    alert(str);
  }
  if (!console) return true;
  console.log(str);
  if (errorObj)
    console.log(errorObj.stack);
  return true;
};

//"use strict";
eval('"use strict";');
window.BAsket = {};

$(function() {
	// are we running in native app or in browser?
	window.isphone = document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1;

	if (window.isphone) {
		P.trace('! window.isphone !');
		P.LoadFile('cordova.js', 'js');
		document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		onDeviceReady();
	}
});

function onDeviceReady() {
	P.Init();

	DevExpress.devices.current(P.deviceClass);
	// DevExpress.devices.current({platform: P.deviceClass, version: '6', deviceType: "tablet"});
	// DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform);
	BAsket.app = new DevExpress.framework.html.HtmlApplication({
		namespace: BAsket,
		navigationType: P.layout,
		navigation: P.navigation,
		navigateToRootViewMode: true,
		//        disableViewCache: true
	    commandMapping: {
			'android-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] },
			'ios-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] },
			'tizen-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] },
			'generic-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] }
	    }
	});
	//Globalize.culture = Globalize.culture["ru-RU"];
	// Globalize.culture( "ru" );
	//$.preferCulture("ru-RU");
	// BAsket.app.viewShown.add(onViewShown);
	BAsket.app.router.register(":view/:Id", { view: "home", Id: undefined });
	BAsket.app.navigate();
	//    BAsket.app.navigate('Index');  
};

//type: 'info'|'warning'|'error'|'success', default == "success"
BAsket.notify = function(message, type, time) {
	if (!type) type = "success";
	if (!time) time = 1000;
	DevExpress.ui.notify(message, type, time);
};

BAsket.error = function(message) {
	BAsket.notify(message, "error", 5000);
};

// var _ = EN_US;

﻿/// *** Data Test PetroProduct *** ///
var DAL_tst = (function ($, window) {
    var root = {};

    root.NMS_Data = new DevExpress.data.DataSource(new DevExpress.data.ArrayStore([
        {'IdP': 0, 'Id': 1, 'N': "Factory"},
        {'IdP': 0, 'Id': 2, 'N': "TypeOfPayment"},
        {'IdP': 0, 'Id': 10, 'N': "Product Properties"},
        {'IdP': 0, 'Id': 20, 'N': "Client Properties"},
        {'IdP': 0, 'Id': 101, 'N': "Reports"},
    	{'IdP': 1, 'Id': 16, 'N': "BAsket Ltd"},
    	{'IdP': 2, 'Id': 1, 'N': "cash"},
        {'IdP': 2, 'Id': 2, 'N': "bank"},
        {'IdP': 10, 'Id': 1, 'N': "Pack"},
    	{'IdP': 10, 'Id': 2, 'N': "Manufacturer"},
        {'IdP': 101, 'Id': 1, 'N': "Report 1"}

        // {'IdP': 0, 'Id': 1, 'N': "Предприятие"},
        // {'IdP': 0, 'Id': 2, 'N': "Тип Оплаты"},
        // {'IdP': 0, 'Id': 10, 'N': "Product Properties"},
        // {'IdP': 0, 'Id': 20, 'N': "Client Properties"},
        // {'IdP': 0, 'Id': 101, 'N': "Reports"},
        // {'IdP': 1, 'Id': 16, 'N': "BAsket ООО"},
        // {'IdP': 1, 'Id': 18, 'N': "ЧП BAsket"},
        // {'IdP': 2, 'Id': 1, 'N': "наличные"},
        // {'IdP': 2, 'Id': 2, 'N': "безнал"},
        // {'IdP': 10, 'Id': 1, 'N': "Упаковка"},
        // {'IdP': 10, 'Id': 2, 'N': "Производитель"},
        // {'IdP': 101, 'Id': 1, 'N': "Отчет 1"}
    ]));

    root.Categories_Data = new DevExpress.data.DataSource({pageSize: P.maxSizeLocalDb, store: new DevExpress.data.ArrayStore([
        {"Id":"-1","N":"Beverages"},{"Id":"-2","N":"Condiments"},{"Id":"-3","N":"Confections"},{"Id":"-4","N":"Dairy Products"},{"Id":"-5","N":"Grains/Cereals"},{"Id":"-6","N":"Meat/Poultry"},{"Id":"-7","N":"Produce"},{"Id":"-8","N":"Seafood"}
    ])});

    root.Products_Data = new DevExpress.data.DataSource({pageSize: P.maxSizeLocalDb, store: new DevExpress.data.ArrayStore([
        {"Id":"3","IdP":"-2","N":"Aniseed Syrup","N1":"12 - 550 ml bottles","N2":"Exotic Liquids","N3":"","N4":"","O":"13","P":10.0000},{"Id":"40","IdP":"-8","N":"Boston Crab Meat","N1":"24 - 4 oz tins","N2":"New England Seafood Cannery","N3":"","N4":"","O":"123","P":18.4000},{"Id":"60","IdP":"-4","N":"Camembert Pierrot","N1":"15 - 300 g rounds","N2":"Gai pâturage","N3":"","N4":"","O":"19","P":34.0000},{"Id":"18","IdP":"-8","N":"Carnarvon Tigers","N1":"16 kg pkg.","N2":"Pavlova, Ltd.","N3":"","N4":"","O":"42","P":62.5000},{"Id":"1","IdP":"-1","N":"Chai","N1":"10 boxes x 20 bags","N2":"Exotic Liquids","N3":"","N4":"","O":"39","P":18.0000},{"Id":"2","IdP":"-1","N":"Chang","N1":"24 - 12 oz bottles","N2":"Exotic Liquids","N3":"","N4":"","O":"17","P":19.0000},{"Id":"39","IdP":"-1","N":"Chartreuse verte","N1":"750 cc per bottle","N2":"Aux joyeux ecclésiastiques","N3":"","N4":"","O":"69","P":18.0000},{"Id":"4","IdP":"-2","N":"Chef Anton's Cajun Seasoning","N1":"48 - 6 oz jars","N2":"New Orleans Cajun Delights","N3":"","N4":"","O":"53","P":22.0000},{"Id":"48","IdP":"-3","N":"Chocolade","N1":"10 pkgs.","N2":"Zaanse Snoepfabriek","N3":"","N4":"","O":"15","P":12.7500},{"Id":"38","IdP":"-1","N":"Côte de Blaye","N1":"12 - 75 cl bottles","N2":"Aux joyeux ecclésiastiques","N3":"","N4":"","O":"17","P":263.5000},{"Id":"58","IdP":"-8","N":"Escargots de Bourgogne","N1":"24 pieces","N2":"Escargots Nouveaux","N3":"","N4":"","O":"62","P":13.2500},{"Id":"52","IdP":"-5","N":"Filo Mix","N1":"16 - 2 kg boxes","N2":"G'day, Mate","N3":"","N4":"","O":"38","P":7.0000},{"Id":"71","IdP":"-4","N":"Flotemysost","N1":"10 - 500 g pkgs.","N2":"Norske Meierier","N3":"","N4":"","O":"26","P":21.5000},{"Id":"33","IdP":"-4","N":"Geitost","N1":"500 g","N2":"Norske Meierier","N3":"","N4":"","O":"112","P":2.5000},{"Id":"15","IdP":"-2","N":"Genen Shouyu","N1":"24 - 250 ml bottles","N2":"Mayumi's","N3":"","N4":"","O":"39","P":15.5000},{"Id":"56","IdP":"-5","N":"Gnocchi di nonna Alice","N1":"24 - 250 g pkgs.","N2":"Pasta Buttini s.r.l.","N3":"","N4":"","O":"21","P":38.0000},{"Id":"6","IdP":"-2","N":"Grandma's Boysenberry Spread","N1":"12 - 8 oz jars","N2":"Grandma Kelly's Homestead","N3":"","N4":"","O":"120","P":25.0000},{"Id":"37","IdP":"-8","N":"Gravad lax","N1":"12 - 500 g pkgs.","N2":"Svensk Sjöföda AB","N3":"","N4":"","O":"11","P":26.0000},{"Id":"24","IdP":"-1","N":"Guaraná Fantástica","N1":"12 - 355 ml cans","N2":"Refrescos Americanas LTDA","N3":"","N4":"","O":"20","P":4.5000},{"Id":"69","IdP":"-4","N":"Gudbrandsdalsost","N1":"10 kg pkg.","N2":"Norske Meierier","N3":"","N4":"","O":"26","P":36.0000},{"Id":"44","IdP":"-2","N":"Gula Malacca","N1":"20 - 2 kg bags","N2":"Leka Trading","N3":"","N4":"","O":"27","P":19.4500},{"Id":"26","IdP":"-3","N":"Gumbär Gummibärchen","N1":"100 - 250 g bags","N2":"Heli Süßwaren GmbH & Co. KG","N3":"","N4":"","O":"15","P":31.2300},{"Id":"22","IdP":"-5","N":"Gustaf's Knäckebröd","N1":"24 - 500 g pkgs.","N2":"PB Knäckebröd AB","N3":"","N4":"","O":"104","P":21.0000},{"Id":"10","IdP":"-8","N":"Ikura","N1":"12 - 200 ml jars","N2":"Tokyo Traders","N3":"","N4":"","O":"31","P":31.0000},{"Id":"36","IdP":"-8","N":"Inlagd Sill","N1":"24 - 250 g  jars","N2":"Svensk Sjöföda AB","N3":"","N4":"","O":"112","P":19.0000},{"Id":"43","IdP":"-1","N":"Ipoh Coffee","N1":"16 - 500 g tins","N2":"Leka Trading","N3":"","N4":"","O":"17","P":46.0000},{"Id":"41","IdP":"-8","N":"Jack's New England Clam Chowder","N1":"12 - 12 oz cans","N2":"New England Seafood Cannery","N3":"","N4":"","O":"85","P":9.6500},{"Id":"13","IdP":"-8","N":"Konbu","N1":"2 kg box","N2":"Mayumi's","N3":"","N4":"","O":"24","P":6.0000},{"Id":"76","IdP":"-1","N":"Lakkalikööri","N1":"500 ml","N2":"Karkki Oy","N3":"","N4":"","O":"57","P":18.0000},{"Id":"67","IdP":"-1","N":"Laughing Lumberjack Lager","N1":"24 - 12 oz bottles","N2":"Bigfoot Breweries","N3":"","N4":"","O":"52","P":14.0000},{"Id":"74","IdP":"-7","N":"Longlife Tofu","N1":"5 kg pkg.","N2":"Tokyo Traders","N3":"","N4":"","O":"4","P":10.0000},{"Id":"65","IdP":"-2","N":"Louisiana Fiery Hot Pepper Sauce","N1":"32 - 8 oz bottles","N2":"New Orleans Cajun Delights","N3":"","N4":"","O":"76","P":21.0500},{"Id":"66","IdP":"-2","N":"Louisiana Hot Spiced Okra","N1":"24 - 8 oz jars","N2":"New Orleans Cajun Delights","N3":"","N4":"","O":"4","P":17.0000},{"Id":"51","IdP":"-7","N":"Manjimup Dried Apples","N1":"50 - 300 g pkgs.","N2":"G'day, Mate","N3":"","N4":"","O":"20","P":53.0000},{"Id":"32","IdP":"-4","N":"Mascarpone Fabioli","N1":"24 - 200 g pkgs.","N2":"Formaggi Fortini s.r.l.","N3":"","N4":"","O":"9","P":32.0000},{"Id":"49","IdP":"-3","N":"Maxilaku","N1":"24 - 50 g pkgs.","N2":"Karkki Oy","N3":"","N4":"","O":"10","P":20.0000},{"Id":"9","IdP":"-6","N":"Mishi Kobe Niku","N1":"18 - 500 g pkgs.","N2":"Tokyo Traders","N3":"","N4":"","O":"29","P":97.0000},{"Id":"72","IdP":"-4","N":"Mozzarella di Giovanni","N1":"24 - 200 g pkgs.","N2":"Formaggi Fortini s.r.l.","N3":"","N4":"","O":"14","P":34.8000},{"Id":"30","IdP":"-8","N":"Nord-Ost Matjeshering","N1":"10 - 200 g glasses","N2":"Nord-Ost-Fisch Handelsgesellschaft mbH","N3":"","N4":"","O":"10","P":25.8900},{"Id":"8","IdP":"-2","N":"Northwoods Cranberry Sauce","N1":"12 - 12 oz jars","N2":"Grandma Kelly's Homestead","N3":"","N4":"","O":"6","P":40.0000},{"Id":"25","IdP":"-3","N":"NuNuCa Nuß-Nougat-Creme","N1":"20 - 450 g glasses","N2":"Heli Süßwaren GmbH & Co. KG","N3":"","N4":"","O":"76","P":14.0000},{"Id":"77","IdP":"-2","N":"Original Frankfurter grüne Soße","N1":"12 boxes","N2":"Plutzer Lebensmittelgroßmärkte AG","N3":"","N4":"","O":"32","P":13.0000},{"Id":"70","IdP":"-1","N":"Outback Lager","N1":"24 - 355 ml bottles","N2":"Pavlova, Ltd.","N3":"","N4":"","O":"15","P":15.0000},{"Id":"55","IdP":"-6","N":"Pâté chinois","N1":"24 boxes x 2 pies","N2":"Ma Maison","N3":"","N4":"","O":"115","P":24.0000},{"Id":"16","IdP":"-3","N":"Pavlova","N1":"32 - 500 g boxes","N2":"Pavlova, Ltd.","N3":"","N4":"","O":"29","P":17.4500},{"Id":"11","IdP":"-4","N":"Queso Cabrales","N1":"1 kg pkg.","N2":"Cooperativa de Quesos 'Las Cabras'","N3":"","N4":"","O":"22","P":21.0000},{"Id":"12","IdP":"-4","N":"Queso Manchego La Pastora","N1":"10 - 500 g pkgs.","N2":"Cooperativa de Quesos 'Las Cabras'","N3":"","N4":"","O":"86","P":38.0000},{"Id":"59","IdP":"-4","N":"Raclette Courdavault","N1":"5 kg pkg.","N2":"Gai pâturage","N3":"","N4":"","O":"79","P":55.0000},{"Id":"57","IdP":"-5","N":"Ravioli Angelo","N1":"24 - 250 g pkgs.","N2":"Pasta Buttini s.r.l.","N3":"","N4":"","O":"36","P":19.5000},{"Id":"75","IdP":"-1","N":"Rhönbräu Klosterbier","N1":"24 - 0.5 l bottles","N2":"Plutzer Lebensmittelgroßmärkte AG","N3":"","N4":"","O":"125","P":7.7500},{"Id":"73","IdP":"-8","N":"Röd Kaviar","N1":"24 - 150 g jars","N2":"Svensk Sjöföda AB","N3":"","N4":"","O":"101","P":15.0000},{"Id":"45","IdP":"-8","N":"Rogede sild","N1":"1k pkg.","N2":"Lyngbysild","N3":"","N4":"","O":"5","P":9.5000},{"Id":"28","IdP":"-7","N":"Rössle Sauerkraut","N1":"25 - 825 g cans","N2":"Plutzer Lebensmittelgroßmärkte AG","N3":"","N4":"","O":"26","P":45.6000},{"Id":"34","IdP":"-1","N":"Sasquatch Ale","N1":"24 - 12 oz bottles","N2":"Bigfoot Breweries","N3":"","N4":"","O":"111","P":14.0000},{"Id":"27","IdP":"-3","N":"Schoggi Schokolade","N1":"100 - 100 g pieces","N2":"Heli Süßwaren GmbH & Co. KG","N3":"","N4":"","O":"49","P":43.9000},{"Id":"68","IdP":"-3","N":"Scottish Longbreads","N1":"10 boxes x 8 pieces","N2":"Specialty Biscuits, Ltd.","N3":"","N4":"","O":"6","P":12.5000},{"Id":"42","IdP":"-5","N":"Singaporean Hokkien Fried Mee","N1":"32 - 1 kg pkgs.","N2":"Leka Trading","N3":"","N4":"","O":"26","P":14.0000},{"Id":"20","IdP":"-3","N":"Sir Rodney's Marmalade","N1":"30 gift boxes","N2":"Specialty Biscuits, Ltd.","N3":"","N4":"","O":"40","P":81.0000},{"Id":"21","IdP":"-3","N":"Sir Rodney's Scones","N1":"24 pkgs. x 4 pieces","N2":"Specialty Biscuits, Ltd.","N3":"","N4":"","O":"3","P":10.0000},{"Id":"61","IdP":"-2","N":"Sirop d'érable","N1":"24 - 500 ml bottles","N2":"Forêts d'érables","N3":"","N4":"","O":"113","P":28.5000},{"Id":"46","IdP":"-8","N":"Spegesild","N1":"4 - 450 g glasses","N2":"Lyngbysild","N3":"","N4":"","O":"95","P":12.0000},{"Id":"35","IdP":"-1","N":"Steeleye Stout","N1":"24 - 12 oz bottles","N2":"Bigfoot Breweries","N3":"","N4":"","O":"20","P":18.0000},{"Id":"62","IdP":"-3","N":"Tarte au sucre","N1":"48 pies","N2":"Forêts d'érables","N3":"","N4":"","O":"17","P":49.3000},{"Id":"19","IdP":"-3","N":"Teatime Chocolate Biscuits","N1":"10 boxes x 12 pieces","N2":"Specialty Biscuits, Ltd.","N3":"","N4":"","O":"25","P":9.2000},{"Id":"14","IdP":"-7","N":"Tofu","N1":"40 - 100 g pkgs.","N2":"Mayumi's","N3":"","N4":"","O":"35","P":23.2500},{"Id":"54","IdP":"-6","N":"Tourtière","N1":"16 pies","N2":"Ma Maison","N3":"","N4":"","O":"21","P":7.4500},{"Id":"23","IdP":"-5","N":"Tunnbröd","N1":"12 - 250 g pkgs.","N2":"PB Knäckebröd AB","N3":"","N4":"","O":"61","P":9.0000},{"Id":"7","IdP":"-7","N":"Uncle Bob's Organic Dried Pears","N1":"12 - 1 lb pkgs.","N2":"Grandma Kelly's Homestead","N3":"","N4":"","O":"15","P":30.0000},{"Id":"50","IdP":"-3","N":"Valkoinen suklaa","N1":"12 - 100 g bars","N2":"Karkki Oy","N3":"","N4":"","O":"65","P":16.2500},{"Id":"63","IdP":"-2","N":"Vegie-spread","N1":"15 - 625 g jars","N2":"Pavlova, Ltd.","N3":"","N4":"","O":"24","P":43.9000},{"Id":"64","IdP":"-5","N":"Wimmers gute Semmelknödel","N1":"20 bags x 4 pieces","N2":"Plutzer Lebensmittelgroßmärkte AG","N3":"","N4":"","O":"22","P":33.2500},{"Id":"47","IdP":"-3","N":"Zaanse koeken","N1":"10 - 4 oz boxes","N2":"Zaanse Snoepfabriek","N3":"","N4":"","O":"36","P":9.5000}
    ])});

    root.Clients_Data = new DevExpress.data.DataSource({pageSize: P.maxSizeLocalDb, store: new DevExpress.data.ArrayStore([
        {"Id":"ALFKI","IdP":"","N":"Alfreds Futterkiste","N1":"","N2":"","A":"Obere Str. 57, Berlin, 12209, Germany"},{"Id":"ALFKI1","IdP":"ALFKI","N":"Alfreds Futterkiste 1","N1":"","N2":"","A":"Obere Str. 157, Berlin, 12209, Germany"},{"Id":"ALFKI2","IdP":"ALFKI","N":"Alfreds Futterkiste 2","N1":"","N2":"","A":"Obere Str. 257, Berlin, 12209, Germany"},{"Id":"ANATR","IdP":"","N":"Ana Trujillo Emparedados y helados","N1":"","N2":"","A":"Avda. de la Constitución 2222, México D.F., 05021, Mexico"},{"Id":"ANTON","IdP":"","N":"Antonio Moreno Taquería","N1":"","N2":"","A":"Mataderos  2312, México D.F., 05023, Mexico"},{"Id":"AROUT","IdP":"","N":"Around the Horn","N1":"","N2":"","A":"120 Hanover Sq., London, WA1 1DP, UK"},{"Id":"AROUT1","IdP":"AROUT","N":"Around the Horn 1","N1":"","N2":"","A":"121 Hanover Sq., London, WA1 1DP, UK"},{"Id":"AROUT2","IdP":"AROUT","N":"Around the Horn 2","N1":"","N2":"","A":"122 Hanover Sq., London, WA1 1DP, UK"},{"Id":"AROUT3","IdP":"AROUT","N":"Around the Horn 3","N1":"","N2":"","A":"123 Hanover Sq., London, WA1 1DP, UK"},{"Id":"BERGS","IdP":"","N":"Berglunds snabbköp","N1":"","N2":"","A":"Berguvsvägen  8, Luleå, S-958 22, Sweden"},{"Id":"BLAUS","IdP":"","N":"Blauer See Delikatessen","N1":"","N2":"","A":"Forsterstr. 57, Mannheim, 68306, Germany"},{"Id":"BLONP","IdP":"","N":"Blondesddsl père et fils","N1":"","N2":"","A":"24, place Kléber, Strasbourg, 67000, France"},{"Id":"BOLID","IdP":"","N":"Bólido Comidas preparadas","N1":"","N2":"","A":"C/ Araquil, 67, Madrid, 28023, Spain"},{"Id":"BONAP","IdP":"","N":"Bon app''","N1":"","N2":"","A":"12, rue des Bouchers, Marseille, 13008, France"},{"Id":"BOTTM","IdP":"","N":"Bottom-Dollar Markets","N1":"","N2":"","A":"23 Tsawassen Blvd., Tsawassen, T2F 8M4, Canada"},{"Id":"BSBEV","IdP":"","N":"B''s Beverages","N1":"","N2":"","A":"Fauntleroy Circus, London, EC2 5NT, UK"},{"Id":"CACTU","IdP":"","N":"Cactus Comidas para llevar","N1":"","N2":"","A":"Cerrito 333, Buenos Aires, 1010, Argentina"},{"Id":"CENTC","IdP":"","N":"Centro comercial Moctezuma","N1":"","N2":"","A":"Sierras de Granada 9993, México D.F., 05022, Mexico"},{"Id":"CHOPS","IdP":"","N":"Chop-suey Chinese","N1":"","N2":"","A":"Hauptstr. 29, Bern, 3012, Switzerland"},{"Id":"COMMI","IdP":"","N":"Comércio Mineiro","N1":"","N2":"","A":"Av. dos Lusíadas, 23, Sao Paulo, 05432-043, Brazil"},{"Id":"CONSH","IdP":"","N":"Consolidated Holdings","N1":"","N2":"","A":"Berkeley Gardens 12  Brewery, London, WX1 6LT, UK"},{"Id":"WANDK","IdP":"","N":"Die Wandernde Kuh","N1":"","N2":"","A":"Adenauerallee 900, Stuttgart, 70563, Germany"},{"Id":"DRACD","IdP":"","N":"Drachenblut Delikatessen","N1":"","N2":"","A":"Walserweg 21, Aachen, 52066, Germany"},{"Id":"DUMON","IdP":"","N":"Du monde entier","N1":"","N2":"","A":"67, rue des Cinquante Otages, Nantes, 44000, France"},{"Id":"EASTC","IdP":"","N":"Eastern Connection","N1":"","N2":"","A":"35 King George, London, WX3 6FW, UK"},{"Id":"ERNSH","IdP":"","N":"Ernst Handel","N1":"","N2":"","A":"Kirchgasse 6, Graz, 8010, Austria"},{"Id":"FAMIA","IdP":"","N":"Familia Arquibaldo","N1":"","N2":"","A":"Rua Orós, 92, Sao Paulo, 05442-030, Brazil"},{"Id":"FISSA","IdP":"","N":"FISSA Fabrica Inter. Salchichas S.A.","N1":"","N2":"","A":"C/ Moralzarzal, 86, Madrid, 28034, Spain"},{"Id":"FOLIG","IdP":"","N":"Folies gourmandes","N1":"","N2":"","A":"184, chaussée de Tournai, Lille, 59000, France"},{"Id":"FOLKO","IdP":"","N":"Folk och fä HB","N1":"","N2":"","A":"Åkergatan 24, Bräcke, S-844 67, Sweden"},{"Id":"FRANR","IdP":"","N":"France restauration","N1":"","N2":"","A":"54, rue Royale, Nantes, 44000, France"},{"Id":"FRANS","IdP":"","N":"Franchi S.p.A.","N1":"","N2":"","A":"Via Monte Bianco 34, Torino, 10100, Italy"},{"Id":"FRANK","IdP":"","N":"Frankenversand","N1":"","N2":"","A":"Berliner Platz 43, München, 80805, Germany"},{"Id":"FURIB","IdP":"","N":"Furia Bacalhau e Frutos do Mar","N1":"","N2":"","A":"Jardim das rosas n. 32, Lisboa, 1675, Portugal"},{"Id":"GALED","IdP":"","N":"Galería del gastrónomo","N1":"","N2":"","A":"Rambla de Cataluña, 23, Barcelona, 08022, Spain"},{"Id":"GODOS","IdP":"","N":"Godos Cocina Típica","N1":"","N2":"","A":"C/ Romero, 33, Sevilla, 41101, Spain"},{"Id":"GOURL","IdP":"","N":"Gourmet Lanchonetes","N1":"","N2":"","A":"Av. Brasil, 442, Campinas, 04876-786, Brazil"},{"Id":"GREAL","IdP":"","N":"Great Lakes Food Market","N1":"","N2":"","A":"2732 Baker Blvd., Eugene, 97403, USA"},{"Id":"GROSR","IdP":"","N":"GROSELLA-Restaurante","N1":"","N2":"","A":"5ª Ave. Los Palos Grandes, Caracas, 1081, Venezuela"},{"Id":"HANAR","IdP":"","N":"Hanari Carnes","N1":"","N2":"","A":"Rua do Paço, 67, Rio de Janeiro, 05454-876, Brazil"},{"Id":"HILAA","IdP":"","N":"HILARION-Abastos","N1":"","N2":"","A":"Carrera 22 con Ave. Carlos Soublette #8-35, San Cristóbal, 5022, Venezuela"},{"Id":"HUNGC","IdP":"","N":"Hungry Coyote Import Store","N1":"","N2":"","A":"City Center Plaza 516 Main St., Elgin, 97827, USA"},{"Id":"HUNGO","IdP":"","N":"Hungry Owl All-Night Grocers","N1":"","N2":"","A":""},{"Id":"ISLAT","IdP":"","N":"Island Trading","N1":"","N2":"","A":"Garden House Crowther Way, Cowes, PO31 7PJ, UK"},{"Id":"KOENE","IdP":"","N":"Königlich Essen","N1":"","N2":"","A":"Maubelstr. 90, Brandenburg, 14776, Germany"},{"Id":"LACOR","IdP":"","N":"La corne d''abondance","N1":"","N2":"","A":"67, avenue de l''Europe, Versailles, 78000, France"},{"Id":"LAMAI","IdP":"","N":"La maison d''Asie","N1":"","N2":"","A":"1 rue Alsace-Lorraine, Toulouse, 31000, France"},{"Id":"LAUGB","IdP":"","N":"Laughing Bacchus Wine Cellars","N1":"","N2":"","A":"1900 Oak St., Vancouver, V3F 2K1, Canada"},{"Id":"LAZYK","IdP":"","N":"Lazy K Kountry Store","N1":"","N2":"","A":"12 Orchestra Terrace, Walla Walla, 99362, USA"},{"Id":"LEHMS","IdP":"","N":"Lehmanns Marktstand","N1":"","N2":"","A":"Magazinweg 7, Frankfurt a.M., 60528, Germany"},{"Id":"LETSS","IdP":"","N":"Let''s Stop N Shop","N1":"","N2":"","A":"87 Polk St. Suite 5, San Francisco, 94117, USA"},{"Id":"LILAS","IdP":"","N":"LILA-Supermercado","N1":"","N2":"","A":"Carrera 52 con Ave. Bolívar #65-98 Llano Largo, Barquisimeto, 3508, Venezuela"},{"Id":"LINOD","IdP":"","N":"LINO-Delicateses","N1":"","N2":"","A":"Ave. 5 de Mayo Porlamar, I. de Margarita, 4980, Venezuela"},{"Id":"LONEP","IdP":"","N":"Lonesome Pine Restaurant","N1":"","N2":"","A":"89 Chiaroscuro Rd., Portland, 97219, USA"},{"Id":"MAGAA","IdP":"","N":"Magazzini Alimentari Riuniti","N1":"","N2":"","A":"Via Ludovico il Moro 22, Bergamo, 24100, Italy"},{"Id":"MAISD","IdP":"","N":"Maison Dewey","N1":"","N2":"","A":"Rue Joseph-Bens 532, Bruxelles, B-1180, Belgium"},{"Id":"MEREP","IdP":"","N":"Mère Paillarde","N1":"","N2":"","A":"43 rue St. Laurent, Montréal, H1J 1C3, Canada"},{"Id":"MORGK","IdP":"","N":"Morgenstern Gesundkost","N1":"","N2":"","A":"Heerstr. 22, Leipzig, 04179, Germany"},{"Id":"NORTS","IdP":"","N":"North/South","N1":"","N2":"","A":"South House 300 Queensbridge, London, SW7 1RZ, UK"},{"Id":"OCEAN","IdP":"","N":"Océano Atlántico Ltda.","N1":"","N2":"","A":"Ing. Gustavo Moncada 8585 Piso 20-A, Buenos Aires, 1010, Argentina"},{"Id":"OLDWO","IdP":"","N":"Old World Delicatessen","N1":"","N2":"","A":"2743 Bering St., Anchorage, 99508, USA"},{"Id":"OTTIK","IdP":"","N":"Ottilies Käseladen","N1":"","N2":"","A":"Mehrheimerstr. 369, Köln, 50739, Germany"},{"Id":"PARIS","IdP":"","N":"Paris spécialités","N1":"","N2":"","A":"265, boulevard Charonne, Paris, 75012, France"},{"Id":"PERIC","IdP":"","N":"Pericles Comidas clásicas","N1":"","N2":"","A":"Calle Dr. Jorge Cash 321, México D.F., 05033, Mexico"},{"Id":"PICCO","IdP":"","N":"Piccolo und mehr","N1":"","N2":"","A":"Geislweg 14, Salzburg, 5020, Austria"},{"Id":"PRINI","IdP":"","N":"Princesa Isabel Vinhos","N1":"","N2":"","A":"Estrada da saúde n. 58, Lisboa, 1756, Portugal"},{"Id":"QUEDE","IdP":"","N":"Que Delícia","N1":"","N2":"","A":"Rua da Panificadora, 12, Rio de Janeiro, 02389-673, Brazil"},{"Id":"QUEEN","IdP":"","N":"Queen Cozinha","N1":"","N2":"","A":"Alameda dos Canàrios, 891, Sao Paulo, 05487-020, Brazil"},{"Id":"QUICK","IdP":"","N":"QUICK-Stop","N1":"","N2":"","A":"Taucherstraße 10, Cunewalde, 01307, Germany"},{"Id":"RANCH","IdP":"","N":"Rancho grande","N1":"","N2":"","A":"Av. del Libertador 900, Buenos Aires, 1010, Argentina"},{"Id":"RATTC","IdP":"","N":"Rattlesnake Canyon Grocery","N1":"","N2":"","A":"2817 Milton Dr., Albuquerque, 87110, USA"},{"Id":"REGGC","IdP":"","N":"Reggiani Caseifici","N1":"","N2":"","A":"Strada Provinciale 124, Reggio Emilia, 42100, Italy"},{"Id":"RICAR","IdP":"","N":"Ricardo Adocicados","N1":"","N2":"","A":"Av. Copacabana, 267, Rio de Janeiro, 02389-890, Brazil"},{"Id":"RICSU","IdP":"","N":"Richter Supermarkt","N1":"","N2":"","A":"Grenzacherweg 237, Genève, 1203, Switzerland"},{"Id":"ROMEY","IdP":"","N":"Romero y tomillo","N1":"","N2":"","A":"Gran Vía, 1, Madrid, 28001, Spain"},{"Id":"SANTG","IdP":"","N":"Santé Gourmet","N1":"","N2":"","A":"Erling Skakkes gate 78, Stavern, 4110, Norway"},{"Id":"SAVEA","IdP":"","N":"Save-a-lot Markets","N1":"","N2":"","A":"187 Suffolk Ln., Boise, 83720, USA"},{"Id":"SEVES","IdP":"","N":"Seven Seas Imports","N1":"","N2":"","A":"90 Wadhurst Rd., London, OX15 4NB, UK"},{"Id":"SIMOB","IdP":"","N":"Simons bistro","N1":"","N2":"","A":"Vinbæltet 34, Kobenhavn, 1734, Denmark"},{"Id":"SPECD","IdP":"","N":"Spécialités du monde","N1":"","N2":"","A":"25, rue Lauriston, Paris, 75016, France"},{"Id":"SPLIR","IdP":"","N":"Split Rail Beer & Ale","N1":"","N2":"","A":"P.O. Box 555, Lander, 82520, USA"},{"Id":"SUPRD","IdP":"","N":"Suprêmes délices","N1":"","N2":"","A":"Boulevard Tirou, 255, Charleroi, B-6000, Belgium"},{"Id":"THEBI","IdP":"","N":"The Big Cheese","N1":"","N2":"","A":"89 Jefferson Way Suite 2, Portland, 97201, USA"},{"Id":"THECR","IdP":"","N":"The Cracker Box","N1":"","N2":"","A":"55 Grizzly Peak Rd., Butte, 59801, USA"},{"Id":"TOMSP","IdP":"","N":"Toms Spezialitäten","N1":"","N2":"","A":"Luisenstr. 48, Münster, 44087, Germany"},{"Id":"TORTU","IdP":"","N":"Tortuga Restaurante","N1":"","N2":"","A":"Avda. Azteca 123, México D.F., 05033, Mexico"},{"Id":"TRADH","IdP":"","N":"Tradição Hipermercados","N1":"","N2":"","A":"Av. Inês de Castro, 414, Sao Paulo, 05634-030, Brazil"},{"Id":"TRAIH","IdP":"","N":"Trail''s Head Gourmet Provisioners","N1":"","N2":"","A":"722 DaVinci Blvd., Kirkland, 98034, USA"},{"Id":"VAFFE","IdP":"","N":"Vaffeljernet","N1":"","N2":"","A":"Smagsloget 45, Århus, 8200, Denmark"},{"Id":"VICTE","IdP":"","N":"Victuailles en stock","N1":"","N2":"","A":"2, rue du Commerce, Lyon, 69004, France"},{"Id":"VINET","IdP":"","N":"Vins et alcools Chevalier","N1":"","N2":"","A":"59 rue de l''Abbaye, Reims, 51100, France"},{"Id":"WARTH","IdP":"","N":"Wartian Herkku","N1":"","N2":"","A":"Torikatu 38, Oulu, 90110, Finland"},{"Id":"WELLI","IdP":"","N":"Wellington Importadora","N1":"","N2":"","A":"Rua do Mercado, 12, Resende, 08737-363, Brazil"},{"Id":"WHITC","IdP":"","N":"White Clover Markets","N1":"","N2":"","A":"305 - 14th Ave. S. Suite 3B, Seattle, 98128, USA"},{"Id":"WILMK","IdP":"","N":"Wilman Kala","N1":"","N2":"","A":"Keskuskatu 45, Helsinki, 21240, Finland"},{"Id":"WOLZA","IdP":"","N":"Wolski  Zajazd","N1":"","N2":"","A":"ul. Filtrowa 68, Warszawa, 01-012, Poland"}
    ])});

    root.RoadMap_Data = function (date) {
        var ret = [{"Id":"1","IdC":"ALFKI","IdT":"ALFKI1","IdB":"","D":"2014-02-26","Npp":"1","Note":"","N1":"Alfreds Futterkiste - Alfreds Futterkiste 1","N2":"Obere Str. 157, Berlin, 12209, Germany","N3":"ALFKI1"},{"Id":"2","IdC":"BLAUS","IdT":"","IdB":"","D":"2014-02-26","Npp":"2","Note":"","N1":"Blauer See Delikatessen","N2":"Forsterstr. 57, Mannheim, 68306, Germany","N3":"BLAUS"},{"Id":"3","IdC":"QUICK","IdT":"","IdB":"","D":"2014-02-26","Npp":"3","Note":"","N1":"QUICK-Stop","N2":"Taucherstraße 10, Cunewalde, 01307, Germany","N3":"QUICK"},{"Id":"4","IdC":"OTTIK","IdT":"","IdB":"","D":"2014-02-26","Npp":"4","Note":"","N1":"Ottilies Käseladen","N2":"Mehrheimerstr. 369, Köln, 50739, Germany","N3":"OTTIK"},{"Id":"5","IdC":"DRACD","IdT":"","IdB":"","D":"2014-02-26","Npp":"5","Note":"","N1":"Drachenblut Delikatessen","N2":"Walserweg 21, Aachen, 52066, Germany","N3":"DRACD"}];
        for (var i in ret) ret[i].D = date;

        return new DevExpress.data.DataSource({pageSize: P.maxSizeLocalDb, store: new DevExpress.data.ArrayStore(ret)});
    }

    return root;
})(jQuery, window);
﻿/// *** Web REST Data Access *** ///
var DAL_web = (function ($, window) {
	var root = {};

    if (!window.localStorage.getItem("dataSouceUrl") && !window['DAL_tst'])
        P.LoadFile('js/DAL_tst.js', 'js');
    
    root.TestConnect = function (params) {
    	if (!P.dataSouceUrl) return;
    	$.ajax({ type: 'GET', url: P.dataSouceUrl + 'Nms',
			xhrFields: { withCredentials: true}, headers: P.ajaxHeaders,
			success: function(result) {
				BAsket.notify('Connection is OK ' + P.dataSouceUrl);
			},
			error: function(result, arg) {
                BAsket.error('Connection is FAIL ' + result.statusText + ': ' + result.status);
			}
		})
    	// return execMethod({  method: 'GET', control: 'Nms' });    
	}

    root.NMS = function (params) {
        if (!P.dataSouceUrl)
            return DAL_tst.NMS_Data;
        return execDataSource({ control: 'Nms' });
    };
	root.Categories = function (params) {
		if (!P.dataSouceUrl)
			return DAL_tst.Categories_Data;

		return execDataSource({ control: 'Categories', lookup: true });
	};
	root.Products = function (params) {
		if (!P.dataSouceUrl)
			return DAL_tst.Products_Data;
        var control = 'Products';
        if (params.pId == 'ost')
            control = 'ProdStock';

		return execDataSource({
			control: control, paging: true,
			prm: {
				pId: params.pId,
				searchString: params.search
			}
		}, function (data) {
			var bFound = false;
			for (var i in P.arrayBAsket) {
				if (P.arrayBAsket[i].Id == data.Id) {
					data.Quant = P.arrayBAsket[i].Quant;
					bFound = true;
				}
			}
			if (!bFound)
				data.Quant = '';
            //data.Name = data.N;
            //data.Price = data.P;
            //data.Ostat = data.O;
			return data;
		});
	};
	root.ProductDetails = function(params) {
		execDataSource({ control: 'Products/' + params.Id }).load()
			.done(function(data) {
				var quant = '0';
                data[0] = P.setQuantToWar(data[0]);
				// for (var i in P.arrayBAsket) {
				// 	if (P.arrayBAsket[i].Id == data[0].Id) {
				// 		quant = P.arrayBAsket[i].Quant;
				// 	}
				// };
				params.model.Name(data[0].N);
				params.model.Price(data[0].P.toFixed(2));
				params.model.N1(data[0].N1);
				params.model.N2(data[0].N2);
				params.model.N3(data[0].N3);
				params.model.N4(data[0].N4);
				params.model.Ostat(data[0].O);
				params.model.Quant(data[0].Quant);
			});
	};
	root.ProductsByWars = function(params) {
		return execDataSource({ control: 'Products/', prm: { w: params }}, function (data) {
            return P.setQuantToWar(data);
        }).load();
	};

	root.Clients = function (params) {
		if (!P.dataSouceUrl)
			return DAL_tst.Clients_Data;

		var param = { control: 'Clients', paging: true, prm: {} };
		if (params) {
			if (params.search)
				param['prm'] = { searchString: params.search };
			else
				param['prm'] = params;
		} else
			param['lookup'] = true;

		return execDataSource(param, function (data) {
            data.Name = data.N;
            data.Adres = data.A;
            return data;
        });
	};
	root.ClientsPar = function(params) {
		return execDataSource({ control: 'Clients/' + params, prm: { fil: true } }, function (data) {
            data.Name = data.N;
            data.Adres = data.A;
            return data;
        });
	};
	root.ClientById = function(params) {
		return execDataSource({ control: 'Clients/' + params }, function (data) {
            data.Name = data.N;
            data.Adres = data.A;
            return data;
        });
	};

	root.Bil = function(params) {
		return execDataSource({ control: 'Bil', paging: true, prm: {searchString: params.search}}, function (data) {
            data.Name = data.N1;
            data.Adres = data.N2;
            data.ShortDate = data.DateDoc.substring(0, 5);
            return data;
        });
	};
	root.BilById = function(params) {
		return execDataSource({ control: 'Bil/' + params });
	};
	root.SaveBil = function(params) {
        params['cmd'] = 'SaveBil';
		return execMethod({ method: 'POST', control: 'Bil/', prm: params }).load();
	};
	root.DeleteBil = function(params) {
        params['cmd'] = 'DelBil';
		return execMethod({ method: 'POST', control: 'Bil/', prm: params }).load();
	};

    root.SendRepo = function(params) {
        params['cmd'] = 'SendRepo';
        return execMethod({ method: 'POST', control: 'Bil/', prm: params }).load();
    };

    root.RoadMap = function (params, allGt) {
        var date = U.DateFormat(params, 'yyyy-mm-dd')
        if (!P.dataSouceUrl && allGt)
			return DAL_tst.RoadMap_Data(date);

        prms = {'date': date};
        if (allGt)
            prms['allGt'] = true;
        
        return execDataSource({ control: 'RoadMap', paging: true, prm: prms}, function (data) {
            data.Name = data.N1;
            data.Adres = data.N2;
            return data;
        });
    }
    root.SaveRMBil = function (id, idb) {
        return execMethod({ method: 'POST', control: 'RoadMap/', prm: {'cmd': 'UpdIdB', 'Id':id, 'IdB':idb} }).load();
    }

	function execDataSource(params, mapCallback) {
		//P.getDeviceId();
		if (params.lookup)
			return new DevExpress.data.DataSource({
				pageSize: P.pageSize,
				load: function (loadOptions) {
					if (params.paging) {
						params.prm['skip'] = loadOptions.skip;
						params.prm['take'] = loadOptions.take;
					}
                    if (loadOptions.searchValue)
                        params.prm['searchString'] = loadOptions.searchValue;
					// return $.get(P.dataSouceUrl + params.control, params.prm)
					return $.ajax({
						url: P.dataSouceUrl + params.control,
						data: params.prm,
						xhrFields: {
							withCredentials: true
						},
						headers: P.ajaxHeaders
					})
                    .done(function (result) {
                        if (!result)
                            return null;
                    	var mapped = $.map(result, function (item) {
                    		if (mapCallback)
                    			return mapCallback(item)
                    		else
                    			return item;
                    	});
                    });
				},
				lookup: function (key) {
					return 'lookup';
				}
			});
		else
			return new DevExpress.data.DataSource({
				pageSize: P.pageSize,
				load: function (loadOptions) {
					if (params.paging) {
						params.prm['skip'] = loadOptions.skip;
						params.prm['take'] = loadOptions.take;
					}
					//                    return $.get(P.dataSouceUrl + params.control, params.prm);
					return $.ajax({
						type: "GET",
						url: P.dataSouceUrl + params.control,
						data: params.prm,
                        //crossDomain: true,
						xhrFields: {
							withCredentials: true
						},
						// beforeSend: function (xhrObj) {
							// xhrObj.setRequestHeader("Accept","application/json");
							// xhrObj.setRequestHeader("Authorization","Basic " + DevExpress.data.base64_encode([P.UserName, P.UserPassword].join(":")));
						// }
						headers: P.ajaxHeaders
					});
				},
				map: function (item) {
					if (mapCallback)
						return mapCallback(item)
					else
						return item;
				}
			});
	}

	function execMethod(params, mapCallback) {
		return new DevExpress.data.DataSource({
			pageSize: P.pageSize,
			load: function (loadOptions) {
				return $.ajax({
						type: params.method,
						url: P.dataSouceUrl + params.control,
						data: params.prm,
						xhrFields: {
							withCredentials: true
						},
						headers: P.ajaxHeaders,
						success: function(result) {
                            BAsket.notify(_.Common.ServerReply + result.Note);
						},
						error: function(result, arg) {
                            // BAsket.error(result.responseText);
                            BAsket.error(result.statusText + ': ' + result.status);
						}
					})
					.done(function(result) {
                        if (!result)
                            return null;
						var mapped = $.map(result, function(item) {
							if (mapCallback)
								return mapCallback(item);
							else
								return item;
						});
					});
			}
		});
	}

	return root;
})(jQuery, window);
/// *** local Web Data Base Access *** ///
function SQLite(cfg) {
    if (typeof window.openDatabase === 'undefined') {
        return;
    }    
    function log(str) {
        if (!console)
          console.log(str);
    }
    // Default Handlers
    function nullDataHandler(results) { }
    function errorHandler(error) {
        log('Oops. ' + error.message + ' (Code ' + error.code + ')');
    }

    var config = cfg || {}, db;

    config.shortName = config.shortName || 'BAsketDB';
    config.version = config.version || '1.0';
    config.displayName = config.displayName || 'BAsketDB SQLite Database';
    config.maxSize = P.maxSizeLocalDb;
    config.defaultErrorHandler = config.defaultErrorHandler || errorHandler;
    config.defaultDataHandler = config.defaultDataHandler || nullDataHandler;

    db = openDatabase(config.shortName, config.version, config.displayName, config.maxSize);

    function execute(query, v, d, e) {
        var values = v || [],
          dH = d || config.defaultDataHandler,
          eH = e || config.defaultErrorHandler;

        if (!query || query === '') {
          return;
        }

        function err(t, error) {
            eH(error, query);
        }

        function data(t, result) {
            d(t, result, query);
        }

        db.transaction(
            function (transaction) {
                transaction.executeSql(query, values, data, err);
            }
        );
    }

    return {
        database: db,
        executeSql: function (q, p, data, error) {
            execute(q, p, data, error);
        },
        transaction: function (e, error, data) {
        	if (!error) error = function (){} ;
        	if (!data) data = function (){} ;
            db.transaction(e, error, data)
        }
    }  
}

var DAL = (function ($, window) {
	var root = {};

	var dbLastQ = '';
    // var dbParam = null;
	// var dbName = 'BAsketDB';
	// var dbSize = 5000000;

    var DB = SQLite();
    var waitPanelSwitch = {};

	root.Products = function(params, nopaging) {
		if (!P.useWebDb)
			return DAL_web.Products(params);
		var paging = !nopaging;
		return execDataSource({
			query: "SELECT * FROM WAR WHERE IdP='" + params.pId + "' and O>0",
			paging: paging,
			searchString: params.search
		}, function(data) {
			var bFound = false;
			for (var i in P.arrayBAsket) {
				if (P.arrayBAsket[i].Id == data.Id) {
					data.Quant = P.arrayBAsket[i].Quant;
					bFound = true;
				}
			}
			if (!bFound)
				data.Quant = '';
			return data;
		});
	};
	root.ProductDetails = function(params) {
		if (!P.useWebDb)
			return DAL_web.ProductDetails(params);

		dbLastQ = "SELECT * FROM WAR WHERE Id='" + params.Id + "'";
		DB.executeSql(dbLastQ, [], function(tx, results) {
        // execQuery(dbLastQ).done(function(results) {
			params.Quant = '0';
			params = P.setQuantToWar(params);
			if (results.rows.length > 0) {
				params.model.Name(results.rows.item(0).N),
				params.model.Price(results.rows.item(0).P.toFixed(2))
				params.model.N1(results.rows.item(0).N1),
				params.model.N2(results.rows.item(0).N2),
				params.model.N3(results.rows.item(0).N3),
				params.model.N4(results.rows.item(0).N4),
				params.model.Ostat(results.rows.item(0).O),
				params.model.Quant(params.Quant)
			}
        })
		// }, function(err, err2) { errorCB("*readProductDetail sql*", err, err2); }	);
	};
	root.ProductsByWars = function (params) {
		var ids = '';
		P.arrayBAsket = [];
		var w = params.split(';');
		for (var i in w) {
			var v = w[i].split(':');
			if (v[0]) {
				P.arrayBAsket.push({ 'Id': v[0], 'Quant': v[1] });
				ids += "'" + v[0] + "',";
			}
		}
		if (!P.useWebDb)
			return DAL_web.ProductsByWars(params);

		return execQuery("SELECT * FROM WAR WHERE Id in (" + ids.substring(0, ids.length - 1) + ")",
            function (data) {
            	return P.setQuantToWar(data);
            });
	};

	root.Clients = function (params) {
		if (!P.useWebDb)
			return DAL_web.Clients(params);

		var param = { query: "SELECT * FROM CLI Where IdP='0' or IdP=''", paging: true };
		if (params && params.search)
			param.searchString = params.search;

		return execDataSource(param);
	};
	root.ClientsPar = function(params) {
		if (!P.useWebDb)
			return DAL_web.ClientsPar(params);

		return execDataSource({ query: "SELECT * FROM CLI Where IdP='" + params + "'" });
	};
	root.ClientById = function(params) {
		if (!P.useWebDb)
			return DAL_web.ClientById(params);
		return execDataSource({
			query: "SELECT c.*, par.N as ParName, IFNULL(par.N || ' - ' || c.N, c.N) as N2 " +
				"FROM CLI c Left Join CLI par On c.IdP=par.Id Where c.Id='" + params + "'"
		});
	};


	root.Bil = function (params, toServer) {
		if (!P.useWebDb || toServer)
			return DAL_web.Bil(params);

		return execDataSource({paging: true, searchString: params.search, searchReg: " and (c.N LIKE '%@%')",
			query: "SELECT b.*, c.N as N1, t.N as N2, substr(b.DateDoc,1,5) as ShortDate, " +
				"IFNULL(c.N || ' - ' || t.N, c.N) as Name, IFNULL(t.A, c.A) as Adres " +
				"FROM Bil b Join CLI c On b.IdC=c.Id Left Join CLI t On b.IdT=t.Id Where 1=1 # Order by bSusp, Id desc"
		});
	};
	root.BilById = function (params, toServer) {
		if (!P.useWebDb || toServer)
			return DAL_web.BilById(params);

		return execDataSource({ query: "SELECT b.*, c.N as N1, t.N as N2 FROM Bil b Join CLI c On b.IdC=c.Id Left Join CLI t On b.IdT=t.Id " +
            "WHERE b.Id='" + params + "'" });
	};

	root.SaveBil = function(params, toServer) {
		if (!P.useWebDb || toServer)
			return DAL_web.SaveBil(params);

		var query = "";
		if (!params['sOther']) params['sOther'] = '';
		if (!params['sNote']) params['sNote'] = '';
		if (!params['sWars']) params['sWars'] = '';
        if (!params['sumDoc']) params['sumDoc'] = '';
		if (params['id']) {
			query = "UPDATE Bil set DateDoc='" + params['date'] + "', IdC='" + params['IdC'] + "', IdT='" + params['IdT'] +
				"', SumDoc='" + params['sumDoc'] + "', Note='" + params['sNote'] + "', P1='" + params['sOther'] +
				"', Wars='" + params['sWars'] +
				"' WHERE Id='" + params['id'] + "'";
		} else {
			query = "INSERT INTO Bil (DateDoc, IdC, IdT, SumDoc, Note, P1, Wars, bSusp) VALUES('" + params['date'] +
				"', '" + params['IdC'] + "','" + params['IdT'] + "','" + params['sumDoc'] + "','" + params['sNote'] +
				"', '" + params['sOther'] + "', '" + params['sWars'] + "', 0)";
		};
		return execQuery(query);
	};
    root.ChangeActivityBil = function (params) {
        return execQuery("UPDATE Bil set bSusp = 1-bSusp WHERE Id=" + params)
    }
	root.DeleteBil = function (params, toServer) {
		if (!P.useWebDb || toServer) 
            return DAL_web.DeleteBil(params);

        execQuery("UPDATE RMAP set IdB=null Where IdB=" + params['id']);
		return execQuery("DELETE FROM Bil Where Id=" + params['id']);
	};

    root.SendBils = function(){
        if (!P.useWebDb || !P.dataSouceUrl) 
            return;
        execQuery("SELECT * FROM Bil WHERE bSusp=0").done(function(result) {
            var prm = {};
            for (var i in result) {
                prm['id'] = result[i].IdServ;
                prm['IdLoc'] = result[i].Id;
                prm['IdC'] = result[i].IdC;
                prm['IdT'] = result[i].IdT;
                prm['date'] = result[i].DateDoc;
                prm['sNote'] = result[i].Note;
                prm['sWars'] = result[i].Wars;
                prm['sOther'] = result[i].Other;
                prm['sumDoc'] = result[i].SumDoc;
                // prm['idServ'] = result[i].IdServ;
                DAL_web.SaveBil(prm).done(function(res) {
                    var cmd = "UPDATE Bil set bSusp=1";
                    if (res[0].Note.length > 0){
                        cmd += ", ServRet='" + res[0].Note + "'"
                        var idServ = res[0].Note.split(' ')[0];
                        if (idServ.length > 0)
                            cmd += ", IdServ='" + idServ + "'";
                    }
                    cmd += " WHERE Id=" + res[0].LocNum;    //result[i].Id;
                    execQuery(cmd);
                        //"UPDATE Bil set bSusp=1, ServRet='" + res[0].Note + "', IdServ='" + servId + "' WHERE Id=" + result[i].Id);
                })
            }
        })
    }


    root.RoadMap = function (params) {
        if (!P.useWebDb) 
            return DAL_web.RoadMap(params);
        var date = U.DateFormat(params, 'yyyy-mm-dd');
        return execDataSource({
            query: "SELECT r.*, c.N as N1, t.N as N2, " +
                "IFNULL(t.N || ' - ' || c.N, c.N) as Name, " +
                "IFNULL(t.A, c.A) as Adres, IFNULL(t.Id, c.Id) as N3 " +
                "FROM RMAP r Join CLI c On r.IdC=c.Id Left Join CLI t On r.IdT=t.Id " +
                "Where DateDoc='" + date + "' Order by Npp"
        });
       //CREATE TABLE RMAP (Id, DateRM, Npp, IdB, IdC, IdT, Note, P1, DateSync, ServRet, bSusp)',

    };
    root.SwapRmap = function (i1, n1, i2, n2, callback) {
        execQuery('UPDATE RMAP set Npp=' + n1 + ' Where Id=' + i1).done(function () {
            execQuery('UPDATE RMAP set Npp=' + n2 + ' Where Id=' + i2).done(function () {
                callback();
            })
        });
    };
    root.DeleteRMap = function (params) {
        return execQuery("DELETE FROM RMAP Where Id='" + params + "'");
    };
    root.SaveRMBil = function (id, idb) {
        if (!P.useWebDb) 
            return DAL_web.SaveRMBil(id, idb);
        return execQuery("UPDATE RMAP set IdB=" + idb + " Where Id=" + id);
    };
    root.AddCliRMap = function(prm, callback) {
        execQuery("INSERT INTO RMAP (DateDoc, Npp, IdC, IdT) VALUES('" + prm['date'] + "'," + prm['Npp'] + ",'"
                + prm['IdC'] + "','" + prm['IdT'] + "')")
            .done(function() { callback(); })
    };


	root.CountTable = function (params) {
		if (!P.useWebDb)
			return null;
		return execQuery("SELECT count(Id) as cnt FROM " + params);
	};
	root.TableCount = function(params) {
		if (!P.useWebDb)
			return null;

		DAL.CountTable('Bil').done(function(result) {
			P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
		});
		DAL.CountTable('CLI').done(function(result) {
			P.itemCount['Clients'] = P.ChangeValue('Clients', result[0].cnt);
		});

		DAL.CountTable('RMAP').done(function(result) {
			var date = new Date();
			var datestr = date.getDate() + '.' + (date.getMonth() + 1);
			P.itemCount['RoadMapList'] = P.ChangeValue('RoadMapList', datestr + ' (' + result[0].cnt + ')');
		});
	};

    var modeReadNews;
	root.ReadNews = function (fullNews, createDB) {
		P.loadPanelVisible(true);
        waitPanelSwitch = {NMS: true, CAT: true, WAR: true, CLI: true, MAP: true};
        
		// var source0 = DAL_web.NMS();
		// if (Object.prototype.toString.call(source0) == '[object Array]') writeToLocalData(source0, 'NMS');
		// else source0.load().done(function (result) { writeToLocalData(result, 'NMS'); });
		// P.trace('NMS');
        DAL_web.NMS().load().done(function (result) { writeToLocalData(result, 'NMS'); });
		// P.trace('Categories');
        DAL_web.Categories().load().done(function (result) { writeToLocalData(result, 'CAT'); });

        var date = new Date();
        P.itemCount['ReadNews'] = P.ChangeValue('ReadNews', date.getDate() + '.' + (date.getMonth() + 1));

		if (!P.useWebDb) {
			//P.loadPanelVisible(false);
            waitPanelSwitch.WAR = waitPanelSwitch.CLI = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
			return;
		}

        if (createDB)
		    root.RecreateLocalDB();

		// P.trace('Products');
        modeReadNews = fullNews ? 'all':'ost';
		DAL_web.Products({ pId: modeReadNews }).load().done(function (result) { writeToLocalData(result, 'WAR'); });

        if (fullNews){
			// P.trace('Clients');
            DAL_web.Clients({ pId: 'all' }).load().done(function (result) { writeToLocalData(result, 'CLI'); });
            // P.trace('RoadMap');
            DAL_web.RoadMap(new Date(), true).load().done(function (result) { writeToLocalData(result, 'MAP'); });
        }
        else {
            waitPanelSwitch.CLI = waitPanelSwitch.MAP = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
        }
		P.itemCount['OrderList'] = P.ChangeValue('OrderList', 0);
		P.itemCount['RoadMapList'] = P.ChangeValue('RoadMapList', 0);

		// return;
        if (P.arrCategory.length > 0) 
            P.Init();
        else
            BAsket.notify(_.Common.SomethingWrong, "error");
	};

	root.RecreateLocalDB = function () {
        P.trace('Local DB SCRIPT');
		DB.transaction(function(tx) {
			for (i = 0; i < LocalScript.length; i++) {
				dbLastQ = LocalScript[i];
				if (dbLastQ)
					tx.executeSql(dbLastQ, [], function(tx, results) {},
						function(err, err2) { errorCB("*RecreateLocalDB*", err, err2); }
					);
			}
		});
	};

	function execDataSource(params, mapCallback) {
		var dataSource = new DevExpress.data.DataSource({
			pageSize: (params.paging) ? P.pageSize : P.maxSizeLocalDb,
			load: function (loadOptions) {
				//params.paging = false;
				if (params.paging) {
					params['skip'] = loadOptions.skip;
					params['take'] = loadOptions.take;
				}
				if (loadOptions.searchExpr && loadOptions.searchValue)
					params['searchValue'] = loadOptions.searchValue;
				else
					params['searchValue'] = null;
                var deferred = new $.Deferred();
				// var db = window.openDatabase(dbName, "1.0", dbName, P.maxSizeLocalDb);
				// db.transaction(function (tx) {
					dbLastQ = params.query;
					var searchValue = '';
					if (params.searchString && params.searchString())
						searchValue = params.searchString();
					else if (params['searchValue'])
						searchValue = params['searchValue'];
					if (searchValue) {
                        var sr = " and (N LIKE '%" + searchValue + "%')";
                        if (params.searchReg) sr = params.searchReg.replace("@", searchValue);
						dbLastQ = dbLastQ.indexOf('#') > 0 ? dbLastQ.replace("#", sr) : dbLastQ + sr;
                    }
                    dbLastQ = dbLastQ.replace("#","");

					if (params.paging)
						dbLastQ += " LIMIT " + params['skip'] + ", " + params['take'];

					DB.executeSql(dbLastQ, [], function (tx, results) {
						var res = [];
						for (var i = 0; i < results.rows.length; i++) {
							var resrow = results.rows.item(i);
							if (mapCallback)
								resrow = mapCallback(resrow);
							res.push(resrow);
						}
						deferred.resolve(res);
					}, function (err, err2) { errorCB("*execDataSource sql*", err, err2); }
                    );
				// }, function (err, err2) { errorCB("*execDataSource*", err, err2); });
				return deferred;
			},
			lookup: function (key) {
				return 'lookup';
			}
		});
		return dataSource;
	};

	function execQuery(query, mapCallback) {
		var skip = 0;
		var PAGE_SIZE = 30;
        var deferred = new $.Deferred();
		// var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
		// db.transaction(function (tx) {
			dbLastQ = query;
			DB.executeSql(dbLastQ, [], function (tx, results) {
				if (dbLastQ.toUpperCase().substring(0, 7) == 'INSERT ') {
					//if (results.insertId) {
					deferred.resolve(results);
					return;
				}
				var res = [];
				for (var i = 0; i < results.rows.length; i++) {
					var resrow = results.rows.item(i);
					if (mapCallback)
						resrow = mapCallback(resrow);
					res.push(resrow);
				}
				deferred.resolve(res);
			}, function (err, err2) {
				// if (tryExist && err2.message && err2.message.indexOf('1 no such table:') > 0){
				//     root.RecreateLocalDB();
				// }
				// else
				errorCB("*execQuery sql*", err, err2);
			}
            );
		// }, function (err, err2) { errorCB("*execQuery*", err, err2); }        );
		return deferred;
	};

   // execute a query and fetches the data as an array of objects
    function executeQuery(tx, query, args, callback, callbackparams) {
        //var self = this;
        //console.log('db execute: '+query);
        // db.transaction(function(tx) {
            tx.executeSql(query, args, function(tx, result) {
                var retval = [];
                for (var i = 0; i < result.rows.length; ++i) {
                    retval.push(result.rows.item(i));
                }
                if (callback) {
                    callback(tx, retval, result, callbackparams);
                }
            }, 
            function (err, err2) { errorCB("*executeQuery*", err, err2); });
            //self.error);
        // });
    }


    function CheckWaitPanelSwitch(){
        for (var i in waitPanelSwitch)
            if (waitPanelSwitch[i]){
                return false;
            }
        return true;
    }
	var arrWAR, arrCLI, arrMAP;
	function writeToLocalData(dataArray, table) {

		if (table == 'NMS') {
			P.arrNMS = [];
			for (var i = 0 in dataArray) {
				var j = dataArray[i].IdP;
				if (!P.arrNMS[j]) P.arrNMS[j] = [];
				P.arrNMS[j].push(dataArray[i]);
				P.ChangeValue('NMS' + j, JSON.stringify(P.arrNMS[j]));
			}
            
            waitPanelSwitch.NMS = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
		}
		if (table == 'CAT') {
            if (!dataArray.length)
                dataArray = [{"Id":"0", "Name":"-"}]
			var localData = JSON.stringify(dataArray);
			P.arrCategory = JSON.parse(P.ChangeValue('categories', localData));
            
            waitPanelSwitch.CAT = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
		}

		if (table == 'WAR') {
			arrWAR = dataArray;
            DB.transaction(function (tx) {
                dbLastQ = 'Update WAR set O=0';
                tx.executeSql(dbLastQ, [], function (tx, results) {
                    DB.transaction(writeToWAR,
                        function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                        function () { P.trace(_.ReadNews.WroteRecs + table + ": success");        
                            waitPanelSwitch.WAR = false;
                            if (CheckWaitPanelSwitch())
                                P.loadPanelVisible(false);
                        });
                }, function (err, err2) {errorCB("*writeToWAR-ost sql*", err, err2)});
            });
		}
		if (table == 'CLI') {
            arrCLI = dataArray;
            // writeToCLI();
            DB.transaction(writeToCLI,
                function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                function () { P.trace(_.ReadNews.WroteRecs + table + ": success");        
                    waitPanelSwitch.CLI = false;
                    if (CheckWaitPanelSwitch())
                        P.loadPanelVisible(false);
                });
        }
        if (table == 'MAP') {
            arrMAP = dataArray;
            DB.transaction(writeToMAP,
                function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                function () { P.trace(_.ReadNews.WroteRecs + table + ": success");        
                    waitPanelSwitch.MAP = false;
                    if (CheckWaitPanelSwitch())
                        P.loadPanelVisible(false);
                });
        }
	};
    
 	function writeToWAR(tx) {
		P.loadPanelVisible(true);
		var arr = arrWAR;
		var i, maxlen = 47;
		var len = arr.length; //    < maxlen? arr.length:maxlen;
		//console.log('writeWars: writing=' + len);
		for (i = 0; i < len; i++) {
            dbLastQ = "Select Id From WAR Where Id='" + arr[i].Id + "'";
            //tx.executeSql(dbLastQ, [], function (tx, results) {
            executeQuery(tx, dbLastQ, [], function (tx, retval, results, item) {
                if (modeReadNews == 'ost' && results.rows.length)
                    dbLastQ = "UPDATE WAR set O='" + item.O + "' WHERE Id='" + item.Id + "'";
                else {
                    item.N1 = (item.N1) ? item.N1 : '';
                    item.N2 = (item.N2) ? item.N2 : '';
                    item.N3 = (item.N3) ? item.N3 : '';
                    item.N = item.N.replace(/'/g, "''");
                    item.N1 = item.N1.replace(/'/g, "''");
                    item.N2 = item.N2.replace(/'/g, "''");
                    item.N3 = item.N3.replace(/'/g, "''");
                    item.N4 = item.N4.replace(/'/g, "''");
                    if (results.rows.length)
                        dbLastQ = "UPDATE WAR set IdP='" + item.IdP + "', N='" + item.N + "', N1='" + item.N1 + 
                            "', N2='" + item.N2 + "', N3='" + item.N3 + "', N4='" + item.N4 + 
                            "', P='" + item.P + "', O='" + item.O + 
                            "' WHERE Id='" + item.Id + "'";
                    else
                        dbLastQ = "INSERT INTO WAR (Id, IdP, N, P, N1, N2, N3, N4, O) VALUES('"
                            + item.Id + "','" + item.IdP + "','" + item.N + "','" + item.P + "','"
                            + item.N1 + "','" + item.N2 + "','" + item.N3 + "','" + item.N4 + "','" + item.O
                            + "')";
                    }
                tx.executeSql(dbLastQ, [], function (tx, results) { },
                    function (err, err2) { errorCB("*writeToWAR sql*", err, err2); }
                );
            }, arr[i]);
            //}, function (err, err2) {errorCB("*writeToWAR-rd sql*", err, err2)});
		}
		P.trace(_.ReadNews.ReadRecs + ' WAR: ' + i);
		// P.loadPanelVisible(false);
	};

	function writeToCLI(tx) {
		P.loadPanelVisible(true);
		var arr = arrCLI;
		var i, maxlen = 50000;
		//tx.executeSql("BEGIN TRANSACTION");
		var len = arr.length;   // < maxlen? arr.length:maxlen;
		//console.log('writeWars: writing=' + len);
		for (i = 0; i < arr.length; i++) {
            dbLastQ = "Select Id From CLI Where Id='" + arr[i].Id + "'";
            // tx.executeSql(dbLastQ, [], function (tx, results) {
            //var item = arr[i]
            executeQuery(tx, dbLastQ, [], function (tx, retval, results, item) {
                item.IdP = (item.IdP == null || item.IdP == 'null') ? '0' : item.IdP;
                item.N = item.N.replace(/'/g, "''");
                item.A = item.A.replace(/'/g, "''");
                if (results.rows.length)
                    dbLastQ = "UPDATE CLI set IdP='" + item.IdP + "', N='" + item.N + "', A='" + item.A + 
                        "' WHERE Id='" + item.Id + "'";
                else
                    dbLastQ = "INSERT INTO CLI (Id, IdP, N, A) VALUES('"
                        + item.Id + "','" + item.IdP + "','" + item.N + "','" + item.A +
                        "')";

    			tx.executeSql(dbLastQ, [], function (tx, results) { },
    				function (err, err2) { errorCB("*writeToCLI sql*", err, err2); }
                );
            }, arr[i]);
            // }, function (err, err2) {errorCB("*writeToCLI-rd sql*", err, err2)} );
		}
		//tx.executeSql("COMMIT TRANSACTION", errorCB);
		P.trace(_.ReadNews.ReadRecs + ' CLI: ' + i);
		P.itemCount['Clients'] = P.ChangeValue('Clients', i);
		// P.loadPanelVisible(false);
	};

    function writeToMAP(tx) {
        P.loadPanelVisible(true);
        var date = U.DateFormat(new Date(), 'yyyy-mm-dd');
        dbLastQ = "Delete From RMAP Where DateDoc>='" + date + "'";
        tx.executeSql(dbLastQ, [], function (tx, results) {
            var arr = arrMAP;
            var i, maxlen = 50000;
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            for (i = 0; i < arr.length; i++) {
                var item = arr[i];
                item.IdT = (item.IdT == null || item.IdT == 'null') ? '0' : item.IdT;
                date = U.DateFormat(item.D, 'yyyy-mm-dd');
                dbLastQ = "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, Note) VALUES('"
                    + item.D + "','" + + item.Npp + "','" + item.IdC + "','" + item.IdT + "','" + item.Note +
                    "')";

                tx.executeSql(dbLastQ, [], function (tx, results) { },
                    function (err, err2) { errorCB("*writeToMAP sql*", err, err2); }
                );
            }
            P.trace(_.ReadNews.ReadRecs + ' MAP: ' + i);
        }, function (err, err2) {errorCB("*writeToMAP-rd sql*", err, err2)} );
    };


	// Transaction error callback
	function errorCB(src, err, err2) {
		var message = (err) ? ((err.message) ? err.message : err2.message) : src;
		var code = (err) ? ((err.code || (err && err.code == 0)) ? err.code : err2.code) : "";
		P.trace(src + " SQLError: " + message + '(' + code + ') dbLastQ=' + dbLastQ);
		return false;
	};
	// Transaction success callback
	function successCB() {
		//var db = window.openDatabase("Database", "1.0", "Cordova Demo", dbSize);
		//db.transaction(queryDB, errorCB);
	};


	function successCB1() {
		//var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
		db.transaction(queryDB1, errorCB);
	};
	function queryDB1(tx) {
		var tab = dbParam['tab'];
		tx.executeSql('SELECT * FROM ' + tab, [], querySuccess1, errorCB);
	};
	function querySuccess1(tx, results) {
		var len = results.rows.length;
		if (!console) return;
		console.log("CAT table: " + len + " rows found.");
		maxlen = 50;
		var len = len < maxlen ? len : maxlen;
		for (var i = 0; i < len; i++) {
			console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).name);
		}
	};
	// function consoleOut(str) {
	// 	var element = document.getElementById('consoleOut');
	// 	if (element)
	// 		element.innerHTML += str + '<br />';
	// };
	// function trace(str) {
	// 	if (P.debugMode)
	// 		consoleOut(str);

	// 	console.log(str);
	// };

	var LocalScript = [
        'DROP TABLE IF EXISTS WAR',
        'DROP TABLE IF EXISTS CLI',
        'DROP TABLE IF EXISTS Bil',
        'DROP TABLE IF EXISTS RMAP',
        'DROP TABLE IF EXISTS BILM',
        //'DROP TABLE IF EXISTS CAT',
        //'DROP TABLE IF EXISTS NMS',
        // 'CREATE TABLE IF NOT EXISTS NMS (IdRoot, Id, Name)',
        // 'CREATE TABLE IF NOT EXISTS CAT (Id unique, Name)',
        'CREATE TABLE IF NOT EXISTS WAR (Id unique, IdP, N, P DECIMAL(20,2), N1, N2, N3, N4, N5, O int, bSusp int)',
        'CREATE TABLE IF NOT EXISTS CLI (Id unique, IdP, N, A)',
        'CREATE TABLE IF NOT EXISTS Bil (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, IdC, IdT, NumDoc, SumDoc, Note, Wars, P1, P2, DateSync DateTime, ServRet, IdServ, bSusp int)',
        'CREATE TABLE IF NOT EXISTS RMAP (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, Npp int, IdB int, IdC, IdT, Note, DateSync DateTime, ServRet, bSusp int)',
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '1', 'Предприятие')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '1', 'Пупкин ЧП')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '2', 'Ступкин ООО')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '2', 'Тип Оплаты')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '1', 'наличные')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '2', 'безнал')",
        ''
	];

	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 1, '4422','4423','Note')",
	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 2, '4422','6473','Note2')",
	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 3, '4191','','Note3')",
	// "INSERT INTO Bil (DateDoc, IdC, IdT, sNote, sOther, sWars) VALUES('22.12.2013', '10','','Note', '1:2', '10:1;11:2')",
	// "INSERT INTO CLI (Id,  IdP, Name, Adres, GeoLoc) VALUES('10', '', 'Client10', 'Izhevsk KM/10', '56.844278,53.206272')",
	// "INSERT INTO CLI (Id,  IdP, Name, Adres, GeoLoc) VALUES('11', '10', 'FilOfClient10', 'Izhevsk2 KM/102222', '56.844278,53.206272')",

	return root;
})(jQuery, window);BAsket.Order = function (params) {
	var arrayTP = ko.observable([{ "Id": "", "Name": "" }]);
	var showTP = ko.observable(false);

	var dataVal = ko.observable(new Date());
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...');
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...');
	var noteVal = ko.observable('');
	var nmsNames = ko.observableArray([_.getText('Select'), _.getText('Select')]);
	var calcSum = ko.observable('');

	if (!P.fromProducts)
		P.arrayBAsket = [];

	if (params.Id) {
		DAL.BilById(params.Id, params.s).load().done(function (result) {
			if (!P.fromProducts && result[0].Wars) {
				DAL.ProductsByWars(result[0].Wars).done(function(result) {
					P.arrayBAsket = result;
					calcSum(Order_calcSum());
				});
			}
			var date = result[0].DateDoc;
			if (date.split(" ").length > 1)
				date = date.split(" ")[0];
			var dateParts = date.split(".");
			if (dateParts.length == 1)
				dateParts = date.split("-");
			//console.log('Order id=' + params.Id + ' date=' + dateParts);
			if (dateParts[0].length > 2)
				dataVal(new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]));
			else
				dataVal(new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]));

			var arr = nmsNames();
			var sOther = result[0].P1;
			if (sOther) {
				sOther = sOther.split(';');
				for (var i = 0; i < sOther.length; i++) {
					var sNms = sOther[i].split(':');
					if (sNms.length < 2) continue;
					var iNms = parseInt(sNms[0]);
					var setNms = $("#idNms" + iNms).data("dxSelectBox");
					if (setNms) {
						setNms.option().value = sNms[1];
						for (var ii = 0; ii < P.arrNMS[iNms].length; ii++)
							if (P.arrNMS[iNms][ii].Id == sNms[1]) {
								var val = P.arrNMS[iNms][ii].N;
								arr[iNms - 1] = val;
								break;
							}
					}
				}
				nmsNames(arr);
			}
			noteVal(result[0].Note);
			cliId(result[0].IdC);
			cliName(result[0].N1);
			tpId(result[0].IdT);
			var tName = result[0].N2 ? result[0].N2 : _.Order.SelectPoint + '...';
			tpName(tName);
			DAL.ClientsPar(result[0].IdC).load().done(function(result) {
				arrayTP(result);
				showTP(result.length > 0);
			});
		});
	}

	Order_clientChanged = function (arg) {
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
			value = lookupCli.option().value;	//("value");
		}

		if (value) {
			var self = this;
			self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...');
			DAL.ClientsPar(value).load().done(function(result) {
				self.arrayTP(result);
				self.showTP(result.length > 0);
			});
		}
	};

	Order_calcSum = function (mask) {
		if (mask)
			mask = mask.replace('-', '');
		else
			mask = _.Products.SelSum.replace('#', P.arrayBAsket.length);
		var sum = 0.0;
		for (var i in P.arrayBAsket) {
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].P;
		}
		return mask + sum.toFixed(2);
	};

	Order_btnSaveClicked = function () {
		//var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
		if (P.arrayBAsket.length == 0) {
			BAsket.notify(_.Order.ErrNoWars, "error");
			return;
		}
		var valueDate = $("#idDate").data("dxDateBox").option("value");
		if (!valueDate) {
			BAsket.notify(_.Order.ErrNoDate, "error");
			return;
		}
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
			return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");

		var prms = {};
		//var hash = location.hash.split('/');
		if (params.Id)
			prms['id'] = params.Id;
		//prms['date'] = valueDate.getDate() + '.' + (valueDate.getMonth()+1) + '.' + valueDate.getFullYear();
		prms['date'] = U.DateFormat(valueDate);
		//console.log('Order save date=' + dataVal());
		//console.log('Order save datetoLocaleString=' + prms['date']);
		prms['IdC'] = valueCli;
		prms['IdT'] = (valueTP ? valueTP : '');
		prms['sumDoc'] = Order_calcSum('-');

		prms['sOther'] = '';
		for (var i = 0; i < P.arrNMS[0].length; i++) {
			var setNms = $("#idNms" + (i + 1)).data("dxSelectBox");
			if (setNms && setNms.option().value && P.arrNMS[0][i].Id < 10) {
				prms['sOther'] += (i + 1) + ':' + setNms.option().value + ';';
			}
		}
		prms['sNote'] = $("#txtNote").data("dxTextArea").option("value");
		var sWars = '';
		for (var i in P.arrayBAsket) {
			sWars += P.arrayBAsket[i].Id + ':' + P.arrayBAsket[i].Quant + ';';
		}
		prms['sWars'] = sWars.substring(0, sWars.length - 1);

		DAL.SaveBil(prms, params.s);

		Order_clickBack();

		var cnt = DAL.CountTable('Bil');
		if (cnt)
			cnt.done(function (result) {
				P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
			});
	};

	Order_clickBack = function (arg) {
		P.fromProducts = false;
		if (params.Id) {
			var icur = BAsket.app.navigationManager.currentStack.currentIndex;
			if (icur < 1) {
				BAsket.app.navigate('home', { root: true });
				return;
			}
			var backUri = BAsket.app.navigationManager.currentStack.items[icur - 1].uri;
			if (backUri && backUri == 'RoadMapList')
				BAsket.app.navigate('RoadMapList', { root: true });
			else
				BAsket.app.navigate('OrderList', { root: true });
		}
		else
			//BAsket.app.navigate('home');
			BAsket.app.navigate('home', { root: true });
	};

	Order_clickProduct = function() {
		BAsket.app.navigate('Products/' + P.curCategoryId);
		//	    BAsket.app.navigationManager.saveState(window.localStorage);
	};


	var viewModel = {
		swValue: params.s,
		clients: DAL.Clients(),
		arrayTP: arrayTP,
		showTP: showTP,
		calcSum: calcSum,

		dataVal: dataVal,
		cliId: cliId,
		cliName: cliName,
		tpId: tpId,
		tpName: tpName,
		noteVal: noteVal,

		nmsNames: nmsNames,

		viewShown: function () {
			calcSum(Order_calcSum());
			for (var i = 0; i < P.arrNMS[0].length; i++) {
				var setNms = $("#idNms" + (i + 1));
				if (setNms.length == 1 && P.arrNMS[0][i].Id < 10) {
					setNms.parent().show();
					// setNms[0].parentNode.children[0].innerText = P.arrNMS[0][i].N;
					setNms[0].parentNode.children[0].innerText = Globalize.localize(P.arrNMS[0][i].N);
				}
			}
		}
	};

	return viewModel;
};


BAsket.OrderList = function (params) {
	var holdTimeout = ko.observable(500);
	var popVisible = ko.observable(false);
	var idSelected = ko.observable(0);
	var searchStr = ko.observable('');
	var swTitle = ko.observable(_.Order.SwTitle1);
	var swValue = ko.observable(false);

	var viewModel = {
		dataSource: DAL.Bil({ search: searchStr }),
		dataSourceS: DAL.Bil({ search: searchStr }, true),

		popVisible: popVisible,
		holdTimeout: holdTimeout,
		popActions: [
		    { text: _.Order.ActionDelete, clickAction: function () { Order_DeleteClick() } },
		    { text: _.Order.ChangeActivity, disabled: swValue, clickAction: function () { Order_ChangeActivity() } }
		],

		searchString: searchStr,
		// find: function () {
		// 	viewModel.showSearch(!viewModel.showSearch());
		// 	viewModel.searchString('');
		// },
		// showSearch: ko.observable(false),
		swTitle: swTitle,
		swValue: swValue,
		viewShown: function () {
			if (swValue())
				viewModel.dataSourceS.load();
			else
				viewModel.dataSource.load();		
		}
	};
	ko.computed(function() {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function() {
		viewModel.dataSource.pageIndex(0);
		viewModel.dataSource.load();
		viewModel.dataSourceS.pageIndex(0);
		viewModel.dataSourceS.load();
	});

	Order_SwitchSource = function(){
		swValue(!swValue());
		if (swValue()){
			swTitle(_.Order.SwTitle2)
			// viewModel.dataSourceS.load();
		}
		else{
			swTitle(_.Order.SwTitle1)
			viewModel.dataSource.load();
		}
		//viewModel.dataSource = DAL.Bil(swValue());
	}

	Order_DeleteClick = function() {
		//    var result = DevExpress.ui.dialog.confirm(_.Order.ActionDelete + ' ?', _.Common.Confirm);
		//    result.done(function (dialogResult) {
		//    	alert(dialogResult ? "Confirmed" : "Canceled");
		// });

		DevExpress.ui.dialog.custom({
			message: _.Order.ActionDelete + ' ' + idSelected() + ' ?',
			title: _.Common.Confirm,
			buttons: [
				{ text: _.getText('Yes'), clickAction: Order_Delete },
				{ text: _.getText('Cancel') }
			]
		}).show();
	};
	Order_Delete = function(arg) {
		DAL.DeleteBil({'id': idSelected()}, swValue()).done(function(result) {
			if (swValue())
				viewModel.dataSourceS.load();
			else
				viewModel.dataSource.load();
			DAL.CountTable('Bil').done(function(result) {
				P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
			});
		})
	};

	Order_ChangeActivity = function() {
		DAL.ChangeActivityBil(idSelected()).done(function(result) {
			viewModel.dataSource.load();
		})
	};

	Order_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};

	return viewModel;
};BAsket.Clients = function (params) {
	P.getGeo();
	var searchStr = ko.observable('');
	var holdTimeout = ko.observable(500);
	var popVisible = ko.observable(false);
	var idSelected = ko.observable(0);

	var viewModel = {
		searchString: searchStr,
		// find: function() {
		// 	viewModel.showSearch(!viewModel.showSearch());
		// 	viewModel.searchString('');
		// },
		// showSearch: ko.observable(false),
		popVisible: popVisible,
		holdTimeout: holdTimeout,
		popActions: [],

		dataSource: DAL.Clients({ search: searchStr })
	};
	ko.computed(function () {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function () {
		viewModel.dataSource.pageIndex(0);
		viewModel.dataSource.load();
	});

	Client_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};


	return viewModel;
};

BAsket.Client = function (params) {
	//P.loadPanelVisible(true);
	P.getGeo();
	var cliName = ko.observable('');
	var location = ko.observable(P.geoCurrent());
	var visibleMenu = ko.observable(false);
	var popupVisible = ko.observable(false);
	var geoDirections = ko.observable('');

	var viewModel = {
		visibleMenu: visibleMenu,
		popupVisible: popupVisible,
		menuItems: [_.Common.Save, _.Clients.RoutDetail],
		cliName: cliName,

		options: //mapOptions
        {
        	provider: P.mapProvider,
        	mapType: 'roadmap',
        	width: '100%', height: '100%',
        	zoom: 15,
        	readyAction: function () { Client_MapReadyAction() }

        	// location: location,
        	// //P.geoCurrent(),
        	// //"56.853213999999994,53.215489",
        	// //"56.844278,53.206272",
        	// controls: true,

        	// markers: [
        	//   { label: "A", tooltip: "sd asd asd ", location: P.geoCurrent() },
        	//   // { label: "B", location: [56.844278,53.206272] },
        	//   // { label: "C", location: [56.829488,53.180437] }
        	// ],
        	// routes: [{
        	//     weight: 5,
        	//     color: "blue",
        	//     locations: [
        	//       [40.737102, -73.990318],
        	//       [40.749825, -73.987963],
        	//       [40.755823, -73.986397]
        	//     ]
        	// }]
        }
	};


	Client_ClickMenu = function (arg) {
		visibleMenu(!visibleMenu());
		//togglePopover();
	};
	Client_ClickMenuAction = function(arg) {
		visibleMenu(false);
		BAsket.notify(arg.itemData);
		if (arg.itemData == arg.model.menuItems[0]) {
			Client_menuSaveGeo();
		} else if (arg.itemData == arg.model.menuItems[1]) {
			
			var d = geoDirections();
			if (!d.legs || d.legs.length == 0)
				return;
			var text = '';
			text += '<p>Движение на авто ' + d.legs[0].duration.text + '; расстояние ' + d.legs[0].distance.text +
				'<br/>от: ' + d.legs[0].start_address + '<br/>до: ' + d.legs[0].end_address + '</p>';
			text += '<p>в основном по ' + d.summary + '</p>';
			text += '<br/><p>По шагам:</p>';
			for (var i in d.legs[0].steps) {
				text += '<p>' + (parseInt(i) + 1) + ') ' + d.legs[0].steps[i].duration.text + '; ' + d.legs[0].steps[i].distance.text;
				text += '; ' + d.legs[0].steps[i].instructions + '</p>';
			}
			arg.model.popupVisible(true);
			$("#textContainer").html(text);
			// $("#scrollView").dxScrollView("instance").scrollTo($(".dx-scrollview-content").height() - $(".dx-scrollview").height(), true);
			// $("#scrollView").dxScrollView("instance").release();
			// $("#scrollView").dxScrollView("instance").update();			
		}
	};
	Client_menuSaveGeo = function (arg) {
		BAsket.notify('Client_menuSaveGeo');
		//DAL.ExecQuery("UPDATE CLI set geoLoc='" + P.geoCurrent() + "' WHERE id='" + params.id + "'");
	};
	Client_clickCancel = function (arg) {
		popupVisible(false);
	};

	Client_PullDownActionFunction = function (actionOptions) {
		// DevExpress.ui.dialog.alert("The widget has been pulled down", "Action executed");
		actionOptions.component.release();
	};

	Client_MapReadyAction = function (s) {
		P.loadPanelVisible(false);
		//var map = s.component;
		var map = $("#idClientMap").data("dxMap");
		map.addMarker({ tooltip: _.Common.CurrentLocation, location: P.geoCurrent() });

		DAL.ClientById(params.Id).load().done(function(result) {
			cliName(result[0].N2 + ' (' + result[0].A + ')');
			//              location(P.geoCurrent());
			//            if (location()){
			//map.addMarker({tooltip: 'Current Location2', location: '56.843214,53.225489'});

			var locCli = result[0].geoLoc;
			locCli = result[0].A;
			if (locCli) {
				map.addMarker({ tooltip: result[0].N + ', ' + result[0].A, location: locCli });
			} else {
				P.geoCoder(result[0].Adres).done(function(geores) {
					map.addMarker({ tooltip: result[0].N + ', ' + result[0].A, location: geores });
				});

				var p1 = map._options.markers[0].location.split(',');
				var p2 = map._options.markers[1].location.split(',');
				if (p1 && p2 && p1.length == 2 && p2.length == 2) {
					var res1 = P.getDistance(p1, p2);
					var res2 = P.geoBearing(p1, p2);
					cliName(cliName() + ' dist=' + res1 + ' dir=' + res2);
				}
			}

			var routeOptions = {
				weight: 5,
				color: "blue",
				locations: [map._options.markers[0].location, map._options.markers[1].location]
			};
			map.addRoute(routeOptions);

			var directionsDisplay = new google.maps.DirectionsRenderer();
			//directionsDisplay.setMap(map._map);

			var directionsService = new google.maps.DirectionsService();
			var request = {
				origin: map._options.markers[0].location,
				destination: map._options.markers[1].location,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					geoDirections(result.routes[0]);
					//directionsDisplay.setDirections(result);
				}
			});
			// var geo = P.geoCoder(locCli).done(function(res){
			//     geoDirections(res);
			// });

			////    http://maps.googleapis.com/maps/api/directions/json?origin=56.853213999999994,53.215489&destination=%D0%98%D0%B6%D0%B5%D0%B2%D1%81%D0%BA%20%D0%B3.,%20%D0%9C%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB.,%2069&sensor=false

			// $.ajax({
			//         url: P.geoDirectionsUrl,
			//         data: { sensor: false, 
			//             origin:  map._options.markers[0].location, 
			//             destination: map._options.markers[1].location},
			//         type: 'GET',
			//         dataType: 'json',
			//         crossDomain: true, 
			//         headers: { 
			//             Accept : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",                                

			//         },
			//         success: function(data) {
			//             geoDirections(data);
			//         }
			// })

			// $.get(P.geoDirectionsUrl, { sensor: false, callback: '_googleScriptReady',
			//     origin:  map._options.markers[0].location, 
			//     destination: map._options.markers[1].location})
			// .done(function(data){
			//     geoDirections(data);
			// });

			// map.gmap('microdata', 'http://data-vocabulary.org/Event', function(result, item, index) {
			//     var lat = result.location[0].geo[0].latitude;
			//     var lng = result.location[0].geo[0].longitude;
			//     var latlng = new google.maps.LatLng(lat, lng);
			// })
			//  var m = map._options.markers;
			//            map.addMarker({label: "A1", tooltip: result[0].Name + ', ' + result[0].Adres, location: [56.853213999999994,53.206272]});
			// }
			//thisCli.options.markers[0] = { label: "A", tooltip: "sd asd asd ", location: P.geoCurrent() };
		});
	};


	return viewModel;
};BAsket.RoadMapList = function (params) {
	P.getGeo();
	var date = params.Id && params.Id != "undefined"? new Date(params.Id) : new Date();
	var dataVal = ko.observable(date);
	var itemSelected = ko.observable(0);
	var popVisible = ko.observable(false);
	var holdTimeout = ko.observable(500);
	var popupVisible = ko.observable(false);

	var showTP = ko.observable(false);
	var arrayTP = ko.observable([{ "Id": "", "Name": "" }]);
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...');
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...');


	var viewModel = {
		dataVal: dataVal,
		popupVisible: popupVisible,

		holdTimeout: holdTimeout,
		popVisible: popVisible,

		popActions: [
			// { text: _.RoadMap.OpenBil, clickAction: function () { RoadMap_Action('OpenBil') } },
			{ text: _.RoadMap.OpenClient, clickAction: function () { RoadMap_Action('OpenClient') } },
			{ text: _.RoadMap.MoveUp, clickAction: function () { RoadMap_Move('MoveUp') } },
			{ text: _.RoadMap.MoveDown, clickAction: function () { RoadMap_Move('MoveDown') } },
			{ text: _.RoadMap.ActionDelete, clickAction: function () { RoadMap_Action('DeleteClick') } }
		],

		dataSource: DAL.RoadMap(dataVal()),
		clients: DAL.Clients(),
		arrayTP: arrayTP,
		showTP: showTP,
		cliId: cliId,
		cliName: cliName,
		tpId: tpId,
		tpName: tpName,
		viewShown: function () {
			var date = new Date();
			if (location.hash.indexOf('/') < 0 && dataVal().toLocaleDateString() != date.toLocaleDateString()){
				RoadMap_ChangeDate();
			}
		}
	};

	// RoadMap_Back = function (arg) {
	// 	debugger;
	// }
	RoadMap_ChangeDate = function (arg) {
		BAsket.app.navigate('RoadMapList/' + dataVal(), { direction: 'none', root: true });
	};

	RoadMap_AddToTheMap = function (arg) {
		//BAsket.notify('RoadMap_AddToTheMap');
		popupVisible(true);
	};
	RoadMap_clickCancel = function (arg) {
		popupVisible(false);
	};
	RoadMap_clientChanged = function (arg) {
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
			value = lookupCli.option().value; //("value");
		}

		if (value) {
			var self = this;
			self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...');
			DAL.ClientsPar(value).load().done(function (result) {
				self.arrayTP(result);
				self.showTP(result.length > 0);
			});
		}
	};

	RoadMap_ClientSave = function(arg) {
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
			return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");
		var prms = {};
		prms['date'] = U.DateFormat(dataVal(), 'yyyy-mm-dd');
		prms['IdC'] = valueCli;
		prms['IdT'] = (valueTP ? valueTP : 0);
		prms['Npp'] = viewModel.dataSource.items().length > 0 ?
			parseInt(viewModel.dataSource.items()[viewModel.dataSource.items().length - 1].Npp) + 1 : 1;

		DAL.AddCliRMap(prms, RoadMap_Reload);

		popupVisible(false);
		cliName(_.Order.SelectClient + '...');
		tpName(_.Order.SelectPoint + '...');
	};

	RoadMap_ClickShow = function(arg) {
		var arr = arg.model.dataSource._items;
		P.arrayBAsket = [];
		P.arrayBAsketL = [];
		for (var i in arr) {
			if (arr[i].Adres) {
				var cText = arr[i].N2 ? arr[i].N1 + ' - ' + arr[i].N2 : arr[i].N1;
				P.arrayBAsket.push({ tooltip: cText + ' (' + arr[i].Adres + ')', location: arr[i].Adres });
				P.arrayBAsketL.push(arr[i].Adres);
			}
		}
		BAsket.app.navigate('RoadMap/');
	};

	RoadMap_Move = function(action) {
		var icur = -1;
		for (var i in viewModel.dataSource._items)
			if (itemSelected().Id == viewModel.dataSource._items[i].Id) {
				icur = parseInt(i);
				break;
			}
		if (icur < 0) return;
		if (action == 'MoveUp' && icur == 0) {
			BAsket.notify('First Position Up');
			navigator.notification.beep(1);
			return;
		} else if (action == 'MoveDown' && icur == viewModel.dataSource._items.length - 1) {
			BAsket.notify('Last Position Down');
			navigator.notification.beep(1);
			return;
		}
		var p = action == 'MoveDown' ? 1 : -1;
		DAL.SwapRmap(itemSelected().Id, viewModel.dataSource._items[icur + p].Npp,
			viewModel.dataSource._items[icur + p].Id, itemSelected().Npp, RoadMap_Reload);
	};

	RoadMap_ClickClient = function(arg) {
		// RoadMap_OpenClient(arg.model.N3);
		RoadMap_OpenBil(arg.model);
	}
	RoadMap_OpenClient = function(arg) {
		var idC = (arg) ? arg : itemSelected().N3;
		BAsket.app.navigate('Client/' + idC);
	}
	RoadMap_OpenBil = function(arg) {
		var sel = (arg) ? arg : itemSelected();
		if (sel.IdB) {
				BAsket.app.navigate('Order/' + sel.IdB);
				return;
			}
			var prms = {};
			prms['date'] = U.DateFormat(dataVal());
			prms['IdC'] = sel.IdC;
			prms['IdT'] = sel.IdT;
			prms['Note'] = sel.Note;
			DAL.SaveBil(prms).done(function(res) {
				var id = (P.useWebDb) ? res.insertId : res[0].Id;
				DAL.SaveRMBil(sel.Id, id).done(function() {
					BAsket.app.navigate('Order/' + id);
					viewModel.dataSource.load();
				});
			});
	};

	RoadMap_Action = function(action) {
		if (action == 'DeleteClick') {
			DevExpress.ui.dialog.custom({
				message: _.RoadMap.ActionDelete + ' ' + itemSelected().Id + ' ?',
				title: _.Common.Confirm,
				buttons: [
					{ text: _.getText('Yes'), clickAction: RoadMap_Delete },
					{ text: _.getText('Cancel') }
				]
			}).show();
		} else if (action == 'OpenBil') {
			RoadMap_OpenBil();
		} else if (action == 'OpenClient') {
			RoadMap_OpenClient();
		} else
			BAsket.notify(action);
	};

	RoadMap_Delete = function(arg) {
		DAL.DeleteRMap(itemSelected().Id);
		DAL.CountTable('RMAP').done(function(result) {
			var date = new Date();
			var datestr = date.getDate() + '.' + (date.getMonth() + 1);
			P.itemCount['RoadMap'] = P.ChangeValue('RoadMap', datestr + ' (' + result[0].cnt + ')');
		});
		viewModel.dataSource.load();
	};

	RoadMap_processItemHold = function(arg) {
		itemSelected(arg.itemData);
		popVisible(true);
	};
	RoadMap_Reload = function(arg) {
		viewModel.dataSource.load();
	};

	return viewModel;
};

BAsket.RoadMap = function (params) {
	//P.loadPanelVisible(true);
	//P.getGeo();

	var viewModel = {
		options: {
			provider: P.mapProvider,
			mapType: "roadmap",
			//location: P.geoCurrent,
			controls: true,
			width: "100%",
			height: "100%",
			zoom: 15,
			markers: P.arrayBAsket,
			// [
			//   { title: "A", tooltip: "sd asd asd ", location: [56.851248,53.20271] },
			//   { title: "B", tooltip: "wer wer w", location: [56.864278,53.216272] },
			//   { title: "C", tooltip: "asasdas asd as asd ", location: [56.859488,53.190437] }
			// ],
			routes: [{
				weight: 5,
				color: "blue",
				locations: P.arrayBAsketL
				// [
				//   [56.851248,53.20271],
				//   [56.864278,53.216272],
				//   [56.859488,53.190437]
				// ]
			}],
			readyAction: function () { RoadMap_ReadyAction() }
		}
	};

	RoadMap_ReadyAction = function(s) {
		P.loadPanelVisible(false);
	};

	return viewModel;
};
BAsket.Preferences = function (params) {
	tabs = [
	  { text: _.Preferences.Main, icon: "comment" },
	  { text: _.Preferences.Functions, icon: "user" },
	  { text: _.Preferences.Admin, icon: "preferences" }
	];
	var tabContent = ko.observable();
	var selectedTab = ko.observable(0);

	var popupVisible = ko.observable(false);

	ko.computed(function () {
		if (selectedTab() == 2) {
			popupVisible(true);
		} else
			popupVisible(false);

		tabContent(tabs[selectedTab()].content);
	});
	var dataSouceUrl = ko.observable(P.dataSouceUrl);

	var adminPassword = ko.observable('');
	var buttonVisible = ko.observable(true);

	var modeProdView = ko.observable(P.modeProdView);
	var debugMode = ko.observable(P.debugMode);
	var useWebDb = ko.observable(P.useWebDb);
	var userName = ko.observable(P.UserName);
	var userPass = ko.observable(P.UserPass);
	var userEMail = ko.observable(P.UserEMail);

	Preferences_WsUrl = function(arg) {
		P.dataSouceUrl = P.ChangeValue("dataSouceUrl", dataSouceUrl());
		DAL_web.TestConnect();
	};
	Preferences_TableMode = function(arg) {
		P.modeProdView = P.ChangeValue("modeProdView", modeProdView());
	};
	Preferences_useWebDb = function(arg) {
		P.useWebDb = P.ChangeValue("useWebDb", useWebDb());
		window.location.reload();
	};
	Preferences_debugMode = function(arg) {
		P.debugMode = P.ChangeValue("debugMode", debugMode());
	};
	Preferences_userName = function(arg) {
		P.UserName = P.ChangeValue("userName", userName());
	};
	Preferences_userPass = function(arg) {
		P.UserPassword = P.ChangeValue("userPassword", userName());
	};
	Preferences_userEMail = function(arg) {
		if (!P.validateEmail(userEMail())){
			BAsket.notify(_Common.EMailNotValid + ': ' + userEMail());
			return;
		}
		P.UserEMail = P.ChangeValue("userEMail", userEMail());
	};

	Preferences_changePlatform = function(arg) {
		if (arg.element.length > 0) {
			P.platformDevice = P.ChangeLookup("#lookupPlatform", "Platform");
			window.location.reload();
		}
	};	
	Preferences_changeLayout = function(arg) {
		if (arg.element.length > 0) {
			P.layout = P.ChangeLookup("#lookupLayout", "Layout");
			window.location.reload();
		}
	};
	Preferences_changeMapProvider = function(arg) {
		if (arg.element.length > 0)
			P.mapProvider = P.ChangeLookup("#lookupMapProvider", "MapProvider");
	};
	Preferences_changeLanguageUI = function(arg) {
		if (arg.element.length > 0) {
			P.languageUI = P.ChangeLookup("#lookupLanguageUI", "LanguageUI");
			window.location.reload();
		}
	};

	Preferences_clickLogin = function () {
		if (adminPassword() == P.adminPassword) {
			popupVisible(false);
		}
		else
			BAsket.notify(_.Preferences.IncorrectPassword, "error");
	};
	Preferences_clickCancel = function () {
		//selectedTab(0);
		popupVisible(false);
	};
	Preferences_clickRecreateLocal = function () {
		DevExpress.ui.dialog.confirm(_.Common.AreYouSure, _.Preferences.RecreateDb).done(function (dialogResult) {
			if (dialogResult) {
				DAL.RecreateLocalDB();
			}
		});
	};

	var viewModel = {
		selectedTab: selectedTab,
		popupVisible: popupVisible,
		adminPassword: adminPassword,
		popupTitle: "Login",
		dataSouceUrl: dataSouceUrl,


		dsMapProvider: {
			data: ["google", "bing"],	//"googleStatic", 
			value: ko.observable(P.mapProvider)
		},
		dsLanguage: {
			data: ["English", "Русский"],
			value: ko.observable(P.languageUI)
		},
		dsLayout: {
			data: ['slideout', 'navbar'],
			value: ko.observable(P.layout)
		},

		dsPlatform: {
			data: ['-', "generic", "ios", "ios v6", "android", "android black", "tizen", "tizen black"],
			// data: ['-', "generic", "ios", "android", "win8", "tizen"],
            // data: ['-', "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "tizen"],
			value: ko.observable(P.platformDevice)
		},

		modeProdView: modeProdView,
		debugMode: debugMode,
		useWebDb: useWebDb,
		userName: userName,
		userPass: userPass,
		userEMail: userEMail

		// dsWsUrl: ['', 
		// 	'http://10.0.0.30/BWS2/api/', 
		// 	'http://192.168.1.146/BAsketWS/api/'
		// 	]
	};

	return viewModel;
};


BAsket.Info = function (params) {
	// var rootShow = ko.observable(true);
	var subTitle = ko.observable('');
	var subText = ko.observable('');
	var dsInfo = [];
	for (var i=0; i<P.navigation.length; i++){
		var clone = {};   
    	for (var j in P.navigation[i]) 
        	clone[j] = P.navigation[i][j];
    
		dsInfo.push(clone);
	}
	//dsInfo = dsInfo.splice(1);
	if (params.Id) {
		// rootShow(false);
		subTitle(params.Id);	//' - ' + 
		var text = _.Info[params.Id]	//params.Id + " string to repeat\n";
		// subText('<p>'+ new Array( 444 ).join( text ) + '</p>');
		subText(text);		
	} else {
		dsInfo.splice(-1, 1);
		dsInfo.push({"id": "Products", "heightRatio": 4, "widthRatio": 8, "icon": "cart", "title": _.Info.IProducts, "backcolor": "#FF981D"});
		dsInfo.push({"id": "Product_Details", "heightRatio": 4, "widthRatio": 4, "icon": "cart", "title": _.Info.IProductDet, "backcolor": "#FF981D"});
		dsInfo.push({"id": "Client", "heightRatio": 4, "widthRatio": 4, "icon": "globe", "title": _.Info.IClient, "backcolor": "#7200AC"});
		dsInfo.push({"id": "RoadMap", "heightRatio": 4, "widthRatio": 4, "icon": "map", "title": _.Info.IMap, "backcolor": "#006AC1"});
		dsInfo.push({"id": "Contacts", "heightRatio": 4, "widthRatio": 8, "icon": "home", "title": _.Info.IContacts, "backcolor": "red"});
		dsInfo.push({"id": "SysInfo", "heightRatio": 4, "widthRatio": 4, "icon": "preferences", "title": "SysInfo", "backcolor": "black"});
		for (var info in dsInfo){
			dsInfo[info].action = '#Info/' + dsInfo[info].id;
		}
	}
	var viewModel = {
		dsInfo: dsInfo,
		title: _.Info.Title,	//'Info',	// + subTitle(),
		// rootShow: rootShow,
		subTitle: subTitle,

		viewShown: function () {
			$("#textContainer").html(subText());
		}
	};
	return viewModel;
};


BAsket.ReadNews = function (params) {
	var arrayRepo = [];
	for (var i in P.arrNMS[0]) 
		if (P.arrNMS[0][i].Id == 101){
			arrayRepo = P.arrNMS[parseInt(i) + 1];
			break;
		}

	var modeSaveOrd = ko.observable(P.getLocalStor('modeSaveOrd', true));
	var modeLoadOst = ko.observable(P.getLocalStor('modeLoadOst', true));
	var modeLoadSpr = ko.observable(P.getLocalStor('modeLoadSpr', true));

	var viewModel = {
		modeSaveOrd: modeSaveOrd,
		modeLoadOst: modeLoadOst,
		modeLoadSpr: modeLoadSpr,
		arrayRepo: arrayRepo,
		viewShown: function () {
			$('#consoleOut').html();
		}
	};

	ReadNews_SUA = function(arg){
		if (arg == 'modeSaveOrd')
			P.ChangeValue(arg, modeSaveOrd());
		else if (arg == 'modeLoadOst')
			P.ChangeValue(arg, modeLoadOst());
		else if (arg == 'modeLoadSpr')
			P.ChangeValue(arg, modeLoadSpr());
	}
	
	ReadNews_ReadNews  = function(){
		if (modeSaveOrd()){
			DAL.SendBils();
		}
		if (modeLoadOst() || modeLoadSpr()) {
			DAL.ReadNews(modeLoadSpr());
		}
	}

	ReadNews_SendRepo = function(){
		if (!P.UserEMail || !P.validateEmail(P.UserEMail)){
			BAsket.notify(_Common.EMailNotValid);
			return;
		}
		var lookupRepo = $("#lookupRepo").data("dxLookup");
		var value = lookupRepo.option().value;
		if (!value) {
			BAsket.notify(_.ReadNews.ChoiceRepo);
			return;
		}
		DAL_web.SendRepo({'id':value, 'mail':P.UserEMail});
		//BAsket.notify('SendRepo '+ value + ' to ' + P.UserEMail);		
	}

	return viewModel;
};
BAsket.Products = function (params) {
	P.fromProducts = true;
	var searchStr = ko.observable('');
	P.curCategoryId = (params.Id == 'undefined') ? P.curCategoryId : params.Id;
	 if ((!P.curCategoryId || P.curCategoryId == 0) && P.arrCategory.length > 0)
    		P.curCategoryId = root.arrCategory[0].Id;

	var bChoice = ko.observable(P.curModeChoice);
	var lbltitle = ko.observable(_.Products.Title1);
	var btnSwText = ko.observable(_.Products.btnSwText1);
	var calcSum = ko.observable('');

	var viewModel = {
		searchString: searchStr,

		dataSourceCat: P.arrCategory,   //DAL.Categories(),
		dataSourceBasket: new DevExpress.data.DataSource(new DevExpress.data.ArrayStore(P.arrayBAsket)),

		// dataSourceProd: DAL.Products({Id:P.curCategoryId, search:searchStr}),
		dataSourceProd: DAL.Products({ pId: P.curCategoryId, search: searchStr }, !P.modeProdView),

		bChoice: bChoice,
		lbltitle: lbltitle,
		btnSwText: btnSwText,
		calcSum: calcSum,

		viewShown: function () {
			viewModel.dataSourceProd.load();
		}
	};
	ko.computed(function() {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function() {
		viewModel.dataSourceProd.pageIndex(0);
		viewModel.dataSourceProd.load();
	});

	Products_calcSum = function() {
		var sum = 0.0;
		for (var i in P.arrayBAsket) {
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].P;
		}
		return _.Products.SelSum.replace('#', P.arrayBAsket.length) + sum.toFixed(2);
	};

	Products_swichClicked = function() {
		P.curModeChoice = !P.curModeChoice;
		if (!P.curModeChoice) {
			viewModel.dataSourceBasket.load();
			bChoice(P.curModeChoice);
			lbltitle(_.Products.Title2);
			btnSwText(_.Products.btnSwText2);
			calcSum(Products_calcSum());
		} else {
			// viewModel.dataSourceProd.load();
			bChoice(P.curModeChoice);
			lbltitle(_.Products.Title1);
			btnSwText(_.Products.btnSwText1);
		}
	};

	Products_categoryChanged = function(arg) {
		if (arg.element.length <= 0) return;

		var lookup = $("#CategoryLookup").data("dxLookup");
		P.curCategoryId = lookup.option("value");
		P.curCategoryName = $(".dx-state-active").html();
		BAsket.app.navigate('Products/' + P.curCategoryId, { direction: 'none' });
	};

	Products_clickBack = function(arg) {
		//BAsket.app.navigate('Order/' + P.curCategoryId);
		//BAsket.app.navigationManager.restoreState(window.localStorage);
		// P.trace('Products_clickBack ' + BAsket.app.navigationManager.currentStack.items.length);
		var cur = 0;
		for (var i = BAsket.app.navigationManager.currentStack.items.length - 1; i > 0; i--) {
			if (BAsket.app.navigationManager.currentStack.items[i - 1].uri.indexOf('Order') == 0) {
				// P.trace('Products_clickBack cur= ' + i);
				cur = i;
				break;
			} else {
				// P.trace('Products_clickBack splice= ' + i);
				BAsket.app.navigationManager.currentStack.items.splice(i - 1, 1);
			}
		}
		// P.trace('Products_clickBack back= ' + cur);
		BAsket.app.navigationManager.currentStack.currentIndex = cur; //BAsket.app.navigationManager.currentStack.items.length - 1;
		BAsket.app.back();
	};

	return viewModel;
};



BAsket.Product_Details = function (params) {

	var viewModel = {
		Id: params.Id,
		Name: ko.observable(''),
		Price: ko.observable(''),
		N1: ko.observable(''),
		N2: ko.observable(''),
		N3: ko.observable(''),
		N4: ko.observable(''),
		N1T: ko.observable(P.arrNMS[10] && P.arrNMS[10][0] ? P.arrNMS[10][0].N:''),
		N2T: ko.observable(P.arrNMS[10] && P.arrNMS[10][1] ? P.arrNMS[10][1].N:''),
		N3T: ko.observable(P.arrNMS[10] && P.arrNMS[10][2] ? P.arrNMS[10][2].N:''),
		N4T: ko.observable(P.arrNMS[10] && P.arrNMS[10][3] ? P.arrNMS[10][3].N:''),
		Ostat: ko.observable(''),
		Quant: ko.observable(),

		viewShown: function () {
			var quant = $("#idQuant").data("dxNumberBox");
			quant.focus();
			// setTimeout(function () {
			//    // $('#idQuant :input').focus();
			//     var input = $('#idQuant :input')[0];
			//     var textEvent = document.createEvent('TextEvent');
			//     textEvent.initTextEvent('textInput', true, true, null,  " ", 9, "en-US");
			//     input.dispatchEvent(textEvent);

			//     //simulateKeyPress("2");
			// }, 300);
		}
	};
	DAL.ProductDetails({ Id: params.Id, model: viewModel });

	// function simulateKeyPress(character) {
	//   jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
	// }
	
	Product_Details_saveClicked = function(arg) {
		var bFound = false;
		//var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
		// for (var prop in valueQuant)
		//     console.log(prop + ': ' + valueQuant[prop])
		//console.log('Product_Details_saveClicked <' + this.Quant());
		var quant = parseInt(this.Quant());
		//console.log('Product_Details_saveClicked quant<' + quant + '>');
		for (var i in P.arrayBAsket) {
			//if (!P.arrayBAsket.hasOwnProperty(i)) continue;
			//if (i == key && P.arrayBAsket[i].id == this.id()) {
			if (P.arrayBAsket[i].Id == this.Id) {
				if (quant && quant > 0)
					P.arrayBAsket[i].Quant = quant;
				else
					P.arrayBAsket.splice(i, 1);
				bFound = true;
				break;
			}
		}
		if (!bFound && quant && quant > 0) {
			P.arrayBAsket.push({ 'Id': this.Id, 'N': this.Name(), 'O': this.Ostat(), 'Quant': quant, 'P': this.Price(), 'N1': this.N1(), 'N2': this.N2() });
		}
		// for(var i in P.arrayBAsket){
		//     console.log('Product_Details_saveClicked arrayBAsket<' + P.arrayBAsket[i].Quant + '>');
		// }

		//BAsket.app.navigate('Products/' + P.curCategoryId);
		BAsket.app.back();
	};

	return viewModel;
};
