/*!
 * RevPDF
 * http://www.revpdf.org
 *
 * Copyright Olivier Cornu
 * 
 *
 */
(function( $ ) {
    // // jQuery.widget( "demo.multi", {...} ) 
    // will create jQuery.demo, jQuery.demo.multi, 
    // and jQuery.demo.multi.prototype.
    $.widget("revpdf.divAlignment", {
            // These options will be used as defaults
            options: {
                alignLeftButton: 'btnDivAlignLeft',
                alignTopButton: 'btnDivAlignTop',
                alignBottomButton: 'btnDivAlignBottom',
                alignRightButton: 'btnDivAlignRight',
                targetClass: '.elementSelected'
            },

            // Set up the widget
            _create: function() {
                this.list = this.element
                    .delegate("button.btn", "click", $.proxy (this._itemClick, this ));
                this.refresh();
            },
            
            _itemClick: function(event) {
                var self = this;
                var arrayX;
                var element = $(event.target).prop('id') === '' ? $(event.target).parent() : $(event.target);
                switch (element.prop('id')) {
                    case this.options.alignLeftButton:
                        arrayX = this._findLayer(this.options.targetClass, "minX");
                        $(this.options.targetClass).each(function(index){
                            var id = $(this).prop('id');
                            if (arrayX[0] !== id) {
                                if (self._collisionDetection("alignToLeft", arrayX[0], id) === false) {
                                    pos = $('#'+arrayX[0]).position().left;
                                    $('#'+id).css('left', pos);
                                } else {
                                    var otherBorder = $('#'+arrayX[0]).getElementBorder();
                                    pos = $('#'+arrayX[0]).position().left;
                                    $('#'+id).css('left', parseInt(pos+$('#' + arrayX[0]).getElementWidth() + otherBorder[3].valueOf(), 10));
                                }
                            }
                        });
                        this._setElementValue('posx');
                        break;
                        
                    case this.options.alignRightButton:
                        arrayX = this._findLayer(this.options.targetClass, "maxX");
                        $(this.options.targetClass).each(function(index){
                            var id = $(this).prop('id');
                            if (arrayX[0] !== id) {
                                if (self._collisionDetection("alignToRight", arrayX[0], id) === false) {
                                    pos = $('#'+arrayX[0]).position().left;
                                    $('#'+id).css('left', $('#'+arrayX[0]).position().left+$('#'+arrayX[0]).getElementWidth()-$('#'+id).getElementWidth());
                                } else {
                                    var otherBorder = $('#'+arrayX[0]).getElementBorder();
                                    pos = $('#'+arrayX[0]).position().left;
                                    $('#'+id).css('left', parseInt(pos-$('#'+id).getElementWidth() - otherBorder[1].valueOf(), 10));
                                }
                            }
                        });
                        this._setElementValue('posx');
                        break;
                        
                    case this.options.alignTopButton:
                        arrayY = this._findLayer(this.options.targetClass, "minY");
                        $(this.options.targetClass).each(function(index){
                            var id = $(this).prop('id');
                            if (arrayY[0] !== id) {
                                if (self._collisionDetection("alignToTop", arrayY[0], id) === false) {
                                    pos = $('#'+arrayY[0]).position().top;
                                    $('#'+id).css('top', pos);
                                } else {
                                    var otherBorder = $('#'+arrayY[0]).getElementBorder();
                                    pos = $('#'+arrayY[0]).position().top;
                                    $('#'+id).css('top', parseInt(pos+$('#'+arrayY[0]).getElementHeight() + otherBorder[2].valueOf(), 10));
                                }
                            }
                        });
                        this._setElementValue('posy');
                        break;
                        
                    case this.options.alignBottomButton:
                        arrayY = this._findLayer(this.options.targetClass, "maxY");
                        $(this.options.targetClass).each(function(index){
                            var id = $(this).prop('id');
                            if (arrayY[0] !== id) {
                                if (self._collisionDetection("alignToBottom", arrayY[0], id) === false) {
                                    $('#'+id).setPositionY(arrayY[1] + $('#'+arrayY[0]).getElementHeight() - $('#'+id).getElementHeight());
                                } else {
                                    var eltBorder = $('#'+id).getElementBorder();
                                    var pos = $('#'+arrayY[0]).position().top;
                                    $('#'+id).setPositionY(parseInt(pos - $('#'+id).getElementHeight() - eltBorder[0].valueOf(), 10));
                                }
                            }
                        });
                        this._setElementValue('posy');
                        break;
                        
                    default:
                        throw new Error('Check options: a button name cannot be found!');
                }
            },
            
            _setElementValue: function(value) {
                $(this.options.targetClass).each(function(index){
                        $(this).trigger('setDivAlignement', [value]);
                });
            },

            refresh: function() {
            
            },
            
            _collisionDetection: function(functionType, ReferenceLayer, layer2)
            {
                var topLeft2, topLeft1;
                var topRight1, topRight2;
                var bottomRight1;
                var bottomLeft1, bottomLeft2;

                topLeft2 = [$('#'+layer2).getPositionX(), $('#'+layer2).getPositionY()];
                topRight1 = [$('#'+ReferenceLayer).getPositionX() + $('#'+ReferenceLayer).getElementWidth(), $('#'+ReferenceLayer).getPositionY()];
                topRight2 = [$('#'+layer2).getPositionX() + $('#'+layer2).getElementWidth(), $('#'+layer2).getPositionY()];
                topLeft1 = [$('#'+ReferenceLayer).getPositionX(), $('#'+ReferenceLayer).getPositionY()];
                bottomLeft1 = [$('#'+ReferenceLayer).getPositionX(), $('#'+ReferenceLayer).getPositionY() + $('#'+ReferenceLayer).getElementHeight()];
                bottomLeft2 = [$('#'+layer2).getPositionX(), $('#'+layer2).getPositionY() + $('#'+layer2).getElementHeight()];
                bottomRight1 = [$('#'+ReferenceLayer).getPositionX() + $('#'+ReferenceLayer).getElementWidth(), $('#'+ReferenceLayer).getPositionY() + $('#'+ReferenceLayer).getElementHeight()];

                if (functionType == "alignToRight" || functionType == "alignToLeft") {
                    if ((bottomLeft2[1] - topRight1[1] > 0) && (bottomRight1[1] - bottomLeft2[1] > 0)) {
                        return true;
                    }
                    if ((topLeft2[1] - topRight1[1] > 0) && (bottomRight1[1] - topLeft2[1] > 0)) {
                        return true;
                    }
                } else {
                    if ((topRight2[0] - bottomLeft1[0] > 0) && (bottomRight1[0] - topRight2[0] > 0)) {
                        return true;
                    }
                    if ((topLeft2[0] - bottomLeft1[0] > 0) && (bottomRight1[0] - topLeft2[0] > 0)) {
                        return true;
                    }
                    // Same origin on X axis
                    if (topLeft2[0] == topLeft1[0]) {
                        return true;
                    }
                    // Same X for top right plot
                    if (topRight2[0] == topRight1[0]) {
                        return true;
                    }
                }
                return false;
            },
            
            _findLayer: function(myArrayOfElement, option)
            {
                var min = 99999;
                var max = 0;
                var myArray = [];

                switch (option) {
                    case "maxX":
                        $(myArrayOfElement).each(function(index){
                            arrayPos = $(this).getPositionX();
                            max = Math.max(max, parseInt(arrayPos, 10));
                            if (max == parseInt(arrayPos, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = max;
                            }
                        });
                        break;
                    case "minX":
                        $(myArrayOfElement).each(function(index){
                            arrayPos = $(this).getPositionX();
                            min = Math.min(min, parseInt(arrayPos, 10));
                            if (min == parseInt(arrayPos, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = min;
                            }
                        });
                        break;
                    case "maxY":
                        $(myArrayOfElement).each(function(index){
                            arrayPosY = $(this).getPositionY();
                            max = Math.max(max, parseInt(arrayPosY, 10));
                            if (max == parseInt(arrayPosY, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = max;
                            }
                        });
                        break;
                    case "minY":
                        $(myArrayOfElement).each(function(index){
                            arrayPosY = $(this).getPositionY();
                            min = Math.min(min, parseInt(arrayPosY, 10));
                            if (min == parseInt(arrayPosY, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = min;
                            }
                        });
                        break;
                    case "maxWidth":
                        $(myArrayOfElement).each(function(index){
                            array = $(this).getElementWidth();
                            max = Math.max(max, parseInt(array, 10));
                            if (max == parseInt(array, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = max;
                            }
                        });
                        break;
                    case "minWidth":
                        $(myArrayOfElement).each(function(index){
                            array = $(this).getElementWidth();
                            min = Math.min(min, parseInt(array, 10));
                            if (min == parseInt(array, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = min;
                            }
                        });
                        break;
                    case "minHeight":
                        $(myArrayOfElement).each(function(index){
                            array = $(this).getElementHeight();
                            min = Math.min(min, parseInt(array, 10));
                            if (min == parseInt(array, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = min;
                            }
                        });
                        break;
                    case "maxHeight":
                        $(myArrayOfElement).each(function(index){
                            array = $(this).getElementHeight();
                            max = Math.max(max, parseInt(array, 10));
                            if (max == parseInt(array, 10)) {
                                myArray[0] = $(this).prop('id');
                                myArray[1] = max;
                            }
                        });
                        break;
                }

                return myArray;
            },

            // Use the _setOption method to respond to changes to options
            _setOption: function(key, value) {
                if (key == 'clear') {
                    // handle changes to clear option
                }
                this._superApply(arguments);
            },

            // Use the destroy method to clean up any modifications your widget has made to the DOM
            _destroy: function() {
                // Perform widget-specific cleanup
            }
    });
}( jQuery ));