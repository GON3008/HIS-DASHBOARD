import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Patients from './pages/Patients'
import Departments from './pages/Departments'
import Reports from './pages/Reports'
import TestAPI from './pages/TestAPI'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public route - Login */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes - Cần đăng nhập */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/overview" replace />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/departments" element={<Departments />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/test-api" element={<TestAPI />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App


