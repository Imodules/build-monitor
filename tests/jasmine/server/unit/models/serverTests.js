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
		it('should call the refreshBuildData for the builds', function () {
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

			spyOn(Models.Build.prototype, 'refreshBuildData');

			var server = new Models.Server({_id: 'kTugGKGRGJJWKDdb6', type: 'teamcity', url: 'http://someting'});
			server.refreshActiveBuildData();

			expect(Controllers.Builds.getActiveServerBuilds).toHaveBeenCalledWith('kTugGKGRGJJWKDdb6');
			expect(Models.Build.prototype.refreshBuildData.calls.count()).toBe(2);
			expect(Models.Build.prototype.refreshBuildData).toHaveBeenCalledWith(jasmine.any(Services.TeamCity));
		});
	});

	describe('refreshBuildData()', function () {
		it('should refreshBuildData for the single build', function () {
			spyOn(Controllers.Builds, 'getBuild').and.callFake(function () {
				return new Models.Build({_id: '_ThisIsMe_', url: '/guestAuth/ThisMEUrl'});
			});

			spyOn(Models.Build.prototype, 'refreshBuildData');

			var server = new Models.Server({_id: 'abddsesdde4444', type: 'teamcity', url: 'http://mewserver/url'});
			server.refreshBuildData('_ThisIsMe_');

			expect(Controllers.Builds.getBuild).toHaveBeenCalledWith('_ThisIsMe_');
			expect(Models.Build.prototype.refreshBuildData).toHaveBeenCalledWith(jasmine.any(Services.TeamCity));
		});
	});

});
