if Meteor.isClient and /PhantomJS/.test window.navigator.userAgent
  # PhantomJS (used for testing on Travis CI) does not have Function.prototype.bind and pdf.js is using it
  # https://github.com/ariya/phantomjs/issues/10522
  # Workaround from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  if !Function.prototype.bind
    Function.prototype.bind = (oThis, args...) ->
      _.bind this, oThis, args...
