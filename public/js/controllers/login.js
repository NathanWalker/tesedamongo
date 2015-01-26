window.angular.module('App.controllers').controller("LoginCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$routeParams", function(s, $rootScope, $filter, $timeout, $routeParams) {

      s.selectRegister = function() {
        angular.element('.nav-tabs li a').last().scope().select();
      };

      if($routeParams.f === '1'){
        s.failed = true;
      }
  }
]);
