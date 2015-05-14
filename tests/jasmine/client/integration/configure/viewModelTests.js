/**
 * Created by paul on 5/3/15.
 */

'use strict';
//describe('ViewModels.Configure', function () {
//	var firstShortNameTestId = null,
//			firstIsOnTestId = null;
//
//	describe('onUpdateBuildTypeShortName()', function () {
//		beforeAll(function (done) {
//			Meteor.loginWithPassword('pstuartTester1@fwe.com', 'password1', function (err) {
//				// check if we have correctly logged in the system
//				expect(err).toBeUndefined();
//
//				Router.go('configure');
//				Tracker.afterFlush(done);
//			});
//		});
//
//		afterAll(function (done) {
//			Meteor.logout(function () {
//				done();
//			});
//		});
//
//		it('should insert a new record with the proper values', function (done) {
//			ViewModels.Configure.onUpdateBuildTypeShortName('MyClientTestBuild_01', 'mySweetShortName', function (err, id) {
//				expect(err).toBeUndefined();
//				expect(id).toBeTruthy();
//
//				var userId = Meteor.userId(),
//						myBuildItem = Collections.MyBuildDisplay.findOne({_id: id});
//
//				expect(myBuildItem).not.toBeFalsy();
//				expect(myBuildItem.userId).toBe(userId);
//				expect(myBuildItem.buildId).toBe('MyClientTestBuild_01');
//				expect(myBuildItem.shortName).toBe('mySweetShortName');
//
//				firstShortNameTestId = myBuildItem._id;
//				done();
//			});
//		});
//
//		it('should not create a new record for a different user.', function (done) {
//			Collections.MyBuildDisplay.insert({
//				userId: 'someOneElse', buildId: 'HereKittyKitty', isDisplayed: false, shortName: 'SomethingClever'
//			}, function (err, id) {
//
//				var myBuildItem = Collections.MyBuildDisplay.findOne({_id: id});
//				expect(myBuildItem).toBeUndefined();
//
//				done();
//			});
//		});
//
//		it('should update the name of an existing record', function (done) {
//			ViewModels.Configure.onUpdateBuildTypeShortName('MyClientTestBuild_01', 'MyNewNameHEre', function (err) {
//				expect(err).toBeUndefined();
//
//				var userId = Meteor.userId(),
//						myBuildItem = Collections.MyBuildDisplay.findOne({_id: firstShortNameTestId});
//
//				expect(myBuildItem).not.toBeFalsy();
//				expect(myBuildItem.userId).toBe(userId);
//				expect(myBuildItem.buildId).toBe('MyClientTestBuild_01');
//				expect(myBuildItem.shortName).toBe('MyNewNameHEre');
//
//				done();
//			});
//		});
//	});
//
//	describe('onUpdateDisplayToggle()', function () {
//		beforeAll(function (done) {
//			Meteor.loginWithPassword('pstuartTester1@fwe.com', 'password1', function (err) {
//				// check if we have correctly logged in the system
//				expect(err).toBeUndefined();
//
//				Router.go('configure');
//				Tracker.afterFlush(done);
//			});
//		});
//
//		afterAll(function (done) {
//			Meteor.logout(function () {
//				done();
//			});
//		});
//
//		it('should insert a new record with the proper value', function (done) {
//			ViewModels.Configure.onUpdateDisplayToggle('MyClientTestBuild_01', true, function (err, id) {
//				expect(err).toBeUndefined();
//				expect(id).toBeTruthy();
//
//				var userId = Meteor.userId(),
//						item = Collections.MyBuildDisplay.findOne({_id: id});
//
//				expect(item).not.toBeUndefined();
//				expect(item.userId).toBe(userId);
//				expect(item.shortName).toBeFalsy();
//				expect(item.isDisplayed).toBe(true);
//
//				firstIsOnTestId = item._id;
//				done();
//			});
//		});
//
//		it('should not modify the short name', function (done) {
//			ViewModels.Configure.onUpdateDisplayToggle('MyClientTestBuild_01', true, function (err) {
//				expect(err).toBeUndefined();
//
//				var userId = Meteor.userId(),
//						item = Collections.MyBuildDisplay.findOne({_id: firstShortNameTestId});
//
//				expect(item).not.toBeUndefined();
//				expect(item.userId).toBe(userId);
//				expect(item.shortName).toBe('MyNewNameHEre');
//				expect(item.isDisplayed).toBe(true);
//				done();
//			});
//		});
//	});
//});
