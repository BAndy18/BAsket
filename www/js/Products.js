BAsket.products = function (params) {   
    var searchStr = ko.observable('')
    var idCategory = (params.id == 'undefined') ? P.currentCategory['id'] : params.id;
    var viewModel = {
        searchString: searchStr,
        find: function () {
            viewModel.showSearch(!viewModel.showSearch());
            viewModel.searchString('');
        },
        showSearch: ko.observable(false),

        dataSource: DAL.Products({id:idCategory, search:searchStr}),

        dataSourceCat: DAL.Categories(),

        categoryId: idCategory,
        categoryName: P.currentCategory['name'],
        lbltitle: "Choice the Product",
    };
    ko.computed(function () {
        return viewModel.searchString();
    }).extend({
        throttle: 500
    }).subscribe(function () {
        viewModel.dataSource.reload();
    });

    buttonClicked  = function () {
        BAsket.notify("buttonClicked", "info");
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

