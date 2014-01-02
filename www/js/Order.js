BAsket.Order = function (params) {	

	var arrayTP = ko.observable([{"Id":"", "Name":""}]);
	var arrayNms = ko.observable([{"Id":"", "Name":""}]);
    var showTP = ko.observable(false);
	
	var dataVal = ko.observable(new Date());
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...'); 
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...'); 
	var noteVal = ko.observable('');
	var nmsNames = ko.observableArray([ _.Common.Select, _.Common.Select ]);

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

        nmsNames: nmsNames,
        dsNms1: P.currentNms[1],
        dsNms2: P.currentNms[2],
        //dsNms: DAL.NMS(0),
        //arrayNms: arrayNms,       
		//nmsId: P.currentNms[0]['id'],
        //nmsName: P.currentNms[0]['Name'],

        viewShown: function() {
			for (var i=0; i<P.currentNms[0].length; i++) {
				var setNms = $("#idNms" + (i+1));
				if (setNms.length == 1){
					setNms.parent().show();
					setNms[0].parentNode.children[0].innerText = P.currentNms[0][i].Name;
				}
			}
        }
	};

	P.arrayBAsket = [];
	if (location.hash.indexOf('/') > 0) {
		var bil = DAL.BilMById(location.hash.split('/')[1]);
		bil.load().done(function (result) {
			var dateParts = result[0].DateDoc.split(".");
			dataVal(new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]));
			noteVal(result[0].sNote);
			cliId(result[0].IdCli);
			cliName(result[0].cName);
			tpId(result[0].IdTp);
			DAL.ProductsByWars(result[0].sWars).done(function (result) {
				P.arrayBAsket = result;
			})

			var arr = nmsNames();
			var sOther = result[0].sOther.split(';');
			for (var i=0; i<sOther.length; i++) {
				var sNms = sOther[i].split(':');
				if (sNms.length < 2) continue;
				var iNms = parseInt(sNms[0]);
				var setNms = $("#idNms" + iNms).data("dxSelectBox");
				if (setNms){
					setNms.option().value = sNms[1];
					var val = P.currentNms[iNms][sNms[1]-1].Name;
					arr[iNms - 1] = val;
				}
			}
			nmsNames(arr);
			var tName = result[0].tName ? result[0].tName : _.Order.SelectPoint + '...';
			tpName(tName);
    		DAL.Clients(result[0].IdCli).load().done(function (result) {
		    	arrayTP(result);
		    	showTP(result.length > 0);
			})
		});
	}

	// DAL.NMS(0).load().done(function (result) {
	// 	for (var i=0; i<result.length; i++) {
	// 		var setNms = $("#idNms" + (i+1));
	// 		if (setNms.length == 1){
	// 			setNms.parent().show();
	// 			setNms[0].parentNode.children[0].innerText = result[i].Name;

	// 			//var lookNms = setNms.data("dxSelectBox");
	// 			//lookNms.option().placeholder = 'dddd' + i;
	// 			//lookNms._dataSource._items = P.currentNms[0];
	// 			//lookNms.dataSource.reload();

	// 			//setNms.data("dxSelectBox").datasource.load();
	// 			//setNms.data("dxSelectBox")._refreshDataSource();
	// 			//viewModel.dsNms1=DAL.NMS(1);
	// 			//viewModel.dsNms1.load();
	// 		}
	// 	}
	// })

	Order_clientChanged = function(arg){
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
    		value = lookupCli.option().value;	//("value");
	    }

	    if (value) {
	    	var self = this;
	    	self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...'); 
	    	DAL.ClientsPar(value).load().done(function (result) {
		    	self.arrayTP(result);
		    	self.showTP(result.length > 0);
			})
	    }
	};
	
	Order_clickBack = function(arg){
		if (location.hash.indexOf('/') > 0)
			BAsket.app.navigate('OrderList', { root: true });
		else
			//BAsket.app.navigate('home');
			BAsket.app.navigate('home', { root: true });
	};

	Order_btnSaveClicked  = function () {
		if (P.arrayBAsket.length == 0){
			BAsket.notify(_.Order.ErrNoWars, "error");
		//	return;
		}
		var valueDate = $("#idDate").data("dxDateBox").option("value");
		if (!valueDate) {
			BAsket.notify(_.Order.ErrNoDate, "error");
			return;
		}
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
		//	return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");

		var params = {};
		var hash = location.hash.split('/');
		if (hash.length > 1)
			params['id'] = hash[1];
		params['date'] = valueDate.toLocaleString().split(' ')[0];
		params['idCli'] = valueCli;
		params['idTp'] = (valueTP ? valueTP:0);
		
		params['sOther'] = '';
		for (var i=0; i<P.currentNms[1].length; i++) {
			var setNms = $("#idNms" + (i+1)).data("dxSelectBox");
			if (setNms && setNms.option().value){
				params['sOther'] += (i+1) + ':' + setNms.option().value + ';';
			}
		}
		params['Note'] = $("#txtNote").data("dxTextArea").option("value");
		var sWars = '';
		for (var i in P.arrayBAsket) {
        	sWars += P.arrayBAsket[i].Id + ':' + P.arrayBAsket[i].Quant + ';';
        }
    	params['sWars'] = sWars.substring(0, sWars.length - 1);

		DAL.SaveBil(params);
		
		Order_clickBack();

		DAL.CountTable('BILM').done(function (result) {
			P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
		});
	};

	Order_clickProduct = function(){
	    BAsket.app.navigate('products/' +  P.curCategoryId);
//	    BAsket.app.navigationManager.saveState(window.localStorage);
	}
	
	return viewModel;
};


