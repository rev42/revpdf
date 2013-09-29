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
    $.widget("revpdf.borderWidth", {
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
                    .delegate("select", "change", $.proxy (this._itemChangeWidth, this ));
                this.refresh();
            },
            
            _itemChangeWidth: function(event) {
                if ($.revpdf.core.prototype.isDebug()) {
                    console.log('Changing Border Width');
                }
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