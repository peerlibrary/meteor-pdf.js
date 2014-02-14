function Reporter() {
  var self = this;

  self.reportRunnerStarting = function () {};

  self.reportSpecStarting = function() {};

  self.reportSpecResults = function (spec) {
    var results = spec.results();

    if (results.skipped) {
      test.ok({'message': spec.description + " - Skipped."});
      return;
    }

    _.each(results.items_, function (item, i) {
      if (item.passed_) {
        test.ok({'type': item.type, 'message': spec.description + " - " + item.message});
      }
      else {
        test.fail({'type': item.type, 'message': spec.description + " - " + item.message, 'stack': item.trace.stack, 'expected': item.expected, 'actual': item.actual});
      }
    });
  };

  self.reportSuiteResults = function (suite) {};

  self.reportRunnerResults = function(runner) {
    onComplete();
  };
}

var jasmineEnv = jasmine.getEnv();
jasmineEnv.addReporter(new Reporter());
jasmineEnv.execute();
