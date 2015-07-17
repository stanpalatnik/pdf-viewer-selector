'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'pdf'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.controller('PdfCtrl', [
  '$scope',
  'pdfDelegate',
  '$timeout',
  function($scope, pdfDelegate, $timeout) {
    $scope.pdfUrl = 'pdf/material-design.pdf';

    $scope.loadNewFile = function(url) {
      pdfDelegate
          .$getByHandle('my-pdf-container')
          .load(url);
    };
  }]);
