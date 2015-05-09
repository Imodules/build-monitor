/**
 * Created by imod on 5/8/15.
 */

'use strict';
describe('Controllers.main', function () {
	describe('onRefreshActiveBuilds()', function () {
		it('should tell each server to refresh the build history', function () {
			spyOn(Controllers.Servers, 'getServers').and.callFake(function () {
				return [
					new Models.Server({_id: 'srvId1', url: 'http://example.com/bs1', type: 'teamcity'}),
					new Models.Server({_id: 'srvId2', url: 'http://example.com/bs2', type: 'teamcity'})
				];
			});

			spyOn(Models.Server.prototype, 'refreshActiveBuildData');

			Controllers.main.onRefreshActiveBuilds();

			expect(Controllers.Servers.getServers).toHaveBeenCalled();
			expect(Models.Server.prototype.refreshActiveBuildData.calls.count()).toBe(2);
		});
	});
});
