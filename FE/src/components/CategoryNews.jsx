import { Box, Grid2, Stack, Typography } from '@mui/material';
import React from 'react';
import NewsCard from './NewsCard';
import { useTheme } from '@emotion/react';
import { Link } from 'react-router-dom'

function CategoryNews(props) {
  const theme = useTheme();
  return (
    <Box  sx={{
      width: '95%',
      margin: '10px auto',
    }}>
      <Stack sx={{
        bgcolor: theme.palette.primary.main,
        mb: '10px',
        borderRadius: '5px'
      }}>
        <Typography sx={{
          padding: '10px 20px',
          textTransform: 'unset',
          fontWeight: 600,
        }}>
           <Link to={props.linkTo} style={{color: '#fff'}}>{props.title}</Link>
        </Typography>
      </Stack>

      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 1, md: 4 }} >
        {
          props.isHomePage ?
            props.newsList.slice(0, 6).map((news, index) => (
              <Grid2 key={index} size={{ xs: 1, sm: 1, md: 2 }}>
                <NewsCard data={news} />
              </Grid2>
            ))
            :
            props.newsList.slice(props.start, props.end).map((news, index) => (
              <Grid2 key={index} size={{ xs: 1, sm: 1, md: 2 }}>
                <NewsCard data={news} />
              </Grid2>
            ))
        }

      </Grid2>
    </Box>

  );
}

export default CategoryNews;