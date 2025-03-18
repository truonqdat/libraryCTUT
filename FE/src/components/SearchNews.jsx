import { useTheme } from '@emotion/react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Link } from 'react-router-dom';
import typeNewsServices from '../services/typeNewsServices';
import { SearchContext } from './News'

const SearchNews = (props) => {
  const theme = useTheme();
  const [listTypeNews, setListTypeNews] = React.useState([]);
  const [valueSearch, setValueSearch] = React.useState('');
  const { searchType, setSearchType, searchTitle, setSearchTitle, searchSort, setSearchSort } = React.useContext(SearchContext);

  React.useEffect(() => {
    const getTypeNews = async () => {
        const response = await typeNewsServices.getAllTypeNews();
        setListTypeNews(response);
    };
    getTypeNews();    
},[]);

const handleChangeSearchType = (event) => {
  setSearchType(event.target.value);
} 

const handleChangeSearchSort = (event) => {
  setSearchSort(event.target.value);
} 


const handleChangeSearchTitle = (event) => {
  setSearchTitle(event.target.value);
} 

  return (
    <Box
      width="95%"
      m="10px auto 0 auto"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      <FormControl sx={{ width: '150px' }} size="small" variant="standard">
        <InputLabel id="category-select-label">Loại tin</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={searchType}
          label="Loại tin"
          onChange={handleChangeSearchType}
          sx={{
            paddingLeft: '10px',
            color: theme.text.primary.main,
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.white.main,
                padding: '0',
                "&& .Mui-selected": {
                  bgcolor: theme.palette.white.main,
                  color: theme.palette.primary.main,
                },
              },
            },
          }}
        >
          <MenuItem key={0} value='' sx={{ fontSize: '14px' }}>
            Tất cả
          </MenuItem>
          {listTypeNews.map((item) => (
            <MenuItem key={item.id} value={item.id} sx={{ fontSize: '14px' }}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: '150px' }} size="small" variant="standard">
        <InputLabel id="category-select-label">Sắp xếp</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={searchSort}
          label="Sắp xếp"
          onChange={handleChangeSearchSort}
          sx={{
            paddingLeft: '10px',
            color: theme.text.primary.main,
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.white.main,
                padding: '0',
                "&& .Mui-selected": {
                  bgcolor: theme.palette.white.main,
                  color: theme.palette.primary.main,
                },
              },
            },
          }}
        >
            <MenuItem key='desc' value='desc' sx={{ fontSize: '14px' }}>
              Mới nhất
            </MenuItem>
            <MenuItem key='asc' value='asc' sx={{ fontSize: '14px' }}>
              Cũ nhất
            </MenuItem>
        </Select>
      </FormControl>
      <TextField
        value={searchTitle}
        id="search-input"
        label="Nhập từ khóa cần tìm kiếm"
        variant="standard"
        sx={{
          flex: 1,
          '& .MuiInput-input': {
            paddingLeft: '10px',
            color: theme.text.primary.main,
          },
        }}
        onChange={handleChangeSearchTitle}
      />
    </Box>
  );
};

export default SearchNews;