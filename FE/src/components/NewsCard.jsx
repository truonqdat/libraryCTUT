import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
function NewsCard(props) {
  const theme = useTheme()
  return (
    <Card sx={{
      display: 'flex',
      width: '100%',
      m: '-4px auto',
      boxShadow: theme.boxShadow.main,
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      height: '190px',
      '&:hover': {
        transform: 'scale(1.01)',
      }
    }} >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: '500px' }}>
        <CardContent sx={{ flex: '1' }}>
          <Typography component="div" variant="subtitle1"
            sx={{
              color: 'text.secondary',
              height: '30px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }}
          >
            {props.data.title}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <VisibilityIcon fontSize='13px'/> {props.data.view}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <EventIcon fontSize="13px"/>{props.data.dayCreated}
          </Typography>
        </CardContent>
        <Link to={`/chi-tiet-tin-tuc/${props.data.id}`}>
          <Button variant='contained' sx={{
            textTransform: 'unset',
            fontSize: '12px',
            width: 'fit-content',
            height: 'fit-content',
            padding: 0,
            m: '0px 0 10px 10px',
            borderRadius: '0'
          }}>Chi tiết</Button>
        </Link>
      </Box>
      {props.data.image ? <CardMedia
        component="img"
        sx={{ width: 200, aspectRatio: '7 / 9' }}
        image={props.data.image}
        alt={props.data.title}
      /> : <CardMedia
      component="img"
      sx={{ width: 200, aspectRatio: '7 / 9' }}
      image='https://res.cloudinary.com/dta7fdnph/image/upload/v1729434759/soft_shadow_ocndts.png'
      alt={props.data.title}
      />
    }   
    </Card >
  );
}

export default NewsCard;