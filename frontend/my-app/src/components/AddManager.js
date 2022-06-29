import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import Button from '@mui/material/Button';
import axios from 'axios';
import DataTable from '../components/DefaultGrid';
import { makeStyles } from '@material-ui/styles';
import FilterByText from "./FilterByText";
import gridStyle from '../components/GridTheme';
import { ThemeProvider } from '@mui/material/styles';

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


function AddManagers(props) {

    //Para css
    const classes = useStyles();

    const { title, children, openAddManager, setAddManager, normalUserInDepartment } = props;
    const onClose = () => {
        setAddManager(false);
    }

    const cols = ['Nome', 'Email'];
    //as rows tem de ter o mapeamento do nome da coluna para o nome que vem no json do back-end
    const rows = { Nome: 'displayname', Email: 'email', Id: 'id'};
    const alinhar = ['String', 'String'];
    const icones = { };
    const boxes = true;

    function handleDetails(row, col) {
        //console.log(row, col);
    };

    var [selectedRows, setSelectedRows] = React.useState([]);

    function saveRows(rows) {
        setSelectedRows(rows);
        //console.log(rows);
    }

    var request;
    function handleSelectedRows(event){
        var fOptions = Object.keys(selectedRows).map(function (key) {
            var id = selectedRows[key]['Id'];
            giveUserPermissions(id);
        })

        setAddManager(false);
        window.location.reload(true);
        
    }

    const giveUserPermissions = (userID) => {
        request = {
            id : userID
        }
        sendData();
    }

    const sendData = async () => {
        const header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return await axios.post('/admin/newUnitManager', request, header).then(response => {
                if(response.status === 200) {
                } else {
                }
            })

    };

    var newArray = normalUserInDepartment;
    const [text, setValue] = React.useState("");
    function handleChange(newValue) {
        //console.log("On main", newValue);
        setValue(newValue);
      }

    return (
        <Dialog open={openAddManager}
            fullWidth
            maxWidth="100"
            onBackdropClick={onClose}>
            <DialogTitle>
                <div>
                    <h1>Adicionar Gestor</h1>
                </div>
            </DialogTitle>
            <DialogContent>
                <div>
                    <Button
                        onClick={(event) => {
                            handleSelectedRows(event);
                        }}
                        variant="contained"
                        style={{
                            backgroundColor: "#0E3D41", margin: '20px'
                        }}
                        >
                        Dar Permissões
                    </Button>
                </div>
                <div className={classes.filter}>
                    <FilterByText
                        titulo={""}
                        initialVal={""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <ThemeProvider theme={gridStyle}>
                    <DataTable text={text} json = {newArray} icones_used = {icones} colunas = {cols} linhas = {rows} alinhar={alinhar} selectBox = {boxes} filterBy = "Nome" onChange={handleDetails} selectedRows={saveRows}/>
                </ThemeProvider>
                </div>
                
                </DialogContent>
        </Dialog>
    )
}

export default AddManagers;