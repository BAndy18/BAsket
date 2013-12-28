BAsket.products = function (params) {   
    var searchStr = ko.observable('');
    //var categoryId = 
    P.curCategoryId = (params.id == 'undefined') ? P.curCategoryId : params.id;
    var arrayBAsket = ko.observable([]);

    var bChoice = ko.observable(P.curModeChoice);
    var lbltitle =  ko.observable(_.Products.Title1);
    var btnSwText = ko.observable(_.Products.btnSwText1);

    var viewModel = {
        searchString: searchStr,
        find: function () {
            viewModel.showSearch(!viewModel.showSearch());
            viewModel.searchString('');
        },
        showSearch: ko.observable(false),

        dataSourceCat: DAL.Categories(),
        dataSourceProd: DAL.Products({id:P.curCategoryId, search:searchStr}),
        dataSourceBasket: P.arrayBAsket,

        //categoryId: categoryId,
        categoryName: P.curCategoryName,

        bChoice: bChoice,
        lbltitle: lbltitle,
        btnSwText: btnSwText,
    };
    ko.computed(function () {
        return viewModel.searchString();
    }).extend({
        throttle: 500
    }).subscribe(function () {
        viewModel.dataSource.reload();
    });

    Products_swichClicked  = function () {
        //BAsket.notify("swichClicked", "info");
        P.curModeChoice = !P.curModeChoice;
        if (!P.curModeChoice){
            bChoice(P.curModeChoice);
            lbltitle(_.Products.Title2);
            btnSwText(_.Products.btnSwText2);
            //viewModel.dataSourceBasket.load();
        } else {
            bChoice(P.curModeChoice);
            lbltitle(_.Products.Title1);
            btnSwText(_.Products.btnSwText1);
            //viewModel.dataSourceProd.load();
        }
        //var list = $("#listProducts").data("dxList");
        //list.repaint();
    };

    Products_categoryChanged = function(arg) {
        if (arg.element.length <= 0) return;
     
        var lookup = $("#CategoryLookup").data("dxLookup");
        var value = lookup.option("value");
        //categoryId = value;
        P.curCategoryId = value;
        P.curCategoryName = $(".dx-state-active").html();
        BAsket.app.navigate('products/' + P.curCategoryId, { direction: 'none'});
    }

    Products_clickBack = function(arg) {
        //BAsket.app.navigate('Order/' + P.curCategoryId);
        //BAsket.app.navigationManager.restoreState(window.localStorage);
        var cur = 0;
        for (var i = BAsket.app.navigationManager.currentStack.items.length - 1; i > 0; i--){
            if (BAsket.app.navigationManager.currentStack.items[i-1].uri.indexOf('Order') == 0) {
                cur = i;
                break;
            } else {
                BAsket.app.navigationManager.currentStack.items.splice(i-1, 1);
            }
        }
        BAsket.app.navigationManager.currentStack.currentIndex = cur;   //BAsket.app.navigationManager.currentStack.items.length - 1;
        BAsket.app.back();
    }

    return viewModel;
};

