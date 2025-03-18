import { Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import { format } from 'date-fns'

const formatRequestStatus = (status) => {
  switch (status) {
    case 1:
      return 'Chờ xét duyệt'
    case 2:
      return 'Đang mượn'
    case 3:
      return 'Đã trả'
    case 4:
      return 'Quá hạn'
    default:
      return 'Không xác định'
  }
}

function RentItem(props) {
  const theme = useTheme()
  return (
    <Stack
      sx={{
        padding: '10px 0',
        gap: '10px',
        position: 'relative'
      }}>
      <Stack
        sx={{
          border: `1px solid ${theme.palette.gray.main}`,
          borderRadius: '5px',
          padding: '10px',
          flexDirection: 'row',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          '&:hover': {
            boxShadow: theme.boxShadow.main,
            transform: 'scale(1.01)'
          }
        }}>
        <img
          src={props.book.book.imgBook}
          alt='hinhanh'
          style={{
            width: '100px',
            aspectRatio: '6 / 9',
            borderRadius: '5px'
          }}
        />
        <Stack
          sx={{
            marginLeft: '15px',
            gap: '5px',
            justifyContent: 'flex-start'
          }}>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main
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
              {props.book.book.name}
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
                color: theme.text.primary.main
              }}>
              Ngày mượn:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main
              }}>
              {format(new Date(props.book.createdAt), 'dd/MM/yyyy, HH:mm')}
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
                color: theme.text.primary.main
              }}>
              Ngày trả:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main
              }}>
              {props.book.dayReturn
                ? format(new Date(props.book.dayReturn), 'dd/MM/yyyy, HH:mm')
                : 'Chưa xác định'}
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
                color: theme.text.primary.main
              }}>
              Trạng thái yêu cầu mượn:
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color:
                  props.book.status === 4
                    ? theme.palette.secondary.main
                    : theme.text.primary.main
              }}>
              {formatRequestStatus(props.book.status)}
            </Typography>
          </Stack>
        </Stack>
        {/* <Button variant='contained' color="error" size="small"
          sx={{
            position: 'absolute',
            right: '20px',
            bottom: '30px',
          }}
        >Hủy mượn</Button> */}
      </Stack>
    </Stack>
  )
}

export default RentItem
