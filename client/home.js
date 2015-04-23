/**
 * Created by paul on 4/22/15.
 */

'use strict';
Template.home.helpers({
	hooks: function () {
		return Collections.Hooks.find({});
	}
});

Template.registerHelper('jsonify', function(json) {
	return JSON.stringify(json);
});
