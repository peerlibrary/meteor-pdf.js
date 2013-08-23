pdf.js smart package
====================

Meteor smart package for [pdf.js](https://github.com/mozilla/pdf.js), a PDF Reader in JavaScript.

Adding this package to your [Meteor](http://www.meteor.com/) application adds `PDFJS` object into the global scope,
which you can use as defined in [pdf.js API](https://github.com/mozilla/pdf.js/blob/master/src/api.js).

It requires some additional [node.js](http://nodejs.org/) packages which will be automatically installed
from [npm](http://nodejs.org/) when your Meteor application is run for fhe first time.
[Cairo](http://cairographics.org/) graphic library is required for this and you
might have to configure environment properly so that it can be successfully compiled.

On Mac OS X you can get Cairo by installing [X11](http://xquartz.macosforge.org/), `pkg-config`
([Homebrew](http://brew.sh/), [MacPorts](https://www.macports.org/)), and:

    export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig

On Debian you can install:

    aptitude install libcairo2-dev libfreetype6-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
