window.angular.module('App.services')
  .factory('AppNoteService', ['$resource',
    function($resource){
      return $resource(
        'appnotes/:appnoteId',
        {
          appnoteId:'@_id'
        },
        {
          update: {method: 'PUT'}
        }
      )
    }]);
