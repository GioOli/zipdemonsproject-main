import React from 'react';
import Container from '@mui/material/Container';
import Box from "@mui/material/Box";
const NotFoundPage = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <h1>404 Page NotFound</h1>
      </Box>
    </Container>
  )
}

export default NotFoundPage;
