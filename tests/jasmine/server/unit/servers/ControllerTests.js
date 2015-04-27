/**
 * Created by paul on 4/23/15.
 */

'use strict';
var s = {
	isBlank: function () {}
};

describe('Controllers.Servers', function () {
	describe('Non Admin user', function () {
		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool'
				}
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
			spyOn(Collections.Servers, 'findOne').and.callFake(function () { return null; });
			spyOn(Collections.Servers, 'insert').and.callFake(function () { return '1'; });

			spyOn(s, 'isBlank').and.callFake(function () { return true; });

			Controllers.Servers.onInsertServer('Server Name', 'http://lhost2:80');

			expect(Collections.Servers.insert).toHaveBeenCalledWith({ name: 'Server Name', type: 'teamcity', url: 'http://lhost2:80', user: false, password: false});
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
			spyOn(s, 'isBlank').and.callFake(function () { return false; });

			spyOn(Collections.Servers, 'update').and.callFake(function () { return true; });

			Controllers.Servers.onUpdateServer('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');

			expect(Collections.Servers.update).toHaveBeenCalledWith({_id: '2'}, {$set: {name: 'New server', type: 'teamcity',url: 'http://newhost:80', user: 'tcUser', password: 'tcPass'}});
		});

	});
});
