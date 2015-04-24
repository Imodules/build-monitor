/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Users = (function () {
	function CreateUser(options, user) {
		if (!options || !user || !options.username || !options.email) {
			throw new Meteor.Error(500, 'Invalid input!');
		}

		// TODO: Ensure first users is admin.

		// TODO: Ensure no duplicate users names / emails.
	}

	return {
		onCreateUser: CreateUser
	};
})();
