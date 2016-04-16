'use strict';

(function() {

class SpaceCreateController {

  constructor($http, $scope, APIClient) {
    this.APIClient = APIClient;

    // Init space schema form customization
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

    this.customCheckAlls = [];
    this.customFreeResponses = [];

  }

   // Function to save this created space to the DB
  newSpace() {
    if (this.newSpaceName) {
      // Set description
      var description = 'This is the default description WOOOOW.';
      if (this.newSpaceDescription !== '') {description = this.newSpaceDescription;}
      // Clean up the options array -> See the function declartion to see why
      // this is necessary.
      this.cleanUpOptionsArray(this.customDropDowns);
      this.cleanUpOptionsArray(this.customCheckAlls);
      console.log('cleaned up the options array ');
      console.log(this.customDropDowns);
      console.log(this.customCheckAlls);
      console.log(this.customFreeResponses);

      // Create the space object
      var newSpace = {
        name: this.newSpaceName,
        description: description,
        identifier: this.newSpaceBeaconID,

        sensors: [this.temperatureSensors,this.lightSensors],
        
        requiredUserInfo:{
          dropdown: this.customDropDowns,
          checkAllThatApply: this.customCheckAlls,
          freeResponse: this.customFreeResponses
        }
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

  //// DROPDOWN RELATED FUNCTIONALITY ////

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
      matchUsers: true
    };
    this.customDropDowns.push(dropDown);
  }

  newDropDownOption(dropdown) {
    var count = dropdown.optionStrings.length + 1;
    dropdown.optionStrings.push({value: 'default option ' + count});
  }

  //// CHECKALL THAT APPLY RELATED FUNCTIONALITY ////

  newCheckAll() {
    // the number'th check all
    var number = this.customCheckAlls.length + 1;
    var checkAll = {
      number: number,
      label: 'My Custom Check All That Apply Option',
      editable: false,
      optionStrings: [{value: 'default option 1'},{value: 'default option 2'}],
      matchUsers: true
    };
    this.customCheckAlls.push(checkAll);
  }
  newCheckOption(check) {
    var count = check.optionStrings.length + 1;
    check.optionStrings.push({value: 'default option ' + count});
  }

  //// FREE RESPONSE RELATED FUNCTIONALITY ////

  newFreeResponse() {
    // the number'th check all
    var number = this.customFreeResponses.length + 1;
    var freeResponse = {
      number: number,
      label: 'Free Response Text Area',
      editable: false,
      matchUsers: true,
      charLimit: 50
    };
    this.customFreeResponses.push(freeResponse);
  }

  //// HELPERS ////

  // Function utilized to transform the drop down options array
  // In order to display the options in HTML via Angular's ng-repeat,
  // each dropdown option must be an object, not a raw string. Though, when
  // we want to save the data to the database, we want an array of raw strings.
  // This function does that :-)
  cleanUpOptionsArray(formElements) {
      let elements = [];
      for (var i = 0; i < formElements.length; ++i) {
          let current = formElements[i];
          elements.push(current);
          for (var j = 0; j < current.optionStrings.length; ++j) {
              let stringVal = current.optionStrings[j].value;
              elements[i].optionStrings[j] = stringVal;
          }
      }
      // set formElements to our new, fixed elements array
      formElements = elements;
  }
  // end class
}

angular.module('headsUpWebApp')
  .controller('SpaceCreateController', SpaceCreateController);
})();
