'use strict';
Meteor.publish('myBuildDisplay', function () {
	// TODO: Need to configure this to only show displayed when on dashboard.
	return Collections.MyBuildDisplay.find({userId: this.userId});
});
