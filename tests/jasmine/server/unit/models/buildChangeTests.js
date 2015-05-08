/**
 * Created by paul on 5/5/15.
 */

'use strict';

describe('Models', function () {
	describe('BuildChange()', function () {
		it('should parse the structure correctly and clean username', function () {
			var myDate = new Date();

			var model = new Models.BuildChange({
				'id': 217399,
				'version': 'c75d09f827f6',
				'username': 'local\\someuser',
				'date': myDate,
				'href': '/httpAuth/app/rest/changes/id:217399',
				'webLink': 'http://bs.example.com:100/viewModification.html?modId=217399&personal=false'
			});

			expect(model.username).toBe('someuser');
			expect(model.id).toBe(217399);
			expect(model.href).toBe('/httpAuth/app/rest/changes/id:217399');
			expect(model.date).toBe(myDate);

			expect(model.toJson()).toEqual({
				id: 217399,
				version: 'c75d09f827f6',
				href: '/httpAuth/app/rest/changes/id:217399',
				username: 'someuser',
				date: myDate
			});
		});
	});
});
