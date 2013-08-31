var Future = Npm.require('fibers/future');

var currentInvocation = new Meteor.EnvironmentVariable();

bindEnvironment = function (func, _this) {
  var throwErr = function (err) {
    try {
      var lastFuture = currentInvocation.get().lastFuture;
      lastFuture.throw(err);
    }
    catch (e) {
      Meteor._debug("Exception when throwing an exception into the future", e.stack);
    }
  };
};

wrapAsync = function (fn) {
  return function (/* arguments */) {
    var self = this;
    var callbackSuccess;
    var callbackFailure;
    var fut;
    var newArgs = _.toArray(arguments);

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

    return currentInvocation.withValue({lastFuture: fut}, function () {
      callbackSuccess = bindEnvironment(callbackSuccess);
      callbackFailure = bindEnvironment(callbackFailure);

      var promise = fn.apply(self, newArgs);
      if (!promise.then) return promise; // Not a promise
      promise.then(callbackSuccess, callbackFailure);
      return fut.wait();
    });
  };
};
