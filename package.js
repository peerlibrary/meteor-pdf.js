Package.describe({
  summary: "Mozilla's HTML5 PDF reader, repackaged for Meteor, client & server"
});

// Initialization of environment
(function () {
  var path = Npm.require('path');

  // PKG_CONFIG_PATH for Mac OS X
  process.env.PKG_CONFIG_PATH = (process.env.PKG_CONFIG_PATH ? process.env.PKG_CONFIG_PATH + ':' : '') + '/opt/X11/lib/pkgconfig';
})();

Npm.depends({
  btoa: "1.1.1",
  atob: "1.1.0",
  canvas: "1.1.6",
  jsdom: "0.10.1",
  xmldom: "0.1.19"
});

// The following lists are based on pdf.js/make.js

SHARED = [
  'pdf.js/src/shared/util.js',
  'pdf.js/src/shared/colorspace.js',
  'pdf.js/src/shared/function.js',
  'pdf.js/src/shared/annotation.js'
];

var DISPLAY = [
  'pdf.js/src/display/api.js',
  'pdf.js/src/display/metadata.js',
  'pdf.js/src/display/canvas.js',
  'pdf.js/src/display/pattern_helper.js',
  'pdf.js/src/display/font_loader.js'
];

var CORE = [
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
  'pdf.js/external/jpgjs/jpg.js'
];

Package.on_use(function (api) {
  api.use(['coffeescript', 'underscore'], 'server');

  api.export('PDFJS');

  api.add_files([
    'wrap.js',
    'server.coffee'
  ], 'server');

  // Client files
  api.add_files([
    'client.js',
    'pdf.js/web/compatibility.js'
  ], 'client', {bare: true});
  api.add_files(SHARED, 'client', {bare: true});
  api.add_files(DISPLAY, 'client', {bare: true});

  // Worker files have to be available directly
  // We need them on the server side as well
  api.add_files(SHARED, ['client', 'server'], {isAsset: true});
  api.add_files(CORE, ['client', 'server'], {isAsset: true});
  api.add_files([
    'pdf.js/src/worker_loader.js',
    'pdf.js/web/images/loading-icon.gif'
  ], 'client', {isAsset: true});

  // The rest of files for the server side
  api.add_files(DISPLAY, 'server', {isAsset: true});

  // Polyfill for TextDecoder for the server side
  api.add_files([
    'stringencoding/encoding-indexes.js',
    'stringencoding/encoding.js'
  ], 'server', {isAsset: true});
});

Package.on_test(function (api) {
  api.use(['pdf.js', 'tinytest', 'test-helpers', 'coffeescript', 'random'], ['client', 'server']);

  api.add_files([
    'pdf.js/test/features/tests.js',
    'pdf.js/test/features/index.html'
  ], 'server', {isAsset: true});

  api.add_files([
    'pdf.js/test/unit/api_spec.js',
    'pdf.js/test/unit/cmap_spec.js',
    'pdf.js/test/unit/crypto_spec.js',
    'pdf.js/test/unit/evaluator_spec.js',
    'pdf.js/test/unit/font_spec.js',
    'pdf.js/test/unit/function_spec.js',
    'pdf.js/test/unit/metadata_spec.js',
    'pdf.js/test/unit/obj_spec.js',
    'pdf.js/test/unit/parser_spec.js',
    'pdf.js/test/unit/stream_spec.js',
    'pdf.js/test/unit/util_spec.js',
    'pdf.js/test/pdfs/basicapi.pdf'
  ], 'server', {isAsset: true});

  api.add_files([
    'pdf.js/external/jasmine/jasmine.js',
    'jasmine/src/console/ConsoleReporter.js',
    'tests_unit_runner.js'
  ], 'server', {isAsset: true});

  api.add_files([
    'tests_features.coffee',
    'tests_unit.coffee'
  ], 'server');

  api.add_files('tests.coffee', ['client', 'server']);

  api.add_files([
    'pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  ], ['client', 'server'], {isAsset: true});
});
