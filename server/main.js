/**
 * Created by paul on 4/29/15.
 */

'use strict';

// TODO: This won't work too well if we have multiple server instances.
// TODO: Add a configuration option to indicate if this is the main server instance, or...
// TODO: Create a second server only app / node server that just the timers.

var RUNNING_BUILD_QUERY_MS = 20000,
		CURRENT_BUILD_STATUS_QUERY_MS = 5000;

Controllers.Server = (function () {
	var buildQueryHandle = false,
			currentBuildServerTimerHandles = [];

	function StartRunningBuildsTimer(serverId) {
		console.log('Starting running build timer for server: ' + serverId);
		var id = Meteor.setInterval(function () {
			Controllers.Server.onRunningBuildQueryInterval(serverId);
		}, CURRENT_BUILD_STATUS_QUERY_MS);

		currentBuildServerTimerHandles.push({serverId: serverId, timerId: id});
	}

	function StopRunningBuildsTimer(serverId) {
		console.log('Stopping running build timer for server: ' + serverId);
		var serverTimerHandle = _.find(currentBuildServerTimerHandles, function (s) { return s.serverId === serverId; });

		Meteor.clearInterval(serverTimerHandle.timerId);
		currentBuildServerTimerHandles = _.reject(currentBuildServerTimerHandles, function(s) { return s.serverId === serverTimerHandle.serverId; });
	}

	function CheckRunningBuildsTimer(serverId, hasActiveBuilds) {
		var serverTimerHandle = _.find(currentBuildServerTimerHandles, function (s) { return s.serverId === serverId; });

		if (hasActiveBuilds && !serverTimerHandle) {
			Controllers.Server.onStartRunningBuildsTimer(serverId);
		}
	}

	function BuildQueryInterval() {
		var servers = Collections.Servers.find();
		servers.forEach(function (server) {
			var service = Services.Factory.getService(server);
			service.queryRunningBuilds(CheckRunningBuildsTimer);
		});
	}

	function RunningBuildQueryInterval(serverId) {
		console.log('Running build timer for server: ' + serverId);

		var server = Collections.Servers.findOne({_id: serverId});
		var service = Services.Factory.getService(server);

		var builds = Collections.BuildTypes.find({serverId: serverId, isBuilding: true}, {fields: {currentBuildHref: 1, isLastBuildSuccess: 1}}).fetch();

		if (builds.length === 0) {
			Controllers.Server.onStopRunningBuildsTimer(serverId);
			return;
		}

		builds.forEach(function (build) {
			service.getCurrentBuildStatus(build, Controllers.BuildTypes.onUpdateBuildStatus);
		});
	}

	function Startup() {
		if (buildQueryHandle !== false) {
			Meteor.clearTimeout(buildQueryHandle);
			buildQueryHandle = false;
		}

		buildQueryHandle = Meteor.setInterval(BuildQueryInterval, RUNNING_BUILD_QUERY_MS);
	}

	function RefreshActiveBuilds() {
		var servers = Collections.Servers.find();
		servers.forEach(function (server) {
			var bts = Collections.BuildTypes.find({serverId: server._id, isDisplayed: true});
			bts.forEach(function (bt) {
				var service = Services.Factory.getService(server);
				service.refreshBuildHistory(bt.buildTypeId, 2);
			});
		});
	}

	return {
		onStartUp: Startup,
		onBuildQueryInterval: BuildQueryInterval,
		onRefreshActiveBuilds: RefreshActiveBuilds,
		onCheckRunningBuildsTimer: CheckRunningBuildsTimer,
		onRunningBuildQueryInterval: RunningBuildQueryInterval,
		onStartRunningBuildsTimer: StartRunningBuildsTimer,
		onStopRunningBuildsTimer: StopRunningBuildsTimer
	};
})();

Meteor.startup(function () {
	Controllers.Server.onStartUp();
	Controllers.Server.onRefreshActiveBuilds();
});
