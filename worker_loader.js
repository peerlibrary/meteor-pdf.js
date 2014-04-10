importScripts('digest.js/digest.js');

var fixedPathImportScripts = (function (originalImportScripts) {
  return function(src){
    return originalImportScripts("pdf.js/src/" + src);
  };
})(importScripts);

importScripts = function(src){
  fixedPathImportScripts(src);
}

importScripts('worker_loader.js');

handler.on('GetSHA256', function(data, deferred){
  var ah = handler.actionHandler;
  var action = ah['GetData'];
  var deferred_data = {};
  var promise = new Promise(function (resolve, reject) {
    deferred_data.resolve = resolve;
    deferred_data.reject = reject;
  });
  deferred_data.promise = promise;

  promise.then(function(resolvedData){
    var hash = Digest.SHA256();
    // calculate hash in chunks
    var chunkSize = 128 * 1024; // bytes
    var chunkStart = 0, chunkEnd, streamLength = resolvedData.byteLength;
    while(chunkStart < streamLength){
      chunkEnd = chunkStart + chunkSize < streamLength ? chunkStart + chunkSize : streamLength;
      hash.update(resolvedData.subarray(chunkStart, chunkEnd));
      chunkStart += chunkSize;
    }
    var hexTab = '0123456789abcdef', str = '', _i, _len, a;
    var array = new Uint8Array(hash.finalize());
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      a = array[_i];
      str += hexTab.charAt((a >>> 4) & 0xF) + hexTab.charAt(a & 0xF);
      }

    deferred.resolve(str);
  });

  action[0].call(action[1], null, deferred_data);

});
