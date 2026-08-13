import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Hub from './pages/Hub'
import Triage from './pages/Triage'
import History from './pages/History'
import Profile from './pages/Profile'
import Medications from './pages/Medications'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Hub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/triagem"
          element={
            <ProtectedRoute>
              <Triage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicamentos"
          element={
            <ProtectedRoute>
              <Medications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}
