/**
 * Created by paul on 4/24/15.
 */

'use strict';
describe('Controller.Projects', function () {
	describe('onAddProject()', function () {
		it('should add a project to the db with a proper id', function () {
			spyOn(Collections.Projects, 'upsert').and.callFake(function () {
				return {
					insertedId: '_MBP_INSERT_ID'
				};
			});
			spyOn(Collections.Builds, 'upsert').and.callFake(function () {
				return true;
			});

			Controllers.Projects.onAddProject(new Models.Project({
				serverId: '_onAddProjectTest_',
				serviceProjectId: 'MBP',
				serviceParentProjectId: 'someone',
				name: 'My Brew Planner',
				href: '/guestAuth/app/rest/projects/id:MBP'
			}), [new Models.Build({
				serverId: '_onAddProjectTest_',
				serviceProjectId: 'MBP',
				serviceBuildId: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			}), new Models.Build({
				serverId: '_onAddProjectTest_',
				serviceProjectId: 'MBP',
				serviceBuildId: 'MBP_UnitTestAndBundle',
				name: 'Unit Test and Bundle',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
			})]);

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({
						serverId: '_onAddProjectTest_',
						serviceParentProjectId: 'someone',
						serviceProjectId: 'MBP'
					},
					{
						$set: {
							parentId: null,
							name: 'My Brew Planner',
							href: '/guestAuth/app/rest/projects/id:MBP'
						}
					});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_onAddProjectTest_',
						projectId: '_MBP_INSERT_ID',
						serviceBuildId: 'MBP_AcceptanceTest'
					},
					{
						$set: {
							name: 'Acceptance Test',
							href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
						}
			});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_onAddProjectTest_',
						projectId: '_MBP_INSERT_ID',
						serviceBuildId: 'MBP_UnitTestAndBundle'
					},
					{
						$set: {
							name: 'Unit Test and Bundle',
							href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
						}
					});
		});
	});
});
