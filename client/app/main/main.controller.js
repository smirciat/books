'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, $window, $location) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.all=false;
    var mine = function(book){
        if ($scope.all) return true;
        else return (Auth.getCurrentUser()._id===book.ownerId);
    };
    $http.get('/api/books').success(function(books) {
      $scope.books = books;//.filter(mine);
      socket.syncUpdates('book', $scope.books, function(event, item, array){
        $scope.filteredBooks=array.filter(mine);
      });
      $scope.filteredBooks=$scope.books.filter(mine);
    });
    $scope.count = 0;
    $scope.addBook = function() {
      if($scope.newBook === '') {
        alert('Please Enter Something!');
        return;
      }
      if(!$scope.isLoggedIn()) {
        alert('Please Log In to Add a Book!');
        return;
      }
      //get img url and title of new book
      //$http.put('/api/things').success(function(key){
        var url='https://www.googleapis.com/books/v1/volumes?q=';
        var endUrl='&callback=JSON_CALLBACK';
        var midUrl='isbn:';
        if (isNaN($scope.newBook)) midUrl='';
        $http.jsonp(url+midUrl+$scope.newBook+endUrl).success(function(data){
          if (data.items===undefined) {
            alert("No matching book found, please refine your search.");
            return;
          }
          var imgUrl='';
          if (data.items[0].volumeInfo.imageLinks) imgUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
          if (imgUrl.charAt(4)!=='s'&&imgUrl!=='') imgUrl = imgUrl.slice(0,4) + 's' + imgUrl.slice(4);
          //post results to db
          $http.post('/api/books', { title: data.items[0].volumeInfo.title.slice(0,42),
                                     imageUrl: imgUrl,
                                     ownerId: Auth.getCurrentUser()._id });
          $scope.newBook = '';
        }).error(function(){
          $location.path('/');
          $scope.count++;
          if ($scope.count<5) $scope.addBook();
        });
      //});
      
    };

    $scope.deleteBook = function(book) {
      $http.delete('/api/books/' + book._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('book');
    });
  });
