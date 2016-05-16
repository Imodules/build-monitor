import React, {PropTypes} from 'react';

const PageHeader = React.createClass({
	propTypes: {
		headerText: PropTypes.string.isRequired,
		icon: PropTypes.string.isRequired
	},

	render () {
		return (
			<div className="page-header">
				<h1><i className={`fa ${this.props.icon}`}></i> {this.props.headerText}</h1>
			</div>
		);
	}
});

export default PageHeader;
