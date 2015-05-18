/**
 * Created by imodules on 5/13/15.
 */

'use strict';
describe('timerController', function () {
	var serverId;
	beforeAll(function () {
		spyOn(Meteor, 'user').and.callFake(function () {
			return {isAdmin: true};
		});

		serverId = Controllers.Servers.onSaveServer(null, 'timerController', 'http://onPollInterval.example.com');
		console.log('timerController-ServerId: ' + serverId);

		var project = new Models.Project({serverId: serverId, serviceProjectId: 'ProjectOnPollInterval'}),
				builds = [
					new Models.Build({
						serverId: serverId,
						serviceBuildId: 'RunningBuild_001',
						name: 'Running Build 1',
						displayCounter: 1
					}),
					new Models.Build({
						serverId: serverId,
						serviceBuildId: 'RunningBuild_002',
						name: 'Running Build 2',
						displayCounter: 11
					}),
					new Models.Build({
						serverId: serverId,
						serviceBuildId: 'RunningBuild_003',
						name: 'Running Build 3',
						displayCounter: 12
					})
				];

		Controllers.Projects.onAddProject(project, builds);
	});

	describe('onPollInterval()', function () {

		beforeEach(function () {
			spyOn(Meteor, 'setInterval');
			spyOn(Meteor, 'clearInterval');

			spyOn(Controllers.Servers, 'getServers').and.callFake(function () { return [Controllers.Servers.getServer(serverId)]; });
		});

		it('should not update anything if there are no running builds', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if (s(url).endsWith('/builds?locator=running:true')) {
					cb(null, JSON.parse(Assets.getText('testData/tcNoRunningBuilds.json')));
				}
			});

			Controllers.Timer.onPollInterval();

			var activeBuilds = Controllers.Builds.getActiveServerBuilds(serverId).fetch();
			expect(activeBuilds.length).toBe(0);
		});

		it('should update running builds if it gets data back', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if (s(url).endsWith('/builds?locator=running:true')) {
					cb(null, JSON.parse(Assets.getText('testData/tcRunningBuilds.json')));
				} else if(s(url).endsWith('builds/id:112766')) {
					cb(null, JSON.parse(Assets.getText('testData/builds/tcRunningBuildDetail_002.json')));
				} else if(s(url).endsWith('builds/id:112767')) {
					cb(null, JSON.parse(Assets.getText('testData/builds/tcRunningBuildDetail_001.json')));
				}
			});

			Controllers.Timer.onPollInterval();

			var activeBuilds = Controllers.Builds.getRunningServerBuilds(serverId).fetch();
			expect(activeBuilds.length).toBe(2);

			var bt3 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_003');
			expect(bt3.isBuilding).toBeFalsy();

			var bt1 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_001');
			expect(bt1.isBuilding).toBe(true);
			expect(bt1.builds.length).toBe(1);
			expect(bt1.builds[0].id).toBe(112767);
			expect(bt1.builds[0].serviceBuildId).toBe('RunningBuild_001');
			expect(bt1.builds[0].isSuccess).toBe(true);
			expect(bt1.builds[0].isRunning).toBe(true);
			expect(bt1.builds[0].href).toBe('/guestAuth/app/rest/builds/id:112767');
			expect(bt1.builds[0].percentageComplete).toBe(20);
			expect(bt1.builds[0].statusText).toBe('Moving on out');
			expect(bt1.builds[0].startDate.toString()).toBe('Wed May 13 2015 22:21:53 GMT-0500 (CDT)');
			expect(bt1.builds[0].finishDate).toBe(null);
			expect(bt1.builds[0].usernames.length).toBe(2);
			expect(bt1.builds[0].usernames[0]).toBe('pstuart');
			expect(bt1.builds[0].usernames[1]).toBe('rellias');

			var bt2 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_002');
			expect(bt2.isBuilding).toBe(true);
			expect(bt2.builds.length).toBe(1);
			expect(bt2.builds[0].id).toBe(112766);
			expect(bt2.builds[0].serviceBuildId).toBe('RunningBuild_002');
			expect(bt2.builds[0].isSuccess).toBe(true);
			expect(bt2.builds[0].isRunning).toBe(true);
			expect(bt2.builds[0].href).toBe('/guestAuth/app/rest/builds/id:112766');
			expect(bt2.builds[0].percentageComplete).toBe(6);
			expect(bt2.builds[0].statusText).toBe('_CopyFilesMarkedCopyLocal');
			expect(bt2.builds[0].startDate.toString()).toBe('Wed May 13 2015 21:21:53 GMT-0500 (CDT)');
			expect(bt2.builds[0].finishDate).toBe(null);
			expect(bt2.builds[0].usernames.length).toBe(1);
			expect(bt2.builds[0].usernames[0]).toBe('jbourdon');
		});
	});

	describe('onRunningBuildQueryInterval()', function () {
		it('should update the builds', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if(s(url).endsWith('builds/id:112766')) {
					cb(null, JSON.parse(Assets.getText('testData/builds/tcRunningBuildDetail_002_update.json')));
				} else if(s(url).endsWith('builds/id:112767')) {
					cb(null, JSON.parse(Assets.getText('testData/builds/tcRunningBuildDetail_001_update.json')));
				}
			});
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			Controllers.Timer.onRunningBuildQueryInterval(serverId);

			var activeBuilds = Controllers.Builds.getRunningServerBuilds(serverId).fetch();
			expect(activeBuilds.length).toBe(2);

			var bt3 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_003');
			expect(bt3.isBuilding).toBeFalsy();

			var bt1 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_001');
			expect(bt1.isBuilding).toBe(true);
			expect(bt1.builds.length).toBe(1);
			expect(bt1.builds[0].id).toBe(112767);
			expect(bt1.builds[0].serviceBuildId).toBe('RunningBuild_001');
			expect(bt1.builds[0].isSuccess).toBe(true);
			expect(bt1.builds[0].isRunning).toBe(true);
			expect(bt1.builds[0].href).toBe('/guestAuth/app/rest/builds/id:112767');
			expect(bt1.builds[0].percentageComplete).toBe(60);
			expect(bt1.builds[0].statusText).toBe('Moving on out');
			expect(bt1.builds[0].startDate.toString()).toBe('Wed May 13 2015 22:21:53 GMT-0500 (CDT)');
			expect(bt1.builds[0].finishDate).toBe(null);
			expect(bt1.builds[0].usernames.length).toBe(2);
			expect(bt1.builds[0].usernames[0]).toBe('pstuart');
			expect(bt1.builds[0].usernames[1]).toBe('rellias');

			var bt2 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_002');
			expect(bt2.isBuilding).toBe(true);
			expect(bt2.isLastBuildSuccess).toBe(false);
			expect(bt2.builds.length).toBe(1);
			expect(bt2.builds[0].isSuccess).toBe(false);
			expect(bt2.builds[0].isRunning).toBe(true);
			expect(bt2.builds[0].percentageComplete).toBe(88);
			expect(bt2.builds[0].statusText).toBe('Failure is eminent');
		});

		it('should stop builds that have completed', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if(s(url).endsWith('builds/id:112766')) {
					cb(null, JSON.parse(Assets.getText('testData/builds/tcRunningBuildDetail_002_update2.json')));
				} else if(s(url).endsWith('builds/id:112767')) {
					cb(null, JSON.parse(Assets.getText('testData/builds/tcRunningBuildDetail_001_update.json')));
				}
			});
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			Controllers.Timer.onRunningBuildQueryInterval(serverId);

			var activeBuilds = Controllers.Builds.getRunningServerBuilds(serverId).fetch();
			expect(activeBuilds.length).toBe(1);

			var bt3 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_003');
			expect(bt3.isBuilding).toBeFalsy();

			var bt1 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_001');
			expect(bt1.isBuilding).toBe(true);

			var bt2 = Controllers.Builds.getBuildByServiceId(serverId, 'RunningBuild_002');
			expect(bt2.isBuilding).toBe(false);
			expect(bt2.builds.length).toBe(1);
			expect(bt2.builds[0].isSuccess).toBe(false);
			expect(bt2.builds[0].isRunning).toBe(false);
			expect(bt2.builds[0].percentageComplete).toBe(null);
			expect(bt2.builds[0].statusText).toBe('It be all done');

			expect(Controllers.Timer.onStopRunningBuildsTimer).toHaveBeenCalledWith(serverId);
		});
	});
});
