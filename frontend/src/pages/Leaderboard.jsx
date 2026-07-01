import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/pages.css'

function Leaderboard() {
  const { contestId } = useParams()
  const [rankings, setRankings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`http://15.206.163.176:5000/api/leaderboard/${contestId}`)
        setRankings(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchLeaderboard()
  }, [contestId])

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="page-title">Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Solved</th>
            <th>Last AC</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user, index) => (
            <tr key={user._id}>
              <td style={{ color: index === 0 ? '#f0c040' : '#888', fontWeight: index === 0 ? '600' : '400' }}>#{index + 1}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td style={{ color: '#4c9be8', fontWeight: '600' }}>{user.solvedCount}</td>
              <td style={{ color: '#666', fontSize: '13px' }}>{new Date(user.lastSolveTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Leaderboard