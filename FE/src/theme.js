import { createTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          // blue
          main: '#005ac7',
          light: '#00c0ff',
          dark: '#015bb0'
        },
        secondary: {
          // red
          main: '#ff0000',
          light: '#f74e4e',
          dark: '#920000'
        },
        gray: {
          main: '#e0e0de'
        },
        white: {
          main: '#ffffff',
          light: '#fff5ce'
        },
        black: {
          main: '#333333'
        },
        yellow: {
          main: '#ffab20', // vàng
          light: '#FFFACD', // vàng nhạt
          dark: '#B8860B' // vàng đậm
        },
        orange: {
          main: '#ff5100', // cam
          light: '#ff7300', // cam nhạt
          dark: '#b23800' // cam đậm
        }
      },
      backgroundColor: {
        primary: {
          main: '#f3f4f4'
        }
      },
      text: {
        primary: {
          main: '#757574'
        }
      },
      boxShadow: {
        main: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        hover:
          'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px'
        // hover: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
        // hover: `rgba(3, 102, 214, 0.3) 0px 0px 0px 3px`,
      }
    }
    // dark: {
    //     palette: {
    //         primary: {
    //             // white
    //             light: '#FFFFFF',DF
    //             main: '#E3E4E4',
    //             dark: '#C2C2C2',
    //             backgroundColor: '#454c5a',
    //         },
    //         secondary: {
    //             light: '#ff7961',
    //             main: '#E3E4E4',
    //             dark: '#ba000d',
    //             backgroundColor: '#454c5a',
    //         },
    //     },
    // },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
})

export default theme
