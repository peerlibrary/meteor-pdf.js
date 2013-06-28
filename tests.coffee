testRoot = '/meteor-pdf.js/tests'
pdfFilename = 'compressed.tracemonkey-pldi-09.pdf'

if Meteor.isServer
  # We have to serve PDF file locally, so that file is in the same origin domain, so that client can access it

  path = Npm.require 'path'
  pdfPath = Npm.resolve "pdf.js/web/#{ pdfFilename }"
  __meteor_bootstrap__.app.use testRoot, connect.static(path.dirname(pdfPath), {redirect: false})

if Meteor.isClient
  # PhantomJS does not have Function.prototype.bind and pdf.js is using it
  # https://github.com/ariya/phantomjs/issues/10522
  # Workaround from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  if !Function.prototype.bind
    Function.prototype.bind = (oThis) ->
      if !_.isFunction(this)
        throw new TypeError "Function.prototype.bind - what is trying to be bound is not callable"

      aArgs = Array.prototype.slice.call(arguments, 1)
      fToBind = this
      fNOP = () ->
      fBound = () ->
        fToBind.apply(this instanceof fNOP && (if oThis then this else oThis), aArgs.concat(Array.prototype.slice.call(arguments)))

      fNOP.prototype = this.prototype
      fBound.prototype = new fNOP()

      fBound

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
