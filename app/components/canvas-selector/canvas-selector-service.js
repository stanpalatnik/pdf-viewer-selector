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
        selections: [],
        offset: {}
    };

    var registerCanvas = function(canvasElem) {
        canvas = $(canvasElem);
        current.offset = canvas.offset();
        $(canvas).on('pagechange', function() {
            current.selections = getCurrentPageSelections();
            current.offset = canvas.offset();
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
        var canvasRect = {};
        canvasRect.startX = parseInt(selector.css('left'), 10) - current.offset.left;
        canvasRect.startY = parseInt(selector.css('top'), 10) - current.offset.top;
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
            canvasRect.id = generateId();
            canvasRect.scaledStartX = canvasRect.startX;
            canvasRect.scaledStartY = canvasRect.startY;
            canvasRect.scaledW = canvasRect.w;
            canvasRect.scaledH = canvasRect.h;
            selections[page].push(canvasRect);
        }
        else {
            var tempRect = {};
            tempRect.id = generateId();
            tempRect.startX = canvasRect.startX / scale;
            tempRect.startY = canvasRect.startY / scale;
            tempRect.w = canvasRect.w / scale;
            tempRect.h = canvasRect.h / scale;

            tempRect.scaledStartX = canvasRect.startX;
            tempRect.scaledStartY = canvasRect.startY;
            tempRect.scaledW = canvasRect.w;
            tempRect.scaledH = canvasRect.h;
            selections[page].push(tempRect);
        }
    };

    var deleteCurrentSelection = function(id){
        var currentPage = delegateInstance.getCurrentPage();
        selections[currentPage] = selections[currentPage].
            filter(function(selection) {
                        return selection.id != id;
            });
        //current.selections = getCurrentPageSelections();
        console.log(selections[currentPage]);
    };

    var getCurrent = function() {
        return current;
    };

    function generateId()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

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
        registerSelector: registerSelector,
        deleteCurrentSelection: deleteCurrentSelection
    }

}]);