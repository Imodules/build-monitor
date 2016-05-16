import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import Configure from '../../../imports/components/Configure.jsx';

describe('Configure', function () {
	let ConfigureDom;
	
	before(function(){
		ConfigureDom = shallow(<Configure />);
	});

	it('should have 1 div', function () {
		const div = ConfigureDom.find('div');
		assert.lengthOf(div, 1);
	});
});
