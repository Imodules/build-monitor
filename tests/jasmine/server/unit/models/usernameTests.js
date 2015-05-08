/**
 * Created by paul on 5/7/15.
 */

'use strict';
describe('Models', function () {
	describe('Username()', function () {
		it('should return the raw username', function () {
			var un = new Models.Username('hello');
			expect(un.raw).toBe('hello');
			expect(un.clean).toBe('hello');
		});

		it('should remove any domain prefix', function () {
			var un = new Models.Username('somedom\\myuser');
			expect(un.raw).toBe('somedom\\myuser');
			expect(un.clean).toBe('myuser');
		});

		it('should remove anything after < for pair names', function () {
			var un = new Models.Username('paul and me <paul & me>');
			expect(un.raw).toBe('paul and me <paul & me>');
			expect(un.clean).toBe('paul and me');
		});
	});
});
