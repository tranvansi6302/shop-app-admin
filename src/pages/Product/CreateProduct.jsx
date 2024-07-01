import { Box, Button, FormControl, FormHelperText, Grid, MenuItem, Select, Typography } from '@mui/material'

import { yupResolver } from '@hookform/resolvers/yup'
import { Chips } from 'primereact/chips'
import { Editor } from 'primereact/editor'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Input from '../../components/Input'
import Upload from '../../components/Upload'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import categoryApi from '../../apis/category.api'
import brandApi from '../../apis/brand.api'
import productApi from '../../apis/product.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const createProductSchema = yup.object({
    name: yup.string().required('Tên sản phẩm không được để trống'),
    sku: yup.string().required('SKU không được để trống'),
    price: yup.string().required('Giá tiền không được để trống'),
    categoryId: yup.string().required('Danh mục không được để trống'),
    brandId: yup.string().required('Thương hiệu không được để trống')
})

export default function CreateProduct() {
    const navigate = useNavigate()
    const [sizes, setSizes] = useState([])
    const [colors, setColor] = useState([])
    const [files, setFiles] = useState([])
    const [openEditor, setOpenEditor] = useState(false)
    const [description, setDescription] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.getAllCategories(),
        placeholderData: keepPreviousData
    })
    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandApi.getAllBrands(),
        placeholderData: keepPreviousData
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(createProductSchema)
    })

    const handleOnSelectedFiles = (files) => {
        setFiles(files)
    }

    const createProductMutation = useMutation({
        mutationFn: (data) => productApi.createProduct(data)
    })

    const uploadImageMutation = useMutation({
        mutationFn: (payload) => productApi.uploadImage(payload)
    })

    const onSubmit = handleSubmit(async (data) => {
        const finalData = {
            ...data,
            description: description,
            sizes: sizes,
            colors: colors
        }
        const product = await createProductMutation.mutateAsync(finalData, {
            onSuccess: () => {
                if (files.length == 0) {
                    toast.success('Thêm sản phẩm thành công')
                    navigate('/admin/products')
                }
            },
            onError: (error) => {
                toast.error(error.response.data.message)
            }
        })

        if (files && files.length > 0) {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append('files', file)
            })
            const payload = {
                id: product?.data.result.id,
                formData
            }
            console.log(payload)
            await uploadImageMutation.mutateAsync(payload, {
                onSuccess: () => {
                    toast.success('Thêm sản phẩm thành công')
                    navigate('/admin/products')
                },
                onError: (error) => {
                    toast.error(error.response.data.message)
                }
            })
        }
    })

    return (
        <Box>
            <p style={{ color: 'f3f3f3', marginLeft: '20px', fontSize: '24px' }}>Thêm sản phẩm</p>
            <Box onSubmit={onSubmit} component='form' sx={{ backgroundColor: '#fff', pb: 8, px: { xs: 1, md: 4 } }}>
                <Grid container spacing={5}>
                    <Grid item md={6} xs={12}>
                        <Box>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Tên sản phẩm
                            </Typography>
                            <Input name='name' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                SKU
                            </Typography>
                            <Input name='sku' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Giá tiền
                            </Typography>
                            <Input
                                type='number'
                                name='price'
                                register={register}
                                errors={errors}
                                fullWidth
                                size='small'
                            />
                        </Box>
                        <FormControl sx={{ mt: 2 }} fullWidth error={!!errors['categoryId']}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Danh mục
                            </Typography>
                            <Select
                                {...register('categoryId')}
                                style={{ height: '40px' }}
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={selectedCategory}
                                size='small'
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories &&
                                    categories.data.result.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                            {errors['categoryId'] && <FormHelperText>{errors['categoryId'].message}</FormHelperText>}
                        </FormControl>
                        <FormControl sx={{ mt: 2 }} fullWidth error={!!errors['brandId']}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Thương hiệu
                            </Typography>
                            <Select
                                {...register('brandId')}
                                style={{ height: '40px' }}
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={selectedBrand}
                                size='small'
                                onChange={(e) => setSelectedBrand(e.target.value)}
                            >
                                {brands &&
                                    brands.data.result.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                            {errors['brandId'] && <FormHelperText>{errors['brandId'].message}</FormHelperText>}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <Typography
                                onClick={() => setOpenEditor(!openEditor)}
                                sx={{ fontSize: '15px', color: '#3917b4cc', mb: '5px', cursor: 'pointer' }}
                                component='p'
                            >
                                Mô tả sản phẩm
                            </Typography>
                            {openEditor && (
                                <Editor
                                    value={description}
                                    onTextChange={(e) => setDescription(e.htmlValue)}
                                    style={{ height: '200px' }}
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Box>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Kích thước
                            </Typography>
                            <Chips value={sizes} onChange={(e) => setSizes(e.value)} />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Màu sắc
                            </Typography>
                            <Chips value={colors} onChange={(e) => setColor(e.value)} />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Hỉnh ảnh
                            </Typography>
                            <div>
                                <Upload onSelectedFiles={handleOnSelectedFiles} id='upload-product' />
                            </div>
                        </Box>
                    </Grid>
                </Grid>
                <Button type='submit' sx={{ width: '200px', mt: 2 }} variant='contained'>
                    Thêm sản phẩm
                </Button>
            </Box>
        </Box>
    )
}
