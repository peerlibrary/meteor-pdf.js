Package.describe({
  summary: "Mozilla's HTML5 PDF reader, repackaged for Meteor, client & server",
  version: '0.8.1003-6',
  name: 'mrt:pdf.js',
  git: 'https://github.com/peerlibrary/meteor-pdf.js.git'
});

Package.on_use(function (api) {
  api.imply('peerlibrary:pdf.js@0.8.1003-6');
});
