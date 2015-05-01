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

	// TODO: Unit test
	function StartRunningBuilds(serverId, hasActiveBuilds) {
		var serverTimerHandle = _.find(currentBuildServerTimerHandles, function (s) { return s.serverId === serverId; });

		if (hasActiveBuilds && !serverTimerHandle) {
			console.log('Starting running build timer for server: ' + serverId);
			var id = Meteor.setInterval(function () {
				RunningBuildQueryInterval(serverId);
			}, CURRENT_BUILD_STATUS_QUERY_MS);

			currentBuildServerTimerHandles.push({serverId: serverId, timerId: id});

		} else if(!hasActiveBuilds && serverTimerHandle) {
			console.log('Stopping running build timer for server: ' + serverId);
			Meteor.clearInterval(serverTimerHandle.timerId);
			currentBuildServerTimerHandles = _.reject(currentBuildServerTimerHandles, function(s) { return s.serverId === serverId; });

			// one last call to make sure everything has their final state.
			RunningBuildQueryInterval(serverId);
		}
	}

	function BuildQueryInterval() {
		var servers = Collections.Servers.find();
		servers.forEach(function (server) {
			var service = Services.Factory.getService(server);
			service.queryRunningBuilds(StartRunningBuilds);
		});
	}

	// TODO: Unit test
	function RunningBuildQueryInterval(serverId) {
		console.log('Running build timer for server: ' + serverId);

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
		onStartRunningBuilds: StartRunningBuilds,
		onRunningBuildQueryInterval: RunningBuildQueryInterval
	};
})();

Meteor.startup(function () {
	Controllers.Server.onStartUp();
	Controllers.Server.onRefreshActiveBuilds();
});
