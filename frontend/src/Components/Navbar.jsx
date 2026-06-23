import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={{ padding: '10px 30px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span onClick={() => navigate('/problems')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: 'white' }}>OnlineJudge</span>
      <div style={{ display: 'flex', gap: '20px' }}>
        <span onClick={() => navigate('/problems')} style={{ cursor: 'pointer', color: 'white' }}>Problems</span>
        <span onClick={() => navigate('/leaderboard')} style={{ cursor: 'pointer', color: 'white' }}>Leaderboard</span>
        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', color: 'white' }}>Profile</span>
        <span onClick={logout} style={{ cursor: 'pointer', color: 'red' }}>Logout</span>
      </div>
    </nav>
  )
}

export default Navbar