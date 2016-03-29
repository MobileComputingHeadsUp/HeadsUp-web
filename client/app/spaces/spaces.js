'use strict';

angular.module('headsUpWebApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('spaces', {
        url: '/spaces',
        templateUrl: 'app/spaces/spaces.list.html',
        controller: 'SpaceListController',
        controllerAs: 'sl'
      })
      .state('spaces-create', {
        url: '/spaces/new',
        templateUrl: 'app/spaces/create.space.html',
        controller: 'SpaceCreateController',
        controllerAs: 'sc'
      })
      .state('spaces-manage', {
        url: '/spaces/:id',
        templateUrl: 'app/spaces/manage.space.html',
        controller: 'SpaceManageController',
        controllerAs: 'sc',
        params: {
            space: null
        }
    });

});
  // .run(function($rootScope) {
  //   $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
  //     if (next.name === 'logout' && current && current.name && !current.authenticate) {
  //       next.referrer = current.name;
  //     }
  //   });
  // });
