import { Divider, Stack, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import Category from './CategoryBook';
import { userContext } from './Context';
import favoriteBooksService from "../services/favoriteBooksService";

function FavoritBooks(props) {
  const { loggedInUser } = useContext(userContext);

  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await favoriteBooksService.getFavoriteBooks();
        setFavoriteBooks(response.data);
        console.log(response);
        
      } catch (error) {
        console.error('Lỗi khi kiểm tra sách yêu thích:', error);
      }
    };
    checkFavoriteStatus();
  }, []); 
  const theme = useTheme();
  console.log(favoriteBooks);

  return (
    
    <Stack
      sx={{
        width: '100%',
        margin: '10px auto',
      }}
    >
      <Stack
        sx={{
          margin: '0 auto',
          minHeight: '334px',
          width: '95%',
          borderRadius: '10px',
          padding: '10px 20px',
          boxShadow: theme.boxShadow.main,
        }}
      >
        <Typography
          variant='h6'
          sx={{ color: theme.text.primary.main, fontWeight: 600 }}
        >
          Sách yêu thích
        </Typography>

        <Divider />
        <Category bookList={favoriteBooks} isHomePage={false} />
      </Stack>
    </Stack>
  );
}

export default FavoritBooks;
