window.angular.module('App.services')
  .factory('Global', function(){
  	var current_user = window.user;
      var is_production = window.nodeEnv == 'production';

  	return {
  		currentUser: function() {
  			return current_user;
  		},
  		isSignedIn: function() {
  			return !!current_user;
  		},
            isAdmin: function() {
                  return current_user ? (current_user.admin || current_user.webAdmin)  : false;
            },
            isModerator: function() {
                  return current_user ? (current_user.admin || current_user.webAdmin || current_user.moderator) : false;
            },
            isWebAdmin: function() {
                  return current_user ? current_user.webAdmin : false;
            },
            isProduction:function(){
              return is_production;
            },
            imagePath:function(){
              return is_production ? 'https://s3-us-west-2.amazonaws.com/tesedamongo/' : '/uploads/';
            }
  	};
  });
