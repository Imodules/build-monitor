import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import ConfigIcon from '../../../app/imports/components/ConfigIcon.jsx';

describe('ConfigIcon', function () {
	let ConfigIconDom;

	before(function(){
		ConfigIconDom = shallow(<ConfigIcon />);
	});

	it('should have 1 a', function () {
		const link = ConfigIconDom.find('a');
		assert.lengthOf(link, 1);
	});

	it('should have 1 i with cogs', function () {
		const i = ConfigIconDom.find('i.fa-cogs');
		assert.lengthOf(i, 1);
	})
});
