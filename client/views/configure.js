'use strict';
ViewModels.Configure = (function () {
	function _upsert(serverId, buildId, setItem, cb) {
		var userId = Meteor.userId(),
			myBuildItem = Collections.MyBuildDisplay.findOne({serverId: serverId, userId: userId, buildId: buildId});

		if (!myBuildItem) {
			Collections.MyBuildDisplay.insert({
				serverId: serverId, userId: userId, buildId: buildId, isDisplayed: true, shortName: setItem.shortName, sort: setItem.sort
			}, cb);
		} else {
			Collections.MyBuildDisplay.update({_id: myBuildItem._id}, {$set: setItem}, cb);
		}
	}

	function updateBuildTypeShortName(serverId, buildId, shortName, cb) {
		return _upsert(serverId, buildId, {shortName: shortName}, cb);
	}

	function updateDisplayToggle(serverId, buildId, isOn, cb) {
		Meteor.call('watchBuild', serverId, buildId, Meteor.userId(), isOn, function (e) {
			if (e) {
				return cb(e);
			}

			_upsert(serverId, buildId, {isDisplayed: isOn}, cb);
		});
	}

	function updateSort(serverId, buildId, sort, cb) {
		return _upsert(serverId, buildId, {sort: sort}, cb);
	}

	return {
		onUpdateBuildTypeShortName: updateBuildTypeShortName,
		onUpdateDisplayToggle: updateDisplayToggle,
		onUpdateSort: updateSort
	};
})();

Template.configure.created = function () {
	this.subscribe('servers');
	this.subscribe('projects');
	this.subscribe('builds');
};

Template.configure.helpers({
	topLevelProjects: function () {
		return Collections.Projects.find({parentId: null});
	},
	allMyBuilds: function () {
		var mybuilds = Collections.MyBuildDisplay.find({userId: Meteor.userId()}, {sort: {sort: 1}}),
			builds = [];
		mybuilds.forEach(function (build) {
			var b = Collections.Builds.findOne({_id: build.buildId});
			builds.push(b);
		});
		return builds;
	},
	isDisplayedOnly: function () {
		return Session.equals('displayedOnly', true);
	},
	isDisplayedOnlyActive: function () {
		return Session.equals('displayedOnly', true) ? 'active' : '';
	}
});

Template.configure.events({
	'click #buildsOnly': function () {
		Session.set('displayedOnly', !Session.equals('displayedOnly', true));
	}
});

Template.cfgProjectRow.rendered = function () {
	var ic = this.$('#ic_' + this.data._id);

	this.$('.collapse').collapse({toggle: false})
		.on('show.bs.collapse', function () {
			ic.removeClass('fa-caret-right').addClass('fa-caret-down');
		})
		.on('hide.bs.collapse', function () {
			ic.removeClass('fa-caret-down').addClass('fa-caret-right');
		});
};

Template.cfgProjectRow.helpers({
	childProjectCount: function () {
		return Collections.Projects.find({parentId: this._id}).count();
	},
	childBuildTypeCount: function () {
		return Collections.Builds.find({projectId: this._id}).count();
	},
	hasChildren: function () {
		return Collections.Projects.find({parentId: this._id}).count() > 0;
	},
	myChildren: function () {
		return Collections.Projects.find({parentId: this._id}, {sort: {name: 1}});
	},
	myBuilds: function () {
		return Collections.Builds.find({projectId: this._id}, {sort: {name: 1}});
	},
	enabledBuildCount: function () {
		return Collections.Builds.find({projectId: this._id, displayCounter: {$gt: 0}}).count();
	},
	parentAccordianId: function () {
		if (this.parentId === null) {
			return 'accordion';
		}

		var parent = Collections.Projects.findOne({_id: this.parentId});
		return 'acc_' + parent._id;
	}
});

Template.cfgBuildTypeRow.rendered = function () {
	this.$('input[type="checkbox"]').bootstrapToggle();
};

Template.cfgBuildTypeRow.helpers({
	isDisplayedOnly: function () {
		return Session.equals('displayedOnly', true);
	},
	parentName: function () {
		var parent = Collections.Projects.findOne({_id: this.projectId});
		if (parent) {
			return parent.name;
		}
		return '';
	},
	myBuildDisplayItem: function () {
		var userId = Meteor.userId(),
			myBuildDisplayItem = Collections.MyBuildDisplay.findOne({userId: userId, buildId: this._id});
		if (!myBuildDisplayItem) {
			myBuildDisplayItem = {
				serverId: this.serverId,
				shortName: null,
				buildId: this._id,
				sort: null,
				isDisplayed: false
			};
		}

		//myBuildDisplayItem.isDisplayed = this.watchers === undefined ? false : _.contains(this.watchers, userId);
		return myBuildDisplayItem;
	}
});

Template.cfgBuildTypeRow.events({
	'keyup input.shortName': function (e, t) {
		ViewModels.Configure.onUpdateBuildTypeShortName(this.serverId, this.buildId, t.$(e.currentTarget).val());
	},
	'change input.sort': function (e, t) {
		ViewModels.Configure.onUpdateSort(this.serverId, this.buildId, parseInt(t.$(e.currentTarget).val()));
	},
	'change input.isOn': function (e, t) {
		ViewModels.Configure.onUpdateDisplayToggle(this.serverId, this.buildId, t.$(e.currentTarget).is(':checked'));
	}
});
