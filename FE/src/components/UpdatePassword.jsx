import {
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import React, { useState, useContext } from 'react'
import SimpleSnackbar from './SimpleSnackbar'
import userService from '../services/userService'
import { userContext } from './Context'

function UpdatePassword(props) {
  const { loggedInUser } = useContext(userContext)

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [UpdatePasswordError, setUpdatePasswordError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setUpdatePasswordError('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (formData.newPassword.length < 6) {
      setUpdatePasswordError('Mật khẩu mới cần tối thiểu 6 ký tự!')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdatePasswordError('Nhập lại mật khẩu không trùng khớp!')
      return
    }

    const responseUpdate = await userService.updatePassword(
      loggedInUser.userData.id,
      formData.oldPassword,
      formData.newPassword
    )
    if (responseUpdate) {
      console.log(responseUpdate.message)
    }
  }

  const theme = useTheme()
  return (
    <Stack
      sx={{
        width: '100%',
        margin: '10px auto'
      }}>
      <SimpleSnackbar message={UpdatePasswordError} />
      <Stack
        sx={{
          margin: '0 auto',
          minHeight: '334px',
          width: '95%',
          borderRadius: '10px',
          padding: '10px 20px',
          boxShadow: theme.boxShadow.main
        }}>
        <Typography
          variant='h6'
          sx={{ color: theme.text.primary.main, fontWeight: 600 }}>
          Cập nhật mật khẩu
        </Typography>

        <Divider />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}>
          <Stack
            sx={{
              width: { xs: '70%', md: '40%' },
              margin: '20px auto',
              gap: '30px'
            }}>
            <TextField
              variant='filled'
              type='password'
              label='Mật khẩu cũ'
              name='oldPassword'
              size='small'
              onChange={handleChange}
              value={formData.oldPassword}
              sx={{
                '& .MuiInputBase-input': {
                  paddingRight: '35px'
                }
              }}
            />
            <TextField
              variant='filled'
              type='password'
              label='Mật khẩu mới'
              name='newPassword'
              size='small'
              onChange={handleChange}
              value={formData.newPassword}
              sx={{
                '& .MuiInputBase-input': {
                  paddingRight: '35px'
                }
              }}
            />
            <TextField
              variant='filled'
              type='password'
              label='Nhập lại mật khẩu mới'
              name='confirmPassword'
              size='small'
              onChange={handleChange}
              value={formData.confirmPassword}
              sx={{
                '& .MuiInputBase-input': {
                  paddingRight: '35px'
                }
              }}
            />
            <Button type='submit' variant='contained' color='success'>
              Cập nhật
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  )
}

export default UpdatePassword
