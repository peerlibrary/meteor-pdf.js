testRoot = '/meteor-pdf.js/tests'
pdfFilename = 'compressed.tracemonkey-pldi-09.pdf'

if Meteor.isServer
  # We have to serve PDF file locally, so that file is in the same origin domain, so that client can access it

  path = Npm.require 'path'
  pdfPath = Npm.resolve "pdf.js/web/#{ pdfFilename }"
  __meteor_bootstrap__.app.use testRoot, connect.static(path.dirname(pdfPath), {redirect: false})

if Meteor.isClient and /PhantomJS/.test window.navigator.userAgent
  # We disable worker on PhantomJS, it seems it is failing

  PDFJS.disableWorker = true

Tinytest.addAsync 'meteor-pdf.js', (test, onComplete) ->
  isDefined = false
  try
    PDFJS
    isDefined = true

  test.isTrue isDefined, "PDFJS is not defined"

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
    fs = Npm.require 'fs'
    pdf =
      data: fs.readFileSync pdfPath
      password: ''
  else
    pdf = "#{ testRoot }/#{ pdfFilename }"

  processPDF = Meteor.bindEnvironment processPDF, (e) -> test.exception e, this
  error = Meteor.bindEnvironment error, (e) -> test.exception e, this

  PDFJS.getDocument(pdf).then processPDF, error
