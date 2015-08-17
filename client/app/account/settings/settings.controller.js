'use strict';

angular.module('workspaceApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Auth, otherUser) {
    otherUser.init().then(function(){
      $scope.otherUser = otherUser.get();
      console.log($scope.otherUser);
    });
    
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
		
		$scope.changeData = function(form){
		  $scope.submitted = true;
		  $http.put('/api/details/' + $scope.otherUser._id, {name: $scope.otherUser.name,
		                                                      city: $scope.otherUser.city,
		                                                      state: $scope.otherUser.state })
		    .then(function(){
		      $http.patch('/api/users/' + Auth.getCurrentUser()._id, {name: $scope.otherUser.name})
		    })
		    .then( function() {
          $scope.otherMessage = 'User Data Updated.';
          otherUser.init();
        })
        .catch( function() {
          $scope.errors.other = 'Update Failed';
          $scope.otherMessage = '';
        });
		}
  });
