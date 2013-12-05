YogaScript.training = function (params) {
  var id = 1; //params.id
  if (params.id) {
    id = params.id;
  }
  var skip = 0;
  var PAGE_SIZE = 10;
  var elementsVisible = true;
  var lookupVisible = false;

  /*if (id < 0) {
      elementsVisible = false; 
      lookupVisible = true;
  }*/
  
  var viewModel = {
      isStarted: false,
      id: id,
      searchString: ko.observable(''),
      elementsVisible: elementsVisible,
      lookupVisible: lookupVisible,
      currentValue: 0,
      durMax: $("#durMax").text().replace("m","")*60000,
      
      getMessage: function() {
        return this.isStarted ? "START" : "STOP";
      },
      
      modeMessage: ko.observable("START"),
      
      startStop: function() {
        var msg = this.getMessage();
        this.isStarted = !this.isStarted;
        this.modeMessage(msg);
        YogaScript.notify(this.getMessage());
      },
      
      trainingDate: moment().format('ddd, DD MMM, ha'),
      
      completionPercent: ko.observable(20),
      dataSource: ko.observable([]),
      selectedId: ko.observable(),

       processValueChange: function() {
        this.id = this.selectedId;
        if (this.id >= 0)
        {
          YogaScript.app.navigate("training/" + this.selectedId);
        }
      },

      sequences: DevExpress.data.createDataSource({
        load: function (loadOptions) {
          if (loadOptions.refresh) {
            skip = 0;
          }
          var deferred = new $.Deferred();
          
          $.get('/api/sequences',
          {
            skip: skip,
            take: PAGE_SIZE,
            searchString: viewModel.searchString()
          })
          .done(function (result) {
            //Console.log(result);
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
      }),

      showProgress: function() {
          this.durMax= $("#durMax").text().replace("m","")*60000;
          setInterval(function(){
            if (this.currentValue<this.durMax) {
              this.currentValue += 3000/this.durMax;
            }
          },
          3000);
      }

  };
  
  $.get('/api/sequences/' + viewModel.id)
  .done(function (data) {
    console.log("sequence: name=" + data.name + " poses=" + data.poses);
    
    viewModel.dataSource(data.fullPoses);
    // var pos = [];
    // data.poses.forEach(function(p){
		 // pos.push(myposes[p]);
    // });
    // viewModel.dataSource(pos);
  });

  return viewModel;    
 
};