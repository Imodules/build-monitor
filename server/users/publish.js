/**
 * Created by imod on 4/24/15.
 */

'use strict';
Meteor.publish('myUser', function () {
	return Meteor.users.find({_id: this.userId}, {fields: {isAdmin: 1, username: 1, profile: 1}});
});
