'use strict';

(function() {

class SpaceManageController {

  constructor($http, APIClient, $stateParams) {
    // Init apiclient
    this.APIClient = APIClient;

    // Get the current space id from state params
    this.$stateParams = $stateParams;
    const currentSpaceId = this.$stateParams.id;

    this.currentSpace = {};
    // Load the space from server:
    this.findOneSpace(currentSpaceId)
      .then(space => {
         this.currentSpace = space;
         console.log(this.currentSpace);
       })
      .catch(error => {
        Materialize.toast('Shit, an error', 4000);
        console.log(error);
      });

    // Init empty arrays of announcemnts and ads
    this.announcments = [];
    this.ads = [];
  }

  findOneSpace(id) {
    return this.APIClient.getASpace(id);
  }

  addBeacon() {
    var newBeacon = {
      identifier: '',
      name: 'new beacon'
    };
    this.currentSpace.beacons.push(newBeacon);
    console.log(this.currentSpace.beacons);
  }
  deleteBeacon(beacon) {
    //console.log("test");
    if(this.currentSpace.beacons.indexOf(beacon) !== -1){
      this.currentSpace.beacons.splice(this.currentSpace.beacons.indexOf(beacon), 1);
    }

  }
  saveSpace() {
    console.log(this.currentSpace);
    if (this.currentSpace) {
      // Save it
      this.currentSpace.announcments = this.announcments;
      this.currentSpace.ads = this.ads;
      this.APIClient.updateSpace(this.currentSpace)
        .then((response) => {
        this.currentSpace = response;

        // Clear Stuff
        this.announcments = [];
        this.ads = [];

        // Show toast
        Materialize.toast('Your Space has been updated!', 4000);
    }, error => {
        Materialize.toast('Shit, an error', 4000);
        console.log(error);
      });
      // TODO: figure out what beacon ID we will be putting in here!
      // In order for mongoose to save the object the string inputted in the form
      // needs to be of the right format of Schema.Types.ObjectId
    }
  }
  newDropDown() {
    // the number'th dropdown
    var number = this.currentSpace.requriedUserInfo.dropdown.length + 1;
    var dropDown = {
      number: number,
      label: 'My Custom Dropdown',
      editable: false,
      optionStrings: [{value: 'default option 1'},{value: 'default option 2'}],
      // TODO: add in Angular Matieral in order to use a nice material switch to
      // toggle this. Materialize doesnt have the switch :(
      matchUsers: true
    };
    this.currentSpace.requriedUserInfo.dropdown.push(dropDown);
    console.log(this.currentSpace.requriedUserInfo.dropdown);
  }

  newAnnouncement() {
    this.announcments.push({text: ''});
  }

  newAd() {
    var ad = {
      title: '',
      description: '',
      imgUrl: '',
      link: ''
    };
    this.ads.push(ad);
  }

  setDropdownEditable(dropdown) {
    dropdown.editable = true;
  }
  saveDropdown(dropdown) {
    dropdown.editable = false;
  }
  newDropDownOption(dropdown) {
    var count = dropdown.optionStrings.length+1;
    dropdown.optionStrings.push({value: 'default option ' + count});
    console.log(this.currentSpace.requriedUserInfo);
  }
  // Function utilized to transform the drop down options array
  // In order to display the options in HTML via Angular's ng-repeat,
  // each dropdown option must be an object, not a raw string. Though, when
  // we want to save the data to the database, we want an array of raw strings.
  // This function does that :-)
  cleanUpOptionsArray() {
    let dropdowns = [];
    for (var i = 0; i < this.currentSpace.requriedUserInfo.dropdown.length; ++i) {
      let currentDropdown = this.currentSpace.requriedUserInfo.dropdown[i];
      dropdowns.push(currentDropdown);
      for (var j = 0; j < currentDropdown.optionStrings.length; ++j) {
        let stringVal = currentDropdown.optionStrings[j];
        dropdowns[i].optionStrings[j] = stringVal;
      }
    }
    // set this.customDropDowns to our new, fixed dropdowns array
    this.currentSpace.requriedUserInfo.dropdown = dropdowns;
  }
}
// end class

angular.module('headsUpWebApp')
  .controller('SpaceManageController', SpaceManageController);
})();
