import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import BuildingStatusLabel from '../../../app/imports/components/BuildingStatusLabel.jsx';

describe('BuildingStatusLabel', function () {
	let BuildingStatusLabelDom,
		build = {builds:[{usernames:['bgreen'], percentageComplete:50}]}
	
	before(function(){
		BuildingStatusLabelDom = shallow(<BuildingStatusLabel buildItem={build}/>);
	});

	it('should have 1 last name div', function () {
		const div = BuildingStatusLabelDom.find('div.bsLast');
		assert.lengthOf(div, 1);
		assert.strictEqual(div.text(), 'bgreen')
	});

	it('should have 1 total div', function () {
		const div = BuildingStatusLabelDom.find('div.bsTotal');
		assert.lengthOf(div, 1);
		assert.strictEqual(div.text(), '50%')
	});
});
