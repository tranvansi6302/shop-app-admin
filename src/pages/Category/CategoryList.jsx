import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Paper, Snackbar
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import categoryApi from '../../apis/category.api';

const headCells = [
    { id: 'name', label: 'Tên danh mục', disablePadding: true, align: 'center' }
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

export default function CategoryList() {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('add'); // 'add', 'edit', or 'delete'
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const queryClient = useQueryClient();
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getAllCategories
    });

    const categoryMutation = useMutation({
        mutationFn: dialogType === 'add'
            ? (data) => categoryApi.createCategory(data)
            : dialogType === 'edit'
            ? (data) => categoryApi.editCategory(selectedCategory.id, data)
            : () => categoryApi.deleteCategory(selectedCategory.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            closeDialog();
        },
        onError: (error) => {
            // Show error message if deletion failed
            setSnackbar({ open: true, message: error.response.data.message || 'Không thể xoá danh mục này' });
        }
    });

    const openAddDialog = () => {
        setDialogType('add');
        setCategoryName('');
        setOpenDialog(true);
    };

    const openEditDialog = (category) => {
        setDialogType('edit');
        setSelectedCategory(category);
        setCategoryName(category.name);
        setOpenDialog(true);
    };

    const openDeleteDialog = (category) => {
        setDialogType('delete');
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setCategoryName('');
    };

    const handleSaveCategory = () => {
        categoryMutation.mutate({ name: categoryName });
    };

    const handleDeleteCategory = () => {
        categoryMutation.mutate();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: '' });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Typography variant='h6'>Danh sách danh mục</Typography>
            <Button variant='contained' startIcon={<AddCircleOutlineIcon />} sx={{ mb: 2 }} onClick={openAddDialog}>
                Thêm danh mục
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <EnhancedTableHead />
                    <TableBody>
                        {categories.data.result.map((category) => (
                            <TableRow hover key={category.id}>
                                <TableCell align='center'>{category.name}</TableCell>
                                <TableCell align='center'>
                                    <Button onClick={() => openEditDialog(category)} variant='outlined' startIcon={<EditIcon />} color='primary'>
                                        Sửa
                                    </Button>
                                    <Button onClick={() => openDeleteDialog(category)} variant='outlined' startIcon={<DeleteIcon />} color='error'>
                                        Xoá
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth='sm'>
                <DialogTitle>{dialogType === 'add' ? 'Thêm danh mục mới' : dialogType === 'edit' ? 'Chỉnh sửa danh mục' : 'Xác nhận xóa danh mục'}</DialogTitle>
                <DialogContent>
                    {dialogType !== 'delete' ? (
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Tên danh mục'
                            type='text'
                            fullWidth
                            variant='outlined'
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    ) : (
                        <Typography>Bạn có chắc chắn muốn xóa danh mục '{selectedCategory.name}' không?</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Hủy</Button>
                    {dialogType !== 'delete' ? (
                        <Button onClick={handleSaveCategory} color='primary'>
                            {dialogType === 'add' ? 'Thêm' : 'Lưu thay đổi'}
                        </Button>
                    ) : (
                        <Button onClick={handleDeleteCategory} color='error'>Xóa</Button>
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
