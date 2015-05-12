/**
 * Created by paul on 5/6/15.
 */

'use strict';

describe('_setupIntegration', function () {
	describe('create test server', function () {
		var serverId;

		beforeAll(function () {
			spyOn(Meteor, 'user').and.callFake(function () {
				return { isAdmin: true };
			});
		});

		beforeEach(function () {
			spyOn(Meteor, 'clearTimeout');
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) {
				cb();
			});
		});

		it('should create a new server', function () {
			serverId = Controllers.Servers.onSaveServer(null, 'SomeTestServer', 'http://test.example.com', 'notreal', 'fake');
			expect(serverId).toBeTruthy();
		});

		it('should update the server by id and find it by name', function () {
			Controllers.Servers.onSaveServer(serverId, 'teamcity.test.server', 'http://bs.example.com', 'N0ForRealz', 'StillFake');

			var server = Controllers.Servers.getServerByName('teamcity.test.server');
			expect(server._id).toBe(serverId);
			expect(server.name).toBe('teamcity.test.server');
			expect(server.url).toBe('http://bs.example.com');
			expect(server.user).toBe('N0ForRealz');
			expect(server.password).toBe('StillFake');
		});
	});
});
