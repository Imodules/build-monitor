/**
 * Created by paul on 5/9/15.
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
 * href: string}} doc
 *
 * @constructor
 */
Models.BuildSummary = function (doc) {
	this.json = {
		id: doc.id,
		serviceBuildId: doc.serviceBuildId,
		serviceNumber: doc.serviceNumber,
		isSuccess: doc.isSuccess,
		isRunning: doc.isRunning,
		href: doc.href
	};
};

Models.BuildSummary.prototype = {
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
	//endregion

	//region Methods
	toJson: function () {
		return this.json;
	}
	//endregion
};
