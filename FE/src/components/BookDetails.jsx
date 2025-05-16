import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import bookService from "../services/bookService";
import { useCart } from "./Cart";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    open: false,
  });

  // Kiểm tra xem sách đã có trong giỏ chưa
  const isBookInCart = cart.some((item) => item.book._id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookData, copiesData] = await Promise.all([
          bookService.getBookById(id),
          bookService.getBookCopies(id),
        ]);
        setBook(bookData);
        setCopies(copiesData);
       
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification({ message: "Lỗi khi tải dữ liệu sách", open: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGoBack = () => navigate(-1);

  const handleAddToCart = (bookCopy) => {
    if (isBookInCart) {
      setNotification({
        message: "Bạn đã chọn một bản copy của sách này rồi",
        open: true,
      });
      return;
    }

    if (bookCopy.status !== "Available") {
      setNotification({
        message: "Bản copy này không khả dụng để mượn",
        open: true,
      });
      return;
    }

    addToCart({
      book: book,
      selectedCopy: bookCopy,
    });

    setNotification({
      message: "Đã thêm bản copy vào giỏ mượn",
      open: true,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Không tìm thấy thông tin sách</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 2 }}
      >
        Quay lại
      </Button>

      <Card sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minWidth: "1000px",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: { xs: "100%", md: 400 }, height: "auto" }}
            image={`http://localhost:3001/api${book.coverImage}` || "/default-book-cover.jpg"}
            alt={book.title}
          />
          <Box sx={{ p: 3, flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tác giả: {book.author}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Thể loại: {book.categoryId?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Năm xuất bản: {book.publishedYear}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Mô tả: {book.description}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Danh sách bản copy
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã bản copy</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Tình trạng</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {copies.length > 0 ? (
              copies.map((copy) => (
                <TableRow key={copy._id}>
                  <TableCell>{copy.barcode}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        copy.status === "Available"
                          ? "Có sẵn"
                          : copy.status === "Borrowed"
                          ? "Đã duyệt"
                          : copy.status === "Reserved"
                          ? "Không có sẵn"
                          : copy.status === "Pending"
                          ? "Đang xử lý"
                          : "Mất"
                      }
                      color={
                        copy.status === "Available"
                          ? "success"
                          : copy.status === "Borrowed"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>{copy.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        copy.condition === "New"
                          ? "Mới"
                          : copy.condition === "Good"
                          ? "Còn tốt"
                          : "Hư hại"
                      }
                      color={
                        copy.condition === "New"
                          ? "success"
                          : copy.condition === "Good"
                          ? "primary"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleAddToCart(copy)}
                      disabled={copy.status !== "Available" || isBookInCart}
                      color="primary"
                    >
                      <AddShoppingCartIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có bản copy nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        message={notification.message}
      />
    </Box>
  );
}

export default BookDetails;
