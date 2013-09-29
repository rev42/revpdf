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
    $.widget("revpdf.fontSize", {
            // These options will be used as defaults
            options: {
                fontSizeButton: 'Element_size',
                fontNameButton: 'Element_font_family',
                targetClass: '.elementSelected'
            },

            // Set up the widget
            _create: function() {
                this.list = this.element
                    .delegate("select", "change", $.proxy (this._itemClick, this));
                this.refresh();
            },
            
            _itemClick: function(event) {
                value = $('#'+$(event.target).prop('id')+' option:selected').val();
                var element = $(event.target).prop('id') === '' ? $(event.target).parent() : $(event.target);
                switch (element.prop('id')) {
                    case this.options.fontSizeButton:
                        property = 'fontSize';
                        this._setProperty(property, value+'pt');
                        break;
                    case this.options.fontNameButton:
                        property = 'fontFamily';
                        this._setProperty(property, value);
                        break;
                    default:
                        throw new Error('Check options: a button name cannot be found!');
                }
                this._setElementValue(value);
            },
            
            _setProperty: function(property, value) {
                if ($.revpdf.core.prototype.isDebug()) {
                    console.log('Setting ' + property + ' to ' + value);
                }
                $(this.options.targetClass).each(function(index){
                    $(this).css(property, value);
                });
            },
            
            _setElementValue: function(value) {
                $(this.options.targetClass).each(function(index){
                    if (property == 'fontFamily') {
                        $(this).trigger('setFontFamily', [value]);
                    } else {
                        $(this).trigger('setFontSize', [value]);
                    }
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