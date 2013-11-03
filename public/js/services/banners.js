window.angular.module('App.services')
  .factory('BannerService', ['$resource',
    function($resource){
      return $resource(
        'banners/:bannerId',
        {
          bannerId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
