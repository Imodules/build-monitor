'use strict';
Template.home.created = function () {
	this.subscribe('displayedBuilds');
};

Template.home.helpers({
	build: function () {
		return Collections.Builds.findOne({_id: this.buildId});
	},
	buildOrder: function () {
		return Collections.MyBuildDisplay.find({isDisplayed: true}, {sort: {sort: 1}});
	}
});

Template.buildItem.helpers({
	myBigName: function () {
		var myItem = Collections.MyBuildDisplay.findOne({buildId: this._id});
		if (!myItem || s.isBlank(myItem.shortName)) {
			return this.name;
		}

		return myItem.shortName;
	},

	isBuildingClass: function () {
		return this.isBuilding ? 'blink_me' : '';
	},

	buildStateClass: function () {
		return this.isLastBuildSuccess ? 'success' : 'error';
	},

	lastBuild: function () {
		if (!this.builds || this.builds.length <= 0) {
			return null;
		}

		return this.builds[0];
	},

	buildTime: function (start, end) {
		var td = moment.duration(moment(end).diff(start));
		return s.lpad(td.minutes(), 2, '0') + ':' + s.lpad(td.seconds(), 2, '0');
	}
});

Template.buildHistory.helpers({
	icon: function () {
		if (this.isBuilding) {
			return 'fa-tree faa-flash animated';
		}

		return this.isSuccess ? 'fa-tree' : 'fa-fire';
	},

	bhClass: function () {
		return this.isSuccess ? 'bh-succ' : 'bh-fail';
	}
});
