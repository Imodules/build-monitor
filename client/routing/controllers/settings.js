/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Settings = Controllers.Route.Base.extend({
	onBeforeAction: function () {
		this.next();
	},

	waitOn: function () {
		return Meteor.subscribe('settings');
	},

	data: function () {

	},

	action: function () {
		this.render('settings');
	}
});
