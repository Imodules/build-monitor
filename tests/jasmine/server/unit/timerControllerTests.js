/**
 * Created by imod on 4/30/15.
 */

'use strict';
var buildTypes = [
	{
		"_id": "MynXcoAgvvXABnuqR",
		"serverId": "RrYPGtQSp2pZtGbW4",
		"projectId": "MBP",
		"serviceBuildId": "MBP_AcceptanceTest",
		"name": "Acceptance Test",
		"url": "/httpAuth/app/rest/buildTypes/id:MBP_AcceptanceTest",
		"shortName": "MBP-Acc"
	},
	{
		"_id": "ZZATcsyXxy7ReQa9s",
		"serverId": "RrYPGtQSp2pZtGbW4",
		"projectId": "MBP",
		"serviceBuildId": "MBP_UnitTestAndBundle",
		"name": "Unit Test and Bundle",
		"url": "/httpAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle",
		"shortName": "MBP-UT&B"
	}
];

describe('Controllers.Timer', function () {
	describe('onStartUp()', function () {
		it('should start the build query interval timer', function () {
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) {
				cb();
			});

			spyOn(Controllers.Servers, 'getServers').and.callFake(function () {
				return [
					new Models.Server({_id: 'srvId1', url: 'http://example.com/bs', type: 'teamcity'}),
					new Models.Server({_id: 'srvId2', url: 'http://example.com/bs', type: 'teamcity'})
				];
			});

			spyOn(Models.Server.prototype, 'queryRunningBuilds');

			Controllers.Timer.onStartUp();

			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 20000);
			expect(Controllers.Servers.getServers).toHaveBeenCalled();
			expect(Models.Server.prototype.queryRunningBuilds.calls.count()).toBe(2);
		});
	});

	describe('onStartRunningBuildsTimer()', function () {
		it('should start the timer', function () {
			spyOn(Meteor, 'setInterval').and.callFake(function (cb) {
				cb();
				return {obj: 'someid'};
			});

			spyOn(Controllers.Timer, 'onRunningBuildQueryInterval');

			Controllers.Timer.onStartRunningBuildsTimer('SweetServerId');

			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 5000);
			expect(Controllers.Timer.onRunningBuildQueryInterval).toHaveBeenCalledWith('SweetServerId');
		});
	});

	describe('onStopRunningBuildsTimer()', function () {
		it('should stop the timer', function () {
			spyOn(Meteor, 'clearInterval');
			spyOn(Meteor, 'setInterval').and.callFake(function () {
				return {obj: 'HelloSweety'};
			});
			spyOn(_, 'find').and.callFake(function () { return { serverId: 'SweetServerId3', timerId: {obj: 'HelloSweety'}}; });

			spyOn(Controllers.Timer, 'onRunningBuildQueryInterval');

			// Testing it this way so we ensure we are adding and remove from the internal array.
			Controllers.Timer.onStartRunningBuildsTimer('SweetServerId3');
			expect(Meteor.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 5000);
			Controllers.Timer.onStopRunningBuildsTimer('SweetServerId3');

			expect(Meteor.clearInterval).toHaveBeenCalledWith({obj: 'HelloSweety'});
		});
	});

	describe('onCheckRunningBuildsTimer()', function () {
		it('should start the timer if we have builds and an existing timer does not exist', function () {
			spyOn(_, 'find').and.callFake(function () { return undefined; });

			spyOn(Controllers.Timer, 'onStartRunningBuildsTimer');
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			Controllers.Timer.onCheckRunningBuildsTimer('CoolSrvId', true);

			expect(Controllers.Timer.onStopRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Timer.onStartRunningBuildsTimer).toHaveBeenCalledWith('CoolSrvId');
		});

		it('should not start the timer if we have builds and an existing timer does exist', function () {
			spyOn(_, 'find').and.callFake(function () { return { serverId: 'CoolSrvId2', timerId: 'Kids'}; });

			spyOn(Controllers.Timer, 'onStartRunningBuildsTimer');
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			Controllers.Timer.onCheckRunningBuildsTimer('CoolSrvId2', true);

			expect(Controllers.Timer.onStopRunningBuildsTimer).not.toHaveBeenCalled();
			expect(Controllers.Timer.onStartRunningBuildsTimer).not.toHaveBeenCalled();
		});
	});

	describe('OnRunningBuildQueryInterval()', function () {
		it('should query for all active builds by server and get updated details', function () {
			spyOn(Collections.Builds, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [
							{_id: 'ab12', currentBuild: {href: '/guestAuth/something/cool/id:456'}, isLastBuildSuccess: true},
							{_id: 'cd13', currentBuild: {href: '/guestAuth/something/cool/id:897'}, isLastBuildSuccess: false}
						];
					}
				};
			});
			spyOn(Collections.Servers, 'findOne').and.callFake(function () {
				return {_id: 'SeverId', url: 'http://example.com/bs1', type: 'teamcity'};
			});

			spyOn(Services.TeamCity.prototype, 'getCurrentBuildStatus');

			Controllers.Timer.onRunningBuildQueryInterval('SeverId');

			expect(Collections.Builds.find).toHaveBeenCalledWith(
					{serverId: 'SeverId', isBuilding: true},
					{fields: {currentBuild: 1, isLastBuildSuccess: 1}}
			);

			expect(Services.TeamCity.prototype.getCurrentBuildStatus.calls.count()).toBe(2);
			expect(Services.TeamCity.prototype.getCurrentBuildStatus).toHaveBeenCalledWith({_id: 'ab12', currentBuild: {href: '/guestAuth/something/cool/id:456'}, isLastBuildSuccess: true}, jasmine.any(Function));
			expect(Services.TeamCity.prototype.getCurrentBuildStatus).toHaveBeenCalledWith({_id: 'cd13', currentBuild: {href: '/guestAuth/something/cool/id:897'}, isLastBuildSuccess: false}, jasmine.any(Function));
		});

		it('should stop the timer if no more active builds', function () {
			spyOn(Collections.Builds, 'find').and.callFake(function () {
				return {
					fetch: function () {
						return [];
					}
				};
			});
			spyOn(Collections.Servers, 'findOne').and.callFake(function () {
				return {_id: 'SeverId', url: 'http://example.com/bs1', type: 'teamcity'};
			});

			spyOn(Services.TeamCity.prototype, 'getCurrentBuildStatus');
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			Controllers.Timer.onRunningBuildQueryInterval('SeverId');

			expect(Services.TeamCity.prototype.getCurrentBuildStatus).not.toHaveBeenCalled();
			expect(Controllers.Timer.onStopRunningBuildsTimer).toHaveBeenCalledWith('SeverId');
		});
	});
});
