/*!
 * RevPDF
 * http://www.revpdf.org
 *
 * Copyright Olivier Cornu
 * 
 *
 */
var myElement = function (elementPartId, elementID, elementType, elementField, elementFormat, elementFillColor, elementTextColor, elementBorder, elementBorderWidth, elementFontFamily, elementSize, elementAutoExtend, elementStyle, elementAlignment, elementPosX, elementPosY, elementHeight, elementWidth, elementUpdated, elementZIndex) {
  this.elementID          = elementID;
  this.elementPartId      = elementPartId;
  this.elementType        = elementType;
  this.elementField       = elementField;
  this.elementFormat      = elementFormat;
  this.elementFillColor   = elementFillColor;
  this.elementTextColor   = elementTextColor;
  this.elementBorder      = elementBorder;
  this.elementBorderWidth = elementBorderWidth;
  this.elementFontFamily  = elementFontFamily;
  this.elementSize        = elementSize;
  this.elementAutoExtend  = elementAutoExtend;
  this.elementStyle       = elementStyle;
  this.elementAlignment   = elementAlignment;
  this.elementPosX        = elementPosX; // in px
  this.elementPosY        = elementPosY; // in px
  this.elementPosXmm      = elementPosX; // in mm
  this.elementPosYmm      = elementPosY; // in mm
  this.elementHeightMM    = elementHeight;
  this.elementWidthMM     = elementWidth;
  this.updated            = elementUpdated;
  this.elementZIndex      = elementZIndex;
};

myElement.prototype.getId = function () {
    return this.elementID;
};
myElement.prototype.getPartId = function () {
    return this.elementPartId;
};
myElement.prototype.getType = function () {
    return this.elementType;
};
myElement.prototype.getField = function () {
    return this.elementField;
};
myElement.prototype.getFormat = function () {
    return this.elementFormat;
};
myElement.prototype.getFillColor = function () {
    return this.elementFillColor;
};
myElement.prototype.getTextColor = function () {
    return this.elementTextColor;
};
myElement.prototype.getBorder = function () {
    return this.elementBorder;
};
myElement.prototype.getBorderWidth = function () {
    return this.elementBorderWidth;
};
myElement.prototype.getFontFamily = function () {
    return this.elementFontFamily;
};
myElement.prototype.getSize = function () {
    return this.elementSize;
};
myElement.prototype.getAutoExtend = function () {
    return this.elementAutoExtend;
};
myElement.prototype.getStyle = function () {
    return this.elementStyle;
};
myElement.prototype.getAlignment = function () {
    return this.elementAlignment;
};
myElement.prototype.getPosX = function () {
    return this.elementPosX;
};
myElement.prototype.getPosY = function () {
    return this.elementPosY;
};
myElement.prototype.getHeightMM = function () {
    return this.elementHeightMM;
};
myElement.prototype.setHeight = function (value) {
    this.elementHeight = value;
};
myElement.prototype.getWidthMM = function () {
    return this.elementWidthMM;
};
myElement.prototype.setWidth = function (value) {
    this.elementWidth = value;
};
myElement.prototype.getUpdated = function () {
    return this.updated;
};
myElement.prototype.getZIndex = function () {
    return this.elementZIndex;
};

(function( $ ) {
    // jQuery.widget( "demo.multi", {...} ) 
    // will create jQuery.demo, jQuery.demo.multi, 
    // and jQuery.demo.multi.prototype.
    $.widget("revpdf.elements", {
        // These options will be used as defaults
        options: {
            divPart: '',
            targetClass: '.elementSelected'
        },
        
        // Set up the widget
        _create: function() {
            var self = this;
            this.list = this.element.on('mousedown', function(event) {
                if ($.revpdf.core.prototype.isDebug()) {
                    console.log('Event::elements::mousedown');
                }
                var isShiftPressed;
                if (!event.shiftKey) {
                    isShiftPressed = false;
                } else {
                    isShiftPressed = true;
                }
                self._select(this, isShiftPressed);
            });
            
            $(this.element).draggable({
                containment: $('#'+this.options.divPart),
                grid: [4, 4],
                collide: 'block'
            });
            
            // Image cannot be draggable AND resizable (known bug)
            if (!$(this.element).hasClass('classImage')) {
                $(this.element).resizable({ 
                    containment: $('#'+this.options.divPart),
                    grid: [4, 4]
                });
            }
            
            this.refresh();
        },
        
        /**
         * Display Element as Selected
         */
        _select: function(element, isShiftPressed) {
            if ($.revpdf.core.prototype.isDebug()) {
                console.log('select('+$(element).prop('id')+', '+isShiftPressed+')');
            }
            
            // If shift is not pressed, remove selection for previous selected elements
            if (isShiftPressed === false) {
                $(this.options.targetClass).each(function(index){
                    $(this).removeClass('elementSelected');
                    $(this).attr('opacity', 1);
                });
            }
            
            // Set element as Selected
            if ($(element).hasClass('elementNotSelected') === true) {
                $(element).setOpacity(1);
            }
            $(element).addClass("elementSelected");
        },
        
        _setProperty: function(property, value) {
            $(this.options.targetClass).each(function(index){
                $(this).css(property, value);
            });
        },

        refresh: function() {

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
