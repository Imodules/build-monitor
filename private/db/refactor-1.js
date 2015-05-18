// projects: update url to href
db.getCollection('projects').update({}, {$rename: {'url': 'href'}}, {multi: true});

// builds: update url to href
// builds: drop projectId, isDisplayed, currentBuild
var builds = db.getCollections('builds');
builds.update({}, {$rename: {'url': 'href'}, $unset: {projectId: '', isDisplayed: '', currentBuild: ''}, {$set: {watchers: [], watcherCount: 0}}}, {multi: true});

// myBuildDisplay: add serverId
// myBuildDisplay: drop isDisplayed
var myBuildDisplays = db.getCollection('myBuildDisplay');
myBuildDisplays.update({}, {$set: {serverId: 'wtmyDGeknx9vW3k5A'}});

// builds: Need to add watcherCount from myBuildDisplay
myBuildDisplays.forEach(function (mbd) {
	builds.update({_id: mbd.buildId}, {$inc: {watcherCount: 1}, $addToSet: {watchers: mbd.userId}});
});

myBuildDisplays.update({}, {$unset: {isDisplayed: ''}}, {multi: true});
