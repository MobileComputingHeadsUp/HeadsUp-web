'use strict';

(function() {

class SpaceListController {

  constructor($http, $scope, socket, APIClient) {
    this.$http = $http;
    this.spaces = [];
    this.APIClient = APIClient;
    // init
    this.onInit();
  }

  onInit() {
    // Load all spaces
    this.APIClient.getAllSpaces()
      .then(response => {
        this.spaces = response;
        console.log("The spaces: ");
        console.log(this.spaces);
      })
  }

  deleteThing(space) {
    this.APIClient.deleteSpace(space._id)
      .then(response => {
        // Reload list of spaces
        this.onInit();
      })
  }
}
// end class

angular.module('headsUpWebApp')
  .controller('SpaceListController', SpaceListController);
})();
