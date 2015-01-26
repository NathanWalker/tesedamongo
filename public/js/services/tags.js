window.angular.module('App.services')
  .factory('TagsService', ['$resource',
    function($resource){
      return $resource(
        'tags/:tagId',
        {
          tagId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
