import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import background from "../img/background.jpeg";
import ipnlogov3 from "../img/ipn-logo_v3.png";

import PropTypes from "prop-types";
import axios from "axios";
import Alert from "@mui/material/Alert";

const theme = createTheme();
const header = {
  headers: {
    "Content-Type": "application/json",
  },
};

async function loginUser(credentials) {
  //get server response
  return await axios
    .post("/login", credentials, header)
    .then((response) => {
      // Set session storage JWT Token
      sessionStorage.setItem("token", response.data.token);
      // Send the '200 Ok' response status
      return { userStatus: response.status };
    })
    // Catch errors
    .catch(function (error) {
      //console.log(error.response.status) // 401
      //console.log(error.response.data.error) //Backend
      // Bad credentials error
      if (error.response.status === 401) {
        return { userStatus: 401 };
      }
      // Other errors
      else {
        return { userStatus: 401 };
      }
    });
}

export default function SignIn(props) {
  //states
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const handleSubmit = async (e) => {
    //handle events
    e.preventDefault();
    //Get form user data
    const data = new FormData(e.currentTarget);

    //Send credentials to API
    var credentials = {
      id: data.get("email"),
      password: data.get("password"),
    };
    //API call
    const infoJson = await loginUser(credentials);

    if (infoJson.userStatus === 200) {
      //console.log("You have permission to log in")
      props.setToken(true);
    } else if (infoJson.userStatus === 401) {
      setAlert(true);
      setAlertContent("Credenciais incorretas - Por favor tente novamente");
      // Clear form values
      e.target.reset();
    } else {
      // Uknown error
      console.log("Uknown error");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            md={7}
            sx={{
              backgroundImage: `url(${background})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 7,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardMedia
                  height="120"
                  component="img"
                  flex
                  image={ipnlogov3}
                  alt="LogoIPNAtivos"
                />
              </Card>
              <p></p>
              <Typography
                style={{ fontSize: "27px", fontWeight: 500}}
              >
                Iniciar sessão
              </Typography>
              <div>
                {alert ? (
                  <Alert variant="filled" severity="error">
                    {alertContent}
                  </Alert>
                ) : (
                  <></>
                )}
              </div>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "85%",
                }}
              >
                <TextField
                  style={{ width: "85%" }}
                  margin="normal"
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  style={{ width: "85%" }}
                  margin="normal"
                  required
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  style={{
                    backgroundColor: "#4B6E71",
                    fontSize: "14px",
                    width: "85%",
                    lineHeight: "230%" 
                  }}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >
                  Iniciar sessão
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

SignIn.propTypes = {
  setToken: PropTypes.func.isRequired,
};
