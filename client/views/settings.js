/**
 * Created by imod on 4/24/15.
 */

'use strict';
Views.settings = (function () {
	function Save(tcUrl, uname, pass) {
		if (!tcUrl) {
			throw new Meteor.Error(500, 'Missing url');
		}

		Meteor.call('updateSettings', tcUrl, uname, pass, function (err) {
			if (err) {
				$.bootstrapGrowl(err.reason, {
					type: 'danger'
				});
			}
		});
	}

	return {
		onSave: Save
	};
})();


Template.settings.created = function () {
	console.log(this.data);
};

Template.settings.events({
	'click button.btn-success': function (e, t) {
		e.preventDefault();

		Views.settings.onSave(
				t.$('#tcUrl').val(),
				t.$('#adminUser').val(),
				t.$('#adminPass').val()
		);
	}
});
