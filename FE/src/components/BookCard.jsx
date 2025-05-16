import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTheme } from "@emotion/react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useCart } from "./Cart"; // Import hook useCart từ Cart.jsx

function BookCard({ data }) {
  const theme = useTheme();
  const { addToCart } = useCart(); // Lấy hàm addToCart từ hook useCart

  const handleAddToCart = () => {
    // Tạo object book từ data với cấu trúc phù hợp với giỏ hàng
    const book = {
      id: data._id,
      title: data.title,
      author: data.author,
      image: data.coverImage,
    };
    addToCart(book);
  };

  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        m: "0 auto",
        boxShadow: theme.boxShadow.main,
        cursor: "pointer",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1" }}>
          <Typography component="div" variant="subtitle1">
            {data.title}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {data.author}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", gap: 1, padding: "0 0 10px 10px" }}>
          <Link to={`/chi-tiet-sach/${data._id}`}>
            <Button
              variant="contained"
              sx={{
                textTransform: "unset",
                fontSize: "12px",
                width: "fit-content",
                height: "fit-content",
                padding: 0,
                m: "0px 0 10px 10px",
                borderRadius: "4px",
              }}
            >
              Chi tiết
            </Button>
          </Link>
          {/* <Button
            variant="contained"
            sx={{
              textTransform: "unset",
              fontSize: "12px",
              width: "fit-content",
              height: "fit-content",
              padding: 0,
              m: "0px 0 10px 10px",
              borderRadius: "4px",
            }}
            onClick={handleAddToCart}
          >
            +
          </Button> */}
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 160, aspectRatio: "6 / 9" }}
        image={`http://localhost:3001/api${data.coverImage}`}
        alt={data.title}
      />
    </Card>
  );
}

export default BookCard;
