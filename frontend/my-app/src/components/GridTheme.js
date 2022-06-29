import { createTheme} from '@mui/material/styles';

const theme1 = createTheme({
components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          '& .MuiDataGrid-columnsContainer': {
            backgroundColor: '#D2DBDC',
            borderTop: '1px solid',
            borderColor: 'black',
            display: 'flex',
          },
          '& .MuiDataGrid-main': {
            borderLeft: '1px solid',
            borderRight: '1px solid',
            borderColor: 'black',
          },
          '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'black',
          },
          '& .MuiDataGrid-columnHeader': {
            height: '100vh',
            borderRight: '1px solid',
            borderColor: 'black',
          },
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid',
            borderColor: 'black',
          },
          '& .MuiDataGrid-iconSeparator':{
            height: '100vh',
          },
          '& .MuiDataGrid-columnSeparator': {
            visibility: 'hidden',
          },
          '& .MuiButton-root': {
            margin: 'auto',
            color: 'black',
          },
          '& .MuiButton-startIcon': {
            margin: 'auto',
          },
        }
      },
    },
  },
});

export default theme1;