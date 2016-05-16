import React, {PropTypes} from 'react';

const ConfigIcon = React.createClass({
	propTypes: {},

	render () {
		return (
			<a href="/configure"><i className="fa fa-cogs"></i></a>
		);
	}
});

export default ConfigIcon;
