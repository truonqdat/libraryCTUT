import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

function ContactItem(props) {
  const theme = useTheme()
  return (
    <Stack
      sx={{
        padding: '10px 0',
        gap: '10px',
        position: 'relative',
      }}
    >

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
            transform: 'scale(1.01)',
          }
        }}
      >
        <img
          src={props.book.imageUrl}
          alt="hinhanh"
          style={{
            width: '100px',
            aspectRatio: '1',
            borderRadius: '5px'
          }}
        />
        <Stack
          sx={{
            marginLeft: '15px',
            gap: '5px',
            justifyContent: 'flex-start',
            width: 'calc(100% -115px)',
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main
              }}
            >Tiêu đề phản hồi:</Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main,
                maxWidth: '50%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >{props.book.title}</Typography>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main
              }}
            >Nội dung phản hồi:</Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main,
                maxWidth: '80%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >{props.book.content}</Typography>
          </Stack>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Typography
              variant='subtitle2'
              sx={{
                color: theme.text.primary.main
              }}
            >Thời gian gửi phản hồi:</Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginLeft: '5px',
                fontWeight: 600,
                color: theme.text.primary.main,
              }}
            >{props.book.timeSend}</Typography>
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
  );
}

export default ContactItem;