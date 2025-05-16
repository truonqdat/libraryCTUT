import * as React from 'react';
import DataTable from '../../DataTable/DataTable';
import AdminModal from '../../AdminModal/AdminModal';
import {
  Grid,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import CategoryService from '../../../services/categoryService.js';

export default function CategoryAdmin() {
  const [categories, setCategories] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState(null);
  const [notification, setNotification] = React.useState('');
  const [openView, setOpenView] = React.useState(false);
  const access_token = localStorage.getItem('access_token');

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories(access_token);
      console.log(response);
      
      const categoriesData = response.map((category, index) => ({
        id: category._id,
        displayId: index + 1,
        name: category.name,
        description: category.description,
        createdAt: new Date(category.createdAt).toLocaleDateString(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditOpen = (category) => {
    setCurrentCategory(category);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentCategory(null);
  };

  const handleAddOpen = () => {
    setCurrentCategory({
      name: '',
      description: '',
    });
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleSave = async () => {
    if (currentCategory) {
      try {
        await CategoryService.updateCategory(
          currentCategory.id,
          {
            name: currentCategory.name,
            description: currentCategory.description,
          },
          access_token
        );
        setNotification('Danh mục đã được cập nhật thành công!');
        await fetchCategories();
        handleEditClose();
      } catch (error) {
        console.error('Error updating category:', error);
        setNotification('Có lỗi xảy ra khi cập nhật danh mục.');
      }
    }
  };

  const handleAdd = async () => {
    if (currentCategory) {
      try {
        await CategoryService.createCategory(
          {
            name: currentCategory.name,
            description: currentCategory.description,
          },
          access_token
        );
        setNotification('Danh mục đã được thêm thành công!');
        await fetchCategories();
        handleAddClose();
      } catch (error) {
        console.error('Error adding category:', error);
        setNotification('Có lỗi xảy ra khi thêm danh mục.');
      }
    }
  };

  const handleViewOpen = (category) => {
    setCurrentCategory(category);
    setOpenView(true);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setCurrentCategory(null);
  };

  const handleNotificationClose = () => {
    setNotification('');
  };

  const columns = [
    { field: 'displayId', headerName: 'STT', width: 70 },
    { field: 'name', headerName: 'Tên Danh Mục', width: 200 },
    { field: 'description', headerName: 'Mô Tả', width: 300 },
    { field: 'createdAt', headerName: 'Ngày Tạo', width: 150 },
  ];

  return (
    <div>
      <DataTable
        title="Quản Lý Danh Mục"
        rows={categories}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
        onAdd={handleAddOpen}
        onEdit={handleEditOpen}
        onView={handleViewOpen}
        showLockIcon={false}
      />

      {/* Modal xem chi tiết danh mục */}
      <AdminModal showEdit={false} open={openView} onClose={handleViewClose} title="Thông Tin Danh Mục">
        <TextField
          margin="dense"
          label="Tên Danh Mục"
          type="text"
          fullWidth
          value={currentCategory?.name || ''}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Mô Tả"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={currentCategory?.description || ''}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Ngày Tạo"
          type="text"
          fullWidth
          value={currentCategory?.createdAt || ''}
          InputProps={{
            readOnly: true,
          }}
        />
      </AdminModal>

      {/* Modal chỉnh sửa danh mục */}
      <AdminModal open={openEdit} onClose={handleEditClose} title={'Chỉnh sửa danh mục'} onSave={handleSave}>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Danh Mục"
          type="text"
          fullWidth
          value={currentCategory?.name || ''}
          onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Mô Tả"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={currentCategory?.description || ''}
          onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
        />
      </AdminModal>

      {/* Modal thêm danh mục */}
      <AdminModal open={openAdd} onClose={handleAddClose} title={'Thêm danh mục'} onSave={handleAdd}>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Danh Mục"
          type="text"
          fullWidth
          onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Mô Tả"
          type="text"
          fullWidth
          multiline
          rows={4}
          onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
        />
      </AdminModal>

      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleNotificationClose} severity="success">
          {notification}
        </Alert>
      </Snackbar>
    </div>
  );
}