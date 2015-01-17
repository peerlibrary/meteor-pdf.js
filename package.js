Package.describe({
  summary: "Mozilla's HTML5 PDF reader, repackaged for Meteor, client & server",
  version: '1.0.791_4',
  name: 'peerlibrary:pdf.js',
  git: 'https://github.com/peerlibrary/meteor-pdf.js.git'
});

// Initialization of environment
(function () {
  var path = Npm.require('path');

  // PKG_CONFIG_PATH for Mac OS X
  process.env.PKG_CONFIG_PATH = (process.env.PKG_CONFIG_PATH ? process.env.PKG_CONFIG_PATH + ':' : '') + '/opt/X11/lib/pkgconfig';
})();

Npm.depends({
  btoa: '1.1.2',
  atob: '1.1.2',
  canvas: '1.1.6',
  jsdom: '0.11.1',
  xmldom: '0.1.19',
  through: '2.3.6',
  imagediff: '1.0.7'
});

// The following lists are based on pdf.js/make.js

SHARED = [
  'pdf.js/src/shared/util.js'
];

var DISPLAY = [
  'pdf.js/src/display/api.js',
  'pdf.js/src/display/metadata.js',
  'pdf.js/src/display/canvas.js',
  'pdf.js/src/display/webgl.js',
  'pdf.js/src/display/pattern_helper.js',
  'pdf.js/src/display/font_loader.js',
  'pdf.js/src/display/annotation_helper.js',
  'pdf.js/src/display/svg.js'
];

var CORE = [
  'pdf.js/src/core/network.js',
  'pdf.js/src/core/chunked_stream.js',
  'pdf.js/src/core/pdf_manager.js',
  'pdf.js/src/core/core.js',
  'pdf.js/src/core/obj.js',
  'pdf.js/src/core/charsets.js',
  'pdf.js/src/core/annotation.js',
  'pdf.js/src/core/function.js',
  'pdf.js/src/core/colorspace.js',
  'pdf.js/src/core/crypto.js',
  'pdf.js/src/core/pattern.js',
  'pdf.js/src/core/evaluator.js',
  'pdf.js/src/core/cmap.js',
  'pdf.js/src/core/fonts.js',
  'pdf.js/src/core/font_renderer.js',
  'pdf.js/src/core/glyphlist.js',
  'pdf.js/src/core/image.js',
  'pdf.js/src/core/metrics.js',
  'pdf.js/src/core/parser.js',
  'pdf.js/src/core/ps_parser.js',
  'pdf.js/src/core/stream.js',
  'pdf.js/src/core/worker.js',
  'pdf.js/src/core/arithmetic_decoder.js',
  'pdf.js/src/core/jpg.js',
  'pdf.js/src/core/jpx.js',
  'pdf.js/src/core/jbig2.js',
  'pdf.js/src/core/bidi.js',
  'pdf.js/src/core/murmurhash3.js'
];

