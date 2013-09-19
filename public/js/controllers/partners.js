window.angular.module('App.controllers').controller("PartnersCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesService", function(s, $rootScope, $filter, $timeout, PagesService) {

    PagesService.query({route:'partners'}, function (pages) {
          s.page = _.first(pages);
        });


  }
]);
