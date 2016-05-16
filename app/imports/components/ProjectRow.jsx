import React, {PropTypes} from 'react';

const ProjectRow = React.createClass({
	propTypes: {
		project: PropTypes.object.isRequired
	},

	render () {

		// <div id="co_{{_id}}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
		// 	<div class="panel-body">
		// 		{{#if hasChildren}}
		// 		<div class="panel-group" id="acc_{{_id}}" role="tablist" aria-multiselectable="true">
		// 			{{#each myChildren}}
		// 			{{> cfgProjectRow}}
		// 			{{/each}}
		// 		</div>
		// 		{{/if}}
		// 		{{#each myBuilds}}
		// 		{{> cfgBuildTypeRow}}
		// 		{{/each}}
		// 	</div>
		// </div>
		return (
			<div class="panel panel-default">
				<div class="panel-heading" role="tab" id="ph_{{_id}}">
					<h4 class="panel-title">
						<div class="pull-right">
							<span class="label label-default">25</span>
							<span class="label label-info">52</span>
							<span class="label label-primary">42</span>
						</div>
						<a data-toggle="collapse" data-parent="#{{parentAccordianId}}" href="#co_{{_id}}" aria-expanded="true"
						   aria-controls="collapseOne">
							<i id="ic_{{_id}}" class="fa fa-caret-right fa-fw"></i> {{name}}
						</a>
					</h4>
				</div>

			</div>
		);
	}
});

export default ProjectRow;
