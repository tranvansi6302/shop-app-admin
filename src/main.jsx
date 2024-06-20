import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primeicons/primeicons.css'
import { BrowserRouter } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // Tránh cố gắng gọi lại nhiều lần khi token hết hạn
            retry: 0
        }
    }
})
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <PrimeReactProvider>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </PrimeReactProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
)
