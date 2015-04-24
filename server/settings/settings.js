/**
 * Created by paul on 4/23/15.
 */

'use strict';
Collections.Settings.allow({
	insert: function () {
		return false;
	},

	update: function () {
		return false;
	},
	remove: function () {
		return false;
	}
});

Meteor.methods({
	updateSettings: Controllers.Settings.onUpdateSettings
});
