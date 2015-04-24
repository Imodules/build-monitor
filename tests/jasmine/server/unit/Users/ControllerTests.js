/**
 * Created by paul on 4/23/15.
 */

'use strict';
describe('Controllers.Users', function () {
	describe('onCreateUser()', function () {
		var fakeTime,
				user,
				options;

		beforeEach(function () {
			fakeTime = new Date();

			options = { email: 'pstuart@example.com',
				password:
				{ digest: '7b2f75c4bf4a29f2f54f7c11422c0f1afd0d26c691973bc0fa8fb6dcbb6f3ce2',
					algorithm: 'sha-256' }
			};

			user = { createdAt: fakeTime,
					_id: 'e6CyTGxPwqjqJxMCQ',
					services: { password: { bcrypt: '$2a$10$82yOCkb7xo9xiIqQdHpf0u/Tzfqdi9C.odxNmbrRjgHNCcRhYQOnO' } },
					emails: [ { address: 'pstuart@imodules.com', verified: false } ]
			};
		});

		it('should throw if no input is passed', function () {
			expect(function () {
				Controllers.Users.onCreateUser();
			}).toThrow();
		});

		it('should throw if email is not passed in options', function () {
			expect(function () {
				Controllers.Users.onCreateUser({username: 'user'}, {});
			}).toThrow();
		});

		it('should check to see if I am the first user and if so create me as an admin', function () {
			spyOn(Meteor.users, 'findOne').and.callFake(function () { return null; });

			var newUser = Controllers.Users.onCreateUser(options, user);

			expect(Meteor.users.findOne).toHaveBeenCalledWith();
			expect(newUser.isAdmin).toBe(true);
		});

		it('should not set a user to admin if they are not the first user', function () {
			spyOn(Meteor.users, 'findOne').and.callFake(function (search) {
				if (!search) {
					return {_id: 'ex1'};
				}

				return false;
			});

			var newUser = Controllers.Users.onCreateUser(options, user);

			expect(Meteor.users.findOne).toHaveBeenCalledWith();
			expect(Meteor.users.findOne).toHaveBeenCalledWith({'emails.0.address': 'pstuart@example.com'});
			expect(newUser.isAdmin).not.toBe(true);
		});

		it('should throw an exception if the email already exists', function () {
			spyOn(Meteor.users, 'findOne').and.callFake(function (search) {
				if (!search) {
					return {_id: 'ex1'};
				}

				return {_id: 'ex2'};
			});

			expect(function () {
				Controllers.Users.onCreateUser(options, user)
			}).toThrow();

			expect(Meteor.users.findOne).toHaveBeenCalledWith({'emails.0.address': 'pstuart@example.com'});
		});

	});
});
