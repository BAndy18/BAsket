/// *** Web REST Data Access *** ///
var DAL_web = (function ($, window) {
    var root = {};

    root.Categories = function (params){
        return root.ExecDataSource({control:'Categories', lookup: true});
    };
    root.Products = function (params){
        return root.ExecDataSource({control: 'Products', paging: true,
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
        root.ExecDataSource({control: 'Products/' + params.Id}).load()
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
        var param = {control: 'Clients', paging: true, prm: {}};
        if (params) {
            if (params.search)
                param['prm'] = {searchString: params.search};
            else
                param['prm'] = params;
        } else 
            param['lookup'] = true;

        return root.ExecDataSource(param);
    };
    root.ClientsPar = function (params){
        return root.ExecDataSource({control: 'Clients/' + params});
    }

    root.NMS = function (params){
        return root.ExecDataSource({control: 'Nms', prm: {Id:params}});
    };


    root.ExecDataSource = function(params, mapCallback){
        if (params.lookup)
            return new DevExpress.data.DataSource({
                pageSize: P.pageSize, 
                load: function (loadOptions) {
                    if (params.paging) {
                        params.prm['skip'] = loadOptions.skip;
                        params.prm['take'] = loadOptions.take;
                    }
                    return $.get(P.dataSouce + params.control, params.prm)
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
                    return $.get(P.dataSouce + params.control, params.prm);
                },
                map: function(item) {
                    if (mapCallback)
                        return mapCallback(item)
                    else
                        return item;
                },
            });
    }

    // root.Categories = function (params){
    //     var dataSource = new DevExpress.data.DataSource({
    //         beforeSend: function (request) {
    //         //    request.headers["Authorization"] = "Basic " + DevExpress.data.base64_encode([app.UserName, app.Password].join(":"))
    //         },
    //         load: function (loadOptions) {
    // 			if (loadOptions.refresh) {
    // 				var deferred = new $.Deferred();
    // 				$
    // 				.ajax({
    // 					url: P.dataSouce + 'Categories',
    // 		            // dataType: "jsonp",
    // 		            // jsonpCallback: 'pcb',
    // 				})
    // 				.done(function (result) {
    // 					var mapped = $.map(result, function (data) {
    // 						return {
    // 							name: data.Name,
    // 							id: data.ID
    // 							// name: data.CategoryName,
    // 							// id: data.CategoryID
    // 						}
    // 					});
    // 					deferred.resolve(mapped);
    // 				});
    // 				return deferred;
    // 			}
    //         },
    //         lookup: function(key){
    //             return 'lookup';
    //         }
    //     });
    //     return dataSource;	
    // };

    // root.Products = function (params){
    // 	var skip = 0;
    //     var PAGE_SIZE = 30;
    // 	var dataSource = new DevExpress.data.DataSource({
    //         load: function (loadOptions) {
    //             if (loadOptions.refresh) {
    //                 skip = 0;
    //             }
    //             var deferred = new $.Deferred();
    //             if (params.Id) {
    //                 $.get(P.dataSouce + 'Products',
    //                     {
    //                         grId: params.Id,
    //                         skip: skip,
    //                         take: PAGE_SIZE,
    //                         searchString: params.search
    //                     })
    //                 .done(function (result) {
    //                     skip += PAGE_SIZE;
    //                     var mapped = $.map(result, function (data) {
    //                         for (var i in P.arrayBAsket) {
    //                             if (P.arrayBAsket[i].Id == data.Id) {
    //                                 data.Quant = P.arrayBAsket[i].Quant;
    //                             }
    //                         }
    //                         return data;
    //                         // {
    //                         // return {
    //                         //     Id: data.Id,
    //                         //     Name: data.Name,
    //                         //     IdGr: data.GrId,
    //                         //     Price: data.Price,
    //                         //     NameArt: data.NameArt,
    //                         //     NameManuf: data.NameManuf,
    //                         //     UrlPict: data.UrlPict,
    //                         //     Upak: data.Upak,
    //                         //     Ostat: data.Ostat,
    //                         // };
    //                     });
    //                     deferred.resolve(mapped);
    //                 });
    //             } else {
    //                  $.get(P.dataSouce + 'Products', {grId: 'all'})
    //                 .done(function (result) {
    //                     var mapped = $.map(result, function (data) {
    //                         return {
    //                             Id: data.Id,
    //                             Name: data.Name,
    //                             IdGr: data.GrId,
    //                             Price: data.Price,
    //                             NameArt: data.NameArt,
    //                             NameManuf: data.NameManuf,
    //                             UrlPict: data.UrlPict,
    //                             Upak: data.Upak,
    //                             Ostat: data.Ostat,
    //                        };
    //                     });
    //                     deferred.resolve(mapped);
    //                 });
    //             }
    //             return deferred;
    //         }
    //     });
    //     return dataSource;	
    // }

    // root.Clients = function (params){
    //     var dataSource = new DevExpress.data.DataSource({
    //         beforeSend: function (request) {
    //         },
    //         load: function (loadOptions) {
    //             if (loadOptions.refresh) {
    //                 var deferred = new $.Deferred();
    //                 $
    //                 .ajax({
    //                     url: P.dataSouce + 'Clients',
    //                 })
    //                 .done(function (result) {
    //                     var mapped = $.map(result, function (data) {
    //                         return {
    //                             Id: data.Id,
    //                             IdPar: data.IdPar,
    //                             Name: data.Name,
    //                             Adres: data.Adres,
    //                         }
    //                     });
    //                     deferred.resolve(mapped);
    //                 });
    //                 return deferred;
    //             }
    //         },
    //         lookup: function(key){
    //             return 'lookup';
    //         }
    //     });
    //     return dataSource;  
    // };

    return root;
})(jQuery, window);
