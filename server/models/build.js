/**
 * Created by paul on 5/7/15.
 */

'use strict';
Models.Build = function (doc) {
	this._doc = doc;
};

Models.Build.prototype = {
	//region Properties
	get _id() {
		return this._doc._id;
	},

	get serverId() {
		return this._doc.serverId;
	},
	set serverId(value) {
		this._doc.serverId = value;
	},

	get projectId() {
		return this._doc.projectId;
	},
	set projectId(value) {
		this._doc.projectId = value;
	},

	get serviceBuildId() {
		return this._doc.serviceBuildId;
	},
	set serviceBuildId(value) {
		this._doc.serviceBuildId = value;
	},

	get name() {
		return this._doc.name;
	},
	set name(value) {
		this._doc.name = value;
	},

	// TODO: Change this to href for consistency.
	get url() {
		return this._doc.url;
	},
	set url(value) {
		this._doc.url = value;
	},

	/**
	 * @returns {boolean}
	 */
	get isDisplayed() {
		return this._doc.isDisplayed;
	},
	/**
	 * @param {boolean} value
	 */
	set isDisplayed(value) {
		this._doc.isDisplayed = value;
	},

	/**
	 * @returns {boolean}
	 */
	get isLastBuildSuccess() {
		return this._doc.isLastBuildSuccess;
	},
	/**
	 * @param {boolean} value
	 */
	set isLastBuildSuccess(value) {
		this._doc.isLastBuildSuccess = value;
	},

	/**
	 * @returns {boolean}
	 */
	get isBuilding() {
		return this._doc.isBuilding;
	},
	/**
	 * @param {boolean} value
	 */
	set isBuilding(value) {
		this._doc.isBuilding = value;
	},
	//endregion

	//region Methods
	toJson: function () {
		return this._doc;
	},

	refreshData: function (service) {

	}
	//endregion
};
