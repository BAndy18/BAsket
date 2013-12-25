var DAL = (function ($, window) {
    var root = {};

	root.Categories = function (params) { return loadFunction(params, "Categories"); };

	root.Products = function (params) { return loadFunction(params, "Products"); };

	root.ProductDetails = function (params) { return loadFunction(params, "ProductDetails"); };

	root.Clients = function (params) { return loadFunction(params, "Clients"); };

	root.BilM = function (params) { return loadFunction(params, "BilM"); };
	root.BilMById = function (params) { return loadFunction(params, "BilMById"); };
	root.RoadMap = function (params) { return loadFunction(params, "RoadMap"); };
	root.NMS = function (params) { return loadFunction(params, "NMS"); };

	root.SaveBil = function (params) { return loadFunction(params, "SaveBil"); };

	function loadFunction(params, funcNm){
		var funcName = P.dataSouceType + '.' + funcNm;
		//var funcName = funcNm + "_" + BAsket.dataSouceType
		var fn = getFunctionFromString(funcName);
		if (typeof fn == "function")
			return fn(params);
	}
	// Get function from string, with or without scopes (by Nicolas Gauthier)
	function getFunctionFromString(string)
	{
	    var scope = window;
	    var scopeSplit = string.split('.');
	    for (i = 0; i < scopeSplit.length - 1; i++)
	    {
	        scope = scope[scopeSplit[i]];

	        if (scope == undefined) return;
	    }

	    return scope[scopeSplit[scopeSplit.length - 1]];
	}



	root.ReadNews = function(){
		DAL_local.ReadNews()
	}
	root.RecreateLocalDB = function(){
		DAL_local.RecreateLocalDB();
	}

    return root;
})(jQuery, window);


