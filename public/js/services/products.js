window.angular.module('App.services')
  .factory('ProductsService', ['$resource',
    function($resource){
      return $resource(
        'products/:productId',
        {
          productId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
