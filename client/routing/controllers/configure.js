/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Route.Configure = Controllers.Route.Base.extend({
	waitOn: function () {
		return [
			Meteor.subscribe('servers'),
			Meteor.subscribe('projects'),
			Meteor.subscribe('builds')
		];
	},

	action: function () {
		this.render('configure');
	}
});
