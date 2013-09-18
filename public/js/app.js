window.app = angular.module('tesedaApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'ngRoute', 'App.controllers', 'App.directives', 'App.filters', 'App.services', 'lvl.directives.dragdrop', 'lvl.directives.fileupload']).run(['$rootScope', '$location', '$anchorScroll', '$timeout', 'Global', function($rootScope, $location, $anchorScroll, $timeout, Global){

    $rootScope.global = Global;
    $rootScope.navCollapsed = true;

    $rootScope.isCurrentLocation = function(routeArray) {
      return _.contains(routeArray, $location.url());
    };

    $rootScope.scrollTo = function(id) {
      $location.hash(id);
      $timeout(function(){
        $anchorScroll();
      }, 300);

   };

    $rootScope.currentYear = new Date().getFullYear();

    $rootScope.safeApply = function(fn) {
      var phase;
      phase = this.$root.$$phase;
      if (phase !== "$apply" && phase !== "$digest") {
        return $rootScope.$apply(fn);
      }
    };


    $rootScope.$on("$routeChangeStart", function(e, next, current) {
      $rootScope.navCollapsed = true;
    });

    $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
      log("ROUTE CHANGE ERROR: " + rejection);
    });


}]);
