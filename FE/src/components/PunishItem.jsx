import { Stack, Typography, useTheme, Box } from '@mui/material'
import React from 'react'
import { formatCurrencyVN } from '../utils/formatCurrencyVN'

function PunishItem({ fine }) {
  const theme = useTheme()

  // Hàm tính số ngày quá hạn
  const daynow = () => {
    const today = new Date()
    const dueDate = new Date(fine.dueDate)
    const timeDiff = today - dueDate
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) // Chuyển từ ms sang ngày
    return dayDiff > 0 ? dayDiff : 0 // Nếu số ngày quá hạn là âm, trả về 0
  }

  return (
    <Stack
      sx={{
        padding: '12px 0',
        gap: '12px',
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
      <Stack
        sx={{
          border: `1px solid ${theme.palette.gray.main}`,
          borderRadius: '4px',
          padding: '12px',
          flexDirection: 'row'
        }}>
        <img
          src={fine.imgBook}
          alt='hinhanh'
          style={{
            width: '100px',
            height: 'auto',
            borderRadius: '4px',
            objectFit: 'cover'
          }}
        />
        <Stack
          sx={{
            marginLeft: '15px',
            gap: '8px',
            justifyContent: 'flex-start',
            flex: 1
          }}>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main,
                fontWeight: 500
              }}>
              Tên sách:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main
              }}>
              {fine.name}
            </Typography>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main,
                fontWeight: 500
              }}>
              Ngày trả dự kiến:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main
              }}>
              {new Date(fine.dueDate).toLocaleDateString()}
            </Typography>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main,
                fontWeight: 500
              }}>
              Số ngày quá hạn:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main
              }}>
              {daynow()}
            </Typography>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main,
                fontWeight: 500
              }}>
              Tổng phí phạt:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.palette.secondary.main
              }}>
              {formatCurrencyVN(fine.amount)}{' '}
              {/* Hiển thị phí phạt theo định dạng tiền tệ */}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default PunishItem
