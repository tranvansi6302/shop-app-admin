import http from '../utils/http'

const productApi = {
    createProduct: (data) => http.post('/products', data),

    getAllProducts: () => http.get('/products'),
    uploadImage: (payload) =>
        http.patch(`/products/${payload.id}/uploads`, payload.formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
}

export default productApi
