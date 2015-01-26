window.angular.module('App.controllers').controller("PartnersCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", function(s, $rootScope, $filter, $timeout, PagesCache) {

    PagesCache.getPage({route:'partners'}).then(function (page) {
      s.page = page;
    });


  }
]);
