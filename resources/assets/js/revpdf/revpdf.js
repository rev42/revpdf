/*!
 * RevPDF
 * http://www.revpdf.org
 *
 * Copyright Olivier Cornu
 * 
 *
 */
(function( $ ) {
    // jQuery.widget( "demo.multi", {...} ) 
    // will create jQuery.demo, jQuery.demo.multi, 
    // and jQuery.demo.multi.prototype.
    $.widget("revpdf.core", {
        // These options will be used as defaults
        options: {
            debug: 0,
            mmPxFactor: 4,
            elementBoxUl: 'elementBox',
            supportedElements: [["elementTextField","TextField"],["elementTextZone","TextZone"],["elementPageNumber","PageNumber"],["elementImage","Image"],["elementLine","Line"],["elementRectangle","Rectangle"],["elementRoundedBox","RoundedBox"]],
            report:{},
            formElementFillColor: "#Element_fill_color",
            formElementTextColor: "#Element_text_color",
            formElementBorderWidth: "#Element_border_width",
            formElementSize: "#Element_size",
            formElementFontFamily: "#Element_font_family",
            formElementPosXmm: "#Element_posxmm",
            formElementPosX: "#Element_posx",
            formElementPosYmm: "#Element_posymm",
            formElementPosY: "#Element_posy",
            formElementHeight: "#Element_height",
            formElementWidth: "#Element_width",
            formElementType: "#Element_type",
            formElementField: "#Element_element_field",
            formElementSelected: "#Element_formElementSelected",
            formElementZindex: "#Element_zindex",
            formElementSourceControl: "#Element_source_control",
            formElementFormat: "#Element_format",
            formElementIsAutoExtend : "#Element_is_auto_extend",
            
            menuGroupBorder: "#btnBorderButtons",
            menuBorderNoneButton: "#BtnBorderNone",
            menuBorderAllButton: "#BtnBorderAll",
            menuBorderBottomButton: "#BtnBorderBottom",
            menuBorderTopButton: "#BtnBorderTop",
            menuBorderLeftButton: "#BtnBorderLeft",
            menuBorderRightButton: "#BtnBorderRight",
            
            menuGroupFontstyle: "#btnFontstyleButtons",
            menuBoldButton: "#BtnFontStyleBold",
            menuItalicButton: "#BtnFontStyleItalic",
            menuUnderlineButton: "#BtnFontStyleUnderlined",
            
            menuGroupAlignement: "#btnAlignmentButtons",
            menuLeftAlignButton: "#btnAlignLeft",
            menuCenterAlignButton: "#btnAlignCenter",
            menuRightAlignButton: "#btnAlignRight",

            menuGroupDivAlignment: "#btnDivAlignmentButtons",
            menuDivAlignToLeftButton: "#btnDivAlignLeft",
            menuDivAlignToRightButton: "#btnDivAlignRight",
            menuDivAlignToBottomButton: "#btnDivAlignBottom",
            menuDivAlignToTopButton: "#btnDivAlignTop",
            
            menuFontColorPickerButton: "#fontColorPicker",
            menuFillColorPickerButton: "#fillColorPicker",
            
            // CSS class of selected elements
            targetClass: '.elementSelected',
            
            // Id of save button
            saveButton: "#save-report-button",
            statusMessagesContainer: "#status-messages",
            deleteElementUrlInput: "#Element_delete_element_url"
        },
        
        // Debug function
        // To use it outside of this object: $.revpdf.core.prototype.isDebug()
        isDebug: function() {
            // Chrome
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && this.options.debug == 1) {
                return true;
            }
            if (window.console && (window.console.firebug || window.console.exception) && this.options.debug == 1) {
                return true;
            } else {
                return false;
            }
        },
        
        // Set up the widget
        _create: function() {
            var self = this;
            
            this.buildContextualMenu();
            
            // Events on form elements

            $(document).mouseup(function() {
                if (self.isDebug()) {
                    console.log('Event::document::mouseup');
                }
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this);
                });
            });
            
            /**
             * Save report
             */
            $(this.options.saveButton).bind('click', function(event){
                $(this).button('loading');
                // Do not follow href
                event.preventDefault();
                
                if (self.isDebug()) {
                    console.groupCollapsed('Saving Report...');
                }
                var nbPart             = self.options.report.getPartCount();
                var nbElement          = 0;
                var serializePart      = [];
                var partToSerialize    = [];
                var elementID          = '';
                var b_updated          = 0;
                var part               = null;
                
                for (var j=0; j<nbPart; j++) {
                    part = self.options.report.getPart(j);
                    if (self.isDebug()) {
                        console.groupCollapsed('PartID: '+ part.getPartId());
                    }
                    self.options.report.setCurrentPartSelected(part.getPartId());
                    nbElement = part.partElementList.length;
                    if (nbElement > 0) {
                        for (var i=0; i<nbElement; i++) {
                            elementID = part.partElementList[i].elementID;
                            b_updated = part.partElementList[i].updated;
                            if (self.isDebug()) {
                                console.log('Element: '+elementID+' / updated: '+b_updated);
                            }
                            if (elementID !== undefined && b_updated !== 0) {
                                part.setUpdated(true);
                            }
                        }
                    }
                    if (part.isUpdated() === true) {
                        partToSerialize[partToSerialize.length] = part;
                    }
                    if (self.isDebug()) {
                        console.groupEnd();
                    }
                }
                
                serializePart = JSON.stringify(partToSerialize);
                
                if (self.isDebug()) {
                    console.log('serialized values:'+serializePart);
                }
                
                if (self.isDebug()) {
                    console.groupEnd();
                }
                
                // Launch Ajax updater
                var url = $(this).data('href');
                var params = 'serialized=' + encodeURIComponent(serializePart);
                jQuery.ajax({
                    url: url,
                    type: 'post',
                    data: params,
                    error: function(jqXHR, textStatus, errorThrown) {
                        $('.message').remove();
                        $(self.options.statusMessagesContainer).removeClass('alert-success').addClass('alert-error');
                        var messages = JSON.parse(jqXHR.responseText);
                        if (typeof messages.message !== undefined){
                            msg = messages.message;
                        } else {
                            msg = errorThrown;
                        }
                        $(self.options.statusMessagesContainer).append('<p class="message">['+jqXHR.status+']: '+msg+'('+textStatus+')</p>').show().fadeOut(7000);
                        $(self.options.saveButton).button('reset');
                        if (self.isDebug()) {
                            console.log('NOT saved!');
                        }
                    },
                    success: function(json){
                        $('.message').remove();
                        if (json.status == 'KO'){
                            $(self.options.statusMessagesContainer).removeClass('alert-success').addClass('alert-error');
                        } else {
                            $(self.options.statusMessagesContainer).removeClass('alert-error').addClass('alert-success');
                        }
                        $(self.options.statusMessagesContainer).append('<p class="message">'+json.message+'</p>').show().fadeOut(7000);
                        $(self.options.saveButton).button('reset');
                        if (self.isDebug()) {
                            console.log('Saved!');
                        }
                    }
                });
            });
            
            
            
            /**
             * Item:  Element pos Xmm
             * Event: Change
             */
            $(this.options.formElementPosXmm).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    $(this).setPositionX(parseInt($(self.options.formElementPosXmm).val() * self.options.mmPxFactor, 10));
                    self.updateElement(this, 'elementPosXmm');
                });
            });
            
            /**
             * Item:  Element pos Ymm
             * Event: Change
             */
            $(this.options.formElementPosYmm).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    $(this).setPositionY(parseInt($(self.options.formElementPosYmm).val() * self.options.mmPxFactor, 10));
                    self.updateElement(this, 'elementPosYmm');
                });
            });
            
            /**
             * Item:  Element width
             * Event: Change
             */
            $(this.options.formElementWidth).bind('change', function(){
                var arrayBorder;
                var maxAllowed;
                $(self.options.targetClass).each(function(index){
                    arrayBorder = $(this).getElementBorder();
                    maxAllowed = self.options.report.getReportWidth() - arrayBorder[1].valueOf() - arrayBorder[3].valueOf();
                    if (parseInt($(self.options.formElementWidth).val() * self.options.report.getMmPxFactor(), 10) > maxAllowed) {
                        $(self.options.formElementWidth).val(self.options.report.getReportWidth() / self.options.report.getMmPxFactor());
                    }
                    $(this).setElementWidth($(self.options.formElementWidth).val() * self.options.report.getMmPxFactor());
                    self.updateElement(this, 'elementWidthMM');
                });
            });
            
            /**
             * Item:  Element height
             * Event: Change
             */
            $(this.options.formElementHeight).bind('change', function(){
                var arrayBorder;
                var maxAllowed;
                $(self.options.targetClass).each(function(index){
                    arrayBorder = $(this).getElementBorder();
                    maxAllowed = parseInt($(this).parent().height() - arrayBorder[0].valueOf() - arrayBorder[2].valueOf(), 10);
                    if (parseInt($(self.options.formElementHeight).val() * self.options.report.getMmPxFactor(), 10) > maxAllowed) {
                        $(self.options.formElementHeight).val($(this).parent().height() / self.options.report.getMmPxFactor());
                    }
                    $(this).setElementHeight($(self.options.formElementHeight).val() * self.options.report.getMmPxFactor());
                    self.updateElement(this, 'elementHeightMM');
                });
            });
            
            /**
             * Item:  Element field
             * Event: Change
             */
            $(this.options.formElementField).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    if ($(this).hasClass('classImage')) {
                        $(this).attr('src', $(self.options.formElementField).val());
                    } else {
                        $('#'+$(this).prop('id')+' > span').text($(self.options.formElementField).val());
                        $(this).attr('title', $(self.options.formElementField).val() + ' (' + $(self.options.formElementType).val() + ')');
                    }
                    //$.revpdf.elements.prototype.test();
                    //self.options.report.updateElement(this, 'elementField');
                    self.updateElement(this, 'elementField');
                });
            });
            
            /**
             * Item:  Element format
             * Event: Change
             */ 
            $(this.options.formElementFormat).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementFormat');
                });
            });
            
            /**
             * Item:  Element zIndex
             * Event: Change
             */
            $(this.options.formElementZindex).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    $(this).setZIndex($(self.options.formElementZindex).val());
                    self.updateElement(this, 'elementZIndex');
                });
            });
            
            /**
             * Item:  Element auto-extend
             * Event: Change
             */
            $(this.options.formElementIsAutoExtend).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementAutoExtend');
                });
            });
            
            /**
             * Item:  Element SourceControl
             * Event: Change
             */
            $(this.options.formElementSourceControl).bind('change', function(){
                $(self.options.targetClass).each(function(index){
                    $(self.options.formElementField).val($(self.options.formElementSourceControl).val());
                    $(self.options.formElementField).trigger('change');
                });
            });
            
            /**
             * Item:  Element Border
             * Event: Click
             */ 
            $(this.options.menuGroupBorder+' > button').bind('click', function(){
                var buttonId = '#'+$(this).prop('id');
                var value = '';
                if (buttonId == self.options.menuBorderAllButton)
                    value = 'LRTB';
                if (buttonId == self.options.menuBorderTopButton)
                    value = 'T';
                if (buttonId == self.options.menuBorderBottomButton)
                    value = 'B';
                if (buttonId == self.options.menuBorderRightButton)
                    value = 'R';
                if (buttonId == self.options.menuBorderLeftButton)
                    value = 'L';
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementBorder', value);
                });
            });
            
            /**
             * Item:  Element Font Style
             * Event: Click
             */ 
            $(this.options.menuGroupFontstyle+' > button').bind('click', function(){
                var buttonId = '#'+$(this).prop('id');
                var value = '';
                if (buttonId == self.options.menuBoldButton)
                    value = 'B';
                if (buttonId == self.options.menuItalicButton)
                    value = 'I';
                if (buttonId == self.options.menuUnderlineButton)
                    value = 'U';
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementStyle', value);
                });
            });
            
            /**
             * Item:  Font Colorpicker
             * Event: ChangeColor, Hide
             */
            $(this.options.menuFontColorPickerButton).colorpicker().on('changeColor', function(ev){
                $(self.options.targetClass).each(function(index){
                    if (self.isDebug()) {
                        console.log('Text Color changed to: '+ev.color.toHex());
                    }
                    $(this).setTextColor(ev.color.toHex());
                });
            }).on('hide', function(event){
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementTextColor', event.color.toHex());
                });
            });
            
            /**
             * Item:  Fill Colorpicker
             * Event: ChangeColor, Hide
             */
            $(this.options.menuFillColorPickerButton).colorpicker().on('changeColor', function(ev){
                $('.elementSelected').each(function(index){
                    if (self.isDebug()) {
                        console.log('Fill Color changed to: '+ev.color.toHex());
                    }
                    $(this).setFillColor(ev.color.toHex());
                });
            }).on('hide', function(event){
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementFillColor', event.color.toHex());
                });
            });




            /**
             * Item:  Div Alignment
             * Event: Click
             */
            $(this.options.menuGroupDivAlignment+' > button').bind('click', function(){
                var buttonId = '#'+$(this).prop('id');
                var value = '';
                if (buttonId == self.options.menuDivAlignToLeftButton)
                    value = 'posx';
                if (buttonId == self.options.menuDivAlignToRightButton)
                    value = 'posx';
                if (buttonId == self.options.menuDivAlignToBottomButton)
                    value = 'posy';
                if (buttonId == self.options.menuDivAlignToTopButton)
                    value = 'posy';
                $(self.options.targetClass).each(function(index){
                    self.updateElement(this, 'elementDivAlignment', value);
                });
            });
            
            
            
            // Element box items
            $.each(this.options.supportedElements, function(index, item) {
                // Make Element box items draggable
                $('#'+self.options.elementBoxUl).append(
                    '<li id="'+item[0]+'" data-elementtype="'+item[1]+'"><i class="icon-rev icon-'+item[1].toLowerCase()+'"></i>'+item[1]+'</li>'
                );
                if ($('#'+item[0])) {
                    $('#'+item[0]).draggable({
                        revert: true, helper: "clone"
                    });
                }

                // Add double-click event for all supported elements (Element box)
                $('#'+item[0]).dblclick(function() {
                    self.addElement(item[1]);
                });
            });



            // Add parts
            var divs = '';
            $.each(this.options.report.partList, function(index, part) {
                // set HTML representation
                divs += part.getTemplate();
            });

            // Add parts to DOM
            $(self.element).html(divs);

            // Change part selection when user clicks on Part title
            $('.part-header > span').each(function(index, item) {
                $(item).bind('click', function(el){
                    var divId = $(this).parent().parent().parent().attr('id');
                    splitted = divId.split('-');
                    self.togglePartSelection(splitted[1]);
                });
            });

            // *Force* select first part
            $.each(this.options.report.partList, function(index, part) {
                if (index === 0) {
                    self.togglePartSelection(part.getId());
                }
            });

            // Set parts droppable and resizable
            $.each(this.options.report.partList, function(index, part) {
                var partId = this.getId();
                $('#part_'+partId).droppable({
                    accept: '#elementTextField, #elementTextZone, #elementPageNumber, #elementImage, #elementLine,  #elementRectangle, #elementRoundedBox',
                    drop: function(event, ui) {
                        self.addElement($(ui.draggable).data('elementtype'));
                    },
                    over:function(event, ui) {
                        self.togglePartSelection(partId);
                    }
                });
                
                $('#part_'+partId).resizable({
                    grid: [4, 4],
                    handles: 's',
                    resize: function(event, ui) {
                        part.setHeightFromPx(ui.element.height(), self.options.report.getMmPxFactor());
                        $('#height-'+part.getPartId()).val(part.getPartHeight());
                    }
                });

                // Add Elements into current part
                nbElement = this.getElements().length;
                if (self.isDebug()) {
                    console.groupCollapsed('Part.prototype.display');
                    console.log("Part ID: "+this.getId());
                    console.log("Part ReportID: "+this.getPartReportId());
                    console.log("Part number: "+this.getPartNumber());
                    console.log("Part height: "+this.getPartHeight());
                    console.log("Element(s) nb : "+nbElement);
                }

                if (nbElement > 0) {
                    var cur;
                    var div;
                    for (var i = 0; i < nbElement; i++) {
                        cur = this.getElement(i);
                        if (self.isDebug()) {
                            console.groupCollapsed('Element ID:'+cur.getId());
                            console.dir(cur);
                            console.groupEnd();
                        }
                        var divClass = "class" + cur.getType();
                        if (cur.getType() !== "Image") {
                            div = '<div id="' + cur.getId() + '" class="' + divClass + '"  title="' + cur.getField() + ' (' + cur.getType() + ')" style="position: absolute;"><span></span></div>';
                        } else {
                            div = '<img title="' + cur.getType() + '" style="position: absolute; max-height: ' + $('#part' + this.getId()).height() + 'px; max-width: ' + $('#part' + this.getId()).width() + 'px" id="' + cur.getId() + '" class="' + divClass + '" id="' + cur.getId() + '" src="' + cur.getField() + '" alt="' + cur.getField() + '" />';
                        }

                        $(div).appendTo($('#part_'+ this.getPartId()));
                        $('#'+cur.getId()).setPositionX(this.partElementList[i].elementPosX);
                        $('#'+cur.getId()).setPositionY(this.partElementList[i].elementPosY);
                        $('#'+cur.getId()).setBorder(this.partElementList[i].elementBorder, this.partElementList[i].elementBorderWidth);
                        $('#'+cur.getId()).setElementHeight(this.partElementList[i].elementHeightMM * self.options.report.getMmPxFactor());
                        $('#'+cur.getId()).setElementWidth(this.partElementList[i].elementWidthMM * self.options.report.getMmPxFactor());
                        $('#'+cur.getId()+' > span').setField(cur.getField());
                        $('#'+cur.getId()).setFillColor(this.partElementList[i].elementFillColor);
                        $('#'+cur.getId()).setTextColor(this.partElementList[i].elementTextColor);
                        $('#'+cur.getId()).setFontStyle(this.partElementList[i].elementStyle);
                        $('#'+cur.getId()).setAlignment(this.partElementList[i].elementAlignment);
                        $('#'+cur.getId()).setFontSize(this.partElementList[i].elementSize);
                        $('#'+cur.getId()).setFontFamily(this.partElementList[i].elementFontFamily);
                        
                        $('#'+cur.getId()).elements({
                            'divPart': 'part_'+this.getPartId()
                        });
                        
                        $('#'+cur.getId()).bind("drag", function(event, ui) {
                            self.dragEvent(event, ui);
                        }).bind("resize", function(event, ui) {
                            self.resizeEvent(event, ui);
                        });

                        $('#'+cur.getId()).bind('mouseup', function(){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::mouseup');
                            }
                            self.updateElement(this);
                        });
                        
                        $('#'+cur.getId()).bind('mousedown', function(){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::mousedown');
                            }
                            self.togglePartSelection(part.getPartId());
                            self.setFormValues($(this));
                        });
                        
                        /**
                         * Custom event binding
                         */
                        $('#'+cur.getId()).bind('setAlignment', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setAlignment');
                            }
                            self.updateElement(this, 'elementAlignment', value);
                        });
                        
                        $('#'+cur.getId()).bind('setFontStyle', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setFontStyle');
                            }
                            self.updateElement(this, 'elementStyle', value);
                        });
                        $('#'+cur.getId()).bind('setFontFamily', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setFontFamily');
                            }
                            self.updateElement(this, 'elementFontFamily', value);
                        });
                        $('#'+cur.getId()).bind('setFontSize', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setFontSize');
                            }
                            self.updateElement(this, 'elementSize', value);
                        });
                        $('#'+cur.getId()).bind('setBorderWidth', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setBorderWidth');
                            }
                            self.updateElement(this, 'elementBorderWidth', value);
                        });
                        $('#'+cur.getId()).bind('setBorder', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setBorder');
                            }
                            self.updateElement(this, 'elementBorder', value);
                        });
                        $('#'+cur.getId()).bind('setDivAlignement', function(event, value){
                            if (self.isDebug()) {
                                console.log('Event::revpdf::setDivAlignement');
                            }
                            self.updateElement(this, 'elementDivAlignment', value);
                        });
                    }
                }
                if (self.isDebug()) {
                    console.groupEnd();
                }
            });
            
            this.refresh();
        },
        
        dragEvent: function(event, ui) {
            $(this.options.formElementPosX).val(ui.helper.getPositionX());
            $(this.options.formElementPosY).val(ui.helper.getPositionY());
            $(this.options.formElementPosXmm).val(Math.round(Number(ui.helper.getPositionX()) / this.options.report.getMmPxFactor()));
            $(this.options.formElementPosYmm).val(Math.round(Number(ui.helper.getPositionY()) / this.options.report.getMmPxFactor()));
        },
        
        resizeEvent: function(event, ui) {
          $(this.options.formElementHeight).val(parseInt(ui.element.height()/this.options.report.getMmPxFactor(), 10));
          $(this.options.formElementWidth).val(parseInt(ui.element.width()/this.options.report.getMmPxFactor(), 10));  
        },
        
        refresh: function() {

        },
        


        addElement: function(elementType, aElement) {
            var self = this;
            var elementField = '';
            var selectedDivPart = this.options.report.getCurrentPartDivSelected();
            var selectedPart = this.options.report.getPartById(this.options.report.getCurrentPartSelected()); 
            if (this.isDebug()) {
                console.log('Adding element '+elementType+' to ' + selectedDivPart);
            }
            
            // Add physically the element into the page
            $('<div id="tmpElement" class="class'+elementType+'" style="position: absolute;"><span>' + elementField + '</span></div>').appendTo($('#'+selectedDivPart));

            var elementList;
            var tmpElement;
            var elementBorder        = "LRTB";
            var elementAutoExtend    = 0;
            var elementStyle         = "";
            var elementZIndex        = 0;
            var elementTextAlignment = "L";
            var elementFillColor     = "FFFFFF";
            var elementTextColor     = "000000";
            var elementBorderWidth   = 0.2;
            var elementSize          = 12;
            var elementFormat        = 'text';
            var elementFontFamily    = "helvetica";
            var elementHeight        = $('#tmpElement').getElementHeight();
            var elementHeightMM      = $('#tmpElement').getElementHeight() / this.options.report.getMmPxFactor();
            var elementWidth         = $('#tmpElement').getElementWidth();
            var elementWidthMM       = $('#tmpElement').getElementWidth() / this.options.report.getMmPxFactor();
            var elementPosX          = $('#tmpElement').getPositionX();
            var elementPosY          = $('#tmpElement').getPositionY();
            var elementUpdated       = 1;

            if (aElement) {
                elementField         = aElement.elementField;
                elementBorder        = aElement.elementBorder;
                elementAutoExtend    = aElement.elementAutoExtend;
                elementStyle         = aElement.elementStyle;
                elementZIndex        = aElement.elementZIndex;
                elementTextAlignment = aElement.elementAlignment;
                elementFormat        = aElement.elementFormat;
                elementFillColor     = aElement.elementFillColor;
                elementTextColor     = aElement.elementTextColor;
                elementBorderWidth   = aElement.elementBorderWidth;
                elementSize          = aElement.elementSize;
                elementFontFamily    = aElement.elementFontFamily;
                elementHeight        = aElement.elementHeight;
                elementWidth         = aElement.elementWidth;
                elementHeightMM      = aElement.elementHeightMM;
                elementWidthMM       = aElement.elementWidthMM;
                elementPosX          = aElement.elementPosX;
                elementPosY          = aElement.elementPosY;
            }
            $(this.options.formElementFillColor).val(elementFillColor);
            $(this.options.formElementTextColor).val(elementTextColor);
            $(this.options.formElementBorderWidth).val(elementBorderWidth);
            $(this.options.formElementSize).val(elementSize);
            $(this.options.formElementFontFamily).val(elementFontFamily);
            $(this.options.formElementHeight).val(elementHeightMM);
            $(this.options.formElementWidth).val(elementWidthMM);
            elementList = document.getElementsByClassName("class" + elementType);

            if (elementType == "PageNumber") {
                elementField = "Page {cur}/{nb}";
            }
            if (elementType == "TextZone") {
                elementField = $(this.options.formElementSourceControl).val();
            }
            if (elementType == "Rectangle" || elementType == "RoundedBox") {
                $(this.options.formElementFillColor).val("");
            }
            $('#tmpElement').attr('title', elementField + ' (' + elementType + ')');
            $('#tmpElement > span').setField(elementField);
            $('#tmpElement').setFontSize($(this.options.formElementSize).val());
            $('#tmpElement').setFontFamily($(this.options.formElementFontFamily).val());
            $('#tmpElement').setFillColor(elementFillColor);
            $('#tmpElement').setTextColor(elementTextColor);
            $('#tmpElement').setFontStyle(elementStyle);
            $('#tmpElement').setBorder(elementBorder, $(this.options.formElementBorderWidth).val());
            $('#tmpElement').setAlignment(elementTextAlignment);
            $('#tmpElement').setZIndex(elementZIndex);
            $('#tmpElement').setElementHeight(elementHeight);
            $('#tmpElement').setElementWidth(elementWidth, this.options.report.getReportWidth());

            
            
            $('#tmpElement').elements({
                'divPart': selectedDivPart
            });
            
            $('#tmpElement').bind("drag", function(event, ui) {
                self.dragEvent(event, ui);
            }).bind("resize", function(event, ui) {
                self.resizeEvent(event,ui);
            });

            // Set new ID
            $('#tmpElement').attr('id', elementType + (elementList.length + 1));
            tmpElement = $('#' + elementType + (elementList.length + 1));

            var newElement = new myElement(
                selectedPart.getPartId(),
                tmpElement.attr('id'),
                elementType,
                elementField,
                elementFormat,
                $(this.options.formElementFillColor).val(),
                $(this.options.formElementTextColor).val(),
                elementBorder,
                $(this.options.formElementBorderWidth).val(),
                $(this.options.formElementFontFamily).val(),
                $(this.options.formElementSize).val(),
                elementAutoExtend,
                elementStyle,
                elementTextAlignment,
                elementPosX,
                elementPosY,
                elementHeightMM,
                elementWidthMM,
                elementUpdated,
                $(this.options.formElementZindex).val()
            );
            newElement.setHeight(elementHeightMM * this.options.report.getMmPxFactor());
            newElement.setWidth(elementWidthMM * this.options.report.getMmPxFactor());
            
            // Add new element in selected part
            selectedPart.addElement(newElement);
            //this.options.report.setPartById(this.options.report.getCurrentPartSelected(), selectedPart);
            if (this.isDebug()) {
                console.groupCollapsed('addElement('+elementType+', '+aElement+')');
                console.log(' - part Id: '+selectedPart.getPartId());
                console.log(' - element Id: '+tmpElement.attr('id'));
                console.log(' - element type: '+elementType);
                console.log(' - element Field: '+elementField);
                console.log(' - element Pos X: '+elementPosX);
                console.log(' - element Pos Y: '+elementPosY);
                console.log(' - element Height: '+elementHeight);
                console.log(' - element Width: '+elementWidth);
                console.log(' - element Height MM: '+elementHeightMM);
                console.log(' - element Width MM: '+elementWidthMM);
                console.log(' - form element format: '+$(this.options.formElementFormat).val());
                console.log(' - formElementFillColor: '+$(this.options.formElementFillColor).val());
                console.log(' - form element text color: '+$(this.options.formElementTextColor).val());
                console.log(' - element border: '+elementBorder);
                console.log(' - form element border width: '+$(this.options.formElementBorderWidth).val());
                console.log(' - form Element Font Family '+$(this.options.formElementFontFamily).val());
                console.log(' - form Element Size: '+$(this.options.formElementSize).val());
                console.log(' - element Auto Extend: '+elementAutoExtend);
                console.log(' - element style: '+elementStyle);
                console.log(' - element Text Alignment: '+elementTextAlignment);
                console.log(' - element Updated '+elementUpdated);
                console.log(' - form ZIndex: '+$(this.options.formElementZindex).val());
                console.groupEnd();
            }
            
            
            $(tmpElement).bind('mouseup', function(){
                if (self.isDebug()) {
                    console.log('Event::revpdf::mouseup');
                }
                self.updateElement(this);
            });
            
            $(tmpElement).bind('mousedown', function(){
                if (self.isDebug()) {
                    console.log('Event::revpdf::mousedown');
                }
                self.togglePartSelection(selectedPart.getPartId());
                self.setFormValues($(this));
            });
            
            $(tmpElement).trigger('mousedown');
            $(tmpElement).trigger('mouseup');
        },
        
        buildContextualMenu:function()
        {
            var self = this;
            $.contextMenu({
                selector: '.classImage, .classLine, .classRectangle, .classRoundedBox, .classPageNumber, .classTextField, .classTextZone', 
                items: {
                    "duplicate": {name: "Duplicate", icon: "copy", callback: function(key, opt){
                        var elementID = opt.$trigger.attr("id");
                        var part = self.options.report.getPartById(self.options.report.currentPartSelected);
                        var nbElement = part.getElements().length;
                        var found = false;
                        if (nbElement > 0) {
                            for (var i = 0; i < nbElement; i++) {
                                if (part.partElementList[i].elementID == elementID) {
                                    found = true;
                                    elementId_new      = elementID + "_2";
                                    elementPartId      = part.partElementList[i].elementPartId;
                                    elementType        = part.partElementList[i].elementType;
                                    elementField       = part.partElementList[i].elementField;
                                    elementFormat      = part.partElementList[i].elementFormat;
                                    elementFillColor   = part.partElementList[i].elementFillColor;
                                    elementTextColor   = part.partElementList[i].elementTextColor;
                                    elementBorder      = part.partElementList[i].elementBorder;
                                    elementBorderWidth = part.partElementList[i].elementBorderWidth;
                                    elementSize        = part.partElementList[i].elementSize;
                                    elementAutoExtend  = part.partElementList[i].elementAutoExtend;
                                    elementFontFamily  = part.partElementList[i].elementFontFamily;
                                    elementStyle       = part.partElementList[i].elementStyle;
                                    elementAlignment   = part.partElementList[i].elementAlignment;
                                    elementPosX        = part.partElementList[i].elementPosX;
                                    elementPosY        = part.partElementList[i].elementPosY;
                                    elementHeight      = part.partElementList[i].elementHeight / self.options.report.getMmPxFactor();
                                    elementWidth       = part.partElementList[i].elementWidth / self.options.report.getMmPxFactor();
                                    elementZIndex      = part.partElementList[i].elementZIndex;
                                    break;
                                }
                            }
                            if (found) {
                                var newElement = new myElement(
                                    elementPartId, elementId_new, elementType,
                                    elementField, elementFormat,
                                    elementFillColor, elementTextColor,
                                    elementBorder, elementBorderWidth,
                                    elementFontFamily, elementSize,
                                    elementAutoExtend, elementStyle,
                                    elementAlignment, elementPosX, elementPosY,
                                    elementHeight, elementWidth, '1', elementZIndex);

                                self.addElement(elementType, newElement);
                            }
                        }
                    }},
                    "delete": {name: "Delete", icon: "delete", callback: function(key, opt){
                        var elementID = opt.$trigger.attr("id");
                        var selectedPart = self.options.report.getPartById(self.options.report.getCurrentPartSelected());
                        selectedPart.deleteElement(elementID);
                        
                        var url = $(self.options.deleteElementUrlInput).val();
                        var params = 'elementId=' + elementID;
                        jQuery.ajax({
                            url: url,
                            type: 'post',
                            data: params,
                            beforeSend: function () {
                                $('#'+elementID).fadeOut(2000);
                            }
                        });
                    }}
                },
                zIndex: 1001
            });

            $('.classTextField').on('click', function(e){
                console.log('clicked', this);
            });
        },
        
        
        resizeElementEvent: function(event, ui) {
            $(this.options.formElementHeight).val(parseInt(ui.element.height()/this.options.report.getMmPxFactor(), 10));
            $(this.options.formElementWidth).val(parseInt(ui.element.width()/this.options.report.getMmPxFactor(), 10));
        },
        
        
        
        togglePartSelection: function(partId)
        {
            if (this.isDebug()) {
                console.log('togglePartSelection('+partId+')');
            }
            this.options.report.setCurrentPartSelected(partId);
            $('.part-global').each(function(s) {
                $(this).removeClass('classPartSelected').addClass('classPartNotSelected');
            });
            $('#part-'+partId).removeClass('classPartNotSelected').addClass('classPartSelected');
        },
        
        
        updateElement: function(element, property, value) 
        {
            var forceUpdateForm = true;
            
            if (this.isDebug()) {
                console.groupCollapsed('update Element (id='+$(element).attr('id')+') (prop='+property+' | value='+value+')');
            }
            var part = this.options.report.getPartById(this.options.report.currentPartSelected);

            var nbElement = part.getElements().length;
            if (nbElement > 0 && $(element).attr('id') !== "") {
                for (var i = 0; i < nbElement; i++) {
                    if (part.partElementList[i].elementID == $(element).attr('id')) {
                        part.partElementList[i].updated = 1;
                        if (property == 'elementType' || typeof property == 'undefined')
                            part.partElementList[i].elementType = $(this.options.formElementType).val();
                        if (property == 'elementField' || typeof property == 'undefined')
                            part.partElementList[i].elementField = $(this.options.formElementField).val();
                        if (property == 'elementFormat' || typeof property == 'undefined')
                            part.partElementList[i].elementFormat = $(this.options.formElementFormat).val();
                        if (property == 'elementFillColor' || typeof property == 'undefined')
                            part.partElementList[i].elementFillColor = $(this.options.formElementFillColor).val();
                        if (property == 'elementTextColor' || typeof property == 'undefined')
                            part.partElementList[i].elementTextColor = $(this.options.formElementTextColor).val();
                        if (property == 'elementBorder' || typeof property == 'undefined') {
                            if (typeof value !== 'undefined') {
                                var current = part.partElementList[i].elementBorder;
                                if (current.indexOf(value) == '-1'){
                                    part.partElementList[i].elementBorder += value;
                                } else {
                                    part.partElementList[i].elementBorder = part.partElementList[i].elementBorder.replace(value, '');
                                }
                                forceUpdateForm = false;
                            }
                        }
                        if (property == 'elementBorderWidth' || typeof property == 'undefined') {
                            if (typeof value == 'undefined') {
                                part.partElementList[i].elementBorderWidth = $(this.options.formElementBorderWidth).val();
                            } else {
                                part.partElementList[i].elementBorderWidth = value;
                            }
                        }
                        if (property == 'elementSize' || typeof property == 'undefined'){
                            if (typeof value == 'undefined') {
                                part.partElementList[i].elementSize = $(this.options.formElementSize).val();
                            } else {
                                part.partElementList[i].elementSize = value;
                            }
                        }
                            
                        if (property == 'elementAutoExtend' || typeof property == 'undefined')
                            part.partElementList[i].elementAutoExtend = $(this.options.formElementIsAutoExtend).val();
                        
                        if (property == 'elementFontFamily' || typeof property == 'undefined') {
                            if (typeof value == 'undefined') {
                                part.partElementList[i].elementFontFamily = $(this.options.formElementFontFamily).val();
                            } else {
                                part.partElementList[i].elementFontFamily = value;
                            }
                        }
                        if (property == 'elementZIndex' || typeof property == 'undefined')
                            part.partElementList[i].elementZIndex = $(this.options.formElementZindex).val();
                        
                        if (property == 'elementStyle' || typeof property == 'undefined') {
                            if (typeof value !== 'undefined') {
                                var currentStyle = part.partElementList[i].elementStyle;
                                if (currentStyle.indexOf(value) == '-1'){
                                    part.partElementList[i].elementStyle += value;
                                } else {
                                    part.partElementList[i].elementStyle = part.partElementList[i].elementStyle.replace(value, '');
                                }
                                forceUpdateForm = false;
                            }
                        }
                        
                        if (property == 'elementAlignment' || typeof property == 'undefined') {
                            if (typeof value !== 'undefined') {
                                formElementAlignment = value;
                            } else {
                                $(this.options.menuGroupAlignement+' > button').each(function(index, item){
                                    if ($(item).hasClass('active')) {
                                        formElementAlignment = $(item).data('align');
                                    }
                                });
                            }
                            part.partElementList[i].elementAlignment = formElementAlignment;
                        }
                        if (property == 'elementDivAlignment' || typeof property == 'undefined') {
                            if (value == 'posx') {
                                part.partElementList[i].elementPosX = $(element).getPositionX();
                                part.partElementList[i].elementPosXmm = $(element).getPositionX() / this.options.report.getMmPxFactor();
                            }
                            if (value == 'posy') {
                                part.partElementList[i].elementPosY = $(element).getPositionY();
                                part.partElementList[i].elementPosYmm = $(element).getPositionY() / this.options.report.getMmPxFactor();
                            }
                        }
                        if (property == 'elementPosX' || typeof property == 'undefined') {
                            part.partElementList[i].elementPosX = $(element).getPositionX();
                            part.partElementList[i].elementPosXmm = $(element).getPositionX() / this.options.report.getMmPxFactor();
                        }
                        if (property == 'elementPosY' || typeof property == 'undefined') {
                            part.partElementList[i].elementPosY = $(element).getPositionY();
                            part.partElementList[i].elementPosYmm = $(element).getPositionY() / this.options.report.getMmPxFactor();
                        }
                        if (property == 'elementPosXmm' || typeof property == 'undefined') {
                            part.partElementList[i].elementPosX = $(element).getPositionX();
                            part.partElementList[i].elementPosXmm = $(element).getPositionX() / this.options.report.getMmPxFactor();
                        }
                        if (property == 'elementPosYmm' || typeof property == 'undefined') {
                            part.partElementList[i].elementPosY = $(element).getPositionY();
                            part.partElementList[i].elementPosYmm = $(element).getPositionY() / this.options.report.getMmPxFactor();
                        }
                        if (property == 'elementHeightMM' || typeof property == 'undefined')
                            part.partElementList[i].elementHeightMM = $(this.options.formElementHeight).val();
                        if (property == 'elementWidthMM' || typeof property == 'undefined')
                            part.partElementList[i].elementWidthMM = $(this.options.formElementWidth).val();
                    }
                }
            }
            
            if (forceUpdateForm) {
                this.setFormValues($(element));
            }
            if (this.isDebug()) {
                console.groupEnd();
            }
        },
        
        setFormValues: function (element) {
            var j = 0;
            var elementID = element.prop('id');
            if (this.isDebug()) {
                console.groupCollapsed('setFormValues('+elementID+')');
            }
            var part = this.options.report.getPartById(this.options.report.currentPartSelected);

            var nbElement = part.getElements().length;

            for (var i=0; i<nbElement; i++) {
                if (part.partElementList[i].elementID == elementID) {
                    if (this.isDebug()) {
                        console.groupCollapsed('Element values');
                        console.log('Element ID: '+elementID);
                        console.log('PosX: '+part.partElementList[i].elementPosX);
                        console.log('PosXmm: '+Math.round(Number(part.partElementList[i].elementPosX) / this.options.report.getMmPxFactor()));
                        console.log('PosY: '+part.partElementList[i].elementPosY);
                        console.log('PosYmm: '+Math.round(Number(part.partElementList[i].elementPosY) / this.options.report.getMmPxFactor()));
                        console.log('width: '+parseInt(part.partElementList[i].elementWidthMM, 10));
                        console.log('height: '+parseInt(part.partElementList[i].elementHeightMM, 10));
                        console.log('alignment: '+part.partElementList[i].elementAlignment);
                        console.log('element_field: '+part.partElementList[i].elementField);
                        console.log('style: '+part.partElementList[i].elementStyle);
                        console.log('format: '+part.partElementList[i].elementFormat);
                        console.log('fill_color: '+part.partElementList[i].elementFillColor);
                        console.log('text_color: '+part.partElementList[i].elementTextColor);
                        console.log('type: '+part.partElementList[i].elementType);
                        console.log('border: '+part.partElementList[i].elementBorder);
                        console.log('border_width: '+part.partElementList[i].elementBorderWidth);
                        console.log('size: '+part.partElementList[i].elementSize);
                        console.log('is_auto_extend: '+part.partElementList[i].elementAutoExtend);
                        console.log('font_family: '+part.partElementList[i].elementFontFamily);
                        console.log('zindex: '+part.partElementList[i].elementZIndex);
                        console.log('updated: '+part.partElementList[i].updated);
                    }
                    $(this.options.formElementPosX).val(part.partElementList[i].elementPosX);
                    $(this.options.formElementPosY).val(part.partElementList[i].elementPosY);
                    $(this.options.formElementPosXmm).val(Math.round(Number(part.partElementList[i].elementPosXmm)));
                    $(this.options.formElementPosYmm).val(Math.round(Number(part.partElementList[i].elementPosYmm)));
                    $(this.options.formElementWidth).val(parseInt(part.partElementList[i].elementWidthMM, 10));
                    $(this.options.formElementHeight).val(parseInt(part.partElementList[i].elementHeightMM, 10));
                    $(this.options.formElementField).val(part.partElementList[i].elementField);
                    $(this.options.formElementFormat).val(part.partElementList[i].elementFormat);
                    $(this.options.formElementFillColor).val(part.partElementList[i].elementFillColor);
                    $(this.options.formElementTextColor).val(part.partElementList[i].elementTextColor);
                    $(this.options.formElementType).val(part.partElementList[i].elementType);
                    $(this.options.formElementBorderWidth).val(part.partElementList[i].elementBorderWidth);
                    $(this.options.formElementSize).val(part.partElementList[i].elementSize);
                    $(this.options.formElementIsAutoExtend).val(part.partElementList[i].elementAutoExtend);
                    $(this.options.formElementFontFamily).val(part.partElementList[i].elementFontFamily);
                    $(this.options.formElementZindex).val(part.partElementList[i].elementZIndex);
                    if (this.isDebug()) {
                        console.groupEnd();
                    }

                    if (this.isDebug()) {
                        console.groupCollapsed('Form values');
                        console.log('Element ID: '+elementID);
                        console.log('PosX: '+$(this.options.formElementPosX).val());
                        console.log('PosY: '+$(this.options.formElementPosY).val());
                        console.log('PosXmm: '+$(this.options.formElementPosXmm).val());
                        console.log('PosYmm: '+$(this.options.formElementPosYmm).val());
                        console.log('width: '+$(this.options.formElementWidth).val());
                        console.log('height: '+$(this.options.formElementHeight).val());
                        console.log('element_field: '+$(this.options.formElementField).val());
                        console.log('format: '+$(this.options.formElementFormat).val());
                        console.log('fill_color: '+$(this.options.formElementFillColor).val());
                        console.log('text_color: '+$(this.options.formElementTextColor).val());
                        console.log('type: '+$(this.options.formElementType).val());
                        console.log('border_width: '+$(this.options.formElementBorderWidth).val());
                        console.log('size: '+$(this.options.formElementSize).val());
                        console.log('is_auto_extend: '+$(this.options.formElementIsAutoExtend).val());
                        console.log('font_family: '+$(this.options.formElementFontFamily).val());
                        console.log('zindex: '+$(this.options.formElementZindex).val());
                        console.groupEnd();
                    }
                    // Turn on/off border buttons (left, right, top, bottom)
                    $.each([this.options.menuBorderNoneButton, this.options.menuBorderAllButton, this.options.menuBorderBottomButton, this.options.menuBorderTopButton, this.options.menuBorderLeftButton, this.options.menuBorderRightButton], function(index, item) {
                            $(item).removeClass('active');
                    });
                    var nbElementBorder = part.partElementList[i].elementBorder.length;
                    if (nbElementBorder > 0) {
                        if (part.partElementList[i].elementBorder.toLowerCase() == 'lrbt') {
                            $(this.options.menuBorderAllButton).addClass('active');
                        } else {
                            for (j=0; j<nbElementBorder; j++) {
                                var currentLetterElementBorder = part.partElementList[i].elementBorder.charAt(j);
                                $.each([this.options.menuBorderNoneButton, this.options.menuBorderAllButton, this.options.menuBorderBottomButton, this.options.menuBorderTopButton, this.options.menuBorderLeftButton, this.options.menuBorderRightButton], function(index, item) {
                                    if ($(item).data('style').toLowerCase() == currentLetterElementBorder.toLowerCase()) {
                                        $(item).addClass('active');
                                    }
                                });
                            }
                        }
                    } else {
                        $(this.options.menuBorderNoneButton).addClass('active');
                    }
                    
                    // Turn on/off font style buttons (bold, italic, underline)
                    $.each([this.options.menuBoldButton, this.options.menuItalicButton, this.options.menuUnderlineButton], function(index, item) {
                            $(item).removeClass('active');
                    });
                    var nbElementStyle = part.partElementList[i].elementStyle.length;
                    
                    if (nbElementStyle > 0) {
                        for (j=0; j<nbElementStyle; j++) {
                            var currentLetterElementStyle = part.partElementList[i].elementStyle.charAt(j);
                            $.each([this.options.menuBoldButton, this.options.menuItalicButton, this.options.menuUnderlineButton], function(index, item) {
                                if ($(item).data('style').toUpperCase() == currentLetterElementStyle.toUpperCase()) {
                                    $(item).addClass('active');
                                }
                            });
                        }
                    }

                    // Set border color for text color
                    $(this.options.menuFontColorPickerButton + ' .icon-BtnFontColor').css({backgroundColor: '#'+part.partElementList[i].elementTextColor});
                    $(this.options.menuFillColorPickerButton + ' .icon-BtnFillColor').css({backgroundColor: '#'+part.partElementList[i].elementFillColor});

                    // Turn on/off alignment button
                    var currentLetterElementAlign = part.partElementList[i].elementAlignment;
                    $.each([this.options.menuLeftAlignButton, this.options.menuCenterAlignButton, this.options.menuRightAlignButton], function(index, item) {
                            $(item).removeClass('active');
                            if (currentLetterElementAlign.toUpperCase() == $(item).data('align')) {
                                $(item).addClass('active');
                            }
                    });
                    
                    // Enable/disable form fields depending on element type
                    if (   ($(this.options.formElementType).val() == "Image") ||
                            ($(this.options.formElementType).val() == "RoundedBox") ||
                            ($(this.options.formElementType).val() == "PageNumber")) {
                        $(this.options.formElementFormat).hide();
                        $(this.options.formElementSourceControl).hide();
                        $(this.options.formElementField).show();
                        $(this.options.formElementHeight).removeAttr("disabled");
                    } else if ($(this.options.formElementType).val() == "TextField") {
                        $(this.options.formElementSourceControl).hide();
                        $(this.options.formElementField).show();
                    } else if ($(this.options.formElementType).val() == "TextZone") {
                        $(this.options.formElementFormat).show();
                        $(this.options.formElementSourceControl).show();
                        $(this.options.formElementField).hide();
                        $(this.options.formElementHeight).removeAttr("disabled");
                        $(this.options.formElementField).val(part.partElementList[i].elementField);
                        $(this.options.formElementSourceControl).val(part.partElementList[i].elementField);
                    }
                    break;
                }
            }
            if (this.isDebug()) {
                console.groupEnd();
            }
        },
        
        // Use the _setOption method to respond to changes to options
        _setOption: function(key, value) {
            if (key == 'clear') {
                // handle changes to clear option
            }

            // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
        },

        // Use the destroy method to clean up any modifications your widget has made to the DOM
        destroy: function() {
            // In jQuery UI 1.8, you must invoke the destroy method from the base widget
            $.Widget.prototype.destroy.call(this);
        }
    });
}( jQuery ));
