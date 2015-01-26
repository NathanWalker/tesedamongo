window.angular.module('App.filters', []).filter('booleanText', function() {
  return function(bool, trueText, falseText) {
    return bool ? trueText : falseText;
  };
}).filter('arrayToTagClass', function(){
  return function(array) {
    return _.map(array, function(tag){ return tag.name.replace(/[ ]/ig, '-').replace(/[.]/ig, '-'); }).join(' ');
  };
}).filter("capitalize", function(){
  return function(input, scope) {
      return input.substring(0,1).toUpperCase()+input.substring(1);
  };
}).filter("fileSize", function() {

  return function(bytes) {
    var byteString;
    if (_.isUndefined(bytes) || _.isNull(bytes) || bytes === 'null') {
      return '0 Bytes';
    }
    byteString = "";
    switch (true) {
      case bytes < Math.pow(2, 10):
        byteString = bytes + " Bytes";
        break;
      case bytes >= Math.pow(2, 10) && bytes < Math.pow(2, 20):
        byteString = Math.round(bytes / Math.pow(2, 10)) + " KB";
        break;
      case bytes >= Math.pow(2, 20) && bytes < Math.pow(2, 30):
        byteString = Math.round((bytes / Math.pow(2, 20)) * 10) / 10 + " MB";
        break;
      case bytes > Math.pow(2, 30):
        byteString = Math.round((bytes / Math.pow(2, 30)) * 100) / 100 + " GB";
    }
    return byteString;
  };
});
