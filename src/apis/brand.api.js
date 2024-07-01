import http from '../utils/http'

const brandApi = {
    getAllBrands: () => http.get('/brands'),
    createBrand: (brand) => http.post('/brands', brand),
    deleteBrand: (id) => http.delete(`/brands/${id}`),
    editBrand: (id, brand) => http.put(`/brands/${id}`, brand)
}

export default brandApi
