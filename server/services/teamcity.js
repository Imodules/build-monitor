/**
 * Created by paul on 4/26/15.
 */

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
				fullUrl = this.server.url;

		if (url.indexOf('/httpAuth/') === -1 && url.indexOf('/guestAuth/') === -1) {
			if (this.hasAuth) {
				fullUrl += '/httpAuth';
			} else {
				fullUrl += '/guestAuth';
			}
		}

		fullUrl += url;

		console.log('Calling: ' + fullUrl);
		HTTP.get(fullUrl, opt, callback);
	},

	_addProject: function (data, method) {
		return method(
				this.server._id,
				data.parentProjectId === '_Root' ? null : data.parentProjectId,
				data.id,
				data.name,
				data.href
		);
	},

	_addBuildType: function (data, method) {
		return method(
				this.server._id,
				data.projectId,
				data.id,
				data.name,
				data.href
		);
	},

	queryRunningBuilds: function (cb) {
		var self = this;

		self._call('/app/rest/builds?locator=running:true', function (err, builds) {
			if (err) {
				throw err;
			}

			if (builds.data.count === 0) {
				return cb(self.server._id, false);
			}

			var currentActive = Controllers.Builds.onGetActiveServerBuilds(self.server._id);
			for (var i = 0; i < builds.data.count; i++) {
				var build = builds.data.build[i];

				if (!_.find(currentActive, function (c) {
							return c.serviceBuildId === build.buildTypeId;
						})) {

					// TODO:
					var bh = new Models.BuildHistory({
						id: build.id,
						number: build.number,
						isSuccess: build.status === 'SUCCESS',
						isBuilding: build.state === 'running',
						href: build.href
					});

					Controllers.Builds.onStartBuild(
							{
								serverId: self.server._id,
								serviceBuildId: build.buildTypeId,
								bhItem: bh,
								percentComplete: build.percentageComplete
							}
					);
				}
			}

			cb(self.server._id, true);
		});
	},

	refreshBuildHistory: function (buildTypeId, numberOfHistoricBuilds) {
		var self = this;
		self._call('/app/rest/buildTypes/id:' + buildTypeId +
				'/builds?locator=running:any&count=' + numberOfHistoricBuilds, function (err, builds) {
			if (err) {
				throw err;
			}

			if (builds.data.count === 0) {
				return;
			}

			var isSuccess = builds.data.build[0].status === 'SUCCESS',
					isBuilding = builds.data.build[0].state === 'running';

			// If we are running, then get the previous status.
			if (isBuilding && builds.data.count > 1) {
				isSuccess = builds.data.build[1].status === 'SUCCESS';
			}

			var buildHistories = [];
			for (var i = 0; i < builds.data.count; i++) {
				var build = builds.data.build[i],
						bh = new Models.BuildHistory({
							id: build.id,
							number: build.number,
							isSuccess: build.status === 'SUCCESS',
							isBuilding: build.state === 'running',
							href: build.href
						});

				buildHistories.push(bh);
			}

			self._call(builds.data.build[0].href, function (err, lastBuild) {
				if (err) {
					throw err;
				}

				buildHistories[0].startDate = moment(lastBuild.data.startDate, 'YYYYMMDDTHHmmssZ').toDate();
				buildHistories[0].finishDate = moment(lastBuild.data.finishDate, 'YYYYMMDDTHHmmssZ').toDate();

				Controllers.Builds.onUpdateBuildHistory(
						self.server._id,
						buildTypeId,
						isSuccess,
						isBuilding,
						buildHistories);
			});
		});
	},

	refreshFromServer: function (addProject, addBuildType) {
		var self = this;

		self._call('/app/rest/projects', function (err, tcProjects) {
			if (err) {
				throw err;
			}

			if (tcProjects.statusCode !== 200) {
				throw new Meteor.Error(500, 'Failed to call server: ' + tcProjects.statusCode);
			}

			for (var i = 0; i < tcProjects.data.count; i++) {
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

					for (var b = 0; b < tcProject.data.buildTypes.count; b++) {
						var buildType = tcProject.data.buildTypes.buildType[b];
						self._addBuildType(buildType, addBuildType);
					}
				});
			}
		});

	},

	getCurrentBuildStatus: function (build, cb) {
		var self = this;

		self._call(build.currentBuild.href, function (err, tcBuild) {
			if (err) {
				throw err;
			}

			if (tcBuild.statusCode !== 200) {
				throw new Meteor.Error(500, 'Failed to call server: ' + tcBuild.statusCode);
			}

			var startDate = null;
			if (tcBuild.data.startDate) {
				startDate = new moment(tcBuild.data.startDate, 'YYYYMMDDTHHmmssZ').toDate();
			}

			var finishedDate = null;
			if (tcBuild.data.finishDate) {
				finishedDate = new moment(tcBuild.data.finishDate, 'YYYYMMDDTHHmmssZ').toDate();
			}


			cb({
				id: build._id,
				href: build.currentBuild.href,
				isLastBuildSuccess: build.isLastBuildSuccess,
				isCurrentSuccess: tcBuild.data.status === 'SUCCESS',
				isBuilding: tcBuild.data.state === 'running',
				percentageComplete: tcBuild.data.percentageComplete,
				statusText: tcBuild.data.statusText,
				startDateTime: startDate,
				finishDateTime: finishedDate
			});
		});
	}
	//endregion
};
