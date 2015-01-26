window.angular.module('App.controllers')
  .controller('FooterController', ['$rootScope', '$scope', '$routeParams', 'PagesCache', function ($rootScope, s, $routeParams, PagesCache) {

    var resetNav = function(){
      PagesCache.pages().then(function(pages){
        s.pages = _.filter(pages, function(p){
          return p.navShow;
        });
      });
    };


    s.isPageActive = function(route) {
      if(route=='home' && $rootScope.isCurrentLocation(['/', ''])){
        // special case
        return true;
      } else {
        return $rootScope.isCurrentLocation(['/' + route]);
      }
    };

    s.$on(PagesCache.events.updatedPage, function(e, page) {
      // Anytime page is updated just reset nav
      resetNav();
    });

    resetNav();
}]);
