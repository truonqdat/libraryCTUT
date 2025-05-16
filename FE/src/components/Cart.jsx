import React, { createContext, useContext, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  ThemeProvider,
  createTheme,
  Button,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import reservationService from "../services/reservationService.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#264480",
    },
    secondary: {
      main: "#f5f5f5",
    },
  },
});

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const isBookInCart = (bookId) => {
    return cart.some((item) => item.book.id === bookId);
  };

  const addToCart = (bookWithCopy) => {
    if (isBookInCart(bookWithCopy.book.id)) {
      return false;
    }

    const newCart = [
      ...cart,
      {
        book: bookWithCopy.book,
        selectedCopy: bookWithCopy.selectedCopy,
        quantity: 1,
      },
    ];

    saveCart(newCart);
    return true;
  };

  const deleteFromCart = (bookId) => {
    const newCart = cart.filter((item) => item.book.id !== bookId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        totalItems: cart.length,
        addToCart,
        deleteFromCart,
        clearCart,
        isBookInCart,
        toggleCart,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

function BookCart() {
  const {
    cart,
    isCartOpen,
    totalItems,
    deleteFromCart,
    clearCart,
    toggleCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const access_token = localStorage.getItem("accessToken");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmitReservation = async () => {
    if (!access_token) {
      setError("Vui lòng đăng nhập để đặt mượn sách");
      return;
    }

    if (cart.length === 0) {
      setError("Giỏ sách trống, không thể gửi yêu cầu");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const books = cart.map((item) => ({
        bookId: item.book._id,
        barcode: item.selectedCopy.barcode,
      }));

      const response = await reservationService.createReservation(
        access_token,
        books
      );
      clearCart();
      toggleCart();

      setSnackbar({
        open: true,
        message: `Đặt mượn thành công! Mã: ${response.reservationCode || ""}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Lỗi:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra");
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Có lỗi xảy ra khi đặt mượn",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <IconButton onClick={toggleCart} sx={{ color: "#fff" }}>
        <Badge badgeContent={totalItems} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Drawer anchor="right" open={isCartOpen} onClose={toggleCart}>
        <Box
          sx={{
            width: 350,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Giỏ Mượn Sách ({totalItems})
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {cart.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh",
              }}
            >
              <ShoppingCartIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                Giỏ sách của bạn đang trống
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: "auto" }}>
                {cart.map((item) => (
                  <React.Fragment
                    key={`${item.book.id}-${item.selectedCopy.barcode}`}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={item.book.image}
                          alt={item.book.title}
                          sx={{ width: 60, height: 80, mr: 1 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.book.title}
                        secondary={
                          <>
                            <Typography variant="body2">
                              Mã copy: {item.selectedCopy.barcode}
                            </Typography>
                            <Typography variant="caption">
                              Trạng thái:{" "}
                              {item.selectedCopy.status === "Available"
                                ? "Có sẵn"
                                : "Đang xử lý"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => deleteFromCart(item.book.id)}
                                sx={{ ml: "auto" }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ pt: 2, borderTop: "1px solid #eee" }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleSubmitReservation}
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu mượn"}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  Xóa tất cả
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BookCart;
