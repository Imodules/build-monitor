import React, {PropTypes} from 'react';

const ConfigureSizeRow = React.createClass({
	propTypes: {
		sizeClass: PropTypes.string.isRequired
	},

	render () {
		return (
			<div className="row">
				<div className="col-xs-12 col-sm-4">
					<h4>
						Size Class:
					</h4>
				</div>

				<div className="col-xs-12 col-sm-3">
					<input type="text" className="form-control sizeClass"
					       placeholder="col-xs-12 col-sm-6 col-md-4 col-lg-3" value={this.props.sizeClass}/>
				</div>
			</div>
		);
	}
});

export default ConfigureSizeRow;
