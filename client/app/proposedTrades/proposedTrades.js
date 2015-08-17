'use strict';

angular.module('workspaceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/proposedTrades', {
        templateUrl: 'app/proposedTrades/proposedTrades.html',
        controller: 'ProposedTradesCtrl'
      });
  });
