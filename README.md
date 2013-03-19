pdf.js smart package
====================

Meteor smart package for [pdf.js](https://github.com/mozilla/pdf.js), a PDF Reader in JavaScript.

It requires some additional [node.js](http://nodejs.org/) packages which will be automatically installed
from [npm](http://nodejs.org/) when run into `.meteor/node_modules/` directory. [Cairo](http://cairographics.org/)
graphic library is required and you might have to configure environment properly so that all dependencies can be
successfully compiled. For example, on Mac OS X:

    export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig

Adding this package to you [Meteor](http://www.meteor.com/) application adds `PDFJS` object into the global scope,
which you can use as defined in [pdf.js API](https://github.com/mozilla/pdf.js/blob/master/src/api.js).
