import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
//import { makeStyles } from '@material-ui/styles';
import estilo from '../components/Themes';
import { ThemeProvider } from '@mui/material/styles';

/*const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: "right",
        padding: 10,
        width: 330,
        fontSize: 16,
        borderColor: "#0E3D41",
        color: "#2D5659",
        "&:hover": {
            color: "#A5B7B",
            borderColor: "#0E3D41",
        },
    },
});*/



export default function PopUp(props) {

    //const classes = useStyles();

    const handleClose = () => {
        props.onChange(false);
    };

    const handleConfirmation = () => {
        props.onChange(false);
        //axios to something -> O axious não pode ficar aqui senão não fica dinâmico
        //criem uma função no componente que chama o popup chamada handleSend e enviem como props
        props.handleSend();
    };


    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.description}
                    </DialogContentText>
                </DialogContent>
                <div>
                    {props.actions === true ?
                        <DialogActions>
                            <ThemeProvider theme={estilo}>
                                <Button variant="contained" onClick={handleConfirmation} autoFocus>
                                    Confirmar
                                </Button>
                                <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
                            </ThemeProvider>

                        </DialogActions>
                        :
                        <></>
                    }
                </div>
            </Dialog>
        </div>
    );
}