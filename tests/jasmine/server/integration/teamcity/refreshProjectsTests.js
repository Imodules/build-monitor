/**
 * Created by paul on 5/12/15.
 */

'use strict';

describe('refreshProjects', function () {
	var tcProjects,
			tcCheckinTriggeredBuilds,
			tcDeploymentBuilds,
			tcUpdateSite,
			tcUpdateSite_AmazonWebServices,
			tcUpdateSite_AmazonWebServices_UpdatePwsEmailGateway,
			server;

	beforeAll(function () {
		tcProjects = JSON.parse(Assets.getText('testData/tcProjects.json'));
		tcCheckinTriggeredBuilds = JSON.parse(Assets.getText('testData/projects/tcCheckinTriggered.json'));
		tcDeploymentBuilds = JSON.parse(Assets.getText('testData/projects/tcDeploymentBuilds.json'));
		tcUpdateSite = JSON.parse(Assets.getText('testData/projects/tcUpdateSite.json'));
		tcUpdateSite_AmazonWebServices = JSON.parse(Assets.getText('testData/projects/tcUpdateSite_AmazonWebServices.json'));
		tcUpdateSite_AmazonWebServices_UpdatePwsEmailGateway = JSON.parse(Assets.getText('testData/projects/tcUpdateSite_AmazonWebServices_UpdatePwsEmailGateway.json'));
	});

	beforeEach(function () {
		spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
			if (s(url).endsWith('/app/rest/projects')) {
				cb(null, tcProjects);
			} else  if(s(url).endsWith('/id:CheckInTriggeredBuilds')) {
				cb(null, tcCheckinTriggeredBuilds);
			} else if (s(url).endsWith('/id:DeploymentBuilds')) {
				cb(null, tcDeploymentBuilds);
			} else if (s(url).endsWith('/id:UpdateSite')) {
				cb(null, tcUpdateSite);
			} else if (s(url).endsWith('/id:UpdateSite_AmazonWebServices')) {
				cb(null, tcUpdateSite_AmazonWebServices);
			} else if (s(url).endsWith('/id:UpdateSite_AmazonWebServices_UpdatePwsEmailGateway')) {
				cb(null, tcUpdateSite_AmazonWebServices_UpdatePwsEmailGateway);
			}
		});

		server = Controllers.Servers.getServerByName('teamcity.test.server');
	});

	function runTests() {
		var projects = Controllers.Projects.getAllByServerId(server._id);
		expect(projects.count()).toBe(5);

		var DeploymentBuilds = Controllers.Projects.getByServiceProjectId(server._id, 'DeploymentBuilds'),
				UpdateSite  = Controllers.Projects.getByServiceProjectId(server._id, 'UpdateSite'),
				UpdateSite_AmazonWebServices  = Controllers.Projects.getByServiceProjectId(server._id, 'UpdateSite_AmazonWebServices'),
				UpdateSite_AmazonWebServices_UpdatePwsEmailGateway  = Controllers.Projects.getByServiceProjectId(server._id, 'UpdateSite_AmazonWebServices_UpdatePwsEmailGateway');

		expect(UpdateSite.parentId).toBe(null);
		expect(UpdateSite_AmazonWebServices.parentId).toBe(UpdateSite._id);
		expect(UpdateSite_AmazonWebServices_UpdatePwsEmailGateway.parentId).toBe(UpdateSite_AmazonWebServices._id);

		expect(DeploymentBuilds.serverId).toBe(server._id);
		expect(DeploymentBuilds.serviceProjectId).toBe('DeploymentBuilds');
		expect(DeploymentBuilds.serviceParentProjectId).toBe(null);
		expect(DeploymentBuilds.name).toBe('Deployment Builds');
		expect(DeploymentBuilds.href).toContain('/app/rest/projects/id:DeploymentBuilds');

		expect(UpdateSite.serverId).toBe(server._id);
		expect(UpdateSite.serviceParentProjectId).toBe(null);
		expect(UpdateSite.href).toContain('/app/rest/projects/id:UpdateSite');

		expect(UpdateSite_AmazonWebServices.serviceParentProjectId).toBe('UpdateSite');
		expect(UpdateSite_AmazonWebServices.href).toContain('/app/rest/projects/id:UpdateSite_AmazonWebServices');

		expect(UpdateSite_AmazonWebServices_UpdatePwsEmailGateway.serviceParentProjectId).toBe('UpdateSite_AmazonWebServices');

		var usPwsBuilds = Controllers.Builds.getAllByProjectId(UpdateSite_AmazonWebServices_UpdatePwsEmailGateway._id);
		expect(usPwsBuilds.count()).toBe(0);

		var usBuilds = Controllers.Builds.getAllByProjectId(UpdateSite._id);
		expect(usBuilds.count()).toBe(0);

		var usAwsBuilds = Controllers.Builds.getAllByProjectId(UpdateSite_AmazonWebServices._id);
		expect(usAwsBuilds.count()).toBe(16);

		var arrUsAwsBuilds = usAwsBuilds.fetch();
		arrUsAwsBuilds.forEach(function (build) {
			expect(build.serverId).toBe(server._id);
			expect(build.watchers.length).toBe(0);
			expect(build.isDisplayed).toBe(false);
			expect(build.isLastBuildSuccess).toBe(true);
			expect(build.isBuilding).toBeFalsy();

			if (build.serviceBuildId === 'UpdateSite_AmazonWebServices_UpdateAwsMissouri') {
				expect(build.name).toBe('Update AWS Missouri - EM API');
				expect(build.href).toContain('/app/rest/buildTypes/id:UpdateSite_AmazonWebServices_UpdateAwsMissouri');
			} else if (build.serviceBuildId === 'UpdateSite_AmazonWebServices_UpdateAwsCurrentWork') {
				expect(build.name).toBe('Update AWS Current Work - 53.9');
				expect(build.href).toContain('/app/rest/buildTypes/id:UpdateSite_AmazonWebServices_UpdateAwsCurrentWork');
			}
		});
	}

	it('should call and get the projects from Teamcity and add them to the database with their builds', function () {
		Controllers.Servers.onRefreshProjects(server._id);

		runTests();
	});

	it('should not change the values of the projects or builds when called a second time', function () {
		Controllers.Servers.onRefreshProjects(server._id);

		runTests();
	});
});
