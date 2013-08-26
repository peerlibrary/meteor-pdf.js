PDFJS = {}

btoa = Npm.require 'btoa'
canvas = Npm.require 'canvas'
jsdom = Npm.require 'jsdom'
vm = Npm.require 'vm'
xmldom = Npm.require 'xmldom'

DEBUG = false

# Based on web/viewer.html and pdf.js/make.js
# TODO: Verify if this is the best set of files for the server
# TODO: Add web/compatibility.js?
SRC_FILES = [
  'network.js',
  'chunked_stream.js',
  'pdf_manager.js',
  'core.js',
  'util.js',
  'api.js',
  'metadata.js',
  'canvas.js',
  'obj.js',
  'annotation.js',
  'function.js',
  'charsets.js',
  'cidmaps.js',
  'colorspace.js',
  'crypto.js',
  'evaluator.js',
  'fonts.js',
  'font_renderer.js',
  'glyphlist.js',
  'image.js',
  'metrics.js',
  'parser.js',
  'pattern.js',
  'stream.js',
  'worker.js',
  '../external/jpgjs/jpg.js',
  'jpx.js',
  'jbig2.js',
  'bidi.js',
]

window = jsdom.jsdom().createWindow()
window.btoa = btoa
window.DOMParser = xmldom.DOMParser
window.PDFJS = PDFJS
window.Image = canvas.Image

window.setTimeout = Meteor.setTimeout
window.clearTimeout = Meteor.clearTimeout
window.setInterval = Meteor.setInterval
window.clearInterval = Meteor.clearInterval

if DEBUG
  window.console = console

# So that isSyncFontLoadingSupported returns true
window.navigator.userAgent = 'Mozilla/5.0 rv:14 Gecko'

# TODO: To be secure, we do not have to pass everything in the context, like "require" and "process" and "global" itself?
context = vm.createContext _.extend {}, global, window, {window: window}

for file in SRC_FILES
  path = Npm.resolve 'pdf.js/src/' + file
  content = fs.readFileSync path, 'utf8'
  if file is 'api.js'
    content +=
      """
      PDFJS.PDFDocumentProxy = PDFDocumentProxy;
      PDFJS.PDFPageProxy = PDFPageProxy;
      """
  vm.runInContext content, context, path

PDFJS.canvas = canvas

# TODO: Not good, shared variable among possibly many fibers
future = null
passFuture = (fut) ->
  future = fut

wrap = (obj) ->
  # We iterate manually and not with underscore because it does not support
  # getters and setters: https://github.com/jashkenas/underscore/issues/1270
  for name of obj
    descriptor = Object.getOwnPropertyDescriptor(obj, name)
    continue if descriptor.get or descriptor.set # We skip getters and setters
    continue unless _.isFunction obj[name]
    obj["#{ name }Sync"] = wrapAsync obj[name], passFuture

# Wrap public API into future-enabled API
PDFJS.getDocumentSync = wrapAsync PDFJS.getDocument, passFuture
wrap PDFJS.PDFDocumentProxy.prototype
wrap PDFJS.PDFPageProxy.prototype

PDFJS.LogManager.addLogger
  warn: (args...) ->
    return if args[0] is 'Setting up fake worker.'

    if future
      future.throw new Meteor.Error 500, args
    else
      throw new Meteor.Error 500, args

@PDFJS = PDFJS