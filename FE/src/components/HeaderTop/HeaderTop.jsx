import * as React from 'react';
import { Box, Stack, Button, Badge } from '@mui/material';
import { useTheme } from '@emotion/react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UserMenu from './subComponent/UserMenu';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link, useNavigate } from 'react-router-dom';
import SearchInput from './subComponent/SearchInput';
import { useSelector } from 'react-redux';

const listMenu = [
    {
        to: '/profile',
        icon: <PersonOutlineOutlinedIcon fontSize="small" />,
        label: 'Thông tin cá nhân',
    },
    {
        to: '/order',
        icon: <Inventory2OutlinedIcon fontSize="small" />,
        label: 'Đơn hàng của tôi',
    },
    // {
    //     to: '/loyal-customers',
    //     icon: <FavoriteBorderOutlinedIcon fontSize="small" />,
    //     label: 'Sản phẩm yêu thích',
    // },
    {
        to: '/delivery-address',
        icon: <LocationOnOutlinedIcon fontSize="small" />,
        label: 'Địa chỉ nhận hàng',
    },
];

function HeaderTop(props) {
    const theme = useTheme();
    const cartData = useSelector((state) => state.product.productData);
    const countInCart = cartData.length;
    const userData = useSelector((state) => state.user);
    sessionStorage.setItem('cartData', JSON.stringify(cartData));

    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.backgroundColor.primary.main,
                    width: '100vw',
                    position: 'fixed',
                    boxShadow: theme.boxShadow.main,
                    padding: '15px 0',
                    zIndex: 10,
                    top: '0',
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1200px',
                        minWidth: '1200px',
                        m: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Stack flexDirection={'row'} alignItems={'center'} gap={'20px'}>
                        <Link to="/">
                            <img
                                src="https://res.cloudinary.com/dta7fdnph/image/upload/v1727082494/image-removebg-preview_1_oufh5k.png"
                                alt=""
                                style={{ width: '270px' }}
                            />
                        </Link>

                        <SearchInput />
                    </Stack>
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                        {userData && userData.isAuthenticated ? (
                            <>
                                <Link to="/shopping-cart">
                                    <Badge badgeContent={countInCart} color="secondary" sx={{ top: '2px' }} size="lg">
                                        <Button variant="outlined" startIcon={<ShoppingCartIcon />}>
                                            Giỏ hàng
                                        </Button>
                                    </Badge>
                                </Link>
                                <UserMenu userData={userData} listMenu={listMenu} />
                            </>
                        ) : (
                            <Link to="/login">
                                <Badge color="secondary" sx={{ top: '2px' }} size="lg">
                                    <Button variant="outlined" startIcon={<ShoppingCartIcon />}>
                                        Đăng nhập
                                    </Button>
                                </Badge>
                            </Link>
                        )}
                    </Stack>
                </Box>
            </Box>
        </>
    );
}

export default HeaderTop;
