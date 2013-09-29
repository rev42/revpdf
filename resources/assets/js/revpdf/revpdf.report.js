/*!
 * RevPDF
 * http://www.revpdf.org
 *
 * Copyright Olivier Cornu
 * 
 *
 */
var Report = function (id, name, shortname) {
    this.id = id;
    this.name = name;
    this.shortName = shortname;
    this.width = 0;
    this.partList = [];
    this.partCount = 0;
    this.currentPartSelected = '';
    this.conversionMmPx = 4;
    this.debug = 0;
};
Report.prototype.addPart = function (partObject) {
    this.partList.push(partObject);
    this.partCount++;
};
Report.prototype.getParts = function () {
    return this.partList;
};
Report.prototype.getPart = function (index) {
    return this.partList[index];
};
Report.prototype.getPartById = function (partId) {
    for (i=0; i<this.partList.length; i++) {
        if (this.partList[i].getPartId() == partId) {
            return this.partList[i];
        }
    }
    return null;
};
Report.prototype.setPartById = function (partId, part) {
    for (i=0; i<this.partList.length; i++) {
        if (this.partList[i].getPartId() == partId) {
            this.partList[i] = part;
        }
    }
    return null;
};
Report.prototype.setReportWidth = function (myNumber) {
    this.width = parseInt(myNumber, 10);
};
Report.prototype.getReportWidth = function () {
    return parseInt(this.width, 10);
};
Report.prototype.getMmPxFactor = function () {
    return parseInt(this.conversionMmPx, 10);
};
Report.prototype.getId = function () {
    return (this.id);
};
Report.prototype.getName = function () {
    return (this.name);
};
Report.prototype.getShortName = function () {
    return (this.shortName);
};
Report.prototype.getPartCount = function () {
    return (this.partCount);
};
Report.prototype.getCurrentPartSelected = function () {
    return (this.currentPartSelected);
};
Report.prototype.getCurrentPartDivSelected = function () {
    return ("part_"+this.currentPartSelected);
};
Report.prototype.setCurrentPartSelected = function (myPartName) {
    this.currentPartSelected = myPartName;
};