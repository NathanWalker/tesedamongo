window.angular.module('App.filters', []).filter('booleanText', function() {
  return function(bool, trueText, falseText) {
    return bool ? trueText : falseText;
  };
}).filter('arrayToTagClass', function(){
  return function(array) {
    return _.map(array, function(tag){ return tag.name.replace(/[ ]/ig, '-').replace(/[.]/ig, '-'); }).join(' ');
  };
});
