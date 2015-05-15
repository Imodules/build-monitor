/**
 * Created by imodules on 5/13/15.
 */

'use strict';
describe('server.updateBuildDisplay', function () {
	var serverId,
			buildId;

	beforeAll(function () {
		spyOn(Meteor, 'user').and.callFake(function () {
			return { isAdmin: true };
		});
		spyOn(Meteor, 'userId').and.callFake(function () { return 'userId123'; });

		serverId = Controllers.Servers.onSaveServer(null, 'buildDsiplayServer', 'http://del.example.com', 'nodel', 'yesdel');
		var project = new Models.Project({serverId: serverId, serviceProjectId: 'BDServerProject'}),
				builds = [
					new Models.Build({serverId: serverId, serviceBuildId: 'BDServerProjectDB1', name: 'BDServerProject Build 1'}),
					new Models.Build({serverId: serverId, serviceBuildId: 'BDServerProjectDB2', name: 'BDServerProject Build 2'})
				];

		Controllers.Projects.onAddProject(project, builds);

		var build = Collections.Builds.findOne({serverId: serverId});
		buildId = build._id;
	});

	it('should increment the display count of the build', function () {
		var build = Controllers.Builds.getBuild(buildId);
		expect(build.watchers.length).toBe(0);
		expect(build.isDisplayed).toBeFalsy();

		var server = Controllers.Servers.getServer(serverId);
		server.toggleBuildDisplay(buildId, true, 'TheSweet1');
		build = Controllers.Builds.getBuild(buildId);
		expect(build.watchers.length).toBe(1);
		expect(build.isDisplayed).toBe(true);

		server.toggleBuildDisplay(buildId, true, 'TheSweet2');
		build = Controllers.Builds.getBuild(buildId);
		expect(build.watchers.length).toBe(2);
		expect(build.isDisplayed).toBe(true);
	});

	it('should decrement the display count of the build', function () {
		var build = Controllers.Builds.getBuild(buildId);
		expect(build.watchers.length).toBe(2);
		expect(build.isDisplayed).toBe(true);

		var server = Controllers.Servers.getServer(serverId);
		server.toggleBuildDisplay(buildId, false, 'TheSweet1');
		build = Controllers.Builds.getBuild(buildId);
		expect(build.watchers.length).toBe(1);
		expect(build.isDisplayed).toBe(true);

		server.toggleBuildDisplay(buildId, false, 'TheSweet2');
		build = Controllers.Builds.getBuild(buildId);
		expect(build.watchers.length).toBe(0);
		expect(build.isDisplayed).toBeFalsy();
	});
});
