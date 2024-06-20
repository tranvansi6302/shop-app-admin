import * as React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import AppRouter from './AppRouter'
import { ToastContainer } from 'react-toastify'
export default function App() {
    const appRouter = AppRouter()
    return (
        <React.Fragment>
            {appRouter}
            <ToastContainer autoClose='1000' />
        </React.Fragment>
    )
}
