'use strict';

angular.module('workspaceApp')
  .controller('TradeCtrl', function ($scope, $http, Auth, otherUser, socket) {
    if (Auth.isLoggedIn()) otherUser.init();
    var myBook = {};
    var notMyBook={};
    
    $scope.label = function(bool){
      if (bool) return 'Selected';
      else return 'Click to Select';
    };
    
    $scope.triggerTrade = function(){
      var myDetails = otherUser.get();
      var id = new Date();
      var tId = id.getTime() + myBook.title;
      var thisTrade = {tradeId: tId,
                       myBookId: myBook._id,
                       myBookUrl: myBook.imageUrl,
                       myBookTitle: myBook.title,
                       myBookOwner: myBook.ownerId,
                       otherBookId: notMyBook._id,
                       otherBookUrl: notMyBook.imageUrl,
                       otherBookTitle: notMyBook.title,
                       otherBookOwner: notMyBook.ownerId,
                       otherUserApproved: false };
      if (!myDetails.pendingTrades) myDetails.pendingTrades = [];
      myDetails.pendingTrades.push(thisTrade);
      $http.put('/api/details/' + myDetails._id, myDetails).success(function(){
        //add proposed trade to other user
        $http.get('/api/details').success(function(details){
          var array = details.filter(function(detail){
            return notMyBook.ownerId===detail.userId;
          });
          if (array.length===0){
            array.push({userId: notMyBook.ownerId,
                                        name: '',
                                        city: '',
                                        state: '',
                                        pendingTrades: []})
          }
          if (!array[0].pendingTrades) array[0].pendingTrades = [];
          thisTrade.otherUserApproved = true;
          array[0].pendingTrades.push(thisTrade);
          if (!array[0]._id) $http.post('/api/details', array[0]).then($scope.tradeProposed() );
          else $http.put('/api/details/' + array[0]._id, array[0]).then($scope.tradeProposed());
        });
      });
    }
    
    $scope.tradeProposed = function (){
      $scope.mineSelected=Array.apply(null, Array($scope.filteredBooks.length)).map(function() { return false });
      $scope.notMineSelected=Array.apply(null, Array($scope.otherBooks.length)).map(function() { return false });
      $scope.selected={mine:false,notMine:false};
      alert('Trade Proposed!  Results will reflect answer from other User');
    };
    
    $scope.selectMine = function(book, index){
      for (var i=0;i<$scope.mineSelected.length;i++){
        $scope.mineSelected[i]=false;
      }
      $scope.mineSelected[index]=true;
      myBook=book;
      $scope.selected.mine=true;
      if ($scope.selected.notMine&&$scope.selected.mine) $scope.triggerTrade();
    };
    
    $scope.selectNotMine = function(book, index){
      for (var i=0;i<$scope.notMineSelected.length;i++){
        $scope.notMineSelected[i]=false;
      }
      $scope.notMineSelected[index]=true;
      notMyBook=book;
      $scope.selected.notMine=true;
      if ($scope.selected.notMine&&$scope.selected.mine) $scope.triggerTrade()
    };
    
    var mine = function(book){
        return (Auth.getCurrentUser()._id===book.ownerId);
    };
    
    var notMine = function(book){
        return (Auth.getCurrentUser()._id!==book.ownerId);
    };
    $http.get('/api/books').success(function(books) {
      $scope.books = books;
      $scope.filteredBooks=books.filter(mine);
      $scope.otherBooks=books.filter(notMine);
      $scope.mineSelected=Array.apply(null, Array($scope.filteredBooks.length)).map(function() { return false });
      $scope.notMineSelected=Array.apply(null, Array($scope.otherBooks.length)).map(function() { return false });
      $scope.selected={mine:false,notMine:false};
      
      socket.syncUpdates('book', $scope.books, function(event, item, array){
        $scope.filteredBooks=array.filter(mine);
        $scope.otherBooks=array.filter(notMine);
        $scope.mineSelected=Array.apply(null, Array($scope.filteredBooks.length)).map(function() { return false });
        $scope.notMineSelected=Array.apply(null, Array($scope.otherBooks.length)).map(function() { return false });
        $scope.selected={mine:false,notMine:false};
      });
    });
  })
  .controller('InnerCtrl', function ($scope, $http, Auth, otherUser, socket) {
    
    
  });
