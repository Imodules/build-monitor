/**
 * Created by paul on 4/24/15.
 */

'use strict';
describe('Controller.Servers', function () {
	beforeEach(function () {
		mock(s, 'isBlank');
	});

	describe('onRefreshProjects()', function () {
		it('should throw for an unknown server type', function () {
			spyOn(Collections.Servers, 'findOne').and.callFake(function (q) {
				return {
					type: '_invalid_'
				};
			});

			expect(function () {
				Controllers.Projects.onRefreshProjects('abc123');
			}).toThrow('Invalid server type: _invalid_');
		});

		it('should get teamcity service and call refresh projects', function () {
			spyOn(Collections.Servers, 'findOne').and.callFake(function (q) {
				return {
					_id: q._id,
					type: 'teamcity',
					url: 'http://example.com/bs'
				};
			});

			spyOn(Services.TeamCity.prototype, 'refreshFromServer').and.callFake(function () {
			});

			Controllers.Projects.onRefreshProjects('abc123');

			expect(Collections.Servers.findOne).toHaveBeenCalledWith({_id: 'abc123'});
			expect(Services.TeamCity.prototype.refreshFromServer).toHaveBeenCalled();
		});
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

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({_id: 'SrvId-PrId-ProjId'},
					{
						$set: {
							serverId: 'SrvId',
							parentId: 'PrId',
							projectId: 'ProjId',
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

			Controllers.Projects.onAddProject('SrvId', null, 'ProjId', 'My Cool Name-o', 'http://example.com/mbp/bs');

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({_id: 'SrvId-ProjId'},
					{
						$set: {
							serverId: 'SrvId',
							parentId: false,
							projectId: 'ProjId',
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
			spyOn(Collections.BuildTypes, 'upsert').and.callFake(function () {
				return true;
			});

			Controllers.Projects.onAddBuild('SrvId', 'ProjId', 'BtId', 'My Cool Name BTO', 'http://example.com/mbp/btype');

			expect(Collections.BuildTypes.upsert).toHaveBeenCalledWith({_id: 'SrvId-ProjId-BtId'},
					{
						$set: {
							serverId: 'SrvId',
							projectId: 'ProjId',
							buildTypeId: 'BtId',
							name: 'My Cool Name BTO',
							url: 'http://example.com/mbp/btype'
						}
					}, {multi: false});
		});
	});
});
