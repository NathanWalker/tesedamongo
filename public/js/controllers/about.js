window.angular.module('App.controllers').controller("AboutCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", function(s, $rootScope, $filter, $timeout, PagesCache) {

    PagesCache.getPage({route:'about'}).then(function (page) {
      s.page = page;
    });
  }
]);
