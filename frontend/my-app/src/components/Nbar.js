import * as React from "react";
//import { styled, alpha } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
//import InputBase from '@mui/material/InputBase';
import { makeStyles } from "@material-ui/styles";
import Menu from "@mui/material/Menu";

import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

import AccountCircle from "@mui/icons-material/AccountCircle";
//import Drawer from 'Drawer';
import DrawJS from "./Drawer";
import logoImage from "../img/ipn-logo_v6.png";
import axios from "axios";
/*const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(20),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '450px',
  },
}));*/

/*const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));*/

/*const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));*/

const useStyles = makeStyles({
  logo: {
    margin: "auto",
    textAlign: "center",
    maxWidth: "50%",
    height: "39px",
    marginTop: "5px",
  },
  logoHorizontallyCenter: {
    position: "absolute",
    left: "10%",
    top: "55%",
    transform: "translate(-50%, -50%)",
  },
});
/*var classesLogo = {
  logo: {
    margin: 'auto',
    textAlign: 'center',
    maxWidth: '50%',
    maxHeight: '70%',
  },
  logoHorizontallyCenter: {
    position: 'absolute',
    left: '10%',
    top: '55%',
    transform: 'translate(-50%, -50%)'
  }
};*/

export default function SearchAppBar(props) {
  const classes = useStyles();

  
  const [userInfo, setUserInfo] = React.useState(null);

  const [isAdminGestor, setIsAdminGestor] = React.useState(false);

  const getUserInfo = React.useCallback(async () => {
    return await axios
      .get("/user/user_profile", {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        //console.log("nbar:;",response.data);
        if (response.status === 200) {
          //console.log("REP:",response.data);
          var info_nb_user= 1;

          var info_nb_manager = response.data.isGestor===true ? 2: 0;
          var info_nb_admin = response.data.isAdmin===true ? 3 : 0;

          if(info_nb_manager===2 && info_nb_admin===3){
            setIsAdminGestor(true);
          }


          /*
            response.data.roles.includes("administrator")
              ? 3
              : 0;
          */

          //console.log(Math.max(info_nb_user, info_nb_manager, info_nb_admin));

          setUserInfo(Math.max(info_nb_user, info_nb_manager, info_nb_admin));
        } else {
          setUserInfo(1);
        }
      });
  }, []);

  React.useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  // console.log("USER INFO:",userInfo);
  //const isNormalUser = props.isNormalUser;

  //const [auth, setAuth] = React.useState(true);
  /*
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);

  };

  const handleCloseLogout = () => {
    setAnchorEl(null);
    sessionStorage.clear();
    window.location.reload(false);
  };
  */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseLogout = () => {
    setAnchorEl(null);
    sessionStorage.clear();
    window.location.reload(false);
  };
  const listOfAvailablePages = [
    { name: "Histórico de Utilizador", uri: "/user/user_history" }, //0
    { name: "Fazer Pedido", uri: "/makerequest" },  // 1
    { name: "Gerir Utilizadores", uri: "/admin" }, // 2
    { name: "Gerir Ativos", uri: "/manageactives" }, //3
    { name: "Requisiçoes Pendentes", uri: "/pedidos_detail" }, // 4
    { name: "Estatisticas", uri: "/statspage" },//5
    { name: "Devoluçoes Pendentes", uri: "/actives/returns" },//6
    { name: "Ativos Requisitados", uri: "/requestedactives" },//7
    { name: "Pedidos", uri: "/requests" },//8
  ];

  const renderMenuButtons = () => {
    if (userInfo === 3) {
      if(isAdminGestor){
        return (
          <DrawJS
            listOfButtons={[ // ADMING USER = userInfo 3 -> open 9 buttons options on drawer
                listOfAvailablePages[2],
                listOfAvailablePages[3],
                listOfAvailablePages[4],
                listOfAvailablePages[6],
                listOfAvailablePages[5],
                //listOfAvailablePages[1],
                listOfAvailablePages[7],
                listOfAvailablePages[8],
                listOfAvailablePages[0],              
            ]}
          />
        );
      } else {
        return (
          <DrawJS
            listOfButtons={[ // ADMING USER = userInfo 3 -> open 9 buttons options on drawer
                listOfAvailablePages[2],
                //listOfAvailablePages[1],
                listOfAvailablePages[7],
                listOfAvailablePages[8],
                listOfAvailablePages[0],              
            ]}
          />
        );
      }
    } else {
      if (userInfo === 2) { // GESTOR userinfo 2 -> open 7 buttons on drawer
        return ( 
          <DrawJS 
            listOfButtons={[

              listOfAvailablePages[3],
              listOfAvailablePages[4],
              listOfAvailablePages[6],
              listOfAvailablePages[5],
              //listOfAvailablePages[1],
              listOfAvailablePages[7],
              listOfAvailablePages[8],
              listOfAvailablePages[0],





            ]}
          />
        );
      } else { // ELSE NORMAL USER (1)  -> open only 2 btns on drawer 
        return (
          <DrawJS
            listOfButtons={[
            //listOfAvailablePages[1],
            listOfAvailablePages[7],
            listOfAvailablePages[8],
            listOfAvailablePages[0]
            ]}
          />
        );
      }
    }
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#4b6e71"}}>
        <Toolbar style={{height:"52px", minHeight:"52px"}}>
          <div>{renderMenuButtons()}</div>

          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {/*<div style={classesLogo.logoHorizontallyCenter}>*/}
            <img src={logoImage} className={classes.logo} alt="logo" />
          </Typography>
          {/*
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
          <div>
            <IconButton
              size="large"
              id="account of current user"
              aria-controls="account of current user"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="account of current user"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              //open={Boolean(anchorEl)}
            >
              <MenuItem onClick={handleClose} component={Link} to="/user/user_profile">Perfil</MenuItem>
              <MenuItem onClick={handleCloseLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar >
      </AppBar >
    </Box >
  )
};
