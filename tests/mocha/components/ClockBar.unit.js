import React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import ClockBar from '../../../app/imports/components/ClockBar.jsx';

describe('ClockBar CDT', function () {
	let ClockBarDom;
	before(function () {
		ClockBarDom = shallow(<ClockBar timestamp={649555200000}/>);

	});

	it('should have 3 divs', function () {
		const divs = ClockBarDom.find('div.col-xs-4');
		assert.lengthOf(divs, 3);
	});

	it('should render the local date', function () {
		const dateDiv = ClockBarDom.find('#date');
		assert.strictEqual(dateDiv.text(), 'August 1st 1990')
	});

	it('should render the right local time', function () {
		const localDiv = ClockBarDom.find('#localTime');
		assert.strictEqual(localDiv.text(), '7:00:00 CDT')
	});

	it('should render the right utc time', function () {
		const utcDiv = ClockBarDom.find('#utcTime');
		assert.strictEqual(utcDiv.text(), '12:00:00 UTC')
	});
});

describe('ClockBar CST', function () {
	let ClockBarDom;
	before(function () {
		ClockBarDom = shallow(<ClockBar timestamp={1481137544000}/>);
	});

	it('should render the right local time', function () {
		const dateDiv = ClockBarDom.find('#localTime');
		assert.lengthOf(dateDiv, 1);
		assert.strictEqual(dateDiv.text(), '1:05:44 CST')
	});
})
