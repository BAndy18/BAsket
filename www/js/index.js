"use strict";
window.BAsket = {};

$(function() {
    P.Init();

    DevExpress.devices.current({platform: P.deviceClass, version: '6'});
    //DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform);
    BAsket.app = new DevExpress.framework.html.HtmlApplication({
        namespace: BAsket,
        navigationType: P.layout,
        navigation: P.navigation,
        navigateToRootViewMode: true
    });
    //Globalize.culture = Globalize.culture["ru-RU"];
    //$.preferCulture("ru-RU");
   // BAsket.app.viewShown.add(onViewShown);
    BAsket.app.router.register(":view/:Id", {view: "home", Id: undefined});
    BAsket.app.navigate();  
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
                "id": "Home",   "action": "#home", "heightRatio": 4, "widthRatio": 5,    "icon": "home",
                "title": "BAsket",                
            },
            {
                "id": "Order",  "action": "#Order", "heightRatio": 4, "widthRatio": 8,   "icon": "cart",
                "title": "NewOrder",
            },
            {
                "id": "OrderList",  "action": "#OrderList", "heightRatio": 4, "widthRatio": 5,  "icon": "favorites",
                "title": "Order List",
            },
            {
                "id": "RoadMap",    "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8,    "icon": "map",
                "title": "RoadMap",
            },
            {
                "id": "Clients",    "action": "#Clients", "heightRatio": 4, "widthRatio": 8,    "icon": "globe",
                "title": "Clients",
            },
            {
                "id": "ReadNews",   "action": "#ReadNews", "heightRatio": 4, "widthRatio": 5,   "icon": "download",
                "title": "ReadNews",
            },
            {
                "id": "Preferences",    "action": "#Preferences", "heightRatio": 4, "widthRatio": 5,    "icon": "preferences",
                "title": "Preferences",
            },
            {
                "id": "Info",   "action": "#Info",  "heightRatio": 4, "widthRatio": 2,  "icon": "info",
                "title": "Info",
            },
        ];

    root.navAgent = navigator.userAgent;
    root.deviceInfo = DevExpress.devices.current();
    root.layout = "slideout";
    //root.layout = "navbar";
    //root.layout = "simple";
    //root.layout = "pivot";

    root.deviceClass = 'androidTablet';

    root.curCategoryId = 0;
    root.curCategoryName = '';
    root.curModeChoice = true;
    root.modeProdView = true;
    root.currentNms = []
    root.arrayBAsket = [];
    // root.getBAsketArray = function(){
    //     var basket = [];
    //     $.each(P.arrayBAsket, function(i, obj) {
    //         var b = {'id':i, 'name':obj.name,'upak':obj.upak,'quant':obj.quant,'price':obj.price};
    //         basket.push(b);
    //     });
    // }


    //root.dataSouce = "http://sampleservices.devexpress.com/api/";
    root.dataSouce = "http://192.168.1.146//BAsketWS/api/";
    
    root.dataSouceType = "DAL_local";
    //root.dataSouceType = "DAL_web";
    //root.dataSouceType = "dataTest";

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

    root.Init = function(){

        root.mapProvider = iniLocalStor("MapProvider", "google");
        root.languageUI = '-';
        root.languageUI = iniLocalStor("LanguageUI", '-');
        root.ChangeLanguageUI();

        root.platformDevice = root.deviceClass = 'ios';
//        root.platformDevice = root.deviceClass = 'iPhone';
        root.platformDevice = root.deviceClass = iniLocalStor("Platform", '-');
        if (root.deviceClass == '-')
            root.deviceClass = root.deviceInfo.platform;
        //if (root.navAgent.indexOf(' MSIE ') > 0) root.deviceClass = 'win8Phone';
        //if (root.deviceClass == 'desktop') root.deviceClass = 'iPhone';
        // "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "desktop" and "tizen". 


        root.ReadFirstCategory();
        root.ReadFirstNms();
    };
    root.ReadFirstCategory = function () {
        DAL_local.ExecQuery('SELECT * FROM CAT LIMIT 1').done(function (result) {
            if (result.length > 0) {
                root.curCategoryId = result[0].Id;
                root.curCategoryName = result[0].Name;
            }
            else {
                DAL_local.ExecQuery('SELECT * FROM CAT LIMIT 1').done(function (result) {
                    if (result.length > 0) {
                        root.curCategoryId = result[0].Id;
                        root.curCategoryName = result[0].Name;
                    }
                })
            }
        })
    };
    root.ReadFirstNms = function () {
//        DAL_local.ExecQuery("SELECT * FROM NMS Where idRoot='0'").done(function (result) {
        DAL.NMS(0).load().done(function (result) {
            root.currentNms.push(result);
            for (var i=0; i<result.length; i++) {
//                DAL_local.ExecQuery("SELECT id,Name FROM NMS Where idRoot='" + result[i].id + "'").done(function (result) {
                DAL.NMS(result[i].Id).load().done(function (result) {
                    root.currentNms.push(result);
                    //root.currentNms.push({id:result[0].id, Name:result[0].Name});
                })
            }
        })            
    };

    root.geoCurrent = ko.observable("");
    root.getGeo = function(){
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                root.geoCurrent(position.coords.latitude + ',' + position.coords.longitude);
                ///alert(root.geoCurrent);
            },
            function(msg) {
                root.geoCurrent(typeof msg == 'string' ? msg : "failed");
                //alert(root.geoCurrent);
            })
        }
    };

    root.itemClick = function (e) {
            BAsket.app.navigate(e.itemData.action.substring(1), { direction: 'none'});
        }
        root.itemIcon = function (icon) {
            return 'tileicon dx-icon-' + icon.toLowerCase();
        }

    root.LocalScript = [
        'DROP TABLE IF EXISTS CAT',
        'DROP TABLE IF EXISTS WAR',
        'DROP TABLE IF EXISTS CLI',
        'DROP TABLE IF EXISTS BILM',
        'DROP TABLE IF EXISTS RMAP',
        'DROP TABLE IF EXISTS NMS',
        'CREATE TABLE IF NOT EXISTS CAT (Id unique, Name)',
        'CREATE TABLE IF NOT EXISTS WAR (Id unique, IdGr, Name, Price DECIMAL(20,2), NameArt, NameManuf, UrlPict, Upak, Ostat, bSusp int)',
        'CREATE TABLE IF NOT EXISTS CLI (Id unique, IdPar, Name, Adres, GeoLoc)',
        'CREATE TABLE IF NOT EXISTS NMS (IdRoot, Id, Name)',
        'CREATE TABLE IF NOT EXISTS BILM (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, IdCli, IdTp, sNote, sOther, sWars, NumD, DateSync DateTime, sServRet, bSusp bit)',
        'CREATE TABLE IF NOT EXISTS RMAP (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, IdCli, IdTp, sNote, sOther, DateSync DateTime, sServRet, bSusp int)',
        "INSERT INTO RMAP (DateDoc, IdCli, IdTp, sNote) VALUES('12.11.2013', '10','','Note')",
        "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '1', 'Предприятие')",
        "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '2', 'Тип Оплаты')",
        "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '1', 'Пупкин ЧП')",
        "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '2', 'Ступкин ООО')",
        "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '1', 'наличные')",
        "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '2', 'безнал')",
    ];
        // "INSERT INTO BILM (DateDoc, IdCli, IdTp, sNote, sOther, sWars) VALUES('22.12.2013', '10','','Note', '1:2', '10:1;11:2')",
        // "INSERT INTO CLI (Id,  IdPar, Name, Adres, GeoLoc) VALUES('10', '', 'Client10', 'Izhevsk KM/10', '56.844278,53.206272')",
        // "INSERT INTO CLI (Id,  IdPar, Name, Adres, GeoLoc) VALUES('11', '10', 'FilOfClient10', 'Izhevsk2 KM/102222', '56.844278,53.206272')",
    return root;
})(jQuery, window);