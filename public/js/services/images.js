window.angular.module('App.services')
  .factory('ImagesService', ['$resource',
    function($resource){
      return $resource(
        'images/:imageId',
        {
          imageId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
