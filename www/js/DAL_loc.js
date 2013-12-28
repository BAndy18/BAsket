/// *** local Web Data Base Access *** ///
var DAL_local = (function ($, window) {
    var root = {};

    var dbParam = null;    
    var dbLastQ = null;    
    var dbName = 'BAsketDB';
    var dbSize = 50000000;

    root.ClientsRoot = function (params){
        return root.ExecDataSource("SELECT * FROM CLI Where idPar='0'");  
    };    
    root.Clients = function (params){
        var cliPar = 0;
        if (params)
            cliPar = params;
        return root.ExecDataSource("SELECT * FROM CLI Where idPar='" + cliPar + "'");  
    };    
    root.RoadMap = function (params){
        return root.ExecDataSource("SELECT r.*, c.Name as cName, t.Name as tName FROM RMAP r Join CLI c On r.idCli=c.id Left Join CLI t On r.idTp=t.id");  
    };    

    root.BilM = function (params){
        return root.ExecDataSource("SELECT b.*, c.Name as cName, t.Name as tName FROM BILM b Join CLI c On b.idCli=c.id Left Join CLI t On b.idTp=t.id");
    };
    root.BilMById = function (params){
        return root.ExecDataSource("SELECT b.*, c.Name as cName, t.Name as tName FROM BILM b Join CLI c On b.idCli=c.id Left Join CLI t On b.idTp=t.id WHERE b.id='" + params + "'");
    };
    root.NMS = function (params){
        return root.ExecDataSource("SELECT * FROM NMS Where idRoot='" + params + "'");
    };

    root.DeleteBil = function (params){
        return root.ExecQuery("DELETE FROM BILM Where id='" + params + "'");
    };
    root.SaveBil = function(params){
        var query = "";
        if (params['id']) {
            query = "UPDATE BILM set DateDoc='"+ params['date'] +"', idCli='"+ params['idCli'] +"', idTp='"+ params['idTp'] +
                "', sNote='"+ params['Note'] + "', sWars='"+ params['sWars'] +
                "' WHERE id='" + params['id'] + "'"
        } else {
            query = "INSERT INTO BILM (DateDoc, idCli, idTp, sNote, sOther, sWars) VALUES('"+ params['date'] +
                "', '"+ params['idCli'] +"','"+ params['idTp'] +"','"+ params['Note'] + "', '', '" + params['sWars'] + "')"
        };
        return root.ExecQuery(query);
    }

    root.ExecDataSource = function(query, setQ){
        var dataSource = new DevExpress.data.DataSource({
            load: function (loadOptions) {
                if (loadOptions.refresh) 
                    return root.ExecQuery(query, setQ);
            },
            lookup: function(key){
                return 'lookup';
            }
        });
        return dataSource;
    }
    root.ExecQuery = function(query, setQ, tryExist){
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
                    if (setQ)
                        resrow = setQuant(resrow);
                    res.push(resrow);
                }
                deferred.resolve(res);
            }, function(err, err2){
                if (tryExist && err2.message && err2.message.indexOf('1 no such table:') > 0){
                    root.RecreateLocalDB();
                }
                else
                    errorCB("*ExecQuery sql*", err, err2);
            }
            );
        }, function(err, err2){errorCB("*ExecQuery*", err, err2);}
        );
        return deferred;
    }

    function setQuant(resrow){
        for (var i in P.arrayBAsket) {
            if (P.arrayBAsket[i].id == resrow.id) {
                resrow.quant = P.arrayBAsket[i].quant;
                return resrow;
            }
        }
        return resrow;
    }

    root.Categories = function (params){
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
        var dataSource = new DevExpress.data.DataSource({
            load: function (loadOptions) {
                if (loadOptions.refresh) {
                    var deferred = new $.Deferred();
                    db.transaction(function(tx) {
                        dbLastQ = "SELECT * FROM CAT";
                        //console.log("getWarByGrId: "+dbLastQ);
                        tx.executeSql(dbLastQ, [], function(tx, results) {
                            //console.log('getWarByGrId: прочитано ' + results.rows.length);
                            var res = [];
                            for (var i=0; i<results.rows.length; i++) {
                                res.push(results.rows.item(i));
                            }
                            deferred.resolve(res);
                        }, function(err, err2){errorCB("*readCat sql*", err, err2);}
                        );
                    }, function(err, err2){errorCB("*readCat*", err, err2);}
                    );
                    return deferred;
                }
            },
            lookup: function(key){
                return 'lookup';
            }

        });
        return dataSource;  
    };

    root.Products = function (params){
        var skip = 0;
        var PAGE_SIZE = 30;
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
        var dataSource = new DevExpress.data.DataSource({
            load: function (loadOptions) {
                if (loadOptions.refresh) {
                    skip = 0;
                }
                var deferred = new $.Deferred();
                db.transaction(function(tx) {
                    var srch = "";
                    if (params.search())
                         srch = " and (name LIKE '%" + params.search() + "%')";
                    dbLastQ = "SELECT * FROM WAR WHERE idGr='" + params.id + "'" + srch + " LIMIT " + PAGE_SIZE;
                    if (skip)
                        //dbLastQ += ", " + skip;
                        dbLastQ = "SELECT * FROM WAR WHERE idGr='" + params.id + "'" + srch + " LIMIT " + skip + ", " +  PAGE_SIZE;
                    tx.executeSql(dbLastQ, [], function(tx, results) {
                        skip += PAGE_SIZE;                    
                        var res = [];
                        for (var ir=0; ir<results.rows.length; ir++) {
                            var resrow = setQuant(results.rows.item(ir));
                            res.push(resrow);
                        }
                        deferred.resolve(res);
                    }, function(err, err2){errorCB("*readProducts sql*", err, err2);}
                    );
                }, function(err, err2){errorCB("*readProducts*", err, err2);}
                );
                return deferred;
            }
        });
        return dataSource;  
    }

    root.ProductDetails = function (params){
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);
        db.transaction(function(tx) {
            dbLastQ = "SELECT * FROM WAR WHERE id='" + params.id + "'";
            tx.executeSql(dbLastQ, [], function(tx, results) {
                // var quant = '0';
                // for (var i in P.arrayBAsket) {
                //     if (P.arrayBAsket[i].id == params.id) {
                //         quant = P.arrayBAsket[i].quant;
                //         break;
                //     }
                // }
                params.quant = '0';
                params = setQuant(params);
                if (results.rows.length > 0) {
                    params.model.name(results.rows.item(0).name),
                    params.model.price(results.rows.item(0).price.toFixed(2))
                    params.model.nameArt(results.rows.item(0).nameArt),
                    params.model.nameManuf(results.rows.item(0).nameManuf),
                    params.model.urlPict(results.rows.item(0).urlPict),
                    params.model.upak(results.rows.item(0).upak),
                    params.model.ostat(results.rows.item(0).ostat),
                    params.model.quant(params.quant)
                }
            }, function(err, err2){errorCB("*readProductDetail sql*", err, err2);}
            );
        }, function(err, err2){errorCB("*readProductDetail*", err, err2);}
        );
    }


    root.ProductsByWars = function (params){
        var ids = '';
        P.arrayBAsket = [];
        var w = params.split(';');
        for (var i in w) {
            var v = w[i].split(':');
            if (v[0]){
                P.arrayBAsket.push({'id':v[0], 'quant':v[1]});
                ids += "'" + v[0] + "',";
            }
        }
        return root.ExecDataSource("SELECT * FROM WAR WHERE id in (" + ids.substring(0, ids.length - 1) + ")", true);
    };


    root.ReadNews = function(){
        P.loadPanelVisible(true);

        root.RecreateLocalDB();
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);

        var source1 = DAL_web.Categories();
        if (Object.prototype.toString.call(source1) == '[object Array]')     writeToLocalData(db, source1, 'CAT');
        else                         source1.load().done(function (result) { writeToLocalData(db, result, 'CAT'); });

        var source2 = DAL_web.Products({id:0});
        if (Object.prototype.toString.call(source2) == '[object Array]')     writeToLocalData(db, source2, 'WAR');
        else                         source2.load().done(function (result) { writeToLocalData(db, result, 'WAR'); });

        var source3 = DAL_web.Clients();
        if (Object.prototype.toString.call(source3) == '[object Array]')     writeToLocalData(db, source3, 'CLI');
        else                         source3.load().done(function (result) { writeToLocalData(db, result, 'CLI'); });

    };
    root.RecreateLocalDB = function(){
        var db = window.openDatabase(dbName, "1.0", dbName, dbSize);

        db.transaction(function(tx){
            //P.loadPanelVisible(true);
            console.log('Local DB SCRIPT');
            for (i = 0; i < P.LocalScript.length; i++){
                // dbLastQ = P.LocalScript[i];
                // tx.executeSql(dbLastQ);
                root.ExecQuery(P.LocalScript[i], true);
            }
            //P.loadPanelVisible(false);
        })
    };

    // root.ExecDataSource2 = function(query){
    //     debugger;
    //     var dataSource = DevExpress.data.createDataSource({
    //         load: function (loadOptions) {
    //             if (loadOptions.refresh) 
    //                 return root.ExecQuery(query);
    //         },
    //         lookup: function(key){
    //             return 'lookup';
    //         }
    //     });
    //     return dataSource;
    // }


    var arrWAR;
    var arrCAT;
    function writeToLocalData(db, dataArray, table) {

        //dbParam = {'array':dataArray, 'tab':table};
        if (table == 'CAT') {
            arrCAT = dataArray;
            db.transaction(writeToCAT, 
                function(err, err2) {errorCB("*write " + table + "*", err, err2);}, 
                function() {console.log("write " + table + ": success");});
        } 
        if (table == 'WAR') {
            arrWAR = dataArray;
            db.transaction(writeToWAR, 
                function(err, err2) {errorCB("*write " + table + "*", err, err2);}, 
                function() {console.log("write " + table + ": success");});
        }
        if (table == 'CLI') {
            arrCLI = dataArray;
            db.transaction(writeToCLI, 
                function(err, err2) {errorCB("*write " + table + "*", err, err2);}, 
                function() {console.log("write " + table + ": success");});
        }

        //db.transaction(writeToDB, function(err, err2) {errorCB("*writeWars ***", err, err2);}, successCB1);
    }

    function writeToCAT(tx) {
            var arr = arrCAT;
            var i, maxlen = 50000;
            //tx.executeSql("BEGIN TRANSACTION");
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            //console.log('writeWars: writing=' + len);
                for (i = 0; i < len; i++) { 
                dbLastQ = "INSERT INTO CAT (id, name) VALUES('" + arr[i].id + "','" + arr[i].name + "')"
                tx.executeSql(dbLastQ);
            }
            //tx.executeSql("COMMIT TRANSACTION", errorCB);
            console.log('Прочитано записей: ' + i);
    }
    function writeToWAR(tx, arr) {
            var arr = arrWAR;
            var i, maxlen = 50000;
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            //console.log('writeWars: writing=' + len);
            //tx.executeSql("BEGIN TRANSACTION");
            for (i = 0; i < len; i++) { 
                dbLastQ = "INSERT INTO WAR (id, idGr, name, price, nameArt, nameManuf, urlPict, upak, ostat) VALUES('" + arr[i].id + "','"  + arr[i].idGr + "','" 
                    + arr[i].name + "','" + arr[i].price + "','" 
                    + arr[i].nameArt + "','" + arr[i].nameManuf + "','" + arr[i].urlPict + "','" + arr[i].upak + "','" + arr[i].ostat
                    + "')"

                tx.executeSql(dbLastQ);
            }
            //tx.executeSql("COMMIT TRANSACTION", errorCB);
            console.log('Прочитано записей: ' + i);
        P.loadPanelVisible(false);            
    }
    function writeToCLI(tx) {
            var arr = arrCLI;
            var i, maxlen = 50000;
            //tx.executeSql("BEGIN TRANSACTION");
            var len = arr.length;   // < maxlen? arr.length:maxlen;
            //console.log('writeWars: writing=' + len);
                for (i = 0; i < len; i++) { 
                dbLastQ = "INSERT INTO CLI (id, idPar, name, adres) VALUES('" + arr[i].id + "','" + arr[i].idPar + "','" + arr[i].Name + "','" + arr[i].Adres + 
                    //"','" + arr[i].geoLoc + 
                    "')"
                tx.executeSql(dbLastQ);
            }
            //tx.executeSql("COMMIT TRANSACTION", errorCB);
            console.log('Прочитано записей: ' + i);
    }


    // Transaction error callback
    //
    function errorCB(src, err, err2) {
        var message = (err) ? ((err.message) ? err.message : err2.message) : src;
        var code =  (err) ? ((err.code || (err && err.code == 0)) ? err.code : err2.code) :"";
        console.log(src + " SQLError: " + message + '('+ code +') dbLastQ=' + dbLastQ);
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

    return root;
})(jQuery, window);
