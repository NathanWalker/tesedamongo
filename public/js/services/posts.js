window.angular.module('App.services')
  .factory('PostsService', ['$resource',
    function($resource){
      return $resource(
        'posts/:postId',
        {
          postId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
