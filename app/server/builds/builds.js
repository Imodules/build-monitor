/**
 * Created by imod on 4/29/15.
 */

'use strict';
Collections.Builds.allow({
	insert: function () {
		return false;
	},

	update: function (userId, doc, fieldNames, modifier) {
		return false;
	},
	remove: function () {
		return false;
	}
});

Meteor.methods({
	removeBuild: Controllers.Builds.onRemoveByBuildId
});
