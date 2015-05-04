/**
 * Created by imod on 4/24/15.
 */

'use strict';
ViewModels.Servers = (function () {
	function Add(name, url, uname, pass, callback) {
		if (!url) {
			throw new Meteor.Error(500, 'Missing url');
		}

		Meteor.call('insertServer', name, url, uname, pass, function (err, id) {
			if (err) {
				if (callback) { callback(err); }
				return;
			}

			if (id) {
				Refresh(id, callback);
			}
		});
	}

	function Edit(id, name, url, uname, pass, callback) {
		if (!url) {
			throw new Meteor.Error(500, 'Missing url');
		}

		Meteor.call('updateServer', id, name, url, uname, pass, function (err) {
			if (err) {
				if (callback) { callback(err); }
				return;
			}

			Refresh(id, callback);
		});
	}

	function Delete(id, callback) {
		Meteor.call('deleteServer', id, callback);
	}

	function Refresh(id, callback) {
		Meteor.call('refreshProjects', id, callback);
	}

	return {
		onAdd: Add,
		onEdit: Edit,
		onDelete: Delete,
		onRefresh: Refresh
	};
})();

Template.servers.created = function () {
	Session.set('isEditing', false);
};

Template.servers.helpers({
	isEdit: function () {
		return !Session.equals('isEditing', false);
	}
});

Template.serverRow.helpers({
	maskedPassword: function () {
		if (this.password === false) {
			return '';
		}
		return '*****';
	},
	iAmEditing: function () {
		return Session.equals('isEditing', this._id);
	},
	amIDeleting: function () {
		return Session.equals('isDeleting', this._id);
	}
});

Template.serverRow.events({
	'click button.refresh': function (e) {
		e.preventDefault();
		ViewModels.Servers.onRefresh(this._id, function (err) {
			if (err) {
				$.bootstrapGrowl(err.reason, {
					type: 'danger'
				});
			} else {
				$.bootstrapGrowl('Refreshing projects...', {type: 'success'});
			}
		});
	},

	'click button.edit': function(e) {
		e.preventDefault();
		Session.set('isEditing', this._id);
	},

	'click button.delete': function (e) {
		e.preventDefault();
		Session.set('isDeleting', this._id);
	},

	'click button.delYes': function (e) {
		e.preventDefault();
		ViewModels.Servers.onDelete(this._id, function(err) {
			if (err) {
				$.bootstrapGrowl(err.reason, {
					type: 'danger'
				});
			} else {
				$.bootstrapGrowl('Server has been removed', {type: 'success'});
			}
		});
	},

	'click button.delNo': function (e) {
		e.preventDefault();
		Session.set('isDeleting', false);
	}
});

Template.serverInput.helpers({
	isEdit: function() {
		return !Session.equals('isEditing', false);
	}
});

Template.serverInput.events({
	'click button.add': function (e, t) {
		e.preventDefault();

		ViewModels.Servers.onAdd(
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
	},

	'click button.save': function (e, t) {
		e.preventDefault();

		ViewModels.Servers.onEdit(
				this._id,
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
						$.bootstrapGrowl('Update saved.', {type: 'success'});

						Session.set('isEditing', false);

						t.$('#name').val(null);
						t.$('#url').val(null);
						t.$('#user').val(null);
						t.$('#pass').val(null);
					}
				}
		);
	},

	'click button.cancel': function (e) {
		e.preventDefault();
		Session.set('isEditing', false);
	}
});
