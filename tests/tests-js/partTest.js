QUnit.test("Initialisation de la section", function() {
    var part = new Part(1, 2, 3, 4, 1, 0, 1, 0, 1, 'asc', 'myPart', 10, 20, 'http://localhost/edit/Part/1');
    equal(part.getId(), "1", "part.getId");
    equal(part.getPartId(), "1", "part.getPartId");
    equal(part.getPartReportId(), "2", "part.getPartReportId");
    equal(part.getPartNumber(), "3", "part.getPartNumber");
    equal(part.getPartHeight(), "4", "part.getPartHeight");
    equal(part.isVisible(), true, "part.isVisible");
    equal(part.isPageJump(), false, "part.isPageJump");
    equal(part.isIndivisible(), true, "part.isIndivisible");
    equal(part.isAutoExtend(), false, "part.isAutoExtend");
    equal(part.isAutoReduc(), true, "part.isAutoReduc");
    equal(part.getSortOrder(), "asc", "part.getSortOrder");
    equal(part.getPartName(), "myPart", "part.getPartName");
    equal(part.getPartWidth(), "10", "part.getPartWidth");
    equal(part.getPartHeightMM(), "20", "part.getPartHeightMM");
    equal(part.getPartEditUrl(), "http://localhost/edit/Part/1", "part.getPartEditUrl");
});

QUnit.test("Modification de la hauteur", function() {
    var part = new Part(1, 2, 3, 4, 10);
    part.setHeightFromPx(10, 2);
    equal(part.getPartHeight(), 5, "part.getPartHeight");

    part.setHeight(15);
    equal(part.getPartHeight(), 15, "part.getPartHeight");
});

QUnit.test("Ajout d'un élément", function() {
    var part = new Part(1, 2, 3, 4, 10);
    part.addElement(['1']);
    deepEqual(part.getElements(), Array(['1']), "part.getElements");
    deepEqual(part.getElement(0), ['1'], "part.getElement (first)");
});
