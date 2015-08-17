'use strict';

angular.module('workspaceApp')
  .factory('otherUser', function otherUser ($http, Auth, $q) {
    var userDetails={};
    
    var init = function(){
        var defer = $q.defer();
        $http.get('/api/details').success(function(details){//callback?
          var array = details.filter(function(detail){
            return Auth.getCurrentUser()._id===detail.userId;
          });
          if (array.length===0) {
            $http.post('/api/details', {userId: Auth.getCurrentUser()._id,
                                        name: Auth.getCurrentUser().name,
                                        city: '',
                                        state: '',
                                        pendingTrades: []});
            return init();
                                                         
          }
          userDetails = array[0];
          defer.resolve(userDetails);
        });
        return defer.promise;
      };
    return {
      init:init,  
      get: function(){return userDetails;}
    };
  });
