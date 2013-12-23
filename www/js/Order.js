BAsket.Order = function (params) {
	var viewModel = {
//		dataSource: DAL.Categories(),

		clients: DAL.Clients(),
        lookup: {
            data: ["red", "green", "blue", "yellow"],
            value: ko.observable(null)
        },
        params: {
            data: ["firm", "payment"],
            value: ko.observable("firm")
        },

	};
	
	clientChanged = function(arg){
		//alert('clientChanged');
		var fieldTP = $("#fieldTradePoint");
		if (fieldTP && fieldTP.length == 1){
			if (fieldTP[0].hidden)
				fieldTP[0].hidden = false;
			else
				fieldTP[0].hidden = true;
		}
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
	clientChanged();

	return viewModel;
};

BAsket.OrderList = function (params) {
	var viewModel = {
		dataSource: DAL.BilM(),
	};
	return viewModel;
};