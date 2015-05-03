/**
 * Created by imod on 4/29/15.
 */

Meteor.publish('builds', function () {
	return Collections.Builds.find();
});

Meteor.publish('displayedBuilds', function () {
	var myBuilds = Collections.MyBuildDisplay.find({userId: this.userId}, {fields: {buildId: 1}});
	// TODO: Need to flatten this to an array then only get those builds I'm interested in.
	console.log(myBuilds);

	return Collections.Builds.find({isDisplayed: true});
});
