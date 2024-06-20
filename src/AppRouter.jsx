import { useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import CreateProduct from './pages/CreateProduct'
import AdminLayout from './layouts/AdminLayout'

export default function AppRouter() {
    return useRoutes([
        {
            path: '/admin/products',
            element: (
                <AdminLayout>
                    <ProductList />
                </AdminLayout>
            )
        },
        {
            path: '/admin/products/create',
            element: (
                <AdminLayout>
                    <CreateProduct />
                </AdminLayout>
            )
        }
    ])
}
