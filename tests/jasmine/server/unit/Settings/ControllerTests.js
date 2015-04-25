/**
 * Created by paul on 4/23/15.
 */

'use strict';
var s = {
	isBlank: function () {}
};

describe('Controllers.Settings', function () {

	describe('Non Admin user', function () {
		beforeEach(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return {
					_id: 'abc',
					username: 'coooooool'
				}
			});
		});

		it('onInsertSettings() should throw if the user is not an admin', function () {
			expect(function () {
				Controllers.Settings.onInsertSettings('Server Name', 'http://lhost2:80');
			}).toThrow();
		});

		it('onUpdateSettings() should throw if the user is not an admin', function () {
			expect(function () {
				Controllers.Settings.onUpdateSettings('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');
			}).toThrow();
		});
	});

	describe('onInsertSettings()', function () {

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
				Controllers.Settings.onUpdateSettings('name');
			}).toThrow();
		});

		it('should throw if name is not passed', function () {
			expect(function () {
				Controllers.Settings.onUpdateSettings(null, 'url');
			}).toThrow();
		});



		it('should call insert', function () {
			spyOn(Collections.Settings, 'findOne').and.callFake(function () { return null; });
			spyOn(Collections.Settings, 'insert').and.callFake(function () { return '1'; });

			spyOn(s, 'isBlank').and.callFake(function () { return true; });

			Controllers.Settings.onInsertSettings('Server Name', 'http://lhost2:80');

			expect(Collections.Settings.insert).toHaveBeenCalledWith({ name: 'Server Name', type: 'teamcity', url: 'http://lhost2:80', user: false, password: false});
		});
	});

	describe('onUpdateSettings()', function () {
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
				Controllers.Settings.onUpdateSettings(null, 'url');
			}).toThrow();
		});

		it('should throw if name is not passed', function () {
			expect(function () {
				Controllers.Settings.onUpdateSettings('id', null, 'url');
			}).toThrow();
		});

		it('should throw if url is not passed', function () {
			expect(function () {
				Controllers.Settings.onUpdateSettings('id', 'name');
			}).toThrow();
		});

		it('should call update if a current record exists', function () {
			spyOn(s, 'isBlank').and.callFake(function () { return false; });

			spyOn(Collections.Settings, 'update').and.callFake(function () { return true; });

			Controllers.Settings.onUpdateSettings('2', 'New server', 'http://newhost:80', 'tcUser', 'tcPass');

			expect(Collections.Settings.update).toHaveBeenCalledWith({_id: '2'}, {$set: {name: 'New server', type: 'teamcity',url: 'http://newhost:80', user: 'tcUser', password: 'tcPass'}});
		});

	});
});
