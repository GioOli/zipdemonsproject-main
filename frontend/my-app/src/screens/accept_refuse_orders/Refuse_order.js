import * as React from 'react';
//import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState} from 'react'
import { useParams} from 'react-router-dom';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
//const handleOnclick
//this.props.location.sampleParam //"Hello"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert ref={ref} variant="filled" {...props} />;
});
async function sendJustificationRefuse(textJustification,idPedido) {

    return await axios.post("/request/answer", {
          token: sessionStorage.getItem("token"),
          id:idPedido,
          action:"refuse",
          justification:textJustification
      },)
        .then(response => {
            if (response.status === 200) {
                console.log("Task complete:refused order.");
                
            }
            else {
                console.log("Fail action");
                
            }
            return response;
        })
}
const delay = ms => new Promise(res => setTimeout(res, ms));

//Main fct
export default function RefuseContainer(props) {
    //loading button
    const [loading, setLoading] = React.useState(false);
    function handleClickLoading() {
        setLoading(true);
    }
    //open for alert
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
        handleClickLoading();

    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
    }

    setOpen(false);
    };

  
    //wait fct 
    //window.open("/", "_self");
    const waitafewsec = async () => {
            await delay(3000);
            console.log("Waited 5s");
            window.open("/", "_self");
    };
    //justification text (maybe not needed after all..)
    var [textfieldval, setTextFieldVal] = useState('');
    function handleTextFieldChange(e) {
        setTextFieldVal(e.target.value);
    }

    const [msg_alert, setMsg_alert] = React.useState("");
    const [severity_status, setSeverity_status] = React.useState("");

    let params = useParams();
    //console.log(textfieldval)
    //console.log("HERE ",params.pedidoID);
    async function handleSend() {

        //vai mandar pedido ao back-end
        await sendJustificationRefuse(textfieldval,params.pedidoID).then ((result) => {
            //console.log("Gg ez pedido recusado com sucesso");
            if (result.status===200){
                setSeverity_status("success");
                setMsg_alert("Pedido recusado com sucesso!");
            }
            else {
                setSeverity_status("error");
                setMsg_alert("Error");
                //console.log("ERROR",result.status);

            }
            handleClick();
            waitafewsec();
        });
        
    }



    return (

        
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
                <Typography variant="h3" align="center">
                    Recusar pedido {params.pedidoID}
                                
                </Typography>

                
                <Container maxWidth="lg">
                     <Box
                        sx={{
                            width: "auto",
                            maxWidth: '100%',
                        }}
                        >
                        <div>
                            <TextField
                            fullWidth
                            id="filled-multiline-static"
                            label="Justification"
                            multiline
                            rows={4}
                            defaultValue=""
                            variant="filled"
                            onChange={handleTextFieldChange}

                            />
                        </div>
                        </Box>
                        
                </Container>
                
                <Stack direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={8}
                    padding={3}
                >
                        <LoadingButton variant="contained"  onClick={handleSend}  loading={loading} style={{backgroundColor: "#0E3D41",}}>Confirmar </LoadingButton>
                        <Button component={Link} to="/pedidos_detail/" variant="contained" style={{backgroundColor: "#0E3D41",}}>Cancelar </Button>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                         <Alert onClose={handleClose} severity={severity_status} sx={{ width: '100%' }}>
                            {msg_alert}
                        </Alert>
                        </Snackbar>
                </Stack>

            </Box>

     

    );
}