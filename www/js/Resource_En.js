var EN_US = (function (window) {
    var root = {};
    root.Language = 'English';
    root.getObj = function(obj){
    	var objValue = eval('root.' + obj);
    	if (objValue)
    		return objValue;
    	else {
    		return obj;
    	}
    }

    root.Common = {
    	Default : "Default",
    	Back: "Back",
    };

	root.Navigation = {
		Order : "New Order",
		OrderList : "Order List",
		RoadMap : "Road Map",
		Clients : "Clients",
		ReadNews : "Read News",
		Preferences : "Preferences",
		Info : "Info",
    };  

    root.Preferences = {
		Title : "Preferences",
        Main : "Main Preferences",
        Functions : "Functions",
        Admin : "Admin",
        Layout: 'Layout Style',
        MapProvider: "Map Provider",
        Language: "Language UI",

        Incorrect_password: "Incorrect password",
    };  

    root.Order = {
		Title: "Order", 
		Note: 'Note',
		NotePrompt: 'Comments, if any',
    	ColDate : 'Date',
    	ColName : 'Name',
    	ColNote : 'Note',
    	ColOther : 'Other',
    	ColWars : 'Wars',
    };

    root.Products = {
    	ColName : 'Name',
    	ColPack : 'Pack',
    	ColCount : 'Count',
    	ColPrice : 'Price',
    };

    return root;
})(window);


var RU_RU = (function (window) {
    var root = {};
    root.Language = 'Русский';

    root.Common = {
    	Default : "по умолчанию",
    	Back: "назад",
    	Save: 'Сохранить',
    	Select : 'Выбор',
    };

	root.Navigation = {
		Order : "Новый Заказ",
		OrderList : "Список Заказов",
		RoadMap : "Дорожная Карта",
		Clients : "Клиенты",
		ReadNews : "Чтение Данных",
		Preferences : "Параметры",
		Info : "Инфо",
    };  

    root.Preferences = {
		Title : "Настройка",
        Main : "Основные свойства",
        Functions : "Функции",
        Admin : "Админ",
        Layout: 'Стиль Устройства',
        MapProvider: "Поставщик Карт",
        Language: "Язык интерфейса",

        Incorrect_password: "Не правильный пароль",
    };  

	root.Order = {
		Title: "Заказ", 
		Products: "Товары",
		Date : 'Дата', 
		Client : 'Покупатель', 
		SelectClient : 'Выбор покупателя ',
		Point : 'Торговая точка',
		SelectPoint : 'Выбор точки ',
		SelectDop: 'Выбор типа параметра ',
		SelectParam: 'Выбор параметра ',
		Note: 'Примечания',
		NotePrompt: 'комментарии если есть',
    	ColDate : 'дата',
    	ColName : 'имя',
    	ColNote : 'примечание',
    	ColOther : 'Other',
    	ColWars : 'Wars',
    };

    root.Products = {
    	ColName : 'наименнование',
    	ColPack : 'упаковка',
    	ColCount : 'количество',
    	ColPrice : 'цена',
    };

    root.getObj = function(obj){
    	var objValue = eval('root.' + obj);
    	if (objValue)
    		return objValue;
    	else {
    		return obj;
    	}
    }    
    return root;
})(window);
