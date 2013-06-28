if Meteor.isClient and /PhantomJS/.test window.navigator.userAgent
  # PhantomJS (used for testing on Travis CI) does not have Function.prototype.bind and pdf.js is using it
  # https://github.com/ariya/phantomjs/issues/10522
  # Workaround from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  if !Function.prototype.bind
    Function.prototype.bind = (oThis) ->
      if !_.isFunction(this)
        throw new TypeError "Function.prototype.bind - what is trying to be bound is not callable"

      aArgs = Array.prototype.slice.call(arguments, 1)
      fToBind = this
      fNOP = () ->
      fBound = () ->
        fToBind.apply(this instanceof fNOP && (if oThis then this else oThis), aArgs.concat(Array.prototype.slice.call(arguments)))

      fNOP.prototype = this.prototype
      fBound.prototype = new fNOP()

      fBound
