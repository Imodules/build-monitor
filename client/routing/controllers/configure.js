/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Configure = Controllers.Route.Base.extend({
	onBeforeAction: function () {
		if (!Meteor.user().isAdmin) {
			Router.go('/profile');
		}
		this.next();
	},

	waitOn: function () {
		return [
			Meteor.subscribe('servers'),
			Meteor.subscribe('projects')
		];
	},

	action: function () {
		this.render('configure');
	}
});
