pdf.js smart package
====================

Meteor smart package for [pdf.js](https://github.com/mozilla/pdf.js), Mozilla's PDF
reader built with HTML5 and JavaScript that powers the PDF display in Firefox.

Adding this package to your [Meteor](http://www.meteor.com/) application adds `PDFJS` object into the global scope,
which you can use as defined in [pdf.js API](https://github.com/mozilla/pdf.js/blob/master/src/api.js).
On the server, in addition to existing API, a fibers-enabled synchronous ([blocking](https://github.com/peerlibrary/meteor-blocking))
methods are added to objects. They are named the same, but with a `Sync` suffix. Instead of returning a promise they
return when they finish or throw an exception. So, on the server you can do:

    var pdf = {
        data: Assets.getBinary(pdfPath),
        password: ''
    };
    var document = PDFJS.getDocumentSync(pdf);
    var page = document.getPageSync(1);

If not ussing [Assets](http://docs.meteor.com/#assets) to get PDF, you should use [fs](https://github.com/peerlibrary/meteor-fs)
package for file system access to get fibers-enabled synchronous functions instead of functions which block the
whole node.js process.

It requires some additional [node.js](http://nodejs.org/) packages which will be automatically installed
from [npm](http://nodejs.org/) when your Meteor application is run for fhe first time.
[Cairo](http://cairographics.org/) graphic library is required for this and you
might have to configure environment properly so that it can be successfully compiled.

On Mac OS X you can get Cairo by installing [X11](http://xquartz.macosforge.org/) and
run the following before you run `mrt` to configure environment:

    export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig

To be able to compile libraries, you need [Xcode](https://developer.apple.com/xcode/)
with command line tools installed (from _Preferences_ > _Downloads_ > _Components_),
and `pkg-config` as well. The latter you can install using [Homebrew](http://brew.sh/)
([MacPorts](https://www.macports.org/) also works, if you prefer it).

On Debian you can install:

    sudo aptitude install libcairo2-dev libfreetype6-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
