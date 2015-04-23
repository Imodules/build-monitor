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

Router.route('/', { name: 'home', controller: Controllers.Route.Home });

Controllers.Route.Home = Controllers.Route.Base.extend({
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
