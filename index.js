window.BAsketSite = {};

$(function() {
	// P.Init();
	if (P.isGetConfig && !P.isInitSite)
		BAsketSite.IniSite();
});

BAsketSite.IniSite = function () {
	P.isInitSite = true;
	DevExpress.devices.current(P.deviceClass);
	BAsketSite.app = new DevExpress.framework.html.HtmlApplication({
		namespace: BAsketSite,
		navigationType: P.layout,
		navigation: P.navigation,
		navigateToRootViewMode: true,
		//        disableViewCache: true
	});
	P.heightContent = ($(".dx-viewport").height() - 100) / 4;
	BAsketSite.app.router.register(":view/:Id", { view: "Home", Id: undefined });
	BAsketSite.app.navigate();
	// var view = $("#idMainTileView").dxTileView("instance");
	// if (view)
	// 	view.repaint();
	
}

var P = (function ($, window) {
	var root = {};

	root.getViewModel = function(params) {
		var navi = P.findById(params.view);
		var viewModel = {
			title: 'BAsket - ' + P.navigation[navi].title,
			viewShown: function () {
				$("#textContainer").html(P.navigation[navi].content);
			}
		}
		return viewModel;
	};	
	root.findById = function(idToLookFor) {
	    //var categoryArray = data.category;
	    for (var i = 0; i < P.navigation.length; i++) {
	        if (P.navigation[i].id == idToLookFor) {
	            return i;
	        }
	    }
	}
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
			location = 'www/index.html';
		}
		else {
			// var text = '<p>'+ new Array( 444 ).join( e.itemData.id + ' ' ) + '</p>'
			// $("#textContainer").html(text);
			// $("#textContainer").html(root[e.itemData.id]);
			BAsketSite.app.navigate(e.itemData.action.substring(1), { direction: 'none'});
		}
	};
	root.itemText = function(id) {
		var navi = P.findById(id);
		if (navi && P.navigation[navi].content)
   			// return P.navigation[navi].content;
   			$("#textContainer" + id).html(P.navigation[navi].content);
	}
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

    root.copyright = 'BAsket \u00A9 2014 BAndySoft. All rights reserved (' + root.deviceClass.platform + ')';
	root.EMail = "BAndySoft" + "@" + "gmail" + "." + "com";

	root.navigation = [];
	root.tileset = [];
    root.isGetConfig = false;
    root.isInitSite = false;
    var getUrl = "config.json";
    $.getJSON(
    	getUrl,
		function (data) {
  			var obj = JSON.stringify(data);
  			for (var i in data){
  				//data[i].content = data[i].id
  				if (data[i].ratio) {
  					data[i].heightRatio = (data[i].ratio == 1 || data[i].ratio == 2) ? 2 : 4;
  					data[i].widthRatio	= (data[i].ratio == 3 || data[i].ratio == 2) ? 2 : 4;
  				}
	  			if (!data[i].heightRatio) data[i].heightRatio = 2;
	  			if (!data[i].widthRatio) data[i].widthRatio = 4;
	  			if (!data[i].title) data[i].title = data[i].id;
	  			if (!data[i].action) data[i].action = '#' + data[i].id;
	  			if (!data[i].icon) data[i].icon = data[i].id.toLowerCase();
	  			if (!data[i].backcolor) data[i].backcolor = '#FFFFFF';
	  		}
  			root.navigation = data;

		    getUrl = "contents.htm";
			$.get(getUrl).then(function(text, status, xhr){
		   		//text getUrl is what you want
		   		//debugger;
		   		var tV = text.split('##');
		   		for (var i in tV){
		   			var tn = tV[i].split('|');
		   			if (tn.length > 1) {
		   				var navi = P.findById(tn[0]);
		   				if (navi)
		   					P.navigation[navi].content = tn[1];
		   				if (tn[0] == 'Info')
		   					P.navigation[navi].content = P.navigation[navi].content.replace(/#EMail#/g, P.EMail);
		   			}
		   		}
				for (var i=1; i<P.navigation.length; i++){
					var clone = {};   
			    	for (var j in P.navigation[i]) 
			        	clone[j] = P.navigation[i][j];		    
					P.tileset.push(clone);
				}
	  			if (!root.isInitSite){
	  				BAsketSite.IniSite();	
	  			} 
	  			root.isGetConfig = true;
			});
		}
		//error: function() { console.log('Uh Oh!'); },
	);


	return root;
})(jQuery, window);

BAsketSite.Home = function (params) {
	var viewModel = {
		viewShown: function () {
			// var navi = P.findById(params.view);
			// $("#textContainer").html(P.navigation[navi].content);
			for (var i in P.tileset){
				if (P.tileset[i].content){
					var t = $("#textContainer" + P.tileset[i].id);
		   			t.html(P.tileset[i].content);
		   			// t.parent().css({"background": "-webkit-gradient(linear, left top, left bottom, from(" + P.tileset[i].backcolor + "), to(#F7F7F7))"});
		   			// t.css({"background": "-webkit-gradient(linear, left top, left bottom, from(" + P.tileset[i].backcolor + "), to(#F7F7F7))"});
				}
		   	}
   		}
	}
	return viewModel;
}

BAsketSite.About = function (params) {
	return P.getViewModel(params);
}
BAsketSite.Mobile = function (params) {
	return P.getViewModel(params);
}
BAsketSite.Server = function (params) {
	return P.getViewModel(params);
}
BAsketSite.Download = function (params) {
	return P.getViewModel(params);
}
BAsketSite.Demo = function (params) {
	return P.getViewModel(params);
}
BAsketSite.Preferences = function (params) {
	return P.getViewModel(params);
}
BAsketSite.Info = function (params) {
	return P.getViewModel(params);
}
