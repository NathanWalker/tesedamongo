window.angular.module('App.services')
  .factory('SearchService', ['$rootScope', '$timeout', 'PagesService', 'PostsService', 'VideosService', 'ProductsService', 'SpecService',
    function($rootScope, $timeout, PagesService, PostsService, VideosService, ProductsService, SpecService){

      var api = {};

      api.searching = true;
      api.resultGroups = {
        page:{
          title:'Page',
          results:[]
        },
        news:{
          title:'News',
          results:[]
        },
        specs:{
          title:'Datasheet',
          results:[]
        },
        videos:{
          title:'Video',
          results:[]
        }
      };

      api.resetResults = function(){
        for(var key in api.resultGroups){
          api.resultGroups[key].results = [];
        }
      };

      api.search = function(input){
        api.searching = true;
        var populateResults = function(key, results){
          api.resultGroups[key].results = results;
          api.searching = false;
        };

        PagesService.query({content:input}, function(results){
          populateResults('page', results);
        });

        PostsService.query({search:input}, function(results){
          populateResults('news', results);
        });

        SpecService.query({search:input}, function(results){
          populateResults('specs', results);
        });

        VideosService.query({search:input}, function (results) {
          if(!$rootScope.global.isSignedIn()){
            // reject any exclusive videos because the user is not signed in and cannot see exclusive videos in results
            results = _.reject(results, function(v){
              return v.exclusive;
            });
          }
          populateResults('videos', results);
        });

      };

      api.noResults = function(){
        var noResults = true;
        for(var key in api.resultGroups){
          if(api.resultGroups[key].results.length>0){
            noResults = false;
          }
        }
        return noResults;
      };

      return api;
    }]);
