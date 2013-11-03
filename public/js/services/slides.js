window.angular.module('App.services')
  .factory('SlideService', ['$resource',
    function($resource){
      return $resource(
        'slides/:slideId',
        {
          slideId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
