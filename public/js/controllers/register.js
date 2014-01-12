window.angular.module('App.controllers').controller("RegisterCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$routeParams", "$modal", function(s, $rootScope, $filter, $timeout, $location, $routeParams, $modal) {

      if($routeParams.f == '2') {
        s.failed = true;
        $timeout(function(){
          angular.element('.nav-tabs li a').last().scope().select();
        }, 300);


        if($routeParams.err && $routeParams.user){
          var paramUser = JSON.parse($routeParams.user);
          s.errors = JSON.parse($routeParams.err);

          $location.search('err', null);
          $location.search('user', null);
          $location.search('f', null);
          s.registerUser = {
            name:paramUser.name,
            company:paramUser.company,
            clientId:paramUser.clientId,
            username: paramUser.username
          };
        }
      }


      s.requestClientId = function(){
        var modalInstance = $modal.open({
          templateUrl: 'views/user/request-id.html',
          controller: ['$rootScope', '$scope', '$modalInstance', function($rootScope, s, $modalInstance){
            s.request = {
              name:'',
              email:'',
              phone:''
            };
            s.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]
        });
      };
  }
]);
