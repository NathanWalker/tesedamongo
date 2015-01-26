window.angular.module('App.services')
  .factory('PagesService', ['$resource',
    function($resource){
      return $resource(
        'pages/:pageId',
        {
          pageId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
