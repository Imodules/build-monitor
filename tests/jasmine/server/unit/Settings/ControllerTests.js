/**
 * Created by paul on 4/23/15.
 */

'use strict';
describe('Controllers.Settings', function () {
	describe('onCreateSite()', function () {
		it('should throw if url is not passed', function () {
			expect(function () {
				Controllers.Settings.onCreateSite();
			}).toThrow();
		});

		it('should return true if valid url is passed', function () {
			var result = Controllers.Settings.onCreateSite('http://localhost');

			expect(result).toBe(true);
		});

	});
});
