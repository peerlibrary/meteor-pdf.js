path = Npm.require 'path'
vm = Npm.require 'vm'

# TODO: Reuse file list from package.js
JASMINE = [
  'pdf.js/external/jasmine/jasmine.js'
  'jasmine/src/console/ConsoleReporter.js'
]

JASMINE_RUNNER = 'tests_unit_runner.js'

# TODO: Reuse file list from package.js
UNIT_TESTS = [
  'pdf.js/test/unit/api_spec.js'
  'pdf.js/test/unit/cmap_spec.js'
  'pdf.js/test/unit/crypto_spec.js'
  'pdf.js/test/unit/evaluator_spec.js'
  'pdf.js/test/unit/font_spec.js'
  'pdf.js/test/unit/function_spec.js'
  'pdf.js/test/unit/metadata_spec.js'
  'pdf.js/test/unit/obj_spec.js'
  'pdf.js/test/unit/parser_spec.js'
  'pdf.js/test/unit/stream_spec.js'
  'pdf.js/test/unit/util_spec.js'
]

for unitTest in UNIT_TESTS
  do (unitTest) ->
    Tinytest.addAsync "pdf.js - unit tests - #{ path.basename unitTest }", (test, onComplete) ->
      [PDFJS, vmContext] = newPDFJS 'file:///pdf.js/test/unit/', Assets

      PDFJS.throwExceptionOnWarning = false

      vmContext.test = test
      vmContext.onComplete = onComplete

      for file in JASMINE
        vm.runInContext Assets.getText(file), vmContext, file

      vm.runInContext Assets.getText(unitTest), vmContext, unitTest

      vm.runInContext Assets.getText(JASMINE_RUNNER), vmContext, JASMINE_RUNNER
