/**
 * Created by paul on 4/24/15.
 */

'use strict';
describe('Controller.Servers', function () {
	beforeEach(function () {
		mock(s, 'isBlank');
	});

	describe('onAddProject()', function () {
		it('should add a project to the db with a proper id', function () {
			spyOn(s, 'isBlank').and.callFake(function () {
				return false;
			});
			spyOn(Collections.Projects, 'upsert').and.callFake(function () {
				return true;
			});

			Controllers.Projects.onAddProject('SrvId', 'PrId', 'ProjId', 'My Cool Name-o', 'http://example.com/mbp/bs');

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({
						serverId: 'SrvId',
						parentId: 'PrId',
						projectId: 'ProjId'
					},
					{
						$set: {
							name: 'My Cool Name-o',
							url: 'http://example.com/mbp/bs'
						}
					}, {multi: false});
		});

		it('should add a project to the db without a parent with a proper id', function () {
			spyOn(s, 'isBlank').and.callFake(function () {
				return true;
			});
			spyOn(Collections.Projects, 'upsert').and.callFake(function () {
				return true;
			});

			Controllers.Projects.onAddProject('SrvId', '_Root', 'ProjId', 'My Cool Name-o', 'http://example.com/mbp/bs');

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({
						serverId: 'SrvId',
						parentId: '_Root',
						projectId: 'ProjId'
					},
					{
						$set: {
							name: 'My Cool Name-o',
							url: 'http://example.com/mbp/bs'
						}
					}, {multi: false});
		});
	});

	describe('onAddBuild()', function () {
		it('should add a build type to the database with a proper id', function () {
			spyOn(s, 'isBlank').and.callFake(function () {
				return false;
			});
			spyOn(Collections.Builds, 'upsert').and.callFake(function () {
				return true;
			});

			Controllers.Projects.onAddBuild('SrvId', 'ProjId', 'BtId', 'My Cool Name BTO', 'http://example.com/mbp/btype');

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: 'SrvId',
						projectId: 'ProjId',
						serviceBuildId: 'BtId'
					},
					{
						$set: {
							name: 'My Cool Name BTO',
							url: 'http://example.com/mbp/btype'
						}
					}, {multi: false});
		});
	});
});
