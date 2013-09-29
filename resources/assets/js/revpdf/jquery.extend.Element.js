/*!
 * RevPDF
 * http://www.revpdf.org
 *
 * Copyright Olivier Cornu
 * 
 *
 */
var myElementMethods = {

    getPositionX: function () {
        var value = this.css('left');
        var reg = new RegExp("px", "g");
        if (value === null) {
            value = "0px";
        }
        return parseInt(value.replace(reg, ''), 10);
    },

    getPositionY: function () {
        var value = this.css('top');
        var reg = new RegExp("px", "g");
        if (value === null) {
            value = "0px";
        }
        return parseInt(value.replace(reg, ''), 10);
    },

    setElementHeight: function (myNumber) {
        var arrayBorder = this.getElementBorder();
        var elementHeightWithoutBorder = parseInt(myNumber - arrayBorder[0].valueOf() - arrayBorder[2].valueOf(), 10);
        if (elementHeightWithoutBorder > this.parent().height()) {
            elementHeightWithoutBorder = parseInt(this.parent().height() - arrayBorder[0].valueOf() - arrayBorder[2].valueOf(), 10);
        }
        this.css('height', parseInt(elementHeightWithoutBorder, 10) + 'px');
    },

    getElementHeight: function () {
        return parseInt(this.height(), 10);
    },

    setElementWidth: function (myNumber, reportWidth) {
        var arrayBorder = this.getElementBorder();
        var elementWidthWithoutBorder = parseInt(myNumber - arrayBorder[1].valueOf() - arrayBorder[3].valueOf(), 10);
        if (elementWidthWithoutBorder > reportWidth) {
            elementWidthWithoutBorder = parseInt(reportWidth - arrayBorder[1].valueOf() - arrayBorder[3].valueOf(), 10);
        }
        this.css('width', parseInt(elementWidthWithoutBorder, 10) + 'px');
    },

    getElementWidth: function () {
        return parseInt(this.width(), 10);
    },

    setPositionX: function (myNumber) {
        this.css('left', parseInt(myNumber, 10)+ 'px');
    },

    setPositionY: function (myNumber) {
        this.css('top', parseInt(myNumber, 10)+ 'px');
    },

    setFillColor: function (value) {
        if (value.charAt(0) !== "#") {
            value = '#'+value;
        }
        try {
            this.css('background', value);
        } catch(e) {
            this.css('background', '#FFFFFF');
        }
    },

    setBorder: function (myNum, myWidth) {
        var myNumber = myNum.toLowerCase();
        var borderColor = '#000000';
        var borderType  = 'solid';
        myWidth = Math.ceil(myWidth * 72 / 25.4);
        $(this).css('border', '0px');
    
        if (myNumber.indexOf("l") >= 0) {
            $(this).css('borderLeft', myWidth+"px "+borderColor+" "+borderType);
        }
        if (myNumber.indexOf("b") >= 0) {
            $(this).css('borderBottom', myWidth+"px "+borderColor+" "+borderType);
        }
        if (myNumber.indexOf("r") >= 0) {
            $(this).css('borderRight', myWidth+"px "+borderColor+" "+borderType);
        }
        if (myNumber.indexOf("t") >= 0) {
            $(this).css('borderTop', myWidth+"px "+borderColor+" "+borderType);
        }
    },

    getElementBorder: function () {
        var topBorderWidth    = parseInt(this.css('borderTopWidth'), 10);
        var rightBorderWidth  = parseInt(this.css('borderRightWidth'), 10);
        var bottomBorderWidth = parseInt(this.css('borderBottomWidth'), 10);
        var leftBorderWidth   = parseInt(this.css('borderLeftWidth'), 10);

        if (topBorderWidth === null || topBorderWidth === "") {
            topBorderWidth = "0px";
        }
        if (rightBorderWidth === null || rightBorderWidth === "") {
            rightBorderWidth = "0px";
        }
        if (bottomBorderWidth === null || bottomBorderWidth === "") {
            bottomBorderWidth = "0px";
        }
        if (leftBorderWidth === null || leftBorderWidth === "") {
            leftBorderWidth = "0px";
        }
        var myArray = new Array(topBorderWidth, rightBorderWidth, bottomBorderWidth, leftBorderWidth);
        for (var i = 0; i < myArray.length; i++) {
            if (isNaN(myArray[i])) {
                myArray[i] = 0;
            } else {
                myArray[i] = Math.ceil(myArray[i]);
            }
        }

        return (myArray);
    },

    setTextColor: function (value) {
        if (value.charAt(0) !== "#") {
            value = '#'+value;
        }
        try {
            this.css('color', value);
        } catch(e) {
            this.css('color', '#000000');
        }
    },

    setFontStyle: function (value) {
        if (typeof value  !== "undefined") {
            this.css('fontStyle', 'normal');
            this.css('fontWeight', 'normal');
            if (value.indexOf("U") >= 0) {
                this.css('textDecoration', 'underline');
            }
            if (value.indexOf("B") >= 0) {
                this.css('fontWeight', 'bold');
            }
            if (value.indexOf("I") >= 0) {
                this.css('fontStyle', 'italic');
            }
        }
    },
    
    setBold: function (value) {
        if (value === '') {
            this.css('fontWeight', 'normal');
        } else {
            this.css('fontWeight', 'bold');
        }
    },

    setAlignment: function (myNumber) {
        if (myNumber == "L") {
            this.css('textAlign', 'left');
        } else if (myNumber == "R") {
            this.css('textAlign', 'right');
        } else {
            this.css('textAlign', 'center');
        }
    },

    setZIndex: function (myNumber) {
        this.css('zIndex', myNumber);
    },
    setFontSize: function (myNumber) {
        this.css('fontSize', myNumber + 'pt');
    },
    setFontFamily: function (myNumber) {
        this.css('fontFamily', myNumber);
    },
    setField: function (sText) {
        var src = this.attr('src');
        if (typeof src  == "undefined") {
            this.html(sText);
        }
    },

    // Replace all options of a select tag with the provided ones
    replaceOptionsBy: function (element, myOptions, selectedOptionIndex) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
        myOptions.each(function (aOption, index) {
            newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(aOption.text));
            newOption.value = aOption.value;
            element.appendChild(newOption);
            if (aOption.value == selectedOptionIndex) {
                element.selectedIndex = element.index;
            }
        });
    }

};

/**
 * Add methods to Element object (jquery)
 */
jQuery.fn.extend(myElementMethods);
