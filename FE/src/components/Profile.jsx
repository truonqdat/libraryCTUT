import React, { useContext } from 'react'
import { Divider, Stack, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material'
import { userContext } from './Context'
import { format } from 'date-fns'

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  margin: '10px 0 0'
}))

function Profile(props) {
  const { loggedInUser } = useContext(userContext)

  const theme = useTheme()
  return (
    <Stack
      sx={{
        width: '100%',
        margin: '10px auto'
      }}>
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
          Hồ sơ độc giả
        </Typography>

        <Divider />
        <Stack
          sx={{
            padding: '20px 10px'
          }}>
          {/* Ảnh đại diện và thông tin học vấn*/}
          <Stack
            sx={{
              flexDirection: 'row'
            }}>
            <img
              src='https://static-media-cdn.mekongasean.vn/stores/news_dataimages/2024/102024/04/16/in_article/mark-zuckerberg-201920241004160735.jpg?rt=20241004160737'
              alt=''
              style={{
                maxWidth: '200px',
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <Stack
              sx={{
                flex: 1,
                marginLeft: '50px'
              }}>
              <Typography
                variant='h6'
                sx={{ color: theme.text.primary.main, fontWeight: 600 }}>
                Thông tin học vấn
              </Typography>
              <Divider />
              {/* Stack chứa các trường thông tin */}
              <Stack
                sx={{
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between'
                }}>
                <Stack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Mã số sinh viên:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px',
                        textTransform: 'uppercase'
                      }}>
                      {loggedInUser.userData.studentCode}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Họ và tên:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px',
                        textTransform: 'capitalize'
                      }}>
                      {loggedInUser.userData.fullName}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Giới tính:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      Nam
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Ngày sinh:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      {format(
                        new Date(loggedInUser.userData.dateOfBirth),
                        'dd/MM/yyyy'
                      )}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Lớp học:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      KTPM0121
                    </Typography>
                  </StyledStack>
                </Stack>
                <Stack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Trạng thái:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      Đang học
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Bậc đào tạo:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      Đại học chính quy
                    </Typography>
                  </StyledStack>

                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Khoa:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      Công nghệ thông tin
                    </Typography>
                  </StyledStack>

                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Chuyên ngành:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      Kỹ thuật phần mềm
                    </Typography>
                  </StyledStack>

                  <StyledStack>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: theme.text.primary.main
                      }}>
                      Khóa đào tạo:{' '}
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: theme.text.primary.main,
                        marginLeft: '5px'
                      }}>
                      2021
                    </Typography>
                  </StyledStack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Profile
