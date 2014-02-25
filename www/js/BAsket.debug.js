BAsketVer = "2.0.0220.50";(function($, DX, undefined) {
    var translator = DX.translator,
        fx = DX.fx,
        VIEW_OFFSET = 40,
        NAVIGATION_MAX_WIDTH = 300,
        NAVIGATION_TOGGLE_DURATION = 400;
    DX.framework.html.SlideOutController = DX.framework.html.DefaultLayoutController.inherit({
        _getLayoutTemplateName: function() {
            return "slideout"
        },
        _createNavigation: function(navigationCommands) {
            var self = this;
            this.callBase(navigationCommands);
            this.$slideOut = $("<div/>").appendTo(this._$hiddenBag).dxSlideOut({menuItemTemplate: $("#slideOutMenuItemTemplate")}).dxCommandContainer({id: 'global-navigation'});
            this.slideOut = this.$slideOut.dxSlideOut("instance");
            var container = this.$slideOut.dxCommandContainer("instance");
            this._commandManager._arrangeCommandsToContainers(navigationCommands, [container]);
            this.$slideOut.find(".dx-slideout-item-container").append(this._$mainLayout)
        },
        _getRootElement: function() {
            return this.$slideOut
        },
        init: function(options) {
            this.callBase(options);
            this._navigationManager = options.navigationManager;
            this._navigatingHandler = $.proxy(this._onNavigating, this)
        },
        activate: function() {
            this.callBase.apply(this, arguments);
            this._navigationManager.navigating.add(this._navigatingHandler)
        },
        deactivate: function() {
            this.callBase.apply(this, arguments);
            this._navigationManager.navigating.remove(this._navigatingHandler)
        },
        _onNavigating: function(args) {
            var self = this;
            if (this.slideOut.option("menuVisible"))
                args.navigateWhen.push(this._toggleNavigation().done(function() {
                    self._disableTransitions = true
                }))
        },
        _onViewShown: function(viewInfo) {
            this._disableTransitions = false
        },
        _isPlaceholderEmpty: function(viewInfo) {
            var $markup = viewInfo.renderResult.$markup;
            var toolbar = $markup.find(".layout-toolbar").data("dxToolbar");
            var items = toolbar.option("items");
            var backCommands = $.grep(items, function(item) {
                    return (item.behavior === "back" || item.id === "back") && item.visible === true
                });
            return !backCommands.length
        },
        _onRenderComplete: function(viewInfo) {
            var self = this;
            self._initNavigation(viewInfo.renderResult.$markup);
            if (self._isPlaceholderEmpty(viewInfo))
                self._initNavigationButton(viewInfo.renderResult.$markup);
            var $content = viewInfo.renderResult.$markup.find(".layout-content"),
                $appbar = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom"),
                appbar = $appbar.data("dxToolbar");
            if (appbar) {
                self._refreshAppbarVisibility(appbar, $content);
                appbar.optionChanged.add(function(name, value) {
                    if (name === "items")
                        self._refreshAppbarVisibility(appbar, $content)
                })
            }
        },
        _refreshAppbarVisibility: function(appbar, $content) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            $content.toggleClass("has-toolbar-bottom", isAppbarNotEmpty);
            appbar.option("visible", isAppbarNotEmpty)
        },
        _initNavigationButton: function($markup) {
            var self = this,
                $toolbar = $markup.find(".layout-toolbar"),
                toolbar = $toolbar.data("dxToolbar");
            var showNavButton = function($markup, $navButtonItem) {
                    $navButtonItem = $navButtonItem || $toolbar.find(".nav-button-item");
                    $navButtonItem.show();
                    $navButtonItem.find(".nav-button").data("dxButton").option("clickAction", $.proxy(self._toggleNavigation, self, $markup))
                };
            showNavButton($markup);
            toolbar.option("itemRenderedAction", function(e) {
                var data = e.itemData,
                    $element = e.itemElement;
                if (data.template === "nav-button")
                    $.proxy(showNavButton, self, $markup)()
            });
            toolbar.repaint()
        },
        _initNavigation: function($markup) {
            this._isNavigationVisible = false
        },
        _toggleNavigation: function($markup) {
            return this.slideOut.toggleMenuVisibility()
        }
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "ios",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "android",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "tizen",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "win8",
        phone: true,
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "generic",
        controller: new DX.framework.html.SlideOutController
    })
})(jQuery, DevExpress);(function($, DX, undefined) {
    DX.framework.html.EmptyLayoutController = DX.framework.html.DefaultLayoutController.inherit({ctor: function(options) {
            options = options || {};
            options.layoutTemplateName = "empty";
            this.callBase(options)
        }});
    DX.framework.html.layoutControllers.push({
        navigationType: "empty",
        controller: new DX.framework.html.EmptyLayoutController
    })
})(jQuery, DevExpress);

//*** EN_US Module
var EN_US = (function (window) {
	var root = {};
	root.Language = 'English';
	// root.getObj = function(obj) {
	// 	var objValue = eval('root.' + obj);
	// 	if (objValue)
	// 		return objValue;
	// 	else {
	// 		return obj;
	// 	}
	// };

	root.Common = {
		Default: "Default",
		Back: "Back",
		NoDataText: "No data to display"
	};

	root.Navigation = {
		Order: "New Order",
		OrderList: "Order List",
		RoadMapList: "Road Map",
		Clients: "Clients",
		ReadNews: "Read News",
		Preferences: "Preferences",
		Info: "Info"
	};

	root.Preferences = {
		Title: "Preferences",
		Main: "Main Preferences",
		Functions: "Functions",
		Admin: "Admin",
		Layout: 'Layout Style',
		MapProvider: "Map Provider",
		Language: "Language UI",

		Incorrect_password: "Incorrect password"
	};

	root.Order = {
		Title: "Order",
		Note: 'Note',
		NotePrompt: 'Comments, if any',
		ColDate: 'Date',
		ColName: 'Name',
		ColNote: 'Note',
		ColOther: 'Other',
		ColWars: 'Wars'
	};

	root.Products = {
		ColName: 'Name',
		ColPack: 'Pack',
		ColCount: 'Count',
		ColPrice: 'Price'
	};

	return root;
})(window);

