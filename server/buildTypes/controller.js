/**
 * Created by paul on 5/1/15.
 */

'use strict';
Controllers.BuildTypes = (function () {
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

		Collections.BuildTypes.update({_id: id},
				{$set: upd},
				{multi: false});
	}

	function GetActiveServerBuilds(serverId) {
		return Collections.BuildTypes.find(
				{serverId: serverId, isBuilding: true},
				{fields: {buildTypeId: 1}}
		).fetch();
	}

	function StartBuild(serverId, buildTypeId, bhItem, percentComplete) {
		var bh = bhItem.json,
				bt = Collections.BuildTypes.findOne({serverId: serverId, buildTypeId: buildTypeId},
						{fields: {builds: 1}});

		bt.builds.splice(0, 0, bh);
		while (bt.builds.length > 10) {
			bt.builds.pop();
		}

		Collections.BuildTypes.update({_id: bt._id},
				{$set: {
					isBuilding: true, currentBuild: {pctComplete: percentComplete, href: bh.href}, builds: bt.builds
				}},
				{multi: false});
	}

	function UpdateBuildHistory(serverId, buildTypeId, isLastSuccess, isBuilding, buildHistories) {
		var historyJson = _.map(buildHistories, function (hist) {
			return hist.json;
		});

		Collections.BuildTypes.update({serverId: serverId, buildTypeId: buildTypeId},
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
