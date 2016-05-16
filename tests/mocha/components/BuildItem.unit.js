import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import {BuildItem} from '../../../app/imports/components/BuildItem.jsx';
import BuildHistory from '../../../app/imports/components/BuildHistory.jsx';
import BuildStatusLabel from '../../../app/imports/components/BuildStatusLabel.jsx';

describe('BuildItem', function () {
	let BuildItemDom;

	describe('When the buildItem is passing', function () {

		before(function () {
			BuildItemDom = shallow(<BuildItem sizingClass="col-xs-12"
			                                  displayItem={{
			                                                buildId:'asd123',
			                                                shortName:'TestShortName'
			                                  }}
			                                  buildItem={{_id:'asd123',
			                                              name:'buildItem1',
			                                              subTitle:'subtitle1',
			                                              isLastBuildSuccess: true,
			                                              isBuilding:false,
			                                              builds: [{isBuilding:false}]}}/>);

		});

		it('should have 1 div', function () {
			const div = BuildItemDom.find('div.col-xs-12');
			assert.lengthOf(div, 1);
		});

		it('should have 1 name div', function () {
			const div = BuildItemDom.find('div.bi-title');
			assert.lengthOf(div, 1);
			assert.strictEqual(div.text(), 'TestShortName');
		});

		it('should have 1 subtitle div', function () {
			const div = BuildItemDom.find('div.bi-sub-title');
			assert.lengthOf(div, 1);
			assert.strictEqual(div.text(), 'subtitle1');
		});

		it('should have a success wrapping div', function () {
			const wrapper = BuildItemDom.find('div.success');
			assert.lengthOf(wrapper, 1);
		});

		it('should have a buildStatusLabel', function(){
			const buildStatusLabel = BuildItemDom.find(BuildStatusLabel);
			assert.lengthOf(buildStatusLabel, 1);
		})
	});

	describe('When the build item is failing', function () {
		before(function () {
			BuildItemDom = shallow(<BuildItem sizingClass="col-xs-12"
			                                  buildItem={{_id:'asd123',
			                                              name:'buildItem1',
			                                              subTitle:'subtitle1',
			                                              isLastBuildSuccess: false,
			                                              isBuilding:false,
			                                              builds: [{isBuilding:false}]}}/>);
		});

		it('should have an error wrapping div', function () {
			const wrapper = BuildItemDom.find('div.error');
			assert.lengthOf(wrapper, 1);

		});
	});

	describe('When the build is building', function () {
		before(function () {
			BuildItemDom = shallow(<BuildItem sizingClass="col-xs-12"
			                                  buildItem={{_id:'asd123',
			                                              name:'buildItem1',
			                                              subTitle:'subtitle1',
			                                              isLastBuildSuccess: false,
			                                              isBuilding:true,
			                                              builds: [{isBuilding:false}]}}/>);
		});

		it('should blink', function () {
			const wrapper = BuildItemDom.find('div.blink_me');
			assert.lengthOf(wrapper, 1);
		});
	});

	describe('When the build has history', function () {
		let buildItems = [
			{
				"id": 194448,
				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
				"serviceNumber": "170",
				"isSuccess": true,
				"isBuilding": false,
				"href": "/guestAuth/app/rest/builds/id:194448",
				"percentageComplete": null,
				"statusText": "Success",
				"startDate":("2016-05-12T21:09:11.000Z"),
				"finishDate":("2016-05-12T21:09:29.000Z"),
				"usernames": [
					"jstringer"
				]
			},
			{
				"id": 193916,
				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
				"serviceNumber": "167",
				"isSuccess": true,
				"isBuilding": false,
				"href": "/guestAuth/app/rest/builds/id:193916",
				"percentageComplete": null,
				"statusText": "Success",
				"startDate":("2016-05-11T06:00:10.000Z"),
				"finishDate":("2016-05-11T06:00:22.000Z"),
				"usernames": []
			},
			{
				"id": 193469,
				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
				"serviceNumber": "166",
				"isSuccess": true,
				"isBuilding": false,
				"href": "/guestAuth/app/rest/builds/id:193469",
				"percentageComplete": null,
				"statusText": "Success",
				"startDate":("2016-05-10T06:00:16.000Z"),
				"finishDate":("2016-05-10T06:00:28.000Z"),
				"usernames": []
			}];
		
		before(function () {
			BuildItemDom = shallow(<BuildItem sizingClass="col-xs-12"
			                                  buildItem={{_id:'asd123',
			                                              name:'buildItem1',
			                                              subTitle:'subtitle1',
			                                              isLastBuildSuccess: false,
			                                              isBuilding:true,
															builds : buildItems}}/>);
		});

		it('should do stuff', function () {
			let buildHistory = BuildItemDom.find(BuildHistory);
			assert.deepEqual(buildHistory.props().builds, buildItems)
		});
	});
});
