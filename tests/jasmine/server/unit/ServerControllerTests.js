/**
 * Created by imod on 4/30/15.
 */

'use strict';
var buildTypes = [
	{
		"_id": "MynXcoAgvvXABnuqR",
		"serverId": "RrYPGtQSp2pZtGbW4",
		"projectId": "MBP",
		"buildTypeId": "MBP_AcceptanceTest",
		"name": "Acceptance Test",
		"url": "/httpAuth/app/rest/buildTypes/id:MBP_AcceptanceTest",
		"isDisplayed": true,
		"isLastBuildSuccess": true,
		"shortName": "MBP-Acc"
	},
	{
		"_id": "ZZATcsyXxy7ReQa9s",
		"serverId": "RrYPGtQSp2pZtGbW4",
		"projectId": "MBP",
		"buildTypeId": "MBP_UnitTestAndBundle",
		"name": "Unit Test and Bundle",
		"url": "/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle",
		"isDisplayed": true,
		"isLastBuildSuccess": false,
		"shortName": "MBP-UT&B"
	}
];
describe('Controllers.Server', function () {
	describe('onStartUp()', function () {
		it('should start the build query interval timer', function () {
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) {
				cb();
			});

			spyOn(Collections.Servers, 'find').and.callFake(function () {
				return [
					{_id: 'srvId1', url: 'http://example.com/bs', type: 'teamcity'},
					{_id: 'srvId2', url: 'http://example.com/bs', type: 'teamcity'}
				];
			});

			spyOn(Services.TeamCity.prototype, 'queryRunningBuilds');

			Controllers.Server.onStartUp();

			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 20000);
			expect(Collections.Servers.find).toHaveBeenCalled();
			expect(Services.TeamCity.prototype.queryRunningBuilds.calls.count()).toBe(2);
		});
	});

	describe('onRefreshActiveBuilds()', function () {
		it('should query the active builds and refresh the isLastBuildSuccess', function () {
			spyOn(Collections.Servers, 'find').and.callFake(function () {
				return [
					{_id: 'srvId1', url: 'http://example.com/bs1', type: 'teamcity'},
					{_id: 'srvId2', url: 'http://example.com/bs2', type: 'teamcity'}
				];
			});

			spyOn(Collections.BuildTypes, 'find').and.callFake(function () {
				return buildTypes;
			});

			spyOn(Services.TeamCity.prototype, 'refreshBuildHistory');

			Controllers.Server.onRefreshActiveBuilds();

			expect(Collections.Servers.find).toHaveBeenCalled();
			expect(Collections.BuildTypes.find.calls.count()).toBe(2);
			expect(Collections.BuildTypes.find).toHaveBeenCalledWith({serverId: 'srvId1', isDisplayed: true});
			expect(Collections.BuildTypes.find).toHaveBeenCalledWith({serverId: 'srvId2', isDisplayed: true});

			expect(Services.TeamCity.prototype.refreshBuildHistory.calls.count()).toBe(4);
			expect(Services.TeamCity.prototype.refreshBuildHistory)
					.toHaveBeenCalledWith('MBP_AcceptanceTest', 2);
			expect(Services.TeamCity.prototype.refreshBuildHistory)
					.toHaveBeenCalledWith('MBP_UnitTestAndBundle', 2);
		});
	});

	describe('onStartRunningBuilds', function () {
		it('should start the timer if we have builds and an existing timer does not exist', function () {

		});
	});
});
