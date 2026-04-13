import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CustomCursor } from './components/cursor/CustomCursor'
import { PageLoader } from './components/loader/PageLoader'
import { LoaderProvider } from './context/LoaderContext'
import { ThemeProvider } from './context/ThemeContext'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <BrowserRouter>
          <CustomCursor />
          <PageLoader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </BrowserRouter>
      </LoaderProvider>
    </ThemeProvider>
  )
}