//*** RU_RU Module
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
        EMail: "BAndySoft" + "@" + "gmail" + "." + "com"
	};

	root.Navigation = {
		Order: "Новый Заказ",
		OrderList: "Заказы",
		RoadMapList: "Дорожные Карты",
		Clients: "Клиенты",
		ReadNews: "Новости",
		Preferences: "Настройка",
		Info: "Инфо"
	};

    root.ReadNews = {
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

        Title: "Обмен Новостями"
    };

	root.Preferences = {
		Main: "Основные свойства",
		Functions: "Пользователь",
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

		Title: "Настройка"
	};

	root.Order = {
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

        SwTitle1: 'Заказы на сервере',
        SwTitle2: 'Локальные заказы',
		ErrNoWars: 'Не выбраны товары в заказе',
		ErrNoDate: 'Не установлена дата в заказе',
		ErrNoCli: 'Не выбран клиент',

		Title: "Заказ"
	};

	root.Products = {
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

		Title1: 'Выбор товаров'
	};

	root.Clients = {
		RoutDetail: "Маршрут подробно",
		Title: 'Клиент'
	};

	root.RoadMap = {
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

		Title: 'Дорожная Карта'
	};

    root.Info = {
        IProducts:   "Список продуктов", 
        IProductDet: "Характеристики",
        IMap:        "Карта",
        IClient:     "Клиент", 
        IContacts:   "Наши Контакты", 
        'Home':     	'<h1>Справка по Домашнему экрану BAsket</h1> <p>BAsket - это программный комплекс для тогрового агента, который хочет формировать Заказы для Клиентов с использованием мобильных устройств (планшетов и коммуникаторов), то есть делать это быстро, эффективно и современно.</p> <p>Комплекс делится на локальнуя часть (BAsket, который Вы сейчас видите) и серверный модуль, отвечающий за передачу и хранение данных, а также за "общение" с учетной системой. Серверный модуль может быть настроен на учетную систему Вашего предприятия при помощи плагинов.</p> <p>BAsket может работать в двух основных режимах:</p> <ul> <li>Автономно - данные с сервера при чтении <a href="#Info/ReadNews">Новостей</a>, запоминаются в базе данных (Web Db) устройства, и в основном программа работает именно с локальными данными, </li> <li>Прямой доступ - все запросы поступают непосредственно на сервер и ответ сервера отображается сразу на Вашем экране</li> </ul> <p>Достоинства и недостатки этих двух режимов многочисленны, и мы приведем здесь только их часть.</p> <p>Автономный режим не требует постоянного доступа к Интернет, значительно "дешевле" по интернет трафику и скорость ответа системы уже полностью зависит от скорости работы Вашего мобильного устройства.</p> <p>Основное достоинство Прямого доступа - постоянно актуальные данные. Товарные остатки, а также списки Товаров и Клиентов на Вашем экране постоянно находятся в состоянии, максимально приближенном к Вашей учетной системе.</p> <p>Есть еще технические ограничения на использование Автономного режима. Устройства которые используют в качестве броузера Интернет Google Chrome (Android), Opera и Safari (iOs) смогут пользоваться Автономным режимом, остальным придется довольствоваться достоинствами Прямого доступа.</p> <p>Программой можно пользоваться и с обычного компьютера, но и в этом случае Автономный режим доступен только из Google Chrome.</p> <p>BAsket - это кроссплатформенное и кроссбраузерное приложение, написанное с использованием современной технологии Single-Page Application. Здесь использованы такие технологии как HTML5, CSS3, и JS-фреймворки PhoneJS, JQuery, Knockout. На самом деле - это сайт который может работать еще и как нативное приложение для мобильных устройств благодаря технологии PhoneGap.</p> <p>Естественно, что такое приложение на мобильном устройстве будет работать меленнее нативного. Но, во-первых производительность устройств растет очень быстро, а во-вторых возможность работать с одним продуктом на разных типах устройств сулит большую выгоду от использования.</p> <p>Хоть программа и анонсирована на поддержку коммуникаторов, мы все же советуем для реальной работы использовать планшеты. Размер экрана здесь имеет очень большое значение.</p> <p>Функционально BAsket содержит:</p> <ul> <li>Подготовку и корректироку <a href="#Info/Order">Заказов</a> для Клиентов</li> <li>Работа со <a href="#Info/OrderList">Списком Заказов</a></li> <li>Список <a href="#Info/RoadMapList">Дорожные карты</a> определяет маршрут движения торгового агента</li> <li>В <a href="#Info/Clients">Списке Клиентов</a> можно посмотреть маршрут от текущего положения до конкретной торговой точки</li> <li>В экране <a href="#Info/ReadNews">Новости</a> производится обмен информацией с сервером</li> <li><a href="#Info/Preferences">Настройка</a> системы кроме всего прочего позволит Вам "поиграться" со стилями интерфейса разных типов мобильных устройств</li> </ul> ',
        'Order':        '<h1>Справка по экрану "Заказ"</h1> <p>Оформление и корректировка Заказа производится на трех, связанных переходами, экранах:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product-Details">Количество товара</a></li> </ul> <p>На этом экране нужно указать параметры "шапки" Заказа:</p> <ul> <li>Дата - дата предполагаемой отгрузки Заказа;</li> <li>Клиент - выбор Клиента, которому будет отгружен Заказ;</li> <li>Торговая Точка - выбор торговой точки Клиента, в которую будет отгружен Заказ. Если выбранный Клиент не имеет торговых Точек, это поле скрывается;</li> <li>* Предприятие - выбор юридического лица, на которого будет оформлен Заказ;</li> <li>* Тип Оплаты - выбор типа оплаты для Заказа;</li> <li>Примечания - любые примечания к Заказу;</li> <li>Информация о том, сколько выбрано товаров в Заказ и на какую сумму.</li> </ul> * параметры определяются конфигурацией программы и могут отсутствовать. <p>При нажатии на кнопку "Сохранить" производится проверка правильности оформления Заказа, и, если все сделано правильно, Заказ сохраняется в <a href="#Info/OrderList">Списке Заказов</a> и производится переход на экран, из которого пришли сюда. Это может быть <a href="#Info/Home">Домаший экран</a>, <a href="#Info/OrderList">Список Заказов</a> или <a href="#Info/RoadMap">Дорожные Карты</a></p> <p>Если проверка завершилась с ошибкой, внизу всплывает сообщение об ошибке. Список ошибочных ситуаций:</p> <ul> <li>Не выбраны товары в Заказе;</li> <li>Не установлена дата в Заказе;</li> <li>Не выбран клиент в Заказе;</li> </ul> <p>Кнопка "Сохранить" может отсутствовать, если Заказ корректируется в состоянии "Только для чтения".</p> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "назад" - переход к предыдущему экрану;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "Товары" - переход на экран <a href="#Info/Products">Выбор товаров</a>.</li> </ul> ',
        'Products':     '<h1>Справка по экрану "Выбор товаров"</h1> <p>Выбор товаров - это второй из трех, связанных переходами, экранов для формирования Заказа:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product_Details">Количество товара</a></li> </ul> <p>Этот экран предназначен для выбора товаров в Заказ. Экран существует в двух режимах: "Выбор Товаров" и "Корзина".</p> <p>1) В режиме "Выбор Товаров" можно выбать товар в Заказ, нажав на элемент списка, сменить категорию Товаров и фильтровать Товары в рамках выбранной категории.</p> <p>В строке над списком Товаров слева, есть окно для поиска (фильтрации) списка Товаров, выбранной категории. Справа находится кнопка выбора карегории Товара. При ее нажатии всплывает список выбора категорий Товара. <p>В титульной строке слева направо находятся:</p> <ul> <li>Кнопка "назад" - переход к экрану <a href="#Info/Order">Заказ</a>;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "Корзина" - меняет режим экрана на "Корзина".</li> </ul> <p>2) В режиме "Корзина" можно просматривать и корректировать список выбранных в Заказ Товаров.</p> <p>Строка над списком Тораров содержит информацию о том, сколько выбрано товаров в Заказ и на какую сумму.</p> <p>В титульной строке слева направо находятся:</p> <ul> <li>Кнопка "назад" - переход к экрану <a href="#Info/Order">Заказ</a>;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "Товары" - меняет режим экрана на "Выбор товаров".</li> </ul> <p>В обоих режимах при нажатии на конкретный товар мы попадаем на следующий экран - <a href="#Info/Product-Details">Количество товара</a> для указания количества выбранного Товара в Заказ.</p> <p>Каждый элемент списка содержит:</p> <ul> <li>1-я строка - <b>[Количество в Заказе]</b> (отсутствует если Товар не выбран в Заказ)</li> <li>2-я строка - <b>[Наименование Товара]</b> </li> <li>3-я строка - <b>[Цена Товара]</b> ([Примечания]) </li> </ul> ',
        'Product_Details':      '<h1>Справка по экрану "Количество товара"</h1> <p>Количество Товара - это третий из трех, связанных переходами, экранов для формирования Заказа:</p> <ul> <li><a href="#Info/Order">Заказ</a></li> <li><a href="#Info/Products">Выбор товаров</a></li> <li><a href="#Info/Product-Details">Количество товара</a></li> </ul> <p>Именно здесь формируется наполнение Корзины.</p> <p>На экране представлена полная характеристика выбранного Товара. Характеристики Товара - это:</p> <ul> <li>Количество - здесь можно изменить количество Товара в Заказе (если 0, то выбранный Товар удаляется из Корзины). Здесь же находится кнопка "Сохранить", при нажатии на которую устанавливается выбранное Количество и происходит возврат на экран <a href="#Info/Products">Выбор товаров</a>.</li> <li>Наименование</li> <li>Цена</li> <li>Остаток</li> <li>* Упаковка</li> <li>* Производитель</li> <li>* Артикул</li> <li>* Картинка Товара</li> </ul> * параметры определяются конфигурацией программы и могут отсутствовать. <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "назад" - переход к экрану <a href="#Info/Products">Выбор товаров</a>;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'OrderList':    '<h1>Справка по экрану "Список Заказов"</h1> <p>Здесь показывается Список Заказов в двух режимах:</p> <ul> <li>Локальные Заказы - это заказы сохраненные в локальной базе данных устройства, для просмотра этого списка не требуется подключение к сети Интернет</li> <li>Заказы на сервере - это список сохраненных на сервере Заказов. Для просмотра требуется подключение к Интернет.</li> </ul> <p>Переключение между режимами производится кнопкой в правом верхнем углу экрана с одноименным меняющимся текстом.</p> <p>В этой же строке слева есть поле для поиска (фильтрации списка) Заказов по имени Клиента.</p> <p>При нажатии на строку списка Заказов происходит переход на экран <a href="#Info/Order">Заказ</a>. При этом можно корректировать Заказ как в локальной базе данных, так и на сервере. Это зависит от выбранного режима.</p> <p>При длительном (примерно 0.5 секунды) нажатии на строку списка снизу выпадает контекстное меню со следующими пунктами: <ul> <li>Удалить Заказ - Заказ удаляется в зависимости от режима, локально или на сервере. Для выполнения действия требуется подтвердить операцию удаления;</li> <li>Сменить активность - Действие активно только в режиме "Локальные Заказы" и переключает признак необходимости отправки выбранного Заказа на сервер из экрана <a href="#ReadNews/">Новости</a>. Неактивные (уже отправленные на сервер) Заказы располагаются внизу списка и отмечаются серым фоном;</li> <li>Отменить - закрывает контекстное меню</li> </ul> <p>Каждый элемент списка содержит:</p> <ul> <li>1-я строка - [Номер Заказа] - [Дата сокращенно] <b>[Имя клиента] - [Имя точки (если есть)]</b> [Адрес Доставки]</li> <li>2-я строка - <b>[Сумма Заказа]</b> ([Примечания])</li> </ul> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "меню" - вызов бокового меню BAsket;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'Clients':      '<h1>Справка по экрану "Список Клиентов"</h1> <p>Здесь показывается список Клиентов, на которых можно выписать Заказ</p> <p>Слева сверху имеется строка поиска (фильтрации списка)</p> <p>При нажатии на строку списка Клиентов происходит переход на экран <a href="#Info/Client">Клиент</a>. При этом можно посмотреть на карте местоположение Клиента и трассировку маршрута до адреса Клиента от текущего положения Вашего устройства.</p> <p>Каждый элемент списка содержит:</p> <ul> <li>1-я строка - <b>[Имя Клиента]</b></li> <li>2-я строка - [Адрес Клиента]</li> </ul> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "меню" - вызов бокового меню BAsket;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'Client':       '<h1>Справка по экрану "Клиент"</h1> <p>Здесь на карте показывается текущая точка (Ваше положение) и точка адреса Клиента. Надо иметь ввиду, что если адрес Клиента в системе сохранен не правильно, то и точка на карте может быть отмечена в самом неожиданном месте :)</p> <p>Правильным адресом считается наличие следующей инфомации через запятую:</p> <ul> <li>1-я Дом и улица;</li> <li>2-я Город;</li> <li>3-я Страна (обычно можно опустить);</li> <li>4-я Почтовый индекс;</li> </ul> <p>В строке над картой указывается имя и адрес Клиента</p> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "назад" - возврат к экрану <a href="#Info/Clients">Список Клиентов</a>;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> <li>Кнопка "=" - вызывает меню;</li> </ul> <p>Меню содержит пункты:</p> <ul> <li>Сохранить - ничего пока не делает :)</li> <li>Название экрана;</li> <li>Маршрут подробно - выводится окно с текстовой информацией от Google Map о расстоянии до точки Клиента, времени прохождения (на автомобиле) и подробно по пунктам предписания по передвижению до Клиента, аналогично информации с навигатора;</li> </ul> ',
        'RoadMapList':  '<h1>Справка по экрану "Дорожные Карты" на дату</h1> <p>Здесь показывается список Клиентов, включенных в Дорожную карту на установленную дату. Этим самым показывается маршрут движения торгового агента по Клиентам в определенный день.</p> <p>В строке над списком Клиентов слева направо: <ul> <li>Дата - меняет список Дорожной карты на дату;</li> <li>Кнопка "Добавить клиента" - вызывает диалог для поиска и добавления нового клиента в Дорожную карту на дату;</li> <li>Кнопка "Показать на карте" - переход на экран <a href="#Info/RoadMap">Дорожная Карта</a></li> </ul> <p>При нажатии на строку списка Клиентов происходит переход на экран <a href="#Info/Client">Клиент</a> для просмотра Клиента на карте.</p> <p>При длительном (примерно 0.5 секунды) нажатии на строку списка снизу выпадает контекстное меню со следующими пунктами: <ul> <li>Открыть Заказ - переход на экран <a href="#Info/Order">Заказ</a>. Если Заказ для текущего Клиента еще не создан, он создается, иначе Заказ открывается в режиме корректировки;</li> <li>Переместить вверх - текущий Клиент перемещается вверх по списку, корректируя маршрут движения по Дорожной карте;</li> <li>Переместить вниз - текущий Клиент перемещается вниз по списку;</li> <li>Удалить Клиента - текущий Клиент удаляется из Дорожной катры;</li> <li>Отменить - закрывает контекстное меню</li> </ul> <p>Каждый элемент списка содержит:</p> <ul> <li>1-я строка - [Порядковый номер Клиента в маршруте] [Номер Заказа (если уже создан)] <b>[Имя Клиента - Точка]</b></li> <li>2-я строка - ([Адрес доставки]) </li> </ul> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "меню" - вызов бокового меню BAsket;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'RoadMap':  	'<h1>Справка по экрану "Дорожная Карта"</h1> <p>Здесь на карте показывается маршрут движения торгового агента по Клиентам в определенный день. Маркерами на карте обозначены адреса Клиентов, включенных в текущую Дорожную карту</p> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "назад" - возврат к экрану <a href="#Info/RoadMapList">Дорожные Карты на дату</a>;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'ReadNews':     '<h1>Справка по экрану "Новости"</h1> <p>Здесь в режиме автономной работы можно отсылать сформированные Заказы на сервер и обновлять справочники.</p> <p>Если в экране <a href="#Info/Preferences">Настройка</a> выбрана работа без использования Web Db, будет показано сообщение "Нет данных".</p> <p>Иначе можно установить значение следующих переключателей:</p> <ul> <li>Отправить Заказы - если "ON", на сервер отправятся подготовленные Заказы, находящиеся в активном состоянии;</li> <li>Обновить товарные остатки - если "ON", с сервера прочитаются только остатки по Товарам;</li> <li>Обновить справочники и карты - если "ON", с сервера прочитаются все обновления по справочникам Товаров и Клиентов, а также новые (начиная с текущей даты и позднее) Дорожные карты;</li> </ul> При нажатии на кнопку "Загрузка Данных", начнется процесс обмена данными с сервером. <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "меню" - вызов бокового меню BAsket;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'Preferences':  '<h1>Справка по экрану "Настройка"</h1> <p>Здесь можно произвести некоторую настройку программы. Настройка имеет следующую структуру:</p> <ul> <li>Основные свойства:<br/><br/> <ul> <li>Стиль Интерфейса - вызывает список тем, которые можно использовать как основной стиль;</li> <li>Использовать Web Db - очень важный переключатель, определяющий будет использоваться автономный режим или нет;</li> <li>Табличный выбор товаров - переключатель режима работы на экране <a href="#Info/Products">Выбор товаров</a></li> </ul> </li> <li>Пользователь:<br/><br/> <ul> <li>Имя пользователя - имя, по которому сервер будет "узнавать" пользователя;</li> <li>Пароль на сервере - надо устанавливать если работа ведется не с мобильного устройства;</li> <li>EMail - адрес EMail пользователя (опцинально)</li> </ul> </li> <li>Админ - некоторые административные настройки программы, защищенные паролем </li> </ul> <p>В титульной строке на экране слева направо находятся:</p> <ul> <li>Кнопка "меню" - вызов бокового меню BAsket;</li> <li>Название экрана;</li> <li>Кнопка "I" - вызывает этот экран справки;</li> </ul> ',
        'Contacts':     '<h1>Наши Контакты</h1> <p>BAndy Soft - это небольшая компания, производящая компьютерные программы для бизнеса.</p> <p>Мы будем рады, если Вы отправите Ваши отзывы по программе BAsket на EMail <a href="mailto: ' + root.Common.EMail + '">' + root.Common.EMail + '</a></p> ',
        'SysInfo':  '<h1 class="center">Системная информация</h1>CurrentDevice : ' +
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
            '<br/>Cookie: ' + (navigator.cookieEnabled ? 'Enabled':'Disabled'),

        Title:      "Информация"
    };

	return root;
})(window);
var U = (function ($, window) {
	var root = {};

	/*
		* Date Format 1.2.3
		* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
		* MIT license
		*
		* Includes enhancements by Scott Trenda <scott.trenda.net>
		* and Kris Kowal <cixar.com/~kris.kowal/>
		*
		* Accepts a date, a mask, or a date and a mask.
		* Returns a formatted version of the given date.
		* The date defaults to the current date/time.
		* The mask defaults to dateFormat.masks.default.
		*/

	var dateFormat = function () {
		var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
            	val = String(val);
            	len = len || 2;
            	while (val.length < len) val = "0" + val;
            	return val;
            };

		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;

			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}

			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");

			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                	d: d,
                	dd: pad(d),
                	ddd: dF.i18n.dayNames[D],
                	dddd: dF.i18n.dayNames[D + 7],
                	m: m + 1,
                	mm: pad(m + 1),
                	mmm: dF.i18n.monthNames[m],
                	mmmm: dF.i18n.monthNames[m + 12],
                	yy: String(y).slice(2),
                	yyyy: y,
                	h: H % 12 || 12,
                	hh: pad(H % 12 || 12),
                	H: H,
                	HH: pad(H),
                	M: M,
                	MM: pad(M),
                	s: s,
                	ss: pad(s),
                	l: pad(L, 3),
                	L: pad(L > 99 ? Math.round(L / 10) : L),
                	t: H < 12 ? "a" : "p",
                	tt: H < 12 ? "am" : "pm",
                	T: H < 12 ? "A" : "P",
                	TT: H < 12 ? "AM" : "PM",
                	Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                	o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                	S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();

	// Some common format strings
	dateFormat.masks = {
		"default": "ddd mmm dd yyyy HH:MM:ss",
		shortDate: "m/d/yy",
		mediumDate: "mmm d, yyyy",
		longDate: "mmmm d, yyyy",
		fullDate: "dddd, mmmm d, yyyy",
		shortTime: "h:MM TT",
		mediumTime: "h:MM:ss TT",
		longTime: "h:MM:ss TT Z",
		isoDate: "yyyy-mm-dd",
		isoTime: "HH:MM:ss",
		isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

	// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};

	// For convenience...
	// root.Date.prototype.format = function (mask, utc) {
	//     return dateFormat(this, mask, utc);
	// };
	root.DateFormat = function (date, mask) {
		if (!mask)
			mask = 'dd-mm-yyyy';
		return dateFormat(date, mask);
	};

	return root;
})(jQuery, window);

