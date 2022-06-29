
import React, { useState, useRef } from 'react';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import NotFoundPage from './404NotFound.js'
import CircularProgress from "@mui/material/CircularProgress";
import Box from '@mui/material/Box';
import Fab from "@mui/material/Fab";
const steps = [

    {
        label: 'Selecionar Categoria',
    },
    {
        label: 'Selecionar Sub-Categoria',
    },
    {
        label: 'Inserir Características',
    }
];


async function getSubCategory(category) {
    const cats = {
        params: { category: category }
    };

    return await axios.get('/getSubCategories', cats)
        .then(response => {
            if (response.status === 200) {
                //

                return response.data;
            }
            else {
                //setError404(true);
            }
        })
}

async function getBrands(category, subCategory) {
    const params = {
        params: { category: category, sub_category: subCategory }
    };
    return await axios.get('/getBrands', params)
        .then(response => {
            if (response.status === 200) {
                return response.data;
            }
            else {
                //setError404(true);
            }
        })
}
async function getLabelDetails(category, subCategory) {
    const params = {
        params: { category: category, sub_category: subCategory }
    };
    return await axios.get('/getLabelDetails', params)
        .then(response => {
            if (response.status === 200) {

                return response.data;
            }
            else {
                //setError404(true);
            }
        })
}


