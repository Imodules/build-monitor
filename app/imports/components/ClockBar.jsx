import React, {PropTypes} from 'react';
import moment from 'moment';
import momenttz from 'moment-timezone';

const ClockBar = React.createClass({
	propTypes: {
		timestamp: PropTypes.number.isRequired
	},

	render () {
		return (
			<div>
				<div id="date" className="col-xs-4">{momenttz.tz(this.props.timestamp, "America/Chicago").format('MMMM Do YYYY')}</div>
				<div id="localTime" className="col-xs-4" style={{textAlign:'center'}}>{momenttz.tz(this.props.timestamp, "America/Chicago").format('h:mm:ss z')}</div>
				<div id="utcTime" className="col-xs-4" style={{textAlign:'right'}}>{moment(this.props.timestamp).utc().format('h:mm:ss z')}</div>
			</div>
		);
	}
});

export default ClockBar;
