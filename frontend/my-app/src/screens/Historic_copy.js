import * as React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
//import { makeStyles } from '@material-ui/styles';
import NotFoundPage from "./404NotFound.js";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from 'react-router';
import axios from "axios";

/*const useStyles = makeStyles({
    tituloHeader: {
        margin: 'auto',width: '97%',marginTop: '40px',marginBottom: '20px',textAlign: 'left',
    },
    main: {
        margin: 'auto',width: '97%',
    },
});*/


async function getHistoryData(id) {

    /* const hist = {
         "Pedidos": {
             "idPedido1": {
                 "Utilizador": "David Paiva", 
                 "Data": "11/12/2021"
             }, 
             "idPedido2": {
                 "Utilizador": "David Paiva",
                 "Data": "11/12/2021" 
             }
         }, 
         "Avarias": {
             "idAvaria1": {
                 "Data": "14/12/2021"
             }, 
             "idAvaria2": {
                 "Data": "15/12/2021" 
             }
         }, 
         "Devoluções": {
             "idDev1": {
                 "Utilizador": "David Paiva", 
                 "Data": "11/12/2021"
             }, 
             "idDev2": {
                 "Utilizador": "David Paiva",
                 "Data": "11/12/2021" 
             }
         } 
     };*/

    /*const header = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const request = {
        token: sessionStorage.getItem('token'),
        itemId: Number(id)
    };*/

    return await axios.get("/activeHistory", {
        headers: { token: sessionStorage.getItem("token") },
        params: { itemId: id },
      })
        .then(response => {
            //console.log(response);

            var infoJson = {
                status: response.status,
            };

            // If user has auth => Get the info
            if (infoJson.status === 200) {
                infoJson.historico = response.data;
            }

            // Send the json
            return infoJson;
        })
        // Catch errors
        .catch(function (error) {

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

function Historic() {

    //recebe o id do ativo para ir buscar o histórico
    //mudar nas grids a linha para conter também o id do ativo (este id é o da linha)
    let { id } = useParams();
    //console.log(id);


    //const classes = useStyles();

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    class MyComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loading: 1,
                gridData: null,
                perms: 0,
            };
        }

        // Waiting for the response from the API
        async componentDidMount() {

            // Calling the function
            var infoJson = await getHistoryData(id);
            if (infoJson.status === 200) {
                // User has auth to view the page
                this.setState({ perms: 1, gridData: infoJson, loading: 0 });
            }
            else if (infoJson.status === 404) {
                // User has auth to view the page
                this.setState({ perms: 0, gridData: null, loading: 0 });
            }
            return infoJson;
        }
        componentWillUnmount() {
            this.setState({ perms: 0, gridData: null, loading: 1 });
        }
        // Method for rendering the component
        render() {
            // State components
            const { gridData, loading, perms } = this.state;

            if (loading) {
                return (
                    <div>
                        <Box sx={{ display: "flex" }}>
                            <CircularProgress />
                        </Box>
                    </div>
                );
            }
            if (!loading && perms) {
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh',
                        }}
                    >
                        <div style={{width: '97%', marginTop: '40px', marginBottom: '20px', textAlign: 'left'}}>
                            <Typography variant="h3" >Histórico</Typography>
                        </div>
                        <div style={{width: '97%'}}>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} TabIndicatorProps={{ style: { color: '#0E3D41',background: "#0E3D41" } }} >
                                            <Tab style= { {color: '#0E3D41'}} label="Pedidos" value="1" />
                                            <Tab style= { {color: '#0E3D41'}} label="Avarias" value="2" />
                                            <Tab style= { {color: '#0E3D41'}} label="Devoluções" value="3" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <List>
                                            {Object.values(gridData.historico.Pedidos).map((item, index) => (
                                                <div key={index}>
                                                    <ListItem >
                                                        <ListItemText primary={"O utilizador " + item.Utilizador + " levantou este ativo no dia " + item.Data} />
                                                    </ListItem>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </List>
                                    </TabPanel>

                                    <TabPanel value="2">
                                        <List>
                                            {Object.values(gridData.historico.Avarias).map((item, index) => (
                                                <div key={index}>
                                                    <ListItem >
                                                        <ListItemText primary={"Avariou no dia " + item.Data} />
                                                    </ListItem>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </List>
                                    </TabPanel>

                                    <TabPanel value="3">
                                        <List>
                                            {Object.values(gridData.historico.Devoluções).map((item, index) => (
                                                <div key={index}>
                                                    <ListItem >
                                                        <ListItemText primary={"O utilizador " + item.Utilizador + " devolveu este ativo no dia " + item.Data} />
                                                    </ListItem>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </List>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </div>

                    </Box>
                );

            }
            else if (!loading && !perms) {
                return (
                    <div>
                        <NotFoundPage />
                    </div>
                );
            }
        }
    }
    return (
        <div>
            <MyComponent />
        </div>
    );

}

export default Historic;