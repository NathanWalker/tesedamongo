window.angular.module('App.controllers').controller("ProductsCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$routeParams", "ProductsService", "PagesCache", "orderByFilter", function(s, $rootScope, $filter, $timeout, $routeParams, ProductsService, PagesCache, orderByFilter) {

      if($routeParams.product){
        ProductsService.query({shortUrl:'/products/' + $routeParams.product}, function (products) {
          s.product = _.first(products);
        });
      } else {
        PagesCache.getPage({route:'products'}).then(function (page) {
          s.page = page;
        });
        ProductsService.query({featured:true}, function (products) {
          s.products = orderByFilter(products, '+featuredOrder');
        });
      }

  }
]);
