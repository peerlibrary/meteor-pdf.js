btoa = Npm.require 'btoa'
atob = Npm.require 'atob'
canvas = Npm.require 'canvas'
jsdom = Npm.require 'jsdom'
vm = Npm.require 'vm'
xmldom = Npm.require 'xmldom'

DEBUG = false

# SHARED + DISPLAY + CORE
# TODO: Reuse variables from package.js
# TODO: Add web/compatibility.js?
SRC_FILES = [
  'pdf.js/src/shared/util.js',
  'pdf.js/src/shared/colorspace.js',
  'pdf.js/src/shared/function.js',
  'pdf.js/src/shared/annotation.js'
  'pdf.js/src/display/api.js',
  'pdf.js/src/display/metadata.js',
  'pdf.js/src/display/canvas.js',
  'pdf.js/src/display/pattern_helper.js',
  'pdf.js/src/display/font_loader.js'
  'pdf.js/src/core/network.js',
  'pdf.js/src/core/chunked_stream.js',
  'pdf.js/src/core/pdf_manager.js',
  'pdf.js/src/core/core.js',
  'pdf.js/src/core/obj.js',
  'pdf.js/src/core/charsets.js',
  'pdf.js/src/core/cidmaps.js',
  'pdf.js/src/core/crypto.js',
  'pdf.js/src/core/pattern.js',
  'pdf.js/src/core/evaluator.js',
  'pdf.js/src/core/fonts.js',
  'pdf.js/src/core/font_renderer.js',
  'pdf.js/src/core/glyphlist.js',
  'pdf.js/src/core/image.js',
  'pdf.js/src/core/metrics.js',
  'pdf.js/src/core/parser.js',
  'pdf.js/src/core/ps_parser.js',
  'pdf.js/src/core/stream.js',
  'pdf.js/src/core/worker.js',
  'pdf.js/src/core/jpx.js',
  'pdf.js/src/core/jbig2.js',
  'pdf.js/src/core/bidi.js',
  'pdf.js/src/core/cmap.js',
  'pdf.js/external/jpgjs/jpg.js',
]

# TODO: Disable fetching external resources once fixed in jsdom https://github.com/tmpvar/jsdom/issues/743
#jsdom.defaultDocumentFeatures =
#  FetchExternalResources: false
#  ProcessExternalResources: false

@runInServerBrowser = (context, files, initialDom) ->
  PDFJS = context.PDFJS

  window = jsdom.jsdom(initialDom).createWindow()
  window.btoa = btoa
  window.atob = atob
  window.DOMParser = xmldom.DOMParser
  window.Image = canvas.Image

  window.setTimeout = wrappedSetTimeout
  window.setInterval = wrappedSetInterval
  window.clearTimeout = wrappedClearTimeout
  window.clearInterval = wrappedClearInterval

  # TODO: We should provide some way to capture logs which were created during each PDF.js API call

  window.console =
    log: (args...) ->
      console.log args... if DEBUG

      return unless PDFJS.throwExceptionOnWarning

      # We ignore this warning
      return if args[0] is 'Warning: Setting up fake worker.'

      # But we throw an exception for any other warning or error
      throw new Meteor.Error 500, args if /^(Warning|Error): /.test args[0]

    error: (args...) ->
      console.error args... if DEBUG

      # PDF.js throws an error already for error calls

    warn: (args...) ->
      console.warn args... if DEBUG

      return unless PDFJS.throwExceptionOnWarning

      # We throw an exception for any warning (PDF.js does not seem to really use them)
      throw new Meteor.Error 500, args

  # So that isSyncFontLoadingSupported returns true
  window.navigator.userAgent = 'Mozilla/5.0 rv:14 Gecko'

  # We have to make context so that window is both global scope and window variable. This
  # is necessary because node.js does not make window variable a global scope by default,
  # but PDF.js does assume that if window is available, that is global scope.
  # TODO: To be secure, we do not have to pass everything in the context, like "require" and "process" and "global" itself?
  window = _.extend context, global, window
  window.window = window
  window.self = window # encoding-indexes.js uses self for global context
  vmContext = vm.createContext window

  for filename in ['stringencoding/encoding-indexes.js', 'stringencoding/encoding.js']
    vm.runInContext Assets.getText(filename), vmContext, filename

  for {content, filename} in files
    vm.runInContext content, vmContext, filename

  vmContext

@newPDFJS = ->
  PDFJS =
    throwExceptionOnWarning: true # Our flag to be able to disable throwing exceptions for tests which do not expect that
    pdfBug: DEBUG

  vmContext = runInServerBrowser {PDFJS: PDFJS}, (content: Assets.getText(filename), filename: filename for filename in SRC_FILES)

  # We store it into PDFJS so that users of our library do not have to depend on it and Npm.require it
  PDFJS.canvas = canvas

  originalLegacyThen = PDFJS.LegacyPromise.prototype.then
  PDFJS.LegacyPromise.prototype.then = (onResolve, onReject) ->
    onResolve = bindEnvironment onResolve, this if _.isFunction onResolve
    onReject = bindEnvironment onReject, this if _.isFunction onReject
    originalLegacyThen.call this, onResolve, onReject

  originalThen = vmContext.Promise.prototype.then
  vmContext.Promise.prototype.then = (onResolve, onReject) ->
    onResolve = bindEnvironment onResolve, this if _.isFunction onResolve
    onReject = bindEnvironment onReject, this if _.isFunction onReject
    originalThen.call this, onResolve, onReject

  wrap = (obj) ->
    # We iterate manually and not with underscore because it does not support
    # getters and setters: https://github.com/jashkenas/underscore/issues/1270
    for name of obj
      continue if /^_/.test name # We skip private members
      continue if name is 'render' # PDFPageProxy.render is a special case not returning promise directly
      descriptor = Object.getOwnPropertyDescriptor(obj, name)
      continue if descriptor.get or descriptor.set # We skip getters and setters
      continue unless _.isFunction obj[name]
      obj["#{ name }Sync"] = wrapAsync obj[name]

  # Wrap public API into future-enabled API
  PDFJS.getDocumentSync = wrapAsync PDFJS.getDocument
  wrap vmContext.PDFDocumentProxy.prototype
  wrap vmContext.PDFPageProxy.prototype

  # PDFPageProxy.render is a special case not returning promise directly
  vmContext.PDFPageProxy.prototype.renderSync = wrapAsync (args...) ->
    vmContext.PDFPageProxy.prototype.render.apply(this, args).promise

  PDFJS.UnsupportedManager.listen (msg) ->
    return unless PDFJS.throwExceptionOnWarning

    # We throw an exception for anything unsupported
    throw new Meteor.Error 500, "Unsupported feature", msg

  PDFJS.verbosity = PDFJS.VERBOSITY_LEVELS.infos if DEBUG

  # We already have all the files loaded so we fake the promise as resolved to prevent
  # PDF.js from trying by itself and failing because there is no real browser
  PDFJS.fakeWorkerFilesLoadedPromise = new PDFJS.LegacyPromise()
  PDFJS.fakeWorkerFilesLoadedPromise.resolve()

  [PDFJS, vmContext]

[PDFJS, vmContext] = @newPDFJS()
