import React, { useState, useEffect, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userContext } from '../Context';
import favoriteBooksService from "../../services/favoriteBooksService";
import CircularProgress from '@mui/material/CircularProgress';

const FavoriteButton = ({ bookId }) => {
  const { loggedInUser } = useContext(userContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = loggedInUser ? loggedInUser.userData.id : null;

  // Chỉ kiểm tra trạng thái yêu thích khi có userId
  useEffect(() => {
    if (!userId) return;

    const checkFavoriteStatus = async () => {
      setLoading(true);
      try {
        const response = await favoriteBooksService.getIdFavoriteBooksByUserId(userId);
        const favoriteBooks = response.data;
        setIsFavorite(favoriteBooks.some(book => book.bookId === bookId));
      } catch (error) {
        console.error('Lỗi khi kiểm tra sách yêu thích:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [userId, bookId]);

  const addFavorite = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await favoriteBooksService.addFavoriteBook(userId, bookId);
      setIsFavorite(true);
    } catch (error) {
      console.error('Lỗi khi thêm sách yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await favoriteBooksService.removeFavoriteBook(userId, bookId);
      setIsFavorite(false);
    } catch (error) {
      console.error('Lỗi khi xóa sách yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chỉ hiển thị khi đã có userId
  if (!userId) return null;

  return (
    <IconButton
      onClick={isFavorite ? removeFavorite : addFavorite}
      color={isFavorite ? 'error' : 'default'}
      disabled={loading} // Disable button when loading
    >
      {loading ? <CircularProgress size={24} /> : (isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />)}
    </IconButton>
  );
};

export default FavoriteButton;
