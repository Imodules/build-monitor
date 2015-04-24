/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Settings = (function () {
	/**
	 * @return {boolean}
	 */
	function UpdateSettings(tcUrl, uname, pword) {
		if (!tcUrl) {
			throw new Meteor.Error(500, 'Missing url');
		}

		var user = (s.isBlank(uname) ? false : uname),
				password = (s.isBlank(pword) ? false : pword);

		var settings = Collections.Settings.findOne();
		if (!settings) {
			return Collections.Settings.insert({
				teamCity: {
					url: tcUrl,
					user: user,
					password: password
				}
			});
		}

		return Collections.Settings.update({_id: settings._id}, {$set: {
			teamCity: {
				url: tcUrl,
				user: user,
				password: password
			}
		}});
	}

	return {
		onUpdateSettings: UpdateSettings
	};
})();
