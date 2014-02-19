BAsket.RoadMapList = function (params) {
	P.getGeo();
	var date = params.Id && params.Id != "undefined"? new Date(params.Id) : new Date();
	var dataVal = ko.observable(date);
	var itemSelected = ko.observable(0);
	var popVisible = ko.observable(false);
	var holdTimeout = ko.observable(500);
	var popupVisible = ko.observable(false);

	var showTP = ko.observable(false);
	var arrayTP = ko.observable([{ "Id": "", "Name": "" }]);
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...');
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...');


	var viewModel = {
		dataVal: dataVal,
		popupVisible: popupVisible,

		holdTimeout: holdTimeout,
		popVisible: popVisible,
		popActions: [
			{ text: _.RoadMap.OpenBil, clickAction: function () { RoadMap_Action('OpenBil') } },
			{ text: _.RoadMap.MoveUp, clickAction: function () { RoadMap_Move('MoveUp') } },
			{ text: _.RoadMap.MoveDown, clickAction: function () { RoadMap_Move('MoveDown') } },
			{ text: _.RoadMap.ActionDelete, clickAction: function () { RoadMap_Action('DeleteClick') } },
		],

		dataSource: DAL.RoadMap(dataVal()),
		clients: DAL.Clients(),
		arrayTP: arrayTP,
		showTP: showTP,
		cliId: cliId,
		cliName: cliName,
		tpId: tpId,
		tpName: tpName,
		viewShown: function () {
			var date = new Date();
			if (location.hash.indexOf('/') < 0 && dataVal().toLocaleDateString() != date.toLocaleDateString()){
				RoadMap_ChangeDate();
			}
		}
	};

	// RoadMap_Back = function (arg) {
	// 	debugger;
	// }
	RoadMap_ChangeDate = function (arg) {
		BAsket.app.navigate('RoadMapList/' + dataVal(), { direction: 'none', root: true });
	};

	RoadMap_AddToTheMap = function (arg) {
		//BAsket.notify('RoadMap_AddToTheMap');
		popupVisible(true);
	};
	RoadMap_clickCancel = function (arg) {
		popupVisible(false);
	};
	RoadMap_clientChanged = function (arg) {
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
			value = lookupCli.option().value; //("value");
		}

		if (value) {
			var self = this;
			self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...');
			DAL.ClientsPar(value).load().done(function (result) {
				self.arrayTP(result);
				self.showTP(result.length > 0);
			});
		}
	};
	RoadMap_ClientSave = function(arg) {
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
			return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");
		var prms = {};
		prms['date'] = U.DateFormat(dataVal(), 'yyyy-mm-dd');
		prms['IdC'] = valueCli;
		prms['IdT'] = (valueTP ? valueTP : 0);
		prms['Npp'] = viewModel.dataSource.items().length > 0 ?
			parseInt(viewModel.dataSource.items()[viewModel.dataSource.items().length - 1].Npp) + 1 : 1;

		DAL.AddCliRMap(prms, RoadMap_Reload);

		popupVisible(false);
		cliName(_.Order.SelectClient + '...');
		tpName(_.Order.SelectPoint + '...');
	};


	RoadMap_ClickShow = function(arg) {
		var arr = arg.model.dataSource._items;
		P.arrayBAsket = [];
		P.arrayBAsketL = [];
		for (var i in arr) {
			if (arr[i].Adres) {
				var cText = arr[i].N2 ? arr[i].N1 + ' - ' + arr[i].N2 : arr[i].N1;
				P.arrayBAsket.push({ tooltip: cText + ' (' + arr[i].Adres + ')', location: arr[i].Adres });
				P.arrayBAsketL.push(arr[i].Adres);
			}
		}
		BAsket.app.navigate('RoadMap/');
	};

	RoadMap_Move = function(action) {
		var icur = -1;
		for (var i in viewModel.dataSource._items)
			if (itemSelected().Id == viewModel.dataSource._items[i].Id) {
				icur = parseInt(i);
				break;
			}
		if (icur < 0) return;
		if (action == 'MoveUp' && icur == 0) {
			BAsket.notify('First Position Up');
			navigator.notification.beep(1);
			return;
		} else if (action == 'MoveDown' && icur == viewModel.dataSource._items.length - 1) {
			BAsket.notify('Last Position Down');
			navigator.notification.beep(1);
			return;
		}
		var p = action == 'MoveDown' ? 1 : -1;
		DAL.SwapRmap(itemSelected().Id, viewModel.dataSource._items[icur + p].Npp,
			viewModel.dataSource._items[icur + p].Id, itemSelected().Npp, RoadMap_Reload);
	};

	RoadMap_Action = function(action) {
		if (action == 'DeleteClick') {
			DevExpress.ui.dialog.custom({
				message: _.RoadMap.ActionDelete + ' ' + itemSelected().Id + ' ?',
				title: _.Common.Confirm,
				buttons: [
					{ text: _.Common.Yes, clickAction: RoadMap_Delete },
					{ text: _.Common.Cancel }
				]
			}).show();
		} else if (action == 'OpenBil') {
			if (itemSelected().IdB) {
				BAsket.app.navigate('Order/' + itemSelected().IdB);
				return;
			}
			var prms = {};
			prms['date'] = U.DateFormat(dataVal());
			prms['IdC'] = itemSelected().IdC;
			prms['IdT'] = itemSelected().IdT;
			prms['Note'] = itemSelected().Note;
			DAL.SaveBil(prms).done(function(res) {
				var id = (P.useWebDb) ? res.insertId : res[0].Id;
				DAL.SaveRMBil(itemSelected().Id, id).done(function() {
					BAsket.app.navigate('Order/' + id);
					viewModel.dataSource.load();
				});
			});
		} else
			BAsket.notify(action);
	};

	RoadMap_Delete = function(arg) {
		DAL.DeleteRMap(itemSelected().Id);
		DAL.CountTable('RMAP').done(function(result) {
			var date = new Date();
			var datestr = date.getDate() + '.' + (date.getMonth() + 1);
			P.itemCount['RoadMap'] = P.ChangeValue('RoadMap', datestr + ' (' + result[0].cnt + ')');
		});
		viewModel.dataSource.load();
	};

	RoadMap_processItemHold = function(arg) {
		itemSelected(arg.itemData);
		popVisible(true);
	};
	RoadMap_Reload = function(arg) {
		viewModel.dataSource.load();
	};

	return viewModel;
};

BAsket.RoadMap = function (params) {
	//P.loadPanelVisible(true);
	//P.getGeo();

	var viewModel = {
		options: {
			provider: P.mapProvider,
			mapType: "roadmap",
			//location: P.geoCurrent,
			controls: true,
			width: "100%",
			height: "100%",
			zoom: 15,
			markers: P.arrayBAsket,
			// [
			//   { title: "A", tooltip: "sd asd asd ", location: [56.851248,53.20271] },
			//   { title: "B", tooltip: "wer wer w", location: [56.864278,53.216272] },
			//   { title: "C", tooltip: "asasdas asd as asd ", location: [56.859488,53.190437] }
			// ],
			routes: [{
				weight: 5,
				color: "blue",
				locations: P.arrayBAsketL,
				// [
				//   [56.851248,53.20271],
				//   [56.864278,53.216272],
				//   [56.859488,53.190437]
				// ]
			}],
			readyAction: function () { RoadMap_ReadyAction() }
		}
	};

	RoadMap_ReadyAction = function(s) {
		P.loadPanelVisible(false);
	};

	return viewModel;
};
