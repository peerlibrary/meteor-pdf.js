Package.describe({
  summary: "Meteor smart package for pdf.js"
});

// Initialization of environment
(function () {
  var path = Npm.require('path');

  // We set PATH so that Meteor's node.js binary is used when compiling dependencies and not system's
  process.env.PATH = path.dirname(process.argv[0]) + ':' + process.env.PATH;

  // PKG_CONFIG_PATH for Mac OS X
  process.env.PKG_CONFIG_PATH = (process.env.PKG_CONFIG_PATH ? process.env.PKG_CONFIG_PATH + ':' : '') + '/opt/X11/lib/pkgconfig';
})();

Npm.depends({
  btoa: "1.1.0",
  canvas: "1.0.3",
  jsdom: "0.8.6",
  xmldom: "0.1.16",
  // If dependency is updated, smart.json version should be updated, too
  // "node make.js buildnumber" returns the build number to be used
  // git pdf.js submodule should be kept in sync, too
  'pdf.js': "https://github.com/peerlibrary/pdf.js/tarball/e6fb92948684d2c57b3ae50900ef3ce9fa988398"
});

Package.on_use(function (api) {
  api.use(['coffeescript', 'underscore', 'fs'], 'server');

  api.export('PDFJS');

  api.add_files([
    'wrap.js',
    'server.coffee'
  ], 'server');

  // Based on pdf.js/make.js
  // TODO: Verify if this is the best set of files for the client
  // TODO: Add web/compatibility.js?
  api.add_files([
    'client.js',
    'pdf.js/src/shared/util.js',
    'pdf.js/src/shared/colorspace.js',
    'pdf.js/src/shared/pattern.js',
    'pdf.js/src/shared/function.js',
    'pdf.js/src/shared/annotation.js',
    'pdf.js/src/display/api.js',
    'pdf.js/src/display/metadata.js',
    'pdf.js/src/display/canvas.js',
    'pdf.js/src/display/font_loader.js'
  ], 'client', {bare: true});

  // Based on pdf.js/make.js
  api.add_files([
    'pdf.js/src/shared/util.js',
    'pdf.js/src/shared/colorspace.js',
    'pdf.js/src/shared/pattern.js',
    'pdf.js/src/shared/function.js',
    'pdf.js/src/shared/annotation.js',
    'pdf.js/src/core/network.js',
    'pdf.js/src/core/chunked_stream.js',
    'pdf.js/src/core/pdf_manager.js',
    'pdf.js/src/core/core.js',
    'pdf.js/src/core/obj.js',
    'pdf.js/src/core/charsets.js',
    'pdf.js/src/core/cidmaps.js',
    'pdf.js/src/core/crypto.js',
    'pdf.js/src/core/evaluator.js',
    'pdf.js/src/core/cmap.js',
    'pdf.js/src/core/fonts.js',
    'pdf.js/src/core/font_renderer.js',
    'pdf.js/src/core/glyphlist.js',
    'pdf.js/src/core/image.js',
    'pdf.js/src/core/metrics.js',
    'pdf.js/src/core/parser.js',
    'pdf.js/src/core/stream.js',
    'pdf.js/src/core/worker.js',
    'pdf.js/src/core/jpx.js',
    'pdf.js/src/core/jbig2.js',
    'pdf.js/src/core/bidi.js',
    'pdf.js/external/jpgjs/jpg.js',
    'pdf.js/src/worker_loader.js',
    'pdf.js/web/images/loading-icon.gif'
  ], 'client', {isAsset: true});
});

Package.on_test(function (api) {
  api.use(['pdf.js', 'tinytest', 'test-helpers', 'coffeescript', 'fs'], ['client', 'server']);
  api.add_files('tests.coffee', ['client', 'server']);

  api.add_files([
    'phantomjs.coffee'
  ], 'client');

  api.add_files([
    'pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  ], 'client', {isAsset: true});
});
