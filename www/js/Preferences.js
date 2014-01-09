BAsket.Preferences = function (params) {
	tabs = [
	  { text: _.Preferences.Main, icon: "comment" },
	  { text: _.Preferences.Functions, icon: "find" },
	  { text: _.Preferences.Admin, icon: "user" },
	];
	 
	var tabContent = ko.observable();
	  
	var selectedTab = ko.observable(0);
	
	var adminpass = ko.observable();
	var popupTitle = "Login";
	var buttonVisible = ko.observable(true);
	var popupVisible = ko.observable(false);

	var modeProdView = ko.observable(P.modeProdView);
	var debugMode = ko.observable(P.debugMode);
	var useWebDb = ko.observable(P.useWebDb);
	var userName = ko.observable(P.userName);

	showPopup = function () {
	  popupVisible(true);
	};
	clickLogin = function () {
		if (adminpass() == 'admin') {
	  		popupVisible(false);
	  	}
	  	else
	  		//BAsket.error("Incorrect password");
	  		DevExpress.ui.notify(_.Preferences.Incorrect_password, "error", 1000);
	};
	clickCancel = function () {
		//selectedTab(0);
		popupVisible(false);
	};
	clickRecreateLocal = function () {
		 DevExpress.ui.dialog.confirm("Вы уверены?", "Пересоздание локальной базы данных").done(function (dialogResult) {
            if (dialogResult){
				DAL.RecreateLocalDB();
            }
        });
	};

	ko.computed(function() {
		if (selectedTab() == 2) {
			popupVisible(true);
		}
    	tabContent(tabs[selectedTab()].content);
	});

	var viewModel = {
		selectedTab: selectedTab,
		popupVisible: popupVisible,

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
	};

	Preferences_TableMode = function(arg){
		P.modeProdView = P.ChangeValue("modeProdView", modeProdView());
	}
	Preferences_useWebDb = function(arg){
		P.useWebDb = P.ChangeValue("useWebDb", useWebDb());
	}
	Preferences_debugMode = function(arg){
		P.debugMode = P.ChangeValue("debugMode", debugMode());
	}
	Preferences_userName = function(arg){
		P.userName = P.ChangeValue("userName", userName());
	}

	Preferences_changePlatform = function(arg){
		if (arg.element.length > 0) {
			P.platformDevice = P.ChangeLookup("#lookupPlatform", "Platform");
	        //DevExpress.devices.current(P.platformDevice);
	        window.location.reload();
		}
	}
	Preferences_changeMapProvider = function(arg){
		if (arg.element.length > 0) 
			P.mapProvider = P.ChangeLookup("#lookupMapProvider", "MapProvider");
	}
	Preferences_changeLanguageUI = function(arg){
		if (arg.element.length > 0) {
			P.languageUI = P.ChangeLookup("#lookupLanguageUI", "LanguageUI");
			//P.ChangeLanguageUI();
			window.location.reload();
		}
	}


	//dsSQLiteSystem = DAL_local.ExecDataSource("select * from sqlite_master where type='table'");
	// dsSQLiteTable = function (arg) {
	// 	return [{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];
	// }
	//dsSQLiteTable =  DAL_local.ExecDataSource2(name);
	//[{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];

	return viewModel;
};

	BAsket.ReadNews = function (params) {
	var viewModel = {
		//dataSource: DAL.Categories(),
	};
	return viewModel;
};