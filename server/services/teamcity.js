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
		return !s.isBlank(this.server.user) && !s.isBlank(this.server.password);
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
				opt = {
			headers: {
				'Accept': 'application/json'
			}
		};

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

			for(var i = 0; i < tcProjects.count; i++) {
				var project = tcProjects.project[i],
						opt = self._buildOptions();

				HTTP.get(project.href, opt, function (err, tcProject) {
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
