/**
 * Created by paul on 5/7/15.
 */

'use strict';
Models.Build = function (doc) {
	this._doc = doc;
	if (!this._doc.displayCounter) {
		this._doc.displayCounter = 0;
	}
	if (this._doc.isLastBuildSuccess === undefined) {
		this._doc.isLastBuildSuccess = true;
	}
	if (this._doc.watchers === undefined) {
		this._doc.watchers = [];
	}
};

Models.Build.prototype = {
	//region Properties
	get _id() {
		return this._doc._id;
	},

	get serverId() {
		return this._doc.serverId;
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

	get name() {
		return this._doc.name;
	},

	get href() {
		return this._doc.href;
	},

	get watchers() {
		return this._doc.watchers;
	},

	/**
	 * @returns {boolean}
	 */
	get isDisplayed() {
		return this.watchers.length > 0;
	},

	/**
	 * @returns {boolean}
	 */
	get isLastBuildSuccess() {
		return this._doc.isLastBuildSuccess;
	},

	/**
	 * @returns {boolean}
	 */
	get isBuilding() {
		return this._doc.isBuilding;
	},

	get builds() {
		return this._doc.builds;
	},
	set builds(value) {
		this._doc.builds = value;
	},
	//endregion

	//region Methods
	toJson: function () {
		return this._doc;
	},

	/**
	 *
	 * @param {Models.BuildDetail} buildDetail
	 * @private
	 */
	_updateBuild: function (buildDetail) {
		// Ensure that our build was started.
		if (this.builds.length > 0 && this.builds[0].id !== buildDetail.id) {
			return;
		}

		var set = {
			'builds.0.isBuilding': buildDetail.isBuilding,
			'builds.0.isSuccess': buildDetail.isSuccess,
			'builds.0.statusText': buildDetail.statusText,
			'builds.0.percentageComplete': buildDetail.percentageComplete
		};

		if (this.isLastBuildSuccess && !buildDetail.isSuccess) {
			set.isLastBuildSuccess = false;
			set.whoBrokeIt = buildDetail.usernames;
		}

		Collections.Builds.update({_id: this._id}, {$set: set});
	},

	/**
	 *
	 * @param {Models.BuildDetail} buildDetail
	 * @private
	 */
	_finishBuild: function (buildDetail) {
		Collections.Builds.update({_id: this._id}, {
			$set: {
				isLastBuildSuccess: buildDetail.isSuccess,
				isBuilding: false,
				'builds.0.isBuilding': buildDetail.isBuilding,
				'builds.0.isSuccess': buildDetail.isSuccess,
				'builds.0.statusText': buildDetail.statusText,
				'builds.0.percentageComplete': buildDetail.percentageComplete,
				'builds.0.finishDate': buildDetail.finishDate
			}
		});
	},

	/**
	 * Refreshes the build history data for this build.
	 *
	 * @param service
	 */
	refreshBuildData: function (service) {
		var self = this;
		service.getBuildData(self.href, 10, function (buildDetailsArray) {
			var isLastBuildSuccess = true,
				whoBrokeIt = null,
				isBuilding = false;
			if (buildDetailsArray.length > 0) {
				isBuilding = buildDetailsArray[0].isBuilding;

				if (!buildDetailsArray[0].isSuccess) {
					isLastBuildSuccess = false;
					whoBrokeIt = buildDetailsArray[0].usernames;
				} else if (isBuilding && buildDetailsArray.length > 1) {
					isLastBuildSuccess = buildDetailsArray[1].isSuccess;
					whoBrokeIt = buildDetailsArray[1].usernames;
				}
			}

			var buildData = _.map(buildDetailsArray, function (bd) {
				return bd.toJson();
			});

			Collections.Builds.update({_id: self._id}, {
				$set: {
					isLastBuildSuccess: isLastBuildSuccess,
					whoBrokeIt: whoBrokeIt,
					builds: buildData,
					isBuilding: isBuilding
				}
			});
		});
	},

	/**
	 * Starts a new build for this buildType.
	 *
	 * @param service
	 * @param href
	 */
	startBuild: function (service, href) {
		var self = this;
		service.getBuildDetails(href, function (buildDetail) {
			if (!self.builds) {
				self.builds = [];
			}

			self.builds.splice(0, 0, buildDetail.toJson());
			while (self.builds.length > 10) {
				self.builds.pop();
			}

			Collections.Builds.update({_id: self._id}, {$set: {isBuilding: true, builds: self.builds}});
		});
	},

	/**
	 * Updates the latest build information.
	 *
	 * @param service
	 */
	updateRunningBuild: function (service) {
		var self = this,
			build = self.builds[0];

		if(!build.href) {
			return;
		}
		
		service.getBuildDetails(build.href, function (buildDetail) {
			self._updateBuild(buildDetail);
			if (!buildDetail.isBuilding) {
				self._finishBuild(buildDetail);
			}
		});
	},

	addWatcher: function (service, watcher) {
		if (_.contains(this.watchers, watcher)) {
			return;
		}

		this._doc.watchers.push(watcher);
		Collections.Builds.update({_id: this._id}, {
			$addToSet: {watchers: watcher},
			$set: {watcherCount: this.watchers.length}
		});

		if (this.watchers.length === 1 && service) {
			this.refreshBuildData(service);
		}
	},

	removeWatcher: function (watcher) {
		var nWatchers = _.reject(this.watchers, function (w) {
			return w === watcher;
		});

		if (nWatchers.length === this.watchers.length) {
			return;
		}

		this._doc.watchers = nWatchers;
		Collections.Builds.update({_id: this._id}, {$set: {watchers: nWatchers, watcherCount: this.watchers.length}});
	}
	//endregion
};
