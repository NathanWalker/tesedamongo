window.angular.module('App.services')
  .factory('SpecService', ['$resource',
    function($resource){
      return $resource(
        'specs/:specId',
        {
          specId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
