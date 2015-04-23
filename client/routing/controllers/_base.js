/**
 * Created by paul on 1/13/15.
 */

/* global RouteController: true*/

'use strict';
Controllers.Route = { };
Controllers.Route.Base = RouteController.extend({
	onBeforeAction: function () {
		window.scrollTo(0, 0);

		this.next();
	}
});

