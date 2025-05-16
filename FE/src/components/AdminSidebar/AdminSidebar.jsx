import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import Category from "./SubSidebar/CategoryAdmin";
import Faculty from "./SubSidebar/FacultyAdmin";
import Book from "./SubSidebar/BookAdmin";
import Reservation from "./SubSidebar/ReservationAdmin";
import Borrow from "./SubSidebar/BorrowAdmin";
import Transation from "./SubSidebar/TransationAdmin";
import User from "./SubSidebar/AccountAdmin";

export default function Sidebar() {
  const [value, setValue] = React.useState(0);
  const [content, setContent] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContent(getContent(newValue));
  };

  const getContent = (index) => {
    switch (index) {
      case 0:
        return <User />;
      case 1:
        return <Book />;
      case 2:
        return <Reservation />;
      case 3:
        return <Faculty />;
      case 4:
        return <Category />;
      case 5:
        return <Borrow />;
      case 6:
        return <Transation />;
      default:
        return null;
    }
  };

  React.useEffect(() => {
    // Set initial content
    setContent(getContent(value));
  }, [value]);

  const IconSidebar = [
    { label: "Người dùng", icon: <PeopleOutlineIcon /> },
    { label: "Tài liệu", icon: <ShoppingCartOutlinedIcon /> },
    { label: "Yêu cầu", icon: <CategoryOutlinedIcon /> },
    { label: "Danh mục khoa", icon: <ListAltOutlinedIcon /> },
    { label: "Danh mục sách", icon: <StorefrontOutlinedIcon /> },
    { label: "Mượn / Trả", icon: <ImportExportIcon /> },
    { label: "Nhập / Xuất", icon: <ImportExportIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "background.paper", height: "100vh" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="AdminSidebar"
        sx={{ borderRight: 1, borderColor: "divider", width: "220px" }}
      >
        {IconSidebar.map((tab, index) => (
          <Tab
            key={index}
            sx={{}}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  width: "100%",
                }}
              >
                {tab.icon}
                <Box sx={{ ml: 1 }}>{tab.label}</Box>
              </Box>
            }
          />
        ))}
      </Tabs>
      <Box sx={{ flexGrow: 1, padding: 2 }}>{content}</Box>
    </Box>
  );
}
