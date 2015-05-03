/**
 * Created by paul on 5/3/15.
 */

'use strict';
Collections.MyBuildDisplay.allow({
	insert: function (userId, doc) {
		return userId === Meteor.userId();
	},

	update: function (userId, doc, fieldNames, modifier) {
		return userId === Meteor.userId();
	},
	remove: function () {
		return false;
	}
});
