BAsket.Clients = function (params) {
    var searchStr = ko.observable('');
    var viewModel = {
        searchString: searchStr,
        find: function () {
            viewModel.showSearch(!viewModel.showSearch());
            viewModel.searchString('');
        },
        showSearch: ko.observable(false),

        dataSource: DAL.Clients({search:searchStr}),
    }
    ko.computed(function () {
        return viewModel.searchString();
    }).extend({
        throttle: 500
    }).subscribe(function () {
        viewModel.dataSource.pageIndex(0);
        viewModel.dataSource.load();
    });

    return viewModel;
};

BAsket.Client = function (params) {
    P.getGeo();
    clickSaveGeo = function(arg) {
        DAL_local.ExecQuery("UPDATE CLI set geoLoc='" + P.geoCurrent() + "' WHERE id='" + params.id + "'");
    }    
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
            provider: P.mapProvider,
            mapType: "roadmap",
            location: P.geoCurrent(),
            //"56.844278,53.206272",
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