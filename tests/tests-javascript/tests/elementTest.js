var report = new Report;

$(document).ready(function(){
    module("Module Element");
    
    test("Initialisation d'un élément", function() {
    	var element = new myElement(
                '6',
                '33',
                'TextZone',
                'customer_firstname',
                'text',
                'FFFFFF',
                '000000',
                '',
                '0.20',
                'Deja Vu Sans',
                '10',
                '1',
                '',
                'L',
                24,
                136,
                5,
                20,
                '0',
                '0');
    	equal(element.getId(), 33, 'element.getId');
    	equal(element.getPartId(), 6, 'element.getPartId');
    	equal(element.getType(), 'TextZone', 'element.getType');
    	equal(element.getField(), 'customer_firstname', 'element.getField');
    	equal(element.getFormat(), 'text', 'element.getFormat');
    	equal(element.getFillColor(), 'FFFFFF', 'element.getFillColor');
    	equal(element.getTextColor(), '000000', 'element.getTextColor');
    	equal(element.getBorder(), '', 'element.getBorder');
    	equal(element.getBorderWidth(), '0.20', 'element.getBorderWidth');
    	equal(element.getFontFamily(), 'Deja Vu Sans', 'element.getFontFamily');
    	equal(element.getSize(), 10, 'element.getSize');
    	equal(element.getAutoExtend(), '1', 'element.getAutoExtend');
    	equal(element.getStyle(), '', 'element.getStyle');
    	equal(element.getAlignment(), 'L', 'element.getAlignment');
    	equal(element.getPosX(), 24, 'element.getPosX');
    	equal(element.getPosY(), 136, 'element.getPosY');
    	equal(element.getHeightMM(), 5, 'element.getHeightMM');
    	equal(element.getWidthMM(), 20, 'element.getWidthMM');
    	equal(element.getUpdated(), 0, 'element.getUpdated');
    	equal(element.getZIndex(), 0, 'element.getZIndex');
    });
    
    
});