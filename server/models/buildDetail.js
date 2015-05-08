/**
 * Created by paul on 5/7/15.
 */

'use strict';

/**
 * A single change for this build.
 *
 * @param {{
 * id: number|string,
 * serviceBuildId: string,
 * serviceNumber: string,
 * isSuccess: boolean,
 * isRunning: boolean,
 * href: string,
 * statusText: string,
 * startDate: Date,
 * finishDate: Date,
 * usernames: string[]}} doc
 *
 * @constructor
 */
Models.BuildDetail = function (doc) {
	this.json = {
		id: doc.id,
		serviceBuildId: doc.serviceBuildId,
		serviceNumber: doc.serviceNumber,
		isSuccess: doc.isSuccess,
		isRunning: doc.isRunning,
		href: doc.href,
		statusText: doc.statusText,
		startDate: doc.startDate,
		finishDate: doc.finishDate,
		usernames: _.map(doc.usernames, function (user) {
			var u = new Models.Username(user);
			return u.clean;
		})
	};
};

Models.BuildDetail.prototype = {
	//region Properties
	get id() {
		return this.json.id;
	},

	get serviceBuildId() {
		return this.json.serviceBuildId;
	},

	get serviceNumber() {
		return this.json.serviceNumber;
	},

	get isSuccess() {
		return this.json.isSuccess;
	},

	get isRunning() {
		return this.json.isRunning;
	},

	get href() {
		return this.json.href;
	},

	get statusText() {
		return this.json.statusText;
	},

	get startDate() {
		return this.json.startDate;
	},

	get finishDate() {
		return this.json.finishDate;
	},

	get changes() {
		return this.json.changes;
	},
	//endregion

	//region Methods
	toJson: function () {
		return this.json;
	}
	//endregion
};
