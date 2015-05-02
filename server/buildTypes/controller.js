/**
 * Created by paul on 5/1/15.
 */

'use strict';
Controllers.BuildTypes = (function () {
	function UpdateBuildStatus(id, isLastBuildSuccess, isCurrentSuccess, isBuilding, percentageComplete, statusText) {
		var upd = {currentBuild: {pctComplete: percentageComplete, statusText: statusText}};

		if (isLastBuildSuccess && !isCurrentSuccess) {
			upd.isLastBuildSuccess = false;
		}

		if (!isBuilding) {
			upd.isBuilding = false;
			upd.isLastBuildSuccess = isCurrentSuccess;
		}

		Collections.BuildTypes.update({_id: id},
				{$set: upd},
				{multi: false});
	}

	return {
		onUpdateBuildStatus: UpdateBuildStatus
	};
})();
