PDFJS.workerSrc = '/packages/pdf.js/sha256-pdf.js/worker_loader.js';

PDFDocumentProxy.prototype.sha256 = function(){
  var promise = new PDFJS.LegacyPromise();
  this.transport.sha256(promise);
  return promise;
};

WorkerTransport.prototype.sha256 = function(promise) {
  return this.messageHandler.send('GetSHA256', null, function(data) {
    return promise.resolve(data);
  });
};