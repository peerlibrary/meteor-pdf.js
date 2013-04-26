do -> # To not pollute the namespace
  DEPENDENCIES = [
    require: 'btoa'
    npm: 'btoa@1.1.0'
  ,
    require: 'canvas'
    npm: 'canvas@1.0.1'
  ,
    require: 'jsdom'
    npm: 'jsdom@0.5.3',
  ,
    require: 'pdf.js/src/core.js'
    # If dependency is updated, smart.json version should be updated, too
    # "node make.js buildnumber" returns the build number to be used
    # git pdf.js submodule should be kept in sync, too
    npm: 'git://github.com/peerlibrary/pdf.js.git#d48097845fa4fb4e00fe895d0412872535ad0730'
  ,
    require: 'xmldom'
    npm: 'xmldom@0.1.13'
  ]

  require = __meteor_bootstrap__.require

  assert = require 'assert'
  child_process = require 'child_process'
  path = require 'path'

  endsWith = (string, suffix) ->
    string.indexOf(suffix, string.length - suffix.length) != -1

  baseDirectory = (directory) ->
    directory = directory.split path.sep
    assert.equal directory[directory.length-1], 'node_modules'
    directory[0...directory.length-1].join path.sep

  for directory in process.mainModule.paths
    directory = baseDirectory directory
    if endsWith directory, '.meteor'
      workingDirectory = directory
      break

  assert workingDirectory

  future = require 'fibers/future'

  # We set PATH so that Meteor's node.js binary is used when compiling dependencies and not system's
  process.env.PATH = "#{ path.dirname process.argv[0] }:" + process.env.PATH

  spawnSync = (file, args, options) ->
    wrapped = future.wrap (cb) ->
      options ?= {}
      options.stdio = 'inherit'

      proc = child_process.spawn file, args, options
      proc.on 'close', (code, signal) ->
        cb if code != 0 then "Command failed with exit code #{ code }" else null
      proc.on 'error', (error) ->
        cb error
    wrapped().wait()
    return # So that we do not return the results from wait

  for dependency in DEPENDENCIES
    try
      require dependency.require
    catch error
      console.log "Missing '#{ dependency.require }' dependency, installing..."
      spawnSync 'npm', ['install', dependency.npm], {cwd: workingDirectory}

      # Verify
      require dependency.require

  return # So that we do not return the results of the for-loop
