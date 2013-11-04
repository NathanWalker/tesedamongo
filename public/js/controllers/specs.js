window.angular.module('App.controllers').controller("SpecCtrl", ["$scope", "$rootScope", "$q", "$window", "$filter", "$timeout", "PagesCache", "ngTableOptions", "orderByFilter", "$routeParams", "SpecService", "ImagesService", function(s, $rootScope, $q, $window, $filter, $timeout, PagesCache, ngTableOptions, orderByFilter, $routeParams, SpecService, ImagesService) {

      var allSpecs = [];
      var addingSpec = false;
      s.specs = [];
      s.filtered = false;
      s.showNewForm = false;
      s.editing = false;
      s.fileUploading = false;
      s.uploadedDatasheet = undefined;
      s.uploadedSpec = undefined;

      var resetActiveSpec = function() {
        s.activeSpec = {
          name: '',
          description: '',
          datasheetName:'',
          specName:'',
          order:1
        };
        s.fileUploading = false;
        s.uploadedDatasheet = undefined;
        s.uploadedSpec = undefined;
      };

      s.uploadToggleType = function(type) {
        switch(type){
          case 'spec':
            addingSpec = true;
            break;
          default:
            addingSpec = false;
        }
      };

      var resetUploadTypes = function(){
        addingSpec = false;
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveSpec();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showNewForm = _.isUndefined(force) ? !s.showNewForm : force;
        PagesCache.resetScroll();
      };

      var orderSpecs = function(specs) {
        s.specs = orderByFilter(specs, 'order');
        allSpecs = s.specs;
      };

      var populateSpecs = function(query) {
        query = query || {};
        SpecService.query(query, function (specs) {
          orderSpecs(specs);

          if ($routeParams.spec) {
            s.filtered = true;
            s.otherSpecsTotal = allSpecs.length - 1;
            s.specs = _.select(allSpecs, function(spec) {
              return spec._id == $routeParams.spec;
            });
          }
        });
      };

      s.create = function (activeSpec) {
        if(s.editing){
          s.update(activeSpec);
        } else {

          var spec = new SpecService({
            name: activeSpec.name,
            description: activeSpec.description,
            order:allSpecs.length+1
          });

          if(s.uploadedDatasheet) {
            spec.datasheetName = s.uploadedDatasheet.url;
          }

          if(s.uploadedSpec) {
            spec.specName = s.uploadedSpec.url;
          }

          spec.$save(function (response) {
            if(response && response._id){
              s.specs.push(response);
              orderSpecs(s.specs);
            }

            s.toggleNew(false);
            resetActiveSpec();
          });
        }

      };

      s.editSpec = function(spec) {
        s.editing = true;
        s.activeSpec = spec;
        s.toggleNew(true);
        s.fileUploading = false;
        s.uploadedDatasheet = undefined;
        s.uploadedSpec = undefined;
      };

      s.removeFile = function(fileName, type) {
        ImagesService.query({url: fileName}, function(files){
          var file = _.first(files);
          // delete file from filesystem
          file.$remove();
          s.activeSpec[type + 'Name'] = '';
          s.update(s.activeSpec);
        });
      };

      s.update = function (activeSpec, params) {
        var defer = $q.defer();
        if(s.uploadedDatasheet) {
          activeSpec.datasheetName = s.uploadedDatasheet.url;
        }
        if(s.uploadedSpec) {
          activeSpec.specName = s.uploadedSpec.url;
        }
        params = params || {};
        activeSpec.$update(params, function () {
          s.toggleNew(false);
          resetActiveSpec();
          defer.resolve()
        });
        return defer.promise;
      };

      /* sorting */
      var resortSpecs = function(){
        var cnt = 0;

        var updateSpecOrder = function(){
          var specToUpdate = s.specs[cnt];
          specToUpdate.order = cnt+1;
          //console.log('updating page: ' + specToUpdate.name + ', ' + specToUpdate.order);
          s.update(specToUpdate).then(function(){
            cnt++;
            if(cnt == s.specs.length){
              s.updatingSort = false;
              orderSpecs(s.specs);
            } else {
              updateSpecOrder();
            }
          });
        };

        // kick it off
        updateSpecOrder();
      };

      s.updatingSort = false;
      if($rootScope.global.isModerator()){
        s.sortableOptions = {
          update: function(e, ui) {
            s.updatingSort = true;
            $timeout(function(){
              // get new index of the spec after dom and scope has updated
              resortSpecs();
            }, 300);
          },
          axis: 'y',
          cursor:'move',
          delay:150,
          items:'tbody tr'
        };
      } else {
        s.sortableOptions = {
          axis: 'y',
          cursor:'default',
          items:'tr.noop-item'
        };
      }


      s.remove = function (spec) {
        if($window.confirm('Are you sure you want to delete?')){
          var specId = spec._id;
          spec.$remove();
          for (var i in s.specs) {
            if (s.specs[i]._id == specId) {
              s.specs.splice(i, 1);

              // remove from all specs
              for(var a = 0; a < allSpecs.length; a++){
                var sp = allSpecs[a];
                if(sp._id == specId){
                  allSpecs.splice(a, 1);
                  break;
                }
              }

              s.toggleNew(false);
              resetActiveSpec();
              break;
            }
          }
        }
      };

      s.$on('image:removed', function(e) {
        s.uploadedDatasheet = undefined;
        s.uploadedSpec = undefined;
      });

      s.progress = function(percentDone) {
        s.fileUploading = true;
            // console.log("progress: " + percentDone + "%");
      };

      s.done = function(files, data) {
            // console.log("upload complete");
            // console.log("data: " + JSON.stringify(data));
            writeFiles(files, data);
      };

      s.getData = function(files) {
            //this data will be sent to the server with the files
            return {msg: "from the client", date: new Date()};
      };

      s.error = function(files, type, msg) {
            // console.log("Upload error: " + msg);
            // console.log("Error type:" + type);
            writeFiles(files);
      }

      function writeFiles(files, data)
      {

            // console.log('Files')
            // for (var i = 0; i < files.length; i++) {
            //       console.log('\t' + files[i].name);
            // }
            if(data) {
              var fileName = data.filenames[0];
              image = new ImagesService({
                url: fileName
              });
              image.$save(function (response) {
                if(response && response._id){
                  if(addingSpec){
                    s.uploadedSpec = response;
                  } else {
                    s.uploadedDatasheet = response;
                  }
                   s.fileUploading = false;
                   resetUploadTypes();
                }
              });
            }

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
        s.specs = params.sorting ? orderByFilter(s.specs, params.orderBy()) : s.specs;
      }, true);

    populateSpecs();
    resetActiveSpec();
    PagesCache.getPage({route:'specs'}).then(function (page) {
      s.page = page;
    });
  }
]);
