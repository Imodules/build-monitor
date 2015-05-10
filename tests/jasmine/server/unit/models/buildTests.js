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
						isRunning: true,
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

			var build = new Models.Build({_id: '_SomeBuildId_', url: '/guestAuth/someid'});
			build.refreshBuildData(new Services.TeamCity({
				_id: '_getBuildDataTest_',
				url: 'http://example.com/getBuildDataTest'
			}));

			expect(Services.TeamCity.prototype.getBuildData.calls.count()).toBe(1);
			expect(Services.TeamCity.prototype.getBuildData).toHaveBeenCalledWith('/guestAuth/someid', 10, jasmine.any(Function));

			expect(Collections.Builds.update.calls.count()).toBe(1);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_SomeBuildId_'}, {$set: {builds: dbData}});
		});
	});

	describe('updateIsDisplayed()', function () {
		it('should update the isDisplayed and set the counter to 1 if it is not already displayed', function () {
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_IUKJOIkd', displayCounter: 0});
			build.updateIsDisplayed(true);

			expect(build.displayCounter).toBe(1);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_IUKJOIkd'}, {$inc: {displayCounter: 1}});
		});

		it('should only increment the counter if it is already displayed', function () {
			spyOn(Collections.Builds, 'update');

			var build = new Models.Build({_id: '_adfeeasc-dfasdad', displayCounter: 3});
			build.updateIsDisplayed(false);

			expect(build.displayCounter).toBe(2);
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '_adfeeasc-dfasdad'}, {$inc: {displayCounter: -1}});
		});
	});

	describe('startBuild()', function () {
		it('should get the details for the href from the service and update its build history', function () {
			var newBuildDetail = {
				id: 420,
				serviceBuildId: 'MBP_UT&B',
				serviceNumber: '112',
				isSuccess: true,
				isRunning: true,
				href: '/httpAuth/app/rest/builds/id:420',
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
				_id: '_SomeBuildId331_', url: '/guestAuth/rundmc/bt884', builds: [
					{id: 1, serviceBuildId: 'btNumber1', serviceNumber: 'bt1', isSuccess: true, isRunning: false},
					{id: 2, serviceBuildId: 'btNumber2', serviceNumber: 'bt2', isSuccess: false, isRunning: false},
					{id: 3, serviceBuildId: 'btNumber3', serviceNumber: 'bt3', isSuccess: true, isRunning: false}
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
						{id: 3, serviceBuildId: 'btNumber3', serviceNumber: 'bt3', isSuccess: true, isRunning: false}]
				}
			});
		});
	});

});
