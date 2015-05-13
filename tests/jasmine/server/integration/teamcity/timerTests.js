/**
 * Created by imodules on 5/13/15.
 */

'use strict';
describe('timerController', function () {
	describe('onPollInterval()', function () {
		var serverId,
				tcNoRunning,
				tc2Running;

		beforeAll(function () {
			serverId = Controllers.Servers.onSaveServer(null, 'onPollInterval', 'http://onPollInterval.example.com');

			var project = new Models.Project({serverId: serverId, serviceProjectId: 'ProjectOnPollInterval'}),
					builds = [
						new Models.Build({serverId: serverId, serviceBuildId: 'RunningBuild_001', name: 'Running Build 1', displayCounter: 1}),
						new Models.Build({serverId: serverId, serviceBuildId: 'RunningBuild_002', name: 'Running Build 2', displayCounter: 11}),
						new Models.Build({serverId: serverId, serviceBuildId: 'RunningBuild_003', name: 'Running Build 3', displayCounter: 12})
					];

			Controllers.Projects.onAddProject(project, builds);

			tcNoRunning = JSON.parse(Assets.getText('testData/tcNoRunningBuilds.json'));
			tc2Running = JSON.parse(Assets.getText('testData/tcRunningBuilds.json'));
		});

		it('should not update anything if there are no running builds', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if (s(url).endsWith('/builds?locator=running:true')) {
					cb(null, tcNoRunning);
				} else if(s(url).endsWith('/id:CheckInTriggeredBuilds')) {
					cb(null, tcCheckinTriggeredBuilds);
				}
			});
		});
	});

	describe('onRunningBuildQueryInterval()', function () {

	});
});
