PDFJS = {}

do () -> # To not pollute the namespace
  require = __meteor_bootstrap__.require

  btoa = require 'btoa'
  canvas = require 'canvas'
  fs = require 'fs'
  jsdom = require 'jsdom'
  vm = require 'vm'
  xmldom = require 'xmldom'

  DEBUG = false

  # Copy from pdf.js/make.js
  SRC_FILES = [
    'core.js',
    'util.js',
    'api.js',
    'canvas.js',
    'obj.js',
    'function.js',
    'charsets.js',
    'cidmaps.js',
    'colorspace.js',
    'crypto.js',
    'evaluator.js',
    'fonts.js',
    'glyphlist.js',
    'image.js',
    'metrics.js',
    'parser.js',
    'pattern.js',
    'stream.js',
    'worker.js',
    'jpx.js',
    'jbig2.js',
    'bidi.js',
    'metadata.js',
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
    path = require.resolve 'pdf.js/src/' + file
    content = fs.readFileSync path, 'utf8'
    vm.runInContext content, context, path

  context.createScratchCanvas = (width, height) ->
    new canvas(width, height)
