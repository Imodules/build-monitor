'use strict';

Template.blankLayout.events({
	'click #logout': function () {
		Meteor.logout();
	}
});
