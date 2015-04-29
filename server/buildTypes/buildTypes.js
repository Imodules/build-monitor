/**
 * Created by imod on 4/29/15.
 */

Collections.BuildTypes.allow({
	insert: function () {
		return false;
	},

	update: function (userId) {
		var user = Meteor.users.findOne({_id: userId}, {fields: {isAdmin: 1}});

		return (user && user.isAdmin);
	},
	remove: function () {
		return false;
	}
});
