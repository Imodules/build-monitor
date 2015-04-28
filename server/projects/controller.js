/**
 * Created by paul on 4/24/15.
 */

'use strict';
Controllers.Projects = (function () {
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
		Collections.BuildTypes.upsert({
			serverId: serverId,
			projectId: projectId,
			buildTypeId: buildTypeId
		}, {
			$set: {
				name: name,
				url: url
			}
		}, {multi: false});
	}

	function AddProject(serverId, parentId, projectId, name, url) {
		Collections.Projects.upsert({
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

	return {
		onRefreshProjects: RefreshProjects,
		onAddProject: AddProject,
		onAddBuild: AddBuildType
	};
})();