var P = (function ($, window) {
	var root = {};

	root.navigation = [
            {
            	"id": "Home", "action": "#home", "heightRatio": 4, "widthRatio": 4, "icon": "home",
            	"title": "BAsket", "backcolor": "black"
            },
            {
            	"id": "Order", "action": "#Order", "heightRatio": 4, "widthRatio": 8, "icon": "cart",
            	"title": "NewOrder", "backcolor": "#FF981D"
            },
            {
            	"id": "OrderList", "action": "#OrderList", "heightRatio": 4, "widthRatio": 4, "icon": "favorites",
            	"title": "Order List", "backcolor": "#15992A"
            },
            {
            	"id": "RoadMapList", "action": "#RoadMapList", "heightRatio": 4, "widthRatio": 8, "icon": "map",
            	"title": "RoadMap", "backcolor": "#006AC1"
            },
            {
            	"id": "Clients", "action": "#Clients", "heightRatio": 4, "widthRatio": 8, "icon": "globe",
            	"title": "Clients", "backcolor": "#7200AC"
            },
            {
            	"id": "ReadNews", "action": "#ReadNews", "heightRatio": 4, "widthRatio": 4, "icon": "download",
            	"title": "ReadNews", "backcolor": "red"
            },
            {
            	"id": "Preferences", "action": "#Preferences", "heightRatio": 4, "widthRatio": 4, "icon": "preferences",
            	"title": "Preferences", "backcolor": "red"
            },
            {
            	"id": "Info", "action": "#Info", "heightRatio": 4, "widthRatio": 2, "icon": "info",
            	"title": "Info", "backcolor": "#7200AC"
            }
	];

	root.loadPanelVisible = ko.observable(false);
	function iniLocalStor(key, defval) {
		var vari = window.localStorage.getItem(key);
		if (!vari && defval) {
			vari = defval;
			window.localStorage.setItem(key, vari);
		}
		return vari;
	};
    root.getLocalStor = function(key, defval) {
        var ret = iniLocalStor(key, defval);
        if (ret == 'true') return true;
        if (ret == 'false') return false;
        return ret;
    }

	root.ChangeLookup = function(id, key) {
		var lookup = $(id).data("dxLookup");
		var value = lookup.option("value");
		window.localStorage.setItem(key, value);
		return value;
	};
	root.ChangeValue = function(key, value) {
		window.localStorage.setItem(key, value);
		return value;
	};

	var languageMap = {
		'English': EN_US,
		'Русский': RU_RU
	};
	function getValue(obj, key) {
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (i == key) {
				return obj[i];
			}
		}
	};

	root.ChangeLanguageUI = function() {
		if (root.languageUI == '-')
			_ = RU_RU;
		else
			_ = getValue(languageMap, root.languageUI);

		root.navigation.forEach(function(entry) {
			var nav = eval("_.Navigation." + entry.id);
			if (nav)
				entry.title = nav;
		});
	};

	root.LoadFile = function(filename, filetype) {
		if (filetype == "js") { //if filename is a external JavaScript file
			var fileref = document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		}
		else if (filetype == "css") { //if filename is an external CSS file
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if (typeof fileref != "undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	}

	root.geoCurrent = ko.observable("");
	root.getGeo = function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					root.geoCurrent(position.coords.latitude.toFixed(6) + ',' + position.coords.longitude.toFixed(6));
					///alert(root.geoCurrent);
				},
				function(msg) {
					root.geoCurrent(typeof msg == 'string' ? msg : "failed");
					//alert(root.geoCurrent);
				});
		}
	};
	root.getDistance = function(p1, p2) {
		var R = 6371; // km
		var dLat = ((p2[0]) - (p1[0])) * Math.PI / 180;
		var dLon = ((p2[1]) - (p1[1])) * Math.PI / 180;
		var lat1 = (p1[0]) * Math.PI / 180;
		var lat2 = (p2[0]) * Math.PI / 180;

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};
	root.geoBearing = function(p1, p2) {
		var dLon = (p2[1] - p1[1]) * Math.PI / 180;
		var y = Math.sin(dLon) * Math.cos(p2[0]);
		var x = Math.cos(p1[0]) * Math.sin(p2[0]) -
			Math.sin(p1[0]) * Math.cos(p2[0]) * Math.cos(dLon);
		var brng = Math.atan2(y, x) * 180 / Math.PI;
		return brng;
	};
	root.geoCoder = function(address) {
		var geocoder = new google.maps.Geocoder();
		var deferred = new $.Deferred();
		//var address = document.getElementById("gadres").value;
		geocoder.geocode({ 'address': address }, function(results, status) {
			var res = [];
			if (status == google.maps.GeocoderStatus.OK) {
				//map.setCenter(results[0].geometry.location);
				res = [
					results[0].geometry.location.lat().toFixed(6),
					results[0].geometry.location.lng().toFixed(6)
				];
			}
			deferred.resolve(res);
		});
		return deferred;
	};

	root.itemClick = function(e) {
		BAsket.app.navigate(e.itemData.action.substring(1), { direction: 'none', root: true });
	};
	root.itemIcon = function(icon) {
		return 'tileicon dx-icon-' + icon.toLowerCase();
	};
	root.itemCount = {
		'OrderList': iniLocalStor("OrderList", '0'),
		'RoadMapList': iniLocalStor("RoadMapList", ''),
		'Clients': iniLocalStor("Clients", ''),
		'ReadNews': iniLocalStor("ReadNews", '')
	};

    root.setQuantToWar = function(war) {
        for (var i in P.arrayBAsket) 
            if (P.arrayBAsket[i].Id == war.Id) {
                war.Quant = P.arrayBAsket[i].Quant;
                return war;
            }
        return war;
    };
    root.validateEmail = function(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

	root.getDeviceId = function() {
		var deviceId = '';
		if (window.device) {
			deviceId = window.device.uuid;
			root.bPhoneGap = true;
		}
		if (!deviceId)
			deviceId = iniLocalStor("userPassword", "-");

		//console.log('deviceId:' + deviceId);
		return deviceId;
	};

	//root.navAgent = navigator.userAgent;
	root.deviceInfo = DevExpress.devices.current();
	root.layout = "slideout";
	//root.layout = "navbar";
	//root.layout = "simple";
	//root.layout = "pivot";

	root.deviceClass = 'android';

	root.curCategoryId = 0;
	root.curCategoryName = '';
	root.curModeChoice = true;
	root.modeProdView = true;
	root.fromProducts = false;
	//root.currentNms = []
	root.arrayBAsket = [];
	root.arrayBAsketL = [];
	root.copyright = '';
	root.debugMode = false;
	root.useWebDb = true;
	root.bPhoneGap = false;
    root.maxSizeLocalDb = 5000000;

	root.arrCategory = [];
	root.arrNMS = [];

	root.dataSouceUrl = '';
	root.pageSize = 30;

	root.Init = function () {
		root.useWebDb = iniLocalStor("useWebDb", "true") == "true";
		// var e;
		// try {
		// 	if (!window.openDatabase)
		// 		root.useWebDb = false;
		// 	else {
		// 		var mydb = openDatabase("BAsketDB", "1.0", "BAsketDB", 5000000);
		// 	}
		// } catch (e) {
		// 	// Error handling code goes here. 
		// 	if (e == INVALID_STATE_ERR) {
		// 		// Version number mismatch. 
		// 		alert("Invalid database version.");
		// 	} else {
		// 		alert("Unknown error " + e + ".");
		// 	}
		// }
		//alert("Test openDatabase OK " + root.useWebDb);

        root.platformDevice = 'android';
		// root.platformDevice = 'win8';
		root.platformDevice = iniLocalStor("Platform", 'android');
		if (root.platformDevice == '-')
			root.platformDevice = root.deviceInfo.platform;

		root.deviceClass = {};
		root.deviceClass['platform'] = root.platformDevice;
		var pdArr = root.platformDevice.split(' ');
        // if (pdArr[0] == 'ios')
        //     root.LoadFile('css/dx.ios.default.css', 'css');
        if (pdArr[0] == 'generic')
            root.LoadFile('css/dx.generic.light.css', 'css');
		if (pdArr.length > 1) {
			root.deviceClass['platform'] = pdArr[0];
			if (pdArr[0] == 'ios' && pdArr[1] == 'v6')
				root.deviceClass['version'] = '6';
			else if (pdArr[1] == 'black') {
				if (pdArr[0] == 'android')
					root.LoadFile('css/dx.android.holo-dark.css', 'css');
				if (pdArr[0] == 'tizen')
					root.LoadFile('css/dx.tizen.black.css', 'css');
			}
		} else {
            if (pdArr[0] == 'tizen')
                root.LoadFile('css/dx.tizen.white.css', 'css');
        }

        root.dataSouceUrl = iniLocalStor("dataSouceUrl", "");
        root.adminPassword = iniLocalStor("adminPassword", "admin");
        root.modeProdView = iniLocalStor("modeProdView", "true") == "true";
        root.debugMode = iniLocalStor("debugMode", "true") == "true";

        root.mapProvider = iniLocalStor("MapProvider", "google");
        root.languageUI = '-';
        root.languageUI = iniLocalStor("LanguageUI", '-');
        root.ChangeLanguageUI();

        BAsket.navigation = P.navigation.slice(0);
        BAsket.navigation = BAsket.navigation.splice(1);

        root.UserName = iniLocalStor("userName", "-");
        if (root.UserName == '-') root.UserName = 'BAsket User';
        root.UserPassword = iniLocalStor("userPassword", "-");
        if (root.UserPassword == '-') root.UserPassword = root.getDeviceId();
        root.UserEMail = iniLocalStor("userEMail", "-");

        var auth = "Basic " + [root.UserName, root.UserPassword].join(":");
        // var auth = "Basic " + [root.UserName + ":" + root.UserPassword].join(":");
        auth = DevExpress.data.base64_encode(auth);
        // document.cookie = ".ASPXAUTH=" + auth;
        // document.cookie = ".ASPXAUTH=" + DevExpress.data.base64_encode(auth);
        document.cookie = ".BAsketAUTH=" + auth;
        sessionStorage['.BAsketAUTH'] = auth;
        root.ajaxHeaders = (root.bPhoneGap || !location.port) ? {
            'Authorization': auth
            // 'Cookie' : document.cookie
            // 'Access-Control-Allow-Origin': true,
            // 'Authorization' : getToken()
            // 'Authorization': "Basic " + DevExpress.data.base64_encode([P.UserName, P.UserPassword].join(":"))
        } : {};
        // root.ajaxHeaders = {};

        root.copyright = 'BAsket \u00A9 2014 BAndySoft. All rights reserved (' + root.deviceClass.platform + '; ver. ' + BAsketVer + ')';

		root.arrCategory = JSON.parse(iniLocalStor("categories", "{}"));
        if (!root.arrCategory.length) {
            // DevExpress.ui.dialog.confirm("Вы уверены?", "Первичная загрузка данных").done(function (dialogResult) {
            // if (dialogResult){
            DAL.ReadNews(true, true);
            // }
            // });
            return;
        }
		root.arrNMS[0] = JSON.parse(iniLocalStor("NMS0", '{}'));
		for (var i = 0; i < root.arrNMS[0].length; i++) {
        //for (var i in root.arrNMS[0]) {
			root.arrNMS[root.arrNMS[0][i].Id] = JSON.parse(iniLocalStor("NMS" + root.arrNMS[0][i].Id, ''));
		}
        if (root.arrCategory.length > 0){
    		root.curCategoryId = root.arrCategory[0].Id;
    		root.curCategoryName = root.arrCategory[0].N;
        }

		DAL.TableCount();

		var view = $("#idMainTileView").data("dxTileView");        //dxTileView("instance");
		if (view)
			view.repaint();
	};

	return root;
})(jQuery, window);


window.onerror = function (msg, url, line, column, errorObj) {
  // You can view the information in an alert to see things working
  // like so:
  var addlog = '';
  //addlog = (errorObj) ? "\n" + errorObj.stack : ' no addlog';
  var str = "Error: " + msg + "\nurl: " + url + "\nline #: " + line + "/" + column + addlog;
  alert(str);
  console.log(str);
  if (errorObj)
    console.log(errorObj.stack);
  return true;
};

//"use strict";
eval('"use strict";');
window.BAsket = {};

$(function() {
	// are we running in native app or in browser?
	window.isphone = document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1;

	if (window.isphone) {
		document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		onDeviceReady();
	}
});

function onDeviceReady() {
	//var db = window.indexedDB.open('FriendDB', 'My Friends!');
	P.Init();

	DevExpress.devices.current(P.deviceClass);
	// DevExpress.devices.current({platform: P.deviceClass, version: '6', deviceType: "tablet"});
	// DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform);
	BAsket.app = new DevExpress.framework.html.HtmlApplication({
		namespace: BAsket,
		navigationType: P.layout,
		navigation: P.navigation,
		navigateToRootViewMode: true,
		//        disableViewCache: true
    commandMapping: {
      'android-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] },
      'ios-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] },
      'tizen-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] },
      'generic-header-toolbar': { commands: [{id: 'cmdInfo', align: 'right'}] }
    }
	});
	//Globalize.culture = Globalize.culture["ru-RU"];
	//$.preferCulture("ru-RU");
	// BAsket.app.viewShown.add(onViewShown);
	BAsket.app.router.register(":view/:Id", { view: "home", Id: undefined });
	BAsket.app.navigate();
	//    BAsket.app.navigate('Index');  
};

//type: 'info'|'warning'|'error'|'success', default == "success"
BAsket.notify = function(message, type, time) {
	if (!type) type = "success";
	if (!time) time = 1000;
	DevExpress.ui.notify(message, type, time);
};

BAsket.error = function(message) {
	BAsket.notify(message, "error", 5000);
};


// BAsket.home = function() {
// 	var viewModel = {
// 		itemClick: function(e) {
// 			//debugger;
// 			var act = e.itemData.action.substring(1);
// 			BAsket.app.navigate(e.itemData.action.substring(1));
// 		}
// 	};
// 	return viewModel;
// };

var _ = EN_US;

