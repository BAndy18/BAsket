var EN_US = (function (window) {
	var root = {};
	root.Language = 'English';
	root.getObj = function(obj) {
		var objValue = eval('root.' + obj);
		if (objValue)
			return objValue;
		else {
			return obj;
		}
	};

	root.Common = {
		Default: "Default",
		Back: "Back",
		NoDataText: "No data to display",
	};

	root.Navigation = {
		Order: "New Order",
		OrderList: "Order List",
		RoadMapList: "Road Map",
		Clients: "Clients",
		ReadNews: "Read News",
		Preferences: "Preferences",
		Info: "Info",
	};

	root.Preferences = {
		Title: "Preferences",
		Main: "Main Preferences",
		Functions: "Functions",
		Admin: "Admin",
		Layout: 'Layout Style',
		MapProvider: "Map Provider",
		Language: "Language UI",

		Incorrect_password: "Incorrect password",
	};

	root.Order = {
		Title: "Order",
		Note: 'Note',
		NotePrompt: 'Comments, if any',
		ColDate: 'Date',
		ColName: 'Name',
		ColNote: 'Note',
		ColOther: 'Other',
		ColWars: 'Wars',
	};

	root.Products = {
		ColName: 'Name',
		ColPack: 'Pack',
		ColCount: 'Count',
		ColPrice: 'Price',
	};

	return root;
})(window);


