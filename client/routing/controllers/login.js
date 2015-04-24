/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Login = Controllers.Route.Base.extend({
	onBeforeAction: function () {
		this.next();
	},

	waitOn: function () {

	},

	data: function () {

	},

	action: function () {
		this.render('login');
	}
});
