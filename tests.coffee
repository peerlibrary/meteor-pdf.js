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

TEXT_CONTENT = [
  'Trace-based Just-in-Time Type Specialization for Dynamic'
  'Languages'
  'Andreas Gal'
  '∗'
  '+'
  ', Brendan Eich'
  '∗'
  ', Mike Shaver'
  '∗'
  ', David Anderson'
  '∗'
  ', David Mandelin'
  '∗'
  ','
  'Mohammad R. Haghighat'
  '$'
  ', Blake Kaplan'
  '∗'
  ', Graydon Hoare'
  '∗'
  ', Boris Zbarsky'
  '∗'
  ', Jason Orendorff'
  '∗'
  ','
  'Jesse Ruderman'
  '∗'
  ', Edwin Smith'
  '#'
  ', Rick Reitmaier'
  '#'
  ', Michael Bebenita'
  '+'
  ', Mason Chang'
  '+#'
  ', Michael Franz'
  '+'
  'Mozilla Corporation'
  '∗'
  '{'
  'gal,brendan,shaver,danderson,dmandelin,mrbkap,graydon,bz,jorendorff,jruderman'
  '}'
  '@mozilla.com'
  'Adobe Corporation'
  '#'
  '{'
  'edwsmith,rreitmai'
  '}'
  '@adobe.com'
  'Intel Corporation'
  '$'
  '{'
  'mohammad.r.haghighat'
  '}'
  '@intel.com'
  'University of California, Irvine'
  '+'
  '{'
  'mbebenit,changm,franz'
  '}'
  '@uci.edu'
  'Abstract'
  'Dynamic languages such as JavaScript are more difficult to com-'
  'pile than statically typed ones. Since no concrete type information'
  'is available, traditional compilers need to emit generic code that can'
  'handle all possible type combinations at runtime. We present an al-'
  'ternative compilation technique for dynamically-typed languages'
  'that identifies frequently executed loop traces at run-time and then'
  'generates machine code on the fly that is specialized for the ac-'
  'tual dynamic types occurring on each path through the loop. Our'
  'method provides cheap inter-procedural type specialization, and an'
  'elegant and efficient way of incrementally compiling lazily discov-'
  'ered alternative paths through nested loops. We have implemented'
  'a dynamic compiler for JavaScript based on our technique and we'
  'have measured speedups of 10x and more for certain benchmark'
  'programs.'
  'Categories and Subject Descriptors'
  'D.3.4 ['
  'Programming Lan-'
  'guages'
  ']: Processors —'
  'Incremental compilers, code generation'
  '.'
  'General Terms'
  'Design, Experimentation, Measurement, Perfor-'
  'mance.'
  'Keywords'
  'JavaScript, just-in-time compilation, trace trees.'
  '1.  Introduction'
  'Dynamic languages'
  'such as JavaScript, Python, and Ruby, are pop-'
  'ular since they are expressive, accessible to non-experts, and make'
  'deployment as easy as distributing a source file. They are used for'
  'small scripts as well as for complex applications. JavaScript, for'
  'example, is the de facto standard for client-side web programming'
  'Permission to make digital or hard copies of all or part of this work for personal or'
  'classroom use is granted without fee provided that copies are not made or distributed'
  'for profit or commercial advantage and that copies bear this notice and the full citation'
  'on the first page. To copy otherwise, to republish, to post on servers or to redistribute'
  'to lists, requires prior specific permission and/or a fee.'
  'PLDI’09,'
  'June 15–20, 2009, Dublin, Ireland.'
  'Copyright'
  'c'
  '©'
  '2009 ACM 978-1-60558-392-1/09/06...$5.00'
  'and is used for the application logic of browser-based productivity'
  'applications such as Google Mail, Google Docs and Zimbra Col-'
  'laboration Suite. In this domain, in order to provide a fluid user'
  'experience and enable a new generation of applications, virtual ma-'
  'chines must provide a low startup time and high performance.'
  'Compilers for statically typed languages rely on type informa-'
  'tion to generate efficient machine code. In a dynamically typed pro-'
  'gramming language such as JavaScript, the types of expressions'
  'may vary at runtime. This means that the compiler can no longer'
  'easily transform operations into machine instructions that operate'
  'on one specific type. Without exact type information, the compiler'
  'must emit slower generalized machine code that can deal with all'
  'potential type combinations. While compile-time static type infer-'
  'ence might be able to gather type information to generate opti-'
  'mized machine code, traditional static analysis is very expensive'
  'and hence not well suited for the highly interactive environment of'
  'a web browser.'
  'We present a trace-based compilation technique for dynamic'
  'languages that reconciles speed of compilation with excellent per-'
  'formance of the generated machine code. Our system uses a mixed-'
  'mode execution approach: the system starts running JavaScript in a'
  'fast-starting bytecode interpreter. As the program runs, the system'
  'identifies'
  'hot'
  '(frequently executed) bytecode sequences, records'
  'them, and compiles them to fast native code. We call such a se-'
  'quence of instructions a'
  'trace'
  '.'
  'Unlike method-based dynamic compilers, our dynamic com-'
  'piler operates at the granularity of individual loops. This design'
  'choice is based on the expectation that programs spend most of'
  'their time in hot loops. Even in dynamically typed languages, we'
  'expect hot loops to be mostly'
  'type-stable'
  ', meaning that the types of'
  'values are invariant. (12) For example, we would expect loop coun-'
  'ters that start as integers to remain integers for all iterations. When'
  'both of these expectations hold, a trace-based compiler can cover'
  'the program execution with a small number of type-specialized, ef-'
  'ficiently compiled traces.'
  'Each compiled trace covers one path through the program with'
  'one mapping of values to types. When the VM executes a compiled'
  'trace, it cannot guarantee that the same path will be followed'
  'or that the same types will occur in subsequent loop iterations.'
]

Tinytest.add 'pdf.js - defined', (test) ->
  isDefined = false
  try
    PDFJS
    isDefined = true

  test.isTrue isDefined, "PDFJS is not defined"
  test.isTrue Package['pdf.js'].PDFJS, "Package.pdf.js.PDFJS is not defined"

if Meteor.isServer
  Tinytest.addAsync 'pdf.js - sync interface', (test, onComplete) ->
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
    test.equal _.pluck(textContent.items, 'str'), TEXT_CONTENT

    viewport = page.getViewport 1.0
    canvasElement = new PDFJS.canvas viewport.width, viewport.height
    canvasContext = canvasElement.getContext '2d'

    page.renderSync
      canvasContext: canvasContext
      viewport: viewport

    testPagePngBuffer = new Buffer Assets.getBinary 'test-page.png'

    pngStream = canvasElement.pngStream().pipe(PDFJS.through())

    buffers = []
    pngStream.on 'data', (data) -> buffers.push data
    pngStream.on 'end', Meteor.bindEnvironment ->
      pngStreamBuffer = Buffer.concat buffers

      test.equal pngStreamBuffer, testPagePngBuffer

      onComplete()

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
      test.equal _.pluck(textContent.items, 'str'), TEXT_CONTENT
]
