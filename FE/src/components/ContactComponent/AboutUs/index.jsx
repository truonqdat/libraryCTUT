import React from 'react';
import { Box, Typography, Grid, Paper, Divider, IconButton } from '@mui/material';
import { LocationOn, Phone, Email, Web, Facebook, Instagram, Twitter, LinkedIn, YouTube } from '@mui/icons-material';

function AboutUs() {
  return (
    <Box sx={{ minHeight: '100%', padding: '20px' , width: "95%"}}>

    <Typography 
      variant="h3" 
      component="h1" 
      align="center" 
      sx={{
        fontWeight: 'bold', 
        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
        marginBottom: '30px'
      }}
    >
      Thông tin liên hệ
    </Typography>


    <Grid container spacing={3} justifyContent="center">
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      sx={{
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between', // Đảm bảo nội dung được phân bố đều
        height: '100%', // Chiều cao 100% để Paper chiếm toàn bộ không gian có sẵn
       
      }}
    >
      <LocationOn sx={{ fontSize: 50, color: 'blue' }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
        Địa chỉ
      </Typography>
      <Typography variant="body1">
      256 Nguyễn Văn Cừ, Quận Ninh Kiều, TP Cần Thơ
      </Typography>
    </Paper>
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <Paper
      sx={{
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
       
      }}
    >
      <Phone sx={{ fontSize: 50, color: 'blue' }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
        Số điện thoại
      </Typography>
      <Typography variant="body1">
        0868 660 545
      </Typography>
    </Paper>
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <Paper
      sx={{
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
       
      }}
    >
      <Email sx={{ fontSize: 50, color: 'blue' }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
        Email
      </Typography>
      <Typography variant="body1">
        libraryCTUT@ctut.edu.vn
      </Typography>
    </Paper>
  </Grid>
</Grid>

    <Divider sx={{ margin: '40px 0', borderColor: '#ddd' }} />

    <Typography 
      variant="h5" 
      component="h2" 
      align="center" 
      sx={{ marginBottom: '20px', fontWeight: 'bold' }}
    >
      Kết nối với chúng tôi
    </Typography>
    <Box 
      display="flex" 
      justifyContent="center" 
      gap="20px"
    >
      <IconButton 
        href="https://www.facebook.com/CTUT.CT" 
        target="_blank" 
        sx={{ 
          '&:hover': { 
            color: '#1877F2', 
            transform: 'scale(1.2)',
            transition: 'transform 0.3s, color 0.3s' 
          } 
        }}
      >
        <Facebook fontSize="large" />
      </IconButton>
      <IconButton 
        href="https://www.youtube.com/@ctut-kythuatvaoisong5936" 
        target="_blank" 
        sx={{ 
          '&:hover': { 
            color: '#FF0000', 
            transform: 'scale(1.2)',
            transition: 'transform 0.3s, color 0.3s' 
          } 
        }}
      >
        <YouTube fontSize="large" />
      </IconButton>
    </Box>
  </Box>
  );
}

export default AboutUs;
