import React, { Component } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
export default class LinePlotPage extends Component {

	chartRef = React.createRef();

	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");
		
		new Chart(ctx, {
			type: "line",
			data: {
				labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho"],//etc
				datasets: [{ 
					data: [10,2,1,3,0,5,4],
					label: "Pedidos",
					borderColor: "#3e95cd",
					backgroundColor: "#7bb6dd",
					fill: false,
				}, { 
					data: [5,5,4,6,8,9,13],
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
}