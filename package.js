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
  jsdom: "0.6.5",
  xmldom: "0.1.16",
  // If dependency is updated, smart.json version should be updated, too
  // "node make.js buildnumber" returns the build number to be used
  // git pdf.js submodule should be kept in sync, too
  'pdf.js': "https://github.com/peerlibrary/pdf.js/tarball/7aa3474b494c4f37c511c6bf1f9e398ea4f6011f"
});

Package.on_use(function (api) {
  api.use(['coffeescript', 'underscore', 'fs'], 'server');

  api.export('PDFJS');

  api.add_files([
    'wrap.js',
    'server.coffee'
  ], 'server');

  // Based on web/viewer.html and pdf.js/make.js
  // TODO: Verify if this is the best set of files for the client
  // TODO: Add web/compatibility.js?
  api.add_files([
    'client.js',
    'pdf.js/src/network.js',
    'pdf.js/src/chunked_stream.js',
    'pdf.js/src/pdf_manager.js',
    'pdf.js/src/core.js',
    'pdf.js/src/util.js',
    'pdf.js/src/api.js',
    'pdf.js/src/metadata.js',
    'pdf.js/src/canvas.js',
    'pdf.js/src/obj.js',
    'pdf.js/src/annotation.js',
    'pdf.js/src/function.js',
    'pdf.js/src/charsets.js',
    'pdf.js/src/cidmaps.js',
    'pdf.js/src/colorspace.js',
    'pdf.js/src/crypto.js',
    'pdf.js/src/evaluator.js',
    'pdf.js/src/fonts.js',
    'pdf.js/src/font_renderer.js',
    'pdf.js/src/glyphlist.js',
    'pdf.js/src/image.js',
    'pdf.js/src/metrics.js',
    'pdf.js/src/parser.js',
    'pdf.js/src/pattern.js',
    'pdf.js/src/stream.js',
    'pdf.js/src/worker.js',
    'pdf.js/src/../external/jpgjs/jpg.js',
    'pdf.js/src/jpx.js',
    'pdf.js/src/jbig2.js',
    'pdf.js/src/bidi.js'
  ], 'client', {bare: true});

  // All files from worker_loader.js
  api.add_files([
    'pdf.js/src/network.js',
    'pdf.js/src/chunked_stream.js',
    'pdf.js/src/pdf_manager.js',
    'pdf.js/src/core.js',
    'pdf.js/src/util.js',
    'pdf.js/src/canvas.js',
    'pdf.js/src/obj.js',
    'pdf.js/src/annotation.js',
    'pdf.js/src/function.js',
    'pdf.js/src/charsets.js',
    'pdf.js/src/cidmaps.js',
    'pdf.js/src/colorspace.js',
    'pdf.js/src/crypto.js',
    'pdf.js/src/evaluator.js',
    'pdf.js/src/fonts.js',
    'pdf.js/src/glyphlist.js',
    'pdf.js/src/image.js',
    'pdf.js/src/metrics.js',
    'pdf.js/src/parser.js',
    'pdf.js/src/pattern.js',
    'pdf.js/src/stream.js',
    'pdf.js/src/worker.js',
    'pdf.js/src/jpx.js',
    'pdf.js/src/jbig2.js',
    'pdf.js/src/bidi.js',
    'pdf.js//external/jpgjs/jpg.js',
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
