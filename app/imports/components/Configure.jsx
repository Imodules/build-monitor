import React, {PropTypes} from 'react';

import PageHeader from './PageHeader.jsx';
import ConfigureSizeRow from './ConfigureSizeRow.jsx';
import BuildsList from './BuildsList.jsx';

const Configure = React.createClass({
	getInitialState(){
		return {displayedOnly: false};
	},
	toggleDisplayedOnly(){
		this.setState({displayedOnly: !this.state.displayedOnly});
	},

	render () {
		return (
			<div>
				<PageHeader icon="fa-cog" headerText="Configure"/>
				<ConfigureSizeRow sizeClass="col-xs-12 col-sm-6 col-md-4 col-lg-3"/>
				{/* start on /servers route first.
				<BuildsList displayedOnly={this.state.displayedOnly}
				            displayedOnlyCallback={this.toggleDisplayOnly} 
				            builds={this.state.builds} />*/}
				
				
			</div>
		);
	}
});

export default Configure;
