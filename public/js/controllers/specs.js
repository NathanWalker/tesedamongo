window.angular.module('App.controllers').controller("SpecCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", function(s, $rootScope, $filter, $timeout, PagesCache) {

    PagesCache.getPage({route:'specs'}).then(function (page) {
      s.page = page;
    });
  }
]);
