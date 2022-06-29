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
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    tituloHeader: {
        margin: 'auto',
        width: '97%',
        marginTop: '40px',
        marginBottom: '20px',
        textAlign: 'left',
    },
    main: {
        margin: 'auto',
        width: '97%',
    },
});

function Historic() {

    const classes = useStyles();

    //simular o historico que vem da BD
    const hist = {
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
    };

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <div className={classes.tituloHeader}>
                <Typography variant="h3" >Histórico</Typography>
            </div>
            <div className={classes.main}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} >
                                <Tab label="Pedidos" value="1" />
                                <Tab label="Avarias" value="2" />
                                <Tab label="Devoluções" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <List>
                                {Object.values(hist.Pedidos).map((item, index) => (
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
                                {Object.values(hist.Avarias).map((item, index) => (
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
                                {Object.values(hist.Devoluções).map((item, index) => (
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

export default Historic;