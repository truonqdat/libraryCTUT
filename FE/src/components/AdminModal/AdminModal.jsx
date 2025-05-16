import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const AdminModal = ({ open, onClose, title, children, onSave, showEdit = true, minWidth, minHeight }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    minWidth: minWidth || '400px', 
                    minHeight: minHeight || '200px', 
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            {showEdit && (
                <DialogActions sx={{padding:'0 20px 20px 20px', gap: '10px'}}>
                    <Button onClick={onClose} color="primary" variant='outlined'>
                        Hủy
                    </Button>
                    <Button onClick={onSave} color="primary" variant='contained'>
                        Lưu
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default AdminModal;
