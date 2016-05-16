'use strict';
import App from '../imports/components/App.jsx';
import Dashboard from '../imports/components/Dashboard.jsx';
import Configure from '../imports/components/Configure.jsx';

import { Accounts } from 'meteor/std:accounts-ui';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
	/*triggersEnter: [AccountsTemplates.ensureSignedIn],*/
	action: function() {
		//Router.route('/', { name: 'dashboard', controller: Controllers.Route.Dashboard });
		ReactLayout.render( Dashboard );
	}
});

FlowRouter.route('/servers', {
	/*triggersEnter: [AccountsTemplates.ensureSignedIn],*/
	action: function() {
		//Router.route('/servers', { name: 'servers', controller: Controllers.Route.Servers });
		BlazeLayout.render('blankLayout', {main: 'servers'});
	}
});

FlowRouter.route('/login', {
	action: function() {
		//Router.route('/login', { name: 'login', controller: Controllers.Route.Login });
		ReactLayout.render(App, {content: <Accounts.ui.LoginForm />});
	}
});

FlowRouter.route('/users', {
	/*triggersEnter: [AccountsTemplates.ensureSignedIn],*/
	action: function() {
		//Router.route('/users', { name: 'users', controller: Controllers.Route.Users });
		BlazeLayout.render('blankLayout', {main: 'users'});
	}
});

FlowRouter.route('/configure', {
	/*triggersEnter: [AccountsTemplates.ensureSignedIn],*/
	action: function() {
		//Router.route('/configure', { name: 'configure', controller: Controllers.Route.Configure });
		ReactLayout.render(App, {content: <Configure />});
	}
});

