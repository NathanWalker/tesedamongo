window.angular.module('App.services')
  .factory('PagesCache', ['PagesService', '$rootScope', '$timeout', '$q', 'orderByFilter', function(PagesService, $rootScope, $timeout, $q, orderByFilter){

    var _pages = [];
    var _initialized = false;
    var _killListener = undefined;
    var _events = {
      init:'pagesCache:init',
      updatedPage:'pagesCache:updatedPage'
    };

    var getCachedPage = function(query){
      var queryKey = _.first(_.keys(query));
      var page = _.find(_pages, function(p){
        return p[queryKey] == query[queryKey];
      });
      return page;
    };

    // load and cache all pages on init
    PagesService.query(function (pages) {
      _pages = pages;
      _initialized = true;
      $rootScope.$broadcast(_events.init);
    });

    return {
      isInitialized: function() {
        return _initialized;
      },
      events:_events,
      resetScroll:function(){
        $timeout(function(){
          angular.element('body, html').scrollTop(0);
        });
      },
      pages: function() {
        var defer = $q.defer();
        if(_initialized){
          defer.resolve(orderByFilter(_pages, 'order'));
        } else {
          $rootScope.$on(_events.init, function(){
            defer.resolve(orderByFilter(_pages, 'order'));
          });
        }
        return defer.promise;
      },
      getPage: function(query) {
        var defer = $q.defer();
        var resolvePage = function(){
          var page = getCachedPage(query);
          if(page){
            defer.resolve(page);
          } else {
            defer.reject();
          }
        };
        if(_initialized){
          resolvePage();
        } else {
          _killListener = $rootScope.$on(_events.init, function(){
            if (_killListener)
              _killListener();
            resolvePage();
          });
        }
        return defer.promise;
      },
      updatePage: function(page) {
        // find page in cache and update it
        var defer = $q.defer();
        page.$update(function () {
          // find page in cache and update it
          $rootScope.$broadcast(_events.updatedPage, page._id);
          defer.resolve();
        });
        return defer.promise;
      }
    };
  }]);
