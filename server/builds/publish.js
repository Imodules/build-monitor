/**
 * Created by imod on 4/29/15.
 */

'use strict';

Meteor.publish('builds', function () {
	return Collections.Builds.find();
});

Meteor.publish('displayedBuilds', function () {
	var myBuilds = Collections.MyBuildDisplay.find({
				userId: this.userId,
				isDisplayed: true
			}, {fields: {buildId: 1}}).fetch(),
			myBuildIds = _.pluck(myBuilds, 'buildId');

	return Collections.Builds.find({_id: {$in: myBuildIds}, displayCounter: {$gt: 0}});
});
