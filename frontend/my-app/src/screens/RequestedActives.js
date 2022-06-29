import * as React from 'react';
import DataTable from '../components/DefaultGrid';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Typography from '@mui/material/Typography';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Filter from '../components/Filter';
import ItemDetails from '../components/ItemDetails';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PopUp from '../components/PopUp';
import NotFoundPage from "./404NotFound.js";
import estilo from '../components/Themes';
import gridStyle from '../components/GridTheme';
import { ThemeProvider } from '@mui/material/styles';

const useStyles = makeStyles({

    tituloHeader: {
        position: 'relative',width: '100%',marginTop: 30,marginBottom: 30,textAlign: 'left',
    },
    grid: {
        margin: 'auto',
        width: '100%',
    },
    main: {
        position: 'absolute',
        width: '100%',
        margin: 'auto',
    }
});

async function sendItems(items) {
    const header = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const request = {
        token: sessionStorage.getItem('token'),
        id: items
    };

    return await axios.post('/item/returnrequest', request, header)
        .then(response => {
            console.log(response);
        })
}


function RequestedActives() {

    /*const requested_items = [
        {
            id: 1,
            name: "Computador Mac da Rosa super lento",
            request_date: "12-10-2021",
            category: "Computadores",
            sub_category: "Portatil"
        },
        {
            id: 2,
            name: "Telemovel todo fdd da Rosa",
            request_date: "13-10-2021",
            category: "Telemoveis",
            sub_category: ""
        },
        {
            id: 3,
            name: "Mesa da Barbie",
            request_date: "14-10-2021",
            category: "Mobiliário",
            sub_category: "Mesa",
        },
        {
            id: 4,
            name: "Rato",
            request_date: "15-10-2021",
            category: "Periféricos",
            sub_category: "Rato", 
        },
        {
            id: 5,
            name: "Mesa de Vidro",
            request_date: "14-10-2021",
            category: "Mobiliário",
            sub_category: "Mesa",
        },
        {
            id: 6,
            name: "Mesa de Madeira",
            request_date: "14-10-2021",
            category: "Mobiliário",
            sub_category: "Mesa",
        },
        {
            id: 7,
            name: "Computador XPTO",
            request_date: "12-10-2021",
            category: "Computadores",
            sub_category: "Portatil"
        },
    ];*/

    //Para css
    const classes = useStyles();

    //Ligação ao Back-end
    const [error404, setError404] = React.useState(false);
    const [items, setItems] = React.useState(null);

    const getItems = React.useCallback(async () => {
        const header = {
            headers: { token: sessionStorage.getItem("token") }
        };

        const itemsParams = {
            params: { quantify: false }
        };

        return await axios.get('/myitems', header, itemsParams)
            .then(response => {
                if (response.status === 200) {
                    setItems(response.data);
                    console.log(response.data)
                }
                else {
                    setError404(true);
                }
            })
    }, [])

    React.useEffect(() => {
        getItems();
    }, [getItems])

    const [categories, setCategories] = React.useState(null);
    const getCategories = React.useCallback(async () => {

        return await axios.get('/getCategories')
            .then(response => {
                if (response.status === 200) {
                    setCategories(response.data);
                    //console.log(response.data)
                }
                else {
                    setError404(true);
                }
            })
    }, [])

    React.useEffect(() => {
        getCategories();
    }, [getCategories])


    //Para a grid default
    const cols = ['Imagem', 'Ativo', 'Requisição', 'Detalhes'];
    //as rows tem de ter o mapeamento do nome da coluna para o nome que vem no json do back-end
    const rows = { ActiveId: 'id', Imagem: '', Ativo: 'name', Requisição: 'request_date', Categoria: 'category', SubCategoria: 'sub_category', isSelectable: true };
    //Para alinhar por tipo
    const alinhar = ['NA', 'String', 'Data', 'NA'];
    const icones = { Detalhes: RemoveRedEyeOutlinedIcon };
    const boxes = true;

    //Para a filtragem
    const [category, setValue] = React.useState("");
    function handleChange(newValue) {
        //console.log("On main", newValue);
        setValue(newValue);
    }

    //Para os botões de detalhes
    var [openItemDetails, setItemDetails] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState(null);
    const [selectedRowCategory, setSelectedRowCategory] = React.useState("");

    function handleDetails(row, col) {
        //console.log(row, col);
        if (col === 'Detalhes') {
            setSelectedRowId(row['ActiveId']);
            setSelectedRowCategory(row['Categoria']);
            setItemDetails(true);
        }
    };

    //Para botão de devolver
    var [selectedRows, setSelectedRows] = React.useState([]);

    function saveRows(rows) {
        setSelectedRows(rows);
        //console.log(rows);
    }

    //Para o pop-up
    const [open, setOpen] = React.useState(false);
    const popupMsg = "Tem a certeza que pretende devolver os ativos selecionados?";
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        //console.log('Entrou aquiiii!!!');
        setOpen(false);
    };

    function handleButton() {
        //console.log(selectedRows);
        handleClickOpen();
    }

    async function handleSend() {
        //console.log(selectedRows);
        let arrItems = [];
        selectedRows.forEach(element => {
            arrItems.push(Number(element.ActiveId));
        });
        console.log(arrItems);
        //tá só a mandar o 1º porque o endpoint não tá ready para receber vários
        await sendItems(arrItems);
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
                {items === null || categories === null ? (
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
                                    <Typography variant="h4" >Ativos Requisitados</Typography>
                                </div>
                                <div>
                                    {(selectedRows.length !== 0 ?
                                    <ThemeProvider theme={estilo}>
                                        <Button variant="contained" className={classes.button} onClick={handleButton}>Devolver Ativos Selecionados</Button>
                                    </ThemeProvider>
                                    :
                                    <></>
                                    )}
                                </div>
                                <div className={classes.filter}>
                                    <Filter options={categories} titulo={"Filtrar por categoria: "} initialVal={category} onChange={handleChange} />
                                </div>
                                <div>
                                    <PopUp open={open} title='Confirmação' description={popupMsg} onChange={handleClose} actions={true} handleSend={handleSend} />
                                </div>
                                <div className={classes.grid}>
                                    <ThemeProvider theme={gridStyle}>
                                        <DataTable value={category} json={items} icones_used={icones} colunas={cols} linhas={rows} alinhar = {alinhar} selectBox={boxes} filterBy="Categoria" onChange={handleDetails} selectedRows={saveRows} />
                                    </ThemeProvider>
                                    
                                </div>
                                {openItemDetails ? (
                                    <ItemDetails
                                    openItemDetails={openItemDetails}
                                    setItemDetails={setItemDetails}
                                    selectedRowId={selectedRowId}
                                    selectedRowCategory={selectedRowCategory}
                                    />
                                ) : (
                                    <></>
                                )}
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

export default RequestedActives;