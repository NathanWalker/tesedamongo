window.angular.module('App.controllers').controller("RegisterCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$routeParams", function(s, $rootScope, $filter, $timeout, $routeParams) {

      if($routeParams.f == '2') {
        s.failed = true;
        $timeout(function(){
          angular.element('.nav-tabs li a').last().scope().select();
        }, 300);

      }
  }
]);
