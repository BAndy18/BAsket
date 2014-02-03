var U = (function ($, window) {
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

var P = (function ($, window) {
	var root = {};

    // root.Command_Info = function(arg) {
    //     if (typeof arg == 'string'){
    //         BAsket.notify('Info for:' + arg);
    //         BAsket.app.navigate('Info/' + arg);
    //     }
    //     else
    //         if (arg.model){
    //             BAsket.notify('Info for:' + arg.model.name)
    //             BAsket.app.navigate('Info/' + arg.model.name);
    //         }
    //     //debugger;
    //     //alert('BAsket.Command_Info');
    // }

	root.navigation = [
            {
            	"id": "Home", "action": "#home", "heightRatio": 4, "widthRatio": 4, "icon": "home",
            	"title": "BAsket", "backcolor": "black",
            },
            {
            	"id": "Order", "action": "#Order", "heightRatio": 4, "widthRatio": 8, "icon": "cart",
            	"title": "NewOrder", "backcolor": "#FF981D",
            },
            {
            	"id": "OrderList", "action": "#OrderList", "heightRatio": 4, "widthRatio": 4, "icon": "favorites",
            	"title": "Order List", "backcolor": "#15992A",
            },
            {
            	"id": "RoadMapList", "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8, "icon": "map",
            	"title": "RoadMap", "backcolor": "#006AC1",
            },
            {
            	"id": "Clients", "action": "#Clients", "heightRatio": 4, "widthRatio": 8, "icon": "globe",
            	"title": "Clients", "backcolor": "#7200AC",
            },
            {
            	"id": "ReadNews", "action": "#ReadNews", "heightRatio": 4, "widthRatio": 4, "icon": "download",
            	"title": "ReadNews", "backcolor": "red",
            },
            {
            	"id": "Preferences", "action": "#Preferences", "heightRatio": 4, "widthRatio": 4, "icon": "preferences",
            	"title": "Preferences", "backcolor": "red",
            },
            {
            	"id": "Info", "action": "#Info", "heightRatio": 4, "widthRatio": 2, "icon": "info",
            	"title": "Info", "backcolor": "#7200AC",
            },
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

	var languageMap = {
		'English': EN_US,
		'Русский': RU_RU,
	};
	function getValue(obj, key) {
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (i == key) {
				return obj[i];
			}
		}
	};

	root.ChangeLanguageUI = function() {
		if (root.languageUI == '-')
			_ = RU_RU;
		else
			_ = getValue(languageMap, root.languageUI);

		root.navigation.forEach(function(entry) {
			var nav = eval("_.Navigation." + entry.id);
			if (nav)
				entry.title = nav;
		});
	};

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
		BAsket.app.navigate(e.itemData.action.substring(1), { direction: 'none' });
	};
	root.itemIcon = function(icon) {
		return 'tileicon dx-icon-' + icon.toLowerCase();
	};
	root.itemCount = {
		'OrderList': iniLocalStor("OrderList", '0'),
		'RoadMapList': iniLocalStor("RoadMapList", ''),
		'Clients': iniLocalStor("Clients", ''),
		'ReadNews': iniLocalStor("ReadNews", ''),
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
	root.layout = "slideout";
	//root.layout = "navbar";
	//root.layout = "simple";
	//root.layout = "pivot";

	root.deviceClass = 'android';

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

	root.arrCategory = [];
	root.arrNMS = [];


	// root.dataSouceUrl = "http://sampleservices.devexpress.com/api/";
	// root.dataSouceUrl = "http://87.249.234.190:55777/BWS2/api/";
	// root.dataSouceUrl = "http://10.0.0.2/BWS2/api/";
	// root.dataSouceUrl = "http://192.168.1.146/BAsketWS/api/";
	root.dataSouceUrl = '';

	// root.dataSouceType = "DAL_local";
	// root.dataSouceType = "DAL_web";

	root.pageSize = 30;

	root.Init = function () {
		root.useWebDb = iniLocalStor("useWebDb", "true") == "true";
		// var e;
		// try {
		// 	if (!window.openDatabase)
		// 		root.useWebDb = false;
		// 	else {
		// 		var mydb = openDatabase("BAsketDB", "1.0", "BAsketDB", 5000000);
		// 	}
		// } catch (e) {
		// 	// Error handling code goes here. 
		// 	if (e == INVALID_STATE_ERR) {
		// 		// Version number mismatch. 
		// 		alert("Invalid database version.");
		// 	} else {
		// 		alert("Unknown error " + e + ".");
		// 	}
		// }
		//alert("Test openDatabase OK " + root.useWebDb);

		root.platformDevice = 'android';
		root.platformDevice = iniLocalStor("Platform", 'android');
		if (root.platformDevice == '-')
			root.platformDevice = root.deviceInfo.platform;

		root.deviceClass = {};
		root.deviceClass['platform'] = root.platformDevice;
		var pdArr = root.platformDevice.split(' ');
        if (pdArr[0] == 'ios')
            root.LoadFile('css/dx.ios.default.css', 'css');
        else if (pdArr[0] == 'generic')
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
        root.languageUI = '-';
        root.languageUI = iniLocalStor("LanguageUI", '-');
        root.ChangeLanguageUI();

        BAsket.navigation = P.navigation.slice(0);
        BAsket.navigation = BAsket.navigation.splice(1);

        root.UserName = iniLocalStor("userName", "-");
        if (root.UserName == '-') root.UserName = 'BAndy';
        root.UserPassword = iniLocalStor("userPassword", "-");
        if (root.UserPassword == '-') root.UserPassword = root.getDeviceId();
        root.UserEMail = iniLocalStor("userEMail", "-");

        var auth = "Basic " + [root.UserName + ":" + root.UserPassword].join(":");
        auth = DevExpress.data.base64_encode(auth);
        // document.cookie = ".ASPXAUTH=" + auth;
        // document.cookie = ".ASPXAUTH=" + DevExpress.data.base64_encode(auth);
        document.cookie = ".BAsketAUTH=" + auth;
        sessionStorage['.BAsketAUTH'] = auth;
        root.ajaxHeaders = (root.bPhoneGap || !location.port) ? {
            'Authorization': auth,
            // 'Cookie' : document.cookie
            // 'Access-Control-Allow-Origin': true,
            // 'Authorization' : getToken()
            // 'Authorization': "Basic " + DevExpress.data.base64_encode([P.UserName, P.UserPassword].join(":"))
        } : {};
        // root.ajaxHeaders = {};

        root.copyright = 'BAsket \u00A9 2014 BAndy soft. All rights reserved (' + root.deviceClass.platform + '; ver. ' + VerConst + ')';

		root.arrCategory = JSON.parse(iniLocalStor("categories", "{}"));
        if (!root.arrCategory.length) {
            // DevExpress.ui.dialog.confirm("Вы уверены?", "Первичная загрузка данных").done(function (dialogResult) {
            // if (dialogResult){
            DAL.ReadNews(true, true);
            // }
            // });
            return;
        }
		root.arrNMS[0] = JSON.parse(iniLocalStor("NMS0", '{}'));
		for (var i = 0; i < root.arrNMS[0].length; i++) {
			root.arrNMS[i + 1] = JSON.parse(iniLocalStor("NMS" + root.arrNMS[0][i].Id, ''));
		}
        if (root.arrCategory.length > 0){
    		root.curCategoryId = root.arrCategory[0].Id;
    		root.curCategoryName = root.arrCategory[0].Name;
        }

		DAL.TableCount();

		var view = $("#idMainTileView").data("dxTileView");        //dxTileView("instance");
		if (view)
			view.repaint();
	};

	return root;
})(jQuery, window);