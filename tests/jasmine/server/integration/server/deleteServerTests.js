/**
 * Created by imodules on 5/13/15.
 */

'use strict';
describe('deleteServer', function () {
	var serverId;

	beforeAll(function () {
		spyOn(Meteor, 'user').and.callFake(function () {
			return { isAdmin: true };
		});
		spyOn(Meteor, 'userId').and.callFake(function () { return 'userId123'; });

		serverId = Controllers.Servers.onSaveServer(null, 'ServerWllBeDlete', 'http://del.example.com', 'nodel', 'yesdel');
		var project = new Models.Project({serverId: serverId, serviceProjectId: 'ProjectOnDoomedServer'}),
				builds = [
					new Models.Build({serverId: serverId, serviceBuildId: 'DB1', name: 'Doomed Build 1'}),
					new Models.Build({serverId: serverId, serviceBuildId: 'DB2', name: 'Doomed Build 2'})
				];

		Controllers.Projects.onAddProject(project, builds);

		var build = Collections.Builds.findOne({serverId: serverId});
		Collections.MyBuildDisplay.insert({serverId: serverId, buildId: build._id, isDisplayed: true});
	});

	it('should remove all projects, builds and buildDisplay records', function () {
		var projects = Collections.Projects.find({serverId: serverId}).fetch(),
				builds = Collections.Builds.find({serverId: serverId}).fetch(),
				myDisplay = Collections.MyBuildDisplay.find({serverId: serverId}).fetch();

		expect(projects.length).toBe(1);
		expect(builds.length).toBe(2);
		expect(myDisplay.length).toBe(1);

		Controllers.Servers.onDeleteServer(serverId);

		var projects2 = Collections.Projects.find({serverId: serverId}).fetch(),
				builds2 = Collections.Builds.find({serverId: serverId}).fetch(),
				myDisplay2 = Collections.MyBuildDisplay.find({serverId: serverId}).fetch();

		expect(projects2.length).toBe(0);
		expect(builds2.length).toBe(0);
		expect(myDisplay2.length).toBe(0);
	});

});
