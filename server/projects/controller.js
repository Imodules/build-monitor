/**
 * Created by paul on 4/24/15.
 */

'use strict';
Controllers.Projects = (function () {
	/**
	 * @param {Models.Build} build
	 * @returns {*}
	 * @constructor
	 */
	function AddBuild(build) {
		return Collections.Builds.upsert({
			serverId: build.serverId,
			projectId: build.projectId,
			serviceBuildId: build.serviceBuildId
		}, {
			$set: {
				name: build.name,
				href: build.href
			}
		});
	}

	/**
	 *
	 * @param {Models.Project} project
	 * @param {Models.Build} builds[]
	 * @returns {*}
	 * @constructor
	 */
	function AddProject(project, builds) {
		var upsId = Collections.Projects.upsert({
			serverId: project.serverId,
			serviceParentProjectId: project.serviceParentProjectId,
			serviceProjectId: project.serviceProjectId
		}, {
			$set: {
				name: project.name,
				href: project.href
			}
		});

		builds.forEach(function (build) {
			build.projectId = upsId.insertedId;
			AddBuild(build);
		});
	}

	function RemoveByServerId(serverId) {
		Collections.Projects.remove({serverId: serverId});
	}

	return {
		onAddProject: AddProject,
		onRemoveByServerId: RemoveByServerId
	};
})();
