import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DataTable from "../../DataTable/DataTable";
import {
  QrCodeScanner,
  Add,
  ImportExport,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import TransactionLogService from "../../../services/transactionLogService";
import BookService from "../../../services/bookService";
import AdminModal from "../../AdminModal/AdminModal"; // Import AdminModal

const operationTypes = [
  { value: "Import", label: "Nhập sách" },
  { value: "Export", label: "Xuất sách" },
  { value: "Issue", label: "Mượn sách" },
  { value: "Return", label: "Trả sách" },
  { value: "Lost", label: "Mất sách" },
];

const TransactionLogAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [operationType, setOperationType] = useState("Import");
  const [notification, setNotification] = useState(null);
  const [openScanner, setOpenScanner] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [formData, setFormData] = useState({
    bookId: "",
    barcode: "",
    quantity: 1,
    note: "",
  });
  const [openViewModal, setOpenViewModal] = useState(false); // State for view modal
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State for selected transaction
  const access_token = localStorage.getItem("accessToken");
  const user = useSelector((state) => state.user);
  console.log(user.currentUser._id);
  

  const fetchBooks = useCallback(async () => {
    try {
      const response = await BookService.getAllBooks(access_token);
      setBooks(response);
    } catch (error) {
      setNotification({
        open: true,
        message: "Lỗi khi tải danh sách sách",
        severity: "error",
      });
    }
  }, [access_token]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TransactionLogService.getAllTransactions(
        access_token
      );
      console.log(response);
      
      const formattedTransactions = response.map((transaction) => ({
        id: transaction._id,
        book: transaction.bookId?.title || "Unknown",
        operationType: transaction.operationType,
        quantity: transaction.quantity,
        operator: transaction.operatorId?.fullName || "Unknown",
        createdAt: new Date(transaction.createdAt).toLocaleString(),
        barcode: transaction.barcode || "-",
        note: transaction.note || "-",
      }));
      setTransactions(formattedTransactions);
    } catch (error) {
      setNotification({
        open: true,
        message: "Lỗi khi tải danh sách giao dịch",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [access_token]);

  useEffect(() => {
    fetchTransactions();
    fetchBooks();
  }, [fetchTransactions, fetchBooks]);

  const handleCreateTransaction = async () => {
    try {
      setLoading(true);
      const transactionData = {
        ...formData,
        operationType,
        operatorId: user.currentUser._id,
      };

      if (operationType !== "Import" && !transactionData.barcode) {
        setBarcodeError("Vui lòng nhập mã vạch");
        return;
      }

      await TransactionLogService.createTransaction(
        access_token,
        transactionData
      );
      setNotification({
        open: true,
        message: "Tạo giao dịch thành công!",
        severity: "success",
      });
      fetchTransactions();
      handleDialogClose();
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Lỗi khi tạo giao dịch",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (type) => {
    setOperationType(type);
    setFormData({
      bookId: "",
      barcode: "",
      quantity: 1,
      note: "",
    });
    setBarcodeError("");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentTransaction(null);
  };

  const handleScanResult = (result) => {
    setOpenScanner(false);
    if (!result) {
      setNotification({
        open: true,
        message: "Không tìm thấy mã nào được quét",
        severity: "warning",
      });
      return;
    }
    setManualBarcode(result.data);
  };

  const handleManualBarcodeSubmit = () => {
    if (!manualBarcode.trim()) {
      setBarcodeError("Vui lòng nhập mã vạch");
      return;
    }
    setFormData({ ...formData, barcode: manualBarcode });
    setManualBarcode("");
    setNotification({
      open: true,
      message: "Đã thêm mã vạch thành công",
      severity: "success",
    });
  };

  // Handle opening the view modal
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenViewModal(true);
  };

  // Handle closing the view modal
  const handleViewModalClose = () => {
    setOpenViewModal(false);
    setSelectedTransaction(null);
  };

  console.log(selectedTransaction);
  

  const columns = [
    { field: "book", headerName: "Sách", width: 400 },
    {
      field: "operationType",
      headerName: "Loại giao dịch",
      width: 150,
      renderCell: (params) => {
        const type = params.value;
        const color =
          type === "Import"
            ? "success"
            : type === "Export"
            ? "warning"
            : type === "Issue"
            ? "info"
            : type === "Return"
            ? "primary"
            : "error";
        return (
          <Chip
            label={operationTypes.find((o) => o.value === type)?.label || type}
            color={color}
          />
        );
      },
    },
    { field: "quantity", headerName: "Số lượng", width: 100 },
    { field: "operator", headerName: "Người thực hiện", width: 200 },
    { field: "createdAt", headerName: "Thời gian", width: 180 },
  ];

  return (
    <Box>
      <DataTable
        title="Quản Lý Giao Dịch Nhập/Xuất"
        rows={transactions}
        columns={columns}
        loading={loading}
        showAddIcon={false}
        onView={handleViewTransaction} // Pass the view handler
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
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
          startIcon={<ImportExport />}
          onClick={() => handleDialogOpen("Import")}
        >
          Nhập sách
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ImportExport />}
          onClick={() => handleDialogOpen("Export")}
        >
          Xuất sách
        </Button>
      </Box>

      {/* Create Transaction Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {operationTypes.find((o) => o.value === operationType)?.label ||
            "Tạo giao dịch"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required sx={{ mb: 2 }}>
            <InputLabel id="book-select-label">Chọn sách</InputLabel>
            <Select
              labelId="book-select-label"
              label="Chọn sách"
              value={formData.bookId}
              onChange={(e) =>
                setFormData({ ...formData, bookId: e.target.value })
              }
            >
              {books.map((book) => (
                <MenuItem key={book._id} value={book._id}>
                  {book.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {operationType !== "Import" && (
            <>
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<QrCodeScanner />}
                  onClick={() => setOpenScanner(true)}
                >
                  Quét QR
                </Button>
                <Typography>/</Typography>
                <TextField
                  label="Nhập mã vạch"
                  variant="outlined"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  error={!!barcodeError}
                  helperText={barcodeError}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleManualBarcodeSubmit}
                  disabled={!manualBarcode.trim()}
                >
                  Thêm
                </Button>
              </Box>
              {formData.barcode && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Mã vạch đã chọn: <strong>{formData.barcode}</strong>
                </Typography>
              )}
            </>
          )}

          {operationType === "Import" && (
            <TextField
              margin="dense"
              label="Số lượng"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              required
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            margin="dense"
            label="Ghi chú"
            fullWidth
            multiline
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hủy</Button>
          <Button
            onClick={handleCreateTransaction}
            color="primary"
            disabled={
              loading ||
              !formData.bookId ||
              (operationType !== "Import" && !formData.barcode)
            }
          >
            {loading ? <CircularProgress size={24} /> : "Tạo giao dịch"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Scanner */}
      <Dialog open={openScanner} onClose={() => setOpenScanner(false)}>
        <DialogTitle>Quét mã vạch</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 400, height: 400, backgroundColor: "#f5f5f5" }}>
            <Typography align="center" sx={{ mt: 20 }}>
              QR Scanner Placeholder
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScanner(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* View Transaction Modal */}
      <AdminModal
        open={openViewModal}
        onClose={handleViewModalClose}
        title="Chi Tiết Giao Dịch"
        show
        airports
        near
        me
        Edit={false}
        minWidth="500px"
      >
        {selectedTransaction && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1">
              <strong>Sách:</strong> {selectedTransaction.book}
            </Typography>
            <Typography variant="body1">
              <strong>Loại giao dịch:</strong>{" "}
              {operationTypes.find(
                (o) => o.value === selectedTransaction.operationType
              )?.label || selectedTransaction.operationType}
            </Typography>
            <Typography variant="body1">
              <strong>Số lượng:</strong> {selectedTransaction.quantity}
            </Typography>
            {/* <Typography variant="body1">
              <strong>Mã vạch:</strong>{" "}
              {selectedTransaction.barcodes.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {selectedTransaction.barcodes.map((barcode, index) => (
                    <li key={index}>{barcode}</li>
                  ))}
                </ul>
              ) : (
                "-"
              )}
            </Typography> */}
            <Typography variant="body1">
              <strong>Người thực hiện:</strong> {selectedTransaction.operator}
            </Typography>
            <Typography variant="body1">
              <strong>Thời gian:</strong> {selectedTransaction.createdAt}
            </Typography>
            <Typography variant="body1">
              <strong>Ghi chú:</strong> {selectedTransaction.note}
            </Typography>
          </Box>
        )}
      </AdminModal>

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

export default TransactionLogAdmin;
