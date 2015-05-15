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

	function GetServerByName(name) {
		return Collections.Servers.findOne({name: name}, {transform: _transform});
	}

	function GetServers() {
		return Collections.Servers.find({}, {transform: _transform});
	}

	function SaveServer(id, name, url, uname, pword) {
		_validateUser();

		if (!name || !url) {
			throw new Meteor.Error(500, 'Missing required field');
		}

		var up = _cleanUnamePWord(uname, pword);

		var server = new Models.Server({
			_id: id,
			name: name,
			type: 'teamcity',
			url: url,
			user: up.user,
			password: up.password
		});
		return server.save();
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
		console.log('Refreshing projects: ' + serverId);
		var server = Controllers.Servers.getServer(serverId);
		server.refreshProjects();
	}

	return {
		getServer: GetServer,
		getServerByName: GetServerByName,
		getServers: GetServers,

		onSaveServer: SaveServer,
		onDeleteServer: DeleteServer,
		onRefreshProjects: RefreshProjects
	};
})();
