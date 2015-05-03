/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Dashboard = Controllers.Route.Base.extend({
	layoutTemplate: 'dashboard',
	waitOn: function () {
		return [
			Meteor.subscribe('displayedProjects'),
			Meteor.subscribe('displayedBuildTypes')
		];
	},

	action: function () {
		this.render('home');
	}
});
