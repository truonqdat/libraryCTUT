import React, { useEffect, useState } from 'react';
import DataTable from '../../DataTable/DataTable';
import AdminModal from '../../AdminModal/AdminModal';
import { 
  TextField, 
  Snackbar, 
  Alert,
  Button 
} from '@mui/material';
import FacultyService from '../../../services/facultyService';

export default function FacultyAdmin() {
  const [faculties, setFaculties] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [notification, setNotification] = useState('');
  const [openView, setOpenView] = useState(false);
  const access_token = localStorage.getItem('access_token');

  const fetchFaculties = async () => {
    try {
      const response = await FacultyService.getAllFaculties(access_token);
      const facultiesData = response.map((faculty, index) => ({
        id: faculty._id,
        displayId: index + 1,
        name: faculty.name,
        description: faculty.description,
        createdAt: new Date(faculty.createdAt).toLocaleDateString(),
      }));
      setFaculties(facultiesData);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleEditOpen = (faculty) => {
    setCurrentFaculty(faculty);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentFaculty(null);
  };

  const handleAddOpen = () => {
    setCurrentFaculty({
      name: '',
      description: '',
    });
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleSave = async () => {
    if (currentFaculty) {
      try {
        await FacultyService.updateFaculty(
          currentFaculty.id,
          {
            name: currentFaculty.name,
            description: currentFaculty.description,
          },
          access_token
        );
        setNotification('Khoa đã được cập nhật thành công!');
        await fetchFaculties();
        handleEditClose();
      } catch (error) {
        console.error('Error updating faculty:', error);
        setNotification('Có lỗi xảy ra khi cập nhật khoa.');
      }
    }
  };

  const handleAdd = async () => {
    if (currentFaculty) {
      try {
        await FacultyService.createFaculty(
          {
            name: currentFaculty.name,
            description: currentFaculty.description,
          },
          access_token
        );
        setNotification('Khoa đã được thêm thành công!');
        await fetchFaculties();
        handleAddClose();
      } catch (error) {
        console.error('Error adding faculty:', error);
        setNotification('Có lỗi xảy ra khi thêm khoa.');
      }
    }
  };

  const handleViewOpen = (faculty) => {
    setCurrentFaculty(faculty);
    setOpenView(true);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setCurrentFaculty(null);
  };

  const handleNotificationClose = () => {
    setNotification('');
  };

  const columns = [
    { field: 'displayId', headerName: 'STT', width: 70 },
    { field: 'name', headerName: 'Tên Khoa', width: 200 },
    { field: 'description', headerName: 'Mô Tả', width: 300 },
    { field: 'createdAt', headerName: 'Ngày Tạo', width: 150 },
  ];

  return (
    <div>
      <DataTable
        title="Quản Lý Khoa"
        rows={faculties}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
        onAdd={handleAddOpen}
        onEdit={handleEditOpen}
        onView={handleViewOpen}
        showLockIcon={false}
      />

      {/* Modal xem chi tiết */}
      <AdminModal showEdit={false} open={openView} onClose={handleViewClose} title="Thông Tin Khoa">
        <TextField
          margin="dense"
          label="Tên Khoa"
          type="text"
          fullWidth
          value={currentFaculty?.name || ''}
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
          value={currentFaculty?.description || ''}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Ngày Tạo"
          type="text"
          fullWidth
          value={currentFaculty?.createdAt || ''}
          InputProps={{
            readOnly: true,
          }}
        />
      </AdminModal>

      {/* Modal chỉnh sửa */}
      <AdminModal open={openEdit} onClose={handleEditClose} title={'Chỉnh sửa khoa'} onSave={handleSave}>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Khoa"
          type="text"
          fullWidth
          value={currentFaculty?.name || ''}
          onChange={(e) => setCurrentFaculty({ ...currentFaculty, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Mô Tả"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={currentFaculty?.description || ''}
          onChange={(e) => setCurrentFaculty({ ...currentFaculty, description: e.target.value })}
        />
      </AdminModal>

      {/* Modal thêm mới */}
      <AdminModal open={openAdd} onClose={handleAddClose} title={'Thêm khoa'} onSave={handleAdd}>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Khoa"
          type="text"
          fullWidth
          onChange={(e) => setCurrentFaculty({ ...currentFaculty, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Mô Tả"
          type="text"
          fullWidth
          multiline
          rows={4}
          onChange={(e) => setCurrentFaculty({ ...currentFaculty, description: e.target.value })}
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