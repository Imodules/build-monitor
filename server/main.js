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
		var self = this;
		console.log('Starting running build timer for server: ' + serverId);
		var id = Meteor.setInterval(function () {
			self.onRunningBuildQueryInterval(serverId);
		}, CURRENT_BUILD_STATUS_QUERY_MS);

		currentBuildServerTimerHandles.push({serverId: serverId, timerId: id});
	}

	function StopRunningBuildsTimer(serverTimerHandle) {
		console.log('Stopping running build timer for server: ' + serverTimerHandle.serverId);
		Meteor.clearInterval(serverTimerHandle.timerId);
		currentBuildServerTimerHandles = _.reject(currentBuildServerTimerHandles, function(s) { return s.serverId === serverTimerHandle.serverId; });
	}

	function CheckRunningBuildsTimer(serverId, hasActiveBuilds) {
		var serverTimerHandle = _.find(currentBuildServerTimerHandles, function (s) { return s.serverId === serverId; });

		if (hasActiveBuilds && !serverTimerHandle) {
			this.onStartRunningBuildsTimer(serverId);
		} else if(!hasActiveBuilds && serverTimerHandle) {
			this.onStopRunningBuildsTimer(serverTimerHandle);
			// one last call to make sure everything has their final state.
			this.onRunningBuildQueryInterval(serverId);
		}
	}

	function BuildQueryInterval() {
		var servers = Collections.Servers.find();
		servers.forEach(function (server) {
			var service = Services.Factory.getService(server);
			service.queryRunningBuilds(CheckRunningBuildsTimer);
		});
	}

	// TODO: Unit test
	function RunningBuildQueryInterval(serverId) {
		console.log('Running build timer for server: ' + serverId);

		var server = Collections.Servers.findOne({_id: serverId});
		var service = Services.Factory.getService(server);

		var builds = Collections.BuildTypes.find({serverId: serverId, isBuilding: true}, {fields: {currentBuildHref: 1}});
		builds.forEach(function (build) {
			service.getCurrentBuildStatus();
		});

		// Call /httpAuth/app/rest/builds/id:673 which should be currentBuildHref for the build type.
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
