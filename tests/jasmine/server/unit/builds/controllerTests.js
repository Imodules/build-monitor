/**
 * Created by paul on 5/1/15.
 */

'use strict';
describe('Controllers.Builds', function () {
	describe('onUpdateBuildStatus()', function () {
		beforeEach(function () {
			spyOn(Collections.Builds, 'update');
		});

		it('should update the build in the database with the current build information', function () {
			var startDate = new moment('20150503T225519-0500', 'YYYYMMDDTHHmmssZ').toDate(),
					finishedDate = new moment('20150503T235519-0500', 'YYYYMMDDTHHmmssZ').toDate();

			Controllers.Builds.onUpdateBuildStatus('btId69', 'somewhere', true, true, true, 20, 'Still running bro', startDate, finishedDate);

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId69'},
					{
						$set: {
							currentBuild: {
								href: 'somewhere',
								pctComplete: 20,
								statusText: 'Still running bro',
								started: startDate
							}
						}
					},
					{multi: false}
			);
		});

		it('should change isLastBuildSuccess to false if it is currently true and this build is failing', function () {
			var startDate = new moment('20150503T225519-0500', 'YYYYMMDDTHHmmssZ').toDate();

			Controllers.Builds.onUpdateBuildStatus('btId70', 'righthere', true, false, true, 20, 'Still running bro', startDate);

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{
						$set: {
							isLastBuildSuccess: false,
							currentBuild: {href: 'righthere', pctComplete: 20, statusText: 'Still running bro', started: startDate}
						}
					},
					{multi: false}
			);
		});

		it('should not change isLastBuildSuccess to true if is currently false and the new build is a success and it is still running', function () {
			var startDate = new moment('20150503T225519-0500', 'YYYYMMDDTHHmmssZ').toDate();

			Controllers.Builds.onUpdateBuildStatus('btId70', 'gogogog', false, true, true, 50, 'Cool Step 1/3', startDate);

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{$set: {currentBuild: {href: 'gogogog', pctComplete: 50, statusText: 'Cool Step 1/3', started: startDate}}},
					{multi: false}
			);
		});

		it('should change isLastBuildSuccess to true if it was false and the current build succeeded and it is complete', function () {
			var startDate = new moment('20150503T225519-0500', 'YYYYMMDDTHHmmssZ').toDate(),
					finishedDate = new moment('20150503T235519-0500', 'YYYYMMDDTHHmmssZ').toDate();

			Controllers.Builds.onUpdateBuildStatus('btId70', 'yupyup', false, true, false, 100, 'Done', startDate, finishedDate);

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{
						$set: {
							isLastBuildSuccess: true,
							isBuilding: false,
							currentBuild: {
								href: 'yupyup',
								pctComplete: 100,
								statusText: 'Done',
								started: startDate,
								finished: finishedDate
							},
							'builds.0.isBuilding': false,
							'builds.0.isSuccess': true,
							'builds.0.started': startDate,
							'builds.0.finished': finishedDate
						}
					},
					{multi: false}
			);
		});
	});

	describe('onGetActiveServerBuilds()', function () {
		it('should call Collections.BuildTypes.find', function () {
			spyOn(Collections.Builds, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [];
					}
				};
			});

			Controllers.Builds.onGetActiveServerBuilds('MeCo0lId');

			expect(Collections.Builds.find).toHaveBeenCalledWith({serverId: 'MeCo0lId', isBuilding: true},
					{fields: {serviceBuildId: 1}});
		});
	});

	describe('onStartBuild()', function () {

		it('should update current build info and insert new build history at the 0 index even if the builds array does not exist', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {
					_id: 'Coolio'
				};
			});

			spyOn(Collections.Builds, 'update');

			Controllers.Builds.onStartBuild('Sweet1', 'MyBuildTypeHere', {
				json: {
					id: 668,
					number: '194',
					isSuccess: true,
					isBuilding: true,
					href: '/httpAuth/app/rest/builds/id:668'

				}
			}, 1);

			expect(Collections.Builds.findOne).toHaveBeenCalledWith({
				serverId: 'Sweet1',
				serviceBuildId: 'MyBuildTypeHere'
			}, {fields: {builds: 1}});

			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'Coolio'},
					{
						$set: {
							isBuilding: true, currentBuild: {pctComplete: 1, href: '/httpAuth/app/rest/builds/id:668'},
							builds: [{
								id: 668,
								number: '194',
								isSuccess: true,
								isBuilding: true,
								href: '/httpAuth/app/rest/builds/id:668'
							}]
						}
					}, {multi: false}
			);
		});

		it('should update current build info and insert new build history at the 0 index', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {
					_id: 'Coolio',
					builds: [{
						id: 665,
						number: '193',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:665'

					}, {
						id: 661,
						number: '192',
						isSuccess: false,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:661'
					}]
				};
			});

			spyOn(Collections.Builds, 'update');

			Controllers.Builds.onStartBuild('Sweet1', 'MyBuildTypeHere', {
				json: {
					id: 668,
					number: '194',
					isSuccess: true,
					isBuilding: true,
					href: '/httpAuth/app/rest/builds/id:668'

				}
			}, 1);

			expect(Collections.Builds.findOne).toHaveBeenCalledWith({
				serverId: 'Sweet1',
				serviceBuildId: 'MyBuildTypeHere'
			}, {fields: {builds: 1}});

			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'Coolio'},
					{
						$set: {
							isBuilding: true, currentBuild: {pctComplete: 1, href: '/httpAuth/app/rest/builds/id:668'},
							builds: [{
								id: 668,
								number: '194',
								isSuccess: true,
								isBuilding: true,
								href: '/httpAuth/app/rest/builds/id:668'
							}, {
								id: 665,
								number: '193',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:665'

							}, {
								id: 661,
								number: '192',
								isSuccess: false,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:661'
							}]
						}
					}, {multi: false}
			);
		});

		it('should remove the last build history if we are at 10', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {
					_id: 'WowBigOne',
					builds: [{
						id: 670,
						number: '200',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:670'
					}, {
						id: 669,
						number: '199',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:669'
					}, {
						id: 668,
						number: '198',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:668'
					}, {
						id: 667,
						number: '197',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:667'
					}, {
						id: 666,
						number: '196',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:666'
					}, {
						id: 665,
						number: '195',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:665'
					}, {
						id: 664,
						number: '194',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:664'
					}, {
						id: 663,
						number: '193',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:663'
					}, {
						id: 662,
						number: '192',
						isSuccess: true,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:662'
					}, {
						id: 661,
						number: '191',
						isSuccess: false,
						isBuilding: false,
						href: '/httpAuth/app/rest/builds/id:661'
					}]
				}
			});

			spyOn(Collections.Builds, 'update');

			Controllers.Builds.onStartBuild('WowBigOne', 'YesYesIKnow', {
				json: {
					id: 700,
					number: '210',
					isSuccess: true,
					isBuilding: true,
					href: '/httpAuth/app/rest/builds/id:700'
				}
			}, 1);

			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'WowBigOne'},
					{
						$set: {
							isBuilding: true, currentBuild: {pctComplete: 1, href: '/httpAuth/app/rest/builds/id:700'},
							builds: [{
								id: 700,
								number: '210',
								isSuccess: true,
								isBuilding: true,
								href: '/httpAuth/app/rest/builds/id:700'
							}, {
								id: 670,
								number: '200',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:670'
							}, {
								id: 669,
								number: '199',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:669'
							}, {
								id: 668,
								number: '198',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:668'
							}, {
								id: 667,
								number: '197',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:667'
							}, {
								id: 666,
								number: '196',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:666'
							}, {
								id: 665,
								number: '195',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:665'
							}, {
								id: 664,
								number: '194',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:664'
							}, {
								id: 663,
								number: '193',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:663'
							}, {
								id: 662,
								number: '192',
								isSuccess: true,
								isBuilding: false,
								href: '/httpAuth/app/rest/builds/id:662'
							}]
						}
					}, {multi: false}
			);
		});
	});

	describe('onUpdateBuildHistory()', function () {
		it('should update the BuildTypes history', function () {
			spyOn(Collections.Builds, 'update');

			var startDate = moment().subtract(2, 'h').toDate(),
					finishDate = moment().toDate();

			var buildHistories = [];
			buildHistories.push(new Models.BuildHistory({
				id: 881,
				number: '909',
				isSuccess: false,
				isBuilding: false,
				href: '/httpAuth/app/rest/builds/id:881',
				startDate: startDate,
				finishDate: finishDate
			}));

			Controllers.Builds.onUpdateBuildHistory('NowNowNow', 'Something Here', true, false, buildHistories);

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{serverId: 'NowNowNow', serviceBuildId: 'Something Here'},
					{
						$set: {
							isLastBuildSuccess: true,
							isBuilding: false,
							lastStartDate: startDate,
							lastFinishDate: finishDate,
							builds: [buildHistories[0].json]
						}
					},
					{multi: false}
			);
		});
	});

	describe('onMyBuildDisplayHasChanged()', function () {
		it('should update the isDisplayed of the build if it changed and call the refreshBuildHistory service', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {isDisplayed: false, serverId: 'c00lServerId', serviceBuildId: 'tcBuildId_89484'};
			});
			spyOn(Collections.Servers, 'findOne').and.callFake(function () {
				return {_id: 'c00lServerId', type: 'teamcity', url: 'http://example.com/one/two'};
			});
			spyOn(Collections.Builds, 'update');
			spyOn(Controllers.MyBuildDisplay, 'onGetBuildDisplayCount');
			spyOn(Services.TeamCity.prototype, 'refreshBuildHistory');

			Controllers.Builds.onMyBuildDisplayHasChanged('848484', true);

			expect(Collections.Builds.findOne).toHaveBeenCalledWith({_id: '848484'});
			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: '848484'}, {$set: {isDisplayed: true}});
			expect(Controllers.MyBuildDisplay.onGetBuildDisplayCount).not.toHaveBeenCalled();
			expect(Collections.Servers.findOne).toHaveBeenCalledWith({_id: 'c00lServerId'});
			expect(Services.TeamCity.prototype.refreshBuildHistory).toHaveBeenCalledWith('tcBuildId_89484', 10);
		});

		it('should not call update if it has not changed from true', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {isDisplayed: true, serverId: 'aa44dd', serviceBuildId: 'tcBuildId_adsf'};
			});
			spyOn(Collections.Builds, 'update');
			spyOn(Controllers.MyBuildDisplay, 'onGetBuildDisplayCount');
			spyOn(Services.TeamCity.prototype, 'refreshBuildHistory');

			Controllers.Builds.onMyBuildDisplayHasChanged('adsf55ddd', true);

			expect(Collections.Builds.findOne).toHaveBeenCalledWith({_id: 'adsf55ddd'});
			expect(Collections.Builds.update).not.toHaveBeenCalled();
			expect(Controllers.MyBuildDisplay.onGetBuildDisplayCount).not.toHaveBeenCalled();
			expect(Services.TeamCity.prototype.refreshBuildHistory).not.toHaveBeenCalled();
		});

		it('should not call update if it has not changed from false', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {isDisplayed: false, serverId: 'aa44dd', serviceBuildId: 'tcBuildId_adsf'};
			});
			spyOn(Collections.Builds, 'update');
			spyOn(Controllers.MyBuildDisplay, 'onGetBuildDisplayCount');
			spyOn(Services.TeamCity.prototype, 'refreshBuildHistory');

			Controllers.Builds.onMyBuildDisplayHasChanged('adsf55adfddd', false);

			expect(Collections.Builds.findOne).toHaveBeenCalledWith({_id: 'adsf55adfddd'});
			expect(Collections.Builds.update).not.toHaveBeenCalled();
			expect(Controllers.MyBuildDisplay.onGetBuildDisplayCount).not.toHaveBeenCalled();
			expect(Services.TeamCity.prototype.refreshBuildHistory).not.toHaveBeenCalled();
		});

		it('should update to false from true', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {isDisplayed: true, serverId: '585dd22ee', serviceBuildId: 'tcBuildId_445ttbb'};
			});
			spyOn(Collections.Builds, 'update');
			spyOn(Services.TeamCity.prototype, 'refreshBuildHistory');
			spyOn(Controllers.MyBuildDisplay, 'onGetBuildDisplayCount').and.callFake(function () {
				return 1;
			});

			Controllers.Builds.onMyBuildDisplayHasChanged('adsf55adfddd', false);

			expect(Collections.Builds.update).toHaveBeenCalledWith({_id: 'adsf55adfddd'}, {$set: {isDisplayed: false}});
			expect(Services.TeamCity.prototype.refreshBuildHistory).not.toHaveBeenCalled();
		});

		it('should not update to false if there is still more than 1 person displaying this build', function () {
			spyOn(Collections.Builds, 'findOne').and.callFake(function () {
				return {isDisplayed: true, serverId: 'aa44dd2f', serviceBuildId: 'tcBuildId_adsf2f'};
			});
			spyOn(Collections.Builds, 'update');
			spyOn(Controllers.MyBuildDisplay, 'onGetBuildDisplayCount').and.callFake(function () {
				return 2;
			});
			spyOn(Services.TeamCity.prototype, 'refreshBuildHistory');

			Controllers.Builds.onMyBuildDisplayHasChanged('00dd00ee', false);

			expect(Collections.Builds.update).not.toHaveBeenCalled();
			expect(Services.TeamCity.prototype.refreshBuildHistory).not.toHaveBeenCalled();
		});
	});

	describe('onRemoveByServerId()', function () {
		it('should remove all MyBuildDisplays and all builds by serverId', function () {
			spyOn(Controllers.MyBuildDisplay, 'onRemoveByBuildId');
			spyOn(Collections.Builds, 'remove');
			spyOn(Collections.Builds, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [
							{_id: 'bid_1'}, {_id: 'bid_2'}
						];
					}
				};
			});

			Controllers.Builds.onRemoveByServerId('36DD');

			expect(Collections.Builds.find).toHaveBeenCalledWith({serverId: '36DD'}, {fields: {_id: 1}});
			expect(Controllers.MyBuildDisplay.onRemoveByBuildId.calls.count()).toBe(2);
			expect(Controllers.MyBuildDisplay.onRemoveByBuildId).toHaveBeenCalledWith('bid_1');
			expect(Controllers.MyBuildDisplay.onRemoveByBuildId).toHaveBeenCalledWith('bid_2');
			expect(Collections.Builds.remove).toHaveBeenCalledWith({serverId: '36DD'});
		});
	});
});
