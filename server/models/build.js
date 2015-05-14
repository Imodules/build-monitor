/**
 * Created by paul on 5/7/15.
 */

'use strict';
Models.Build = function (doc) {
	this._doc = doc;
	if (!this._doc.displayCounter) {
		this._doc.displayCounter = 0;
	}
	if(this._doc.isLastBuildSuccess === undefined) {
		this._doc.isLastBuildSuccess = true;
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

	// TODO: Change this to href for consistency.
	get href() {
		return this._doc.href;
	},

	get displayCounter() {
		return this._doc.displayCounter;
	},

	/**
	 * @returns {boolean}
	 */
	get isDisplayed() {
		return this.displayCounter > 0;
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
		var set = {
			'builds.0.isRunning': buildDetail.isRunning,
			'builds.0.isSuccess': buildDetail.isSuccess,
			'builds.0.statusText': buildDetail.statusText,
			'builds.0.percentageComplete': buildDetail.percentageComplete
		};

		if (this.isLastBuildSuccess && !buildDetail.isSuccess) {
			set.isLastBuildSuccess = false;
		}

		Collections.Builds.update({_id: this._id}, { $set: set });
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
				'builds.0.isRunning': buildDetail.isRunning,
				'builds.0.isSuccess': buildDetail.isSuccess,
				'builds.0.statusText': buildDetail.statusText,
				'builds.0.percentageComplete': buildDetail.percentageComplete
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
			var buildData = _.map(buildDetailsArray, function (bd) {
				return bd.toJson();
			});
			Collections.Builds.update({_id: self._id}, {$set: {builds: buildData}});
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
		service.getBuildDetails(build.href, function (buildDetail) {
			if (buildDetail.isRunning) {
				self._updateBuild(buildDetail);
			} else {
				self._finishBuild(buildDetail);
			}
		});
	},

	updateIsDisplayed: function (service, setIsDisplayed) {
		if (this.displayCounter === 0 && !setIsDisplayed) {
			return;
		}

		var inc = setIsDisplayed ? 1 : -1;
		if (this.displayCounter <= 0 && setIsDisplayed) {
			this.refreshBuildData(service);
		}

		this._doc.displayCounter += inc;

		Collections.Builds.update({_id: this._id}, {$inc: {displayCounter: inc}});
	}
	//endregion
};
