import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import contactService from "../../../services/contactService.js";

function FormContact() {
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    des: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactService.addContact(formData);
      setSuccess(true);
      setFormData({
        name: "",
        tel: "",
        email: "",
        des: "",
      })
    } catch (error) {
      setSuccess(false);
      setFormData({
        name: "",
        tel: "",
        email: "",
        des: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Thu thập phản hồi
        </Typography>

        <TextField
          label="Họ và tên sinh viên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          label="Số điện thoại liên hệ"
          name="tel"
          value={formData.tel}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          type="tel"
        />

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          type="email"
        />

        <TextField
          label="Nội dung phản hồi"
          name="des"
          value={formData.des}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
          required
          rows={4}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ textTransform: "none", py: 1.5 }}
        >
          {loading ? "Submitting..." : "Gửi"}
        </Button>

        {success === true && (
          <Typography color="success.main" align="center">
            Gửi đi thành công
          </Typography>
        )}

        {success === false && (
          <Typography color="error.main" align="center">
            Gửi đi thất bại
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default FormContact;
