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

	function GetBuild(buildId) {
		return Collections.Builds.findOne({_id: buildId}, {transform: _transform});
	}

	function GetActiveServerBuilds(serverId) {
		return Collections.Builds.find(
				{serverId: serverId, displayCounter: {$gt: 0}},
				{fields: {serviceBuildId: 1}, transform: _transform}
		);
	}

	function GetBuildByServiceId(serverId, serviceBuildId) {
		return Collections.Builds.findOne(
				{serverId: serverId, serviceBuildId: serviceBuildId},
				{transform: _transform}
		);
	}

	function GetRunningServerBuilds(serverId) {
		return Collections.Builds.find(
				{serverId: serverId, isBuilding: true},
				{fields: {serviceBuildId: 1}, transform: _transform}
		);
	}

	function GetAllByProjectId(projectId) {
		return Collections.Builds.find({projectId: projectId}, {transform: _transform});
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
		getBuild: GetBuild,
		getActiveServerBuilds: GetActiveServerBuilds,
		getBuildByServiceId: GetBuildByServiceId,
		getRunningServerBuilds: GetRunningServerBuilds,

		getAllByProjectId: GetAllByProjectId,

		onRemoveByServerId: RemoveByServerId
	};
})();
