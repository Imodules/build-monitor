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
		href: '/guestAuth/app/rest/projects/id:_Root'
	}, {
		id: 'MBP',
		name: 'My Brew Planner',
		parentProjectId: '_Root',
		description: 'This is the main project for My Brew Planner',
		href: '/guestAuth/app/rest/projects/id:MBP'
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
		parentProject: {
			id: '_Root',
			name: '<Root project>',
			description: 'Contains all other projects',
			href: '/httpAuth/app/rest/projects/id:_Root'
		},
		buildTypes: {
			count: 2, buildType: [{
				id: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				description: 'Run the acceptance tests',
				projectName: 'My Brew Planner',
				projectId: 'MBP',
				href: '/httpAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			},
				{
					id: 'MBP_UnitTestAndBundle',
					name: 'Unit Test and Bundle',
					description: 'Runs the velocity unit tests then bundles the package.',
					projectName: 'My Brew Planner',
					projectId: 'MBP',
					href: '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
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
			href: '/httpAuth/app/rest/builds/id:112427'
		}]
	}
};

var tcLast2BuildsFailure = {
	statusCode: 200,
	data: {
		"count": 2,
		"build": [
			{
				"id": 665,
				"buildTypeId": "MBP_UnitTestAndBundle",
				"number": "193",
				"status": "FAILURE",
				"state": "finished",
				"href": "/httpAuth/app/rest/builds/id:665"
			},
			{
				"id": 661,
				"buildTypeId": "MBP_UnitTestAndBundle",
				"number": "192",
				"status": "SUCCESS",
				"state": "finished",
				"href": "/httpAuth/app/rest/builds/id:661"
			}
		]
	}
};

var tcLast2BuildsRunningAndFailure = {
	statusCode: 200,
	data: {
		"count": 2,
		"build": [
			{
				"id": 665,
				"buildTypeId": "MBP_UnitTestAndBundle",
				"number": "193",
				"status": "SUCCESS",
				"state": "running",
				"href": "/httpAuth/app/rest/builds/id:665"
			},
			{
				"id": 661,
				"buildTypeId": "MBP_UnitTestAndBundle",
				"number": "192",
				"status": "FAILURE",
				"state": "finished",
				"href": "/httpAuth/app/rest/builds/id:661"
			}
		]
	}
};

var tcLast1BuildSuccess = {
	statusCode: 200,
	data: {
		"count": 1,
		"build": [
			{
				"id": 665,
				"buildTypeId": "MBP_UnitTestAndBundle",
				"number": "193",
				"status": "SUCCESS",
				"state": "finished",
				"href": "/httpAuth/app/rest/builds/id:665"
			}
		]
	}
};

var tcRunningBuildDetail = {
	statusCode: 200,
	data: {
		"id": 687,
		"buildTypeId": "MBP_UnitTestAndBundle",
		"number": "204",
		"status": "SUCCESS",
		"state": "running",
		"running": true,
		"percentageComplete": 30,
		"href": "/httpAuth/app/rest/builds/id:687",
		"statusText": "Step 1/3",
		"buildType": {
			"id": "MBP_UnitTestAndBundle",
			"name": "Unit Test and Bundle",
			"description": "Runs the velocity unit tests then bundles the package.",
			"projectName": "My Brew Planner",
			"projectId": "MBP",
			"href": "/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle"
		},
		"running-info": {
			"percentageComplete": 30,
			"elapsedSeconds": 33,
			"estimatedTotalSeconds": 119,
			"currentStageText": "Step 1/3: http GET https://registry.npmjs.org/lodash.keys",
			"outdated": false,
			"probablyHanging": false
		},
		"queuedDate": "20150501T212011-0500",
		"startDate": "20150501T212013-0500",
		"triggered": {
			"type": "user",
			"date": "20150501T212011-0500",
			"user": {
				"username": "pstuart",
				"name": "Paul Stuart",
				"id": 1,
				"href": "/httpAuth/app/rest/users/id:1"
			}
		},
		"lastChanges": {
			"count": 1,
			"change": [
				{
					"id": 207,
					"version": "5f027107650bc25a6a01c924fb6fd0ab09dce567",
					"username": "pstuart2",
					"date": "20150422T223606-0500",
					"href": "/httpAuth/app/rest/changes/id:207"
				}
			]
		},
		"statistics": {
			"href": "/httpAuth/app/rest/builds/id:687/statistics"
		}
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
		it('should update the BuildTypes collection with the running builds', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuilds);
			});
			spyOn(Controllers.Builds, 'onStartBuild');
			spyOn(Collections.Builds, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [];
					}
				}
			});

			var runningBuildCallback = jasmine.createSpy('spy');

			var tc = new Services.TeamCity({
				_id: 'srvId2',
				url: 'http://example.com/bs'
			});

			tc.queryRunningBuilds(runningBuildCallback);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/builds?locator=running:true', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(runningBuildCallback.calls.count()).toBe(1);
			expect(runningBuildCallback.calls.allArgs()).toEqual([['srvId2', true]]);

			expect(Controllers.Builds.onStartBuild).toHaveBeenCalledWith('srvId2', 'UpdateSite_AmazonWebServices_UpdateAwsMissouri', {
				json: {
					id: 112427,
					number: '131',
					isSuccess: true,
					isBuilding: true,
					href: '/httpAuth/app/rest/builds/id:112427'
				}
			}, 3);
		});

		it('should not re-update builds that it has already started', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuilds);
			});
			spyOn(Controllers.Builds, 'onGetActiveServerBuilds').and.callFake(function () {
				return [
					{serviceBuildId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri'}
				];
			});
			spyOn(Controllers.Builds, 'onStartBuild');
			var runningBuildCallback = jasmine.createSpy('spy');

			var tc = new Services.TeamCity({
				_id: 'srvId2',
				url: 'http://example.com/bs'
			});

			tc.queryRunningBuilds(runningBuildCallback);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/builds?locator=running:true', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(runningBuildCallback.calls.count()).toBe(1);
			expect(runningBuildCallback.calls.allArgs()).toEqual([['srvId2', true]]);
			expect(Controllers.Builds.onGetActiveServerBuilds).toHaveBeenCalledWith('srvId2');
			expect(Controllers.Builds.onStartBuild).not.toHaveBeenCalled();
		});

		it('sound call the callback with false if no running builds are returned', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, {data: {count: 0}});
			});
			spyOn(Collections.Builds, 'find');

			var runningBuildCallback = jasmine.createSpy('spy');

			var tc = new Services.TeamCity({
				_id: 'srvId3',
				url: 'http://example.com/bs'
			});

			tc.queryRunningBuilds(runningBuildCallback);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/builds?locator=running:true', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(runningBuildCallback.calls.count()).toBe(1);
			expect(runningBuildCallback.calls.allArgs()).toEqual([['srvId3', false]]);
			expect(Collections.Builds.find).not.toHaveBeenCalled();
		});
	});

	describe('refreshBuildHistory()', function () {
		it('should get the last 2 builds, successful running and failed complete and update the build status to failure', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcLast2BuildsRunningAndFailure);
			});

			spyOn(Controllers.Builds, 'onUpdateBuildHistory');

			var tc = new Services.TeamCity({
				_id: 'srvId3',
				url: 'http://example.com/bs3'
			});
			tc.refreshBuildHistory('MBP_UnitTestAndBundle', 2);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs3/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle/builds?locator=running:any&count=2', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(Controllers.Builds.onUpdateBuildHistory).toHaveBeenCalledWith(
					'srvId3', 'MBP_UnitTestAndBundle', false, true, [{
						json: {
							id: 665,
							number: '193',
							isSuccess: true,
							isBuilding: true,
							href: '/httpAuth/app/rest/builds/id:665'
						}
					}, {
						json: {
							id: 661,
							number: '192',
							isSuccess: false,
							isBuilding: false,
							href: '/httpAuth/app/rest/builds/id:661'
						}
					}]
			);
		});

		it('should get the last 2 builds and update the build status to success', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcLast1BuildSuccess);
			});

			spyOn(Controllers.Builds, 'onUpdateBuildHistory');

			var tc = new Services.TeamCity({
				_id: 'srvId3',
				url: 'http://example.com/bs3'
			});
			tc.refreshBuildHistory('MBP_UnitTestAndBundle', 2);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs3/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle/builds?locator=running:any&count=2', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(Controllers.Builds.onUpdateBuildHistory).toHaveBeenCalledWith(
					'srvId3', 'MBP_UnitTestAndBundle', true, false, [{
						json: {
							id: 665,
							number: '193',
							isSuccess: true,
							isBuilding: false,
							href: '/httpAuth/app/rest/builds/id:665'
						}
					}]
			);
		});

		it('should get the last X builds and update the build status to failure', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcLast2BuildsFailure);
			});

			spyOn(Controllers.Builds, 'onUpdateBuildHistory');

			var tc = new Services.TeamCity({
				_id: 'srvId3',
				url: 'http://example.com/bs3'
			});
			tc.refreshBuildHistory('MBP_UnitTestAndBundle', 2);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs3/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle/builds?locator=running:any&count=2', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(Controllers.Builds.onUpdateBuildHistory).toHaveBeenCalledWith(
					'srvId3', 'MBP_UnitTestAndBundle', false, false, [{
						json: {
							id: 665,
							number: '193',
							isSuccess: false,
							isBuilding: false,
							href: '/httpAuth/app/rest/builds/id:665'
						}
					}, {
						json: {
							id: 661,
							number: '192',
							isSuccess: true,
							isBuilding: false,
							href: '/httpAuth/app/rest/builds/id:661'
						}
					}]);
		});
	});

	describe('getCurrentBuildStatus()', function () {
		it('should get the running build detailed information and call the callback', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuildDetail);
			});

			spyOn(Collections.Builds, 'update');

			var cbSpy = jasmine.createSpy('spy');

			var tc = new Services.TeamCity({
				_id: 'srvId3',
				url: 'http://example.com/severserver'
			});

			tc.getCurrentBuildStatus({
				_id: 'MyBuildId',
				currentBuild: {href: '/build/server/detailed/stuff/id:113'},
				isLastBuildSuccess: true
			}, cbSpy);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/severserver/guestAuth/build/server/detailed/stuff/id:113', {
				timeOut: 30000,
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(cbSpy).toHaveBeenCalledWith('MyBuildId', '/build/server/detailed/stuff/id:113', true, true, true, 30, 'Step 1/3');
		});
	});
});
