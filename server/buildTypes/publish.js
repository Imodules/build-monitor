/**
 * Created by imod on 4/29/15.
 */

Meteor.publish('buildTypes', function () {
	return Collections.BuildTypes.find();
});
