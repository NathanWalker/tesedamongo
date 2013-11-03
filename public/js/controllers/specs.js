window.angular.module('App.controllers').controller("SpecCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "PagesCache", "ngTableOptions", "orderByFilter", "$routeParams", function(s, $rootScope, $filter, $timeout, PagesCache, ngTableOptions, orderByFilter, $routeParams) {

      s.filtered = false;
      var allSpecFiles = [
        {
          _id:1,
          name:'test',
          description:'desc test',
          fileSize:232523,
          fileName:'test.pdf',
          order:2
        },
        {
          _id:2,
          name:'test 2',
          description:'desc test',
          fileSize:987897,
          fileName:'test2.pdf',
          order:1
        },
        {
          _id:3,
          name:'test 3',
          description:'desc test',
          fileSize:767565,
          fileName:'test3.pdf',
          order:3
        }
      ];

      if ($routeParams.spec) {
        s.filtered = true;
        s.otherSpecsTotal = allSpecFiles.length - 1;
        s.specFiles = _.select(allSpecFiles, function(file) {
          return file._id == $routeParams.spec;
        });
      } else {
        s.specFiles = allSpecFiles;
      }

      s.tableOptions = new ngTableOptions({
        page: 0,
        total: 0,
        count: 3,
        counts: [],
        sorting: {order:'asc'},
        paginationEnabled: false
      });
      s.$watch("tableOptions", function(params) {
        var orderedData;
        orderedData = params.sorting ? orderByFilter(s.specFiles, params.orderBy()) : s.specFiles;
        return s.specFiles = orderedData;
      }, true);

    PagesCache.getPage({route:'specs'}).then(function (page) {
      s.page = page;
    });
  }
]);
