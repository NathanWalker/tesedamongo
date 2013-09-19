window.angular.module('App.services', [])
  .factory('Global', function(){
  	var current_user = window.user;

  	return {
  		currentUser: function() {
  			return current_user;
  		},
  		isSignedIn: function() {
  			return !!current_user;
  		},
            isAdmin: function() {
                  return current_user ? current_user.admin : false;
            },
            isModerator: function() {
                  return current_user ? (current_user.admin || current_user.moderator) : false;
            }
  	};
  });
