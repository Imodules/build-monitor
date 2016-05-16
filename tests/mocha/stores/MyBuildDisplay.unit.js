import {assert} from 'chai';
import sinon from 'sinon';

import MyBuildDisplayStore, {MyBuildDisplayEvents} from '../../../app/imports/stores/MyBuildDisplayStore';
import ImodEventEmitter from '../../../app/imports/lib/ImodEventEmitter';

describe('MyBuildDisplay', function () {
	describe('addListener()', function () {
		let eventEmitter,
			listenerSpy;
		
		before(function(){
			eventEmitter = sinon.stub(ImodEventEmitter, 'on');
			listenerSpy = sinon.spy();
		});
		
		after(function(){
			eventEmitter.restore();
		});
		
		it('should do the thing', function () {
			MyBuildDisplayStore.addListener(listenerSpy);
			sinon.assert.calledWithExactly(eventEmitter, MyBuildDisplayEvents.DISPLAY_UPDATED, listenerSpy);
		});
	});

	describe('removeListener()', function () {
		let eventEmitter,
			listenerSpy;
		
		before(function(){
			eventEmitter = sinon.stub(ImodEventEmitter, 'off');
			listenerSpy = sinon.spy();
		});

		after(function(){
			eventEmitter.restore();
		});

		it('should do the thing', function () {
			MyBuildDisplayStore.removeListener(listenerSpy);
			sinon.assert.calledWithExactly(eventEmitter, MyBuildDisplayEvents.DISPLAY_UPDATED, listenerSpy);
		});
	});
});
