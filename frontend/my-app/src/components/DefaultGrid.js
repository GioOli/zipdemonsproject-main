import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
//import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import mapImgs from '../img/MapImages';
import isDeepEqual from 'fast-deep-equal/react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

/*const useStyles = makeStyles({
  root: {
    border: 0,
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: '#D2DBDC',
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
      borderBottom: '5px solid',
      borderColor: 'blue',
      flexDirection: "row",
      alignSelf: "flex-start",
    },
  }
});*/

function createColumns(props) {

  var icones_used = props.icones_used;
  var colunas = props.colunas;
  var colunasD = [];
  var colWidth = 0;
 
  if(!props.selectBox){
    colWidth = (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)) / (colunas.length);
  }
  else{
    colWidth = ((Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))-50) / (colunas.length);
  }
  //var a = 0
  const handleClick = (event, values, col) => {
    props.onChange(values.row, col);
  };

  for (let i = 0; i < colunas.length; i++) {
    var elements = {};
    //verifica se é uma coluna com icones
    if (colunas[i] in icones_used) {
      let CustomIcon = icones_used[colunas[i]];
      elements = {
        field: colunas[i],
        headerName: colunas[i],
        headerAlign: 'center',
        width: colWidth,
        renderCell: (cellValues) => {
          return (
            <Button
              variant="text"
              startIcon={<CustomIcon />}
              onClick={(event) => {
                handleClick(event, cellValues, colunas[i]);
              }}
            >
            </Button>
          );
        }
      };
    }
    else if (colunas[i] === "Imagem") {
      elements = {
        field: colunas[i],
        headerName: '',
        headerAlign: 'center',
        width: colWidth,
        renderCell: (cellValues) => {
          return (
            <img style={{ maxWidth: '100%', height: '30px', margin: 'auto' }} src={mapImgs[cellValues.row.Categoria]} alt="category" />
          );
        }
      };
    }

    else if (colunas[i] === "Estado") {
      elements = {
        field: colunas[i],
        headerName: colunas[i],
        headerAlign: 'center',
        align: 'center',
        width: colWidth,
        renderCell: (cellValues) => {
          return (
            <div>
              {cellValues.row.Estado === false || cellValues.row.Estado === "Pendente" ? 
                <Alert severity="warning" style={{ maxWidth: '100%', height: '40px', margin: 'auto' }}>
                <AlertTitle>Pendente</AlertTitle>
                </Alert> 
                :
                cellValues.row.Estado === "Recusado" ?
                <Alert severity="error" style={{ maxWidth: '100%', maxHeight: '40px', margin: 'auto' }}>
                <AlertTitle>Recusado</AlertTitle>
                </Alert> 
                :
                <Alert severity="success" style={{ maxWidth: '100%', height: '40px', margin: 'auto' }}>
                <AlertTitle>Aceite</AlertTitle>
                </Alert>
                }
            </div>
          );
        }
      };
    }

    //caso seja uma coluna normal
    else {
      //console.log(props.alinhar[i]);

      if(props.alinhar[i] === 'Number'){
        elements = { field: colunas[i], headerName: colunas[i], headerAlign: 'right', align: 'right', width: colWidth };
      }
      else{
        elements = { field: colunas[i], headerName: colunas[i], headerAlign: 'left', align: 'left', width: colWidth };
      }  
    }
    colunasD[i] = elements;
  }
  //console.log(colunasD);
  return (colunasD);
}

function createRows(props) {
  var json = props.json;
  var linhas = props.linhas;
  var cart = [];

  for (let i = 0; i < json.length; i++) {
    var elements = {};

    elements.id = i;
    for (const key in linhas) {

      if (key === 'ActiveId') {
        elements[key] = Number(json[i][linhas[key]]);
      }
      else {
        elements[key] = json[i][linhas[key]];
      }
    }

    cart.push(elements);
  }
  return (cart);

}

export default function DataTable(props) {

  //const classes = useStyles();
  const initialRows = createRows(props);
  var [rows, setRows] = React.useState(initialRows);

  const rowsRef = React.useRef(initialRows);
  if (!isDeepEqual(rowsRef.current, initialRows)) {
    rowsRef.current = initialRows;
  }

  const updateRows = React.useCallback(() => {
    //console.log("Mudou a Categoria para ", props.value);
    if (props.value === '') {
      setRows(rowsRef.current);
    }
    else {
      setRows(rowsRef.current.filter((row) => {
        console.log("row[props.filterBy] ------- " + row[props.filterBy])
        console.log("props.value ------- " + props.value)
        if (props.value === 'Pendente' && row[props.filterBy] === false) {
          return true
        } else if (props.value === 'Aceite' && row[props.filterBy] === true) {
          return true
        }
        return row[props.filterBy] === props.value;
      }));
    }
  }, [props.value, props.filterBy]);

  //quando a categoria muda ele chama o updateRows
  React.useEffect(() => {
    updateRows();
  }, [props.value, updateRows]);

  const updateRowsWithText = React.useCallback(() => {
    //console.log("Mudou a Categoria para ", props.value);
    setRows(rowsRef.current.filter((row) => {
        if(props.text === undefined){

        } else {
          let name = row[props.filterBy].toString();
          let text2 = props.text;

          if(name.toLowerCase().includes(text2.toLowerCase())){
            return true;
        }
        }
        
        
       /*
        let name = row[props.filterBy].toString();
        let text2 = props.text;

        if(name.includes(text2)){
          return true;
        }
        */

        return row[props.filterBy] === props.text;
      }));
      
    
  }, [props.text, props.filterBy]);

  //quando a categoria muda ele chama o updateRows
  React.useEffect(() => {
    updateRowsWithText();
  }, [props.text, updateRowsWithText]);

  //para só mudar as rows uma vez -> senão tava em loop a mudar
  React.useEffect(() => {
    setRows(rows);
  }, [rows]);

  //para guardar as linhas selecionadas -> devolução
  var selectedRows = (ids) => {
    var selectedOnes = [];
    ids.forEach(function (item) {
      //console.log(item);
      let linha = rows.filter((row) => {
        return row['id'] === item;
      });
      //console.log(linha[0]);
      selectedOnes.push(linha[0])
    });
    props.selectedRows(selectedOnes);
  }

  return (
    <div className="main_container">
      <div >
        <DataGrid
          rows={rows}
          columns={createColumns(props)}
          autoHeight
          disableColumnFilter
          checkboxSelection={props.selectBox}
          disableSelectionOnClick
          onSelectionModelChange={(newSelection) => {
            selectedRows(newSelection);
          }}
        />
      </div>
    </div>
  );
}