/**
 * Created by paul on 4/22/15.
 */

'use strict';
Template.home.helpers({
	buildItems: function () {
		return Collections.Builds.find({}, {sort: {name: 1}});
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
		return this.isBuilding ? 'blink_me': '';
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
		return numeral(td.asSeconds()).format('00:00:00');
	}
});

Template.buildHistory.helpers({
	icon: function () {
		if (this.isBuilding) {
			return 'fa-cog fa-spin';
		}

		return this.isSuccess ? 'fa-check' : 'fa-remove';
	}
});
