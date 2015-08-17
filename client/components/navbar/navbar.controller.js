'use strict';

angular.module('workspaceApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
      {
      'title': 'Trade',
      'link': '/trade'
    },
    {
      'title': 'Pending Trades',
      'link': '/proposedTrades'
    },
    ];
    $scope.currentUser = Auth.getCurrentUser().name;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    Auth.isLoggedInAsync(function(loggedIn){
      $scope.currentUser = Auth.getCurrentUser().name;
    });
    
    
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });