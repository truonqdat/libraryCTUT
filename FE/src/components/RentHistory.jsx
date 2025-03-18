import { Divider, Stack, Typography, useTheme } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import RentItem from "./RentItem";
import userService from "../services/userService";
import { userContext } from "./Context";

function RentHistory(props) {
  const theme = useTheme();
  const { loggedInUser } = useContext(userContext);
  const [rentList, setRentList] = useState([]);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await userService.getAllBorrowBook(
        loggedInUser.userData.id
      );
      setRentList(response);
    } catch (error) {
      console.log("Không thể tải dữ liệu");
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <Stack
      sx={{
        width: "100%",
        margin: "10px auto",
      }}
    >
      <Stack
        sx={{
          margin: "0 auto",
          minHeight: "334px",
          width: "95%",
          borderRadius: "10px",
          padding: "10px 20px",
          boxShadow: theme.boxShadow.main,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.text.primary.main, fontWeight: 600 }}
        >
          Lịch sử mượn sách
        </Typography>

        <Divider />

        {rentList.map((rentBook, index) => (
          <RentItem key={index} book={rentBook} />
        ))}
      </Stack>
    </Stack>
  );
}

export default RentHistory;
