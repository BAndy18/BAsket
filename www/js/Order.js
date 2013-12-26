BAsket.Order = function (params) {	
	var arrayTP = ko.observable([{"id":"", "Name":""}]);
	var arrayNms = ko.observable([{"id":"", "Name":""}]);
    var showTP = ko.observable(false);
	
	var dataVal = ko.observable(new Date());
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...'); 
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...'); 
	var noteVal = ko.observable('');

	P.arrayBAsket = [];
	if (location.hash.indexOf('/') > 0) {
		var bil = DAL.BilMById(location.hash.split('/')[1]);
		bil.load().done(function (result) {
			var dateParts = result[0].DateDoc.split(".");
			dataVal(new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]));
			noteVal(result[0].sNote);
			cliId(result[0].idCli);
			cliName(result[0].cName);
			tpId(result[0].idTp);
			DAL.ProductsByWars(result[0].sWars).load().done(function (result) {
				P.arrayBAsket = result;
			})
			// P.arrayBAsket = [
			// 		{'id':'39007', 'name':'test','upak':'4','quant':'2','price':'10.02'},
			// 		{'id':'29657', 'name':'test2','upak':'46','quant':'3','price':'1011.02'},
			// 	];
			var tName = result[0].tName ? result[0].tName : _.Order.SelectPoint + '...';
			tpName(tName);
    		DAL.Clients(result[0].idCli).load().done(function (result) {
		    	arrayTP(result);
		    	showTP(result.length > 0);
			})
		});
	}

	var viewModel = {
		clients: DAL.Clients(),
		arrayTP:  arrayTP,
        showTP: showTP,

        dataVal: dataVal,
        cliId: cliId,
        cliName: cliName,
        tpId: tpId,
        tpName: tpName,
        noteVal: noteVal,

        dsNms: DAL.NMS(0),
        arrayNms: arrayNms,
       
		nmsId: P.currentNms[0]['id'],
        nmsName: P.currentNms[0]['Name'],
	};

	// $(function() {
	// 	debugger;
	// });

	clientChanged = function(arg){
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
    		value = lookupCli.option("value");
	    }

	    if (value) {
	    	var self = this;
	    	self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...'); 
	    	DAL.Clients(value).load().done(function (result) {
		    	self.arrayTP(result);
		    	self.showTP(result.length > 0);
			})
	    }
	};
	// setVisibleFieldTp = function(arg){
	// 	var fieldTP = $("#fieldTradePoint");
	// 	if (fieldTP && fieldTP.length == 1) {
	// 		fieldTP[0].hidden = (arg == 0);
	// 	}
	// }

	nmsChanged = function(arg){
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupNms = $("#lookupNms").data("dxLookup");
    		value = lookupNms.option("value");
	    }

	    if (value) {
	    	var self = this;
	    	DAL.NMS(value).load().done(function (result) {
		    	self.arrayNms(result);
				
		    	var lookupTP = $("#lookupTP").data("dxLookup");
		    	var opt = lookupTP.option();
		    	//lookupTP.repaint();
    			// var v1 = lookupTP.option("value");
    			// lookupTP.option("value", -1);
    			// var v2 = lookupTP.option("value");
			})
	    }
	};

	clickBack = function(arg){
		if (location.hash.indexOf('/') > 0)
			BAsket.app.navigate('OrderList', { root: true });
		else
			BAsket.app.navigate('home', { root: true });
	};

	btnSaveClicked  = function () {
		if (P.arrayBAsket.length == 0){
			BAsket.notify(_.Order.ErrNoWars, "error");
			return;
		}
		var valueDate = $("#idDate").data("dxDateBox").option("value");
		if (!valueDate) {
			BAsket.notify(_.Order.ErrNoDate, "error");
			return;
		}
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
			return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");
		var valueNms = $("#lookupNms").data("dxLookup").option("value");
		// if (!valueNms) {
		// 	BAsket.notify("lookupNms", "error");
		// 	return;
		// }
		var params = {};
		var hash = location.hash.split('/');
		if (hash.length > 1)
			params['id'] = hash[1];
		params['date'] = valueDate.toLocaleString().split(' ')[0];
		params['idCli'] = valueCli;
		params['idTp'] = (valueTP ? valueTP:0);
		params['idNms'] = valueNms;
		params['Note'] = $("#txtNote").data("dxTextArea").option("value");
		var sWars = '';
		for (var i in P.arrayBAsket) {
        	sWars += P.arrayBAsket[i].id + ':' + P.arrayBAsket[i].quant + ';';
        }
    	params['sWars'] = sWars;

		DAL.SaveBil(params);
		clickBack();
	};
	
	return viewModel;
};


BAsket.OrderList = function (params) {
	var viewModel = {
		dataSource: DAL.BilM(),
	};
	return viewModel;
};