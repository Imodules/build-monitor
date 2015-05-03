/**
 * Created by paul on 4/24/15.
 */

'use strict';
describe('Views.Servers', function () {
	describe('onAdd()', function () {

		beforeAll(function (done) {
			Meteor.loginWithPassword('pstuartTester1@fwe.com', 'password1', function(err) {
				// check if we have correctly logged in the system
				expect(err).toBeUndefined();

				Router.go('servers');
				Tracker.afterFlush(done);
			});
		});

		afterAll(function (done) {
			Meteor.logout(function () {
				done();
			});
		});

		it('should be able to add a new server', function (done) {
			ViewModels.Servers.onAdd('Cool Server Name', 'http://example.com/ViewTest', 'exUser', 'exPass', function () {
				expect($('#serverList > tbody > tr').length).toBe(1);
				expect($('#serverList > tbody > tr td:nth-child(1)').text()).toBe('teamcity');
				expect($('#serverList > tbody > tr td:nth-child(2)').text()).toBe('Cool Server Name');
				expect($('#serverList > tbody > tr td:nth-child(3)').text()).toBe('http://example.com/ViewTest');
				done();
			});
		});
	});
});
