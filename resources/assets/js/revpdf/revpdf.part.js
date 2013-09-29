/*!
 * RevPDF
 * http://www.revpdf.org
 *
 * Copyright Olivier Cornu
 * 
 *
 */
var Part = function (id, partReportId, partWeight, partHeight, partIsVisible, partIsPageJump, partIsIndivisible, partIsAutoExtend, partIsAutoReduc, partSortOrder, partName, partWidth, partHeightMM, partEditUrl) {
    this.partEditUrl      = partEditUrl;
    this.name             = partName;
    this.id               = id;
    this.partId           = id;
    this.partReportId     = partReportId;
    this.partNumber       = partWeight;
    this.width            = partWidth;
    this.height           = partHeight;
    this.heightMM         = partHeightMM;
    this.is_visible       = partIsVisible;
    this.is_page_jump     = partIsPageJump;
    this.is_indivisible   = partIsIndivisible;
    this.is_auto_extend   = partIsAutoExtend;
    this.is_auto_reduc    = partIsAutoReduc;
    this.sort_order       = partSortOrder;
    this.partElementList  = [];
    this.updated          = false;
};

Part.prototype.addElement = function (element) {
    this.partElementList.push(element);
};
Part.prototype.getElements = function () {
    return this.partElementList;
};
Part.prototype.getElement = function (key) {
    return this.partElementList[key];
};
Part.prototype.setHeight = function (myNumber) {
    this.height = parseInt(myNumber, 10);
};
Part.prototype.setHeightFromPx = function (myNumber, mmPxFactor) {
    this.height = parseInt(myNumber/mmPxFactor, 10);
    this.heightMM = parseInt(myNumber, 10);
    this.updated = true;
};
Part.prototype.getPartHeight = function () {
    return parseInt(this.height, 10);
};
Part.prototype.getPartHeightMM = function () {
    return parseInt(this.heightMM, 10);
};
Part.prototype.getPartWidth = function () {
    return parseInt(this.width, 10);
};
Part.prototype.getPartNumber = function () {
    return parseInt(this.partNumber, 10);
};
Part.prototype.getPartReportId = function () {
    return this.partReportId;
};
Part.prototype.getPartName = function () {
    return this.name;
};
Part.prototype.getPartEditUrl = function () {
    return this.partEditUrl;
};
Part.prototype.getPartId = function () {
    return this.partId;
};
Part.prototype.getId = function () {
    return this.id;
};
Part.prototype.setId = function (value) {
    this.id = parseInt(value, 10);
};
Part.prototype.isUpdated = function () {
    return this.updated;
};
Part.prototype.setUpdated = function (value) {
    this.updated = Boolean(value);
};
Part.prototype.setIsVisible = function (value) {
    this.is_visible = Boolean(value);
};
Part.prototype.isVisible = function () {
    return Boolean(this.is_visible);
};
Part.prototype.setIsPageJump = function (value) {
    this.is_page_jump = Boolean(value);
};
Part.prototype.isPageJump = function () {
    return Boolean(this.is_page_jump);
};
Part.prototype.setIsIndivisible = function (value) {
    this.is_indivisible = Boolean(value);
};
Part.prototype.isIndivisible = function () {
    return Boolean(this.is_indivisible);
};
Part.prototype.setIsAutoExtend = function (value) {
    this.is_auto_extend = Boolean(value);
};
Part.prototype.isAutoExtend = function () {
    return Boolean(this.is_auto_extend);
};
Part.prototype.setIsAutoReduc = function (value) {
    this.is_auto_reduc = Boolean(value);
};
Part.prototype.isAutoReduc = function () {
    return Boolean(this.is_auto_reduc);
};
Part.prototype.setSortOrder = function (value) {
    this.sort_order = value;
};
Part.prototype.getSortOrder = function (value) {
    return this.sort_order;
};
Part.prototype.deleteElement = function (elementID) {
    for (var i in this.partElementList) {
        if (this.partElementList[i].elementID == elementID) {
            this.partElementList.splice(i);
            break;
        }
    }
};

Part.prototype.getTemplate = function() {
    var str = ""+
"<div id='part-"+this.id+"' class='part-global classPartNotSelected' data-partid='"+this.id+"'>"+
    "<div id='inner-part-"+this.id+"' style='width:"+this.width+"px'>"+
        "<div id='part-header"+this.id+"' class='part-header'>"+
            "<a id='edit-paste-link-"+this.id+"' class='edit-paste' href='"+this.partEditUrl+"'>"+
                "<i class='icon-pencil'></i>"+
            "</a>"+
            "<a id='edit-delete-"+this.id+"' href='#'>"+
                "<i class='icon-trash'></i>"+
            "</a>"+
            "<span class='part-header-title'> "+this.name+" </span>"+
        "</div>"+
        "<div id='part-properties-"+this.id+"' class='hidden part-properties'></div>"+
        "<div id='part_"+this.id+"' class='layout-element-selected widget' style='height:"+this.heightMM+"px'></div>"+
    "</div>"+
"</div>";
    
    return str;
};

/**
 * Each part form element will set the part as updated in order to be saved
 * when users click on 'save report' button
 */
$('.partVisible, .partPageJump, .partIndivisible, .partAutoExtend, .partAutoReduc, .partSortOrder').each(function(index, item) {
    $(item).bind('click', function(el){
        var divId = $(this).parents().eq(6).attr('id');
        splitted = divId.split('-');
        var part = report.getPartById(splitted[1]);
        if ($(this).hasClass('partVisible')) {
            part.setIsVisible(!part.is_visible);
        }
        if ($(this).hasClass('partPageJump')) {
            part.setIsPageJump(!part.is_page_jump);
        }
        if ($(this).hasClass('partIndivisible')) {
            part.setIsIndivisible(!part.is_indivisible);
        }
        if ($(this).hasClass('partAutoExtend')) {
            part.setIsAutoExtend(!part.is_auto_extend);
        }
        if ($(this).hasClass('partAutoReduc')) {
            part.setIsAutoReduc(!part.is_auto_reduc);
        }
        if ($(this).hasClass('partSortOrder')) {
            part.setSortOrder($(this).val());
        }
        part.setUpdated(1);
    });
});