﻿/// *** Web REST Data Access *** ///
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
            control = 'ProdStock';

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
            //data.Name = data.N;
            //data.Price = data.P;
            //data.Ostat = data.O;
			return data;
		});
	};
	root.ProductDetails = function(params) {
		execDataSource({ control: 'Products/' + params.Id }).load()
			.done(function(data) {
				var quant = '0';
                data[0] = P.setQuantToWar(data[0]);
				// for (var i in P.arrayBAsket) {
				// 	if (P.arrayBAsket[i].Id == data[0].Id) {
				// 		quant = P.arrayBAsket[i].Quant;
				// 	}
				// };
				params.model.Name(data[0].N);
				params.model.Price(data[0].P.toFixed(2));
				params.model.N1(data[0].N1);
				params.model.N2(data[0].N2);
				params.model.N3(data[0].N3);
				params.model.N4(data[0].N4);
				params.model.Ostat(data[0].O);
				params.model.Quant(data[0].Quant);
			});
	};
	root.ProductsByWars = function(params) {
		return execDataSource({ control: 'Products/', prm: { w: params }}, function (data) {
            return P.setQuantToWar(data);
        }).load();
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

	root.Bil = function(params) {
		return execDataSource({ control: 'Bil', paging: true, prm: {searchString: params.search}}, function (data) {
            data.Name = data.N1;
            data.Adres = data.N2;
            data.ShortDate = data.DateDoc.substring(0, 5);
            return data;
        });
	};
	root.BilById = function(params) {
		return execDataSource({ control: 'Bil/' + params });
	};
	root.SaveBil = function(params) {
        params['cmd'] = 'SaveBil';
		return execMethod({ method: 'POST', control: 'Bil/', prm: params }).load();
	};
	root.DeleteBil = function(params) {
        params['cmd'] = 'DelBil';
		return execMethod({ method: 'POST', control: 'Bil/', prm: params }).load();
	};

    root.SendRepo = function(params) {
        params['cmd'] = 'SendRepo';
        return execMethod({ method: 'POST', control: 'Bil/', prm: params }).load();
    };

    root.RoadMap = function (params, allGt) {
        var date = U.DateFormat(params, 'yyyy-mm-dd')
        prms = {'date': date};
        if (allGt)
            prms['allGt'] = true;
        
        return execDataSource({ control: 'RoadMap', paging: true, prm: prms}, function (data) {
            data.Name = data.N1;
            data.Adres = data.N2;
            return data;
        });
    }
    root.SaveRMBil = function (id, idb) {
        return execMethod({ method: 'POST', control: 'RoadMap/', prm: {'cmd': 'UpdIdB', 'Id':id, 'IdB':idb} }).load();
    }

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
                    if (loadOptions.searchValue)
                        params.prm['searchString'] = loadOptions.searchValue;
					// return $.get(P.dataSouceUrl + params.control, params.prm)
					return $.ajax({
						url: P.dataSouceUrl + params.control,
						data: params.prm,
						xhrFields: {
							withCredentials: true
						},
						headers: P.ajaxHeaders
					})
                    .done(function (result) {
                        if (!result)
                            return null;
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
						// beforeSend: function (xhrObj) {
							// xhrObj.setRequestHeader("Accept","application/json");
							// xhrObj.setRequestHeader("Authorization","Basic " + DevExpress.data.base64_encode([P.UserName, P.UserPassword].join(":")));
						// }
						headers: P.ajaxHeaders
					});
				},
				map: function (item) {
					if (mapCallback)
						return mapCallback(item)
					else
						return item;
				}
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
                            BAsket.notify(_.Common.ServerReply + result.Note);
						},
						error: function(result, arg) {
                            // BAsket.error(result.responseText);
                            BAsket.error(result.statusText + ': ' + result.status);
						}
					})
					.done(function(result) {
                        if (!result)
                            return null;
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
/// *** local Web Data Base Access *** ///
function SQLite(cfg) {
    if (typeof window.openDatabase === 'undefined') {
        return;
    }    
    function log(str) {
        if (!console)
          console.log(str);
    }
    // Default Handlers
    function nullDataHandler(results) { }
    function errorHandler(error) {
        log('Oops. ' + error.message + ' (Code ' + error.code + ')');
    }

    var config = cfg || {}, db;

    config.shortName = config.shortName || 'BAsketDB';
    config.version = config.version || '1.0';
    config.displayName = config.displayName || 'BAsketDB SQLite Database';
    config.maxSize = P.maxSizeLocalDb;
    config.defaultErrorHandler = config.defaultErrorHandler || errorHandler;
    config.defaultDataHandler = config.defaultDataHandler || nullDataHandler;

    db = openDatabase(config.shortName, config.version, config.displayName, config.maxSize);

    function execute(query, v, d, e) {
        var values = v || [],
          dH = d || config.defaultDataHandler,
          eH = e || config.defaultErrorHandler;

        if (!query || query === '') {
          return;
        }

        function err(t, error) {
            eH(error, query);
        }

        function data(t, result) {
            d(t, result, query);
        }

        db.transaction(
            function (transaction) {
                transaction.executeSql(query, values, data, err);
            }
        );
    }

    return {
        database: db,
        executeSql: function (q, p, data, error) {
            execute(q, p, data, error);
        },
        transaction: function (e, error, data) {
            db.transaction(e, error, data)
        }
    }  
}

var DAL = (function ($, window) {
	var root = {};

	var dbLastQ = '';
    // var dbParam = null;
	// var dbName = 'BAsketDB';
	// var dbSize = 5000000;

    var DB = SQLite();
    var waitPanelSwitch = {};

	root.Products = function(params, nopaging) {
		if (!P.useWebDb)
			return DAL_web.Products(params);
		var paging = !nopaging;
		return execDataSource({
			query: "SELECT * FROM WAR WHERE IdP='" + params.pId + "' and O>0",
			paging: paging,
			searchString: params.search
		}, function(data) {
			var bFound = false;
			for (var i in P.arrayBAsket) {
				if (P.arrayBAsket[i].Id == data.Id) {
					data.Quant = P.arrayBAsket[i].Quant;
					bFound = true;
				}
			}
			if (!bFound)
				data.Quant = '';
			return data;
		});
	};
	root.ProductDetails = function(params) {
		if (!P.useWebDb)
			return DAL_web.ProductDetails(params);

		dbLastQ = "SELECT * FROM WAR WHERE Id='" + params.Id + "'";
		DB.executeSql(dbLastQ, [], function(tx, results) {
        // execQuery(dbLastQ).done(function(results) {
			params.Quant = '0';
			params = P.setQuantToWar(params);
			if (results.rows.length > 0) {
				params.model.Name(results.rows.item(0).N),
				params.model.Price(results.rows.item(0).P.toFixed(2))
				params.model.N1(results.rows.item(0).N1),
				params.model.N2(results.rows.item(0).N2),
				params.model.N3(results.rows.item(0).N3),
				params.model.N4(results.rows.item(0).N4),
				params.model.Ostat(results.rows.item(0).O),
				params.model.Quant(params.Quant)
			}
        })
		// }, function(err, err2) { errorCB("*readProductDetail sql*", err, err2); }	);
	};
	root.ProductsByWars = function (params) {
		var ids = '';
		P.arrayBAsket = [];
		var w = params.split(';');
		for (var i in w) {
			var v = w[i].split(':');
			if (v[0]) {
				P.arrayBAsket.push({ 'Id': v[0], 'Quant': v[1] });
				ids += "'" + v[0] + "',";
			}
		}
		if (!P.useWebDb)
			return DAL_web.ProductsByWars(params);

		return execQuery("SELECT * FROM WAR WHERE Id in (" + ids.substring(0, ids.length - 1) + ")",
            function (data) {
            	return P.setQuantToWar(data);
            });
	};

	root.Clients = function (params) {
		if (!P.useWebDb)
			return DAL_web.Clients(params);

		var param = { query: "SELECT * FROM CLI Where IdP='0' or IdP=''", paging: true };
		if (params && params.search)
			param.searchString = params.search;

		return execDataSource(param);
	};
	root.ClientsPar = function(params) {
		if (!P.useWebDb)
			return DAL_web.ClientsPar(params);

		return execDataSource({ query: "SELECT * FROM CLI Where IdP='" + params + "'" });
	};
	root.ClientById = function(params) {
		if (!P.useWebDb)
			return DAL_web.ClientById(params);
		return execDataSource({
			query: "SELECT c.*, par.N as ParName, IFNULL(par.N || ' - ' || c.N, c.N) as N2 " +
				"FROM CLI c Left Join CLI par On c.IdP=par.Id Where c.Id='" + params + "'"
		});
	};


	root.Bil = function (params, toServer) {
		if (!P.useWebDb || toServer)
			return DAL_web.Bil(params);

		return execDataSource({paging: true, searchString: params.search, searchReg: " and (c.N LIKE '%@%')",
			query: "SELECT b.*, c.N as N1, t.N as N2, substr(b.DateDoc,1,5) as ShortDate, " +
				"IFNULL(c.N || ' - ' || t.N, c.N) as Name, IFNULL(t.A, c.A) as Adres " +
				"FROM Bil b Join CLI c On b.IdC=c.Id Left Join CLI t On b.IdT=t.Id Where 1=1 # Order by bSusp, Id desc"
		});
	};
	root.BilById = function (params, toServer) {
		if (!P.useWebDb || toServer)
			return DAL_web.BilById(params);

		return execDataSource({ query: "SELECT b.*, c.N as N1, t.N as N2 FROM Bil b Join CLI c On b.IdC=c.Id Left Join CLI t On b.IdT=t.Id " +
            "WHERE b.Id='" + params + "'" });
	};

	root.SaveBil = function(params, toServer) {
		if (!P.useWebDb || toServer)
			return DAL_web.SaveBil(params);

		var query = "";
		if (!params['sOther']) params['sOther'] = '';
		if (!params['sNote']) params['sNote'] = '';
		if (!params['sWars']) params['sWars'] = '';
        if (!params['sumDoc']) params['sumDoc'] = '';
		if (params['id']) {
			query = "UPDATE Bil set DateDoc='" + params['date'] + "', IdC='" + params['IdC'] + "', IdT='" + params['IdT'] +
				"', SumDoc='" + params['sumDoc'] + "', Note='" + params['sNote'] + "', P1='" + params['sOther'] +
				"', Wars='" + params['sWars'] +
				"' WHERE Id='" + params['id'] + "'";
		} else {
			query = "INSERT INTO Bil (DateDoc, IdC, IdT, SumDoc, Note, P1, Wars, bSusp) VALUES('" + params['date'] +
				"', '" + params['IdC'] + "','" + params['IdT'] + "','" + params['sumDoc'] + "','" + params['sNote'] +
				"', '" + params['sOther'] + "', '" + params['sWars'] + "', 0)";
		};
		return execQuery(query);
	};
    root.ChangeActivityBil = function (params) {
        return execQuery("UPDATE Bil set bSusp = 1-bSusp WHERE Id=" + params)
    }
	root.DeleteBil = function (params, toServer) {
		if (!P.useWebDb || toServer) 
            return DAL_web.DeleteBil(params);

		return execQuery("DELETE FROM Bil Where Id='" + params['id'] + "'");
	};

    root.SendBils = function(){
        if (!P.useWebDb) 
            return;
        execQuery("SELECT * FROM Bil WHERE bSusp=0").done(function(result) {
            var prm = {};
            for (var i in result) {
                prm['id'] = result[i].IdServ;
                prm['IdLoc'] = result[i].Id;
                prm['IdC'] = result[i].IdC;
                prm['IdT'] = result[i].IdT;
                prm['date'] = result[i].DateDoc;
                prm['sNote'] = result[i].Note;
                prm['sWars'] = result[i].Wars;
                prm['sOther'] = result[i].Other;
                prm['sumDoc'] = result[i].SumDoc;
                // prm['idServ'] = result[i].IdServ;
                DAL_web.SaveBil(prm).done(function(res) {
                    var cmd = "UPDATE Bil set bSusp=1";
                    if (res[0].Note.length > 0){
                        cmd += ", ServRet='" + res[0].Note + "'"
                        var idServ = res[0].Note.split(' ')[0];
                        if (idServ.length > 0)
                            cmd += ", IdServ='" + idServ + "'";
                    }
                    cmd += " WHERE Id=" + res[0].LocNum;    //result[i].Id;
                    execQuery(cmd);
                        //"UPDATE Bil set bSusp=1, ServRet='" + res[0].Note + "', IdServ='" + servId + "' WHERE Id=" + result[i].Id);
                })
            }
        })
    }


    root.RoadMap = function (params) {
        if (!P.useWebDb) 
            return DAL_web.RoadMap(params);
        var date = U.DateFormat(params, 'yyyy-mm-dd');
        return execDataSource({
            query: "SELECT r.*, c.N as N1, t.N as N2, " +
                "IFNULL(t.N || ' - ' || c.N, c.N) as Name, " +
                "IFNULL(t.A, c.A) as Adres, IFNULL(t.Id, c.Id) as N3 " +
                "FROM RMAP r Join CLI c On r.IdC=c.Id Left Join CLI t On r.IdT=t.Id " +
                "Where DateDoc='" + date + "' Order by Npp"
        });
       //CREATE TABLE RMAP (Id, DateRM, Npp, IdB, IdC, IdT, Note, P1, DateSync, ServRet, bSusp)',

    };
    root.SwapRmap = function (i1, n1, i2, n2, callback) {
        execQuery('UPDATE RMAP set Npp=' + n1 + ' Where Id=' + i1).done(function () {
            execQuery('UPDATE RMAP set Npp=' + n2 + ' Where Id=' + i2).done(function () {
                callback();
            })
        });
    };
    root.DeleteRMap = function (params) {
        return execQuery("DELETE FROM RMAP Where Id='" + params + "'");
    };
    root.SaveRMBil = function (id, idb) {
        if (!P.useWebDb) 
            return DAL_web.SaveRMBil(id, idb);
        return execQuery("UPDATE RMAP set IdB=" + idb + " Where Id=" + id);
    };
    root.AddCliRMap = function(prm, callback) {
        execQuery("INSERT INTO RMAP (DateDoc, Npp, IdC, IdT) VALUES('" + prm['date'] + "'," + prm['Npp'] + ",'"
                + prm['IdC'] + "','" + prm['IdT'] + "')")
            .done(function() { callback(); })
    };


	root.CountTable = function (params) {
		if (!P.useWebDb)
			return null;
		return execQuery("SELECT count(Id) as cnt FROM " + params);
	};
	root.TableCount = function(params) {
		if (!P.useWebDb)
			return null;

		DAL.CountTable('Bil').done(function(result) {
			P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
		});
		DAL.CountTable('CLI').done(function(result) {
			P.itemCount['Clients'] = P.ChangeValue('Clients', result[0].cnt);
		});

		DAL.CountTable('RMAP').done(function(result) {
			var date = new Date();
			var datestr = date.getDate() + '.' + (date.getMonth() + 1);
			P.itemCount['RoadMapList'] = P.ChangeValue('RoadMapList', datestr + ' (' + result[0].cnt + ')');
		});
	};

    var modeReadNews;
	root.ReadNews = function (fullNews, createDB) {
		P.loadPanelVisible(true);
        waitPanelSwitch = {NMS: true, CAT: true, WAR: true, CLI: true, MAP: true};
        
		// var source0 = DAL_web.NMS();
		// if (Object.prototype.toString.call(source0) == '[object Array]') writeToLocalData(source0, 'NMS');
		// else source0.load().done(function (result) { writeToLocalData(result, 'NMS'); });

        DAL_web.NMS().load().done(function (result) { writeToLocalData(result, 'NMS'); });
        DAL_web.Categories().load().done(function (result) { writeToLocalData(result, 'CAT'); });

        var date = new Date();
        P.itemCount['ReadNews'] = P.ChangeValue('ReadNews', date.getDate() + '.' + (date.getMonth() + 1));

		if (!P.useWebDb) {
			//P.loadPanelVisible(false);
            waitPanelSwitch.WAR = waitPanelSwitch.CLI = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
			return;
		}

        if (createDB)
		    root.RecreateLocalDB();

        modeReadNews = fullNews ? 'all':'ost';
		DAL_web.Products({ pId: modeReadNews }).load().done(function (result) { writeToLocalData(result, 'WAR'); });

        if (fullNews){
            DAL_web.Clients({ pId: 'all' }).load().done(function (result) { writeToLocalData(result, 'CLI'); });
            DAL_web.RoadMap(new Date(), true).load().done(function (result) { writeToLocalData(result, 'MAP'); });
        }
        else {
            waitPanelSwitch.CLI = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
        }
		P.itemCount['OrderList'] = P.ChangeValue('OrderList', 0);
		P.itemCount['RoadMapList'] = P.ChangeValue('RoadMapList', 0);

        if (P.arrCategory.length > 0) 
            P.Init();
        else
            BAsket.notify(_.Common.SomethingWrong, "error");
	};

	root.RecreateLocalDB = function () {
        trace('Local DB SCRIPT');
		DB.transaction(function(tx) {
			for (i = 0; i < LocalScript.length; i++) {
				tx.executeSql(LocalScript[i], [], function(tx, results) {},
					function(err, err2) { errorCB("*RecreateLocalDB*", err, err2); }
				);
			}
		});
	};

	function execDataSource(params, mapCallback) {
		var dataSource = new DevExpress.data.DataSource({
			pageSize: (params.paging) ? P.pageSize : P.maxSizeLocalDb,
			load: function (loadOptions) {
				//params.paging = false;
				if (params.paging) {
					params['skip'] = loadOptions.skip;
					params['take'] = loadOptions.take;
				}
				if (loadOptions.searchExpr && loadOptions.searchValue)
					params['searchValue'] = loadOptions.searchValue;
				else
					params['searchValue'] = null;
                var deferred = new $.Deferred();
				// var db = window.openDatabase(dbName, "1.0", dbName, P.maxSizeLocalDb);
				// db.transaction(function (tx) {
					dbLastQ = params.query;
					var searchValue = '';
					if (params.searchString && params.searchString())
						searchValue = params.searchString();
					else if (params['searchValue'])
						searchValue = params['searchValue'];
					if (searchValue) {
                        var sr = " and (N LIKE '%" + searchValue + "%')";
                        if (params.searchReg) sr = params.searchReg.replace("@", searchValue);
						dbLastQ = dbLastQ.indexOf('#') > 0 ? dbLastQ.replace("#", sr) : dbLastQ + sr;
                    }
                    dbLastQ = dbLastQ.replace("#","");

					if (params.paging)
						dbLastQ += " LIMIT " + params['skip'] + ", " + params['take'];

					DB.executeSql(dbLastQ, [], function (tx, results) {
						var res = [];
						for (var i = 0; i < results.rows.length; i++) {
							var resrow = results.rows.item(i);
							if (mapCallback)
								resrow = mapCallback(resrow);
							res.push(resrow);
						}
						deferred.resolve(res);
					}, function (err, err2) { errorCB("*execDataSource sql*", err, err2); }
                    );
				// }, function (err, err2) { errorCB("*execDataSource*", err, err2); });
				return deferred;
			},
			lookup: function (key) {
				return 'lookup';
			}
		});
		return dataSource;
	};

	function execQuery(query, mapCallback) {
		var skip = 0;
		var PAGE_SIZE = 30;
        var deferred = new $.Deferred();
		// var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
		// db.transaction(function (tx) {
			dbLastQ = query;
			DB.executeSql(dbLastQ, [], function (tx, results) {
				if (dbLastQ.toUpperCase().substring(0, 7) == 'INSERT ') {
					//if (results.insertId) {
					deferred.resolve(results);
					return;
				}
				var res = [];
				for (var i = 0; i < results.rows.length; i++) {
					var resrow = results.rows.item(i);
					if (mapCallback)
						resrow = mapCallback(resrow);
					res.push(resrow);
				}
				deferred.resolve(res);
			}, function (err, err2) {
				// if (tryExist && err2.message && err2.message.indexOf('1 no such table:') > 0){
				//     root.RecreateLocalDB();
				// }
				// else
				errorCB("*execQuery sql*", err, err2);
			}
            );
		// }, function (err, err2) { errorCB("*execQuery*", err, err2); }        );
		return deferred;
	};

   // execute a query and fetches the data as an array of objects
    function executeQuery(tx, query, args, callback, callbackparams) {
        //var self = this;
        //console.log('db execute: '+query);
        // db.transaction(function(tx) {
            tx.executeSql(query, args, function(tx, result) {
                var retval = [];
                for (var i = 0; i < result.rows.length; ++i) {
                    retval.push(result.rows.item(i));
                }
                if (callback) {
                    callback(tx, retval, result, callbackparams);
                }
            }, 
            function (err, err2) { errorCB("*executeQuery*", err, err2); });
            //self.error);
        // });
    }


    function CheckWaitPanelSwitch(){
        for (var i in waitPanelSwitch)
            if (waitPanelSwitch[i]){
                return false;
            }
        return true;
    }
	var arrWAR, arrCLI, arrMAP;
	function writeToLocalData(dataArray, table) {

		if (table == 'NMS') {
			P.arrNMS = [];
			for (var i = 0 in dataArray) {
				var j = dataArray[i].IdP;
				if (!P.arrNMS[j]) P.arrNMS[j] = [];
				P.arrNMS[j].push(dataArray[i]);
				P.ChangeValue('NMS' + j, JSON.stringify(P.arrNMS[j]));
			}
            
            waitPanelSwitch.NMS = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
		}
		if (table == 'CAT') {
            if (!dataArray.length)
                dataArray = [{"Id":"0", "Name":"-"}]
			var localData = JSON.stringify(dataArray);
			P.arrCategory = JSON.parse(P.ChangeValue('categories', localData));
            
            waitPanelSwitch.CAT = false;
            if (CheckWaitPanelSwitch())
                P.loadPanelVisible(false);
		}

		if (table == 'WAR') {
			arrWAR = dataArray;
            DB.transaction(function (tx) {
                dbLastQ = 'Update WAR set O=0';
                tx.executeSql(dbLastQ, [], function (tx, results) {
                    DB.transaction(writeToWAR,
                        function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                        function () { trace(_.ReadNews.WroteRecs + table + ": success");        
                            waitPanelSwitch.WAR = false;
                            if (CheckWaitPanelSwitch())
                                P.loadPanelVisible(false);
                        });
                }, function (err, err2) {errorCB("*writeToWAR-ost sql*", err, err2)});
            });
		}
		if (table == 'CLI') {
            arrCLI = dataArray;
            // writeToCLI();
            DB.transaction(writeToCLI,
                function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                function () { trace(_.ReadNews.WroteRecs + table + ": success");        
                    waitPanelSwitch.CLI = false;
                    if (CheckWaitPanelSwitch())
                        P.loadPanelVisible(false);
                });
        }
        if (table == 'MAP') {
            arrMAP = dataArray;
            DB.transaction(writeToMAP,
                function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                function () { trace(_.ReadNews.WroteRecs + table + ": success");        
                    waitPanelSwitch.MAP = false;
                    if (CheckWaitPanelSwitch())
                        P.loadPanelVisible(false);
                });
        }
	};
    
 	function writeToWAR(tx) {
		P.loadPanelVisible(true);
		var arr = arrWAR;
		var i, maxlen = 47;
		var len = arr.length; //    < maxlen? arr.length:maxlen;
		//console.log('writeWars: writing=' + len);
		for (i = 0; i < len; i++) {
            dbLastQ = "Select Id From WAR Where Id='" + arr[i].Id + "'";
            //tx.executeSql(dbLastQ, [], function (tx, results) {
            executeQuery(tx, dbLastQ, [], function (tx, retval, results, item) {
                if (modeReadNews == 'ost' && results.rows.length)
                    dbLastQ = "UPDATE WAR set O='" + item.O + "' WHERE Id='" + item.Id + "'";
                else {
                    item.N1 = (item.N1) ? item.N1 : '';
                    item.N2 = (item.N2) ? item.N2 : '';
                    item.N3 = (item.N3) ? item.N3 : '';
                    item.N = item.N.replace(/'/g, "''");
                    item.N1 = item.N1.replace(/'/g, "''");
                    item.N2 = item.N2.replace(/'/g, "''");
                    item.N3 = item.N3.replace(/'/g, "''");
                    item.N4 = item.N4.replace(/'/g, "''");
                    if (results.rows.length)
                        dbLastQ = "UPDATE WAR set IdP='" + item.IdP + "', N='" + item.N + "', N1='" + item.N1 + 
                            "', N2='" + item.N2 + "', N3='" + item.N3 + "', N4='" + item.N4 + 
                            "', P='" + item.P + "', O='" + item.O + 
                            "' WHERE Id='" + item.Id + "'";
                    else
                        dbLastQ = "INSERT INTO WAR (Id, IdP, N, P, N1, N2, N3, N4, O) VALUES('"
                            + item.Id + "','" + item.IdP + "','" + item.N + "','" + item.P + "','"
                            + item.N1 + "','" + item.N2 + "','" + item.N3 + "','" + item.N4 + "','" + item.O
                            + "')";
                    }
                tx.executeSql(dbLastQ, [], function (tx, results) { },
                    function (err, err2) { errorCB("*writeToWAR sql*", err, err2); }
                );
            }, arr[i]);
            //}, function (err, err2) {errorCB("*writeToWAR-rd sql*", err, err2)});
		}
		trace(_.ReadNews.ReadRecs + ' WAR: ' + i);
		// P.loadPanelVisible(false);
	};

	function writeToCLI(tx) {
		P.loadPanelVisible(true);
		var arr = arrCLI;
		var i, maxlen = 50000;
		//tx.executeSql("BEGIN TRANSACTION");
		var len = arr.length;   // < maxlen? arr.length:maxlen;
		//console.log('writeWars: writing=' + len);
		for (i = 0; i < arr.length; i++) {
            dbLastQ = "Select Id From CLI Where Id='" + arr[i].Id + "'";
            // tx.executeSql(dbLastQ, [], function (tx, results) {
            //var item = arr[i]
            executeQuery(tx, dbLastQ, [], function (tx, retval, results, item) {
                item.IdP = (item.IdP == null || item.IdP == 'null') ? '0' : item.IdP;
                item.N = item.N.replace(/'/g, "''");
                item.A = item.A.replace(/'/g, "''");
                if (results.rows.length)
                    dbLastQ = "UPDATE CLI set IdP='" + item.IdP + "', N='" + item.N + "', A='" + item.A + 
                        "' WHERE Id='" + item.Id + "'";
                else
                    dbLastQ = "INSERT INTO CLI (Id, IdP, N, A) VALUES('"
                        + item.Id + "','" + item.IdP + "','" + item.N + "','" + item.A +
                        "')";

    			tx.executeSql(dbLastQ, [], function (tx, results) { },
    				function (err, err2) { errorCB("*writeToCLI sql*", err, err2); }
                );
            }, arr[i]);
            // }, function (err, err2) {errorCB("*writeToCLI-rd sql*", err, err2)} );
		}
		//tx.executeSql("COMMIT TRANSACTION", errorCB);
		trace(_.ReadNews.ReadRecs + ' CLI: ' + i);
		P.itemCount['Clients'] = P.ChangeValue('Clients', i);
		// P.loadPanelVisible(false);
	};

    function writeToMAP(tx) {
        P.loadPanelVisible(true);
        var date = U.DateFormat(new Date(), 'yyyy-mm-dd');
        dbLastQ = "Delete From RMAP Where DateDoc>='" + date + "'";
        tx.executeSql(dbLastQ, [], function (tx, results) {
            var arr = arrMAP;
            var i, maxlen = 50000;
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            for (i = 0; i < arr.length; i++) {
                var item = arr[i];
                item.IdT = (item.IdT == null || item.IdT == 'null') ? '0' : item.IdT;
                date = U.DateFormat(item.D, 'yyyy-mm-dd');
                dbLastQ = "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, Note) VALUES('"
                    + item.D + "','" + + item.Npp + "','" + item.IdC + "','" + item.IdT + "','" + item.Note +
                    "')";

                tx.executeSql(dbLastQ, [], function (tx, results) { },
                    function (err, err2) { errorCB("*writeToMAP sql*", err, err2); }
                );
            }
            trace(_.ReadNews.ReadRecs + ' MAP: ' + i);
        }, function (err, err2) {errorCB("*writeToMAP-rd sql*", err, err2)} );
    };


	// Transaction error callback
	function errorCB(src, err, err2) {
		var message = (err) ? ((err.message) ? err.message : err2.message) : src;
		var code = (err) ? ((err.code || (err && err.code == 0)) ? err.code : err2.code) : "";
		trace(src + " SQLError: " + message + '(' + code + ') dbLastQ=' + dbLastQ);
		return false;
	};
	// Transaction success callback
	function successCB() {
		//var db = window.openDatabase("Database", "1.0", "Cordova Demo", dbSize);
		//db.transaction(queryDB, errorCB);
	};


	function successCB1() {
		//var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
		db.transaction(queryDB1, errorCB);
	};
	function queryDB1(tx) {
		var tab = dbParam['tab'];
		tx.executeSql('SELECT * FROM ' + tab, [], querySuccess1, errorCB);
	};
	function querySuccess1(tx, results) {
		var len = results.rows.length;
		console.log("CAT table: " + len + " rows found.");
		maxlen = 50;
		var len = len < maxlen ? len : maxlen;
		for (var i = 0; i < len; i++) {
			console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).name);
		}
	};
	function consoleOut(str) {
		var element = document.getElementById('consoleOut');
		if (element)
			element.innerHTML += str + '<br />';
	};
	function trace(str) {
		if (P.debugMode)
			consoleOut(str);

		console.log(str);
	};

	var LocalScript = [
        'DROP TABLE IF EXISTS WAR',
        'DROP TABLE IF EXISTS CLI',
        'DROP TABLE IF EXISTS Bil',
        'DROP TABLE IF EXISTS RMAP',
        'DROP TABLE IF EXISTS BILM',
        //'DROP TABLE IF EXISTS CAT',
        //'DROP TABLE IF EXISTS NMS',
        // 'CREATE TABLE IF NOT EXISTS NMS (IdRoot, Id, Name)',
        // 'CREATE TABLE IF NOT EXISTS CAT (Id unique, Name)',
        'CREATE TABLE IF NOT EXISTS WAR (Id unique, IdP, N, P DECIMAL(20,2), N1, N2, N3, N4, N5, O int, bSusp int)',
        'CREATE TABLE IF NOT EXISTS CLI (Id unique, IdP, N, A)',
        'CREATE TABLE IF NOT EXISTS Bil (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, IdC, IdT, NumDoc, SumDoc, Note, Wars, P1, P2, DateSync DateTime, ServRet, IdServ, bSusp int)',
        'CREATE TABLE IF NOT EXISTS RMAP (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, Npp int, IdB int, IdC, IdT, Note, DateSync DateTime, ServRet, bSusp int)',
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '1', 'Предприятие')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '1', 'Пупкин ЧП')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '2', 'Ступкин ООО')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '2', 'Тип Оплаты')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '1', 'наличные')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '2', 'безнал')",
        ''
	];

	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 1, '4422','4423','Note')",
	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 2, '4422','6473','Note2')",
	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 3, '4191','','Note3')",
	// "INSERT INTO Bil (DateDoc, IdC, IdT, sNote, sOther, sWars) VALUES('22.12.2013', '10','','Note', '1:2', '10:1;11:2')",
	// "INSERT INTO CLI (Id,  IdP, Name, Adres, GeoLoc) VALUES('10', '', 'Client10', 'Izhevsk KM/10', '56.844278,53.206272')",
	// "INSERT INTO CLI (Id,  IdP, Name, Adres, GeoLoc) VALUES('11', '10', 'FilOfClient10', 'Izhevsk2 KM/102222', '56.844278,53.206272')",

	return root;
})(jQuery, window);BAsket.Order = function (params) {
	var arrayTP = ko.observable([{ "Id": "", "Name": "" }]);
	var showTP = ko.observable(false);

	var dataVal = ko.observable(new Date());
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...');
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...');
	var noteVal = ko.observable('');
	var nmsNames = ko.observableArray([_.Common.Select, _.Common.Select]);
	var calcSum = ko.observable('');

	if (!P.fromProducts)
		P.arrayBAsket = [];

	if (params.Id) {
		DAL.BilById(params.Id, params.s).load().done(function (result) {
			if (!P.fromProducts && result[0].Wars) {
				DAL.ProductsByWars(result[0].Wars).done(function(result) {
					P.arrayBAsket = result;
					calcSum(Order_calcSum());
				});
			}
			var date = result[0].DateDoc;
			if (date.split(" ").length > 1)
				date = date.split(" ")[0];
			var dateParts = date.split(".");
			if (dateParts.length == 1)
				dateParts = date.split("-");
			//console.log('Order id=' + params.Id + ' date=' + dateParts);
			if (dateParts[0].length > 2)
				dataVal(new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]));
			else
				dataVal(new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]));

			var arr = nmsNames();
			var sOther = result[0].P1;
			if (sOther) {
				sOther = sOther.split(';');
				for (var i = 0; i < sOther.length; i++) {
					var sNms = sOther[i].split(':');
					if (sNms.length < 2) continue;
					var iNms = parseInt(sNms[0]);
					var setNms = $("#idNms" + iNms).data("dxSelectBox");
					if (setNms) {
						setNms.option().value = sNms[1];
						for (var ii = 0; ii < P.arrNMS[iNms].length; ii++)
							if (P.arrNMS[iNms][ii].Id == sNms[1]) {
								var val = P.arrNMS[iNms][ii].N;
								arr[iNms - 1] = val;
								break;
							}
					}
				}
				nmsNames(arr);
			}
			noteVal(result[0].Note);
			cliId(result[0].IdC);
			cliName(result[0].N1);
			tpId(result[0].IdT);
			var tName = result[0].N2 ? result[0].N2 : _.Order.SelectPoint + '...';
			tpName(tName);
			DAL.ClientsPar(result[0].IdC).load().done(function(result) {
				arrayTP(result);
				showTP(result.length > 0);
			});
		});
	}

	Order_clientChanged = function (arg) {
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
			value = lookupCli.option().value;	//("value");
		}

		if (value) {
			var self = this;
			self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...');
			DAL.ClientsPar(value).load().done(function(result) {
				self.arrayTP(result);
				self.showTP(result.length > 0);
			});
		}
	};

	Order_calcSum = function (mask) {
		if (mask)
			mask = mask.replace('-', '');
		else
			mask = _.Products.SelSum.replace('#', P.arrayBAsket.length);
		var sum = 0.0;
		for (var i in P.arrayBAsket) {
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].P;
		}
		return mask + sum.toFixed(2);
	};

	Order_btnSaveClicked = function () {
		//var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
		if (P.arrayBAsket.length == 0) {
			BAsket.notify(_.Order.ErrNoWars, "error");
			return;
		}
		var valueDate = $("#idDate").data("dxDateBox").option("value");
		if (!valueDate) {
			BAsket.notify(_.Order.ErrNoDate, "error");
			return;
		}
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
			return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");

		var prms = {};
		//var hash = location.hash.split('/');
		if (params.Id)
			prms['id'] = params.Id;
		//prms['date'] = valueDate.getDate() + '.' + (valueDate.getMonth()+1) + '.' + valueDate.getFullYear();
		prms['date'] = U.DateFormat(valueDate);
		//console.log('Order save date=' + dataVal());
		//console.log('Order save datetoLocaleString=' + prms['date']);
		prms['IdC'] = valueCli;
		prms['IdT'] = (valueTP ? valueTP : '');
		prms['sumDoc'] = Order_calcSum('-');

		prms['sOther'] = '';
		for (var i = 0; i < P.arrNMS[0].length; i++) {
			var setNms = $("#idNms" + (i + 1)).data("dxSelectBox");
			if (setNms && setNms.option().value && P.arrNMS[0][i].Id < 100) {
				prms['sOther'] += (i + 1) + ':' + setNms.option().value + ';';
			}
		}
		prms['sNote'] = $("#txtNote").data("dxTextArea").option("value");
		var sWars = '';
		for (var i in P.arrayBAsket) {
			sWars += P.arrayBAsket[i].Id + ':' + P.arrayBAsket[i].Quant + ';';
		}
		prms['sWars'] = sWars.substring(0, sWars.length - 1);

		DAL.SaveBil(prms, params.s);

		Order_clickBack();

		var cnt = DAL.CountTable('Bil');
		if (cnt)
			cnt.done(function (result) {
				P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
			});
	};

	Order_clickBack = function (arg) {
		P.fromProducts = false;
		if (params.Id) {
			var icur = BAsket.app.navigationManager.currentStack.currentIndex;
			if (icur < 1) {
				BAsket.app.navigate('home', { root: true });
				return;
			}
			var backUri = BAsket.app.navigationManager.currentStack.items[icur - 1].uri;
			if (backUri && backUri == 'RoadMapList')
				BAsket.app.navigate('RoadMapList', { root: true });
			else
				BAsket.app.navigate('OrderList', { root: true });
		}
		else
			//BAsket.app.navigate('home');
			BAsket.app.navigate('home', { root: true });
	};

	Order_clickProduct = function() {
		BAsket.app.navigate('Products/' + P.curCategoryId);
		//	    BAsket.app.navigationManager.saveState(window.localStorage);
	};


	var viewModel = {
		swValue: params.s,
		clients: DAL.Clients(),
		arrayTP: arrayTP,
		showTP: showTP,
		calcSum: calcSum,

		dataVal: dataVal,
		cliId: cliId,
		cliName: cliName,
		tpId: tpId,
		tpName: tpName,
		noteVal: noteVal,

		nmsNames: nmsNames,

		viewShown: function () {
			calcSum(Order_calcSum());
			for (var i = 0; i < P.arrNMS[0].length; i++) {
				var setNms = $("#idNms" + (i + 1));
				if (setNms.length == 1 && P.arrNMS[0][i].Id < 10) {
					setNms.parent().show();
					setNms[0].parentNode.children[0].innerText = P.arrNMS[0][i].N;
				}
			}
		}
	};

	return viewModel;
};


