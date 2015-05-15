'use strict';

function loadTestDb() {
	var users = [
		{username: 'pstuartTester1', email: 'pstuartTester1@fwe.com', password: 'password1'},
		{username: 'pstuartTester2', email: 'pstuartTester2@fwe.com', password: 'password2'}
	];

	_.each(users, function (user) {
		console.log('creating test user: ' + user.username);
		var id = Accounts.createUser({
			username: user.username,
			email: user.email,
			password: user.password
		});

		// Now update so that it is a complete user.
		Meteor.users.update({_id: id}, {$set: {'emails.0.verified': true}});
	});

	Meteor.users.update({username: 'pstuartTester1'}, {$set: {isAdmin: true}});

	var serverId = 'MyClientTestServer_01',
			projectId = 'MyClientTestProject_01',
			buildId1 = 'MyClientTestBuild_01',
			buildId2 = 'MyClientTestBuild_02';

	Collections.Servers.insert({_id: serverId, name: 'Ze Client Integration Test', type: 'teamcity', url: 'http://clitest.example.com'});
	Collections.Projects.insert({
		_id: projectId, serverId: serverId, parentId: null, serviceProjectId: 'ClientServicePID',
		serviceParentProjectId: null, name: 'Client test project', href: '/guestAuth/project/test1'
	});
	Collections.Builds.insert({
		_id: buildId1,
		serverId: serverId,
		projectId: projectId,
		serviceBuildId: 'My_Client_Build_Service_id01',
		name: 'Client test build 01',
		href: '/guestAuth/build/test1',
		isLastBuildSuccess: true,
		isBuilding: false
	});
	Collections.Builds.insert({
		_id: buildId2,
		serverId: serverId,
		projectId: projectId,
		serviceBuildId: 'My_Client_Build_Service_id02',
		name: 'Client test build 02',
		href: '/guestAuth/build/test2',
		isLastBuildSuccess: true,
		isBuilding: false
	});
}

if (process.env.IS_MIRROR) {
	Meteor.methods({
		'loadFixtures': function () {
			console.log('Loading default fixtures');
			loadTestDb();
			console.log('Finished loading default fixtures');
		},

		'clearDB': function () {
			console.log('Clear DB');

			var collectionsRemoved = 0;
			var db = Meteor.users.find()._mongo.db;
			db.collections(function (err, collections) {

				var appCollections = _.reject(collections, function (col) {
					return col.collectionName.indexOf('velocity') === 0 ||
							col.collectionName === 'system.indexes';
				});

				_.each(appCollections, function (appCollection) {
					appCollection.remove(function (e) {
						if (e) {
							console.error('Failed removing collection', e);
							fut.return('fail: ' + e);
						}
						collectionsRemoved++;
						console.log('Removed collection');
						if (appCollections.length === collectionsRemoved) {
							console.log('Finished resetting database');
						}
					});
				});

			});

			console.log('Finished clearing');
		}
	});
}
