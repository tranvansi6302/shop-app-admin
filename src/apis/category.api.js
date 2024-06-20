import http from '../utils/http'

const categoryApi = {
    getAllCategories: () => http.get('/categories')
}

export default categoryApi
