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
  var divMouseUpOffset = 2;
  $scope.pdfUrl = '/app/pdf/contribution_card_cc_eng.pdf';
  $scope.canvas = $("#pdfCanvas");
  $scope.selector = $("#selector-box");
  $scope.canvasContext = $scope.canvas[0].getContext('2d');
  $scope.isDragging = false;
  $scope.selectionArr = [];

  $scope.loadNewFile = function(url) {
    pdfDelegate
        .$getByHandle('my-pdf-container')
        .load(url);
  };

  function draw(canvasRect) {
    $scope.canvasContext.strokeStyle="#e7003a";
    $scope.canvasContext.strokeRect(canvasRect.startX, canvasRect.startY, canvasRect.w, canvasRect.h);
    console.log("Current selection: " + canvasRect);
  }

  $scope.mouseUp = function ($event) {
    $scope.isDragging = false;
    var offset = this.canvas.offset();
    var canvasRect = {};
    var scale = pdfDelegate.$getByHandle('my-pdf-container').getCurrentScale();
    canvasRect.startX = parseInt($scope.selector.css('left'), 10) - offset.left;
    canvasRect.startY = parseInt($scope.selector.css('top'), 10) - offset.top;
    canvasRect.w = parseInt($scope.selector.css('width'), 10);
    canvasRect.h = parseInt($scope.selector.css('height'), 10);
    draw(canvasRect);
    saveSelection(canvasRect, scale);
    $scope.selector.trigger('mouseup');
  };

  $scope.mouseDown = function ($event) {
    $scope.isDragging = true;
  };

  $scope.mouseMove = function ($event) {
    if($scope.isDragging) {
      $scope.selector.trigger('mousemove');
    }
  };

  function saveSelection(canvasRect, scale) {
    if(scale == 1) {
      $scope.selectionArr.push($scope.canvasRect);
    }
    else {
      var tempRect = {};
      tempRect.startX = canvasRect.startX / scale;
      tempRect.startY = canvasRect.startY / scale;
      tempRect.w = canvasRect.w / scale;
      tempRect.h = canvasRect.h / scale;
      $scope.selectionArr.push(tempRect);
    }
  }
}])

.directive('canvasSelector', function factory() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div id="selector-box" hidden></div>',
    scope: {
      canvasElem: '='
    },
    link: function (scope, element, attrs) {
      scope.selectRect = {};
      scope.divMouseUpOffset = 2;

      angular.element(document).ready(function () {
        scope.canvas = $(scope.canvasElem);
        scope.canvas.on('mousedown', mouseDown);
        scope.canvas.on('mousemove', mouseMove);
        scope.selectorBox = $("#selector-box");
        scope.selectorBox.on('mouseup', mouseUp);
      });


      function mouseUp(e) {
        scope.isDragging = false;
        scope.selectorBox.hide();
        resetSelector();
      }

      function mouseDown(e) {
        scope.isDragging = true;
        scope.selectorBox.show();
        scope.selectRect.x1 = e.pageX;
        scope.selectRect.y1 = e.pageY;
        reCalc();
      }

      function mouseMove(e) {
        scope.selectRect.x2 = e.pageX;
        scope.selectRect.y2 = e.pageY;
        reCalc();
      }

      /**
       * We offset the left and width properties to make sure the selctor is slightly smaller
       * than where the cursor is, so the mouseUp event is triggered on the canvas first
       */
      function reCalc() {
        var x3 = Math.min(scope.selectRect.x1, scope.selectRect.x2);
        var x4 = Math.max(scope.selectRect.x1, scope.selectRect.x2);
        var y3 = Math.min(scope.selectRect.y1, scope.selectRect.y2);
        var y4 = Math.max(scope.selectRect.y1, scope.selectRect.y2);
        scope.selectorBox.css('left', x3 + scope.divMouseUpOffset + 'px');
        scope.selectorBox.css('top', y3 + 'px');
        scope.selectorBox.css('width', x4 - x3 - (scope.divMouseUpOffset * 2) + 'px');
        scope.selectorBox.css('height', y4 - y3 + 'px');
      }

      function resetSelector() {
        scope.selectRect = {};
      }
    }
  };
});