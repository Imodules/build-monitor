import keyMirror from 'key-mirror';
import ImodEventEmitter from '../lib/ImodEventEmitter';
import {MyBuildDisplay} from '../lib/collections';

export const MyBuildDisplayEvents = keyMirror({
	DISPLAY_UPDATED: null
});

let buildItems = [];

Tracker.autorun(function () {
	buildItems = MyBuildDisplay.find({isDisplayed: true}).fetch();
	ImodEventEmitter.emit(MyBuildDisplayEvents.DISPLAY_UPDATED);
});

class MyBuildDisplayStore {

	addListener(listener){
		ImodEventEmitter.on(MyBuildDisplayEvents.DISPLAY_UPDATED, listener);
	}
	
	removeListener(listener){
		ImodEventEmitter.off(MyBuildDisplayEvents.DISPLAY_UPDATED, listener);
	}
	
	get(){
		return buildItems;
	}
}

export default new MyBuildDisplayStore();
