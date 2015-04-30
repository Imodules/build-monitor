/**
 * Created by paul on 4/22/15.
 */

'use strict';
Template.home.helpers({
	buildItems: function () {
		return Collections.BuildTypes.find({}, {sort: {shortName: 1}});
	}
});

Template.buildItem.helpers({
	myBigName: function () {
		if (s.isBlank(this.shortName)) {
			return this.name;
		}

		return this.shortName;
	},

	isBuildingClass: function () {
		return this.isBuilding ? 'blink_me': '';
	},

	buildStateClass: function () {
		return this.isLastBuildSuccess ? 'success' : 'error';
	}
});

/*
1: have "last build" boxes on the bottom, check success, X failure.
2: current build will contain spinning gear.
 */
