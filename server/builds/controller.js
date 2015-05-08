/**
 * Created by paul on 5/1/15.
 */

'use strict';
Controllers.Builds = (function () {

	//region Private
	function _transform(doc) {
		return new Models.Build(doc);
	}
	//endregion

	function GetActiveServerBuilds(serverId) {
		return Collections.Builds.find(
				{serverId: serverId, isBuilding: true},
				{fields: {serviceBuildId: 1}, transform: _transform}
		);
	}

	/**
	 *
	 * @param {{id: string, href: string,
	 * isLastBuildSuccess: boolean, isCurrentSuccess: boolean, isBuilding: boolean,
	 * percentageComplete: number, statusText: string, startDateTime: Date, finishDateTime: Date
	 * }} json
	 * @constructor
	 */
	function UpdateBuildStatus(json) {
		var upd = {
			currentBuild: {
				href: json.href,
				pctComplete: json.percentageComplete,
				statusText: json.statusText
			}
		};

		if (json.isLastBuildSuccess && !json.isCurrentSuccess) {
			upd.isLastBuildSuccess = false;
			upd['builds.0.isSuccess'] = json.isCurrentSuccess;
		}

		if (!json.isBuilding) {
			upd.isBuilding = false;
			upd['builds.0.isBuilding'] = false;

			upd.isLastBuildSuccess = json.isCurrentSuccess;
			upd['builds.0.isSuccess'] = json.isCurrentSuccess;

			upd['builds.0.startDate'] = json.startDateTime;
			upd['builds.0.finishDate'] = json.finishDateTime;
		}

		Collections.Builds.update({_id: json.id},
				{$set: upd},
				{multi: false});
	}

	/**
	 *
	 * @param {{serverId: string, serviceBuildId: string, bhItem: Models.BuildHistory, percentComplete: Number}} json
	 */
	function StartBuild(json) {
		var bh = json.bhItem.json,
				bt = Collections.Builds.findOne({serverId: json.serverId, serviceBuildId: json.serviceBuildId},
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
						isBuilding: true, currentBuild: {pctComplete: json.percentComplete, href: bh.href}, builds: bt.builds
					}
				},
				{multi: false});
	}

	function UpdateBuildHistory(serverId, serviceBuildId, isLastSuccess, isBuilding, buildHistories) {
		var historyJson = _.map(buildHistories, function (hist) {
			return hist.json;
		});

		Collections.Builds.update({serverId: serverId, serviceBuildId: serviceBuildId},
				{
					$set: {
						isLastBuildSuccess: isLastSuccess,
						isBuilding: isBuilding,
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
		getActiveServerBuilds: GetActiveServerBuilds,



		onUpdateBuildStatus: UpdateBuildStatus,
		onStartBuild: StartBuild,
		onUpdateBuildHistory: UpdateBuildHistory,
		onMyBuildDisplayHasChanged: MyBuildDisplayHasChanged,
		onRemoveByServerId: RemoveByServerId
	};
})();
