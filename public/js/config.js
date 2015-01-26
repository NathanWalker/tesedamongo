window.app.config(['$routeProvider', '$sceProvider', function($routeProvider, $sceProvider) {
	$sceProvider.enabled(false);

      $routeProvider
      .when('',
      {
          templateUrl: 'views/site/home.html',
          controller:'HomeCtrl',
          resolve: {
            pageLoad: ['$q', 'PagesCache', function($q, PagesCache){
              var defer = $q.defer();
              PagesCache.pages().then(function(pages){
                defer.resolve();
              });
              return defer.promise;
            }]
          }
      })
	.when('/',
	{
		templateUrl: 'views/site/home.html',
            controller:'HomeCtrl',
            resolve: {
            pageLoad: ['$q', 'PagesCache', function($q, PagesCache){
                var defer = $q.defer();
                PagesCache.pages().then(function(pages){
                  defer.resolve();
                });
                return defer.promise;
              }]
            }
	})
      .when('/products',
      {
        templateUrl:'views/site/products.html',
        controller:'ProductsCtrl'
      })
      .when('/products/edit',
      {
        templateUrl:'views/products/edit.html',
        controller:'ProductsEditCtrl'
      })
      .when('/products/:product',
      {
        templateUrl:'views/products/show.html',
        controller:'ProductsCtrl'
      })
      .when('/banner-edit',
      {
        templateUrl:'views/banner/edit.html',
        controller:'BannerEditCtrl'
      })
      .when('/tutorials',
      {
        templateUrl:'views/site/tutorials.html',
        controller:'VideosCtrl'
      })
      .when('/tutorials/:video',
      {
        templateUrl:'views/videos/show.html',
        controller:'VideosCtrl'
      })
      .when('/about',
      {
        templateUrl:'views/site/about.html',
        controller:'AboutCtrl'
      })
      .when('/contact',
      {
        templateUrl:'views/site/contact.html',
        controller:'ContactCtrl'
      })
      .when('/privacy',
      {
        templateUrl:'views/site/privacy.html'
      })
      .when('/partners',
      {
        templateUrl:'views/site/partners.html',
        controller:'PartnersCtrl'
      })
      .when('/specs',
      {
        templateUrl:'views/site/specs.html',
        controller:'SpecCtrl'
      })
      .when('/specs/:spec',
      {
        templateUrl:'views/site/specs.html',
        controller:'SpecCtrl'
      })
      .when('/support',
      {
        templateUrl:'views/site/support.html',
        controller:'SupportCtrl',
        reloadOnSearch:false
      })
      .when('/news',
      {
        templateUrl:'views/site/news.html',
        controller:'PostsCtrl'
      })
       .when('/news/:post',
      {
        templateUrl:'views/news/show.html',
        controller:'PostsCtrl'
      })
        .when('/images',
      {
        templateUrl:'views/site/images.html',
        controller:'ImagesCtrl'
      })
      .when('/images/:image',
      {
        templateUrl:'views/site/images.html',
        controller:'ImagesCtrl'
      })
       .when('/pages',
      {
        templateUrl:'views/site/pages.html',
        controller:'PagesCtrl'
      })
      .when('/pages/:page',
      {
        templateUrl:'views/site/pages.html',
        controller:'PagesCtrl'
      })
	.otherwise({redirectTo: '/'});
}]);

//Removing tomcat unspported headers
window.app.config(['$httpProvider', function($httpProvider, Configuration) {
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
}]);
