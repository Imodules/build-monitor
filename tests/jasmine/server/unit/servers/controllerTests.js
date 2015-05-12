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

		it('onInsertServer() should throw if the user is not an admin', function () {
			expect(function () {
				Controllers.Servers.onInsertServer('Server Name', 'http://lhost2:80');
			}).toThrow();
		});

		it('onUpdateServer() should throw if the user is not an admin', function () {
			expect(function () {
				Controllers.Servers.onUpdateServer('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');
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

	describe('onInsertServer()', function () {

		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool',
					isAdmin: true
				}
			});
		});

		it('should throw if url is not passed', function () {
			expect(function () {
				Controllers.Servers.onUpdateServer('name');
			}).toThrow();
		});

		it('should throw if name is not passed', function () {
			expect(function () {
				Controllers.Servers.onUpdateServer(null, 'url');
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

			Controllers.Servers.onInsertServer('Server Name', 'http://lhost2:80');

			expect(Collections.Servers.insert).toHaveBeenCalledWith({
				name: 'Server Name',
				type: 'teamcity',
				url: 'http://lhost2:80',
				user: false,
				password: false
			});
		});
	});

	describe('onUpdateServer()', function () {
		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool',
					isAdmin: true
				}
			});
		});

		it('should throw if id is not passed', function () {
			expect(function () {
				Controllers.Servers.onUpdateServer(null, 'url');
			}).toThrow();
		});

		it('should throw if name is not passed', function () {
			expect(function () {
				Controllers.Servers.onUpdateServer('id', null, 'url');
			}).toThrow();
		});

		it('should throw if url is not passed', function () {
			expect(function () {
				Controllers.Servers.onUpdateServer('id', 'name');
			}).toThrow();
		});

		it('should call update if a current record exists', function () {
			spyOn(s, 'isBlank').and.callFake(function () {
				return false;
			});

			spyOn(Collections.Servers, 'update').and.callFake(function () {
				return true;
			});

			Controllers.Servers.onUpdateServer('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');

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

	});

	describe('onUpdateBuildDisplay()', function () {
		it('should get the build and server and call the build update display', function () {
			spyOn(Controllers.Builds, 'getBuild').and.callFake(function () {
				return new Models.Build({
					'_id': 'BLD-idd3',
					'serverId': 'asdf45dd4',
					'projectId': 'MBP',
					'serviceBuildId': 'MBP_UnitTestAndBundle',
					'name': 'Unit Test and Bundle',
					'url': '/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle',
					'displayCounter': 0,
					'isLastBuildSuccess': true,
					'isBuilding': false
				});
			});
			spyOn(Controllers.Servers, 'getServer').and.callFake(function () {
				return new Models.Server({_id: 'asdf45dd4', url: 'http://somewhere', type: 'teamcity'});
			});
			spyOn(Models.Build.prototype, 'updateIsDisplayed');

			Controllers.Servers.onUpdateBuildDisplay('BLD-idd3', true);

			expect(Controllers.Builds.getBuild).toHaveBeenCalledWith('BLD-idd3');
			expect(Controllers.Servers.getServer).toHaveBeenCalledWith('asdf45dd4');
			expect(Models.Build.prototype.updateIsDisplayed).toHaveBeenCalledWith(jasmine.any(Services.TeamCity), true);
		});
	});
});
