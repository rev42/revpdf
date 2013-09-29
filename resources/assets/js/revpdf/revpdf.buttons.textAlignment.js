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
    $.widget("revpdf.textAlignment", {
            // These options will be used as defaults
            options: {
                alignLeftButton: 'btnAlignLeft',
                alignCenterButton: 'btnAlignCenter',
                alignRightButton: 'btnAlignRight',
                targetClass: '.elementSelected'
            },

            // Set up the widget
            _create: function() {
                this.list = this.element
                    .delegate("button.btn", "click", $.proxy (this._itemClick, this ));
                this.refresh();
            },
            
            _itemClick: function(event) {
                var element = $(event.target).prop('id') === '' ? $(event.target).parent() : $(event.target);
                switch (element.prop('id')) {
                    case this.options.alignLeftButton:
                        property = 'textAlign';
                        activeValue = 'left';
                        notActiveValue = 'left';
                        break;
                    case this.options.alignCenterButton:
                        property = 'textAlign';
                        activeValue = 'center';
                        notActiveValue = 'center';
                        break;
                    case this.options.alignRightButton:
                        property = 'textAlign';
                        activeValue = 'right';
                        notActiveValue = 'right';
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
                    $(this).trigger('setAlignment', [value.charAt(0).toUpperCase()]);
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