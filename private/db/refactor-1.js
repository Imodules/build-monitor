// projects: update url to href
db.projects.update({}, {$rename: {'url': 'href'}}, {multi: true});

// builds: update url to href
// builds: drop projectId, isDisplayed, currentBuild
db.builds.update({}, {$rename: {'url': 'href'}, $unset: {projectId: '', isDisplayed: '', currentBuild: ''}, $set: {watchers: [], watcherCount: 0}}, {multi: true});

// myBuildDisplay: add serverId
// myBuildDisplay: drop isDisplayed
db.myBuildDisplays.update({}, {$set: {serverId: 'wtmyDGeknx9vW3k5A'}});

// builds: Need to add watcherCount from myBuildDisplay
db.myBuildDisplays.find({isDisplayed: true}).forEach(function (mbd) { db.builds.update({_id: mbd.buildId}, {$inc: {watcherCount: 1}, $addToSet: {watchers: mbd.userId}}); });

db.myBuildDisplays.update({}, {$unset: {isDisplayed: ''}}, {multi: true});