function AddNewActives() {
    const [activeStep, setActiveStep] = useState(0);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [index, setIndex] = useState(0);  //steps
    const [serieNum, setSerieNum] = useState(0);  //steps
    const [features, setFeatures] = useState(0);  //steps
    // State for user permissions
    const [perms, setPerms] = useState();

    var features_selected = []  //features selected by the user
    var response;   //repsosta para a db

    const handler = (event, a, c) => {
        var value = a[event.target.value]
        var key = c
        if (value === undefined) {
            value = event.target.value
        }
        let y = false

        if (brand) {
            for (let i in features_selected) {

                if (features_selected[i].key === "Marca") {
                    features_selected[i].value = brand
                    y = true
                }
            }

            if (!y) {
                features_selected.push(
                    {
                        'key': 'Marca',
                        'value': brand
                    })
            }
        }

        let x = false
        for (let i in features_selected) {

            if (features_selected[i].key === key) {
                features_selected[i].value = value
                x = true
            }
        }

        if (!x) {
            features_selected.push(
                {
                    'key': key,
                    'value': value
                })
        }

        response = {
            'token': sessionStorage.getItem('token'),
            'item': {
                'category': category,
                'sub_category': subCategory,
                'itemDetails': features_selected,
                'serieNumber': serieNum
            }
        }

    }

    //focusNode
    const [categories, setCategories] = React.useState(null);
    const getCategories = React.useCallback(async () => {

        return await axios.get('/getCategories')
            .then(response => {
                if (response.status === 200) {
                    setCategories(response.data);
                }
            })
    }, [])


    const [subCategories, setsubCategories] = React.useState([]);

    const handleCategory = async (event) => {
        setCategory(event.target.value);
        setFeatures([])
        setBrand(null)
        const sc = await getSubCategory(event.target.value);
        setsubCategories(sc);

        if (activeStep === 0) {
            handleNext()
        }
    };

    const [brands, setBrands] = React.useState([]);
    const handleSubCategory = async (event) => {
        setSubCategory(event.target.value);
        const ld = await getLabelDetails(category, event.target.value)
        ld.map((label) => {
            if (label.label === 'Marca') {

                setBrands(label.details)
            }

        })

        if (activeStep === 1) {
            handleNext()
        }
    };
    var features2 = {}


    const handleBrand = async (event) => {

        const alo = document.getElementsByClassName('MuiSelect-select MuiSelect-standard MuiInput-input MuiInputBase-input css-1rxz5jq-MuiSelect-select-MuiInputBase-input-MuiInput-input')
        let i = 2

        if (alo.length > 3) {
            while (i < alo.length) {
                //console.log(alo[i])
                alo[i].innerHTML = null
                i++
            }
        }


        var detail_type
        setBrand(event.target.value)
        const ld = await getLabelDetails(category, subCategory)
        ld.map((label) => {

            if (isArray(label.details)) {
                features2[`${label.label}`] = label.details
            } else {
                Object.entries(label).map((detail, index) => {
                    if (detail[1].length !== undefined) {
                        detail_type = detail[1]
                    } else {
                        features2[`${detail_type}`] = detail[1]
                    }
                    return 0
                })
            }
            return 0
        })

        setFeatures(features2)
        if (activeStep === 2) {
            handleNext()
        }
    }
    const handleSerieNum = (event) => {
        setSerieNum(event.target.value)
    }


    const handleNext = () => {
        if (activeStep === 3) {
        } else {
            // setIndex(index + 1)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    //check if is an array
    const isArray = (array) => {
        return (!!array) && (array.constructor === Array);
    };


    const sendData = async () => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        await axios.post('/item/insert', response, header)
            .then(result => {
                //
            })

    };




    const rlvRef = React.createRef();
    const [refVisible, setRefVisible] = useState(false)
    React.useEffect(() => {
        setPerms(1)
        getCategories();
        if (!refVisible) {
            return
        }

    }, [getCategories, category, brands])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <div>
                {categories === null ? (
                    <div>
                        <Box sx={{ display: "flex" }}>
                            <CircularProgress />
                        </Box>
                    </div>
                ) : (
                    <div>
                        {perms === 1 ?
                            <Grid container >
                                {/* coluna dos steps */}
                                <Grid container item xs={4} >
                                    <Box sx={{ maxWidth: 400 }}>
                                        <Stepper activeStep={activeStep} orientation="vertical">
                                            {steps.map((step, index) => (
                                                <Step key={index}>
                                                    <StepLabel key={index}>
                                                        {step.label}
                                                    </StepLabel>
                                                    <br /><br />
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </Grid>
                                {/* coluna do que interessa */}
                                <Grid container item xs={8}>

                                    < Grid item xs={12} >
                                        <Typography variant="h6" gutterBottom component="div">Adicionar um novo ativo</Typography>
                                    </Grid>
                                    {/* step label */}

                                    <Grid item xs={1} >
                                        <Fab color="primary" aria-label="add">1</Fab>
                                    </Grid>
                                    <Grid item xs={11} >
                                        <br />
                                        <div style={{ visibility: activeStep >= 0 ? 'visible' : 'hidden' }}>
                                            Selecionar Categoria
                                        </div>
                                    </Grid>
                                    <Grid item xs={1} />
                                    {/* label + input */}
                                    <Grid item xs={11} >
                                        <div style={{ visibility: activeStep >= 0 ? 'visible' : 'hidden' }}>
                                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                                <Select value={category} onChange={handleCategory}>
                                                    {categories.map((cat, index) => (
                                                        <MenuItem key={index} value={cat}>{cat}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    {/* empty space for design */}

                                    {/* step label */}

                                    <Grid item xs={1} >
                                        <Fab color="primary" aria-label="add" style={{ visibility: activeStep >= 1 ? 'visible' : 'hidden' }}>2</Fab>
                                    </Grid>
                                    <Grid item xs={11} >
                                        <br />
                                        <div style={{ visibility: activeStep >= 1 ? 'visible' : 'hidden' }}>
                                            Selecionar Sub-Categoria
                                        </div>
                                    </Grid>
                                    <Grid item xs={1} />


                                    {/* label + input */}
                                    <Grid item xs={11}>
                                        <div style={{ visibility: activeStep >= 1 ? 'visible' : 'hidden' }}>
                                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                                <Select value={subCategory} onChange={handleSubCategory}>
                                                    {subCategories.map((subcat, index) => (
                                                        <MenuItem key={index} value={subcat}>{subcat}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </Grid>

                                    {/* empty space for design */}

                                    {/* step label */}

                                    <Grid item xs={1} >
                                        <Fab color="primary" aria-label="add" style={{ visibility: activeStep >= 2 ? 'visible' : 'hidden' }}>3</Fab>
                                    </Grid>
                                    <Grid item xs={11} >
                                        <br />
                                        <div style={{ visibility: activeStep >= 2 ? 'visible' : 'hidden' }}>
                                            Selecionar Caracteristicas
                                        </div>
                                    </Grid>

                                    {/* label + input */}
                                    <Grid item xs={8} container>
                                        <Grid item xs={2} >
                                            <br />
                                            <div style={{ visibility: activeStep >= 2 ? 'visible' : 'hidden' }}>Marca</div >
                                        </Grid>
                                        <Grid item xs={10} >
                                            <div style={{ visibility: activeStep >= 2 ? 'visible' : 'hidden' }}>
                                                <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                                    <Select value={brand} onChange={handleBrand} autoWidth  >
                                                        {brands.map((brand, index) => (
                                                            <MenuItem key={index} value={brand}>{brand}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </Grid>
                                        <Grid item xs={2} >
                                            <br />
                                            <div style={{ visibility: activeStep >= 2 ? 'visible' : 'hidden' }}>Identificador</div >
                                        </Grid>
                                        <Grid item xs={10} >

                                            <TextField value={serieNum} onChange={handleSerieNum} label="Número de série" variant="standard" style={{ visibility: activeStep >= 2 ? 'visible' : 'hidden' }} />
                                        </Grid>
                                    </Grid>


                                    <Grid item xs={8} container style={{ visibility: activeStep >= 3 ? 'visible' : 'hidden' }}>

                                        {Object.entries(features).map((attr, index) => (
                                            <>
                                                <Grid item xs={12} >
                                                    {attr[0] === 'Marca' ? <></> : <div key={index}> {attr[0]}</div>}
                                                    <br /> {/* Modelo, Fisicas, etc */}
                                                </Grid>
                                                {isArray(attr[1]) ?
                                                    <>
                                                        <Grid item xs={2} >
                                                            {attr[0] === 'Marca' ? <></> : <StepLabel key={index}> {attr[0]}</StepLabel>}
                                                        </Grid>
                                                        <Grid item xs={10} >
                                                            {attr[0] === 'Marca' ? <></> :
                                                                <form>
                                                                    <FormControl key={index} variant="standard" sx={{ m: 1, minWidth: 200 }} >
                                                                        <Select className="ola1" key={index} defaultValue={''} autoWidth onChange={(e) => handler(e, attr[1], attr[0])} >
                                                                            {
                                                                                attr[1].map((modelo, indexx) => (

                                                                                    <MenuItem key={indexx} value={modelo}>

                                                                                        {modelo}</MenuItem>
                                                                                ))
                                                                            }
                                                                        </Select>
                                                                    </FormControl>
                                                                </form>
                                                            }
                                                        </Grid>
                                                    </>
                                                    :
                                                    <>
                                                        {Object.entries(attr[1]).map((__attr, index) => (
                                                            <>
                                                                <Grid item xs={2} >
                                                                    <StepLabel key={index}>
                                                                        {__attr[0]}{/* Modelo, Cor, Peso, etc */}

                                                                    </StepLabel>
                                                                </Grid>
                                                                <Grid item xs={10} >

                                                                    <FormControl id="f" component="form" key={index} variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                                                        <Select className="ola2" defaultValue={''} autoWidth onChange={(e) => handler(e, __attr[1], __attr[0])}>

                                                                            {__attr[1].map((value, e) => (
                                                                                <MenuItem key={e} value={e}>{value}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>

                                                                </Grid>
                                                            </>
                                                        ))}
                                                    </>
                                                }

                                            </>
                                        ))}
                                    </Grid>
                                    <Grid item xs={6} />
                                    <Grid item xs={6}>
                                        {activeStep >= 2 ? <Button variant="contained" href='/manageactives' onClick={sendData} style={{ margin: '20px' }}> Confirmar </Button > : <></>}
                                    </Grid>

                                </Grid >
                            </Grid > :
                            <div>
                                <NotFoundPage />
                            </div>
                        }
                    </div>)}
            </div>
        </Box>
    )
}

export default AddNewActives