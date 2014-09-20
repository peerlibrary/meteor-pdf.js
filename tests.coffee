if Meteor.isClient
  TEST_ROOT = '/packages/pdf.js'
else
  TEST_ROOT = 'file:///'
PDF_FILENAME = 'pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

Meteor.startup ->
  # If tests are run from the package directory itself, package is prepend local-test.
  # We run this in Meteor.startup so that all Package information is populated.
  TEST_ROOT = '/packages/local-test_pdf.js' if Meteor.isClient and Package['local-test:pdf.js']

# We explicitly disable worker on PhantomJS
# See https://github.com/mozilla/pdf.js/issues/5316
PDFJS.disableWorker = true if Meteor.isClient and window.navigator.userAgent.indexOf('PhantomJS') > -1

normalizeTextContent = (textContent) ->
  styleNames = (styleName for styleName of textContent.styles)
  styleNames.sort (a, b) ->
    parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0])
  mapping = {}
  for styleName, i in styleNames
    mapping[styleName] = styleName.replace /\d+/, i + 1
  styles = {}
  for styleName, style of textContent.styles
    styles[mapping[styleName]] = style
  textContent.styles = styles
  for item in textContent.items
    item.fontName = mapping[item.fontName]
  textContent

testTextContent = (test, textContent, onComplete) ->
  # We use canonical stringification so that JSON is equal between platforms (object keys might not be in the same order)
  textContent = EJSON.stringify normalizeTextContent(textContent),
    canonical: true

  if Meteor.isServer
    testPageTextContent = Assets.getText 'test-page.json'
    test.equal textContent, testPageTextContent
    onComplete?()
  else
    HTTP.get "#{ TEST_ROOT }/test-page.json", (error, result) ->
      test.isFalse error, error
      test.equal textContent, result.content
      onComplete()

Tinytest.add 'pdf.js - defined', (test) ->
  isDefined = false
  try
    PDFJS
    isDefined = true

  test.isTrue isDefined, "PDFJS is not defined"
  test.isTrue Package['pdf.js'].PDFJS, "Package.pdf.js.PDFJS is not defined"

if Meteor.isServer
  Tinytest.add 'pdf.js - sync interface', (test) ->
    pdf = "#{ TEST_ROOT }/#{ PDF_FILENAME }"

    document = PDFJS.getDocumentSync(pdf)
    test.equal document.numPages, 14
    page = document.getPageSync 1
    test.equal page.pageNumber, 1
    test.length page.getAnnotationsSync(), 0

    test.throws ->
      document.getPageSync 15
    , /Invalid page request/

    textContent = page.getTextContentSync()
    testTextContent test, textContent

    viewport = page.getViewport 1.0
    canvasElement = new PDFJS.canvas viewport.width, viewport.height
    canvasContext = canvasElement.getContext '2d'

    test.equal canvasElement.width, viewport.width
    test.equal canvasElement.height, viewport.height

    page.renderSync
      canvasContext: canvasContext
      viewport: viewport

    testPageImage = new PDFJS.canvas.Image()
    testPageImage.src = new Buffer Assets.getBinary 'test-page.png'

    testPageCanvas = new PDFJS.canvas viewport.width, viewport.height
    testPageCanvas.getContext('2d').drawImage testPageImage, 0, 0, viewport.width, viewport.height

    imagediff = Npm.require 'imagediff'
    test.isTrue imagediff.equal canvasElement, testPageCanvas, viewport.width * viewport.height * 0.001 # 0.1% difference is OK

promiseHandler = (promise, test, expect, fun) ->
  expectReturn = expect()

  promise.then(
    (args...) ->
      fun args...
      expectReturn()
  ,
    (message, exception) ->
      if exception
        test.exception exception
      else
        test.fail
          type: 'error'
          message: message
      expectReturn()
  )

testAsyncMulti 'pdf.js - callback interface', [
  (test, expect) ->
    # Random query parameter to prevent caching
    pdf = "#{ TEST_ROOT }/#{ PDF_FILENAME }?#{ Random.id() }"

    promiseHandler PDFJS.getDocument(pdf), test, expect, (document) =>
      test.equal document.numPages, 14
      @document = document
,
  (test, expect) ->
    promiseHandler @document.getPage(1), test, expect, (page) =>
      test.equal page.pageNumber, 1
      @page = page
,
  (test, expect) ->
    promiseHandler @page.getAnnotations(), test, expect, (annotations) =>
      test.length annotations, 0
,
  (test, expect) ->
    test.expect_fail ->
      promiseHandler @page.getPage(15), test, expect, (page) =>
        # We should never get here, so we run a test which succeeds and this will
        # in fact fail the test because we are expecting a failure, not success
        test.equal 42, 42
,
  (test, expect) ->
    promiseHandler @page.getTextContent(), test, expect, (textContent) =>
      @textContent = textContent
,
  (test, expect) ->
    testTextContent test, @textContent, expect()
]
