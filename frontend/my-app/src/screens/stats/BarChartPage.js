import React, { Component } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
export default class BarChartPage extends Component {

	chartRef = React.createRef();

	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");
		//let dataset1 = this.props.dataset1;
		//let dataset2 = this.props.dataset2; 


		console.log(" data1", this.props.dataset1);
		console.log("data2:",this.props.dataset2);
		if(this.props.dataset1){
			new Chart(ctx, {
				type: "bar",
				data: {
					labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],//etc
					datasets: [{ 
						data: this.props.dataset1, //[10,2,1,3,0,5,4,2,2,4,5,8],
						label: "Pedidos",
						borderColor: "#3e95cd",
						backgroundColor: "#7bb6dd",
						fill: false,
					}, { 
						data: this.props.dataset2,//[5,5,4,6,8,9,13,5,4,8,5,1],
						label: "Devoluçoes",
						borderColor: "#3cba9f",
						backgroundColor: "#71d1bd",
						fill: false,
					}, 
					] 
				},
				options: {
					maintainAspectRatio: false,
				}
			
			});
		}
		else{
			new Chart(ctx, {
				type: "bar",
				data: {
					labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],//etc
					datasets: [{ 
						data: [0,0,0,0,0,0,0,0,0,0,0,0],
						label: "Pedidos",
						borderColor: "#3e95cd",
						backgroundColor: "#7bb6dd",
						fill: false,
					}, { 
						data: [0,0,0,0,0,0,0,0,0,0,0,0],
						label: "Devoluçoes",
						borderColor: "#3cba9f",
						backgroundColor: "#71d1bd",
						fill: false,
					}, 
					]
				},
				options: {
					maintainAspectRatio: false,
				}
			
			});
		}
		
	}
	render() {
		return (
		
            <Box
      sx={{
        width: "50%",
        height:"50%",
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: 'white',
          opacity: [0.9, 0.8, 0.7],
        },
      }}>
    
				<canvas
				id="myChart"
                width="400" height="400"
				ref={this.chartRef}
				/>
        </Box>
    
			
			)
	}
}//