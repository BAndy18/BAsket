BAsket.products = function (params) {   
    var searchStr = ko.observable('');
    //var categoryId = 
    P.curCategoryId = (params.id == 'undefined') ? P.curCategoryId : params.id;
    var arrayBAsket = ko.observable([]);

    var bChoice = ko.observable(true);
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

    swichClicked  = function () {
        //BAsket.notify("swichClicked", "info");
        if (bChoice()){
            bChoice(false);
            lbltitle(_.Products.Title2);
            btnSwText(_.Products.btnSwText2);
        } else {
            bChoice(true);
            lbltitle(_.Products.Title1);
            btnSwText(_.Products.btnSwText1);
        }
        var list = $("#listProducts").data("dxList");
        //list.repaint();
    };

    categoryChanged = function(arg) {
        if (arg.element.length <= 0) return;
     
        var lookup = $("#CategoryLookup").data("dxLookup");
        var value = lookup.option("value");
        //categoryId = value;
        P.curCategoryId = value;
        P.curCategoryName = $(".dx-state-active").html();
        BAsket.app.navigate('products/' + P.curCategoryId, { direction: 'none'});
    }
    return viewModel;
};

