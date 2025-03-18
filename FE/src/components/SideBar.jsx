import React, { useState, useContext } from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { Stack, Collapse } from "@mui/material";

import { userContext } from './Context';

const SideBar = ({ menuItems }) => {
  const theme = useTheme();
  const [open, setOpen] = useState({});
  // const {logoutContext} = useContext(userContext)
  const { loggedInUser } = useContext(userContext);
  const handleToggle = (itemText) => {
    setOpen((prev) => ({ ...prev, [itemText]: !prev[itemText] }));
  };

  return (
    <Paper
      sx={{
        width: 230,
        maxWidth: 230,
        mt: "10px",
        color: theme.palette.common.white,
        bgcolor: theme.palette.primary.main,
        position: "sticky",
        top: "10px",
        display: { xs: "none", sm: "none", md: "block" },
      }}
    >
      <MenuList sx={{ p: 0 }}>
        {menuItems.map((item, index) => (
          <div key={index}>
            <Stack
              sx={{
                "&:hover": {
                  color: theme.palette.yellow.main,
                },
              }}
              onClick={() => item.subItems && handleToggle(item.text)}
            >
              <Link
                to={item.link || "#"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MenuItem sx={{ p: "12px 10px" }}>
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: "inherit" }} />
                </MenuItem>
              </Link>
            </Stack>
            {item.subItems && (
              <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
                <Stack sx={{ pl: 4 }}>
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.link}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <MenuItem
                        sx={{
                          p: "12px 15px",
                          "&:hover": {
                            color: theme.palette.yellow.main,
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{ color: "inherit" }}
                        />
                      </MenuItem>
                    </Link>
                  ))}
                </Stack>
              </Collapse>
            )}
            {item.divider && (
              <Divider sx={{ bgcolor: theme.palette.common.white }} />
            )}
          </div>
        ))}
        
        {loggedInUser.auth && (
           <Stack
           sx={{
             "&:hover": {
               color: theme.palette.yellow.main,
             },
           }}
           // onClick={() => item.subItems && handleToggle(item.text)}
         >
           <Link
             to="http://localhost:3001/api/v1/dang-xuat-user"
             style={{ textDecoration: "none", color: "inherit" }}
           >
             <MenuItem sx={{ p: "12px 10px" }}>
               <ListItemIcon sx={{ color: "inherit" }}>
                 <LogoutIcon fontSize="medium" />
               </ListItemIcon>
               <ListItemText primary="Đăng xuất" sx={{ color: "inherit" }} />
             </MenuItem>
           </Link>
         </Stack>
        )}
       
        
      </MenuList>
    </Paper>
  );
};

export default SideBar;
