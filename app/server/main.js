'use strict';
Controllers.main = (function () {

	function RefreshActiveBuilds() {
		var servers = Controllers.Servers.getServers();

		servers.forEach(function (server) {
			server.refreshActiveBuildData();
		});
	}

	return {
		onRefreshActiveBuilds: RefreshActiveBuilds
	};
})();

Meteor.startup(function () {
	Controllers.main.onRefreshActiveBuilds();
	Controllers.Timer.onStartUp();
});
