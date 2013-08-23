var Future = Npm.require('fibers/future');

wrapAsync = function (fn) {
  return function (/* arguments */) {
    var self = this;
    var callbackSuccess;
    var callbackFailure;
    var fut;
    var newArgs = _.toArray(arguments);

    var logErr = function (err) {
      if (err) Meteor._debug("Exception in callback of async function", err ? err.stack : err);
    };

    fut = new Future();
    callbackSuccess = function (val) {
      fut.return(val);
    };
    callbackFailure = function (message, exception) {
      if (exception) {
        fut.throw(exception);
      }
      else {
        fut.throw(message);
      }
    };
    callbackSuccess = Meteor.bindEnvironment(callbackSuccess, logErr);
    callbackFailure = Meteor.bindEnvironment(callbackFailure, logErr);

    var promise = fn.apply(self, newArgs);
    if (!promise.then) return promise; // Not a promise
    promise.then(callbackSuccess, callbackFailure);
    return fut.wait();
  };
};
