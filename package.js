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
  canvas: "1.0.1",
  jsdom: "0.5.3",
  xmldom: "0.1.13",
  'pdf.js': "https://github.com/peerlibrary/pdf.js/tarball/d48097845fa4fb4e00fe895d0412872535ad0730"
});

Package.on_use(function (api) {
  api.use('coffeescript', 'server');
  api.use('underscore', 'server');

  api.add_files([
    'server.coffee'
  ], 'server');

  // Copy from pdf.js/make.js
  // TODO: Verify if this is the best set of files for the client
  api.add_files([
    'pdf.js/src/core.js',
    'pdf.js/src/util.js',
    'pdf.js/src/api.js',
    'pdf.js/src/canvas.js',
    'pdf.js/src/obj.js',
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
    'pdf.js/src/metadata.js',
    'pdf.js/src/../external/jpgjs/jpg.js',
    'pdf.js/src/worker_loader.js' // TODO: Is this OK to include? It just throws an error on client when loading, but things work
  ], 'client', {raw: true});

  api.add_files([
    'client.coffee'
  ], 'client');
});

Package.on_test(function (api) {
  api.use(['pdf.js', 'tinytest', 'test-helpers', 'coffeescript'], ['client', 'server']);
  api.use(['connect'], ['server']);
  api.add_files('tests.coffee', ['client', 'server']);
});