var RU_RU = (function (window) {
	var root = {};
	root.Language = 'Русский';

	root.Common = {
		Yes: "Да",
		No: "Нет",
		Cancel: 'Отменить',
		Default: "по умолчанию",
		Back: "назад",
		Save: 'Сохранить',
		Search: 'Поиск',
		Select: 'Выбор ...',
		Confirm: 'Подтвердите',
		Loading: 'Загружается ...',
		NoDataText: "Нет данных",
        EMailNotValid: "EMail не корректный",
		CurrentLocation: 'Текущее положение',
	};

	root.Navigation = {
		Order: "Новый Заказ",
		OrderList: "Заказы",
		RoadMapList: "Дорожная Карта",
		Clients: "Клиенты",
		ReadNews: "Новости",
		Preferences: "Настройка",
		Info: "Инфо",
	};

    root.ReadNews = {
        Title: "Обмен Новостями",
        LoadData: "Загрузка Данных", 
        SaveOrd: "Отправить Заказы", 
        LoadOst: "Обновить товарные остатки", 
        LoadSpr: "Обновить справочники", 
        RepoName: "Отчет", 
        SelectRepo: "Выбери Отчет", 
        SendRepo: "Отправить Отчет на EMail", 
        ChoiceRepo: "Отчет не выбран", 

        ReadRecs: 'Прочитано записей',
        WroteRecs: 'Запись закончилась ',
    };

	root.Preferences = {
		Title: "Настройка",
		Main: "Основные свойства",
		Functions: "Функции",
		Admin: "Админ",
		Layout: 'Стиль Интерфейса',
		MapProvider: "Поставщик Карт",
		Language: "Язык интерфейса",
		TableMode: "Табличный выбор товаров",
		UseWebDb: "Использовать Web Db",
        DebugMode: "Режим отладки",
        UserName: "Имя Пользователя",
        UserPassword: "Пароль на сервере",
		UserEMail: "EMail",

		Incorrect_password: "Не правильный пароль",
	};

	root.Order = {
		Title: "Заказ",
		Products: "Товары",
		Date: 'Дата',
		Client: 'Клиент',
		SelectClient: 'Выбор клиента ',
		Point: 'Торговая точка',
		SelectPoint: 'Выбор точки ',
		SelectDop: 'Выбор типа параметра ',
		SelectParam: 'Выбор параметра ',
		Note: 'Примечания',
		NotePrompt: 'комментарии если есть',
		ColDate: 'дата',
		ColName: 'имя клиента',
		ColTpName: 'точка',
		ColNote: 'примечание',
		ColOther: 'Other',
		ColWars: 'Wars',

        ActionDelete: 'Удалить заказ',
		ChangeActivity: 'Сменить активность',

		ErrNoWars: 'Не выбраны товары в заказе',
		ErrNoDate: 'Не установлена дата в заказе',
		ErrNoCli: 'Не выбран клиент в заказе',
	};

	root.Products = {
		Title1: 'Выбор товаров',
		Title2: 'Корзина',
		btnSwText1: 'корзина',
		btnSwText2: 'товары',
		TitleCat: 'Выбери категорию',
		ColName: 'наименование',
		ColPack: 'упаковка',
		ColCount: 'количество',
		ColPrice: 'цена',
		TitleDetails: 'количество товара',
		ErrQuantity: 'Введите число больше 0',
		FldQuantity: 'Количество:',
		FldName: 'Наименование:',
		FldPrice: 'Цена:',
		FldNameArt: 'Артикул:',
		FldNameManuf: 'Производитель:',
		FldUpak: 'Количество в упаковке:',
		FldOstat: 'Остаток:',
		FldUrlPict: 'картинка:',
		SelSum: 'выбрано: #; на сумму: ',
	};

	root.Clients = {
		Title: 'Клиент',
		RoutDetail: "Маршрут подробно",
	};

	root.RoadMap = {
		Title: 'Дорожная Карта',
		AddToTheMap: 'Добавить клиента',
		ShowOnTheMap: 'Показать на карте',
		OpenBil: 'Открыть Заказ',
		ActionDelete: 'Удалить клиента',
		MoveDown: 'Переместить вниз',
		MoveUp: 'Переместить вверх',
		ColNpp: '№',
		ColNBil: '№ з',
		ColCliName: 'имя клиента',
		ColTpName: 'точка',
		ColAdres: 'адрес',
	};

    root.Info = {
        Title:      "Информация", 
        IProducts:   "Список продуктов", 
        IProductDet: "Характеристики",
        IMap:        "Карта",
        IClient:     "Клиент", 
        IContacts:   "Наши Контакты", 
        'Order':        '<h1>Справка по экрану "Заказ"</h1> <p>Оформление Заказа производится на трех, связанных переходами, экранах:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product-Details">Характеристики товара</a></li> </ul> <p>Здесь нужно указать параметры "шапки" Заказа:</p> <ul> <li>Дата - дата предполагаемой отгрузки Заказа</li> <li>Клиент - выбор клиента, которому будет отгружет Заказ</li> <li>Торговая Точка - выбор торговой точки клиента, в которую будет отгружет Заказ. Если выбранный клиент не имеет торговых точек, это поле скрывается</li> <li>* Предприятие - выбор юридического лица, на которого будет оформлен Заказ</li> <li>* Тип Оплаты - выбор типа оплаты, для Заказа</li> <li>Примечания - любые примечания к Заказу</li> <li>Информация о том, сколько выбрано товаров в Заказ и на какую сумму</li> </ul> * параметры определяются конфигурацией программы и могут отсустствовать <p>При нажатии на кнопку "Сохранить", производится проверка правильности оформления Заказа, и, если все сделано правильно, Заказ сохраняется в <a href="#Info/OrderList">Списке Заказов</a> и производится переход на экран из которого пришли сюда</p> <p>Если проверка завершилась с ошибкой, внизу всплывает сообщение об ошибке. Список ошибочных ситуаций:</p> <ul> <li>Не выбраны товары в заказе</li> <li>Не установлена дата в заказе</li> <li>Не выбран клиент в заказе</li> </ul> <p>В первой строке на экране слева направо присутствуют:</p> <ul> <li>Кнопка "назад" - переход к предыдущему экрану</li> <li>Название экрана</li> <li>Кнопка "I" - вызывает этот экран справки</li> <li>Кнопка "Товары" - вызывает экран <a href="#Info/Products">Выбор товаров</a></li> </ul> ',
        'Products':     '<h1 class="center">Справка по Списку продуктов</h1><br/><p>нету пока )</p>',
        'Product-Details':      '<h1 class="center">Справка по Характеристики Продукта</h1><br/><p>нету пока )</p>',
        'OrderList':    '<h1 class="center">Справка по Списку Заказов</h1><br/><p>нету пока )</p>',
        'Clients':      '<h1 class="center">Справка по Списку клиентов</h1><br/><p>нету пока )</p>',
        'Client':       '<h1 class="center">Справка по Клиенту</h1><br/><p>нету пока )</p>',
        'RoadMap':      '<h1 class="center">Справка по Дорожной Карте</h1><br/><p>нету пока )</p>',
        'RoadMapList':  '<h1 class="center">Справка по Списку Дорожная Карта</h1><br/><p>нету пока )</p>',
        'Preferences':  '<h1 class="center">Справка по Настройке</h1><br/><p>нету пока )</p>',
        'ReadNews':    '<h1 class="center">Справка по Обновлению Новостей</h1><br/><p>нету пока )</p>',
        'Contacts':    '<h1 class="center">Наши Контакты</h1><br/><p>нету пока )</p>',
        'SysInfo':    '<h1 class="center">Системная информация</h1><br/>phone: <span data-bind="text: P.deviceInfo.phone"></span>'+
            'tablet : <span data-bind="text: P.deviceInfo.tablet "></span> '+
            'android  : <span data-bind="text: P.deviceInfo.android  "></span> '+
            'ios  : <span data-bind="text: P.deviceInfo.ios  "></span> '+
            'win8  : <span data-bind="text: P.deviceInfo.win8  "></span> '+
            'tizen  : <span data-bind="text: P.deviceInfo.tizen  "></span> '+
            '<br/>Platform  : <span data-bind="text: P.deviceInfo.platform  "></span> '+
            '<br/>'+
            '<br/>Screen Size: ' + screen.height + " x " + screen.width +
            '<br/>Agent: ' + navigator.userAgent +
            '<br/>Cookie Enabled: ' + navigator.cookieEnabled ,
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
