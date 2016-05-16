import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import CompletedStatusLabel from '../../../app/imports/components/CompletedStatusLabel.jsx';

describe('CompletedStatusLabel', function () {
	let CompletedStatusLabelDom;

	describe('When a build passes', function() {
		before(function () {
			CompletedStatusLabelDom = shallow(<CompletedStatusLabel buildItem={{ isLastBuildSuccess:true,
																		 whoBrokeIt: 'bgreen', 
																		 builds:[{
																		    startDate: '2016-05-10 21:09:11.000Z',
																		    finishDate: '2016-05-10 21:09:29.000Z'
																		 }] }}/>);
		});

		it('should have the date div', function () {
			const div = CompletedStatusLabelDom.find('div.bsLast');
			assert.lengthOf(div, 1);
			assert.strictEqual(div.text(), '3 days ago')
		});
	});

	describe('When a build fails', function() {
		before(function () {
			CompletedStatusLabelDom = shallow(<CompletedStatusLabel buildItem={{ isLastBuildSuccess:false,
																		 whoBrokeIt: 'bgreen',
																		 builds:[{
																		    startDate: '2016-05-10 21:09:11.000Z',
																		    finishDate: '2016-05-10 21:09:29.000Z'
																		 }] }}/>);
		});

		it('should have the blame div', function () {
			const div = CompletedStatusLabelDom.find('div.bsBrokeit');
			assert.lengthOf(div, 1);
			assert.strictEqual(div.text(), 'bgreen')
		});
	});
});
