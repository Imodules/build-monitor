/**
 * Created by imod on 4/29/15.
 */

Meteor.publish('buildTypes', function () {
	return Collections.BuildTypes.find();
});

Meteor.publish('displayedBuildTypes', function () {
	return Collections.BuildTypes.find({isDisplayed: true});
});
