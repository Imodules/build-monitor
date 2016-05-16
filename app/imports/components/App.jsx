import React, {PropTypes} from 'react';

const App = React.createClass({
	propTypes: {
		content: PropTypes.object.isRequired
	},

	render () {
		return (
			<div className="container-fluid">
				<div className="row" style={{marginBottom: '20px'}}>
					<div className="col-xs-6">
						<a href="/" className="btn btn-default"><i className="fa fa-dashboard"></i>
							Dashboard</a>
					</div>
					<div className="col-xs-6" style={{textAlign:'right'}}>
						<button type="button" id="logout" className="btn btn-default"><i className="fa fa-sign-out"></i> Logout</button>
					</div>
				</div>

				<div className="row">
					<div className="col-xs-12">
						{this.props.content}
					</div>
				</div>
			</div>
		);
	}
});

export default App;
