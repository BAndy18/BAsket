BAsket.Order = function (params) {
	var viewModel = {
//		dataSource: DAL.Categories(),

        lookup: {
            data: ["red", "green", "blue", "yellow"],
            value: ko.observable(null)
        },
        params: {
            data: ["firm", "payment"],
            value: ko.observable("firm")
        },

	};

	clickBack = function(arg){
		if (location.hash.indexOf('/') > 0)
			BAsket.app.navigate('OrderList/');
		else
			BAsket.app.navigate('home', { root: true });
	};

	buttonClicked  = function () {
		 BAsket.notify("buttonClicked", "info");
		//P.loadPanelVisible(!P.loadPanelVisible());
	};
	return viewModel;
};

BAsket.OrderList = function (params) {
	var viewModel = {
		dataSource: DAL.BilM(),
	};
	return viewModel;
};