/**
 * Created by imod on 4/24/15.
 */

'use strict';
Views.Servers = (function () {
	function Add(name, url, uname, pass, callback) {
		if (!url) {
			throw new Meteor.Error(500, 'Missing url');
		}

		Meteor.call('insertServer', name, url, uname, pass, callback);
	}

	return {
		onAdd: Add
	};
})();

Template.servers.events({
	'click button.add': function (e, t) {
		e.preventDefault();

		Views.Servers.onAdd(
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
						$.bootstrapGrowl('Server added.', {type: 'success'});

						t.$('#name').val(null);
						t.$('#url').val(null);
						t.$('#user').val(null);
						t.$('#pass').val(null);
					}
				}
		);
	}
});
