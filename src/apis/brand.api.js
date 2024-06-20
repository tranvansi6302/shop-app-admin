import http from '../utils/http'

const brandApi = {
    getAllBrands: () => http.get('/brands')
}

export default brandApi
