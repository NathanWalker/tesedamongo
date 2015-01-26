window.angular.module('App.services')
  .factory('SoftwareService', ['$resource',
    function($resource){
      return $resource(
        'softwares/:softwareId',
        {
          softwareId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
