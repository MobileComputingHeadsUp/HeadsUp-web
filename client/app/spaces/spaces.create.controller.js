'use strict';

(function() {

class SpaceCreateController {

  constructor($http, $scope, APIClient) {
    this.APIClient = APIClient;
    this.customDropDowns = [];
    this.temperatureSensors = [{
        name: 'Analog Temperature Sensor',
        model: 'TMP36',
        number: 0,
        imgURL: 'assets/images/SensorImages/tmp36.jpg'
      },
      {
        name: 'Digital Temperature Sensor',
        model: 'TMP107BID',
        number: 0,
        imgURL: 'assets/images/SensorImages/tmp107.jpg'
      }];
    this.lightSensors = [{
      name: 'Digital Ambient Light Sensor',
      model: 'SFH 7771',
      number: 0,
      imgURL: 'assets/images/SensorImages/SFH_7771_DSL.jpg'
      },
      {
      name: 'Digital Ambient Light Sensor',
      model: 'Si1133-AA00-GMR',
      number: 0,
      imgURL: 'assets/images/SensorImages/QFN_10_Clear_SPL.jpg'
      }];
  }

  newSpace() {
    if (this.newSpaceName) {
      // Set description
      var description = 'This is the default description WOOOOW.';
      if (this.newSpaceDescription !== '') {description = this.newSpaceDescription;}
      // Clean up the options array -> See the function declartion to see why
      // this is necessary.
      this.cleanUpOptionsArray();
      console.log('cleaned up the options array ');
      console.log(this.customDropDowns);
      // Create the space object
      var newSpace = {
        name: this.newSpaceName,
        description: description,
        identifier: this.newSpaceBeaconID,
        sensors: [this.temperatureSensors,this.lightSensors],
        requriedUserInfo:{dropdown: this.customDropDowns}
    };
      // Save it
      this.APIClient.createSpace(newSpace)
        .then(() => {
          // Show toast
           Materialize.toast('Your Space has been created!', 4000);
          // Clear input fields
          this.newSpaceName = '';
          this.newSpaceDescription = '';
          this.newSpaceBeaconID = '';
          window.location.href = '/spaces';
        }, error => {
            Materialize.toast('Shit, an error', 4000);
            console.log(error);
        });
    }
  }

  // New dropdown form for the space owner
  // TODO: add a shitton of pre-defined dropdowns for them to choose from
  newDropDown() {
    // the number'th dropdown
    var number = this.customDropDowns.length + 1;
    var dropDown = {
      number: number,
      label: 'My Custom Dropdown',
      editable: false,
      optionStrings: [{value: 'default option 1'},{value: 'default option 2'}],
      // TODO: add in Angular Matieral in order to use a nice material switch to
      // toggle this. Materialize doesnt have the switch :(
      matchUsers: true
    };
    this.customDropDowns.push(dropDown);
    console.log(this.customDropDowns);
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
  }
  // Function utilized to transform the drop down options array
  // In order to display the options in HTML via Angular's ng-repeat,
  // each dropdown option must be an object, not a raw string. Though, when
  // we want to save the data to the database, we want an array of raw strings.
  // This function does that :-)
  cleanUpOptionsArray() {
      let dropdowns = [];
      for (var i = 0; i < this.customDropDowns.length; ++i) {
          let currentDropdown = this.customDropDowns[i];
          dropdowns.push(currentDropdown);
          for (var j = 0; j < currentDropdown.optionStrings.length; ++j) {
              let stringVal = currentDropdown.optionStrings[j].value;
              dropdowns[i].optionStrings[j] = stringVal;
          }
      }
      // set this.customDropDowns to our new, fixed dropdowns array
      this.customDropDowns = dropdowns;
  }
}



// end class

angular.module('headsUpWebApp')
  .controller('SpaceCreateController', SpaceCreateController);
})();
