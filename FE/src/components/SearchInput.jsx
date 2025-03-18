import { useTheme } from '@emotion/react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Link } from 'react-router-dom';

const SearchInput = (props) => {
  const theme = useTheme();
  const [optionSearch, setOptionSearch] = React.useState('');
  const [valueSearch, setValueSearch] = React.useState('');

  const handleChangeOptionSearch = (event) => setOptionSearch(event.target.value);
  const handleChangeValueSearch = (event) => setValueSearch(event.target.value);

  const menuItems = [
    { value: 'sach', label: 'Sách' },
    { value: 'tacgia', label: 'Tác giả' },
    { value: 'theloai', label: 'Thể loại' },
    { value: 'namxuatban', label: 'Năm xuất bản' },
    { value: 'nhaxuatban', label: 'Nhà xuất bản' },
  ];

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
        <InputLabel id="category-select-label">Danh mục</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={optionSearch}
          label="Danh mục"
          onChange={handleChangeOptionSearch}
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
          {menuItems.map((item) => (
            <MenuItem key={item.value} value={item.value} sx={{ fontSize: '14px' }}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        value={valueSearch}
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
        onChange={handleChangeValueSearch}
      />

      <Link to={`/tim-kiem?danhmuc=${optionSearch}&tukhoa=${valueSearch}`} style={{ textDecoration: 'none' }}>
        <Button variant="contained" sx={{ fontFamily: 'Arial', textTransform: 'unset' }}>
          <ManageSearchIcon sx={{ mr: '5px' }} />
          Tìm kiếm
        </Button>
      </Link>
    </Box>
  );
};

export default SearchInput;