/**
 * Created by paul on 4/26/15.
 */

'use strict';
Services.Factory = (function () {
	function GetService(server) {
		switch (server.type) {
			case 'teamcity': {
				return new Services.TeamCity(server, false/*s(server.url).contains('example.com')*/);
			} break;

			default: {
				throw 'Invalid server type: ' + server.type;
			}
		}
	}

	return {
		getService: GetService
	};
})();
