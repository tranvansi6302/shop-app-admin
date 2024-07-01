import http from '../utils/http'

const categoryApi = {
    getAllCategories: () => http.get('/categories'),
    createCategory: (category) => http.post('/categories', category),
    deleteCategory: (id) => http.delete(`/categories/${id}`),
    editCategory: (id, category) => http.put(`/categories/${id}`, category)

}

export default categoryApi
