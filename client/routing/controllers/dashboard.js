/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Dashboard = Controllers.Route.Base.extend({
	layoutTemplate: 'dashboard',
	waitOn: function () {
		return Meteor.subscribe('displayedBuilds');
	},

	action: function () {
		this.render('home');
	}
});
