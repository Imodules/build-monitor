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

	get projectId() {
		return this._doc.projectId;
	},

	get serviceBuildId() {
		return this._doc.serviceBuildId;
	},

	get name() {
		return this._doc.name;
	},

	// TODO: Change this to href for consistency.
	get url() {
		return this._doc.url;
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
	 * Refreshes the build history data for this build.
	 *
	 * @param service
	 */
	refreshBuildData: function (service) {
		var self = this;
		service.getBuildData(self.url, 10, function (buildDetailsArray) {
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
			while(self.builds.length > 10) {
				self.builds.pop();
			}

			Collections.Builds.update({_id: self._id}, {$set: {isBuilding: true, builds: self.builds}});
		});
	},

	// TODO: Need to pass service so I can call refreshBuildData if needed.
	updateIsDisplayed: function (setIsDisplayed) {
		var inc = setIsDisplayed ? 1 : -1;
		this._doc.displayCounter += inc;

		Collections.Builds.update({_id: this._id}, {$inc: {displayCounter: inc}});
	}
	//endregion
};
