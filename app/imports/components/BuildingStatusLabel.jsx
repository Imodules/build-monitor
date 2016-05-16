import React, {PropTypes} from 'react';

const BuildingStatusLabel = React.createClass({
	propTypes: {
		buildItem: PropTypes.object.isRequired
	},

	render () {
		let build = this.props.buildItem.builds[0];
		return (
			<div>
				<div className="bsLast">
					{build.usernames}
				</div>
				<div className="bsTotal">
					{`${build.percentageComplete}%`}
				</div>
			</div>
		);
	}
});

export default BuildingStatusLabel;
