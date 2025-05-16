// src/components/ReservationQR.jsx
import React from 'react';
import QRCode from 'qrcode.react';
import { Box, Typography } from '@mui/material';

const ReservationQR = ({ reservationCode }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mã đặt chỗ: {reservationCode}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Đưa mã QR này cho thủ thư để tạo phiếu mượn
      </Typography>
      <QRCode value={reservationCode} size={200} />
    </Box>
  );
};

export default ReservationQR;