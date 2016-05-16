import React, {PropTypes} from 'react';
import BuildItem from './BuildItem';

const BuildItemRow = React.createClass({
	propTypes: {
		myBuildDisplays: PropTypes.array.isRequired,
		buildItemStyle: PropTypes.string.isRequired
	},

	render () {
		let style = this.props.buildItemStyle;
		return (
			<div>
				{
					this.props.myBuildDisplays.map(function(displayItem){
						return <BuildItem key={displayItem._id} displayItem={displayItem} sizingClass={style}/>
					})
				}
				
			</div>
		);
	}
});

export default BuildItemRow;
