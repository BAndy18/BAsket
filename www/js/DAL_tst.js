/// *** Data Test *** ///
var DAL_tst = (function ($, window) {
    var root = {};

    var Categories_Data = 
    [   { id: 1, name: 'Beverages' },
        { id: 2, name: 'Fruit' }
    ];

    var Products_Data = 
    [ 
        { id: 1, grId: 1, name: 'Wiskey' },
        { id: 2, grId: 1, name: 'Cognac' },
        { id: 3, grId: 2, name: 'Banana' },
        { id: 4, grId: 2, name: 'Pineapple' }
    ];

    var Prod = [
    {"ID":"08231","GrID":"-1","Name":"","Art":"2108-1003020-10","Manuf":"","UrlPict":"","Upak":"0","Ostat":"0","Price":90.0000},{"ID":"32836","GrID":"-2","Name":"","Art":"","Manuf":"","UrlPict":"","Upak":"0","Ostat":"0","Price":0.0000},{"ID":"29487","GrID":"-2","Name":"87722-25000CA","Art":"87722-25000CA","Manuf":"","UrlPict":"","Upak":"0","Ostat":"0","Price":660.0000},{"ID":"00203","GrID":"-3","Name":"WD-40 100 мл","Art":"","Manuf":"","UrlPict":"http://нормаль.рф/upload/iblock/966/wd-40-br69235874.jpg","Upak":"1","Ostat":"1","Price":90.0000},{"ID":"00205","GrID":"-3","Name":"WD-40 200 мл","Art":"","Manuf":"","UrlPict":"http://нормаль.рф/upload/iblock/48f/88ce2608c2ed0fb4-main.jpg","Upak":"1","Ostat":"1","Price":106.5000},{"ID":"00207","GrID":"-3","Name":"WD-40 300 мл","Art":"","Manuf":"","UrlPict":"http://нормаль.рф/upload/iblock/4dc/wd-40-br69235874.jpg","Upak":"1","Ostat":"1","Price":150.0000},{"ID":"22212","GrID":"-3","Name":"WD-40 400 мл","Art":"","Manuf":"","UrlPict":"http://нормаль.рф/upload/iblock/138/3605_1.jpg","Upak":"1","Ostat":"1","Price":193.0000},{"ID":"00209","GrID":"-3","Name":"WD-40 420 мл","Art":"","Manuf":"","UrlPict":"http://нормаль.рф/upload/iblock/f88/content-6185_1.1283770011.jpg","Upak":"1","Ostat":"1","Price":210.0000}
    ];

    /// DAL Functions
    root.Categories_dataTest = function (params){
    	return Categories_Data;
    };
    root.Products_dataTest = function (params){
        var prod = [];
        Products_Data.forEach(function(p){
            if (p.grId == params.id)
                prod.push(p);
        });
    	return prod;
    };
    root.ProductDetails_dataTest = function (params){
    	params.model.name(Products_Data[params.id - 1].name)
    };

    return root;
})(jQuery, window);
