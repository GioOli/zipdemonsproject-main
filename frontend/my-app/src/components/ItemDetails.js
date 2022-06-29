import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import axios from 'axios';
import mapImgs from '../img/MapImages';

function ItemDetails(props) {

    const { title, children, openItemDetails, setItemDetails, selectedRowId, selectedRowCategory } = props;
    const onClose = () => {
        setItemDetails(false);
    }

    const [error404, setError404] = React.useState(false);

    const[item, setItem] = React.useState(null);
    const getItem = React.useCallback(async () => {
        return await axios.get('/item?id=' + selectedRowId).then(response => {
            if(response.status === 200){
                setItem(response.data);
            }
            else {
                setError404(true);
            }
        })
    }, [])

    React.useEffect(()=>{
        getItem();
    }, [getItem])



    var builder = [];
    var iName = "";
    var iState = "";

    const buildItemDetails = () => {
        


        if(item === null){
        } else {
            builder = [];
            const itemName = item['name'];
            iName = itemName;
            var itemState;
            if (item['isworking']){
                itemState = "Funcional";
            } else {
                itemState  = "Avariado";
            }
            iState = itemState;
            const itemDetails = item['details'];
            var fOptions = Object.keys(itemDetails).map(function (key) {
                const currentDetail = itemDetails[key];
                const detailKey = currentDetail['key'];
                const detailValue = currentDetail['value'];
                builder.push(
                    <Grid key={key} item xs={4} align = "center">
                        <h2>{detailKey}</h2>
                        <h4>{detailValue}</h4>
                    </Grid>
                )
            })
        }

        
    }

    return (
        <Dialog open={openItemDetails}
            fullWidth
            maxWidth="md"
            onBackdropClick={onClose}>
            <DialogTitle>
                <div>
                    <h1>Detalhes do Ativo</h1>
                    {buildItemDetails()}
                </div>
            </DialogTitle>
            <DialogContent>
                <div align="center">
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <Grid container spacing={2}>
                                <Grid item xs={5} align="right">
                                <img style={{ maxWidth: '100%', height: '200px', margin: 'auto' }} src={mapImgs[selectedRowCategory]} alt="category" />
                                </Grid>
                                <Grid item xs={1}>
                                
                                </Grid>
                                <Grid item xs={6} align="left">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <h2>{iName}</h2>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3>Estado: {iState}</h3>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} align="left">
                            <h2>Caraterísticas</h2>
                        </Grid>
                        <Grid item xs={12} align="left">
                            <Box sx={{ border: 1 }} backgroundColor="#D2DBDC">
                                <Grid container spacing={2}>
                                    {builder}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
            </DialogContent>
        </Dialog>
    )
}




export default ItemDetails;