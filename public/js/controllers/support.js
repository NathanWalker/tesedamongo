window.angular.module('App.controllers').controller("SupportCtrl", ["$scope", "$rootScope", "$routeParams", "$filter", "$timeout", "$location", "PagesCache", "$modal", function(s, $rootScope, $routeParams, $filter, $timeout, $location, PagesCache, $modal) {

    PagesCache.getPage({route:'support'}).then(function (page) {
      s.page = page;
    });

    if ($routeParams.t == 'r'){
      $timeout(function(){
        angular.element('.nav-tabs li a').last().scope().select();
      }, 300);
    }

    if($routeParams.request){
      if($routeParams.invalid){

        $timeout(function(){
          var modalInstance = $modal.open({
            templateUrl: 'views/user/request-id.html',
            controller: ['$scope', '$modalInstance', '$routeParams', function(s, $modalInstance, $routeParams){
              s.invalidData = true;
              s.request = {
                name:$routeParams.name,
                email:$routeParams.email,
                phone:$routeParams.phone
              };
              $location.search('request', null);
              $location.search('invalid', null);
              $location.search('name', null);
              $location.search('email', null);
              $location.search('phone', null);
              s.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }]
          });
        }, 300);
      } else {

        $timeout(function(){

          var modalInstance = $modal.open({
            templateUrl: 'views/user/request-success.html',
            controller: ['$scope', '$modalInstance', '$routeParams', '$location', function(s, $modalInstance, $routeParams, $location){
              $location.search('request', null);
              s.name = $routeParams.name;
              $location.search('name', null);
              s.ok = function () {
                $modalInstance.dismiss('cancel');
              };
            }]
          });
        }, 300);
      }
    }
  }
]);
