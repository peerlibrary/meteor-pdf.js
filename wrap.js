var Future = Npm.require('fibers/future');

var currentInvocation = new Meteor.EnvironmentVariable();

bindEnvironment = function (func, _this) {
  var throwErr = function (err) {
    try {
      currentInvocation.get().lastFuture.throw(err);
    }
    catch (e) {
      Meteor._debug("Exception when throwing an exception into the future:", e.stack, "\nOriginal exception:", err.stack ? err.stack : err);
    }
  };

  return Meteor.bindEnvironment(func, throwErr, _this);
};

wrapAsync = function (fn) {
  return function (/* arguments */) {
    var self = this;
    var callbackSuccess;
    var callbackFailure;
    var future;
    var newArgs = _.toArray(arguments);
    var timers = [];

    future = new Future();
    callbackSuccess = function (val) {
      future.return(val);
    };
    callbackFailure = function (message, exception) {
      if (exception) {
        future.throw(exception);
      }
      else {
        future.throw(message);
      }
    };

    return currentInvocation.withValue({lastFuture: future, timers: timers}, function () {
      callbackSuccess = bindEnvironment(callbackSuccess);
      callbackFailure = bindEnvironment(callbackFailure);

      var promise = fn.apply(self, newArgs);
      if (!promise || !promise.then) return promise; // Not a promise
      promise.then(callbackSuccess, callbackFailure);
      var result = future.wait();
      // We got the result, but we have now to wait until all timers stop
      while (timers.length) {
        Future.wait(timers);
        // Some elements could be added in meantime to timers,
        // so let's remove resolved ones and retry
        timers = _.reject(timers, function (f) {return f.isResolved()});
      }
      return result;
    });
  };
};

// TODO: Should we implement the rest of Meteor.setTimeout and Meteor.setInterval logic (withoutInvocation)?

wrappedSetTimeout = function (f, duration) {
  // We cannot really do much about non-functions
  if (!_.isFunction(f))
    return {
      id: setTimeout(f, duration)
    };

  var wrappedFunction;
  // We allow calling wrappedSetTimeout outside wrapAsync but without any warranty.
  // You should not be doing that because it defeats the purpose of timers.
  // We need that when resolving fakeWorkerFilesLoadedPromise which is outside
  // wrapAsync and thus currentInvocation and timers are not set.
  if (currentInvocation.get() && currentInvocation.get().timers) {
    var future = new Future();
    currentInvocation.get().timers.push(future);

    wrappedFunction = function () {
      var result = f();
      future.return();
      // Return value is not really needed, but still...
      return result;
    };
  }
  else {
    wrappedFunction = f;
  }

  wrappedFunction = bindEnvironment(wrappedFunction);

  return {
    id: setTimeout(wrappedFunction, duration),
    future: future
  };
};

wrappedSetInterval = function (f, duration) {
  // We cannot really do much about non-functions
  if (!_.isFunction(f))
    return {
      id: setInterval(f, duration)
    };

  // We allow calling wrappedSetTimeout outside wrapAsync but without any warranty.
  // You should not be doing that because it defeats the purpose of timers.
  // We do not really need this, but we have it here to match wrappedSetTimeout.
  if (currentInvocation.get() && currentInvocation.get().timers) {
    var future = new Future();
    currentInvocation.get().timers.push(future);
  }

  var wrappedFunction = bindEnvironment(f);

  return {
    id: setInterval(wrappedFunction, duration),
    future: future
  };
};

wrappedClearTimeout = function (x) {
  var result = clearTimeout(x.id);

  if (x.future && !x.future.isResolved)
    x.future.return();

  // Return value is not really needed, but still...
  return result;
};

wrappedClearInterval = function (x) {
  var result = clearInterval(x.id);

  if (x.future && !x.future.isResolved)
    x.future.return();

  // Return value is not really needed, but still...
  return result;
};
