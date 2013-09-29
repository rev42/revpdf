$(document).ready(function(){
    module("Module Report");
    
    test("Initialisation de l'état", function() {
        var report = new Report(1, 'mon état' ,'etat_1');
        report.setReportWidth(500);
        equal(report.getId(), "1", "report.getId");
        equal(report.getName(), "mon état", "report.getName");
        equal(report.getReportWidth(), 500, "report.getReportWidth");
        equal(report.getMmPxFactor(), 4, "report.getMmPxFactor");
        equal(report.getShortName(), "etat_1", "report.getShortname");
        equal(report.getPartCount(), "0", "report.getPartCount");
        equal(report.getCurrentPartSelected(), "", "report.getCurrentPartSelected");
    });
    
    test("Ajout d'une section et sélection", function() {
        var report = new Report(1, 'mon état' ,'etat_1');
        report.addPart(1);
        report.setCurrentPartSelected('part1');
        equal(report.getPartCount(), 1, "report.getPartCount");
        equal(report.getCurrentPartSelected().toString(), "part1", "report.getCurrentPartSelected");
    });
});