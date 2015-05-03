/**
 * Created by paul on 5/3/15.
 */

'use strict';
Meteor.publish('myBuildDisplay', function () {
	return Collections.MyBuildDisplay.find({userId: this.userId});
});
