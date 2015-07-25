angular.module('canvasSelector', [])
.factory('canvasSelectorService', ['pdfDelegate', function (pdfDelegate) {

    var canvas;
    var selector;
    var delegateHandle = 'my-pdf-container';
    var strokeStyle = "#e7003a";
    var delegateInstance = pdfDelegate.$getByHandle(delegateHandle);
    var isDragging = false;
    var selections = [];
    var current = {
        selections: []
    };

    var registerCanvas = function(canvasElem) {
        canvas = $(canvasElem);
        $(canvas).on('pagechange', function() {
            current.selections = getCurrentPageSelections();
        });
    };

    var registerSelector = function(selectorElem) {
        selector = $(selectorElem);
    };


    var getSelections = function() {
        return selections;
    };

    var getCurrentPageSelections = function() {
        var currentPage = delegateInstance.getCurrentPage();
        var currentSelections = selections[currentPage];
        if(currentSelections === undefined) {
            selections[currentPage] = [];
            currentSelections = selections[currentPage];
        }
        return currentSelections;
    };

    var getDelegateInstance = function() {
        return delegateInstance;
    };

    var getSelectorElem = function(){
        return selector;
    };

    var draw = function(canvasRect) {
        canvas[0].getContext('2d').strokeStyle=strokeStyle;
        canvas[0].getContext('2d').strokeRect(canvasRect.startX, canvasRect.startY, canvasRect.w, canvasRect.h);
        console.log(JSON.stringify(canvasRect, null, 4));
    };

    var calculateSelection = function() {
        var offset = canvas.offset();
        var canvasRect = {};
        canvasRect.startX = parseInt(selector.css('left'), 10) - offset.left;
        canvasRect.startY = parseInt(selector.css('top'), 10) - offset.top;
        canvasRect.w = parseInt(selector.css('width'), 10);
        canvasRect.h = parseInt(selector.css('height'), 10);
        return canvasRect;
    };

    var saveSelection = function(canvasRect) {
        var page = delegateInstance.getCurrentPage();
        var scale = delegateInstance.getCurrentScale();
        if(selections[page] === undefined) {
            selections[page] = [];
        }
        if(scale == 1) {
            selections[page].push(canvasRect);
        }
        else {
            var tempRect = {};
            tempRect.startX = canvasRect.startX / scale;
            tempRect.startY = canvasRect.startY / scale;
            tempRect.w = canvasRect.w / scale;
            tempRect.h = canvasRect.h / scale;
            selections[page].push(tempRect);
        }
    };

    var getCurrent = function() {
        return current;
    };

    return {
        draw: draw,
        calculateSelection: calculateSelection,
        saveSelection: saveSelection,
        getSelections: getSelections,
        getDelegateInstance: getDelegateInstance,
        getSelectorElem: getSelectorElem,
        getCurrentPageSelections: getCurrentPageSelections,
        getCurrent: getCurrent,
        registerCanvas: registerCanvas,
        registerSelector: registerSelector
    }

}]);