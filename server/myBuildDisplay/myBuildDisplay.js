/**
 * Created by paul on 5/3/15.
 */

'use strict';
Controllers.MyBuildDisplayAllow = (function () {
	function Update(userId, doc, fieldNames, modifier) {
		if (userId !== Meteor.userId()) {
			return false;
		}

		if (modifier.$set) {
			if (doc.isDisplayed !== modifier.$set.isDisplayed) {
				Controllers.Builds.onMyBuildDisplayHasChanged(doc.buildId, modifier.$set.isDisplayed);
			}
		}

		return true;
	}

	return {
		onUpdate: Update
	}
})();

Collections.MyBuildDisplay.allow({
	insert: function (userId, doc) {
		return userId === Meteor.userId();
	},

	update: Controllers.MyBuildDisplayAllow.onUpdate,

	remove: function () {
		return false;
	}
});
