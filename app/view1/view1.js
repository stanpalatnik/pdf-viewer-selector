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
'canvasSelectorService',
'$timeout',
function($scope, canvasSelectorService, $timeout) {
  $scope.pdfUrl = '/app/pdf/contribution_card_cc_eng.pdf';
  $scope.currentPage = 1;

  $scope.loadNewFile = function(url) {
    pdfDelegate
        .$getByHandle('my-pdf-container')
        .load(url);
  };

  $scope.mouseUp = function ($event) {
    var canvasRect = canvasSelectorService.calculateSelection();
    canvasSelectorService.draw(canvasRect);
    canvasSelectorService.saveSelection(canvasRect);
    canvasSelectorService.getSelectorElem().trigger('mouseup');
  };

  $scope.mouseDown = function ($event) {
  };

  $scope.mouseMove = function ($event) {
  };
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
        scope.selectorBox.on('mousemove', mouseMove);
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
})
.directive("canvasNavigationEvents", [
  'pdfDelegate',
  'canvasSelectorService',
  function(pdfDelegate, canvasSelectorService) {
    return {
      restrict: "A",
      scope: false,
      link: function(scope, elem, attrs) {
        $(elem).on('pagechange', pageChanged);
        $(elem).on('scalechange', scaleChanged);
        scope.$watch('selectionArr', function(newVal) {
          console.log(newVal);
        });

        function pageChanged(e) {
          var page = scope.currentPage = canvasSelectorService.getDelegateHandle().getCurrentPage();
          var pageSelections = canvasSelectorService.getSelections[page];
          if(pageSelections !== undefined) {
            pageSelections.forEach(function(selection) {
              canvasSelectorService.draw(selection);
            });
          }
        }

        function scaleChanged(e) {

        }
      }
    }
  }]);