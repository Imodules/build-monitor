/**
 * Created by paul on 5/1/15.
 */

'use strict';
Controllers.Builds = (function () {
	// TODO: Too many parameters. Fix.
	function UpdateBuildStatus(id, href, isLastBuildSuccess, isCurrentSuccess, isBuilding, percentageComplete, statusText, startDateTime, finishDateTime) {
		var upd = {
			currentBuild: {
				href: href,
				pctComplete: percentageComplete,
				statusText: statusText,
				started: startDateTime
			}
		};

		if (isLastBuildSuccess && !isCurrentSuccess) {
			upd.isLastBuildSuccess = false;
		}

		if (!isBuilding) {
			upd.isBuilding = false;
			upd['builds.0.isBuilding'] = false;

			upd.isLastBuildSuccess = isCurrentSuccess;
			upd['builds.0.isSuccess'] = isCurrentSuccess;

			// TODO: THese dates are in 3 places, clean that up.
			upd.currentBuild.finished = finishDateTime;
			upd['builds.0.finished'] = finishDateTime;

			upd['builds.0.started'] = startDateTime;
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

		if (!bt.builds) {
			bt.builds = [];
		}

		bt.builds.splice(0, 0, bh);
		while (bt.builds.length > 10) {
			bt.builds.pop();
		}

		Collections.Builds.update({_id: bt._id},
				{
					$set: {
						isBuilding: true, currentBuild: {pctComplete: percentComplete, href: bh.href}, builds: bt.builds
					}
				},
				{multi: false});
	}

	function UpdateBuildHistory(serverId, serviceBuildId, isLastSuccess, isBuilding, buildHistories) {
		var lastStartDate, lastFinishDate;

		if (buildHistories.length > 0) {
			lastStartDate = buildHistories[0].startDate;
			lastFinishDate = buildHistories[0].finishDate;
		}

		var historyJson = _.map(buildHistories, function (hist) {
			return hist.json;
		});

		Collections.Builds.update({serverId: serverId, serviceBuildId: serviceBuildId},
				{
					$set: {
						isLastBuildSuccess: isLastSuccess,
						isBuilding: isBuilding,
						lastStartDate: lastStartDate,
						lastFinishDate: lastFinishDate,
						builds: historyJson
					}
				},
				{multi: false});
	}

	function MyBuildDisplayHasChanged(buildId, isDisplayed) {
		var build = Collections.Builds.findOne({_id: buildId});
		if (!build) {
			console.log('MyBuildDisplayHasChanged(): Couldn not find build: ' + buildId);
			return;
		}

		if (!build.isDisplayed && isDisplayed) {
			Collections.Builds.update({_id: buildId}, {$set: {isDisplayed: true}});
			var server = Collections.Servers.findOne({_id: build.serverId}),
					service = Services.Factory.getService(server);
			service.refreshBuildHistory(build.serviceBuildId, 10);
		} else if (build.isDisplayed && !isDisplayed) {
			var count = Controllers.MyBuildDisplay.onGetBuildDisplayCount(buildId);
			// It will still find at least 1 here because the caller has not updated theirs yet.
			if (count <= 1) {
				Collections.Builds.update({_id: buildId}, {$set: {isDisplayed: false}});
			}
		}
	}

	function RemoveByServerId(serverId) {
		var builds = Collections.Builds.find({serverId: serverId}, {fields: {_id: 1}}).fetch();

		builds.forEach(function (build) {
			Controllers.MyBuildDisplay.onRemoveByBuildId(build._id);
		});

		console.log('Removing Builds');
		Collections.Builds.remove({serverId: serverId});
	}

	return {
		onUpdateBuildStatus: UpdateBuildStatus,
		onGetActiveServerBuilds: GetActiveServerBuilds,
		onStartBuild: StartBuild,
		onUpdateBuildHistory: UpdateBuildHistory,
		onMyBuildDisplayHasChanged: MyBuildDisplayHasChanged,
		onRemoveByServerId: RemoveByServerId
	};
})();
