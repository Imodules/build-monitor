// builds: update url to href
// builds: drop projectId, isDisplayed, currentBuild
db.builds.update({}, {$rename: {'url': 'href'}, $unset: {isDisplayed: '', currentBuild: ''}, $set: {watchers: [], watcherCount: 0}}, {multi: true});

// projects: update url to href
db.projects.update({}, {$rename: {'url': 'href', 'projectId': 'serviceProjectId'}}, {multi: true});

var curProjects = db.projects.find({});
while (curProjects.hasNext()) {
	var proj = curProjects.next();
	db.builds.update({projectId: proj.serviceProjectId}, {$set: {projectId: proj._id}}, {multi: true});
}

// myBuildDisplay: add serverId
// myBuildDisplay: drop isDisplayed
db.myBuildDisplay.update({}, {$set: {serverId: 'wtmyDGeknx9vW3k5A'}}, {multi: true});

// builds: Need to add watcherCount from myBuildDisplay
var mbdCur = db.myBuildDisplay.find({isDisplayed: true});
while (mbdCur.hasNext()) {
	var mbd = mbdCur.next();
	db.builds.update({_id: mbd.buildId}, {$inc: {watcherCount: 1}, $addToSet: {watchers: mbd.userId}});
}


db.myBuildDisplay.update({}, {$unset: {isDisplayed: ''}}, {multi: true});
