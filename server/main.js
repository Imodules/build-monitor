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
			statusQueryHandle = false;

	function BuildQueryInterval() {
		console.log('Build Query...');

		var servers = Collections.Servers.find();
		servers.forEach(function (server) {
			var service = Services.Factory.getService(server);
			service.queryRunningBuilds();
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
		onRefreshActiveBuilds: RefreshActiveBuilds
	};
})();

Meteor.startup(function () {
	Controllers.Server.onStartUp();
	Controllers.Server.onRefreshActiveBuilds();
});
