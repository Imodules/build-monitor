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
			spyOn(Controllers.Servers, 'getServer').and.callFake(function () {
				return new Models.Server({_id: 'SeverId', url: 'http://example.com/bs1', type: 'teamcity'});
			});
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			spyOn(Models.Server.prototype, 'updateRunningBuilds').and.callFake(function () { return true; });

			Controllers.Timer.onRunningBuildQueryInterval('SeverId');

			expect(Controllers.Servers.getServer).toHaveBeenCalledWith('SeverId');
			expect(Models.Server.prototype.updateRunningBuilds).toHaveBeenCalledWith(jasmine.any(Function));
			expect(Controllers.Timer.onStopRunningBuildsTimer).not.toHaveBeenCalled();
		});

		it('should call stop timer if no builds are running', function () {
			spyOn(Controllers.Servers, 'getServer').and.callFake(function () {
				return new Models.Server({_id: 'SeverId', url: 'http://example.com/bs1', type: 'teamcity'});
			});
			spyOn(Controllers.Timer, 'onStopRunningBuildsTimer');

			spyOn(Models.Server.prototype, 'updateRunningBuilds').and.callFake(function () { return false; });

			Controllers.Timer.onRunningBuildQueryInterval('SeverId');

			expect(Controllers.Servers.getServer).toHaveBeenCalledWith('SeverId');
			expect(Models.Server.prototype.updateRunningBuilds).toHaveBeenCalledWith(jasmine.any(Function));
		});
	});
});
