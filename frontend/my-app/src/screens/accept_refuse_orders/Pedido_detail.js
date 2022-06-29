
//import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
//const handleOnclick
//this.props.location.sampleParam //"Hello"
import React, { useState, useEffect } from 'react'
import axios from "axios";

async function GetOrder_by_ID(currentOrderID) {

  return await axios
    .get("/request", {
      headers: { token: sessionStorage.getItem("token") },
      params: { id: currentOrderID }
    },

    )
    .then((response) => {
      // Get status from the API
      // Construct the json
      var infoJson = {
        status: response.status,
      };

      // If user has auth => Get the info
      if (infoJson.status === 200) {
        //console.log("ALL GOOD");
        infoJson.data = response.data;
        //console.log(infoJson)
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

export default function OrderContainer(props, { match }) {
  let content_msg = "";
  let params = useParams();
  const [fetched_MSG, setFetchedData] = useState([]);

  let urlAccept = "/pedidos_detail/" + (params.pedidoID) + "/accept/";
  let urlRefuse = "/pedidos_detail/" + (params.pedidoID) + "/refuse/";
  useEffect(() => {
    const getData = async () => {
      const data = await GetOrder_by_ID(params.pedidoID);
      setFetchedData(data.data);
    };
    getData();

  }, []);

  //console.log("DATA:",fetched_MSG.description);
  if (fetched_MSG.length === 0) {
    content_msg = "Loading";
  }
  else {
    content_msg = fetched_MSG.description;
  }

  return (

    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Typography variant="h3" align="center">
        Pedido {params.pedidoID}

      </Typography>

      <Container >
        <h1 style={{ backgroundColor: '#ffffff', border: "5px solid black" }}>
          {content_msg}
        </h1>

      </Container>

      <Stack direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={8}
        padding={3}
      >
        <Button component={Link} to={urlAccept} variant="contained" style={{ backgroundColor: "#0E3D41", }}>Aceitar </Button>
        <Button component={Link} to={urlRefuse} variant="contained" style={{ backgroundColor: "#0E3D41", }}>Recusar </Button>
        <Button component={Link} to="/pedidos_detail/" variant="contained" style={{ backgroundColor: "#0E3D41", }}>Cancelar </Button>

      </Stack>

    </Box>

  );
}
/*
                <div style={{ height: '500px', overflowY: 'scroll' }}>
*/