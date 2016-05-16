import React, {PropTypes} from 'react';
import moment from 'moment';

const CompletedStatusLabel = React.createClass({
	propTypes: {
		buildItem: PropTypes.object.isRequired
	},

	getLiveStamp(){
		let finishDate = this.props.buildItem.builds[0].finishDate;
		var time = moment(finishDate);

		if (!time.isValid()) {
			time = moment();
		}

		var timestamp = time.toISOString(),
			timestring = time.fromNow();

		return <span className="livestamp" data-livestamp={timestamp}>{timestring}</span>;
	},

	render () {
		let content = null;
		if (this.props.buildItem.isLastBuildSuccess) {
			content = <div className="bsLast">{ this.getLiveStamp() }</div>
		} else {
			content = <div className="bsBrokeit">{ this.props.buildItem.whoBrokeIt }</div>
		}
		return (
			content
		);
	}
});

export default CompletedStatusLabel;
