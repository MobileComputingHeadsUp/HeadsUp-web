'use strict';

angular.module('headsUpWebApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>'
      })
      .state('how-it-works', {
        url: '/howitworks',
        templateUrl: 'app/main/howitworks.html'
      });
  });
