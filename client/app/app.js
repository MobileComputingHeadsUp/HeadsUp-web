'use strict';

angular.module('headsUpWebApp', [
  'headsUpWebApp.auth',
  'headsUpWebApp.admin',
  'headsUpWebApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
