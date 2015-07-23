angular.module('canvasSelector', [])
.factory('canvasSelectorService', ['pdfDelegate', function (pdfDelegate) {

    var canvas;
    var selector;
    var delegateHandle = 'my-pdf-container';
    var isDragging = false;
    var selectionArr = [];

    var getSelections = function() {
        return selectionArr;
    };

    var getDelegateHandle = function() {
        return delegateHandle;
    };

    var getSelectorElem = function(){
        return selector;
    };

    var draw = function(canvasRect) {
        canvas[0].getContext('2d').strokeStyle="#e7003a";
        canvas[0].getContext('2d').strokeRect(canvasRect.startX, canvasRect.startY, canvasRect.w, canvasRect.h);
        console.log(JSON.stringify(canvasRect, null, 4));
    };

    var calculateSelection = function() {
        canvas = canvas || $("#pdfCanvas");
        selector = selector || $("#selector-box");
        var offset = canvas.offset();
        var canvasRect = {};
        canvasRect.startX = parseInt(selector.css('left'), 10) - offset.left;
        canvasRect.startY = parseInt(selector.css('top'), 10) - offset.top;
        canvasRect.w = parseInt(selector.css('width'), 10);
        canvasRect.h = parseInt(selector.css('height'), 10);
        return canvasRect;
    };

    var saveSelection = function(canvasRect) {
        var page = pdfDelegate.$getByHandle(delegateHandle).getCurrentPage();
        var scale = pdfDelegate.$getByHandle('my-pdf-container').getCurrentScale();
        if(selectionArr[page] === undefined) {
            selectionArr[page] = [];
        }
        if(scale == 1) {
            selectionArr[page].push(canvasRect);
        }
        else {
            var tempRect = {};
            tempRect.startX = canvasRect.startX / scale;
            tempRect.startY = canvasRect.startY / scale;
            tempRect.w = canvasRect.w / scale;
            tempRect.h = canvasRect.h / scale;
            selectionArr[page].push(tempRect);
        }
    };

    return {
        draw: draw,
        calculateSelection: calculateSelection,
        saveSelection: saveSelection,
        getSelections: getSelections,
        getDelegateHandle: getDelegateHandle,
        getSelectorElem: getSelectorElem
    }

}]);