window.angular.module('App.controllers').controller("UsersCtrl", ["$scope", "Global", "$rootScope", "$filter", "$timeout", "$window", "$routeParams", "UsersService", function(s, Global, $rootScope, $filter, $timeout, $window, $routeParams, UsersService) {

      s.showUserForm = false;
      s.editing = false;

      var resetActiveUser = function() {
        s.activeUser = {
          name:'',
          company:'',
          clientId:'',
          admin:false,
          username: ''
        };
        s.userConfirm = {
          confirmPassword:''
        };
      };

      s.openNewForm = function() {
        s.editing = false;
        resetActiveUser();
        s.toggleNew(true);
      };

      s.toggleNew = function(force) {
        s.showUserForm = _.isUndefined(force) ? !s.showUserForm : force;
      };

      s.create = function (activeUser) {
        if(s.editing){
          s.update(activeUser);
        } else {

          var commitData = function() {
            var user = new UsersService({
              name: activeUser.name,
              company: activeUser.company,
              clientId: activeUser.clientId,
              username: activeUser.username,
              password: activeUser.password
            });

            user.$save(function (response) {
              if(response && response._id){
                s.users.push(response);
              }

              s.toggleNew(false);
              resetActiveUser();
            });
          };

          if (activeUser.password){
            // must confirm
            if(activeUser.password == s.userConfirm.confirmPassword){
              commitData();
            } else {
              $window.alert("Passwords must match!");
            }

          } else {
            commitData();
          }

        }

      };

      s.editUser = function(user) {
        s.editing = true;
        s.activeUser = user;
        s.toggleNew(true);
      };

      s.update = function (user) {

        user.$update(function () {
          // $location.path('fantasyteams/' + fantasyteam._id);
          s.toggleNew(false);
          resetActiveProduct();
        });
      };

      s.remove = function (activeUser) {
        if($window.confirm('Are you sure you want to delete this user account?')){
          activeUser.$remove();
          for (var i in s.users) {
            var listedUser = s.users[i];
            if (listedUser._id == activeUser._id) {
              s.users.splice(i, 1);

              s.toggleNew(false);
              resetActiveUser();
              break;
            }
          }
        }
      };

      resetActiveUser();


      if(Global.isAdmin()) {
        UsersService.query(function (users) {
          s.users = users;
        });
      }


  }
]);
