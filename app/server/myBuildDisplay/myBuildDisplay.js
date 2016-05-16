'use strict';
Controllers.MyBuildDisplayAllow = (function () {
	function Insert(userId, doc) {
		return (userId === Meteor.userId());
	}

	function Update(userId, doc, fieldNames, modifier) {
		return (userId === Meteor.userId());
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
