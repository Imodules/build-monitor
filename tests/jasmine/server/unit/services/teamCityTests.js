/**
 * Created by paul on 4/26/15.
 */

'use strict';
var tcProjects = {
	count: 2,
	href: '/httpAuth/app/rest/projects',
	project: [{
		id: '_Root',
		name: '<Root project>',
		description: 'Contains all other projects',
		href: '/guestAuth/app/rest/projects/id:_Root',
		webUrl: 'http://mbp-build.no-ip.org:8111/project.html?projectId=_Root'
	}, {
		id: 'MBP',
		name: 'My Brew Planner',
		parentProjectId: '_Root',
		description: 'This is the main project for My Brew Planner',
		href: '/guestAuth/app/rest/projects/id:MBP',
		webUrl: 'http://mbp-build.no-ip.org:8111/project.html?projectId=MBP'
	}]
};

describe('Services.TeamCity', function () {
	describe('refreshFromServer()', function () {
		it('should call HTTP.get', function () {
			spyOn(HTTP, 'get').and.callFake(function (url, opt, cb) {
				cb(null, {
					statusCode: 200,
					data: tcProjects
				});
			});

			var tc = new Services.TeamCity({
				url: 'http://example.com/bs'
			});

			tc.refreshFromServer();

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/projects', {
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));

			expect(HTTP.get).toHaveBeenCalledWith('http://example.com/bs/guestAuth/app/rest/projects/id:MBP', {
				headers: {
					'Accept': 'application/json'
				}
			}, jasmine.any(Function));
		});
	});
});
