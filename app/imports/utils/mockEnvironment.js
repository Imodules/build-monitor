/*eslint "no-undef":0*/
/*eslint "strict":0*/

import jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

global.Mongo = {
	Collection: function (name) {
		return {
			insert(doc) {
			},
			update(selector, modifier, cb) {
			},
			remove(selector, cb) {
			},
			attachSchema(schema) {
			}
		};
	}
};

global.Meteor = {
	user () {
	},
	userId () {
	},
	subscribe () {
	},
	loginWithPassword () {
	},
	logout () {
	},
	call() {
	},
	isClient: false,
	isServer: true
};

Object.keys(window).forEach((key) => {
	if (!(key in global)) {
		global[key] = window[key];
	}
});

