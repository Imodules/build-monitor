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

function _updateTime() {
	Session.set('timestamp', Date.now());
}

Template.clockBar.created = function() {
	setInterval(_updateTime, 1000);
};

Template.clockBar.helpers({
	currentDate: function () {
		return moment(Session.get('timestamp')).format('MMMM Do YYYY');
	},
	currentTime: function () {
		return moment(Session.get('timestamp')).tz("America/Chicago").format('HH:mm:ss z');
	},
	utcTime: function () {
		return moment(Session.get('timestamp')).tz("UTC").format('HH:mm:ss z');
	}
});

Template.buildItem.helpers({
	sizeClass: function () {
		var user = Meteor.user();
		if (!user.profile || !user.profile.sizeClass) {
			return 'col-xs-12 col-sm-6 col-md-4 col-lg-3';
		}
		return Meteor.user().profile.sizeClass;
	},
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
			return 'fa-spinner faa-spin animated';
		}

		return this.isSuccess ? 'fa-check-circle' : 'fa-times-circle';
	},

	bhClass: function () {
		return this.isSuccess ? 'bh-succ' : 'bh-fail';
	}
});
