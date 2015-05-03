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
		service.refreshFromServer(AddProject, AddBuild);

		return true;
	}

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

	return {
		onRefreshProjects: RefreshProjects,
		onAddProject: AddProject,
		onAddBuild: AddBuild
	};
})();
