import { createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#4B6E71',
      main: '#2D5659',
      dark: '#0E3D41',
    },
    secondary: {
      light: '#FFFFFF',
      main: '#D2DBDC',
      dark: '#A5B7B8',
    },
  },
});

const theme1 = createTheme({
components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained'},
          style: {
            position: 'relative',
            marginLeft: '20px',
            marginTop: '20px',
            float: 'right',
            padding: 10,
            fontSize: 16,
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.dark,
            '&:hover': {
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.primary.light,
            },
          },
        },
        {
          props: { variant: 'outlined'},
          style: {
            position: 'relative',
            marginLeft: '20px',
            marginTop: '20px',
            float: 'right',
            padding: 10,
            fontSize: 16,
            borderColor: theme.palette.secondary.dark,
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.primary.dark,
            '&:hover': {
                borderColor: theme.palette.secondary.dark,
                backgroundColor: theme.palette.secondary.main,
            },
          },
        },
      ],
    },
  },
});

export default theme1;