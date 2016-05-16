import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import BuildItemRow from '../../../app/imports/components/BuildItemRow.jsx';
import BuildItem from '../../../app/imports/components/BuildItem.jsx';

describe('BuildItemRow', function () {
	let BuildItemRowDom;
	before(function(){
		BuildItemRowDom = shallow(<BuildItemRow buildItems={[{_id:'ert41654', name:'bi1'},{_id:'uhf12345', name:'bi2'}]} />);
	});

	it('should have some buildItems', function () {
		const buildItems = BuildItemRowDom.find(BuildItem);
		assert.lengthOf(buildItems, 2);
		assert.deepEqual(buildItems.get(0).props.buildItem, { _id:'ert41654', name:'bi1'});
	});

});
