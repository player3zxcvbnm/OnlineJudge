import { useNavigate } from 'react-router-dom'
import '../styles/navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand" onClick={() => navigate('/problems')}>OnlineJudge</span>
      <div className="navbar-links">
        <span className="nav-link" onClick={() => navigate('/problems')}>Problems</span>
        <span className="nav-link" onClick={() => navigate('/contests')}>Contests</span>
        <span className="nav-link" onClick={() => navigate('/profile')}>Profile</span>
        <span className="nav-logout" onClick={logout}>Logout</span>
      </div>
    </nav>
  )
}

export default Navbar