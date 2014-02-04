BAsket.products = function (params) {
	P.fromProducts = true;
	var searchStr = ko.observable('');
	P.curCategoryId = (params.Id == 'undefined') ? P.curCategoryId : params.Id;
	//var arrayBAsket = ko.observable([]);

	var bChoice = ko.observable(P.curModeChoice);
	var lbltitle = ko.observable(_.Products.Title1);
	var btnSwText = ko.observable(_.Products.btnSwText1);
	var calcSum = ko.observable('');

	var viewModel = {
		searchString: searchStr,
		find: function () {
			viewModel.showSearch(!viewModel.showSearch());
			viewModel.searchString('');
		},
		showSearch: ko.observable(false),

		dataSourceCat: P.arrCategory,   //DAL.Categories(),
		dataSourceBasket: new DevExpress.data.DataSource(new DevExpress.data.ArrayStore(P.arrayBAsket)),

		// dataSourceProd: DAL.Products({Id:P.curCategoryId, search:searchStr}),
		dataSourceProd: DAL.Products({ pId: P.curCategoryId, search: searchStr }, !P.modeProdView),

		//categoryId: categoryId,
		//categoryName: P.curCategoryName,

		bChoice: bChoice,
		lbltitle: lbltitle,
		btnSwText: btnSwText,
		calcSum: calcSum,

		viewShown: function () {
			viewModel.dataSourceProd.load();
		}
	};
	ko.computed(function() {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function() {
		viewModel.dataSourceProd.pageIndex(0);
		viewModel.dataSourceProd.load();
	});

	Products_calcSum = function() {
		var sum = 0.0;
		for (var i in P.arrayBAsket) {
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].Price;
		}
		return _.Products.SelSum.replace('#', P.arrayBAsket.length) + sum.toFixed(2);
	};

	Products_swichClicked = function() {
		P.curModeChoice = !P.curModeChoice;
		if (!P.curModeChoice) {
			viewModel.dataSourceBasket.load();
			bChoice(P.curModeChoice);
			lbltitle(_.Products.Title2);
			btnSwText(_.Products.btnSwText2);
			calcSum(Products_calcSum());
		} else {
			// viewModel.dataSourceProd.load();
			bChoice(P.curModeChoice);
			lbltitle(_.Products.Title1);
			btnSwText(_.Products.btnSwText1);
		}
	};

	Products_categoryChanged = function(arg) {
		if (arg.element.length <= 0) return;

		var lookup = $("#CategoryLookup").data("dxLookup");
		P.curCategoryId = lookup.option("value");
		P.curCategoryName = $(".dx-state-active").html();
		BAsket.app.navigate('products/' + P.curCategoryId, { direction: 'none' });
	};

	Products_clickBack = function(arg) {
		//BAsket.app.navigate('Order/' + P.curCategoryId);
		//BAsket.app.navigationManager.restoreState(window.localStorage);
		var cur = 0;
		for (var i = BAsket.app.navigationManager.currentStack.items.length - 1; i > 0; i--) {
			if (BAsket.app.navigationManager.currentStack.items[i - 1].uri.indexOf('Order') == 0) {
				cur = i;
				break;
			} else {
				BAsket.app.navigationManager.currentStack.items.splice(i - 1, 1);
			}
		}
		BAsket.app.navigationManager.currentStack.currentIndex = cur; //BAsket.app.navigationManager.currentStack.items.length - 1;
		BAsket.app.back();
	};

	return viewModel;
};

