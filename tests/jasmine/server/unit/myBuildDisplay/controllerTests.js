/**
 * Created by paul on 5/3/15.
 */

'use strict';
describe('Controllers.MyBuildDisplay', function () {
	describe('onRemoveByBuildId()', function () {
		it('should remove all records for the buildId', function () {
			spyOn(Collections.MyBuildDisplay, 'remove');

			Controllers.MyBuildDisplay.onRemoveByBuildId('bid-994');

			expect(Collections.MyBuildDisplay.remove).toHaveBeenCalledWith({buildId: 'bid-994'});
		});
	});
});
