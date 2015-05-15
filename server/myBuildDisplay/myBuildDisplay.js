/**
 * Created by paul on 5/3/15.
 */

'use strict';
Controllers.MyBuildDisplayAllow = (function () {
	function Insert(userId, doc) {
		if (userId !== Meteor.userId()) {
			return false;
		}

		if (doc.isDisplayed === true) {
			var server = Controllers.Servers.getServer(doc.serverId);
			server.toggleBuildDisplay(doc.buildId, true, userId);
		}

		return true;
	}

	function Update(userId, doc, fieldNames, modifier) {
		if (userId !== Meteor.userId()) {
			return false;
		}

		if (modifier.$set && modifier.$set.isDisplayed !== undefined) {
			var server = Controllers.Servers.getServer(doc.serverId);
			server.toggleBuildDisplay(doc.buildId, modifier.$set.isDisplayed, userId);
		}

		return true;
	}

	return {
		onInsert: Insert,
		onUpdate: Update
	};
})();

Collections.MyBuildDisplay.allow({
	insert: Controllers.MyBuildDisplayAllow.onInsert,
	update: Controllers.MyBuildDisplayAllow.onUpdate,

	remove: function () {
		return false;
	}
});
