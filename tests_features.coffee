IGNORED_TESTS = [
  'XMLHttpRequest-response' # Not using XMLHttpRequest on the server
  'fillRule-evenodd' # TODO: Implement support in node-canvas: https://github.com/LearnBoost/node-canvas/issues/384
  'dash-array' # TODO: Implement support in node-canvas: https://github.com/LearnBoost/node-canvas/pull/373
  'font-face' # TODO: Implement support in jsdom and node-canvas: https://github.com/tmpvar/jsdom/issues/744
  'font-face-sync' # TODO: Implement support in jsdom and node-canvas: https://github.com/tmpvar/jsdom/issues/744

  # We are using PDF.js fake worker
  'Worker'
  'Worker-Uint8Array'
  'Worker-transfers'
  'Worker-xhr-response'
  'Worker-TextDecoder'
]

initialize = ->
  runInServerBrowser {}, [{
    content: Assets.getText 'pdf.js/test/features/tests.js'
    filename: 'pdf.js/test/features/tests.js'
  }], Assets.getText 'pdf.js/test/features/index.html'

vmContext = initialize()

done = 0
all = 0
testDone = ->
  done++
  if done is all
    # We reinitialize to clean any changes made by running tests so that tests can be called
    # multiple times (which happens when you reload a client after tests already ran once)
    vmContext = initialize()
    done = 0

for t, i in vmContext.tests when t.id not in IGNORED_TESTS and t.area not in ['Viewer', 'Demo']
  all++

  do (t, i) ->
    Tinytest.addAsync "meteor-pdf.js - features - #{ t.id }", (test, onComplete) ->
      try
        # We get a new test instance based on i to make sure we have a test
        # from currently initialized vmContext and not one from a closure
        pdfJsTest = vmContext.tests[i]

        publish = (result) ->
          try
            message = "#{ pdfJsTest.name }, impact #{ pdfJsTest.impact }, area #{ pdfJsTest.area}"
            if result.output in ['Success', 'Skipped']
              test.ok
                message: "#{ message }, result #{ result.output }"
            else
              test.fail
                type: 'assert_equal'
                message: "#{ message }, emulated #{ result.emulated }"
                expected: "'Success' or 'Skipped'"
                actual: result.output
                stack: result.exception?.stack

            onComplete()

          finally
            testDone()

        result = null
        try
          result = pdfJsTest.run()
        catch e
          result =
            output: 'Failed'
            emulated: '?'
            exception: e

        if result.then
          result.then publish
        else
          publish result

      catch e
        testDone()
        throw e
