import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { Link } from 'react-router-dom'
import productApi from '../../apis/product.api'
import { getImageUrl } from '../../config/url'
import DOMPurify from 'dompurify'
function createData(id, name, calories, fat, carbs, protein) {
    return {
        id,
        name,
        calories,
        fat,
        carbs,
        protein
    }
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0)
]

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Tên sản phẩm'
    },
    {
        id: 'photo',
        numeric: true,
        disablePadding: false,
        label: 'Hình ảnh'
    },

    {
        id: 'brand',
        numeric: true,
        disablePadding: false,
        label: 'Thương hiệu'
    },
    {
        id: 'category',
        numeric: true,
        disablePadding: false,
        label: 'Loại'
    },
    {
        id: 'Hành động',
        numeric: true,
        disablePadding: false,
        label: 'Hành động'
    }
]

function EnhancedTableHead() {
    return (
        <TableHead sx={{ backgroundColor: '#F4F6F8' }}>
            <TableRow>
                <TableCell padding='checkbox'></TableCell>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align='left' padding={headCell.disablePadding ? 'none' : 'normal'}>
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default function ProductList() {
    const [open, setOpen] = React.useState(false)
    const [product, setProduct] = React.useState(null)

    const handleClickOpen = (id) => {
        const product = products?.data.result.find((product) => product.id === id)
        setProduct(product)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => productApi.getAllProducts()
    })

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>{'Chi tiết sản phẩm'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        <div className=''>Tên sản phẩm: {product?.name}</div>
                        <div style={{ marginTop: '10px' }}>Tên phiên bản:</div>
                        <ul>
                            {product?.items.length > 0 &&
                                product?.items.map((x) => (
                                    <li key={x.id}>{`${product.name} -  ${x.size} - ${x.color}`}</li>
                                ))}
                        </ul>
                        <div style={{ marginTop: '10px' }}>Hình ảnh:</div>
                        <div style={{ display: 'flex', gap: '10px' }} className=''>
                            {product?.images.length > 0 &&
                                product?.images.map((x) => (
                                    <img
                                        key={x.id}
                                        width={'200px'}
                                        height={'200px'}
                                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                                        src={!x?.url.startsWith('http') ? getImageUrl(x?.url) : x?.url}
                                        alt=''
                                    />
                                ))}
                        </div>
                        <div style={{ marginTop: '10px' }}>Thương hiệu: {product?.brand.name}</div>
                        <div style={{ marginTop: '10px' }}>Danh mục: {product?.category.name}</div>
                        <div style={{ marginTop: '10px' }}>Mô tả: </div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(product?.description)
                            }}
                        ></div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size='large' variant='contained' color='primary' onClick={handleClose} autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        py: 4,
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography sx={{ px: 4 }} variant='h5'>
                        Danh sách sản phẩm
                    </Typography>
                    <Link to='/admin/products/create'>
                        <Button sx={{ px: 2 }} variant='contained'>
                            Thêm sản phẩm
                        </Button>
                    </Link>
                </Box>
                <Paper elevation={0} sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
                            <EnhancedTableHead rowCount={rows.length} />
                            <TableBody>
                                {products?.data.result &&
                                    products?.data.result.length > 0 &&
                                    products?.data.result.map((product) => (
                                        <TableRow
                                            key={product.id}
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding='checkbox'></TableCell>
                                            <TableCell
                                                sx={{ width: '32%' }}
                                                component='th'
                                                id={new Date().getTime()}
                                                scope='row'
                                                padding='none'
                                            >
                                                {product.name}
                                            </TableCell>
                                            <TableCell align='left'>
                                                <img
                                                    alt='product'
                                                    src={
                                                        !product?.images[0]?.url.startsWith('http')
                                                            ? getImageUrl(product?.images[0]?.url)
                                                            : product?.images[0]?.url
                                                    }
                                                    width='70'
                                                />
                                            </TableCell>
                                            <TableCell align='left'>{product?.category?.name}</TableCell>
                                            <TableCell align='left'>{product?.brand?.name}</TableCell>

                                            <TableCell align='left'>
                                                <Button variant='outlined' color='error'>
                                                    Xóa
                                                </Button>

                                                <Link>
                                                    <Button sx={{ ml: 1 }} variant='outlined' color='primary'>
                                                        Sửa
                                                    </Button>
                                                </Link>
                                                <Button
                                                    sx={{ ml: 1 }}
                                                    onClick={() => handleClickOpen(product.id)}
                                                    variant='outlined'
                                                    color='success'
                                                >
                                                    Chi tiết
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </React.Fragment>
    )
}
