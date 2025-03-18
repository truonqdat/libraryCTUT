import { Divider, Stack, Typography, useTheme, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import React from 'react';
import PunishItem from './PunishItem';
import { userContext } from './Context';
import fineService from "../services/fineService";

function Punish() {
  const theme = useTheme();
  const [fine, setFine] = React.useState([]);
  const [error, setError] = React.useState(null);
  const { loggedInUser } = React.useContext(userContext);

  // Hàm lấy dữ liệu phí phạt
  const fetchFines = async () => {
    try {
      const response = await fineService.getFines(loggedInUser.userData.id);
      setFine(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phí phạt:", err);
      setError("Không thể tải danh sách phí phạt.");
    }
  };

  // Lấy dữ liệu khi component mount
  React.useEffect(() => {
    if (loggedInUser?.userData?.id) {
      fetchFines();
    }
  }, [loggedInUser]);

  return (
    <Stack
      sx={{
        width: '100%',
        margin: '10px auto',
      }}
    >
      <Stack
        sx={{
          margin: '0 auto',
          width: '95%',
          borderRadius: '10px',
          padding: '10px 20px',
          boxShadow: theme.boxShadow.main,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.text.primary.main, fontWeight: 600 }}
        >
          Thông tin phí phạt
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {error ? (
          <Typography sx={{ color: theme.palette.error.main }}>
            {error}
          </Typography>
        ) : fine.length > 0 ? (
          fine.map((item, index) => (
            <PunishItem key={index} fine={item} />
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 2,
              backgroundColor: theme.palette.background.default,
              borderRadius: 2,
            }}
          >
            <InfoIcon sx={{ fontSize: 50, color: theme.palette.text.secondary }} />
            <Typography
              sx={{
                marginTop: 1,
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
              }}
            >
              Không có Phiếu phạt nào
            </Typography>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default Punish;
