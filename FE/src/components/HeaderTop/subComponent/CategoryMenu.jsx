import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import { Popover, Typography } from '@mui/material';

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
    };

    const openPop = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton aria-describedby={id} onClick={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Điện thoại'} />
                    </ListItemButton>
                    <Popover
                        id={id}
                        open={openPop}
                        anchorEl={anchorEl}
                        onClose={handleMouseLeave}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
                    </Popover>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <Button variant="outlined" color="primary" startIcon={<ReorderRoundedIcon />} onClick={toggleDrawer(true)}>
                Danh mục sản phẩm
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
