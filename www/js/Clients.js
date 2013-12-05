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
            provider: "googleStatic",
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





BAsket.Clients = function (params) {
    var viewModel = {
        dataSource: DAL.Clients(),
    }
    return viewModel;
};

BAsket.Client = function (params) {
    var viewModel = {
        //dataSource: DAL.Clients(),
        // tabs: [
        //     { text: "Bing map" },
        //     { text: "Google map" },
        // ],
        selectedTab: ko.observable(0),
        options: {
            // provider: ko.observable(),
            // mapType: ko.observable(),
            provider: "google",
            mapType: "roadmap",
            location: "56.844278,53.206272",
            width: "100%",
            height: "100%",
            zoom: 15,
            markers: [
              { label: "A", location: [56.851248,53.20271] },
              { label: "B", location: [56.844278,53.206272] },
              { label: "C", location: [56.829488,53.180437] }
            ],
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
    // var maps = [
    //     {
    //         provider: ko.observable("bing"),
    //         mapType: ko.observable("roadmap")
    //     },
    //     {
    //         provider: ko.observable("google"),
    //         mapType: ko.observable("satellite")
    //     }
    // ];
	
    // var provider = ko.observable("google");
    // var mapType = ko.observable("roadmap");

    // // var provider = ko.observable("bing");
    // // var mapType = ko.observable("roadmap");

    // ko.computed(function() {
    //     viewModel.options.provider(provider);
    //     viewModel.options.mapType(mapType);
    //     // viewModel.options.provider(maps[viewModel.selectedTab()].provider());
    //     // viewModel.options.mapType(maps[viewModel.selectedTab()].mapType());
    // });

    return viewModel;
};