BAsket.OrderList = function (params) {
	var holdTimeout = ko.observable(500);
	var popVisible = ko.observable(false);
	var idSelected = ko.observable(0);
	var searchStr = ko.observable('');
	var swTitle = ko.observable(_.Order.SwTitle1);
	var swValue = ko.observable(false);

	var viewModel = {
		dataSource: DAL.Bil({ search: searchStr }),
		dataSourceS: DAL.Bil({ search: searchStr }, true),

		popVisible: popVisible,
		holdTimeout: holdTimeout,
		popActions: [
		    { text: _.Order.ActionDelete, clickAction: function () { Order_DeleteClick() } },
		    { text: _.Order.ChangeActivity, disabled: swValue, clickAction: function () { Order_ChangeActivity() } }
		],

		searchString: searchStr,
		// find: function () {
		// 	viewModel.showSearch(!viewModel.showSearch());
		// 	viewModel.searchString('');
		// },
		// showSearch: ko.observable(false),
		swTitle: swTitle,
		swValue: swValue,
		viewShown: function () {
			if (swValue())
				viewModel.dataSourceS.load();
			else
				viewModel.dataSource.load();		
		}
	};
	ko.computed(function() {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function() {
		viewModel.dataSource.pageIndex(0);
		viewModel.dataSource.load();
		viewModel.dataSourceS.pageIndex(0);
		viewModel.dataSourceS.load();
	});

	Order_SwitchSource = function(){
		swValue(!swValue());
		if (swValue()){
			swTitle(_.Order.SwTitle2)
			// viewModel.dataSourceS.load();
		}
		else{
			swTitle(_.Order.SwTitle1)
			viewModel.dataSource.load();
		}
		//viewModel.dataSource = DAL.Bil(swValue());
	}

	Order_DeleteClick = function() {
		//    var result = DevExpress.ui.dialog.confirm(_.Order.ActionDelete + ' ?', _.Common.Confirm);
		//    result.done(function (dialogResult) {
		//    	alert(dialogResult ? "Confirmed" : "Canceled");
		// });

		DevExpress.ui.dialog.custom({
			message: _.Order.ActionDelete + ' ' + idSelected() + ' ?',
			title: _.Common.Confirm,
			buttons: [
				{ text: _.Common.Yes, clickAction: Order_Delete },
				{ text: _.Common.Cancel }
			]
		}).show();
	};
	Order_Delete = function(arg) {
		DAL.DeleteBil({'id': idSelected()}, swValue());
		DAL.CountTable('Bil').done(function(result) {
			P.itemCount['OrderList'] = P.ChangeValue('OrderList', result[0].cnt);
		});
		if (swValue())
			viewModel.dataSourceS.load();
		else
			viewModel.dataSource.load();
	};

	Order_ChangeActivity = function() {
		DAL.ChangeActivityBil(idSelected()).done(function(result) {
			viewModel.dataSource.load();
		})
	};

	Order_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};

	return viewModel;
};BAsket.Clients = function (params) {
	P.getGeo();
	var searchStr = ko.observable('');
	var holdTimeout = ko.observable(500);
	var popVisible = ko.observable(false);
	var idSelected = ko.observable(0);

	var viewModel = {
		searchString: searchStr,
		// find: function() {
		// 	viewModel.showSearch(!viewModel.showSearch());
		// 	viewModel.searchString('');
		// },
		// showSearch: ko.observable(false),
		popVisible: popVisible,
		holdTimeout: holdTimeout,
		popActions: [],

		dataSource: DAL.Clients({ search: searchStr })
	};
	ko.computed(function () {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function () {
		viewModel.dataSource.pageIndex(0);
		viewModel.dataSource.load();
	});

	Client_processItemHold = function (arg) {
		idSelected(arg.itemData.Id);
		popVisible(true);
	};


	return viewModel;
};

BAsket.Client = function (params) {
	//P.loadPanelVisible(true);
	P.getGeo();
	var cliName = ko.observable('');
	var location = ko.observable(P.geoCurrent());
	var visibleMenu = ko.observable(false);
	var popupVisible = ko.observable(false);
	var geoDirections = ko.observable('');

	var viewModel = {
		visibleMenu: visibleMenu,
		popupVisible: popupVisible,
		menuItems: [_.Common.Save, _.Clients.RoutDetail],
		cliName: cliName,

		options: //mapOptions
        {
        	provider: P.mapProvider,
        	mapType: 'roadmap',
        	width: '100%', height: '100%',
        	zoom: 15,
        	readyAction: function () { Client_MapReadyAction() }

        	// location: location,
        	// //P.geoCurrent(),
        	// //"56.853213999999994,53.215489",
        	// //"56.844278,53.206272",
        	// controls: true,

        	// markers: [
        	//   { label: "A", tooltip: "sd asd asd ", location: P.geoCurrent() },
        	//   // { label: "B", location: [56.844278,53.206272] },
        	//   // { label: "C", location: [56.829488,53.180437] }
        	// ],
        	// routes: [{
        	//     weight: 5,
        	//     color: "blue",
        	//     locations: [
        	//       [40.737102, -73.990318],
        	//       [40.749825, -73.987963],
        	//       [40.755823, -73.986397]
        	//     ]
        	// }]
        }
	};


	Client_ClickMenu = function (arg) {
		visibleMenu(!visibleMenu());
		//togglePopover();
	};
	Client_ClickMenuAction = function(arg) {
		visibleMenu(false);
		BAsket.notify(arg.itemData);
		if (arg.itemData == arg.model.menuItems[0]) {
			Client_menuSaveGeo();
		} else if (arg.itemData == arg.model.menuItems[1]) {
			
			var d = geoDirections();
			if (!d.legs || d.legs.length == 0)
				return;
			var text = '';
			text += '<p>Движение на авто ' + d.legs[0].duration.text + '; расстояние ' + d.legs[0].distance.text +
				'<br/>от: ' + d.legs[0].start_address + '<br/>до: ' + d.legs[0].end_address + '</p>';
			text += '<p>в основном по ' + d.summary + '</p>';
			text += '<br/><p>По шагам:</p>';
			for (var i in d.legs[0].steps) {
				text += '<p>' + (parseInt(i) + 1) + ') ' + d.legs[0].steps[i].duration.text + '; ' + d.legs[0].steps[i].distance.text;
				text += '; ' + d.legs[0].steps[i].instructions + '</p>';
			}
			arg.model.popupVisible(true);
			$("#textContainer").html(text);
			// $("#scrollView").dxScrollView("instance").scrollTo($(".dx-scrollview-content").height() - $(".dx-scrollview").height(), true);
			// $("#scrollView").dxScrollView("instance").release();
			// $("#scrollView").dxScrollView("instance").update();			
		}
	};
	Client_menuSaveGeo = function (arg) {
		BAsket.notify('Client_menuSaveGeo');
		//DAL.ExecQuery("UPDATE CLI set geoLoc='" + P.geoCurrent() + "' WHERE id='" + params.id + "'");
	};
	Client_clickCancel = function (arg) {
		popupVisible(false);
	};

	Client_PullDownActionFunction = function (actionOptions) {
		// DevExpress.ui.dialog.alert("The widget has been pulled down", "Action executed");
		actionOptions.component.release();
	};

	Client_MapReadyAction = function (s) {
		P.loadPanelVisible(false);
		//var map = s.component;
		var map = $("#idClientMap").data("dxMap");
		map.addMarker({ tooltip: _.Common.CurrentLocation, location: P.geoCurrent() });

		DAL.ClientById(params.Id).load().done(function(result) {
			cliName(result[0].N2 + ' (' + result[0].A + ')');
			//              location(P.geoCurrent());
			//            if (location()){
			//map.addMarker({tooltip: 'Current Location2', location: '56.843214,53.225489'});

			var locCli = result[0].geoLoc;
			locCli = result[0].A;
			if (locCli) {
				map.addMarker({ tooltip: result[0].N + ', ' + result[0].A, location: locCli });
			} else {
				P.geoCoder(result[0].Adres).done(function(geores) {
					map.addMarker({ tooltip: result[0].N + ', ' + result[0].A, location: geores });
				});

				var p1 = map._options.markers[0].location.split(',');
				var p2 = map._options.markers[1].location.split(',');
				if (p1 && p2 && p1.length == 2 && p2.length == 2) {
					var res1 = P.getDistance(p1, p2);
					var res2 = P.geoBearing(p1, p2);
					cliName(cliName() + ' dist=' + res1 + ' dir=' + res2);
				}
			}

			var routeOptions = {
				weight: 5,
				color: "blue",
				locations: [map._options.markers[0].location, map._options.markers[1].location]
			};
			map.addRoute(routeOptions);

			var directionsDisplay = new google.maps.DirectionsRenderer();
			//directionsDisplay.setMap(map._map);

			var directionsService = new google.maps.DirectionsService();
			var request = {
				origin: map._options.markers[0].location,
				destination: map._options.markers[1].location,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					geoDirections(result.routes[0]);
					//directionsDisplay.setDirections(result);
				}
			});
			// var geo = P.geoCoder(locCli).done(function(res){
			//     geoDirections(res);
			// });

			////    http://maps.googleapis.com/maps/api/directions/json?origin=56.853213999999994,53.215489&destination=%D0%98%D0%B6%D0%B5%D0%B2%D1%81%D0%BA%20%D0%B3.,%20%D0%9C%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB.,%2069&sensor=false

			// $.ajax({
			//         url: P.geoDirectionsUrl,
			//         data: { sensor: false, 
			//             origin:  map._options.markers[0].location, 
			//             destination: map._options.markers[1].location},
			//         type: 'GET',
			//         dataType: 'json',
			//         crossDomain: true, 
			//         headers: { 
			//             Accept : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",                                

			//         },
			//         success: function(data) {
			//             geoDirections(data);
			//         }
			// })

			// $.get(P.geoDirectionsUrl, { sensor: false, callback: '_googleScriptReady',
			//     origin:  map._options.markers[0].location, 
			//     destination: map._options.markers[1].location})
			// .done(function(data){
			//     geoDirections(data);
			// });

			// map.gmap('microdata', 'http://data-vocabulary.org/Event', function(result, item, index) {
			//     var lat = result.location[0].geo[0].latitude;
			//     var lng = result.location[0].geo[0].longitude;
			//     var latlng = new google.maps.LatLng(lat, lng);
			// })
			//  var m = map._options.markers;
			//            map.addMarker({label: "A1", tooltip: result[0].Name + ', ' + result[0].Adres, location: [56.853213999999994,53.206272]});
			// }
			//thisCli.options.markers[0] = { label: "A", tooltip: "sd asd asd ", location: P.geoCurrent() };
		});
	};


	return viewModel;
};BAsket.RoadMapList = function (params) {
	P.getGeo();
	var date = params.Id && params.Id != "undefined"? new Date(params.Id) : new Date();
	var dataVal = ko.observable(date);
	var itemSelected = ko.observable(0);
	var popVisible = ko.observable(false);
	var holdTimeout = ko.observable(500);
	var popupVisible = ko.observable(false);

	var showTP = ko.observable(false);
	var arrayTP = ko.observable([{ "Id": "", "Name": "" }]);
	var cliId = ko.observable(0);
	var cliName = ko.observable(_.Order.SelectClient + '...');
	var tpId = ko.observable(0);
	var tpName = ko.observable(_.Order.SelectPoint + '...');


	var viewModel = {
		dataVal: dataVal,
		popupVisible: popupVisible,

		holdTimeout: holdTimeout,
		popVisible: popVisible,
		popActions: [
			{ text: _.RoadMap.OpenBil, clickAction: function () { RoadMap_Action('OpenBil') } },
			{ text: _.RoadMap.MoveUp, clickAction: function () { RoadMap_Move('MoveUp') } },
			{ text: _.RoadMap.MoveDown, clickAction: function () { RoadMap_Move('MoveDown') } },
			{ text: _.RoadMap.ActionDelete, clickAction: function () { RoadMap_Action('DeleteClick') } }
		],

		dataSource: DAL.RoadMap(dataVal()),
		clients: DAL.Clients(),
		arrayTP: arrayTP,
		showTP: showTP,
		cliId: cliId,
		cliName: cliName,
		tpId: tpId,
		tpName: tpName,
		viewShown: function () {
			var date = new Date();
			if (location.hash.indexOf('/') < 0 && dataVal().toLocaleDateString() != date.toLocaleDateString()){
				RoadMap_ChangeDate();
			}
		}
	};

	// RoadMap_Back = function (arg) {
	// 	debugger;
	// }
	RoadMap_ChangeDate = function (arg) {
		BAsket.app.navigate('RoadMapList/' + dataVal(), { direction: 'none', root: true });
	};

	RoadMap_AddToTheMap = function (arg) {
		//BAsket.notify('RoadMap_AddToTheMap');
		popupVisible(true);
	};
	RoadMap_clickCancel = function (arg) {
		popupVisible(false);
	};
	RoadMap_clientChanged = function (arg) {
		var value = "";
		if (arg && arg.element.length > 0) {
			var lookupCli = $("#lookupClient").data("dxLookup");
			value = lookupCli.option().value; //("value");
		}

		if (value) {
			var self = this;
			self.tpId(0);
			self.tpName(_.Order.SelectPoint + '...');
			DAL.ClientsPar(value).load().done(function (result) {
				self.arrayTP(result);
				self.showTP(result.length > 0);
			});
		}
	};
	RoadMap_ClientSave = function(arg) {
		var valueCli = $("#lookupClient").data("dxLookup").option("value");
		if (!valueCli) {
			BAsket.notify(_.Order.ErrNoCli, "error");
			return;
		}
		var valueTP = $("#lookupTP").data("dxLookup").option("value");
		var prms = {};
		prms['date'] = U.DateFormat(dataVal(), 'yyyy-mm-dd');
		prms['IdC'] = valueCli;
		prms['IdT'] = (valueTP ? valueTP : 0);
		prms['Npp'] = viewModel.dataSource.items().length > 0 ?
			parseInt(viewModel.dataSource.items()[viewModel.dataSource.items().length - 1].Npp) + 1 : 1;

		DAL.AddCliRMap(prms, RoadMap_Reload);

		popupVisible(false);
		cliName(_.Order.SelectClient + '...');
		tpName(_.Order.SelectPoint + '...');
	};


	RoadMap_ClickShow = function(arg) {
		var arr = arg.model.dataSource._items;
		P.arrayBAsket = [];
		P.arrayBAsketL = [];
		for (var i in arr) {
			if (arr[i].Adres) {
				var cText = arr[i].N2 ? arr[i].N1 + ' - ' + arr[i].N2 : arr[i].N1;
				P.arrayBAsket.push({ tooltip: cText + ' (' + arr[i].Adres + ')', location: arr[i].Adres });
				P.arrayBAsketL.push(arr[i].Adres);
			}
		}
		BAsket.app.navigate('RoadMap/');
	};

	RoadMap_Move = function(action) {
		var icur = -1;
		for (var i in viewModel.dataSource._items)
			if (itemSelected().Id == viewModel.dataSource._items[i].Id) {
				icur = parseInt(i);
				break;
			}
		if (icur < 0) return;
		if (action == 'MoveUp' && icur == 0) {
			BAsket.notify('First Position Up');
			navigator.notification.beep(1);
			return;
		} else if (action == 'MoveDown' && icur == viewModel.dataSource._items.length - 1) {
			BAsket.notify('Last Position Down');
			navigator.notification.beep(1);
			return;
		}
		var p = action == 'MoveDown' ? 1 : -1;
		DAL.SwapRmap(itemSelected().Id, viewModel.dataSource._items[icur + p].Npp,
			viewModel.dataSource._items[icur + p].Id, itemSelected().Npp, RoadMap_Reload);
	};

	RoadMap_Action = function(action) {
		if (action == 'DeleteClick') {
			DevExpress.ui.dialog.custom({
				message: _.RoadMap.ActionDelete + ' ' + itemSelected().Id + ' ?',
				title: _.Common.Confirm,
				buttons: [
					{ text: _.Common.Yes, clickAction: RoadMap_Delete },
					{ text: _.Common.Cancel }
				]
			}).show();
		} else if (action == 'OpenBil') {
			if (itemSelected().IdB) {
				BAsket.app.navigate('Order/' + itemSelected().IdB);
				return;
			}
			var prms = {};
			prms['date'] = U.DateFormat(dataVal());
			prms['IdC'] = itemSelected().IdC;
			prms['IdT'] = itemSelected().IdT;
			prms['Note'] = itemSelected().Note;
			DAL.SaveBil(prms).done(function(res) {
				var id = (P.useWebDb) ? res.insertId : res[0].Id;
				DAL.SaveRMBil(itemSelected().Id, id).done(function() {
					BAsket.app.navigate('Order/' + id);
					viewModel.dataSource.load();
				});
			});
		} else
			BAsket.notify(action);
	};

	RoadMap_Delete = function(arg) {
		DAL.DeleteRMap(itemSelected().Id);
		DAL.CountTable('RMAP').done(function(result) {
			var date = new Date();
			var datestr = date.getDate() + '.' + (date.getMonth() + 1);
			P.itemCount['RoadMap'] = P.ChangeValue('RoadMap', datestr + ' (' + result[0].cnt + ')');
		});
		viewModel.dataSource.load();
	};

	RoadMap_processItemHold = function(arg) {
		itemSelected(arg.itemData);
		popVisible(true);
	};
	RoadMap_Reload = function(arg) {
		viewModel.dataSource.load();
	};

	return viewModel;
};

