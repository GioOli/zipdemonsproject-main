import * as React from "react";
import DataTable from "../components/DefaultGrid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/styles";
import Filter from "../components/Filter";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import NotFoundPage from "./404NotFound.js";
import gridStyle from '../components/GridTheme';
import { ThemeProvider } from '@mui/material/styles';

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

function UserHistory() {
  //Para css
  const classes = useStyles();

  //Ligação ao Back-end
  const [error404, setError404] = React.useState(false);
  const [items, setItems] = React.useState(null);

  const getItems = React.useCallback(async () => {
    const header = {
      headers: { token: sessionStorage.getItem("token") },
    };
    return await axios.get("/user/user_history", header).then((response) => {
      if (response.status === 200) {
        setItems(response.data);
        console.log(response.data);
      } else {
        setError404(true);
      }
    });
  }, []);

  React.useEffect(() => {
    getItems();
  }, [getItems]);

  const [categories, setCategories] = React.useState(null);
  const getCategories = React.useCallback(async () => {
    return await axios.get("/getCategories").then((response) => {
      if (response.status === 200) {
        setCategories(response.data);
        console.log(response.data);
      } else {
        setError404(true);
      }
    });
  }, []);

  React.useEffect(() => {
    getCategories();
  }, [getCategories]);

  //Para a grid default
  const cols = [
    "Imagem",
    "Ativo",
    "Categoria",
    "Subcategoria",
    "Unidade",
    "Requisição",
    "Devolução",
  ];

  //as rows tem de ter o mapeamento do nome da coluna para o nome que vem no json do back-end
  const rows = {
    ActiveId: "id",
    Imagem: "",
    Ativo: "Ativo",
    Categoria: "Categoria",
    Subcategoria: "Sub-Categoria",
    Unidade: "Unidade",
    Requisição: "Requisição",
    Devolução: "Devolução",
  };

  const alinhar = ['NA', 'String', 'String' , 'String','String', 'Data','Data'];
  const icones = { random: "random" };
  const boxes = false;

  //Para a filtragem
  const [category, setValue] = React.useState("");
  function handleChange(newValue) {
    //console.log("On main", newValue);
    setValue(newValue);
  }

  function handleDetails(row, col) {
    //console.log(row, col);
  }

  //Para botão de devolver
  var [selectedRows, setSelectedRows] = React.useState([]);

  function saveRows(rows) {
    setSelectedRows(rows);
    //console.log(rows);
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div className={classes.main}>
        {items === null || categories === null ? (
          <div>
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          <div>
            {!error404 ? (
              <div>
                <div className={classes.tituloHeader}>
                  <Typography variant="h3">Histórico de Utilizador</Typography>
                </div>
                <div className={classes.filter}>
                  <Filter
                    options={categories}
                    titulo={"Filtrar por categoria: "}
                    initialVal={category}
                    onChange={handleChange}
                  />
                </div>
                <div className={classes.grid}>
                <ThemeProvider theme={gridStyle}>
                  <DataTable
                    value={category}
                    json={items}
                    icones_used={icones}
                    colunas={cols}
                    linhas={rows}
                    alinhar={alinhar}
                    selectBox={boxes}
                    filterBy="Categoria"
                    onChange={handleDetails}
                    selectedRows={saveRows}
                  />
                  </ThemeProvider>
                </div>
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
  );
}

export default UserHistory;
