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
	get service() {
		return this._service;
	},

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

	save: function (cb) {
		var updData = {
			name: this.name,
			type: 'teamcity',
			url: this.url,
			user: this.user,
			password: this.password
		};

		if (this._id) {
			return Collections.Servers.update({_id: this._id}, { $set: updData });
		}

		return Collections.Servers.insert(updData);
	},

	/**
	 * Refreshes the projects from the server.
	 */
	refreshProjects: function () {
		this.service.getProjects(Controllers.Projects.onAddProject);
	},

	toggleBuildDisplay: function (buildId, isDisplayed, watcher) {
		var build = Controllers.Builds.getBuild(buildId);
		if (isDisplayed) {
			build.addWatcher(this._service, watcher);
		} else {
			build.removeWatcher(watcher);
		}
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
				self.updateRunningBuilds();
				return cbTimerUpdate(self._id, false);
			}

			builds.forEach(function (build) {
				var bm = Controllers.Builds.getBuildByServiceId(self._id, build.serviceBuildId);
				if (!bm.isBuilding) {
					bm.startBuild(self._service, build.href);
				}
			});

			cbTimerUpdate(self._id, true);
		});
	},

	/**
	 * Updates the running builds from the server.
	 *
	 * @param cbTimerUpdate
	 */
	updateRunningBuilds: function () {
		var self = this,
				builds = Controllers.Builds.getRunningServerBuilds(self._id);
		builds.forEach(function (build) {
			build.updateRunningBuild(self._service);
		});
	}
	//endregion
};
