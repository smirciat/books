'use strict';

angular.module('workspaceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trade', {
        templateUrl: 'app/trade/trade.html',
        controller: 'TradeCtrl'
      });
  });
