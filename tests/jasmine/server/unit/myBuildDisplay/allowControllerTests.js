/**
 * Created by paul on 5/3/15.
 */

'use strict';
//describe('Controllers.MyBuildDisplayAllow', function () {
//	describe('onInsert()', function () {
//		beforeEach(function () {
//			spyOn(Meteor, 'userId').and.callFake(function () {
//				return 'MEUser32Again';
//			});
//		});
//
//		it('should return false if it is not my user updating', function () {
//			var isAllowed = Controllers.MyBuildDisplayAllow.onInsert('notMe');
//			expect(isAllowed).toBeFalsy();
//		});
//
//		it('should notify the controller that isDisplayed was set to true', function () {
//			spyOn(Controllers.Builds, 'onMyBuildDisplayHasChanged');
//
//			Controllers.MyBuildDisplayAllow.onInsert('MEUser32Again', {
//				buildId: 'MyDOCID',
//				shortName: 'shortABC',
//				isDisplayed: true
//			});
//
//			expect(Controllers.Builds.onMyBuildDisplayHasChanged).toHaveBeenCalledWith('MyDOCID', true);
//		});
//	});
//
//	describe('onUpdate()', function () {
//		beforeEach(function () {
//			spyOn(Meteor, 'userId').and.callFake(function () {
//				return 'MEUser10d';
//			});
//		});
//
//		it('should return false if it is not my user updating', function () {
//			var isAllowed = Controllers.MyBuildDisplayAllow.onUpdate('notMe');
//			expect(isAllowed).toBeFalsy();
//		});
//
//		it('should call the builds controller to notify it that an isDisplayed changed from false to true', function () {
//			spyOn(Controllers.Builds, 'onMyBuildDisplayHasChanged');
//
//			Controllers.MyBuildDisplayAllow.onUpdate('MEUser10d', {
//				isDisplayed: false,
//				buildId: 'BuildIdLiekFromDb'
//			}, [], {$set: {isDisplayed: true}});
//
//			expect(Controllers.Builds.onMyBuildDisplayHasChanged).toHaveBeenCalledWith('BuildIdLiekFromDb', true);
//		});
//
//		it('should call the builds controller to notify it that an isDisplayed changed from true to false', function () {
//			spyOn(Controllers.Builds, 'onMyBuildDisplayHasChanged');
//
//			Controllers.MyBuildDisplayAllow.onUpdate('MEUser10d', {
//				isDisplayed: true,
//				buildId: 'adfdfa45444 dafd'
//			}, [], {$set: {isDisplayed: false}});
//
//			expect(Controllers.Builds.onMyBuildDisplayHasChanged).toHaveBeenCalledWith('adfdfa45444 dafd', false);
//		});
//
//		it('should not call the builds controller if isDisplayed was not changed', function () {
//			spyOn(Controllers.Builds, 'onMyBuildDisplayHasChanged');
//
//			Controllers.MyBuildDisplayAllow.onUpdate('MEUser10d', {
//				isDisplayed: true,
//				buildId: '1144 cfff'
//			}, [], {$set: {isDisplayed: true}});
//
//			expect(Controllers.Builds.onMyBuildDisplayHasChanged).not.toHaveBeenCalled();
//		});
//	});
//});
