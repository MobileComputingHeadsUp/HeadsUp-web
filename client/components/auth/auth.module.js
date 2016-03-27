'use strict';

angular.module('headsUpWebApp.auth', [
  'headsUpWebApp.constants',
  'headsUpWebApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
