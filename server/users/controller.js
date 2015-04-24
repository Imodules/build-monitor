/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Users = (function () {
	function CreateUser(options, user) {
		if (!options || !user || !options.email) {
			throw new Meteor.Error(500, 'Invalid input!');
		}

		if (!Meteor.users.findOne()) {
			user.isAdmin = true;
		}

		if (!user.isAdmin) {
			if (Meteor.users.findOne({'emails.0.address': options.email})) {
				throw new Meteor.Error(500, 'Email already exists');
			}
		}

		return user;
	}

	return {
		onCreateUser: CreateUser
	};
})();
