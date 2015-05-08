/**
 * Created by paul on 5/7/15.
 */

'use strict';
describe('Models.Server', function () {
	describe('toJson()', function () {
		it('should return valid json', function () {
			var jsServer = {
				'_id': 'ptZ6su3X5eugNSm4F',
				'name': 'IModules Teamcity',
				'type': 'teamcity',
				'url': 'http://buildserver2:90',
				'user': 'pstuart',
				'password': 'beef8stu'
			};

			var server = new Models.Server(jsServer);
			expect(server.toJson()).toEqual(jsServer);
		});
	});

	describe('refreshActiveBuildData()', function () {
		it('should', function () {
			spyOn(Controllers.Builds, 'getActiveServerBuilds').and.callFake(function () {
				return [
					new Models.Build({
						'_id': 'buildId1',
						'serverId': 'kTugGKGRGJJWKDdb6',
						'projectId': 'MBP',
						'serviceBuildId': 'MBP_UnitTestAndBundle',
						'name': 'Unit Test and Bundle',
						'url': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle',
						'isDisplayed': true,
						'isLastBuildSuccess': true,
						'isBuilding': false
					}),
					new Models.Build({
						'_id': 'buildId2',
						'serverId': 'kTugGKGRGJJWKDdb6',
						'projectId': 'MBP',
						'serviceBuildId': 'MBP_UnitTestAndBundle',
						'name': 'Unit Test and Bundle',
						'url': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle',
						'isDisplayed': true,
						'isLastBuildSuccess': true,
						'isBuilding': false
					})
				];
			});

			spyOn(Models.Build.prototype, 'refreshData');

			var server = new Models.Server({_id: 'kTugGKGRGJJWKDdb6', type: 'teamcity', url: 'http://someting'});
			server.refreshActiveBuildData();

			expect(Controllers.Builds.getActiveServerBuilds).toHaveBeenCalledWith('kTugGKGRGJJWKDdb6');
			expect(Models.Build.prototype.refreshData.calls.count()).toBe(2);
			expect(Models.Build.prototype.refreshData).toHaveBeenCalledWith(jasmine.any(Services.TeamCity));
		});
	});

});
