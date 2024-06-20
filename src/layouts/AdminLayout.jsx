import { Box } from '@mui/material'
import Asidebar from '../components/Siidebar'
import Header from '../components/Header'

export default function AdminLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%'
            }}
        >
            <div style={{ width: '18%', borderRight: '1px dashed #a09898', height: '100vh' }}>
                <Asidebar />
            </div>
            <div style={{ width: '82%' }}>
                <Header />
                {children}
            </div>
        </Box>
    )
}
