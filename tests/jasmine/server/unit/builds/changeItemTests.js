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

var tcPairCommit = {
	'id': 217399,
	'version': 'c75d09f827f6',
	'username': 'paul & joe <paul+joe>',
	'date': '20150505T180031-0500',
	'href': '/httpAuth/app/rest/changes/id:217399',
	'webLink': 'http://buildserver2:90/viewModification.html?modId=217399&personal=false',
	'comment': 'Use composition for shared gradle functionality',
	'files': {
		'file': [
			{
				'before-revision': 'cdea0972701e',
				'after-revision': 'c75d09f827f6',
				'file': 'applications/email-gateway/build.gradle',
				'relative-file': 'applications/email-gateway/build.gradle'
			},
			{
				'before-revision': 'cdea0972701e',
				'after-revision': 'c75d09f827f6',
				'file': 'applications/email-reporting-api/build.gradle',
				'relative-file': 'applications/email-reporting-api/build.gradle'
			}
		]
	},
	'vcsRootInstance': {
		'id': '938',
		'vcs-root-id': 'CheckInTriggeredBuilds_FeatureBuilds_BitBucketEmailGateway',
		'name': 'BitBucket Email Gateway',
		'href': '/httpAuth/app/rest/vcs-root-instances/id:938'
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

		it('should parse a pair commit username', function () {
			var model = new Models.ChangeItem(tcPairCommit);
			expect(model.username).toBe('paul & joe');
			expect(model.fileCount).toBe(2);
		});
	});
});
