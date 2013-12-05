BAsket['product-details'] = function (params) {
    var viewModel = {
        id: params.id,
        name: ko.observable(''),
        price: ko.observable(''),
        nameArt: ko.observable(''),
        nameManuf: ko.observable(''),
        urlPict: ko.observable(''),
        upak: ko.observable(''),
        ostat: ko.observable(''),

        quant: ko.observable(0)
    };
	DAL.ProductDetails({id: params.id, model: viewModel});
    
    return viewModel;
};

BAsket.buttonClicked = function(arg) {
	alert('buttonClicked:' + this.quant());
	if (BAsket.app.canBack())
		BAsket.app.back(); 
}