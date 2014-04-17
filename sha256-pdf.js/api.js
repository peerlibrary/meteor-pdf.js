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