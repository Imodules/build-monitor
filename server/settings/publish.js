/**
 * Created by paul on 4/23/15.
 */

'use strict';
Meteor.publish('settings', function () {
	// TODO: Make sure admin.
	return Collections.Settings.find({});
});
