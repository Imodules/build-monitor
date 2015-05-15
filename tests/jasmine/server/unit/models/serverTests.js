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
				'url': 'http://exampserver:90',
				'user': 'pstuart',
				'password': 'YouMe2'
			};

			var server = new Models.Server(jsServer);
			expect(server.toJson()).toEqual(jsServer);
		});
	});

	describe('save()', function () {
		it('should call insert if this is a new server record', function () {
			spyOn(Collections.Servers, 'insert').and.callFake(function () {
				return '_meKnewId_';
			});

			var server = new Models.Server({
				name: 'MyNewServer-Cool',
				type: 'teamcity',
				url: 'http://server.example.com',
				user: 'user99',
				password: 'pass100'
			});
			server.save();

			expect(Collections.Servers.insert).toHaveBeenCalledWith({
				name: 'MyNewServer-Cool',
				type: 'teamcity',
				url: 'http://server.example.com',
				user: 'user99',
				password: 'pass100'
			});
		});

		it('should call update if this server already exists', function () {
			spyOn(Collections.Servers, 'update');
			spyOn(Collections.Servers, 'insert');

			var server = new Models.Server({
				_id: '-coolservid-',
				type: 'teamcity',
				name: 'smeNewName',
				url: 'http://coolurl.example.com',
				user: 'Cool1',
				password: 'SwwetPass'
			});
			server.save();

			expect(Collections.Servers.insert).not.toHaveBeenCalled();
			expect(Collections.Servers.update).toHaveBeenCalledWith({_id: '-coolservid-'}, {
				$set: {
					name: 'smeNewName',
					type: 'teamcity',
					url: 'http://coolurl.example.com',
					user: 'Cool1',
					password: 'SwwetPass'
				}
			});
		});
	});

	describe('refreshProjects()', function () {
		it('should call the service passing Controllers.Projects.onAddProject', function () {
			spyOn(Services.TeamCity.prototype, 'getProjects');

			var server = new Models.Server({_id: 'dd44dddd', type: 'teamcity', url: 'http://url.example.com'});
			server.refreshProjects();

			expect(Services.TeamCity.prototype.getProjects).toHaveBeenCalledWith(jasmine.any(Function));
		});
	});

	describe('toggleBuildDisplay()', function () {
		it('should get the build and call addWatcher', function () {
			spyOn(Controllers.Builds, 'getBuild').and.callFake(function () {
				return new Models.Build({
					'_id': 'BLD-id1',
					'serverId': 'xdafsdasfcdga5r4',
					'projectId': 'MBP',
					'serviceBuildId': 'MBP_UnitTestAndBundle',
					'name': 'Unit Test and Bundle',
					'url': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle',
					'displayCounter': 0,
					'isLastBuildSuccess': true,
					'isBuilding': false
				});
			});

			spyOn(Models.Build.prototype, 'addWatcher');

			var server = new Models.Server({_id: '98494', type: 'teamcity', url: 'http://url.example.com'});
			server.toggleBuildDisplay('bidleid', 'Watcher1', true);

			expect(Controllers.Builds.getBuild).toHaveBeenCalledWith('bidleid');
			expect(Models.Build.prototype.addWatcher).toHaveBeenCalledWith(jasmine.any(Services.TeamCity), 'Watcher1');
		});

		it('should get the build and call removeWatcher', function () {
			spyOn(Controllers.Builds, 'getBuild').and.callFake(function () {
				return new Models.Build({
					'_id': 'BLD-id1',
					'serverId': 'xdafsdasfcdga5r4',
					'projectId': 'MBP',
					'serviceBuildId': 'MBP_UnitTestAndBundle',
					'name': 'Unit Test and Bundle',
					'url': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle',
					'displayCounter': 0,
					'isLastBuildSuccess': true,
					'isBuilding': false
				});
			});

			spyOn(Models.Build.prototype, 'removeWatcher');

			var server = new Models.Server({_id: '98494', type: 'teamcity', url: 'http://url.example.com'});
			server.toggleBuildDisplay('bidleid2', 'Watcher2', false);

			expect(Controllers.Builds.getBuild).toHaveBeenCalledWith('bidleid2');
			expect(Models.Build.prototype.removeWatcher).toHaveBeenCalledWith('Watcher2');
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
						'displayCounter': 1,
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
						'displayCounter': 1,
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

	describe('queryRunningBuilds()', function () {
		it('should call the service to get the running builds and tell the timer it has running builds', function () {
			spyOn(Services.TeamCity.prototype, 'queryRunningBuilds').and.callFake(function (cb) {
				cb([
					new Models.BuildSummary({
						id: 124,
						serviceBuildId: 'MBP_AcceptanceTest',
						serviceBuildNumber: '179',
						isSuccess: true,
						isRunning: true,
						href: '/httpAuth/app/rest/builds/id:124'
					}),
					new Models.BuildSummary({
						id: 123,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceBuildNumber: '160',
						isSuccess: true,
						isRunning: true,
						href: '/httpAuth/app/rest/builds/id:123'
					})
				]);
			});
			spyOn(Controllers.Builds, 'getBuildByServiceId').and.callFake(function () {
				return new Models.Build({});
			});

			spyOn(Models.Build.prototype, 'startBuild');

			var timerSpy = jasmine.createSpy();

			var server = new Models.Server({_id: 'qrb_id1', type: 'teamcity', url: 'http://mewserver/url'});
			server.queryRunningBuilds(timerSpy);

			expect(timerSpy.calls.count()).toBe(1);
			expect(timerSpy).toHaveBeenCalledWith('qrb_id1', true);

			expect(Controllers.Builds.getBuildByServiceId).toHaveBeenCalledWith('qrb_id1', 'MBP_AcceptanceTest');
			expect(Controllers.Builds.getBuildByServiceId).toHaveBeenCalledWith('qrb_id1', 'MBP_UnitTestAndBundle');
			expect(Models.Build.prototype.startBuild).toHaveBeenCalledWith(jasmine.any(Services.TeamCity), '/httpAuth/app/rest/builds/id:124');
			expect(Models.Build.prototype.startBuild).toHaveBeenCalledWith(jasmine.any(Services.TeamCity), '/httpAuth/app/rest/builds/id:123');
		});

		it('should call the service and update the time that it no longer has running builds', function () {
			spyOn(Services.TeamCity.prototype, 'queryRunningBuilds').and.callFake(function (cb) {
				cb([]);
			});
			spyOn(Models.Server.prototype, 'updateRunningBuilds');

			var timerSpy = jasmine.createSpy();

			var server = new Models.Server({_id: 'qrb_id2', type: 'teamcity', url: 'http://mewserver/url'});
			server.queryRunningBuilds(timerSpy);

			expect(Models.Server.prototype.updateRunningBuilds).toHaveBeenCalled();
			expect(timerSpy.calls.count()).toBe(1);
			expect(timerSpy).toHaveBeenCalledWith('qrb_id2', false);
		});

		it('should not start a build for one that is already running', function () {
			spyOn(Services.TeamCity.prototype, 'queryRunningBuilds').and.callFake(function (cb) {
				cb([
					new Models.BuildSummary({
						id: 131,
						serviceBuildId: 'MBP_AcceptanceTest',
						serviceBuildNumber: '1120',
						isSuccess: true,
						isRunning: true,
						href: '/httpAuth/app/rest/builds/id:131'
					}),
					new Models.BuildSummary({
						id: 130,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceBuildNumber: '1121',
						isSuccess: true,
						isRunning: true,
						href: '/httpAuth/app/rest/builds/id:130'
					})
				]);
			});
			spyOn(Controllers.Builds, 'getBuildByServiceId').and.callFake(function () {
				return new Models.Build({_id: '1ThatIsRunning', isBuilding: true});
			});

			spyOn(Models.Build.prototype, 'startBuild');

			var timerSpy = jasmine.createSpy();

			var server = new Models.Server({_id: 'qrb_rid1', type: 'teamcity', url: 'http://mewserver/url'});
			server.queryRunningBuilds(timerSpy);

			expect(timerSpy.calls.count()).toBe(1);
			expect(timerSpy).toHaveBeenCalledWith('qrb_rid1', true);

			expect(Controllers.Builds.getBuildByServiceId).toHaveBeenCalledWith('qrb_rid1', 'MBP_AcceptanceTest');
			expect(Controllers.Builds.getBuildByServiceId).toHaveBeenCalledWith('qrb_rid1', 'MBP_UnitTestAndBundle');
			expect(Models.Build.prototype.startBuild).not.toHaveBeenCalled();
		});
	});

	describe('updateRunningBuilds()', function () {
		it('should query the builds controller for all the running builds, then tell them to update', function () {
			spyOn(Controllers.Builds, 'getRunningServerBuilds').and.callFake(function () {
				return [
					new Models.Build({
						_id: 'build_1', builds: [{
							id: 420,
							serviceBuildId: 'MBP_UTB-1',
							serviceNumber: '112',
							isSuccess: true,
							isRunning: true,
							href: '/httpAuth/app/rest/builds/id:420',
							statusText: 'Just keep swimming...',
							startDate: new Date(2015, 1, 17, 15, 20, 0),
							finishDate: null,
							usernames: ['pstuart183']
						}]
					}),
					new Models.Build({
						_id: 'build_2', builds: [{
							id: 421,
							serviceBuildId: 'MBP_UTB-2',
							serviceNumber: '114',
							isSuccess: true,
							isRunning: false,
							href: '/httpAuth/app/rest/builds/id:421',
							statusText: 'Success',
							startDate: new Date(2015, 11, 27, 15, 20, 0),
							finishDate: new Date(2015, 11, 27, 15, 30, 0),
							usernames: ['pstuart2']
						}]
					})
				];
			});

			spyOn(Models.Build.prototype, 'updateRunningBuild');

			var server = new Models.Server({_id: '_$ServerId$_', url: 'http://niner.example.com', type: 'teamcity'});
			server.updateRunningBuilds();

			expect(Controllers.Builds.getRunningServerBuilds).toHaveBeenCalledWith('_$ServerId$_');
			expect(Models.Build.prototype.updateRunningBuild.calls.count()).toBe(2);
			expect(Models.Build.prototype.updateRunningBuild).toHaveBeenCalledWith(jasmine.any(Services.TeamCity));
		});
	});
});
