import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BarChartPage from "./BarChartPage";
import LinePlotPage from "./LinePlotPage";
import axios from "axios";
import { useState, useEffect } from 'react'

async function GetStatsMonth() { //thx
  //POST to server with route: /items
  //Args: route, token (in a json) and header
  return await axios
    .get("/admin/getRequestsByMonth", {
      headers: { token: sessionStorage.getItem("token") },
    })
    .then((response) => {
      // Get status from the API
      // Construct the 
      console.log("HERE");
      var infoJson = {
        status: response.status,
      };

      // If user has auth => Get the info
      if (infoJson.status === 200) {
        infoJson.dataArrays = response.data;
      }
      console.log("rep:", response)
      // Send the json
      return infoJson;
    })
    // Catch errors
    .catch(function (error) {
      //error.response.status => Status error
      //error.response.data.error => Data error
      // No permissions error
      if (error.response.status === 404) {
        return { status: 404 };
      }
      // Other errors
      else {
        return { status: 404 };
      }
    });
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {

  const [fetched_data, setFetchedData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data = await GetStatsMonth();
      console.log("d:", data)
      setFetchedData(data);
    };
    getData();

  }, []);

  console.log("DATAstat zezjui", fetched_data.dataArrays);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let dset1 = [];
  let dset2 = [];


  if (fetched_data.length !== 0) {
    dset1 = fetched_data.dataArrays.requests;
    dset2 = fetched_data.dataArrays.returnRequests;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pedidos/Devoluçoes - Gráfico de Linhas" {...a11yProps(0)} />
          <Tab label="Pedidos/Devoluçoes - Gráfico de Barras" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <LinePlotPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BarChartPage dataset1={dset1} dataset2={dset2} />
      </TabPanel>

    </Box>
  );

}
