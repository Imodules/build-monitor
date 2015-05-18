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
			spyOn(Controllers.Projects, 'getByServiceProjectId').and.callFake(function (svId, projId) {
				if (projId === 'someone') {
					return null;
				}
				return new Models.Project({_id: '_MBP_INSERT_ID_CB', serviceProjectId: 'MBP'});
			});

			Controllers.Projects.onAddProject(new Models.Project({
				serverId: '_onAddProjectTest_',
				serviceProjectId: 'MBP',
				serviceParentProjectId: 'someone',
				name: 'My Brew Planner',
				href: '/guestAuth/app/rest/projects/id:MBP'
			}), [new Models.Build({
				serverId: '_onAddProjectTest_',
				projectId: null,
				serviceBuildId: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			}), new Models.Build({
				serverId: '_onAddProjectTest_',
				projectId: null,
				serviceBuildId: 'MBP_UnitTestAndBundle',
				name: 'Unit Test and Bundle',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
			})]);

			expect(Controllers.Projects.getByServiceProjectId).toHaveBeenCalledWith('_onAddProjectTest_', 'MBP');
			expect(Collections.Projects.upsert).toHaveBeenCalledWith({
						serverId: '_onAddProjectTest_',
						serviceProjectId: 'MBP'
					},
					{
						$set: {
							serviceParentProjectId: 'someone',
							parentId: null,
							name: 'My Brew Planner',
							href: '/guestAuth/app/rest/projects/id:MBP'
						}
					});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_onAddProjectTest_',
						projectId: '_MBP_INSERT_ID_CB',
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
						projectId: '_MBP_INSERT_ID_CB',
						serviceBuildId: 'MBP_UnitTestAndBundle'
					},
					{
						$set: {
							name: 'Unit Test and Bundle',
							href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
						}
					});
		});

		it('should add a new build to an existing project with the proper ids', function () {
			spyOn(Collections.Projects, 'upsert').and.callFake(function () {
				return {
					numberAffected: 1
				};
			});
			spyOn(Collections.Builds, 'upsert').and.callFake(function () {
				return true;
			});
			spyOn(Controllers.Projects, 'getByServiceProjectId').and.callFake(function (svId, projId) {
				if (projId === 'someone') {
					return null;
				}
				return new Models.Project({_id: '-the-id-to-use-on-build-', serviceProjectId: 'MBP-Existing'});
			});

			Controllers.Projects.onAddProject(new Models.Project({
				serverId: '_onAddBuild2ExistingProjectTest_',
				serviceProjectId: 'MBP-Existing',
				serviceParentProjectId: 'someone',
				name: 'My Brew Planner',
				href: '/guestAuth/app/rest/projects/id:MBP'
			}), [new Models.Build({
				serverId: '_onAddBuild2ExistingProjectTest_',
				projectId: null,
				serviceBuildId: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			}), new Models.Build({
				serverId: '_onAddBuild2ExistingProjectTest_',
				projectId: null,
				serviceBuildId: 'MBP_UnitTestAndBundle',
				name: 'Unit Test and Bundle',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
			})]);

			expect(Controllers.Projects.getByServiceProjectId).toHaveBeenCalledWith('_onAddBuild2ExistingProjectTest_', 'MBP-Existing');

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({
						serverId: '_onAddBuild2ExistingProjectTest_',
						serviceProjectId: 'MBP-Existing'
					},
					{
						$set: {
							serviceParentProjectId: 'someone',
							parentId: null,
							name: 'My Brew Planner',
							href: '/guestAuth/app/rest/projects/id:MBP'
						}
					});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_onAddBuild2ExistingProjectTest_',
						projectId: '-the-id-to-use-on-build-',
						serviceBuildId: 'MBP_AcceptanceTest'
					},
					{
						$set: {
							name: 'Acceptance Test',
							href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
						}
					});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_onAddBuild2ExistingProjectTest_',
						projectId: '-the-id-to-use-on-build-',
						serviceBuildId: 'MBP_UnitTestAndBundle'
					},
					{
						$set: {
							name: 'Unit Test and Bundle',
							href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
						}
					});
		});

		it('should add the parent / child project relationship', function () {
			spyOn(Collections.Projects, 'upsert').and.callFake(function () {
				return {
					numberAffected: 1
				};
			});
			spyOn(Collections.Builds, 'upsert').and.callFake(function () {
				return true;
			});
			spyOn(Controllers.Projects, 'getByServiceProjectId').and.callFake(function (svId, projId) {
				if (projId === 'ParentServiceProjectId-0012') {
					return new Models.Project({_id: 'PPID-0012', serviceProjectId: 'ParentServiceProjectId-0012'});
				}
				return new Models.Project({_id: 'ChildProject-0013', serviceProjectId: 'ChildServiceProjectId-0013'});
			});

			Controllers.Projects.onAddProject(new Models.Project({
				serverId: '_ThisProjectHazKidz_',
				serviceProjectId: 'ChildServiceProjectId-0013',
				serviceParentProjectId: 'ParentServiceProjectId-0012',
				name: 'My Brew Planner',
				href: '/guestAuth/app/rest/projects/id:MBP'
			}), [new Models.Build({
				serverId: '_ThisProjectHazKidz_',
				projectId: null,
				serviceBuildId: 'MBP_AcceptanceTest',
				name: 'Acceptance Test',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
			}), new Models.Build({
				serverId: '_ThisProjectHazKidz_',
				projectId: null,
				serviceBuildId: 'MBP_UnitTestAndBundle',
				name: 'Unit Test and Bundle',
				href: '/guestAuth/app/rest/buildTypes/id:MBP_UnitTestAndBundle'
			})]);

			expect(Controllers.Projects.getByServiceProjectId).toHaveBeenCalledWith('_ThisProjectHazKidz_', 'ParentServiceProjectId-0012');
			expect(Controllers.Projects.getByServiceProjectId).toHaveBeenCalledWith('_ThisProjectHazKidz_', 'ChildServiceProjectId-0013');

			expect(Collections.Projects.upsert).toHaveBeenCalledWith({
						serverId: '_ThisProjectHazKidz_',
						serviceProjectId: 'ChildServiceProjectId-0013'
					},
					{
						$set: {
							serviceParentProjectId: 'ParentServiceProjectId-0012',
							parentId: 'PPID-0012',
							name: 'My Brew Planner',
							href: '/guestAuth/app/rest/projects/id:MBP'
						}
					});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_ThisProjectHazKidz_',
						projectId: 'ChildProject-0013',
						serviceBuildId: 'MBP_AcceptanceTest'
					},
					{
						$set: {
							name: 'Acceptance Test',
							href: '/guestAuth/app/rest/buildTypes/id:MBP_AcceptanceTest'
						}
					});

			expect(Collections.Builds.upsert).toHaveBeenCalledWith({
						serverId: '_ThisProjectHazKidz_',
						projectId: 'ChildProject-0013',
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
