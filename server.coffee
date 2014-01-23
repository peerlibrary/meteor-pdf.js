PDFJS = {}

btoa = Npm.require 'btoa'
canvas = Npm.require 'canvas'
jsdom = Npm.require 'jsdom'
vm = Npm.require 'vm'
xmldom = Npm.require 'xmldom'

DEBUG = true

# Based on web/viewer.html and pdf.js/make.js
# TODO: Verify if this is the best set of files for the server
# TODO: Add web/compatibility.js?
SRC_FILES = [
  'shared/util.js',
  'shared/colorspace.js',
  'shared/pattern.js',
  'shared/function.js',
  'shared/annotation.js',
  'display/api.js',
  'display/metadata.js',
  'display/canvas.js',
  'display/font_loader.js'
  'core/network.js',
  'core/chunked_stream.js',
  'core/pdf_manager.js',
  'core/core.js',
  'core/obj.js',
  'core/charsets.js',
  'core/cidmaps.js',
  'core/crypto.js',
  'core/evaluator.js',
  'core/fonts.js',
  'core/font_renderer.js',
  'core/glyphlist.js',
  'core/image.js',
  'core/metrics.js',
  'core/parser.js',
  'core/stream.js',
  'core/worker.js',
  'core/jpx.js',
  'core/jbig2.js',
  'core/bidi.js',
  'core/cmap.js',
  '../external/jpgjs/jpg.js',
]

window = jsdom.jsdom().createWindow()
window.btoa = btoa
window.DOMParser = xmldom.DOMParser
window.PDFJS = PDFJS
window.Image = canvas.Image

window.setTimeout = wrappedSetTimeout
window.setInterval = wrappedSetInterval
window.clearTimeout = wrappedClearTimeout
window.clearInterval = wrappedClearInterval

# TODO: We should provide some way to capture logs which were created during each PDF.js API call

window.console =
  log: (args...) ->
    console.log args... if DEBUG

    # We ignore this warning
    return if args[0] is 'Warning: Setting up fake worker.'

    # But we throw an exception for any other warning or error
    throw new Meteor.Error 500, args if /^(Warning|Error): /.test args[0]

  error: (args...) ->
    console.error args... if DEBUG

    # PDF.js throws an error already for error calls

  warn: (args...) ->
    console.warn args... if DEBUG

    # We throw an exception for any warning (PDF.js does not seem to really use them)
    throw new Meteor.Error 500, args

PDFJS.pdfBug = DEBUG

# So that isSyncFontLoadingSupported returns true
window.navigator.userAgent = 'Mozilla/5.0 rv:14 Gecko'

# We have to make context so that window is both global scope and window variable. This
# is necessary because node.js does not make window variable a global scope by default,
# but PDF.js does assume that if window is available, that is global scope.
# TODO: To be secure, we do not have to pass everything in the context, like "require" and "process" and "global" itself?
window = _.extend {}, global, window
window.window = window
context = vm.createContext window

for file in SRC_FILES
  path = Npm.resolve 'pdf.js/src/' + file
  content = fs.readFileSync path, 'utf8'
  vm.runInContext content, context, path

PDFJS.canvas = canvas

originalLegacyThen = PDFJS.LegacyPromise.prototype.then
PDFJS.LegacyPromise.prototype.then = (onResolve, onReject) ->
  onResolve = bindEnvironment onResolve, this if _.isFunction onResolve
  onReject = bindEnvironment onReject, this if _.isFunction onReject
  originalLegacyThen.call this, onResolve, onReject

originalThen = context.Promise.prototype.then
context.Promise.prototype.then = (onResolve, onReject) ->
  onResolve = bindEnvironment onResolve, this if _.isFunction onResolve
  onReject = bindEnvironment onReject, this if _.isFunction onReject
  originalThen.call this, onResolve, onReject

wrap = (obj) ->
  # We iterate manually and not with underscore because it does not support
  # getters and setters: https://github.com/jashkenas/underscore/issues/1270
  for name of obj
    descriptor = Object.getOwnPropertyDescriptor(obj, name)
    continue if descriptor.get or descriptor.set # We skip getters and setters
    continue unless _.isFunction obj[name]
    obj["#{ name }Sync"] = wrapAsync obj[name]

# Wrap public API into future-enabled API
PDFJS.getDocumentSync = wrapAsync PDFJS.getDocument
wrap context.PDFDocumentProxy.prototype
wrap context.PDFPageProxy.prototype

PDFJS.UnsupportedManager.listen (msg) ->
  # We throw an exception for anything unsupported
  throw new Meteor.Error 500, "Unsupported feature", msg

# We already have all the files loaded so we fake the promise as resolved to prevent
# PDF.js from trying by itself and failing because there is no real browser
PDFJS.fakeWorkerFilesLoadedPromise = new PDFJS.LegacyPromise()
PDFJS.fakeWorkerFilesLoadedPromise.resolve()

@PDFJS = PDFJS
