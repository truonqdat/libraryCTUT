import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const DataTable = ({
    title,
    rows,
    columns,
    pageSizeOptions = [5, 10],
    initialPage = 0,
    onAdd, // Hàm thêm
    onEdit, // Hàm chỉnh sửa
    onLock,
    onView,
    showAddIcon = true,
    showEditIcon = true,
    showLockIcon = true,
}) => {
    const [paginationModel, setPaginationModel] = React.useState({ page: initialPage, pageSize: pageSizeOptions[0] });

    return (
        <Paper sx={{ height: 'auto', width: '100%', padding: '0 10px' }}>
            <div style={{ display: 'flex', gap: '25px', padding: '10px 10px' }}>
                <h1 style={{ textTransform: 'uppercase' }}>{title}</h1>
                {showAddIcon && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onAdd} // Gọi hàm onAdd khi nhấn nút
                        sx={{ gap: '5px', padding: '6px 12px', textAlign: 'center', lineHeight: '0' }}
                    >
                        <AddIcon />
                        Thêm
                    </Button>
                )}
            </div>
            <DataGrid
                rows={rows}
                columns={[
                    ...columns,
                    {
                        field: 'actions',
                        headerName: 'Tùy chọn',
                        width: 150,
                        renderCell: (params) => (
                            <>
                                <Button
                                    color="success"
                                    onClick={() => onView(params.row)} 
                                    sx={{ gap: '5px', lineHeight: '0' }}
                                >
                                    <VisibilityIcon />
                                </Button>
                                {showEditIcon && (
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(params.row)} // Gọi hàm onEdit khi nhấn nút chỉnh sửa
                                        sx={{ gap: '5px', lineHeight: '0' }}
                                    >
                                        <EditNoteIcon />
                                    </Button>
                                )}
                                {showLockIcon && (
                                    <Button
                                        onClick={() => onLock(params.row)} 
                                        sx={{
                                            gap: '5px',
                                            lineHeight: '0',
                                            color: params.row.lock ? 'red' : 'green', 
                                        }}
                                    >
                                        {params.row.lock ? <LockIcon /> : <LockOpenIcon />} 
                                    </Button>
                                )}
                            </>
                        ),
                    },
                ]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={pageSizeOptions}
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
                sx={{ border: 0 }}
            />
        </Paper>
    );
};

export default DataTable;