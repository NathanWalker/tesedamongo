window.app = angular.module('tesedaApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.highlight', 'ui.bootstrap', 'ui.sortable', 'ngRoute', 'App.controllers', 'App.directives', 'App.filters', 'App.services', 'lvl.directives.dragdrop', 'lvl.directives.fileupload', 'iso', 'ngTable'])
.value('iso.config', {
    refreshDelay: 300,
    refreshEvent: 'isotope:refresh'
})
.run(['$rootScope', '$location', '$window', '$anchorScroll', '$timeout', 'Global', 'SearchService', "SpecService", function($rootScope, $location, $window, $anchorScroll, $timeout, Global, searchService, SpecService){

    $rootScope.global = Global;
    $rootScope.navCollapsed = true;
    $rootScope.search = {
      active:false,
      input:''
    };
    $rootScope.loginForm = {
      active:false
    };
    $rootScope.accountDetail = {
      active:false
    };

    var searchSite = _.debounce(function(){
      searchService.search($rootScope.search.input);
    }, 400);

    $rootScope.$watch('search.input', function(value){
      if(value && value.length > 1) {
        searchSite();
      }
    });

    $rootScope.toggleTopSearch = function(){
      $rootScope.search.active=!$rootScope.search.active;
      $rootScope.loginForm.active=false;
      if ($rootScope.search.active){
        // always reset search results when initiating new searches
        searchService.resetResults();
        $timeout(function(){
          angular.element('.search-input-top input').select();
        }, 300);
      } else {
        // always reset search input when closing search input
        $rootScope.search.input = '';
      }
    };

    $rootScope.toggleTopLogin = function(){
      $rootScope.loginForm.active=!$rootScope.loginForm.active;
      $rootScope.search.active=false;
      if ($rootScope.loginForm.active){
        $timeout(function(){
          angular.element('.login-input-top input[name="username"]').select();
        }, 300);
      }
    };

    $rootScope.toggleAccountDetail = function(){
      $rootScope.accountDetail.active=!$rootScope.accountDetail.active;
      $rootScope.search.active=false;
    };

    $rootScope.isCurrentLocation = function(routeArray) {
      return _.contains(routeArray, $location.url());
    };

    $rootScope.scrollTo = function(id) {
      $location.hash(id);
      $timeout(function(){
        $anchorScroll();
      }, 300);

   };

   $rootScope.resetScroll = function(){
    $timeout(function(){
      angular.element('body, html').scrollTop(0);
    });
  };

    $rootScope.currentYear = new Date().getFullYear();

    $rootScope.safeApply = function(fn) {
      var phase;
      phase = this.$root.$$phase;
      if (phase !== "$apply" && phase !== "$digest") {
        return $rootScope.$apply(fn);
      }
    };

    $rootScope.$on("$locationChangeStart", function(e){
      if($location.url().indexOf('/datasheet') == 0){
        e.preventDefault();
        // download datasheet
        var id = _.last($location.url().split('/'));
        SpecService.query({_id:id}, function (specs) {
          if(specs){
            var datasheet = _.first(specs);
            $window.location.href = Global.imagePath() + datasheet.datasheetName;
          }
        });
      }
    });

    // $rootScope.$watch("navCollapsed", function() {
    //   $timeout(function(){
    //     $(window).trigger('resize');
    //   });

    // });


    $rootScope.$on("$routeChangeStart", function(e, next, current) {

      $rootScope.navCollapsed = true;
      $rootScope.search.active = false;
      $rootScope.search.input = '';
      $rootScope.loginForm.active = false;
      $rootScope.accountDetail.active = false;
    });

    $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
      // console.log("ROUTE CHANGE ERROR:");
      // console.log(rejection);
    });


}]);
