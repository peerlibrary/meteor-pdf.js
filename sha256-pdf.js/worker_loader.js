var PDFJS_WORKER_LOADER_PATH = '/packages/pdf.js/pdf.js/src/';

if (typeof PDFJS === 'undefined' || !PDFJS.fakeWorkerFilesLoadedPromise) {
  importScripts('/packages/pdf.js/digest.js/digest.js');

  // store native importScripts function
  var originalImportScripts = importScripts;

  // prefix importScripts function with files' path (importScripts gets relative URL's)
  var fixedPathImportScripts = (function fixedPathImportScriptsClosure(originalImportScripts) {
    return function(src){
      return originalImportScripts(PDFJS_WORKER_LOADER_PATH + src);
    };
  })(importScripts);

  // force future scripts to use prefixed importScripts
  importScripts = fixedPathImportScripts;

  // load original worker_loader that loads pdf.js's files
  importScripts('worker_loader.js');

  // put importScripts back as it was
  importScripts = originalImportScripts;

  // in worker thread we load worker.js at the end because it needs handler defined in global scope
  importScripts('worker.js');
} else {
  var originalWorkerSrc = PDFJS.workerSrc;
  var originalPath = originalWorkerSrc.substr(0, originalWorkerSrc.indexOf('worker_loader.js'));

  // in main thread we load worker.js first, because it doesn't depend on anything
  // and setupFakeWorker wrapper needs wphSetupGetSHA256 in global scope
  // see WorkerTransport_setupFakeWorker_sha256

  PDFJS.Util.loadScript(originalPath + 'worker.js', function() {
    PDFJS.Util.loadScript('/packages/pdf.js/digest.js/digest.js', function(){
      PDFJS.workerSrc = PDFJS_WORKER_LOADER_PATH + 'worker_loader.js'
      PDFJS.Util.loadScript(PDFJS_WORKER_LOADER_PATH + 'worker_loader.js');
      PDFJS.fakeWorkerFilesLoadedPromise.then(function () {
        PDFJS.workerSrc = originalWorkerSrc;
      });
    });
  });
}