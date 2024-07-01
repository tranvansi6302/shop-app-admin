import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Paper, Snackbar
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import brandApi from '../../apis/brand.api'; // Giả sử bạn có API tương tự cho brand

const headCells = [
    { id: 'name', label: 'Tên thương hiệu', disablePadding: true, align: 'center' }
];

function EnhancedTableHead() {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((cell) => (
                    <TableCell key={cell.id} align={cell.align} padding={cell.disablePadding ? 'none' : 'default'}>
                        {cell.label}
                    </TableCell>
                ))}
                <TableCell align='center'>Hành động</TableCell>
            </TableRow>
        </TableHead>
    );
}

export default function BrandList() {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('add');
    const [brandName, setBrandName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const queryClient = useQueryClient();
    const { data: brands, isLoading, error } = useQuery({
        queryKey: ['brands'],
        queryFn: brandApi.getAllBrands
    });

    const brandMutation = useMutation({
        mutationFn: dialogType === 'add'
            ? (data) => brandApi.createBrand(data)
            : dialogType === 'edit'
            ? (data) => brandApi.editBrand(selectedBrand.id, data)
            : () => brandApi.deleteBrand(selectedBrand.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['brands']);
            closeDialog();
        },
        onError: (error) => {
            setSnackbar({ open: true, message: error.response.data.message || 'Không thể xóa thương hiệu này' });
        }
    });

    const openAddDialog = () => {
        setDialogType('add');
        setBrandName('');
        setOpenDialog(true);
    };

    const openEditDialog = (brand) => {
        setDialogType('edit');
        setSelectedBrand(brand);
        setBrandName(brand.name);
        setOpenDialog(true);
    };

    const openDeleteDialog = (brand) => {
        setDialogType('delete');
        setSelectedBrand(brand);
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setBrandName('');
    };

    const handleSaveBrand = () => {
        brandMutation.mutate({ name: brandName });
    };

    const handleDeleteBrand = () => {
        brandMutation.mutate();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: '' });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Typography variant='h6'>Danh sách thương hiệu</Typography>
            <Button variant='contained' startIcon={<AddCircleOutlineIcon />} sx={{ mb: 2 }} onClick={openAddDialog}>
                Thêm thương hiệu
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <EnhancedTableHead />
                    <TableBody>
                        {brands.data.result.map((brand) => (
                            <TableRow hover key={brand.id}>
                                <TableCell align='center'>{brand.name}</TableCell>
                                <TableCell align='center'>
                                    <Button onClick={() => openEditDialog(brand)} variant='outlined' startIcon={<EditIcon />} color='primary'>
                                        Sửa
                                    </Button>
                                    <Button onClick={() => openDeleteDialog(brand)} variant='outlined' startIcon={<DeleteIcon />} color='error'>
                                        Xoá
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth='sm'>
                <DialogTitle>{dialogType === 'add' ? 'Thêm thương hiệu mới' : dialogType === 'edit' ? 'Chỉnh sửa thương hiệu' : 'Xác nhận xóa thương hiệu'}</DialogTitle>
                <DialogContent>
                    {dialogType !== 'delete' ? (
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Tên thương hiệu'
                            type='text'
                            fullWidth
                            variant='outlined'
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                        />
                    ) : (
                        <Typography>Bạn có chắc chắn muốn xóa thương hiệu '{selectedBrand.name}' không?</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Hủy</Button>
                    {dialogType !== 'delete' ? (
                        <Button onClick={handleSaveBrand} color='primary'>
                            {dialogType === 'add' ? 'Thêm' : 'Lưu thay đổi'}
                        </Button>
                    ) : (
                        <Button onClick={handleDeleteBrand} color='error'>Xóa</Button>
                    )}
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Box>
    );
}
