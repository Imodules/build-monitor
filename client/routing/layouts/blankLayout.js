'use strict';

Template.blankLayout.events({
	'click #logout': function () {
		AccountsTemplates.logout();
	}
});
