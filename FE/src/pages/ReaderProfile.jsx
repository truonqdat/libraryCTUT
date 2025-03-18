import React, { useContext } from 'react'
import HeaderPage from '../components/HeaderPage'
import { Box, Stack, Button, Typography } from '@mui/material'
import SideBar from '../components/SideBar'
import HomeIcon from '@mui/icons-material/Home'
import FeedIcon from '@mui/icons-material/Feed'
import MoneyIcon from '@mui/icons-material/Money'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PasswordIcon from '@mui/icons-material/Password'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BookIcon from '@mui/icons-material/Book';
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { userContext } from '../components/Context'

const menuItems = [
  {
    link: '/ho-so-doc-gia',
    text: 'Hồ sơ độc giả',
    icon: <HomeIcon fontSize='medium' />
  },
  {
    link: '/ho-so-doc-gia/lich-su-muon',
    text: 'Lịch sử mượn sách',
    icon: <FeedIcon fontSize='medium' />
  },
  {
    link: '/ho-so-doc-gia/phi-phat',
    text: 'Thông tin phí phạt',
    icon: <MoneyIcon fontSize='medium' />
  },
  {
    link: '/ho-so-doc-gia/yeu-thich',
    text: 'Sách yêu thích',
    icon: <BookIcon fontSize='medium' />
  },
  {
    link: '/ho-so-doc-gia/cap-nhat-mat-khau',
    text: 'Cập nhật mật khẩu',
    icon: <PasswordIcon fontSize='medium' />
  }
]

function ReaderProfile(props) {
  const { loggedInUser } = useContext(userContext)
  return (
    <div>
      <HeaderPage />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0 auto',
          width: '90%'
        }}>
        {loggedInUser.auth ? (
          <>
            <Stack>
              <SideBar menuItems={menuItems} />
            </Stack>
            <Outlet />
          </>
        ) : (
          <Stack
            sx={{
              p: '30px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
            <Typography variant='h6' sx={{ fontWeight: 500, mb: '10px' }}>
              Vui lòng đăng nhập để sử dụng chức năng này
            </Typography>
            <Link
              to={'/dang-nhap'}
              sx={{ display: { xs: 'none', md: 'block' } }}>
              <Button variant='contained' color='error'>
                Đăng nhập
              </Button>
            </Link>
          </Stack>
        )}
      </Box>
    </div>
  )
}

export default ReaderProfile
