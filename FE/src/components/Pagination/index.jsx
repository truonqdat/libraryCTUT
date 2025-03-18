// Pagination.js
import React from "react";
import { Button, Stack, IconButton,Box } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPaginationRange = () => {
    const range = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(start + 4, totalPages);
      } else {
        start = Math.max(end - 4, 1);
      }
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const goToFirstPage = () => {
    onPageChange(1);
  };

  const goToLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
      <Stack direction="row" spacing={2}>
        <IconButton
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          color="primary"
        >
          <FirstPageIcon />
        </IconButton>

        {getPaginationRange().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "contained" : "outlined"}
            color="primary"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}

        <IconButton
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          color="primary"
        >
          <LastPageIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default Pagination;
