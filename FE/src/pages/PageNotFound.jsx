import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound(props) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw ',
      flexDirection: 'column',
    }}>
      <Typography variant='h1' sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant='h3' sx={{ fontWeight: 500, mb: '10px' }}>
        Không tìm thấy trang yêu cầu
      </Typography>
      <Link>
       <Button variant='contained' color="error">Trở lại trang chủ</Button>
      </Link>
    </Box>
  );
}

export default PageNotFound;