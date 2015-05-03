/**
 * Created by paul on 5/1/15.
 */

'use strict';
describe('Controllers.BuildTypes', function () {
	describe('onUpdateBuildStatus()', function () {
		beforeEach(function () {
			spyOn(Collections.Builds, 'update');
		});

		it('should update the build in the database with the current build information', function () {
			Controllers.Builds.onUpdateBuildStatus('btId69', 'somewhere', true, true, true, 20, 'Still running bro');

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId69'},
					{$set: {currentBuild: {href: 'somewhere', pctComplete: 20, statusText: 'Still running bro'}}},
					{multi: false}
			);
		});

		it('should change isLastBuildSuccess to false if it is currently true and this build is failing', function () {
			Controllers.Builds.onUpdateBuildStatus('btId70', 'righthere', true, false, true, 20, 'Still running bro');

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{
						$set: {
							isLastBuildSuccess: false,
							currentBuild: {href: 'righthere', pctComplete: 20, statusText: 'Still running bro'}
						}
					},
					{multi: false}
			);
		});

		it('should not change isLastBuildSuccess to true if is currently false and the new build is a success and it is still running', function () {
			Controllers.Builds.onUpdateBuildStatus('btId70', 'gogogog', false, true, true, 50, 'Cool Step 1/3');

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{$set: {currentBuild: {href: 'gogogog', pctComplete: 50, statusText: 'Cool Step 1/3'}}},
					{multi: false}
			);
		});

		it('should change isLastBuildSuccess to true if it was false and the current build succeeded and it is complete', function () {
			Controllers.Builds.onUpdateBuildStatus('btId70', 'yupyup', false, true, false, 100, 'Done');

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{
						$set: {
							isLastBuildSuccess: true,
							isBuilding: false,
							currentBuild: {href: 'yupyup', pctComplete: 100, statusText: 'Done'},
							'builds.0.isBuilding': false,
							'builds.0.isSuccess': true
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
				}
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

			Controllers.Builds.onUpdateBuildHistory('NowNowNow', 'Something Here', true, false, []);

			expect(Collections.Builds.update).toHaveBeenCalledWith(
					{serverId: 'NowNowNow', serviceBuildId: 'Something Here'},
					{$set: {isLastBuildSuccess: true, isBuilding: false, builds: []}},
					{multi: false}
			);
		});
	});
});
