import { Box } from '@mui/material'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'

import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import { Link } from 'react-router-dom'

export default function Asidebar() {
    return (
        <List
            sx={{ width: '100%', maxWidth: 360 }}
            component='nav'
            aria-labelledby='nested-list-subheader'
            subheader={
                <ListSubheader sx={{ fontSize: '30px', fontWeight: 'bold' }} component='div' id='nested-list-subheader'>
                    Admin
                </ListSubheader>
            }
        >
            <Box sx={{ mt: 2 }}>
                <ListItemButton>
                    <Link style={{ textDecoration: 'none' }} to='/admin/products'>
                        <ListItemText primary='Quản lý sản phẩm' />
                    </Link>
                </ListItemButton>
            </Box>
        </List>
    )
}
