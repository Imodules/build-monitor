/**
 * Created by imod on 4/28/15.
 */

'use strict';
Meteor.publish('projects', function () {
	return Collections.Projects.find({});
});
