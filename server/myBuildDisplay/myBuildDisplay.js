'use strict';
Controllers.MyBuildDisplayAllow = (function () {
	function Insert(userId, doc) {
		// TODO: Get the count of the items and set the new sort to that.
		//var count = Collections.MyBuildDisplay.find({userId: Meteor.userId()}).count();
		return (userId === Meteor.userId());
	}

	function Update(userId, doc, fieldNames, modifier) {
		// TODO: If there is a sort, then make sure to toggle with the old sort.
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
