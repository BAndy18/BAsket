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
        SomethingWrong: 'Что-то пошло не так',
        ServerOper: 'Серверная Операция',
        ServerReply: 'Ответ Сервера: ',
	};

	root.Navigation = {
		Order: "Новый Заказ",
		OrderList: "Заказы",
		RoadMapList: "Дорожные Карты",
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
        LoadSpr: "Обновить справочники и карты", 
        RepoName: "Отчет", 
        SelectRepo: "Выбери Отчет", 
        SendRepo: "Отправить Отчет на EMail", 
        ChoiceRepo: "Отчет не выбран", 

        ReadRecs: 'Прочитано записей',
        WroteRecs: 'Запись ',
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
		// ColDate: 'дата',
		// ColName: 'имя клиента',
		// ColTpName: 'точка',
		// ColNote: 'примечание',
		// ColOther: 'Other',
		// ColWars: 'Wars',

        ActionDelete: 'Удалить заказ',
		ChangeActivity: 'Сменить активность',

		ErrNoWars: 'Не выбраны товары в заказе',
		ErrNoDate: 'Не установлена дата в заказе',
		ErrNoCli: 'Не выбран клиент в заказе',
        SwTitle1: 'Заказы на сервере',
        SwTitle2: 'Локальные заказы',
	};

	root.Products = {
		Title1: 'Выбор товаров',
		Title2: 'Корзина',
		btnSwText1: 'корзина',
		btnSwText2: 'товары',
		TitleCat: 'Выбери категорию',
		// ColName: 'наименование',
		// ColPack: 'упаковка',
		// ColCount: 'количество',
		// ColPrice: 'цена',
		TitleDetails: 'количество товара',
		ErrQuantity: 'Введите число больше 0',
		FldQuantity: 'Количество:',
		FldName: 'Наименование:',
		FldPrice: 'Цена:',
        FldOstat: 'Остаток:',
        // FldName1: 'Упаковка:',
		// FldName2: 'Производитель:',
        // FldName3: 'Артикул:',
        // FldName4: 'Картинка:',
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
		// ColNpp: '№',
		// ColNBil: '№ з',
		// ColCliName: 'имя клиента',
		// ColTpName: 'точка',
		// ColAdres: 'адрес',
	};

    root.Info = {
        Title:      "Информация", 
        IProducts:   "Список продуктов", 
        IProductDet: "Характеристики",
        IMap:        "Карта",
        IClient:     "Клиент", 
        IContacts:   "Наши Контакты", 
        'Home':     '<h1 class="center">Справка по BAsket</h1><br/><p>нету пока )</p>',
        'Order':        '<h1>Справка по экрану "Заказ"</h1> <p>Оформление Заказа производится на трех, связанных переходами, экранах:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product-Details">Характеристики товара</a></li> </ul> <p>На этом экране нужно указать параметры "шапки" Заказа:</p> <ul> <li>Дата - дата предполагаемой отгрузки Заказа;</li> <li>Клиент - выбор клиента, которому будет отгружен Заказ;</li> <li>Торговая Точка - выбор торговой точки клиента, в которую будет отгружен Заказ. Если выбранный клиент не имеет торговых точек, это поле скрывается;</li> <li>* Предприятие - выбор юридического лица, на которого будет оформлен Заказ;</li> <li>* Тип Оплаты - выбор типа оплаты для Заказа;</li> <li>Примечания - любые примечания к Заказу;</li> <li>Информация о том, сколько выбрано товаров в Заказ и на какую сумму.</li> </ul> * параметры определяются конфигурацией программы и могут отсутствовать <p>При нажатии на кнопку "Сохранить" производится проверка правильности оформления Заказа, и, если все сделано правильно, Заказ сохраняется в <a href="#Info/OrderList">Списке Заказов</a> и производится переход на экран, из которого пришли сюда.</p> <p>Если проверка завершилась с ошибкой, внизу всплывает сообщение об ошибке. Список ошибочных ситуаций:</p> <ul> <li>Не выбраны товары в Заказе;</li> <li>Не установлена дата в Заказе;</li> <li>Не выбран клиент в Заказе;</li> </ul> <p>Кнопка "Сохранить" может отсутствовать, если Заказ корректируется в состоянии "Только для чтения".</p> <p>В первой строке на экране слева направо присутствуют:</p> <ul> <li>Кнопка "назад" - переход к предыдущему экрану;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "Товары" - вызывает экран <a href="#Info/Products">Выбор товаров</a>.</li> </ul> ',
        'Products':     '<h1>Справка по экрану "Выбор товаров"</h1> <p>Выбор товаров - это второй из трех, связанных переходами, экранов для формирования Заказа:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product-Details">Характеристики товара</a></li> </ul> <p>Этот экран предназначен для выбора товаров в Заказ.</p> <p>Экран существует в двух видах: "Товар" и "Корзина".<br/> В первой строке на экране "Товар" слева направо присутствуют:</p> <ul> <li>Кнопка "назад" - переход к предыдущему экрану;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "Корзина" - меняет вид окна на содержимое Корзины, т.е. вызывает экран "Корзина".</li> </ul> <p>Соответственно в первой строке на экране "Корзина" слева направо присутствуют:</p> <ul> <li>Кнопка "назад" - переход к предыдущему экрану;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "Товар" - вызывает экран "Товар" с сохраненной фильтрацией товаров по категории.</li> </ul> <p>При нажатии на кнопку "Товар", расположенную в правом верхнем углу экрана, видим окно для поиска (фильтрации) товара по категориям. Нажатие на стрелку "вправо" в правом углу вызывает список категорий товаров, по которым можно сделать выбор категории. Кроме того, в строке поиска (текстовый блок "Поиск" в левом углу экрана) можно сделать дополнительную фильтрацию товара в уже выбранной категории. После такой фильтрации видим список товаров, из которых можно сформировать Заказ. <br/> При нажатии на конкретный товар мы попадаем на следующий экран - <a href="#Info/Product-Details">Характеристики товара</a>. </p> <p>Содержимое Корзины - это список товаров, уже набранных в конкретный Заказ, с указанием их количества. Первая строка списка содержит информацию об общем количестве выбранного товара и общей сумме Заказа.</p> ',
        'Product-Details':      '<h1>Справка по экрану "Характеристики товара"</h1> <p>Характеристики товара - это третий из трех, связанных переходами, экранов для формирования Заказа:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product-Details">Характеристики товара</a></li> </ul> <p>Именно здесь формируется наполнение Корзины.</p> <p>В первой строке на экране "Характеристики товара" слева направо присутствуют:</p> <ul> <li>Кнопка "назад" - переход к предыдущему экрану;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> <p>На экране представлена полная характеристика одного товара. Товар характеризуется следующими позициями:</p> <ul> <li>Количество: - можно установить или изменить количество данного товара, которое выбирается в Заказ (Корзину). Здесь же находится кнопка "Сохранить".</li> <li>Наименование:</li> <li>Цена:</li> <li>Количество в упаковке:</li> <li>Остаток:</li> <li>Артикул:</li> <li>Производитель: (если указан)</li> <li>Картинка (не всегда)</li> </ul> ',
        'OrderList':    '<h1 class="center">Справка по Списку Заказов</h1><br/><p>нету пока )</p>',
        'Clients':      '<h1 class="center">Справка по Списку клиентов</h1><br/><p>нету пока )</p>',
        'Client':       '<h1 class="center">Справка по Клиенту</h1><br/><p>нету пока )</p>',
        'RoadMap':      '<h1 class="center">Справка по Дорожным Картам</h1><br/><p>нету пока )</p>',
        'RoadMapList':  '<h1 class="center">Справка по Списку Дорожная Карта</h1><br/><p>нету пока )</p>',
        'Preferences':  '<h1 class="center">Справка по Настройке</h1><br/><p>нету пока )</p>',
        'ReadNews':    '<h1 class="center">Справка по Обновлению Новостей</h1><br/><p>нету пока )</p>',
        'Contacts':    '<h1 class="center">Наши Контакты</h1><br/><p>нету пока )</p>',
        'SysInfo':    '<h1 class="center">Системная информация</h1>CurrentDevice : ' +
            (DevExpress.devices.current().generic  ? ' =generic= ':'') + 
            (DevExpress.devices.current().phone  ? ' =phone= ':'') + 
            (DevExpress.devices.current().tablet  ? ' =tablet= ':'') + 
            (DevExpress.devices.current().android  ? ' =android= ':'') + 
            (DevExpress.devices.current().ios  ? ' =ios= ':'') + 
            (DevExpress.devices.current().tizen  ? ' =tizen= ':'') + 
            (DevExpress.devices.current().win8  ? ' =win8= ':'') + 
            '<br/>DeviceType  : ' + DevExpress.devices.current().deviceType +
            '<br/>Platform  : ' + DevExpress.devices.current().platform +
            '<br/>'+
            '<br/>Screen Size: ' + screen.height + " x " + screen.width +
            '<br/>Agent: ' + navigator.userAgent +
            '<br/>Cookie: ' + (navigator.cookieEnabled ? 'Enabled':'Disabled')
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
