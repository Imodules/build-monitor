/**
 * Created by paul on 5/5/15.
 */

'use strict';
Models.ChangeItem = function (doc) {
	this.json = {
		id: doc.id,
		href: doc.href,
		username: s.strRightBack(doc.username, '\\'),
		comment: doc.comment,
		fileCount: doc.files.length
	};
};

Models.ChangeItem.prototype = {
	//region Properties
	get id() {
		return this.json.id;
	},

	get href() {
		return this.json.href;
	},

	get username() {
		return this.json.username;
	},

	get comment() {
		return this.json.comment;
	},

	get fileCount() {
		return this.json.fileCount;
	}
	//endregion

	//region Methods
	//endregion
};
