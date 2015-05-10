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
			if (buildDetail.lastChanges) {
				users = _.map(buildDetail.lastChanges.change, function (change) {
					return change.username;
				});
			}

			var bh = new Models.BuildDetail({
				id: buildDetail.id,
				serviceBuildId: buildDetail.buildTypeId,
				serviceNumber: buildDetail.number,
				isSuccess: buildDetail.status === 'SUCCESS',
				isRunning: buildDetail.running === true,
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

			buildSummary.build.forEach(function (build) {
				bsArr.push(new Models.BuildSummary({
							id: build.id,
							serviceBuildId: build.buildTypeId,
							serviceNumber: build.number,
							isSuccess: build.status === 'SUCCESS',
							isRunning: build.running === true,
							href: build.href
						})
				);
			});

			cb(bsArr);
		});
	}

	//endregion
};
