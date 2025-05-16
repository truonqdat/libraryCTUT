import React, { useEffect, useState, useContext } from "react";
import HeaderPage from "../components/HeaderPage";
import SearchInput from "../components/SearchInput";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Box, IconButton, Stack } from "@mui/material";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FeedIcon from "@mui/icons-material/Feed";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FavoriteIcon from "@mui/icons-material/Favorite";
import categoryService from "../services/categoryService";

function Home(props) {
  const [categories, setCategories] = useState([]);
  const [facultyies, setFacultyies] = useState([]);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();

        const fetchedCategories = response.map((category) => ({
          link: `danh-muc/${category._id}`,
          text: category.name,
        }));

        // Thêm mục "Xem tất cả" vào đầu mảng danh mục
        const allCategories = [
          { link: "/danh-muc", text: "Xem tất cả" }, // Mục "Xem tất cả"
          ...fetchedCategories,
        ];

        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchFacultyies = async () => {
      try {
        const response = await categoryService.getAllFetchFacultyies();

        const fetchedFacultyies = response.map((category) => ({
          link: `khoa/${category._id}`,
          text: category.name,
        }));

        // Thêm mục "Xem tất cả" vào đầu mảng danh mục
        const allFacultyies = [
          { link: "/khoa", text: "Xem tất cả" }, // Mục "Xem tất cả"
          ...fetchedFacultyies,
        ];

        setFacultyies(allFacultyies);
      } catch (error) {
        console.error("Error fetching Facultyies:", error);
      }
    };
    fetchFacultyies();
    fetchCategories();
  }, []);

  console.log(categories);

  const menuItems = [
    { link: "/", text: "Trang chủ", icon: <HomeIcon fontSize="medium" /> },
    // { link: "/tin-tuc", text: "Tin tức", icon: <FeedIcon fontSize="medium" /> },
    // {
    //   link: "/sach-moi",
    //   text: "Sách mới",
    //   icon: <AutoStoriesIcon fontSize="medium" />,
    // },
    {
      text: "Danh mục",
      icon: <MenuBookIcon fontSize="medium" />,
      subItems: categories,
    },
    {
      text: "Khoa",
      icon: <MenuBookIcon fontSize="medium" />,
      subItems: facultyies,
    },
    // {
    //   link: "sach-yeu-thich",
    //   text: "Sách yêu thích",
    //   icon: <FavoriteIcon fontSize="medium" />,
    // },
  ];

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div>
      <HeaderPage />
      {visible && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <ManageSearchIcon sx={{ color: "#fff" }} />
        </IconButton>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          margin: "0 auto",
          width: "90%",
        }}
      >
        <Stack>
          <SideBar menuItems={menuItems} />
        </Stack>
        <Stack sx={{ width: "100%" }}>
          <Outlet />
        </Stack>
      </Box>
    </div>
  );
}

export default Home;