BAsket.RoadMap = function (params) {
	//P.loadPanelVisible(true);
	//P.getGeo();

	var viewModel = {
		options: {
			provider: P.mapProvider,
			mapType: "roadmap",
			//location: P.geoCurrent,
			controls: true,
			width: "100%",
			height: "100%",
			zoom: 15,
			markers: P.arrayBAsket,
			// [
			//   { title: "A", tooltip: "sd asd asd ", location: [56.851248,53.20271] },
			//   { title: "B", tooltip: "wer wer w", location: [56.864278,53.216272] },
			//   { title: "C", tooltip: "asasdas asd as asd ", location: [56.859488,53.190437] }
			// ],
			routes: [{
				weight: 5,
				color: "blue",
				locations: P.arrayBAsketL
				// [
				//   [56.851248,53.20271],
				//   [56.864278,53.216272],
				//   [56.859488,53.190437]
				// ]
			}],
			readyAction: function () { RoadMap_ReadyAction() }
		}
	};

	RoadMap_ReadyAction = function(s) {
		P.loadPanelVisible(false);
	};

	return viewModel;
};
BAsket.Preferences = function (params) {
	tabs = [
	  { text: _.Preferences.Main, icon: "comment" },
	  { text: _.Preferences.Functions, icon: "user" },
	  { text: _.Preferences.Admin, icon: "preferences" }
	];
	var tabContent = ko.observable();
	var selectedTab = ko.observable(0);

	var popupVisible = ko.observable(false);

	ko.computed(function () {
		if (selectedTab() == 2) {
			popupVisible(true);
		} else
			popupVisible(false);

		tabContent(tabs[selectedTab()].content);
	});
	var dataSouceUrl = ko.observable(P.dataSouceUrl);

	var adminPassword = ko.observable('');
	var buttonVisible = ko.observable(true);

	var modeProdView = ko.observable(P.modeProdView);
	var debugMode = ko.observable(P.debugMode);
	var useWebDb = ko.observable(P.useWebDb);
	var userName = ko.observable(P.UserName);
	var userPass = ko.observable(P.UserPass);
	var userEMail = ko.observable(P.UserEMail);

	Preferences_WsUrl = function(arg) {
		P.dataSouceUrl = P.ChangeValue("dataSouceUrl", dataSouceUrl());
	};
	Preferences_TableMode = function(arg) {
		P.modeProdView = P.ChangeValue("modeProdView", modeProdView());
	};
	Preferences_useWebDb = function(arg) {
		P.useWebDb = P.ChangeValue("useWebDb", useWebDb());
	};
	Preferences_debugMode = function(arg) {
		P.debugMode = P.ChangeValue("debugMode", debugMode());
	};
	Preferences_userName = function(arg) {
		P.UserName = P.ChangeValue("userName", userName());
	};
	Preferences_userPass = function(arg) {
		P.UserPassword = P.ChangeValue("userPassword", userName());
	};
	Preferences_userEMail = function(arg) {
		if (!P.validateEmail(userEMail())){
			BAsket.notify(_Common.EMailNotValid + ': ' + userEMail());
			return;
		}
		P.UserEMail = P.ChangeValue("userEMail", userEMail());
	};

	Preferences_changePlatform = function(arg) {
		if (arg.element.length > 0) {
			P.platformDevice = P.ChangeLookup("#lookupPlatform", "Platform");
			//DevExpress.devices.current(P.platformDevice);
			window.location.reload();
		}
	};
	Preferences_changeMapProvider = function(arg) {
		if (arg.element.length > 0)
			P.mapProvider = P.ChangeLookup("#lookupMapProvider", "MapProvider");
	};
	Preferences_changeLanguageUI = function(arg) {
		if (arg.element.length > 0) {
			P.languageUI = P.ChangeLookup("#lookupLanguageUI", "LanguageUI");
			//P.ChangeLanguageUI();
			window.location.reload();
		}
	};

	Preferences_clickLogin = function () {
		if (adminPassword() == P.adminPassword) {
			popupVisible(false);
		}
		else
			//BAsket.error("Incorrect password");
			BAsket.notify(_.Preferences.Incorrect_password, "error");
	};
	Preferences_clickCancel = function () {
		//selectedTab(0);
		popupVisible(false);
	};
	Preferences_clickRecreateLocal = function () {
		DevExpress.ui.dialog.confirm("Вы уверены?", "Пересоздание локальной базы данных").done(function (dialogResult) {
			if (dialogResult) {
				DAL.RecreateLocalDB();
			}
		});
	};

	var viewModel = {
		selectedTab: selectedTab,
		popupVisible: popupVisible,
		adminPassword: adminPassword,
		popupTitle: "Login",
		dataSouceUrl: dataSouceUrl,


		dsMapProvider: {
			data: ["google", "googleStatic", "bing"],
			value: ko.observable(P.mapProvider)
		},
		dsLanguage: {
			data: ['-', "English", "Русский"],
			value: ko.observable(P.languageUI)
		},

		modeProdView: modeProdView,
		debugMode: debugMode,
		useWebDb: useWebDb,
		userName: userName,
		userPass: userPass,
		userEMail: userEMail,

		// "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "desktop" and "tizen". 
		dsPlatform: {
			data: ['-', "generic", "ios", "ios v6", "android", "android black", "tizen", "tizen black"],
			// data: ['-', "generic", "ios", "android", "win8", "tizen"],
			//            data: ['-', "iPhone", "iPhone5", "iPad", "iPadMini", "androidPhone", "androidTablet", "win8", "win8Phone", "msSurface", "tizen"],
			value: ko.observable(P.platformDevice)
		},

		dsWsUrl: ['', 
			'http://10.0.0.30/BWS2/api/', 
			// 'http://87.249.234.190:55777/BWS2/api/', 
			// 'http://192.168.1.125/BAsketWS/api/',
			'http://192.168.1.146/BAsketWS/api/'
			]
	};

	return viewModel;
};


