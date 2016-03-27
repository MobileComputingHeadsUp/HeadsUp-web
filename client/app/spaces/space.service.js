'use strict';

(function() {

function SpaceResource($resource) {
  return $resource('/api/spaces/:id', {
    id: '@_id'
  }, {
    'update': {method: 'PUT'}
  });
}

angular.module('headsUpWebApp')
  .factory('Space', SpaceResource);

})();
