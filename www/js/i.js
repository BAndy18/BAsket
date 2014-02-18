window.Test = {};

$(function() {
	// DevExpress.devices.current({platform: 'generic'});
	DevExpress.devices.current({platform: 'andrid'});
	// DevExpress.devices.current({platform: 'ios', version: '6'});
	// DevExpress.devices.current({platform: 'win8'});

	Test.app = new DevExpress.framework.html.HtmlApplication({
		namespace: Test,
		navigationType: "slideout",
		// navigationType: "navbar",
		navigation: navigation,
		//viewPort: { allowPan: true }		
	});
	Test.app.router.register(":view/:Id", { view: "home", Id: undefined });
	Test.app.navigate();
});

var navigation = [{ "id": "Home", "action": "#home", "icon": "home", "title": "Test"},            
    { "id": "Clients", "action": "#Clients", "icon": "globe", "title": "Clients"}];

Test.Clients = function (params) {

	var viewModel = {
		dataSource: 
		[
		{"Id":"-1","N":"Beverages"},{"Id":"-2","N":"Condiments"},{"Id":"-3","N":"Confections"},{"Id":"-4","N":"Dairy Products"},{"Id":"-5","N":"Grains/Cereals"},{"Id":"-6","N":"Meat/Poultry"},{"Id":"-7","N":"Produce"},{"Id":"-8","N":"Seafood"}
		,{"Id":"-1","N":"Beverages"},{"Id":"-2","N":"Condiments"},{"Id":"-3","N":"Confections"},{"Id":"-4","N":"Dairy Products"},{"Id":"-5","N":"Grains/Cereals"},{"Id":"-6","N":"Meat/Poultry"},{"Id":"-7","N":"Produce"},{"Id":"-8","N":"Seafood"}
		]
	};

	return viewModel;
};
