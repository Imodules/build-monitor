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

	buildTime: function () {
		var td = moment.duration(moment(this.lastFinishDate).diff(this.lastStartDate));

		//return td.humanize();
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
