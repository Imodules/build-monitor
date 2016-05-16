import React, {PropTypes} from 'react';

const BuildsList = React.createClass({
	propTypes: {
		displayedOnly: PropTypes.bool.isRequired,
		displayedOnlyCallback: PropTypes.func.isRequired,
		builds: PropTypes.array.isRequired
	},

	render () {
		return (
			<div>
				<div className="row">
					<div className="col-xs-12">
						<ul className="nav nav-pills">
							<li id="buildsOnly" role="presentation" className="active">
								<a href="#" onclick={this.props.displayedOnly = !this.props.displayedOnly}><i className="fa fa-filter"></i> Show Displayed Builds Only</a>
							</li>
						</ul>
					</div>
				</div>
				<br/>

				<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
					{builds.map((build)=>{
						
					})}
				</div>
			</div>
		);
	}
});

export default BuildsList;
