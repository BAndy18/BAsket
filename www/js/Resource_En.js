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
    	NoDataText: "No data to display",
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
    	Yes : "Да",
    	No : "Нет",
    	Cancel: 'Отменить',
    	Default : "по умолчанию",
    	Back: "назад",
    	Save: 'Сохранить',
    	Search: 'Поиск',
    	Select : 'Выбор ...',
    	Confirm: 'Подтвердите',
        Loading: 'Загружается ...',
    	NoDataText: "Нет данных",
        CurrentLocation: 'Текущее положение',
    };

	root.Navigation = {
		Order : "Новый Заказ",
		OrderList : "Заказы",
		RoadMap : "Дорожная Карта",
		Clients : "Клиенты",
		ReadNews : "Новости",
		Preferences : "Настройка",
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
        TableMode: "Табличный выбор товаров",
        DebugMode: "Режим отладки",

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
    	ColName : 'имя покупателя',
    	ColTpName : 'точка',
    	ColNote : 'примечание',
    	ColOther : 'Other',
    	ColWars : 'Wars',

    	ActionDelete : 'Удалить заказ',

    	ErrNoWars : 'Не выбраны товары в заказ',
    	ErrNoDate : 'Не установлена дата в заказе',
    	ErrNoCli : 'Не выбраны покупатель в заказе',
    };

    root.Products = {
    	Title1 : 'Выбор товаров',
    	Title2 : 'Корзина',
    	btnSwText1 : 'корзина',
    	btnSwText2 : 'товары',
    	TitleCat : 'Выбери категорию',
    	ColName : 'наименование',
    	ColPack : 'упаковка',
    	ColCount : 'количество',
    	ColPrice : 'цена',
    	TitleDetails: 'количество товара',
    	ErrQuantity : 'Введите число больше либо равно 0',
    	FldQuantity : 'Количество:',
    	FldName : 'Наименование:',
    	FldPrice : 'Цена:',
    	FldNameArt : 'Артикул:',
    	FldNameManuf : 'Производитель:',
    	FldUpak : 'Количество в упаковке:',
    	FldOstat : 'Остаток:',
    	FldUrlPict : 'картинка:',
    };

    root.Clients = {
        Title : 'Клиент',
        RoutDetail: "Маршрут подробно",
    };

    root.RoadMap = {
        Title : 'Дорожная Карта',
        AddToTheMap: 'Добавить в карту',
        ShowOnTheMap: 'Показать на карте',
        OpenBil: 'Открыть Заказ',
        ActionDelete : 'Удалить клиента',
        MoveDown: 'Переместить вниз',
        MoveUp: 'Переместить вверх',
    };

    // root.getObj = function(obj){
    // 	var objValue = eval('root.' + obj);
    // 	if (objValue)
    // 		return objValue;
    // 	else {
    // 		return obj;
    // 	}
    // }    
    return root;
})(window);
