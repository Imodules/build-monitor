/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Servers = Controllers.Route.Base.extend({
	onBeforeAction: function () {
		if (!Meteor.user().isAdmin) {
			Router.go('/profile');
		}
		this.next();
	},

	waitOn: function () {
		return Meteor.subscribe('servers');
	},

	data: function () {
		return {
			servers: Collections.Servers.find({}, {sort: {name: 1}})
		};
	},

	action: function () {
		this.render('servers');
	}
});
