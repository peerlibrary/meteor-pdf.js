Tinytest.add('meteor-pdf.js', function (test) {
  var isDefined = false;
  try {
    PDFJS;
    isDefined = true;
  }
  catch (e) {
  }
  test.isTrue(isDefined, "PDFJS is not defined");
});