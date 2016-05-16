import React, {PropTypes} from 'react';

const BuildHistory = React.createClass({
	propTypes: {
		builds: PropTypes.array.isRequired
	},

	getBuildItemClass(success){
		return `bhLabel ${success ? 'bh-succ' : 'bh-fail'}`;
	},
	
	getBuildItemIcon(build){
		let successIcon="fa-rebel",
			failingIcon="fa-first-order",
			buildingIcon="fa-fighter-jet faa-passing animated";

		if (build.isBuilding) {
			return buildingIcon;
		}

		return build.isSuccess ? successIcon : failingIcon;
	},

	render() {
		return (
			<h4>
				{this.props.builds.map((build) =>{
					return <div key={build.id} className={this.getBuildItemClass(build.isSuccess)}>
								<i className={`fa ${this.getBuildItemIcon(build)}`}></i>
							</div>
				})}
				<div className="clearFix"></div>
			</h4>
		);
	}
});

export default BuildHistory;
