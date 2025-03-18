import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Category from '../components/CategoryBook';
import SearchInput from "../components/SearchInput";
import { Box, Grid2, Stack, Typography } from '@mui/material';
import BookCard from '../components/BookCard';
import Pagination from "../components/Pagination";
import Bookservice from "../services/bookService";
import favoriteBooksService from "../services/favoriteBooksService";

function SearchPage() {
  const [books, setBooks] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [favoriteBooks, setFavoriteBooks] = useState([]);  // Trạng thái yêu thích của các sách
  const [favoriteBooksStatus, setFavoriteBooksStatus] = useState({});  // Trạng thái yêu thích của từng sách

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const danhMuc = queryParams.get('danhmuc');
  const tuKhoa = queryParams.get('tukhoa');

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const response = await Bookservice.getAllBooksBySearch({ danhMuc, tuKhoa });
        setBooks(response.data);
        setLoading(false); 
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
        setLoading(false); 
      }
    };
    getBooks(); 
  }, [danhMuc, tuKhoa]); 

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const response = await favoriteBooksService.getFavoriteBooksByUserId(1);  // Giả sử userId = 1
        setFavoriteBooks(response.data.map(book => book.bookId)); // Lưu danh sách bookId yêu thích
      } catch (error) {
        console.error("Lỗi khi lấy sách yêu thích:", error);
      }
    };

    if (books.length > 0) {
      fetchFavoriteBooks();  // Cập nhật trạng thái yêu thích sau khi lấy sách
    }
  }, [books]);

  // Lưu trạng thái yêu thích của từng sách
  useEffect(() => {
    const newFavoriteBooksStatus = {};
    books.forEach(book => {
      newFavoriteBooksStatus[book.id] = favoriteBooks.includes(book.id);
    });
    setFavoriteBooksStatus(newFavoriteBooksStatus);
  }, [books, favoriteBooks]);

  const countBooks = books.length;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(countBooks / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = books.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFavoriteToggle = (bookId) => {
    setFavoriteBooksStatus(prevStatus => {
      const updatedStatus = { ...prevStatus };
      updatedStatus[bookId] = !updatedStatus[bookId];
      return updatedStatus;
    });
    
    if (favoriteBooksStatus[bookId]) {
      setFavoriteBooks(prevBooks => prevBooks.filter(id => id !== bookId));  // Nếu sách đã được yêu thích thì bỏ yêu thích
    } else {
      setFavoriteBooks(prevBooks => [...prevBooks, bookId]);  // Nếu chưa yêu thích thì thêm vào danh sách yêu thích
    }
  };

  return (
    <div>
      <SearchInput />
      <Box sx={{
        width: '95%',
        margin: '10px auto',
        minHeight: '515px'
      }}>
        {loading && <Typography variant="h6" align="center">Đang tải...</Typography>}
        {error && <Typography variant="h6" color="error" align="center">{error}</Typography>}

        <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 5, sm: 8, md: 12 }}>
          {
            displayedData.map((book, index) => (
              <Grid2 key={index} size={{ xs: 5, sm: 4, md: 4 }}>
                <BookCard 
                  data={book} 
                  isFavorite={favoriteBooksStatus[book.id]}  // Truyền trạng thái yêu thích từ `favoriteBooksStatus`
                  onFavoriteToggle={() => handleFavoriteToggle(book.id)}  // Xử lý khi nhấn nút yêu thích
                />
              </Grid2>
            ))
          }
        </Grid2>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </div>
  );
}

export default SearchPage;
