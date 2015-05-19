/**
 * Created by paul on 4/26/15.
 */

'use strict';

Services.TeamCity = function (server, isTest) {
	this.server = server;
	this.isTest = isTest === true;
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
		HTTP.get(fullUrl, opt, function (err, response) {
			if (err) {
				throw err;
			}

			if (response.statusCode !== 200) {
				throw 'Call was not successful. Status code: ' + response.statusCode;
			}

			callback(response.data);
		});
	},

	_tcDateTimeToDate: function (datetime) {
		if (!datetime) { return null; }
		return moment(datetime, 'YYYYMMDDTHHmmssZ').toDate();
	},

	getBuildData: function (href, historyCount, cb) {
		var self = this;

		self._call(href + '/builds?count=' + historyCount, function (data) {
			var bhArray = [],
					expectedCount = data.count;

			for (var i = 0; i < expectedCount; i++) {
				var build = data.build[i];

				self.getBuildDetails(build.href, function (bh) {
					bhArray.push(bh);

					if (bhArray.length === expectedCount) {
						cb(bhArray);
					}
				});
			}
		});
	},

	getBuildDetails: function (href, cb) {
		var self = this;
		self._call(href, function (buildDetail) {
			var users = [];
			if (buildDetail.lastChanges.count > 0) {
				users = _.map(buildDetail.lastChanges.change, function (change) {
					return change.username;
				});
			} else if(buildDetail.triggered) {
				if (buildDetail.triggered.type === 'user') {
					users = [buildDetail.triggered.user.username];
				}
			}

			var bh = new Models.BuildDetail({
				id: buildDetail.id,
				serviceBuildId: buildDetail.buildTypeId,
				serviceNumber: buildDetail.number,
				isSuccess: buildDetail.status === 'SUCCESS',
				isBuilding: buildDetail.running === true,
				href: buildDetail.href,
				percentageComplete: buildDetail.percentageComplete,
				statusText: buildDetail.statusText,
				startDate: self._tcDateTimeToDate(buildDetail.startDate),
				finishDate: self._tcDateTimeToDate(buildDetail.finishDate),
				usernames: users
			});

			cb(bh);
		});
	},

	queryRunningBuilds: function (cb) {
		var self = this;
		self._call('/app/rest/builds?locator=running:true', function (buildSummary) {
			var bsArr = [];

			if (buildSummary.count === 0) {
				return cb(bsArr);
			}

			buildSummary.build.forEach(function (build) {
				bsArr.push(new Models.BuildSummary({
							id: build.id,
							serviceBuildId: build.buildTypeId,
							serviceNumber: build.number,
							isSuccess: build.status === 'SUCCESS',
							isBuilding: build.running === true,
							href: build.href
						})
				);
			});

			cb(bsArr);
		});
	},

	getProjects: function (cb) {
		var self = this;

		self._call('/app/rest/projects', function (tcProjects) {
			for (var i = 0; i < tcProjects.count; i++) {
				var project = tcProjects.project[i];

				if (project.id === '_Root') {
					continue;
				}

				self._call(project.href, function (tcProject) {
					var proj = new Models.Project({
								serverId: self.server._id,
								serviceProjectId: tcProject.id,
								serviceParentProjectId: tcProject.parentProjectId === '_Root' ? null : tcProject.parentProjectId,
								name: tcProject.name,
								href: tcProject.href
							}),
							builds = [];

					if (tcProject.buildTypes && tcProject.buildTypes.count > 0) {
						for (var ib = 0; ib < tcProject.buildTypes.count; ib++) {
							var b = tcProject.buildTypes.buildType[ib],
									build = new Models.Build({
										serverId: self.server._id,
										serviceProjectId: b.projectId,
										serviceBuildId: b.id,
										name: b.name,
										href: b.href
									});

							builds.push(build);
						}
					}

					cb(proj, builds);
				});
			}
		});
	}

	//endregion
};
