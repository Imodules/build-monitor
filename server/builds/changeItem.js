/**
 * Created by paul on 5/5/15.
 */

'use strict';
/**
 *
 * @param {{id: number|string, href: string, username: string, comment: string, files: {file: []} }} doc
 * @constructor
 */
Models.ChangeItem = function (doc) {
	this.json = {
		id: doc.id,
		href: doc.href,
		comment: doc.comment,
		fileCount: doc.fileCount ? doc.fileCount : doc.files.file.length
	};

	if (s.include(doc.username, '\\')) {
		this.json.username = s.strRightBack(doc.username, '\\');
	} else if (s.include(doc.username, '<')) {
		this.json.username = s.trim(s.strLeftBack(doc.username, '<'));
	}
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
