BAsket.Products = function (params) {
	P.fromProducts = true;
	var searchStr = ko.observable('');
	P.curCategoryId = (params.Id == 'undefined') ? P.curCategoryId : params.Id;
	 if ((!P.curCategoryId || P.curCategoryId == 0) && P.arrCategory.length > 0)
    		P.curCategoryId = root.arrCategory[0].Id;

	var bChoice = ko.observable(P.curModeChoice);
	var lbltitle = ko.observable(_.Products.Title1);
	var btnSwText = ko.observable(_.Products.btnSwText1);
	var calcSum = ko.observable('');

	var viewModel = {
		searchString: searchStr,

		dataSourceCat: P.arrCategory,   //DAL.Categories(),
		dataSourceBasket: new DevExpress.data.DataSource(new DevExpress.data.ArrayStore(P.arrayBAsket)),

		// dataSourceProd: DAL.Products({Id:P.curCategoryId, search:searchStr}),
		dataSourceProd: DAL.Products({ pId: P.curCategoryId, search: searchStr }, !P.modeProdView),

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
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].P;
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
		BAsket.app.navigate('Products/' + P.curCategoryId, { direction: 'none' });
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



BAsket.Product_Details = function (params) {

	var viewModel = {
		Id: params.Id,
		Name: ko.observable(''),
		Price: ko.observable(''),
		N1: ko.observable(''),
		N2: ko.observable(''),
		N3: ko.observable(''),
		N4: ko.observable(''),
		N1T: ko.observable(P.arrNMS[10][0] ? P.arrNMS[10][0].N:''),
		N2T: ko.observable(P.arrNMS[10][1] ? P.arrNMS[10][1].N:''),
		N3T: ko.observable(P.arrNMS[10][2] ? P.arrNMS[10][2].N:''),
		N4T: ko.observable(P.arrNMS[10][3] ? P.arrNMS[10][3].N:''),
		Ostat: ko.observable(''),
		Quant: ko.observable(),

		viewShown: function () {
			var quant = $("#idQuant").data("dxNumberBox");
			quant.focus();
			// setTimeout(function () {
			//    // $('#idQuant :input').focus();
			//     var input = $('#idQuant :input')[0];
			//     var textEvent = document.createEvent('TextEvent');
			//     textEvent.initTextEvent('textInput', true, true, null,  " ", 9, "en-US");
			//     input.dispatchEvent(textEvent);

			//     //simulateKeyPress("2");
			// }, 300);
		}
	};
	DAL.ProductDetails({ Id: params.Id, model: viewModel });

	// function simulateKeyPress(character) {
	//   jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
	// }
	
	Product_Details_saveClicked = function(arg) {
		var bFound = false;
		//var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
		// for (var prop in valueQuant)
		//     console.log(prop + ': ' + valueQuant[prop])
		//console.log('Product_Details_saveClicked <' + this.Quant());
		var quant = parseInt(this.Quant());
		//console.log('Product_Details_saveClicked quant<' + quant + '>');
		for (var i in P.arrayBAsket) {
			//if (!P.arrayBAsket.hasOwnProperty(i)) continue;
			//if (i == key && P.arrayBAsket[i].id == this.id()) {
			if (P.arrayBAsket[i].Id == this.Id) {
				if (quant && quant > 0)
					P.arrayBAsket[i].Quant = quant;
				else
					P.arrayBAsket.splice(i, 1);
				bFound = true;
				break;
			}
		}
		if (!bFound && quant && quant > 0) {
			P.arrayBAsket.push({ 'Id': this.Id, 'N': this.Name(), 'O': this.Ostat(), 'Quant': quant, 'P': this.Price(), 'N1': this.N1(), 'N2': this.N2() });
		}
		// for(var i in P.arrayBAsket){
		//     console.log('Product_Details_saveClicked arrayBAsket<' + P.arrayBAsket[i].Quant + '>');
		// }

		//BAsket.app.navigate('Products/' + P.curCategoryId);
		BAsket.app.back();
	};

	return viewModel;
};
