import { useEffect, useState } from 'react'
import axios from 'axios'

function Profile() {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const userRes = await axios.get('http://localhost:5000/api/auth/profile', { headers })
        setUser(userRes.data)

        const subRes = await axios.get(`http://localhost:5000/api/submissions/user/${userRes.data._id}`, { headers })
        setSubmissions(subRes.data)

        const statsRes = await axios.get(`http://localhost:5000/api/auth/stats/${userRes.data._id}`, { headers })
        setStats(statsRes.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  if (!user) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {stats && (
        <>
          <hr />
          <h3>Stats</h3>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalSolved}</p>
              <p style={{ margin: 0, color: '#888' }}>Problems Solved</p>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalSubmissions}</p>
              <p style={{ margin: 0, color: '#888' }}>Total Submissions</p>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.acceptanceRate}%</p>
              <p style={{ margin: 0, color: '#888' }}>Acceptance Rate</p>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.contestsParticipated}</p>
              <p style={{ margin: 0, color: '#888' }}>Contests Participated</p>
            </div>
          </div>
          <p>
            <span style={{ color: 'green' }}>Easy: {stats.difficultyBreakdown.Easy}</span> |{' '}
            <span style={{ color: 'orange' }}>Medium: {stats.difficultyBreakdown.Medium}</span> |{' '}
            <span style={{ color: 'red' }}>Hard: {stats.difficultyBreakdown.Hard}</span>
          </p>
        </>
      )}

      <hr />
      <h3>Submission History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Problem</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Language</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Verdict</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub._id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{sub.problemId?.title || 'Unknown'}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{sub.language}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee', color: sub.verdict === 'AC' ? 'green' : 'red' }}>{sub.verdict}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(sub.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Profile