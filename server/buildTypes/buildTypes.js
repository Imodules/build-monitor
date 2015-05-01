/**
 * Created by imod on 4/29/15.
 */

Collections.BuildTypes.allow({
	insert: function () {
		return false;
	},

	update: function (userId, doc, fieldNames, modifier) {
		// TODO: Need to create unit tests for this.
		var user = Meteor.users.findOne({_id: userId}, {fields: {isAdmin: 1}});

		if (!user || !user.isAdmin) {
			return false;
		}

		if (modifier.$set) {
			if (!doc.isDisplayed && modifier.$set.isDisplayed === true) {
				var server = Collections.Servers.findOne({_id: doc.serverId}),
						service = Services.Factory.getService(server);

				service.refreshBuildHistory(doc.buildTypeId, 2);
			}
		}

		return true;
	},
	remove: function () {
		return false;
	}
});
