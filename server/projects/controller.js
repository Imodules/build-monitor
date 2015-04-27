/**
 * Created by paul on 4/24/15.
 */

'use strict';
Controllers.Projects = (function () {
	/**
	 * Builds the ID.
	 *
	 * @private
	 */
	function _buildId(serverId, parentId, id) {
		return serverId + '-'
				+ (s.isBlank(parentId) ? '' : parentId + '-')
				+ id;
	}

	/**
	 * @return {boolean}
	 */
	function RefreshProjects(serverId) {
		// Get our server.
		var server = Collections.Servers.findOne({_id: serverId});
		if (!server) {
			throw new Error('Server not found for id: ' + serverId);
		}

		// Get our service.
		var service = Services.Factory.getService(server);

		// Call populate our projects.
		service.refreshFromServer(AddProject, AddBuildType);

		return true;
	}

	function AddBuildType(serverId, projectId, buildTypeId, name, url) {
		var myId = _buildId(serverId, projectId, buildTypeId);

		Collections.BuildTypes.upsert({_id: myId}, {$set: {
			serverId: serverId,
			projectId: projectId,
			buildTypeId: buildTypeId,
			name: name,
			url: url
		}}, {multi: false});
	}

	function AddProject(serverId, parentId, projectId, name, url) {
		var myId = _buildId(serverId, parentId, projectId);

		Collections.Projects.upsert({_id: myId}, {$set: {
			serverId: serverId,
			parentId: s.isBlank(parentId) ? false : parentId,
			projectId: projectId,
			name: name,
			url: url
		}}, {multi: false});
	}

	return {
		onRefreshProjects: RefreshProjects,
		onAddProject: AddProject,
		onAddBuild: AddBuildType
	};
})();
