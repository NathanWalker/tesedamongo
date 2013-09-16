window.angular.module('App.controllers')
	.controller('HeaderController', ['$scope', '$routeParams',
		function (s, $routeParams) {

			s.navCollapsed = true;

			s.$on('$routeChangeStart', function() {
				s.navCollapsed = true;
			});

                  if($routeParams.a == '1'){
                    // user just created account
                    // show notification

                  }
		}]);
