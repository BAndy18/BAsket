BAsket.products = function (params) {   
    var searchStr = ko.observable('')
    var categoryId = (params.id == 'undefined') ? P.currentCategory['id'] : params.id;
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

        dataSource: DAL.Products({id:categoryId, search:searchStr}),
        dataSourceCat: DAL.Categories(),

        categoryId: categoryId,
        categoryName: P.currentCategory['name'],

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
            viewModel.dataSource = [];
        } else {
            bChoice(true);
            lbltitle(_.Products.Title1);
            btnSwText(_.Products.btnSwText1);
            viewModel.dataSource = DAL.Products({id:categoryId, search:searchStr});
        }
        var list = $("#listProducts").data("dxList");
        list.repaint();
    };

    categoryChanged = function(arg) {
        if (arg.element.length <= 0) return;
     
        var lookup = $("#CategoryLookup").data("dxLookup");
        var value = lookup.option("value");
        categoryId = value;
        P.currentCategory['name'] = $(".dx-state-active").html();
        BAsket.app.navigate('products/' + categoryId, { direction: 'none'});
    }
    return viewModel;
};

