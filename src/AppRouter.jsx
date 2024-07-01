import { useRoutes } from 'react-router-dom'
import ProductList from './pages/Product/ProductList'
import CreateProduct from './pages/Product/CreateProduct'
import CategoryList from './pages/Category/CategoryList'
import AdminLayout from './layouts/AdminLayout'
import BrandList from './pages/Brand/BrandList'
export default function AppRouter() {
    return useRoutes([
        {
            path: '/admin/brands',
            element: (
                <AdminLayout>
                    <BrandList />
                </AdminLayout>
            )
        },
        {
            path: '/admin/categories',
            element: (
                <AdminLayout>
                    <CategoryList />
                </AdminLayout>
            )
        },

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
