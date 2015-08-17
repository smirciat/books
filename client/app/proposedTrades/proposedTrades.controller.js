'use strict';

angular.module('workspaceApp')
  .controller('ProposedTradesCtrl', function ($scope, Auth, otherUser, $http) {
    $scope.init = function(){
      if (Auth.isLoggedIn()) otherUser.init().then(function(data){
        $scope.myDetails = data;
        $scope.myTrades = $scope.myDetails.pendingTrades.filter(function(trade){
          return !trade.otherUserApproved;
        });
        $scope.otherTrades = $scope.myDetails.pendingTrades.filter(function(trade){
          return trade.otherUserApproved;
        });
      });
    };
    $scope.init();
    var validTrade=false;
    
    $scope.accept = function(trade){
      validTrade=true;
      //check to see if books are still owned by original owners
      $http.get('/api/books/' + trade.myBookId).success(function(data){
        if (data.ownerId!==trade.myBookOwner) {
          validTrade=false;
          alert('Ownership has changed on one of the proposed books!  Trade is canceled!');
        }
      })
      .then(function(){
        if (validTrade) {
          $http.get('/api/books/' + trade.otherBookId).success(function(data){
            if (data.ownerId!==trade.otherBookOwner) {
              validTrade=false;
              alert('Ownership has changed on one of the proposed books!  Trade is canceled!');
            }
          })
        }
      })
      .then(function(){
        if (validTrade){
          finalize(trade);
        }
        else $scope.reject(trade);
      })
      ;
    };
    
      //finalize trade
    var finalize = function(trade){
      if (validTrade) {
        $http.put('/api/books/' + trade.myBookId, {ownerId: trade.otherBookOwner})
          .then(function(){
            $http.put('/api/books/' + trade.otherBookId, {ownerId: trade.myBookOwner})
              .then(function(){
                alert('Successful Trade! Check inventories to verify!');
                $scope.reject(trade);
              });
          });
      }
    };  
    
    $scope.reject = function(trade){
      //delete both trades from their 'details' documents
      //mine
      $http.get('/api/details').success(function(data){
        var mine = data.filter(function(detail){
          return (detail.userId===trade.otherBookOwner)
        });
        if (mine[0]) {
          var tradesArray = mine[0].pendingTrades.filter(function(element){
            return element.tradeId!==trade.tradeId;
          });
          mine[0].pendingTrades = tradesArray;
          $http.put('/api/details/' + mine[0]._id, mine[0]);
        }
        //other one
        var notMine = data.filter(function(detail){
          return (detail.userId===trade.myBookOwner)
        });
        if (notMine[0]) {
          var tradesArray1 = notMine[0].pendingTrades.filter(function(element){
            return element.tradeId!==trade.tradeId;
          });
          notMine[0].pendingTrades = tradesArray1;
          $http.put('/api/details/' + notMine[0]._id, notMine[0]);
        }
        $scope.init();
      });
    };
    
  });
