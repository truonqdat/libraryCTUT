import React, { useState, useEffect } from 'react';
import { Divider, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  margin: '10px 0 0',
}));

function Profile() {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/profile', {
          headers: {
            token: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        console.log(response.data);
        
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin hồ sơ');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack sx={{ width: '100%', margin: '10px auto' }}>
      <Stack
        sx={{
          margin: '0 auto',
          minHeight: '334px',
          width: '95%',
          borderRadius: '10px',
          padding: '10px 20px',
          boxShadow: theme.boxShadow.main,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.text.primary.main, fontWeight: 600 }}>
          Hồ sơ độc giả
        </Typography>

        <Divider />
        <Stack sx={{ padding: '20px 10px' }}>
          <Stack sx={{ flexDirection: 'row' }}>
            <img
              src={
                userData?.avatar ||
                'https://static-media-cdn.mekongasean.vn/stores/news_dataimages/2024/102024/04/16/in_article/mark-zuckerberg-201920241004160735.jpg?rt=20241004160737'
              }
              alt="Avatar"
              style={{
                maxWidth: '200px',
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Stack sx={{ flex: 1, marginLeft: '50px' }}>
              <Typography variant="h6" sx={{ color: theme.text.primary.main, fontWeight: 600 }}>
                Thông tin học vấn
              </Typography>
              <Divider />
              <Stack sx={{ flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
                <Stack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Mã số sinh viên:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      {userData.studentCode}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Họ và tên:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      {userData.fullName}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Giới tính:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      {userData.gender || 'Nam'}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Ngày sinh:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      {userData.dateOfBirth
                        ? format(new Date(userData.dateOfBirth), 'dd/MM/yyyy')
                        : 'Chưa cập nhật'}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Số điện thoại:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      {userData.phoneNumber || 'Chưa cập nhật'}
                    </Typography>
                  </StyledStack>
                </Stack>

                <Stack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Trạng thái:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      {userData.profileCompleted ? 'Đang học' : 'Chưa hoàn thiện hồ sơ'}
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Bậc đào tạo:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      Đại học chính quy
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Khoa:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      Công nghệ thông tin
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Chuyên ngành:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
                      Kỹ thuật phần mềm
                    </Typography>
                  </StyledStack>
                  <StyledStack>
                    <Typography variant="subtitle2" sx={{ color: theme.text.primary.main }}>
                      Khóa đào tạo:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, marginLeft: '5px' }}>
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
  );
}

export default Profile;
