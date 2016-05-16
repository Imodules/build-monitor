import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import BuildHistory from '../../../app/imports/components/BuildHistory.jsx';

describe('BuildHistory', function () {
	let buildItems = [
		{
			"id": 194448,
			"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
			"serviceNumber": "170",
			"isSuccess": true,
			"isBuilding": true,
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
			"isSuccess": false,
			"isBuilding": false,
			"href": "/guestAuth/app/rest/builds/id:193469",
			"percentageComplete": null,
			"statusText": "Success",
			"startDate":("2016-05-10T06:00:16.000Z"),
			"finishDate":("2016-05-10T06:00:28.000Z"),
			"usernames": []
		}],
		BuildHistoryDom;

	before(function(){
		BuildHistoryDom = shallow(<BuildHistory builds={buildItems}
		                                        successIcon="fa-rebel"
		                                        failureIcon="fa-first-order"
												buildingIcon="fa-fighter-jet faa-passing animated"/>);
	});

	it('should have 2 success divs', function () {
		const successDivs = BuildHistoryDom.find('div.bh-succ');
		assert.lengthOf(successDivs, 2);
	});

	it('should have 1 failure div', function(){
		const failureDiv = BuildHistoryDom.find('div.bh-fail');
		assert.lengthOf(failureDiv, 1);
	});

	it('should have 1 success icons', function(){
		const successIcon = BuildHistoryDom.find('i.fa-rebel');
		assert.lengthOf(successIcon, 1);
	});

	it('should have 1 failure icons', function(){
		const successIcon = BuildHistoryDom.find('i.fa-first-order');
		assert.lengthOf(successIcon, 1);
	});
	
	it('should have 1 building icons', function(){
		const successIcon1 = BuildHistoryDom.find('i.fa-fighter-jet');
		assert.lengthOf(successIcon1, 1);
		const successIcon2 = BuildHistoryDom.find('i.faa-passing');
		assert.lengthOf(successIcon2, 1);
		const successIcon3 = BuildHistoryDom.find('i.animated');
		assert.lengthOf(successIcon3, 1);
	});
	
});

