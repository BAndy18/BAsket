YogaScript.pose = function (params) {

  var viewModel = {
    hideNavigationButton: true,
    id: params.id,
    name: ko.observable(''),
    level: ko.observable(0),
    durMin: ko.observable(''),
    durMax: ko.observable(''),
    url: ko.observable(''),
    desc: ko.observable('')
  };

  $.get('/api/poses/' + viewModel.id)
  .done(function (data) {
    console.log("sequence: name=" + data.name);
    
    viewModel.name(data.name);
    viewModel.level(data.level);
    viewModel.durMin(data.durMin);
    viewModel.durMax(data.durMax);
    viewModel.url(data.url);
    viewModel.desc(data.desc);
  });

  return viewModel;    
};