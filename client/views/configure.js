/**
 * Created by imod on 4/28/15.
 */

ViewModels.Configure = (function () {
	function _upsert(id, shortName, isOn, cb) {
		var userId = Meteor.userId(),
				myBuildItem = Collections.MyBuildDisplay.findOne({userId: userId, buildId: id});

		if (!myBuildItem) {
			Collections.MyBuildDisplay.insert({
				userId: userId, buildId: id, isDisplayed: (isOn === true), shortName: shortName
			}, cb);
		} else {
			var setItem = { };
			if (isOn !== null) {
				setItem.isDisplayed = isOn;
			}
			if (!s(shortName).isBlank()) {
				setItem.shortName = shortName;
			}
			Collections.MyBuildDisplay.update({_id: myBuildItem._id}, {$set: setItem}, cb);
		}
	}

	function updateBuildTypeShortName(id, shortName, cb) {
		return _upsert(id, shortName, null, cb);
	}

	function updateDisplayToggle(id, isOn, cb) {
		return _upsert(id, null, isOn, cb);
	}

	return {
		onUpdateBuildTypeShortName: updateBuildTypeShortName,
		onUpdateDisplayToggle: updateDisplayToggle
	};
})();

Template.configure.helpers({
	topLevelProjects: function () {
		return Collections.Projects.find({parentId: null});
	},
	allMyBuilds: function () {
		var myBuilds = Collections.MyBuildDisplay.find({isDisplayed: true}, {fields: {buildId: 1}}).fetch(),
				myBuildIds = _.pluck(myBuilds, 'buildId');

		return Collections.Builds.find({_id: {$in: myBuildIds}});
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
		return Collections.Projects.find({parentId: this.projectId}).count();
	},
	childBuildTypeCount: function () {
		return Collections.Builds.find({projectId: this.projectId}).count();
	},
	hasChildren: function () {
		return Collections.Projects.find({parentId: this.projectId}).count() > 0
	},
	myChildren: function () {
		return Collections.Projects.find({parentId: this.projectId}, {sort: {name: 1}});
	},
	myBuilds: function () {
		return Collections.Builds.find({projectId: this.projectId}, {sort: {name: 1}});
	},
	enabledBuildCount: function () {
		return Collections.Builds.find({projectId: this.projectId, isDisplayed: true}).count();
	},
	parentAccordianId: function () {
		if (this.parentId === null) {
			return 'accordion'
		}

		var parent = Collections.Projects.findOne({projectId: this.parentId});
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
		var parent = Collections.Projects.findOne({projectId: this.projectId});
		if (parent) {
			return parent.name;
		}
		return '';
	},
	myBuildDisplayItem: function () {
		var myBuildDisplayItem = Collections.MyBuildDisplay.findOne({userId: Meteor.userId(), buildId: this._id});
		if (!myBuildDisplayItem) {
			return {
				isDisplayed: false,
				shortName: null,
				buildId: this._id
			}
		}

		return myBuildDisplayItem;
	}
});

Template.cfgBuildTypeRow.events({
	'keyup input.shortName': function (e, t) {
		ViewModels.Configure.onUpdateBuildTypeShortName(this.buildId, t.$(e.currentTarget).val());
	},

	'change input.isOn': function (e, t) {
		ViewModels.Configure.onUpdateDisplayToggle(this.buildId, t.$(e.currentTarget).is(':checked'));
	}
});
