"use strict";
window.BAsket = {};

$(function() {
    P.Init();

    DevExpress.devices.current({platform: P.deviceClass, version: '6', deviceType: "tablet"});
    //DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform);
    BAsket.app = new DevExpress.framework.html.HtmlApplication({
        namespace: BAsket,
        navigationType: P.layout,
        navigation: P.navigation,
        navigateToRootViewMode: true,
    //    disableViewCache: true
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

var P = (function ($, window) {
    var root = {};

    root.navigation = [
            {
                "id": "Home",   "action": "#home", "heightRatio": 4, "widthRatio": 4,    "icon": "home",
                "title": "BAsket",   "backcolor": "black",
            },
            {
                "id": "Order",  "action": "#Order", "heightRatio": 4, "widthRatio": 8,   "icon": "cart",
                "title": "NewOrder",    "backcolor": "#FF981D",
            },
            {
                "id": "OrderList",  "action": "#OrderList", "heightRatio": 4, "widthRatio": 4,  "icon": "favorites",
                "title": "Order List",  "backcolor": "#15992A",
            },
            {
                "id": "RoadMap",    "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8,    "icon": "map",
                "title": "RoadMap",     "backcolor": "#006AC1",
            },
            {
                "id": "Clients",    "action": "#Clients", "heightRatio": 4, "widthRatio": 8,    "icon": "globe",
                "title": "Clients",     "backcolor": "#7200AC",
            },
            {
                "id": "ReadNews",   "action": "#ReadNews", "heightRatio": 4, "widthRatio": 4,   "icon": "download",
                "title": "ReadNews",    "backcolor": "red",
            },
            {
                "id": "Preferences",    "action": "#Preferences", "heightRatio": 4, "widthRatio": 4,    "icon": "preferences",
                "title": "Preferences","backcolor": "red",
            },
            {
                "id": "Info",   "action": "#Info",  "heightRatio": 4, "widthRatio": 2,  "icon": "info",
                "title": "Info","backcolor": "#7200AC",
            },
        ];

    root.navAgent = navigator.userAgent;
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
    root.currentNms = []
    root.arrayBAsket = [];
    root.arrayBAsketL = [];
    root.copyright = '';
    root.debugMode = false;
    root.geoDirectionsUrl = 'http://maps.googleapis.com/maps/api/directions/json';


    //root.dataSouceUrl = "http://sampleservices.devexpress.com/api/";
    root.dataSouceUrl = ''; //"http://192.168.1.146//BAsketWS/api/";
    
    root.dataSouceType = "DAL_local";
    //root.dataSouceType = "DAL_web";

    root.pageSize = 30;
    
    root.loadPanelVisible = ko.observable(false);
    function iniLocalStor(key, defval) {
        var vari = window.localStorage.getItem(key);
        if (!vari){
            vari = defval;
            window.localStorage.setItem(key, vari);
        }
        return vari;
    };
    root.ChangeLookup = function (id, key){
        var lookup = $(id).data("dxLookup");
        var value = lookup.option("value");      
        window.localStorage.setItem(key, value);
        return value;
    }
    root.ChangeValue = function (key, value){
        window.localStorage.setItem(key, value);
        return value;
    }

    var languageMap = {
        'English' : EN_US,
        'Русский' : RU_RU,
    }
    function getValue(obj, key){
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (i == key) {
                return obj[i];
            }
        }
    }

    root.ChangeLanguageUI = function (){
        if (root.languageUI == '-')
            _ = RU_RU;
        else
            _ = getValue(languageMap, root.languageUI);

        root.navigation.forEach(function(entry) {
            var nav = eval("_.Navigation." + entry.id);
            if (nav)
                entry.title = nav;
        })
    }

    root.geoCurrent = ko.observable("");
    root.getGeo = function(){
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                root.geoCurrent(position.coords.latitude.toFixed(6) + ',' + position.coords.longitude.toFixed(6));
                ///alert(root.geoCurrent);
            },
            function(msg) {
                root.geoCurrent(typeof msg == 'string' ? msg : "failed");
                //alert(root.geoCurrent);
            })
        }
    };
    root.getDistance = function(p1, p2){
        var R = 6371; // km
        var dLat = ((p2[0]) - (p1[0]))* Math.PI / 180;
        var dLon = ((p2[1]) - (p1[1]))* Math.PI / 180;
        var lat1 = (p1[0])* Math.PI / 180;
        var lat2 = (p2[0])* Math.PI / 180;

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
    }
    root.geoBearing = function(p1, p2){
        var dLon = (p2[1]-p1[1]) * Math.PI / 180;
        var y = Math.sin(dLon) * Math.cos(p2[0]);
        var x = Math.cos(p1[0])*Math.sin(p2[0]) -
                Math.sin(p1[0])*Math.cos(p2[0])*Math.cos(dLon);
        var brng = Math.atan2(y, x)  * 180 / Math.PI ;
        return brng;
    }
    root.geoCoder = function(address){
        var geocoder = new google.maps.Geocoder();
        var deferred = new $.Deferred();
        //var address = document.getElementById("gadres").value;
        geocoder.geocode( { 'address': address}, function(results, status) {
            var res = [];
            if (status == google.maps.GeocoderStatus.OK) {
                //map.setCenter(results[0].geometry.location);
                res = [
                    results[0].geometry.location.lat().toFixed(6),
                    results[0].geometry.location.lng().toFixed(6)
                ];
            }
            deferred.resolve(res);
        })
        return deferred;
    }

    root.itemClick = function (e) {
            BAsket.app.navigate(e.itemData.action.substring(1), { direction: 'none'});
        }
    root.itemIcon = function (icon) {
        return 'tileicon dx-icon-' + icon.toLowerCase();
    }
    root.itemCount = {
        'OrderList' : iniLocalStor("OrderList", '0'),
        'RoadMap' : iniLocalStor("RoadMap", ''),  //'2.01 (2)',
        'Clients' : iniLocalStor("Clients", ''), //'2134',
        'ReadNews' : iniLocalStor("ReadNews", ''), //'13.12',
    }

    root.Init = function(){
        DAL.TableCount();
        root.modeProdView = iniLocalStor("modeProdView", "true") == "true";
        root.debugMode = iniLocalStor("debugMode", "true") == "true";

        root.mapProvider = iniLocalStor("MapProvider", "google");
        root.languageUI = '-';
        root.languageUI = iniLocalStor("LanguageUI", '-');
        root.ChangeLanguageUI();

        root.platformDevice = root.deviceClass = 'android';
        root.platformDevice = root.deviceClass = iniLocalStor("Platform", 'android');
        if (root.deviceClass == '-')
            root.deviceClass = root.deviceInfo.platform;

        root.copyright = 'BAsket \u00A9 2014 BAndy soft. All rights reserved (' + root.deviceClass + '; ver. 2.0)';

        DAL.ReadFirstCategory();
        DAL.ReadNms();

        var view = $("#idMainTileView").data("dxTileView");
        if (view)
            view.repaint();
    };
    
    return root;
})(jQuery, window);