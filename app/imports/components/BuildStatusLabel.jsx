import React, {PropTypes} from 'react';
import BuildingStatusLabel from './BuildingStatusLabel.jsx';
import CompletedStatusLabel from './CompletedStatusLabel.jsx';

const BuildStatusLabel = React.createClass({
	propTypes: {
		buildItem: PropTypes.object.isRequired
	},

	render () {
		let content = null,
			build = this.props.buildItem;
		if(build.isBuilding) {
			content = <BuildingStatusLabel buildItem={build}/>;
		} else{
			content= <CompletedStatusLabel buildItem={build}/>;
		}

		return (
			<div>
				{content}
			</div>
		);
	}
});

export default BuildStatusLabel;