BAsket.OrderList = function (params) {
	var holdTimeout = ko.observable(750);
	var popVisible = ko.observable(false);
	var idSelected = ko.observable(0);

	var viewModel = {
		dataSource: DAL.BilM(),

		popVisible: popVisible,
		holdTimeout: holdTimeout,
		//popActions:  ["Red", "Green", "Black"],
		popActions: [
		    {text: _.Order.ActionDelete, clickAction: function(){ Order_DeleteClick()}},
		    // {text:"Delete", clickAction: function(){ Order_processClick("Delete")}}
		],
	};

	Order_DeleteClick = function(){
		//popVisible(false);
		//DevExpress.ui.dialog.alert("The item is being held during " + holdTimeout() / 1000 + "sec", "Action executed");
		//DevExpress.ui.notify( name + " clicked", "success", 3000 );

     //    var result = DevExpress.ui.dialog.confirm(_.Order.ActionDelete + ' ?', _.Common.Confirm);
     //    result.done(function (dialogResult) {
     //    	alert(dialogResult ? "Confirmed" : "Canceled");
    	// });

        //var result = 
        DevExpress.ui.dialog.custom({message: _.Order.ActionDelete + ' '+ idSelected() +' ?', title: _.Common.Confirm, 
        	buttons: [
            { text: _.Common.Yes, clickAction: Order_Delete },
            { text: _.Common.Cancel } 
        ]}).show();
     //    result.show().done(function (dialogResult) {
     //    	DevExpress.ui.notify(dialogResult, "info", 1000);
    	// });
	}
	Order_Delete = function(arg){
		DAL.DeleteBil(idSelected());
		viewModel.dataSource.load();
		//DevExpress.ui.notify( "Yes clicked", "success", 3000 );
	}

	// Order_processClick = function(name){
	// 	//popVisible(false);
	// 	//DevExpress.ui.dialog.alert("The item is being held during " + holdTimeout() / 1000 + "sec", "Action executed");
	// 	//DevExpress.ui.notify( name + " clicked", "success", 3000 );
	// 	DevExpress.ui.notify( name.itemData + " item clicked", "success", 2000 );
	// }
	Order_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};

	//viewModel.dataSource.load();
	return viewModel;
};