/**
 * Created by paul on 5/6/15.
 */

'use strict';

describe('Controllers.main', function () {
	describe('onRefreshActiveBuilds()', function () {
		var serverId,
				tcRunningBuilds;

		beforeAll(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return { isAdmin: true };
			});

			serverId = Controllers.Servers.onSaveServer(null, 'integration.onstartup', 'http://intstart.example.com', 'integration', 'startup');
			console.log('serverId: ' + serverId);

			tcRunningBuilds = JSON.parse(Assets.getText('testData/tcRunningBuilds.json'));
			expect(serverId).toBeTruthy();
		});

		beforeEach(function () {
			spyOn(Meteor, 'clearTimeout');
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) {
				cb();
			});

			spyOn(HTTP, 'get').and.callFake(function (url, cb) {

			});
		});

		it('should do something and return true', function () {
			var result = true;
			expect(result).toBe(true);
		});
	});
});
