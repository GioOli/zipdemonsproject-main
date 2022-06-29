import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import AvailableActivesGrid from "../components/AvailableActivesGrid.js";
import UnavailableActivesGrid from "../components/UnavailableActivesGrid.js";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import NotFoundPage from "./404NotFound.js";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import AvariasGrid from "../components/AvariasGrid.js";
import { makeStyles } from "@material-ui/styles";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles({
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

// Call to API function
async function GetDepartmentActives(token) {
  //POST to server with route: /items
  //Args: route, token (in a json) and header
  return await axios
    .get("/manageactives", { headers: token })
    .then((response) => {
      // Get status from the API
      // Construct the json
      var infoJson = {
        status: response.status,
      };

      // If user has auth => Get the info
      if (infoJson.status === 200) {
        infoJson.availableActives = response.data.Disponíveis;
        infoJson.unavailableActives = response.data.Indisponíveis;
        infoJson.brokenActives = response.data.Avariados;
      }

      // Send the json
      return infoJson;
    })
    // Catch errors
    .catch(function (error) {
      //error.response.status => Status error
      //error.response.data.error => Data error
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

// Main function
function ManageActives() {
  // State for changing actives tabs
  const classes = useStyles();

  const [tabOption, setTabOption] = useState(0);

  const handleChange = (event, newValue) => {
    setTabOption(newValue);
  };

  // useEffect as it is the first thing to be executed in the page
  // Check if the user has permissions to see the page
  // Get the data from the API if it has those permissions
  async function checkUserPermissions() {
    //API call
    //JWT Token
    const tokenJson = { token: sessionStorage.getItem("token") };
    var infoJsonFunction = await GetDepartmentAc6tives(tokenJson).then(
      (infoJson) => {
        // Get status answer from backend
        // User doesn't have permissions to view this page

        if (infoJson.status === 200) {
          // Arrays for filters
          // Unique categories list in available actives
          var availableActivesCategories = [];
          for (var i in infoJson.availableActives) {
            if (
              !availableActivesCategories.includes(
                infoJson.availableActives[i].Categoria
              )
            ) {
              availableActivesCategories.push(
                infoJson.availableActives[i].Categoria
              );
            }
          }

          // Unique categories list in unavailable actives
          var unavailableActivesCategories = [];
          for (var j in infoJson.unavailableActives) {
            if (
              !unavailableActivesCategories.includes(
                infoJson.unavailableActives[j].Categoria
              )
            ) {
              unavailableActivesCategories.push(
                infoJson.unavailableActives[j].Categoria
              );
            }
          }

          // Unique categories list in broken actives
          var brokenActivesCategories = [];
          for (var h in infoJson.brokenActives) {
            if (
              !brokenActivesCategories.includes(
                infoJson.brokenActives[h].Categoria
              )
            ) {
              brokenActivesCategories.push(infoJson.brokenActives[h].Categoria);
            }
          }

          infoJson.availableActivesCategories = availableActivesCategories;
          infoJson.unavailableActivesCategories = unavailableActivesCategories;
          infoJson.brokenActivesCategories = brokenActivesCategories;

          // Setup the items
          var availableActives = [];
          for (var key in infoJson.availableActives) {
            availableActives.push({
              id: key,
              name: infoJson.availableActives[key].Ativo,
              category: infoJson.availableActives[key].Categoria,
              sub_category: infoJson.availableActives[key]["Sub-categoria"],
            });
          }

          var unavailableActives = [];
          for (var key2 in infoJson.unavailableActives) {
            unavailableActives.push({
              id: key2,
              name: infoJson.unavailableActives[key2].Ativo,
              category: infoJson.unavailableActives[key2].Categoria,
              sub_category: infoJson.unavailableActives[key2]["Sub-categoria"],
              responsavel:
                infoJson.unavailableActives[key2]["Utilizador Designado"],
            });
          }

          var brokenActives = [];
          for (var key3 in infoJson.brokenActives) {
            brokenActives.push({
              id: key3,
              name: infoJson.brokenActives[key3].Ativo,
              category: infoJson.brokenActives[key3].Categoria,
              sub_category: infoJson.brokenActives[key3]["Sub-categoria"],
            });
          }

          // Overwrite the previous jsons with the new one with the correct format
          infoJson.availableActives = availableActives;
          infoJson.unavailableActives = unavailableActives;
          infoJson.brokenActives = brokenActives;
        } else if (infoJson.status === 404) {
          // User has permissions to view this page
        } else {
          // Uknown error
          console.log("Uknown error");
        }

        return infoJson;
      }
    );
    return infoJsonFunction;
  }

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
      var infoJson = await checkUserPermissions().then((result) => {
        if (result.status === 200) {
          // User has auth to view the page
          this.setState({ perms: 1, gridData: result, loading: 0 });
        } else if (result.status === 404) {
          this.setState({ perms: 0, gridData: null, loading: 0 });
        }
      });
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
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              <CircularProgress />
            </Grid>
          </Grid>
        );
      }
      if (!loading && perms) {
        return (
          <div>
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              <div className={classes.tituloHeader}>
                <Typography variant="h4">Gerir Ativos</Typography>
              </div>
              <Tabs
                value={tabOption}
                TabIndicatorProps={{
                  style: { color: "#0E3D41", background: "#0E3D41" },
                }}
                onChange={handleChange}
                centered
              >
                <Tab style={{ color: "#0E3D41" }} label="Ativos Disponíveis" />
                <Tab style={{ color: "#0E3D41" }} label="Ativos Emprestados" />
                <Tab style={{ color: "#0E3D41" }} label="Ativos Avariados" />
              </Tabs>
            </Box>
            <div>
              {tabOption === 0 ? (
                <div>
                  <AvailableActivesGrid
                    data={gridData.availableActives}
                    categories={gridData.availableActivesCategories}
                  />
                </div>
              ) : tabOption === 1 ? (
                <div>
                  <UnavailableActivesGrid
                    data={gridData.unavailableActives}
                    categories={gridData.unavailableActivesCategories}
                  />
                </div>
              ) : (
                <div>
                  <AvariasGrid
                    data={gridData.brokenActives}
                    categories={gridData.brokenActivesCategories}
                  />
                </div>
              )}
            </div>
          </div>
        );
      } else if (!loading && !perms) {
        return (
          <div>
            <NotFoundPage />
          </div>
        );
      }
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <MyComponent />
    </Box>
  );
}

export default ManageActives;
