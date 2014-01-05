BAsket['product-details'] = function (params) {
    //var Quant = ko.observable('0');

    var viewModel = {
        Id: params.Id,
        Name: ko.observable(''),
        Price: ko.observable(''),
        NameArt: ko.observable(''),
        NameManuf: ko.observable(''),
        UrlPict: ko.observable(''),
        Upak: ko.observable(''),
        Ostat: ko.observable(''),

        Quant: ko.observable(),
        
        viewShown: function() {
            var quant = $("#idQuant").data("dxNumberBox");
            quant.focus();
        }
    };
	DAL.ProductDetails({Id: params.Id, model: viewModel});

    // DAL.NMS(0).done(function (result) {
    //         var quant = $("#idQuant").data("dxNumberBox");
    //         quant.focus();
    // })

    Product_Details_saveClicked = function(arg) {
        var bFound = false;
        //var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
        // for (var prop in valueQuant)
        //     console.log(prop + ': ' + valueQuant[prop])
        console.log('Product_Details_saveClicked <' + this.Quant());
        var quant = parseInt(this.Quant());
        console.log('Product_Details_saveClicked quant<' + quant + '>');
        for (var i in P.arrayBAsket) {
            //if (!P.arrayBAsket.hasOwnProperty(i)) continue;
            //if (i == key && P.arrayBAsket[i].id == this.id()) {
            if (P.arrayBAsket[i].Id == this.Id) {
                if (quant && quant > 0)
                    P.arrayBAsket[i].Quant = quant;
                else
                    P.arrayBAsket.splice(i, 1);
                bFound = true;
                break;
            }
        }
        if (!bFound){
            P.arrayBAsket.push({'Id':this.Id, 'Name':this.Name(),'Upak':this.Upak(),'Ostat':this.Ostat(),'Quant':quant,'Price':this.Price()});
        }
        // for(var i in P.arrayBAsket){
        //     console.log('Product_Details_saveClicked arrayBAsket<' + P.arrayBAsket[i].Quant + '>');
        // }

        BAsket.app.navigate('products/' + P.curCategoryId);
        //BAsket.app.back(); 
    }

    return viewModel;
};
