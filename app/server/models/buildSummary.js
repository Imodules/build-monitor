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
 * isBuilding: boolean,
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
		isBuilding: doc.isBuilding,
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

	get isBuilding() {
		return this.json.isBuilding;
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
