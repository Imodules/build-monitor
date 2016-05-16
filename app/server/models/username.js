/**
 * Created by paul on 5/7/15.
 */

'use strict';
function cleanUsername(username) {
	var clean = username,
			idx = username.indexOf('\\');

	if (idx > -1) {
		clean = clean.substr(idx + 1);
	}

	idx = clean.indexOf('<');
	if (idx > -1) {
		clean = clean.substr(0, idx);
	}

	return clean.trim();
}

Models.Username = function (username) {
	this._raw = username;
	this._clean = cleanUsername(username);
};

Models.Username.prototype = {
	//region Properties
	get raw() {
		return this._raw;
	},
	get clean() {
		return this._clean;
	}
	//endregion

	//region Methods
	//endregion
};
