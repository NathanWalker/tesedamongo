window.angular.module('App.controllers').controller("ProductsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$routeParams", "ProductsService", function(s, $rootScope, $filter, $timeout, $routeParams, ProductsService) {

      if($routeParams.product){
        ProductsService.get({productId:$routeParams.product}, function (product) {
          s.product = product;
        });
      } else {
        ProductsService.query(function (products) {
          s.products = products;
        });
      }

  }
]);
