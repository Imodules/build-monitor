import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import Dashboard from '../../../app/imports/components/Dashboard.jsx';
import ClockBar from '../../../app/imports/components/ClockBar.jsx';
import BuildItemRow from '../../../app/imports/components/BuildItemRow.jsx';
import ConfigIcon from '../../../app/imports/components/ConfigIcon.jsx';

describe('Dashboard', function () {
	let clock,
		DashboardDom;

	before(function() {
		clock = sinon.useFakeTimers();
		clock.tick(1463077772000);
		DashboardDom = shallow(<Dashboard />);
	});

	after(function() {
		clock.restore();
	});

	it('should have 1 clockBar', function () {
		const clockBar = DashboardDom.find(ClockBar);
		assert.lengthOf(clockBar, 1);
		assert.strictEqual(clockBar.props().timestamp, 1463077772000);
	});

	it('should have 1 buildItemRow', function () {
		const buildItemRow = DashboardDom.find(BuildItemRow);
		assert.lengthOf(buildItemRow, 1);
	});

	it('should have 1 configIcon', function () {
		const configIcon = DashboardDom.find(ConfigIcon);
		assert.lengthOf(configIcon, 1);
	});
});
