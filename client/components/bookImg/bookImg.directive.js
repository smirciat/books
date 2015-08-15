'use strict';

angular.module('workspaceApp')
  .directive('bookImg', function ($window) {
    return {
      templateUrl: 'components/bookImg/bookImg.html',
      restrict: 'AE',
      replace:true,
      scope: {
        bookObject: "="
      },
      link: function (scope, element, attrs) {
        scope.clickMe=function(book){
          var url ='https://play.google.com/store/search?q=';
          $window.location=url + book.title + '&c=books';
        };
      }
    };
  });