BAsket.Info = function (params) {
	// var rootShow = ko.observable(true);
	var subTitle = ko.observable('');
	var subText = ko.observable('');
	var dsInfo = [];
	for (var i=0; i<P.navigation.length; i++){
		var clone = {};   
    	for (var j in P.navigation[i]) 
        	clone[j] = P.navigation[i][j];
    
		dsInfo.push(clone);
	}
	//dsInfo = dsInfo.splice(1);
	if (params.Id) {
		// rootShow(false);
		subTitle(params.Id);	//' - ' + 
		var text = _.Info[params.Id]	//params.Id + " string to repeat\n";
		// subText('<p>'+ new Array( 444 ).join( text ) + '</p>');
		subText(text);		
	} else {
		dsInfo.splice(-1, 1);
		dsInfo.push({"id": "Products", "heightRatio": 4, "widthRatio": 8, "icon": "cart", "title": _.Info.IProducts, "backcolor": "#FF981D"});
		dsInfo.push({"id": "Product_Details", "heightRatio": 4, "widthRatio": 4, "icon": "cart", "title": _.Info.IProductDet, "backcolor": "#FF981D"});
		dsInfo.push({"id": "Client", "heightRatio": 4, "widthRatio": 4, "icon": "globe", "title": _.Info.IClient, "backcolor": "#7200AC"});
		dsInfo.push({"id": "RoadMap", "heightRatio": 4, "widthRatio": 4, "icon": "map", "title": _.Info.IMap, "backcolor": "#006AC1"});
		dsInfo.push({"id": "Contacts", "heightRatio": 4, "widthRatio": 8, "icon": "home", "title": _.Info.IContacts, "backcolor": "red"});
		dsInfo.push({"id": "SysInfo", "heightRatio": 4, "widthRatio": 4, "icon": "preferences", "title": "SysInfo", "backcolor": "black"});
		for (var info in dsInfo){
			dsInfo[info].action = '#Info/' + dsInfo[info].id;
		}
	}
	var viewModel = {
		dsInfo: dsInfo,
		title: _.Info.Title,	//'Info',	// + subTitle(),
		// rootShow: rootShow,
		subTitle: subTitle,

		viewShown: function () {
			$("#textContainer").html(subText());
		}
	};
	return viewModel;
};


