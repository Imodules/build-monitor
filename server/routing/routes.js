/**
 * Created by paul on 4/22/15.
 */

'use strict';
Router.route('/webhook/:file', function () {
	Collections.Hooks.insert({createdAt: new Date(), raw: this.request.body});
	this.response.end();
}, {where: 'server'});
