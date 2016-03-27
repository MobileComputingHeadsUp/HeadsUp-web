'use strict';

(function() {

function APIClient($location, $http, $cookies, $q, Util, Auth, Space) {
  var safeCb = Util.safeCb;
  var currentUser = Auth.getCurrentUser();

  var APIClient = {
    //Get all spaces
    getAllSpaces() {
      return Space.query().$promise;
    },
    getASpace(id) {
      return Space.get({id: id}).$promise;
    },
    createSpace(space) {
      return Space.save(space).$promise;
    },
    deleteSpace(id) {
      return Space.delete({id: id}).$promise;
    },
    updateSpace(space) {
      // This will PUT /spaces/:id with the space object in the request payload
      var id = space._id;
      return Space.update({id: id}, space).$promise;
    }
  };
  return APIClient;
}

angular.module('headsUpWebApp')
  .factory('APIClient', APIClient);

})();
