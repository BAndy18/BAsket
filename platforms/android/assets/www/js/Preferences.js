BAsket.Preferences = function (params) {
	tabs = [
	  { text: "comment", icon: "comment" },
	  { text: "find", icon: "find" },
	  { text: "admin", icon: "user" },
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

	// var viewModel = {
	// 	dataSource: dataSource,
	// };
	//return viewModel;

	dsSQLiteSystem = DAL_local.ExecDataSource("select * from sqlite_master where type='table'");
	// dsSQLiteTable = function (arg) {
	// 	return [{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];
	// }
	dsSQLiteTable =  DAL_local.ExecDataSource2(name);
	//[{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];

};

BAsket.ReadNews = function (params) {
	var viewModel = {
		dataSource: DAL.Categories(),
	};
	return viewModel;
};