YogaScript.sequence = function (params) {

  var viewModel = {
    hideNavigationButton: true,
    namesec: ko.observable(''),
    id: params.id,
  	poses: ko.observable([]),
  };

  $.get('/api/sequences/' + viewModel.id)
  .done(function (data) {
    console.log("sequence: name=" + data.name + " poses=" + data.poses);
    viewModel.namesec(data.name);
    viewModel.poses(data.fullPoses);
  });

  return viewModel;    
};