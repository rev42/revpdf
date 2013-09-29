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
    $.widget("revpdf.border", {
            // These options will be used as defaults
            options: {
                noneBorderButton: 'BtnBorderNone',
                allBorderButton: 'BtnBorderAll',
                bottomBorderButton: 'BtnBorderBottom',
                topBorderButton: 'BtnBorderTop',
                leftBorderButton: 'BtnBorderLeft',
                rightBorderButton: 'BtnBorderRight',
                borderWidthElement: 'Element_border_width',
                targetClass: '.elementSelected'
            },
            
            borderProperties: [
                'borderBottom',
                'borderTop',
                'borderRight',
                'borderLeft'
            ],
            
            commonValue : '#000000 solid',

            // Set up the widget
            _create: function() {
                this.list = this.element
                    .delegate("button.btn", "click", $.proxy (this._itemClick, this ))
                    .delegate("select", "change", $.proxy (this._itemChangeWidth, this ));
                this.refresh();
            },
            
            _itemChangeWidth: function(event) {
                var widthPx = this._getWidthInPx();
                var width = this._getWidth();
                var borders = [];
                var borderProperties = this.borderProperties;
                var commonValue = this.commonValue;
                var self = this;
                
                $.each([this.options.bottomBorderButton, this.options.topBorderButton, this.options.leftBorderButton, this.options.rightBorderButton], function(index, value) { 
                    if ($('#'+value).hasClass('active')) {
                        borders.push(borderProperties[index]);
                    }
                });
                
                $.each(borders, function(index, value) {
                    self._setProperty(value, widthPx+commonValue);
                });
                
                self._setElementValue(width);
            },
            
            _setElementValue: function(value) {
                $(this.options.targetClass).each(function(index){
                    $(this).trigger('setBorderWidth', [value]);
                });
            },
            
            _itemClick: function(event) {
                var width = this._getWidthInPx();
                var element = $(event.target).prop('id') === '' ? $(event.target).parent() : $(event.target);
                switch (element.prop('id')) {
                    case this.options.noneBorderButton:
                        property = 'border';
                        activeValue = '0px ' + this.commonValue;
                        notActiveValue = '0px ' + this.commonValue;
                        break;
                    case this.options.allBorderButton:
                        property = 'border';
                        activeValue = width + this.commonValue;
                        notActiveValue = '0px ' + this.commonValue;
                        break;
                    case this.options.bottomBorderButton:
                        property = 'borderBottom';
                        activeValue = width + this.commonValue;
                        notActiveValue = '0px ' + this.commonValue;
                        break;
                    case this.options.topBorderButton:
                        property = 'borderTop';
                        activeValue = width + this.commonValue;
                        notActiveValue = '0px ' + this.commonValue;
                        break;
                    case this.options.leftBorderButton:
                        property = 'borderLeft';
                        activeValue = width + this.commonValue;
                        notActiveValue = '0px ' + this.commonValue;
                        break;
                    case this.options.rightBorderButton:
                        property = 'borderRight';
                        activeValue = width + this.commonValue;
                        notActiveValue = '0px ' + this.commonValue;
                        break;
                    default:
                        throw new Error('Check options: a button name cannot be found!');
                }
                
                if ($(element).hasClass('active')) {
                    if ($.revpdf.core.prototype.isDebug()) {
                        console.log('Setting '+ property + ' to ' + notActiveValue);
                    }
                    this._setProperty(property, notActiveValue);
                } else {
                    if ($.revpdf.core.prototype.isDebug()) {
                        console.log('Setting '+ property + ' to ' + activeValue);
                    }
                    this._setProperty(property, activeValue);
                }
            },
            
            _setProperty: function(property, value) {
                $(this.options.targetClass).each(function(index){
                    $(this).css(property, value);
                });
            },
            
            refresh: function() {
            
            },
            
            _getWidth: function() {
               return $('#'+this.options.borderWidthElement+' option:selected').val();
            },
            _getWidthInPx: function() {
               return Math.ceil($('#'+this.options.borderWidthElement+' option:selected').val() * 72 / 25.4)+'px ';
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