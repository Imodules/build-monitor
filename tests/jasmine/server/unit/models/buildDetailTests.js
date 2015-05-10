/**
 * Created by paul on 5/7/15.
 */

'use strict';
var tcBuildDetail = {
	'id': 112682,
	'serviceBuildId': 'CheckInTriggeredBuilds_FeatureBuilds_FeatureEnc20657EmailMarketingGatewayJava',
	'serviceNumber': 'FEATURE-ENC-20657-166',
	'isSuccess': true,
	'isRunning': false,
	'href': '/httpAuth/app/rest/builds/id:112682',
	'percentageComplete': 23,
	'statusText': 'Tests passed: 38',
	'startDate': new Date(2015, 1, 2),
	'finishDate': new Date(2015, 1, 2, 1),
	'usernames': ['paul & joe <paul+joe>', 'doman\\myuser']
};

describe('Models', function () {
	describe('BuildDetail()', function () {
		it('should parse my build detail', function () {
			var bt = new Models.BuildDetail(tcBuildDetail);
			expect(bt.id).toBe(112682);
			expect(bt.serviceBuildId).toBe('CheckInTriggeredBuilds_FeatureBuilds_FeatureEnc20657EmailMarketingGatewayJava');
			expect(bt.isSuccess).toBe(true);
			expect(bt.isRunning).toBe(false);
			expect(bt.statusText).toBe('Tests passed: 38');
			expect(bt.startDate).toBe(tcBuildDetail.startDate);
			expect(bt.finishDate).toBe(tcBuildDetail.finishDate);

			expect(bt.toJson()).toEqual({
				id: 112682,
				serviceBuildId: 'CheckInTriggeredBuilds_FeatureBuilds_FeatureEnc20657EmailMarketingGatewayJava',
				serviceNumber: 'FEATURE-ENC-20657-166',
				isSuccess: true,
				isRunning: false,
				href: '/httpAuth/app/rest/builds/id:112682',
				percentageComplete: 23,
				statusText: 'Tests passed: 38',
				startDate: tcBuildDetail.startDate,
				finishDate: tcBuildDetail.finishDate,
				usernames: ['paul & joe', 'myuser']
			});
		});
	});
})
;
