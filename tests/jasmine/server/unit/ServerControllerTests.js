/**
 * Created by imod on 4/30/15.
 */

'use strict';
describe('Controllers.Server', function () {
	describe('onStartUp()', function () {
		it('should start the build query interval timer', function () {
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) { cb(); });

			spyOn(Collections.Servers, 'find').and.callFake(function () {
				return [
					{ _id: 'srvId1', url: 'http://example.com/bs', type: 'teamcity' },
					{ _id: 'srvId2', url: 'http://example.com/bs', type: 'teamcity' }
				];
			});

			spyOn(Services.TeamCity.prototype, 'queryRunningBuilds');

			Controllers.Server.onStartUp();

			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 20000);
			expect(Collections.Servers.find).toHaveBeenCalled();
			expect(Services.TeamCity.prototype.queryRunningBuilds.calls.count()).toBe(2);
		});
	});
});
