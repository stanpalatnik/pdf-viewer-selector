'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [
'$scope',
'pdfDelegate',
'$timeout',
function($scope, pdfDelegate, $timeout) {
  $scope.pdfUrl = '/app/pdf/material-design.pdf';

  $scope.loadNewFile = function(url) {
    pdfDelegate
        .$getByHandle('my-pdf-container')
        .load(url);
  };

  $scope.draw = function() {
    canvasContext.strokeStyle="#e7003a";
    canvasContext.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
  }}])

.directive('canvasSelector', function factory() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div id="selector-box" hidden></div>',
    scope: {
      canvasElem: '='
    },
    link: function (scope, element, attrs) {
      scope.canvasRect = {};
      scope.selectRect = {};
      scope.isDragging = false;

      angular.element(document).ready(function () {
        scope.canvas = $(scope.canvasElem);
        scope.canvasContext = scope.canvas[0].getContext('2d');
        scope.canvas.on('mousedown', mouseDown);
        scope.canvas.on('mouseup', mouseUp);
        scope.canvas.on('mousemove', mouseMove);
        scope.selectorBox = $("#selector-box");
        scope.selectorBox.on('mouseup', mouseUp);
      });


      function mouseUp(e) {
        scope.isDragging = false;
        scope.selectorBox.hide();
        var offset = scope.canvas.offset();
        scope.canvasRect.w = (e.pageX - offset.left) - scope.canvasRect.startX;
        scope.canvasRect.h = (e.pageY - offset.top) - scope.canvasRect.startY;
        draw();
        resetSelector();
      }

      function mouseDown(e) {
        scope.isDragging = true;
        scope.selectorBox.show();
        scope.canvasRect.startX = e.pageX - this.offsetLeft;
        scope.canvasRect.startY = e.pageY - this.offsetTop;
        scope.selectRect.x1 = e.pageX;
        scope.selectRect.y1 = e.pageY;
        reCalc();
      }

      function mouseMove(e) {
        if (scope.isDragging) {
          scope.selectRect.x2 = e.pageX;
          scope.selectRect.y2 = e.pageY;
          reCalc();
        }
      }

      function draw() {
        scope.canvasContext.strokeStyle = "#e7003a";
        scope.canvasContext.strokeRect(scope.canvasRect.startX, scope.canvasRect.startY, scope.canvasRect.w, scope.canvasRect.h);
      }

      function reCalc() {
        var x3 = Math.min(scope.selectRect.x1, scope.selectRect.x2);
        var x4 = Math.max(scope.selectRect.x1, scope.selectRect.x2);
        var y3 = Math.min(scope.selectRect.y1, scope.selectRect.y2);
        var y4 = Math.max(scope.selectRect.y1, scope.selectRect.y2);
        scope.selectorBox.css('left', x3 + 'px');
        scope.selectorBox.css('top', y3 + 'px');
        scope.selectorBox.css('width', x4 - x3 + 'px');
        scope.selectorBox.css('height', y4 - y3 + 'px');
      }

      function resetSelector() {
        scope.canvasRect = {};
        scope.selectRect = {};
      }
    }
  };
});