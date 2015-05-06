/**
 * Created by paul on 5/5/15.
 */

'use strict';

var tcNormalSingleFile = {
	'id': 217355,
	'version': '10fc476b21ea',
	'username': 'local\\rellias',
	'date': '20150505T151641-0500',
	'href': '/httpAuth/app/rest/changes/id:217355',
	'webLink': 'http://buildserver2:90/viewModification.html?modId=217355&personal=false',
	'comment': 'ENC-21065 send grid sub accounts not getting pulled from settings',
	'files': {
		'file': [
			{
				'before-revision': '6fe648aea455',
				'after-revision': '10fc476b21ea',
				'file': 'apps/IModOffline/ScheduledEmails/RunOneEmail.cs',
				'relative-file': 'apps/IModOffline/ScheduledEmails/RunOneEmail.cs'
			}
		]
	},
	'vcsRootInstance': {
		'id': '933',
		'vcs-root-id': 'CheckInTriggeredBuilds_FeatureBuilds_MercurialFeatureBranch1',
		'name': 'Mercurial Pivotal Branch',
		'href': '/httpAuth/app/rest/vcs-root-instances/id:933'
	}
};

describe('Models.ChangeItem', function () {
	describe('constructor()', function () {
		it('should parse the structure correctly and clean username', function () {
			var model = new Models.ChangeItem(tcNormalSingleFile);
			expect(model.username).toBe('rellias');
			expect(model.id).toBe(217355);
			expect(model.href).toBe('/httpAuth/app/rest/changes/id:217355');
			expect(model.comment).toBe('ENC-21065 send grid sub accounts not getting pulled from settings');
			expect(model.fileCount).toBe(1);
		});
	});
});
