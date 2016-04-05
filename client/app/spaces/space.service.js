'use strict';

(function() {

function SpaceResource($resource) {
  return $resource('/api/spaces/:id', {
    id: '@_id'
  }, {
    'update': {method: 'PUT'},
    'mySpaces':{method: 'GET', isArray: true, url: '/api/spaces/mine'}
  });
}

angular.module('headsUpWebApp')
  .factory('Space', SpaceResource);

})();
