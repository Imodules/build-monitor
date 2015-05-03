/**
 * Created by paul on 5/3/15.
 */

'use strict';
Collections.MyBuildDisplay.allow({
	insert: function (userId, doc) {
		return userId === Meteor.userId();
	},

	update: function (userId, doc, fieldNames, modifier) {
		if (userId !== Meteor.userId()) {
			return false;
		}

		if (modifier.$set) {
			if (!doc.isDisplayed && modifier.$set.isDisplayed === true) {
				// TODO: Need to put in controller and make sure it works.
				console.log(doc);
				//var server = Collections.Servers.findOne({_id: doc.serverId}),
				//		service = Services.Factory.getService(server);
				//
				//service.refreshBuildHistory(doc.serviceBuildId, 2);
			}
		}

		return true;
	},
	remove: function () {
		return false;
	}
});
