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
    //this.testNum = 123;
  }

  addBeacon(){
    if(this.currentSpace.beacons.indexOf(null) == -1)
      this.currentSpace.beacons.push(null);
  }
  deleteBeacon(beacon){
    console.log("test");
    if(this.currentSpace.beacons.indexOf(beacon) !== -1){
      this.currentSpace.beacons.splice(this.currentSpace.beacons.indexOf(beacon), 1);
    }

  }
  saveSpace() {
    if (this.currentSpace) {
      // Save it
      this.APIClient.updateSpace(this.currentSpace)
        .then(() => {
        // Show toast
        Materialize.toast('Your Space has been updated!', 4000);
      // Clear input fields
      this.newSpaceName = '';
      this.newSpaceDescription = '';
      this.newSpaceBeaconID = '';
    }, error => {
        Materialize.toast('Shit, an error', 4000);
        console.log(error);
      });
      // TODO: figure out what beacon ID we will be putting in here!
      // In order for mongoose to save the object the string inputted in the form
      // needs to be of the right format of Schema.Types.ObjectId
    }
  }
}
// end class

angular.module('headsUpWebApp')
  .controller('SpaceManageController', SpaceManageController);
})();
