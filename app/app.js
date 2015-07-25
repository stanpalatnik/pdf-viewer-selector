'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'pdf',
  'ngRoute',
  'canvasSelector',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'yaru22.hovercard'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
