'use strict';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
	action: function() {
		//Router.route('/', { name: 'dashboard', controller: Controllers.Route.Dashboard });
		BlazeLayout.render('dashboard', {main: 'home'});
	}
});

FlowRouter.route('/servers', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
	action: function() {
		//Router.route('/servers', { name: 'servers', controller: Controllers.Route.Servers });
		BlazeLayout.render('blankLayout', {main: 'servers'});
	}
});

FlowRouter.route('/login', {
	action: function() {
		//Router.route('/login', { name: 'login', controller: Controllers.Route.Login });
		BlazeLayout.render('login');
	}
});

FlowRouter.route('/users', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
	action: function() {
		//Router.route('/users', { name: 'users', controller: Controllers.Route.Users });
		BlazeLayout.render('blankLayout', {main: 'users'});
	}
});

FlowRouter.route('/configure', {
	action: function() {
		//Router.route('/configure', { name: 'configure', controller: Controllers.Route.Configure });
		BlazeLayout.render('blankLayout', {main: 'configure'});
	}
});
