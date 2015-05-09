/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Servers = (function () {
	function _validateUser() {
		if (!Meteor.user().isAdmin) {
			throw new Meteor.Error(403, 'You are not authorized for this change.');
		}

		return true;
	}

	function _cleanUnamePWord(uname, pword) {
		var user = (s.isBlank(uname) ? false : uname),
				password = (s.isBlank(pword) ? false : pword);

		return {user: user, password: password};
	}

	function _transform(doc) {
		return new Models.Server(doc);
	}

	function GetServer(serverId) {
		return Collections.Servers.findOne({_id: serverId}, {transform: _transform});
	}

	function GetServers() {
		return Collections.Servers.find({}, {transform: _transform});
	}

	function InsertServer(name, url, uname, pword) {
		_validateUser();

		if (!name || !url) {
			throw new Meteor.Error(500, 'Missing required field');
		}

		var up = _cleanUnamePWord(uname, pword);

		return Collections.Servers.insert({
			name: name,
			type: 'teamcity',
			url: url,
			user: up.user,
			password: up.password
		});
	}

	function UpdateServer(id, name, url, uname, pword) {
		_validateUser();

		if (!id || !name || !url) {
			throw new Meteor.Error(500, 'Missing required field');
		}

		var up = _cleanUnamePWord(uname, pword);

		return Collections.Servers.update({_id: id}, {
			$set: {
				name: name,
				type: 'teamcity',
				url: url,
				user: up.user,
				password: up.password
			}
		});
	}

	function DeleteServer(id) {
		_validateUser();

		Controllers.Projects.onRemoveByServerId(id);
		Controllers.Builds.onRemoveByServerId(id);
		Collections.Servers.remove({_id: id});
	}

	/**
	 * @return {boolean}
	 */
	function RefreshProjects(serverId) {
		// Get our server.
		var server = Collections.Servers.findOne({_id: serverId});
		if (!server) {
			throw new Error('Server not found for id: ' + serverId);
		}

		// Get our service.
		var service = Services.Factory.getService(server);

		// Call populate our projects.
		service.refreshFromServer(AddProject, AddBuild);

		return true;
	}

	return {
		getServer: GetServer,
		getServers: GetServers,
		onInsertServer: InsertServer,
		onUpdateServer: UpdateServer,
		onDeleteServer: DeleteServer,

		onRefreshProjects: RefreshProjects
	};
})();
