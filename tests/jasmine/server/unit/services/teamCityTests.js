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

var tcLast2BuildsFailure = {
	statusCode: 200,
	data: {
		'count': 2,
		'build': [
			{
				'id': 665,
				'buildTypeId': 'MBP_UnitTestAndBundle',
				'number': '193',
				'status': 'FAILURE',
				'state': 'finished',
				'href': '/httpAuth/app/rest/builds/id:665'
			},
			{
				'id': 661,
				'buildTypeId': 'MBP_UnitTestAndBundle',
				'number': '192',
				'status': 'SUCCESS',
				'state': 'finished',
				'href': '/httpAuth/app/rest/builds/id:661'
			}
		]
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

var tcLast1BuildSuccess = {
	statusCode: 200,
	data: {
		'count': 1,
		'build': [
			{
				'id': 665,
				'buildTypeId': 'MBP_UnitTestAndBundle',
				'number': '193',
				'status': 'SUCCESS',
				'state': 'finished',
				'href': '/httpAuth/app/rest/builds/id:665'
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
		'running-info': {
			'percentageComplete': 30,
			'elapsedSeconds': 33,
			'estimatedTotalSeconds': 119,
			'currentStageText': 'Step 1/3: http GET https://registry.npmjs.org/lodash.keys',
			'outdated': false,
			'probablyHanging': false
		},
		'queuedDate': '20150501T212011-0500',
		'startDate': '20150501T212013-0500',
		'triggered': {
			'type': 'user',
			'date': '20150501T212011-0500',
			'user': {
				'username': 'pstuart',
				'name': 'Paul Stuart',
				'id': 1,
				'href': '/httpAuth/app/rest/users/id:1'
			}
		},
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
		},
		'statistics': {
			'href': '/httpAuth/app/rest/builds/id:687/statistics'
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
		'running-info(DONT_KNOW_IF_THIS_WOULD_BE_HERE)': {
			'percentageComplete': 30,
			'elapsedSeconds': 33,
			'estimatedTotalSeconds': 119,
			'currentStageText': 'Step 1/3: http GET https://registry.npmjs.org/lodash.keys',
			'outdated': false,
			'probablyHanging': false
		},
		'queuedDate': '20150501T212011-0500',
		'startDate': '20150501T212013-0500',
		'finishDate': '20150501T213013-0500',
		'triggered': {
			'type': 'user',
			'date': '20150501T212011-0500',
			'user': {
				'username': 'pstuart',
				'name': 'Paul Stuart',
				'id': 1,
				'href': '/httpAuth/app/rest/users/id:1'
			}
		},
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
		},
		'statistics': {
			'href': '/httpAuth/app/rest/builds/id:687/statistics'
		}
	}
};

function _tcDateTimeToDate(datetime) {
	return moment(datetime, 'YYYYMMDDTHHmmssZ').toDate();
}

describe('Services.TeamCity', function () {

	describe('getBuildData', function () {
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
						isRunning: true,
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
						isRunning: true,
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
				isRunning: true,
				href: '/httpAuth/app/rest/builds/id:112427'
			}), new Models.BuildSummary({
				id: 112429,
				serviceBuildId: 'UpdateSite_AmazonWebServices_UpdateAwsMissouri',
				serviceNumber: '141',
				isSuccess: true,
				isRunning: true,
				href: '/httpAuth/app/rest/builds/id:112429'
			})]);
		});
	});

});
