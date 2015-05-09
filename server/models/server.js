/**
 * Created by paul on 5/7/15.
 */

'use strict';
Models.Server = function (doc) {
	this._doc = doc;
	this._service = Services.Factory.getService(this._doc);
};

Models.Server.prototype = {
	//region Properties
	get _id() {
		return this._doc._id;
	},

	get name() {
		return this._doc.name;
	},
	set name(value) {
		this._doc.name = value;
	},

	get type() {
		return this._doc.type;
	},
	set type(value) {
		this._doc.type = value;
	},

	get url() {
		return this._doc.url;
	},
	set url(value) {
		this._doc.url = value;
	},

	get user() {
		return this._doc.user;
	},
	set user(value) {
		this._doc.user = value;
	},

	get password() {
		return this._doc.password;
	},
	set password(value) {
		this._doc.password = value;
	},
	//endregion

	//region Methods
	toJson: function () {
		return this._doc;
	},


	/**
	 * Refreshes the projects from the server.
	 */
	refreshProjects: function () {

	},

	/**
	 * Refreshes the build history data for all the active builds.
	 */
	refreshActiveBuildData: function () {
		var self = this;
		var builds = Controllers.Builds.getActiveServerBuilds(this._id);
		builds.forEach(function (build) {
			build.refreshBuildData(self._service);
		});
	},

	/**
	 * Refreshes the build history data for a single build.
	 *
	 * @param buildId
	 */
	refreshBuildData: function (buildId) {
		var build = Controllers.Builds.getBuild(buildId);
		build.refreshBuildData(this._service);
	},

	/**
	 * Queries the server for any running builds.
	 *
	 * @param {Function} cbTimerUpdate
	 */
	queryRunningBuilds: function (cbTimerUpdate) {
		var self = this;
		this._service.queryRunningBuilds(function (builds) {
			if (builds.length === 0) {
				return cbTimerUpdate(self._id, false);
			}



			cbTimerUpdate(self._id, true);
		});
	},

	/**
	 * Updates the running builds from the server.
	 *
	 * @param cbTimerUpdate
	 */
	updateRunningBuilds: function (cbTimerUpdate) {

	}
	//endregion
};
