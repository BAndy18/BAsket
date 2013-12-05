/// *** Web REST Data Access *** ///
var DAL_web = (function ($, window) {
    var root = {};

    root.Categories = function (params){
        var dataSource = DevExpress.data.createDataSource({
            beforeSend: function (request) {
            //    request.headers["Authorization"] = "Basic " + DevExpress.data.base64_encode([app.UserName, app.Password].join(":"))
            },
            load: function (loadOptions) {
    			if (loadOptions.refresh) {
    				var deferred = new $.Deferred();
    				$
    				.ajax({
    					url: P.dataSouce + 'Categories',
    		            // dataType: "jsonp",
    		            // jsonpCallback: 'pcb',
    				})
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
            },
            lookup: function(key){
                return 'lookup';
            }
        });
        return dataSource;	
    };

    root.Products = function (params){
    	var skip = 0;
        var PAGE_SIZE = 30;
    	var dataSource = DevExpress.data.createDataSource({
            load: function (loadOptions) {
                if (loadOptions.refresh) {
                    skip = 0;
                }
                var deferred = new $.Deferred();
                if (params.id) {
                    $.get(P.dataSouce + 'Products',
                        {
                            grId: params.id,
                            skip: skip,
                            take: PAGE_SIZE,
                            searchString: params.search
                        })
                    .done(function (result) {
                        skip += PAGE_SIZE;
                        var mapped = $.map(result, function (data) {
                            return {
                                id: data.ID,
                                name: data.Name,
                                idGr: data.GrID,
                                price: data.Price,
                                nameArt: data.Art,
                                nameManuf: data.Manuf,
                                urlPict: data.UrlPict,
                                upak: data.Upak,
                                ostat: data.Ostat,
                            };
                        });
                        deferred.resolve(mapped);
                    });
                } else {
                     $.get(P.dataSouce + 'Products', {grId: 'all'})
                    .done(function (result) {
                        var mapped = $.map(result, function (data) {
                            return {
                                id: data.ID,
                                name: data.Name,
                                idGr: data.GrID,
                                price: data.Price,
                                nameArt: data.Art,
                                nameManuf: data.Manuf,
                                urlPict: data.UrlPict,
                                upak: data.Upak,
                                ostat: data.Ostat,
                            };
                        });
                        deferred.resolve(mapped);
                    });
                }
                return deferred;
            }
        });
        return dataSource;	
    }

    root.ProductDetails = function (params){
    	var dataSource = $.get(P.dataSouce + 'Products/' + params.id)
    	    .done(function (data) {
                params.model.name(data.Name),
    	    	params.model.price(data.Price.toFixed(2)),
                params.model.nameArt(data.Art),
                params.model.nameManuf(data.Manuf),
                params.model.urlPict(data.UrlPict),
                params.model.upak(data.Upak),
                params.model.ostat(data.Ostat)
    	    });
    	return dataSource;	
    }

    return root;
})(jQuery, window);
