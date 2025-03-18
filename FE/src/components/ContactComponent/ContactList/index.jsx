import React, { useState, useEffect } from "react";
import Contact from "./Contact.jsx";
import { Box } from "@mui/material";
import Pagination from "../../Pagination/index.jsx"; 
import contactService from "../../../services/contactService.js";

function ContactList() {
  const [contacts, setContacts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await contactService.getAllContact();
        setContacts(response.data); 
      } catch (error) {
        console.error("Lỗi khi lấy danh sách liên hệ:", error);
      }
    };

    getContacts(); 
  }, []);

  const countContacts = contacts.length;
  const itemsPerPage = 4;
  const totalPages = Math.ceil(countContacts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = contacts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box>

      {displayedData.map((item, index) => (
        <Contact
          key={index}
          name={item.name}
          description={item.description}
          time={new Date(item.timeContact).toLocaleString()}
        />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}

export default ContactList;
