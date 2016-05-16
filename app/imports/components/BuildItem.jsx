import React, {PropTypes} from 'react';

import BuildHistory from './BuildHistory.jsx';
import BuildStatusLabel from './BuildStatusLabel.jsx';

export const BuildItem = React.createClass({
	propTypes: {
		sizingClass: PropTypes.string.isRequired,
		displayItem: PropTypes.object.isRequired,
		buildItem: PropTypes.object.isRequired
	},
	
	getBuildStatusStyle(){
		let passFail = this.props.buildItem.isLastBuildSuccess ? 'success' : 'error';
		let building = this.props.buildItem.isBuilding ? 'blink_me' : '';

		return `${passFail} ${building}`;
	},
	getDisplayName(){
		return buildItem.name;
	},
	render () {
		let buildItem = this.props.buildItem;
		return (
			<div>
				<div className={this.props.sizingClass + ' buildItem'}>
					<div className={'bi-wrapper '+ this.getBuildStatusStyle()}>
					<div className="bi-title">{this.getDisplayName()}</div>
					<div className="bi-sub-title">{buildItem.subTitle}</div>
					<BuildHistory builds={buildItem.builds}/>
					<BuildStatusLabel buildItem={buildItem} />
				</div>
				</div>

			</div>
		);
	}
});
