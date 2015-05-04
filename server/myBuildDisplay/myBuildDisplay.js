/**
 * Created by paul on 5/3/15.
 */

'use strict';
Controllers.MyBuildDisplayAllow = (function () {
	function Insert(userId, doc) {
		if (userId !== Meteor.userId()) {
			return false;
		}

		console.log(doc);
		if (doc.isDisplayed === true) {
			Controllers.Builds.onMyBuildDisplayHasChanged(doc.buildId, doc.isDisplayed);
		}

		return true;
	}

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
		onInsert: Insert,
		onUpdate: Update
	}
})();

Collections.MyBuildDisplay.allow({
	insert: Controllers.MyBuildDisplayAllow.onInsert,
	update: Controllers.MyBuildDisplayAllow.onUpdate,

	remove: function () {
		return false;
	}
});
