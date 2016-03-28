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
        templateUrl: 'app/misc/howitworks.html'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/misc/contact.html'
      });
  });
