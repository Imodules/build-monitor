/**
 * Created by paul on 4/26/15.
 */

/* global Backbone: true */

'use strict';

Services.TeamCity = function (server) {
	this.server = server;
};

Services.TeamCity.prototype = {
	//region Properties
	get hasAuth() {
		if (!this.server.user || !this.server.password) {
			return false;
		}

		return true;
	},
	//endregion

	//region Methods
	_buildOptions: function () {
		var opt = {
			timeOut: 30000,
			headers: {
				'Accept': 'application/json'
			}
		};

		if (this.hasAuth) {
			opt.auth = this.server.user + ':' + this.server.password;
		}

		return opt;
	},

	_call: function (url, callback) {
		var opt = this._buildOptions(),
				fullUrl = this.server.url + url;

		console.log('Calling: ' + fullUrl);
		HTTP.get(fullUrl, opt, callback);
	},

	_addProject: function (data, method) {
		method(
				this.server._id,
				data.parentProjectId,
				data.id,
				data.name,
				data.href
		);
	},

	_addBuildType: function (data, method) {
		method(
				this.server._id,
				data.projectId,
				data.id,
				data.name,
				data.href
		);
	},

	refreshFromServer: function (addProject, addBuildType) {
		var self = this,
				fullUrl;

		if (this.hasAuth) {
			fullUrl = '/httpAuth';
		} else {
			fullUrl = '/guestAuth';
		}

		fullUrl += '/app/rest/projects';
		self._call(fullUrl, function (err, tcProjects) {
			if (err) {
				throw err;
			}

			if (tcProjects.statusCode !== 200) {
				throw new Meteor.Error(500, 'Failed to call server: ' + tcProjects.statusCode);
			}

			for(var i = 0; i < tcProjects.data.count; i++) {
				var project = tcProjects.data.project[i];

				if (project.id === '_Root') {
					continue;
				}

				self._addProject(project, addProject);

				self._call(project.href, function (err, tcProject) {
					if (err) {
						throw err;
					}

					if (tcProject.statusCode !== 200) {
						throw new Meteor.Error(500, 'Failed to call server: ' + tcProject.statusCode);
					}

					for(var b = 0; b < tcProject.data.buildTypes.count; b++) {
						var buildType = tcProject.data.buildTypes.buildType[b];
						self._addBuildType(buildType, addBuildType);
					}
				});
			}
		});

	}
	//endregion
};
