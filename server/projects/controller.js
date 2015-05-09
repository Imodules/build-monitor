/**
 * Created by paul on 4/24/15.
 */

'use strict';
Controllers.Projects = (function () {
	function AddBuild(serverId, projectId, serviceBuildId, name, url) {
		return Collections.Builds.upsert({
			serverId: serverId,
			projectId: projectId,
			serviceBuildId: serviceBuildId
		}, {
			$set: {
				name: name,
				url: url
			}
		}, {multi: false});
	}

	function AddProject(serverId, parentId, projectId, name, url) {
		return Collections.Projects.upsert({
			serverId: serverId,
			parentId: parentId,
			projectId: projectId
		}, {
			$set: {
				name: name,
				url: url
			}
		}, {multi: false});
	}

	function RemoveByServerId(serverId) {
		Collections.Projects.remove({serverId: serverId});
	}

	return {
		onAddProject: AddProject,
		onAddBuild: AddBuild,
		onRemoveByServerId: RemoveByServerId
	};
})();
