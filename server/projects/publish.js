/**
 * Created by imod on 4/28/15.
 */

Meteor.publish('projects', function () {
	return Collections.Projects.find();
});

Meteor.publish('displayedProjects', function () {
	return Collections.Projects.find({isDisplayed: true});
});
