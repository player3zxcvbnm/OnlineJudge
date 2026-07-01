import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import ProtectedRoute from './Components/ProtectedRoute'
import Contests from './pages/Contests'
import ContestDetail from './pages/ContestDetail'

function Layout() {
  const location = useLocation()
  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
        <Route path="/problems/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard/:contestId" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/contests" element={<ProtectedRoute><Contests /></ProtectedRoute>} />
        <Route path="/contests/:id" element={<ProtectedRoute><ContestDetail /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App