/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Dashboard = Controllers.Route.Base.extend({
	layoutTemplate: 'dashboard',
	onBeforeAction: function () {
		this.next();
	},

	waitOn: function () {

	},

	data: function () {

	},

	action: function () {
		this.render('home');
	}
});
