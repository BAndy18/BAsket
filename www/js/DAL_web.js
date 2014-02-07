/// *** Web REST Data Access *** ///
var DAL_web = (function ($, window) {
	var root = {};

    if (!window.localStorage.getItem("dataSouceUrl") && !window['DAL_tst'])
        P.LoadFile('js/DAL_tst.js', 'js');

    root.NMS = function (params) {
        if (!P.dataSouceUrl)
            return DAL_tst.NMS_Data;
        return execDataSource({ control: 'Nms' });
    };
	root.Categories = function (params) {
		if (!P.dataSouceUrl)
			return DAL_tst.Categories_Data;

		return execDataSource({ control: 'Categories', lookup: true });
	};
	root.Products = function (params) {
		if (!P.dataSouceUrl)
			return DAL_tst.Products_Data;
        var control = 'Products';
        if (params.pId == 'ost')
            control = 'ProdOst';

		return execDataSource({
			control: control, paging: true,
			prm: {
				pId: params.pId,
				searchString: params.search
			}
		}, function (data) {
			var bFound = false;
			for (var i in P.arrayBAsket) {
				if (P.arrayBAsket[i].Id == data.Id) {
					data.Quant = P.arrayBAsket[i].Quant;
					bFound = true;
				}
			}
			if (!bFound)
				data.Quant = '';
            data.Name = data.N;
            data.Price = data.P;
            data.Ostat = data.O;
			return data;
		});
	};
	root.ProductDetails = function(params) {
		execDataSource({ control: 'Products/' + params.Id }).load()
			.done(function(data) {
				var quant = '0';
				for (var i in P.arrayBAsket) {
					if (P.arrayBAsket[i].Id == data[0].Id) {
						quant = P.arrayBAsket[i].Quant;
					}
				};
				params.model.Name(data[0].N);
				params.model.Price(data[0].P.toFixed(2));
				params.model.N1(data[0].N1);
				params.model.N2(data[0].N2);
				params.model.N3(data[0].N3);
				params.model.N4(data[0].N4);
				params.model.Ostat(data[0].O);
				params.model.Quant(quant);
			});
	};
	root.ProductsByWars = function(params) {
		return execDataSource({ control: 'Products/', prm: { w: params } });
	};

	root.Clients = function (params) {
		if (!P.dataSouceUrl)
			return DAL_tst.Clients_Data;

		var param = { control: 'Clients', paging: true, prm: {} };
		if (params) {
			if (params.search)
				param['prm'] = { searchString: params.search };
			else
				param['prm'] = params;
		} else
			param['lookup'] = true;

		return execDataSource(param, function (data) {
            data.Name = data.N;
            data.Adres = data.A;
            return data;
        });
	};
	root.ClientsPar = function(params) {
		return execDataSource({ control: 'Clients/' + params, prm: { fil: true } }, function (data) {
            data.Name = data.N;
            data.Adres = data.A;
            return data;
        });
	};
	root.ClientById = function(params) {
		return execDataSource({ control: 'Clients/' + params }, function (data) {
            data.Name = data.N;
            data.Adres = data.A;
            return data;
        });
	};

	root.BilM = function(params) {
		return execDataSource({ control: 'BilM', paging: true, prm: {}}, function (data) {
            data.Name = data.N1;
            data.Adres = data.N2;
            data.ShortDate = data.DateDoc.substring(1, 5);
            return data;
        });
	};
	root.BilMById = function(params) {
		return execDataSource({ control: 'BilM/' + params });
	};
	root.SaveBil = function(params) {
        params['cmd'] = 'SaveBil';
		return execMethod({ method: 'POST', control: 'BilM/', prm: params }).load();
	};
	root.DeleteBil = function(params) {
		return execMethod({ method: 'DELETE', control: 'BilM/', prm: params }).load();
	};

    root.SendRepo = function(params) {
        params['cmd'] = 'SendRepo';
        return execMethod({ method: 'POST', control: 'BilM/', prm: params }).load();
    };


	function execDataSource(params, mapCallback) {
		//P.getDeviceId();
		if (params.lookup)
			return new DevExpress.data.DataSource({
				pageSize: P.pageSize,
				load: function (loadOptions) {
					if (params.paging) {
						params.prm['skip'] = loadOptions.skip;
						params.prm['take'] = loadOptions.take;
					}
					// return $.get(P.dataSouceUrl + params.control, params.prm)
					return $.ajax({
						url: P.dataSouceUrl + params.control,
						data: params.prm,
						xhrFields: {
							withCredentials: true
						},
						headers: P.ajaxHeaders,
					})
                    .done(function (result) {
                    	var mapped = $.map(result, function (item) {
                    		if (mapCallback)
                    			return mapCallback(item)
                    		else
                    			return item;
                    	});
                    });
				},
				lookup: function (key) {
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
					//                    return $.get(P.dataSouceUrl + params.control, params.prm);
					return $.ajax({
						type: "GET",
						url: P.dataSouceUrl + params.control,
						data: params.prm,
                        //crossDomain: true,
						xhrFields: {
							withCredentials: true
						},
						headers: P.ajaxHeaders,
						// beforeSend: function (xhrObj) {
							// xhrObj.setRequestHeader("Accept","application/json");
							// xhrObj.setRequestHeader("Authorization","Basic " + DevExpress.data.base64_encode([P.UserName, P.UserPassword].join(":")));
						// }
					});
				},
				map: function (item) {
					if (mapCallback)
						return mapCallback(item)
					else
						return item;
				},
			});
	}

	function execMethod(params, mapCallback) {
		return new DevExpress.data.DataSource({
			pageSize: P.pageSize,
			load: function (loadOptions) {
				return $.ajax({
						type: params.method,
						url: P.dataSouceUrl + params.control,
						data: params.prm,
						xhrFields: {
							withCredentials: true
						},
						headers: P.ajaxHeaders,
						success: function(result) {
                            BAsket.notify('Server reply: ' + result.Note);
						},
						error: function(result, arg) {
                            // BAsket.error(result.responseText);
                            BAsket.error(result.statusText + ': ' + result.status);
						},
					})
					.done(function(result) {
						var mapped = $.map(result, function(item) {
							if (mapCallback)
								return mapCallback(item);
							else
								return item;
						});
					});
			}
		});
	}

	return root;
})(jQuery, window);
