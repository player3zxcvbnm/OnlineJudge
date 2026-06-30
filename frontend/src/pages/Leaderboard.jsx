import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Leaderboard() {
  const { contestId } = useParams()
  const [rankings, setRankings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leaderboard/${contestId}`)
        setRankings(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchLeaderboard()
  }, [contestId])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '6px 14px', cursor: 'pointer' }}>← Back</button>
      <h2>Leaderboard</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Rank</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>User</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Solved</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Last AC</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user, index) => (
            <tr key={user._id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>#{index + 1}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{user.firstName} {user.lastName}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{user.solvedCount}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(user.lastSolveTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Leaderboard