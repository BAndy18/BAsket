BAsket.Clients = function (params) {
	P.getGeo();
	var searchStr = ko.observable('');
	var holdTimeout = ko.observable(500);
	var popVisible = ko.observable(false);
	var idSelected = ko.observable(0);

	var viewModel = {
		searchString: searchStr,
		// find: function() {
		// 	viewModel.showSearch(!viewModel.showSearch());
		// 	viewModel.searchString('');
		// },
		// showSearch: ko.observable(false),
		popVisible: popVisible,
		holdTimeout: holdTimeout,
		popActions: [],

		dataSource: DAL.Clients({ search: searchStr })
	};
	ko.computed(function () {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function () {
		viewModel.dataSource.pageIndex(0);
		viewModel.dataSource.load();
	});

	Client_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};


	return viewModel;
};

BAsket.Client = function (params) {
	//P.loadPanelVisible(true);
	P.getGeo();
	var cliName = ko.observable('');
	var location = ko.observable(P.geoCurrent());
	var visibleMenu = ko.observable(false);
	var popupVisible = ko.observable(false);
	var geoDirections = ko.observable('');

	var viewModel = {
		visibleMenu: visibleMenu,
		popupVisible: popupVisible,
		menuItems: [_.Common.Save, _.Clients.RoutDetail],
		cliName: cliName,

		options: //mapOptions
        {
        	provider: P.mapProvider,
        	mapType: 'roadmap',
        	width: '100%', height: '100%',
        	zoom: 15,
        	readyAction: function () { Client_MapReadyAction() }

        	// location: location,
        	// //P.geoCurrent(),
        	// //"56.853213999999994,53.215489",
        	// //"56.844278,53.206272",
        	// controls: true,

        	// markers: [
        	//   { label: "A", tooltip: "sd asd asd ", location: P.geoCurrent() },
        	//   // { label: "B", location: [56.844278,53.206272] },
        	//   // { label: "C", location: [56.829488,53.180437] }
        	// ],
        	// routes: [{
        	//     weight: 5,
        	//     color: "blue",
        	//     locations: [
        	//       [40.737102, -73.990318],
        	//       [40.749825, -73.987963],
        	//       [40.755823, -73.986397]
        	//     ]
        	// }]
        }
	};


	Client_ClickMenu = function (arg) {
		visibleMenu(!visibleMenu());
		//togglePopover();
	};
	Client_ClickMenuAction = function(arg) {
		visibleMenu(false);
		BAsket.notify(arg.itemData);
		if (arg.itemData == arg.model.menuItems[0]) {
			Client_menuSaveGeo();
		} else if (arg.itemData == arg.model.menuItems[1]) {
			
			var d = geoDirections();
			if (!d.legs || d.legs.length == 0)
				return;
			var text = '';
			text += '<p>Движение на авто ' + d.legs[0].duration.text + '; расстояние ' + d.legs[0].distance.text +
				'<br/>от: ' + d.legs[0].start_address + '<br/>до: ' + d.legs[0].end_address + '</p>';
			text += '<p>в основном по ' + d.summary + '</p>';
			text += '<br/><p>По шагам:</p>';
			for (var i in d.legs[0].steps) {
				text += '<p>' + (parseInt(i) + 1) + ') ' + d.legs[0].steps[i].duration.text + '; ' + d.legs[0].steps[i].distance.text;
				text += '; ' + d.legs[0].steps[i].instructions + '</p>';
			}
			arg.model.popupVisible(true);
			$("#textContainer").html(text);
			// $("#scrollView").dxScrollView("instance").scrollTo($(".dx-scrollview-content").height() - $(".dx-scrollview").height(), true);
			// $("#scrollView").dxScrollView("instance").release();
			// $("#scrollView").dxScrollView("instance").update();			
		}
	};
	Client_menuSaveGeo = function (arg) {
		BAsket.notify('Client_menuSaveGeo');
		//DAL.ExecQuery("UPDATE CLI set geoLoc='" + P.geoCurrent() + "' WHERE id='" + params.id + "'");
	};
	Client_clickCancel = function (arg) {
		popupVisible(false);
	};

	Client_PullDownActionFunction = function (actionOptions) {
		// DevExpress.ui.dialog.alert("The widget has been pulled down", "Action executed");
		actionOptions.component.release();
	};

	Client_MapReadyAction = function (s) {
		P.loadPanelVisible(false);
		//var map = s.component;
		var map = $("#idClientMap").data("dxMap");
		map.addMarker({ tooltip: _.Common.CurrentLocation, location: P.geoCurrent() });

		DAL.ClientById(params.Id).load().done(function(result) {
			cliName(result[0].N2 + ' (' + result[0].A + ')');
			//              location(P.geoCurrent());
			//            if (location()){
			//map.addMarker({tooltip: 'Current Location2', location: '56.843214,53.225489'});

			var locCli = result[0].geoLoc;
			locCli = result[0].A;
			if (locCli) {
				map.addMarker({ tooltip: result[0].N + ', ' + result[0].A, location: locCli });
			} else {
				P.geoCoder(result[0].Adres).done(function(geores) {
					map.addMarker({ tooltip: result[0].N + ', ' + result[0].A, location: geores });
				});

				var p1 = map._options.markers[0].location.split(',');
				var p2 = map._options.markers[1].location.split(',');
				if (p1 && p2 && p1.length == 2 && p2.length == 2) {
					var res1 = P.getDistance(p1, p2);
					var res2 = P.geoBearing(p1, p2);
					cliName(cliName() + ' dist=' + res1 + ' dir=' + res2);
				}
			}

			var routeOptions = {
				weight: 5,
				color: "blue",
				locations: [map._options.markers[0].location, map._options.markers[1].location]
			};
			map.addRoute(routeOptions);

			var directionsDisplay = new google.maps.DirectionsRenderer();
			//directionsDisplay.setMap(map._map);

			var directionsService = new google.maps.DirectionsService();
			var request = {
				origin: map._options.markers[0].location,
				destination: map._options.markers[1].location,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					geoDirections(result.routes[0]);
					//directionsDisplay.setDirections(result);
				}
			});
			// var geo = P.geoCoder(locCli).done(function(res){
			//     geoDirections(res);
			// });

			////    http://maps.googleapis.com/maps/api/directions/json?origin=56.853213999999994,53.215489&destination=%D0%98%D0%B6%D0%B5%D0%B2%D1%81%D0%BA%20%D0%B3.,%20%D0%9C%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB.,%2069&sensor=false

			// $.ajax({
			//         url: P.geoDirectionsUrl,
			//         data: { sensor: false, 
			//             origin:  map._options.markers[0].location, 
			//             destination: map._options.markers[1].location},
			//         type: 'GET',
			//         dataType: 'json',
			//         crossDomain: true, 
			//         headers: { 
			//             Accept : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",                                

			//         },
			//         success: function(data) {
			//             geoDirections(data);
			//         }
			// })

			// $.get(P.geoDirectionsUrl, { sensor: false, callback: '_googleScriptReady',
			//     origin:  map._options.markers[0].location, 
			//     destination: map._options.markers[1].location})
			// .done(function(data){
			//     geoDirections(data);
			// });

			// map.gmap('microdata', 'http://data-vocabulary.org/Event', function(result, item, index) {
			//     var lat = result.location[0].geo[0].latitude;
			//     var lng = result.location[0].geo[0].longitude;
			//     var latlng = new google.maps.LatLng(lat, lng);
			// })
			//  var m = map._options.markers;
			//            map.addMarker({label: "A1", tooltip: result[0].Name + ', ' + result[0].Adres, location: [56.853213999999994,53.206272]});
			// }
			//thisCli.options.markers[0] = { label: "A", tooltip: "sd asd asd ", location: P.geoCurrent() };
		});
	};


	return viewModel;
};