import { Box, Grid2, Stack, Typography } from '@mui/material'
import React from 'react'
import BookCard from './BookCard'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'

function CategoryBook(props) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '95%',
        margin: '10px auto',
        minHeight: '515px'
      }}>
      <Stack
        sx={{
          bgcolor: theme.palette.primary.main,
          mb: '10px',
          borderRadius: '5px'
        }}>
        {props.isHomePage
          ? props.title && (
              <Typography
                sx={{
                  padding: '10px 20px',
                  textTransform: 'unset',
                  fontWeight: 600
                }}>
                <Link to={props.linkTo} style={{color: '#fff'}}>{props.title}</Link>
              </Typography>
            )
          : props.title && (
              <Typography
                sx={{
                  padding: '10px 20px',
                  color: theme.palette.white.main,
                  textTransform: 'unset',
                  fontWeight: 600
                }}>
                {props.title}
              </Typography>
            )}
      </Stack>

      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 5, sm: 8, md: 12 }}>
        {props.isHomePage
          ? props.bookList.slice(0, 6).map((books, index) => (
              <Grid2 key={index} size={{ xs: 5, sm: 4, md: 4 }}>
                <BookCard data={books} />
              </Grid2>
            ))
          : props.bookList.slice(props.start, props.end).map((books, index) => (
              <Grid2 key={index} size={{ xs: 5, sm: 4, md: 4 }}>
                <BookCard data={books} />
              </Grid2>
            ))}
      </Grid2>
    </Box>
  )
}

export default CategoryBook
