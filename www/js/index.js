﻿"use strict";
window.BAsket = {};

window.onerror = function(msg, url, line) {
   // You can view the information in an alert to see things working
   // like so:
   var str = "Error: " + msg + "\nurl: " + url + "\nline #: " + line;
   alert(str);
   console.log(str);
   return true;
};

$(function() {
    //var db = window.indexedDB.open('FriendDB', 'My Friends!');
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
    });
    //Globalize.culture = Globalize.culture["ru-RU"];
    //$.preferCulture("ru-RU");
   // BAsket.app.viewShown.add(onViewShown);
    BAsket.app.router.register(":view/:Id", {view: "home", Id: undefined});
    BAsket.app.navigate();  
//    BAsket.app.navigate('Index');  
});

//type: 'info'|'warning'|'error'|'success', default == "success"
BAsket.notify = function(message, type, time) {
  if (!type) type = "success";
  if (!time) time = 1000;
  DevExpress.ui.notify(message, type, time);
}

BAsket.error = function(message) {
  BAsket.notify(message, "error");
}


BAsket.home = function () {
    var viewModel = {
        itemClick: function (e) {
            //debugger;
            var act = e.itemData.action.substring(1);
            BAsket.app.navigate(e.itemData.action.substring(1));
        }
    };
    return viewModel;
}

var _ = EN_US;

