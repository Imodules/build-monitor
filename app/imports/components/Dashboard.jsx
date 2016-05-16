import React, {PropTypes} from 'react';
import moment from 'moment';
import ClockBar from './ClockBar.jsx';
import ConfigIcon from './ConfigIcon.jsx';
import BuildItemRow from './BuildItemRow.jsx';
import MyBuildDisplayStore from '../stores/MyBuildDisplayStore';

export default Dashboard = React.createClass({
	getInitialState() {
		return {
			displayItems: [],
			timeStamp: []
		}
	},
	
	componentDidMount(){
		MyBuildDisplayStore.addListener(this.getBuildItems);
	},
	
	componentWillUnmount(){
		MyBuildDisplayStore.removeListener(this.getBuildItems);
	},
	

	getBuildItems(){
		const displayItems = MyBuildDisplayStore.get();
		this.setState({displayItems});
		// return [
		// 	{
		// 		_id: 'sdf456',
		// 		name: 'This',
		// 		isLastBuildSuccess: true,
		// 		isBuilding:false,
		// 		builds: [
		// 			{
		// 				"id": 194448,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "170",
		// 				"isSuccess": true,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:194448",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-12T21:09:11.000Z"),
		// 				"finishDate":("2016-05-12T21:09:29.000Z"),
		// 				"usernames": [
		// 					"bgreen"
		// 				]
		// 			},
		// 			{
		// 				"id": 193916,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "167",
		// 				"isSuccess": true,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193916",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-11T06:00:10.000Z"),
		// 				"finishDate":("2016-05-11T06:00:22.000Z"),
		// 				"usernames": ["lfast"]
		// 			},
		// 			{
		// 				"id": 193469,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "166",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193469",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-10T06:00:16.000Z"),
		// 				"finishDate":("2016-05-10T06:00:28.000Z"),
		// 				"usernames": ["pstuart"]
		// 			}]
		// 	},
		// 	{
		// 		_id: 'sdf567',
		// 		name: 'is',
		// 		isLastBuildSuccess: false,
		// 		isBuilding:true,
		// 		whoBrokeIt:'bgreen',
		// 		builds: [
		// 			{
		// 				"id": 194448,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "170",
		// 				"isSuccess": true,
		// 				"isBuilding": true,
		// 				"href": "/guestAuth/app/rest/builds/id:194448",
		// 				"percentageComplete": 25,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-12T21:09:11.000Z"),
		// 				"finishDate":("2016-05-12T21:09:29.000Z"),
		// 				"usernames": [
		// 					"jstringer"
		// 				]
		// 			},
		// 			{
		// 				"id": 193916,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "167",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193916",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-11T06:00:10.000Z"),
		// 				"finishDate":("2016-05-11T06:00:22.000Z"),
		// 				"usernames": []
		// 			},
		// 			{
		// 				"id": 193469,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "166",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193469",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-10T06:00:16.000Z"),
		// 				"finishDate":("2016-05-10T06:00:28.000Z"),
		// 				"usernames": []
		// 			}]
		// 	}, {
		// 		_id: 'sdf678',
		// 		name: 'Test',
		// 		isLastBuildSuccess: false,
		// 		isBuilding:false,
		// 		whoBrokeIt:'bgreen',
		// 		builds: [
		// 			{
		// 				"id": 194448,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "170",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:194448",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-12T21:09:11.000Z"),
		// 				"finishDate":("2016-05-12T21:09:29.000Z"),
		// 				"usernames": [
		// 					"jstringer"
		// 				]
		// 			},
		// 			{
		// 				"id": 193916,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "167",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193916",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-11T06:00:10.000Z"),
		// 				"finishDate":("2016-05-11T06:00:22.000Z"),
		// 				"usernames": []
		// 			},
		// 			{
		// 				"id": 193469,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "166",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193469",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-10T06:00:16.000Z"),
		// 				"finishDate":("2016-05-10T06:00:28.000Z"),
		// 				"usernames": []
		// 			}]
		// 	}, {
		// 		_id: 'sdf789',
		// 		name: 'Stuff',
		// 		isLastBuildSuccess: true,
		// 		isBuilding:false,
		// 		builds: [
		// 			{
		// 				"id": 194448,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "170",
		// 				"isSuccess": true,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:194448",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-12T21:09:11.000Z"),
		// 				"finishDate":("2016-05-12T21:09:29.000Z"),
		// 				"usernames": [
		// 					"jstringer"
		// 				]
		// 			},
		// 			{
		// 				"id": 193916,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "167",
		// 				"isSuccess": true,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193916",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-11T06:00:10.000Z"),
		// 				"finishDate":("2016-05-11T06:00:22.000Z"),
		// 				"usernames": []
		// 			},
		// 			{
		// 				"id": 193469,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "166",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193469",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-10T06:00:16.000Z"),
		// 				"finishDate":("2016-05-10T06:00:28.000Z"),
		// 				"usernames": []
		// 			}]
		// 	},{
		// 		_id: 'sdf790',
		// 		name: 'Extra',
		// 		isLastBuildSuccess: true,
		// 		isBuilding:false,
		// 		builds: [
		// 			{
		// 				"id": 194448,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "170",
		// 				"isSuccess": true,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:194448",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-12T21:09:11.000Z"),
		// 				"finishDate":("2016-05-12T21:09:29.000Z"),
		// 				"usernames": [
		// 					"jstringer"
		// 				]
		// 			},
		// 			{
		// 				"id": 193916,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "167",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193916",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-11T06:00:10.000Z"),
		// 				"finishDate":("2016-05-11T06:00:22.000Z"),
		// 				"usernames": []
		// 			},
		// 			{
		// 				"id": 193469,
		// 				"serviceBuildId": "Administrative_CreateBuildserverArtifacts",
		// 				"serviceNumber": "166",
		// 				"isSuccess": false,
		// 				"isBuilding": false,
		// 				"href": "/guestAuth/app/rest/builds/id:193469",
		// 				"percentageComplete": null,
		// 				"statusText": "Success",
		// 				"startDate":("2016-05-10T06:00:16.000Z"),
		// 				"finishDate":("2016-05-10T06:00:28.000Z"),
		// 				"usernames": []
		// 			}]
		// 	}
		// ];
	},

	getStyle(){
		return 'col-xs-6'
	},

	render () {
		/*

		 */
		return (
			<div>
				<div id="dashboard">
					<div className="clockBar"><ClockBar timestamp={ moment().valueOf()}/></div>
					<div className="row">
						<BuildItemRow myBuildDisplays={this.state.displayItems}
						              buildItemStyle={this.getStyle()}/>
					</div>
					<div id="configLink">
						<ConfigIcon />
					</div>
				</div>
			</div>
		);
	}
});

