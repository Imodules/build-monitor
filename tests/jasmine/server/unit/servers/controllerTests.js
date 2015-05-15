/**
 * Created by paul on 4/23/15.
 */

'use strict';
describe('Controllers.Servers', function () {
	describe('Non Admin user', function () {
		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool'
				};
			});
		});

		it('onSaveServer() should throw if the user is not an admin', function () {
			expect(function () {
				Controllers.Servers.onSaveServer('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');
			}).toThrow();
		});

		it('onDeleteServer() should throw if the user is not and admin', function () {
			expect(function () {
				Controllers.Servers.onDeleteServer('112');
			}).toThrow();
		});
	});

	describe('getServers()', function () {
		it('should query the database', function () {
			spyOn(Collections.Servers, 'find');

			Controllers.Servers.getServers();

			expect(Collections.Servers.find).toHaveBeenCalledWith({}, {transform: jasmine.any(Function)});
		});
	});

	describe('onSaveServer()', function () {

		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool',
					isAdmin: true
				};
			});
		});

		it('should throw if url is not passed', function () {
			expect(function () {
				Controllers.Servers.onSaveServer('abc', 'name');
			}).toThrow();
		});

		it('should throw if name is not passed', function () {
			expect(function () {
				Controllers.Servers.onSaveServer('abc', null, 'url');
			}).toThrow();
		});


		it('should call insert', function () {
			spyOn(Collections.Servers, 'findOne').and.callFake(function () {
				return null;
			});
			spyOn(Collections.Servers, 'insert').and.callFake(function () {
				return '1';
			});

			spyOn(s, 'isBlank').and.callFake(function () {
				return true;
			});

			Controllers.Servers.onSaveServer(null, 'Server Name', 'http://lhost2:80');

			expect(Collections.Servers.insert).toHaveBeenCalledWith({
				name: 'Server Name',
				type: 'teamcity',
				url: 'http://lhost2:80',
				user: false,
				password: false
			});
		});

		it('should call update if a current record exists', function () {
			spyOn(s, 'isBlank').and.callFake(function () {
				return false;
			});

			spyOn(Collections.Servers, 'update').and.callFake(function () {
				return true;
			});

			Controllers.Servers.onSaveServer('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');

			expect(Collections.Servers.update).toHaveBeenCalledWith({_id: '2'}, {
				$set: {
					name: 'New server',
					type: 'teamcity',
					url: 'http://newhost:80',
					user: 'tcUser',
					password: 'tcPass'
				}
			});
		});
	});


	describe('onDeleteServer()', function () {
		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool',
					isAdmin: true
				}
			});
		});

		it('should remove all builds, buildDisplays and the server', function () {
			spyOn(Controllers.Builds, 'onRemoveByServerId');
			spyOn(Collections.Servers, 'remove');
			spyOn(Controllers.Projects, 'onRemoveByServerId');

			Controllers.Servers.onDeleteServer('abiie');

			expect(Controllers.Builds.onRemoveByServerId).toHaveBeenCalledWith('abiie');
			expect(Controllers.Projects.onRemoveByServerId).toHaveBeenCalledWith('abiie');
			expect(Collections.Servers.remove).toHaveBeenCalledWith({_id: 'abiie'});
		});
	});

	describe('onRefreshProjects()', function () {
		it('should get the server and call refresh projcts', function () {
			spyOn(Controllers.Servers, 'getServer').and.callFake(function () {
				return new Models.Server({_id: 'asdf45dd4', url: 'http://somewhere', type: 'teamcity'});
			});
			spyOn(Models.Server.prototype, 'refreshProjects');

			Controllers.Servers.onRefreshProjects('_9494-9494_');

			expect(Controllers.Servers.getServer).toHaveBeenCalledWith('_9494-9494_');
			expect(Models.Server.prototype.refreshProjects).toHaveBeenCalled();
		});
	});

	describe('onWatchBuild()', function () {
		it('should get the server and call toggleDisplay', function () {
			spyOn(Controllers.Servers, 'getServer').and.callFake(function () {
				return new Models.Server({_id: '-toggle-build-watch-build', url: 'http://somewhere', type: 'teamcity'});
			});
			spyOn(Models.Server.prototype, 'toggleBuildDisplay');

			Controllers.Servers.onWatchBuild('-toggle-build-watch-build', 'CoolBuildId', 'My-CurUser', true);

			expect(Models.Server.prototype.toggleBuildDisplay).toHaveBeenCalledWith('CoolBuildId', 'My-CurUser', true);
		});
	});
});
