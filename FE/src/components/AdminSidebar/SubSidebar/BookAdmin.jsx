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
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Visibility, Edit, Delete, Add, Close } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import BookService from "../../../services/bookService";
import FacultyService from "../../../services/facultyService";
import CategoryService from "../../../services/categoryService";

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

const formatOptions = [
  { value: "physical", label: "Bản vật lý" },
  { value: "ebook", label: "Bản điện tử" },
];

const fileTypeOptions = [
  { value: "application/pdf", label: "PDF" },
  { value: "application/vnd.ms-powerpoint", label: "PPT" },
];

const conditionOptions = [
  { value: "New", label: "Mới" },
  { value: "Good", label: "Còn tốt" },
  { value: "Damaged", label: "Hư hại" },
];

export default function BookAdmin() {
  const [books, setBooks] = useState([]);
  const [bookCopies, setBookCopies] = useState([]);
  const [editedBookCopies, setEditedBookCopies] = useState([]); // Track edited copies
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openView, setOpenView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [categories, setCategories] = useState([]);
  const access_token = localStorage.getItem("accessToken");

  // State for new book form
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    ISBN: "",
    categoryId: "",
    formats: ["physical"],
    description: "",
    publishedYear: "",
    facultyId: "",
    cover: null,
    ebook: "null",
    physicalCopies: { total: 0 },
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await BookService.getAllBooks();
      const booksData = response.map((book, index) => ({
        id: book._id,
        displayId: index + 1,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        categoryId: book.categoryId,
        formats: book.formats,
        description: book.description,
        publishedYear: book.publishedYear,
        facultyId: book.facultyId,
        createdAt: new Date(book.createdAt).toLocaleDateString(),
        coverImage: book.coverImage,
        digitalAssets: book.digitalAssets || [],
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
      setNotification({
        open: true,
        message: "Lỗi khi tải danh sách sách",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookCopies = async (bookId) => {
    try {
      const response = await BookService.getBookCopies(bookId);
      const copiesData = response.map((copy, index) => ({
        id: copy._id,
        displayId: index + 1,
        status:
          copy.status === "Available"
            ? "Có sẵn"
            : copy.status === "Borrowed"
            ? "Đang cho mượn"
            : copy.status === "Reserved"
            ? "Không có sẵn"
            : copy.status === "Pending"
            ? "Đang xử lý"
            : "Mất",
        barcode: copy.barcode,
        condition: copy.condition,
        conditionLabel:
          copy.condition === "New"
            ? "Mới"
            : copy.condition === "Good"
            ? "Còn tốt"
            : "Hư hại",
        location: copy.location || "",
      }));
      setBookCopies(copiesData);
      setEditedBookCopies(copiesData); // Initialize edited copies
    } catch (error) {
      console.error("Error fetching book copies:", error);
      setNotification({
        open: true,
        message: "Lỗi khi tải danh sách bản copy",
        severity: "error",
      });
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await FacultyService.getAllFaculties();
      setFaculties(response);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchFaculties();
    fetchCategories();
  }, []);

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    if (name === "physicalCopies.total") {
      setNewBook((prev) => ({
        ...prev,
        physicalCopies: { ...prev.physicalCopies, total: parseInt(value) || 0 },
      }));
    } else {
      setNewBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditBookChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatChange = (event, isEdit = false) => {
    const { value } = event.target;
    const formats = typeof value === "string" ? value.split(",") : value;
    if (isEdit) {
      setCurrentBook((prev) => ({
        ...prev,
        formats,
        ebook: formats.includes("ebook") ? prev.ebook : null,
      }));
    } else {
      setNewBook((prev) => ({
        ...prev,
        formats,
        ebook: formats.includes("ebook") ? prev.ebook : null,
        physicalCopies: formats.includes("physical")
          ? prev.physicalCopies
          : { total: 0 },
      }));
    }
  };

  const handleCoverFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setCurrentBook((prev) => ({ ...prev, cover: file }));
      } else {
        setNewBook((prev) => ({ ...prev, cover: file }));
      }
    }
  };

  const handleEbookFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setCurrentBook((prev) => ({ ...prev, ebook: file }));
      } else {
        setNewBook((prev) => ({ ...prev, ebook: file }));
      }
    }
  };

  const handleCopyChange = (copyId, field, value) => {
    setEditedBookCopies((prev) =>
      prev.map((copy) =>
        copy.id === copyId
          ? {
              ...copy,
              [field]: value,
              conditionLabel:
                field === "condition"
                  ? conditionOptions.find((opt) => opt.value === value)
                      ?.label || copy.conditionLabel
                  : copy.conditionLabel,
            }
          : copy
      )
    );
  };

  const handleSaveCopies = async () => {
    try {
      const updates = editedBookCopies
        .filter((copy, index) => {
          const original = bookCopies[index];
          return (
            copy.condition !== original.condition ||
            copy.location !== original.location
          );
        })
        .map((copy) => ({
          id: copy.id,
          condition: copy.condition,
          location: copy.location,
        }));

      if (updates.length === 0) {
        setNotification({
          open: true,
          message: "Không có thay đổi để lưu!",
          severity: "info",
        });
        return;
      }

      for (const update of updates) {
        if (!update.location.trim()) {
          setNotification({
            open: true,
            message: "Vị trí không được để trống!",
            severity: "error",
          });
          return;
        }
        if (!conditionOptions.some((opt) => opt.value === update.condition)) {
          setNotification({
            open: true,
            message: "Tình trạng không hợp lệ!",
            severity: "error",
          });
          return;
        }
        await BookService.updateBookCopy(update.id, update, access_token);
      }

      setNotification({
        open: true,
        message: "Cập nhật bản copy thành công!",
        severity: "success",
      });
      await fetchBookCopies(currentBook.id);
    } catch (error) {
      console.error("Error updating book copies:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Lỗi khi cập nhật bản copy. Vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title.trim() || !newBook.author.trim()) {
      setNotification({
        open: true,
        message: "Tiêu đề và tác giả là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (!newBook.cover) {
      setNotification({
        open: true,
        message: "Ảnh bìa là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (!newBook.facultyId) {
      setNotification({
        open: true,
        message: "Khoa là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (!newBook.categoryId) {
      setNotification({
        open: true,
        message: "Danh mục là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (newBook.formats.includes("ebook") && !newBook.ebook) {
      setNotification({
        open: true,
        message: "File eBook là bắt buộc cho định dạng điện tử!",
        severity: "error",
      });
      return;
    }
    if (
      newBook.formats.includes("physical") &&
      newBook.physicalCopies.total < 0
    ) {
      setNotification({
        open: true,
        message: "Số lượng bản vật lý phải là số không âm!",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("ISBN", newBook.ISBN);
    formData.append("description", newBook.description);
    formData.append("publishedYear", newBook.publishedYear);
    formData.append("categoryId", newBook.categoryId);
    formData.append("facultyId", newBook.facultyId);
    formData.append("formats", JSON.stringify(newBook.formats));

    if (newBook.formats.includes("physical")) {
      formData.append("physicalCopies", JSON.stringify(newBook.physicalCopies));
    }
    if (newBook.cover) {
      formData.append("cover", newBook.cover);
    }
    if (newBook.formats.includes("ebook") && newBook.ebook) {
      formData.append("ebook", newBook.ebook);
    }

    try {
      const response = await BookService.createBook(formData, access_token);
      const newBookData = {
        id: response._id,
        displayId: books.length + 1,
        title: response.title,
        author: response.author,
        ISBN: response.ISBN,
        categoryId: response.categoryId,
        formats: response.formats,
        description: response.description,
        publishedYear: response.publishedYear,
        facultyId: response.facultyId,
        createdAt: new Date(response.createdAt).toLocaleDateString(),
        coverImage: response.coverImage,
        digitalAssets: response.digitalAssets || [],
      };

      setBooks((prevBooks) => [...prevBooks, newBookData]);
      setNotification({
        open: true,
        message: "Thêm sách thành công!",
        severity: "success",
      });
      handleAddClose();
      setNewBook({
        title: "",
        author: "",
        ISBN: "",
        categoryId: "",
        formats: ["physical"],
        description: "",
        publishedYear: "",
        facultyId: "",
        cover: null,
        ebook: null,
        physicalCopies: { total: 0 },
      });
    } catch (error) {
      console.error("Error adding book:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  const handleEditOpen = (book) => {
    setCurrentBook({
      ...book,
      cover: null,
      ebook: null,
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentBook(null);
  };

  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleSave = async () => {
    if (!currentBook) return;

    if (!currentBook.title.trim() || !currentBook.author.trim()) {
      setNotification({
        open: true,
        message: "Tiêu đề và tác giả là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (!currentBook.facultyId) {
      setNotification({
        open: true,
        message: "Khoa là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (!currentBook.categoryId) {
      setNotification({
        open: true,
        message: "Danh mục là bắt buộc!",
        severity: "error",
      });
      return;
    }
    if (
      currentBook.formats.includes("ebook") &&
      !currentBook.ebook &&
      !currentBook.digitalAssets.length
    ) {
      setNotification({
        open: true,
        message:
          "File eBook là bắt buộc cho định dạng điện tử nếu chưa có file cũ!",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", currentBook.title);
    formData.append("author", currentBook.author);
    formData.append("ISBN", currentBook.ISBN);
    formData.append("description", currentBook.description || "");
    formData.append("publishedYear", currentBook.publishedYear || "");
    formData.append("categoryId", currentBook.categoryId);
    formData.append("facultyId", currentBook.facultyId);
    formData.append("formats", JSON.stringify(currentBook.formats));

    if (currentBook.cover) {
      formData.append("cover", currentBook.cover);
    }
    if (currentBook.formats.includes("ebook") && currentBook.ebook) {
      formData.append("ebook", currentBook.ebook);
    }

    try {
      await BookService.updateBook(currentBook.id, formData, access_token);
      setNotification({
        open: true,
        message: "Sách đã được cập nhật thành công!",
        severity: "success",
      });
      await fetchBooks();
      handleEditClose();
    } catch (error) {
      console.error("Error updating book:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sách.",
        severity: "error",
      });
    }
  };

  const handleViewOpen = async (book) => {
    setCurrentBook(book);
    setOpenView(true);
    await fetchBookCopies(book.id);
    setTabValue(0);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setCurrentBook(null);
    setBookCopies([]);
    setEditedBookCopies([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const columns = [
    { field: "displayId", headerName: "STT", width: 70 },
    { field: "title", headerName: "Tên Sách", width: 200 },
    { field: "author", headerName: "Tác Giả", width: 150 },
    { field: "createdAt", headerName: "Ngày Tạo", width: 150 },
    { field: "description", headerName: "Mô Tả", width: 300 },
  ];

  const copyColumns = [
    { field: "displayId", headerName: "STT", width: 70 },
    { field: "barcode", headerName: "Mã vạch", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "condition",
      headerName: "Tình trạng",
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.condition}
          onChange={(e) =>
            handleCopyChange(params.row.id, "condition", e.target.value)
          }
          size="small"
          fullWidth
        >
          {conditionOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "location",
      headerName: "Vị trí",
      width: 150,
      renderCell: (params) => (
        <TextField
          value={params.row.location || ""}
          onChange={(e) =>
            handleCopyChange(params.row.id, "location", e.target.value)
          }
          size="small"
          fullWidth
        />
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Quản Lý Sách"
        rows={books}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialPage={0}
        onAdd={handleAddOpen}
        onEdit={handleEditOpen}
        onView={handleViewOpen}
        showLockIcon={false}
      />

      {/* Modal xem chi tiết */}
      <AdminModal
        showEdit={false}
        open={openView}
        onClose={handleViewClose}
        title={`Thông Tin Sách: ${currentBook?.title || ""}`}
        minWidth="800px"
        minHeight="500px"
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Thông tin sách" />
              <Tab label="Bản copy" />
              {currentBook?.digitalAssets?.length > 0 && (
                <Tab label="Bản điện tử" />
              )}
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {currentBook?.coverImage && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={`http://localhost:3001/api${currentBook.coverImage}`}
                  alt="Cover"
                  style={{ maxHeight: "200px", maxWidth: "100%" }}
                />
              </Box>
            )}
            <TextField
              margin="dense"
              label="Tên Sách"
              type="text"
              fullWidth
              value={currentBook?.title || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Tác Giả"
              type="text"
              fullWidth
              value={currentBook?.author || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Mô Tả"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={currentBook?.description || ""}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Ngày Tạo"
              type="text"
              fullWidth
              value={currentBook?.createdAt || ""}
              InputProps={{ readOnly: true }}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCopies}
              >
                Lưu thay đổi
              </Button>
            </Box>
            <DataGrid
              rows={editedBookCopies}
              columns={copyColumns}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </TabPanel>

          {currentBook?.digitalAssets?.length > 0 && (
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Danh sách file điện tử
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {currentBook.digitalAssets.map((asset, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography>
                          <strong>Sách:</strong> {currentBook?.title}
                        </Typography>
                        <Typography>
                          <strong>Lượt tải:</strong> {asset.downloadCount}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          BookService.downloadEbook(
                            currentBook.id,
                            asset.fileType,
                            access_token
                          )
                        }
                      >
                        Tải xuống
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </TabPanel>
          )}
        </Box>
      </AdminModal>

      {/* Modal chỉnh sửa */}
      <AdminModal
        open={openEdit}
        onClose={handleEditClose}
        title="Chỉnh sửa sách"
        onSave={handleSave}
        maxWidth="md"
      >
        <Box component="form">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Tiêu đề sách"
            name="title"
            value={currentBook?.title || ""}
            onChange={handleEditBookChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Tác giả"
            name="author"
            value={currentBook?.author || ""}
            onChange={handleEditBookChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="ISBN"
            name="ISBN"
            value={currentBook?.ISBN || ""}
            onChange={handleEditBookChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Khoa</InputLabel>
            <Select
              name="facultyId"
              value={currentBook?.facultyId || ""}
              onChange={handleEditBookChange}
              label="Khoa"
            >
              {faculties?.map((faculty) => (
                <MenuItem key={faculty._id} value={faculty._id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="categoryId"
              value={currentBook?.categoryId || ""}
              onChange={handleEditBookChange}
              label="Danh mục"
            >
              {categories?.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Định dạng</InputLabel>
            <Select
              multiple
              name="formats"
              value={currentBook?.formats || []}
              onChange={(e) => handleFormatChange(e, true)}
              renderValue={(selected) =>
                selected
                  .map((s) => formatOptions.find((f) => f.value === s)?.label)
                  .join(", ")
              }
              label="Định dạng"
            >
              {formatOptions.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  <Checkbox
                    checked={currentBook?.formats?.indexOf(format.value) > -1}
                  />
                  <ListItemText primary={format.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {currentBook?.formats?.includes("ebook") && (
            <Box
              sx={{ mt: 2, border: "1px solid #ddd", p: 2, borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Thông tin bản điện tử
              </Typography>
              {currentBook?.digitalAssets?.length > 0 && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  File hiện tại: {currentBook.digitalAssets[0].fileType} (
                  {currentBook.digitalAssets[0].fileSize})
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <input
                  type="file"
                  id="edit-ebook-file"
                  accept=".pdf,.ppt"
                  onChange={(e) => handleEbookFileChange(e, true)}
                  style={{ display: "none" }}
                />
                <label htmlFor="edit-ebook-file">
                  <Button variant="outlined" component="span">
                    Chọn file eBook mới
                  </Button>
                </label>
                {currentBook?.ebook && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Đã chọn: {currentBook.ebook.name} (
                    {(currentBook.ebook.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="Mô tả"
            name="description"
            value={currentBook?.description || ""}
            onChange={handleEditBookChange}
          />
          <TextField
            margin="normal"
            fullWidth
            type="number"
            label="Năm xuất bản"
            name="publishedYear"
            value={currentBook?.publishedYear || ""}
            onChange={handleEditBookChange}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh bìa
            </Typography>
            {currentBook?.coverImage && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={`http://localhost:3001/api${currentBook.coverImage}`}
                  alt="Cover"
                  style={{ maxHeight: "100px", maxWidth: "100%" }}
                />
              </Box>
            )}
            <input
              type="file"
              id="edit-cover-file"
              accept="image/png,image/jpeg"
              onChange={(e) => handleCoverFileChange(e, true)}
              style={{ display: "none" }}
            />
            <label htmlFor="edit-cover-file">
              <Button variant="outlined" component="span">
                Chọn ảnh bìa mới
              </Button>
            </label>
            {currentBook?.cover && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Đã chọn: {currentBook.cover.name}
              </Typography>
            )}
          </Box>
        </Box>
      </AdminModal>

      {/* Modal thêm mới */}
      <AdminModal
        open={openAdd}
        onClose={handleAddClose}
        title="Thêm sách mới"
        onSave={handleAddBook}
        maxWidth="md"
      >
        <Box component="form">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Tiêu đề sách"
            name="title"
            value={newBook.title}
            onChange={handleNewBookChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Tác giả"
            name="author"
            value={newBook.author}
            onChange={handleNewBookChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="ISBN"
            name="ISBN"
            value={newBook.ISBN}
            onChange={handleNewBookChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Khoa</InputLabel>
            <Select
              name="facultyId"
              value={newBook.facultyId}
              onChange={handleNewBookChange}
              label="Khoa"
            >
              {faculties?.map((faculty) => (
                <MenuItem key={faculty._id} value={faculty._id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="categoryId"
              value={newBook.categoryId}
              onChange={handleNewBookChange}
              label="Danh mục"
            >
              {categories?.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Định dạng</InputLabel>
            <Select
              multiple
              name="formats"
              value={newBook.formats}
              onChange={handleFormatChange}
              renderValue={(selected) =>
                selected
                  .map((s) => formatOptions.find((f) => f.value === s)?.label)
                  .join(", ")
              }
              label="Định dạng"
            >
              {formatOptions.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  <Checkbox
                    checked={newBook.formats.indexOf(format.value) > -1}
                  />
                  <ListItemText primary={format.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {newBook.formats.includes("ebook") && (
            <Box
              sx={{ mt: 2, border: "1px solid #ddd", p: 2, borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Thông tin bản điện tử
              </Typography>
              <Box sx={{ mt: 2 }}>
                <input
                  type="file"
                  id="ebook-file"
                  accept=".pdf,.ppt"
                  onChange={handleEbookFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="ebook-file">
                  <Button variant="outlined" component="span">
                    Chọn file eBook
                  </Button>
                </label>
                {newBook.ebook && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Đã chọn: {newBook.ebook.name} (
                    {(newBook.ebook.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="Mô tả"
            name="description"
            value={newBook.description}
            onChange={handleNewBookChange}
          />
          <TextField
            margin="normal"
            fullWidth
            type="number"
            label="Năm xuất bản"
            name="publishedYear"
            value={newBook.publishedYear}
            onChange={handleNewBookChange}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh bìa
            </Typography>
            <input
              type="file"
              id="cover-file"
              accept="image/png,image/jpeg"
              onChange={handleCoverFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="cover-file">
              <Button variant="outlined" component="span">
                Chọn ảnh bìa
              </Button>
            </label>
            {newBook.cover && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Đã chọn: {newBook.cover.name}
              </Typography>
            )}
          </Box>
        </Box>
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
