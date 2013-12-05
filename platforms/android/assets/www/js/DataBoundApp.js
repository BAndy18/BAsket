BAsket.DXhome = function (params) {
    var viewModel = {
        dataSource: DevExpress.data.createDataSource({
            load: function (loadOptions) {
                if (loadOptions.refresh) {
                    var deferred = new $.Deferred();
                    $.get(BAsket.dataSouce + 'Categories')
//                    $.get('http://sampleservices.devexpress.com/api/Categories')
                    .done(function (result) {
                        var mapped = $.map(result, function (data) {
                            return {
                                name: data.Name,
                                id: data.ID
                                // name: data.CategoryName,
                                // id: data.CategoryID
                            }
                        });
                        deferred.resolve(mapped);
                    });
                    return deferred;
                }
            }
        })
    };
    return viewModel;
};

BAsket.DXproducts = function (params) {
    var skip = 0;
    var PAGE_SIZE = 10;
    var viewModel = {
        searchString: ko.observable(''),
        find: function () {
            viewModel.showSearch(!viewModel.showSearch());
            viewModel.searchString('');
        },
        showSearch: ko.observable(false),
        categoryId: params.id,
        dataSource: DevExpress.data.createDataSource({
            load: function (loadOptions) {
                if (loadOptions.refresh) {
                    skip = 0;
                }
                var deferred = new $.Deferred();
                $.get(BAsket.dataSouce + 'Products',
//                $.get('http://sampleservices.devexpress.com/api/Products',
                    {
                        grId: viewModel.categoryId,
//                        categoryId: viewModel.categoryId,
                        skip: skip,
                        take: PAGE_SIZE,
                        searchString: viewModel.searchString()
                    })
                .done(function (result) {
                    skip += PAGE_SIZE;
                    var mapped = $.map(result, function (data) {
                        return {
                            name: data.Name,
                            id: data.ID
                            // name: data.ProductName,
                            // id: data.ProductID
                        };
                    });
                    deferred.resolve(mapped);
                });
                return deferred;
            }
        })
    };
    ko.computed(function () {
        return viewModel.searchString();
    }).extend({
        throttle: 500
    }).subscribe(function () {
        viewModel.dataSource.reload();
    });
    return viewModel;
};

BAsket['DXproduct-details'] = function (params) {
    var viewModel = {
        id: params.id,
        name: ko.observable('')
    };
    $.get(BAsket.dataSouce + 'Products/' + viewModel.id)
//    $.get('http://sampleservices.devexpress.com/api/Products/' + viewModel.id)
    .done(function (data) {
        viewModel.name(data.Name);
//        viewModel.name(data.ProductName);
    });        
    return viewModel;
};  