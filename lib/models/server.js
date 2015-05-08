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

	refreshActiveBuildData: function () {
		var self = this;
		var builds = Controllers.Builds.getActiveServerBuilds(this._id);
		builds.forEach(function (build) {
			build.refreshData(self._service);
		});

		//var bts = Collections.Builds.find({serverId: server._id, isDisplayed: true});
		//bts.forEach(function (bt) {
		//	var service = Services.Factory.getService(server);
		//	service.refreshBuildHistory(bt.serviceBuildId, 10);
		//});


	}
	//endregion
};
