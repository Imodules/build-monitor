/**
 * Created by paul on 5/3/15.
 */

'use strict';
Controllers.MyBuildDisplay = (function () {
	function GetBuildDisplayCount(buildId) {
		return Collections.Builds.find({_id: buildId}, {fields: {_id: 1}}).count();
	}

	function RemoveByBuildId(buildId) {
		Collections.MyBuildDisplay.remove({buildId: buildId});
	}

	return {
		onGetBuildDisplayCount: GetBuildDisplayCount,
		onRemoveByBuildId: RemoveByBuildId
	}
})();
