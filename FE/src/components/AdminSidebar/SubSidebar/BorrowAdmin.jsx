import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel, Done, Close } from "@mui/icons-material";
import BorrowRecordService from "../../../services/borrowRecordService";
import DataTable from "../../DataTable/DataTable";
import AdminModal from "../../AdminModal/AdminModal";
import ScanQR from "./ScanQR";

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
  { value: "Borrowed", label: "Đang mượn" },
  { value: "Returned", label: "Đã trả" },
  { value: "Overdue", label: "Quá hạn" },
  { value: "Lost", label: "Mất" },
];

const BorrowRecordAdmin = ({ userId = "defaultUserId" }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openScanner, setOpenScanner] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [manualCodeError, setManualCodeError] = useState("");
  const [isProcessingCode, setIsProcessingCode] = useState(false);
  const access_token = localStorage.getItem("accessToken");

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const filters = statusFilter ? { status: statusFilter } : {};
      const response = await BorrowRecordService.getAllRecords(filters);
      const formattedRecords = response.map((record, index) => ({
        id: record._id,
        displayId: index + 1,
        user: record.userId?.fullName || "Unknown",
        booksCount: record.books.length,
        status: record.status,
        dueDate: new Date(record.books[0]?.dueDate).toLocaleDateString(),
        createdAt: new Date(record.createdAt).toLocaleDateString(),
        books: record.books.map((book, idx) => ({
          id: book.bookId?._id || idx,
          displayId: idx + 1,
          title: book.bookId?.title || "Unknown",
          barcode: book.barcode,
          status: book.status || "Borrowed",
        })),
      }));
      setRecords(formattedRecords);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Không thể tải danh sách phiếu mượn",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleViewOpen = (record) => {
    setCurrentRecord(record);
    setOpenView(true);
    setTabValue(0);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setCurrentRecord(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleScanResult = async (result) => {
    setOpenScanner(false);
    if (!result) {
      setNotification({
        open: true,
        message: "Không tìm thấy mã nào được quét",
        severity: "warning",
      });
      return;
    }

    try {
      if (result.type === "reservation") {
        setNotification({
          open: true,
          message: `Đã tạo phiếu mượn từ mã đặt chỗ #${result.data.reservationCode}`,
          severity: "success",
        });
      } else if (result.type === "barcode") {
        const response = await BorrowRecordService.processScannedCodes(
          { codes: [result.data], userId },
          access_token
        );
        setNotification({
          open: true,
          message: `Đã tạo phiếu mượn #${response.reservationCode}`,
          severity: "success",
        });
      }
      fetchRecords();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Lỗi khi xử lý mã quét",
        severity: "error",
      });
    }
  };

  const handleManualCodeSubmit = async (event) => {
    event.preventDefault();
    if (!manualCode.trim()) {
      setManualCodeError("Vui lòng nhập mã đặt chỗ");
      return;
    }
    setIsProcessingCode(true);
    try {
      const response = await BorrowRecordService.createFromReservation(
        manualCode.trim(),
        access_token
      );
      setNotification({
        open: true,
        message: `Đã tạo phiếu mượn từ mã đặt chỗ #${response.reservationCode}`,
        severity: "success",
      });
      setManualCode("");
      setManualCodeError("");
      fetchRecords();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Lỗi khi xử lý mã đặt chỗ",
        severity: "error",
      });
    } finally {
      setIsProcessingCode(false);
    }
  };

  const handleUpdateBookStatus = async (recordId, barcode, newStatus, user) => {
    try {
      await BorrowRecordService.updateBookStatus(
        recordId,
        barcode,
        newStatus,
        access_token,
        user
      );
      setNotification({
        open: true,
        message: `Cập nhật trạng thái sách ${barcode} thành ${newStatus} thành công`,
        severity: "success",
      });
      fetchRecords();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Lỗi khi cập nhật trạng thái sách",
        severity: "error",
      });
    }
  };

  const columns = [
    { field: "displayId", headerName: "STT", width: 70 },
    { field: "user", headerName: "Người mượn", width: 200 },
    { field: "booksCount", headerName: "Số lượng sách", width: 120 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        const status = params.value;
        const color =
          status === "Borrowed"
            ? "primary"
            : status === "Returned"
            ? "success"
            : status === "Overdue"
            ? "warning"
            : status === "Lost"
            ? "error"
            : "default";
        return (
          <Typography color={`${color}.main`} sx={{ padding: "12px 0" }}>
            {statusOptions.find((s) => s.value === status)?.label || status}
          </Typography>
        );
      },
    },
    { field: "dueDate", headerName: "Hạn trả", width: 120 },
    { field: "createdAt", headerName: "Ngày tạo", width: 120 },
  ];

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
        title="Quản lý Mượn/Trả sách"
        rows={records}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
        showLockIcon={false}
        showEditIcon={false}
        showAddIcon={false}
        onView={handleViewOpen}
      />

      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: "15px 0" }}
          onClick={() => setOpenScanner(true)}
        >
          QR
        </Button>
        <Typography sx={{ fontSize: "50px" }}>/</Typography>
        <TextField
          label="Nhập mã yêu cầu mượn"
          variant="outlined"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          error={!!manualCodeError}
          helperText={manualCodeError}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ padding: "15px 0" }}
          onClick={handleManualCodeSubmit}
          disabled={!manualCode.trim() || isProcessingCode}
          type="button"
        >
          {isProcessingCode ? <CircularProgress size={24} /> : "+"}
        </Button>
      </Box>

      <AdminModal
        showEdit={false}
        open={openView}
        onClose={handleViewClose}
        title={`Thông Tin Phiếu Mượn: ${currentRecord?.user || ""}`}
        minWidth="800px"
        minHeight="500px"
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Thông tin phiếu mượn" />
              <Tab label="Danh sách sách" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TextField
              margin="dense"
              label="Người mượn"
              type="text"
              fullWidth
              value={currentRecord?.user || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Số lượng sách"
              type="text"
              fullWidth
              value={currentRecord?.booksCount || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Trạng thái"
              type="text"
              fullWidth
              value={
                statusOptions.find((s) => s.value === currentRecord?.status)
                  ?.label ||
                currentRecord?.status ||
                ""
              }
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Hạn trả"
              type="text"
              fullWidth
              value={currentRecord?.dueDate || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Ngày tạo"
              type="text"
              fullWidth
              value={currentRecord?.createdAt || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              {currentRecord?.status === "Borrowed" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() =>
                      handleUpdateBookStatus(currentRecord.id, null, "Returned")
                    }
                  >
                    Trả toàn bộ
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() =>
                      handleUpdateBookStatus(currentRecord.id, null, "Lost")
                    }
                  >
                    Báo mất
                  </Button>
                </>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {currentRecord?.books?.map((book, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{book.title}</Typography>
                    <Typography variant="body2">
                      Mã sách: {book.barcode}
                    </Typography>
                  </Box>
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={book.status}
                      onChange={(e) =>
                        handleUpdateBookStatus(
                          currentRecord.id,
                          book.barcode,
                          e.target.value
                        )
                      }
                      label="Trạng thái"
                    >
                      {statusOptions
                        .filter((opt) =>
                          ["Borrowed", "Returned", "Lost"].includes(opt.value)
                        )
                        .map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              ))}
              {(!currentRecord?.books || currentRecord.books.length === 0) && (
                <Typography>Không có sách trong phiếu mượn</Typography>
              )}
            </Box>
          </TabPanel>
        </Box>
      </AdminModal>

      <ScanQR
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        onScan={handleScanResult}
      />

      <Snackbar
        open={notification?.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification?.severity}
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BorrowRecordAdmin;
