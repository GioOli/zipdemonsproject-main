import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import NotFoundPage from "./404NotFound.js";
import { Grid } from "@mui/material";
import AddManager from "../components/AddManager";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

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

function Admin() {

    //Para css
    const classes = useStyles();

    //Ligação ao Back-end
    const [error404, setError404] = React.useState(false);

    const [openAddManager, setAddManager] = React.useState(false);
    const [normalUserInDepartment, setNormalUserInDepartment] = React.useState(null);

    const [users, setUsers] = React.useState(null);
    const getUsers = React.useCallback(async () => {

        return await axios.get('/admin/getUnitManagersOrderedByDepartment').then(response => {
            if (response.status === 200) {
                setUsers(response.data);
            }
            else {
                setError404(true);
            }
        })
    }, [])

    React.useEffect(() => {
        getUsers();
    }, [getUsers])

    const [normalUsers, setNormalUsers] = React.useState(null);
    const getNormalUsers = React.useCallback(async () => {

        return await axios.get('/admin/getNormalUsersOrderedByDepartment').then(response => {
            if (response.status === 200) {
                setNormalUsers(response.data);
            }
            else {
                setError404(true);
            }
        })
    }, [])

    React.useEffect(() => {
        getNormalUsers();
    }, [getNormalUsers])


    var builder = [];
    var res = [];
    var resAux = [];



    var request;
    const clickMe = (userID) => {
        request = {
            id: userID
        }
        sendData();
        window.location.reload(true);
    }

    const sendData = async () => {
        const header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return await axios.post('/admin/removeUnitManagerPermission', request, header).then(response => {
            if (response.status === 200) {
                console.log("SUCESSO");
            } else {
                console.log("FALHA");
            }
        })

    };

    function handleAddButtons(departmentName) {
        getDepartmentNormalUsers(departmentName);
        setAddManager(true);
    }


    const getDepartmentNormalUsers = async (departmentName) => {
        var fOptions = Object.keys(normalUsers).map(function (key) {
            const row = normalUsers[key];
            const depName = row['name'];
            if (depName === departmentName) {
                setNormalUserInDepartment(row['users']);
            }
        })
    }


    const buildTables = () => {
        var fOptions = Object.keys(users).map(function (key) {
            const row = users[key];
            const departmentName = row['name'];
            const description = row['description'];
            const usersList = row['users'];
            
            resAux.push(<Grid container spacing={0}>
                <Grid item xs={12} align='center'>
                    <Button
                        onClick={(event) => {
                            handleAddButtons(departmentName);
                        }}
                        variant="contained"
                        style={{
                            backgroundColor: "#0E3D41", margin: '20px'
                        }}
                        >
                        Adicionar novo gestor
                    </Button>
                    <br></br>
                </Grid>
            </Grid>)
            var userOptions = Object.keys(usersList).map(function (key) {
                const userName = usersList[key]['displayname'];
                const id = usersList[key]['id'];
                resAux.push(<Grid container spacing={0}>
                    <Grid item xs={8}>
                        <Button disabled={true}>{userName}</Button>
                    </Grid>
                    <Grid item xs={4} align="right">
                        <Button
                            variant="text"
                            startIcon={ <PersonRemoveIcon style={{fill: "black"}}/>}
                            onClick={(event) => {
                                clickMe(usersList[key]['id']);
                            }}
                            >
                        </Button>
                        
                    </Grid>
                </Grid>);
            })
            res.push(<Grid container spacing={0}>
                <Grid item xs={12} align="center">
                    <Box sx={{ border: 1 }} backgroundColor="#D2DBDC">
                        <h2>{departmentName}</h2>
                        <h4>{description}</h4>
                    </Box>
                </Grid>
            </Grid>
            );
            res.push(resAux);
            builder.push(<Grid item xs={3}>
                <Box sx={{ border: 1 }}>
                    {res}
                </Box>
            </Grid>)
            res = [];
            resAux = [];
        })
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
            
                {users === null ? (
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
                                    <Typography variant="h4" >Pagina de Administrador</Typography>
                                </div>
                                <div>
                                    <Grid container spacing={3}>
                                        {buildTables()}
                                        {builder}
                                    </Grid>
                                </div>
                                {openAddManager ?
                                    <AddManager openAddManager={openAddManager} setAddManager={setAddManager} normalUserInDepartment={normalUserInDepartment} />
                                    :
                                    <></>
                                }
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

export default Admin;
