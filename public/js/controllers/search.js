window.angular.module('App.controllers').controller("SearchCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "SearchService", function(s, $rootScope, $filter, $timeout, searchService) {

    s.searchService = searchService;

  }
]);
