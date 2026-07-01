import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/pages.css'

function ContestDetail() {
  const { id } = useParams()
  const [contest, setContest] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`http://15.206.163.176:5000/api/contests/${id}`)
        setContest(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchContest()
  }, [id])

  if (!contest) return <div className="page-container"><p>Loading...</p></div>

  const diffClass = (d) => d === 'Easy' ? 'badge-easy' : d === 'Medium' ? 'badge-medium' : 'badge-hard'

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="page-title">{contest.title}</h2>
      <p style={{ color: '#888', marginBottom: '8px' }}>{contest.description}</p>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>
        {new Date(contest.startTime).toLocaleString()} — {new Date(contest.endTime).toLocaleString()}
      </p>
      <hr />
      <h3 style={{ margin: '20px 0 12px' }}>Problems</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {contest.problems.map((p) => (
            <tr key={p._id} onClick={() => navigate(`/problems/${p._id}`)} style={{ cursor: 'pointer' }}>
              <td>{p.title}</td>
              <td><span className={diffClass(p.difficulty)}>{p.difficulty}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button className="btn-primary" onClick={() => navigate(`/leaderboard/${contest._id}`)}>
        View Leaderboard
      </button>
    </div>
  )
}

export default ContestDetail