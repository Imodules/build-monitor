/**
 * Created by paul on 4/26/15.
 */

'use strict';
var tcProjects = {
	count: 2,
	href: '/guestAuth/app/rest/projects',
	project: [{
		id: '_Root',
		name: '<Root project>',
		description: 'Contains all other projects',
		href: '/guestAuth/app/rest/projects/id:_Root',
		webUrl: 'http://mbp-build.no-ip.org:8111/project.html?projectId=_Root'
	}, {
		id: 'MBP',
		name: 'My Brew Planner',
		parentProjectId: '_Root',
		description: 'This is the main project for My Brew Planner',
		href: '/guestAuth/app/rest/projects/id:MBP',
		webUrl: 'http://mbp-build.no-ip.org:8111/project.html?projectId=MBP'
	}]
};

var tcProject = {
	statusCode: 200,
	data: {
		id: 'MBP',
		name: 'My Brew Planner',
		parentProjectId: '_Root',
		description: 'This is the main project for My Brew Planner',
		href: '/httpAuth/app/rest/projects/id:MBP',
		webUrl: 'http://mbp-build.no-ip.org:8111/project.html?projectId=MBP',
		parentProject: {
			id: '_Root',
			name: '<Root project>',
			description: 'Contains all other projects',
			href: '/httpAuth/app/rest/projects/id:_Root',
			webUrl: 'http://mbp-build.no-ip.org:8111/project.html?projectId=_Root'
		},
		buildTypes: {
			count: 2, buildType: [{
				id: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				description: 'Run the acceptance tests',
				projectName: 'My Brew Planner',
				projectId: 'MBP',
				href: '/httpAuth/app/rest/buildTypes/id:MBP_AcceptanceTest',
				webUrl: 'http://mbp-build.no-ip.org:8111/viewType.html?buildTypeId=MBP_AcceptanceTest'
			},
				{
					id: 'MBP_UnitTestAndBundle',
					name: 'Unit Test and Bundle',
					description: 'Runs the velocity unit tests then bundles the package.',
					projectName: 'My Brew Planner',
					projectId: 'MBP',
					href: '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle',
					webUrl: 'http://mbp-build.no-ip.org:8111/viewType.html?buildTypeId=MBP_UnitTestAndBundle'
				}]
		},
		templates: {count: 0, buildType: []},
		parameters: {
			count: 3,
			href: '/app/rest/projects/id:MBP/parameters',
			property: [Object]
		},
		vcsRoots: {
			count: 1,
			href: '/httpAuth/app/rest/vcs-roots?locator=project:(id:MBP)'
		},
		projects: {count: 0}
	}
};

var tcRunningBuilds = {
	statusCode: 200,
	data: {
		count: 1,
		href: '/httpAuth/app/rest/builds?locator=running:true',
		build: [{
			id: 112427,
			buildTypeId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri',
			number: '131',
			status: 'SUCCESS',
			state: 'running',
			running: true,
			percentageComplete: 3,
			href: '/httpAuth/app/rest/builds/id:112427',
			webUrl: 'http://buildserver2:90/viewLog.html?buildId=112427&buildTypeId=UpdateSite_AmazonWebServices_UpdateAwsMissouri'
		}]
	}
};

describe('Services.TeamCity', function () {
	describe('refreshFromServer()', function () {
		it('should call HTTP.get', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if (url.indexOf('id:MBP') >= 0) {
					cb(null, tcProject);
				} else {
					cb(null, {
						statusCode: 200,
						data: tcProjects
					});
				}
			});

			var addProjectSpy = jasmine.createSpy('spy'),
					addBuildTypeSpy = jasmine.createSpy('spy');

			var tc = new Services.TeamCity({
				_id: 'srvId',
				url: 'http://example.com/bs'
			});

			tc.refreshFromServer(addProjectSpy, addBuildTypeSpy);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/projects', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/projects/id:MBP', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(HTTP.get).not.toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/projects/id:_Root',
					jasmine.any(Object), jasmine.any(Function));

			expect(addProjectSpy.calls.count()).toBe(1);
			expect(addProjectSpy.calls.allArgs()).toEqual([['srvId', null, 'MBP', 'My Brew Planner', '/guestAuth/app/rest/projects/id:MBP']]);

			expect(addBuildTypeSpy.calls.count()).toBe(2);
			expect(addBuildTypeSpy.calls.allArgs()).toEqual([
				['srvId', 'MBP', 'MBP_AcceptanceTest', 'Acceptance Test', '/httpAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'],
				['srvId', 'MBP', 'MBP_UnitTestAndBundle', 'Unit Test and Bundle', '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle']
			]);
		});
	});

	describe('queryRunningBuilds()', function () {
		it('should update the BuildTypes colleciton with the running builds', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuilds);
			});
			spyOn(Collections.BuildTypes, 'update');
			spyOn(Collections.BuildTypes, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [];
					}
				}
			});

			var tc = new Services.TeamCity({
				_id: 'srvId2',
				url: 'http://example.com/bs'
			});

			tc.queryRunningBuilds();

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/builds?locator=running:true', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(Collections.BuildTypes.update).toHaveBeenCalledWith({serverId: 'srvId2', buildTypeId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri'},
					{$set: {isBuilding: true, currentBuildHref: '/httpAuth/app/rest/builds/id:112427'}}, {multi: false});
		});

		it('should not re-update builds that it has already started', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuilds);
			});
			spyOn(Collections.BuildTypes, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [
							{buildTypeId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri'}
						];
					}
				}
			});
			spyOn(Collections.BuildTypes, 'update');

			var tc = new Services.TeamCity({
				_id: 'srvId2',
				url: 'http://example.com/bs'
			});

			tc.queryRunningBuilds();

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/builds?locator=running:true', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(Collections.BuildTypes.find).toHaveBeenCalledWith(
					{serverId: 'srvId2', isBuilding: true}, {fields: {buildTypeId: 1}}
			);
			expect(Collections.BuildTypes.update).not.toHaveBeenCalled();
		});
	});
});
