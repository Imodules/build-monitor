/**
 * Created by paul on 4/23/15.
 */

'use strict';
describe('Controllers.Users', function () {
	describe('onCreateUser()', function () {
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
	});
});
