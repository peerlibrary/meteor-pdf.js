PDFJS = {}

btoa = Npm.require('btoa')
canvas = Npm.require('canvas')
fs = Npm.require('fs')
jsdom = Npm.require('jsdom')
vm = Npm.require('vm')
xmldom = Npm.require('xmldom')

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

if DEBUG
  window.console = console

# So that isSyncFontLoadingSupported returns true
window.navigator.userAgent = 'Mozilla/5.0 rv:14 Gecko'

# TODO: To be secure, we do not have to pass everything in the context, like "require" and "process" and "global" itself?
context = vm.createContext _.extend {}, global, window, {window: window}

for file in SRC_FILES
  path = Npm.resolve 'pdf.js/src/' + file
  content = fs.readFileSync path, 'utf8'
  vm.runInContext content, context, path

context.createScratchCanvas = (width, height) ->
  new canvas(width, height)

# Exports global variable
@PDFJS = PDFJS
