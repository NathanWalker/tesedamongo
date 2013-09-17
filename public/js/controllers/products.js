window.angular.module('App.controllers').controller("ProductsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$routeParams", "ProductsService", "PagesService", "orderByFilter", function(s, $rootScope, $filter, $timeout, $routeParams, ProductsService, PagesService, orderByFilter) {

      if($routeParams.product){
        ProductsService.query({shortUrl:'/products/' + $routeParams.product}, function (products) {
          s.product = _.first(products);
        });
      } else {
        PagesService.query({route:'products'}, function (pages) {
          s.page = _.first(pages);
        });
        ProductsService.query({featured:true}, function (products) {
          s.products = orderByFilter(products, '+featuredOrder');
        });
      }

  }
]);
