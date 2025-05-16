import React, { useEffect, useState } from "react";
import DataTable from "../../DataTable/DataTable";
import AdminModal from "../../AdminModal/AdminModal";
import {
  TextField,
  Snackbar,
  Alert,
  Button,
  Tab,
  Tabs,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Visibility,
  CheckCircle,
  Cancel,
  Done,
  Close,
} from "@mui/icons-material";
import ReservationService from "../../../services/reservationService";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "Pending", label: "Đang chờ" },
  { value: "Approved", label: "Đã phê duyệt" },
  { value: "Rejected", label: "Bị từ chối" },
  { value: "Completed", label: "Hoàn thành" },
  { value: "Cancelled", label: "Đã hủy" },
];

export default function ReservationAdmin() {
  const [reservations, setReservations] = useState([]);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem("accessToken");

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const filters = statusFilter ? { status: statusFilter } : {};
      const response = await ReservationService.getAllReservations(
        access_token,
        filters
      );
      console.log("aaaaaa",reservations);

      const reservationsData = response.data.map((reservation, index) => ({
        id: reservation._id,
        displayId: index + 1,
        user: reservation.userId?.fullName || "Unknown",
        reservationCode: reservation.reservationCode,
        status: reservation.status,
        createdAt: new Date(reservation.requestDate).toLocaleDateString(),
        reason: reservation.reason || "",
        books: reservation.books?.map((copy, index) => ({
          id: copy.bookId._id,
          displayId: index + 1,
          title: copy.bookId.title,
          author: copy.bookId.author,
          barcode: copy.barcode,
          coverImage: copy.bookId.coverImage,
          description: copy.bookId.description,
          publishedYear: copy.bookId.publishedYear,
        })),
      }));
      setReservations(reservationsData);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setNotification({
        open: true,
        message: "Lỗi khi tải danh sách yêu cầu",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleAction = async (action, reservationId, reason = null) => {
    try {
      let message;
      switch (action) {
        case "approve":
          await ReservationService.approveReservation(
            access_token,
            reservationId
          );
          message = "Yêu cầu đã được phê duyệt!";
          break;
        case "reject":
          if (!reason.trim()) {
            setNotification({
              open: true,
              message: "Vui lòng cung cấp lý do từ chối!",
              severity: "error",
            });
            return;
          }
          await ReservationService.rejectReservation(
            access_token,
            reservationId,
            reason
          );
          message = "Yêu cầu đã bị từ chối!";
          break;
        case "complete":
          await ReservationService.completeReservation(
            access_token,
            reservationId
          );
          message = "Yêu cầu đã hoàn thành!";
          break;
        case "cancel":
          await ReservationService.cancelReservation(
            access_token,
            reservationId
          );
          message = "Yêu cầu đã bị hủy!";
          break;
        default:
          throw new Error("Hành động không hợp lệ");
      }
      setNotification({ open: true, message, severity: "success" });
      fetchReservations();
      if (action === "reject") {
        handleRejectClose();
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || `Lỗi khi thực hiện ${action}!`,
        severity: "error",
      });
    }
  };

  const handleViewOpen = (reservation) => {
    setCurrentReservation(reservation);
    setOpenView(true);
    setTabValue(0);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setCurrentReservation(null);
  };

  const handleRejectOpen = (reservation) => {
    setCurrentReservation(reservation);
    setOpenReject(true);
    setRejectReason("");
  };

  const handleRejectClose = () => {
    setOpenReject(false);
    setCurrentReservation(null);
    setRejectReason("");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const columns = [
    { field: "displayId", headerName: "STT", width: 70 },
    {
      field: "reservationCode",
      headerName: "Mã yêu cầu",
      width: 250,
    },
    { field: "user", headerName: "Người Dùng", width: 200 },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 150,
      renderCell: (params) => {
        const status = params.value;
        const color =
          status === "Pending"
            ? "warning"
            : status === "Approved"
            ? "success"
            : status === "Rejected"
            ? "error"
            : status === "Completed"
            ? "info"
            : "default";
        return (
          <Typography color={`${color}.main`} sx={{ padding: "12px 0" }}>
            {statusOptions.find((s) => s.value === status)?.label || status}
          </Typography>
        );
      },
    },
    { field: "createdAt", headerName: "Ngày Tạo", width: 150 },
  ];

  console.log(currentReservation);

  return (
    <div>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo trạng thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Lọc theo trạng thái"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataTable
        title="Quản Lý Yêu Cầu Đặt Sách"
        rows={reservations}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
        loading={loading}
        showLockIcon={false}
        showEditIcon={false}
        showAddIcon={false}
        onView={handleViewOpen}
      />

      {/* Modal xem chi tiết */}
      <AdminModal
        showEdit={false}
        open={openView}
        onClose={handleViewClose}
        title={`Thông Tin Yêu Cầu: ${currentReservation?.user || ""}`}
        minWidth="800px"
        minHeight="500px"
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Thông tin yêu cầu" />
              <Tab label="Danh sách sách" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TextField
              margin="dense"
              label="Mã Yêu Cầu"
              type="text"
              fullWidth
              value={currentReservation?.reservationCode || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Người Dùng"
              type="text"
              fullWidth
              value={currentReservation?.user || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Trạng Thái"
              type="text"
              fullWidth
              value={
                statusOptions.find(
                  (s) => s.value === currentReservation?.status
                )?.label ||
                currentReservation?.status ||
                ""
              }
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Ngày Tạo"
              type="text"
              fullWidth
              value={currentReservation?.createdAt || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            {currentReservation?.reason && (
              <TextField
                margin="dense"
                label="Lý Do Từ Chối"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={currentReservation.reason}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            )}
            {/* Nút hành động */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              {currentReservation?.status === "Pending" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleAction("approve", currentReservation.id)}
                  >
                    Phê duyệt
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => handleRejectOpen(currentReservation)}
                  >
                    Từ chối
                  </Button>
                </>
              )}
              {currentReservation?.status === "Approved" && (
                <>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<Done />}
                    onClick={() => handleAction("complete", currentReservation.id)}
                  >
                    Hoàn thành
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Close />}
                    onClick={() => handleAction("cancel", currentReservation.id)}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {currentReservation?.books?.map((book, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{book.title}</Typography>
                    <Typography variant="body2">Mã sách: {book.barcode}</Typography>
                  </Box>
                </Box>
              ))}
              {(!currentReservation?.books ||
                currentReservation.books.length === 0) && (
                <Typography>Không có sách trong yêu cầu</Typography>
              )}
            </Box>
          </TabPanel>
        </Box>
      </AdminModal>

      {/* Modal từ chối yêu cầu */}
      <AdminModal
        open={openReject}
        onClose={handleRejectClose}
        title="Từ Chối Yêu Cầu"
        onSave={() =>
          handleAction("reject", currentReservation?.id, rejectReason)
        }
      >
        <TextField
          autoFocus
          margin="dense"
          label="Lý Do Từ Chối"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          required
        />
      </AdminModal>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}