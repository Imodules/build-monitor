/**
 * Created by imod on 4/24/15.
 */

'use strict';
Views.settings = (function () {
	function Add(name, url, uname, pass, callback) {
		if (!url) {
			throw new Meteor.Error(500, 'Missing url');
		}

		Meteor.call('insertSettings', name, url, uname, pass, callback);
	}

	return {
		onAdd: Add
	};
})();

Template.settings.events({
	'click button.add': function (e, t) {
		e.preventDefault();

		Views.settings.onAdd(
				t.$('#name').val(),
				t.$('#url').val(),
				t.$('#user').val(),
				t.$('#pass').val(),
				function (err) {
					if (err) {
						$.bootstrapGrowl(err.reason, {
							type: 'danger'
						});
					} else {
						$.bootstrapGrowl('Settings saved.', {type: 'success'});

						t.$('#name').val(null);
						t.$('#url').val(null);
						t.$('#user').val(null);
						t.$('#pass').val(null);
					}
				}
		);
	}
});
