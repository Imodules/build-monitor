/**
 * Created by paul on 5/1/15.
 */

'use strict';
Controllers.Builds = (function () {
	// TODO: Too many parameters. Fix.
	function UpdateBuildStatus(id, href, isLastBuildSuccess, isCurrentSuccess, isBuilding, percentageComplete, statusText) {
		var upd = {currentBuild: {href: href, pctComplete: percentageComplete, statusText: statusText}};

		if (isLastBuildSuccess && !isCurrentSuccess) {
			upd.isLastBuildSuccess = false;
		}

		if (!isBuilding) {
			upd.isBuilding = false;
			upd['builds.0.isBuilding'] = false;

			upd.isLastBuildSuccess = isCurrentSuccess;
			upd['builds.0.isSuccess'] = isCurrentSuccess;
		}

		Collections.Builds.update({_id: id},
				{$set: upd},
				{multi: false});
	}

	function GetActiveServerBuilds(serverId) {
		return Collections.Builds.find(
				{serverId: serverId, isBuilding: true},
				{fields: {serviceBuildId: 1}}
		).fetch();
	}

	function StartBuild(serverId, serviceBuildId, bhItem, percentComplete) {
		var bh = bhItem.json,
				bt = Collections.Builds.findOne({serverId: serverId, serviceBuildId: serviceBuildId},
						{fields: {builds: 1}});

		bt.builds.splice(0, 0, bh);
		while (bt.builds.length > 10) {
			bt.builds.pop();
		}

		Collections.Builds.update({_id: bt._id},
				{$set: {
					isBuilding: true, currentBuild: {pctComplete: percentComplete, href: bh.href}, builds: bt.builds
				}},
				{multi: false});
	}

	function UpdateBuildHistory(serverId, serviceBuildId, isLastSuccess, isBuilding, buildHistories) {
		var historyJson = _.map(buildHistories, function (hist) {
			return hist.json;
		});

		Collections.Builds.update({serverId: serverId, serviceBuildId: serviceBuildId},
				{$set: {isLastBuildSuccess: isLastSuccess, isBuilding: isBuilding, builds: historyJson}},
				{multi: false});
	}

	return {
		onUpdateBuildStatus: UpdateBuildStatus,
		onGetActiveServerBuilds: GetActiveServerBuilds,
		onStartBuild: StartBuild,
		onUpdateBuildHistory: UpdateBuildHistory
	};
})();
