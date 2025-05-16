import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DataTable from "../../DataTable/DataTable";
import UserService from "../../../services/userService";
import { Edit, LockReset, Delete } from "@mui/icons-material";

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const access_token = localStorage.getItem("accessToken");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers(access_token);
      const formattedUsers = response.data.map((user) => ({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        studentCode: user.studentCode,
        role: user.role || "user",
        profileCompleted: user.profileCompleted
          ? "Đã hoàn thành"
          : "Chưa hoàn thành",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      setNotification({
        open: true,
        message: "Lỗi khi tải danh sách người dùng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDialogOpen = (user = null) => {
    setCurrentUser(
      user || {
        email: "",
        fullName: "",
        studentCode: "",
        role: "user",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
      }
    );
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      if (currentUser.id) {
        // Update existing user
        await UserService.updateUserProfile(access_token, currentUser.id, {
          phoneNumber: currentUser.phoneNumber,
          dateOfBirth: currentUser.dateOfBirth,
          gender: currentUser.gender,
        });
        setNotification({
          open: true,
          message: "Cập nhật thông tin người dùng thành công!",
          severity: "success",
        });
      }
      fetchUsers();
      handleDialogClose();
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Lỗi khi cập nhật người dùng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      setLoading(true);
      // Call API to reset password
      // await UserService.resetPassword(access_token, userId);
      setNotification({
        open: true,
        message: "Đã gửi yêu cầu đặt lại mật khẩu!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Lỗi khi đặt lại mật khẩu",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      // Call API to delete user
      // await UserService.deleteUser(access_token, userId);
      setNotification({
        open: true,
        message: "Đã xóa người dùng thành công!",
        severity: "success",
      });
      fetchUsers();
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Lỗi khi xóa người dùng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const columns = [
    { field: "studentCode", headerName: "Mã số", width: 120 },
    { field: "fullName", headerName: "Họ tên", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "role",
      headerName: "Vai trò",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === "admin" ? "Quản trị" : "Người dùng"}
          color={params.value === "admin" ? "primary" : "default"}
        />
      ),
    },
    {
      field: "profileCompleted",
      headerName: "Hồ sơ",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Đã hoàn thành" ? "success" : "warning"}
        />
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === "active" ? "Hoạt động" : "Vô hiệu hóa"}
          color={params.value === "active" ? "success" : "error"}
        />
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Quản Lý Người Dùng"
        rows={filteredUsers}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
        showAddIcon={false}
        showEditIcon={false}
      />

      {/* User Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentUser?.id ? "Chi tiết người dùng" : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <Box sx={{ mt: 2 }}>
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={currentUser.email}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Họ và tên"
                fullWidth
                value={currentUser.fullName}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Mã số"
                fullWidth
                value={currentUser.studentCode}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Số điện thoại"
                fullWidth
                value={currentUser.phoneNumber || ""}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    phoneNumber: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Ngày sinh"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentUser.dateOfBirth || ""}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    dateOfBirth: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={currentUser.gender || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, gender: e.target.value })
                  }
                  label="Giới tính"
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Đóng</Button>
          {currentUser?.id && (
            <>
              <Button
                color="warning"
                startIcon={<LockReset />}
                onClick={() => handleResetPassword(currentUser.id)}
              >
                Đặt lại MK
              </Button>
              <Button
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDeleteUser(currentUser.id)}
              >
                Xóa
              </Button>
            </>
          )}
          <Button color="primary" onClick={handleUpdateUser} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification?.open}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert severity={notification?.severity}>{notification?.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserAdmin;
