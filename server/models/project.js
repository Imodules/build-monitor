/**
 * Created by paul on 5/11/15.
 */

'use strict';
/**
 * @param {{_id: string, serverId: string, serviceProjectId: string,
 * serviceParentProjectId: string, name: string, href: string}} doc
 * @constructor
 */
Models.Project = function (doc) {
	this._doc = doc;
};

Models.Project.prototype = {
	//region Properties
	get _id() {
		return this._doc._id;
	},

	get serverId() {
		return this._doc.serverId;
	},

	get serviceProjectId() {
		return this._doc.serviceProjectId;
	},

	get serviceParentProjectId() {
		return this._doc.serviceParentProjectId;
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
