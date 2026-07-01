import { API_BASE } from '../api/config'
import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/pages.css'

function Profile() {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const userRes = await axios.get(API_BASE + '/api/auth/profile', { headers })
        setUser(userRes.data)
        const subRes = await axios.get(`${API_BASE}/api/submissions/user/${userRes.data._id}`, { headers })
        setSubmissions(subRes.data)
        const statsRes = await axios.get(`${API_BASE}/api/auth/stats/${userRes.data._id}`, { headers })
        setStats(statsRes.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  if (!user) return <div className="page-container"><p>Loading...</p></div>

  return (
    <div className="page-container">
      <div className="card">
        <h2 style={{ marginBottom: '4px' }}>{user.firstName} {user.lastName}</h2>
        <p style={{ color: '#666', fontSize: '13px' }}>{user.email} · {user.role}</p>
      </div>

      {stats && (
        <>
          <h3 style={{ marginBottom: '16px' }}>Stats</h3>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalSolved}</div>
              <div className="stat-label">Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalSubmissions}</div>
              <div className="stat-label">Submissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.acceptanceRate}%</div>
              <div className="stat-label">Acceptance</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.contestsParticipated}</div>
              <div className="stat-label">Contests</div>
            </div>
          </div>
          <p style={{ marginBottom: '24px', fontSize: '13px' }}>
            <span className="badge-easy">Easy: {stats.difficultyBreakdown.Easy}</span>
            {' · '}
            <span className="badge-medium">Medium: {stats.difficultyBreakdown.Medium}</span>
            {' · '}
            <span className="badge-hard">Hard: {stats.difficultyBreakdown.Hard}</span>
          </p>
        </>
      )}

      <h3 style={{ marginBottom: '16px' }}>Submission History</h3>
      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Language</th>
            <th>Verdict</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.problemId?.title || 'Unknown'}</td>
              <td style={{ color: '#888', fontSize: '13px' }}>{sub.language}</td>
              <td><span className={sub.verdict === 'AC' ? 'badge-ac' : sub.verdict === 'PENDING' ? 'badge-pending' : 'badge-fail'}>{sub.verdict}</span></td>
              <td style={{ color: '#666', fontSize: '13px' }}>{new Date(sub.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Profile


