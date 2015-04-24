/**
 * Created by paul on 4/22/15.
 */

'use strict';
/**
 * Router configuration
 */
Router.configure({
	// By default we want to use the application layout as that is where most of our pages will be.
	layoutTemplate: 'blankLayout'
});

Router.plugin('ensureSignedIn');

Router.route('/', { name: 'dashboard', controller: Controllers.Route.Dashboard });
Router.route('/setup', { name: 'setup', controller: Controllers.Route.Setup });

Router.route('/login', { name: 'login', controller: Controllers.Route.Login });
Router.route('/configure', { name: 'configure', controller: Controllers.Route.Configure });
