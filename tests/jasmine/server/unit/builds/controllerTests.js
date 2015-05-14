/**
 * Created by paul on 5/1/15.
 */

'use strict';
describe('Controllers.Builds', function () {
	describe('getActiveServerBuilds()', function () {
		it('should call Collections.BuildTypes.find', function () {
			spyOn(Collections.Builds, 'find');

			Controllers.Builds.getActiveServerBuilds('MeCo0lId');

			expect(Collections.Builds.find).toHaveBeenCalledWith({serverId: 'MeCo0lId', displayCounter: {$gt: 0}},
					{fields: {serviceBuildId: 1}, transform: jasmine.any(Function)});
		});
	});

	describe('getBuildByServiceId()', function () {
		it('should query Collections.BuildTypes with the serverId and  serviceId', function () {
			spyOn(Collections.Builds, 'findOne');

			Controllers.Builds.getBuildByServiceId('SvErId1', 'Service____ID');

			expect(Collections.Builds.findOne).toHaveBeenCalledWith({serverId: 'SvErId1', serviceBuildId: 'Service____ID'},
					{transform: jasmine.any(Function)});
		});
	});

	describe('getRunningServerBuilds()', function () {
		it('should query the collection looking for only isBuilding: true', function () {
			spyOn(Collections.Builds, 'find');

			Controllers.Builds.getRunningServerBuilds('MeS33tId');

			expect(Collections.Builds.find).toHaveBeenCalledWith({serverId: 'MeS33tId', isBuilding: true},
					{transform: jasmine.any(Function)});
		});
	});
});
