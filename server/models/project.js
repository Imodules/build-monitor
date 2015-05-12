/**
 * Created by paul on 5/11/15.
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

	get serviceProjectId() {
		return this._doc.projectId;
	},

	get serviceParentProjectId() {
		return this._doc.serviceBuildId;
	},

	get name() {
		return this._doc.name;
	},

	get href() {
		return this._doc.href;
	},

	//endregion

	//region Methods
	toJson: function () {
		return this._doc;
	}
	//endregion
};
