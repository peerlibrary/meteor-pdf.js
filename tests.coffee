testRoot = '/packages/pdf.js'
pdfFilename = 'pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

if Meteor.isServer
  pdfPath = Npm.resolve pdfFilename

Tinytest.addAsync 'meteor-pdf.js', (test, onComplete) ->
  isDefined = false
  try
    PDFJS
    isDefined = true

  test.isTrue isDefined, "PDFJS is not defined"
  test.isTrue Package['pdf.js'].PDFJS, "Package.pdf.js.PDFJS is not defined"

  error = (message, exception) ->
    if exception
      test.exception exception
    else
      test.fail
        type: "error"
        message: message
      onComplete()

  processPDF = (pdf) ->
    test.equal pdf.numPages, 14
    onComplete()

  if Meteor.isServer
    test.isTrue fs.readFileSync._blocking

    pdf =
      data: fs.readFileSync pdfPath
      password: ''
  else
    pdf = "#{ testRoot }/#{ pdfFilename }"

  processPDF = Meteor.bindEnvironment processPDF, (e) -> test.exception e, this
  error = Meteor.bindEnvironment error, (e) -> test.exception e, this

  PDFJS.getDocument(pdf).then processPDF, error
