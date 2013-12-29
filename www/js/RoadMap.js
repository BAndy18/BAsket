BAsket.RoadMapList = function (params) {
	var viewModel = {
		dataSource: DAL.RoadMap(),
    }

    clickShowRoadMap = function(arg) {
        //BAsket.notify("clickShowRoadMap", "info");
        //popupVisible(true);
         BAsket.app.navigate('RoadMap/');
    }    

    return viewModel;
};

BAsket.RoadMap = function (params) {
    P.getGeo();
    var viewModel = {
        options: {
            provider: P.mapProvider,
            mapType: "roadmap",
            location: P.geoCurrent,
//            location: "56.8532,53.2155",
            controls: true,
            width: "100%",
            height: "100%",
            zoom: 15,
            markers: [
              { title: "A", tooltip: "sd asd asd ", location: [56.851248,53.20271] },
              { title: "B", tooltip: "wer wer w", location: [56.864278,53.216272] },
              { title: "C", tooltip: "asasdas asd as asd ", location: [56.859488,53.190437] }
            ],
            routes: [{
                weight: 5,
                color: "blue",
                locations: [
                  [56.851248,53.20271],
                  [56.864278,53.216272],
                  [56.859488,53.190437]
                ]
            }]
        }
    };
    return viewModel;
};
