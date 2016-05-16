/**
 * Created by paul on 4/23/15.
 */

'use strict';
Meteor.users.allow({
	insert: function () {
		return false;
	},

	update: function () {
		return false;
	},
	remove: function () {
		return false;
	}
});

Accounts.onCreateUser(Controllers.Users.onCreateUser);
