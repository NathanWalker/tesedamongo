window.angular.module('App.controllers').controller("PagesCtrl", ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$window", "$routeParams", "Global", "PagesCache", "orderByFilter", function(s, $rootScope, $filter, $timeout, $location, $window, $routeParams, Global, PagesCache, orderByFilter) {


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
        PagesCache.resetScroll();
      };


      s.pages = [];

      s.create = function (activePage) {
        if(s.editing){
          s.update(activePage);
        } else {

          var page = new PagesService({
            title: activePage.title,
            subheading: activePage.subheading,
            content: activePage.content,
            route: activePage.route,
            customStyle: activePage.customStyle
          });

          if(activePage.navShow && activePage.navName){
            page.navShow = true;
            page.navName = activePage.navName;
          }

          if(activePage.order){
            page.order = activePage.order;
          }

          if(activePage.showBanner){
            page.showBanner = true;
          }

          if(activePage.overviewVideo){
            page.overviewVideo = activePage.overviewVideo;
          }

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

      var resortPages = function(){
        var cnt = 0;

        var updatePageOrder = function(){
          var pageToUpdate = s.pages[cnt];
          pageToUpdate.order = cnt+1;
          //console.log('updating page: ' + pageToUpdate.navName + ', ' + pageToUpdate.order);
          PagesCache.updatePage(pageToUpdate).then(function(){
            cnt++;
            if(cnt == s.pages.length){
              s.updatingSort = false;
              initPages();
            } else {
              updatePageOrder();
            }
          });
        };

        // kick it off
        updatePageOrder();
      };

      s.updatingSort = false;
      s.sortableOptions = {
        update: function(e, ui) {
          s.updatingSort = true;
          $timeout(function(){
            // get new index of the page after dom and scope has updated
            resortPages();
          }, 100);
        },
        axis: 'y',
        cursor:'move',
        delay:150,
        items:'> li.sortable-item'
      };

      s.update = function (activePage) {
        PagesCache.updatePage(activePage).then(function(){
          s.toggleNew(false);
          resetActivePage();
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

      var initPages = function(){
         PagesCache.pages().then(function(pages){
            s.pages = orderByFilter(pages, '+order');
          });
      };

      initPages();
      resetActivePage();

      if ($routeParams.page) {
        PagesCache.getPage({_id:$routeParams.page}).then(function(page){
          if(page){
            s.editPage(page);
          }
        });
      }
  }
]);
