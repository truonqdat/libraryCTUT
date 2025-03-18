import { useTheme } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import LoginIcon from "@mui/icons-material/Login";
import LabelIcon from "@mui/icons-material/Label";
import { userContext } from "./Context";

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.white.main,
  padding: "10px",
  fontWeight: 600,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.yellow.main,
  },
}));
function HeaderPage(props) {
  const theme = useTheme();
  const { loggedInUser } = useContext(userContext);
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
          alt=""
        />
        <Stack>
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              fontSize: 20,
              color: theme.palette.primary.main,
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
              color: theme.palette.primary.main,
            }}
          >
            Đại học Kỹ thuật - Công nghệ Cần Thơ
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
            }}
          >
            <StyledLink to={"/"}>Trang chủ</StyledLink>
            <StyledLink to={"/lien-he"}>Liên hệ</StyledLink>
          </Stack>
          <Stack
            flexDirection={"row"}
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            <StyledLink>
              <ReorderIcon />
            </StyledLink>
          </Stack>
          <Stack flexDirection={"row"}>
            <StyledLink
              to={"/dang-nhap"}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <LabelIcon />
            </StyledLink>
            {loggedInUser.auth ? (
              <StyledLink
                to={"/ho-so-doc-gia"}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                Hồ sơ độc giả
              </StyledLink>
            ) : (
              <StyledLink
                to={"/dang-nhap"}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                Đăng nhập
              </StyledLink>
            )}
            <StyledLink
              to={"/dang-nhap"}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <LoginIcon />
            </StyledLink>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default HeaderPage;
