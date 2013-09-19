window.angular.module('App.controllers').controller("PagesCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "PagesService", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, PagesService) {


      if(!Global.isAdmin()){
        // unauthorized, redirect to home
        $location.url('/');
        return;
      }

      s.showNewForm = false;
      s.editing = false;

      var resetActivePage = function() {
        s.activePage = {
          title: '',
          subheading: '',
          content: '',
          route:''
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActivePage();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
      };


      s.pages = [];

      var populatePages = function(query) {
        PagesService.query(query, function (pages) {
          s.pages = pages;

          if ($routeParams.page) {
            var foundPage = _.find(s.pages, function(p){
              return p._id == $routeParams.page;
            });
            if(foundPage){
              s.editPage(foundPage);
            }
          }
        });


      };

      s.create = function (activePage) {
        if(s.editing){
          s.update(activePage);
        } else {

          var page = new PagesService({
            title: activePage.title,
            subheading: activePage.subheading,
            content: activePage.content,
            route: activePage.route
          });

          page.$save(function (response) {
            if(response && response._id){
              s.pages.push(response);
            }

            s.toggleNew(false);
            resetActivePage();
          });
        }

      };

      s.editPage = function(page) {
        s.editing = true;
        s.activePage = page;
        s.toggleNew(true);
      };

      s.update = function (activePage) {
        activePage.$update(function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActivePage();
        });
      };

      s.find = function (query) {
        PagesService.query(query, function (pages) {
          s.pages = pages;
        });
      };

      s.findOne = function () {
        PagesService.get({ videoId: $routeParams.page }, function (page) {
          s.page = page;
        });
      };

      s.remove = function (page) {
        if($window.confirm('Are you sure you want to delete?')){
          page.$remove();
          for (var i in s.pages) {
            var listedProduct = s.pages[i];
            if (listedProduct._id == page._id) {
              s.pages.splice(i, 1);

              s.toggleNew(false);
              resetActivePage();
              break;
            }
          }
        }
      };

      populatePages();
      resetActivePage();
  }
]);
