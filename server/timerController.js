/**
 * Created by imod on 5/8/15.
 */

'use strict';


// TODO: This won't work too well if we have multiple server instances.
// TODO: Add a configuration option to indicate if this is the main server instance, or...
// TODO: Create a second server only app / node server that just the timers.

var RUNNING_BUILD_QUERY_MS = 20000,
		CURRENT_BUILD_STATUS_QUERY_MS = 5000;

Controllers.Timer = (function () {
	var buildQueryHandle = false,
			currentBuildServerTimerHandles = [];

	function StartRunningBuildsTimer(serverId) {
		if (!process.env.IS_MIRROR) {
			console.log('Starting running build timer for server: ' + serverId);

			var id = Meteor.setInterval(function () {
				Controllers.Timer.onRunningBuildQueryInterval(serverId);
			}, CURRENT_BUILD_STATUS_QUERY_MS);

			currentBuildServerTimerHandles.push({serverId: serverId, timerId: id});
		}
	}

	function StopRunningBuildsTimer(serverId) {
		console.log('Stopping running build timer for server: ' + serverId);
		var serverTimerHandle = _.find(currentBuildServerTimerHandles, function (s) {
			return s.serverId === serverId;
		});

		Meteor.clearInterval(serverTimerHandle.timerId);
		currentBuildServerTimerHandles = _.reject(currentBuildServerTimerHandles, function (s) {
			return s.serverId === serverTimerHandle.serverId;
		});
	}

	function CheckRunningBuildsTimer(serverId, hasActiveBuilds) {
		var serverTimerHandle = _.find(currentBuildServerTimerHandles, function (s) {
			return s.serverId === serverId;
		});

		if (hasActiveBuilds && !serverTimerHandle) {
			Controllers.Timer.onStartRunningBuildsTimer(serverId);
		}
	}


	/**
	 * This will be called every CURRENT_BUILD_STATUS_QUERY_MS to update the status
	 * of the running builds.
	 *
	 * @param serverId
	 * @constructor
	 */
	function RunningBuildQueryInterval(serverId) {
		console.log('Running build timer for server: ' + serverId);

		var server = Controllers.Servers.getServer(serverId);
		if (!server.updateRunningBuilds(CheckRunningBuildsTimer)) {
			Controllers.Timer.onStopRunningBuildsTimer(serverId);
		}
	}

	function PollInterval() {
		var servers = Controllers.Servers.getServers();
		servers.forEach(function (server) {
			server.queryRunningBuilds(CheckRunningBuildsTimer);
		});
	}

	function Startup() {
		if (buildQueryHandle !== false) {
			Meteor.clearTimeout(buildQueryHandle);
			buildQueryHandle = false;
		}

		if (!process.env.IS_MIRROR) {
			buildQueryHandle = Meteor.setInterval(PollInterval, RUNNING_BUILD_QUERY_MS);
		}
	}

	return {
		onStartUp: Startup,
		onStartRunningBuildsTimer: StartRunningBuildsTimer,
		onStopRunningBuildsTimer: StopRunningBuildsTimer,
		onRunningBuildQueryInterval: RunningBuildQueryInterval,
		onCheckRunningBuildsTimer: CheckRunningBuildsTimer,
		onPollInterval: PollInterval
	};
})();
