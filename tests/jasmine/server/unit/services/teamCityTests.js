/**
 * Created by paul on 4/26/15.
 */

'use strict';
//region Test Data
var tcProjects = {
	statusCode: 200,
	data: {
		count: 3,
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
		}, {
			id: 'MBP-2',
			name: 'My Brew Planner-2',
			parentProjectId: 'MBP',
			description: 'Just a sub',
			href: '/guestAuth/app/rest/projects/id:MBP-2'
		}]
	}
};

var tcProject = {
	statusCode: 200,
	data: {
		id: 'MBP',
		name: 'My Brew Planner',
		parentProjectId: '_Root',
		href: '/guestAuth/app/rest/projects/id:MBP',
		buildTypes: {
			count: 2, buildType: [{
				id: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				description: 'Run the acceptance tests',
				projectName: 'My Brew Planner',
				projectId: 'MBP',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			},
				{
					id: 'MBP_UnitTestAndBundle',
					name: 'Unit Test and Bundle',
					description: 'Runs the velocity unit tests then bundles the package.',
					projectName: 'My Brew Planner',
					projectId: 'MBP',
					href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
				}]
		},
		projects: {count: 0}
	}
};

var tcRunningBuilds = {
	statusCode: 200,
	data: {
		count: 2,
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
		}, {
			id: 112429,
			buildTypeId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri',
			number: '141',
			status: 'SUCCESS',
			state: 'running',
			running: true,
			percentageComplete: 5,
			href: '/httpAuth/app/rest/builds/id:112429'
		}]
	}
};

var tcLast2BuildsRunningAndFailure = {
	statusCode: 200,
	data: {
		'count': 2,
		'build': [
			{
				'id': 665,
				'buildTypeId': 'MBP_UnitTestAndBundle',
				'number': '193',
				'status': 'SUCCESS',
				'state': 'running',
				'href': '/httpAuth/app/rest/builds/id:665'
			},
			{
				'id': 661,
				'buildTypeId': 'MBP_UnitTestAndBundle',
				'number': '192',
				'status': 'FAILURE',
				'state': 'finished',
				'href': '/httpAuth/app/rest/builds/id:661'
			}
		]
	}
};

var tcRunningBuildDetail = {
	statusCode: 200,
	data: {
		'id': 687,
		'buildTypeId': 'MBP_UnitTestAndBundle',
		'number': '204',
		'status': 'SUCCESS',
		'state': 'running',
		'running': true,
		'percentageComplete': 30,
		'href': '/httpAuth/app/rest/builds/id:687',
		'statusText': 'Step 1/3',
		'buildType': {
			'id': 'MBP_UnitTestAndBundle',
			'name': 'Unit Test and Bundle',
			'description': 'Runs the velocity unit tests then bundles the package.',
			'projectName': 'My Brew Planner',
			'projectId': 'MBP',
			'href': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
		},
		'queuedDate': '20150501T212011-0500',
		'startDate': '20150501T212013-0500',
		'lastChanges': {
			'count': 1,
			'change': [
				{
					'id': 207,
					'version': '5f027107650bc25a6a01c924fb6fd0ab09dce567',
					'username': 'pstuart2',
					'date': '20150422T223606-0500',
					'href': '/httpAuth/app/rest/changes/id:207'
				}
			]
		}
	}
};

var tcFinishedBuildDetail = {
	statusCode: 200,
	data: {
		'id': 687,
		'buildTypeId': 'MBP_UnitTestAndBundle',
		'number': '204',
		'status': 'SUCCESS',
		'state': 'finished',
		'running': true,
		'percentageComplete': 30,
		'href': '/httpAuth/app/rest/builds/id:687',
		'statusText': 'Step 1/3',
		'buildType': {
			'id': 'MBP_UnitTestAndBundle',
			'name': 'Unit Test and Bundle',
			'description': 'Runs the velocity unit tests then bundles the package.',
			'projectName': 'My Brew Planner',
			'projectId': 'MBP',
			'href': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
		},
		'queuedDate': '20150501T212011-0500',
		'startDate': '20150501T212013-0500',
		'finishDate': '20150501T213013-0500',
		'lastChanges': {
			'count': 1,
			'change': [
				{
					'id': 207,
					'version': '5f027107650bc25a6a01c924fb6fd0ab09dce567',
					'username': 'pstuart2',
					'date': '20150422T223606-0500',
					'href': '/httpAuth/app/rest/changes/id:207'
				}
			]
		}
	}
};

