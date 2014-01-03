/// *** local Web Data Base Access *** ///
var DAL = (function ($, window) {
    var root = {};

    var dbParam = null;    
    var dbLastQ = null;    
    var dbName = 'BAsketDB';
    var dbSize = 50000000;

    root.Categories = function (params){
        if (P.dataSouceType == "DAL_web")
            return DAL_web.Categories(params);
        
        return execDataSource({query: "SELECT * FROM CAT"});
    };
    root.Products = function (params){
        if (P.dataSouceType == "DAL_web")
            return DAL_web.Products(params);
        
        return execDataSource({query: "SELECT * FROM WAR WHERE IdGr='" + params.Id + "'", 
            paging: true,
            searchString: params.search
            }, function(data){
                for (var i in P.arrayBAsket) {
                    if (P.arrayBAsket[i].Id == data.Id) {
                        data.Quant = P.arrayBAsket[i].Quant;
                    }
                }
                return data;    
        });
    }
    root.ProductDetails = function (params){
        if (P.dataSouceType == "DAL_web")
            return DAL_web.ProductDetails(params);
        
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
        db.transaction(function(tx) {
            dbLastQ = "SELECT * FROM WAR WHERE Id='" + params.Id + "'";
            tx.executeSql(dbLastQ, [], function(tx, results) {
                params.Quant = '0';
                params = setQuant(params);
                if (results.rows.length > 0) {
                    params.model.Name(results.rows.item(0).Name),
                    params.model.Price(results.rows.item(0).Price.toFixed(2))
                    params.model.NameArt(results.rows.item(0).NameArt),
                    params.model.NameManuf(results.rows.item(0).NameManuf),
                    params.model.UrlPict(results.rows.item(0).UrlPict),
                    params.model.Upak(results.rows.item(0).Upak),
                    params.model.Ostat(results.rows.item(0).Ostat),
                    params.model.Quant(params.Quant)
                }
            }, function(err, err2){errorCB("*readProductDetail sql*", err, err2);}
            );
        }, function(err, err2){errorCB("*readProductDetail*", err, err2);}
        );
    }


    root.Clients = function (params){
        if (P.dataSouceType == "DAL_web")
            return DAL_web.Clients(params);
        
        var param = {query: "SELECT * FROM CLI Where IdPar='0'", paging: true};
        if (params && params.search)
            param.searchString = params.search;

        return execDataSource(param);  
    };    
    root.ClientsPar = function (params){
        if (P.dataSouceType == "DAL_web")
            return DAL_web.ClientsPar(params);
        
        return execDataSource({query: "SELECT * FROM CLI Where IdPar='" + params + "'"});  
    }

    root.RoadMap = function (params){
        return execDataSource({query: "SELECT r.*, c.Name as cName, t.Name as tName FROM RMAP r Join CLI c On r.IdCli=c.Id Left Join CLI t On r.IdTp=t.Id"});
    };    

    root.BilM = function (params){
        return execDataSource({query: "SELECT b.*, c.Name as cName, t.Name as tName FROM BILM b Join CLI c On b.IdCli=c.Id Left Join CLI t On b.IdTp=t.Id"});
    };
    root.BilMById = function (params){
        return execDataSource({query: "SELECT b.*, c.Name as cName, t.Name as tName FROM BILM b Join CLI c On b.IdCli=c.Id Left Join CLI t On b.IdTp=t.Id WHERE b.Id='" + params + "'"});
    };


    root.DeleteBil = function (params){
        return execQuery("DELETE FROM BILM Where Id='" + params + "'");
    };
    root.SaveBil = function(params){
        var query = "";
        if (params['id']) {
            query = "UPDATE BILM set DateDoc='"+ params['date'] +"', IdCli='"+ params['idCli'] +"', IdTp='"+ params['idTp'] +
                "', sNote='"+ params['Note'] + "', sOther='"+ params['sOther'] + "', sWars='"+ params['sWars'] +
                "' WHERE Id='" + params['id'] + "'"
        } else {
            query = "INSERT INTO BILM (DateDoc, IdCli, IdTp, sNote, sOther, sWars) VALUES('"+ params['date'] +
                "', '"+ params['idCli'] +"','"+ params['idTp'] +"','"+ params['Note'] + "', '"+ params['sOther'] + 
                "', '" + params['sWars'] + "')"
        };
        return execQuery(query);
    }

    root.NMS = function (params){
        return execQuery("SELECT * FROM NMS Where IdRoot='" + params + "'");
    };

    root.CatFirst = function (params){
        return execQuery('SELECT * FROM CAT LIMIT 1');
    }

    root.CountTable = function (params){
        return execQuery("SELECT count(Id) as cnt FROM " + params);
    };

    root.ProductsByWars = function (params){
        var ids = '';
        P.arrayBAsket = [];
        var w = params.split(';');
        for (var i in w) {
            var v = w[i].split(':');
            if (v[0]){
                P.arrayBAsket.push({'Id':v[0], 'Quant':v[1]});
                ids += "'" + v[0] + "',";
            }
        }
        return execQuery("SELECT * FROM WAR WHERE Id in (" + ids.substring(0, ids.length - 1) + ")", true);
    };


    root.ReadNews = function(){
        P.loadPanelVisible(true);

        RecreateLocalDB();
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);

        var source1 = DAL_web.Categories();
        if (Object.prototype.toString.call(source1) == '[object Array]')     writeToLocalData(db, source1, 'CAT');
        else                         source1.load().done(function (result) { writeToLocalData(db, result, 'CAT'); });

        var source2 = DAL_web.Products({Id:'all'});
        if (Object.prototype.toString.call(source2) == '[object Array]')     writeToLocalData(db, source2, 'WAR');
        else                         source2.load().done(function (result) { writeToLocalData(db, result, 'WAR'); });

        var source3 = DAL_web.Clients({IdAll:'all'});
        if (Object.prototype.toString.call(source3) == '[object Array]')     writeToLocalData(db, source3, 'CLI');
        else                         source3.load().done(function (result) { writeToLocalData(db, result, 'CLI'); });

        var date = new Date()
        P.itemCount['ReadNews'] = P.ChangeValue('ReadNews', date.getDate() + '.' + date.getMonth()+1);
    };


    function execDataSource(params, mapCallback){
        var dataSource = new DevExpress.data.DataSource({
            pageSize: P.pageSize, 
            load: function (loadOptions) {
                if (params.paging) {
                    params['skip'] = loadOptions.skip;
                    params['take'] = loadOptions.take;
                }
                if (loadOptions.searchExpr && loadOptions.searchValue)
                    params['searchValue'] = loadOptions.searchValue;
                else
                    params['searchValue'] = null;
                var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
                var deferred = new $.Deferred();
                db.transaction(function(tx) {
                    dbLastQ = params.query;
                    var searchValue = '';
                    if (params.searchString && params.searchString())
                        searchValue = params.searchString();
                    else if (params['searchValue'])
                        searchValue = params['searchValue'];
                    if (searchValue)
                         dbLastQ += " and (Name LIKE '%" + searchValue + "%')";

                    if (params.paging)
                        dbLastQ += " LIMIT " + params['skip'] + ", " +  params['take'];

                    tx.executeSql(dbLastQ, [], function(tx, results) {
                        var res = [];
                        for (var i=0; i<results.rows.length; i++) {
                            var resrow = results.rows.item(i);
                            if (mapCallback)
                                resrow = mapCallback(resrow)
                            res.push(resrow);
                        }
                        deferred.resolve(res);
                    }, function(err, err2){errorCB("*execDataSource sql*", err, err2);}
                    );
                }, function(err, err2){errorCB("*execDataSource*", err, err2);}
                );
                return deferred;
            },
            lookup: function(key){
                return 'lookup';
            }
        });
        return dataSource;
    }

    function execQuery(query, mapCallback, tryExist){
        var skip = 0;
        var PAGE_SIZE = 30;
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
        var deferred = new $.Deferred();
        db.transaction(function(tx) {
            dbLastQ = query;
            tx.executeSql(dbLastQ, [], function(tx, results) {
                var res = [];
                for (var i=0; i<results.rows.length; i++) {
                    var resrow = results.rows.item(i);
                    if (mapCallback)
                        resrow = mapCallback(resrow);
                    res.push(resrow);
                }
                deferred.resolve(res);
            }, function(err, err2){
                if (tryExist && err2.message && err2.message.indexOf('1 no such table:') > 0){
                    root.RecreateLocalDB();
                }
                else
                    errorCB("*execQuery sql*", err, err2);
            }
            );
        }, function(err, err2){errorCB("*execQuery*", err, err2);}
        );
        return deferred;
    }

    function setQuant(resrow){
        for (var i in P.arrayBAsket) {
            if (P.arrayBAsket[i].Id == resrow.Id) {
                resrow.Quant = P.arrayBAsket[i].Quant;
                return resrow;
            }
        }
        return resrow;
    }


    function RecreateLocalDB(){
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);

        db.transaction(function(tx){
            //P.loadPanelVisible(true);
            trace('Local DB SCRIPT');
            for (i = 0; i < P.LocalScript.length; i++){
                // dbLastQ = P.LocalScript[i];
                // tx.executeSql(dbLastQ);
                //execQuery(P.LocalScript[i], null, true);
                tx.executeSql(P.LocalScript[i], [], function(tx, results) {}, 
                    function(err, err2){errorCB("*RecreateLocalDB*", err, err2);}
                );
            }
            //P.loadPanelVisible(false);
        })
    };


    var arrWAR;
    var arrCAT;
    function writeToLocalData(db, dataArray, table) {

        //dbParam = {'array':dataArray, 'tab':table};
        if (table == 'CAT') {
            arrCAT = dataArray;
            db.transaction(writeToCAT, 
                function(err, err2) {errorCB("*write " + table + "*", err, err2);}, 
                function() {trace("write " + table + ": success");});
        } 
        if (table == 'WAR') {
            arrWAR = dataArray;
            db.transaction(writeToWAR, 
                function(err, err2) {errorCB("*write " + table + "*", err, err2);}, 
                function() {trace("write " + table + ": success");});
        }
        if (table == 'CLI') {
            arrCLI = dataArray;
            db.transaction(writeToCLI, 
                function(err, err2) {errorCB("*write " + table + "*", err, err2);}, 
                function() {trace("write " + table + ": success");});
        }

        //db.transaction(writeToDB, function(err, err2) {errorCB("*writeWars ***", err, err2);}, successCB1);
    }

    function writeToCAT(tx) {
        P.loadPanelVisible(true);
            var arr = arrCAT;
            var i, maxlen = 50000;
            //tx.executeSql("BEGIN TRANSACTION");
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            //console.log('writeWars: writing=' + len);
                for (i = 0; i < len; i++) { 
                dbLastQ = "INSERT INTO CAT (Id, Name) VALUES('" + arr[i].Id + "','" + arr[i].Name + "')"
                tx.executeSql(dbLastQ, [], function(tx, results) {}, 
                    function(err, err2){errorCB("*writeToCAT sql*", err, err2);}
                );
            }
            //tx.executeSql("COMMIT TRANSACTION", errorCB);
            trace('Прочитано записей: ' + i);
        P.loadPanelVisible(false);            
    }
    function writeToWAR(tx, arr) {
        P.loadPanelVisible(true);
            var arr = arrWAR;
            var i, maxlen = 50000;
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            //console.log('writeWars: writing=' + len);
            //tx.executeSql("BEGIN TRANSACTION");
            for (i = 0; i < len; i++) { 
                arr[i].NameArt = (arr[i].NameArt) ? arr[i].NameArt:'';
                arr[i].NameManuf = (arr[i].NameManuf) ? arr[i].NameManuf:'';
                arr[i].UrlPict = (arr[i].UrlPict) ? arr[i].UrlPict:'';
                dbLastQ = "INSERT INTO WAR (Id, IdGr, Name, Price, NameArt, NameManuf, UrlPict, Upak, Ostat) VALUES('" 
                    + arr[i].Id + "','"  + arr[i].GrId + "','" + arr[i].Name + "','" + arr[i].Price + "','" 
                    + arr[i].NameArt + "','" + arr[i].NameManuf + "','" + arr[i].UrlPict + "','" + arr[i].Upak + "','" + arr[i].Ostat
                    + "')"

                tx.executeSql(dbLastQ, [], function(tx, results) {}, 
                    function(err, err2){errorCB("*writeToWAR sql*", err, err2);}
                );
            }
            //tx.executeSql("COMMIT TRANSACTION", errorCB);
            trace('Прочитано записей: ' + i);
        P.loadPanelVisible(false);            
    }
    function writeToCLI(tx) {
        P.loadPanelVisible(true);
            var arr = arrCLI;
            var i, maxlen = 50000;
            //tx.executeSql("BEGIN TRANSACTION");
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            //console.log('writeWars: writing=' + len);
                for (i = 0; i < len; i++) { 
                dbLastQ = "INSERT INTO CLI (Id, IdPar, Name, Adres) VALUES('" 
                    + arr[i].Id + "','" + arr[i].IdPar + "','" + arr[i].Name + "','" + arr[i].Adres + 
                    //"','" + arr[i].geoLoc + 
                    "')"
//                tx.executeSql(dbLastQ);
                tx.executeSql(dbLastQ, [], function(tx, results) {}, 
                    function(err, err2){errorCB("*writeToCLI sql*", err, err2);}
                );
            }
            //tx.executeSql("COMMIT TRANSACTION", errorCB);
            trace('Прочитано записей: ' + i);
            P.itemCount['Clients'] = P.ChangeValue('Clients', i);

        P.loadPanelVisible(false);            
    }


    // Transaction error callback
    //
    function errorCB(src, err, err2) {
        var message = (err) ? ((err.message) ? err2.message : err2.message) : src;
        var code =  (err) ? ((err.code || (err && err.code == 0)) ? err2.code : err2.code) :"";
        trace(src + " SQLError: " + message + '('+ code +') dbLastQ=' + dbLastQ);
        return false;
    }
    // Transaction success callback
    //
    function successCB() {
        //var db = window.openDatabase("Database", "1.0", "Cordova Demo", dbSize);
        //db.transaction(queryDB, errorCB);
    }
    // function consoleOut(str, skipbr) {
    //     var element = document.getElementById('consoleOut');
    //     if (element)
    //         if (skipbr)
    //             element.innerHTML = str;
    //         else
    //             element.innerHTML += str + '<br />';
    // }






    function successCB1() {
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
        db.transaction(queryDB1, errorCB);
    }
    function queryDB1(tx) {
        var tab = dbParam['tab'];
        tx.executeSql('SELECT * FROM ' + tab, [], querySuccess1, errorCB);
    }
    function querySuccess1(tx, results) {
        var len = results.rows.length;
        console.log("CAT table: " + len + " rows found.");
        maxlen = 50;
        var len = len < maxlen? len:maxlen;
        for (var i=0; i<len; i++){
           console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Name =  " + results.rows.item(i).name);
        }
    }
    function consoleOut(str) {
        var element = document.getElementById('consoleOut');
        element.innerHTML += str + '<br />';
    }
    function trace(str) {
        if (P.debugMode)
            consoleOut(str);
        else
            console.log(str);
    }

    return root;
})(jQuery, window);
