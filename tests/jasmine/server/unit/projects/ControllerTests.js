/**
 * Created by paul on 4/24/15.
 */

'use strict';
describe('Controller.Servers', function () {
	describe('onRefreshProjects()', function () {
		it('should call out to url', function () {
			spyOn(HTTP, 'call').and.callFake(function () {
				return true;
			});
			spyOn(Collections.Servers, 'findOne').and.callFake(function () {

			});

			var result = Controllers.Projects.onRefreshProjects();

			expect(result).toBe(true);
			expect(HTTP.call).toHaveBeenCalledWith('GET', 'url', {headers: {'Accept': 'application/json'}});
		});
	});
});
