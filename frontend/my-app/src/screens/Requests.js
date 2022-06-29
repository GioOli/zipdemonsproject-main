import * as React from 'react';
import DataTable from '../components/DefaultGrid';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/styles';
import PopUp from '../components/PopUp';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import NotFoundPage from "./404NotFound.js";
import gridStyle from '../components/GridTheme';
import { ThemeProvider } from '@mui/material/styles';
import estilo from '../components/Themes';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
    tituloHeader: {
        position: 'relative',
        margin: 'auto',
        width: '100%',
        marginTop: 30,
        marginBottom: 30,
        textAlign: 'left',
    },
    grid: {
        textAlign: 'center',
        margin: 'auto',
        width: '100%',
    },
    main: {
        position: 'absolute',
        width: '100%',
        margin: 'auto',
    }
});


function Requested() {

    /*************************SÓ PARA SIMULAR A BD*****************************/
    //suponho que o que venha da BD seja algo deste género

    //Coisas que não tenho a certeza: 
    //Não sei se a data e o estado vêm juntos ou à parte
    //Não sei se a função do back-end que devolve isto só devolve os com estado = aceite ou devolve todos e eu depois só tenho de filtrar os aceites

    /* const requested_items = [
         {
             request_date: "12-10-2021",
             state: "Aceite",
             description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
         },
         {
             request_date: "27-10-2021",
             state: "Recusado",
             description: "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
         },
         {
             request_date: "08-11-2021",
             state: "Em Espera",
             description: "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
         },
     ];*/

    /*****************************************************************************/

    const classes = useStyles();

    //Ligação ao Back-end
    const [items, setItems] = React.useState(null);
    const [error404, setError404] = React.useState(false);

    const getRequests = React.useCallback(async () => {
        const header = {
            headers: { token: sessionStorage.getItem("token") }
        };

        return await axios.get('/requests', header)
            .then(response => {
                if (response.status === 200) {
                    setItems(Object.values(response.data));
                    console.log(response.data);
                }
                else {
                    setError404(true);
                }
            })
    }, [])

    React.useEffect(() => {
        getRequests();
    }, [getRequests])

    const cols = ['Data de requisição', 'Estado', 'Descrição'];
    //as rows tem de ter o mapeamento do nome da coluna para o nome que vem no json do back-end
    const rows = { 'Data de requisição': 'Requisição', Estado: 'Estado', Descrição: 'Descrição' };
    const alinhar = ['Data', 'String', 'String'];
    const icones = { Descrição: RemoveRedEyeOutlinedIcon };
    const boxes = false;

    //Para os botões dos detalhes
    const [description, setValue] = React.useState("");

    function handleChange(row, col) {
        if (col === 'Descrição') {
            setValue(row.Descrição);
            //console.log('Abre pop-up');
            handleClickOpen();
            console.log(description);
            console.log(row)
        }
    };

    //Para os pop-ups
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        //console.log('Entrou aquiiii!!!');
        setOpen(false);
    };

    function handleButton() {
        window.open("/makerequest", "_self");
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <div className={classes.main}>
                {items === null ? (
                    <div>
                        <Box sx={{ display: "flex" }}>
                            <CircularProgress />
                        </Box>
                    </div>
                ) : (
                    <div>
                        {!error404 ? (
                            <div>
                                <div className={classes.tituloHeader}>
                                    <Typography variant="h3" >Pedidos</Typography>
                                    <div style={{position: 'absolute', width:'99%', marginRight: '10px'}}>
                                        <ThemeProvider theme={estilo}>
                                            <Button variant="contained" onClick={handleButton}>Fazer Pedido</Button>
                                        </ThemeProvider>
                                    </div>  
                                </div>
                                <br></br>
                                <br></br>
                                <div className={classes.grid}>
                                    <ThemeProvider theme={gridStyle}>
                                        <DataTable json={items} icones_used={icones} colunas={cols} linhas={rows} alinhar = {alinhar} selectBox={boxes} onChange={handleChange} />
                                    </ThemeProvider>
                                </div>
                                <div>
                                    <PopUp open={open} description={description} title={'Descrição do Pedido'} actions={false} onChange={handleClose} />
                                </div>
                                 

                            </div>
                        ) :
                            (
                                <div>
                                    <NotFoundPage />
                                </div>
                            )}
                    </div>
                )}
            </div>
        </Box>
    );
};

export default Requested;