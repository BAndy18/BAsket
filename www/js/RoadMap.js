BAsket.RoadMapList = function (params) {
  P.getGeo();
  var dataVal = ko.observable(new Date());
  var itemSelected = ko.observable(0);
  var popVisible = ko.observable(false);
  var holdTimeout = ko.observable(750);

  var viewModel = {
    dataVal: dataVal,
    holdTimeout: holdTimeout,
    popVisible: popVisible,
    popActions: [
        {text: _.RoadMap.OpenBil, clickAction: function(){ RoadMap_Action('OpenBil')} },
        {text: _.RoadMap.MoveUp, clickAction: function(){ RoadMap_Move('MoveUp')} },
        {text: _.RoadMap.MoveDown, clickAction: function(){ RoadMap_Move('MoveDown')} },
        {text: _.RoadMap.ActionDelete, clickAction: function(){ RoadMap_Action('DeleteClick')}},
    ],

    dataSource: DAL.RoadMap(dataVal()),
  }

  RoadMap_ChangeDate = function(arg) {
    viewModel.dataSource.load();
  }

  RoadMap_AddToTheMap = function(arg) {
    BAsket.notify('RoadMap_AddToTheMap');
  }

  RoadMap_ClickShow = function(arg) {
    var arr = arg.model.dataSource._items;
    P.arrayBAsket = [];
    P.arrayBAsketL = [];
    for (var i in arr){
      if (arr[i].AdresDost) {
        var cText = arr[i].tName ? arr[i].cName + ' - ' + arr[i].tName : arr[i].cName;
        P.arrayBAsket.push({tooltip: cText + ' (' + arr[i].AdresDost + ')', location: arr[i].AdresDost});
        P.arrayBAsketL.push(arr[i].AdresDost);
      }
    }
    BAsket.app.navigate('RoadMap/');
  }    

  RoadMap_Move = function(action) {
    var icur = -1;
    for (var i in viewModel.dataSource._items)
      if (itemSelected().Id == viewModel.dataSource._items[i].Id){
        icur = parseInt(i); break;
      }
    if (icur < 0) return;
    if (action == 'MoveUp' && icur == 0) {
      BAsket.notify('First Position Up');
      navigator.notification.beep(1);
      return;
    } else
    if (action == 'MoveDown' && icur == viewModel.dataSource._items.length - 1) {
      BAsket.notify('Last Position Down');
      navigator.notification.beep(1);
      return;
    }
    var p = action == 'MoveDown' ? 1:-1;
    DAL.SwapRmap(itemSelected().Id, viewModel.dataSource._items[icur + p].Npp, 
      viewModel.dataSource._items[icur + p].Id, itemSelected().Npp, RoadMap_Reload);

    //viewModel.dataSource.load();    
  }    

  RoadMap_Action = function(action){
    if (action == 'DeleteClick') {
       DevExpress.ui.dialog.custom({message: _.RoadMap.ActionDelete + ' '+ itemSelected().Id +' ?', title: _.Common.Confirm, 
          buttons: [
            { text: _.Common.Yes, clickAction: RoadMap_Delete },
            { text: _.Common.Cancel } 
        ]}).show();
     } else
    if (action == 'OpenBil') {
      if (itemSelected().IdBil){
        BAsket.app.navigate('Order/' + itemSelected().IdBil);
        return;
      }
      var prms = {};
      prms['date'] = U.DateFormat(dataVal());
      prms['idCli'] = itemSelected().IdCli;
      prms['idTp'] = itemSelected().IdTp;
      prms['sNote'] = itemSelected().sNote;
      DAL.SaveBil(prms).done(function(res){
        DAL.SaveRMBil(itemSelected().Id, res.insertId).done(function(){
          BAsket.app.navigate('Order/' + res.insertId);
        });
      });
    } else
      BAsket.notify(action);
  }

  RoadMap_Delete = function(arg){
    DAL.DeleteRMap(itemSelected().Id);
    DAL.CountTable('RMAP').done(function (result) {
      var date = new Date();
      var datestr = date.getDate() + '.' + (date.getMonth()+1);
      P.itemCount['RoadMap'] = P.ChangeValue('RoadMap', datestr  + ' (' + result[0].cnt + ')');
    });
    viewModel.dataSource.load();
  }

  RoadMap_processItemHold = function(arg){
    itemSelected(arg.itemData);
    popVisible(true);
  }
  RoadMap_Reload = function(arg){
    viewModel.dataSource.load();
  }

  return viewModel;
};

BAsket.RoadMap = function (params) {
    //P.loadPanelVisible(true);
    //P.getGeo();
    // var markers = window.localStorage.getItem('RoadMap_Markers');
    // var locations = window.localStorage.getItem('RoadMap_Locations');

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
            readyAction: function(){ RoadMap_ReadyAction() }
        }
    };

    RoadMap_ReadyAction = function (s) {
        P.loadPanelVisible(false);
    }

    return viewModel;
};
