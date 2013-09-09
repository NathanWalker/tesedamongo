window.app = angular.module('tesedaApp', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ngRoute', 'ngff.controllers', 'App.directives', 'App.filters', 'ngff.services']).run(['$rootScope', '$location', 'Global', function($rootScope, $location, Global){

    $rootScope.global = Global;
    $rootScope.navCollapsed = true;

    $rootScope.isCurrentLocation = function(routeArray) {
      return _.contains(routeArray, $location.url());
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

// bundling dependencies
window.angular.module('ngff.controllers', ['App.controllers','ngff.controllers.header','ngff.controllers.index','ngff.controllers.leagues','ngff.controllers.nfl','ngff.controllers.players']);
window.angular.module('ngff.services', ['ngff.services.fantasyTeams','ngff.services.global','ngff.services.leagues','ngff.services.nfl','ngff.services.players']);
