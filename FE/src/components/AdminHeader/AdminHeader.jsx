import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Box from '@mui/material/Box';
import UserMenu from '../HeaderTop/subComponent/UserMenu';
import { useSelector } from 'react-redux';

const listMenu = [
    {
        to: '/',
        icon: <PersonOutlineOutlinedIcon fontSize="small" />,
        label: 'Trang người dùng',
    },
];

export default function AdminHeader() {
    const userData = useSelector((state) => state.user);

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src="https://res.cloudinary.com/dbtvigpjm/image/upload/v1725985449/admin-logo_kkh2jh.png"
                        alt=""
                        style={{ width: '200px' }}
                    />
                    {/* <Typography variant="h6" component="div">
                        My Application
                    </Typography> */}
                </Box>
                <Box>
                    <UserMenu userData={userData} listMenu={listMenu} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
