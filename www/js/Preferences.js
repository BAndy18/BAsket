BAsket.Preferences = function (params) {
	tabs = [
	  { text: "Main Properties", icon: "comment" },
	  { text: "Functions", icon: "find" },
	  { text: "Admin", icon: "user" },
	];
	 
	tabContent = ko.observable();
	  
	selectedTab = ko.observable(0);
	
	adminpass = ko.observable();
	popupTitle = "Login";
	buttonVisible = ko.observable(true);
	popupVisible = ko.observable(false);
	showPopup = function () {
	  popupVisible(true);
	};
	clickLogin = function () {
		if (adminpass() == 'admin') {
	  		popupVisible(false);
	  	}
	  	else
	  		//BAsket.error("Incorrect password");
	  		DevExpress.ui.notify("Incorrect password", "error", 1000);
	};
	clickCancel = function () {
		//selectedTab(0);
		popupVisible(false);
	};
	clickRecreateLocal = function () {
		DAL.RecreateLocalDB();
	};

	ko.computed(function() {
		if (selectedTab() == 2) {
			popupVisible(true);
		}
    	tabContent(tabs[selectedTab()].content);
	});

	var viewModel = {
	//	dataSource: dataSource,
    // "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "desktop" and "tizen". 
		dsPlatform: {
            data: ["Default", "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "tizen"],
            value: ko.observable(P.platformDevice)
		},
		dsMapProvider: {
            data: ["google", "googleStatic", "bing"],
            value: ko.observable(P.mapProvider)
		},
		dsLanguage: {
            data: ["Default", "English", "Russian"],
            value: ko.observable(P.languageUI)
		}
	};

	changePlatform = function(arg){
		if (arg.element.length > 0) {
			P.platformDevice = P.ChangeLookup("#lookupPlatform", "Platform");
	        DevExpress.devices.current(P.platformDevice);
	        window.location.reload();
		}
	}
	changeMapProvider = function(arg){
		if (arg.element.length > 0) 
			P.mapProvider = P.ChangeLookup("#lookupMapProvider", "MapProvider");
	}
	changeLanguageUI = function(arg){
		if (arg.element.length > 0) 
			P.languageUI = P.ChangeLookup("#lookupMapProvider", "LanguageUI");
	}


	dsSQLiteSystem = DAL_local.ExecDataSource("select * from sqlite_master where type='table'");
	// dsSQLiteTable = function (arg) {
	// 	return [{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];
	// }
	//dsSQLiteTable =  DAL_local.ExecDataSource2(name);
	//[{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];

	return viewModel;
};

BAsket.ReadNews = function (params) {
	var viewModel = {
		dataSource: DAL.Categories(),
	};
	return viewModel;
};