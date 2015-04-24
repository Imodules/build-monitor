/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Settings = (function () {
	/**
	 * @return {boolean}
	 */
	function CreateSite(tcUrl) {
		if (!tcUrl) {
			throw new Meteor.Error(500, 'Missing url');
		}

		return true;
	}

	return {
		onCreateSite: CreateSite
	};
})();
