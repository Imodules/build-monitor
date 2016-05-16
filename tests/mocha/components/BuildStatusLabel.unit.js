import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import BuildStatusLabel from '../../../app/imports/components/BuildStatusLabel.jsx';
import BuildingStatusLabel from '../../../app/imports/components/BuildingStatusLabel.jsx';
import CompletedStatusLabel from '../../../app/imports/components/CompletedStatusLabel.jsx';

describe('BuildStatusLabel', function () {
	let BuildStatusLabelDom,
		build;

	describe('when build is building', function(){
		before(function(){
			build = {isBuilding:true};
			BuildStatusLabelDom = shallow(<BuildStatusLabel buildItem={build} />);
		});

		it('should have 1 BuildingStatusLabel', function () {
			const buildingStatusLabel = BuildStatusLabelDom.find(BuildingStatusLabel);
			assert.lengthOf(buildingStatusLabel, 1);
			assert.deepEqual(buildingStatusLabel.props().buildItem, build )
		});

	});
	describe('when build is not building', function(){
		before(function(){
			build = {isBuilding:false};
			BuildStatusLabelDom = shallow(<BuildStatusLabel buildItem={{isBuilding:false}} />);
		});

		it('should have 1 CompleteStatusLabel', function () {
			const completedStatusLabel = BuildStatusLabelDom.find(CompletedStatusLabel);
			assert.lengthOf(completedStatusLabel, 1);
			assert.deepEqual(completedStatusLabel.props().buildItem, build )
		});

	});

});
