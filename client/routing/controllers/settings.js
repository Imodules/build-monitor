/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Settings = Controllers.Route.Base.extend({
	onBeforeAction: function () {
		if (!Meteor.user().isAdmin) {
			Router.go('/profile');
		}
		this.next();
	},

	waitOn: function () {
		return Meteor.subscribe('settings');
	},

	data: function () {
		return {
			settings: Collections.Settings.find()
		}
	},

	action: function () {
		this.render('settings');
	}
});
