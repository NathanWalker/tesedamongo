window.angular.module('App.controllers').controller("ProductsEditCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "ProductsService", "PagesCache", "orderByFilter", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, ProductsService, PagesCache, orderByFilter) {

      if(!Global.isSignedIn()){
        $location.path("support");
        return;
      }

      s.showNewForm = false;
      s.editing = false;

      var resetActiveProduct = function() {
        s.activeProduct = {
          name: '',
          description: '',
          content: '',
          shortUrl: '',
          featured: '',
          featureList: '',
          featuredOrder:0
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveProduct();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
        PagesCache.resetScroll();
      };


      s.products = [];

      var populateProducts = function(query) {
        ProductsService.query(query, function (products) {
          s.products = orderByFilter(products, '+featuredOrder');
        });
      };

      s.create = function (activeProduct) {
        if(s.editing){
          s.update(activeProduct);
        } else {

          var product = new ProductsService({
            name: activeProduct.name,
            description: activeProduct.description,
            content: activeProduct.content,
            shortUrl: activeProduct.shortUrl,
            featured: activeProduct.featured,
            featureList: activeProduct.featureList,
            featuredOrder: activeProduct.featuredOrder
          });

          product.$save(function (response) {
            if(response && response._id){
              s.products.push(response);
            }

            s.toggleNew(false);
            resetActiveProduct();
          });
        }

      };

      s.editProduct = function(product) {
        s.editing = true;
        s.activeProduct = product;
        s.toggleNew(true);
      };

      s.update = function (activeProduct) {
        activeProduct.$update(function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActiveProduct();
        });
      };

      s.find = function (query) {
        ProductsService.query(query, function (products) {
          s.products = products;
        });
      };

      s.findOne = function () {
        ProductsService.get({ productId: $routeParams.productId }, function (product) {
          s.product = product;
        });
      };

      s.remove = function (product) {
        if($window.confirm('Are you sure you want to delete?')){
          product.$remove();
          for (var i in s.products) {
            var listedProduct = s.products[i];
            if (listedProduct._id == product._id) {
              s.products.splice(i, 1);

              s.toggleNew(false);
              resetActiveProduct();
              break;
            }
          }
        }
      };

      if ($routeParams.productId) {
        s.findOne();
      } else {
        populateProducts();
        resetActiveProduct();
      }

  }
]);
