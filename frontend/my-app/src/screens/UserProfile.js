import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import NotFoundPage from "./404NotFound.js";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/styles";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const useStyles = makeStyles({
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
  tituloHeader: {
    position: "relative",
    width: "100%",
    marginTop: 30,
    marginBottom: 30,
    textAlign: "left",
  },
  grid: {
    margin: "auto",
    width: "100%",
  },
  main: {
    position: "absolute",
    width: "100%",
    margin: "auto",
  },
});
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: "black",
  width: 300,
  height: 105,
}));

const typographyTheme = createTheme({
  typography: {
    keyText: {
      fontSize: 24,
    },
    bodyText: {
      fontSize: 16,
    },
  },
});

export default function UserProfile() {
  const classes = useStyles();

  const [error404, setError404] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(null);

  const getUserInfo = React.useCallback(async () => {
    return await axios
      .get("/user/user_profile", {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response.data);
          var info = {
            Nome: response.data.displayname,
            Email: response.data.email,
            Unidade: response.data.unidade,
            Roles: ["Utilizador comum"],
          };
          var ansManager =
            response.data.roles.includes("unit_manager")
              ? info["Roles"].push(", Gestor de Unidade")
              : "";
          var ansAdmin =
            response.data.roles.includes("administrator")
              ? info["Roles"].push(", Admin")
              : "";
          setUserInfo(info);
        } else {
          setError404(true);
        }
      });
  }, []);

  React.useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <div className={classes.main}>
          {userInfo === null ? (
            <div>
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            </div>
          ) : (
            <div>
              {!error404 ? (
                <div>
                  <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: "50vh" }}
                    item
                    xs={12}
                    sm
                  >
                    {Object.keys(userInfo).map((key, i) => (
                      <Grid>
                        <Grid item xs sx={{ m: 2 }}></Grid>
                        <Item>
                          <Typography component="div" variant="keyText">
                            {key}
                          </Typography>
                          <Typography component="div" variant="bodyText">
                            {userInfo[key]}
                          </Typography>
                        </Item>
                        <Grid item xs></Grid>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : (
                <div>
                  <NotFoundPage />
                </div>
              )}
            </div>
          )}
        </div>
      </Box>
    </ThemeProvider>
  );
}
