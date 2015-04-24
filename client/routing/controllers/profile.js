/**
 * Created by imod on 4/24/15.
 */

'use strict';
Controllers.Route.Profile = Controllers.Route.Base.extend({
    onBeforeAction: function () {
        this.next();
    },

    waitOn: function () {

    },

    data: function () {

    },

    action: function () {
        this.render('profile');
    }
});