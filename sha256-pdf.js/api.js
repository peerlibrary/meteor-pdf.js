PDFJS.workerSrc = '/packages/pdf.js/sha256-pdf.js/worker_loader.js';

PDFDocumentProxy.prototype.sha256 = function PDFDocumentProxy_sha256(){
  var promise = new PDFJS.LegacyPromise();
  this.transport.sha256(promise);
  return promise;
};

WorkerTransport.prototype.sha256 = function WorkerTransport_sha256(promise) {
  return this.messageHandler.send('GetSHA256', null, function(sha256) {
    return promise.resolve(sha256);
  });
};


/*
  the following code only runs in fake worker environment
*/

var originalSetupFakeWorker = WorkerTransport.prototype.setupFakeWorker;
var originalWorkerMessageHandlerSetup = null;

// setupFakeWorker is calling PDFJS.WorkerMessageHandler.setup(handler)
// we create a wrapper around that method so we can attach another event (GetSHA256) to handler
// because we don't have handler in global scope
WorkerTransport.prototype.setupFakeWorker = function WorkerTransport_setupFakeWorker_sha256(){

    if (originalWorkerMessageHandlerSetup === null){
      // check if original setup method is already wrapped, we don't want it to wrap itself recursively
      // it could happen because setupFakeWorker can be run multiple times
      originalWorkerMessageHandlerSetup = PDFJS.WorkerMessageHandler.setup;
    }

    PDFJS.WorkerMessageHandler.setup = function wphSetupExtended(handler) {
      originalWorkerMessageHandlerSetup(handler);

      // we don't have access to handler in global scope
      function wphSetupGetSHA256Closure(handler) {
        return function(data, deferred){
          wphSetupGetSHA256(data, deferred, handler);
        }
      }
      handler.on('GetSHA256', wphSetupGetSHA256Closure(handler));
    };
    originalSetupFakeWorker.bind(this)();
}