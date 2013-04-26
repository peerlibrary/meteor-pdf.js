Package.describe({
  summary: "Meteor smart package for pdf.js"
});

Package.on_use(function (api) {
  api.use('coffeescript', 'server');
  api.use('underscore', 'server');

  api.add_files([
    'bootstrap.coffee',
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
    'pdf.js/src/worker_loader.js', // TODO: Is this OK to include? It just throws an error it seems when loading, but things work.
    'client.coffee'
  ], 'client');
});
