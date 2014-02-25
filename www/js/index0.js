


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
