/**
 * Created by imod on 4/28/15.
 */

ViewModels.Configure = (function () {
	function updateBuildTypeShortName(id, shortName) {
		Collections.BuildTypes.update({_id: id}, {$set: {shortName: shortName}}, {multi: false});
	}

	function updateDisplayToggle(id, isOn) {
		Collections.BuildTypes.update({_id: id}, {$set: {isDisplayed: isOn}}, {multi: false});
	}

	return {
		OnUpdateBuildTypeShortName: updateBuildTypeShortName,
		OnUpdateDisplayToggle: updateDisplayToggle
	};
})();

Template.configure.rendered = function () {
	$('input[type="checkbox"]').bootstrapToggle();
};

Template.configure.helpers({
	topLevelProjects: function () {
		return Collections.Projects.find({parentId: null});
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
		return Collections.BuildTypes.find({projectId: this.projectId}).count();
	},
	hasChildren: function () {
		return Collections.Projects.find({parentId: this.projectId}).count() > 0
	},
	myChildren: function () {
		return Collections.Projects.find({parentId: this.projectId}, {sort: {name: 1}});
	},
	myBuilds: function () {
		return Collections.BuildTypes.find({projectId: this.projectId}, {sort: {name: 1}});
	},
	enabledBuildCount: function () {
		return Collections.BuildTypes.find({projectId: this.projectId, isDisplayed: true}).count();
	},
	parentAccordianId: function () {
		if (this.parentId === null) {
			return 'accordion'
		}

		var parent = Collections.Projects.findOne({projectId: this.parentId});
		return 'acc_' + parent._id;
	}
});

Template.cfgBuildTypeRow.helpers({
	isDisplayed: function () {
		return this.isDisplayed;
	}
});

Template.cfgBuildTypeRow.events({
	'keyup input.shortName': function (e, t) {
		ViewModels.Configure.OnUpdateBuildTypeShortName(this._id, t.$(e.currentTarget).val());
	},

	'change input.isOn': function (e, t) {
		ViewModels.Configure.OnUpdateDisplayToggle(this._id, t.$(e.currentTarget).is(':checked'));
	}
});
