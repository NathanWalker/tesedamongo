window.angular.module('App.filters', []).filter('booleanText', function() {
  return function(bool, trueText, falseText) {
    return bool ? trueText : falseText;
  };
});
