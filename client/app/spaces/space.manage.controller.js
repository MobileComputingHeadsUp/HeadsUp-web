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
    this.currentBeacons = [];
    // Load the space from server:
    this.findOneSpace(currentSpaceId)
      .then(space => {
         this.currentSpace = space;
         this.currentBeacons = space.beacons;
         console.log(this.currentSpace);
       })
      .catch(error => {
        Materialize.toast('Shit, an error', 4000);
        console.log(error);
      });

    // Init empty arrays of announcemnts and ads
    this.announcments = [];
    this.ads = [];
    this.newBeacons = [];

  }

  findOneSpace(id) {
    return this.APIClient.getASpace(id);
  }

  addBeacon() {
    var newBeacon = {
      identifier: '',
      name: '',
      entry: true
    };
    this.newBeacons.push(newBeacon);
    console.log(this.currentSpace.beacons);
  }
  deleteBeacon(beacon) {
    //console.log("test");
    if(this.currentSpace.beacons.indexOf(beacon) !== -1){
      this.currentSpace.beacons.splice(this.currentSpace.beacons.indexOf(beacon), 1);
    }

  }
  saveSpace() {
    if (this.currentSpace) {
      // Get the ad and announcements and beacons
      const spaceAnnouncements = this.currentSpace.announcments;
      const spaceAds = this.currentSpace.ads;
      const spaceBeacons = this.currentSpace.beacons;

      // Add announcments to the spaces announcements
      this.currentSpace.announcments = spaceAnnouncements.concat(this.announcments);

      // Add newly added beacons to the spaces list o beacons
      this.currentSpace.beacons = spaceBeacons.concat(this.newBeacons);

      // Ad ads to beacons if they are associated with a beacon
      this.adAdsToBeacon(this.ads);

      // Othrwisem add ads generally to a space
      this.currentSpace.ads = spaceAds.concat(this.ads);

      // Save it
      this.APIClient.updateSpace(this.currentSpace)
        .then((response) => {
          // Update data we're displaying
          this.currentSpace = response;

          this.currentBeacons = response.beacons;

          // Clear Stuff
          this.announcments = [];
          this.ads = [];
          this.newBeacons = [];

          // Show toast
          Materialize.toast('Your Space has been updated!', 4000);
    }, error => {
        Materialize.toast('Shit, an error', 4000);
        console.log(error);
      });
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
      link: '',
      // This will not be saved to mongo, its just used as an ng-model to see
      // if they selected a beacon to identify the ad with
      beacon: ''
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

  adAdsToBeacon(ads) {
    ads.forEach( (ad, index) => {
      if (ad.beacon !== '') {
        // Add to the appropiate beacon
        this.findBeaconByIdentifier(ad.beacon, beacon => {
          beacon.vicinityAds.ads.push(ad);
          ads.splice(index, 1);
        });
      }
    });
  }

  findBeaconByIdentifier(identifier, callback) {
    this.currentSpace.beacons.forEach(beacon => {
      if (beacon.identifier === identifier) {
        callback(beacon);
      }
    });
    return undefined;
  }
}
// end class

angular.module('headsUpWebApp')
  .controller('SpaceManageController', SpaceManageController);
})();
