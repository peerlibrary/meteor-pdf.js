Package.describe({
  summary: "Mozilla's HTML5 PDF reader, repackaged for Meteor, client & server",
  version: '1.0.791-1',
  name: 'mrt:pdf.js',
  git: 'https://github.com/peerlibrary/meteor-pdf.js.git'
});

Package.on_use(function (api) {
  api.imply('peerlibrary:pdf.js@1.0.791-1');
});
