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

	describe('onStartRunningBuildsTimer()', function () {
		it('should start the timer', function () {
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) {
				cb();
				return {obj: 'someid'};
			});

			spyOn(Controllers.Server, 'onRunningBuildQueryInterval');

			Controllers.Server.onStartRunningBuildsTimer('SweetServerId');

			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 5000);
			expect(Controllers.Server.onRunningBuildQueryInterval).toHaveBeenCalledWith('SweetServerId');
		});
	});

	describe('onStopRunningBuildsTimer()', function () {
		it('should stop the timer', function () {
			spyOn(Meteor, 'clearInterval');
			spyOn(Meteor, 'setInterval').and.callFake(function () {
				return {obj: 'HelloSweety'};
			});

			spyOn(Controllers.Server, 'onRunningBuildQueryInterval');

			// Testing it this way so we ensure we are adding and remove from the internal array.
			Controllers.Server.onStartRunningBuildsTimer('SweetServerId3');
			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 5000);
			Controllers.Server.onCheckRunningBuildsTimer('SweetServerId3', false);

			expect(Meteor.clearInterval).toHaveBeenCalledWith({obj: 'HelloSweety'});
			expect(Controllers.Server.onRunningBuildQueryInterval).toHaveBeenCalledWith('SweetServerId3');
		});
	});

	describe('onCheckRunningBuildsTimer()', function () {
		it('should start the timer if we have builds and an existing timer does not exist', function () {
			spyOn(_, 'find').and.callFake(function () { return undefined; });

			spyOn(Controllers.Server, 'onStartRunningBuildsTimer');
			spyOn(Controllers.Server, 'onStopRunningBuildsTimer');

			Controllers.Server.onCheckRunningBuildsTimer('CoolSrvId', true);

			expect(Controllers.Server.onStopRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Server.onStartRunningBuildsTimer).toHaveBeenCalledWith('CoolSrvId');
		});

		it('should not start the timer if we have builds and an existing timer does exist', function () {
			spyOn(_, 'find').and.callFake(function () { return { serverId: 'CoolSrvId2', timerId: 'Kids'}; });

			spyOn(Controllers.Server, 'onStartRunningBuildsTimer');
			spyOn(Controllers.Server, 'onStopRunningBuildsTimer');

			Controllers.Server.onCheckRunningBuildsTimer('CoolSrvId2', true);

			expect(Controllers.Server.onStopRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Server.onStartRunningBuildsTimer).not.toHaveBeenCalled();
		});

		it('should remove the timer if we no longer have builds and the timer exists', function () {
			spyOn(_, 'find').and.callFake(function () { return { serverId: 'CoolSrvId3', timerId: 'Kiddos'}; });

			spyOn(Controllers.Server, 'onStartRunningBuildsTimer');
			spyOn(Controllers.Server, 'onStopRunningBuildsTimer');
			spyOn(Controllers.Server, 'onRunningBuildQueryInterval');

			Controllers.Server.onCheckRunningBuildsTimer('CoolSrvId3', false);

			expect(Controllers.Server.onStopRunningBuildsTimer).toHaveBeenCalledWith({ serverId: 'CoolSrvId3', timerId: 'Kiddos'});
			expect(Controllers.Server.onStartRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Server.onRunningBuildQueryInterval).toHaveBeenCalledWith('CoolSrvId3');
		});

		it('should not remove the timer if we no longer have builds and the timer does not exists', function () {
			spyOn(_, 'find').and.callFake(function () { return undefined; });

			spyOn(Controllers.Server, 'onStartRunningBuildsTimer');
			spyOn(Controllers.Server, 'onStopRunningBuildsTimer');
			spyOn(Controllers.Server, 'onRunningBuildQueryInterval');

			Controllers.Server.onCheckRunningBuildsTimer('CoolSrvId3', false);

			expect(Controllers.Server.onStopRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Server.onStartRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Server.onRunningBuildQueryInterval).not.toHaveBeenCalled();
		});
	});

	describe('OnRunningBuildQueryInterval()', function () {
		it('should query for all active builds by server and get updated details', function () {
			spyOn(Collections.BuildTypes, 'find').and.callFake(function () {
				return [
					{_id: 'ab12', currentBuildHref: '/guestAuth/something/cool/id:456'},
					{_id: 'cd13', currentBuildHref: '/guestAuth/something/cool/id:897'}
				];
			});
			spyOn(Collections.Servers, 'findOne').and.callFake(function () {
				return {_id: 'SeverId', url: 'http://example.com/bs1', type: 'teamcity'};
			});

			spyOn(Services.TeamCity.prototype, 'getCurrentBuildStatus');

			Controllers.Server.onRunningBuildQueryInterval('SeverId');

			expect(Collections.BuildTypes.find).toHaveBeenCalledWith(
					{serverId: 'SeverId', isBuilding: true},
					{fields: {currentBuildHref: 1}}
			);

			expect(Services.TeamCity.prototype.getCurrentBuildStatus.calls.count()).toBe(2);
		});
	});
});
