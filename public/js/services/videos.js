window.angular.module('App.services')
  .factory('VideosService', ['$resource',
    function($resource){
      return $resource(
        'videos/:videoId',
        {
          videoId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
