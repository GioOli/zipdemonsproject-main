import * as React from 'react';
import Filter from '../components/Filter';
import { makeStyles } from '@material-ui/styles';
import Typography from '@mui/material/Typography';
import { Button } from '@material-ui/core';
import DataTable from '../components/DefaultGrid';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import Box from '@mui/material/Box';
import gridStyle from '../components/GridTheme';
import { ThemeProvider } from '@mui/material/styles';


export default function ReturnActives() {
    //seletec rows
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [data, setData] = React.useState(null);
    const icones = { Lixo: 'lixo' }
    const [filter, setValue] = React.useState("");
    const [filterBy, setFilterBy] = React.useState("");
    const cats = ['Mobiliário de escritório', 'Computador', 'Mesa', 'Eletro-domesticos']
    const states = ['Aceite', 'Pendente']
    const boxes = true

    const useStyles = makeStyles({
        button: {
            marginTop: 20,
            float: 'right',
            padding: 10,
            width: 330,
            fontSize: 16,
            borderColor: '#0E3D41',
            color: '#2D5659',
            "&:hover": {
                color: '#A5B7B',
                borderColor: '#0E3D41',
            }
        },
        tituloHeader: {
            position: 'relative',
            width: '100%',
            marginTop: 30,
            marginBottom: 30,
            textAlign: 'left',
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
    const classes = useStyles();

    const cols = [
        "Utilizador",
        "Ativo",
        "Categoria",
        "Unidade",
        "Data",
        "Estado",
    ];

    const rows = {
        Utilizador: "Utilizador",
        Ativo: "Ativo",
        Categoria: "Categoria",
        Unidade: "Unidade",
        Data: "Data",
        Estado: "Estado",
        Ativo_id: "Ativo_id"
    }

    const alinhar = ['String', 'String', 'String','String', 'Data','NA'];
    const getData = React.useCallback(async () => {
        return await axios.get('/actives/returns')
            .then(response => {
                if (response.status === 200) {

                    Object.keys(response.data).forEach((key) => {
                        response.data[key]['Data'] = response.data[key]['Data'].split('T')[0]
                    });
                    setData(response.data)
                }
                else {
                    //setError404(true);
                }
            })
    }, [])


    function saveRows(rows) {
        setSelectedRows(rows);
    }

    function handleChange(newValue) {
        setFilterBy("Categoria")
        setValue(newValue);
    }

    function handleChange2(newValue) {
        setFilterBy("Estado")
        setValue(newValue);
    }

    const sendData = async () => {
        let itemsID = [];
        const header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        selectedRows.map((active) => (
            //adicionar a um array e mandar os itemID'.... (pode querer devolver mais q um) -> alterar backend
            itemsID.push(parseInt(active['Ativo_id']))

        ))

        const response = {
            token: sessionStorage.getItem('token'),
            itemsID: itemsID
        }

        await axios.post('/returnActive', response, header)
            .then(result => {

            })
    };

    React.useEffect(() => {
        getData();
    }, [getData])



    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <div className={classes.main}>
                {data === null ?
                    <div>
                        <Box sx={{ display: "flex" }}>
                            <CircularProgress />
                        </Box>
                    </div> :
                    <div>
                        <div className={classes.tituloHeader}>
                            <Typography variant="h3">Devoluções</Typography>
                        </div>
                        <div>
                            {(selectedRows.length === 0 || (selectedRows.length > 0 && selectedRows.some((element) => {
                                return element.Estado === true
                            })))
                                ?
                                <></> :
                                <Button onClick={sendData} href={'/actives/returns'} variant="contained" style={{ backgroundColor: "#0E3D41", margin: '20px' }}>Aceitar devoluções selecionadas</Button>
                            }
                        </div>
                        <div className={classes.filter}>
                            <Filter
                                options={cats}
                                titulo={"Filtrar por Categoria: "}
                                initialVal={filter}
                                onChange={handleChange}
                            />
                            <Filter
                                options={states}
                                titulo={"Filtrar por Estado: "}
                                initialVal={filter}
                                onChange={handleChange2}
                            />
                        </div>
                        <div className={classes.grid}>
                            <ThemeProvider theme={gridStyle}>
                                <DataTable
                                    value={filter}
                                    json={data}
                                    icones_used={icones}
                                    colunas={cols}
                                    linhas={rows}
                                    alinhar={alinhar}
                                    selectBox={boxes}
                                    filterBy={filterBy}
                                    selectedRows={saveRows}
                                />
                            </ThemeProvider>
                        </div>

                        
                    </div>
                }
            </div>
        </Box>
    )
}
