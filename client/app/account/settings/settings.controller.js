'use strict';

angular.module('workspaceApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Auth) {
    $scope.init= function(){
      $http.get('/api/details').success(function(details){
        $scope.details = details.filter(function(detail){
          return Auth.getCurrentUser()._id===detail.userId;
        });
        if ($scope.details.length===0) {
          $http.post('/api/details', {userId: Auth.getCurrentUser()._id,
                                      name: Auth.getCurrentUser().name,
                                      city: '',
                                      state: '' });
          $scope.init();
          return;                                                
        }
        $scope.name = $scope.details[0].name;
        $scope.city = $scope.details[0].city;
        $scope.state = $scope.details[0].state;
      });
    };
    $scope.init();
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
		  $http.put('/api/details/' + $scope.details[0]._id, {name: $scope.name,
		                                                      city: $scope.city,
		                                                      state: $scope.state })
		    .then( function() {
          $scope.otherMessage = 'User Data Updated.';
        })
        .catch( function() {
          $scope.errors.other = 'Update Failed';
          $scope.otherMessage = '';
        });
		}
  });
