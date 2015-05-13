/**
 * Created by imodules on 5/13/15.
 */

'use strict';
describe('updateBuildDisplay', function () {
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
		expect(build.displayCounter).toBe(0);
		expect(build.isDisplayed).toBeFalsy();

		Controllers.Servers.onUpdateBuildDisplay(buildId, true);
		build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(1);
		expect(build.isDisplayed).toBe(true);

		Controllers.Servers.onUpdateBuildDisplay(buildId, true);
		build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(2);
		expect(build.isDisplayed).toBe(true);
	});

	it('should decrement the dispaly count of the build', function () {
		var build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(2);
		expect(build.isDisplayed).toBe(true);

		Controllers.Servers.onUpdateBuildDisplay(buildId, false);
		build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(1);
		expect(build.isDisplayed).toBe(true);

		Controllers.Servers.onUpdateBuildDisplay(buildId, false);
		build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(0);
		expect(build.isDisplayed).toBeFalsy();
	});

	it('should not decrement below 0', function () {
		var build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(0);
		expect(build.isDisplayed).toBeFalsy();

		Controllers.Servers.onUpdateBuildDisplay(buildId, false);
		build = Controllers.Builds.getBuild(buildId);
		expect(build.displayCounter).toBe(0);
		expect(build.isDisplayed).toBeFalsy();
	});
});
