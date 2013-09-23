window.angular.module('App.controllers').controller("SupportCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", function(s, $rootScope, $filter, $timeout, PagesCache) {

    PagesCache.getPage({route:'support'}).then(function (page) {
      s.page = page;
    });
  }
]);
