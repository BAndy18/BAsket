"use strict";
window.BAsket = {};

$(function() {
    P.Init();

    DevExpress.devices.current(P.deviceClass);
    BAsket.app = new DevExpress.framework.html.HtmlApplication({
        namespace: BAsket,
        defaultLayout: P.layout,
        navigation: P.navigation
    });
    //Globalize.culture = Globalize.culture["ru-RU"];
    //$.preferCulture("ru-RU");
   // BAsket.app.viewShown.add(onViewShown);
    BAsket.app.router.register(":view/:id", {view: "home", id: undefined});
    BAsket.app.navigate();  
});

// (function () {
//     var data = DevExpress.data;
//     data.CustomStore = data.Store.inherit({
//         ctor: function (options) {
//             this.callBase(options);
//             this._myCallbackFunction = options.MyFunction
//         },
//         _loadImpl: function (options) {
//             var result = $.Deferred();
//             //debugger;
//             result.resolve(this._myCallbackFunction());
//             return result.promise();
//         }
//     });
// })();

// BAsket.home = function () {
//     return {
//     doHome: function () {
//       //BAsket.app.navigate("home");
//             $("#accordion").accordion({
//                 active: false,
//                 collapsible: true
//             });
//     },
//     // doIndex: function () {
//     //   BAsket.app.navigate("accordion");
//     // },
//   //   doPoses: function () {
//   //     BAsket.app.navigate("pose_list");
//   //   },
//   //   doAbout: function () {
//   //     BAsket.app.navigate("about");
//   //   },
//   };
// }
// function onViewShown(args) {
//     var viewInfo = args.viewInfo;
//     if (viewInfo.model.hideNavigationButton)
//         viewInfo.renderResult.$markup.find(".nav-button-item").remove();

//     //currentBackAction = viewInfo.model.backButtonDown;
// }


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


var R = (function ($, window) {
    var root = {};

    root.get = function(str){
        var ret = str;
        if (navigator.language == 'ru'){
            var tr = ru[str];
            if (tr)
                ret = tr;
        }
        return ret;
    }

    var ru = {
        "Name": "наименование",
        "Pack": "упаковка",
        "Price": "цена",
        "Count": "остаток",
    }

    return root;
})(jQuery, window);


var P = (function ($, window) {
    var root = {};

    root.navigation = [
            {
                "id": "Home",
                "title": "BAsket",
                "action": "#home", "heightRatio": 4, "widthRatio": 5,
                "icon": "home"
            },
            {
                "id": "Order",
                "title": "New Order",
                "action": "#Order", "heightRatio": 4, "widthRatio": 8,
                "icon": "cart"
            },
            {
                "id": "OrderList",
                "title": "Order List",
                "action": "#OrderList", "heightRatio": 4, "widthRatio": 5,
                "icon": "favorites"
            },
            {
                "id": "RoadMap",
                "title": "RoadMap",
                "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8,
                "icon": "map"
            },
            {
                "id": "Clients",
                "title": "Clients",
                "action": "#Clients", "heightRatio": 4, "widthRatio": 8,
                "icon": "globe"
            },
            {
                "id": "ReadNews",
                "title": "ReadNews",
                "action": "#ReadNews", "heightRatio": 4, "widthRatio": 5,
                "icon": "download"
            },
            {
                "id": "Preferences",
                "title": "Preferences",
                "action": "#Preferences", "heightRatio": 4, "widthRatio": 5,
                "icon": "preferences"
            },
            {
                "id": "Info",
                "title": "Info",
                "action": "#Info",  "heightRatio": 4, "widthRatio": 2,
                "icon": "info"
            },
            // {
            //     "id": "DataBoundApp",
            //     "title": "DataBoundApp",
            //     "action": "#DXhome",
            //     "icon": "home"
            // },
        ];

    root.navAgent = navigator.userAgent;
    root.deviceInfo = DevExpress.devices.current();
    root.layout = "slideout";
    //root.layout = "navbar";
    //root.layout = "default";

    root.deviceClass = 'androidTablet';

    root.currentCategory = null;

    //root.dataSouce = "http://sampleservices.devexpress.com/api/";
    root.dataSouce = "http://192.168.1.146//BAsketWS/api/";
    
    root.dataSouceType = "DAL_local";
    //root.dataSouceType = "DAL_web";
    //root.dataSouceType = "dataTest";
    
    root.loadPanelVisible = ko.observable(false);

    root.Init = function(){
        root.deviceClass = root.deviceInfo.platform;
        if (root.navAgent.indexOf(' MSIE ') > 0) root.deviceClass = 'win8Phone';
        
        if (root.deviceInfo.platform == 'desktop') root.deviceClass = 'iPhone';
        // "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "desktop" and "tizen". 

        root.ReadFirstCategory();
    };
    root.ReadFirstCategory = function () {
        DAL_local.ExecQuery('SELECT * FROM CAT LIMIT 1').done(function (result) {
            if (result.length > 0)
                root.currentCategory = {id:result[0].id, name:result[0].name};
            else {
                DAL_local.ExecQuery('SELECT * FROM CAT LIMIT 1').done(function (result) {
                    if (result.length > 0)
                        root.currentCategory = {id:result[0].id, name:result[0].name};
                })
            }
        })
    };

    root.geoCurrent = "";
    root.getGeo = function(){
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                root.geoCurrent = position.coords.latitude + ',' + position.coords.longitude;
                alert(root.geoCurrent);
            },
            function(msg) {
                root.geoCurrent = typeof msg == 'string' ? msg : "failed";
                alert(root.geoCurrent);
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
        'CREATE TABLE IF NOT EXISTS CAT (id unique, name)',
        'CREATE TABLE IF NOT EXISTS WAR (id unique, idGr, name, price DECIMAL(20,2), nameArt, nameManuf, urlPict, upak, ostat, bSusp int)',
        'CREATE TABLE IF NOT EXISTS CLI (id unique, r_fcli, Name, Adres, geoLoc)',
        'CREATE TABLE IF NOT EXISTS NMS (T_NMS unique, N_NMS TINYINT, Name, NameC)',
        'CREATE TABLE IF NOT EXISTS BILM (id unique, DateDoc DateTime, r_cli, r_fcli, sNote, sOther, sWars, NumD, DateSync DateTime, sServRet, bSusp bit)',
        'CREATE TABLE IF NOT EXISTS RMAP (id unique, DateDoc DateTime, r_cli, r_fcli, sNote, sOther, DateSync DateTime, sServRet, bSusp int)',
        "INSERT INTO CLI (id,  r_fcli, Name, Adres, geoLoc) VALUES('10', '', 'Client10', 'Izhevsk KM/10', '56.844278,53.206272')",
        "INSERT INTO CLI (id,  r_fcli, Name, Adres, geoLoc) VALUES('11', '10', 'FilOfClient10', 'Izhevsk2 KM/102222', '56.844278,53.206272')",
        "INSERT INTO BILM (id,  DateDoc, r_cli, r_fcli, sNote, sOther, sWars) VALUES('111', '22/12/2013', '10','','Note', '1:2', '10:1;11:2')",
        "INSERT INTO RMAP (id,  DateDoc, r_cli, r_fcli, sNote) VALUES('1', '12/11/2013', '10','','Note')",
    ];
    return root;
})(jQuery, window);