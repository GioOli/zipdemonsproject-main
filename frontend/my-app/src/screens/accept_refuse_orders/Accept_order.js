import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ItemDetails from '../../components/ItemDetails';
import IconButton from '@mui/material/IconButton';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert  ref={ref} variant="filled" {...props} />;
});
//Send id / action accept (string) / and notification / list items
async function sendConfirmationAccept(idPedido, items_Selected) {

    return await axios.post("/request/answer", {
          token: sessionStorage.getItem("token"),
          id:idPedido,
          action:"accept",
          item_ids:items_Selected,
          //justification:textNotification
      },)
        .then(response => {
            if (response.status === 200) {
                console.log("Task complete: accepted order.");
                
            }
            else {
                console.log("Fail action");
                
            }
            return response;
        })
}

async function GetDepartmentActives(token) { //thx
  //POST to server with route: /items
  //Args: route, token (in a json) and header
  return await axios
    .get("/manageactives", {
      headers: {token: sessionStorage.getItem("token")},
      },)
    .then((response) => {
      // Get status from the API
      // Construct the json
      var infoJson = {
        status: response.status,
      };

      // If user has auth => Get the info
      if (infoJson.status === 200) {
        infoJson.availableActives = response.data.Disponíveis;
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
// useEffect as it is the first thing to be executed in the page
  // Check if the user has permissions to see the page
  // Get the data from the API if it has those permissions
async function checkUserPermissions() {
//API call
//JWT Token
const tokenJson = { token: sessionStorage.getItem("token") };
var infoJsonnn = await GetDepartmentActives(tokenJson).then((infoJson) => {
    // Get status answer from backend
    // User doesn't have permissions to view this page
    if (infoJson.status === 200) {
    // Arrays for filters
    // Unique categories list in available actives
    var availableActivesCategories = [];
    for (var i in infoJson.availableActives) {
        if (
        !availableActivesCategories.includes(
            infoJson.availableActives[i].Categoria
        )
        ) {
        availableActivesCategories.push(
            infoJson.availableActives[i].Categoria
        );
        }
    }

    infoJson.availableActivesCategories = availableActivesCategories;

    // Setup the items
    var availableActives = [];
    for (var key in infoJson.availableActives) {
        availableActives.push({
        id: key,
        name: infoJson.availableActives[key].Ativo,
        category: infoJson.availableActives[key].Categoria,
        sub_category: infoJson.availableActives[key].Subcategoria,
        });
    }
    // Overwrite the previous jsons with the new one with the correct format
    infoJson.availableActives = availableActives;
    } else if (infoJson.status === 404) {
    // User has permissions to view this page
    } else {
    // Uknown error
    console.log("Uknown error");
    }

    return infoJson;
});
return infoJsonnn;
}




const delay = ms => new Promise(res => setTimeout(res, ms));
//NEW VERSION WITH POPUPDETAIL

function AcceptContainer(props) {
    const [loading, setLoading] = React.useState(false);
    function handleClickLoading() {
        setLoading(true);
    }
    const [openDetails, setOpenDetails] = React.useState(false);
    const [paramsCurrCell, setParamsCurrCell] = React.useState(null);
    
    function handleClickIcon(){
        setOpenDetails(true);
        
    }
    
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
        handleClickLoading();

    };



    const columns = [

    { 
        field: 'name', headerName:'Ativo', width: 250
    },
    {
        field: 'category', headerName: 'Categoria', width: 250 
    },
    {
        field: "details",
        headerName: "Detalhes", //paramsCell.id ; paramsCell.row
        width: 250,
        sortable: false,
        renderCell: (paramsCell) => {
            
        return (
            <div>
             <IconButton onClick={() => { 
                 //console.log("PARAMSCELL:",paramsCell);
                 setParamsCurrCell(paramsCell);
                 handleClickIcon();
              }}
              color="primary" aria-label="detalhes ativo" component="span">
            <RemoveRedEyeOutlinedIcon></RemoveRedEyeOutlinedIcon>
            </IconButton>
                
            </div>
        );
        },
    },
    ];
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
    }

    setOpen(false);
    };

    //window.open("/", "_self");
    const waitafewsec = async () => {
            await delay(3000);
            console.log("Waited 3s");
            window.open("/pedidos_detail", "_self");
    };

    //Get available items(ativos)
    const [fetched_Ativos, setFetchedData] = useState([]);
    useEffect(() => {
    const getData = async () => {
      const data = await checkUserPermissions();
      setFetchedData(data);
    };
    getData();
    
    }, []);
    //get rows selected 
    const [selectionStateRows, setSelectionStateRows] = React.useState([]); // rows selected on the datagrid
    //console.log("DATA:",fetched_Ativos);
    //console.log("ROWS befor:",selectionStateRows);

    //ALERT message stuff
    const [msg_alert, setMsg_alert] = React.useState("");
    const [severity_status, setSeverity_status] = React.useState("");
    let params = useParams();
    //console.log("All good?");

    async function handleSend() {

        //console.log(">>> STATEdd:",selectionStateRows.length);
        if (selectionStateRows.length===0){
            //console.log("HERE if")
            setSeverity_status("warning");
            setMsg_alert("Please select any items (if available) before confirm.");
            handleClick();
            //waitafewsec();
            setLoading(false);
            
        }
        else{
            //vai mandar pedido ao back-end
            //console.log("here eslse");
            await sendConfirmationAccept(params.pedidoID,selectionStateRows).then ((result) => {
                //console.log("Gg ez pedido recusado com sucesso");
                if (result.status===200){
                    console.log("wtf")
                    setSeverity_status("success");
                    setMsg_alert("Order completed with success!");
                    handleClick();
                    waitafewsec();
                }
                else {
                    setSeverity_status("error");
                    setMsg_alert("Error!");
                    //console.log("ERROR",result.status);
                    handleClick();
                    waitafewsec();
                }
                
                
            });
        }
        
    }


    return (


            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}> 
                <Typography variant="h3" align="center">
                    Aceitar pedido {params.pedidoID}
                                
                </Typography>


                <Container >
                     <Box
                        sx={{
                            paddingBottom:"10px",
                            width: "auto",
                            maxWidth: '100%',
                        }}
                        >
                        <div>
                            <TextField
                            fullWidth
                            id="filled-multiline-static"
                            label="Notification"
                            multiline
                            rows={4}
                            defaultValue=""
                            variant="filled"
                        
                            />
                        </div>
                        </Box>
                        
                
                </Container>
                <div style={{ padding:0, height:"400px", width: '100%' }}>
                <DataGrid checkboxSelection rows={fetched_Ativos.availableActives} columns={columns} 
                    onSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRowData = fetched_Ativos.availableActives.filter((row) =>
                            selectedIDs.has(row.id.toString())
                        );
                        console.log("selected stuff:",selectedRowData);
                        let tmpArray=[];
                        
                        for (let i = 0; i < selectedRowData.length; i++) {
                            //console.log("----------->>>>>>->>",selectedRowData[i].id)
                            tmpArray.push(parseInt(selectedRowData[i].id));
                        }

                        //console.log("tmp array",tmpArray);
                        setSelectionStateRows(tmpArray);
                        }
                    }
                 />
                 
                </div>

                <Stack direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={8}
                    paddingBottom={5}
                    paddingTop={1}
                >
                        <LoadingButton variant="contained"  onClick={handleSend}  loading={loading} style={{backgroundColor: "#0E3D41",}}>Confirmar </LoadingButton>
                        <Button component={Link} to="/pedidos_detail/" variant="contained" style={{backgroundColor: "#0E3D41",}}>Cancelar </Button>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                         <Alert onClose={handleClose} severity={severity_status} sx={{ width: '100%' }}>
                            {msg_alert}
                        </Alert>

                        </Snackbar>
                </Stack>
                {openDetails ? (
            <ItemDetails
            openItemDetails={openDetails}
            setItemDetails={setOpenDetails}
            selectedRowId={paramsCurrCell.id}
            selectedRowCategory={paramsCurrCell.row}
            />
             ) : (<>
             </>
            )}
            </Box>

        
            
    );
}

export default AcceptContainer;
