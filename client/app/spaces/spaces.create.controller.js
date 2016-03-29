'use strict';

(function() {

class SpaceCreateController {

  constructor($http, $scope, APIClient) {
    this.APIClient = APIClient;
    this.customDropDowns = [];
  }

  newSpace() {
    if (this.newSpaceName) {
      // Set description
      var description = 'This is the default description WOOOOW.';
      if (this.newSpaceDescription !== '') {description = this.newSpaceDescription;}
      // Create the space object
      var newSpace = {
        name: this.newSpaceName,
        description: description,
        identifier: this.newSpaceBeaconID
        // requriedUserInfo:{dropdowns: this.customDropDowns.dropDown}
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
        }, error => {
            Materialize.toast('Shit, an error', 4000);
            console.log(error);
        });
      // TODO: figure out what beacon ID we will be putting in here!
      // In order for mongoose to save the object the string inputted in the form
      // needs to be of the right format of Schema.Types.ObjectId
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
    var count = dropdown.optionStrings.length;
    dropdown.optionStrings.push({value: 'default option ' + count});
  }
}



// end class

angular.module('headsUpWebApp')
  .controller('SpaceCreateController', SpaceCreateController);
})();
