window.angular.module('App.services')
  .factory('UsersService', ['$resource',
    function($resource){
      return $resource(
        'users/:userId',
        {
          userId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
