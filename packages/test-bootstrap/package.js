Package.describe({
	name: 'pstuart2:test-bootstrap',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	summary: 'This package is just for being able to bootstrap some test data.',
	// URL to the Git repository containing the source code for this package.
	git: '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md',
	debugOnly: true
});

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.2');
	api.addFiles('test-bootstrap-server.js', ['server']);
});
