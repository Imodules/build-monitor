/**
 * Created by paul on 5/2/15.
 */

'use strict';
Models.BuildHistory = function (doc) {
	this.json = doc;
};

Models.BuildHistory.prototype = {
	//region Properties
	get id() {
		return this.json.id;
	},
	set id(value) {
		this.json.id = value;
	},

	get number() {
		return this.json.number;
	},
	set number(value) {
		this.json.number = value;
	},

	get isSuccess() {
		return this.json.isSuccess;
	},
	set isSuccess(value) {
		this.json.isSuccess = value;
	},

	get isBuilding() {
		return this.json.isBuilding;
	},
	set isBuilding(value) {
		this.json.isBuilding = value;
	},

	get href() {
		return this.json.href;
	},
	set href(value) {
		this.json.href = value;
	},

	get startDate() {
		return this.json.startDate;
	},
	set startDate(value) {
		this.json.startDate = value;
	},

	get finishDate() {
		return this.json.finishDate;
	},
	set finishDate(value) {
		this.json.finishDate = value;
	},

	get changeUsers() {
		return this.json.changeUsers;
	},
	set changeUsers(value) {
		this.json.changeUsers = value;
	}
	//endregion

	//region Methods
	//endregion
};
