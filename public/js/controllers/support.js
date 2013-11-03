window.angular.module('App.controllers').controller("SupportCtrl", ["$scope", "$rootScope", "$routeParams", "$filter", "$timeout", "PagesCache", function(s, $rootScope, $routeParams, $filter, $timeout, PagesCache) {

    PagesCache.getPage({route:'support'}).then(function (page) {
      s.page = page;
    });

    if ($routeParams.t == 'r'){
      $timeout(function(){
        angular.element('.nav-tabs li a').last().scope().select();
      }, 300);
    }
  }
]);
