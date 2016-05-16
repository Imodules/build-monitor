/**
 * Created by imod on 4/29/15.
 */

'use strict';

Meteor.publish('builds', function () {
	return Collections.Builds.find();
});

Meteor.publish('displayedBuilds', function () {
	return Collections.Builds.find({watchers: {$in: [this.userId]}});
});
