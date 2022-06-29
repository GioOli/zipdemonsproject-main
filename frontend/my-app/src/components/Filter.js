import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';

//não fui eu que fiz este estilo, copiei da net, no idea what's in here
const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 14,
        padding: '5px 13px 2px 6px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

function Filter(props) {
    var c = props.initialVal;

    //estado para mudar a categoria da box de filtragem
    const [value, setCategory] = React.useState(c);
    const eventHandler = (e) => {
        setCategory(e.target.value);
    }

    function handleChange(event) {
        //console.log("On filter", event.target.value);
        props.onChange(event.target.value);
    }
  
    return (
        <div> 
            <div style={{display: 'flex', flexDirection: "row", width: '100%', marginBottom: '10px'}}>
                <InputLabel sx={{position: 'relative', marginTop: '10px'}}>{props.titulo}</InputLabel>
                <FormControl sx={{ m: 1}}  variant="standard">
                    <NativeSelect 
                        id="select"
                        value={value}
                        onChange={(event) => {handleChange(event); eventHandler(event)}}
                        input={<BootstrapInput />}
                    >
                        <option aria-label="None" value="" />
                        {props.options.map(item => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </NativeSelect>
                </FormControl>
            </div>
        </div>
        
    );
}

export default Filter;