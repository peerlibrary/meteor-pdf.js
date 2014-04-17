importScripts('../digest.js/digest.js');

// store native importScripts function
var originalImportScripts = importScripts;

// prefix importScripts function
var fixedPathImportScripts = (function fixedPathImportScriptsClosure(originalImportScripts) {
  return function(src){
    return originalImportScripts("../pdf.js/src/" + src);
  };
})(importScripts);

importScripts = fixedPathImportScripts;

importScripts('worker_loader.js');

// put the importScripts back as it was
importScripts = originalImportScripts;
importScripts('worker.js');