/**
 * Created by paul on 4/23/15.
 */

'use strict';
Collections.Servers.allow({
	insert: function () {
		return false;
	},
	update: function () {
		return false;
	},
	remove: function () {
		return false;
	}
});

Meteor.methods({
	insertServer: Controllers.Servers.onInsertServer,
	updateServer: Controllers.Servers.onUpdateServer,
	deleteServer: Controllers.Servers.onDeleteServer
});
