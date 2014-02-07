BAsket.Order = function (params) {
	var arrayTP = ko.observable([{ "Id": "", "Name": "" }]);
	var showTP = ko.observable(false);

	var dataVal = ko.observable(new Date());
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...');
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...');
	var noteVal = ko.observable('');
	var nmsNames = ko.observableArray([_.Common.Select, _.Common.Select]);
	var calcSum = ko.observable('');

	if (!P.fromProducts)
		P.arrayBAsket = [];

	if (params.Id) {
		DAL.BilMById(params.Id).load().done(function (result) {
			if (!P.fromProducts && result[0].sWars) {
				DAL.ProductsByWars(result[0].sWars).done(function(result) {
					P.arrayBAsket = result;
					calcSum(Order_calcSum());
				});
			}
			var date = result[0].DateDoc;
			if (date.split(" ").length > 1)
				date = date.split(" ")[0];
			var dateParts = date.split(".");
			if (dateParts.length == 1)
				dateParts = date.split("-");
			//console.log('Order id=' + params.Id + ' date=' + dateParts);
			if (dateParts[0].length > 2)
				dataVal(new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]));
			else
				dataVal(new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]));
			noteVal(result[0].sNote);
			cliId(result[0].IdC);
			cliName(result[0].cName);
			tpId(result[0].IdT);

			var arr = nmsNames();
			var sOther = result[0].sOther;
			if (sOther) {
				sOther = sOther.split(';');
				for (var i = 0; i < sOther.length; i++) {
					var sNms = sOther[i].split(':');
					if (sNms.length < 2) continue;
					var iNms = parseInt(sNms[0]);
					var setNms = $("#idNms" + iNms).data("dxSelectBox");
					if (setNms) {
						setNms.option().value = sNms[1];
						for (var ii = 0; ii < P.arrNMS[iNms].length; ii++)
							if (P.arrNMS[iNms][ii].Id == sNms[1]) {
								var val = P.arrNMS[iNms][ii].N;
								arr[iNms - 1] = val;
								break;
							}
					}
				}
				nmsNames(arr);
			}
			var tName = result[0].tName ? result[0].tName : _.Order.SelectPoint + '...';
			tpName(tName);
			DAL.ClientsPar(result[0].IdC).load().done(function(result) {
				arrayTP(result);
				showTP(result.length > 0);
			});
		});
	}

	Order_clientChanged = function (arg) {
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
			value = lookupCli.option().value;	//("value");
		}

		if (value) {
			var self = this;
			self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...');
			DAL.ClientsPar(value).load().done(function(result) {
				self.arrayTP(result);
				self.showTP(result.length > 0);
			});
		}
	};

	Order_calcSum = function (mask) {
		if (mask)
			mask = mask.replace('-', '');
		else
			mask = _.Products.SelSum.replace('#', P.arrayBAsket.length);
		var sum = 0.0;
		for (var i in P.arrayBAsket) {
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].Price;
		}
		return mask + sum.toFixed(2);
	};

	Order_btnSaveClicked = function () {
		//var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
		if (P.arrayBAsket.length == 0) {
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

		var prms = {};
		//var hash = location.hash.split('/');
		if (params.Id)
			prms['id'] = params.Id;
		//prms['date'] = valueDate.getDate() + '.' + (valueDate.getMonth()+1) + '.' + valueDate.getFullYear();
		prms['date'] = U.DateFormat(valueDate);
		//console.log('Order save date=' + dataVal());
		//console.log('Order save datetoLocaleString=' + prms['date']);
		prms['IdC'] = valueCli;
		prms['IdT'] = (valueTP ? valueTP : 0);
		prms['sumDoc'] = Order_calcSum('-');

		prms['sOther'] = '';
		for (var i = 0; i < P.arrNMS[0].length; i++) {
			var setNms = $("#idNms" + (i + 1)).data("dxSelectBox");
			if (setNms && setNms.option().value && P.arrNMS[0][i].Id < 100) {
				prms['sOther'] += (i + 1) + ':' + setNms.option().value + ';';
			}
		}
		prms['sNote'] = $("#txtNote").data("dxTextArea").option("value");
		var sWars = '';
		for (var i in P.arrayBAsket) {
			sWars += P.arrayBAsket[i].Id + ':' + P.arrayBAsket[i].Quant + ';';
		}
		prms['sWars'] = sWars.substring(0, sWars.length - 1);

		DAL.SaveBil(prms);

		Order_clickBack();

		var cnt = DAL.CountTable('BILM');
		if (cnt)
			cnt.done(function (result) {
				P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
			});
	};

	Order_clickBack = function (arg) {
		P.fromProducts = false;
		if (params.Id) {
			var icur = BAsket.app.navigationManager.currentStack.currentIndex;
			if (icur < 1) {
				BAsket.app.navigate('home', { root: true });
				return;
			}
			var backUri = BAsket.app.navigationManager.currentStack.items[icur - 1].uri;
			if (backUri && backUri == 'RoadMapList')
				BAsket.app.navigate('RoadMapList', { root: true });
			else
				BAsket.app.navigate('OrderList', { root: true });
		}
		else
			//BAsket.app.navigate('home');
			BAsket.app.navigate('home', { root: true });
	};

	Order_clickProduct = function() {
		BAsket.app.navigate('products/' + P.curCategoryId);
		//	    BAsket.app.navigationManager.saveState(window.localStorage);
	};


	var viewModel = {
		clients: DAL.Clients(),
		arrayTP: arrayTP,
		showTP: showTP,
		calcSum: calcSum,

		dataVal: dataVal,
		cliId: cliId,
		cliName: cliName,
		tpId: tpId,
		tpName: tpName,
		noteVal: noteVal,

		nmsNames: nmsNames,

		viewShown: function () {
			calcSum(Order_calcSum());
			for (var i = 0; i < P.arrNMS[0].length; i++) {
				var setNms = $("#idNms" + (i + 1));
				if (setNms.length == 1 && P.arrNMS[0][i].Id < 100) {
					setNms.parent().show();
					setNms[0].parentNode.children[0].innerText = P.arrNMS[0][i].N;
				}
			}
		},
	};

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
		popActions: [
		    { text: _.Order.ActionDelete, clickAction: function () { Order_DeleteClick() } },
		    { text: _.Order.ChangeActivity, clickAction: function () { Order_ChangeActivity() } },
		],
	};

	Order_DeleteClick = function() {
		//    var result = DevExpress.ui.dialog.confirm(_.Order.ActionDelete + ' ?', _.Common.Confirm);
		//    result.done(function (dialogResult) {
		//    	alert(dialogResult ? "Confirmed" : "Canceled");
		// });

		DevExpress.ui.dialog.custom({
			message: _.Order.ActionDelete + ' ' + idSelected() + ' ?',
			title: _.Common.Confirm,
			buttons: [
				{ text: _.Common.Yes, clickAction: Order_Delete },
				{ text: _.Common.Cancel }
			]
		}).show();
	};
	Order_Delete = function(arg) {
		DAL.DeleteBil(idSelected());
		DAL.CountTable('BILM').done(function(result) {
			P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
		});
		viewModel.dataSource.load();
	};

	Order_ChangeActivity = function() {
		DAL.ChangeActivityBil(idSelected()).done(function(result) {
			viewModel.dataSource.load();
		})
	};

	Order_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};

	return viewModel;
};