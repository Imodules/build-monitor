/**
 * Created by paul on 4/24/15.
 */

'use strict';
Controllers.Projects = (function () {
	/**
	 * @return {boolean}
	 */
	function RefreshProjects() {
		// Call out to TC
		// TODO: Create a configs that can allow other / multiple servers.

		// parse projects and insert into the projects collection.
		return true;
	}

	return {
		onRefreshProjects: RefreshProjects
	};
})();
