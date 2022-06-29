import * as React from "react";
import Button from "@mui/material/Button";
import HistoryIcon from "@mui/icons-material/History";
import { Link } from "react-router-dom";
import DataTable from "../components/DefaultGrid";
import Filter from "../components/Filter";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/styles";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ItemDetails from "./ItemDetails";
import axios from "axios";
import PopUp from "../components/PopUp";
import gridStyle from "../components/GridTheme";
import { ThemeProvider } from "@mui/material/styles";

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

export default function AvailableActivesGrid(props) {
  // Getting information from the API as props from the ManageActives.js

  // Available actives json
  const requested_items = props.data;
  // Available actives unique categories
  const cats = props.categories;

  //items details
  const [openItemDetails, setItemDetails] = React.useState(false);

  const classes = useStyles();

  //Para a grid default
  const cols = [
    "Imagem",
    "Ativo",
    "Categoria",
    "Subcategoria",
    "Detalhes",
    "Historico",
  ];

  //as rows tem de ter o mapeamento do nome da coluna para o nome que vem no json do back-end
  const rows = {
    Imagem: "",
    Categoria: "category",
    Subcategoria: "sub_category",
    Ativo: "name",
    ActiveId: "id",
  };

  const alinhar = ["NA", "String", "String", "String", "NA", "NA"];
  const icones = { Detalhes: RemoveRedEyeOutlinedIcon, Historico: HistoryIcon };
  const boxes = true;

  //Para a filtragem
  const [category, setValue] = React.useState("");
  function handleChange(newValue) {
    setValue(newValue);
  }

  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [selectedRowCategory, setSelectedRowCategory] = React.useState("");

  //Para os botões de detalhes
  function handleGridButtons(row, col) {
    if (col === "Detalhes") {
      // Display popup of details
      setSelectedRowId(row["ActiveId"]);
      setSelectedRowCategory(row["Categoria"]);
      setItemDetails(true);
    } else if (col === "Historico") {
      window.open(`/historic/${row.ActiveId}`, "_self");
      // Display history of active
    }
  }

  var [selectedRows, setSelectedRows] = React.useState([]);

  function saveRows(rows) {
    setSelectedRows(rows);
  }

  async function deleteRows(items) {
    //get server response
    return await axios
      .put(
        "/deprecateItem",
        { itemsID: items },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        // Set session storage JWT Token
        return 200;
      })
      // Catch errors
      .catch(function (error) {
        // Bad credentials error
        return 404;
      });
  }

  function handleDeleteRows() {
    // Delete/Discontinue the actives clicked
    // Create json to send to the back end and update the rows of the data grid
    var idsToSend = [];
    for (var i = 0; i < selectedRows.length; i++) {
      var row = selectedRows[i];
      idsToSend.push(requested_items[row.id].id);
    }
    deleteRows(idsToSend);
    // To refresh page
    window.location.reload(true);
  }

  async function avariarAtivos(items) {
    return await axios
      .post(
        "/itemBreakdown",
        { itemsID: items },
        { headers: { token: sessionStorage.getItem("token") } }
      )
      .then((response) => {
        // Set session storage JWT Token
        return 200;
      })
      // Catch errors
      .catch(function (error) {
        // Bad credentials error
        return 404;
      });
  }

  function handleAvariarRows() {
    // Delete/Discontinue the actives clicked
    // Create json to send to the back end and update the rows of the data grid
    var idsToSend = [];
    for (var i = 0; i < selectedRows.length; i++) {
      var row = selectedRows[i];
      idsToSend.push(requested_items[row.id].id);
    }
    avariarAtivos(idsToSend);
    // To refresh page
    window.location.reload(true);
  }

  //Para o pop-up
  const [open, setOpen] = React.useState(false);
  const popupRemoveItemsMsg =
    "Tem a certeza que pretende remover os ativos selecionados do sistema?";
  const popupBreakItemMsg =
    "Tem a certeza que pretende colocar os ativos selecionados como avariados?";

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function handleButton() {
    handleClickOpen();
  }

  return (
    <div>
      <div className={classes.main}>
        <div className={classes.tituloHeader}>
          <Typography variant="h3"></Typography>
        </div>
        <div>
            <Button
              component={Link}
              to="/actives/add"
              variant="contained"
              style={{
                backgroundColor: "#0E3D41",
                margin: "20px",
              }}
            >
              Adicionar novo ativo
            </Button>
            {selectedRows.length !== 0 ? (
              <div>
                <Button
                  onClick={handleButton}
                  variant="contained"
                  style={{
                    backgroundColor: "#0E3D41",
                    margin: "20px",
                  }}
                >
                  Remover ativos
                </Button>
                <Button
                  onClick={handleButton}
                  variant="contained"
                  style={{
                    backgroundColor: "#0E3D41",
                    margin: "20px",
                  }}
                >
                  Colocar ativos como avariados
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        <div className={classes.filter}>
          <Filter
            options={cats}
            titulo={"Filtrar por categoria: "}
            initialVal={category}
            onChange={handleChange}
          />
        </div>
        <div className={classes.grid}>
          <ThemeProvider theme={gridStyle}>
            <DataTable
              value={category}
              json={requested_items}
              icones_used={icones}
              colunas={cols}
              linhas={rows}
              alinhar={alinhar}
              selectBox={boxes}
              filterBy="Categoria"
              onChange={handleGridButtons}
              selectedRows={saveRows}
            />
          </ThemeProvider>
          <div>
            <PopUp
              open={open}
              title="Confirmação"
              description={popupRemoveItemsMsg}
              onChange={handleClose}
              actions={true}
              handleSend={handleDeleteRows}
            />
            <PopUp
              open={open}
              title="Confirmação"
              description={popupBreakItemMsg}
              onChange={handleClose}
              actions={true}
              handleSend={handleAvariarRows}
            />
          </div>
        </div>
      </div>
      {openItemDetails ? (
        <ItemDetails
          openItemDetails={openItemDetails}
          setItemDetails={setItemDetails}
          selectedRowId={selectedRowId}
          selectedRowCategory={selectedRowCategory}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
