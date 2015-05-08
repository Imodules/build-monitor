/**
 * Created by paul on 5/5/15.
 */

'use strict';
/**
 * A single change for this build.
 *
 * @param {{id: number|string, href: string, username: string, date: Date}} doc
 * @constructor
 */
Models.BuildChange = function (doc) {
	var cleanUser = new Models.Username(doc.username);

	this.json =  {
		id: doc.id,
		version: doc.version,
		href: doc.href,
		username: cleanUser.clean,
		date: doc.date
	};
};

Models.BuildChange.prototype = {
	//region Properties
	get id() {
		return this.json.id;
	},

	get version() {
		return this.json.version;
	},

	get href() {
		return this.json.href;
	},

	get username() {
		return this.json.username;
	},

	get date() {
		return this.json.date;
	},
	//endregion

	//region Methods
	toJson: function () {
		return {
			id: this.id,
			version: this.version,
			href: this.href,
			username: this.username,
			date: this.date
		};
	}
	//endregion
};
