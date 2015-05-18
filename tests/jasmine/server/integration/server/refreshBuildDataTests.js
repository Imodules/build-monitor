/**
 * Created by paul on 5/13/15.
 */

'use strict';
describe('rereshBuildData', function () {
	var serverId;

	beforeAll(function () {
		spyOn(Meteor, 'user').and.callFake(function () {
			return {isAdmin: true};
		});

		serverId = Controllers.Servers.onSaveServer(null, 'server.rereshBuildData', 'http://onPollInterval.example.com');
		console.log('rereshBuildData-ServerId: ' + serverId);

		var project = new Models.Project({serverId: serverId, serviceProjectId: 'Project.Server.RefreshBuildData'}),
				builds = [
					new Models.Build({
						serverId: serverId,
						serviceBuildId: 'RefreshBuilds_001',
						name: 'Running Build 1',
						displayCounter: 1,
						href: '/some/where/1'
					}),
					new Models.Build({
						serverId: serverId,
						serviceBuildId: 'RefreshBuilds_002',
						name: 'Running Build 2',
						displayCounter: 11,
						href: '/some/where/11'
					}),
					new Models.Build({
						serverId: serverId,
						serviceBuildId: 'RefreshBuilds_003',
						name: 'Running Build 3',
						displayCounter: 12,
						href: '/some/where/12'
					})
				];

		Controllers.Projects.onAddProject(project, builds);
	});

	beforeEach(function () {
		spyOn(Meteor, 'setInterval');
		spyOn(Meteor, 'clearInterval');
	});

	it('should call out and get 10 builds then get a build detail record for each and mark lastBuildSuccess true', function () {
		spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
			if (s(url).endsWith('/builds?count=10')) {
				cb(null, JSON.parse(Assets.getText('testData/builds/tcRefreshBuildDataSummary.json')));
			} else if (s(url).endsWith('/id:113173')) {
				cb(null, JSON.parse(Assets.getText('testData/builds/tcFailureBuildDetail.json')));
			} else {
				cb(null, JSON.parse(Assets.getText('testData/builds/tcSuccessBuildDetail.json')));
			}
		});

		var build = Controllers.Builds.getBuildByServiceId(serverId, 'RefreshBuilds_001'),
				server = Controllers.Servers.getServer(serverId);

		server.refreshBuildData(build._id);

		build = Controllers.Builds.getBuild(build._id);

		expect(build.isLastBuildSuccess).toBe(true);
		expect(build.builds.length).toBe(10);
		expect(build.builds[0].isSuccess).toBe(true);
		expect(build.builds[1].isSuccess).toBe(false);
		expect(build.builds[2].isSuccess).toBe(true);

		expect(build.builds[0].isBuilding).toBe(false);
		expect(build.builds[0].statusText).toBe('Tests passed: 40');

		expect(build.builds[0].startDate.toString()).toBe('Wed May 13 2015 17:21:17 GMT-0500 (CDT)');
		expect(build.builds[0].finishDate.toString()).toBe('Wed May 13 2015 17:24:10 GMT-0500 (CDT)');

		expect(build.builds[1].startDate.toString()).toBe('Wed May 13 2015 16:48:59 GMT-0500 (CDT)');
		expect(build.builds[1].finishDate.toString()).toBe('Wed May 13 2015 16:51:35 GMT-0500 (CDT)');

		expect(build.builds[0].usernames.length).toBe(1);
		expect(build.builds[0].usernames[0]).toBe('joe');

		expect(build.builds[1].usernames.length).toBe(2);
		expect(build.builds[1].usernames[0]).toBe('joe');
		expect(build.builds[1].usernames[1]).toBe('pstuart');
	});

	it('should call out and get 10 builds then get a build detail record for each and mark lastBuildSuccess false', function () {
		spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
			if (s(url).endsWith('/builds?count=10')) {
				cb(null, JSON.parse(Assets.getText('testData/builds/tcRefreshBuildDataSummary.json')));
			} else if (s(url).endsWith('/id:113175')) {
				cb(null, JSON.parse(Assets.getText('testData/builds/tcFailureBuildDetail.json')));
			} else {
				cb(null, JSON.parse(Assets.getText('testData/builds/tcSuccessBuildDetail.json')));
			}
		});

		var build = Controllers.Builds.getBuildByServiceId(serverId, 'RefreshBuilds_002'),
				server = Controllers.Servers.getServer(serverId);

		server.refreshBuildData(build._id);

		build = Controllers.Builds.getBuild(build._id);

		expect(build.isLastBuildSuccess).toBe(false);
		expect(build.builds.length).toBe(10);
		expect(build.builds[0].isSuccess).toBe(false);
		expect(build.builds[1].isSuccess).toBe(true);
		expect(build.builds[2].isSuccess).toBe(true);

		expect(build.builds[0].isBuilding).toBe(false);
		expect(build.builds[0].statusText).toBe('Tests failed: 1, passed: 30');
	});
});
