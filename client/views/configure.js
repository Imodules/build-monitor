/**
 * Created by imod on 4/28/15.
 */

ViewModels.Configure = (function () {
	return {

	};
})();

Template.configure.helpers({
	topLevelProjects: function () {
		return Collections.Projects.find({parentId: null});
	}
});

Template.cfgProjectRow.helpers({
	childCount: function () {
		return Collections.Projects.find({parentId: this.projectId}).count();
	},
	hasChildren: function () {
		return Collections.Projects.find({parentId: this.projectId}).count() > 0
	},
	myChildren: function () {
		return Collections.Projects.find({parentId: this.projectId});
	},
	parentAccordianId: function () {
		if (this.parentId === null) {
			return 'accordion'
		}

		var parent = Collections.Projects.findOne({projectId: this.parentId});
		return 'acc_' + parent._id;
	}
});
