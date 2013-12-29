BAsket['product-details'] = function (params) {
    var viewModel = {
        Id: params.Id,
        Name: ko.observable(''),
        Price: ko.observable(''),
        NameArt: ko.observable(''),
        NameManuf: ko.observable(''),
        UrlPict: ko.observable(''),
        Upak: ko.observable(''),
        Ostat: ko.observable(''),

        Quant: ko.observable(0)
    };
	DAL.ProductDetails({Id: params.Id, model: viewModel});
    
    Product_Details_saveClicked = function(arg) {
        var bFound = false;
        for (var i in P.arrayBAsket) {
            //if (!P.arrayBAsket.hasOwnProperty(i)) continue;
            //if (i == key && P.arrayBAsket[i].id == this.id()) {
            if (P.arrayBAsket[i].Id == this.Id) {
                if (this.Quant())
                    P.arrayBAsket[i].quant = this.Quant();
                else
                    P.arrayBAsket.splice(i, 1);
                bFound = true;
                break;
            }
        }
        if (!bFound){
            P.arrayBAsket.push({'Id':this.Id, 'Name':this.Name(),'Upak':this.Upak(),'Quant':this.Quant(),'Price':this.Price()});
        }

        BAsket.app.navigate('products/' + P.curCategoryId);
        //BAsket.app.back(); 
    }

    return viewModel;
};
