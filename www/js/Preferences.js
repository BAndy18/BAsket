BAsket.Preferences = function (params) {
	tabs = [
	  { text: _.Preferences.Main, icon: "comment" },
	  { text: _.Preferences.Functions, icon: "user" },
	  { text: _.Preferences.Admin, icon: "preferences" },
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
	};
	Preferences_TableMode = function(arg) {
		P.modeProdView = P.ChangeValue("modeProdView", modeProdView());
	};
	Preferences_useWebDb = function(arg) {
		P.useWebDb = P.ChangeValue("useWebDb", useWebDb());
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
			//DevExpress.devices.current(P.platformDevice);
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
			//P.ChangeLanguageUI();
			window.location.reload();
		}
	};

	Preferences_clickLogin = function () {
		if (adminPassword() == P.adminPassword) {
			popupVisible(false);
		}
		else
			//BAsket.error("Incorrect password");
			BAsket.notify(_.Preferences.Incorrect_password, "error");
	};
	Preferences_clickCancel = function () {
		//selectedTab(0);
		popupVisible(false);
	};
	Preferences_clickRecreateLocal = function () {
		DevExpress.ui.dialog.confirm("Вы уверены?", "Пересоздание локальной базы данных").done(function (dialogResult) {
			if (dialogResult) {
				DAL.RecreateLocalDB();
			}
		});
	};



	//dsSQLiteSystem = DAL_local.ExecDataSource("select * from sqlite_master where type='table'");
	// dsSQLiteTable = function (arg) {
	// 	return [{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];
	// }
	//dsSQLiteTable =  DAL_local.ExecDataSource2(name);
	//[{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];

	var viewModel = {
		selectedTab: selectedTab,
		popupVisible: popupVisible,
		adminPassword: adminPassword,
		popupTitle: "Login",
		dataSouceUrl: dataSouceUrl,

		dsWsUrl: ['', 'http://87.249.234.190:55777/BWS2/api/', 
			'http://10.0.0.30:55444/BWS2/api/', 
			'http://192.168.1.146/BAsketWS/api/',
			'http://192.168.1.125/BAsketWS/api/',
			],

		// "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "desktop" and "tizen". 
		dsPlatform: {
			data: ['-', "generic", "ios", "ios v6", "android", "android black", "tizen", "tizen black"],
			// data: ['-', "generic", "ios", "android", "win8", "tizen"],
			//            data: ['-', "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "tizen"],
			value: ko.observable(P.platformDevice)
		},
		dsMapProvider: {
			data: ["google", "googleStatic", "bing"],
			value: ko.observable(P.mapProvider)
		},
		dsLanguage: {
			data: ['-', "English", "Русский"],
			value: ko.observable(P.languageUI)
		},

		modeProdView: modeProdView,
		debugMode: debugMode,
		useWebDb: useWebDb,
		userName: userName,
		userPass: userPass,
		userEMail: userEMail,
	};

	return viewModel;
};


BAsket.Info = function (params) {
	// var rootShow = ko.observable(true);
	var subTitle = ko.observable('');
	var subText = ko.observable('');
	var dsInfo = P.navigation.splice(1);
	if (params.Id) {
		// rootShow(false);
		subTitle(params.Id);	//' - ' + 
		var text = _.Info[params.Id]	//params.Id + " string to repeat\n";
		// subText('<p>'+ new Array( 444 ).join( text ) + '</p>');
		subText(text);		
	} else {
		dsInfo.splice(-1, 1);
		dsInfo.push({"id": "Products", "heightRatio": 4, "widthRatio": 8, "icon": "cart", "title": _.Info.IProducts, "backcolor": "#FF981D"});
		dsInfo.push({"id": "Product-Details", "heightRatio": 4, "widthRatio": 4, "icon": "cart", "title": _.Info.IProductDet, "backcolor": "#FF981D"});
		dsInfo.push({"id": "Client", "heightRatio": 4, "widthRatio": 4, "icon": "globe", "title": _.Info.IClient, "backcolor": "#7200AC"});
		dsInfo.push({"id": "RoadMap", "heightRatio": 4, "widthRatio": 4, "icon": "map", "title": _.Info.IMap, "backcolor": "#006AC1"});
		dsInfo.push({"id": "Contacts", "heightRatio": 4, "widthRatio": 8, "icon": "home", "title": _.Info.IContacts, "backcolor": "red"});
		dsInfo.push({"id": "SysInfo", "heightRatio": 4, "widthRatio": 4, "icon": "preferences", "title": "SysInfo", "backcolor": "black"});
		for (var info in dsInfo){
			dsInfo[info].action = '#Info/' + dsInfo[info].id;
		}
	}
	var viewModel = {
		title: _.Info.Title,	//'Info',	// + subTitle(),
		// rootShow: rootShow,
		subTitle: subTitle,
		viewShown: function () {
			$("#textContainer").html(subText());
		},
		dsInfo: dsInfo, 
	};
	return viewModel;
};


BAsket.ReadNews = function (params) {
	var viewModel = {
		modeSaveOrd:  ko.observable(true),
		modeLoadOst:  ko.observable(true),
		modeLoadSpr:  ko.observable(false),
		arrayRepo: P.arrNMS[2],
	};

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
