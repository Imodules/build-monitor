/**
 * Created by paul on 5/12/15.
 */

'use strict';

describe('refreshProjects', function () {
	var tcProjects,
			server;

	beforeAll(function () {
		tcProjects = JSON.parse(Assets.getText('testData/tcProjects.json'));
	});

	beforeEach(function () {
		spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
			if (s(url).endsWith('/app/rest/projects')) {
				cb(null, tcProjects);
			} else  if(s(url).endsWith('/id:CheckInTriggeredBuilds')) {
				var tcData = JSON.parse(Assets.getText('testData/tcCheckinTriggeredProject.json'));
				cb(null, tcData);
			}
		});

		server = Controllers.Servers.getServerByName('teamcity.test.server');
	});

	it('should call and get the projects from Teamcity and add them to the database', function () {
		Controllers.Servers.onRefreshProjects(server._id);

		// TODO: It is getting the projects but now it needs to get the details for each project.
		//expect(false).toBe(true);
	});
});
