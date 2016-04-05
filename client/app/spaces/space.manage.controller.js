'use strict';

(function() {

class SpaceManageController {

  constructor($http, APIClient, $stateParams) {
    this.APIClient = APIClient;
    // Get the current space
    this.$stateParams = $stateParams;
    this.currentSpace = this.$stateParams.space;
    console.log('THE CURRENT SPACE IS: ');
    console.log(this.currentSpace);
    //console.log(this.currentSpace.type);
    this.$stateParams.id = this.currentSpace._id;
    Object.prototype.getName = function() {
      var funcNameRegex = /function (.{1,})\(/;
      var results = (funcNameRegex).exec((this).constructor.toString());
      return (results && results.length > 1) ? results[1] : "";
    };
    console.log(this.currentSpace.getName());
  }

  addBeacon(){

  }

}
// end class

angular.module('headsUpWebApp')
  .controller('SpaceManageController', SpaceManageController);
})();
