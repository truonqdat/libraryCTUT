import { useTheme } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { Box, Stack, Typography, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./Login.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.white.main,
  padding: "10px",
  fontWeight: 600,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.yellow.main,
  },
}));

function HeaderPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  console.log(user);

  return (
    <Box>
      <Stack
        flexDirection={"row"}
        width={"90%"}
        alignItems={"center"}
        gap={"10px"}
        m={"0 auto"}
        p={"10px"}
      >
        <img
          style={{ width: "70px", height: "70px" }}
          src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Artboard-2.png"
          alt="Logo"
        />
        <Stack>
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              fontSize: 20,
              color: "#264480",
            }}
          >
            Trung tâm học liệu
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              fontSize: 15,
              color: "#264480",
            }}
          >
            Trường Đại học Kỹ thuật - Công nghệ Cần Thơ
          </Typography>
        </Stack>
      </Stack>
      <Stack sx={{ backgroundColor: theme.palette.primary.main }}>
        <Stack
          width={"90%"}
          m={"0 auto"}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <Stack
            flexDirection={"row"}
            sx={{
              display: { xs: "none", md: "flex" },
              textTransform: "uppercase",
              alignItems: "center",
            }}
          >
            <StyledLink to={"/"}>Trang chủ</StyledLink>
            <StyledLink to={"/lien-he"}>Liên hệ</StyledLink>
          </Stack>
          <Stack
            flexDirection={"row"}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <StyledLink>
              <ReorderIcon />
            </StyledLink>
          </Stack>
          <Stack flexDirection={"row"} sx={{ margin: "10px 30px 10px 0" }}>
            {user.isAuthenticated ? (
              <>
                <Typography
                  sx={{
                    cursor: "pointer",
                    padding: "8px 0",
                    color: "#FFF",
                    fontWeight: 600,
                    display: "flex",
                    gap: "8px",
                    "&:hover": {
                      color: theme.palette.yellow.main,
                    },
                  }}
                  onClick={handleMenuOpen}
                >
                  <ContactMailIcon />
                  {user.currentUser.fullName}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ color: "white" }}
                >
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/ho-so-doc-gia"
                  >
                    Hồ sơ
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              >
                <Login />
              </GoogleOAuthProvider>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default HeaderPage;
