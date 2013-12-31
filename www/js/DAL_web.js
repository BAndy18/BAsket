/// *** Web REST Data Access *** ///
var DAL_web = (function ($, window) {
    var root = {};

    root.Categories = function (params){
        if (!P.dataSouceUrl)
            return DAL_tst.Categories_Data;

        return execDataSource({control:'Categories', lookup: true});
    };
    root.Products = function (params){
        if (!P.dataSouceUrl)
            return DAL_tst.Products_Data;

        return execDataSource({control: 'Products', paging: true,
            prm: {grId: params.Id,
                searchString: params.search}
            }, function(data){
                for (var i in P.arrayBAsket) {
                    if (P.arrayBAsket[i].Id == data.Id) {
                        data.Quant = P.arrayBAsket[i].Quant;
                    }
                }
                return data;            
            });
    };
    root.ProductDetails = function (params){
        execDataSource({control: 'Products/' + params.Id}).load()
//        var dataSource = $.get(P.dataSouce + 'Products/' + params.Id)
            .done(function (data) {
                var quant = '0';
                for (var i in P.arrayBAsket) {
                    if (P.arrayBAsket[i].Id == data[0].Id) {
                        quant = P.arrayBAsket[i].Quant;
                    }
                }
                params.model.Name(data[0].Name),
                params.model.Price(data[0].Price.toFixed(2)),
                params.model.NameArt(data[0].NameArt),
                params.model.NameManuf(data[0].NameManuf),
                params.model.UrlPict(data[0].UrlPict),
                params.model.Upak(data[0].Upak),
                params.model.Ostat(data[0].Ostat)
                params.model.Quant(quant)
            });
//        return dataSource;  
    }

    root.Clients = function (params){
        if (!P.dataSouceUrl)
            return DAL_tst.Clients_Data;

        var param = {control: 'Clients', paging: true, prm: {}};
        if (params) {
            if (params.search)
                param['prm'] = {searchString: params.search};
            else
                param['prm'] = params;
        } else 
            param['lookup'] = true;

        return execDataSource(param);
    };
    root.ClientsPar = function (params){
        return execDataSource({control: 'Clients/' + params});
    }

    root.NMS = function (params){
        return execDataSource({control: 'Nms', prm: {Id:params}});
    };


    function execDataSource (params, mapCallback){
        if (params.lookup)
            return new DevExpress.data.DataSource({
                pageSize: P.pageSize, 
                load: function (loadOptions) {
                    if (params.paging) {
                        params.prm['skip'] = loadOptions.skip;
                        params.prm['take'] = loadOptions.take;
                    }
                    return $.get(P.dataSouceUrl + params.control, params.prm)
                    .done(function (result) {
                         var mapped = $.map(result, function (item) {
                            if (mapCallback)
                                return mapCallback(item)
                            else
                                return item;
                         });
                     });
                },
                lookup: function(key){
                    return 'lookup';
                }
            });
        else
            return new DevExpress.data.DataSource({
                pageSize: P.pageSize, 
                load: function (loadOptions) {
                    if (params.paging) {
                        params.prm['skip'] = loadOptions.skip;
                        params.prm['take'] = loadOptions.take;
                    }
                    return $.get(P.dataSouceUrl + params.control, params.prm);
                },
                map: function(item) {
                    if (mapCallback)
                        return mapCallback(item)
                    else
                        return item;
                },
            });
    }

    return root;
})(jQuery, window);
