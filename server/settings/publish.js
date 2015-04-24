/**
 * Created by paul on 4/23/15.
 */

'use strict';
Meteor.publish('settings', function () {
	var user = Meteor.users.findOne({_id: this.userId},{fields: {isAdmin: 1}});

	if (!user || !user.isAdmin) {
		return this.ready();
	}

	return Collections.Settings.find({});
});
