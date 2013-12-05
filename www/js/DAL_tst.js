/// *** Data Test *** ///

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

/// DAL Functions
function Categories_dataTest(params){
	return Categories_Data;
};
function Products_dataTest(params){
    var prod = [];
    Products_Data.forEach(function(p){
        if (p.grId == params.id)
            prod.push(p);
    });
	return prod;
};
function ProductDetails_dataTest(params){
	params.model.name(Products_Data[params.id - 1].name)
};
