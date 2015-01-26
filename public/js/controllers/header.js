window.angular.module('App.controllers')
  .controller('HeaderController', ['$rootScope', '$scope', '$timeout', '$routeParams', 'PagesCache', function ($rootScope, s, $timeout, $routeParams, PagesCache) {

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

    s.navCollapsed = true;

    s.$on(PagesCache.events.updatedPage, function(e, page) {
      // Anytime page is updated just reset nav
      resetNav();
    });

    s.$on('$routeChangeStart', function() {
      s.navCollapsed = true;
    });

    s.$watch('navCollapsed', function(value){
      // fix for weird issue on mobile where nav would not be visible
      $timeout(function(){
        angular.element('.nav-collapse.collapsing').css({top:(value ? '0px' : '28px'), position:'relative'});
      }, 300);
    });

    resetNav();
}]);