var BCMAPS = [
  'pdf.js/external/bcmaps/78-EUC-H.bcmap',
  'pdf.js/external/bcmaps/78-EUC-V.bcmap',
  'pdf.js/external/bcmaps/78-H.bcmap',
  'pdf.js/external/bcmaps/78-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/78-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/78-V.bcmap',
  'pdf.js/external/bcmaps/78ms-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/78ms-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/83pv-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/90ms-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/90ms-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/90msp-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/90msp-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/90pv-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/90pv-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/Add-H.bcmap',
  'pdf.js/external/bcmaps/Add-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/Add-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/Add-V.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-0.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-1.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-2.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-3.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-4.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-5.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-6.bcmap',
  'pdf.js/external/bcmaps/Adobe-CNS1-UCS2.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-0.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-1.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-2.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-3.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-4.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-5.bcmap',
  'pdf.js/external/bcmaps/Adobe-GB1-UCS2.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-0.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-1.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-2.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-3.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-4.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-5.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-6.bcmap',
  'pdf.js/external/bcmaps/Adobe-Japan1-UCS2.bcmap',
  'pdf.js/external/bcmaps/Adobe-Korea1-0.bcmap',
  'pdf.js/external/bcmaps/Adobe-Korea1-1.bcmap',
  'pdf.js/external/bcmaps/Adobe-Korea1-2.bcmap',
  'pdf.js/external/bcmaps/Adobe-Korea1-UCS2.bcmap',
  'pdf.js/external/bcmaps/B5-H.bcmap',
  'pdf.js/external/bcmaps/B5-V.bcmap',
  'pdf.js/external/bcmaps/B5pc-H.bcmap',
  'pdf.js/external/bcmaps/B5pc-V.bcmap',
  'pdf.js/external/bcmaps/CNS-EUC-H.bcmap',
  'pdf.js/external/bcmaps/CNS-EUC-V.bcmap',
  'pdf.js/external/bcmaps/CNS1-H.bcmap',
  'pdf.js/external/bcmaps/CNS1-V.bcmap',
  'pdf.js/external/bcmaps/CNS2-H.bcmap',
  'pdf.js/external/bcmaps/CNS2-V.bcmap',
  'pdf.js/external/bcmaps/ETHK-B5-H.bcmap',
  'pdf.js/external/bcmaps/ETHK-B5-V.bcmap',
  'pdf.js/external/bcmaps/ETen-B5-H.bcmap',
  'pdf.js/external/bcmaps/ETen-B5-V.bcmap',
  'pdf.js/external/bcmaps/ETenms-B5-H.bcmap',
  'pdf.js/external/bcmaps/ETenms-B5-V.bcmap',
  'pdf.js/external/bcmaps/EUC-H.bcmap',
  'pdf.js/external/bcmaps/EUC-V.bcmap',
  'pdf.js/external/bcmaps/Ext-H.bcmap',
  'pdf.js/external/bcmaps/Ext-RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/Ext-RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/Ext-V.bcmap',
  'pdf.js/external/bcmaps/GB-EUC-H.bcmap',
  'pdf.js/external/bcmaps/GB-EUC-V.bcmap',
  'pdf.js/external/bcmaps/GB-H.bcmap',
  'pdf.js/external/bcmaps/GB-V.bcmap',
  'pdf.js/external/bcmaps/GBK-EUC-H.bcmap',
  'pdf.js/external/bcmaps/GBK-EUC-V.bcmap',
  'pdf.js/external/bcmaps/GBK2K-H.bcmap',
  'pdf.js/external/bcmaps/GBK2K-V.bcmap',
  'pdf.js/external/bcmaps/GBKp-EUC-H.bcmap',
  'pdf.js/external/bcmaps/GBKp-EUC-V.bcmap',
  'pdf.js/external/bcmaps/GBT-EUC-H.bcmap',
  'pdf.js/external/bcmaps/GBT-EUC-V.bcmap',
  'pdf.js/external/bcmaps/GBT-H.bcmap',
  'pdf.js/external/bcmaps/GBT-V.bcmap',
  'pdf.js/external/bcmaps/GBTpc-EUC-H.bcmap',
  'pdf.js/external/bcmaps/GBTpc-EUC-V.bcmap',
  'pdf.js/external/bcmaps/GBpc-EUC-H.bcmap',
  'pdf.js/external/bcmaps/GBpc-EUC-V.bcmap',
  'pdf.js/external/bcmaps/H.bcmap',
  'pdf.js/external/bcmaps/HKdla-B5-H.bcmap',
  'pdf.js/external/bcmaps/HKdla-B5-V.bcmap',
  'pdf.js/external/bcmaps/HKdlb-B5-H.bcmap',
  'pdf.js/external/bcmaps/HKdlb-B5-V.bcmap',
  'pdf.js/external/bcmaps/HKgccs-B5-H.bcmap',
  'pdf.js/external/bcmaps/HKgccs-B5-V.bcmap',
  'pdf.js/external/bcmaps/HKm314-B5-H.bcmap',
  'pdf.js/external/bcmaps/HKm314-B5-V.bcmap',
  'pdf.js/external/bcmaps/HKm471-B5-H.bcmap',
  'pdf.js/external/bcmaps/HKm471-B5-V.bcmap',
  'pdf.js/external/bcmaps/HKscs-B5-H.bcmap',
  'pdf.js/external/bcmaps/HKscs-B5-V.bcmap',
  'pdf.js/external/bcmaps/Hankaku.bcmap',
  'pdf.js/external/bcmaps/Hiragana.bcmap',
  'pdf.js/external/bcmaps/KSC-EUC-H.bcmap',
  'pdf.js/external/bcmaps/KSC-EUC-V.bcmap',
  'pdf.js/external/bcmaps/KSC-H.bcmap',
  'pdf.js/external/bcmaps/KSC-Johab-H.bcmap',
  'pdf.js/external/bcmaps/KSC-Johab-V.bcmap',
  'pdf.js/external/bcmaps/KSC-V.bcmap',
  'pdf.js/external/bcmaps/KSCms-UHC-H.bcmap',
  'pdf.js/external/bcmaps/KSCms-UHC-HW-H.bcmap',
  'pdf.js/external/bcmaps/KSCms-UHC-HW-V.bcmap',
  'pdf.js/external/bcmaps/KSCms-UHC-V.bcmap',
  'pdf.js/external/bcmaps/KSCpc-EUC-H.bcmap',
  'pdf.js/external/bcmaps/KSCpc-EUC-V.bcmap',
  'pdf.js/external/bcmaps/Katakana.bcmap',
  'pdf.js/external/bcmaps/NWP-H.bcmap',
  'pdf.js/external/bcmaps/NWP-V.bcmap',
  'pdf.js/external/bcmaps/RKSJ-H.bcmap',
  'pdf.js/external/bcmaps/RKSJ-V.bcmap',
  'pdf.js/external/bcmaps/Roman.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UCS2-H.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UCS2-V.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UTF16-H.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UTF16-V.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UTF8-H.bcmap',
  'pdf.js/external/bcmaps/UniCNS-UTF8-V.bcmap',
  'pdf.js/external/bcmaps/UniGB-UCS2-H.bcmap',
  'pdf.js/external/bcmaps/UniGB-UCS2-V.bcmap',
  'pdf.js/external/bcmaps/UniGB-UTF16-H.bcmap',
  'pdf.js/external/bcmaps/UniGB-UTF16-V.bcmap',
  'pdf.js/external/bcmaps/UniGB-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniGB-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniGB-UTF8-H.bcmap',
  'pdf.js/external/bcmaps/UniGB-UTF8-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UCS2-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UCS2-HW-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UCS2-HW-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UCS2-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UTF16-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UTF16-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UTF8-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS-UTF8-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS2004-UTF16-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS2004-UTF16-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS2004-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS2004-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniJIS2004-UTF8-H.bcmap',
  'pdf.js/external/bcmaps/UniJIS2004-UTF8-V.bcmap',
  'pdf.js/external/bcmaps/UniJISPro-UCS2-HW-V.bcmap',
  'pdf.js/external/bcmaps/UniJISPro-UCS2-V.bcmap',
  'pdf.js/external/bcmaps/UniJISPro-UTF8-V.bcmap',
  'pdf.js/external/bcmaps/UniJISX0213-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniJISX0213-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniJISX02132004-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniJISX02132004-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniKS-UCS2-H.bcmap',
  'pdf.js/external/bcmaps/UniKS-UCS2-V.bcmap',
  'pdf.js/external/bcmaps/UniKS-UTF16-H.bcmap',
  'pdf.js/external/bcmaps/UniKS-UTF16-V.bcmap',
  'pdf.js/external/bcmaps/UniKS-UTF32-H.bcmap',
  'pdf.js/external/bcmaps/UniKS-UTF32-V.bcmap',
  'pdf.js/external/bcmaps/UniKS-UTF8-H.bcmap',
  'pdf.js/external/bcmaps/UniKS-UTF8-V.bcmap',
  'pdf.js/external/bcmaps/V.bcmap',
  'pdf.js/external/bcmaps/WP-Symbol.bcmap'
];

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.3');
  api.use(['coffeescript', 'underscore'], 'server');

  api.export('PDFJS');

  api.add_files([
    'xhr2-compatibility.js',
    'node-xhr2/src/000-xml_http_request_event_target.coffee',
    'node-xhr2/src/001-xml_http_request.coffee',
    'node-xhr2/src/errors.coffee',
    'node-xhr2/src/progress_event.coffee',
    'node-xhr2/src/xml_http_request_upload.coffee',
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

  // We need compatibility on the server side as well
  api.add_files('pdf.js/web/compatibility.js', 'server', {isAsset: true});

  // Worker files have to be available directly
  // We need them on the server side as well
  api.add_files(SHARED, ['client', 'server'], {isAsset: true});
  api.add_files(CORE, ['client', 'server'], {isAsset: true});
  api.add_files([
    'pdf.js/src/worker_loader.js',
    'pdf.js/web/images/loading-icon.gif'
  ], 'client', {isAsset: true});

  api.add_files(BCMAPS, ['client', 'server'], {isAsset: true});

  // The rest of files for the server side
  api.add_files(DISPLAY, 'server', {isAsset: true});

  // Polyfill for TextDecoder for the server side
  api.add_files([
    'stringencoding/encoding-indexes.js',
    'stringencoding/encoding.js'
  ], 'server', {isAsset: true});

  // For testing purposes, it has to be here so that main PDFJS instance
  // on the server has access to it when we are running tests (assets
  // are accessed from the package code, not tests code)
  api.add_files([
    'pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  ], 'server', {isAsset: true});
});

Package.on_test(function (api) {
  api.use(['peerlibrary:pdf.js', 'tinytest', 'test-helpers', 'coffeescript', 'random', 'http'], ['client', 'server']);

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

  api.add_files('test-page.png', 'server', {isAsset: true});

  api.add_files([
    'test-page.json',
    'pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  ], ['client', 'server'], {isAsset: true});
});
