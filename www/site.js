window.BAsketSite = {};

$(function() {
	// P.Init();

	DevExpress.devices.current(P.deviceClass);
	BAsketSite.app = new DevExpress.framework.html.HtmlApplication({
		namespace: BAsketSite,
		navigationType: P.layout,
		navigation: P.navigation,
		navigateToRootViewMode: true,
		//        disableViewCache: true
	});
	BAsketSite.app.router.register(":view/:Id", { view: "home", Id: undefined });
	BAsketSite.app.navigate();
});

var P = (function ($, window) {
	var root = {};

	root.navigation = [
            {
            	"id": "Home", "action": "#home", "heightRatio": 4, "widthRatio": 4, "icon": "home",
            	"title": "Home", "backcolor": "#222222"
            },
            {
            	"id": "Order", "action": "#Order", "heightRatio": 4, "widthRatio": 8, "icon": "cart",
            	"title": "NewOrder", "backcolor": "#FF981D"
            },
            {
            	"id": "OrderList", "action": "#OrderList", "heightRatio": 4, "widthRatio": 4, "icon": "favorites",
            	"title": "Order List", "backcolor": "#15992A"
            },
            {
            	"id": "RoadMapList", "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8, "icon": "map",
            	"title": "RoadMap", "backcolor": "#006AC1"
            },
            {
            	"id": "Download", "action": "#Download", "heightRatio": 4, "widthRatio": 8, "icon": "download",
            	"title": "Download", "backcolor": "#7200AC"
            },
            {
            	"id": "Demo", "action": "#Demo", "heightRatio": 4, "widthRatio": 4, "icon": "download",
            	"title": "Demo", "backcolor": "red"
            },
            {
            	"id": "Preferences", "action": "#Preferences", "heightRatio": 4, "widthRatio": 4, "icon": "preferences",
            	"title": "Preferences", "backcolor": "red"
            },
            {
            	"id": "Info", "action": "#Info", "heightRatio": 4, "widthRatio": 2, "icon": "info",
            	"title": "Info", "backcolor": "#7200AC"
            }
	];

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

	root.itemClick = function(e) {
		if (e.itemData.id == 'Demo'){			
			location = 'index.html';
		}
		else {
			var text = '<p>'+ new Array( 444 ).join( e.itemData.id + ' ' ) + '</p>'
			$("#textContainer").html(text);
			// $("#textContainer").html(root[e.itemData.id]);
			// BAsketSite.app.navigate(e.itemData.action.substring(1), { direction: 'none', root: true });
		}
	};
	root.itemIcon = function(icon) {
		return 'tileicon dx-icon-' + icon.toLowerCase();
	};
	root.itemCount = {
		'Home': 'smail',
		'Download': BAsketVer,
		'Clients': iniLocalStor("Clients", ''),
		'ReadNews': iniLocalStor("ReadNews", '')
	};

	root.layout = "slideout";

    var platformDevice = 'android';
	platformDevice = iniLocalStor("site-Platform", 'android');
	if (platformDevice == '-')
		platformDevice = DevExpress.devices.current().platform;

	root.deviceClass = {};
	root.deviceClass['platform'] = platformDevice;

    root.copyright = 'BAsket \u00A9 2014 BAndy Soft. All rights reserved (' + root.deviceClass.platform + ')';

	return root;
})(jQuery, window);