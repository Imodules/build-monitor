/**
 * Created by imod on 4/24/15.
 */
Template.blankLayout.events({
	'click #logout': function () {
		Meteor.logout();
	}
});
