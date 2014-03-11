
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

