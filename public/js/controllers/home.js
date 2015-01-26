window.angular.module('App.controllers').controller("HomeCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", "BannerService", function(s, $rootScope, $filter, $timeout, PagesCache, BannerService) {
    s.carouselInterval = 6000;
    s.slides = [
      {
        active: true,
        view: 'views/banner/1.html'
      }, {
        active: false,
        view: 'views/banner/2.html'
      }, {
        active: false,
        view: 'views/banner/3.html'
      }, {
        active: false,
        view: 'views/banner/4.html'
      }
    ];
    s.slides2 = [
      {
        active: true,
        view: 'assets/carousel_1.jpg'
      }, {
        active: false,
        view: 'assets/carousel_2.gif'
      }, {
        active: false,
        view: 'assets/carousel_3.gif'
      }
    ];

    BannerService.query({route:'home'}, function (banners) {
        s.banner = _.first(banners);
      });

    PagesCache.getPage({route:'home'}).then(function (page) {
      s.page = page;
    });
  }
]);
