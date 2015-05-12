/**
 * Created by paul on 4/25/15.
 */

'use strict';
Meteor.call('clearDB', function(){
	Meteor.call('loadFixtures');
});
