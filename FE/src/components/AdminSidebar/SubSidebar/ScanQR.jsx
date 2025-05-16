// src/components/ScanQR.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from '@mui/material';
import BorrowRecordService from '../../../services/borrowRecordService';

const ScanQR = ({ open, onClose, onScan }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const access_token = localStorage.getItem('accessToken');

  useEffect(() => {
    console.log('ScanQR modal open:', open);
    if (open) {
      codeReaderRef.current = new BrowserMultiFormatReader();

      const startScanner = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());

          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const deviceId = videoDevices.length > 0 ? videoDevices[0].deviceId : null;

          if (!deviceId) {
            throw new Error('Không tìm thấy thiết bị video');
          }

          codeReaderRef.current.decodeFromVideoDevice(deviceId, videoRef.current, async (result, err) => {
            if (result) {
              const scannedCode = result.getText();
              setScanResult(scannedCode);
              try {
                // Check if scanned code is a reservation code (e.g., starts with "RES")
                if (scannedCode.startsWith('RES')) {
                  const response = await BorrowRecordService.createFromReservation(scannedCode, access_token);
                  onScan({ type: 'reservation', data: response });
                } else {
                  // Assume it's a barcode
                  onScan({ type: 'barcode', data: scannedCode });
                }
              } catch (error) {
                setError(error.message || 'Lỗi khi xử lý mã quét');
              }
            }
            if (err && err.name !== 'NotFoundException') {
              console.error('Scanning error:', err);
              setError('Lỗi khi quét mã: ' + err.message);
            }
          });
        } catch (error) {
          console.error('Error starting scanner:', error);
          setError(
            error.name === 'NotAllowedError'
              ? 'Vui lòng cấp quyền truy cập camera'
              : error.message || 'Không thể khởi động máy quét'
          );
          onScan(null);
        }
      };

      startScanner();

      return () => {
        if (codeReaderRef.current) {
          codeReaderRef.current.reset();
          codeReaderRef.current = null;
        }
      };
    }
  }, [open, onScan, access_token]);

  const handleClose = () => {
    setScanResult(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quét Mã QR/Barcodes</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <video ref={videoRef} style={{ width: '100%', maxHeight: '300px' }} />
          {scanResult && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <Typography variant="subtitle1">Mã đã quét:</Typography>
              <Typography variant="body2">{scanResult}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScanQR;