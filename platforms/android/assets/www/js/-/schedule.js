  //var queryWasExecute = false;
YogaScript.schedule = function (params) {
	var skip = 0;
	var PAGE_SIZE = 10;

    //var loadSchedule = function(){      
        var dayNum = dateFrom.getDay();
        dayNum = (dayNum - 1 >= 0)?(dayNum - 1):6;
        dateFrom.setDate(dateFrom.getDate() - dayNum +7*weekNum);
        var day = dateFrom.getUTCDate();
        var month = dateFrom.getUTCMonth();
        scheduleDataDays = [{name:'Mo '}, {name:'Tu '}, {name:'We '}, {name:'Th '}, {name:'Fr '}, {name:'Sa '}, {name:'Su '}];

        for(var i = 0;i<7;i++)
        {
            leftArray[i] = {name:"", id: null, num:i*2};
            rightArray[i] = {name:"", id: null, num:i*2+1};
            scheduleDataDays[i].name = scheduleDataDays[i].name + (day + i);
        }
        $.each(/*DevExpress.data.createDataSource({
          load: function (loadOptions) {
            if (loadOptions.refresh) {
              //dateFrom = 0;
            }
            var deferred = new $.Deferred();
            //$.get('http://sampleservices.devexpress.com/api/Products',
            $.get('/api/schedule',
            {
              dateFrom: dateFrom
            })
            .done(function (result) {
              //Console.log(result);
              var mapped = $.map(result, function (data) {
                return {
                  id: data.id,
                  name: data.name,
                  num : data.num
                };
              });
              deferred.resolve(mapped);
            });
            return deferred;
          }
        })*/
        [
            {name:"Surya Namascar 1", id: 1, num:0},
            {name:"Surya Namascar 2", id: 3, num:3},
            {name:"Chandra Namascar", id: 2, num:6},
            {name:"Surya Namascar 1", id: 1, num:11}
            ]
            , function(i, el){if(el.num%2==0)
                {leftArray[el.num/2] = el;}
            else
                {rightArray[(el.num-1)/2] = el;} 
            });



    scheduleDataLeft = leftArray;
    scheduleDataRight = rightArray;
	scheduleDataDays = scheduleDataDays;
	onItemRender = function (itemData , itemIndex, itemElement ) {
            if (itemData.id == null) {
                itemElement.html(itemData.name);
                return;
            }
			itemElement.attr('data-bind', "text: name, dxAction: dodo").attr('data-options', "dxTemplate : { name: 'item' }").html(itemData.name);
			

			
        };
		
    sequencelistSrc = DevExpress.data.createDataSource({
		 lookup: function (lookupOptions)
		 {},
      load: function (loadOptions) {
        if (loadOptions.refresh) {
          skip = 0;
        }
        var deferred = new $.Deferred();
        //queryWasExecute = true;
        $.get('/api/sequences',
        {
          skip: skip,
          take: PAGE_SIZE,
          searchString: ''
        })
        .done(function (result) {
          //Console.log(result);
	/*	if(queryWasExecute){
			queryWasExecute = false;
			result.push({id:0, name:' '});
		}*/
          skip += PAGE_SIZE;
          var mapped = $.map(result, function (data) {
            return {
              name: data.name,
              id: data.id
            };
          });
          deferred.resolve(mapped);
        });
        return deferred;
      }
    });
	//sequencelistSrc = sequencelistSource();

    actionSheetVisible = ko.observable(false);
    actionSheetData = [
    {text:"Reply", clickAction: function(){ processClick("Reply")}},
    {text:"ReplyAll", clickAction: function(){ processClick("ReplyAll")}},
    {text:"Forward", clickAction: function(){ processClick("Forward")}},
    {text:"Delete", clickAction: function(){ processClick("Delete")}}
    ];
    processClick = function(name){
    DevExpress.ui.notify( name + " clicked", "success", 3000 );
    };
    showActionSheet = function () {
    actionSheetVisible(true);
    };


};
