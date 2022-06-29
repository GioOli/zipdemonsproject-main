import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import PopUp from '../components/PopUp';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import estilo from '../components/Themes';
import { ThemeProvider } from '@mui/material/styles';

async function sendRequest(textfieldval) {
    var msg = '';

    const header = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const request = {
        token: sessionStorage.getItem('token'),
        pedido: textfieldval
    };

    return await axios.post('/user/request', request, header)
        .then(response => {
            if (response.status === 200) {
                //console.log('O seu pedido foi enviado com sucesso. Aguarde a decisão do gestor da Unidade.');
                msg = 'O seu pedido foi enviado com sucesso. Aguarde a decisão do gestor da Unidade.';
            }
            else {
                //console.log('Algo correu mal. Tente novamente!');
                msg = 'Algo correu mal. Tente novamente!';
            }
            return msg;
        })
}

function MakeRequest() {

    //const classes = useStyles();

    const [popupMsg, setpopupMsg] = React.useState("");
    const [error, setError] = React.useState(false);

    var [textfieldval, setTextFieldVal] = React.useState('');
    function handleTextFieldChange(e) {
        setTextFieldVal(e.target.value);
    }

    async function handleSend() {
        //check if string only contains whitespace (ie. spaces, tabs or line breaks)
        if (!textfieldval.replace(/\s/g, '').length) {
            setError(true);
        }
        else {
            setError(false);
            //vai mandar pedido ao back-end
            await sendRequest(textfieldval).then((result) => {
                setpopupMsg(result);
                handleClickOpen();
            });
        }
    }

    function handleCancel() {
        window.open("/requests", "_self");
    }

    //Para os pop-ups
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        //console.log('Entrou aquiiii!!!');
        setOpen(false);
        window.open("/requests", "_self");
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <div>
                <Typography variant="h3" sx={{ width: '97%', margin: 'auto', marginTop: '20px' }}>Fazer Pedido</Typography>
            </div>
            <div>
                <PopUp open={open} title="Estado do Pedido" description={popupMsg} onChange={handleClose} actions={false} />
            </div>
            <div>
                {error ?
                    <div style={{ width: '97%', align: 'center', margin: 'auto', marginTop: '20px' }}>
                        <Alert sx={{ marginTop: '20px' }} severity="error">Por favor introduza uma descrição do pedido!</Alert>
                    </div>
                    :
                    <></>
                }
            </div>
            <div>
                <Box style={{ margin: 'auto',width: '97%', marginTop: '20px' }}>
                    <TextField multiline rows={12} fullWidth label="Descrever Pedido" id="description" onChange={handleTextFieldChange} />
                </Box>
            </div>
            <div>
                <ThemeProvider theme={estilo}>
                    <div style={{margin: 'auto', width: '97%', align: 'center'}}>
                        <Button variant="contained" onClick={handleSend}>Enviar</Button>
                        <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
                    </div>
                </ThemeProvider>
            </div>
        </Box>
    );
}

export default MakeRequest;