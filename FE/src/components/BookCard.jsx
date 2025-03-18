import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteBooks/FavoriteButton';  // Assuming you have FavoriteButton component

function BookCard({ data, isFavorite, onFavoriteToggle }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: 'flex',
        width: '100%',
        m: '0 auto',
        boxShadow: theme.boxShadow.main,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.01)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: '1' }}>
          <Typography component="div" variant="subtitle1">
            {data.name}
          </Typography>
          <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
            {data.creatorBook}
          </Typography>
        </CardContent>
        <Box>
          <Link to={`/chi-tiet-sach/${data.id}`}>
            <Button
              variant="contained"
              sx={{
                textTransform: 'unset',
                fontSize: '12px',
                width: 'fit-content',
                height: 'fit-content',
                padding: 0,
                m: '0px 0 10px 10px',
                borderRadius: '0',
              }}
            >
              Chi tiết
            </Button>
          </Link>
          <FavoriteButton bookId={data.id} isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 160, aspectRatio: '6 / 9' }}
        image={data.imgBook}
        alt=""
      />
    </Card>
  );
}

export default BookCard;
