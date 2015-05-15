/**
 * Created by paul on 5/3/15.
 */

'use strict';
describe('ViewModels.Configure', function () {
	var firstShortNameTestId = null;

	describe('onUpdateBuildTypeShortName()', function () {
		beforeAll(function (done) {
			Meteor.loginWithPassword('pstuartTester1@fwe.com', 'password1', function (err) {
				// check if we have correctly logged in the system
				expect(err).toBeUndefined();

				Router.go('configure');
				Tracker.afterFlush(done);
			});
		});

		afterAll(function (done) {
			Meteor.logout(function () {
				done();
			});
		});

		it('should insert a new record with the proper values', function (done) {
			ViewModels.Configure.onUpdateBuildTypeShortName('MyClientTestServer_01', 'MyClientTestBuild_01', 'mySweetShortName', function (err, id) {
				expect(err).toBeUndefined();
				expect(id).toBeTruthy();

				var userId = Meteor.userId(),
						myBuildItem = Collections.MyBuildDisplay.findOne({_id: id});

				expect(myBuildItem).not.toBeFalsy();
				expect(myBuildItem.userId).toBe(userId);
				expect(myBuildItem.serverId).toBe('MyClientTestServer_01');
				expect(myBuildItem.buildId).toBe('MyClientTestBuild_01');
				expect(myBuildItem.shortName).toBe('mySweetShortName');

				firstShortNameTestId = myBuildItem._id;
				done();
			});
		});

		it('should not create a new record for a different user.', function (done) {
			Collections.MyBuildDisplay.insert({
				serverId: 'MyClientTestServer_01', userId: 'someOneElse', buildId: 'HereKittyKitty', isDisplayed: false, shortName: 'SomethingClever'
			}, function (err, id) {

				var myBuildItem = Collections.MyBuildDisplay.findOne({_id: id});
				expect(myBuildItem).toBeUndefined();

				done();
			});
		});

		it('should update the name of an existing record', function (done) {
			ViewModels.Configure.onUpdateBuildTypeShortName('MyClientTestServer_01', 'MyClientTestBuild_01', 'MyNewNameHEre', function (err) {
				expect(err).toBeUndefined();

				var userId = Meteor.userId(),
						myBuildItem = Collections.MyBuildDisplay.findOne({_id: firstShortNameTestId});

				expect(myBuildItem).not.toBeFalsy();
				expect(myBuildItem.userId).toBe(userId);
				expect(myBuildItem.serverId).toBe('MyClientTestServer_01');
				expect(myBuildItem.buildId).toBe('MyClientTestBuild_01');
				expect(myBuildItem.shortName).toBe('MyNewNameHEre');

				done();
			});
		});
	});

	describe('onUpdateDisplayToggle()', function () {
		beforeAll(function (done) {
			Meteor.loginWithPassword('pstuartTester1@fwe.com', 'password1', function (err) {
				// check if we have correctly logged in the system
				expect(err).toBeUndefined();

				Router.go('configure');
				Tracker.afterFlush(done);
			});
		});

		afterAll(function (done) {
			Meteor.logout(function () {
				done();
			});
		});

		it('should add my user to the watchers', function (done) {
			spyOn(HTTP, 'get');

			ViewModels.Configure.onUpdateDisplayToggle('MyClientTestServer_01', 'MyClientTestBuild_02', true, function (err) {
				expect(err).toBeUndefined();

				var userId = Meteor.userId(),
						build = Collections.Builds.findOne({_id: 'MyClientTestBuild_02'});

				expect(build).not.toBeFalsy();
				expect(build.watchers.length).toBe(1);
				expect(build.watchers[0]).toBe(userId);
				done();
			});
		});

		it('should remove my user from the watchers', function (done) {
			spyOn(HTTP, 'get');
			ViewModels.Configure.onUpdateDisplayToggle('MyClientTestServer_01', 'MyClientTestBuild_02', false, function (err) {
				expect(err).toBeUndefined();

				var build = Collections.Builds.findOne({_id: 'MyClientTestBuild_02'});
				expect(build).not.toBeFalsy();
				expect(build.watchers.length).toBe(0);

				done();
			});
		});
	});
});
