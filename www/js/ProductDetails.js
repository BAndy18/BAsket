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
    var bFound = false;
    for (var i in P.arrayBAsket) {
        //if (!P.arrayBAsket.hasOwnProperty(i)) continue;
        //if (i == key && P.arrayBAsket[i].id == this.id()) {
        if (P.arrayBAsket[i].id == this.id) {
            if (this.quant())
                P.arrayBAsket[i].quant = this.quant();
            else
                P.arrayBAsket.splice(i, 1);
            bFound = true;
            break;
        }
    }
    if (!bFound){
        P.arrayBAsket.push({'id':this.id, 'name':this.name(),'upak':this.upak(),'quant':this.quant(),'price':this.price()});
    }

    BAsket.app.navigate('products/' + P.curCategoryId);
    //BAsket.app.back(); 
}