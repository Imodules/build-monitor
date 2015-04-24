/**
 * Created by paul on 4/23/15.
 */

'use strict';
var s = {
	isBlank: function () {}
};

describe('Controllers.Settings', function () {
	describe('onUpdateSettings()', function () {
		it('should throw if url is not passed', function () {
			expect(function () {
				Controllers.Settings.onUpdateSettings();
			}).toThrow();
		});

		it('should call insert if no current record exists', function () {
			spyOn(Collections.Settings, 'findOne').and.callFake(function () { return null; });
			spyOn(Collections.Settings, 'insert').and.callFake(function () { return '1'; });

			spyOn(s, 'isBlank').and.callFake(function () { return true; });

			Controllers.Settings.onUpdateSettings('http://lhost2:80');

			expect(Collections.Settings.findOne).toHaveBeenCalledWith();
			expect(Collections.Settings.insert).toHaveBeenCalledWith({teamCity: {url: 'http://lhost2:80', user: false, password: false}});
		});

		it('should call update if a current record exists', function () {
			spyOn(s, 'isBlank').and.callFake(function () { return false; });

			spyOn(Collections.Settings, 'findOne').and.callFake(function () {
				return {
					_id: '2',
					teamCity: {
						url: 'http://oldurl', user: 'olduser', password: 'oldpassword'
					}
				};
			});
			spyOn(Collections.Settings, 'insert');
			spyOn(Collections.Settings, 'update').and.callFake(function () { return true; });

			Controllers.Settings.onUpdateSettings('http://newhost:80', 'tcUser', 'tcPass');

			expect(Collections.Settings.findOne).toHaveBeenCalledWith();
			expect(Collections.Settings.insert).not.toHaveBeenCalledWith();
			expect(Collections.Settings.update).toHaveBeenCalledWith({_id: '2'}, {$set: {teamCity: {url: 'http://newhost:80', user: 'tcUser', password: 'tcPass'}}});
		});

	});
});
