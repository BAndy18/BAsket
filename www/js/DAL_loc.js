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
        },
    }  
}

var DAL = (function ($, window) {
	var root = {};

	var dbLastQ = '';
    // var dbParam = null;
	// var dbName = 'BAsketDB';
	// var dbSize = 5000000;

    var DB = SQLite();

	root.Products = function(params, nopaging) {
		if (!P.useWebDb)
			return DAL_web.Products(params);
		var paging = !nopaging;
		return execDataSource({
			query: "SELECT * FROM WAR WHERE IdP='" + params.Id + "' and Ostat>0",
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
			params = setQuant(params);
			if (results.rows.length > 0) {
				params.model.Name(results.rows.item(0).Name),
				params.model.Price(results.rows.item(0).Price.toFixed(2))
				params.model.N1(results.rows.item(0).N1),
				params.model.N2(results.rows.item(0).N2),
				params.model.N3(results.rows.item(0).N3),
				params.model.N4(results.rows.item(0).N4),
				params.model.Ostat(results.rows.item(0).Ostat),
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
            	for (var i in P.arrayBAsket) {
            		if (P.arrayBAsket[i].Id == data.Id) {
            			data.Quant = P.arrayBAsket[i].Quant;
            		}
            	}
            	return data;
            });
	};
	// root.NMS = function (params) {
	// 	if (!P.useWebDb)
	// 		return DAL_web.NMS(params);
	// 	return execQuery("SELECT * FROM NMS Where IdRoot='" + params + "'");
	// };


	root.Clients = function (params) {
		if (!P.useWebDb)
			return DAL_web.Clients(params);

		var param = { query: "SELECT * FROM CLI Where IdP='0'", paging: true };
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
			query: "SELECT c.*, par.Name as ParName, IFNULL(par.Name || ' - ' || c.Name, c.Name) as FullName " +
				"FROM CLI c Left Join CLI par On c.IdP=par.Id Where c.Id='" + params + "'"
		});
	};

	root.RoadMap = function (params) {
		var date = U.DateFormat(params);   //yyyy-mm-dd
		return execDataSource({
			query: "SELECT r.*, c.Name as cName, t.Name as tName, " +
				"IFNULL(t.Name || ' - ' || c.Name, c.Name) as FullName, " +
				"IFNULL(t.Adres, c.Adres) as AdresDost, IFNULL(t.Id, c.Id) as IdDost  " +
				"FROM RMAP r Join CLI c On r.IdC=c.Id Left Join CLI t On r.IdT=t.Id " +
				"Where DateDoc='" + date + "' Order by Npp"
		});
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
		return execQuery("UPDATE RMAP set IdBil=" + idb + " Where Id=" + id);
	};
	root.AddCliRMap = function(prm, callback) {
		execQuery("INSERT INTO RMAP (DateDoc, Npp, IdC, IdT) VALUES('" + prm['date'] + "'," + prm['Npp'] + ",'"
				+ prm['IdC'] + "','" + prm['IdT'] + "')")
			.done(function() { callback(); })
	};

	root.BilM = function (params) {
		if (!P.useWebDb)
			return DAL_web.BilM(params);
		return execDataSource({
			query: "SELECT b.*, c.Name as cName, t.Name as tName, substr(b.DateDoc,1,5) as ShortDate, " +
				"IFNULL(t.Name || ' - ' || c.Name, c.Name) as FullName, " +
				"IFNULL(t.Adres, c.Adres) as AdresDost " +
				"FROM BILM b Join CLI c On b.IdC=c.Id Left Join CLI t On b.IdT=t.Id"
		});
	};
	root.BilMById = function (params) {
		if (!P.useWebDb)
			return DAL_web.BilMById(params);
		return execDataSource({ query: "SELECT b.*, c.Name as cName, t.Name as tName FROM BILM b Join CLI c On b.IdC=c.Id Left Join CLI t On b.IdT=t.Id WHERE b.Id='" + params + "'" });
	};

	//     root.SelectLastId = function(params){                
	//         return execQuery("SELECT last_insert_rowid() as Id");
	// //        return execQuery("SELECT Id FROM " + params + " WHERE rowid=last_insert_rowid()");
	//     }

	root.SaveBil = function(params) {
		if (!P.useWebDb)
			return DAL_web.SaveBil(params);
		var query = "";
		if (!params['sOther']) params['sOther'] = '';
		if (!params['sNote']) params['sNote'] = '';
		if (!params['sWars']) params['sWars'] = '';
		if (params['id']) {
			query = "UPDATE BILM set DateDoc='" + params['date'] + "', IdC='" + params['IdC'] + "', IdT='" + params['IdT'] +
				"', SumDoc='" + params['sumDoc'] + "', sNote='" + params['sNote'] + "', sOther='" + params['sOther'] +
				"', sWars='" + params['sWars'] +
				"' WHERE Id='" + params['id'] + "'";
		} else {
			query = "INSERT INTO BILM (DateDoc, IdC, IdT, SumDoc, sNote, sOther, sWars, bSusp) VALUES('" + params['date'] +
				"', '" + params['IdC'] + "','" + params['IdT'] + "','" + params['sumDoc'] + "','" + params['sNote'] +
				"', '" + params['sOther'] + "', '" + params['sWars'] + "', 0)";
		};
		return execQuery(query);
	};
    root.ChangeActivityBil = function (params) {
        return execQuery("UPDATE BILM set bSusp = 1-bSusp WHERE Id=" + params)
    }
	root.DeleteBil = function (params) {
		if (!P.useWebDb) return DAL_web.DeleteBil(params);

		return execQuery("DELETE FROM BILM Where Id='" + params + "'");
	};

	root.CountTable = function (params) {
		if (!P.useWebDb)
			return null;
		return execQuery("SELECT count(Id) as cnt FROM " + params);
	};
	root.TableCount = function(params) {
		if (!P.useWebDb)
			return null;

		DAL.CountTable('BILM').done(function(result) {
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

    root.SendBils = function(){
        if (!P.useWebDb) 
            return;
        execQuery("SELECT * FROM BILM WHERE bSusp=0").done(function(result) {
            var prm = {};
            for (var i in result) {
                prm['IdLoc'] = result[i].Id;
                prm['IdC'] = result[i].IdC;
                prm['IdT'] = result[i].IdT;
                prm['date'] = result[i].DateDoc;
                prm['sNote'] = result[i].sNote;
                prm['sWars'] = result[i].sWars;
                // prm['idServ'] = result[i].IdServ;
                // prm['sOther'] = result[i].Other;
                DAL_web.SaveBil(prm).done(function(res) {
                    execQuery("UPDATE BILM set bSusp=1, sServRet='" + res[0].Note + "' WHERE Id=" + result[i].Id);
                })
            }
        })
    }

    var modeReadNews;
	root.ReadNews = function (fullNews, createDB) {
		P.loadPanelVisible(true);
        
		// var source0 = DAL_web.NMS();
		// if (Object.prototype.toString.call(source0) == '[object Array]') writeToLocalData(source0, 'NMS');
		// else source0.load().done(function (result) { writeToLocalData(result, 'NMS'); });

        DAL_web.NMS().load().done(function (result) { writeToLocalData(result, 'NMS'); });
        DAL_web.Categories().load().done(function (result) { writeToLocalData(result, 'CAT'); });

        var date = new Date();
        P.itemCount['ReadNews'] = P.ChangeValue('ReadNews', date.getDate() + '.' + date.getMonth() + 1);

		if (!P.useWebDb) {
			P.loadPanelVisible(false);
			return;
		}

        if (createDB)
		    root.RecreateLocalDB();

        modeReadNews = fullNews ? 'all':'ost';
		DAL_web.Products({ pId: modeReadNews }).load().done(function (result) { writeToLocalData(result, 'WAR'); });

        if (fullNews){
    		DAL_web.Clients({ pId: 'all' }).load().done(function (result) { writeToLocalData(result, 'CLI'); });
        }
		P.itemCount['OrderList'] = P.ChangeValue('OrderList', 0);
		P.itemCount['RoadMapList'] = P.ChangeValue('RoadMapList', 0);

        if (P.arrCategory.length > 0) 
            P.Init();
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
					if (searchValue)
						dbLastQ += " and (Name LIKE '%" + searchValue + "%')";

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

	function setQuant(resrow) {
		for (var i in P.arrayBAsket) {
			if (P.arrayBAsket[i].Id == resrow.Id) {
				resrow.Quant = P.arrayBAsket[i].Quant;
				return resrow;
			}
		}
		return resrow;
	};



	var arrWAR;
	var arrCLI;
	function writeToLocalData(dataArray, table) {

		if (table == 'NMS') {
			P.arrNMS = [];
			for (var i = 0 in dataArray) {
				var j = dataArray[i].IdP;
				if (!P.arrNMS[j]) P.arrNMS[j] = [];
				P.arrNMS[j].push(dataArray[i]);
				P.ChangeValue('NMS' + j, JSON.stringify(P.arrNMS[j]));
			}
		}
		if (table == 'CAT') {
            if (!dataArray.length)
                dataArray = [{"Id":"0", "Name":"-"}]
			var localData = JSON.stringify(dataArray);
			P.arrCategory = JSON.parse(P.ChangeValue('categories', localData));
		}

		if (table == 'WAR') {
			arrWAR = dataArray;
            DB.transaction(function (tx) {
                dbLastQ = 'Update WAR set Ostat=0';
                tx.executeSql(dbLastQ, [], function (tx, results) {
                    DB.transaction(writeToWAR,
                        function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                        function () { trace(_.ReadNews.WroteRecs + table + ": success");        P.loadPanelVisible(false); });
                }, function (err, err2) {errorCB("*writeToWAR-ost sql*", err, err2)});
            });
		}
		if (table == 'CLI') {
			arrCLI = dataArray;
            // writeToCLI();
			DB.transaction(writeToCLI,
                function (err, err2) { errorCB("*write " + table + "*", err, err2);     P.loadPanelVisible(false); },
                function () { trace(_.ReadNews.WroteRecs + table + ": success");        P.loadPanelVisible(false); });
		}
	};
    
 	function writeToWAR(tx) {
		P.loadPanelVisible(true);
		var arr = arrWAR;
		var i, maxlen = 50000;
		var len = arr.length;   // < maxlen? arr.length:maxlen;
		//console.log('writeWars: writing=' + len);
		//tx.executeSql("BEGIN TRANSACTION");
		for (i = 0; i < arr.length; i++) {
            dbLastQ = "Select Id From WAR Where Id='" + arr[i].Id + "'";
            //tx.executeSql(dbLastQ, [], function (tx, results) {
            executeQuery(tx, dbLastQ, [], function (tx, retval, results, item) {
                if (modeReadNews == 'ost' && results.rows.length)
                    dbLastQ = "UPDATE WAR set Ostat='" + item.O + "' WHERE Id='" + item.Id + "'";
                else {
                    item.N1 = (item.N1) ? item.N1 : '';
                    item.N2 = (item.N2) ? item.N2 : '';
                    item.N3 = (item.N3) ? item.N3 : '';
                    if (results.rows.length)
                        dbLastQ = "UPDATE WAR set IdP='" + item.IdP + "', Name='" + item.N + "', N1='" + item.N1 + 
                            "', N2='" + item.N2 + "', N3='" + item.N3 + "', N4='" + item.N4 + 
                            "', Price='" + item.P + "', Ostat='" + item.O + 
                            "' WHERE Id='" + item.Id + "'";
                    else
                        dbLastQ = "INSERT INTO WAR (Id, IdP, Name, Price, N1, N2, N3, N4, Ostat) VALUES('"
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
		//tx.executeSql("COMMIT TRANSACTION", errorCB);
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
                if (results.rows.length)
                    dbLastQ = "UPDATE CLI set IdP='" + item.IdP + "', Name='" + item.N + "', Adres='" + item.A + 
                        "' WHERE Id='" + item.Id + "'";
                else
                    dbLastQ = "INSERT INTO CLI (Id, IdP, Name, Adres) VALUES('"
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
        'DROP TABLE IF EXISTS CAT',
        'DROP TABLE IF EXISTS WAR',
        'DROP TABLE IF EXISTS CLI',
        'DROP TABLE IF EXISTS BILM',
        'DROP TABLE IF EXISTS RMAP',
        'DROP TABLE IF EXISTS NMS',
        // 'CREATE TABLE IF NOT EXISTS NMS (IdRoot, Id, Name)',
        // 'CREATE TABLE IF NOT EXISTS CAT (Id unique, Name)',
        'CREATE TABLE IF NOT EXISTS WAR (Id unique, IdP, Name, Price DECIMAL(20,2), N1, N2, N3, N4, N5, Ostat int, bSusp int)',
        'CREATE TABLE IF NOT EXISTS CLI (Id unique, IdP, Name, Adres)',
        'CREATE TABLE IF NOT EXISTS BILM (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, IdC, IdT, SumDoc, sNote, sOther, sWars, NumD, DateSync DateTime, sServRet, IdServ, bSusp int)',
        'CREATE TABLE IF NOT EXISTS RMAP (Id INTEGER PRIMARY KEY AUTOINCREMENT, DateDoc DateTime, Npp int, IdB int, IdC, IdT, sNote, sOther, DateSync DateTime, sServRet, bSusp int)',
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '1', 'Предприятие')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '1', 'Пупкин ЧП')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('1', '2', 'Ступкин ООО')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('0', '2', 'Тип Оплаты')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '1', 'наличные')",
        // "INSERT INTO NMS (IdRoot, Id, Name) VALUES('2', '2', 'безнал')",
	];

	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 1, '4422','4423','Note')",
	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 2, '4422','6473','Note2')",
	// "INSERT INTO RMAP (DateDoc, Npp, IdC, IdT, sNote) VALUES('07-01-2014', 3, '4191','','Note3')",
	// "INSERT INTO BILM (DateDoc, IdC, IdT, sNote, sOther, sWars) VALUES('22.12.2013', '10','','Note', '1:2', '10:1;11:2')",
	// "INSERT INTO CLI (Id,  IdP, Name, Adres, GeoLoc) VALUES('10', '', 'Client10', 'Izhevsk KM/10', '56.844278,53.206272')",
	// "INSERT INTO CLI (Id,  IdP, Name, Adres, GeoLoc) VALUES('11', '10', 'FilOfClient10', 'Izhevsk2 KM/102222', '56.844278,53.206272')",

	return root;
})(jQuery, window);
