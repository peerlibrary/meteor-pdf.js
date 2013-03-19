Package.describe({
  summary: "Meteor smart package for pdf.js"
});

Package.on_use(function (api) {
  api.use('coffeescript', 'server');
  api.use('underscore', 'server');

  api.add_files([
    'bootstrap.coffee',
    'server.coffee'
  ], 'server');
});
