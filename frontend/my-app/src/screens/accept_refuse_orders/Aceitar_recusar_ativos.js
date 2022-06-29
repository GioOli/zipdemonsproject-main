//import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
//import Pedido_detail from "./Pedido_detail";
//import { Route, Routes, BrowserRouter } from 'react-router-dom';
import axios from "axios";
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';



const columns = [
  {
    field: "data",
    headerName: "Data do Pedido",
    width: 250,
  },
  {
    field: "utilizador",
    headerName: "Utilizador",
    width: 250,
  },
  {
    field: "unidade",
    headerName: "Unidade do utilizador",
    width: 250,
  },
  {
    field: "linkPedido",
    headerName: "Ver pedido",
    width: 250,
    sortable: false,
    renderCell: (paramsCell) => {
      return (
        <div>
          <Link
            to={{
              pathname: "/pedidos_detail/" + paramsCell.id,
              pedidodetailProps: {
                pedidodetail: paramsCell.row,
              },
            }}
          >
            <Button variant="contained" style={{ backgroundColor: "#0E3D41" }}>
              Pedido
            </Button>
          </Link>
        </div>
      );
    },
  },
];

const rows2 = [{ id: 1, data: "Loading", user: "Loading", unidade: "Loading" }];

async function GetOrders() {
  //POST to server with route: /items
  //Args: route, token (in a json) and header
  const header = {
    headers: {
      token: sessionStorage.getItem("token"),
    },
  };
  return await axios
    .get("/unitrequests", header)
    .then((response) => {
      // Get status from the API
      // Construct the json
      var infoJson = {
        status: response.status,
        data: "",
      };

      // If user has auth => Get the info
      if (infoJson.status === 200) {
          //console.log("ALL GOOD");
          //console.log(response.data)
          infoJson.data = response.data;
      }

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


function PedidosGrid() {
  //const [isLoading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState([]);

    //const [isLoading, setLoading] = useState(true);
    //const [fetchedData, setFetchedData] = useState([]);
    
    //var tmpLog = GetOrders(1);
    //var tt =  fillData();


  useEffect(() => {
    const getData = async () => {
      const data = await GetOrders();
      setFetchedData(data);
    };
    getData();
  }, []);
    //console.log("DATA:",fetchedData);

   if (fetchedData.length===0){
        return (
            <div style={{ height:400, width: '100%' }}>
                <DataGrid rows={rows2} columns={columns} />
                <h1> </h1>
            </div>
        );
   }
    //console.log("Fetched:",fetchedData.data);
   //const rowsData = fetchedData.map((data)=>{
    //return ({ id: data.id, date: data.date, user:data.user,unidade:data.unidade })
    //});
    return (
        <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
              <div style={{width: '100%',marginTop: 30,marginBottom: 30,textAlign: 'left'}}>
                <Typography variant="h4" >Requisições Pendentes</Typography>
              </div>
            
            <div style={{ height:400, width: '100%' }}>
                <DataGrid rows={fetchedData.data} columns={columns} />
                <h1> </h1>
            </div>
        </Box>
    );
  }
  /*
  console.log("Fetched:", fetchedData.data);
  //const rowsData = fetchedData.map((data)=>{
  //return ({ id: data.id, date: data.date, user:data.user,unidade:data.unidade })
  //});
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={fetchedData.data} columns={columns} />
      <h1> </h1>
    </div>
  );
}
*/

export default PedidosGrid;
