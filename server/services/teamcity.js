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

	refreshFromServer: function (addProject, addBuildType) {
		var self = this,
				fullUrl = self.server.url,
				opt = self._buildOptions();

		if (self.hasAuth) {
			fullUrl += '/httpAuth';
		} else {
			fullUrl += '/guestAuth';
		}

		fullUrl += '/app/rest/projects';

		HTTP.get(fullUrl, opt, function (err, tcProjects) {
			if (err) {
				throw err;
			}

			if (tcProjects.statusCode !== 200) {
				throw new Meteor.Error(500, 'Failed to call server: ' + tcProjects.statusCode);
			}

			for(var i = 0; i < tcProjects.data.count; i++) {
				var project = tcProjects.data.project[i],
						opt = self._buildOptions();

				if (project.id === '_Root') {
					continue;
				}

				HTTP.get(self.server.url + project.href, opt, function (err, tcProject) {
					if (err) {
						throw err;
					}

					if (tcProject.statusCode !== 200) {
						throw new Meteor.Error(500, 'Failed to call server: ' + tcProject.statusCode);
					}
				});
			}
		});

	}
	//endregion
};
