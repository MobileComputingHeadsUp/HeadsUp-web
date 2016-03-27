'use strict';

angular.module('headsUpWebApp')
  .directive('footer', function() {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',
      link: function(scope, element) {
        element.addClass('page-footer blue-grey');
      }
    };
  });