var tcManualBuildTrigger = {
			'statusCode': 200,
			'data': {
				'id': 113364,
				'buildTypeId': 'UpdateSite_AmazonWebServices_UpdateAwsUx',
				'number': '122',
				'status': 'SUCCESS',
				'state': 'running',
				'running': true,
				'percentageComplete': 18,
				'href': '/guestAuth/app/rest/builds/id:113364',
				'webUrl': 'http://bs.example.com/viewLog.html?buildId=113364&buildTypeId=UpdateSite_AmazonWebServices_UpdateAwsUx',
				'statusText': 'Resolving artifact dependencies',
				'queuedDate': '20150518T081603-0500',
				'startDate': '20150518T081604-0500',
				'triggered': {
					'type': 'user',
					'date': '20150518T081603-0500',
					'user': {
						'username': 'lfast',
						'name': 'Luke Fast',
						'id': 5,
						'href': '/guestAuth/app/rest/users/id:5'
					}
				},
				'lastChanges': {},
				'changes': {
					'href': '/guestAuth/app/rest/changes?locator=build:(id:113364)'
				}
			}
		};
//endregion

function _tcDateTimeToDate(datetime) {
	if (!datetime) {
		return null;
	}
	return moment(datetime, 'YYYYMMDDTHHmmssZ').toDate();
}

