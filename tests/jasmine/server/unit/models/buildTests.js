/**
 * Created by paul on 5/7/15.
 */

'use strict';
describe('Models.Build', function () {
	describe('refreshBuildData()', function () {
		it('should do something and return true', function () {
			var responseData = new Models.BuildDetail({
						id: 687,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '204',
						isSuccess: true,
						isRunning: false,
						href: '/httpAuth/app/rest/builds/id:687',
						statusText: 'Step 1/3',
						startDate: new Date('Fri May 01 2015 21:20:13 GMT-0500 (CDT)'),
						finishDate: new Date('Fri May 01 2015 21:30:13 GMT-0500 (CDT)'),
						usernames: ['pstuart2']
					}),
					dbData = [responseData.toJson(), responseData.toJson()];

			spyOn(Services.TeamCity.prototype, 'getBuildData').and.callFake(function (href, historyCount, cb) {
				cb([responseData, responseData]);
			});

			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_SomeBuildId_', href: '/guestAuth/someid'});
			build.refreshBuildData(new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDataTest'
			}));

			expect(Services.TeamCity.prototype.getBuildData.calls.count()).toBe(1);
			expect(Services.TeamCity.prototype.getBuildData).toHaveBeenCalledWith('/guestAuth/someid', 10, jasmine.any(Function));

			expect(Collections.Builds.update.calls.count()).toBe(1);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_SomeBuildId_'},
					{$set: {isLastBuildSuccess: true, builds: dbData}}
			);
		});

		it('should update isLastBuildSuccess to false if the last build has failed', function () {
			var responseData0 = new Models.BuildDetail({
						id: 687,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '204',
						isSuccess: false,
						isRunning: false,
						href: '/httpAuth/app/rest/builds/id:687',
						statusText: 'Step 1/3',
						startDate: new Date('Fri May 01 2015 21:20:13 GMT-0500 (CDT)'),
						finishDate: new Date('Fri May 01 2015 21:30:13 GMT-0500 (CDT)'),
						usernames: ['pstuart2']
					}),
					responseData1 = new Models.BuildDetail({
						id: 686,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '203',
						isSuccess: true,
						isRunning: false,
						href: '/httpAuth/app/rest/builds/id:687',
						statusText: 'Step 1/3',
						startDate: new Date('Fri May 01 2015 21:20:13 GMT-0500 (CDT)'),
						finishDate: new Date('Fri May 01 2015 21:30:13 GMT-0500 (CDT)'),
						usernames: ['pstuart2']
					}),
					dbData = [responseData0.toJson(), responseData1.toJson()];

			spyOn(Services.TeamCity.prototype, 'getBuildData').and.callFake(function (href, historyCount, cb) {
				cb([responseData0, responseData1]);
			});

			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_SomeBuildId_', href: '/guestAuth/someid'});
			build.refreshBuildData(new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDataTest'
			}));

			expect(Services.TeamCity.prototype.getBuildData.calls.count()).toBe(1);
			expect(Services.TeamCity.prototype.getBuildData).toHaveBeenCalledWith('/guestAuth/someid', 10, jasmine.any(Function));

			expect(Collections.Builds.update.calls.count()).toBe(1);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_SomeBuildId_'},
					{$set: {isLastBuildSuccess: false, builds: dbData}}
			);
		});

		it('should update isLastBuildSuccess to false if the last build is still running and the previous build failed', function () {
			var responseData0 = new Models.BuildDetail({
						id: 687,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '204',
						isSuccess: true,
						isRunning: true,
						href: '/httpAuth/app/rest/builds/id:687',
						statusText: 'Step 1/3',
						startDate: new Date('Fri May 01 2015 21:20:13 GMT-0500 (CDT)'),
						finishDate: new Date('Fri May 01 2015 21:30:13 GMT-0500 (CDT)'),
						usernames: ['pstuart2']
					}),
					responseData1 = new Models.BuildDetail({
						id: 686,
						serviceBuildId: 'MBP_UnitTestAndBundle',
						serviceNumber: '203',
						isSuccess: false,
						isRunning: false,
						href: '/httpAuth/app/rest/builds/id:687',
						statusText: 'Step 1/3',
						startDate: new Date('Fri May 01 2015 21:20:13 GMT-0500 (CDT)'),
						finishDate: new Date('Fri May 01 2015 21:30:13 GMT-0500 (CDT)'),
						usernames: ['pstuart2']
					}),
					dbData = [responseData0.toJson(), responseData1.toJson()];

			spyOn(Services.TeamCity.prototype, 'getBuildData').and.callFake(function (href, historyCount, cb) {
				cb([responseData0, responseData1]);
			});

			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_SomeBuildId_', href: '/guestAuth/someid'});
			build.refreshBuildData(new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDataTest'
			}));

			expect(Services.TeamCity.prototype.getBuildData.calls.count()).toBe(1);
			expect(Services.TeamCity.prototype.getBuildData).toHaveBeenCalledWith('/guestAuth/someid', 10, jasmine.any(Function));

			expect(Collections.Builds.update.calls.count()).toBe(1);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_SomeBuildId_'},
					{$set: {isLastBuildSuccess: false, builds: dbData}}
			);
		});
	});

	describe('addWatcher()', function () {
		it('should add the user to the watchers list', function () {
			spyOn(Collections.Builds, 'update');

			spyOn(Models.Build.prototype, 'refreshBuildData');

			var build = new Models.Build({_id: '_IUKJOIkd', watchers: []});
			build.addWatcher(new Services.TeamCity({
				_id: '-updateIsDIsplayed-',
				url: 'http://example.com/updateIsDisplayed'
			}), 'myCoolUserId');

			expect(build.watchers.length).toBe(1);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_IUKJOIkd'}, {$addToSet: {watchers: 'myCoolUserId'}});
			expect(Models.Build.prototype.refreshBuildData).toHaveBeenCalled();
		});

		it('should not add to set if it already exists', function () {
			spyOn(Collections.Builds, 'update');

			spyOn(Models.Build.prototype, 'refreshBuildData');

			var build = new Models.Build({_id: '_IUKJOIkd', watchers: ['WatherIsThere']});
			build.addWatcher(new Services.TeamCity({
				_id: '-updateIsDIsplayed-',
				url: 'http://example.com/updateIsDisplayed'
			}), 'WatherIsThere');

			expect(build.watchers.length).toBe(1);
			expect(Collections.Builds.update).not.toHaveBeenCalled();
			expect(Models.Build.prototype.refreshBuildData).not.toHaveBeenCalled();
		});
	});

	describe('removeWatcher()', function () {
		it('should remove the watcher from the list and the database', function () {
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_IUKJOIkd', watchers: ['Watcher1','Watcher2','Watcher3']});
			build.removeWatcher('Watcher2');

			expect(build.watchers.length).toBe(2);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_IUKJOIkd'}, {$set: {watchers: ['Watcher1','Watcher3']}});
		});

		it('should not update if the watcher does not exist in the lsit', function () {
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_IUKJOIkd', watchers: ['Watcher1','Watcher3']});
			build.removeWatcher('Watcher2');

			expect(build.watchers.length).toBe(2);
			expect(Collections.Builds.update).not.toHaveBeenCalled();
		});
	});

	describe('startBuild()', function () {
		it('should get the details for the href from the service and update its build history only keeping 10', function () {
			var newBuildDetail = {
				id: 420,
				serviceBuildId: 'MBP_UT&B',
				serviceNumber: '112',
				isSuccess: true,
				isRunning: true,
				href: '/httpAuth/app/rest/builds/id:420',
				percentageComplete: 29,
				statusText: 'Step Hannah of Dool',
				startDate: new Date(2015, 7, 5, 15, 20, 0),
				finishDate: null,
				usernames: ['pstuart183']
			};

			spyOn(Services.TeamCity.prototype, 'getBuildDetails').and.callFake(function (href, cb) {
				cb(new Models.BuildDetail(newBuildDetail));
			});

			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({
				_id: '_SomeBuildId331_', href: '/guestAuth/rundmc/bt884', builds: [
					{id: 1, serviceBuildId: 'btNumber1', serviceNumber: 'bt1', isSuccess: true, isRunning: false},
					{id: 2, serviceBuildId: 'btNumber2', serviceNumber: 'bt2', isSuccess: false, isRunning: false},
					{id: 3, serviceBuildId: 'btNumber3', serviceNumber: 'bt3', isSuccess: true, isRunning: false},
					{id: 4, serviceBuildId: 'btNumber4', serviceNumber: 'bt4', isSuccess: true, isRunning: false},
					{id: 5, serviceBuildId: 'btNumber5', serviceNumber: 'bt5', isSuccess: true, isRunning: false},
					{id: 6, serviceBuildId: 'btNumber6', serviceNumber: 'bt6', isSuccess: true, isRunning: false},
					{id: 7, serviceBuildId: 'btNumber7', serviceNumber: 'bt7', isSuccess: true, isRunning: false},
					{id: 8, serviceBuildId: 'btNumber8', serviceNumber: 'bt8', isSuccess: true, isRunning: false},
					{id: 9, serviceBuildId: 'btNumber9', serviceNumber: 'bt9', isSuccess: true, isRunning: false},
					{id: 10, serviceBuildId: 'btNumber10', serviceNumber: 'bt10', isSuccess: true, isRunning: false},
					{id: 11, serviceBuildId: 'btNumber11', serviceNumber: 'bt11', isSuccess: true, isRunning: false}
				]
			});

			build.startBuild(new Services.TeamCity({
				_id: '_startBuildTestId_',
				url: 'http://example.com/startBuild'
			}), '/guestAuth/rundmc/id:420');


			expect(Services.TeamCity.prototype.getBuildDetails).toHaveBeenCalledWith('/guestAuth/rundmc/id:420', jasmine.any(Function));
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_SomeBuildId331_'}, {
				$set: {
					isBuilding: true,
					builds: [newBuildDetail,
						{id: 1, serviceBuildId: 'btNumber1', serviceNumber: 'bt1', isSuccess: true, isRunning: false},
						{id: 2, serviceBuildId: 'btNumber2', serviceNumber: 'bt2', isSuccess: false, isRunning: false},
						{id: 3, serviceBuildId: 'btNumber3', serviceNumber: 'bt3', isSuccess: true, isRunning: false},
						{id: 4, serviceBuildId: 'btNumber4', serviceNumber: 'bt4', isSuccess: true, isRunning: false},
						{id: 5, serviceBuildId: 'btNumber5', serviceNumber: 'bt5', isSuccess: true, isRunning: false},
						{id: 6, serviceBuildId: 'btNumber6', serviceNumber: 'bt6', isSuccess: true, isRunning: false},
						{id: 7, serviceBuildId: 'btNumber7', serviceNumber: 'bt7', isSuccess: true, isRunning: false},
						{id: 8, serviceBuildId: 'btNumber8', serviceNumber: 'bt8', isSuccess: true, isRunning: false},
						{id: 9, serviceBuildId: 'btNumber9', serviceNumber: 'bt9', isSuccess: true, isRunning: false}]
				}
			});
		});
	});

	describe('updateRunningBuild()', function () {
		it('should call the service and get the latest status', function () {
			spyOn(Services.TeamCity.prototype, 'getBuildDetails').and.callFake(function (href, cb) {
				cb(new Models.BuildDetail({
					id: 420,
					serviceBuildId: 'MBP_UTB-bt1',
					serviceNumber: '112',
					isSuccess: true,
					isRunning: true,
					href: '/httpAuth/app/rest/builds/btid:420',
					percentageComplete: 95,
					statusText: 'I am still running',
					startDate: new Date(2015, 1, 17, 15, 20, 0),
					finishDate: null,
					usernames: ['pstuart69']
				}));
			});
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({
				_id: 'build_bt1', href: '/guestAuth/no/call', builds: [{
					id: 420,
					serviceBuildId: 'MBP_UTB-bt1',
					serviceNumber: '112',
					isSuccess: true,
					isRunning: true,
					href: '/httpAuth/app/rest/builds/btid:420',
					statusText: 'And I ran...',
					startDate: new Date(2015, 1, 17, 15, 20, 0),
					finishDate: null,
					usernames: ['pstuart69']
				}]
			});

			build.updateRunningBuild(new Services.TeamCity({
				_id: '_startBuildTestId_',
				url: 'http://example.com/startBuild'
			}));

			expect(Services.TeamCity.prototype.getBuildDetails).toHaveBeenCalledWith('/httpAuth/app/rest/builds/btid:420', jasmine.any(Function));
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'build_bt1'}, {
				$set: {
					'builds.0.isRunning': true,
					'builds.0.isSuccess': true,
					'builds.0.statusText': 'I am still running',
					'builds.0.percentageComplete': 95
				}
			});
		});

		it('should change last build success to false if the current build starts failing', function () {
			spyOn(Services.TeamCity.prototype, 'getBuildDetails').and.callFake(function (href, cb) {
				cb(new Models.BuildDetail({
					id: 420,
					serviceBuildId: 'MBP_UTB-bt1',
					serviceNumber: '112',
					isSuccess: false,
					isRunning: true,
					href: '/httpAuth/app/rest/builds/btid:420',
					percentageComplete: 95,
					statusText: 'Oh no! I am failing',
					startDate: new Date(2015, 1, 17, 15, 20, 0),
					finishDate: null,
					usernames: ['pstuart69']
				}));
			});
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({
				_id: 'build_bt3', href: '/guestAuth/no/call', isLastBuildSuccess: true, builds: [{
					id: 420,
					serviceBuildId: 'MBP_UTB-bt1',
					serviceNumber: '112',
					isSuccess: true,
					isRunning: true,
					href: '/httpAuth/app/rest/builds/btid:420',
					statusText: 'And I ran...',
					startDate: new Date(2015, 1, 17, 15, 20, 0),
					finishDate: null,
					usernames: ['pstuart69']
				}]
			});

			build.updateRunningBuild(new Services.TeamCity({
				_id: '_startBuildTestId_',
				url: 'http://example.com/startBuild'
			}));

			expect(Services.TeamCity.prototype.getBuildDetails).toHaveBeenCalledWith('/httpAuth/app/rest/builds/btid:420', jasmine.any(Function));
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'build_bt3'}, {
				$set: {
					isLastBuildSuccess: false,
					'builds.0.isRunning': true,
					'builds.0.isSuccess': false,
					'builds.0.statusText': 'Oh no! I am failing',
					'builds.0.percentageComplete': 95
				}
			});
		});

		it('should finish the build if it is no longer running', function () {
			spyOn(Services.TeamCity.prototype, 'getBuildDetails').and.callFake(function (href, cb) {
				cb(new Models.BuildDetail({
					id: 420,
					serviceBuildId: 'MBP_UTB-bt1',
					serviceNumber: '112',
					isSuccess: true,
					isRunning: false,
					href: '/httpAuth/app/rest/builds/btid:420',
					percentageComplete: 100,
					statusText: 'Success',
					startDate: new Date(2015, 1, 17, 15, 20, 0),
					finishDate: new Date(2015, 1, 17, 15, 30, 0),
					usernames: ['pstuart70']
				}));
			});
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({
				_id: 'build_bt1', href: '/guestAuth/no/call', builds: [{
					id: 420,
					serviceBuildId: 'MBP_UTB-bt1',
					serviceNumber: '112',
					isSuccess: true,
					isRunning: true,
					href: '/httpAuth/app/rest/builds/btid:420',
					statusText: 'And I ran...',
					startDate: new Date(2015, 1, 17, 15, 20, 0),
					finishDate: null,
					usernames: ['pstuart69']
				}]
			});

			build.updateRunningBuild(new Services.TeamCity({
				_id: '_startBuildTestId_',
				url: 'http://example.com/startBuild'
			}));

			expect(Services.TeamCity.prototype.getBuildDetails).toHaveBeenCalledWith('/httpAuth/app/rest/builds/btid:420', jasmine.any(Function));
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'build_bt1'}, {
				$set: {
					isLastBuildSuccess: true,
					isBuilding: false,
					'builds.0.isRunning': false,
					'builds.0.isSuccess': true,
					'builds.0.statusText': 'Success',
					'builds.0.percentageComplete': 100
				}
			});
		});
	});

});
