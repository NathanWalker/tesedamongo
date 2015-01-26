window.angular.module('App.controllers').controller("ContactCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", function(s, $rootScope, $filter, $timeout, PagesCache) {

    PagesCache.getPage({route:'contact'}).then(function (page) {
      s.page = page;
    });
  }
]);