describe('Services.TeamCity', function () {

	describe('getBuildData()', function () {
		it('should get the data for the build and callback with the build history objects', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if (url.indexOf('/builds?count=') > 0) {
					cb(null, tcLast2BuildsRunningAndFailure);
				} else {
					cb(null, tcFinishedBuildDetail);
				}
			});

			var cbSpy = jasmine.createSpy('spy'),
					responseData = new Models.BuildDetail({
						id: 687,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '204',
						isSuccess: true,
						isBuilding: true,
						href: '/httpAuth/app/rest/builds/id:687',
						percentageComplete: 30,
						statusText: 'Step 1/3',
						startDate: new Date('Fri May 01 2015 21:20:13 GMT-0500 (CDT)'),
						finishDate: new Date('Fri May 01 2015 21:30:13 GMT-0500 (CDT)'),
						usernames: ['pstuart2']
					});

			var tc = new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDataTest'
			});
			tc.getBuildData('/guestAuth/app/rest/buildTypes/id:SomeProjectBuildIdThing', 10, cbSpy);

			expect(HTTP.get.calls.count()).toBe(3);
			expect(cbSpy.calls.count()).toBe(1);
			expect(cbSpy).toHaveBeenCalledWith([responseData, responseData]);
		});
	});

	describe('getBuildDetails()', function () {
		it('should get the data for the build and callback with the build history object', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuildDetail);
			});

			var cbSpy = jasmine.createSpy('spy'),
					responseData = new Models.BuildDetail({
						id: 687,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '204',
						isSuccess: true,
						isBuilding: true,
						href: '/httpAuth/app/rest/builds/id:687',
						percentageComplete: 30,
						statusText: 'Step 1/3',
						startDate: _tcDateTimeToDate(tcRunningBuildDetail.data.startDate),
						finishDate: _tcDateTimeToDate(tcRunningBuildDetail.data.finishDate),
						usernames: ['pstuart2']
					});

			var tc = new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDetails'
			});
			tc.getBuildDetails('/guestAuth/app/rest/buildTypes/id:SomeProjectBuildIdThing', cbSpy);

			expect(HTTP.get.calls.count()).toBe(1);
			expect(cbSpy.calls.count()).toBe(1);
			expect(cbSpy).toHaveBeenCalledWith(responseData);
		});

		it('should get the user from a manually triggered build', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcManualBuildTrigger);
			});

			var cbSpy = jasmine.createSpy('spy'),
					responseData = new Models.BuildDetail({
						id: 113364,
						serviceBuildId: 'UpdateSite_AmazonWebServices_UpdateAwsUx',
						serviceNumber: '122',
						isSuccess: true,
						isBuilding: true,
						href: '/guestAuth/app/rest/builds/id:113364',
						percentageComplete: 18,
						statusText: 'Resolving artifact dependencies',
						startDate: _tcDateTimeToDate(tcManualBuildTrigger.data.startDate),
						finishDate: _tcDateTimeToDate(tcManualBuildTrigger.data.finishDate),
						usernames: ['lfast']
					});

			var tc = new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDetails'
			});
			tc.getBuildDetails('/guestAuth/app/rest/buildTypes/id:SomeProjectBuildIdThing', cbSpy);

			expect(HTTP.get.calls.count()).toBe(1);
			expect(cbSpy.calls.count()).toBe(1);
			expect(cbSpy).toHaveBeenCalledWith(responseData);
		});
	});

	describe('queryRunningBuilds()', function () {
		it('should get the running builds for the server and pass a buildSummary array to the callback', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, tcRunningBuilds);
			});

			var cbSpy = jasmine.createSpy('spy');
			var tc = new Services.TeamCity({
				_id: '_getRunningTest_',
				url: 'http://example.com/running'
			});
			tc.queryRunningBuilds(cbSpy);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/running/guestAuth/app/rest/builds?locator=running:true', {
				timeOut: 30000,
				headers: {Accept: 'application/json'}
			}, jasmine.any(Function));

			expect(cbSpy.calls.count()).toBe(1);
			expect(cbSpy).toHaveBeenCalledWith([new Models.BuildSummary({
				id: 112427,
				serviceBuildId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri',
				serviceNumber: '131',
				isSuccess: true,
				isBuilding: true,
				href: '/httpAuth/app/rest/builds/id:112427'
			}), new Models.BuildSummary({
				id: 112429,
				serviceBuildId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri',
				serviceNumber: '141',
				isSuccess: true,
				isBuilding: true,
				href: '/httpAuth/app/rest/builds/id:112429'
			})]);
		});
	});

	describe('getProjects()', function () {
		it('should call the api and pass a new Models.Project and its builds to the callback', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				if (url.indexOf('app/rest/projects/id:') > 0) {
					cb(null, tcProject);
				} else {
					cb(null, tcProjects);
				}

			});
			var cbSpy = jasmine.createSpy('projectSpy');

			var tc = new Services.TeamCity({
				_id: '_getPRojectsTest_',
				url: 'http://example.com/getProjects'
			});
			tc.getProjects(cbSpy);

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/getProjects/guestAuth/app/rest/projects', {
				timeOut: 30000,
				headers: {Accept: 'application/json'}
			}, jasmine.any(Function));

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/getProjects/guestAuth/app/rest/projects/id:MBP', {
				timeOut: 30000,
				headers: {Accept: 'application/json'}
			}, jasmine.any(Function));

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/getProjects/guestAuth/app/rest/projects/id:MBP-2', {
				timeOut: 30000,
				headers: {Accept: 'application/json'}
			}, jasmine.any(Function));

			expect(cbSpy.calls.count()).toBe(2);
			expect(cbSpy).toHaveBeenCalledWith(new Models.Project({
				serverId: '_getPRojectsTest_',
				serviceProjectId: 'MBP',
				serviceParentProjectId: null,
				name: 'My Brew Planner',
				href: '/guestAuth/app/rest/projects/id:MBP'
			}), [new Models.Build({
				serverId: '_getPRojectsTest_',
				serviceProjectId: 'MBP',
				serviceBuildId: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			}), new Models.Build({
				serverId: '_getPRojectsTest_',
				serviceProjectId: 'MBP',
				serviceBuildId: 'MBP_UnitTestAndBundle',
				name: 'Unit Test and Bundle',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
			})]);

			expect(cbSpy).toHaveBeenCalledWith(new Models.Project({
				serverId: '_getPRojectsTest_',
				serviceProjectId: 'MBP',
				serviceParentProjectId: null,
				name: 'My Brew Planner',
				href: '/guestAuth/app/rest/projects/id:MBP'
			}), [new Models.Build({
				serverId: '_getPRojectsTest_',
				serviceProjectId: 'MBP',
				serviceBuildId: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			}), new Models.Build({
				serverId: '_getPRojectsTest_',
				serviceProjectId: 'MBP',
				serviceBuildId: 'MBP_UnitTestAndBundle',
				name: 'Unit Test and Bundle',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
			})]);
		});
	});

});
