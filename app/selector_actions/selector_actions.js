'use strict';

angular.module('myApp.selectorActions', ['ngRoute'])
.controller('SelectorActionsCtrl', [
    '$scope',
    'canvasSelectorService',
    '$timeout',
    function($scope, canvasSelectorService, $timeout) {
        $scope.current = canvasSelectorService.getCurrent();

        $scope.deleteSelection = function(id) {
            console.log("I'm gonna delete " + id);
            canvasSelectorService.deleteCurrentSelection(id);
            canvasSelectorService.getDelegateInstance().reloadPage();
        };

        $scope.mouseDown = function ($event) {
        };

        $scope.mouseMove = function ($event) {
        };
    }])
.directive('canvasSelectorActions', [
    'canvasSelectorService',
    function(canvasSelectorService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'selector_actions/selector_actions.html',
            scope: false,
            link: function (scope, element, attrs) {
                console.log($(element).parent().parent().parent().parent().attr('selection-id'));
                scope.id = $(element).parent().parent().parent().parent().attr('selection-id');

                $(element).find('input[type="button"][value="Delete"]').on('click', function(e) {
                    $(element).parent().parent().parent().parent().hide();
                });
            }
        }
    }]);