BAsket.ReadNews = function (params) {
	var arrayRepo = [];
	for (var i in P.arrNMS[0]) 
		if (P.arrNMS[0][i].Id == 101){
			arrayRepo = P.arrNMS[parseInt(i) + 1];
			break;
		}

	var modeSaveOrd = ko.observable(P.getLocalStor('modeSaveOrd', true));
	var modeLoadOst = ko.observable(P.getLocalStor('modeLoadOst', true));
	var modeLoadSpr = ko.observable(P.getLocalStor('modeLoadSpr', false));

	var viewModel = {
		modeSaveOrd: modeSaveOrd,
		modeLoadOst: modeLoadOst,
		modeLoadSpr: modeLoadSpr,
		arrayRepo: arrayRepo,
		viewShown: function () {
			$('#consoleOut').html();
		}
	};

	ReadNews_SUA = function(arg){
		if (arg == 'modeSaveOrd')
			P.ChangeValue(arg, modeSaveOrd());
		else if (arg == 'modeLoadOst')
			P.ChangeValue(arg, modeLoadOst());
		else if (arg == 'modeLoadSpr')
			P.ChangeValue(arg, modeLoadSpr());
	}
	
	ReadNews_ReadNews  = function(){
		if (modeSaveOrd()){
			DAL.SendBils();
		}
		if (modeLoadOst() || modeLoadSpr()) {
			DAL.ReadNews(modeLoadSpr());
		}
	}

	ReadNews_SendRepo = function(){
		if (!P.UserEMail || !P.validateEmail(P.UserEMail)){
			BAsket.notify(_Common.EMailNotValid);
			return;
		}
		var lookupRepo = $("#lookupRepo").data("dxLookup");
		var value = lookupRepo.option().value;
		if (!value) {
			BAsket.notify(_.ReadNews.ChoiceRepo);
			return;
		}
		DAL_web.SendRepo({'id':value, 'mail':P.UserEMail});
		//BAsket.notify('SendRepo '+ value + ' to ' + P.UserEMail);		
	}

	return viewModel;
};
BAsket.Products = function (params) {
	P.fromProducts = true;
	var searchStr = ko.observable('');
	P.curCategoryId = (params.Id == 'undefined') ? P.curCategoryId : params.Id;
	 if ((!P.curCategoryId || P.curCategoryId == 0) && P.arrCategory.length > 0)
    		P.curCategoryId = root.arrCategory[0].Id;

	var bChoice = ko.observable(P.curModeChoice);
	var lbltitle = ko.observable(_.Products.Title1);
	var btnSwText = ko.observable(_.Products.btnSwText1);
	var calcSum = ko.observable('');

	var viewModel = {
		searchString: searchStr,

		dataSourceCat: P.arrCategory,   //DAL.Categories(),
		dataSourceBasket: new DevExpress.data.DataSource(new DevExpress.data.ArrayStore(P.arrayBAsket)),

		// dataSourceProd: DAL.Products({Id:P.curCategoryId, search:searchStr}),
		dataSourceProd: DAL.Products({ pId: P.curCategoryId, search: searchStr }, !P.modeProdView),

		bChoice: bChoice,
		lbltitle: lbltitle,
		btnSwText: btnSwText,
		calcSum: calcSum,

		viewShown: function () {
			viewModel.dataSourceProd.load();
		}
	};
	ko.computed(function() {
		return viewModel.searchString();
	}).extend({
		throttle: 500
	}).subscribe(function() {
		viewModel.dataSourceProd.pageIndex(0);
		viewModel.dataSourceProd.load();
	});

	Products_calcSum = function() {
		var sum = 0.0;
		for (var i in P.arrayBAsket) {
			sum += P.arrayBAsket[i].Quant * P.arrayBAsket[i].P;
		}
		return _.Products.SelSum.replace('#', P.arrayBAsket.length) + sum.toFixed(2);
	};

	Products_swichClicked = function() {
		P.curModeChoice = !P.curModeChoice;
		if (!P.curModeChoice) {
			viewModel.dataSourceBasket.load();
			bChoice(P.curModeChoice);
			lbltitle(_.Products.Title2);
			btnSwText(_.Products.btnSwText2);
			calcSum(Products_calcSum());
		} else {
			// viewModel.dataSourceProd.load();
			bChoice(P.curModeChoice);
			lbltitle(_.Products.Title1);
			btnSwText(_.Products.btnSwText1);
		}
	};

	Products_categoryChanged = function(arg) {
		if (arg.element.length <= 0) return;

		var lookup = $("#CategoryLookup").data("dxLookup");
		P.curCategoryId = lookup.option("value");
		P.curCategoryName = $(".dx-state-active").html();
		BAsket.app.navigate('Products/' + P.curCategoryId, { direction: 'none' });
	};

	Products_clickBack = function(arg) {
		//BAsket.app.navigate('Order/' + P.curCategoryId);
		//BAsket.app.navigationManager.restoreState(window.localStorage);
		var cur = 0;
		for (var i = BAsket.app.navigationManager.currentStack.items.length - 1; i > 0; i--) {
			if (BAsket.app.navigationManager.currentStack.items[i - 1].uri.indexOf('Order') == 0) {
				cur = i;
				break;
			} else {
				BAsket.app.navigationManager.currentStack.items.splice(i - 1, 1);
			}
		}
		BAsket.app.navigationManager.currentStack.currentIndex = cur; //BAsket.app.navigationManager.currentStack.items.length - 1;
		BAsket.app.back();
	};

	return viewModel;
};



BAsket.Product_Details = function (params) {

	var viewModel = {
		Id: params.Id,
		Name: ko.observable(''),
		Price: ko.observable(''),
		N1: ko.observable(''),
		N2: ko.observable(''),
		N3: ko.observable(''),
		N4: ko.observable(''),
		N1T: ko.observable(P.arrNMS[10][0] ? P.arrNMS[10][0].N:''),
		N2T: ko.observable(P.arrNMS[10][1] ? P.arrNMS[10][1].N:''),
		N3T: ko.observable(P.arrNMS[10][2] ? P.arrNMS[10][2].N:''),
		N4T: ko.observable(P.arrNMS[10][3] ? P.arrNMS[10][3].N:''),
		Ostat: ko.observable(''),
		Quant: ko.observable(),

		viewShown: function () {
			var quant = $("#idQuant").data("dxNumberBox");
			quant.focus();
			// setTimeout(function () {
			//    // $('#idQuant :input').focus();
			//     var input = $('#idQuant :input')[0];
			//     var textEvent = document.createEvent('TextEvent');
			//     textEvent.initTextEvent('textInput', true, true, null,  " ", 9, "en-US");
			//     input.dispatchEvent(textEvent);

			//     //simulateKeyPress("2");
			// }, 300);
		}
	};
	DAL.ProductDetails({ Id: params.Id, model: viewModel });

	// function simulateKeyPress(character) {
	//   jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
	// }
	
	Product_Details_saveClicked = function(arg) {
		var bFound = false;
		//var valueQuant = $("#idQuant").data("dxNumberBox").option("value");
		// for (var prop in valueQuant)
		//     console.log(prop + ': ' + valueQuant[prop])
		//console.log('Product_Details_saveClicked <' + this.Quant());
		var quant = parseInt(this.Quant());
		//console.log('Product_Details_saveClicked quant<' + quant + '>');
		for (var i in P.arrayBAsket) {
			//if (!P.arrayBAsket.hasOwnProperty(i)) continue;
			//if (i == key && P.arrayBAsket[i].id == this.id()) {
			if (P.arrayBAsket[i].Id == this.Id) {
				if (quant && quant > 0)
					P.arrayBAsket[i].Quant = quant;
				else
					P.arrayBAsket.splice(i, 1);
				bFound = true;
				break;
			}
		}
		if (!bFound && quant && quant > 0) {
			P.arrayBAsket.push({ 'Id': this.Id, 'N': this.Name(), 'O': this.Ostat(), 'Quant': quant, 'P': this.Price(), 'N1': this.N1(), 'N2': this.N2() });
		}
		// for(var i in P.arrayBAsket){
		//     console.log('Product_Details_saveClicked arrayBAsket<' + P.arrayBAsket[i].Quant + '>');
		// }

		//BAsket.app.navigate('Products/' + P.curCategoryId);
		BAsket.app.back();
	};

	return viewModel;
};
